# Marigold School Website

A professional, modern website for Marigold School built with Node.js, Express, MongoDB, and modern frontend technologies.

## 🌟 Features

### 🎯 Core Features
- **Professional School Website** - Modern, responsive design
- **Admin Panel** - Complete content management system
- **Blog Management** - Create, edit, and manage blog posts
- **Event Management** - Organize and display school events
- **Gallery System** - Photo galleries with categories and filters
- **Contact Form** - Integrated contact form with email notifications
- **Authentication System** - Secure admin login with JWT
- **File Upload** - Image and document upload capabilities
- **Responsive Design** - Mobile-first, responsive layout
- **SEO Optimized** - Meta tags, structured data, and performance optimized

### 🛠 Technical Features
- **Node.js & Express** - Robust backend framework
- **MySQL & Prisma ORM** - Relational database with modern ORM
- **JWT Authentication** - Secure token-based authentication
- **Cloudinary Integration** - Cloud-based media storage
- **Email Integration** - Nodemailer for email notifications
- **Security** - Helmet, CORS, rate limiting, input validation
- **Performance** - Compression, caching, optimized assets
- **Modern Frontend** - Vanilla JavaScript, CSS3, HTML5
- **Component System** - Reusable UI components
- **API-First Design** - RESTful API architecture

### 🎨 Design Features
- **Shadcn-inspired Design** - Modern, clean UI components
- **Boxicons** - Beautiful, consistent iconography
- **CSS Variables** - Customizable design system
- **Smooth Animations** - CSS transitions and JavaScript animations
- **Dark Mode Ready** - CSS custom properties for theming
- **Accessibility** - WCAG compliant, keyboard navigation
- **Print Styles** - Optimized for printing

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **MySQL** (v5.7 or higher) or access to cPanel MySQL
- **npm** or **yarn** package manager
- **Git** for version control

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Marigold-school-website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the example environment file and configure it:

```bash
cp env.example .env
```

Edit `.env` file with your configuration:

```env
# Database (MySQL)
DATABASE_URL=mysql://root:password@localhost:3306/Marigold_school

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Session Secret
SESSION_SECRET=your-session-secret-key

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=3000
NODE_ENV=development
```

### 4. Setup MySQL Database

Create a MySQL database for the project:

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE marigold_school;

# Create user (optional)
CREATE USER 'Marigold_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON Marigold_school.* TO 'Marigold_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Push Prisma schema to database
npx prisma generate
npx prisma db push

# Seed initial data
npm run db:seed
```

### 5. Run the Application

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm run build
npm start
```

### 6. Access the Application

- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

## 📁 Project Structure

```
Marigold-school-website/
├── public/                     # Static files
│   ├── css/                   # Stylesheets
│   │   ├── main.css          # Main styles
│   │   ├── components.css    # Component styles
│   │   └── responsive.css    # Responsive design
│   ├── js/                   # JavaScript files
│   │   ├── main.js          # Main functionality
│   │   ├── components.js    # UI components
│   │   └── api.js           # API functions
│   ├── images/              # Image assets
│   └── index.html           # Main HTML file
├── server.js                # Express server entry point
├── package.json             # Dependencies and scripts
├── models/                  # Mongoose models
│   ├── User.js             # User model
│   ├── Blog.js             # Blog post model
│   ├── Event.js            # Event model
│   └── Gallery.js          # Gallery model
├── routes/                  # API routes
│   ├── auth.js             # Authentication routes
│   ├── admin.js            # Admin routes
│   ├── api.js              # Public API routes
│   └── pages.js            # Page routes
├── middleware/              # Express middleware
│   ├── auth.js             # Authentication middleware
│   └── errorHandler.js     # Error handling middleware
├── uploads/                 # File uploads directory
├── logs/                   # Application logs
└── env.example             # Environment variables example
```

## 🔧 Configuration

### Environment Variables

Key environment variables you need to configure:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/Marigold_jyoti_school |
| `JWT_SECRET` | JWT signing secret | your-super-secret-jwt-key |
| `EMAIL_HOST` | SMTP host | smtp.gmail.com |
| `EMAIL_USER` | Email username | your-email@gmail.com |
| `EMAIL_PASS` | Email password | your-app-password |

### Database Configuration

The application uses MySQL with Prisma ORM and the following tables:
- `users` - Admin users and authentication
- `admission_applications` - Student admission forms
- `contact_submissions` - Contact form submissions
- `gallery` - Photo galleries and media
- `events_content` - School events and notices
- `homepage_content` - Homepage editable sections
- `academics_content` - Academics page content
- `about_content` - About page content
- `alumni` - Alumni records
- `neb_toppers` - NEB toppers data

All tables can be managed via phpMyAdmin when deployed to cPanel.

### File Upload Configuration

Configure file upload settings in `.env`:

