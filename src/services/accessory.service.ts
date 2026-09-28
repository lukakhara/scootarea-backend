// services/accessory.service.ts
import { prisma } from "../lib/prisma"; // adjust to your prisma client export
import type { Prisma } from "../../generated/prisma/client"; // adjust to your generated path
import type { AccessoryQuery, IdParam } from "../schemas/accessory";

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
        some: {
          locale,
          name: { contains: name, mode: "insensitive" },
        },
      },
    }),
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

  const skip = (page - 1) * limit;

  // Sorting by "name" can't be a direct DB orderBy anymore since name
  // lives on a related, locale-filtered table — handle it separately.
  const isNameSort = sort.replace(/^-/, "") === "name";
  const orderBy = isNameSort ? undefined : parseSort(sort);

  const [accessories, total] = await prisma.$transaction([
    prisma.accessory.findMany({
      where,
      ...(orderBy && { orderBy }),
      ...(isNameSort ? {} : { skip, take: limit }),
      include: {
        translations: {
          where: { locale },
        },
      },
    }),
    prisma.accessory.count({ where }),
  ]);

  // Flatten: pull the single locale-matched translation into name/description,
  // falling back to English if this locale is missing a translation row.
  let flattened = accessories.map((a) => {
    const translation = a.translations[0] ?? { name: "", description: null };
    const { translations, ...rest } = a;
    return {
      ...rest,
      name: translation.name,
      description: translation.description,
    };
  });

  if (isNameSort) {
    const isDescending = sort.startsWith("-");
    flattened = flattened.sort((a, b) =>
      isDescending
        ? b.name.localeCompare(a.name)
        : a.name.localeCompare(b.name),
    );
    // apply pagination manually since it couldn't happen in the DB query
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

function parseSort(sort: string): Prisma.AccessoryOrderByWithRelationInput {
  const isDescending = sort.startsWith("-");
  const field = isDescending ? sort.slice(1) : sort;
  return { [field]: isDescending ? "desc" : "asc" };
}

export async function getAccessoryById({ id }: IdParam) {
  const result = await prisma.accessory.findUnique({ where: { id } });
  return result;
}
