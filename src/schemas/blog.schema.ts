import { z } from "zod";

export const blogQuerySchema = z.object({
  locale: z.enum(["en", "ka"]).default("en"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().min(1).optional(),
});

export const blogIdParamSchema = z.object({
  id: z.uuid("Invalid id format"),
});

export type BlogQuery = z.infer<typeof blogQuerySchema>;
export type BlogIdParam = z.infer<typeof blogIdParamSchema>;