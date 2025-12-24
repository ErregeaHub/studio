# MediaFlow

MediaFlow is a sleek, dark-themed content sharing platform designed for an engaging user experience. It allows users to upload, share, and discover photos and videos, sorted by popularity.

## Table of Contents

-   [Tech Stack](#tech-stack)
-   [Key Features](#key-features)
-   [Quick Start](#quick-start)
-   [Project Structure](#project-structure)
-   [Running the Application](#running-the-application)

## Tech Stack

This project is built with a modern, performant, and type-safe technology stack:

| Category          | Technology       | Description                                      |
| :---------------- | :--------------- | :----------------------------------------------- |
| **Framework**     | Next.js 15       | React framework for production                   |
| **Database**      | MySQL            | Relational database with `mysql2` and Repository Pattern |
| **Validation**    | Zod              | Schema declaration and validation library        |
| **Styling**       | Tailwind CSS     | Utility-first CSS framework                      |
| **Components**    | shadcn/ui        | Reusable UI components                           |
| **Icons**         | Lucide React     | Beautiful and customizable open-source icons     |
| **State Management** | React Context API | Centralized authentication state management      |

## Key Features

-   **Dynamic Feed**: Explore media sorted by newest, popularity, or views.
-   **Media Upload**: Support for both photos and videos.
-   **Interactive Detail Pages**: Like media, view counts, and post comments.
-   **User Profiles**: Dedicated pages for creators to showcase their uploads.
-   **Global Search**: Quickly find media by title or description.
-   **Authentication**: Centralized auth state for personalized interactions.

## Quick Start

Get MediaFlow up and running in a few simple steps:

1.  **Prerequisites**:
    *   Node.js (v18 or later)
    *   MySQL server (local or accessible via network)

2.  **Environment Setup**:
    *   Create a `.env` file in the root with your MySQL credentials:
        ```env
        DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD=
        DB_NAME=media
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```
    *   Initialize the database:
        ```bash
        npm run migrate
        npm run seed
        ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Access the application at [http://localhost:9002](http://localhost:9002).

## Project Structure

The project follows a structured approach to ensure maintainability and scalability. Below is an overview of the main directories and their purposes:

| Directory           | Description                                                               |
| :------------------ | :------------------------------------------------------------------------ |
| `/src/app`          | Next.js App Router pages, API routes, and route-specific components.      |
| `/src/components`   | Reusable UI components, shared across different parts of the application. |
| `/src/context`      | React Context API providers for global state management (e.g., Auth).     |
| `/src/hooks`        | Custom React hooks for encapsulating reusable logic.                      |
| `/src/lib`          | Utility functions, helpers, and the database access layer (repositories). |
| `/src/scripts`      | Database migration and seeding scripts, and other utility scripts.        |
| `/src/tests`        | Unit and integration tests for various parts of the application.          |
| `/public`           | Static assets served directly by Next.js (e.g., images, fonts).           |
| `/node_modules`     | Directory containing all installed Node.js modules and dependencies.      |
| `/docs`             | Project documentation and additional resources.                           |

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
