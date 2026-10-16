import z from "zod";

export const userRegisterSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().min(5, "name is required"),
  email: z.email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password cannot exceed 100 characters" })
    // Check for at least one uppercase letter
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    // Check for at least one lowercase letter
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    // Check for at least one number
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    // Check for at least one special character
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    }),
  phone: z.string(""),
});

export const loginSchema = userRegisterSchema.omit({name:true, phone:true});

export type  UserRegisterBody =  z.infer<typeof userRegisterSchema>
export type UserLoginSchema = z.infer<typeof userRegisterSchema>