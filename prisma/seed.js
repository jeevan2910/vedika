const { PrismaClient } = require('@prisma/client');
const { Pool, neonConfig } = require('@neondatabase/serverless');
const { PrismaNeon } = require('@prisma/adapter-neon');
const ws = require('ws');
require('dotenv').config();

neonConfig.webSocketConstructor = ws;

const dbUrl = new URL(process.env.DATABASE_URL);
process.env.PGHOST = dbUrl.hostname;
process.env.PGUSER = dbUrl.username;
process.env.PGDATABASE = dbUrl.pathname.replace('/', '');
process.env.PGPASSWORD = dbUrl.password;
process.env.PGPORT = dbUrl.port || "5432";

const pool = new Pool({ ssl: true });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database with sarees, kurtis (Short, Sets), dresses, and lehengas...');
  await prisma.product.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.admin.deleteMany({});

  await prisma.admin.create({ data: { username: 'admin', passwordHash: 'admin123' } });
  console.log('Seeded admin user.');

  const products = [
    // SAREES (13 existing)
    {
      title: 'Royal Crimson Kanjeevaram Silk Saree',
      description: 'Handwoven with pure mulberry silk and ornate gold zari borders, this royal crimson Kanjeevaram saree is a classic bridal masterpiece from the looms of Kanchipuram.',
      price: 15499, mrp: 18999, discount: 18,
      fabric: 'Kanjeevaram Silk', category: 'Sarees',
      images: '/images/saree-crimson.webp',
      stock: 5, color: 'Red', occasion: 'Wedding',
      rating: 4.9, reviewsCount: 24,
      featured: true, isNew: false,
      tags: 'bestseller,featured', design: 'Jaal',
      borderType: 'Zari Border', blouseType: 'Running Blouse',
      zari: 'Gold Zari', colorFamily: 'jewel',
      sizes: '5.5m,6m,6.5m'
    },
    {
      title: 'Midnight Blue Banarasi Brocade Saree',
      description: 'Woven in the sacred looms of Varanasi, this midnight blue Banarasi saree features intricate silver zari floral motifs and a temple border, perfect for grand festive celebrations.',
      price: 12299, mrp: 14999, discount: 18,
      fabric: 'Banarasi Silk', category: 'Sarees',
      images: '/images/saree-blue.webp',
      stock: 4, color: 'Blue', occasion: 'Festive',
      rating: 4.8, reviewsCount: 18,
      featured: true, isNew: false,
      tags: 'trending', design: 'Floral',
      borderType: 'Woven Border', blouseType: 'Running Blouse',
      zari: 'Silver Zari', colorFamily: 'jewel',
      sizes: '5.5m,6m'
    },
    {
      title: 'Antique Gold Mulberry Silk Saree',
      description: 'Draped in shimmering antique gold, this pure mulberry silk saree with heavy gold zari work and woven paisleys exudes opulence fit for the most auspicious ceremonies.',
      price: 18999, mrp: 22999, discount: 17,
      fabric: 'Kanjeevaram Silk', category: 'Sarees',
      images: '/images/saree-gold.webp',
      stock: 3, color: 'Gold', occasion: 'Wedding',
      rating: 5.0, reviewsCount: 31,
      featured: true, isNew: false,
      tags: 'bestseller,premium', design: 'Paisley',
      borderType: 'Heavy Border', blouseType: 'Readymade Blouse',
      zari: 'Gold Zari', colorFamily: 'metallic',
      sizes: '5.5m,6m,6.5m'
    },
    {
      title: 'Sage Green Chanderi Silk Saree',
      description: 'Light as a whisper, this sage green Chanderi silk saree from Madhya Pradesh features delicate butti motifs and a sheer texture perfect for festive evenings.',
      price: 6499, mrp: 7999, discount: 19,
      fabric: 'Chanderi Silk', category: 'Sarees',
      images: '/images/saree-green.webp',
      stock: 7, color: 'Green', occasion: 'Festive',
      rating: 4.7, reviewsCount: 15,
      featured: true, isNew: true,
      tags: 'new,trending', design: 'Butti',
      borderType: 'Self Border', blouseType: 'Running Blouse',
      zari: 'Gold Zari', colorFamily: 'earthy',
      sizes: '5.5m,6m'
    },
    {
      title: 'Ivory Organza Silk Party Saree',
      description: 'A modern bridal-ready organza saree in pristine ivory with delicate gold border embellishment. Light, sheer and utterly sophisticated for contemporary weddings.',
      price: 8799, mrp: 10999, discount: 20,
      fabric: 'Organza Silk', category: 'Sarees',
      images: '/images/saree-ivory.webp',
      stock: 6, color: 'Ivory', occasion: 'Party',
      rating: 4.8, reviewsCount: 22,
      featured: false, isNew: true,
      tags: 'new', design: 'Minimal',
      borderType: 'Piping Border', blouseType: 'Sleeveless',
      zari: 'Gold Zari', colorFamily: 'neutral',
      sizes: '5.5m,6m'
    },
    {
      title: 'Deep Purple Kanjivaram Heritage Saree',
      description: 'A spectacular deep purple Kanjivaram with intricate temple borders and all-over gold zari work. A timeless heirloom saree passed down through generations.',
      price: 16999, mrp: 20999, discount: 19,
      fabric: 'Kanjeevaram Silk', category: 'Sarees',
      images: '/images/saree-purple.webp',
      stock: 3, color: 'Purple', occasion: 'Wedding',
      rating: 4.9, reviewsCount: 19,
      featured: false, isNew: false,
      tags: 'premium', design: 'Temple',
      borderType: 'Zari Border', blouseType: 'Running Blouse',
      zari: 'Gold Zari', colorFamily: 'jewel',
      sizes: '5.5m,6m,6.5m'
    },
    {
      title: 'Earthen Linen Handloom Saree',
      description: 'Woven from the finest handspun linen, this earthy-toned saree is a celebration of slow fashion and artisanal craft. Light, breathable and perfect for everyday luxury.',
      price: 3499, mrp: 4299, discount: 19,
      fabric: 'Linen', category: 'Sarees',
      images: '/images/saree-linen.webp',
      stock: 10, color: 'Gold', occasion: 'Casual',
      rating: 4.6, reviewsCount: 28,
      featured: false, isNew: true,
      tags: 'new,everyday', design: 'Minimal',
      borderType: 'Self Border', blouseType: 'Running Blouse',
      zari: 'No Zari', colorFamily: 'earthy',
      sizes: '5.5m,6m'
    },
    {
      title: 'Blush Pink Georgette Printed Saree',
      description: 'Flowing blush pink georgette with hand-printed floral motifs and a contrast border. A modern take on Indian grace, ideal for festivals and family gatherings.',
      price: 5299, mrp: 6499, discount: 18,
      fabric: 'Georgette', category: 'Sarees',
      images: '/images/saree-pink.webp',
      stock: 8, color: 'Pink', occasion: 'Festive',
      rating: 4.7, reviewsCount: 17,
      featured: false, isNew: true,
      tags: 'new,trending', design: 'Floral',
      borderType: 'Contrast Border', blouseType: 'Running Blouse',
      zari: 'No Zari', colorFamily: 'pastel',
      sizes: '5.5m,6m'
    },
    {
      title: 'Mustard Marigold Chanderi Saree',
      description: 'Sunshine-yellow Chanderi silk with golden butti weave and a delicate zari border. An ideal saree for Diwali, Pongal, or any festive celebration.',
      price: 6499, mrp: 7999, discount: 19,
      fabric: 'Chanderi Silk', category: 'Sarees',
      images: '/images/saree-yellow.webp',
      stock: 6, color: 'Yellow', occasion: 'Festive',
      rating: 4.8, reviewsCount: 14,
      featured: false, isNew: false,
      tags: 'trending', design: 'Butti',
      borderType: 'Zari Border', blouseType: 'Running Blouse',
      zari: 'Gold Zari', colorFamily: 'bright',
      sizes: '5.5m,6m'
    },
    {
      title: 'Midnight Obsidian Organza Saree',
      description: 'Bold and dramatic in deep black organza with silver sequin work and a statement border. Perfect for evening events, receptions and parties.',
      price: 7299, mrp: 8999, discount: 19,
      fabric: 'Organza Silk', category: 'Sarees',
      images: '/images/saree-black.webp',
      stock: 5, color: 'Black', occasion: 'Party',
      rating: 4.9, reviewsCount: 21,
      featured: false, isNew: true,
      tags: 'new,trending', design: 'All Over Design',
      borderType: 'Cut Work Border', blouseType: 'Sleeveless',
      zari: 'Silver Zari', colorFamily: 'dark',
      sizes: '5.5m,6m'
    },
    {
      title: 'Sunset Rust Linen Heritage Saree',
      description: 'Warm rust-orange handwoven linen saree with contrast ivory border and hand-block prints. A conscious fashion choice for the modern Indian woman.',
      price: 4899, mrp: 5999, discount: 18,
      fabric: 'Linen', category: 'Sarees',
      images: '/images/saree-orange.webp',
      stock: 9, color: 'Orange', occasion: 'Casual',
      rating: 4.6, reviewsCount: 11,
      featured: false, isNew: false,
      tags: 'everyday', design: 'Abstract',
      borderType: 'Contrast Border', blouseType: 'Running Blouse',
      zari: 'No Zari', colorFamily: 'earthy',
      sizes: '5.5m,6m'
    },
    {
      title: 'Turquoise Peacock Banarasi Saree',
      description: 'Inspired by the majestic peacock, this turquoise Banarasi features intricate feather motifs in gold zari across the body and a broad brocade border.',
      price: 13999, mrp: 16999, discount: 18,
      fabric: 'Banarasi Silk', category: 'Sarees',
      images: '/images/saree-turquoise.webp',
      stock: 4, color: 'Blue', occasion: 'Festive',
      rating: 4.8, reviewsCount: 16,
      featured: false, isNew: true,
      tags: 'new,premium', design: 'Jaal',
      borderType: 'Woven Border', blouseType: 'Running Blouse',
      zari: 'Gold Zari', colorFamily: 'jewel',
      sizes: '5.5m,6m'
    },
    {
      title: 'Peach Nectar Georgette Saree',
      description: 'Soft peach georgette with delicate floral hand embroidery and a satin border. A perfect bridal trousseau saree that exudes feminine grace.',
      price: 10499, mrp: 12999, discount: 19,
      fabric: 'Georgette', category: 'Sarees',
      images: '/images/saree-peach.webp',
      stock: 5, color: 'Peach', occasion: 'Wedding',
      rating: 4.7, reviewsCount: 13,
      featured: false, isNew: true,
      tags: 'new,bridal', design: 'Floral',
      borderType: 'Piping Border', blouseType: 'Readymade Blouse',
      zari: 'Gold Zari', colorFamily: 'pastel',
      sizes: '5.5m,6m'
    },

    // KURTIS - Short & Sets
    {
      title: 'Marigold Blossom Cotton Short Kurti',
      description: 'A beautiful marigold yellow short kurti crafted in lightweight handwoven cotton. Styled with delicate mirror work and short flared sleeves, ideal for casual college or office wear.',
      price: 1499, mrp: 1999, discount: 25,
      fabric: 'Cotton', category: 'Kurtis',
      images: '/images/kurti-designer.webp',
      stock: 15, color: 'Yellow', occasion: 'Casual',
      rating: 4.8, reviewsCount: 12,
      featured: true, isNew: true,
      tags: 'bestseller,short-kurti', design: 'Short Kurti',
      borderType: 'Self Border', blouseType: 'Without Blouse',
      zari: 'No Zari', colorFamily: 'bright',
      sizes: 'S,M,L,XL,XXL'
    },
    {
      title: 'Midnight Indigo Linen Short Kurti',
      description: 'Earthy and smart short kurti in indigo blue linen. Classic collared design with wooden buttons, perfect to pair with jeans or white trousers.',
      price: 1699, mrp: 2199, discount: 22,
      fabric: 'Linen', category: 'Kurtis',
      images: '/images/kurti-designer.webp',
      stock: 10, color: 'Blue', occasion: 'Casual',
      rating: 4.6, reviewsCount: 8,
      featured: false, isNew: false,
      tags: 'everyday,short-kurti', design: 'Short Kurti',
      borderType: 'Self Border', blouseType: 'Without Blouse',
      zari: 'No Zari', colorFamily: 'dark',
      sizes: 'S,M,L,XL'
    },
    {
      title: 'Crimson Rose Silk Kurti Pant Set',
      description: 'A complete premium kurti set featuring a straight-cut crimson red silk kurti, comfortable straight-cut pants, and a sheer organza matching gold-woven dupatta.',
      price: 4599, mrp: 5999, discount: 23,
      fabric: 'Silk', category: 'Kurtis',
      images: '/images/kurti-designer.webp',
      stock: 8, color: 'Red', occasion: 'Festive',
      rating: 4.9, reviewsCount: 19,
      featured: true, isNew: true,
      tags: 'trending,kurti-set', design: 'Kurti Set',
      borderType: 'Woven Border', blouseType: 'Without Blouse',
      zari: 'Gold Zari', colorFamily: 'jewel',
      sizes: 'S,M,L,XL,XXL'
    },
    {
      title: 'Mint Sage Georgette Kurti Palazzo Set',
      description: 'An elegant pastel green georgette kurti set with a flared palazzo. Detailed with subtle silver thread embroidery, perfect for festival gatherings or party evenings.',
      price: 3899, mrp: 4999, discount: 22,
      fabric: 'Georgette', category: 'Kurtis',
      images: '/images/kurti-designer.webp',
      stock: 7, color: 'Green', occasion: 'Party',
      rating: 4.7, reviewsCount: 10,
      featured: false, isNew: false,
      tags: 'new,kurti-set', design: 'Kurti Set',
      borderType: 'Contrast Border', blouseType: 'Without Blouse',
      zari: 'No Zari', colorFamily: 'pastel',
      sizes: 'M,L,XL,XXL'
    },

    // DRESSES
    {
      title: 'Blush Pastel Georgette Anarkali Dress',
      description: 'An ethereal pastel pink Anarkali gown crafted in flowy georgette, complete with handcrafted floral Lucknowi Chikankari embroidery and an elegant matching dupatta.',
      price: 5999, mrp: 7999, discount: 25,
      fabric: 'Georgette', category: 'Dresses',
      images: '/images/dress-ethnic.webp',
      stock: 6, color: 'Pink', occasion: 'Party',
      rating: 4.9, reviewsCount: 15,
      featured: false, isNew: true,
      tags: 'new,trending', design: 'Floral',
      borderType: 'Piping Border', blouseType: 'Without Blouse',
      zari: 'No Zari', colorFamily: 'pastel',
      sizes: 'M,L,XL'
    },
    {
      title: 'Royal Ivory Flared Ethnic Dress',
      description: 'A flared ivory dress in handspun cotton silk with minimal gold piping. Breezy, fashionable, and perfect for intimate celebrations.',
      price: 3299, mrp: 4499, discount: 26,
      fabric: 'Cotton', category: 'Dresses',
      images: '/images/dress-ethnic.webp',
      stock: 10, color: 'Ivory', occasion: 'Casual',
      rating: 4.6, reviewsCount: 11,
      featured: false, isNew: false,
      tags: 'everyday', design: 'Minimal',
      borderType: 'Self Border', blouseType: 'Without Blouse',
      zari: 'No Zari', colorFamily: 'neutral',
      sizes: 'S,M,L,XL,XXL'
    },

    // LEHENGAS
    {
      title: 'Crimson Royal Bridal Lehenga Choli',
      description: 'Make your big day unforgettable with this majestic bridal lehenga. Intricately detailed with heavy gold zari borders, panelled floral embroidery, and gold borders.',
      price: 24999, mrp: 32999, discount: 24,
      fabric: 'Silk', category: 'Lehengas',
      images: '/images/lehenga-bridal.webp',
      stock: 3, color: 'Red', occasion: 'Wedding',
      rating: 5.0, reviewsCount: 22,
      featured: true, isNew: false,
      tags: 'premium,bridal', design: 'Temple',
      borderType: 'Heavy Border', blouseType: 'Without Blouse',
      zari: 'Gold Zari', colorFamily: 'jewel',
      sizes: 'M,L,XL'
    },
    {
      title: 'Emerald Gold Silk Designer Lehenga',
      description: 'A contemporary designer lehenga in shimmering emerald green Chanderi silk with rich Banarasi gold brocade borders. Lightweight yet opulent.',
      price: 17999, mrp: 22999, discount: 21,
      fabric: 'Chanderi Silk', category: 'Lehengas',
      images: '/images/lehenga-bridal.webp',
      stock: 4, color: 'Green', occasion: 'Festive',
      rating: 4.8, reviewsCount: 16,
      featured: false, isNew: true,
      tags: 'new,premium', design: 'Paisley',
      borderType: 'Zari Border', blouseType: 'Without Blouse',
      zari: 'Gold Zari', colorFamily: 'jewel',
      sizes: 'S,M,L'
    }
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log(`Seeded ${products.length} products successfully.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
