# Deployment Guide

This guide provides step-by-step instructions on how to deploy this Next.js application to Vercel or Netlify.

## General Settings

*   **Build Command**: `next build`
*   **Output Directory**: `.next`

## Environment Variables

The following environment variables need to be configured in your hosting provider's dashboard.

### Database (MySQL / TiDB Cloud)

*   `DB_HOST`: Your database host.
*   `DB_PORT`: The port your database is listening on (e.g., `3306` for MySQL, `4000` for TiDB).
*   `DB_USER`: The username for your database.
*   `DB_PASSWORD`: The password for your database user.
*   `DB_NAME`: The name of your database.
*   `DB_WAIT_FOR_CONNECTIONS`: Set to `true` or `false` depending on your database connection pooling strategy.
*   `DB_CONNECTION_LIMIT`: The maximum number of connections in the pool (e.g., `10`).
*   `DB_SSL`: Set to `true` to explicitly enable SSL (recommended for TiDB Cloud).
*   `DB_SSL_REJECT_UNAUTHORIZED`: Set to `true` or `false` for SSL certificate validation. Defaults to `true` if not specified.

### Cloud Storage (Vercel Blob)

*   `BLOB_READ_WRITE_TOKEN`: Your Vercel Blob read/write token. This is automatically generated when you create a Blob store in the Vercel dashboard.

## TiDB Cloud Integration

Since TiDB is MySQL-compatible, the application uses the `mysql2/promise` library. Ensure you enable SSL by setting `DB_SSL=true` in your environment variables for a secure connection to TiDB Cloud.

## Vercel Blob Integration

The application is configured to use Vercel Blob for media uploads. When deploying to Vercel:
1. Go to the "Storage" tab in your Vercel project dashboard.
2. Click "Create Database" and select "Blob".
3. Once created, the `BLOB_READ_WRITE_TOKEN` will be automatically added to your project's environment variables.

## Deployment to Vercel

1.  **Connect your Git Repository**:
    *   Log in to your Vercel account.
    *   Click "Add New..." -> "Project".
    *   Select your Git repository (GitHub, GitLab, Bitbucket).
    *   Import the project.

2.  **Configure Project**:
    *   Vercel should automatically detect that it's a Next.js project.
    *   **Build Command**: Ensure it's set to `next build`.
    *   **Output Directory**: Ensure it's set to `.next`.

3.  **Add Environment Variables**:
    *   In your project settings on Vercel, navigate to "Environment Variables".
    *   Add each of the environment variables listed above with their respective values.

4.  **Deploy**:
    *   Click "Deploy". Vercel will build and deploy your application.

## Deployment to Netlify

1.  **Connect your Git Repository**:
    *   Log in to your Netlify account.
    *   Click "Add new site" -> "Import an existing project".
    *   Connect to your Git provider (GitHub, GitLab, Bitbucket).
    *   Select your repository.

2.  **Configure Build Settings**:
    *   **Owner**: Your Git account.
    *   **Branch to deploy**: Usually `main` or `master`.
    *   **Base directory**: Leave empty if your project is at the root of the repository.
    *   **Build command**: `next build`
    *   **Publish directory**: `.next`

3.  **Add Environment Variables**:
    *   In your site settings on Netlify, navigate to "Build & deploy" -> "Environment".
    *   Under "Environment variables", click "Add a variable" and add each of the environment variables listed above with their respective values.

4.  **Deploy Site**:
    *   Click "Deploy site". Netlify will build and deploy your application.
