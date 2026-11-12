import { prisma } from "../lib/prisma";
import type {
  AddressInput,
  UpdateAddressInput,
} from "../schemas/address.schema";

export async function getAddresses(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

export async function getAddressById(userId: string, id: string) {
  return prisma.address.findFirst({ where: { id, userId } }); // null if not found
}

export async function createAddress(userId: string, data: AddressInput) {
  return prisma.$transaction(async (tx) => {
    const count = await tx.address.count({ where: { userId } });
    // first address is always the default
    const isDefault = data.isDefault || count === 0;

    if (isDefault) {
      await tx.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return tx.address.create({ data: { ...data, isDefault, userId } });
  });
}

export async function updateAddress(
  userId: string,
  id: string,
  data: UpdateAddressInput,
) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.address.findFirst({ where: { id, userId } });
    if (!existing) return null;

    if (data.isDefault) {
      await tx.address.updateMany({
        where: { userId, isDefault: true, NOT: { id } },
        data: { isDefault: false },
      });
    }

    return tx.address.update({ where: { id }, data });
  });
}

export async function deleteAddress(userId: string, id: string) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.address.findFirst({ where: { id, userId } });
    if (!existing) return false;

    await tx.address.delete({ where: { id } });

    // if the default was deleted, promote the most recent remaining address
    if (existing.isDefault) {
      const next = await tx.address.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
      if (next) {
        await tx.address.update({
          where: { id: next.id },
          data: { isDefault: true },
        });
      }
    }

    return true;
  });
}