  ## 1. Core Concept & Tech Stack
- **Concept:** A sleek, dark-themed content platform for sharing photos and videos.
- **Tech Stack:** Next.js (App Router), TypeScript, React, Tailwind CSS, shadcn/ui, `lucide-react`, mysql for database.
- **Fonts:** "Inter" for body, "Space Grotesk" for headlines.


- **`src/app/uploads/page.tsx` (Upload Page):**
  - only user on login can uploads media
  - A form within a `Card` for uploading media.
  - Fields: File input (with preview), Title (`Input`), Description (`Textarea`), and Category (`Photo`, 'Video').
  - Redirect if not authenticated + notify popup for login or make account.
  - The "Upload" button is disabled until the form is complete. On success, show a toast notification and redirect.

  - **`src/app/media/[id]/page.tsx` (Media Detail):**
  - Two-column layout.
  - **Left Column:** Full media display, title, description, and action buttons (Like, Share).
  - **Right Column:** Uploader's profile card and a comment section. List existing comments and provide a `Textarea` for new comments if authenticated.

  - **`src/app/` (Media Detail):**
  - user image or photo show on home page
 