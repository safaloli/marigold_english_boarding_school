-- =============================================
-- MARIGOLD ENGLISH BOARDING SCHOOL - MySQL Database Schema
-- Generated from Prisma Schema
-- Database: MySQL 5.7+
-- =============================================

-- Drop tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS `password_reset_tokens`;
DROP TABLE IF EXISTS `contact_submissions`;
DROP TABLE IF EXISTS `admission_applications`;
DROP TABLE IF EXISTS `popup_notices`;
DROP TABLE IF EXISTS `blogs`;
DROP TABLE IF EXISTS `gallery`;
DROP TABLE IF EXISTS `homepage_content`;
DROP TABLE IF EXISTS `academics_content`;
DROP TABLE IF EXISTS `contact_content`;
DROP TABLE IF EXISTS `events_content`;
DROP TABLE IF EXISTS `about_content`;
DROP TABLE IF EXISTS `general_settings`;
DROP TABLE IF EXISTS `alumni`;
DROP TABLE IF EXISTS `neb_toppers`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `download`;

-- =============================================
-- Table: users
-- =============================================
CREATE TABLE `users` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'USER',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `profile_image` VARCHAR(500) NULL,
  `phone` VARCHAR(50) NULL,
  `address` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login` DATETIME NULL,
  `reset_token` VARCHAR(255) NULL,
  `reset_token_expires` DATETIME NULL,
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: blogs
-- =============================================
CREATE TABLE `blogs` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `title` VARCHAR(500) NOT NULL,
  `content` LONGTEXT NOT NULL,
  `excerpt` TEXT NULL,
  `featured_image` VARCHAR(500) NULL,
  `author_id` VARCHAR(36) NULL,
  `tags` TEXT NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
  `published_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_blogs_author` (`author_id`),
  INDEX `idx_blogs_status` (`status`),
  INDEX `idx_blogs_published` (`published_at`),
  FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: gallery
-- =============================================
CREATE TABLE `gallery` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `title` VARCHAR(500) NOT NULL,
  `description` TEXT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `video_url` VARCHAR(500) NULL,
  `category` VARCHAR(100) NULL,
  `item_type` VARCHAR(50) NOT NULL,
  `album_id` VARCHAR(36) NULL,
  `icon` VARCHAR(255) NULL,
  `order_index` INT NOT NULL DEFAULT 0,
  `tags` TEXT NOT NULL,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `uploaded_by` VARCHAR(36) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_gallery_category` (`category`),
  INDEX `idx_gallery_type` (`item_type`),
  INDEX `idx_gallery_album` (`album_id`),
  INDEX `idx_gallery_featured` (`is_featured`),
  INDEX `idx_gallery_uploader` (`uploaded_by`),
  FOREIGN KEY (`album_id`) REFERENCES `gallery`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: homepage_content
-- =============================================
CREATE TABLE `homepage_content` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `section` VARCHAR(100) NOT NULL,
  `key` VARCHAR(100) NOT NULL,
  `title` VARCHAR(500) NULL,
  `content` LONGTEXT NULL,
  `description` TEXT NULL,
  `image_url` VARCHAR(500) NULL,
  `link_url` VARCHAR(500) NULL,
  `order_index` INT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `metadata` TEXT NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_section_key` (`section`, `key`),
  INDEX `idx_homepage_section` (`section`),
  INDEX `idx_homepage_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: academics_content
-- =============================================
CREATE TABLE `academics_content` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `section` VARCHAR(100) NOT NULL,
  `key` VARCHAR(100) NOT NULL,
  `title` VARCHAR(500) NULL,
  `content` LONGTEXT NULL,
  `description` TEXT NULL,
  `image_url` VARCHAR(500) NULL,
  `link_url` VARCHAR(500) NULL,
  `order_index` INT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `metadata` TEXT NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_section_key` (`section`, `key`),
  INDEX `idx_academics_section` (`section`),
  INDEX `idx_academics_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: contact_content
