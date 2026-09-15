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
  "SPARE_PARTS",
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

export const accessorySchema = z.object({
  id: z.uuid().optional(),
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  size: z.string().trim().optional(),
  sex: genderEnum,
  category: accessoryCategoryEnum,

  // Coerces string or number input into a normalized positive number
  price: z.coerce.number().positive("Price must be greater than 0"),

  description: z.string().trim().optional(),

  stock: z.number().int().nonnegative("Stock cannot be negative").default(0),
  images: z.array(z.url("Invalid image URL")).default([]),

  // Scooter model IDs/names this accessory fits, if relevant
  compatibleWith: z.array(z.string()).default([]),

  createdAt: z.coerce.date().optional(),
});

// Zod schemas for CRUD endpoints
export const createAccessorySchema = accessorySchema.omit({
  id: true,
  createdAt: true,
});

export const updateAccessorySchema = createAccessorySchema.partial();

// TypeScript types derived from the Zod schemas
export type AccessoryInput = z.infer<typeof createAccessorySchema>;
export type AccessoryUpdateInput = z.infer<typeof updateAccessorySchema>;

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

  sort: z
    .enum([
      "id",
      "-id",
      "name",
      "-name",
      "price",
      "-price",
      "brand",
      "-brand",
      "stock",
      "-stock",
      "createdAt",
      "-createdAt",
    ])
    .default("id"),

  // Text filters
  name: z.string().trim().optional(),
  brand: z
    .string()
    .trim()
    .transform((v) => v.split(",").map((s) => s.trim()))
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

export type AccessoryQuery = z.infer<typeof accessoryQuerySchema>;