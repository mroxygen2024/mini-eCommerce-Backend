import { z } from "zod";

export const addProductSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive().default(1)
});

export const updateQuantitySchema = z.object({
  quantity: z.number().int().positive()
});
