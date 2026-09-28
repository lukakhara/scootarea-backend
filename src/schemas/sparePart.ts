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

export const sparePartSchema = z.object({
  id: z.uuid().optional(),
  sku: z.string().min(1, "SKU is required"),
  category: z.enum([
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
  ]),

  price: z.coerce.number().positive("Price must be greater than 0"),
  stock: z.number().int().nonnegative("Stock cannot be negative").default(0),
  images: z.array(z.url("Invalid image URL")).default([]),

  material: z.string().optional(),
  weight: z.number().positive("Weight must be positive").optional(),
  color: z.string().optional(),
  manufacturer: z.string().optional(),

  compatibleModelIds: z.array(z.uuid()).optional(), // Scooter IDs to connect

  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

// Translations are required at creation — every part needs at least English
export const sparePartTranslationSchema = z.object({
  locale: z.enum(["en", "ka"]),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const idParamSchema = z.object({
  id: z.uuid("Invalid id format"),
});

// Zod schemas for CRUD endpoints
export const createSparePartSchema = sparePartSchema
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    translations: z
      .array(sparePartTranslationSchema)
      .min(1, "At least one translation is required"),
  });

export const updateSparePartSchema = createSparePartSchema.partial();

export type SparePartInput = z.infer<typeof createSparePartSchema>;
export type SparePartUpdateInput = z.infer<typeof updateSparePartSchema>;

export const querySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .min(4)
    .max(100)
    .optional()
    .default(10),

  // Locale — which translation to resolve name/description from
  locale: z.enum(["en", "ka"]).default("en"),

  sort: z
    .enum([
      "name",
      "-name",
      "price",
      "-price",
    ])
    .default("name"),

  // Text filters
  name: z.string().trim().optional(), // searched against SparePartTranslation
  sku: z.string().trim().optional(),
  manufacturer: z.string().trim().optional(),
  color: z.string().trim().optional(),

  // Multi-select — comma-separated in URL, e.g. ?category=BRAKE_PADS,WHEELS
  category: z
    .string()
    .trim()
    .transform((v) => v.split(",").map((s) => s.trim()))
    .pipe(z.array(sparePartCategoryEnum))
    .optional(),

  compatibleWith: z.uuid().optional(), // filter by a single Scooter id

  // Numeric range filters
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  minWeight: z.coerce.number().positive().optional(),
  maxWeight: z.coerce.number().positive().optional(),

  inStock: z.coerce.boolean().optional(),
});

export type SparePartQuery = z.infer<typeof querySchema>;
export type IdParam = z.infer<typeof idParamSchema>;
