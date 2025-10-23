/**
 * Password Hash Generator Script
 *
 * Generates a bcrypt hash for the admin password
 * Usage: npx ts-node scripts/generate-password-hash.ts <password>
 * Or: npm run generate-password <password>
 */

import * as crypto from 'crypto';

// Simple bcrypt-like hash using Node's built-in crypto
// For production, consider using the 'bcryptjs' package
function generateHash(password: string, rounds = 10): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, Math.pow(2, rounds), 64, 'sha512').toString('hex');
  return `$pbkdf2$${rounds}$${salt}$${hash}`;
}

function verifyHash(password: string, hash: string): boolean {
  const parts = hash.split('$');
  if (parts.length !== 4 || parts[0] !== '' || parts[1] !== 'pbkdf2') {
    return false;
  }

  const rounds = parseInt(parts[2], 10);
  const salt = parts[3].slice(0, 32);
  const originalHash = parts[3].slice(32);

  const verifyHash = crypto.pbkdf2Sync(password, salt, Math.pow(2, rounds), 64, 'sha512').toString('hex');
  return verifyHash === originalHash;
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('❌ Error: Password argument is required');
  console.log('\nUsage:');
  console.log('  npx ts-node scripts/generate-password-hash.ts <password>');
  console.log('  npm run generate-password <password>');
  console.log('\nExample:');
  console.log('  npx ts-node scripts/generate-password-hash.ts MySecurePassword123');
  process.exit(1);
}

const password = args[0];

// Validate password strength
if (password.length < 8) {
  console.warn('⚠️  Warning: Password is less than 8 characters. Consider using a stronger password.');
}

if (!/[A-Z]/.test(password)) {
  console.warn('⚠️  Warning: Password should contain at least one uppercase letter.');
}

if (!/[a-z]/.test(password)) {
  console.warn('⚠️  Warning: Password should contain at least one lowercase letter.');
}

if (!/[0-9]/.test(password)) {
  console.warn('⚠️  Warning: Password should contain at least one number.');
}

// Generate hash
console.log('\n🔐 Generating password hash...\n');
const hash = generateHash(password);

console.log('✅ Password hash generated successfully!\n');
console.log('Copy the following line to your .env.local file:\n');
console.log(`VITE_ADMIN_PASSWORD_HASH="${hash}"`);
console.log('\n---\n');

// Verify the hash works
const verified = verifyHash(password, hash);
console.log(`Verification test: ${verified ? '✅ PASS' : '❌ FAIL'}`);

if (!verified) {
  console.error('❌ Error: Hash verification failed. Please try again.');
  process.exit(1);
}

console.log('\n📝 Next steps:');
console.log('1. Create a .env.local file in the project root (if it doesn\'t exist)');
console.log('2. Add the VITE_ADMIN_PASSWORD_HASH line above to the file');
console.log('3. Never commit .env.local to version control');
console.log('4. For production deployment, add the hash to your hosting provider\'s environment variables');
console.log('\n✨ Done!\n');
