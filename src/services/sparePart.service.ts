import { prisma } from "../lib/prisma";
import type { Prisma } from "../../generated/prisma/client";
import type {
  IdParam,
  SparePartInput,
  SparePartQuery,
  SparePartUpdateInput,
} from "../schemas/sparePart.schema";
import { AppError } from "@/errors/AppError";
import { ERROR_MESSAGES } from "@/errors/errorMessages";
import { flatten, parseSort, translationInclude } from "../lib/translations";

const compatibleModelsSelect = { select: { id: true } } as const;

export async function getSpareParts(query: SparePartQuery) {
  const {
    page,
    limit,
    sort,
    locale,
    name,
    sku,
    category,
    manufacturer,
    color,
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
    ...(category?.length && { category: { in: category } }),
    ...(manufacturer && {
      manufacturer: { contains: manufacturer, mode: "insensitive" },
    }),
    ...(color && { color: { equals: color, mode: "insensitive" } }),
    ...(compatibleWith && {
      compatibleModels: { some: { id: compatibleWith } },
    }),
    ...(inStock !== undefined && {
      stock: inStock ? { gt: 0 } : { lte: 0 },
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
  const isNameSort = sort.replace(/^-/, "") === "name";

  let data;
  let total: number;

  if (isNameSort) {
    // Query from the translation table so the DB sorts + paginates by name.
    const direction = sort.startsWith("-") ? "desc" : "asc";
    const tWhere: Prisma.SparePartTranslationWhereInput = {
      locale,
      sparePart: where,
    };
    const [rows, count] = await prisma.$transaction([
      prisma.sparePartTranslation.findMany({
        where: tWhere,
        orderBy: { name: direction },
        skip,
        take: limit,
        include: { sparePart: true },
      }),
      prisma.sparePartTranslation.count({ where: tWhere }),
    ]);
    data = rows.map(({ sparePart, name, description, locale }) => ({
      ...sparePart,
      name,
      description,
      locale,
    }));
    total = count;
  } else {
    const [rows, count] = await prisma.$transaction([
      prisma.sparePart.findMany({
        where,
        orderBy: parseSort(sort),
        skip,
        take: limit,
        include: translationInclude(locale),
      }),
      prisma.sparePart.count({ where }),
    ]);
    data = rows.map((r) => flatten(r, locale));
    total = count;
  }

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getSparePartById({
  id,
  locale,
}: IdParam & { locale: string }) {
  const result = await prisma.sparePart.findUnique({
    where: { id },
    include: {
      ...translationInclude(locale),
      compatibleModels: compatibleModelsSelect,
    },
  });
  if (!result) throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
  return flatten(result, locale);
}

export async function addSparePart(input: SparePartInput) {
  const { translations, compatibleModelIds, ...rest } = input;
  return await prisma.sparePart.create({
    data: {
      ...rest,
      translations: { create: translations },
      ...(compatibleModelIds?.length && {
        compatibleModels: {
          connect: compatibleModelIds.map((id) => ({ id })),
        },
      }),
    },
    include: {
      translations: true,
      compatibleModels: compatibleModelsSelect,
    },
  });
}

export async function updateSparePart(id: string, body: SparePartUpdateInput) {
  const { translations, compatibleModelIds, ...rest } = body;
  return await prisma.$transaction(async (tx) => {
    await tx.sparePart.update({
      where: { id },
      data: {
        ...rest,
        ...(compatibleModelIds && {
          compatibleModels: {
            set: compatibleModelIds.map((modelId) => ({ id: modelId })),
          },
        }),
      },
    });

    for (const t of translations ?? []) {
      await tx.sparePartTranslation.upsert({
        where: { sparePartId_locale: { sparePartId: id, locale: t.locale } },
        update: { name: t.name, description: t.description },
        create: { sparePartId: id, ...t },
      });
    }

    return tx.sparePart.findUniqueOrThrow({
      where: { id },
      include: {
        translations: true,
        compatibleModels: compatibleModelsSelect,
      },
    });
  });
}

export async function deleteSparePart(id: string) {
  return await prisma.sparePart.delete({ where: { id } });
}
