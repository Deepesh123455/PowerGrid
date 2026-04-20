import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    phoneNumber: z.string({
      message: 'Phone number is required',
    }).min(10, 'Invalid phone number'),
    password: z.string().optional(), // Relaxed for demo
  }),
});

export const updatePasswordSchema = z.object({
  body: z.object({
    newPassword: z.string({
      message: 'New password is required',
    }).min(8, 'Password must be at least 8 characters long'),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>['body'];
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>['body'];
