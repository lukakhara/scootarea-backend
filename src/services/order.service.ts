import { AppError } from "@/errors/AppError";
import { Prisma, OrderStatus } from "../../generated/prisma/client";
import type {
  CreateOrderInput,
  OrderItemInput,
  ListOrdersQuery,
  ProductType,
} from "../schemas/order.schema";
import { ERROR_MESSAGES } from "@/errors/errorMessages";
import { prisma } from "@/lib/prisma";
type Tx = Prisma.TransactionClient;

type Priced = {
  price: Prisma.Decimal;
  discountPrice: Prisma.Decimal | null;
  discountEndsAt: Date | null;
};

const effectivePrice = (p: Priced) => {
  const saleActive =
    p.discountPrice !== null &&
    (!p.discountEndsAt || p.discountEndsAt > new Date());
  return saleActive ? p.discountPrice! : p.price;
};

type ProductRow = { id: string; name: string; price: Prisma.Decimal };

const findProducts: Record<
  ProductType,
  (ids: string[]) => Promise<ProductRow[]>
> = {
  SCOOTER: (ids) =>
    prisma.scooter.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true, price: true },
    }),
  ACCESSORY: (ids) =>
    prisma.accessory.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true, price: true },
    }),
  SPARE_PART: (ids) =>
    prisma.sparePart.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true, price: true },
    }),
};

export async function createOrder(userId: string, input: CreateOrderInput) {
  const idsByType = new Map<ProductType, string[]>();
  for (const { productType, productId } of input.items) {
    idsByType.set(productType, [
      ...(idsByType.get(productType) ?? []),
      productId,
    ]);
  }

  const catalog = new Map<string, ProductRow>();
  for (const [type, ids] of idsByType) {
    const rows = await findProducts[type](ids);
    rows.forEach((row) => catalog.set(`${type}:${row.id}`, row));
  }

  const lines = input.items.map((item) => {
    const product = catalog.get(`${item.productType}:${item.productId}`);
    if (!product) {
      throw new Error(
        `Product not found: ${item.productType} ${item.productId}`,
      );
    }
    return {
      productType: item.productType,
      productId: item.productId,
      name: product.name,
      unitPrice: product.price,
      quantity: item.quantity,
    };
  });

  const total = lines.reduce(
    (sum, l) => sum.plus(l.unitPrice.mul(l.quantity)),
    new Prisma.Decimal(0),
  );

 return prisma.order.create({
  data: {
    userId,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    city: input.city,
    street: input.street,
    postalCode: input.postalCode,
    country: input.country,
    totalPrice: total,
    items: { create: lines },
  },
  include: { items: true },
});
}

const orderInclude = {
  items: { include: { scooter: true, accessory: true, SparePart: true } },
} satisfies Prisma.OrderInclude;

export const getUserOrders = (userId: string) =>
  prisma.order.findMany({
    where: { userId },
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });

export const getOrderById = async (
  id: string,
  user: { id: string; role: string },
) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: orderInclude,
  });
  if (!order) throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
  if (order.userId !== user.id && user.role !== "ADMIN")
    throw new AppError(ERROR_MESSAGES.FORBIDDEN, 403);
  return order;
};

export const cancelOrder = async (id: string, userId: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order || order.userId !== userId)
    throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
  if (order.status !== OrderStatus.PENDING)
    throw new AppError(ERROR_MESSAGES.CANNOT_CANCEL_THIS_ORDER, 400);

  return prisma.$transaction(async (tx) => {
    for (const i of order.items) {
      const data = { stock: { increment: i.quantity } };
      if (i.scooterId)
        await tx.scooter.update({ where: { id: i.scooterId }, data });
      else if (i.accessoryId)
        await tx.accessory.update({ where: { id: i.accessoryId }, data });
      else if (i.sparePartId)
        await tx.sparePart.update({ where: { id: i.sparePartId }, data });
    }
    return tx.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELLED },
    });
  });
};

export const getAllOrders = async ({
  status,
  page,
  limit,
}: ListOrdersQuery) => {
  const where = status ? { status } : {};
  const [data, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { user: { select: { id: true, email: true } }, items: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);
  return { data, total, page, limit };
};

export const updateOrderStatus = async (id: string, status: OrderStatus) => {
  const exists = await prisma.order.findUnique({ where: { id } });
  if (!exists) throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
  return prisma.order.update({ where: { id }, data: { status } });
};
