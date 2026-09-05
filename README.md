# Yappers

This repository contains separate frontend and backend applications:

- `Frontend/` - Next.js application
- `backend/` - Express API server

## Frontend

```bash
cd Frontend
cp .env.local.example .env.local
npm install
npm run dev
```

## Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The backend health check is available at `http://localhost:4000/api/health`.

## Deployment

### Vercel (frontend)

Create a Vercel project from this repository with **Root Directory** set to `Frontend`.
The framework is detected as Next.js. Add:

```text
NEXT_PUBLIC_SUPABASE_URL=<your Supabase project URL>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your Supabase publishable key>
NEXT_PUBLIC_BACKEND_URL=https://<your-render-service>.onrender.com
```

`NEXT_PUBLIC_BACKEND_URL` is embedded at build time, so redeploy Vercel after changing it.

### Render (backend)

Render can use [`render.yaml`](./render.yaml), or configure a Web Service manually:

- Root directory: `backend`
- Build command: `npm ci`
- Start command: `npm start`
- Health check: `/api/health`

Set every `sync: false` variable from [`backend/.env.example`](./backend/.env.example) in the Render dashboard. Set `FRONTEND_URL` to the exact Vercel origin, including `https://` and without a trailing slash. Multiple origins may be comma-separated.

Deploy Render first, copy its public URL into Vercel as `NEXT_PUBLIC_BACKEND_URL`, then redeploy Vercel.

Browser microphone/camera access and audio playback require HTTPS in production. Vercel and Render provide HTTPS automatically.
