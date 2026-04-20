import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { sql } from 'drizzle-orm';

import AppError from './utils/AppError.js';
import globalErrorHandler from './middlewares/errorMiddleware.js';
import { db } from './db/index.js';

// Import your modular routers here
import authRouter from './routes/auth.routes.js';
// import userRouter from './routes/user.routes.js';
import forecastRouter from './routes/forecast.routes.js';
import activeApplianceRouter from './routes/activeAppliance.routes.js';
import loadGraphRouter from './routes/loadGraph.routes.js';
import applianceSessionRouter from './routes/applianceSession.routes.js';
import alertRouter from './routes/alert.routes.js';
import locationRouter from './routes/location.routes.js';
import billingRouter from './routes/billing.routes.js';
import chatRouter from './routes/chat.routes.js';

const app = express();

// 1) GLOBAL CONFIGURATION
// Trust the proxy if you are behind a reverse proxy (Nginx, AWS ALB, Render, etc.)
// This ensures req.ip and rate limiters work correctly.
app.set('trust proxy', 1);

// Set security HTTP headers
app.use(helmet());

// Global Request & Response Time Logging
// Format: METHOD URL STATUS SIZE - TIME ms
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// 2) INDUSTRY STANDARD CORS CONFIGURATION
// Load these from your .env file in production: ALLOWED_ORIGINS=https://myfrontend.com,https://admin.myfrontend.com
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:5173']; // Fallbacks for local dev

const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl requests, or Postman)
        // If you are strictly making a web API, you can remove the `!origin` check to block Postman.
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new AppError('Blocked by CORS', 403));
        }
    },
    credentials: true, // Essential if you are using cookies (e.g., JWT HttpOnly cookies)
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// Handle preflight requests for complex HTTP methods/headers
app.options('*', cors(corsOptions));


// 3) UTILITY & HEALTH ROUTES
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

import { cache } from './middlewares/cacheMiddleware.js';

// Database Test endpoint (Cached for 60 seconds)
app.get('/db-test', cache(60), async (req: Request, res: Response, next) => {
    try {
        const result = await db.execute(sql`SELECT NOW() as now`);
        res.status(200).json({
            status: 'success',
            message: 'Database check successful',
            data: result.rows[0]
        });
    } catch (err) {
        next(err);
    }
});


// 4) MOUNT MODULAR ROUTES
// Notice how clean this file is now? All route logic and validation goes inside these routers.
console.log('📍 Mounting routes...');
app.use('/api/v1/auth', authRouter); 
console.log('✅ /api/v1/auth');
// app.use('/api/v1/users', userRouter);
app.use('/api/v1/forecast', forecastRouter);
console.log('✅ /api/v1/forecast');
app.use('/api/v1/active-appliances', activeApplianceRouter);
console.log('✅ /api/v1/active-appliances');
app.use('/api/v1/load-graphs', loadGraphRouter);
console.log('✅ /api/v1/load-graphs');
app.use('/api/v1/alerts', alertRouter);
console.log('✅ /api/v1/alerts');
app.use('/api/v1/locations', locationRouter);
console.log('✅ /api/v1/locations');
app.use('/api/v1/billing', billingRouter);
console.log('✅ /api/v1/billing');
app.use('/api/v1', applianceSessionRouter);
console.log('✅ /api/v1 (applianceSession)');
app.use('/api/v1/chat', chatRouter);
console.log('✅ /api/v1/chat');

// 5) 404 HANDLER
app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 6) GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

export default app;