## Packages
framer-motion | Essential for premium page transitions, stagger effects, and smooth layout animations.

## Notes
- Enforces a permanent dark mode using CSS variables directly on `:root`.
- Uses `iconUrl` as dynamic string URLs directly from the database for App Cards.
- Implements `useLocation` from wouter for redirecting between public and admin routes.
- On home page mount, strictly prevents double-firing of visitor increment using a ref.
- Admin dashboard automatically checks `/api/auth/me` and kicks unauthenticated users to `/admin`.
