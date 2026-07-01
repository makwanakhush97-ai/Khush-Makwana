import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Heart, Menu, X, User, Search, Award, HelpCircle, 
  ShieldCheck, Star, Sparkles, Shirt, RefreshCw, Trash2, ArrowRight, 
  ArrowLeft, Send, Check, CheckCircle2, Info, Percent, AlertCircle, 
  Plus, Minus, Tag, MapPin, Phone, Mail, Building, Database, 
  TrendingUp, Filter, SlidersHorizontal, Eye, ChevronRight, Share2, 
  MessageSquare, PlusCircle
} from 'lucide-react';

import { Product, CartItem, WholesaleInquiry, DealerApplication, Review } from './types';
import { CATEGORIES, FABRICS, COLORS, INITIAL_PRODUCTS, INITIAL_REVIEWS, INSTAGRAM_POSTS } from './data';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import QuickViewModal from './components/QuickViewModal';
import AIStylist from './components/AIStylist';

export default function App() {
  // Navigation & Queries
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Core Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<WholesaleInquiry[]>([]);
  const [dealerApps, setDealerApps] = useState<DealerApplication[]>([]);
  const [subscribersCount, setSubscribersCount] = useState<number>(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  
  // Interaction State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [browsingHistory, setBrowsingHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [adminMode, setAdminMode] = useState<boolean>(false); // Profile Tab Admin Console Toggle

  // Forms
  const [inquiryForm, setInquiryForm] = useState({
    storeName: '',
    gstNumber: '',
    city: '',
    state: '',
    phone: '',
    whatsapp: '',
    expectedQuantity: '20 - 50 sets',
    message: ''
  });
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const [dealerForm, setDealerForm] = useState({
    storeName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    message: ''
  });
  const [dealerSubmitted, setDealerSubmitted] = useState(false);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  const [newReviewForm, setNewReviewForm] = useState({
    author: '',
    rating: 5,
    text: '',
  });

  // Admin New Product Form
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: 'Designer Suits',
    fabric: 'Premium Cotton',
    color: 'Burgundy',
    price: '',
    sku: '',
    description: '',
    careInstructions: '',
    shippingInfo: '',
    isNew: true,
    isTrending: false,
    isBestSeller: false,
    discount: '0',
    primaryImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?q=80&w=600&auto=format&fit=crop',
    stockL: '150',
    stockXL: '200',
    stockXXL: '150',
    stockXXXL: '100'
  });

  // Filters State
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterFabric, setFilterFabric] = useState<string>('All');
  const [filterColor, setFilterColor] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');

  // Load Data
  useEffect(() => {
    fetchProducts();
    fetchInquiries();
    fetchDealers();
    fetchReviews();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      const json = await res.json();
      if (json.success) {
        setProducts(json.data);
      } else {
        setProducts(INITIAL_PRODUCTS);
      }
    } catch (e) {
      console.error(e);
      setProducts(INITIAL_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/inquiries');
      const json = await res.json();
      if (json.success) {
        setInquiries(json.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchDealers = async () => {
    try {
      const res = await fetch('/api/dealers');
      const json = await res.json();
      if (json.success) {
        setDealerApps(json.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      const json = await res.json();
      if (json.success && json.data.length > 0) {
        setReviews(json.data);
      } else {
        setReviews(INITIAL_REVIEWS);
      }
    } catch (e) {
      console.error(e);
      setReviews(INITIAL_REVIEWS);
    }
  };

  // Cart Handlers
  const handleAddToCart = (product: Product, sizes: { L: number; XL: number; XXL: number; XXXL: number }) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => {
          if (item.product.id === product.id) {
            return {
              ...item,
              sizes: {
                L: item.sizes.L + sizes.L,
                XL: item.sizes.XL + sizes.XL,
                XXL: item.sizes.XXL + sizes.XXL,
                XXXL: item.sizes.XXXL + sizes.XXXL
              }
            };
          }
          return item;
        });
      } else {
        return [...prev, { product, sizes }];
      }
    });
  };

  const handleUpdateCartQuantity = (productId: string, size: 'L' | 'XL' | 'XXL' | 'XXXL', val: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const updatedSizes = { ...item.sizes, [size]: Math.max(0, val) };
          return { ...item, sizes: updatedSizes };
        }
        return item;
      }).filter(item => {
        const total = item.sizes.L + item.sizes.XL + item.sizes.XXL + item.sizes.XXXL;
        return total > 0;
      });
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentTab('product-detail');
    setBrowsingHistory(prev => {
      if (prev.includes(product.id)) {
        return [product.id, ...prev.filter(id => id !== product.id)];
      }
      return [product.id, ...prev];
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Inquiries & Forms
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryForm)
      });
      const data = await res.json();
      if (data.success) {
        setInquirySubmitted(true);
        fetchInquiries();
      } else {
        alert(data.message || 'Error submitting inquiry.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error submitting inquiry.');
    }
  };

  const handleDealerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/dealers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dealerForm)
      });
      const data = await res.json();
      if (data.success) {
        setDealerSubmitted(true);
        fetchDealers();
      } else {
        alert(data.message || 'Error submitting application.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error submitting application.');
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      const data = await res.json();
      setNewsletterMessage(data.message);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterMessage(''), 6000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: newReviewForm.author,
          rating: Number(newReviewForm.rating),
          text: newReviewForm.text,
          productName: selectedProduct.name
        })
      });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => [data.data, ...prev]);
        setNewReviewForm({ author: '', rating: 5, text: '' });
        alert('Thank you! Your verified partner review has been posted.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Product (Admin Mode)
  const handleAdminAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: newProductForm.name,
      category: newProductForm.category,
      fabric: newProductForm.fabric,
      color: newProductForm.color,
      price: Number(newProductForm.price),
      sku: newProductForm.sku,
      description: newProductForm.description,
      careInstructions: newProductForm.careInstructions,
      shippingInfo: newProductForm.shippingInfo,
      isNew: newProductForm.isNew,
      isTrending: newProductForm.isTrending,
      isBestSeller: newProductForm.isBestSeller,
      discount: Number(newProductForm.discount),
      images: [newProductForm.primaryImage, newProductForm.secondaryImage].filter(Boolean),
      stock: {
        L: Number(newProductForm.stockL),
        XL: Number(newProductForm.stockXL),
        XXL: Number(newProductForm.stockXXL),
        XXXL: Number(newProductForm.stockXXXL)
      }
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        alert('New product successfully catalogued and added to the wholesale floors!');
        fetchProducts();
        // Reset form
        setNewProductForm({
          name: '',
          category: 'Designer Suits',
          fabric: 'Premium Cotton',
          color: 'Burgundy',
          price: '',
          sku: '',
          description: '',
          careInstructions: '',
          shippingInfo: '',
          isNew: true,
          isTrending: false,
          isBestSeller: false,
          discount: '0',
          primaryImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop',
          secondaryImage: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?q=80&w=600&auto=format&fit=crop',
          stockL: '150',
          stockXL: '200',
          stockXXL: '150',
          stockXXXL: '100'
        });
      } else {
        alert(data.message || 'Error creating product.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Inquiry Status (Admin Mode)
  const handleUpdateInquiryStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        fetchInquiries();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Pricing Helpers
  const getProductDiscountedPrice = (prod: Product) => {
    const hasDiscount = prod.discount && prod.discount > 0;
    return hasDiscount
      ? Math.round(prod.price * (1 - (prod.discount || 0) / 100))
      : prod.price;
  };

  // Calculate cart metrics
  const cartSubtotal = cart.reduce((total, item) => {
    const discountedPrice = getProductDiscountedPrice(item.product);
    const qty = item.sizes.L + item.sizes.XL + item.sizes.XXL + item.sizes.XXXL;
    return total + (discountedPrice * qty);
  }, 0);

  const totalCartItems = cart.reduce((total, item) => {
    return total + item.sizes.L + item.sizes.XL + item.sizes.XXL + item.sizes.XXXL;
  }, 0);

  // Wholesale bulk discounts logic (PRD 10 Requirement)
  let wholesaleDiscountPercentage = 0;
  if (totalCartItems >= 100) {
    wholesaleDiscountPercentage = 20; // 20% off for 100+ pcs
  } else if (totalCartItems >= 50) {
    wholesaleDiscountPercentage = 15; // 15% off for 50+ pcs
  } else if (totalCartItems >= 20) {
    wholesaleDiscountPercentage = 10; // 10% off for 20+ pcs
  }

  const wholesaleDiscountAmount = Math.round(cartSubtotal * (wholesaleDiscountPercentage / 100));
  const preGstTotal = cartSubtotal - wholesaleDiscountAmount;
  const gstAmount = Math.round(preGstTotal * 0.12); // 12% GST on Apparel in India
  const finalWholesaleTotal = preGstTotal + gstAmount;

  // Filter & Search Logic
  const getFilteredProducts = () => {
    return products.filter(prod => {
      // Search
      const matchesSearch = searchQuery === '' || 
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.fabric.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.sku.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = filterCategory === 'All' || prod.category === filterCategory;

      // Fabric filter
      const matchesFabric = filterFabric === 'All' || prod.fabric === filterFabric;

      // Color filter
      const matchesColor = filterColor === 'All' || prod.color === filterColor;

      // Specific Tabs
      const matchesTab = 
        currentTab === 'new-arrivals' ? prod.isNew :
        currentTab === 'trending' ? prod.isTrending : true;

      return matchesSearch && matchesCategory && matchesFabric && matchesColor && matchesTab;
    }).sort((a, b) => {
      const priceA = getProductDiscountedPrice(a);
      const priceB = getProductDiscountedPrice(b);

      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return (b.discount || 0) - (a.discount || 0);
      return b.id.localeCompare(a.id); // Default featured/newest
    });
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Navbar Component */}
      <Navbar 
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setSelectedProduct(null); // Clear detail view
        }}
        cart={cart}
        wishlist={wishlist}
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
      />

      {/* Main content slot */}
      <main className="flex-grow">
        
        {/* TAB 1: HOME */}
        {currentTab === 'home' && (
          <div id="tab-home-screen" className="fade-in">
            
            {/* Elegant Hero Slider (Luxury Feel) */}
            <section id="hero-slider" className="relative bg-[#FAF6F0] overflow-hidden py-16 sm:py-24 border-b border-beige-dark/40">
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-[radial-gradient(#7B1E3A_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                
                <div className="space-y-6 text-center md:text-left">
                  <span className="text-[11px] uppercase tracking-[0.25em] font-extrabold text-burgundy bg-burgundy/10 px-3 py-1.5 rounded-full inline-block">
                    Surat Direct Manufacturer Catalog • 2026
                  </span>
                  
                  <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
                    Luxury Ethnic Wear <br />
                    <span className="text-burgundy">Crafted For Elite</span> <br />
                    Boutiques & Retailers
                  </h1>
                  
                  <p className="text-sm sm:text-base text-gray-600 max-w-lg leading-relaxed">
                    Direct manufacturer pricing with uncompromised Zara-standard premium finishing. Order custom sizes in bulk with real-time AI styling coordinates and dedicated dispatch.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start pt-2">
                    <button
                      id="hero-cta-shop"
                      onClick={() => setCurrentTab('shop')}
                      className="px-8 py-3.5 bg-burgundy hover:bg-burgundy/90 text-[#FCFBF9] text-xs font-bold uppercase tracking-widest rounded-lg shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      <span>Explore Catalog</span>
                      <ArrowRight size={14} />
                    </button>
                    <button
                      id="hero-cta-wholesale"
                      onClick={() => setCurrentTab('wholesale')}
                      className="px-8 py-3.5 border border-burgundy text-burgundy hover:bg-burgundy/5 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors"
                    >
                      <span>Get Wholesaler Catalog</span>
                    </button>
                  </div>

                  {/* Trust Highlights */}
                  <div className="grid grid-cols-3 gap-4 pt-8 border-t border-beige-dark/40 max-w-md mx-auto md:mx-0">
                    <div>
                      <span className="block text-xl font-bold text-burgundy">Surat</span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">Manufacturing Hub</span>
                    </div>
                    <div>
                      <span className="block text-xl font-bold text-burgundy">12% GST</span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">Authorized Bill</span>
                    </div>
                    <div>
                      <span className="block text-xl font-bold text-burgundy">24 Hrs</span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">Factory Dispatch</span>
                    </div>
                  </div>
                </div>

                {/* Hero Product Spotlight Frame */}
                <div className="relative flex justify-center">
                  <div className="absolute inset-0 bg-gold/10 rounded-3xl transform rotate-3 scale-95 z-0" />
                  <div className="relative bg-white p-4 rounded-3xl border border-beige-dark/50 shadow-2xl max-w-sm overflow-hidden z-10 transition-transform hover:scale-[1.02] duration-500">
                    <span className="absolute top-6 left-6 z-20 bg-burgundy text-[#FCFBF9] text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded shadow-sm">
                      Spotlight
                    </span>
                    <img
                      src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=450&auto=format&fit=crop"
                      alt="Premium Burgundy Velvet Anarkali Set spotlight"
                      className="w-full h-96 object-cover object-top rounded-2xl mb-4"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Pure Velvet Anarkali</span>
                        <h3 className="font-serif text-base font-bold text-gray-900 mt-0.5">Royal Burgundy Set</h3>
                      </div>
                      <button
                        onClick={() => {
                          const item = products.find(p => p.id === 'prod-1') || products[0];
                          if (item) handleViewProduct(item);
                        }}
                        className="p-2.5 bg-burgundy text-white rounded-full hover:bg-gold hover:text-burgundy transition-colors"
                        title="View Royal Burgundy Details"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* AI STYLIST SECTION IN HOME (PRD 8 REQUIREMENT) */}
            <section className="bg-[#FCFBF9] py-12 border-b border-beige-dark/20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AIStylist 
                  products={products}
                  onViewProduct={handleViewProduct}
                  onQuickView={(p) => setQuickViewProduct(p)}
                  onToggleWishlist={handleToggleWishlist}
                  wishlist={wishlist}
                  browsingHistory={browsingHistory}
                />
              </div>
            </section>

            {/* Core Collections Teaser Grid */}
            <section id="featured-collections" className="py-16 bg-white border-b border-beige-dark/20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-xl mx-auto mb-12">
                  <span className="text-xs uppercase tracking-[0.2em] font-bold text-burgundy">Curated Seasonal Runway</span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">Premium Fabric Collections</h2>
                  <div className="w-16 h-0.5 bg-gold mx-auto mt-3 rounded-full" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { title: 'Pure Velvet Suites', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=400&auto=format&fit=crop', desc: 'Heavy hand zari craftsmanship' },
                    { title: 'Chanderi & Organza', image: 'https://images.unsplash.com/photo-1610030470217-ef3d76b110bc?q=80&w=400&auto=format&fit=crop', desc: 'Transparent festive scallops' },
                    { title: 'Lucknowi Chikankari', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=400&auto=format&fit=crop', desc: 'Breathable geometric weaves' },
                    { title: 'Cotton Everyday', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=400&auto=format&fit=crop', desc: 'Handblock Jaipur original print' }
                  ].map((col, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        setFilterFabric(idx === 0 ? 'Pure Velvet' : idx === 1 ? 'Silk Organza' : idx === 2 ? 'Chanderi Silk' : 'Premium Cotton');
                        setCurrentTab('shop');
                      }}
                      className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow border border-beige-dark/20"
                    >
                      <img src={col.image} alt={col.title} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-6" />
                      <div className="absolute bottom-6 left-6 z-10 text-white">
                        <span className="text-[10px] text-gold uppercase tracking-widest font-bold">{col.desc}</span>
                        <h3 className="font-serif text-lg font-bold mt-1 group-hover:text-gold transition-colors">{col.title}</h3>
                        <span className="text-xs uppercase tracking-wider flex items-center gap-1.5 mt-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          View Catalog <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Products Runway Highlights (PRD 5 & 10 Size ordering preview) */}
            <section id="trending-runway" className="py-16 bg-[#FAF6F0]/50 border-b border-beige-dark/20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-end mb-10 gap-4">
                  <div>
                    <span className="text-xs uppercase tracking-widest font-bold text-burgundy">Top Retailer Ensembles</span>
                    <h2 className="font-serif text-3xl font-extrabold text-gray-900 mt-1">Trending Wholesale Catalog</h2>
                  </div>
                  <button
                    onClick={() => setCurrentTab('shop')}
                    className="text-xs uppercase tracking-widest font-bold text-burgundy hover:text-gold transition-colors flex items-center gap-1.5"
                  >
                    <span>View All Catalog Models</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.slice(0, 4).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewProduct={handleViewProduct}
                      onQuickView={(p) => setQuickViewProduct(p)}
                      onToggleWishlist={handleToggleWishlist}
                      isWishlisted={wishlist.some(w => w.id === product.id)}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Why Partner with Shayona Section */}
            <section id="wholesale-advantages" className="py-16 bg-white border-b border-beige-dark/25">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <div className="p-8 bg-[#FAF6F0] rounded-2xl border border-beige-dark/40 flex gap-4">
                  <div className="p-3 bg-burgundy/10 rounded-full text-burgundy h-12 w-12 flex items-center justify-center flex-shrink-0">
                    <Building size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-gray-900 mb-2">Direct Factory Pricing</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Zero middlemen. Directly sourced cottons, silk Chanderis and velvets printed and embroidered in our Surat industrial warehouse to guarantee ultimate markup for boutiques.
                    </p>
                  </div>
                </div>

                <div className="p-8 bg-[#FAF6F0] rounded-2xl border border-beige-dark/40 flex gap-4">
                  <div className="p-3 bg-burgundy/10 rounded-full text-burgundy h-12 w-12 flex items-center justify-center flex-shrink-0">
                    <SlidersHorizontal size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-gray-900 mb-2">Flexible Size Ordering</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Mix and match L, XL, XXL, and XXXL quantities dynamically without forcing rigid set-bundles. Fully digitalized dashboard workflow for boutiques.
                    </p>
                  </div>
                </div>

                <div className="p-8 bg-[#FAF6F0] rounded-2xl border border-beige-dark/40 flex gap-4">
                  <div className="p-3 bg-burgundy/10 rounded-full text-burgundy h-12 w-12 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-gray-900 mb-2">GST Compliant Billing</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Authorized commercial 12% GST invoicing to claim official inputs. Standardized double-stitch export box packaging with secure transport carriers.
                    </p>
                  </div>
                </div>

              </div>
            </section>

            {/* Customer & Partner Reviews Carousel Grid */}
            <section id="boutique-reviews" className="py-16 bg-[#FAF6F0]/30 border-b border-beige-dark/20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-xl mx-auto mb-12">
                  <span className="text-xs uppercase tracking-widest font-bold text-burgundy">Verified Boutique Retailers</span>
                  <h2 className="font-serif text-3xl font-extrabold text-gray-900 mt-2">What Our Boutique Partners Say</h2>
                  <div className="w-16 h-0.5 bg-gold mx-auto mt-3 rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {reviews.slice(0, 4).map((rev) => (
                    <div 
                      key={rev.id} 
                      className="bg-white p-6 rounded-xl border border-beige-dark/20 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex text-amber-400 mb-3">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <span key={i} className="text-sm">★</span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-600 italic leading-relaxed mb-4">
                          "{rev.text}"
                        </p>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-burgundy">{rev.author}</span>
                        {rev.productName && (
                          <span className="text-[10px] text-gray-400 block mt-1">Sourced: {rev.productName}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Instagram Live Catalogue Shop Grid */}
            <section id="insta-feed" className="py-16 bg-white border-b border-beige-dark/20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-xl mx-auto mb-12">
                  <span className="text-xs uppercase tracking-[0.2em] font-bold text-burgundy">@ShayonaCreationOfficial</span>
                  <h2 className="font-serif text-3xl font-extrabold text-gray-900 mt-1">Instagram Live Catalog</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {INSTAGRAM_POSTS.map((post) => {
                    const matchedProd = products.find(p => p.id === post.taggedProductId);
                    return (
                      <div key={post.id} className="group relative aspect-square rounded-xl overflow-hidden shadow-sm border border-beige-dark/25">
                        <img src={post.imageUrl} alt="Instagram Model post" className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center text-white p-4">
                          <span className="text-xs font-semibold">Likes: {post.likes}</span>
                          <span className="text-[10px] text-gray-300">Comments: {post.comments}</span>
                          {matchedProd && (
                            <button
                              onClick={() => handleViewProduct(matchedProd)}
                              className="mt-3 px-3 py-1.5 bg-burgundy text-[#FCFBF9] text-[9px] font-bold uppercase tracking-wider rounded"
                            >
                              Shop Tagged Model
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Newsletter Subscription (New Drops catalog release notifications) */}
            <section id="home-newsletter" className="py-16 bg-burgundy text-[#FCFBF9]">
              <div className="max-w-4xl mx-auto px-4 text-center">
                <span className="text-xs uppercase tracking-[0.25em] font-extrabold text-gold-light">Be First To Source</span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-2 mb-4">Subscribe to Shayona New Drops</h2>
                <p className="text-xs sm:text-sm text-beige-dark max-w-lg mx-auto leading-relaxed mb-8">
                  Get high-resolution PDF catalogs and priority broadcast on WhatsApp/Email as soon as raw-fabrics are finished in Surat workshops. No consumer spam, direct business alerts.
                </p>

                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter boutique or retail business email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    className="flex-1 bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 text-xs placeholder-white/40 focus:outline-none focus:border-gold focus:bg-white/20"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gold text-burgundy hover:bg-gold-light font-bold text-xs uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Send size={12} />
                    <span>Join Drops Broadcast</span>
                  </button>
                </form>

                {newsletterMessage && (
                  <p className="text-xs text-gold mt-4 font-semibold">{newsletterMessage}</p>
                )}
              </div>
            </section>

          </div>
        )}

        {/* TAB 2: SHOP CATALOG */}
        {(currentTab === 'shop' || currentTab === 'new-arrivals' || currentTab === 'trending') && (
          <div id="tab-shop-screen" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in">
            
            {/* Upper Banner */}
            <div className="border-b border-beige-dark/30 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-burgundy bg-burgundy/10 px-2 py-1 rounded">
                  {currentTab === 'new-arrivals' ? 'New Drops Only' : currentTab === 'trending' ? 'Trending Runs' : 'Complete Showroom'}
                </span>
                <h2 className="font-serif text-3xl font-extrabold text-gray-900 mt-2">
                  {currentTab === 'new-arrivals' ? 'New Drops Runway' : currentTab === 'trending' ? 'High Demand Outfits' : 'Shayona Ethnic Catalog'}
                </h2>
                <p className="text-xs text-gray-500 mt-1">Direct bulk supply matching strict boutique size standards.</p>
              </div>

              {/* Sorting & Stats */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-gray-400 font-medium">{filteredProducts.length} premium designs found</span>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-200 text-xs px-3 py-2 rounded focus:outline-none focus:border-burgundy"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating: Highest First</option>
                  <option value="discount">Discount: Highest First</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Filters */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Search */}
                <div className="bg-[#FAF6F0] p-4 rounded-xl border border-beige-dark/40">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-800 block mb-2">Search Catalog</span>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Type style, fabric, color..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs pl-8 pr-3 py-2 border border-gray-200 bg-white rounded focus:outline-none focus:border-burgundy"
                    />
                    <Search size={14} className="absolute left-2.5 top-3 text-gray-400" />
                  </div>
                </div>

                {/* Categories filter */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-800 block mb-3 border-b border-beige-dark/30 pb-1">Categories</span>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => setFilterCategory('All')}
                      className={`w-full text-left text-xs py-1.5 px-2.5 rounded ${
                        filterCategory === 'All' ? 'bg-burgundy text-[#FCFBF9] font-bold' : 'text-gray-600 hover:bg-beige-dark/25'
                      }`}
                    >
                      All Categories
                    </button>
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`w-full text-left text-xs py-1.5 px-2.5 rounded ${
                          filterCategory === cat ? 'bg-burgundy text-[#FCFBF9] font-bold' : 'text-gray-600 hover:bg-beige-dark/25'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fabrics filter */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-800 block mb-3 border-b border-beige-dark/30 pb-1">Fabrics</span>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => setFilterFabric('All')}
                      className={`w-full text-left text-xs py-1.5 px-2.5 rounded ${
                        filterFabric === 'All' ? 'bg-burgundy text-[#FCFBF9] font-bold' : 'text-gray-600 hover:bg-beige-dark/25'
                      }`}
                    >
                      All Fabrics
                    </button>
                    {FABRICS.map(fab => (
                      <button
                        key={fab}
                        onClick={() => setFilterFabric(fab)}
                        className={`w-full text-left text-xs py-1.5 px-2.5 rounded ${
                          filterFabric === fab ? 'bg-burgundy text-[#FCFBF9] font-bold' : 'text-gray-600 hover:bg-beige-dark/25'
                        }`}
                      >
                        {fab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors filter */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-800 block mb-3 border-b border-beige-dark/30 pb-1">Primary Color Vibe</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => setFilterColor('All')}
                      className={`col-span-2 text-center text-[11px] py-1.5 rounded border transition-colors ${
                        filterColor === 'All' ? 'bg-burgundy text-[#FCFBF9] font-bold border-burgundy' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      All Colors
                    </button>
                    {COLORS.map(col => (
                      <button
                        key={col.name}
                        onClick={() => setFilterColor(col.name)}
                        className={`text-left text-[10px] py-1.5 px-2 rounded border flex items-center gap-1.5 transition-all ${
                          filterColor === col.name ? 'border-burgundy bg-burgundy/10 text-burgundy font-bold' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full border border-gray-300" style={{ backgroundColor: col.hex }} />
                        <span className="truncate">{col.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset Filters */}
                <button
                  onClick={() => {
                    setFilterCategory('All');
                    setFilterFabric('All');
                    setFilterColor('All');
                    setSearchQuery('');
                  }}
                  className="w-full text-center py-2 border border-dashed border-gray-300 rounded text-xs text-gray-500 hover:text-burgundy hover:border-burgundy font-medium transition-colors"
                >
                  Clear All Filters
                </button>

              </div>

              {/* Products Grid */}
              <div className="lg:col-span-3">
                {filteredProducts.length === 0 ? (
                  <div className="bg-white border border-beige-dark/40 rounded-xl p-12 text-center">
                    <Shirt size={48} className="text-gray-300 mx-auto mb-3" />
                    <h3 className="font-serif text-lg font-bold text-gray-700">No matching garments found</h3>
                    <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                      Try updating your filters or search keywords. We refresh our factory-floor designs weekly.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(prod => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        onViewProduct={handleViewProduct}
                        onQuickView={(p) => setQuickViewProduct(p)}
                        onToggleWishlist={handleToggleWishlist}
                        isWishlisted={wishlist.some(w => w.id === prod.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: COLLECTIONS editorial */}
        {currentTab === 'collections' && (
          <div id="tab-collections-screen" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-burgundy">Shayona Signature</span>
              <h2 className="font-serif text-4xl font-extrabold text-gray-900 mt-2">The Editorial Curations</h2>
              <p className="text-xs text-gray-500 mt-2">Every collection is directly structured around our Surat manufacturing lines to maintain flawless catalog exclusivity.</p>
              <div className="w-16 h-0.5 bg-gold mx-auto mt-4 rounded-full" />
            </div>

            <div className="space-y-12">
              {[
                {
                  id: 'Anarkali Sets',
                  title: 'The Royal Velvet Corridor',
                  subtitle: 'Imperial Anarkali & Straight Ensembles',
                  image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop',
                  desc: 'Crafted utilizing high-grammage pure velvet featuring antique hand zari coordinates. Perfect for high-end boutique autumn wedding displays.',
                  skuRange: 'SKU: SHY-AN-2026'
                },
                {
                  id: 'Palazzo Sets',
                  title: 'Ivory Scallops & Sheer Organza',
                  subtitle: 'The Luxury Palazzo Assemblies',
                  image: 'https://images.unsplash.com/photo-1610030470217-ef3d76b110bc?q=80&w=1200&auto=format&fit=crop',
                  desc: 'Lightweight, translucent silk organzas with micro mirror detailing. Hand stitched to support both straight and custom flare trousers.',
                  skuRange: 'SKU: SHY-PL-2026'
                },
                {
                  id: 'Designer Suits',
                  title: 'Banarasi Jaal Handweaves',
                  subtitle: 'Heavy Zari Designer Formals',
                  image: 'https://images.unsplash.com/photo-1608962714022-7940ab212b7a?q=80&w=1200&auto=format&fit=crop',
                  desc: 'Inspired by Benaras weaving heritage. Luxurious silk sets coupled with intricate metallic weaving patterns to captivate wedding boutique buyers.',
                  skuRange: 'SKU: SHY-DS-2026'
                }
              ].map((col, idx) => (
                <div 
                  key={idx}
                  className={`flex flex-col lg:flex-row items-center gap-8 bg-[#FAF6F0]/60 p-6 sm:p-8 rounded-3xl border border-beige-dark/40 ${
                    idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Image */}
                  <div className="w-full lg:w-1/2 aspect-[16/10] rounded-2xl overflow-hidden shadow-lg border border-beige-dark/30">
                    <img src={col.image} alt={col.title} className="w-full h-full object-cover object-top hover:scale-[1.02] transition-transform duration-700" referrerPolicy="no-referrer" />
                  </div>

                  {/* Info */}
                  <div className="w-full lg:w-1/2 space-y-4 text-center lg:text-left">
                    <span className="text-[10px] font-mono tracking-wider text-gray-400 block">{col.skuRange}</span>
                    <span className="text-xs uppercase tracking-widest font-bold text-burgundy">{col.subtitle}</span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">{col.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{col.desc}</p>
                    
                    <button
                      onClick={() => {
                        setFilterCategory(col.id);
                        setCurrentTab('shop');
                      }}
                      className="px-6 py-2.5 bg-burgundy text-[#FCFBF9] text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-gold hover:text-burgundy transition-colors"
                    >
                      Shop Collection Models
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PRODUCT DETAIL */}
        {currentTab === 'product-detail' && selectedProduct && (
          <div id="tab-product-detail-screen" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in">
            
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-8 border-b border-beige-dark/20 pb-4">
              <button onClick={() => setCurrentTab('shop')} className="hover:text-burgundy">Shop</button>
              <span>/</span>
              <span className="text-gray-400">{selectedProduct.category}</span>
              <span>/</span>
              <span className="text-gray-900 font-semibold">{selectedProduct.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Image Runway */}
              <div className="lg:col-span-6 space-y-4">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-md bg-beige/10 border border-beige-dark/30">
                  <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" />
                </div>
                {/* Image gallery roll */}
                <div className="grid grid-cols-2 gap-4">
                  {selectedProduct.images.slice(1).map((img, i) => (
                    <div key={i} className="aspect-[3/4] rounded-xl overflow-hidden shadow-sm border border-beige-dark/30">
                      <img src={img} alt={`${selectedProduct.name} view ${i + 2}`} className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Buying Dashboard */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-burgundy font-extrabold bg-burgundy/10 px-2.5 py-1 rounded">
                    {selectedProduct.category}
                  </span>
                  <span className="text-xs text-gray-400 font-mono block mt-2">Factory SKU: {selectedProduct.sku}</span>
                  
                  <h1 className="font-serif text-3xl font-extrabold text-gray-900 mt-2 mb-2 leading-tight">
                    {selectedProduct.name}
                  </h1>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="text-sm">★</span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 font-medium">Verified Partner Rating: {selectedProduct.rating} / 5.0</span>
                  </div>

                  {/* Wholesale Pricing Table Box */}
                  <div className="bg-[#FAF6F0] p-4 rounded-xl border border-beige-dark/40 mb-6">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-[10px] uppercase font-bold text-gray-400">Wholesale Unit Price</span>
                      <span className="text-3xl font-extrabold text-burgundy">
                        ₹{getProductDiscountedPrice(selectedProduct).toLocaleString('en-IN')}
                      </span>
                      {selectedProduct.discount && selectedProduct.discount > 0 && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{selectedProduct.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-gray-500 space-y-1">
                      <p>• <strong>Mix & Match Sizing</strong> allowed to reach wholesale dispatch thresholds.</p>
                      <p>• GST invoice billing (12%) automatically generated at partner checkout.</p>
                    </div>
                  </div>

                  {/* Fabric Description */}
                  <div className="space-y-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-gray-800">Garment Craft & Detailing</span>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {selectedProduct.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-beige-dark/20 text-xs text-gray-700">
                      <p><strong>Primary Fabric:</strong> {selectedProduct.fabric}</p>
                      <p><strong>Dyeing Shade:</strong> {selectedProduct.color}</p>
                    </div>
                  </div>
                </div>

                {/* THE DYNAMIC WHOLESALE SIZE ORDERING SHEET (PRD 5 & 10) */}
                <div className="border-t border-beige-dark/30 pt-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs uppercase tracking-widest font-extrabold text-gray-800">
                      Dynamic Wholesale Stock Sheet
                    </span>
                    <span className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
                      Direct Surat Stock
                    </span>
                  </div>

                  <div className="bg-white rounded-xl border border-beige-dark/40 overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-beige-dark/20 text-gray-700 uppercase font-bold tracking-wider text-[10px] border-b border-beige-dark/35">
                          <th className="p-3">Size Tag</th>
                          <th className="p-3">Factory Stock</th>
                          <th className="p-3">Order Quantity</th>
                          <th className="p-3 text-right">Unit Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(['L', 'XL', 'XXL', 'XXXL'] as const).map((sz) => {
                          const stockAmt = selectedProduct.stock[sz] || 0;
                          // Find in current cart if any
                          const cartItem = cart.find(c => c.product.id === selectedProduct.id);
                          const currentQtyInCart = cartItem?.sizes[sz] || 0;
                          const discountedPrice = getProductDiscountedPrice(selectedProduct);

                          return (
                            <tr key={sz} className="border-b border-beige-dark/20 hover:bg-gray-50/50">
                              <td className="p-3 font-bold text-gray-900 uppercase">{sz}</td>
                              <td className="p-3">
                                {stockAmt > 100 ? (
                                  <span className="text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded text-[10px]">{stockAmt} Available</span>
                                ) : (
                                  <span className="text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded text-[10px]">{stockAmt} Running Low</span>
                                )}
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-2 border border-gray-200 bg-gray-50 rounded w-24">
                                  <button
                                    onClick={() => handleUpdateCartQuantity(selectedProduct.id, sz, currentQtyInCart - 1)}
                                    className="p-1 text-gray-500 hover:text-burgundy"
                                    title="Decrease quantity"
                                  >
                                    <Minus size={11} />
                                  </button>
                                  <span className="flex-1 text-center font-bold text-gray-800">
                                    {currentQtyInCart}
                                  </span>
                                  <button
                                    onClick={() => {
                                      if (currentQtyInCart < stockAmt) {
                                        handleAddToCart(selectedProduct, {
                                          L: sz === 'L' ? 1 : 0,
                                          XL: sz === 'XL' ? 1 : 0,
                                          XXL: sz === 'XXL' ? 1 : 0,
                                          XXXL: sz === 'XXXL' ? 1 : 0
                                        });
                                      } else {
                                        alert('Quantity exceeds factory stock limit.');
                                      }
                                    }}
                                    className="p-1 text-gray-500 hover:text-burgundy"
                                    title="Increase quantity"
                                  >
                                    <Plus size={11} />
                                  </button>
                                </div>
                              </td>
                              <td className="p-3 text-right font-semibold text-gray-900">
                                ₹{(currentQtyInCart * discountedPrice).toLocaleString('en-IN')}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* WhatsApp Direct Link pre-filled */}
                  <div className="mt-4 flex gap-2">
                    <a
                      href={`https://wa.me/919876543210?text=Hi%20Shayona%20Creation,%20I%20am%20interested%20in%20sourcing%20the%20following%20model:%20${encodeURIComponent(selectedProduct.name)}%20(SKU:%20${selectedProduct.sku}).%20Please%20share%20current%20wholesale%20margins.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <MessageSquare size={14} />
                      <span>Inquire SKU on WhatsApp</span>
                    </a>
                    
                    <button
                      onClick={() => handleToggleWishlist(selectedProduct)}
                      className={`px-4 border border-gray-300 rounded-lg text-gray-700 hover:text-burgundy hover:border-burgundy transition-colors ${
                        wishlist.some(w => w.id === selectedProduct.id) ? 'text-burgundy border-burgundy' : ''
                      }`}
                      title="Save to Wishlist"
                    >
                      <Heart size={16} fill={wishlist.some(w => w.id === selectedProduct.id) ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>

                {/* Care & Shipping details Tabs */}
                <div className="border-t border-beige-dark/30 pt-6 space-y-4 text-xs">
                  <div>
                    <span className="font-bold text-gray-800 uppercase block mb-1">🧼 Fabric Care Care instructions</span>
                    <p className="text-gray-500">
                      {selectedProduct.careInstructions || 'Dry clean recommended to preserve gold zari and custom fiber gloss. Store folded inside breathable muslin.'}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-gray-800 uppercase block mb-1">🚛 Factory Shipping & Freight</span>
                    <p className="text-gray-500">
                      {selectedProduct.shippingInfo || 'Dispatched inside 24 hours directly from Surat. Secured transit across India, Dubai, UK, US and Canada with online freight logs.'}
                    </p>
                  </div>
                </div>

                {/* Submit verified Review for this Product */}
                <div className="border-t border-beige-dark/30 pt-6 space-y-4">
                  <h3 className="font-serif text-lg font-bold text-gray-900">Verified Retailer Review</h3>
                  
                  <form onSubmit={handleReviewSubmit} className="space-y-3 bg-[#FAF6F0] p-4 rounded-xl border border-beige-dark/30">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Your Boutique Name</label>
                        <input 
                          type="text" 
                          placeholder="E.g. Heritage Jaipur boutique"
                          value={newReviewForm.author}
                          onChange={(e) => setNewReviewForm(prev => ({ ...prev, author: e.target.value }))}
                          required
                          className="w-full text-xs p-2 bg-white border border-gray-200 rounded focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Rating</label>
                        <select
                          value={newReviewForm.rating}
                          onChange={(e) => setNewReviewForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                          className="w-full text-xs p-2 bg-white border border-gray-200 rounded focus:outline-none"
                        >
                          <option value="5">5 Stars (Flawless Premium)</option>
                          <option value="4">4 Stars (Good Consistency)</option>
                          <option value="3">3 Stars (Average Fabric)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Your Review Statement</label>
                      <textarea 
                        placeholder="Detail fabric weave, consistency, sizing, styling or packaging feedback..."
                        value={newReviewForm.text}
                        onChange={(e) => setNewReviewForm(prev => ({ ...prev, text: e.target.value }))}
                        required
                        className="w-full text-xs p-2 bg-white border border-gray-200 rounded h-16 focus:outline-none resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-burgundy text-[#FCFBF9] text-[10px] font-bold uppercase tracking-wider rounded"
                    >
                      Post Partner Review
                    </button>
                  </form>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 5: OUR STORY */}
        {currentTab === 'about' && (
          <div id="tab-about-screen" className="max-w-4xl mx-auto px-4 py-16 fade-in text-center space-y-8">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-burgundy">DIRECT FROM SURAT FACTORY</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
              Crafting Luxury Ethnic <br />
              Sourcing Excellence
            </h2>
            
            <div className="w-20 h-0.5 bg-gold mx-auto" />

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Shayona Creation was born from a singular mission: providing luxury-tier Indian ethnic wear directly to premium boutique owners and international retail chain dealers without intermediaries. Based out of Surat, Gujarat—the undisputed textile core of India—we manage the complete pipeline from thread sourcing to hand embroidery and commercial distribution.
            </p>

            <img
              src="https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?q=80&w=1000&auto=format&fit=crop"
              alt="Industrial looms and ethnic wear production workshop"
              className="w-full h-80 object-cover object-top rounded-3xl shadow-lg border border-beige-dark/40"
              referrerPolicy="no-referrer"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
              <div className="p-6 bg-[#FAF6F0] rounded-2xl border border-beige-dark/30">
                <span className="block text-2xl font-serif font-bold text-burgundy">20+ Years</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block mt-1">Weaving Experience</span>
              </div>
              <div className="p-6 bg-[#FAF6F0] rounded-2xl border border-beige-dark/30">
                <span className="block text-2xl font-serif font-bold text-burgundy">500+</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block mt-1">Verified Boutiques</span>
              </div>
              <div className="p-6 bg-[#FAF6F0] rounded-2xl border border-beige-dark/30">
                <span className="block text-2xl font-serif font-bold text-burgundy">100% Cotton</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block mt-1">Ethical Sourcing</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: WHOLESALE INQUIRY FORM (PRD 5 REQUIREMENT) */}
        {currentTab === 'wholesale' && (
          <div id="tab-wholesale-screen" className="max-w-2xl mx-auto px-4 py-12 fade-in">
            {!inquirySubmitted ? (
              <div className="bg-white p-6 sm:p-10 rounded-2xl border border-beige-dark/50 shadow-xl space-y-6">
                <div className="text-center">
                  <span className="text-xs uppercase tracking-widest font-extrabold text-burgundy">Partner Onboarding Portal</span>
                  <h2 className="font-serif text-3xl font-bold text-gray-900 mt-1">Submit Wholesale Inquiry</h2>
                  <p className="text-xs text-gray-500 mt-1">Minimum commercial threshold: 20 pieces total across mixed designs.</p>
                </div>

                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Boutique / Store Name</label>
                      <input
                        type="text"
                        placeholder="E.g. Royal Heritage Ethnic Delhi"
                        value={inquiryForm.storeName}
                        onChange={(e) => setInquiryForm({...inquiryForm, storeName: e.target.value})}
                        required
                        className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:bg-white focus:border-burgundy"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">GST Registration Number (Optional)</label>
                      <input
                        type="text"
                        placeholder="E.g. 24AAAAA1111A1Z1"
                        value={inquiryForm.gstNumber}
                        onChange={(e) => setInquiryForm({...inquiryForm, gstNumber: e.target.value})}
                        className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:bg-white focus:border-burgundy"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">City</label>
                      <input
                        type="text"
                        placeholder="E.g. Jaipur"
                        value={inquiryForm.city}
                        onChange={(e) => setInquiryForm({...inquiryForm, city: e.target.value})}
                        required
                        className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:bg-white focus:border-burgundy"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">State / Province</label>
                      <input
                        type="text"
                        placeholder="E.g. Rajasthan"
                        value={inquiryForm.state}
                        onChange={(e) => setInquiryForm({...inquiryForm, state: e.target.value})}
                        required
                        className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:bg-white focus:border-burgundy"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Mobile Contact Phone</label>
                      <input
                        type="tel"
                        placeholder="E.g. +91 9876543210"
                        value={inquiryForm.phone}
                        onChange={(e) => setInquiryForm({...inquiryForm, phone: e.target.value})}
                        required
                        className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:bg-white focus:border-burgundy"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">WhatsApp Broadcast Phone</label>
                      <input
                        type="tel"
                        placeholder="For PDF catalog broadcasts"
                        value={inquiryForm.whatsapp}
                        onChange={(e) => setInquiryForm({...inquiryForm, whatsapp: e.target.value})}
                        className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:bg-white focus:border-burgundy"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Expected Monthly Procurement Volume</label>
                    <select
                      value={inquiryForm.expectedQuantity}
                      onChange={(e) => setInquiryForm({...inquiryForm, expectedQuantity: e.target.value})}
                      className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:bg-white focus:border-burgundy"
                    >
                      <option value="20 - 50 sets">Small Boutique (20 - 50 sets monthly)</option>
                      <option value="50 - 200 sets">Multi-brand Store (50 - 200 sets monthly)</option>
                      <option value="200 - 500 sets">Regional Distributor (200 - 500 sets monthly)</option>
                      <option value="500+ sets">Exporter / National Chain (500+ sets monthly)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Detailed Garment / Design Requirements</label>
                    <textarea
                      placeholder="Specify requested fabric weights, preferred sizes, and custom branding expectations..."
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm({...inquiryForm, message: e.target.value})}
                      className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded h-24 focus:outline-none focus:bg-white focus:border-burgundy resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-burgundy hover:bg-burgundy/90 text-[#FCFBF9] font-bold text-xs uppercase tracking-widest rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Send size={14} />
                    <span>Send Wholesale Inquiry</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-[#FAF6F0] p-8 rounded-2xl border border-gold/30 shadow-2xl text-center space-y-6 fade-in">
                <div className="p-4 bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-green-600 border border-green-200">
                  <CheckCircle2 size={36} />
                </div>
                
                <h2 className="font-serif text-3xl font-bold text-gray-900">Inquiry Authenticated!</h2>
                
                <div className="text-xs text-gray-600 space-y-2 max-w-md mx-auto leading-relaxed border-t border-b border-beige-dark/40 py-4">
                  <p>Thank you, <strong>{inquiryForm.storeName}</strong>. Our Surat industrial sales desk has registered your credentials.</p>
                  <p>Expected wholesale catalog and volume price breakdown spreadsheet will be dispatched to <strong>{inquiryForm.phone}</strong> via WhatsApp in approximately 10 minutes.</p>
                </div>

                <div className="flex gap-2 justify-center pt-2">
                  <button
                    onClick={() => {
                      setInquirySubmitted(false);
                      setInquiryForm({
                        storeName: '',
                        gstNumber: '',
                        city: '',
                        state: '',
                        phone: '',
                        whatsapp: '',
                        expectedQuantity: '20 - 50 sets',
                        message: ''
                      });
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-xs text-gray-600 hover:text-gray-800"
                  >
                    Submit New Inquiry
                  </button>
                  <button
                    onClick={() => setCurrentTab('shop')}
                    className="px-6 py-2 bg-burgundy text-white rounded-lg text-xs font-semibold"
                  >
                    Continue Browsing models
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: BECOME A DEALER */}
        {currentTab === 'dealer' && (
          <div id="tab-dealer-screen" className="max-w-2xl mx-auto px-4 py-12 fade-in">
            {!dealerSubmitted ? (
              <div className="bg-white p-6 sm:p-10 rounded-2xl border border-beige-dark/50 shadow-xl space-y-6">
                <div className="text-center">
                  <span className="text-xs uppercase tracking-widest font-extrabold text-burgundy">Hub Distribution Program</span>
                  <h2 className="font-serif text-3xl font-bold text-gray-900 mt-1">Become a Shayona Dealer</h2>
                  <p className="text-xs text-gray-500 mt-1">Acquire exclusive regional hub distribution rights across India and overseas.</p>
                </div>

                <form onSubmit={handleDealerSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Company / Store Name</label>
                      <input
                        type="text"
                        placeholder="E.g. Chhabra Ethnic Distributors"
                        value={dealerForm.storeName}
                        onChange={(e) => setDealerForm({...dealerForm, storeName: e.target.value})}
                        required
                        className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Owner Name</label>
                      <input
                        type="text"
                        placeholder="E.g. Vikas Chhabra"
                        value={dealerForm.ownerName}
                        onChange={(e) => setDealerForm({...dealerForm, ownerName: e.target.value})}
                        required
                        className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Contact Email Address</label>
                      <input
                        type="email"
                        placeholder="vikas@chhabra.com"
                        value={dealerForm.email}
                        onChange={(e) => setDealerForm({...dealerForm, email: e.target.value})}
                        required
                        className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Mobile Contact Phone</label>
                      <input
                        type="tel"
                        placeholder="E.g. +91 9988776655"
                        value={dealerForm.phone}
                        onChange={(e) => setDealerForm({...dealerForm, phone: e.target.value})}
                        required
                        className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Target Distribution Warehouse Address</label>
                    <input
                      type="text"
                      placeholder="Specify street, city and regional hub zone..."
                      value={dealerForm.address}
                      onChange={(e) => setDealerForm({...dealerForm, address: e.target.value})}
                      required
                      className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Distribution Experience & Investment Profile</label>
                    <textarea
                      placeholder="Outline your current distribution brands, sub-dealer network, and expected inventory storage volume..."
                      value={dealerForm.message}
                      onChange={(e) => setDealerForm({...dealerForm, message: e.target.value})}
                      className="w-full text-xs p-3 bg-gray-50 border border-gray-200 rounded h-24 focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-burgundy hover:bg-burgundy/90 text-[#FCFBF9] font-bold text-xs uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Award size={14} className="text-gold" />
                    <span>Submit Distributorship Application</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-[#FAF6F0] p-8 rounded-2xl border border-gold/30 shadow-2xl text-center space-y-6 fade-in">
                <div className="p-4 bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-green-600 border border-green-200">
                  <CheckCircle2 size={36} />
                </div>
                
                <h2 className="font-serif text-3xl font-bold text-gray-900">Application Registered</h2>
                
                <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{dealerForm.ownerName}</strong>. Our franchise onboarding team will contact you at <strong>{dealerForm.email}</strong> to review warehousing details and coordinate physical sample dispatches.
                </p>

                <button
                  onClick={() => {
                    setDealerSubmitted(false);
                    setDealerForm({
                      storeName: '',
                      ownerName: '',
                      email: '',
                      phone: '',
                      address: '',
                      message: ''
                    });
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-xs text-gray-600 hover:text-gray-800"
                >
                  Submit New Application
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 8: CONTACT US */}
        {currentTab === 'contact' && (
          <div id="tab-contact-screen" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 fade-in">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs uppercase tracking-widest font-bold text-burgundy">Reach Surat Manufacturing Floor</span>
              <h2 className="font-serif text-3xl font-extrabold text-gray-900 mt-2">Contact Shayona Creation</h2>
              <div className="w-16 h-0.5 bg-gold mx-auto mt-3 rounded-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Warehouse coordinates */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-[#FAF6F0] p-6 rounded-2xl border border-beige-dark/40 space-y-4">
                  <h3 className="font-serif text-lg font-bold text-gray-900">Head Office & Factory Outlet</h3>
                  
                  <div className="flex gap-3 text-xs text-gray-600 items-start">
                    <MapPin size={18} className="text-burgundy flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Shayona Creation</strong><br />
                      Factory Floor Sector 4, Textile Development Zone,<br />
                      Surat, Gujarat - 395003, India.
                    </p>
                  </div>

                  <div className="flex gap-3 text-xs text-gray-600 items-start">
                    <Phone size={18} className="text-burgundy flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Wholesale Support Desk:</strong> +91 9876543210<br />
                      <strong>Factory Operations Desk:</strong> +91 9123456789
                    </p>
                  </div>

                  <div className="flex gap-3 text-xs text-gray-600 items-start">
                    <Mail size={18} className="text-burgundy flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Partner Queries:</strong> support@shayonacreation.com<br />
                      <strong>Boutique Sales desk:</strong> sales@shayonacreation.com
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-beige-dark/20 flex gap-3 items-center">
                  <ShieldCheck size={36} className="text-burgundy" />
                  <div>
                    <span className="block text-xs font-bold text-gray-900 uppercase">GST Registered Wholesaler</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">Claim input credit under commercial apparel category codes.</span>
                  </div>
                </div>
              </div>

              {/* Google Maps Visual mock (PRD Design Guideline requirement) */}
              <div className="lg:col-span-7 h-96 bg-beige-dark/20 rounded-2xl overflow-hidden border border-beige-dark/40 relative flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-cover bg-center filter grayscale opacity-40" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop')" }} />
                
                {/* Visual map pin card */}
                <div className="relative bg-white p-5 rounded-xl border border-beige-dark/60 shadow-xl max-w-sm text-center space-y-3 z-10">
                  <div className="p-3 bg-burgundy text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto shadow-md">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-gray-900">Shayona Factory floor Pin</h4>
                    <p className="text-[10px] text-gray-500 mt-1">Industrial Zone, Ring Road, Surat, India.</p>
                  </div>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-burgundy hover:bg-burgundy/90 text-white text-[10px] font-bold uppercase tracking-wider rounded"
                  >
                    Get GPS Navigation
                  </a>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 9: WISHLIST */}
        {currentTab === 'wishlist' && (
          <div id="tab-wishlist-screen" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs uppercase tracking-widest font-bold text-burgundy">Your Curated Collection</span>
              <h2 className="font-serif text-3xl font-extrabold text-gray-900 mt-1">My Saved Designs</h2>
              <div className="w-16 h-0.5 bg-gold mx-auto mt-3 rounded-full" />
            </div>

            {wishlist.length === 0 ? (
              <div className="bg-white border border-beige-dark/40 rounded-xl p-12 text-center max-w-md mx-auto">
                <Heart size={48} className="text-gray-300 mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-gray-700">Wishlist is empty</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Save garments during visual runway browsing to compare materials and checkout size orders together.
                </p>
                <button
                  onClick={() => setCurrentTab('shop')}
                  className="mt-6 px-6 py-2.5 bg-burgundy text-white rounded text-xs font-semibold"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlist.map(prod => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onViewProduct={handleViewProduct}
                    onQuickView={(p) => setQuickViewProduct(p)}
                    onToggleWishlist={handleToggleWishlist}
                    isWishlisted={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 10: CART & CHECKOUT (PRD SIZE BREAKDOWN WORKSHEET) */}
        {currentTab === 'cart' && (
          <div id="tab-cart-screen" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in">
            <div className="border-b border-beige-dark/30 pb-5 mb-8">
              <span className="text-xs uppercase tracking-widest font-extrabold text-burgundy bg-burgundy/10 px-2 py-0.5 rounded">
                Direct Surat Factory Dispatch
              </span>
              <h2 className="font-serif text-3xl font-extrabold text-gray-900 mt-2">Wholesale Sizing Order Sheet</h2>
              <p className="text-xs text-gray-500 mt-1">Compile sizes and submit digitalized commercial freight orders.</p>
            </div>

            {cart.length === 0 ? (
              <div className="bg-white border border-beige-dark/40 rounded-xl p-12 text-center max-w-md mx-auto">
                <ShoppingBag size={48} className="text-gray-300 mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-gray-700">Your Order Sheet is empty</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Select unit sizes on quick-view panels or full details page to assemble wholesale packages.
                </p>
                <button
                  onClick={() => setCurrentTab('shop')}
                  className="mt-6 px-6 py-2.5 bg-burgundy text-white rounded text-xs font-semibold"
                >
                  Source Factory Models
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Sizing Sheet details */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {cart.map((item) => {
                    const discountedPrice = getProductDiscountedPrice(item.product);
                    const itemTotalQty = item.sizes.L + item.sizes.XL + item.sizes.XXL + item.sizes.XXXL;
                    const itemTotalCost = itemTotalQty * discountedPrice;

                    return (
                      <div 
                        key={item.product.id}
                        className="bg-white p-5 rounded-xl border border-beige-dark/40 shadow-sm flex flex-col md:flex-row gap-5 justify-between"
                      >
                        <div className="flex gap-4">
                          <div className="w-20 h-28 rounded-lg overflow-hidden flex-shrink-0 border border-beige-dark/30">
                            <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <span className="text-[9px] font-mono text-gray-400">SKU: {item.product.sku}</span>
                            <h3 className="font-serif text-base font-bold text-gray-950 mt-0.5">{item.product.name}</h3>
                            <span className="text-xs text-burgundy font-semibold block mt-1">₹{discountedPrice} / unit price</span>
                            <span className="text-[10px] text-gray-400 block mt-1">Category: {item.product.category} • {item.product.fabric}</span>
                          </div>
                        </div>

                        {/* Sizing grid controls inside cart worksheet */}
                        <div className="flex flex-col justify-between items-end gap-3 border-t md:border-t-0 pt-4 md:pt-0">
                          
                          <div className="flex gap-2">
                            {(['L', 'XL', 'XXL', 'XXXL'] as const).map((sz) => {
                              const qty = item.sizes[sz];
                              return (
                                <div key={sz} className="text-center">
                                  <span className="block text-[10px] uppercase font-bold text-gray-400 mb-1">{sz}</span>
                                  <div className="flex items-center gap-1.5 border border-gray-200 rounded px-1.5 py-0.5 bg-gray-50 text-[11px]">
                                    <button 
                                      onClick={() => handleUpdateCartQuantity(item.product.id, sz, qty - 1)}
                                      className="text-gray-400 hover:text-burgundy"
                                    >
                                      -
                                    </button>
                                    <span className="font-bold w-4 text-center">{qty}</span>
                                    <button 
                                      onClick={() => handleUpdateCartQuantity(item.product.id, sz, qty + 1)}
                                      className="text-gray-400 hover:text-burgundy"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="flex items-center gap-4 w-full justify-between md:justify-end">
                            <div className="text-right">
                              <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Quantity subtotal</span>
                              <span className="text-sm font-bold text-gray-900">{itemTotalQty} pcs • ₹{itemTotalCost.toLocaleString('en-IN')}</span>
                            </div>
                            <button
                              onClick={() => handleRemoveFromCart(item.product.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                              title="Delete Design from Sheet"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                        </div>
                      </div>
                    );
                  })}

                  {/* Volume Discounts Guide banner */}
                  <div className="bg-[#FAF6F0] p-4 rounded-xl border border-beige-dark/40 flex items-start gap-3">
                    <Percent size={20} className="text-burgundy flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-burgundy uppercase tracking-widest block">Surat Manufacturer volume pricing Scale</span>
                      <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                        • Sizing <strong>20 - 49 pcs:</strong> get 10% discount automatic.<br />
                        • Sizing <strong>50 - 99 pcs:</strong> get 15% discount automatic.<br />
                        • Sizing <strong>100+ pcs:</strong> get 20% discount automatic direct from Surat floors.
                      </p>
                    </div>
                  </div>

                </div>

                {/* Bill Worksheet receipt & checkout mock */}
                <div className="lg:col-span-4">
                  <div className="bg-[#FAF6F0] p-6 rounded-2xl border border-beige-dark/45 shadow-lg space-y-4 sticky top-24">
                    <h3 className="font-serif text-lg font-bold text-gray-950 border-b border-beige-dark/30 pb-3">Commercial Invoicing Worksheet</h3>
                    
                    <div className="space-y-2 text-xs text-gray-600 border-b border-beige-dark/30 pb-4">
                      <div className="flex justify-between">
                        <span>Raw Volume Total ({totalCartItems} pcs)</span>
                        <span className="font-semibold text-gray-900">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                      </div>
                      
                      {wholesaleDiscountAmount > 0 && (
                        <div className="flex justify-between text-green-600 font-semibold">
                          <span>Wholesale Volume discount ({wholesaleDiscountPercentage}%)</span>
                          <span>- ₹{wholesaleDiscountAmount.toLocaleString('en-IN')}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-gray-500">
                        <span>GST Registered billing Input (12%)</span>
                        <span>₹{gstAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-baseline pt-2">
                      <span className="text-xs uppercase font-extrabold text-gray-900">Final Bill Worksheet</span>
                      <span className="text-xl font-black text-burgundy">₹{finalWholesaleTotal.toLocaleString('en-IN')}</span>
                    </div>

                    {totalCartItems < 20 ? (
                      <div className="p-3 bg-amber-50 rounded border border-amber-200 text-[10px] text-amber-800 flex gap-2 items-start">
                        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                        <p>Our minimum wholesale dispatch batch requires <strong>20 pieces</strong> across mixed styles. Please add {20 - totalCartItems} more pieces.</p>
                      </div>
                    ) : (
                      <div className="p-3 bg-green-50 rounded border border-green-200 text-[10px] text-green-800 flex gap-2 items-start">
                        <Check size={14} className="flex-shrink-0 mt-0.5" />
                        <p><strong>Minimum Order threshold reached!</strong> volume discount tier ({wholesaleDiscountPercentage}%) automatically claimed.</p>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        if (totalCartItems < 20) {
                          alert('Please reach minimum wholesale limit of 20 garments total to request commercial dispatch.');
                          return;
                        }
                        // Create inquiry payload from cart details
                        const cartItemsDescription = cart.map(item => {
                          const qty = item.sizes.L + item.sizes.XL + item.sizes.XXL + item.sizes.XXXL;
                          return `${item.product.name} (${qty} pcs: L:${item.sizes.L}, XL:${item.sizes.XL}, XXL:${item.sizes.XXL}, XXXL:${item.sizes.XXXL})`;
                        }).join('; ');

                        setInquiryForm({
                          storeName: '',
                          gstNumber: '',
                          city: '',
                          state: '',
                          phone: '',
                          whatsapp: '',
                          expectedQuantity: '20 - 50 sets',
                          message: `Digital order sheet checkout compiled. Total ${totalCartItems} items requested. Details: ${cartItemsDescription}`
                        });
                        setCurrentTab('wholesale');
                      }}
                      className={`w-full py-3.5 font-bold text-xs uppercase tracking-widest rounded-lg shadow-md flex items-center justify-center gap-2 ${
                        totalCartItems < 20
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-burgundy hover:bg-burgundy/90 text-[#FCFBF9]'
                      }`}
                    >
                      <CheckCircle2 size={14} />
                      <span>Compile dispatch Invoice</span>
                    </button>

                    <div className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1.5 mt-2">
                      <ShieldCheck size={12} className="text-gold" />
                      <span>Invoices processed strictly via GST secure billing lines.</span>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* TAB 11: PORTAL / PROFILE / ADMIN (PRD ACCOUNT CONSOLE FEATURE) */}
        {(currentTab === 'account' || currentTab === 'admin') && (
          <div id="tab-portal-screen" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 fade-in">
            
            {/* Header / Portal Toggles */}
            <div className="border-b border-beige-dark/30 pb-5 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest font-extrabold text-burgundy bg-burgundy/10 px-2 py-0.5 rounded">
                  Partner Portal
                </span>
                <h2 className="font-serif text-3xl font-extrabold text-gray-900 mt-2">
                  {adminMode ? 'Surat Factory Management Console' : 'Boutique Buyer Dashboard'}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {adminMode ? 'Manage factory floor catalog, inbound wholesale inquiries, and dealerships.' : 'Track your PDF inquiries, download volume catalogs, and chat with Surat dispatch.'}
                </p>
              </div>

              {/* Console Toggle Button */}
              <button
                id="admin-mode-toggle"
                onClick={() => setAdminMode(!adminMode)}
                className="px-4 py-2 bg-burgundy text-[#FCFBF9] hover:bg-gold hover:text-burgundy text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 shadow-sm"
              >
                <Database size={14} />
                <span>{adminMode ? 'Switch to Buyer Profile' : 'Switch to Admin Console'}</span>
              </button>
            </div>

            {/* PROFILE MODE: Buyer profile */}
            {!adminMode ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Profile welcome */}
                <div className="md:col-span-4 bg-[#FAF6F0] p-6 rounded-2xl border border-beige-dark/40 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-burgundy text-[#FCFBF9] w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                      P
                    </div>
                    <div>
                      <h3 className="font-serif text-base font-bold text-gray-950">Boutique Owner</h3>
                      <span className="text-[10px] text-gray-500 block">Status: Verified Wholesale Partner</span>
                    </div>
                  </div>

                  <div className="border-t border-beige-dark/30 pt-4 text-xs text-gray-600 space-y-2.5">
                    <p><strong>Mobile Hotline:</strong> +91 9876543210</p>
                    <p><strong>Boutique Region:</strong> India Mainland Outlet</p>
                    <p><strong>Volume tier claimed:</strong> Mixed Sizing standard (L - XXXL)</p>
                  </div>

                  <div className="bg-white/60 p-3 rounded text-[10px] text-gray-500">
                    Your account has automatic priority dispatch and commercial GST deduction clearance. Next catalog updates scheduled in 48 hours.
                  </div>
                </div>

                {/* Buyer resources */}
                <div className="md:col-span-8 space-y-6">
                  
                  {/* Download catalogs */}
                  <div className="bg-white p-6 rounded-2xl border border-beige-dark/25 shadow-sm">
                    <h3 className="font-serif text-lg font-bold text-gray-900 mb-4">Export Factory PDFs & Catalogues</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
                        <div>
                          <span className="block text-xs font-bold text-gray-900">Autumn Velvet Catalog</span>
                          <span className="text-[10px] text-gray-400 block mt-0.5">High definition PDF • 42 pages</span>
                        </div>
                        <a href="#" className="p-2 bg-burgundy/10 text-burgundy hover:bg-burgundy hover:text-white rounded transition-colors text-xs font-semibold">Download</a>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
                        <div>
                          <span className="block text-xs font-bold text-gray-900">Lucknowi Organza Catalog</span>
                          <span className="text-[10px] text-gray-400 block mt-0.5">High definition PDF • 18 pages</span>
                        </div>
                        <a href="#" className="p-2 bg-burgundy/10 text-burgundy hover:bg-burgundy hover:text-white rounded transition-colors text-xs font-semibold">Download</a>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Support Coordinator */}
                  <div className="bg-white p-6 rounded-2xl border border-beige-dark/25 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div>
                      <h4 className="font-serif text-base font-bold text-gray-900">Dedicated Surat Dispatch Support Coordinator</h4>
                      <p className="text-xs text-gray-500 mt-1">Directly chat for freight discounts, custom packing requests and size clarifications.</p>
                    </div>
                    <a
                      href="https://wa.me/919876543210"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Phone size={14} />
                      <span>Chat Coordinator</span>
                    </a>
                  </div>

                </div>

              </div>
            ) : (
              // ADMIN MODE: Fully Functional Factory Console! (PRD ACCOUNT CONSOLE FEATURE)
              <div className="space-y-10">
                
                {/* Admin Quick stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-xl border border-beige-dark/30 shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-gray-400">Total Factory Models</span>
                    <span className="block text-2xl font-serif font-bold text-burgundy mt-1">{products.length}</span>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-beige-dark/30 shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-gray-400">Wholesale Inquiries</span>
                    <span className="block text-2xl font-serif font-bold text-burgundy mt-1">{inquiries.length} Inbound</span>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-beige-dark/30 shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-gray-400">Franchise applications</span>
                    <span className="block text-2xl font-serif font-bold text-burgundy mt-1">{dealerApps.length} Inbound</span>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-beige-dark/30 shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-gray-400">Verified Reviews</span>
                    <span className="block text-2xl font-serif font-bold text-burgundy mt-1">{reviews.length} total</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Left panel: Add new design */}
                  <div className="lg:col-span-5 bg-[#FAF6F0] p-6 rounded-2xl border border-beige-dark/45 space-y-6 h-fit">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-gray-900">Catalogue New Factory Design</h3>
                      <p className="text-[10px] text-gray-500 mt-0.5">Push new creations directly onto buyer catalogs in real-time.</p>
                    </div>

                    <form onSubmit={handleAdminAddProduct} className="space-y-3.5 text-xs">
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Garment Name</label>
                        <input
                          type="text"
                          placeholder="E.g. Vintage Banarasi Georgette Set"
                          value={newProductForm.name}
                          onChange={(e) => setNewProductForm({...newProductForm, name: e.target.value})}
                          required
                          className="w-full p-2.5 bg-white border border-gray-200 rounded focus:outline-none focus:border-burgundy"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Category</label>
                          <select
                            value={newProductForm.category}
                            onChange={(e) => setNewProductForm({...newProductForm, category: e.target.value})}
                            className="w-full p-2.5 bg-white border border-gray-200 rounded focus:outline-none"
                          >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Fabric Weight</label>
                          <select
                            value={newProductForm.fabric}
                            onChange={(e) => setNewProductForm({...newProductForm, fabric: e.target.value})}
                            className="w-full p-2.5 bg-white border border-gray-200 rounded focus:outline-none"
                          >
                            {FABRICS.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Color Shade</label>
                          <input
                            type="text"
                            value={newProductForm.color}
                            onChange={(e) => setNewProductForm({...newProductForm, color: e.target.value})}
                            className="w-full p-2.5 bg-white border border-gray-200 rounded focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Wholesale Price (₹)</label>
                          <input
                            type="number"
                            placeholder="3299"
                            value={newProductForm.price}
                            onChange={(e) => setNewProductForm({...newProductForm, price: e.target.value})}
                            required
                            className="w-full p-2.5 bg-white border border-gray-200 rounded focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Discount (%)</label>
                          <input
                            type="number"
                            placeholder="10"
                            value={newProductForm.discount}
                            onChange={(e) => setNewProductForm({...newProductForm, discount: e.target.value})}
                            className="w-full p-2.5 bg-white border border-gray-200 rounded focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Unique Factory SKU</label>
                        <input
                          type="text"
                          placeholder="SHY-DS-2026-X"
                          value={newProductForm.sku}
                          onChange={(e) => setNewProductForm({...newProductForm, sku: e.target.value})}
                          className="w-full p-2.5 bg-white border border-gray-200 rounded focus:outline-none"
                        />
                      </div>

                      {/* Stock sizes matrix */}
                      <div className="bg-white p-3 rounded-lg border border-beige-dark/30">
                        <span className="font-bold text-gray-800 block mb-2 text-[10px] uppercase tracking-wider">Initial Sizing Stock Matrices</span>
                        <div className="grid grid-cols-4 gap-2 text-center">
                          <div>
                            <span className="block font-bold">L</span>
                            <input type="number" value={newProductForm.stockL} onChange={(e) => setNewProductForm({...newProductForm, stockL: e.target.value})} className="w-full p-1 border rounded text-center mt-1 text-xs" />
                          </div>
                          <div>
                            <span className="block font-bold">XL</span>
                            <input type="number" value={newProductForm.stockXL} onChange={(e) => setNewProductForm({...newProductForm, stockXL: e.target.value})} className="w-full p-1 border rounded text-center mt-1 text-xs" />
                          </div>
                          <div>
                            <span className="block font-bold">XXL</span>
                            <input type="number" value={newProductForm.stockXXL} onChange={(e) => setNewProductForm({...newProductForm, stockXXL: e.target.value})} className="w-full p-1 border rounded text-center mt-1 text-xs" />
                          </div>
                          <div>
                            <span className="block font-bold">XXXL</span>
                            <input type="number" value={newProductForm.stockXXXL} onChange={(e) => setNewProductForm({...newProductForm, stockXXXL: e.target.value})} className="w-full p-1 border rounded text-center mt-1 text-xs" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Primary Image URL</label>
                        <input
                          type="text"
                          value={newProductForm.primaryImage}
                          onChange={(e) => setNewProductForm({...newProductForm, primaryImage: e.target.value})}
                          className="w-full p-2.5 bg-white border border-gray-200 rounded focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Catalog Description</label>
                        <textarea
                          placeholder="Describe details, embroideries, weaves and margins..."
                          value={newProductForm.description}
                          onChange={(e) => setNewProductForm({...newProductForm, description: e.target.value})}
                          className="w-full p-2.5 bg-white border border-gray-200 rounded h-16 focus:outline-none resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-burgundy hover:bg-burgundy/90 text-white font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <PlusCircle size={14} />
                        <span>Publish To Buyer Catalog</span>
                      </button>
                    </form>
                  </div>

                  {/* Right panel: Active inbound inquiries table */}
                  <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-beige-dark/25 shadow-sm space-y-6 overflow-x-auto">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-gray-900">Inbound Wholesaler Inquiries</h3>
                      <p className="text-[10px] text-gray-400 mt-0.5">Real-time leads submitted via digital invoice checkout.</p>
                    </div>

                    <div className="space-y-4 min-w-[500px]">
                      {inquiries.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">
                          No inbound commercial inquiries recorded. Check frontend checkout loops.
                        </div>
                      ) : (
                        inquiries.map((inq) => (
                          <div 
                            key={inq.id}
                            className="bg-gray-50 p-4 rounded-xl border border-beige-dark/30 space-y-3"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-gray-950 text-xs">{inq.storeName}</h4>
                                <span className="text-[10px] text-gray-400 block">{inq.city}, {inq.state} • GST: {inq.gstNumber || 'Unregistered'}</span>
                              </div>
                              <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                                inq.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                                inq.status === 'Contacted' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {inq.status}
                              </span>
                            </div>

                            <p className="text-[11px] text-gray-600 italic bg-white p-2.5 rounded border border-beige-dark/15">
                              "{inq.message}"
                            </p>

                            <div className="flex justify-between items-center text-[10px] text-gray-500 pt-1">
                              <span>Mobile Hotline: <strong>{inq.phone}</strong> • Volume: <strong>{inq.expectedQuantity}</strong></span>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleUpdateInquiryStatus(inq.id, 'Contacted')}
                                  className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded"
                                >
                                  Mark Contacted
                                </button>
                                <button
                                  onClick={() => handleUpdateInquiryStatus(inq.id, 'Closed')}
                                  className="px-2 py-1 bg-green-50 text-green-700 hover:bg-green-100 rounded"
                                >
                                  Close Deal
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Distributors applications table summary */}
                    <div className="border-t border-beige-dark/30 pt-6">
                      <h4 className="font-serif text-lg font-bold text-gray-900 mb-4">Regional Distributors Applications</h4>
                      <div className="space-y-4 min-w-[500px]">
                        {dealerApps.length === 0 ? (
                          <div className="p-4 text-center text-gray-400 text-xs">
                            No regional distributorship requests on file.
                          </div>
                        ) : (
                          dealerApps.map((deal) => (
                            <div key={deal.id} className="p-3 bg-gray-50 rounded border border-beige-dark/25 text-xs text-gray-600">
                              <div className="flex justify-between">
                                <span className="font-bold text-gray-900">{deal.storeName} ({deal.ownerName})</span>
                                <span className="text-[9px] text-gray-400">{new Date(deal.timestamp).toLocaleDateString()}</span>
                              </div>
                              <p className="mt-1"><strong>Phone:</strong> {deal.phone} | <strong>Email:</strong> {deal.email}</p>
                              <p className="mt-1"><strong>Target Hub Zone:</strong> {deal.address}</p>
                              <p className="mt-1 bg-white p-2 rounded border border-beige-dark/20 italic">"{deal.message}"</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* Footer (Premium branding display) */}
      <footer id="main-footer" className="bg-[#1A1A1A] text-beige-dark py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <span className="block text-2xl font-serif font-extrabold tracking-widest text-[#FCFBF9]">
              SHAYONA
            </span>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold -mt-2">
              Creation — Premium Ethnic
            </span>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Premium women's ethnic wear store, manufacturer & wholesaler. Experience Zara-like luxurious browsing with custom wholesale bulk size-ordering. Directly dispatched from Surat, Gujarat.
            </p>
          </div>

          <div>
            <span className="block text-xs uppercase tracking-widest font-extrabold text-[#FCFBF9] mb-4">Direct Navigation</span>
            <ul className="space-y-2 text-[11px] text-gray-400">
              <li><button onClick={() => setCurrentTab('shop')} className="hover:text-gold">Complete Catalog</button></li>
              <li><button onClick={() => setCurrentTab('collections')} className="hover:text-gold">Runway Collections</button></li>
              <li><button onClick={() => setCurrentTab('new-arrivals')} className="hover:text-gold">New Drops Weekly</button></li>
              <li><button onClick={() => setCurrentTab('trending')} className="hover:text-gold">Trending Demands</button></li>
            </ul>
          </div>

          <div>
            <span className="block text-xs uppercase tracking-widest font-extrabold text-[#FCFBF9] mb-4">Partner Portals</span>
            <ul className="space-y-2 text-[11px] text-gray-400">
              <li><button onClick={() => setCurrentTab('wholesale')} className="hover:text-gold">Submit Wholesale Inquiry</button></li>
              <li><button onClick={() => setCurrentTab('dealer')} className="hover:text-gold">Become a Dealer</button></li>
              <li><button onClick={() => setCurrentTab('account')} className="hover:text-gold">Boutique Owner Portal</button></li>
              <li><button onClick={() => setCurrentTab('admin')} className="hover:text-gold">Surat Operations Desk</button></li>
            </ul>
          </div>

          <div>
            <span className="block text-xs uppercase tracking-widest font-extrabold text-[#FCFBF9] mb-4">Contact Logistics</span>
            <p className="text-[11px] text-gray-400 leading-relaxed mb-2">
              Factory Zone Sector 4, TDZ,<br />
              Surat, Gujarat, India.
            </p>
            <p className="text-[11px] text-gold font-bold">
              Hotline: +91 9876543210
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-white/5 text-center text-[10px] text-gray-500 flex flex-col sm:flex-row justify-between gap-4">
          <span>© 2026 Shayona Creation. All rights reserved. Industrial direct wholesale distribution.</span>
          <span className="flex items-center justify-center gap-1.5">
            <ShieldCheck size={12} className="text-gold" /> GST 24AAAAA1111A1Z1 • Surat Manufacturing Association
          </span>
        </div>
      </footer>

      {/* QUICK VIEW MODAL COMPONENT */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={quickViewProduct ? wishlist.some(w => w.id === quickViewProduct.id) : false}
        onViewDetails={handleViewProduct}
      />

    </div>
  );
}
