import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Start seeding English and Georgian (ka) blog data...");

  const author = { id: "ae8ed426-5cc2-4d79-aa6d-45ab89a78a77" };
  console.log(`Using author with id: ${author.id}`);

  // Define both English and Georgian records for each slug
  const posts = [
    // --- 1. AI Post ---
    {
      title: "Exploring the Future of Artificial Intelligence and Multimodal Models",
      slug: "exploring-future-of-ai",
      excerpt: "A comprehensive deep dive into upcoming enterprise trends in machine learning, generative AI, and autonomous agent workflows.",
      content: `
# Introduction to the Next Wave of AI

Artificial intelligence is evolving at an unprecedented pace. From multimodal models that seamlessly process text, audio, and visual data simultaneously, to autonomous agents capable of executing complex multi-step workflows, the technological landscape is shifting daily.

## Key Trends to Watch

1. **Multimodal Integration:** Modern models no longer treat text and vision as separate silos. They reason across multiple sensory inputs natively.
2. **Autonomous Execution:** Moving beyond conversational interfaces, AI systems are now taking action, writing code, executing tests, and deploying applications.
3. **Edge Deployment:** Optimization techniques allow large language and vision models to run efficiently on local consumer hardware and edge devices.

## Conclusion

As these technologies mature, organizations that integrate AI-driven workflows thoughtfully will unlock unprecedented productivity gains while maintaining rigorous safety and ethical standards.
      `.trim(),
      coverImage: "https://res.cloudinary.com/us6agyt1/image/upload/v1790497794/Lifestyle_Savings.png",
      authorId: author.id,
      publishedAt: new Date("2026-05-10T10:00:00Z"),
      images: ["https://res.cloudinary.com/us6agyt1/image/upload/v1790497794/Lifestyle_Savings.png"],
      locale: "en",
      published: true,
      videoUrl: "https://www.youtube.com/watch?v=example1",
    },
    {
      title: "ხოვნითი ინტელექტისა და მულტიმოდალური მოდელების მომავლის შესწავლა",
      slug: "exploring-future-of-ai",
      excerpt: "ყოვლისმომცველი მიმოხილვა მანქანური სწავლების, გენერაციული ხელოვნური ინტელექტისა და ავტონომიური აგენტების სამუშაო პროცესების სამომავლო ტენდენციებზე.",
      content: `
# შესავალი ხელოვნური ინტელექტის ახალ ტალღაზე

ხელოვნური ინტელექტი ვითარდება უპრეცედენტო ტემპით. მულტიმოდალური მოდელებიდან, რომლებიც ერთდროულად ამუშავებენ ტექსტურ, აუდიო და ვიზუალურ მონაცემებს, ავტონომიურ აგენტებამდე, რომლებსაც კომპლექსური მრავალსაფეხურიანი პროცესების შესრულება შეუძლიათ, ტექნოლოგიური ლანდშაფტი ყოველდღიურად იცვლება.

## ძირითადი ტენდენციები

1. **მულტიმოდალური ინტეგრაცია:** თანამედროვე მოდელები ტექსტსა და ვიზუალს აღარ განიხილავენ ცალკეულ სილოსებად; ისინი ბუნებრივად მსჯელობენ მრავალი სენსორული მონაცემის საფუძველზე.
2. **ავტონომიური აღსრულება:** საუბრის ინტერფეისებს მიღმა, AI სისტემები უკვე გადადიანქმედებაზე — წერენ კოდს, ატარებენ ტესტებს და ნერგავენ აპლიკაციებს.
3. **Edge განლაგება:** ოპტიმიზაციის ტექნიკა საშუალებას აძლევს დიდ ენობრივ და ვიზუალურ მოდელებს, ეფექტურად იმუშაონ ადგილობრივ სამომხმარებლო აპარატურასა და მოწყობილობებზე.

## დასკვნა

რამდენადაც ეს ტექნოლოგიები მწიფდება, ორგანიზაციები, რომლებიც გააზრებულად აინტეგრირებენ ხელოვნურ ინტელექტზე დაფუძნებულ სამუშაო პროცესებს, მიაღწევენ პროდუქტიულობის უპრეცედენტო ზრდას უსაფრთხოებისა და ეთიკური სტანდარტების დაცვით.
      `.trim(),
      coverImage: "https://res.cloudinary.com/us6agyt1/image/upload/v1790497794/Lifestyle_Savings.png",
      authorId: author.id,
      publishedAt: new Date("2026-05-10T10:00:00Z"),
      images: ["https://res.cloudinary.com/us6agyt1/image/upload/v1790497794/Lifestyle_Savings.png"],
      locale: "ka",
      published: true,
      videoUrl: "https://www.youtube.com/watch?v=example1",
    },

    // --- 2. Buyer's Guide Post ---
    {
      title: "The Ultimate Buyer's Guide to Modern High-Performance Gear",
      slug: "ultimate-buyers-guide",
      excerpt: "Everything you need to evaluate, compare, and consider before making your next major technology investment or hardware purchase.",
      content: `
# Navigating the Modern Hardware Marketplace

Navigating specifications, pricing tiers, and consumer reviews can quickly become overwhelming. Whether you are upgrading your workspace or outfitting a creative studio, having a structured evaluation framework is essential.

## Critical Evaluation Criteria

- **Performance-to-Price Ratio:** Don't just look at raw benchmark scores; calculate the value delivered per dollar spent.
- **Build Quality and Materials:** Aluminum chassis, modular components, and repairability indices indicate how long a device will genuinely last.
- **Ecosystem Compatibility:** Ensure seamless integration with your existing software pipelines, cloud services, and peripheral accessories.

## Final Recommendation

Always prioritize components that offer upgrade paths rather than tightly integrated, closed-ecosystem alternatives that force full replacements when a single part ages out.
      `.trim(),
      coverImage: "https://res.cloudinary.com/us6agyt1/image/upload/v1790497788/Buyer_s_Guide_Range_Focus..jpg",
      authorId: author.id,
      publishedAt: new Date("2026-05-12T14:30:00Z"),
      images: ["https://res.cloudinary.com/us6agyt1/image/upload/v1790497788/Buyer_s_Guide_Range_Focus..jpg"],
      locale: "en",
      published: true,
      videoUrl: null,
    },
    {
      title: "თანამედროვე მაღალი წარმადობის ტექნიკის მყიდველის სრულყოფილი გზამკვლევი",
      slug: "ultimate-buyers-guide",
      excerpt: "ყველაფერი, რაც უნდა შეაფასოთ, შეადაროთ და გაითვალისწინოთ შემდეგი ტექნოლოგიური ინვესტიციის ან მოწყობილობის შეძენამდე.",
      content: `
# თანამედროვე აპარატურის ბაზარზე ორიენტაცია

სპეციფიკაციების, ფასების კატეგორიებისა და მომხმარებელთა შეფასებების გარკვევა სწრაფად შეიძლება რთული აღმოჩნდეს. მიუხედავად იმისა, აუმჯობესებთ სამუშაო სივრცეს თუ აწყობთ შემოქმედებით სტუდიას, სტრუქტურირებული შეფასების ჩარჩოს ქონა აუცილებელია.

## შეფასების კრიტიკული კრიტერიუმები

- **წარმადობისა და ფასის თანაფარდობა:** არ შეხედოთ მხოლოდ ნედლ ბენჩმარკ ქულებს; გამოთვალეთ რეალური ღირებულება დახარჯულ თანხასთან მიმართებაში.
- **აწყობის ხარისხი და მასალები:** ალუმინის კორპუსი, მოდულური კომპონენტები და შეკეთების ინდექსები მიუთითებს იმაზე, თუ რამდენ ხანს გაძლევთ რეალურად მოწყობილობა.
- **ეკოსისტემასთან თავსებადობა:** უზრუნველყავით უწყვეტი ინტეგრაცია არსებულ პროგრამულ უზრუნველყოფასთან, ღრუბლოვან სერვისებთან და აქსესუარებთან.

## საბოლოო რეკომენდაცია

ყოველთვის პრიორიტეტულად მიიჩნიეთ ისეთი კომპონენტები, რომლებიც გთავაზობთ განახლების პოტენციალს და არა ჩაკეტილ ეკოსისტემებს, რომლებიც მთლიანი მოწყობილობის შეცვლას ითხოვს ერთი ნაწილის დაძველებისას.
      `.trim(),
      coverImage: "https://res.cloudinary.com/us6agyt1/image/upload/v1790497788/Buyer_s_Guide_Range_Focus..jpg",
      authorId: author.id,
      publishedAt: new Date("2026-05-12T14:30:00Z"),
      images: ["https://res.cloudinary.com/us6agyt1/image/upload/v1790497788/Buyer_s_Guide_Range_Focus..jpg"],
      locale: "ka",
      published: true,
      videoUrl: null,
    },

    // --- 3. Maintenance Post ---
    {
      title: "Essential Maintenance, Cleaning, and Long-Term Care Tips",
      slug: "essential-maintenance-and-care",
      excerpt: "Keep your equipment running at peak efficiency and prevent costly unexpected repairs with these simple routine upkeep steps.",
      content: `
# The Importance of Proactive Maintenance

Routine maintenance prevents catastrophic failures and costly repairs down the line. By following a structured cleaning and calibration schedule, you can significantly extend the operational lifespan of your investments.

## Monthly Checklist

1. **Dust and Debris Clearance:** Use compressed air or specialized micro-fiber tools to keep ventilation paths unobstructed.
2. **Firmware and Software Audits:** Ensure all underlying operating systems and security patches are up to date.
3. **Physical Inspection:** Check cables, connectors, and structural mounts for signs of wear, strain, or corrosion.

## Summary

Consistency is key. Setting up calendar reminders for minor monthly maintenance tasks pays dividends in long-term reliability and performance.
      `.trim(),
      coverImage: "https://res.cloudinary.com/us6agyt1/image/upload/v1790497786/Maintenance_Care.jpg",
      authorId: author.id,
      publishedAt: null,
      images: ["https://res.cloudinary.com/us6agyt1/image/upload/v1790497786/Maintenance_Care.jpg"],
      locale: "en",
      published: false,
      videoUrl: null,
    },
    {
      title: "მოვლის, წმენდისა და გრძელვადიანი ექსპლუატაციის აუცილებელი რჩევები",
      slug: "essential-maintenance-and-care",
      excerpt: "შეინარჩუნეთ თქვენი აღჭურვილობის მაქსიმალური ეფექტურობა და თავიდან აცილეთ ხარჯიანი მოულოდნელი შეკეთებები ამ მარტივი რუტინული ნაბიჯებით.",
      content: `
# პროაქტიული მოვლის მნიშვნელობა

რუტინული მოვლა ხელს უშლის კატასტროფულ დაზიანებებსა და ძვირადღირებულ შეკეთებას სამომავლოდ. სტრუქტურირებული წმენდისა და კალიბრაციის განრიგის დაცვით, თქვენ მნიშვნელოვნად გაზრდით თქვენი ინვესტიციების სამუშაო რესურსს.

## ყოველთვიური საკონტროლო სია

1. **მტვრისა და ნარჩენების გაწმენდა:** გამოიყენეთ შეკუმშული ჰაერი ან სპეციალური მიკროფიბერის ხელსაწყოები სავენტილაციო გზების გასახსნელად.
2. **პროგრამული უზრუნველყოფის აუდიტი:** დარწმუნდით, რომ ყველა საბაზისო ოპერაციული სისტემა და უსაფრთხოების განახლება უახლეს ვერსიაზეა.
3. **ფიზიკური ინსპექცია:** შეამოწმეთ კაბელები, კონექტორები და სამაგრები ცვეთის, დაძაბვის ან კოროზიის ნიშნებზე.

## შეჯამება

თანმიმდევრულობა მთავარია. ყოველთვიური მცირე სამუშაოებისთვის კალენდარული შეხსენებების დაყენება გრძელვადიან საიმედოობასა და წარმადობაში აისახება.
      `.trim(),
      coverImage: "https://res.cloudinary.com/us6agyt1/image/upload/v1790497786/Maintenance_Care.jpg",
      authorId: author.id,
      publishedAt: null,
      images: ["https://res.cloudinary.com/us6agyt1/image/upload/v1790497786/Maintenance_Care.jpg"],
      locale: "ka",
      published: false,
      videoUrl: null,
    },
  ];

  // Upsert each post with compound key [slug, locale]
  for (const postData of posts) {
    const post = await prisma.blogPost.upsert({
      where: {
        slug_locale: {
          slug: postData.slug,
          locale: postData.locale,
        },
      },
      update: {
        title: postData.title,
        excerpt: postData.excerpt,
        content: postData.content,
        coverImage: postData.coverImage,
        images: postData.images,
        published: postData.published,
        publishedAt: postData.publishedAt,
      },
      create: postData,
    });
    console.log(
      `Upserted [${post.locale.toUpperCase()}] blog post: "${post.title}" (id: ${post.id})`
    );
  }

  console.log("English and Georgian seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });