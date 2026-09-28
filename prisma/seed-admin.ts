import { prisma } from "../src/lib/prisma"; // adjust path to wherever this file lives
import bcrypt from "bcrypt";

async function main() {
  const hashed = await bcrypt.hash("YourAdminPassword123!", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@scootarea.com",
      password: hashed,
      role: "ADMIN",
      isVerified: true,
    },
  });

  console.log("Admin created:", admin.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());