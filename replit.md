# TikTok GIP Masterclass Resources

## Project Overview
A modern web application for distributing TikTok GIP masterclass resources and tools. Features a public-facing resource store and a secure admin panel for managing courses and resources.

## Architecture Changes - Persistent Storage (File-Based)

### Storage System
The app now uses **file-based persistent storage** instead of database storage:

- **apps.json** - Stores all available apps/resources
  - Structure: Array of app objects with id, name, iconUrl, downloadLink, downloadCount
  - Auto-generated nextId based on existing apps

- **stats.json** - Stores visitor statistics
  - visitorCount: Increments each time a unique visitor loads the page

- **users.json** - Stores admin credentials
  - Automatically created with default admin user on first run
  - Credentials: username: "admin", password: "password123"

### Storage Implementation
**File:** `server/storage.ts`

The `FileStorage` class implements the `IStorage` interface with:
- `getApps()` - Read all apps from apps.json
- `createApp()` - Add new app with auto-incremented ID
- `updateApp()` - Modify existing app
- `deleteApp()` - Remove app by ID
- `incrementDownloadCount()` - Increase download counter
- `getStats()` - Calculate stats from files
- `incrementVisitorCount()` - Track unique visitors

### Data Persistence
✅ All operations are file-based and persistent:
- Apps added in admin panel remain after page refresh
- Download counts are saved permanently
- Visitor counts are tracked in stats.json
- Admin credentials are stored in users.json

### Development & Production
Works seamlessly in both environments:
- **Development:** Files stored in project root
- **Production (Render/GitHub):** Files persist in the deployed container
- No database required - pure JSON file storage

## Features
- Public Homepage with responsive dark-themed UI
- App Grid Display with real-time download counts
- Admin Panel for CRUD operations
- Download Tracking (persistent)
- Visitor Counter (persistent)
- WhatsApp Support Link: https://chat.whatsapp.com/FV0hykzlnqWCxu8f2ywfnq?mode=gi_t

## Tech Stack
- Frontend: React, TypeScript, Tailwind CSS, Vite
- Backend: Node.js, Express, TypeScript
- Storage: File-based JSON (no database required)
- Build: esbuild + Vite

## Running the Project

```bash
npm run dev
```

Access at `http://localhost:5000`

### Admin Credentials
- **Username:** admin
- **Password:** password123

## API Endpoints

### Public
- `GET /api/apps` - List all apps
- `GET /api/apps/:id` - Get app details
- `POST /api/apps/:id/download` - Increment download counter
- `GET /api/stats` - Get stats
- `POST /api/stats/visitor` - Increment visitor counter

### Admin (Authenticated)
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Current user info
- `POST /api/apps` - Create new app
- `PUT /api/apps/:id` - Update app
- `DELETE /api/apps/:id` - Delete app

## Branding
- App Name: **TikTok GIP Masterclass Resources**
- Hero: "TIKTOK GIP MASTERCLASS"
- Support: WhatsApp integration for community group
