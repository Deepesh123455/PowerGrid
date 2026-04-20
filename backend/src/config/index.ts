import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface Config {
    env: string;
    port: number;
    database: {
        url?: string;
    };
    jwt: {
        accessSecret: string;
        accessExpiration: string;
        refreshSecret: string;
        refreshExpiration: string;
    };
    redis: {
        url?: string;
    };
    logging: {
        level: string;
    };
}

const config: Config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),
    database: {
        url: process.env.DATABASE_URL
    },
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET || 'fallback_access_secret',
        accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
        refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d'
    },
    redis: {
        url: process.env.REDIS_URL
    },
    logging: {
        level: process.env.LOG_LEVEL || 'info'
    }
};

export default config;
