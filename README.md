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
