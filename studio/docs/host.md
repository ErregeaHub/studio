# Deployment Guide

This guide provides step-by-step instructions on how to deploy this Next.js application to Vercel or Netlify.

## General Settings

*   **Build Command**: `next build`
*   **Output Directory**: `.next`

## Environment Variables

The following environment variables need to be configured in your hosting provider's dashboard.

## Database Configuration

The application uses PostgreSQL (via Supabase or other providers). It supports several environment variable prefixes and connection strings:

*   `POSTGRES_URL`: The full connection string (recommended for Supabase/Vercel).
*   `DATABASE_URL`: Alternative full connection string.
*   `SUPABASE_HOST`, `SUPABASE_PORT`, `SUPABASE_USER`, `SUPABASE_PASSWORD`, `SUPABASE_DATABASE`
*   `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DATABASE`
*   `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `DATABASE_NAME`
*   `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`

*   `DATABASE_SSL`: Set to `true` (default) to enable SSL, or `false` to disable. Supabase requires SSL.

### Cloud Storage (Vercel Blob)

*   `BLOB_READ_WRITE_TOKEN`: Your Vercel Blob read/write token. This is automatically generated when you create a Blob store in the Vercel dashboard.

## Supabase Integration

The application is configured to work with Supabase PostgreSQL. Ensure you enable SSL by setting `DATABASE_SSL=true` in your environment variables for a secure connection. You can use either the direct connection parameters or the pooled connection parameters provided by Supabase.

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
