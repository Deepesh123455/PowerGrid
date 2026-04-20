import jwt from 'jsonwebtoken';
import { performance } from 'perf_hooks';
import config from '../config/index.js';
import redisClient from '../config/redis.client.js';
import logger from './logger.js';

/**
 * Parses e.g. "7d" into seconds for Redis EX
 */
const parseExpirationToSeconds = (expirationStr: string): number => {
    // Basic parser for "7d", "15m", "1h"
    const isDay = expirationStr.endsWith('d');
    const isHour = expirationStr.endsWith('h');
    const isMin = expirationStr.endsWith('m');
    const isSec = expirationStr.endsWith('s');
    
    const value = parseInt(expirationStr.replace(/[^0-9]/g, ''), 10);
    if (isNaN(value)) return 604800; // Default 7 days

    if (isDay) return value * 24 * 60 * 60;
    if (isHour) return value * 60 * 60;
    if (isMin) return value * 60;
    if (isSec) return value;
    
    return value; 
};

export const generateAndStoreTokens = async (userId: string) => {
    const startTime = performance.now();
    
    const accessToken = jwt.sign({ userId }, config.jwt.accessSecret, {
        expiresIn: config.jwt.accessExpiration as any,
    });

    const refreshToken = jwt.sign({ userId }, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiration as any,
    });

    const jwtDuration = (performance.now() - startTime).toFixed(2);
    logger.info(`[PERF] JWT Signing - ${jwtDuration}ms`);

    // Store in Redis with TTL
    const redisStartTime = performance.now();
    const ttlSeconds = parseExpirationToSeconds(config.jwt.refreshExpiration);
    // Key format: refresh_token:<userId>
    // We map it to the exact token so we can validate it later or revoke it easily.
    await redisClient.set(`refresh_token:${userId}`, refreshToken, 'EX', ttlSeconds);
    
    const redisDuration = (performance.now() - redisStartTime).toFixed(2);
    logger.info(`[PERF] Redis Refresh Token Store - ${redisDuration}ms`);

    const totalDuration = (performance.now() - startTime).toFixed(2);
    logger.info(`[PERF] generateAndStoreTokens TOTAL - ${totalDuration}ms`);

    return { accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken: string) => {
    try {
        const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as { userId: string };
        const userId = decoded.userId;

        const storedToken = await redisClient.get(`refresh_token:${userId}`);

        if (!storedToken || storedToken !== refreshToken) {
            return null;
        }

        const accessToken = jwt.sign({ userId }, config.jwt.accessSecret, {
            expiresIn: config.jwt.accessExpiration as any,
        });

        return accessToken;
    } catch (error) {
        return null;
    }
};
