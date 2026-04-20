import app from './app.js';
import config from './config/index.js';
import logger from './utils/logger.js';
import { pool } from './db/index.js';
import { Server } from 'http';

// Handle Uncaught Exceptions immediately
process.on('uncaughtException', (err: Error) => {
    logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    logger.error(err);
    process.exit(1);
});

const PORT = config.port || 5000;
let server: Server;

// Graceful shutdown logic
const gracefulShutdown = async (signal: string) => {
    logger.info(`👋 ${signal} RECEIVED. Shutting down gracefully...`);

    // Forcefully shut down if things take too long (e.g., 10 seconds)
    setTimeout(() => {
        logger.error('💥 Could not close connections in time, forcefully shutting down!');
        process.exit(1);
    }, 10000);

    if (server) {
        // 1. Stop accepting new HTTP requests
        server.close(async () => {
            logger.info('✅ HTTP server closed.');

            try {
                // 2. Drain and close the database connection pool
                logger.info('🐘 Closing database pool...');
                await pool.end();
                logger.info('✅ Database pool closed.');
                process.exit(0);
            } catch (err) {
                logger.error('❌ Error closing database pool', err);
                process.exit(1);
            }
        });
    } else {
        process.exit(0);
    }
};

// Verify Database Connection before starting the server
const startServer = async () => {
    try {
        const client = await pool.connect();
        logger.info('🐘 Database connected successfully');
        client.release();

        server = app.listen(PORT, () => {
            logger.info(`🛡️  Server listening on port: ${PORT} 🛡️`);
            logger.info(`🌍 Environment: ${config.env}`);
        });

        // Handle Unhandled Promise Rejections
        process.on('unhandledRejection', (err: Error) => {
            logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
            logger.error(err);
            gracefulShutdown('unhandledRejection');
        });

        // Handle SIGTERM (Sent by Docker/Kubernetes/Render on shutdown)
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

        // Handle SIGINT (Sent by Ctrl+C in local terminal)
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } catch (err) {
        logger.error('💥 Database connection failed!');
        logger.error(err);
        process.exit(1);
    }
};

startServer();