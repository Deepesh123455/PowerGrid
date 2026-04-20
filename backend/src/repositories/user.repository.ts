import { db } from '../db/index.js';
import { users, User } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { IRepository } from '../interfaces/IRepository.js';
import { BaseRepository } from './BaseRepository.js';
import redisClient from '../config/redis.client.js';
import logger from '../utils/logger.js';
import { IUserRepository } from '../interfaces/IUserRepository.js';


export class UserRepository extends BaseRepository<User> implements IUserRepository {
    constructor() {
        super(users);
    }

    async find(id: string): Promise<User | null> {
        const result = await db.select().from(users).where(eq(users.userId, id)).limit(1);
        return result[0] || null;
    }

    async findAll(): Promise<User[]> {
        return await db.select().from(users);
    }

    async create(data: Partial<User>): Promise<User> {
        const result = await db.insert(users).values(data as any).returning();
        return result[0];
    }

    async update(id: string, data: Partial<User>): Promise<User | null> {
        // Fetch current user details to handle cache invalidation accurately
        const currentUser = await this.find(id);

        const result = await db.update(users).set(data).where(eq(users.userId, id)).returning();
        const updatedUser = result[0] || null;

        // Invalidation: Delete the old phone-number-based cache
        if (currentUser?.phoneNumber) {
            await redisClient.del(`user:phone:${currentUser.phoneNumber}`);
        }

        // Also delete the new phone number cache if it was changed
        if (updatedUser?.phoneNumber && updatedUser.phoneNumber !== currentUser?.phoneNumber) {
            await redisClient.del(`user:phone:${updatedUser.phoneNumber}`);
        }

        return updatedUser;
    }

    async delete(id: string): Promise<boolean> {
        const currentUser = await this.find(id);
        const result = await db.delete(users).where(eq(users.userId, id)).returning({ deletedId: users.userId });

        if (result.length > 0 && currentUser?.phoneNumber) {
            await redisClient.del(`user:phone:${currentUser.phoneNumber}`);
        }

        return result.length > 0;
    }

    async findByPhoneNumber(phoneNumber: string): Promise<any | null> {
        const cacheKey = `user:phone:${phoneNumber}`;
        const startTime = performance.now();

        try {
            // 1. Check Redis Cache
            const cachedUser = await redisClient.get(cacheKey);
            if (cachedUser) {
                const duration = (performance.now() - startTime).toFixed(2);
                logger.info(`[PERF] User Cache HIT for ${phoneNumber} - ${duration}ms`);
                return JSON.parse(cachedUser);
            }

            // 2. Cache Miss - Query Database
            const dbStartTime = performance.now();
            const result = await db
                .select({
                    userId: users.userId,
                    name: users.name,
                    email: users.email,
                    phoneNumber: users.phoneNumber,
                })
                .from(users)
                .where(eq(users.phoneNumber, phoneNumber))
                .limit(1);

            const user = result[0] || null;
            const dbDuration = (performance.now() - dbStartTime).toFixed(2);
            logger.info(`[PERF] DB Query for user ${phoneNumber} - ${dbDuration}ms`);

            // 3. Save to Cache if found (TTL 1 Hour)
            if (user) {
                await redisClient.set(cacheKey, JSON.stringify(user), 'EX', 3600);
            }

            const totalDuration = (performance.now() - startTime).toFixed(2);
            logger.info(`[PERF] findByPhoneNumber TOTAL - ${totalDuration}ms`);
            return user;
        } catch (error) {
            logger.error(`Redis User Cache Error: ${error}`);
            const dbStartTime = performance.now();
            const result = await db
                .select({
                    userId: users.userId,
                    name: users.name,
                    email: users.email,
                    phoneNumber: users.phoneNumber,
                })
                .from(users)
                .where(eq(users.phoneNumber, phoneNumber))
                .limit(1);
            const dbDuration = (performance.now() - dbStartTime).toFixed(2);
            logger.info(`[PERF] DB Query (Fallback) - ${dbDuration}ms`);
            return result[0] || null;
        }
    }
}
