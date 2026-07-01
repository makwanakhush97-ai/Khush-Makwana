import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// In-Memory Database State
let productsList: any[] = [
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
    careInstructions: 'Dry clean only. Store wrapped in cotton tissue.',
    shippingInfo: 'Wholesale batch dispatch within 24-48 hours. Express delivery worldwide.',
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
    careInstructions: 'Dry clean only.',
    shippingInfo: 'Dispatched in 24 hours. Wholesale bundles available.',
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
    careInstructions: 'Dry clean only. Store wrapped in soft paper.',
    shippingInfo: 'Direct factory dispatch from Surat.',
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
    careInstructions: 'Gentle hand wash inside out.',
    shippingInfo: 'Factory direct dispatch.',
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
    careInstructions: 'Dry clean preferred.',
    shippingInfo: 'Express transit.',
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
    careInstructions: 'Machine wash in cold water.',
    shippingInfo: 'Surat depot shipping.',
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
    careInstructions: 'Dry clean only.',
    shippingInfo: 'Premium boxed delivery.',
    isNew: true,
    isTrending: true,
    discount: 20,
    stock: { L: 90, XL: 120, XXL: 90, XXXL: 80 }
  }
];

let inquiriesList: any[] = [
  {
    id: 'inq-1',
    storeName: 'Royal Heritage Boutiques',
    gstNumber: '24AAAAA1111A1Z1',
    city: 'Jaipur',
    state: 'Rajasthan',
    phone: '9876543210',
    whatsapp: '9876543210',
    expectedQuantity: '200 - 500 sets',
    message: 'We are looking to source the Royal Burgundy Velvet Anarkali Set and Ivory Organza Palazzo Set in bulk for the upcoming festive season. Please share your wholesale catalogs and pricing tiers for orders above 300 sets.',
    timestamp: '2026-06-28T14:32:00.000Z',
    status: 'Pending'
  },
  {
    id: 'inq-2',
    storeName: 'Pragati Ethnic Wear',
    gstNumber: '27BBBBB2222B2Z2',
    city: 'Mumbai',
    state: 'Maharashtra',
    phone: '9123456789',
    whatsapp: '9123456789',
    expectedQuantity: '100 - 200 sets',
    message: 'Interested in the Sanganeri block print premium cotton collections for our multi-brand retail shops across Mumbai.',
    timestamp: '2026-06-29T09:15:00.000Z',
    status: 'Contacted'
  }
];

let dealerApplicationsList: any[] = [
  {
    id: 'deal-1',
    storeName: 'Chhabra & Sons Wear',
    ownerName: 'Vikas Chhabra',
    email: 'vikas@chhabraethnic.com',
    phone: '9988776655',
    address: 'Main Chowk Market, Ludhiana, Punjab',
    message: 'We have been wholesaling ethnic wear for 15 years in Punjab. We want to secure an exclusive distributorship of Shayona Creation for the Ludhiana hub.',
    timestamp: '2026-06-27T11:05:00.000Z'
  }
];

let subscribersList: any[] = [];
let reviewsList: any[] = [
  {
    id: 'rev-1',
    author: 'Sunita Sharma (Boutique Owner, Delhi)',
    rating: 5,
    text: 'Outstanding quality! The velvet in Royal Burgundy Velvet Anarkali Set is incredibly rich. My premium customers bought out my entire stock in 2 days. Ordering another batch of 100 suits right now!',
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
  }
];

