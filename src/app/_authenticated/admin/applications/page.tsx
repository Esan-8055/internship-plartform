import { Eye, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/lib/notifications";
import { sendEmail } from "@/lib/mail";
import { ApplicationDetailsDialog } from "./components/ApplicationDetailsDialog";


export default async function AdminApplicationsPage() {
  const pendingApps = await prisma.user.findMany({
    where: { role: "INTERN", status: "PENDING" },
    include: { internProfile: true },
    orderBy: { createdAt: "desc" }
  });

  async function handleAction(formData: FormData) {
    "use server";
    const userId = formData.get("userId") as string;
    const action = formData.get("action") as string;

    if (!userId || userId.length < 5) return;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { internProfile: true }
      });

      if (!user) return;

      if (action === "approve") {
        await prisma.user.update({
          where: { id: userId },
          data: { status: "APPROVED" }
        });

        // Send Congratulations Email
        await sendEmail({
          to: user.email,
          subject: "🚀 Welcome to TARCIN! Your Internship is Approved",
          html: `
            <!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"></head>
            <body style="margin:0;padding:0;background-color:#f4f7fa;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
              <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 10px;">
                <tr>
                  <td align="center">
                    <!-- High-Fidelity Selection Poster -->
                    <table width="100%" style="max-width:600px;background-color:#ffffff;border-radius:0;overflow:hidden;box-shadow:0 30px 60px rgba(0,0,0,0.12);border: 1px solid #e2e8f0;">
                      <!-- Top Decorative Bar -->
                      <tr><td style="height:8px;background:linear-gradient(90deg, #1e40af, #3b82f6, #1e40af);"></td></tr>
                      
                      <!-- Header with Logo -->
                      <tr>
                        <td style="padding:40px 40px 20px;text-align:center;">
                          <div style="display:inline-block;margin-bottom:10px;">
                             <span style="font-size:32px;font-weight:900;color:#1e40af;letter-spacing:4px;font-family:Arial, sans-serif;">TARCIN</span>
                          </div>
                          <div style="font-size:10px;font-weight:bold;color:#64748b;letter-spacing:4px;text-transform:uppercase;">Future Starts Here</div>
                        </td>
                      </tr>

                      <!-- Selection Title -->
                      <tr>
                        <td style="padding:0 40px 40px;text-align:center;">
                          <div style="font-size:18px;font-weight:600;color:#3b82f6;font-style:italic;margin-bottom:10px;">Congratulations!</div>
                          <h1 style="font-size:48px;font-weight:900;color:#1e3a8a;margin:0;line-height:1;letter-spacing:-1px;">INTERNSHIP<br/><span style="color:#2563eb;">APPROVED</span></h1>
                        </td>
                      </tr>

                      <!-- Profile Section -->
                      <tr>
                        <td style="padding:0 40px 40px;text-align:center;">
                          <table width="100%">
                            <tr>
                              <td align="center" width="45%" style="padding-right:20px;">
                                <!-- Circular Profile Frame -->
                                <div style="width:180px;height:180px;border-radius:90px;padding:8px;background:linear-gradient(135deg, #3b82f6, #93c5fd);display:inline-block;">
                                  <img src="${user.internProfile?.profileImageUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=0284c7&color=fff&size=200'}" 
                                       style="width:180px;height:180px;border-radius:90px;object-fit:cover;border:4px solid #ffffff;" 
                                       alt="Intern Profile" />
                                </div>
                              </td>
                              <td align="left" width="55%" style="vertical-align:middle;">
                                <div style="font-size:12px;font-weight:bold;color:#3b82f6;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Proudly Presented to</div>
                                <div style="font-size:28px;font-weight:900;color:#1e293b;margin-bottom:12px;line-height:1.2;">${user.name.toUpperCase()}</div>
                                <div style="background-color:#1e40af;color:#ffffff;display:inline-block;padding:6px 16px;border-radius:4px;font-size:12px;font-weight:bold;text-transform:uppercase;">
                                  ${user.internProfile?.preferredDomain || 'General Intern'}
                                </div>
                                
                                <table width="100%" style="margin-top:20px;">
                                  <tr>
                                    <td style="padding-bottom:10px;">
                                      <div style="font-size:10px;font-weight:bold;color:#94a3b8;text-transform:uppercase;">Duration</div>
                                      <div style="font-size:13px;font-weight:bold;color:#334155;">3 MONTHS</div>
                                    </td>
                                    <td style="padding-bottom:10px;">
                                      <div style="font-size:10px;font-weight:bold;color:#94a3b8;text-transform:uppercase;">Start Date</div>
                                      <div style="font-size:13px;font-weight:bold;color:#334155;">20 MAY 2025</div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <div style="font-size:10px;font-weight:bold;color:#94a3b8;text-transform:uppercase;">Department</div>
                                      <div style="font-size:13px;font-weight:bold;color:#334155;">RESEARCH & DEV</div>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- Approval Seal Section -->
                      <tr>
                        <td style="background-color:#0f172a;padding:40px;position:relative;">
                          <table width="100%">
                            <tr>
                              <td width="65%" style="color:#ffffff;">
                                <p style="margin:0;font-size:13px;line-height:1.6;color:#94a3b8;">
                                  We are excited to welcome you to the <span style="color:#3b82f6;font-weight:bold;">TARCIN</span> family. Your skills and passion will be the perfect addition to our mission of building the future through innovation.
                                </p>
                              </td>
                              <td width="35%" align="right">
                                <!-- Officially Approved Badge -->
                                <div style="text-align:center;">
                                  <div style="background-color:#2563eb;color:#ffffff;padding:15px;border-radius:100px;width:80px;height:80px;display:inline-block;border:4px double #ffffff;">
                                    <div style="font-size:8px;font-weight:bold;margin-top:5px;">OFFICIALLY</div>
                                    <div style="font-size:12px;font-weight:900;">APPROVED</div>
                                    <div style="font-size:10px;">★★★</div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- Bottom Info -->
                      <tr>
                        <td style="padding:30px 40px;background-color:#f8fafc;border-top:1px solid #e2e8f0;">
                          <table width="100%">
                            <tr>
                              <td>
                                <div style="font-size:10px;font-weight:bold;color:#94a3b8;text-transform:uppercase;">Offer ID</div>
                                <div style="font-size:12px;font-weight:bold;color:#334155;">TARCIN/INT/2025/${user.id.slice(-4).toUpperCase()}</div>
                              </td>
                              <td align="right">
                                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" 
                                   style="background-color:#2563eb;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px;display:inline-block;">
                                   Login to Portal
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      
                      <!-- Tagline -->
                      <tr>
                        <td style="background-color:#2563eb;padding:10px;text-align:center;color:#ffffff;font-size:10px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">
                          Innovate • Learn • Grow • Succeed
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `,
        });

        await createNotification({
          userId,
          title: "Application Approved",
          message: "Congratulations! Your internship application has been approved. You can now access your dashboard.",
          type: "SUCCESS"
        });
      } else if (action === "reject") {
        await prisma.user.update({
          where: { id: userId },
          data: { status: "REJECTED" }
        });
        await createNotification({
          userId,
          title: "Application Status",
          message: "We regret to inform you that your application has been rejected at this time.",
          type: "ERROR"
        });
      }
      revalidatePath("/admin/applications");
    } catch (err) {
      console.error("Action failed:", err);
    }
  }

  // Only show real data
  const displayApps = pendingApps.map(app => ({
    id: app.id,
    name: app.name,
    email: app.email,
    initials: app.name.split(" ").map(n => n[0]).join("").toUpperCase(),
    domain: app.internProfile?.preferredDomain || "General",
    university: app.internProfile?.college || "University",
    department: app.internProfile?.department || "",
    phone: app.internProfile?.phone || "",
    skills: app.internProfile?.skills || [],
    skillsString: app.internProfile?.skills?.join(", ") || "No skills listed",
    linkedin: app.internProfile?.linkedin || undefined,
    resumeUrl: app.internProfile?.resumeUrl || undefined,
    profileImageUrl: app.internProfile?.profileImageUrl || undefined,
    createdAt: app.createdAt.toISOString()
  }));

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Applications</h1>
        <p className="text-slate-500">Review and approve new interns.</p>
      </div>

      <div className="space-y-4">
        {displayApps.map((app) => (
          <div key={app.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-full bg-[#026ae6] flex items-center justify-center text-white text-xl font-bold shadow-md shadow-blue-100">
                {app.initials}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-slate-900">{app.name}</h3>
                  <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    {app.domain}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-500 mb-2">{app.university}</p>
                <p className="text-xs text-slate-400 font-medium">
                  Skills: <span className="text-slate-600">{app.skillsString}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ApplicationDetailsDialog app={app} />
              {app.id.length > 5 && (
                <form action={handleAction}>
                  <input type="hidden" name="userId" value={app.id} />
                  <div className="flex items-center gap-3">
                    <Button 
                      type="submit" 
                      name="action" 
                      value="reject" 
                      variant="outline" 
                      size="sm" 
                      className="h-10 rounded-xl px-4 font-bold text-red-600 border-red-100 bg-red-50 hover:bg-red-100 hover:border-red-200"
                    >
                      <X className="mr-2 h-4 w-4" /> Reject
                    </Button>
                    <Button 
                      type="submit" 
                      name="action" 
                      value="approve" 
                      size="sm" 
                      className="h-10 rounded-xl px-4 font-bold bg-[#10b981] hover:bg-[#059669] text-white shadow-sm"
                    >
                      <Check className="mr-2 h-4 w-4" /> Approve
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
