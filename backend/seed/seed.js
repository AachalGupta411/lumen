import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const u = (id) =>
  `https://images.unsplash.com/photo-${id}?w=800&q=80&auto=format&fit=crop`;

const products = [
  // ─── ELECTRONICS ─────────────────────────────────────────
  {
    title: 'Sonic Pro Wireless Headphones',
    category: 'Electronics',
    brand: 'Sonic',
    price: 2499,
    mrp: 3999,
    stock: 35,
    rating: 4.6,
    numReviews: 1243,
    featured: true,
    trending: true,
    tags: ['audio', 'headphones', 'bluetooth'],
    description:
      'Active noise-cancelling over-ear headphones with 40h battery life, plush memory-foam ear cushions and Hi-Res certified audio.',
    images: [
      u('1505740420928-5e560c06d30e'),
      u('1583394838336-acd977736f90'),
      u('1546435770-a3e426bf472b'),
    ],
  },
  {
    title: 'PixelView 27" 4K Monitor',
    category: 'Electronics',
    brand: 'PixelView',
    price: 24999,
    mrp: 32999,
    stock: 12,
    rating: 4.7,
    numReviews: 412,
    featured: true,
    tags: ['monitor', '4k', 'desktop'],
    description:
      'IPS 4K UHD monitor with HDR400, 99% sRGB and USB-C 90W power delivery — perfect for creators and developers.',
    images: [
      u('1527443224154-c4a3942d3acf'),
      u('1547119957-637f8679db1e'),
      u('1517336714731-489689fd1ca8'),
    ],
  },
  {
    title: 'Aurora Smart Watch S3',
    category: 'Electronics',
    brand: 'Aurora',
    price: 5999,
    mrp: 8999,
    stock: 60,
    rating: 4.4,
    numReviews: 988,
    trending: true,
    tags: ['watch', 'fitness'],
    description:
      'AMOLED smartwatch with SpO2, ECG, sleep tracking and a 10-day battery in a slim aerospace-grade aluminium body.',
    images: [
      u('1523275335684-37898b6baf30'),
      u('1546868871-7041f2a55e12'),
      u('1579586337278-3befd40fd17a'),
    ],
  },
  {
    title: 'NovaBook Air 14 Laptop',
    category: 'Electronics',
    brand: 'Nova',
    price: 78999,
    mrp: 89999,
    stock: 8,
    rating: 4.8,
    numReviews: 221,
    featured: true,
    tags: ['laptop'],
    description:
      'Ultralight 14" laptop with 16GB RAM, 512GB SSD and 18-hour battery — built for everyday brilliance.',
    images: [
      u('1496181133206-80ce9b88a853'),
      u('1517336714731-489689fd1ca8'),
      u('1484788984921-03950022c9ef'),
    ],
  },
  {
    title: 'PulseFit Bluetooth Earbuds',
    category: 'Electronics',
    brand: 'PulseFit',
    price: 1499,
    mrp: 2499,
    stock: 120,
    rating: 4.3,
    numReviews: 3201,
    trending: true,
    tags: ['earbuds'],
    description:
      'IPX5 sweat-proof earbuds with 30h total playback, ambient mode and a feather-light 4g per bud.',
    images: [
      u('1572569511254-d8f925fe2cbb'),
      u('1590658268037-6bf12165a8df'),
      u('1606220588913-b3aacb4d2f46'),
    ],
  },
  {
    title: 'LumeCam 4K Action Camera',
    category: 'Electronics',
    brand: 'LumeCam',
    price: 13999,
    mrp: 17999,
    stock: 25,
    rating: 4.5,
    numReviews: 178,
    tags: ['camera'],
    description:
      '4K60 stabilized action cam, waterproof to 30m, built-in livestreaming and a vivid front-facing display.',
    images: [
      u('1526170375885-4d8ecf77b99f'),
      u('1502920917128-1aa500764cbd'),
      u('1542038784456-1ea8e935640e'),
    ],
  },

  // ─── FASHION ─────────────────────────────────────────────
  {
    title: 'Classic Denim Jacket',
    category: 'Fashion',
    brand: 'Urbn',
    price: 2199,
    mrp: 3499,
    stock: 80,
    rating: 4.4,
    numReviews: 540,
    featured: true,
    tags: ['men', 'jacket'],
    description:
      'Mid-wash denim jacket with a relaxed fit, durable contrast stitching and timeless trucker styling.',
    images: [
      u('1591047139829-d91aecb6caea'),
      u('1544022613-e87ca75a784a'),
      u('1551488831-00ddcb6c6bd3'),
    ],
  },
  {
    title: 'Floral Summer Dress',
    category: 'Fashion',
    brand: 'Bloom',
    price: 1599,
    mrp: 2799,
    stock: 50,
    rating: 4.5,
    numReviews: 412,
    trending: true,
    tags: ['women', 'dress'],
    description:
      'Lightweight rayon midi dress in a delicate floral print — breezy, flattering and vacation-ready.',
    images: [
      u('1572804013427-4d3ca5e44c54'),
      u('1515886657613-9f3515b0c78f'),
      u('1583744946564-b52ac1c389c8'),
    ],
  },
  {
    title: 'Linen Button-Down Shirt',
    category: 'Fashion',
    brand: 'NorthLane',
    price: 1299,
    mrp: 1999,
    stock: 90,
    rating: 4.3,
    numReviews: 233,
    tags: ['men', 'shirt'],
    description:
      'Breathable 100% European linen shirt, pre-washed for buttery softness and an easy lived-in drape.',
    images: [
      u('1602810318383-e386cc2a3ccf'),
      u('1596755094514-f87e34085b2c'),
      u('1620012253295-c15cc3e65df4'),
    ],
  },
  {
    title: 'High-Waist Mom Jeans',
    category: 'Fashion',
    brand: 'Bloom',
    price: 1899,
    mrp: 2999,
    stock: 65,
    rating: 4.4,
    numReviews: 678,
    featured: true,
    tags: ['women', 'jeans'],
    description:
      'Vintage-inspired high-waist jeans with raw hem, classic 5-pocket styling and a sculpting non-stretch denim.',
    images: [
      u('1541099649105-f69ad21f3246'),
      u('1582418702059-97ebafb35d09'),
      u('1604176354204-9268737828e4'),
    ],
  },

  // ─── SHOES ────────────────────────────────────────────────
  {
    title: 'Strider Run Pro Sneakers',
    category: 'Shoes',
    brand: 'Strider',
    price: 3499,
    mrp: 5499,
    stock: 70,
    rating: 4.6,
    numReviews: 1823,
    featured: true,
    trending: true,
    tags: ['running', 'sneakers'],
    description:
      'Cushioned running shoes with energy-return foam, breathable knit upper and a grippy carbon-rubber outsole.',
    images: [
      u('1542291026-7eec264c27ff'),
      u('1595950653106-6c9ebd614d3a'),
      u('1606107557195-0e29a4b5b4aa'),
    ],
  },
  {
    title: 'Trail Master Hiking Boots',
    category: 'Shoes',
    brand: 'Trailmaster',
    price: 4999,
    mrp: 6999,
    stock: 30,
    rating: 4.5,
    numReviews: 421,
    tags: ['boots', 'hiking'],
    description:
      'Waterproof full-grain leather hiking boots with grip rubber sole and ankle-supporting collar.',
    images: [
      u('1520975916090-3105956dac38'),
      u('1542838686-37da4a9fd1b3'),
      u('1551107696-a4b0c5a0d9a2'),
    ],
  },
  {
    title: 'Court Classic Low Sneakers',
    category: 'Shoes',
    brand: 'Courtline',
    price: 2299,
    mrp: 3499,
    stock: 100,
    rating: 4.4,
    numReviews: 992,
    trending: true,
    tags: ['casual', 'sneakers'],
    description:
      'Minimal leather low-tops with cushioned insole and timeless court styling — your everyday rotation staple.',
    images: [
      u('1549298916-b41d501d3772'),
      u('1525966222134-fcfa99b8ae77'),
      u('1600185365483-26d7a4cc7519'),
    ],
  },
  {
    title: 'Velour Slip-On Loafers',
    category: 'Shoes',
    brand: 'Velour',
    price: 2799,
    mrp: 3999,
    stock: 40,
    rating: 4.2,
    numReviews: 145,
    tags: ['loafers'],
    description:
      'Premium suede slip-on loafers with hand-stitched moc-toe and a memory-foam cushioned insole.',
    images: [
      u('1614252369475-531eba835eb1'),
      u('1533867617858-e7b97e060509'),
      u('1582897085656-c636d006a246'),
    ],
  },

  // ─── ACCESSORIES ──────────────────────────────────────────
  {
    title: 'Heritage Leather Wallet',
    category: 'Accessories',
    brand: 'Heritage',
    price: 999,
    mrp: 1799,
    stock: 150,
    rating: 4.5,
    numReviews: 712,
    tags: ['wallet'],
    description:
      'Full-grain leather bifold wallet with RFID protection, 8 card slots and a slim 9mm profile.',
    images: [
      u('1627123424574-724758594e93'),
      u('1582574999955-2c87a31f07e6'),
      u('1606293459339-d18e2ad6d9bc'),
    ],
  },
  {
    title: 'Aviator Polarized Sunglasses',
    category: 'Accessories',
    brand: 'SunRay',
    price: 1299,
    mrp: 2199,
    stock: 85,
    rating: 4.4,
    numReviews: 522,
    featured: true,
    tags: ['sunglasses'],
    description:
      'UV400 polarized aviator sunglasses with a brushed metal frame, spring-hinged temples and gradient lenses.',
    images: [
      u('1572635196237-14b3f281503f'),
      u('1511499767150-a48a237f0083'),
      u('1577803645773-f96470509666'),
    ],
  },
  {
    title: 'Trail 30L Backpack',
    category: 'Accessories',
    brand: 'Trailmaster',
    price: 1899,
    mrp: 2999,
    stock: 55,
    rating: 4.6,
    numReviews: 388,
    trending: true,
    tags: ['backpack'],
    description:
      'Water-resistant 30L daypack with padded laptop sleeve, breathable mesh back and lockable zippers.',
    images: [
      u('1553062407-98eeb64c6a62'),
      u('1581605405669-fcdf81165afa'),
      u('1622560480605-d83c853bc5c3'),
    ],
  },
  {
    title: 'Minimal Leather Belt',
    category: 'Accessories',
    brand: 'Heritage',
    price: 799,
    mrp: 1399,
    stock: 120,
    rating: 4.3,
    numReviews: 233,
    tags: ['belt'],
    description:
      'Reversible full-grain leather belt with a brushed metal buckle — black on one side, deep cognac on the other.',
    images: [
      u('1624222247344-550fb60583dc'),
      u('1553290322-e4ada3e94cae'),
      u('1604176354204-9268737828e4'),
    ],
  },

  // ─── HOME ─────────────────────────────────────────────────
  {
    title: 'Aroma Diffuser Lamp',
    category: 'Home',
    brand: 'Calm',
    price: 1499,
    mrp: 2299,
    stock: 60,
    rating: 4.5,
    numReviews: 411,
    tags: ['home', 'wellness'],
    description:
      'Ultrasonic aroma diffuser with 7-color LED ambient light, 300ml tank and a whisper-quiet motor.',
    images: [
      u('1602874801007-aa307e9d5f4a'),
      u('1567016432779-094069958ea5'),
      u('1602928298849-325cbcb91f74'),
    ],
  },
  {
    title: 'Ceramic Pour-Over Coffee Set',
    category: 'Home',
    brand: 'Brew',
    price: 1799,
    mrp: 2499,
    stock: 40,
    rating: 4.6,
    numReviews: 312,
    featured: true,
    tags: ['coffee'],
    description:
      'Hand-thrown ceramic dripper and matching carafe — slow-brewed, café-quality coffee at home.',
    images: [
      u('1495474472287-4d71bcdd2085'),
      u('1504753793650-d4a2b783c15e'),
      u('1442550528053-c431ecb55509'),
    ],
  },
];

const ensureFeatured = (p) => p.featured || p.trending || Math.random() < 0.2;

const run = async () => {
  await connectDB();

  console.log('[seed] clearing products...');
  await Product.deleteMany({});

  const docs = products.map((p) => ({
    title: p.title,
    slug: slugify(p.title),
    description: p.description,
    price: p.price,
    mrp: p.mrp,
    stock: p.stock,
    images: p.images,
    category: p.category,
    brand: p.brand,
    rating: p.rating,
    numReviews: p.numReviews,
    tags: p.tags,
    featured: !!p.featured || ensureFeatured(p),
    trending: !!p.trending,
  }));

  await Product.insertMany(docs);
  console.log(`[seed] inserted ${docs.length} products`);

  const demoEmail = 'demo@shop.dev';
  const exists = await User.findOne({ email: demoEmail });
  if (!exists) {
    await User.create({ name: 'Demo User', email: demoEmail, password: 'demo1234' });
    console.log(`[seed] created demo user → ${demoEmail} / demo1234`);
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
