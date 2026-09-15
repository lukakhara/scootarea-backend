// services/scooter.service.ts
import { prisma } from "../lib/index"; // adjust to your prisma client export
import type { Prisma } from "../../generated/prisma/client"; // adjust to your generated path
import type { ScooterQuery } from "../schemas/scooter";

export async function getScooters(query: ScooterQuery) {
  const {
    page,
    limit,
    sort,
    name,
    brand,
    engine,
    chargingTime,
    inStock,
    minPrice,
    maxPrice,
    minWeight,
    minMaxSpeed,
    releaseDateFrom,
  } = query;

  const where: Prisma.ScooterWhereInput = {
    ...(name && { name: { contains: name, mode: "insensitive" } }),
    ...(brand && brand.length > 0 && {
  brand: { in: brand, mode: "insensitive" }, }),
    ...(engine && { engine: { contains: engine, mode: "insensitive" } }),
    ...(chargingTime && { chargingTime: { contains: chargingTime, mode: "insensitive" } }),
    ...(inStock !== undefined && {
      stock: inStock ? { gt: 0 } : { equals: 0 },
    }),
    ...((minPrice !== undefined || maxPrice !== undefined) && {
      price: {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      },
    }),
    ...(minWeight !== undefined && {
      weight: { gte: minWeight },
    }),
    ...(minMaxSpeed !== undefined && {
      maxSpeed: { gte: minMaxSpeed },
    }),
    ...(releaseDateFrom !== undefined && {
      releaseDate: { gte: releaseDateFrom },
    }),
  };

  const orderBy = parseSort(sort);
  const skip = (page - 1) * limit;

  const [scooters, total] = await prisma.$transaction([
    prisma.scooter.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.scooter.count({ where }),
  ]);

  return {
    data: scooters,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getScooterById(id: string) {
  const scooter = await prisma.scooter.findUnique({ where: { id } });
  return scooter; // null if not found — controller decides how to respond
}



function parseSort(sort: string): Prisma.ScooterOrderByWithRelationInput {
  const isDescending = sort.startsWith("-");
  const field = isDescending ? sort.slice(1) : sort;
  return { [field]: isDescending ? "desc" : "asc" };
}

