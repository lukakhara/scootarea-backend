import { z } from "zod";

const sparePartCategoryEnum = z.enum([
  "BRAKE_PADS",
  "TIRES_TUBES",
  "MOTOR_PARTS",
  "BATTERY_CELLS",
  "WHEELS",
  "BEARINGS",
  "CABLES_WIRING",
  "CONTROLLER",
  "DISPLAY_PANEL",
  "SUSPENSION_PARTS",
  "SCREWS_BOLTS",
  "OTHER",
]);

const localeEnum = z.enum(["en", "ka"]);

export const sparePartTranslationSchema = z.object({
  locale: localeEnum,
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().nullish(),
});

const translationsArray = z
  .array(sparePartTranslationSchema)
  .refine((arr) => new Set(arr.map((t) => t.locale)).size === arr.length, {
    message: "Duplicate locales",
  });

// No defaults here, so PATCH can't overwrite untouched fields.
const baseFields = z.object({
  sku: z.string().trim().min(1, "SKU is required"),
  category: sparePartCategoryEnum,
  price: z.number().positive("Price must be greater than 0"),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  images: z.array(z.url("Invalid image URL")),

  material: z.string().nullish(),
  weight: z.number().positive("Weight must be positive").nullish(),
  color: z.string().nullish(),
  manufacturer: z.string().nullish(),

  discountPrice: z.number().positive().nullish(),
  discountEndsAt: z.coerce.date().nullish(),

  compatibleModelIds: z.array(z.uuid()).optional(),
});

const discountBelowPrice = {
  message: "discountPrice must be lower than price",
  path: ["discountPrice"],
};

export const createSparePartSchema = baseFields
  .extend({
    stock: baseFields.shape.stock.default(0),
    images: baseFields.shape.images.default([]),
    translations: translationsArray.refine(
      (arr) => arr.some((t) => t.locale === "en"),
      { message: "English translation is required" },
    ),
  })
  .refine(
    (d) => d.discountPrice == null || d.discountPrice < d.price,
    discountBelowPrice,
  );

export const updateSparePartSchema = baseFields
  .partial()
  .extend({ translations: translationsArray.optional() })
  .refine(
    (d) =>
      d.discountPrice == null || d.price == null || d.discountPrice < d.price,
    discountBelowPrice,
  );

export const idParamSchema = z.object({
  id: z.uuid("Invalid id format"),
});

export const localeQuerySchema = z.object({
  locale: localeEnum.default("en"),
});

export const querySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(4).max(100).default(10),
    locale: localeEnum.default("en"),
    sort: z.enum(["name", "-name", "price", "-price"]).default("name"),

    name: z.string().trim().optional(),
    sku: z.string().trim().optional(),
    manufacturer: z.string().trim().optional(),
    color: z.string().trim().optional(),

    category: z
      .string()
      .trim()
      .transform((v) => v.split(",").map((s) => s.trim()))
      .pipe(z.array(sparePartCategoryEnum))
      .optional(),

    compatibleWith: z.uuid().optional(),

    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional(),
    minWeight: z.coerce.number().nonnegative().optional(),
    maxWeight: z.coerce.number().nonnegative().optional(),

    inStock: z
      .enum(["true", "false"])
      .transform((v) => v === "true")
      .optional(),
  })
  .refine(
    (q) =>
      q.minPrice === undefined ||
      q.maxPrice === undefined ||
      q.minPrice <= q.maxPrice,
    { message: "minPrice cannot exceed maxPrice", path: ["minPrice"] },
  );

export type SparePartInput = z.infer<typeof createSparePartSchema>;
export type SparePartUpdateInput = z.infer<typeof updateSparePartSchema>;
export type SparePartQuery = z.infer<typeof querySchema>;
export type IdParam = z.infer<typeof idParamSchema>;