import { AppError } from "@/errors/AppError";
import { Prisma, OrderStatus } from "../../generated/prisma/client";
import type {
  CreateOrderInput,
  OrderItemInput,
  ListOrdersQuery,
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

// Checks product, atomically reserves stock, returns server-side price + FK ref
const reserveItem = async (tx: Tx, item: OrderItemInput) => {
  const { id, quantity } = item;
  const stockWhere = { id, stock: { gte: quantity } };
  const decrement = { stock: { decrement: quantity } };

  switch (item.type) {
    case "scooter": {
      const p = await tx.scooter.findUnique({ where: { id } });
      if (!p) throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
      const r = await tx.scooter.updateMany({
        where: stockWhere,
        data: decrement,
      });
      if (r.count === 0) throw new AppError(ERROR_MESSAGES.OUT_OF_STOCK, 404);
      return { unitPrice: effectivePrice(p), ref: { scooterId: id } };
    }
    case "accessory": {
      const p = await tx.accessory.findUnique({ where: { id } });
      if (!p) throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
      const r = await tx.accessory.updateMany({
        where: stockWhere,
        data: decrement,
      });
      if (r.count === 0) throw new AppError(ERROR_MESSAGES.OUT_OF_STOCK, 404);
      return { unitPrice: effectivePrice(p), ref: { accessoryId: id } };
    }
    case "sparePart": {
      const p = await tx.sparePart.findUnique({ where: { id } });
      if (!p) throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
      const r = await tx.sparePart.updateMany({
        where: stockWhere,
        data: decrement,
      });
      if (r.count === 0) throw new AppError(ERROR_MESSAGES.OUT_OF_STOCK, 404);
      return { unitPrice: effectivePrice(p), ref: { sparePartId: id } };
    }
  }
};

export const createOrder = (input: CreateOrderInput, userId: string) =>
  prisma.$transaction(async (tx) => {
    let total = new Prisma.Decimal(0);
    const orderItems: Prisma.OrderItemCreateWithoutOrderInput[] = [];

    for (const item of input.items) {
      const { unitPrice, ref } = await reserveItem(tx, item);
      total = total.add(unitPrice.mul(item.quantity));
      orderItems.push({
        quantity: item.quantity,
        unitPrice,
        ...(ref.scooterId && { scooter: { connect: { id: ref.scooterId } } }),
        ...(ref.accessoryId && {
          accessory: { connect: { id: ref.accessoryId } },
        }),
        ...(ref.sparePartId && {
          SparePart: { connect: { id: ref.sparePartId } },
        }),
      });
    }

    const { items: _items, ...customer } = input;

    return tx.order.create({
      data: {
        ...customer,
        userId: userId,
        totalPrice: total,
        status: OrderStatus.PENDING,
        items: { create: orderItems },
      },
      include: { items: true },
    });
  });

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
