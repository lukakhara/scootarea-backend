import { UserLoginBody, UserRegisterBody } from "@/schemas/auth.schema";
import { prisma } from "../lib/prisma";
import { AppError } from "@/errors/AppError";
import { ERROR_MESSAGES } from "@/errors/errorMessages";
import argon2 from "argon2";
import { Prisma } from "@/generated/prisma/browser";

const publicUserSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  role: true,
  createdAt: true,
} as const;

export const baseUserSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  role: true,
  isVerified: true,
} satisfies Prisma.UserSelect;

export const profileUserSelect = {
  ...baseUserSelect,
  phone: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export async function registerUser(data: UserRegisterBody) {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError(ERROR_MESSAGES.EMAIL_EXISTS, 409);
  }

  const hashedPassword = await argon2.hash(data.password, {
    type: argon2.argon2id,
  });

  try {
    return await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        termsAcceptedAt: new Date(),
        termsVersion: "1.0",
      },
      select: publicUserSelect,
    });
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      err.code === "P2002"
    ) {
      throw new AppError(ERROR_MESSAGES.EMAIL_EXISTS, 409);
    }
    throw err;
  }
}

export async function loginUser(data: UserLoginBody) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  const valid = user && (await argon2.verify(user.password, data.password));
  if (!user || !valid) {
    throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
  }

  return {
    id: user.id,
    email: user.email,
    firstname: user.firstName,
    lastname: user.lastName,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export async function getCurrentUser(
  userId: string,
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: profileUserSelect,
  });
  if (!user) throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);
  return user;
}
