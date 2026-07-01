export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  rating: number;
  images: string[]; // [primary, hover/secondary, ...optional]
  category: string;
  fabric: string;
  color: string;
  description: string;
  careInstructions?: string;
  shippingInfo?: string;
  isNew?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  discount?: number; // e.g. 10 for 10%
  stock: {
    L: number;
    XL: number;
    XXL: number;
    XXXL: number;
  };
}

export interface CartItem {
  product: Product;
  sizes: {
    L: number;
    XL: number;
    XXL: number;
    XXXL: number;
  };
}

export interface WholesaleInquiry {
  id: string;
  storeName: string;
  gstNumber?: string;
  city: string;
  state: string;
  phone: string;
  whatsapp: string;
  expectedQuantity: string;
  message: string;
  timestamp: string;
  status: 'Pending' | 'Contacted' | 'Closed';
}

export interface DealerApplication {
  id: string;
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  message: string;
  timestamp: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  productName?: string;
  imageUrl?: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  timestamp: string;
}
