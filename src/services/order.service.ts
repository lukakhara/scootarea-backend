import { AppError } from "@/errors/AppError";
import { ERROR_MESSAGES } from "@/errors/errorMessages";
import { prisma } from "@/lib/prisma";
import { Prisma, OrderStatus } from "../../generated/prisma/client";
import type {
  CreateOrderInput,
  ListOrdersQuery,
  ProductType,
} from "../schemas/order.schema";
import { calculateTotals } from "../helpers/order.pricing";

type Tx = Prisma.TransactionClient;

const DEFAULT_LOCALE = "en";

type ProductRow = {
  id: string;
  name: string;
  image: string | null;
  price: Prisma.Decimal;
  discountPrice: Prisma.Decimal | null;
  discountEndsAt: Date | null;
};

const effectivePrice = (p: ProductRow) => {
  const saleActive =
    p.discountPrice !== null &&
    (!p.discountEndsAt || p.discountEndsAt > new Date());
  return saleActive ? p.discountPrice! : p.price;
};

const pickName = (
  translations: { locale: string; name: string }[],
  fallback: string,
) =>
  (translations.find((t) => t.locale === DEFAULT_LOCALE) ?? translations[0])
    ?.name ?? fallback;

const priceSelect = {
  id: true,
  price: true,
  discountPrice: true,
  discountEndsAt: true,
  images: true,
} as const;

const translationSelect = {
  select: { locale: true, name: true },
} as const;

const loadProducts: Record<
  ProductType,
  (tx: Tx, ids: string[]) => Promise<ProductRow[]>
> = {
  SCOOTER: async (tx, ids) => {
    const rows = await tx.scooter.findMany({
      where: { id: { in: ids } },
      select: { ...priceSelect, name: true },
    });
    return rows.map(({ images, ...r }) => ({ ...r, image: images[0] ?? null }));
  },
  ACCESSORY: async (tx, ids) => {
    const rows = await tx.accessory.findMany({
      where: { id: { in: ids } },
      select: { ...priceSelect, brand: true, translations: translationSelect },
    });
    return rows.map(({ images, translations, brand, ...r }) => ({
      ...r,
      name: pickName(translations, brand),
      image: images[0] ?? null,
    }));
  },
  SPARE_PART: async (tx, ids) => {
    const rows = await tx.sparePart.findMany({
      where: { id: { in: ids } },
      select: { ...priceSelect, sku: true, translations: translationSelect },
    });
    return rows.map(({ images, translations, sku, ...r }) => ({
      ...r,
      name: pickName(translations, sku),
      image: images[0] ?? null,
    }));
  },
};

// Atomic: only decrements if enough stock is left (count 0 = not enough)
const decrementStock: Record<
  ProductType,
  (tx: Tx, id: string, qty: number) => Promise<Prisma.BatchPayload>
> = {
  SCOOTER: (tx, id, qty) =>
    tx.scooter.updateMany({
      where: { id, stock: { gte: qty } },
      data: { stock: { decrement: qty } },
    }),
  ACCESSORY: (tx, id, qty) =>
    tx.accessory.updateMany({
      where: { id, stock: { gte: qty } },
      data: { stock: { decrement: qty } },
    }),
  SPARE_PART: (tx, id, qty) =>
    tx.sparePart.updateMany({
      where: { id, stock: { gte: qty } },
      data: { stock: { decrement: qty } },
    }),
};

// Same product twice in the cart would violate @@unique([orderId, ...Id])
const mergeItems = (items: CreateOrderInput["items"]) => {
  const merged = new Map<
    string,
    { productType: ProductType; productId: string; quantity: number }
  >();
  for (const { productType, productId, quantity } of items) {
    const key = `${productType}:${productId}`;
    const existing = merged.get(key);
    if (existing) existing.quantity += quantity;
    else merged.set(key, { productType, productId, quantity });
  }
  return [...merged.values()];
};

