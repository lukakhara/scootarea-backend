import { Prisma, type FulfillmentMethod } from "../../generated/prisma/client";

export const FREE_DELIVERY_THRESHOLD = new Prisma.Decimal(1500);
export const DELIVERY_FEE = new Prisma.Decimal(10); // GEL, placeholder

export function calculateTotals(
  subtotal: Prisma.Decimal,
  delivery: FulfillmentMethod,
) {
  const deliveryFee =
    delivery === "DELIVERY" && subtotal.lte(FREE_DELIVERY_THRESHOLD)
      ? DELIVERY_FEE
      : new Prisma.Decimal(0);

  return { subtotal, deliveryFee, totalPrice: subtotal.plus(deliveryFee) };
}