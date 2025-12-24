# API Blueprint

- Stack: Next.js App Router (`src/app/api`), server handlers return JSON via `NextResponse`.
- Calls: Client-side uses `fetch` with relative paths (no external base URL or axios).

## Endpoint Catalog

| Method | Path | Request | Response |
| :-- | :-- | :-- | :-- |
| GET | `/api/media` | none | `Array<{ id, uploader_id, type, title, description?, media_url, thumbnail_url, views_count, likes_count, created_at, username, display_name, avatar_url }>` (from `findAllWithDetails`) — `src/app/api/media/route.ts:7`
| POST | `/api/media` | `FormData { file: File; title: string; description: string; uploader_id: number; type: 'photo'|'video'; thumbnail?: File }` | `Media` object created — `src/app/api/media/route.ts:18`
| GET | `/api/media/:id` | none | `Media` with uploader details — `src/app/api/media/[id]/route.ts:4`
| DELETE | `/api/media/:id` | none | `{ message: string }` on success; `{ error: string }` otherwise — `src/app/api/media/[id]/route.ts:26`
| POST | `/api/media/:id/like` | JSON `{ action?: 'unlike' }` | `{ success: true }` — `src/app/api/media/[id]/like/route.ts:4`
| GET | `/api/media/:id/comments` | none | `Array<{ id, media_id, author_id, content, created_at, author_name, author_avatar }>` — `src/app/api/media/[id]/comments/route.ts:4`
| POST | `/api/media/:id/comments` | JSON `{ authorId: number; content: string }` | Newly created comment with author details — `src/app/api/media/[id]/comments/route.ts:26`
| GET | `/api/search?q=...` | query `q` | `Array<Media-with-uploader-details>` — `src/app/api/search/route.ts:3`
| GET | `/api/users/:username` | none | `{ user: User; media: Array<Media-with-uploader-details> }` — `src/app/api/users/[username]/route.ts:4`
| GET | `/api/users/:id/stats` | none | `{ followersCount: number; followingCount: number }` — `src/app/api/users/id/stats/route.ts:4`
| GET | `/api/users/:id/follow?follower_id=...` | query `follower_id` | `{ isFollowing: boolean }` — `src/app/api/users/id/follow/route.ts:39`
| POST | `/api/users/:id/follow` | JSON `{ followerId: number }` | `{ isFollowing: boolean }` (toggled) — `src/app/api/users/id/follow/route.ts:3`
| PUT | `/api/users/update/:id` | JSON `Partial<User>` | `User` (updated) — `src/app/api/users/id/update/[id]/route.ts:5`
| POST | `/api/auth/signup` | JSON `{ username, email, password, display_name }` (+ any extra validated by Zod) | `{ message: string; user: { id, username, email, display_name } }` — `src/app/api/auth/signup/route.ts:8`
| POST | `/api/auth/login` | JSON `{ email, password }` | `User` sans sensitive fields `{ id, username, email, display_name, avatar_url?, is_verified }` — `src/app/api/auth/login/route.ts:6`
| GET | `/api/auth/verify?token=...` | query `token` | `{ message: string }` or `{ error: string }` — `src/app/api/auth/verify/route.ts:3`
| GET | `/api/notifications?userId=...` | query `userId` | `Array<{ id, recipient_id, actor_id, type, reference_id?, is_read, created_at, actor_name, actor_avatar }>` — `src/app/api/notifications/route.ts:4`
| PUT | `/api/notifications/:id/read` | none | `{ success: true }` — `src/app/api/notifications/[id]/read/route.ts:3`
| GET | `/api/media-count` | none | `{ count: number }` — `src/app/api/media-count/route.ts:3`

## Where Each Endpoint Is Called

- `GET /api/media` in `src/app/page.tsx:17`.
- `POST /api/media` in `src/components/feed/create-post.tsx:116` and `src/app/uploads/page.tsx:113`.
- `GET /api/media/:id` in `src/app/media/[id]/page.tsx:44`.
- `DELETE /api/media/:id` in `src/app/media/[id]/page.tsx:164`.
- `POST /api/media/:id/like` in `src/app/media/[id]/page.tsx:130`.
- `GET /api/media/:id/comments` in `src/components/comment-section.tsx:35` and `src/components/feed/feed-post.tsx:54`.
- `POST /api/media/:id/comments` in `src/components/comment-section.tsx:56` and `src/components/feed/feed-post.tsx:92`.
- `GET /api/search?q=...` in `src/app/search/page.tsx:24`.
- `GET /api/users/:username` in `src/app/profile/[username]/page.tsx:85` and `src/app/settings/profile/[username]/page.tsx:37`.
- `GET /api/users/:id/stats` in `src/app/profile/[username]/page.tsx:31`.
- `GET /api/users/:id/follow?follower_id=...` in `src/app/profile/[username]/page.tsx:44` and `src/app/media/[id]/page.tsx:70`.
- `POST /api/users/:id/follow` in `src/app/profile/[username]/page.tsx:58` and `src/app/media/[id]/page.tsx:92`.
- `PUT /api/users/update/:id` in `src/app/settings/profile/[username]/page.tsx:81`.
- `POST /api/auth/signup` in `src/app/signup/page.tsx:44`.
- `POST /api/auth/login` in `src/context/AuthContext.tsx:40`.
- `GET /api/auth/verify?token=...` used during signup flow (server logs) — `src/app/api/auth/signup/route.ts:63`.
- `GET /api/notifications?userId=...` in `src/components/notifications/notification-bell.tsx:16` and `src/components/notifications/notification-list.tsx:33`.
- `PUT /api/notifications/:id/read` in `src/components/notifications/notification-list.tsx:50`.

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
  - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
  - `DB_WAIT_FOR_CONNECTIONS`, `DB_CONNECTION_LIMIT`, `DB_QUEUE_LIMIT`
  - `DB_SSL_REJECT_UNAUTHORIZED`, `NODE_ENV`
- Loader: `dotenv` in `src/lib/db.ts:1`.
- Usage: Database pool configured from `.env`; no API base URL env variables are used. All client calls use relative paths (`/api/...`).
- Setup:
  - Create `.env` and set DB credentials.
  - Ensure MySQL is reachable; default development uses `port=8889` in this repo.

