import { z } from 'zod';

/**
 * Zod schemas for data validation matching MySQL schema constraints in schema.sql
 */

export const UserSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(255),
  email: z.string().email('Invalid email address').max(255),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/[A-Z]/, 'Password must contain at least one uppercase letter').regex(/[0-9]/, 'Password must contain at least one number'),
  display_name: z.string().min(1, 'Display name is required').max(255),

  avatar_url: z.string().url('Invalid URL').max(255).optional().nullable(),
  bio: z.string().max(1000).optional().nullable(),
});

export const SignupSchema = UserSchema.extend({
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type UserInput = z.infer<typeof UserSchema>;
export type SignupInput = z.infer<typeof SignupSchema>;

export const MediaContentSchema = z.object({
  uploader_id: z.number().positive(),
  type: z.enum(['photo', 'video']),
  title: z.string().min(1).max(255),
  description: z.string().max(2000).optional().nullable(),
  media_url: z.string().max(255),
  thumbnail_url: z.string().max(255),
  views_count: z.number().nonnegative().optional(),
  likes_count: z.number().nonnegative().optional(),
});

export const CommentSchema = z.object({
  media_id: z.number().positive(),
  author_id: z.number().positive(),
  content: z.string().min(1).max(5000),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type MediaContentInput = z.infer<typeof MediaContentSchema>;
export type CommentInput = z.infer<typeof CommentSchema>;
