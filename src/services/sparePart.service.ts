import { prisma } from "../lib/prisma";
import type { Prisma } from "../../generated/prisma/client";
import type { SparePartQuery } from "../schemas/sparePart";

export async function getSpareParts(query: SparePartQuery) {
  const {
    page,
    limit,
    sort,
    locale,
    name,
    sku,
    manufacturer,
    color,
    category,
    compatibleWith,
    inStock,
    minPrice,
    maxPrice,
    minWeight,
    maxWeight,
  } = query;

  const where: Prisma.SparePartWhereInput = {
    ...(name && {
      translations: {
        some: { locale, name: { contains: name, mode: "insensitive" } },
      },
    }),
    ...(sku && { sku: { contains: sku, mode: "insensitive" } }),
    ...(manufacturer && {
      manufacturer: { contains: manufacturer, mode: "insensitive" },
    }),
    ...(color && { color: { contains: color, mode: "insensitive" } }),
    ...(category &&
      category.length > 0 && {
        category: { in: category },
      }),
    ...(compatibleWith && {
      compatibleModels: { some: { id: compatibleWith } },
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
    ...((minWeight !== undefined || maxWeight !== undefined) && {
      weight: {
        ...(minWeight !== undefined && { gte: minWeight }),
        ...(maxWeight !== undefined && { lte: maxWeight }),
      },
    }),
  };

  const skip = (page - 1) * limit;

  // "name" isn't a real column on SparePart anymore — it lives on the
  // locale-filtered translation relation, so it can't be sorted in the DB
  // query the same way. Handle it in-memory after fetching.
  const isNameSort = sort.replace(/^-/, "") === "name";
  const orderBy = isNameSort ? undefined : parseSort(sort);

  const [spareParts, total] = await prisma.$transaction([
    prisma.sparePart.findMany({
      where,
      ...(orderBy && { orderBy }),
      ...(isNameSort ? {} : { skip, take: limit }),
      include: {
        translations: { where: { locale } },
      },
    }),
    prisma.sparePart.count({ where }),
  ]);

  let flattened = spareParts.map(flattenTranslation);

  if (isNameSort) {
    const isDescending = sort.startsWith("-");
    flattened = flattened.sort((a, b) =>
      isDescending
        ? b.name.localeCompare(a.name)
        : a.name.localeCompare(b.name),
    );
    flattened = flattened.slice(skip, skip + limit);
  }

  return {
    data: flattened,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getSparePartById(id: string, locale: string) {
  const sparePart = await prisma.sparePart.findUnique({
    where: { id },
    include: {
      translations: { where: { locale } },
      compatibleModels: true, // detail pages likely want full compatibility list
    },
  });
  if (!sparePart) return null;
  return flattenTranslation(sparePart);
}

function flattenTranslation<
  T extends { translations: { name: string; description: string | null }[] },
>(part: T) {
  const translation = part.translations[0] ?? { name: "", description: null };
  const { translations, ...rest } = part;
  return {
    ...rest,
    name: translation.name,
    description: translation.description,
  };
}

function parseSort(sort: string): Prisma.SparePartOrderByWithRelationInput {
  const isDescending = sort.startsWith("-");
  const field = isDescending ? sort.slice(1) : sort;
  return { [field]: isDescending ? "desc" : "asc" };
}
