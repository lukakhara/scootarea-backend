import "dotenv/config";
import { PrismaClient, SparePartCategory } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";


const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/us6agyt1/image/upload/v1789559873';

async function main() {
  console.log('Start seeding spare parts with English and Georgian translations...');

  // Clean existing data if needed
  await prisma.sparePartTranslation.deleteMany({});
  await prisma.sparePart.deleteMany({});

  const sparePartsData = [
    {
      sku: 'BOLT-KIT-001',
      category: SparePartCategory.SCREWS_BOLTS,
      price: '19.99',
      stock: 50,
      slug: 'Complete-Frame-Screw-_Bolt-Kit',
      material: 'Steel',
      weight: 0.25,
      color: 'Black/Silver',
      manufacturer: 'Universal',
      discountEndsAt: null,
      discountPrice: null,
      compatibleModels: {
        connect: [{ name: 'zero-10x' }, { name: 'yume-x11' }, { name: 'xiaomi-4goplus' }],
      },
      translations: [
        {
          locale: 'en',
          name: 'Complete Frame Screw & Bolt Kit',
          description: 'Full replacement set of screws and bolts for electric scooter frames and handlebars.',
        },
        {
          locale: 'ka',
          name: 'ჩარჩოს ხრახნებისა და ჭანჭიკების სრული ნაკრები',
          description: 'ელექტრო თვითმგორავის ჩარჩოსა და საჭისთვის განკუთვნილი ხრახნებისა და ჭანჭიკების სრული შემცვლელი ნაკრები.',
        },
      ],
    },
    {
      sku: 'MOTOR-500W-002',
      category: SparePartCategory.MOTOR_PARTS,
      price: '189.99',
      stock: 12,
      slug: '500w-motor',
      material: 'Aluminum Alloy',
      weight: 3.2,
      color: 'Black',
      manufacturer: 'Segway-Ninebot',
      discountEndsAt: new Date('2026-12-31T23:59:59Z'),
      discountPrice: '159.99',
      compatibleModels: {
        connect: [{ name: 'ninebot-p65-1' }, { name: 'seqway-qt1' }],
      },
      translations: [
        {
          locale: 'en',
          name: '500W Brushless Hub Motor',
          description: 'High-torque replacement brushless hub motor for electric scooters.',
        },
        {
          locale: 'ka',
          name: '500 ვატიანი უჯაგრისო ჰაბ ძრავა',
          description: 'მაღალი მბრუნავი მომენტის მქონე შემცვლელი უჯაგრისო ძრავა ელექტრო თვითმგორავებისთვის.',
        },
      ],
    },
    {
      sku: 'BRAKE-CER-003',
      category: SparePartCategory.BRAKE_PADS,
      price: '14.99',
      stock: 40,
      slug: 'premium-ceramic-brake',
      material: 'Ceramic Composite',
      weight: 0.05,
      color: 'Black',
      manufacturer: 'Logan',
      discountEndsAt: null,
      discountPrice: null,
      compatibleModels: {
        connect: [{ name: 'yume-x11' }, { name: 'wolf-king-1' }, { name: 'vsett-9-plus' }],
      },
      translations: [
        {
          locale: 'en',
          name: 'Premium Ceramic Brake Pads',
          description: 'Low-noise, long-lasting ceramic brake pads for superior stopping power.',
        },
        {
          locale: 'ka',
          name: 'პრემიუმ კერამიკული სამუხრუჭე ხუნდები',
          description: 'დაბალი ხმაურის, გრძელვადიანი კერამიკული სამუხრუჭე ხუნდები უმაღლესი დამუხრუჭების ძალისთვის.',
        },
      ],
    },
    {
      sku: 'CTRL-SPD-004',
      category: SparePartCategory.CONTROLLER,
      price: '89.99',
      stock: 15,
      slug: 'speed-controller',
      material: 'Aluminum Housing',
      weight: 0.45,
      color: 'Silver/Black',
      manufacturer: 'Dualtron',
      discountEndsAt: null,
      discountPrice: null,
      compatibleModels: {
        connect: [{ name: 'victor-luxury' }, { name: 'spider2-1' }],
      },
      translations: [
        {
          locale: 'en',
          name: 'High-Performance Speed Controller',
          description: 'Replacement electronic speed controller unit for smooth acceleration and power delivery.',
        },
        {
          locale: 'ka',
          name: 'მაღალი წარმადობის სიჩქარის კონტროლერი',
          description: 'ელექტრონული სიჩქარის კონტროლერის შემცვლელი ბლოკი გლუვი აჩქარებისა და ენერგიის მიწოდებისთვის.',
        },
      ],
    },
    {
      sku: 'BATT-4AH-005',
      category: SparePartCategory.BATTERY_CELLS,
      price: '129.99',
      stock: 20,
      slug: '4ah-lithium-battery',
      material: 'Lithium-ion',
      weight: 1.1,
      color: 'Black',
      manufacturer: 'Voltz',
      discountEndsAt: null,
      discountPrice: null,
      compatibleModels: {
        connect: [{ name: 'xiaomi-4-go' }, { name: 'ninebot-e2-1' }],
      },
      translations: [
        {
          locale: 'en',
          name: '4Ah Lithium Backup Battery Pack',
          description: 'Compact auxiliary lithium-ion battery pack for extended ride range.',
        },
        {
          locale: 'ka',
          name: '4Ah ლითიუმის დამხმარე ბატარეა',
          description: 'კომპაქტური დამხმარე ლითიუმ-იონური ბატარეა მგზავრობის მანძილის გასაზრდელად.',
        },
      ],
    },
    {
      sku: 'DISP-LCD-006',
      category: SparePartCategory.DISPLAY_PANEL,
      price: '69.99',
      stock: 25,
      slug: 'smart-lcd-panel',
      material: 'ABS Plastic',
      weight: 0.2,
      color: 'Black',
      manufacturer: 'Eyris',
      discountEndsAt: null,
      discountPrice: null,
      compatibleModels: {
        connect: [{ name: 'wolf-king-1' }, { name: 'kaabo-ww11' }],
      },
      translations: [
        {
          locale: 'en',
          name: 'Smart LCD Display Panel',
          description: 'Water-resistant digital dashboard displaying speed, battery status, and riding modes.',
        },
        {
          locale: 'ka',
          name: 'ჭკვიანი LCD ეკრანის პანელი',
          description: 'წყალგაუმტარი ციფრული დაფა, რომელიც აჩვენებს სიჩქარეს, ბატარეის სტატუსსა და მართვის რეჟიმებს.',
        },
      ],
    },
    {
      sku: 'BEAR-WHL-007',
      category: SparePartCategory.BEARINGS,
      price: '12.99',
      stock: 60,
      slug: 'wheel-bearings-pair',
      nameSlug: 'wheel-bearings-pair',
      material: 'Chrome Steel',
      weight: 0.1,
      color: 'Silver',
      manufacturer: 'NSK',
      discountEndsAt: null,
      discountPrice: null,
      compatibleModels: {
        connect: [{ name: 'zero-10x' }, { name: 'vsett-8-plus' }],
      },
      translations: [
        {
          locale: 'en',
          name: 'Precision Wheel Bearings (Pair)',
          description: 'High-speed sealed wheel bearings designed to reduce friction and noise.',
        },
        {
          locale: 'ka',
          name: 'ზუსტი ბორბლის საკისრები (წყვილი)',
          description: 'მაღალი სიჩქარის ჰერმეტული ბორბლის საკისრები, რომლებიც შექმნილია ხახუნისა და ხმაურის შესამცირებლად.',
        },
      ],
    },
    {
      sku: 'SUSP-HYD-008',
      category: SparePartCategory.SUSPENSION_PARTS,
      price: '79.99',
      stock: 18,
      slug: 'hydraulic-shock-absorber',
      material: 'Steel & Aluminum',
      weight: 0.8,
      color: 'Black',
      manufacturer: 'Kashima',
      discountEndsAt: new Date('2026-11-30T23:59:59Z'),
      discountPrice: '69.99',
      compatibleModels: {
        connect: [{ name: 'yume-x11' }, { name: 'nami-klima' }],
      },
      translations: [
        {
          locale: 'en',
          name: 'Hydraulic Shock Absorber',
          description: 'Adjustable hydraulic suspension strut for enhanced ride comfort over rough terrain.',
        },
        {
          locale: 'ka',
          name: 'ჰიდრავლიკური ამორტიზატორი',
          description: 'რეგულირებადი ჰიდრავლიკური საკიდი სტრუტი უხეშ რელიეფზე მგზავრობის კომფორტის გასაუმჯობესებლად.',
        },
      ],
    },
    {
      sku: 'TIRE-10IN-009',
      category: SparePartCategory.TIRES_TUBES,
      price: '34.99',
      stock: 45,
      slug: '10-inch-tire',
      material: 'Rubber',
      weight: 0.6,
      color: 'Black',
      manufacturer: 'CST',
      discountEndsAt: null,
      discountPrice: null,
      compatibleModels: {
        connect: [{ name: 'zero-10x' }, { name: 'xiaomi-4goplus' }, { name: 'vsett-10-lite' }],
      },
      translations: [
        {
          locale: 'en',
          name: '10-Inch Off-Road Pneumatic Tire',
          description: 'Heavy-duty puncture-resistant pneumatic tire with deep tread for off-road and street use.',
        },
        {
          locale: 'ka',
          name: '10-ინჩიანი საბარგო პნევმატური საბურავი',
          description: 'მძიმე პუნქციისადმი მდგრადი პნევმატური საბურავი ღრმა პროტექტორით ოფროუდისა და ქალაქის გამოყენებისთვის.',
        },
      ],
    },
  ];

  for (const item of sparePartsData) {
    const imageUrl = `${CLOUDINARY_BASE_URL}/${item.slug}.jpg`;

    await prisma.sparePart.create({
      data: {
        sku: item.sku,
        category: item.category,
        price: item.price,
        stock: item.stock,
        images: [imageUrl],
        material: item.material,
        weight: item.weight,
        color: item.color,
        manufacturer: item.manufacturer,
        discountEndsAt: item.discountEndsAt,
        discountPrice: item.discountPrice,
        compatibleModels: item.compatibleModels,
        translations: {
          create: item.translations,
        },
      },
    });
  }

  console.log(`Seeding finished. Inserted ${sparePartsData.length} spare parts with translations.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