```env
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

## 🎨 Customization

### Styling

The website uses CSS custom properties for easy customization:

```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #64748b;
  --accent-color: #f59e0b;
  /* ... more variables */
}
```

### Content

Update school-specific content in:
- `public/index.html` - Main page content
- `env.example` - School information
- `public/images/` - School images and logos

### Components

The website includes reusable components:
- Modal dialogs
- Tooltips
- Accordions
- Tabs
- Progress bars
- Carousels
- Form validators

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password security
- **Input Validation** - Express-validator for data validation
- **Rate Limiting** - Prevent abuse with rate limiting
- **CORS Protection** - Cross-origin resource sharing protection
- **Helmet Security** - Security headers
- **File Upload Security** - File type and size validation

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Desktop**: 1200px and up
- **Tablet Landscape**: 768px to 1023px
- **Tablet Portrait**: 481px to 767px
- **Mobile**: 320px to 480px
- **Small Mobile**: 320px and below

## 🚀 Performance Optimization

- **Image Optimization** - Sharp for image processing
- **Compression** - Gzip compression for responses
- **Caching** - Browser and server-side caching
- **Lazy Loading** - Images load as needed
- **Minification** - CSS and JavaScript minification
- **CDN Ready** - Static assets optimized for CDN

## 🔧 Development

### Available Scripts

```bash
npm run dev              # Start development server with nodemon
npm start                # Start production server
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to database
npm run db:seed          # Seed database with initial data
npm run db:studio        # Open Prisma Studio (database GUI)
npm run deploy:prepare   # Prepare files for deployment
npm run deploy:validate  # Validate production config
```

### Code Style

The project follows modern JavaScript and CSS conventions:
- ES6+ JavaScript features
- CSS custom properties
- Semantic HTML
- Accessibility best practices

### Debugging

Enable debug mode in `.env`:

```env
ENABLE_DEBUG_MODE=true
ENABLE_API_DOCS=true
```

## 📊 Admin Panel

### Features
- **Dashboard** - Overview of website statistics
- **Blog Management** - Create, edit, delete blog posts
- **Event Management** - Manage school events
- **Gallery Management** - Upload and organize images
- **User Management** - Admin user management
- **Settings** - Website configuration

### Access
- URL: `/admin`
- Default credentials: Check `.env` file
- Secure authentication required

## 📧 Email Integration

The website includes email functionality for:
- Contact form submissions
- Password reset
- Event notifications
- Newsletter (future feature)

Configure email settings in `.env`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 🔄 Future Enhancements

### Planned Features
- **Redis Caching** - ✅ Fully implemented with API response caching, session storage, and automatic invalidation
- **Newsletter System** - Email newsletter functionality
- **Online Admissions** - Digital admission forms
- **Student Portal** - Student login and resources
- **Parent Portal** - Parent communication system
- **Mobile App** - React Native mobile application
- **Analytics** - Google Analytics integration
- **Multi-language** - Internationalization support

### Redis Integration

Redis caching is now fully implemented for performance optimization:

```env
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_TTL=3600
REDIS_SESSION_TTL=86400
REDIS_CACHE_ENABLED=true
```

**Features:**
- **API Response Caching** - Caches GET requests for faster responses
- **Session Storage** - User sessions stored in Redis
- **Automatic Invalidation** - Cache cleared when data is modified
- **Configurable TTL** - Different cache durations for different content types
- **Cache Statistics** - Monitor cache performance via `/api/cache/stats`
- **Graceful Fallback** - Continues working if Redis is unavailable

## 🐛 Troubleshooting

### Common Issues

1. **MySQL Connection Error**
   - Ensure MySQL is running
   - Check DATABASE_URL format in `.env`
   - Verify database exists and credentials are correct

2. **Prisma Client Errors**
   - Run `npx prisma generate` after schema changes
   - Run `npx prisma db push` to sync database

3. **Port Already in Use**
   - Change PORT in `.env`
   - Kill process using the port

4. **Email Not Sending**
   - Verify email credentials
   - Use Gmail App-Specific Password (not regular password)
   - Check SMTP settings

5. **Cloudinary Upload Issues**
   - Verify Cloudinary credentials
   - Check API limits
   - Ensure correct folder permissions

<!-- to see the running server in ports -->
# open terminal and run this
- netstat -ano | findstr :5176

<!-- to kill all running server in ports -->
# open terminal and run this
- taskkill /F /IM node.exe

### Logs

Check application logs in `./logs/app.log` for detailed error information.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Email: info@Marigoldschool.com
- Facebook: https://www.facebook.com/Marigold.joyti.5

## 🙏 Acknowledgments

- **Boxicons** - Beautiful icon library
- **Google Fonts** - Typography
- **MongoDB** - Database
- **Express.js** - Web framework
- **Node.js** - Runtime environment

---

**Built with ❤️ for Marigold School**
