#!/usr/bin/env node

/**
 * Deployment Preparation Script - Production Ready
 * 
 * This script prepares your project for production deployment by:
 * 1. Creating a clean copy of the project
 * 2. Removing development files and sensitive data
 * 3. Creating a deployment package with all necessary files
 * 4. Validating project structure and dependencies
 * 5. Generating production-ready environment template
 * 
 * Usage: node prepare-for-deployment.js
 * 
 * Compatible with:
 * - cPanel Node.js hosting
 * - Railway
 * - Heroku
 * - Any Node.js hosting platform
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
};

const log = {
    success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
    section: (msg) => console.log(`\n${colors.cyan}${'='.repeat(60)}\n${msg}\n${'='.repeat(60)}${colors.reset}`),
    step: (msg) => console.log(`${colors.magenta}▶ ${msg}${colors.reset}`),
};

// Files and directories to exclude from deployment (improved pattern matching)
const excludePatterns = [
    'node_modules',
    '.git(\/|$)',
    '.env$',
    '.env.local',
    '.env.development',
    '.env.test',
    '^logs(\/|$)',
    '^uploads(\/|$)',
    '\.log$',
    'coverage(\/|$)',
    '.vscode(\/|$)',
    '.idea(\/|$)',
    '.vs(\/|$)',
    '^deploy(\/|$)',
    'deployment-package.zip',
    '\.bak$',
    '\.tmp$',
    '^tmp(\/|$)',
    '^temp(\/|$)',
    '\.DS_Store$',
    'Thumbs\.db$',
    'desktop\.ini$',
    'npm-debug\.log',
    'yarn-debug\.log',
    'yarn-error\.log',
    '\.db$',
    '\.db-journal$',
    '\.UserPrefs$',
    '\.swp$',
    '\.swo$',
    '~$',
    '^\.cache(\/|$)',
    '^dist(\/|$)',
    '^build(\/|$)',
    '^\.next(\/|$)',
    '^\.nuxt(\/|$)',
    'test-results(\/|$)',
    'playwright-report(\/|$)',
];

// Files that MUST be included (verified after copy)
const mustInclude = [
    'package.json',
    'package-lock.json',
    'server.js',
    'schema.sql',
    'env.example',
    'config/',
    'middleware/',
    'routes/',
    'utils/',
    'public/',
    'scripts/',
    'scripts/seed.js',
];

// Optional but recommended files to include
const recommendedInclude = [
    'README.md',
    'nixpacks.toml',
    'DEPLOYMENT_GUIDES_INDEX.md',
    'CPANEL_DEPLOYMENT_GUIDE.md',
    'DEPLOYMENT_CHECKLIST.md',
    'QUICK_DEPLOYMENT_REFERENCE.md',
];

function printHeader() {
    console.log(`\n${colors.cyan}╔════════════════════════════════════════════════════════╗`);
    console.log(`║                                                        ║`);
    console.log(`║        Deployment Preparation Script                  ║`);
    console.log(`║        Gyan Jyoti School Website                      ║`);
    console.log(`║        Production Ready - v1.0                        ║`);
    console.log(`║                                                        ║`);
    console.log(`╚════════════════════════════════════════════════════════╝${colors.reset}\n`);
}

function checkNodeVersion() {
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 16) {
        log.error(`Node.js version ${nodeVersion} is not supported. Please use Node.js 16.0.0 or higher.`);
        process.exit(1);
    }
    
    log.success(`Node.js version: ${nodeVersion} ✓`);
}

function checkPrerequisites() {
    log.section('🔍 Checking Prerequisites');

    // Check Node.js version
    checkNodeVersion();

    // Check if package.json exists
    if (!fs.existsSync('package.json')) {
        log.error('package.json not found. Are you in the project root directory?');
        process.exit(1);
    }
    log.success('package.json found');

    // Read package.json for validation
    let packageJson;
    try {
        packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        log.success('package.json is valid JSON');
        
        // Check for required fields
        if (!packageJson.name || !packageJson.version || !packageJson.main) {
            log.warning('package.json is missing some recommended fields');
        }
    } catch (error) {
        log.error('Failed to parse package.json');
        process.exit(1);
    }

    // Check if required directories exist
    const requiredDirs = ['config', 'middleware', 'routes', 'public', 'scripts'];
    const missingDirs = [];
    
    for (const dir of requiredDirs) {
        if (!fs.existsSync(dir)) {
            missingDirs.push(dir);
        }
    }
    
    if (missingDirs.length > 0) {
        log.error(`Required directories not found: ${missingDirs.join(', ')}`);
        process.exit(1);
    }
    log.success('All required directories found');

    // Check for server.js
    if (!fs.existsSync('server.js')) {
        log.error('server.js not found. This is required as the entry point.');
        process.exit(1);
    }
    log.success('server.js found');

    // Check for schema.sql
    if (!fs.existsSync('schema.sql')) {
        log.warning('schema.sql not found. Database schema will need to be created manually.');
    } else {
        log.success('schema.sql found');
    }
}

function createDeploymentDirectory() {
    log.section('📁 Creating Deployment Directory');

    const deployDir = path.join(process.cwd(), 'deploy');
    
    // Remove existing deploy directory
    if (fs.existsSync(deployDir)) {
        log.info('Removing existing deploy directory...');
        try {
            fs.rmSync(deployDir, { recursive: true, force: true });
            log.success('Previous deployment directory removed');
        } catch (error) {
            log.error(`Failed to remove existing deploy directory: ${error.message}`);
            process.exit(1);
        }
    }

    // Create new deploy directory
    try {
        fs.mkdirSync(deployDir, { recursive: true });
        log.success('Deployment directory created: deploy/');
    } catch (error) {
        log.error(`Failed to create deploy directory: ${error.message}`);
        process.exit(1);
    }

    return deployDir;
}

function shouldExclude(filePath, fileName) {
    // Normalize path separators
    const normalizedPath = filePath.replace(/\\/g, '/');
    const normalizedName = fileName.replace(/\\/g, '/');
    
    // Check against exclude patterns
    for (const pattern of excludePatterns) {
        try {
            // Convert pattern to regex
            const regex = new RegExp(pattern, 'i');
            
            // Check both full path and filename
            if (regex.test(normalizedPath) || regex.test(normalizedName)) {
                return true;
            }
        } catch (error) {
            // If pattern is not valid regex, do simple string matching
            if (normalizedPath.includes(pattern) || normalizedName.includes(pattern)) {
                return true;
            }
        }
    }
    
    return false;
}

function copyDirectory(src, dest, baseDir = src, stats = { files: 0, dirs: 0, skipped: 0 }) {
    // Create destination directory
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    try {
        // Read source directory
        const entries = fs.readdirSync(src, { withFileTypes: true });

        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            const relativePath = path.relative(baseDir, srcPath);

            // Skip if should be excluded
            if (shouldExclude(relativePath, entry.name)) {
                stats.skipped++;
                continue;
            }

            try {
                if (entry.isDirectory()) {
                    stats.dirs++;
                    copyDirectory(srcPath, destPath, baseDir, stats);
                } else if (entry.isFile()) {
                    // Skip symlinks
                    const stat = fs.statSync(srcPath);
                    if (stat.isSymbolicLink()) {
                        stats.skipped++;
                        continue;
                    }
                    
                    fs.copyFileSync(srcPath, destPath);
                    stats.files++;
                }
            } catch (error) {
                log.warning(`Failed to copy ${relativePath}: ${error.message}`);
                stats.skipped++;
            }
        }
    } catch (error) {
        log.warning(`Failed to read directory ${src}: ${error.message}`);
    }
    
    return stats;
}

function copyProjectFiles(deployDir) {
    log.section('📋 Copying Project Files');

    const sourceDir = process.cwd();
    
    log.info('Copying files (this may take a moment)...');
    log.step('Scanning and copying files...');
    
    const stats = { files: 0, dirs: 0, skipped: 0 };
    copyDirectory(sourceDir, deployDir, sourceDir, stats);
    
    log.success(`Project files copied: ${stats.files} files, ${stats.dirs} directories`);
    if (stats.skipped > 0) {
        log.info(`Skipped ${stats.skipped} files/directories (excluded patterns)`);
    }
    
    // Verify must-include files
    log.step('Verifying essential files...');
    let missingFiles = [];
    let presentFiles = [];
    
    for (const file of mustInclude) {
        const filePath = path.join(deployDir, file);
        if (!fs.existsSync(filePath)) {
            missingFiles.push(file);
        } else {
            presentFiles.push(file);
        }
    }
    
    if (missingFiles.length > 0) {
        log.error(`Missing critical files: ${missingFiles.join(', ')}`);
        log.warning('Deployment package may be incomplete!');
    } else {
        log.success('All essential files present');
    }
    
    // Check recommended files
    log.step('Checking recommended files...');
    let missingRecommended = [];
    for (const file of recommendedInclude) {
        const filePath = path.join(deployDir, file);
        if (!fs.existsSync(filePath)) {
            missingRecommended.push(file);
        }
    }
    
    if (missingRecommended.length > 0) {
        log.info(`Optional files not included: ${missingRecommended.join(', ')} (not critical)`);
    }
}

function createEmptyDirectories(deployDir) {
    log.section('📂 Creating Empty Directories');

    const emptyDirs = ['uploads', 'logs'];
    
    for (const dir of emptyDirs) {
        const dirPath = path.join(deployDir, dir);
        try {
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
                
                // Create .gitkeep file
                fs.writeFileSync(path.join(dirPath, '.gitkeep'), '');
                log.success(`Created ${dir}/ directory with .gitkeep`);
            } else {
                // Clear contents if directory exists
                const files = fs.readdirSync(dirPath);
                for (const file of files) {
                    if (file !== '.gitkeep') {
                        const filePath = path.join(dirPath, file);
                        const stat = fs.statSync(filePath);
                        if (stat.isDirectory()) {
                            fs.rmSync(filePath, { recursive: true, force: true });
                        } else {
                            fs.unlinkSync(filePath);
                        }
                    }
                }
                log.info(`Cleaned ${dir}/ directory`);
            }
        } catch (error) {
            log.warning(`Failed to create/clean ${dir}/ directory: ${error.message}`);
        }
    }
}

function createProductionEnvTemplate(deployDir) {
    log.section('📝 Creating Production Environment Template');

    // Try to read env.example for reference
    let envExample = '';
    if (fs.existsSync('env.example')) {
        try {
            envExample = fs.readFileSync('env.example', 'utf8');
            log.info('Using env.example as base template');
        } catch (error) {
            log.warning('Could not read env.example, using default template');
        }
    }

    const envTemplate = `# ===== PRODUCTION ENVIRONMENT CONFIGURATION =====
# ⚠️  IMPORTANT: Fill in all values before deploying!
# Generated: ${new Date().toISOString()}

# ===== SERVER CONFIGURATION =====
NODE_ENV=production
PORT=3000

# ===== DATABASE CONFIGURATION =====
# MySQL credentials from cPanel MySQL Databases
# Create database first in cPanel, then fill in these values
DB_HOST=localhost
DB_USER=YOUR_DB_USER
DB_PASSWORD=YOUR_DB_PASSWORD
DB_NAME=YOUR_DB_NAME
DB_PORT=3306

# ===== JWT CONFIGURATION =====
# ⚠️  SECURITY: Generate a random string (32+ characters)
# Use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=GENERATE_RANDOM_STRING_HERE
JWT_EXPIRES_IN=7d

# ===== SESSION SECRET =====
# ⚠️  SECURITY: Generate a DIFFERENT random string (32+ characters)
SESSION_SECRET=GENERATE_DIFFERENT_RANDOM_STRING_HERE

# ===== EMAIL CONFIGURATION =====
# Gmail SMTP (use app-specific password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# ===== CONTACT FORM EMAIL CONFIGURATION =====
CONTACT_ADMIN_EMAILS=admin@gyanjyotischool.com
CONTACT_AUTO_REPLY_ENABLED=true
CONTACT_AUTO_REPLY_SUBJECT=Thank you for contacting GyanJyoti Secondary School

# ===== ADMISSION EMAIL CONFIGURATION =====
ADMISSION_ADMIN_EMAILS=admissions@gyanjyotischool.com,principal@gyanjyotischool.com

# ===== FILE UPLOAD CONFIGURATION =====
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=26214400
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/gif,image/webp
ALLOWED_DOCUMENT_TYPES=application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document

# ===== CLOUDINARY CONFIGURATION =====
# Get from: https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=gyan-jyoti-school

# ===== REDIS CONFIGURATION =====
# If Redis is not available on your hosting, set REDIS_CACHE_ENABLED=false
REDIS_CACHE_ENABLED=false
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_TTL=3600
REDIS_SESSION_TTL=86400

# ===== CORS CONFIGURATION =====
# Set to your actual domain (use https:// in production)
CORS_ORIGIN=https://yourdomain.com
CORS_CREDENTIALS=true

# ===== RATE LIMITING =====
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ===== SECURITY CONFIGURATION =====
BCRYPT_ROUNDS=12

# ===== ADMIN DEFAULT CREDENTIALS =====
# ⚠️  Change password immediately after first login!
ADMIN_EMAIL=admin@gyanjyotischool.com
ADMIN_PASSWORD=ChangeThisPassword123
ADMIN_FIRST_NAME=Admin
ADMIN_LAST_NAME=User

# ===== SCHOOL INFORMATION =====
SCHOOL_NAME=GyanJyoti Secondary School
SCHOOL_EMAIL=info@gyanjyotischool.com
SCHOOL_PHONE=+977-1-4XXXXXX
SCHOOL_ADDRESS=Kathmandu, Nepal

# ===== FEATURE FLAGS =====
ENABLE_REGISTRATION=false
ENABLE_COMMENTS=false
ENABLE_NEWSLETTER=false
ENABLE_ONLINE_ADMISSIONS=false

# ===== LOGGING CONFIGURATION =====
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# ===== SOCIAL MEDIA LINKS =====
FACEBOOK_URL=https://www.facebook.com/gyan.joyti.5
INSTAGRAM_URL=
TWITTER_URL=
YOUTUBE_URL=
`;

    try {
        const envPath = path.join(deployDir, '.env.production');
        fs.writeFileSync(envPath, envTemplate);
        log.success('Created .env.production template');
        log.warning('⚠️  Remember to rename .env.production to .env and fill in all values!');
        
        // Also copy env.example if it exists
        if (fs.existsSync('env.example')) {
            const envExamplePath = path.join(deployDir, 'env.example');
            fs.copyFileSync('env.example', envExamplePath);
            log.info('Copied env.example as reference');
        }
    } catch (error) {
        log.error(`Failed to create .env.production: ${error.message}`);
    }
}

function createDeploymentInstructions(deployDir) {
    log.section('📖 Creating Deployment Instructions');

    const instructions = `# 🚀 DEPLOYMENT INSTRUCTIONS

## Files in this directory are ready for production deployment

### ✅ What's Included:
- All necessary source code
- Configuration files
- Public assets (HTML, CSS, JS, images)
- MySQL schema (schema.sql)
- Database seeder script (scripts/seed.js)
- Empty uploads/ and logs/ directories
- Environment template (.env.production)
- Documentation files

### ❌ What's NOT Included (and shouldn't be):
- node_modules (will be installed on server via npm install)
- Development database files
- .env file (will be created from .env.production template)
- Log files
- Git history
- Development tools and cache files

---

## 📋 QUICK DEPLOYMENT STEPS

### 1. Setup MySQL Database in cPanel
- Go to **cPanel → MySQL Databases**
- Create a new database (e.g., \`username_gyanjyoti\`)
- Create a database user with strong password
- Add user to database with **ALL PRIVILEGES**
- Note down: **DB_HOST** (usually localhost), **DB_NAME**, **DB_USER**, **DB_PASSWORD**

### 2. Upload Files to cPanel
- Use **FTP client** (FileZilla, WinSCP) or **cPanel File Manager**
- Upload **all files** from this \`deploy\` folder
- Upload to your app directory (e.g., \`~/gyanjyoti\` or \`~/public_html/app\`)

### 3. Import Database Schema
- Go to **cPanel → phpMyAdmin**
- Select your database
- Click **"Import"** tab
- Upload \`schema.sql\` file
- Click **"Go"** to execute
- Verify all tables are created successfully

### 4. Configure Environment
- Rename \`.env.production\` to \`.env\`
- Fill in **ALL** environment variables:
  - **Database**: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME (from step 1)
  - **Security**: JWT_SECRET, SESSION_SECRET (generate random strings)
  - **Email**: EMAIL_USER, EMAIL_PASS (use app-specific password)
  - **Cloudinary**: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
  - **Domain**: CORS_ORIGIN (your actual domain with https://)

### 5. Setup Node.js App in cPanel
- Go to **"Setup Node.js App"** in cPanel
- Create new application:
  - **Node.js version**: 16.0.0 or higher (18.x recommended)
  - **Application mode**: Production
  - **Application root**: your-app-folder
  - **Startup file**: server.js
- Add **all environment variables** from .env file to the Node.js app settings

### 6. Install Dependencies and Seed Database (via SSH or cPanel Terminal)
\`\`\`bash
cd ~/your-app-folder

# Install dependencies
npm install --production

# Seed the database with initial data (creates admin user)
node scripts/seed.js
\`\`\`

### 7. Start Application
- In **cPanel Node.js App manager**
- Click **"Start App"**
- Verify status shows **"Running"**
- Check logs for any errors

### 8. Configure Web Access
- Create/edit \`.htaccess\` in public_html to proxy requests to Node.js app
- Install **SSL certificate** (Let's Encrypt is free)
- Force **HTTPS redirect**

### 9. Test Everything
- Visit your domain
- Test **admin login** (use credentials from .env)
- Verify all features work:
  - Homepage loads
  - Contact form works
  - Gallery displays
  - Events page works
  - Admin panel accessible

---

## 📚 Full Documentation

Refer to these files for detailed instructions (if included):
- \`CPANEL_DEPLOYMENT_GUIDE.md\` - Complete step-by-step guide
- \`DEPLOYMENT_CHECKLIST.md\` - Checklist to track progress
- \`CPANEL_TROUBLESHOOTING.md\` - Solutions to common issues
- \`QUICK_DEPLOYMENT_REFERENCE.md\` - Quick reference card

---

## ⚠️  IMPORTANT SECURITY REMINDERS

1. **Generate strong random strings** for JWT_SECRET and SESSION_SECRET:
   \`\`\`bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   \`\`\`

2. **Use Gmail App-Specific Password** (not regular password) for email
   - Enable 2FA in Google Account
   - Generate app password from Google Account settings

3. **Change ADMIN_PASSWORD** immediately after first login

4. **Set CORS_ORIGIN** to your actual domain (with https://)

5. **Never commit .env file** to version control

6. **Enable HTTPS/SSL** on your domain

7. **Keep Node.js and dependencies updated** regularly

---

## 🆘 Need Help?

1. Check \`CPANEL_TROUBLESHOOTING.md\` for common issues
2. Check error logs in cPanel Node.js App manager
3. Verify all environment variables are set correctly
4. Test database connection separately
5. Contact your hosting provider for server-level issues

---

## 🎯 Deployment Checklist

- [ ] MySQL database created
- [ ] Database user created and granted privileges
- [ ] Files uploaded to server
- [ ] Database schema imported
- [ ] .env file configured with all variables
- [ ] Node.js app created in cPanel
- [ ] Environment variables added to Node.js app
- [ ] Dependencies installed (npm install)
- [ ] Database seeded (node scripts/seed.js)
- [ ] Application started and running
- [ ] SSL certificate installed
- [ ] HTTPS redirect configured
- [ ] Admin login tested
- [ ] All features tested and working

---

**Good luck with your deployment! 🎉**

Generated: ${new Date().toISOString()}
`;

    try {
        const instructionsPath = path.join(deployDir, 'DEPLOY_README.md');
        fs.writeFileSync(instructionsPath, instructions);
        log.success('Created DEPLOY_README.md');
    } catch (error) {
        log.error(`Failed to create DEPLOY_README.md: ${error.message}`);
    }
}

function createPackageInfo(deployDir) {
    log.section('📦 Creating Package Info');

    let packageJson;
    try {
        packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    } catch (error) {
        packageJson = {};
    }

    const info = {
        packageName: packageJson.name || 'gyanjyoti-deployment-package',
        version: packageJson.version || '1.0.0',
        createdAt: new Date().toISOString(),
        nodeVersion: process.version,
        platform: process.platform,
        architecture: process.arch,
        instructions: 'See DEPLOY_README.md for deployment instructions',
        entryPoint: packageJson.main || 'server.js',
        dependencies: Object.keys(packageJson.dependencies || {}).length,
        devDependencies: Object.keys(packageJson.devDependencies || {}).length,
    };

    try {
        const infoPath = path.join(deployDir, 'deployment-info.json');
        fs.writeFileSync(infoPath, JSON.stringify(info, null, 2));
        log.success('Created deployment-info.json');
    } catch (error) {
        log.error(`Failed to create deployment-info.json: ${error.message}`);
    }
}

function calculateSize(dirPath) {
    let totalSize = 0;
    
    function getSizeRecursive(filePath) {
        try {
            const stats = fs.statSync(filePath);
            
            if (stats.isFile()) {
                totalSize += stats.size;
            } else if (stats.isDirectory()) {
                const files = fs.readdirSync(filePath);
                files.forEach(file => {
                    getSizeRecursive(path.join(filePath, file));
                });
            }
        } catch (error) {
            // Skip files that can't be read
        }
    }
    
    getSizeRecursive(dirPath);
    return totalSize;
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function printSummary(deployDir) {
    log.section('📊 Deployment Package Summary');

    // Count files
    let fileCount = 0;
    let dirCount = 0;
    
    function countItems(dirPath) {
        try {
            const items = fs.readdirSync(dirPath);
            for (const item of items) {
                const itemPath = path.join(dirPath, item);
                try {
                    const stats = fs.statSync(itemPath);
                    
                    if (stats.isDirectory()) {
                        dirCount++;
                        countItems(itemPath);
                    } else {
                        fileCount++;
                    }
                } catch (error) {
                    // Skip items that can't be accessed
                }
            }
        } catch (error) {
            // Skip directories that can't be read
        }
    }
    
    countItems(deployDir);
    
    const totalSize = calculateSize(deployDir);
    
    console.log(`${colors.cyan}Package Location:${colors.reset} ${deployDir}`);
    console.log(`${colors.cyan}Total Files:${colors.reset} ${fileCount}`);
    console.log(`${colors.cyan}Total Directories:${colors.reset} ${dirCount}`);
    console.log(`${colors.cyan}Total Size:${colors.reset} ${formatBytes(totalSize)}`);
    
    log.success('Deployment package created successfully! 🎉');
}

function printNextSteps() {
    log.section('🚀 Next Steps');

    console.log(`
${colors.cyan}1. Review the deployment package:${colors.reset}
   - Check the 'deploy' folder
   - Review DEPLOY_README.md for detailed instructions
   - Verify all essential files are present

${colors.cyan}2. Configure environment:${colors.reset}
   - Edit deploy/.env.production
   - Fill in ALL required values (especially database, email, cloudinary)
   - Generate secure random strings for JWT_SECRET and SESSION_SECRET
   - Rename to .env when ready to deploy

${colors.cyan}3. Upload to cPanel:${colors.reset}
   - Use FTP client (FileZilla, WinSCP) or cPanel File Manager
   - Upload all files from 'deploy' folder
   - Maintain directory structure

${colors.cyan}4. Follow deployment guide:${colors.reset}
   - See CPANEL_DEPLOYMENT_GUIDE.md (if included)
   - Use DEPLOYMENT_CHECKLIST.md to track progress
   - Follow step-by-step instructions in DEPLOY_README.md

${colors.cyan}5. Post-deployment:${colors.reset}
   - Test all features thoroughly
   - Change default admin password
   - Monitor logs for errors
   - Set up regular backups

${colors.green}Your project is ready for production deployment! 🍀${colors.reset}
    `);
}

function main() {
    try {
        printHeader();
        checkPrerequisites();
        
        const deployDir = createDeploymentDirectory();
        copyProjectFiles(deployDir);
        createEmptyDirectories(deployDir);
        createProductionEnvTemplate(deployDir);
        createDeploymentInstructions(deployDir);
        createPackageInfo(deployDir);
        
        printSummary(deployDir);
        printNextSteps();
        
    } catch (error) {
        log.error(`Deployment preparation failed: ${error.message}`);
        console.error(error);
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { main };
