import { z } from "zod";

export const idParamSchema = z.object({
  id: z.uuid("Invalid id format"),
});

export const addressSchema = z.object({
  id: z.uuid().optional(),
  userId: z.uuid().optional(),
  city: z.string().trim().min(1, "City is required").max(100, "City is too long"),
  street: z
    .string()
    .trim()
    .min(1, "Street is required")
    .max(200, "Street is too long"),
  isDefault: z.boolean().default(false),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

// userId comes from the auth token, never from the request body
export const createAddressSchema = addressSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const updateAddressSchema = createAddressSchema
  .partial()
  .extend({
    // override: no default here, and only `true` is allowed.
    // To change the default, set another address as default.
    isDefault: z
      .literal(true, { error: "isDefault can only be set to true" })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type IdParam = z.infer<typeof idParamSchema>;
export type AddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;