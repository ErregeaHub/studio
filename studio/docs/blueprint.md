# API Blueprint

- Stack: Next.js App Router (`src/app/api`), server handlers return JSON via `NextResponse`.
- Calls: Client-side uses `fetch` with relative paths (no external base URL or axios).

## Endpoint Catalog

| Method | Path | Request | Response |
| :-- | :-- | :-- | :-- |
| GET | `/api/media` | query `following=true&userId=ID` (optional) | `Array<Media>` (following feed or all media) — `src/app/api/media/route.ts:5`
| POST | `/api/media` | `FormData { file, title, description, uploader_id, type, thumbnail? }` | `Media` object (201) — `src/app/api/media/route.ts:27`
| GET | `/api/media/:id` | none | `Media` with uploader details — `src/app/api/media/[id]/route.ts:4`
| DELETE | `/api/media/:id` | none | `{ message: string }` (200) — `src/app/api/media/[id]/route.ts:28`
| POST | `/api/media/:id/like` | JSON `{ action?: 'unlike' }` | `{ success: true }` — `src/app/api/media/[id]/like/route.ts:4`
| GET | `/api/media/:id/comments` | none | `Array<Comment>` — `src/app/api/media/[id]/comments/route.ts:4`
| POST | `/api/media/:id/comments` | JSON `{ authorId, content }` | `Comment` (201) — `src/app/api/media/[id]/comments/route.ts:26`
| GET | `/api/search?q=...` | query `q` | `Array<{ type: 'user'\|'post', ...data }>` — `src/app/api/search/route.ts:4`
| GET | `/api/users/:id` | none | `{ user, media: Array<Media> }` — `src/app/api/users/[id]/route.ts:5`
| PATCH | `/api/users/:id` | JSON `Partial<User>` | `User` (updated) — `src/app/api/users/[id]/route.ts:39`
| GET | `/api/users/:id/stats` | none | `{ followersCount, followingCount }` — `src/app/api/users/[id]/stats/route.ts:4`
| GET | `/api/users/:id/follow` | query `follower_id` | `{ isFollowing: boolean }` — `src/app/api/users/[id]/follow/route.ts:52`
| POST | `/api/users/:id/follow` | JSON `{ followerId }` | `{ isFollowing: boolean }` — `src/app/api/users/[id]/follow/route.ts:4`
| GET | `/api/users/:id/followers` | none | `Array<User>` — `src/app/api/users/[id]/followers/route.ts:4`
| GET | `/api/users/:id/following` | none | `Array<User>` — `src/app/api/users/[id]/following/route.ts:4`
| POST | `/api/users/:id/avatar` | `FormData { avatar: File }` | `User` (updated) — `src/app/api/users/[id]/avatar/route.ts:5`
| POST | `/api/auth/signup` | JSON `{ username, email, password, display_name }` | `{ message, user }` — `src/app/api/auth/signup/route.ts:8`
| POST | `/api/auth/login` | JSON `{ email, password }` | `User` (success) — `src/app/api/auth/login/route.ts:6`
| POST | `/api/auth/password` | JSON `{ id, currentPassword, newPassword, confirmPassword }` | `{ message }` — `src/app/api/auth/password/route.ts:7`
| GET | `/api/auth/verify?token=...` | query `token` | `{ message }` or `{ error }` — `src/app/api/auth/verify/route.ts:3`
| POST | `/api/auth/verify/resend` | JSON `{ email }` | `{ message }` — `src/app/api/auth/verify/resend/route.ts:6`
| GET | `/api/notifications?userId=...` | query `userId` | `Array<Notification>` — `src/app/api/notifications/route.ts:4`
| PUT | `/api/notifications/:id/read` | none | `{ success: true }` — `src/app/api/notifications/[id]/read/route.ts:3`
| GET | `/api/media-count` | none | `{ count: number }` — `src/app/api/media-count/route.ts:4`

## Where Each Endpoint Is Called

