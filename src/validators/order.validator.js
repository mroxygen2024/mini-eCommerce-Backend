import { z } from "zod";

export const createOrderSchema = z.object({
  products: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive()
    })
  )
});

export const updateOrderSchema = z.object({
  status: z.enum(["pending", "shipped", "delivered", "cancelled"])
});
