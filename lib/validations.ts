import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200, 'Name is too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be positive'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  category: z.string().min(1, 'Category is required'),
  sku: z.string().min(1, 'SKU is required').regex(/^[A-Z0-9-]+$/, 'SKU must be uppercase alphanumeric with hyphens'),
  brand: z.string().optional(),
  images: z.array(z.string().url()).optional().default([]),
  sales: z.number().int().min(0).default(0),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const adminOnboardSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type AdminOnboardData = z.infer<typeof adminOnboardSchema>;

