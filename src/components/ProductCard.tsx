import React from 'react';
import { Heart, Eye, Award, CheckCircle, Tag } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onViewProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  key?: any;
}

export default function ProductCard({
  product,
  onViewProduct,
  onQuickView,
  onToggleWishlist,
  isWishlisted
}: ProductCardProps) {
  // Calculate discount price
  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount
    ? Math.round(product.price * (1 - (product.discount || 0) / 100))
    : product.price;

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group bg-white rounded-lg overflow-hidden border border-beige-dark/20 hover:shadow-xl transition-luxury flex flex-col justify-between"
    >
      {/* Visual Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-beige/30 cursor-pointer" onClick={() => onViewProduct(product)}>
        {/* Main Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-all duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Hover/Secondary Image */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} Alternate`}
            className="absolute inset-0 w-full h-full object-cover object-top opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        )}

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isNew && (
            <span className="bg-burgundy text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm">
              New Drop
            </span>
          )}
          {product.isTrending && (
            <span className="bg-gold text-burgundy text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm">
              Trending
            </span>
          )}
          {hasDiscount && (
            <span className="bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm flex items-center gap-0.5">
              <Tag size={8} /> Save {product.discount}%
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-black text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm">
              Best Seller
            </span>
          )}
        </div>

        {/* Wholesale Manufacturer Badge */}
        <div className="absolute top-3 right-3 z-10 pointer-events-none">
          <span className="bg-[#FAF6F0]/90 backdrop-blur-sm border border-gold/40 text-burgundy text-[8px] font-semibold px-2 py-1 rounded flex items-center gap-1 shadow-sm">
            <Award size={10} className="text-gold" /> MFR DIRECT
          </span>
        </div>

        {/* Action Buttons Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent translate-y-12 group-hover:translate-y-0 transition-transform duration-500 ease-out flex items-center justify-between gap-2 z-20">
          <button
            id={`quick-view-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 py-2 px-3 bg-white text-burgundy text-xs font-semibold rounded hover:bg-burgundy hover:text-white transition-colors flex items-center justify-center gap-1.5 shadow-md"
          >
            <Eye size={14} />
            <span>Quick View</span>
          </button>
          
          <button
            id={`toggle-wishlist-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className={`p-2 rounded shadow-md transition-colors ${
              isWishlisted 
                ? 'bg-burgundy text-white hover:bg-white hover:text-burgundy' 
                : 'bg-white text-gray-700 hover:bg-burgundy hover:text-white'
            }`}
            title="Add to Wishlist"
          >
            <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Info Container */}
      <div className="p-4 flex flex-col flex-grow justify-between cursor-pointer" onClick={() => onViewProduct(product)}>
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
              {product.category}
            </span>
            <span className="text-[10px] text-gray-400 font-mono">
              SKU: {product.sku}
            </span>
          </div>

          <h3 className="font-serif text-sm font-bold text-gray-900 group-hover:text-burgundy transition-colors line-clamp-1 mb-1">
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-xs">
                  {i < Math.floor(product.rating) ? '★' : '☆'}
                </span>
              ))}
            </div>
            <span className="text-[11px] text-gray-500 font-medium">({product.rating})</span>
          </div>

          <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mb-3">
            {product.fabric} • Handcrafted detailing
          </p>
        </div>

        <div>
          {/* Price & Size Grid Footer */}
          <div className="flex items-end justify-between border-t border-beige-dark/20 pt-3">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold leading-none">Wholesale Price</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-base font-bold text-burgundy">
                  ₹{discountedPrice.toLocaleString('en-IN')}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-gray-400 line-through">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[8px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Sizes</span>
              <div className="flex gap-1">
                {Object.keys(product.stock).map((sz) => (
                  <span 
                    key={sz} 
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded border border-gray-200 bg-gray-50 text-gray-600 uppercase"
                  >
                    {sz}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
