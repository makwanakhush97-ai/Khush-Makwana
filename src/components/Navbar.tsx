import React, { useState } from 'react';
import { ShoppingBag, Heart, Menu, X, User, Search, Award, HelpCircle, ShieldCheck } from 'lucide-react';
import { CartItem, Product } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  cart: CartItem[];
  wishlist: Product[];
  setSearchQuery: (query: string) => void;
  searchQuery: string;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  cart,
  wishlist,
  setSearchQuery,
  searchQuery
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Calculate total items in cart
  const cartCount = cart.reduce((total, item) => {
    return total + item.sizes.L + item.sizes.XL + item.sizes.XXL + item.sizes.XXXL;
  }, 0);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop Catalog' },
    { id: 'collections', label: 'Collections' },
    { id: 'new-arrivals', label: 'New Drops' },
    { id: 'trending', label: 'Trending Now' },
    { id: 'about', label: 'Our Story' },
    { id: 'wholesale', label: 'Wholesale Inquiry' },
    { id: 'dealer', label: 'Become a Dealer' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header id="main-header" className="sticky top-0 z-50 w-full bg-[#FCFBF9]/95 backdrop-blur-md border-b border-beige-dark/50 transition-luxury">
      {/* Top Banner (Wholesale & Manufacturer Direct highlight) */}
      <div id="top-announcement-banner" className="bg-burgundy text-[#FCFBF9] text-xs font-medium tracking-widest py-2 px-4 flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-0">
        <div className="flex items-center gap-1.5">
          <Award size={13} className="text-gold" />
          <span>DIRECT FROM FACTORY (SURAT) — MANUFACTURER & WHOLESALER</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] sm:text-xs text-beige-dark/95">
          <span>MIN. WHOLESALE BATCH: 20 PCS</span>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:flex items-center gap-1">
            <ShieldCheck size={12} className="text-gold" /> GST REGISTERED WHOLESALE SUPPLIER
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Mobile Menu Toggle */}
        <button
          id="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-gray-700 hover:text-burgundy transition-colors"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Logo - Playfair Display serif font */}
        <div 
          onClick={() => handleNavClick('home')} 
          className="cursor-pointer text-center select-none"
        >
          <span className="block text-2xl sm:text-3xl font-serif font-extrabold tracking-widest text-burgundy">
            SHAYONA
          </span>
          <span className="block text-[10px] uppercase tracking-[0.25em] text-gray-500 font-semibold -mt-1">
            Creation — Premium Ethnic
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 text-xs uppercase tracking-widest font-semibold transition-luxury relative ${
                  isActive ? 'text-burgundy' : 'text-gray-600 hover:text-burgundy'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-burgundy rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Icons */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Search Toggle */}
          <div className="relative">
            <button
              id="search-toggle"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-700 hover:text-burgundy transition-colors"
              title="Search Catalog"
            >
              <Search size={20} />
            </button>
            {isSearchOpen && (
              <div className="absolute right-0 top-12 bg-white border border-beige-dark/60 p-2 shadow-xl rounded-md w-60 sm:w-80 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search kurtis, designer suits, silk..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (currentTab !== 'shop') {
                      setCurrentTab('shop');
                    }
                  }}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-burgundy"
                />
                <button 
                  onClick={() => setIsSearchOpen(false)} 
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* User Account/Admin Tab */}
          <button
            id="nav-account-btn"
            onClick={() => handleNavClick('account')}
            className={`p-2 transition-colors flex items-center gap-1 ${
              currentTab === 'account' || currentTab === 'admin' ? 'text-burgundy' : 'text-gray-700 hover:text-burgundy'
            }`}
            title="My Account / Partner Portal"
          >
            <User size={20} />
            <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-wider">
              Portal
            </span>
          </button>

          {/* Wishlist */}
          <button
            id="nav-wishlist-btn"
            onClick={() => handleNavClick('wishlist')}
            className={`p-2 transition-colors relative ${
              currentTab === 'wishlist' ? 'text-burgundy' : 'text-gray-700 hover:text-burgundy'
            }`}
            title="Wishlist"
          >
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-burgundy text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            id="nav-cart-btn"
            onClick={() => handleNavClick('cart')}
            className={`p-2 transition-colors relative ${
              currentTab === 'cart' ? 'text-burgundy' : 'text-gray-700 hover:text-burgundy'
            }`}
            title="Wholesale Order Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-burgundy text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border border-burgundy">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div id="mobile-navigation-drawer" className="lg:hidden absolute top-full left-0 right-0 bg-[#FCFBF9] border-b border-beige-dark shadow-2xl p-4 flex flex-col space-y-2 z-40 transition-luxury">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left py-3 px-4 rounded text-xs uppercase tracking-widest font-semibold ${
                currentTab === item.id
                  ? 'bg-burgundy text-[#FCFBF9]'
                  : 'text-gray-700 hover:bg-beige-dark/25 hover:text-burgundy'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 border-t border-beige-dark/50 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-gray-500 px-4">
              <span>Wholesale Partner Support:</span>
              <a href="tel:+919876543210" className="font-semibold text-burgundy">+91 9876543210</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
