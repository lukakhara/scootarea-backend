import { z } from "zod";

// Enums mirrored from Prisma
export const genderEnum = z.enum(["MEN", "WOMEN", "UNISEX"]);

export const accessoryCategoryEnum = z.enum([
  "SAFETY_GEAR",
  "PROTECTION_MAINTENANCE",
  "STORAGE_CARRYING",
  "LIGHTING",
  "COMFORT_UPGRADES",
  "CHARGING_POWER",
]);

// Reusable helper: correctly coerces query-string booleans.
// z.coerce.boolean() treats any non-empty string (including "false") as true —
// this fixes that by checking the actual string value.
const booleanQueryParam = z.preprocess((val) => {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") {
    if (val.toLowerCase() === "false") return false;
    if (val.toLowerCase() === "true") return true;
  }
  return val;
}, z.boolean());

export const accessoryQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .min(4)
    .max(100)
    .optional()
    .default(10),

  locale: z.enum(["en", "ka"]).default("en"),

  sort: z.enum(["name", "-name", "price", "-price"]).default("name"),
  // Text filters
  name: z.string().trim().optional(),
  brand: z
    .string()
    .trim()
    .transform((v) =>
      v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    )
    .optional(),
  size: z.string().trim().optional(),

  // Enum filters — support comma-separated multi-select, e.g. ?category=LIGHTING,SAFETY_GEAR
  category: z
    .string()
    .trim()
    .transform((v) => v.split(",").map((s) => s.trim()))
    .pipe(z.array(accessoryCategoryEnum))
    .optional(),

  sex: z
    .string()
    .trim()
    .transform((v) => v.split(",").map((s) => s.trim()))
    .pipe(z.array(genderEnum))
    .optional(),

  // Compatibility filter — accessories that fit a given scooter id/name
  compatibleWith: z.string().trim().optional(),

  // Numeric range filters
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),

  // Stock filter
  inStock: booleanQueryParam.optional(),
});

export const idParamSchema = z.object({
  id: z.guid("Invalid id format"),
});

const translationSchema = z.object({
  locale: z.enum(["en", "ka"]),
  name: z.string().trim().min(1, "Name is required"),
  description: z
    .string()
    .trim()
    .min(10, "description must contain at least 10 characters")
    .optional(),
});

const translationsArray = z
  .array(translationSchema)
  .refine((arr) => new Set(arr.map((t) => t.locale)).size === arr.length, {
    message: "Duplicate locales",
  });

export const accessoryBaseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  size: z.string().trim().optional(),
  sex: genderEnum,
  category: accessoryCategoryEnum,
  price: z.coerce.number().positive("Price must be greater than 0"),
  discountPrice: z.coerce
    .number()
    .positive("Discount price must be greater than 0")
    .optional(),
  discountEndsAt: z.date().optional(),
  description: z.string().trim().optional(),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  images: z.array(z.url("Invalid image URL")),
  compatibleWith: z.array(z.string()),
  translations: z
    .array(translationSchema)
    .min(1, "At least one translation is required")
    .refine(
      (t) => new Set(t.map((x) => x.locale)).size === t.length,
      "Duplicate locale",
    ),
});

export const createAccessorySchema = accessoryBaseSchema.extend({
  stock: z.number().int().nonnegative("Stock cannot be negative").default(0),
  images: z.array(z.url("Invalid image URL")).default([]),
  compatibleWith: z.array(z.string()).default([]),
});

export const updateAccessorySchema = accessoryBaseSchema.partial().extend({
  translations: translationsArray.optional(),
});

export const localeQuerySchema = z.object({
  locale: z.enum(["en", "ka"]).default("en"),
});

// TypeScript types derived from the Zod schemas
export type AccessoryInput = z.infer<typeof createAccessorySchema>;
export type AccessoryUpdateInput = z.infer<typeof updateAccessorySchema>;

export type AccessoryQuery = z.infer<typeof accessoryQuerySchema>;
export type IdParam = z.infer<typeof idParamSchema>;
