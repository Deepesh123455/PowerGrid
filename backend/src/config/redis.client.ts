import { Redis } from 'ioredis';
import config from './index.js';

let redisClient: Redis;

// Support redis connection 
if (config.redis.url) {
    redisClient = new Redis(config.redis.url);
} else {
    // Fallback or warning if redis isn't provided (useful for dev)
    console.warn('WARNING: No REDIS_URL provided. Redis will connect to localhost:6379 by default.');
    redisClient = new Redis();
}

redisClient.on('connect', () => {
    console.log('Redis client successfully connected');
});

redisClient.on('error', (err) => {
    console.error('Redis client error:', err);
});

export default redisClient;
