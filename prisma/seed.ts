import "dotenv/config";
import { PrismaClient, SparePartCategory } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });


async function main() {
  // 1. English version
  const blogPostEn = await prisma.blogPost.create({
    data: {
      title:
        "Beat the Traffic and Save Big: Why Switching to an E-Scooter Makes Sense",
      slug: "beat-the-traffic-and-save-big-why-switching-to-an-e-scooter-makes-sense",
      excerpt:
        "Less traffic. More life. Discover why switching to an e-scooter is clean, fast, fun, and affordable.",
      content: `
# Lifestyle & Savings: Beat the Traffic and Save Big

Switching to an e-scooter isn't just a trend; it's a smarter way to navigate your daily routine. Less traffic. More life.

### Key Benefits:
- **Better for the environment**: Reduce your carbon footprint with zero-emission electric commuting.
- **Gives you back your time**: Zip past congested car lanes and reach your destination faster.
- **Cuts your daily transport costs**: Save significantly on fuel, parking, and maintenance compared to traditional vehicles.

**Clean. Fast. Fun. Affordable.**
      `.trim(),
      coverImage: "https://res.cloudinary.com/us6agyt1/image/upload/v1790497794/Lifestyle_Savings.png",
      authorId: "user-uuid-12345-abcde", // Replace with a valid User ID from your database
      publishedAt: new Date(),
      locale: "en",
      published: true,
      images: ["https://example.com/images/e-scooter-city.jpg"],
      videoUrl: null,
    },
  });

  // 2. Georgian version
  const blogPostGe = await prisma.blogPost.create({
    data: {
      title:
        "აირიდე საცობები და დაზოგე: რატომ აქვს აზრი ელექტრო თვითმგორავზე გადართვას",
      slug: "beat-the-traffic-and-save-big-why-switching-to-an-e-scooter-makes-sense",
      excerpt:
        "ნაკლები საცობი. მეტი სიცოცხლე. აღმოაჩინე, რატომ არის ელექტრო თვითმგორავით მგზავრობა სუფთა, სწრაფი, სახალისო და ხელმისაწვდომი.",
      content: `
# ცხოვრების წესი და დანაზოგი: აირიდე საცობები და დაზოგე

ელექტრო თვითმგორავზე გადართვა უბრალოდ ტრენდი არ არის — ეს თქვენი ყოველდღიურობის გამარტივების ჭკვიანური გზაა. ნაკლები საცობი. მეტი სიცოცხლე.

### ძირითადი უპირატესობები:
- **უკეთესია გარემოსთვის**: შეამცირეთ ეკოლოგიური კვალი ენერგოეფექტური და ეკოლოგიურად სუფთა მგზავრობით.
- **გიბრუნებთ თქვენს დროს**: გაუსწარით საცობებს და მიზანმდებარეობას უფრო სწრაფად მიაღწიეთ.
- **ამცირებს ყოველდღიურ ხარჯებს**: საწვავის, პარკინგისა და ტრანსპორტირების სხვა ხარჯების მნიშვნელოვანი დაზოგვა.

**სუფთა. სწრაფი. სახალისო. ხელმისაწვდომი.**
      `.trim(),
      coverImage: "https://res.cloudinary.com/us6agyt1/image/upload/v1794659572/Gemini_Generated_Image_5dm6tj5dm6tj5dm6.jpg",
      authorId: "user-uuid-12345-abcde", // Replace with a valid User ID from your database
      publishedAt: new Date(),
      locale: "ge",
      published: true,
      images: ["https://example.com/images/e-scooter-city.jpg"],
      videoUrl: null,
    },
  });

  console.log("Created blog posts:", { blogPostEn, blogPostGe });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
