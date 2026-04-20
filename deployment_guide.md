# Deployment Guide: Powergrid

Follow these steps to deploy your application to **Render** (Backend) and **Vercel** (Frontend) without issues.

## Phase 1: Backend Deployment (Render)

1. **Create a new Web Service**:
   - Link your GitHub repository.
   - Choose the `main` branch.
2. **Configure Settings**:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/server.js`
3. **Add Environment Variables**:
   Go to the "Environment" tab in Render and add:
   - `DATABASE_URL`: (Your PostgreSQL connection string)
   - `REDIS_URL`: (Your Redis connection string)
   - `JWT_ACCESS_SECRET`: (Generate a long random string)
   - `JWT_REFRESH_SECRET`: (Generate a long random string)
   - `Test_Key_ID`: (Your Razorpay Test Key ID)
   - `Test_Key_Secret`: (Your Razorpay Test Key Secret)
   - `ALLOWED_ORIGINS`: `https://your-frontend-domain.vercel.app` (You'll get this after Phase 2)
   - `NODE_ENV`: `production`
   - `NPM_CONFIG_PRODUCTION`: `false` (IMPORTANT: This ensures devDependencies needed for build are not skipped)
4. **Database Push**:
   After the first build succeeds, you might need to run the database push locally pointing to the production database once, or add it to the build command: `npm install && npm run build && npm run db:push`.

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
