import { z } from "zod";
import { OrderStatus } from "@/generated/prisma/client";

const statusValues = Object.values(OrderStatus) as [
  OrderStatus,
  ...OrderStatus[],
];
export const orderStatusSchema = z.enum(statusValues);

export const productTypeSchema = z.enum(["SCOOTER", "ACCESSORY", "SPARE_PART"]);
export type ProductType = z.infer<typeof productTypeSchema>;

export const fulfillmentMethodSchema = z.enum(["DELIVERY", "STORE_PICKUP"]);
export type FulfillmentMethod = z.infer<typeof fulfillmentMethodSchema>;

export const OrderItemSchema = z.object({
  productType: productTypeSchema,
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(20),
});

// Fields shared by both fulfillment types
const orderBase = {
  customerFirstName: z.string().trim().min(2).max(100),
  customerLastName: z.string().trim().min(2).max(100),
  customerEmail: z.email().trim().toLowerCase(),
  customerPhone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{7,20}$/, "Invalid phone number"),
  commentary: z.string().trim().max(500).optional(),
  items: z.array(OrderItemSchema).min(1, "No items").max(50),
};

export const createOrderSchema = z.discriminatedUnion("delivery", [
  z.object({
    ...orderBase,
    delivery: z.literal("DELIVERY"),
    city: z.string().trim().min(2).max(100),
    street: z.string().trim().min(2).max(200),
  }),
  z.object({
    ...orderBase,
    delivery: z.literal("STORE_PICKUP"),
  }),
]);

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
export type OrderItemInput = z.infer<typeof OrderItemSchema>;
export type ListOrdersQuery = z.infer<typeof listOrdersQuerySchema>;