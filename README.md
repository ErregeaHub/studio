# MediaFlow 🌊

A high-performance, Instagram-style media sharing platform built with **Laravel 11**, **MySQL**, and **Tailwind CSS**.

![Theme](https://img.shields.io/badge/Theme-Blue%20Dark-blue)
![Laravel](https://img.shields.io/badge/Laravel-11.x-red)
![Tailwind](https://img.shields.io/badge/Tailwind-3.x-blue)

## ✨ Features (Phase 1)

- **Modern Blue Dark UI**: Sleek interface using `slate-950` backgrounds and `blue-500` accents.
- **Media Sharing**: Support for image (5MB) and video (20MB) uploads with automatic thumbnail generation logic.
- **Advanced Sorting**: Discover content via `Newest`, `Most Viewed`, or `Popular` (Likes + Comments) filters.
- **Interactions**:
    - Real-time **Likes** and **Comments** (AJAX-powered).
    - **Nested Comments**: Support for threaded replies.
- **Categorization**: Organize posts with Categories and Tags.
- **User Profiles**: Custom bios and profile picture uploads.
- **Protected Routes**: Secure authentication for all interactions.

## 🚀 Getting Started

### Prerequisites
- PHP 8.2+
- Composer
- Node.js & NPM
- MySQL

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ErregeaHub/MediaFlow.git
   cd MediaFlow
   ```

2. **Install dependencies**
   ```bash
   composer install
   npm install && npm run build
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   *Update `.env` with your database credentials.*

4. **Run Migrations & Seeders**
   ```bash
   php artisan migrate --seed
   php artisan storage:link
   ```

5. **Start the server**
   ```bash
   php artisan serve
   ```

## 🛠 Tech Stack

- **Backend**: Laravel 11 (Eloquent, Blade, Breeze)
- **Frontend**: Tailwind CSS, Vanilla JavaScript
- **Database**: MySQL (or SQLite for local dev)
- **Storage**: Laravel Filesystem (Local/Public)

---

## 📦 Deployment Guide

### 1. Environment Optimization
Ensure `APP_ENV=production` and `APP_DEBUG=false` in your production `.env`.

### 2. Nginx Configuration
To handle 20MB video uploads, update your Nginx `client_max_body_size`:

```nginx
server {
    client_max_body_size 25M;
    # ... other config ...
}
```

### 3. Optimization Commands
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
```

---
Built with ❤️ by MediaFlow Team.
