import { prisma } from "../src/lib/prisma"; // adjust path to wherever this file lives
import bcrypt from "bcrypt";

async function main() {
  const hashed = await bcrypt.hash("YourAdminPassword123!", 10);


const createAdmin = prisma.user.create({data:{name:"admin1",email:"admin1@gmail.com",password:hashed,
  phone:'1234567891',role:"ADMIN",isVerified:true,isBanned:false
}})

  console.log("image added :", createAdmin);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());