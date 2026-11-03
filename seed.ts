import { prisma } from "@/lib/prisma";
import argon2 from "argon2";

async function main() {
  const hashedPassword = await argon2.hash("YourAdminPassword123!", {
    type: argon2.argon2id,
  });
  await prisma.user.create({
    data: {
      name: "admin1",
      email: "admin1@gmail.com",
      password: hashedPassword,
      phone: "1234567891",
      role: "ADMIN",
      isVerified: true,
      isBanned: false,
    },
  });
}

main();
