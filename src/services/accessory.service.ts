// services/accessory.service.ts
import { prisma } from "../lib/index"; // adjust to your prisma client export
import type { Prisma } from "../../generated/prisma/client"; // adjust to your generated path
import type { AccessoryQuery } from "../schemas/accessory";

export async function getAccessories(query: AccessoryQuery) {
  const {
    page,
    limit,
    sort,
    name,
    brand,
    size,
    category,
    sex,
    compatibleWith,
    inStock,
    minPrice,
    maxPrice,
  } = query;

  const where: Prisma.AccessoryWhereInput = {
    ...(name && { name: { contains: name, mode: "insensitive" } }),
    ...(brand &&
      brand.length > 0 && {
        brand: { in: brand },
      }),
    ...(size && { size: { contains: size, mode: "insensitive" } }),
    ...(category &&
      category.length > 0 && {
        category: { in: category },
      }),
    ...(sex &&
      sex.length > 0 && {
        sex: { in: sex },
      }),
    ...(compatibleWith && {
      compatibleWith: { has: compatibleWith },
    }),
    ...(inStock !== undefined && {
      stock: inStock ? { gt: 0 } : { equals: 0 },
    }),
    ...((minPrice !== undefined || maxPrice !== undefined) && {
      price: {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      },
    }),
  };

  const orderBy = parseSort(sort);
  const skip = (page - 1) * limit;

  const [accessories, total] = await prisma.$transaction([
    prisma.accessory.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.accessory.count({ where }),
  ]);

  return {
    data: accessories,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

function parseSort(sort: string): Prisma.AccessoryOrderByWithRelationInput {
  const isDescending = sort.startsWith("-");
  const field = isDescending ? sort.slice(1) : sort;
  return { [field]: isDescending ? "desc" : "asc" };
}