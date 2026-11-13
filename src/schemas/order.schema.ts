import { z } from "zod";
import { OrderStatus } from "../../generated/prisma/client";

const statusValues = Object.values(OrderStatus) as [
  OrderStatus,
  ...OrderStatus[],
];
export const orderStatusSchema = z.enum(statusValues);

const quantity = z.number().int().min(1).max(100);

const orderItemSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("scooter"), id: z.uuid(), quantity }),
  z.object({ type: z.literal("accessory"), id: z.uuid(), quantity }),
  z.object({ type: z.literal("sparePart"), id: z.uuid(), quantity }),
]);

export const createOrderSchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  customerEmail: z.email().trim().toLowerCase(),
  customerPhone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{7,20}$/, "Invalid phone number"),
  city: z.string().trim().min(2).max(100),
  street: z.string().trim().min(2).max(200),
  postalCode: z.string().trim().max(20),
  country: z.string().trim().max(100).default("Georgia"),
  items: z.array(orderItemSchema).min(1, "No items").max(50),
});

export const idParamSchema = z.object({
  id: z.uuid(),
});

export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema,
});

export const listOrdersQuerySchema = z.object({
  status: orderStatusSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type idParam = z.infer<typeof idParamSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type ListOrdersQuery = z.infer<typeof listOrdersQuerySchema>;
