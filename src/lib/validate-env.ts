/**
 * Environmental Variable Validator
 * Ensures that the application doesn't start in production with missing secrets.
 */

export function validateEnv() {
  const required = [
    'DATABASE_URL',
    'JWT_SECRET',
    'EMAIL_USER',
    'EMAIL_PASSWORD',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ];

  const missing = required.filter((key) => !process.env[key] || process.env[key]?.includes('your_') || process.env[key]?.includes('replace-in-prod'));

  if (missing.length > 0 && process.env.NODE_ENV === 'production') {
    console.error('\x1b[31m%s\x1b[0m', 'CRITICAL ERROR: Missing or placeholder environment variables for production:');
    missing.forEach((m) => console.error(` - ${m}`));
    process.exit(1);
  } else if (missing.length > 0) {
    console.warn('\x1b[33m%s\x1b[0m', 'WARNING: Using placeholder or missing environment variables. This is fine for development but will crash in production:');
    missing.forEach((m) => console.warn(` - ${m}`));
  } else {
    console.log('\x1b[32m%s\x1b[0m', '✅ All environment variables validated.');
  }
}