export async function createOrder(userId: string, input: CreateOrderInput) {
  const requested = mergeItems(input.items);

  return prisma.$transaction(async (tx) => {
    // Load all products, one query per type
    const idsByType = new Map<ProductType, string[]>();
    for (const { productType, productId } of requested) {
      idsByType.set(productType, [
        ...(idsByType.get(productType) ?? []),
        productId,
      ]);
    }

    const catalog = new Map<string, ProductRow>();
    for (const [type, ids] of idsByType) {
      const rows = await loadProducts[type](tx, ids);
      rows.forEach((row) => catalog.set(`${type}:${row.id}`, row));
    }

    // Build lines with server-side prices and reserve stock
    const lines: Prisma.OrderItemUncheckedCreateWithoutOrderInput[] = [];
    let subtotal = new Prisma.Decimal(0);

    for (const { productType, productId, quantity } of requested) {
      const product = catalog.get(`${productType}:${productId}`);
      if (!product) throw new AppError(ERROR_MESSAGES.PRODUCT_NOT_FOUND, 404);

      const { count } = await decrementStock[productType](
        tx,
        productId,
        quantity,
      );
      if (count === 0)
        throw new AppError(ERROR_MESSAGES.INSUFFICIENT_STOCK, 409);

      const unitPrice = effectivePrice(product);
      subtotal = subtotal.plus(unitPrice.mul(quantity));

      lines.push({
        productType,
        scooterId: productType === "SCOOTER" ? productId : null,
        accessoryId: productType === "ACCESSORY" ? productId : null,
        sparePartId: productType === "SPARE_PART" ? productId : null,
        productName: product.name,
        productImage: product.image,
        quantity,
        unitPrice,
      });
    }

    const { deliveryFee, totalPrice } = calculateTotals(
      subtotal,
      input.delivery,
    );

    return tx.order.create({
      data: {
        userId,
        delivery: input.delivery,
        customerFirstName: input.customerFirstName,
        customerLastName: input.customerLastName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        commentary: input.commentary,
        // city/street only for delivery; stay NULL for pickup
        ...(input.delivery === "DELIVERY"
          ? { city: input.city, street: input.street }
          : {}),
        subtotal,
        deliveryFee,
        totalPrice,
        items: { create: lines },
      },
      include: { items: true },
    });
  });
}

const orderInclude = {
  items: { include: { scooter: true, accessory: true, sparePart: true } },
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

// Status change + stock restore in one transaction.
// The status guard in `where` prevents restoring stock twice on double-cancel.
const cancelAndRestock = (id: string, allowedFrom: OrderStatus[]) =>
  prisma.$transaction(async (tx) => {
    const { count } = await tx.order.updateMany({
      where: { id, status: { in: allowedFrom } },
      data: { status: OrderStatus.CANCELLED },
    });
    if (count === 0)
      throw new AppError(ERROR_MESSAGES.CANNOT_CANCEL_THIS_ORDER, 400);

    const items = await tx.orderItem.findMany({ where: { orderId: id } });
    for (const i of items) {
      const data = { stock: { increment: i.quantity } };
      if (i.scooterId)
        await tx.scooter.update({ where: { id: i.scooterId }, data });
      else if (i.accessoryId)
        await tx.accessory.update({ where: { id: i.accessoryId }, data });
      else if (i.sparePartId)
        await tx.sparePart.update({ where: { id: i.sparePartId }, data });
    }

    return tx.order.findUniqueOrThrow({ where: { id } });
  });

export const cancelOrder = async (id: string, userId: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!order || order.userId !== userId)
    throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);

  return cancelAndRestock(id, [OrderStatus.PENDING]);
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
  const order = await prisma.order.findUnique({
    where: { id },
    select: { status: true, delivery: true },
  });
  if (!order) throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);

  const isFinal =
    order.status === OrderStatus.CANCELLED ||
    order.status === OrderStatus.DELIVERED;
  const wrongType =
    (status === OrderStatus.SHIPPED && order.delivery !== "DELIVERY") ||
    (status === OrderStatus.READY_FOR_PICKUP &&
      order.delivery !== "STORE_PICKUP");

  if (isFinal || wrongType)
    throw new AppError(ERROR_MESSAGES.INVALID_STATUS_CHANGE, 400);

  if (status === OrderStatus.CANCELLED)
    return cancelAndRestock(id, [
      OrderStatus.PENDING,
      OrderStatus.PROCESSING,
      OrderStatus.READY_FOR_PICKUP,
    ]);

  return prisma.order.update({ where: { id }, data: { status } });
};
