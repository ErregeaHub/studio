# MediaFlow

MediaFlow is a sleek, dark-themed content sharing platform designed for an engaging user experience. It allows users to upload, share, and discover photos and videos, sorted by popularity.

## Tech Stack

This project is built with a modern, performant, and type-safe technology stack:

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Database**: [MySQL](https://www.mysql.com/) (with `mysql2` and Repository Pattern)
-   **Validation**: [Zod](https://zod.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Component Library**: [shadcn/ui](https://ui.shadcn.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **State Management**: React Context API (Auth)

## Key Features

-   **Dynamic Feed**: Explore media sorted by newest, popularity, or views.
-   **Media Upload**: Support for both photos and videos.
-   **Interactive Detail Pages**: Like media, view counts, and post comments.
-   **User Profiles**: Dedicated pages for creators to showcase their uploads.
-   **Global Search**: Quickly find media by title or description.
-   **Authentication**: Centralized auth state for personalized interactions.

## Prerequisites

Before you begin, ensure you have the following installed on your system:
-   [Node.js](https://nodejs.org/) (v18 or later)
-   [MySQL](https://www.mysql.com/) server running locally or accessible via network.

## Database Setup

1.  **Environment Variables**:
    Create a `.env` file in the root directory and add your MySQL credentials:
    ```env
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=media
    ```

2.  **Initialize Database**:
    Run the following commands to create the tables and seed initial data:
    ```bash
    npm run migrate
    npm run seed
    ```

## Installation

To get the project set up locally:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

## Running the Application

### Development Mode

To run the app in development mode with live reloading:

```bash
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002).

### Production Mode

To build and run for production:

1.  **Build the application**:
    ```bash
    npm run build
    ```

2.  **Start the production server**:
    ```bash
    npm run start
    ```

## Project Structure

-   `/src/app`: Next.js App Router pages and API routes.
-   `/src/components`: Reusable UI components and layout elements.
-   `/src/lib/repositories`: Database access layer following the Repository Pattern.
-   `/src/context`: React Context providers (Auth).
-   `/src/scripts`: Database migration and seeding scripts.
