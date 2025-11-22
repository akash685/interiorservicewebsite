/**
 * Environment Variable Validation Utility
 * Ensures all required environment variables are present
 */

function getEnvVar(key, required = true) {
  const value = process.env[key];
  
  if (required && !value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
      `Please add it to your .env.local file.`
    );
  }
  
  return value || '';
}

// Validate and export all environment variables
export const env = {
  // Database
  MONGODB_URI: getEnvVar('MONGODB_URI'),
  
  // Authentication
  JWT_SECRET: getEnvVar('JWT_SECRET'),
  ADMIN_USERNAME: getEnvVar('ADMIN_USERNAME'),
  ADMIN_PASSWORD: getEnvVar('ADMIN_PASSWORD'),
  
  // Optional - Public variables
  NEXT_PUBLIC_BASE_URL: getEnvVar('NEXT_PUBLIC_BASE_URL', false),
  NODE_ENV: getEnvVar('NODE_ENV', false) || 'development',
};

// Validate on import (server-side only)
if (typeof window === 'undefined') {
  console.log('✅ Environment variables validated successfully');
}

export default env;
