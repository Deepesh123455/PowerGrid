import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Enterprise-grade validation middleware using Zod.
 * It validates the request body, query, and params against the provided schema.
 */
export const validateRequest = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            // Forward the ZodError to the global error handler
            next(error);
        }
    };
};
