import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string({
      message: 'Name is required',
    }).min(2, 'Name must be at least 2 characters long'),
    email: z.string({
      message: 'Email is required',
    }).email('Not a valid email address'),
    password: z.string({
      message: 'Password is required',
    }).min(8, 'Password must be at least 8 characters long'),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string({
      message: 'User ID is required',
    }),
  }),
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
    email: z.string().email('Not a valid email address').optional(),
    password: z.string().min(8, 'Password must be at least 8 characters long').optional(),
  }).strict(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>['body'];
export type UpdateUserParams = z.infer<typeof updateUserSchema>['params'];
export type UpdateUserBody = z.infer<typeof updateUserSchema>['body'];
