import { Prisma } from "../../generated/prisma/client";
import { AppError } from "@/errors/AppError";
import { ERROR_MESSAGES } from "@/errors/errorMessages";

export const FALLBACK_LOCALE = "en";

type WithTranslations = {
  translations: { locale: string; name: string; description: string | null }[];
};

export function flatten<T extends WithTranslations>(item: T, locale: string) {
  const { translations, ...rest } = item;
  const t =
    translations.find((x) => x.locale === locale) ??
    translations.find((x) => x.locale === FALLBACK_LOCALE);
  return {
    ...rest,
    name: t?.name ?? "",
    description: t?.description ?? null,
    locale: t?.locale ?? null,
  };
}

export const translationInclude = (locale: string) => ({
  translations: { where: { locale: { in: [locale, FALLBACK_LOCALE] } } },
});

export function parseSort(sort: string) {
  const isDescending = sort.startsWith("-");
  const field = isDescending ? sort.slice(1) : sort;
  return { [field]: isDescending ? "desc" : "asc" } as Record<string, "asc" | "desc">;
}

export function handleNotFound(e: unknown): never {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
    throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
  }
  throw e;
}