// Lazy initialization function for Gemini API client to prevent crashing on missing key
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key.includes("MY_GEMINI_API_KEY")) {
      throw new Error("GEMINI_API_KEY is not configured or is a placeholder. Please configure it in your Secrets / Env variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// REST API Routes

// Get Products
app.get("/api/products", (req, res) => {
  res.json({ success: true, data: productsList });
});

// Add Product (Admin Mode)
app.post("/api/products", (req, res) => {
  const { name, category, fabric, color, price, sku, description, careInstructions, shippingInfo, isNew, isTrending, isBestSeller, discount, images, stock } = req.body;
  
  if (!name || !price || !category) {
    return res.status(400).json({ success: false, message: "Product name, category and price are required." });
  }

  const newProduct = {
    id: `prod-${Date.now()}`,
    name,
    sku: sku || `SHY-GEN-${Math.floor(100 + Math.random() * 900)}`,
    price: Number(price),
    rating: 5.0,
    images: images && images.length > 0 ? images : [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1610030470217-ef3d76b110bc?q=80&w=600&auto=format&fit=crop'
    ],
    category,
    fabric: fabric || 'Premium Cotton',
    color: color || 'Burgundy',
    description: description || `${name} is directly sourced from premium fabrics to cater to high-end trends.`,
    careInstructions: careInstructions || 'Dry clean recommended.',
    shippingInfo: shippingInfo || 'Dispatched directly from factory inside 48 hours.',
    isNew: !!isNew,
    isTrending: !!isTrending,
    isBestSeller: !!isBestSeller,
    discount: discount ? Number(discount) : 0,
    stock: stock || { L: 100, XL: 100, XXL: 100, XXXL: 100 }
  };

  productsList.unshift(newProduct);
  res.json({ success: true, data: newProduct });
});

// Submit Wholesale Inquiry
app.post("/api/inquiries", (req, res) => {
  const { storeName, gstNumber, city, state, phone, whatsapp, expectedQuantity, message } = req.body;
  if (!storeName || !city || !state || !phone || !expectedQuantity) {
    return res.status(400).json({ success: false, message: "Required fields missing. Store name, city, state, phone, and quantity tier are mandatory." });
  }

  const newInquiry = {
    id: `inq-${Date.now()}`,
    storeName,
    gstNumber,
    city,
    state,
    phone,
    whatsapp: whatsapp || phone,
    expectedQuantity,
    message: message || "Interested in catalog and wholesale prices.",
    timestamp: new Date().toISOString(),
    status: 'Pending'
  };

  inquiriesList.unshift(newInquiry);
  res.json({ success: true, data: newInquiry });
});

// Get Wholesale Inquiries (Admin)
app.get("/api/inquiries", (req, res) => {
  res.json({ success: true, data: inquiriesList });
});

// Update Inquiry Status (Admin)
app.patch("/api/inquiries/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const inq = inquiriesList.find(i => i.id === id);
  if (inq) {
    inq.status = status || inq.status;
    return res.json({ success: true, data: inq });
  }
  res.status(404).json({ success: false, message: "Inquiry not found." });
});

// Submit Dealer Application
app.post("/api/dealers", (req, res) => {
  const { storeName, ownerName, email, phone, address, message } = req.body;
  if (!storeName || !ownerName || !email || !phone || !address) {
    return res.status(400).json({ success: false, message: "Please fill all required fields." });
  }

  const newApp = {
    id: `deal-${Date.now()}`,
    storeName,
    ownerName,
    email,
    phone,
    address,
    message: message || "",
    timestamp: new Date().toISOString()
  };

  dealerApplicationsList.unshift(newApp);
  res.json({ success: true, data: newApp });
});

// Get Dealer Applications (Admin)
app.get("/api/dealers", (req, res) => {
  res.json({ success: true, data: dealerApplicationsList });
});

// Submit Newsletter Subscriber
app.post("/api/newsletter", (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ success: false, message: "Please enter a valid email address." });
  }
  
  if (subscribersList.some(s => s.email === email)) {
    return res.json({ success: true, message: "You are already subscribed to the Shayona New Drops list!" });
  }

  const sub = {
    id: `sub-${Date.now()}`,
    email,
    timestamp: new Date().toISOString()
  };
  subscribersList.push(sub);
  res.json({ success: true, message: "Thank you for subscribing! You will receive early notifications of our upcoming catalogs." });
});

// Get Newsletter Subscribers (Admin)
app.get("/api/newsletter", (req, res) => {
  res.json({ success: true, data: subscribersList });
});

// Add Product Review
app.post("/api/reviews", (req, res) => {
  const { author, rating, text, productName } = req.body;
  if (!author || !rating || !text || !productName) {
    return res.status(400).json({ success: false, message: "Required fields missing for submitting a review." });
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    author,
    rating: Number(rating),
    text,
    date: new Date().toISOString().split('T')[0],
    productName
  };

  reviewsList.unshift(newReview);
  res.json({ success: true, data: newReview });
});

// Get Product Reviews
app.get("/api/reviews", (req, res) => {
  res.json({ success: true, data: reviewsList });
});


// AI FEATURES (Powered by Gemini 3.5 Flash)

