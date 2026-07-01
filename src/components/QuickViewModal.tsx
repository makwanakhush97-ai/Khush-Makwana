import React, { useState, useEffect } from 'react';
import { X, Heart, Plus, Minus, ShieldAlert, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product, CartItem } from '../types';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, sizes: { L: number; XL: number; XXL: number; XXXL: number }) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onViewDetails: (product: Product) => void;
}

export default function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onViewDetails
}: QuickViewModalProps) {
  if (!product) return null;

  const [quantities, setQuantities] = useState({
    L: 0,
    XL: 0,
    XXL: 0,
    XXXL: 0
  });

  const [activeTab, setActiveTab] = useState<'details' | 'specifications'>('details');

  // Reset quantities when product changes
  useEffect(() => {
    setQuantities({ L: 0, XL: 0, XXL: 0, XXXL: 0 });
  }, [product]);

  const handleIncrement = (size: 'L' | 'XL' | 'XXL' | 'XXXL') => {
    setQuantities(prev => ({
      ...prev,
      [size]: Math.min(prev[size] + 1, product.stock[size] || 999)
    }));
  };

  const handleDecrement = (size: 'L' | 'XL' | 'XXL' | 'XXXL') => {
    setQuantities(prev => ({
      ...prev,
      [size]: Math.max(prev[size] - 1, 0)
    }));
  };

  const handleInputChange = (size: 'L' | 'XL' | 'XXL' | 'XXXL', val: string) => {
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 0) {
      setQuantities(prev => ({
        ...prev,
        [size]: Math.min(num, product.stock[size] || 999)
      }));
    } else if (val === '') {
      setQuantities(prev => ({
        ...prev,
        [size]: 0
      }));
    }
  };

  const totalSelected = quantities.L + quantities.XL + quantities.XXL + quantities.XXXL;

  // Calculate prices
  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount
    ? Math.round(product.price * (1 - (product.discount || 0) / 100))
    : product.price;

  const totalPrice = totalSelected * discountedPrice;

  const handleAddClick = () => {
    if (totalSelected === 0) {
      alert("Please select at least 1 quantity in any size to order.");
      return;
    }
    onAddToCart(product, quantities);
    // Reset sizes
    setQuantities({ L: 0, XL: 0, XXL: 0, XXXL: 0 });
    onClose();
  };

  return (
    <div id="quick-view-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        id="quick-view-dialog"
        className="relative bg-[#FCFBF9] w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-beige-dark/50 flex flex-col md:flex-row max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-quick-view-btn"
          onClick={onClose}
          className="absolute right-4 top-4 p-2 bg-[#FCFBF9]/90 backdrop-blur-md text-gray-500 hover:text-burgundy rounded-full border border-beige-dark shadow-sm z-30 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Left Side: Images Section */}
        <div className="md:w-1/2 relative bg-beige/10 p-4 flex flex-col justify-center">
          <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-md">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Small Thumbnails Row */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar justify-center">
            {product.images.map((img, idx) => (
              <div 
                key={idx} 
                className="w-16 h-20 rounded border border-beige-dark/45 overflow-hidden flex-shrink-0 cursor-pointer"
              >
                <img 
                  src={img} 
                  alt={`${product.name} Thumbnail ${idx + 1}`} 
                  className="w-full h-full object-cover object-top" 
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Order & Quantities Section */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[70vh] md:max-h-[85vh]">
          <div>
            {/* Header / Brand details */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase font-bold text-burgundy tracking-widest bg-burgundy/10 px-2 py-0.5 rounded">
                {product.category}
              </span>
              <span className="text-[10px] text-gray-400 font-mono">SKU: {product.sku}</span>
            </div>

            <h2 className="font-serif text-2xl font-bold text-gray-900 tracking-tight leading-snug mb-2">
              {product.name}
            </h2>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-extrabold text-burgundy">
                ₹{discountedPrice.toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-xs text-gray-500 font-medium">/ piece wholesale price</span>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* SIZE ORDERING SYSTEM (PRD SECTION 10 REQUIREMENT) */}
            <div id="size-wholesale-ordering-grid" className="bg-[#FAF6F0] p-4 rounded-xl border border-beige-dark/40 mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs uppercase tracking-widest font-bold text-gray-800">
                  Select Quantities per Size
                </span>
                <span className="text-[10px] text-burgundy font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse"></span>
                  Factory Stock Available
                </span>
              </div>

              {/* Grid representation */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {(['L', 'XL', 'XXL', 'XXXL'] as const).map((sz) => {
                  const stockLeft = product.stock[sz] || 0;
                  const count = quantities[sz];
                  return (
                    <div 
                      key={sz} 
                      className={`p-2.5 rounded-lg border text-center flex flex-col justify-between ${
                        count > 0 
                          ? 'bg-white border-burgundy shadow-sm' 
                          : 'bg-white/80 border-gray-200'
                      }`}
                    >
                      <div>
                        <span className="block text-sm font-bold text-gray-900 uppercase">{sz}</span>
                        <span className="text-[9px] text-gray-400 font-medium block">Stock: {stockLeft}</span>
                      </div>
                      
                      {/* Quantity Controls beneath size label */}
                      <div className="flex items-center justify-between border border-gray-200 rounded mt-2.5 bg-gray-50">
                        <button
                          onClick={() => handleDecrement(sz)}
                          className="p-1 text-gray-500 hover:text-burgundy transition-colors"
                          title={`Decrease size ${sz}`}
                        >
                          <Minus size={11} />
                        </button>
                        
                        <input
                          type="text"
                          value={count === 0 ? '' : count}
                          placeholder="0"
                          onChange={(e) => handleInputChange(sz, e.target.value)}
                          className="w-8 text-[11px] font-bold text-center text-gray-800 focus:outline-none bg-transparent"
                        />
                        
                        <button
                          onClick={() => handleIncrement(sz)}
                          className="p-1 text-gray-500 hover:text-burgundy transition-colors"
                          title={`Increase size ${sz}`}
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Wholesale Minimum advice */}
              <div className="flex items-center gap-2 text-[10px] text-gray-500 bg-white/60 p-2 rounded border border-beige-dark/20">
                <ShieldAlert size={12} className="text-amber-600 flex-shrink-0" />
                <span>Wholesale buyer discount automatic at checkout. Mixed sizing supported.</span>
              </div>
            </div>
          </div>

          {/* Pricing & Checkout summary in Quick view */}
          <div className="border-t border-beige-dark/30 pt-4 mt-2">
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-medium">Selected Quantity:</span>
                <span className="text-sm font-bold text-gray-900">{totalSelected} pieces total</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 font-medium block">Estimated Subtotal:</span>
                <span className="text-lg font-extrabold text-burgundy">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                id="add-to-cart-quickview"
                onClick={handleAddClick}
                className="flex-1 py-3 bg-burgundy hover:bg-burgundy/90 text-[#FCFBF9] text-xs uppercase tracking-widest font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag size={14} />
                <span>Add Selected to Cart</span>
              </button>

              <button
                id="wishlist-quickview"
                onClick={() => onToggleWishlist(product)}
                className={`px-4 bg-[#FCFBF9] hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg transition-colors flex items-center justify-center ${
                  isWishlisted ? 'text-burgundy border-burgundy' : ''
                }`}
                title="Save to Wishlist"
              >
                <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
              </button>

              <button
                id="view-details-quickview"
                onClick={() => {
                  onViewDetails(product);
                  onClose();
                }}
                className="p-3 border border-beige-dark text-gray-700 hover:text-burgundy hover:border-burgundy rounded-lg transition-colors flex items-center justify-center"
                title="View Full Product Details"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
