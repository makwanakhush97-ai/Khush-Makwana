import React, { useState, useEffect } from 'react';
import { Sparkles, ShoppingBag, Eye, Heart, HelpCircle, Shirt, RefreshCw, Star, Info } from 'lucide-react';
import { Product } from '../types';
import { COLORS, FABRICS, CATEGORIES } from '../data';

interface AIStylistProps {
  products: Product[];
  onViewProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlist: Product[];
  browsingHistory: string[]; // List of viewed product IDs
}

export default function AIStylist({
  products,
  onViewProduct,
  onQuickView,
  onToggleWishlist,
  wishlist,
  browsingHistory
}: AIStylistProps) {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [customPrompt, setCustomPrompt] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [stylistNotes, setStylistNotes] = useState<string | null>(null);
  const [seasonalTrends, setSeasonalTrends] = useState<string | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

  // Complete look state
  const [lookProductId, setLookProductId] = useState<string>('');
  const [lookLoading, setLookLoading] = useState(false);
  const [lookCuration, setLookCuration] = useState<any>(null);

  const toggleSelection = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) {
      setList(list.filter(x => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const getRecommendations = async () => {
    setLoading(true);
    setStylistNotes(null);
    setRecommendedProducts([]);
    
    // Compile history
    const historyProductNames = browsingHistory
      .map(id => products.find(p => p.id === id)?.name)
      .filter(Boolean);

    try {
      const response = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          browsingHistory: historyProductNames,
          preferredColors: selectedColors,
          preferredFabrics: selectedFabrics,
          preferredCategories: selectedCategories,
          customPrompt: customPrompt
        })
      });

      const resJson = await response.json();
      
      if (resJson.success && resJson.data) {
        const { recommendedProductIds, stylistNotes: notes, seasonalTrendNotes } = resJson.data;
        setStylistNotes(notes);
        setSeasonalTrends(seasonalTrendNotes);
        
        // Find products
        const matched = products.filter(p => recommendedProductIds.includes(p.id));
        setRecommendedProducts(matched.length > 0 ? matched : products.slice(0, 3));
      } else if (resJson.fallback) {
        // Fallback handled gracefully
        const { recommendedProductIds, stylistNotes: notes, seasonalTrendNotes } = resJson.fallback;
        setStylistNotes(notes);
        setSeasonalTrends(seasonalTrendNotes);
        const matched = products.filter(p => recommendedProductIds.includes(p.id));
        setRecommendedProducts(matched.length > 0 ? matched : products.slice(0, 3));
      }
    } catch (err) {
      console.error(err);
      // Fallback
      setStylistNotes("Welcome to Shayona Creation! Based on the latest high-end trends, we recommend Burgundy Velvet and Silk Organza sets. They represent luxury hand-crafted embroidery and seasonal ethnic elegance.");
      setSeasonalTrends("Velvets and organza combinations dominate contemporary ethnic boutique requests.");
      setRecommendedProducts(products.slice(0, 3));
    } finally {
      setLoading(false);
    }
  };

  const getCompleteLook = async (product: Product) => {
    setLookProductId(product.id);
    setLookLoading(true);
    setLookCuration(null);

    try {
      const response = await fetch('/api/ai/complete-look', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          category: product.category,
          fabric: product.fabric,
          color: product.color
        })
      });
      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        setLookCuration(resJson.data);
      } else if (resJson.fallback) {
        setLookCuration(resJson.fallback);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLookLoading(false);
    }
  };

  return (
    <div id="ai-stylist-container" className="bg-white border border-beige-dark/50 rounded-2xl p-6 sm:p-8 shadow-xl max-w-5xl mx-auto my-8">
      {/* Visual Header */}
      <div className="flex items-center gap-3 border-b border-beige-dark/30 pb-5 mb-6">
        <div className="p-3 bg-burgundy/10 rounded-full text-burgundy">
          <Sparkles size={28} className="animate-pulse" />
        </div>
        <div>
          <h2 className="font-serif text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            Shayona AI Personal Stylist
            <span className="text-[10px] uppercase font-bold tracking-widest bg-gold/20 text-burgundy border border-gold/30 px-2 py-0.5 rounded">
              Beta Live
            </span>
          </h2>
          <p className="text-xs text-gray-500">
            Intelligent ethnic recommendations and accessories matcher. Directly synced with factory production lines.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Setup preferences */}
        <div className="lg:col-span-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-beige-dark/30 pb-6 lg:pb-0 lg:pr-6">
          <div className="space-y-5">
            {/* Preferred colors */}
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-gray-800 block mb-2.5">
                1. Match Your Colors
              </span>
              <div className="flex flex-wrap gap-1.5">
                {COLORS.map((col) => {
                  const isSelected = selectedColors.includes(col.name);
                  return (
                    <button
                      key={col.name}
                      onClick={() => toggleSelection(col.name, selectedColors, setSelectedColors)}
                      className={`text-[10px] font-semibold py-1.5 px-3 rounded-full border transition-all flex items-center gap-1.5 ${
                        isSelected 
                          ? 'bg-burgundy text-[#FCFBF9] border-burgundy' 
                          : 'bg-[#FCFBF9] text-gray-700 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full border border-gray-300" style={{ backgroundColor: col.hex }} />
                      {col.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preferred fabrics */}
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-gray-800 block mb-2.5">
                2. Select Fabrics
              </span>
              <div className="flex flex-wrap gap-1.5">
                {FABRICS.map((fab) => {
                  const isSelected = selectedFabrics.includes(fab);
                  return (
                    <button
                      key={fab}
                      onClick={() => toggleSelection(fab, selectedFabrics, setSelectedFabrics)}
                      className={`text-[10px] font-semibold py-1.5 px-3 rounded-full border transition-all ${
                        isSelected 
                          ? 'bg-burgundy text-[#FCFBF9] border-burgundy' 
                          : 'bg-[#FCFBF9] text-gray-700 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {fab}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preferred categories */}
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-gray-800 block mb-2.5">
                3. Choose Categories
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleSelection(cat, selectedCategories, setSelectedCategories)}
                      className={`text-[10px] font-semibold py-1.5 px-3 rounded-full border transition-all ${
                        isSelected 
                          ? 'bg-burgundy text-[#FCFBF9] border-burgundy' 
                          : 'bg-[#FCFBF9] text-gray-700 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom input prompt */}
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-gray-800 block mb-2">
                4. Describe Your Event (Optional)
              </span>
              <textarea
                placeholder="E.g. I am sourcing for high-end boutique clients looking for breathable velvet suites or rich Lucknowi organzas for family functions."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full text-xs p-3 border border-gray-200 rounded-lg h-24 focus:outline-none focus:border-burgundy bg-[#FCFBF9] resize-none"
              />
            </div>
          </div>

          <button
            id="run-ai-curator-btn"
            onClick={getRecommendations}
            disabled={loading}
            className="w-full mt-6 py-3 bg-burgundy hover:bg-burgundy/90 text-[#FCFBF9] font-bold text-xs uppercase tracking-widest rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Designing Recommendations...</span>
              </>
            ) : (
              <>
                <Sparkles size={14} className="text-gold" />
                <span>Ask Shayona Stylist</span>
              </>
            )}
          </button>
        </div>

        {/* Right column: Stylist outputs */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          {!stylistNotes && !loading && (
            <div className="h-full flex flex-col justify-center items-center text-center p-8 bg-beige/10 rounded-xl border border-dashed border-beige-dark/50">
              <Shirt size={48} className="text-beige-dark mb-3" />
              <h3 className="font-serif text-base font-bold text-gray-700 mb-1">Your Curated Ethnic Showroom</h3>
              <p className="text-xs text-gray-500 max-w-sm">
                Set your favorite fabric, colors, and category preferences on the left, then click the button. Gemini will generate a custom style curation matching Shayona's factory floor collections.
              </p>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col justify-center items-center text-center p-8">
              <div className="w-12 h-12 border-4 border-burgundy border-t-transparent rounded-full animate-spin mb-4" />
              <span className="font-serif text-sm font-bold text-gray-700">Connecting to Shayona Creative Engine...</span>
              <span className="text-[11px] text-gray-400 mt-1">Analyzing textures, seasonal color metrics, and matching catalog items.</span>
            </div>
          )}

          {stylistNotes && !loading && (
            <div className="space-y-6">
              {/* Personal Stylist Notes */}
              <div className="bg-[#FAF6F0] border border-gold/20 p-5 rounded-xl shadow-sm">
                <div className="flex items-center gap-2 text-burgundy font-bold text-xs uppercase tracking-widest mb-3">
                  <Sparkles size={14} className="text-gold" />
                  <span>Couturier Stylist Curation</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed italic">
                  "{stylistNotes}"
                </p>
                {seasonalTrends && (
                  <div className="mt-4 pt-3 border-t border-beige-dark/30 flex gap-2 items-start text-[10px] text-gray-500">
                    <Info size={14} className="text-gold flex-shrink-0 mt-0.5" />
                    <span><strong>Season Trend Alert:</strong> {seasonalTrends}</span>
                  </div>
                )}
              </div>

              {/* Recommended Catalog Items */}
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-gray-800 block mb-3">
                  Recommended Catalog Items for You:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {recommendedProducts.map((prod) => {
                    const isFav = wishlist.some(x => x.id === prod.id);
                    return (
                      <div 
                        key={prod.id}
                        className="bg-white border border-beige-dark/30 rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                      >
                        <div className="relative aspect-[3/4] cursor-pointer" onClick={() => onViewProduct(prod)}>
                          <img 
                            src={prod.images[0]} 
                            alt={prod.name} 
                            className="w-full h-full object-cover object-top"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-2 left-2">
                            <span className="bg-burgundy text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
                              {prod.category.split(' ')[0]}
                            </span>
                          </div>
                        </div>

                        <div className="p-2.5">
                          <h4 className="font-serif text-[11px] font-bold text-gray-900 truncate" title={prod.name}>
                            {prod.name}
                          </h4>
                          <span className="text-[10px] text-gray-400 block">{prod.fabric}</span>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-beige-dark/25">
                            <span className="text-xs font-bold text-burgundy">₹{prod.price}</span>
                            <div className="flex gap-1">
                              <button 
                                onClick={() => onQuickView(prod)} 
                                className="p-1 text-gray-500 hover:text-burgundy bg-gray-50 hover:bg-burgundy/10 rounded"
                                title="Quick Order Sizes"
                              >
                                <ShoppingBag size={11} />
                              </button>
                              <button 
                                onClick={() => getCompleteLook(prod)} 
                                className="p-1 text-gold hover:text-burgundy bg-gold/10 rounded font-semibold text-[9px] px-1.5"
                                title="Complete Look with Jewelry & Accs"
                              >
                                Match
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Complete the Look Section */}
              {lookProductId && (
                <div className="border-t border-beige-dark/30 pt-5">
                  <span className="text-xs uppercase tracking-widest font-bold text-gray-800 block mb-3 flex items-center gap-1">
                    <Star size={12} className="text-gold fill-gold" />
                    Complete the Look Style Match Curation:
                  </span>
                  
                  {lookLoading && (
                    <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <RefreshCw size={14} className="animate-spin text-burgundy" />
                      <span className="text-[11px] text-gray-500">Styling dupatta, jewelry matching, and styling footwear metrics...</span>
                    </div>
                  )}

                  {lookCuration && !lookLoading && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-beige-dark/30 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="text-[11px] text-gray-700 leading-relaxed space-y-2">
                        <p><strong>👗 Dupatta Drape style:</strong> {lookCuration.dupattaStyling}</p>
                        <p><strong>👖 Bottom Wear Coordinate:</strong> {lookCuration.leggingsCoordinate}</p>
                        <p><strong>👜 Potli/Accessories Match:</strong> {lookCuration.accessories}</p>
                      </div>
                      <div className="text-[11px] text-gray-700 leading-relaxed space-y-2 border-t sm:border-t-0 sm:border-l border-beige-dark/30 sm:pl-4">
                        <p><strong>👠 Footwear Recommendation:</strong> {lookCuration.footwear}</p>
                        <p><strong>💎 Jewelry Styling:</strong> {lookCuration.jewelry}</p>
                        <p><strong>💄 Hair & Makeup Vibe:</strong> {lookCuration.hairMakeup}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
