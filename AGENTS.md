# OpsPilot CRM - Frontend

This is the frontend application for OpsPilot CRM, a lightweight customer operations dashboard.

## App Root

This app root is `./workspace/frontend`

## Development

```bash
npm install
npm run dev
```

## Building

```bash
npm run build
```

## Environment Variables

Client code may only use:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon/public key

### Forbidden in browser code:
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_SECRET_KEY`
- `SUPABASE_DB_URL`
- `SUPABASE_ACCESS_TOKEN`
- Any private tokens or database connection strings

## Demo Mode

If Supabase environment variables are not configured, the app runs in demo mode with local sample data.

## Preserving the Shell

When modifying this application:
- Preserve the product shell, routes, components, and copy
- Only change what is necessary for data wiring or build repair
- Keep the existing visual direction and UI patterns
