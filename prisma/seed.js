import { prisma } from "../src/lib/prisma"; // adjust path to wherever this file lives
import bcrypt from "bcrypt";
async function main() {
    const hashed = await bcrypt.hash("YourAdminPassword123!", 10);
    const addImage = await prisma.blogPost.update({
        where: { id: "070f8a0c-73d2-4049-ac11-949bc12e9a4e" },
        data: {
            images: {
                push: ["https://res.cloudinary.com/us6agyt1/image/upload/v1791188823/blog-isnide-image3.png"]
            }
        }
    });
    console.log("image added :", addImage);
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
