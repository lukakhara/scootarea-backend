import { PrismaClient } from "../../generated/prisma/client";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";


const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });

async function main() {
 console.log("DATABASE_URL:", process.env.DATABASE_URL);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
