import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis.client.js';
import logger from '../utils/logger.js';

/**
 * Middleware to cache HTTP GET responses in Redis.
 * @param durationInSeconds How long the response should be cached.
 */
export const cache = (durationInSeconds: number) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        const key = `cache:${req.originalUrl}`;

        try {
            const cachedData = await redisClient.get(key);

            if (cachedData) {
                // Return cached data immediately
                res.status(200).json(JSON.parse(cachedData));
                return;
            }

            // Hijack the res.json method so we can cache the response before sending it
            const originalJson = res.json.bind(res);

            // Override the res.json method
            res.json = (body: any) => {
                // If it's a successful response, we cache it
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    redisClient.set(key, JSON.stringify(body), 'EX', durationInSeconds).catch(err => {
                        logger.error(`Redis Cache Save Error: ${err}`);
                    });
                }
                
                // Call the original res.json to send the data to the client
                return originalJson(body);
            };

            next();
        } catch (error) {
            logger.error(`Redis Cache Read Error: ${error}`);
            // If Redis fails, continue without caching
            next();
        }
    };
};
