# Deployment Guide: Powergrid

Follow these steps to deploy your application to **Render** (Backend) and **Vercel** (Frontend) without issues.

## Phase 1: Backend Deployment (Render Blueprints - RECOMMENDED)

The most reliable way to deploy this monorepo is using the `render.yaml` file I created.

1. **Go to Render Dashboard**:
   - Click **"Blueprints"** in the sidebar.
   - Click **"New Blueprint Instance"**.
   - Select your GitHub repository.
2. **Review Settings**:
   - Render will automatically read the `render.yaml` and configure the "Root Directory", "Build Command", and "Start Command" for you.
3. **Environment Variables**:
   - During the setup, Render will ask you for values like `DATABASE_URL`, `REDIS_URL`, etc.
   - Fill them in from your dashboard.
4. **Deploy**:
   - Click "Deploy". This ensures the pathing is perfectly handled.

### Alternative: Manual Configuration
If you prefer to configure it manually, ensure these exact settings:
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `node dist/server.js`
- **NPM_CONFIG_PRODUCTION**: `false` (Standard Env Var)

---

## Phase 2: Frontend Deployment (Vercel)

1. **Import Project**:
   - Select your GitHub repository.
2. **Configure Project Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
3. **Build & Development Settings**:
   - Build Command: `npm install && npm run build`
   - Output Directory: `dist`
4. **Environment Variables**:
   Add the following:
   - `VITE_API_URL`: `https://your-backend-service.onrender.com/api/v1` (Get this from your Render dashboard)
   - `VITE_WEATHER_API_KEY`: (Your OpenWeatherMap API Key)
5. **Deploy**:
   Click "Deploy". Vercel will give you a production URL (e.g., `powergrid-frontend.vercel.app`).

---

## Phase 3: Final Synchronization (Crucial)

1. Once the Vercel deployment is finished, copy the **Vercel URL**.
2. Go back to your **Render Dashboard** -> **Environment Variables**.
3. Update `ALLOWED_ORIGINS` with your actual Vercel URL.
4. Render will automatically redeploy the backend.
5. Once redeployed, your frontend will be authorized to communicate with the backend.

## Troubleshooting Common "Mishaps"

- **CORS Errors**: Ensure `ALLOWED_ORIGINS` in Render *exactly* matches the Vercel URL (including `https://` but no trailing slash).
- **Mixed Content**: Ensure the `VITE_API_URL` uses `https://`.
- **Database Connection**: Ensure your Database provider allows incoming connections from Render's IP range (or set it to `0.0.0.0/0` if secure).
- **Missing Dist**: Ensure the Build command in Render includes `npm run build` so the `dist` folder is created for the start command.
