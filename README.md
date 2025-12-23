# MediaFlow Deployment Guide

This guide provides instructions for deploying the MediaFlow platform to a production environment.

## 1. Environment Optimization (.env)

Ensure your `.env` file is optimized for production:

```env
APP_NAME=MediaFlow
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=media
DB_USERNAME=mediaflow_user
DB_PASSWORD=your_secure_password

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
```

## 2. Server Configuration (Nginx)

To handle large video uploads (up to 20MB as per requirements), update your Nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/mediaflow/public;

    # Handle large file uploads
    client_max_body_size 25M;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

## 3. Laravel Optimization Commands

Run these commands during deployment to ensure peak performance:

```bash
# Install dependencies
composer install --optimize-autoloader --no-dev

# Clear and cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
php artisan migrate --force

# Link storage
php artisan storage:link
```

## 4. Deployment via GitHub Actions

Create a `.github/workflows/deploy.yml` file:

```yaml
name: Deploy MediaFlow

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'

      - name: Install Dependencies
        run: composer install --no-ansi --no-dev --no-interaction --no-plugins --no-progress --no-scripts --optimize-autoloader

      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          script: |
            cd /var/www/mediaflow
            git pull origin main
            composer install --optimize-autoloader --no-dev
            php artisan migrate --force
            php artisan optimize
```

## 5. Performance Tips
- Use **Redis** for caching and sessions if possible.
- Use **S3** or a similar object storage for media files in a real production environment.
- Implement **Cloudflare** for CDN and additional security.
