// services/accessory.service.ts
import { prisma } from "../lib/prisma"; // adjust to your prisma client export
import type { Prisma } from "../../generated/prisma/client"; // adjust to your generated path
import type {
  AccessoryInput,
  AccessoryQuery,
  AccessoryUpdateInput,
  IdParam,
} from "../schemas/accessory.schema";
import { AppError } from "@/errors/AppError";
import { ERROR_MESSAGES } from "@/errors/errorMessages";
import { flatten, parseSort, translationInclude } from "@/lib/translations";





export async function getAccessories(query: AccessoryQuery) {
  const {
    page,
    limit,
    sort,
    locale,
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
    ...(name && {
      translations: {
        some: { locale, name: { contains: name, mode: "insensitive" } },
      },
    }),
    ...(brand?.length && { brand: { in: brand } }),
    ...(size && { size: { contains: size, mode: "insensitive" } }),
    ...(category?.length && { category: { in: category } }),
    ...(sex?.length && { sex: { in: sex } }),
    ...(compatibleWith && { compatibleWith: { has: compatibleWith } }),
    ...(inStock !== undefined && {
      stock: inStock ? { gt: 0 } : { lte: 0 },
    }),
    ...((minPrice !== undefined || maxPrice !== undefined) && {
      price: {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
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
    const tWhere: Prisma.AccessoryTranslationWhereInput = {
      locale,
      accessory: where,
    };
    const [rows, count] = await prisma.$transaction([
      prisma.accessoryTranslation.findMany({
        where: tWhere,
        orderBy: { name: direction },
        skip,
        take: limit,
        include: { accessory: true },
      }),
      prisma.accessoryTranslation.count({ where: tWhere }),
    ]);
    data = rows.map(({ accessory, name, description, locale }) => ({
      ...accessory,
      name,
      description,
      locale,
    }));
    total = count;
  } else {
    const [rows, count] = await prisma.$transaction([
      prisma.accessory.findMany({
        where,
        orderBy: parseSort(sort),
        skip,
        take: limit,
        include: translationInclude(locale),
      }),
      prisma.accessory.count({ where }),
    ]);
    data = rows.map((r) => flatten(r, locale));
    total = count;
  }

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getAccessoryById({
  id,
  locale,
}: IdParam & { locale: string }) {
  const result = await prisma.accessory.findUnique({
    where: { id },
    include: translationInclude(locale),
  });
  if (!result) throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
  return flatten(result, locale);
}

export async function updateAccessory(id: string, body: AccessoryUpdateInput) {
  const { translations, ...rest } = body;
  try {
    return await prisma.$transaction(async (tx) => {
      await tx.accessory.update({ where: { id }, data: rest });

      if (translations?.length) {
        await Promise.all(
          translations.map((t) =>
            tx.accessoryTranslation.upsert({
              where: {
                accessoryId_locale: { accessoryId: id, locale: t.locale },
              },
              update: { name: t.name, description: t.description },
              create: { accessoryId: id, ...t },
            }),
          ),
        );
      }

      return tx.accessory.findUniqueOrThrow({
        where: { id },
        include: { translations: true },
      });
    });
  } catch (e) {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
  }
}

export async function addAccessory(input: AccessoryInput) {
  const { translations, ...rest } = input;

  return prisma.accessory.create({
    data: {
      ...rest,
      translations: { create: translations },
    },
    include: { translations: true },
  });
}

export async function deleteAccessory(id: string) {
  try {
    return await prisma.accessory.delete({ where: { id } });
  } catch (e) {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
  }
}