// AI Fashion Recommender
app.post("/api/ai/recommend", async (req, res) => {
  const { browsingHistory, preferredColors, preferredFabrics, preferredCategories } = req.body;
  
  try {
    const ai = getAIClient();
    
    const contextPrompt = `
      You are the Elite AI Stylist for Shayona Creation, a premium luxury-tier Indian ethnic wear brand.
      Your goal is to recommend the perfect outfits from Shayona's direct factory catalog.
      
      Here is the available Shayona catalog:
      ${JSON.stringify(productsList.map(p => ({ id: p.id, name: p.name, category: p.category, fabric: p.fabric, color: p.color, price: p.price, desc: p.description })))}
      
      User preferences:
      - Browsing History: ${JSON.stringify(browsingHistory || [])}
      - Preferred Colors: ${JSON.stringify(preferredColors || [])}
      - Preferred Fabrics: ${JSON.stringify(preferredFabrics || [])}
      - Preferred Categories: ${JSON.stringify(preferredCategories || [])}
      
      Suggest exactly 3 recommended products from our catalog that align best with their preferences.
      Also, write a customized styling summary/expert notes for the user. Explain in an elegant, premium tone why these products match them and styling advice on what to wear them with.
      
      Return your response strictly in the following JSON format:
      {
        "recommendedProductIds": ["prod-X", "prod-Y", "prod-Z"],
        "stylistNotes": "Detailed, elegant paragraph with tailored style guide, fabric selection explanation, and boutique presentation advice.",
        "seasonalTrendNotes": "Brief advice on what's trending in Indian ethnic wear this season"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contextPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedProductIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of matched product IDs from the catalog."
            },
            stylistNotes: {
              type: Type.STRING,
              description: "Elegant, customized stylist write-up."
            },
            seasonalTrendNotes: {
              type: Type.STRING,
              description: "Brief comment on latest Indian wear trends."
            }
          },
          required: ["recommendedProductIds", "stylistNotes", "seasonalTrendNotes"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("AI Recommendation error:", error);
    // Graceful fallback if Gemini API is not setup or fails
    res.json({
      success: false,
      message: error.message || "Failed to generate AI styling recommendations",
      fallback: {
        recommendedProductIds: ["prod-1", "prod-3", "prod-7"],
        stylistNotes: "Welcome to Shayona Creation! Based on the latest haute trends from Surat, Jaipur and Mumbai, we highly recommend focusing on Royal Burgundy Velvets and Chanderi Silk Zardozi ensembles. They represent the absolute pinnacle of premium handcraft and seasonal ethnic elegance. Ideal for wedding boutiques and wedding celebrations.",
        seasonalTrendNotes: "Velvet and sheer organza mixes dominate luxury runways. Deep wines, ivory tones, and mustard golds are the colors of the season."
      }
    });
  }
});

// Style Match - Complete the Look
app.post("/api/ai/complete-look", async (req, res) => {
  const { productId, productName, category, fabric, color } = req.body;
  
  if (!productName) {
    return res.status(400).json({ success: false, message: "Product name is required to complete the look." });
  }

  try {
    const ai = getAIClient();
    
    const contextPrompt = `
      You are the Master Fashion Couturier of Shayona Creation.
      Generate a "Complete the Look" styling curation for the following garment:
      - Name: "${productName}"
      - Category: "${category || ''}"
      - Fabric: "${fabric || ''}"
      - Color: "${color || ''}"
      
      We want to recommend complimentary accessories, dupatta styling, leggings/trousers matching, footwear styles, and jewelry to create a complete head-to-toe luxury look.
      
      Return your response strictly in the following JSON format:
      {
        "dupattaStyling": "Expert suggestion on how to drape or coordinate the dupatta (e.g. single-shoulder cowl drape, neck wrap, etc.)",
        "leggingsCoordinate": "Recommended leggings, trousers, or bottom wear color & fit matches.",
        "accessories": "Suggested designer clutches, potli bags, or waist belt styles.",
        "footwear": "Type of footwear to pair (e.g., golden juttis, embellished mules, block heels) and colors.",
        "jewelry": "Earrings, neckpieces or bangles that fit perfectly (e.g., kundan choker, chandbalis, gold polki).",
        "hairMakeup": "Graceful suggestions for hairstyle and makeup tone (e.g., elegant bun, nude makeup with bold lip)."
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contextPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dupattaStyling: { type: Type.STRING },
            leggingsCoordinate: { type: Type.STRING },
            accessories: { type: Type.STRING },
            footwear: { type: Type.STRING },
            jewelry: { type: Type.STRING },
            hairMakeup: { type: Type.STRING }
          },
          required: ["dupattaStyling", "leggingsCoordinate", "accessories", "footwear", "jewelry", "hairMakeup"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error("AI Complete the Look error:", error);
    res.json({
      success: false,
      message: error.message || "Failed to generate Complete the Look suggestions",
      fallback: {
        dupattaStyling: `Pair with a high-contrast sheer Silk Organza dupatta. Drape it gracefully over one shoulder with a polished fold, letting the hand-crafted scalloped borders display beautifully.`,
        leggingsCoordinate: `Opt for straight-cut premium cotton trousers or silk palazzos in a matching or complementary Soft Gold tone to complete the royal structure.`,
        accessories: `An embellished velvet Potli bag in Rose Gold or Burgundy with pearl tassels will elevate the factory direct styling of the dress.`,
        footwear: `Traditional handcrafted leather Juttis with golden zari embroidery, or pointed low block-heeled mules.`,
        jewelry: `Heavy Kundan Chandbali earrings with a matching simple gold choker, or polki bangles.`,
        hairMakeup: `An elegant low bun decorated with fresh jasmine (gajra) paired with soft dewy makeup and a classic deep maroon matte lip.`
      }
    });
  }
});


// Dev server setup vs Static build delivery
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Shayona Creation premium server is running on http://0.0.0.0:${PORT}`);
  });
}

start();
