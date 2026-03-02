#!/usr/bin/env node

/**
 * Script to convert Prisma references to MySQL db references
 * Run this to automatically update route files
 */

const fs = require('fs');
const path = require('path');

const replacements = [
  // Model name conversions
  { from: /prisma\.user\./g, to: 'db.users.' },
  { from: /prisma\.eventsContent\./g, to: 'db.eventsContent.' },
  { from: /prisma\.blog\./g, to: 'db.blogs.' },
  { from: /prisma\.gallery\./g, to: 'db.gallery.' },
  { from: /prisma\.homePageContent\./g, to: 'db.homepageContent.' },
  { from: /prisma\.aboutContent\./g, to: 'db.aboutContent.' },
  { from: /prisma\.contactContent\./g, to: 'db.contactContent.' },
  { from: /prisma\.admissionApplication\./g, to: 'db.admissionApplications.' },
  { from: /prisma\.contactSubmission\./g, to: 'db.contactSubmissions.' },
  { from: /prisma\.generalSetting\./g, to: 'db.generalSettings.' },
  { from: /prisma\.alumni\./g, to: 'db.alumni.' },
  { from: /prisma\.nebTopper\./g, to: 'db.nebToppers.' },
  { from: /prisma\.passwordResetToken\./g, to: 'db.passwordResetTokens.' },
];

const apiReplacements = [
  // API method conversions for simple cases
  {
    from: /(\w+)\s*=\s*await\s+db\.(\w+)\.findUnique\(\{\s*where:\s*\{\s*id:\s*(\w+)\s*\}\s*\}\)/g,
    to: '$1 = await db.$2.findUnique({ where: { id: $3 } })'
  },
];

const routesDir = path.join(__dirname, '..', 'routes');
const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.js'));

console.log('🔄 Converting Prisma references to MySQL...\n');

files.forEach(file => {
  const filePath = path.join(routesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;

  // Apply model name replacements
  replacements.forEach(({ from, to }) => {
    const matches = content.match(from);
    if (matches) {
      changes += matches.length;
      content = content.replace(from, to);
    }
  });

  if (changes > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${file}: ${changes} replacements made`);
  } else {
    console.log(`⏭️  ${file}: No changes needed`);
  }
});

console.log('\n✨ Conversion complete!');
console.log('\n⚠️  Note: Some manual adjustments may still be needed for:');
console.log('   - groupBy operations (use raw SQL)');
console.log('   - Complex where clauses');
console.log('   - count() operations without parameters');

