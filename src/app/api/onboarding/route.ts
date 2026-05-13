import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/jwt';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(file: File, folder: string, resourceType: "image" | "raw" = "auto"): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Failed to upload file to Cloudinary"));
        } else {
          resolve(result.secure_url);
        }
      }
    );
    uploadStream.end(buffer);
  });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const email = (formData.get('email') as string)?.toLowerCase().trim();
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const college = formData.get('college') as string;
    const department = formData.get('department') as string;
    const linkedin = formData.get('linkedin') as string;
    const domain = formData.get('domain') as string;
    
    if (!email || !name) {
      return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
    }

    const session = await getSession();
    let userId = session?.id;

    // If no session, find or create the user by email
    if (!userId) {
      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name,
            role: 'INTERN',
            status: 'PENDING',
          }
        });
      }
      userId = user.id;
    }

    const resumeFile = formData.get('resume') as File | null;
    const imageFile = formData.get('image') as File | null;

    let resumeUrl = "";
    let profileImageUrl = "";

    const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== "your_cloud_name";

    if (hasCloudinary) {
      if (resumeFile) {
        resumeUrl = await uploadToCloudinary(resumeFile, 'tarcin/resumes', 'raw');
      }
      if (imageFile) {
        profileImageUrl = await uploadToCloudinary(imageFile, 'tarcin/profiles', 'image');
      }
    } else {
      console.log("No Cloudinary config found, using mock URLs.");
      resumeUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
      profileImageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0284c7&color=fff&size=200`;
    }

    // Update the User name if it changed
    await prisma.user.update({
      where: { id: userId },
      data: { name },
    });

    // Handle Profile
    const skillsRaw = formData.get('skills') as string || "";
    const skills = skillsRaw.split(',').map(s => s.trim()).filter(s => s !== "");

    if (existingProfile) {
      await prisma.internProfile.update({
        where: { userId },
        data: {
          phone, college, department, linkedin, preferredDomain: domain,
          skills,
          ...(resumeUrl && { resumeUrl }),
          ...(profileImageUrl && { profileImageUrl })
        }
      });
    } else {
      await prisma.internProfile.create({
        data: {
          userId,
          phone,
          college,
          department,
          linkedin,
          preferredDomain: domain,
          resumeUrl,
          profileImageUrl,
          skills, 
        },
      });
    }

    return NextResponse.json({ success: true, redirectUrl: '/under-review' });

  } catch (error) {
    console.error('Error in onboarding:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}