-- =============================================
CREATE TABLE `contact_content` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `section` VARCHAR(100) NOT NULL,
  `key` VARCHAR(100) NOT NULL,
  `title` VARCHAR(500) NULL,
  `content` LONGTEXT NULL,
  `description` TEXT NULL,
  `image_url` VARCHAR(500) NULL,
  `link_url` VARCHAR(500) NULL,
  `order_index` INT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `metadata` TEXT NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_section_key` (`section`, `key`),
  INDEX `idx_contact_section` (`section`),
  INDEX `idx_contact_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: events_content
-- =============================================
CREATE TABLE `events_content` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `section` VARCHAR(100) NOT NULL,
  `key` VARCHAR(100) NOT NULL,
  `title` VARCHAR(500) NULL,
  `content` LONGTEXT NULL,
  `description` TEXT NULL,
  `image_url` VARCHAR(500) NULL,
  `link_url` VARCHAR(500) NULL,
  `category` VARCHAR(100) NULL,
  `event_date` DATETIME NULL,
  `icon` VARCHAR(255) NULL,
  `badge` VARCHAR(100) NULL,
  `order_index` INT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `metadata` TEXT NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `event_time` VARCHAR(100) NULL,
  `venue` VARCHAR(500) NULL,
  `organizer` VARCHAR(255) NULL,
  `contact_info` TEXT NULL,
  `event_schedule` TEXT NULL,
  `guests` TEXT NULL,
  `registration_enabled` TINYINT(1) NOT NULL DEFAULT 0,
  `location_map` TEXT NULL,
  `help_desk` TEXT NULL,
  `pdf_files` TEXT NULL,
  UNIQUE KEY `unique_section_key` (`section`, `key`),
  INDEX `idx_events_section` (`section`),
  INDEX `idx_events_date` (`event_date`),
  INDEX `idx_events_category` (`category`),
  INDEX `idx_events_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: about_content
-- =============================================
CREATE TABLE `about_content` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `section` VARCHAR(100) NOT NULL,
  `key` VARCHAR(100) NOT NULL,
  `title` VARCHAR(500) NULL,
  `content` LONGTEXT NULL,
  `description` TEXT NULL,
  `image_url` VARCHAR(500) NULL,
  `link_url` VARCHAR(500) NULL,
  `name` VARCHAR(255) NULL,
  `role` VARCHAR(100) NULL,
  `position` VARCHAR(100) NULL,
  `qualifications` TEXT NULL,
  `rating` INT NULL,
  `date` VARCHAR(100) NULL,
  `icon` VARCHAR(255) NULL,
  `badge` VARCHAR(100) NULL,
  `order_index` INT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `metadata` TEXT NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_section_key` (`section`, `key`),
  INDEX `idx_about_section` (`section`),
  INDEX `idx_about_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: general_settings
-- =============================================
CREATE TABLE `general_settings` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `site_name` VARCHAR(255) NULL,
  `site_name_second` VARCHAR(255) NULL,
  `site_description` TEXT NULL,
  `site_logo` VARCHAR(500) NULL,
  `site_favicon` VARCHAR(500) NULL,
  `main_contact_email` VARCHAR(255) NULL,
  `main_contact_phone` VARCHAR(50) NULL,
  `school_address` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: admission_applications
-- =============================================
CREATE TABLE `admission_applications` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `application_number` INT NOT NULL UNIQUE,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `date_of_birth` DATETIME NOT NULL,
  `gender` VARCHAR(20) NOT NULL,
  `grade_applied_for` VARCHAR(50) NOT NULL,
  `current_school` VARCHAR(255) NULL,
  `guardian_name` VARCHAR(255) NOT NULL,
  `guardian_phone` VARCHAR(50) NOT NULL,
  `guardian_email` VARCHAR(255) NULL,
  `guardian_occupation` VARCHAR(255) NULL,
  `address_line` TEXT NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NULL,
  `postal_code` VARCHAR(20) NULL,
  `newsletter_consent` TINYINT(1) NOT NULL DEFAULT 0,
  `terms_accepted` TINYINT(1) NOT NULL DEFAULT 0,
  `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  `reviewed_at` DATETIME NULL,
  `reviewed_by` VARCHAR(36) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_admission_status` (`status`),
  INDEX `idx_admission_grade` (`grade_applied_for`),
  INDEX `idx_admission_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: password_reset_tokens
