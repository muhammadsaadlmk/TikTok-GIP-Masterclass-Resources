# TikTok GIP Masterclass Resources

A modern, responsive web application for distributing TikTok GIP masterclass resources and tools. Features a public-facing resource store and a secure admin panel for managing courses and resources.

## Features

- **Public Homepage** - Modern dark-themed UI with app grid display
- **App Cards** - Show app icon, name, download count, and download button
- **Download Tracking** - Automatic counter increment on downloads
- **Admin Panel** - Secure login to manage apps
- **CRUD Operations** - Add, edit, delete apps
- **Dropbox Integration** - Direct links to Dropbox downloads
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Visitor Counter** - Track unique visitors per session

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Build**: esbuild + Vite

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd dev-tools-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Required variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `SESSION_SECRET` - Secret for session management (auto-generated in production)
   - `NODE_ENV` - Set to `development` or `production`
   - `PORT` - Server port (default: 5000)

4. **Push database schema**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   Access at `http://localhost:5000`

### Admin Login

Default credentials:
- **Username**: `admin`
- **Password**: `admin`

## Build & Production

### Building

```bash
npm run build
```

This will:
1. Build the React frontend with Vite → `dist/public/`
2. Compile the Express server with esbuild → `dist/index.cjs`

### Running Production Build Locally

```bash
npm run build
npm start
```

Access at `http://localhost:5000`

### Environment Variables for Production

- `DATABASE_URL` - PostgreSQL connection string (required)
- `SESSION_SECRET` - Secret key for sessions (required)
- `NODE_ENV` - Must be set to `production`
- `PORT` - Dynamic port (Render will set this automatically)

## Deployment

### Deploy to Render.com

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Create Render Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Choose the branch to deploy

3. **Configure Build & Runtime**
   - **Name**: `dev-tools-store` (or your preferred name)
   - **Environment**: Node
   - **Build Command**: 
     ```
     npm install && npm run build
     ```
   - **Start Command**: 
     ```
     npm start
     ```
   - **Instance Type**: Free tier is fine for testing

4. **Add Environment Variables**
   - Go to "Environment" tab
   - Add the following:
     - `NODE_ENV`: `production`
     - `SESSION_SECRET`: Generate a secure random string (e.g., `openssl rand -hex 32`)
     - `DATABASE_URL`: Your PostgreSQL connection string

5. **Deploy**
   - Render will automatically deploy on every push to main

### Deploy to Render with PostgreSQL

If you don't have PostgreSQL yet:

1. In Render Dashboard, create a new PostgreSQL database
2. Copy the connection string
3. Add it as `DATABASE_URL` in your web service environment
4. Render will automatically create/initialize the database on first run

### Database Migration

When deploying with a new database:
1. The first deployment will initialize the schema automatically via `npm run db:push`
2. Subsequent deployments will handle schema updates

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── App.tsx        # Main app component
│   │   └── index.css      # Tailwind & global styles
│   ├── index.html         # Entry HTML
│   └── public/            # Static assets
├── server/                # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database access layer
│   ├── db.ts              # Database connection
│   ├── static.ts          # Static file serving
│   └── vite.ts            # Vite dev server setup
├── shared/                # Shared types & schemas
│   ├── schema.ts          # Drizzle ORM schemas
│   └── routes.ts          # API contract definitions
├── script/
│   └── build.ts           # Build script
├── dist/                  # Production build (generated)
│   ├── index.cjs          # Bundled server
│   └── public/            # Built frontend
├── package.json
├── vite.config.ts         # Vite configuration
├── drizzle.config.ts      # Drizzle ORM configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## API Endpoints

### Public Endpoints

- `GET /api/apps` - List all apps
- `GET /api/apps/:id` - Get app details
- `POST /api/apps/:id/download` - Increment download counter
- `GET /api/stats` - Get visitor and download stats
- `POST /api/stats/visitor` - Increment visitor counter

### Admin Endpoints (Requires Authentication)

- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/me` - Get current admin
- `POST /api/apps` - Create new app
- `PUT /api/apps/:id` - Update app
- `DELETE /api/apps/:id` - Delete app

## Troubleshooting

### Build fails: "Could not find the build directory"
- Run `npm run build` first to generate the frontend build

### Database connection error
- Check that `DATABASE_URL` is set correctly
- For Render, ensure the PostgreSQL service is created and the connection string is in environment variables

### Port already in use
- Change PORT environment variable: `PORT=3001 npm start`

### Static files not serving in production
- Ensure `npm run build` completed successfully
- Check that `dist/public/` directory exists with built files

## License

MIT

## Support

For issues or questions:
- Open an issue on GitHub
- Contact via email or WhatsApp (configured in the app)
