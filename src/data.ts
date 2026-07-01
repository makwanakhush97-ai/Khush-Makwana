import { Product, Review } from './types';

export const CATEGORIES = [
  'Designer Suits',
  'Anarkali Sets',
  'Premium Kurtis',
  'Sharara Sets',
  'Palazzo Sets',
  'Cotton Collections',
  'Festive Wear'
];

export const FABRICS = [
  'Premium Cotton',
  'Pure Velvet',
  'Silk Organza',
  'Georgette',
  'Banarasi Silk',
  'Chanderi Silk',
  'Linen'
];

export const COLORS = [
  { name: 'Burgundy', hex: '#7B1E3A' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Ivory', hex: '#FFFFF0' },
  { name: 'Mustard Gold', hex: '#E1AD01' },
  { name: 'Emerald Green', hex: '#50C878' },
  { name: 'Blush Pink', hex: '#FFD1DC' },
  { name: 'Midnight Black', hex: '#1A1A1A' },
  { name: 'Mint Green', hex: '#98FF98' }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Royal Burgundy Velvet Anarkali Set',
    sku: 'SHY-AN-2026-001',
    price: 3899,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?q=80&w=600&auto=format&fit=crop'
    ],
    category: 'Anarkali Sets',
    fabric: 'Pure Velvet',
    color: 'Burgundy',
    description: 'Elevate your festive elegance with our signature Burgundy Velvet Anarkali Set. Exquisitely handcrafted with heavy golden zari embroidery along the neckline and sleeves. Comes with matching velvet slim-fit trousers and a sheer organza dupatta framed with delicate scallop borders. Directly designed and manufactured by Shayona Creation for ultimate wholesale premium value.',
    careInstructions: 'Dry clean only. Store in a muslin cloth to preserve velvet sheen.',
    shippingInfo: 'Wholesale batch dispatch within 24-48 hours. Express delivery across India and overseas.',
    isNew: true,
    isTrending: true,
    discount: 15,
    stock: { L: 150, XL: 200, XXL: 180, XXXL: 120 }
  },
  {
    id: 'prod-2',
    name: 'Embroidered Ivory Organza Palazzo Set',
    sku: 'SHY-PL-2026-002',
    price: 3499,
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1610030470217-ef3d76b110bc?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop'
    ],
    category: 'Palazzo Sets',
    fabric: 'Silk Organza',
    color: 'Ivory',
    description: 'A masterpiece in ivory. Crafted from premium sheer silk organza, this straight kurta set features tone-on-tone resham embroidery and delicate mirror-work. Pair it with its flared palazzo pants and an oversized dupatta for a contemporary yet highly traditional boutique appeal.',
    careInstructions: 'Professional dry clean recommended. Iron on low heat on reverse.',
    shippingInfo: 'Standard batch dispatch within 24 hours. Factory wholesale dispatch available.',
    isNew: true,
    isTrending: false,
    stock: { L: 80, XL: 120, XXL: 100, XXXL: 70 }
  },
  {
    id: 'prod-3',
    name: 'Zari Banarasi Silk Designer Suit',
    sku: 'SHY-DS-2026-003',
    price: 4299,
    rating: 5.0,
    images: [
      'https://images.unsplash.com/photo-1608962714022-7940ab212b7a?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?q=80&w=600&auto=format&fit=crop'
    ],
    category: 'Designer Suits',
    fabric: 'Banarasi Silk',
    color: 'Mustard Gold',
    description: 'Inspired by traditional Banarasi weaving heritage, this designer suit exhibits complex golden zari jaal patterns all over. Perfect for wedding attendees and grand celebrations. Includes a premium silk kurta, contrasting solid trousers, and an exquisite weave dupatta.',
    careInstructions: 'Dry clean only. Avoid spraying perfumes directly on the zari threads.',
    shippingInfo: 'Specially handled packaging. Bulk catalog order discounts applicable.',
    isBestSeller: true,
    isTrending: true,
    discount: 10,
    stock: { L: 100, XL: 150, XXL: 120, XXXL: 90 }
  },
  {
    id: 'prod-4',
    name: 'Blush Rose Georgette Sharara Set',
    sku: 'SHY-SH-2026-004',
    price: 2999,
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600&auto=format&fit=crop'
    ],
    category: 'Sharara Sets',
    fabric: 'Georgette',
    color: 'Blush Pink',
    description: 'Perfect for daytime festivities and cocktail parties. This gorgeous sharara set is made from breathable, flowy faux georgette fabric. Features fine chikankari-inspired white thread-work with high-quality micro-sequins. Includes tiered sharara pants and a matching sequin-speckled dupatta.',
    careInstructions: 'Gentle hand wash in cold water with mild detergent or dry clean.',
    shippingInfo: 'Dispatched directly from our Surat factory. Wholesaler bundles available.',
    isTrending: true,
    stock: { L: 200, XL: 250, XXL: 220, XXXL: 150 }
  },
  {
    id: 'prod-5',
    name: 'Lucknowi Chikankari Mint Green Kurta Set',
    sku: 'SHY-KT-2026-005',
    price: 2499,
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop'
    ],
    category: 'Premium Kurtis',
    fabric: 'Chanderi Silk',
    color: 'Mint Green',
    description: 'A breath of fresh air. This Mint Green Kurta Set features intricate hand-woven Lucknowi chikankari patterns. The premium Chanderi fabric has a subtle natural gloss that gives it an outstandingly rich texture. Comes with comfort-fit cotton-blend pants and a chiffon dupatta.',
    careInstructions: 'Dry clean preferred. Hand wash inside out in cold water.',
    shippingInfo: 'Fast dispatch from factory depot. Bulk orders enjoy secure container transit.',
    isNew: false,
    isTrending: true,
    discount: 5,
    stock: { L: 140, XL: 160, XXL: 130, XXXL: 110 }
  },
  {
    id: 'prod-6',
    name: 'Sanganeri Block Print Cotton Suit',
    sku: 'SHY-CC-2026-006',
    price: 1999,
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1610030470217-ef3d76b110bc?q=80&w=600&auto=format&fit=crop'
    ],
    category: 'Cotton Collections',
    fabric: 'Premium Cotton',
    color: 'Beige',
    description: 'Designed for ultimate comfort without compromising on style. Made from 100% long-staple premium cotton, this set exhibits the world-famous Sanganeri block printing. Hand-stamped by local artisans, featuring a comfortable direct-fit short tunic kurta, straight pants, and a mulmul cotton dupatta.',
    careInstructions: 'Machine wash on gentle cycle with cold water. Dry in shade.',
    shippingInfo: 'Daily shipping from Surat. Extremely popular with boutique and retail shop owners.',
    isBestSeller: true,
    stock: { L: 300, XL: 350, XXL: 300, XXXL: 200 }
  },
  {
    id: 'prod-7',
    name: 'Midnight Black Gota Patti Designer Suit',
    sku: 'SHY-DS-2026-007',
    price: 3699,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop'
    ],
    category: 'Designer Suits',
    fabric: 'Chanderi Silk',
    color: 'Midnight Black',
    description: 'Make a bold, royal statement. This Midnight Black Designer Suit is lavishly decorated with gold gota-patti and zardozi embroidery. Cut from pure lightweight Chanderi silk with a beautiful sheen. Accompanied by silk trousers and a heavily worked chiffon dupatta.',
    careInstructions: 'Dry clean only. Store wrapped in soft paper or cotton.',
    shippingInfo: 'Premium boxed packaging. Direct wholesale factory supply.',
    isNew: true,
    isTrending: true,
    discount: 20,
    stock: { L: 90, XL: 120, XXL: 90, XXXL: 80 }
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Sunita Sharma (Boutique Owner, Delhi)',
    rating: 5,
    text: 'Outstanding quality! The velvet in prod-1 is incredibly rich. My premium customers bought out my entire stock in 2 days. Ordering another batch of 100 suits right now!',
    date: '2026-06-25',
    productName: 'Royal Burgundy Velvet Anarkali Set'
  },
  {
    id: 'rev-2',
    author: 'Kriti Kapoor (Shop Owner, Mumbai)',
    rating: 5,
    text: 'Sizing is highly consistent, and fabric quality is exceptional. As a wholesaler, finding a reliable direct manufacturer is hard, but Shayona has become my main vendor.',
    date: '2026-06-20',
    productName: 'Zari Banarasi Silk Designer Suit'
  },
  {
    id: 'rev-3',
    author: 'Pooja Patel (Reseller, Ahmedabad)',
    rating: 4,
    text: 'Very fast shipping. The Sanganeri print cotton set feels extremely comfortable and the colors don’t bleed. Highly recommended for daily boutique sales.',
    date: '2026-06-18',
    productName: 'Sanganeri Block Print Cotton Suit'
  },
  {
    id: 'rev-4',
    author: 'Meera Deshmukh (Boutique Owner, Pune)',
    rating: 5,
    text: 'Incredible customer support and super smooth wholesale billing process. The mirror-work organza palazzo set is highly refined. Absolute luxury!',
    date: '2026-06-12',
    productName: 'Embroidered Ivory Organza Palazzo Set'
  }
];

export const INSTAGRAM_POSTS = [
  {
    id: 'ig-1',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=400&auto=format&fit=crop',
    likes: '12.4k',
    comments: 489,
    taggedProductId: 'prod-1'
  },
  {
    id: 'ig-2',
    imageUrl: 'https://images.unsplash.com/photo-1608962714022-7940ab212b7a?q=80&w=400&auto=format&fit=crop',
    likes: '8.9k',
    comments: 312,
    taggedProductId: 'prod-3'
  },
  {
    id: 'ig-3',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400&auto=format&fit=crop',
    likes: '15.2k',
    comments: 651,
    taggedProductId: 'prod-4'
  },
  {
    id: 'ig-4',
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=400&auto=format&fit=crop',
    likes: '10.5k',
    comments: 290,
    taggedProductId: 'prod-5'
  }
];