-- =============================================
CREATE TABLE `password_reset_tokens` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL,
  `otp_code` VARCHAR(10) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `is_used` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_reset_email` (`email`),
  INDEX `idx_reset_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: contact_submissions
-- =============================================
CREATE TABLE `contact_submissions` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `full_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `country_code` VARCHAR(10) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `message` TEXT NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'NEW',
  `ip_address` VARCHAR(50) NULL,
  `user_agent` TEXT NULL,
  `admin_notes` TEXT NULL,
  `replied_at` DATETIME NULL,
  `replied_by` VARCHAR(36) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `replied_message` TEXT NULL,
  INDEX `idx_contact_status` (`status`),
  INDEX `idx_contact_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: alumni
-- =============================================
CREATE TABLE `alumni` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `batch_year` VARCHAR(20) NOT NULL,
  `profession` VARCHAR(255) NOT NULL,
  `university` VARCHAR(255) NULL,
  `quote` TEXT NULL,
  `testimonial` TEXT NULL,
  `photo_url` VARCHAR(500) NULL,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `is_top_achiever` TINYINT(1) NOT NULL DEFAULT 0,
  `order_index` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_alumni_batch` (`batch_year`),
  INDEX `idx_alumni_featured` (`is_featured`),
  INDEX `idx_alumni_achiever` (`is_top_achiever`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: neb_toppers
-- =============================================
CREATE TABLE `neb_toppers` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `batch_year` VARCHAR(20) NOT NULL,
  `gpa` VARCHAR(10) NOT NULL,
  `faculty` VARCHAR(100) NULL,
  `quote` TEXT NULL,
  `photo_url` VARCHAR(500) NULL,
  `order_index` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_toppers_batch` (`batch_year`),
  INDEX `idx_toppers_gpa` (`gpa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: popup_notices
-- Description: Stores popup notices displayed on the website homepage
--              Separate from homepage_content table for better data management
-- =============================================
CREATE TABLE `popup_notices` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `image_url` VARCHAR(500) NOT NULL,
  `is_enabled` TINYINT(1) NOT NULL DEFAULT 1,
  `order_index` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_popup_notices_enabled` (`is_enabled`),
  INDEX `idx_popup_notices_order` (`order_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `downloads` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,

  `main_title` VARCHAR(255)  NULL DEFAULT NULL,
  `main_description` TEXT NULL DEFAULT NULL,

  `category` VARCHAR(100)  NULL DEFAULT NULL,
  `academic_year` VARCHAR(50)  NULL DEFAULT NULL,
  `class` VARCHAR(50)  NULL DEFAULT NULL,
  `subject` VARCHAR(100)  NULL DEFAULT NULL,
  `category_title` VARCHAR(255) NULL DEFAULT NULL,

  -- File Information
  `file_name` VARCHAR(255) NULL DEFAULT NULL,
  `cloudinary_public_id` VARCHAR(255) NULL DEFAULT NULL,
  `file_type` VARCHAR(50)  NULL DEFAULT NULL,
  `file_size_kb` INT UNSIGNED  NULL DEFAULT NULL,

  `file_url` VARCHAR(500)  NULL DEFAULT NULL,
  `icon_name` VARCHAR(100) NULL DEFAULT NULL,

  `is_active` VARCHAR(20) NOT NULL DEFAULT 'active',

  `created_by` VARCHAR(36) NULL,
  `updated_by` VARCHAR(36) NULL,

  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL DEFAULT NULL,

  -- Indexes for fast filtering
  INDEX `idx_downloads_category` (`category`),
  INDEX `idx_downloads_academic_year` (`academic_year`),
  INDEX `idx_downloads_class` (`class`),
  INDEX `idx_downloads_subject` (`subject`),
  INDEX `idx_downloads_is_active` (`is_active`),
  INDEX `idx_downloads_deleted_at` (`deleted_at`),
  INDEX `idx_downloads_created_by` (`created_by`),

  -- Optional Foreign Key (if users table exists)
  CONSTRAINT `fk_downloads_created_by`
    FOREIGN KEY (`created_by`) REFERENCES `users`(`id`)
    ON DELETE SET NULL,

  CONSTRAINT `fk_downloads_updated_by`
    FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- End of Schema
-- =============================================

