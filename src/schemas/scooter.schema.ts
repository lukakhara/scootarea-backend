import { z } from "zod";

export const scooterSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),

  // Coerces string or number input into a normalized positive number
  price: z.coerce.number().positive("Price must be greater than 0"),

  // Specs
  engine: z.string().min(1, "Engine spec is required"),
  maxSpeed: z.number().int().positive("Max speed must be a positive integer"),
  maxRange: z.number().int().positive("Max range must be a positive integer"),
  weight: z.number().positive("Weight must be positive"),

  // Accepts either an ISO string or a Date object
  releaseDate: z.coerce.date({
    error: (issue) =>
      issue.input === undefined
        ? "Release date is required"
        : "Invalid date format",
  }),

  warranty: z.string().min(1, "Warranty is required"),
  inclineAngle: z.string().min(1, "Incline angle is required"),
  chargingTime: z.string().min(1, "Charging time is required"),
  maxRiderWeight: z
    .number()
    .int()
    .positive("Max rider weight must be positive"),
  recommendedRiderWeight: z
    .number()
    .int()
    .positive("Recommended weight must be positive"),
  motorCount: z.number().int().min(1, "Motor count must be at least 1"),
  wheelSize: z.string().min(1, "Wheel size is required"),

  // Enforces valid drive types
  driveType: z.enum(["front", "rear", "dual"], {
    error: "Drive type must be front, rear, or dual",
  }),

  battery: z.string().min(1, "Battery details are required"),
  suspension: z.string().min(1, "Suspension details are required"),
  antiSlipSystem: z.boolean(),
  brakeType: z.string().min(1, "Brake type is required"),
  connectivity: z.string().min(1, "Connectivity details are required"),
  ipRating: z.string().min(1, "IP Rating is required"),

  stock: z.number().int().nonnegative("Stock cannot be negative").default(0),
  images: z.array(z.url("Invalid image URL")).default([]),

  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const idParamSchema = z.object({
  id: z.uuid("Invalid id format"),
});




// Zod schemas for CRUD endpoints
export const createScooterSchema = scooterSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateScooterSchema = createScooterSchema.partial();

// TypeScript types derived from the Zod schemas
export type ScooterInput = z.infer<typeof createScooterSchema>;
export type ScooterUpdateInput = z.infer<typeof updateScooterSchema>;

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

  sort: z
    .enum([
      "name",
      "-name",
      "price",
      "-price",
      "releaseDate",
      "-releaseDate",
    ])
    .default("name"),

  // Text filters — matched against actual string fields
  name: z.string().trim().optional(),
  brand: z
  .string()
  .trim()
  .transform((v) => v.split(",").map((s) => s.trim()))
  .optional(),
  engine: z.string().trim().optional(),
  wheelSize: z.string().trim().optional(),
  brakeType: z.string().trim().optional(),
  chargingTime: z.string().trim().optional(),

  // Enum filter — matches scooterSchema's driveType exactly
  driveType: z.enum(["front", "rear", "dual"]).optional(),

  // Boolean filter
  antiSlipSystem: z.coerce.boolean().optional(),

  // Numeric range filters (price, weight, speed are numbers — not strings)
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),

  minWeight: z.coerce.number().positive().optional(),
  maxWeight: z.coerce.number().positive().optional(),

  minMaxSpeed: z.coerce.number().int().positive().optional(),
  maxMaxSpeed: z.coerce.number().int().positive().optional(),

  // Date range filter — releaseDate is a Date, not a plain string
  releaseDateFrom: z.coerce.date().optional(),
  releaseDateTo: z.coerce.date().optional(),

  // Stock filter
  inStock: z.coerce.boolean().optional(),
});

export type ScooterQuery = z.infer<typeof querySchema>;
export type IdParam = z.infer<typeof idParamSchema>;
