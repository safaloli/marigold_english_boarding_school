# ===== GYAN JYOTI SCHOOL WEBSITE ENVIRONMENT CONFIGURATION =====

# ===== SERVER CONFIGURATION =====
PORT=3000
NODE_ENV=development

# ===== DATABASE CONFIGURATION =====
# MySQL Database Connection (REQUIRED for both development and production)
# 
# For Development (Local MySQL):
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=
#
# For Production (cPanel MySQL):
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=crossroa_gjss
# DB_PASSWORD=your_password
# DB_NAME=

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=

# ===== JWT CONFIGURATION =====
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# ===== EMAIL CONFIGURATION =====
# Gmail SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false  
EMAIL_USER=safaloligyanjyoti@gmail.com
EMAIL_PASS=bnad bjzs jxhd xkbi

# SendGrid (Alternative)
# SENDGRID_API_KEY=your-sendgrid-api-key
# EMAIL_FROM=noreply@gyanjyotischool.com

# ===== CONTACT FORM EMAIL CONFIGURATION =====
# Admin emails that will receive contact form notifications (comma-separated)
CONTACT_ADMIN_EMAILS=admin@gyanjyotischool.com,principal@gyanjyotischool.com,info@gyanjyotischool.com

# Contact form auto-reply settings
CONTACT_AUTO_REPLY_ENABLED=true
CONTACT_AUTO_REPLY_SUBJECT=Thank you for contacting GyanJyoti Secondary School

# ===== ADMISSION EMAIL CONFIGURATION =====
# Admin emails that will receive admission application notifications (comma-separated)
ADMISSION_ADMIN_EMAILS=admissions@gyanjyotischool.com,principal@gyanjyotischool.com

# ===== FILE UPLOAD CONFIGURATION =====
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=26214400
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/gif,image/webp
ALLOWED_DOCUMENT_TYPES=application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document

# ===== CLOUDINARY CONFIGURATION =====
CLOUDINARY_CLOUD_NAME=dtjr46kcg
CLOUDINARY_API_KEY=899943974314847
CLOUDINARY_API_SECRET=Y5gCtxxfaHw6BukjlPqHvkvhuHA
CLOUDINARY_FOLDER=gyan-jyoti-school

# ===== REDIS CONFIGURATION (CACHING LAYER) =====
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_TTL=3600
REDIS_SESSION_TTL=86400
REDIS_CACHE_ENABLED=true

# ===== CORS CONFIGURATION =====
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true

# ===== RATE LIMITING =====
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ===== SECURITY CONFIGURATION =====
BCRYPT_ROUNDS=12
SESSION_SECRET=your-session-secret-key

# ===== LOGGING CONFIGURATION =====
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# ===== ANALYTICS (OPTIONAL) =====
# GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
# FACEBOOK_PIXEL_ID=your-facebook-pixel-id

# ===== SOCIAL MEDIA LINKS =====
FACEBOOK_URL=https://www.facebook.com/gyan.joyti.5
INSTAGRAM_URL=
TWITTER_URL=
YOUTUBE_URL=

# ===== SCHOOL INFORMATION =====
SCHOOL_NAME=GyanJyoti Secondary School
SCHOOL_EMAIL=info@gyanjyotischool.com
SCHOOL_PHONE=+977-1-4XXXXXX
SCHOOL_ADDRESS=Kathmandu, Nepal

# ===== ADMIN DEFAULT CREDENTIALS =====
# These will be used to create the first admin user
ADMIN_EMAIL=admin@gyanjyotischool.com
ADMIN_PASSWORD=admin123
ADMIN_FIRST_NAME=Admin
ADMIN_LAST_NAME=User

# ===== FEATURE FLAGS =====
ENABLE_REGISTRATION=false
ENABLE_COMMENTS=false
ENABLE_NEWSLETTER=false
ENABLE_ONLINE_ADMISSIONS=false

# ===== BACKUP CONFIGURATION =====
BACKUP_ENABLED=true
BACKUP_SCHEDULE=0 2 * * *
BACKUP_RETENTION_DAYS=30

# ===== MONITORING =====
ENABLE_HEALTH_CHECK=true
HEALTH_CHECK_INTERVAL=300000

# ===== DEVELOPMENT TOOLS =====
ENABLE_DEBUG_MODE=true
ENABLE_API_DOCS=true
ENABLE_TEST_ROUTES=false

# ===== PRODUCTION SETTINGS =====
# Set these in production
# NODE_ENV=production
# JWT_SECRET=your-production-jwt-secret
# SESSION_SECRET=your-production-session-secret
# CORS_ORIGIN=https://gyanjyotischool.com
# ENABLE_DEBUG_MODE=false
# ENABLE_TEST_ROUTES=false