- `GET /api/media` in `src/app/page.tsx:27` and `src/app/discover/page.tsx:20`.
- `POST /api/media` in `src/components/feed/create-post.tsx:129` and `src/app/uploads/page.tsx:107`.
- `GET /api/media/:id` in `src/app/media/[id]/page.tsx:44`.
- `DELETE /api/media/:id` in `src/app/media/[id]/page.tsx:164`.
- `POST /api/media/:id/like` in `src/app/media/[id]/page.tsx:130` and `src/components/feed/feed-post.tsx:147`.
- `GET /api/media/:id/comments` in `src/components/comment-section.tsx:38` and `src/components/feed/feed-post.tsx:57`.
- `POST /api/media/:id/comments` in `src/components/comment-section.tsx:54` and `src/components/feed/feed-post.tsx:98`.
- `GET /api/search?q=...` in `src/app/search/page.tsx:29`.
- `GET /api/users/:id` in `src/app/profile/[username]/page.tsx:94` and `src/app/settings/profile/[username]/page.tsx:45`.
- `PATCH /api/users/:id` in `src/app/settings/page.tsx:98` and `src/app/settings/profile/[username]/page.tsx:89`.
- `GET /api/users/:id/stats` in `src/app/profile/[username]/page.tsx:40`.
- `GET /api/users/:id/follow` in `src/app/profile/[username]/page.tsx:53` and `src/app/media/[id]/page.tsx:70`.
- `POST /api/users/:id/follow` in `src/app/profile/[username]/page.tsx:67` and `src/app/media/[id]/page.tsx:92`.
- `POST /api/users/:id/avatar` in `src/app/settings/page.tsx:76`.
- `POST /api/auth/signup` in `src/app/signup/page.tsx:47`.
- `POST /api/auth/login` in `src/context/AuthContext.tsx:42`.
- `POST /api/auth/password` in `src/app/settings/page.tsx:132`.
- `GET /api/auth/verify?token=...` in `src/app/verify/page.tsx:26`.
- `POST /api/auth/verify/resend` in `src/app/verify-email/page.tsx:43`.
- `GET /api/notifications?userId=...` in `src/components/notifications/notification-bell.tsx:21` and `src/components/notifications/notification-list.tsx:38`.
- `PUT /api/notifications/:id/read` in `src/components/notifications/notification-list.tsx:52`.

## Response Shapes (Summaries)

- Media (list/detail): `{ id: number, uploader_id: number, type: 'photo'|'video', title: string, description?: string, media_url: string, thumbnail_url: string, views_count: number, likes_count: number, created_at: string, username: string, display_name: string, avatar_url: string }` — `src/lib/repositories/media.repository.ts:75`.
- Comment: `{ id: number, media_id: number, author_id: number, content: string, created_at: string, author_name: string, author_avatar: string }` — `src/lib/repositories/comment.repository.ts:34`.
- User (public): `{ id, username, email, display_name, avatar_url?, bio?, is_verified }` — `src/lib/repositories/user.repository.ts:5`.
- Follow stats: `{ followersCount: number, followingCount: number }`.
- Follow toggle/status: `{ isFollowing: boolean }`.
- Auth signup: `{ message: string, user: { id, username, email, display_name } }`.
- Auth login: user object sans `password_hash` and `verification_token`.
- Notifications list: `{ id, recipient_id, actor_id, type: 'follow'|'comment'|'like', reference_id?, is_read, created_at, actor_name, actor_avatar }` — `src/lib/repositories/notification.repository.ts:28`.

## Environment & Configuration

- File: `.env` at project root.
- Keys:
  - `POSTGRES_URL`, `POSTGRES_HOST`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DATABASE`
  - `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`
  - `RESEND_API_KEY` (Resend email SDK)
  - `EMAIL_FROM` (Sender email identity)
  - `NEXT_PUBLIC_APP_URL` (Frontend URL for links)
  - `BLOB_READ_WRITE_TOKEN` (Vercel Blob storage)
- Loader: `dotenv` in `src/lib/db.ts:1`.
- Usage: Database pool configured from `.env`; Resend SDK for emails.
- Setup:
  - Create `.env` and set PostgreSQL/Resend credentials.
  - Database timeouts are tuned for remote Supabase connections (15s timeout).

