import React from 'react';
import { Bookmark, MapPin, ShieldCheck, ArrowRight, RefreshCw, Gift, CheckCircle, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateInitialsAvatar } from '../utils/avatar';

export default function ItemCard({ item, onClick }) {
  const { savedItemIds, toggleSave, setSelectedItemForModal } = useApp();
  const itemId = item.id || item._id;
  const isSaved = savedItemIds.includes(item.id) || savedItemIds.includes(item._id);
  const seller = item.seller || (typeof item.owner === 'object' ? item.owner : null) || {};
  const sellerName = seller.name || 'Student';
  const sellerAvatar = seller.avatar || generateInitialsAvatar(sellerName);

  const handleCardClick = () => {
    if (onClick) {
      onClick(item);
    } else {
      setSelectedItemForModal(item);
    }
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    toggleSave(itemId);
  };

  const conditionColors = {
    'Like New': 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20',
    'Good': 'bg-teal-500/10 text-teal-800 dark:text-teal-300 border-teal-500/20',
    'Fair': 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20',
  };

  // Availability badge requirements:
  // Available: green, Reserved: amber, Completed: neutral gray
  const statusBadge = () => {
    const status = item.status || 'available';
    if (status === 'reserved') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-xs">
          <Clock className="w-3 h-3" />
          Reserved
        </span>
      );
    }
    if (status === 'completed') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-500 text-white shadow-xs">
          <CheckCircle className="w-3 h-3" />
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#176B4D] dark:bg-[#72D6A2] text-white dark:text-[#0B110E] shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-[#0B110E] animate-pulse" />
        Available
      </span>
    );
  };

  const listingTypeBadge = () => {
    const type = item.listingType || 'sell';
    if (type === 'free' || type === 'giveaway') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-xs">
          <Gift className="w-3 h-3" />
          Give Away
        </span>
      );
    }
    if (type === 'trade' || type === 'swap') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-600 text-white shadow-xs">
          <RefreshCw className="w-3 h-3" />
          Swap
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#17251D] dark:bg-white text-white dark:text-[#17251D] shadow-xs">
        ₹{item.sellingPrice ?? item.price}
      </span>
    );
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`group glass-card cursor-pointer flex flex-col overflow-hidden relative border transition-all duration-300 ${
        item.status === 'completed'
          ? 'opacity-70'
          : item.status === 'reserved'
          ? 'border-amber-400/50'
          : 'hover:border-[#176B4D]/40 dark:hover:border-[#72D6A2]/40'
      }`}
    >
      {/* Top Media Container - Strictly Uniform Image Dimensions */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-900 overflow-hidden shrink-0">
        <img
          src={item.imageUrl || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          {statusBadge()}
          {listingTypeBadge()}
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border backdrop-blur-md ${conditionColors[item.condition] || 'bg-slate-500/10 text-slate-700 border-slate-300'}`}>
            {item.condition}
          </span>
        </div>

        {/* Bookmark/Wishlist Button */}
        <button
          onClick={handleSaveClick}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all ${
            isSaved
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/80 dark:bg-black/60 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-black hover:text-slate-900 shadow-xs'
          }`}
          title={isSaved ? "Remove from wishlist" : "Save item"}
          aria-label={isSaved ? "Remove from saved items" : "Save to wishlist"}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
        </button>

        {/* Carbon Offset Floating Pill */}
        {item.co2SavedKg > 0 && (
          <div className="absolute bottom-3 left-3 bg-[#0B110E]/80 backdrop-blur-md text-emerald-200 px-2.5 py-0.5 rounded-lg text-[11px] font-bold flex items-center gap-1 border border-emerald-500/20 shadow-xs">
            <span>🌱</span>
            <span>-{item.co2SavedKg} kg CO₂</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Campus Spot */}
          <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] mb-1.5">
            <span className="font-bold text-[#176B4D] dark:text-[#72D6A2] uppercase tracking-wider text-[10px]">
              {item.category?.replace('-', ' ')}
            </span>
            <span className="flex items-center gap-1 text-[11px] truncate max-w-[140px]">
              <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate">{item.location?.building || item.campus || 'Campus Library'}</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-[var(--color-text)] group-hover:text-[#176B4D] dark:group-hover:text-[#72D6A2] transition-colors line-clamp-2 text-base leading-snug">
            {item.title}
          </h3>

          {/* Pricing or Swap Desired details */}
          <div className="mt-2.5">
            {item.listingType === 'free' || item.listingType === 'giveaway' ? (
              <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">100% Free Give Away</span>
            ) : item.listingType === 'trade' || item.listingType === 'swap' ? (
              <div className="space-y-0.5">
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Swap / Exchange
                </span>
                {item.desiredItems && (
                  <p className="text-[11px] text-[var(--color-text-muted)] line-clamp-1 italic">
                    Seeking: {item.desiredItems}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-[var(--color-text)]">₹{item.sellingPrice ?? item.price}</span>
                {(item.originalPrice || 0) > (item.sellingPrice ?? item.price) && (
                  <>
                    <span className="text-xs text-[var(--color-text-muted)] line-through">₹{item.originalPrice}</span>
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      Save ₹{item.originalPrice - (item.sellingPrice ?? item.price)}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Card Footer: Seller & CTA */}
        <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={sellerAvatar}
              alt={sellerName}
              className="w-6 h-6 rounded-full object-cover border border-[#176B4D]/30"
            />
            <div className="text-[11px] leading-tight">
              <span className="font-semibold text-[var(--color-text)] flex items-center gap-1">
                {sellerName}
                {(seller.isCollegeVerified || seller.verifiedStudent) && (
                  <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" title="Verified Campus Student" />
                )}
              </span>
              <span className="text-[10px] text-[var(--color-text-muted)] block">{seller.year || 'Student'}</span>
            </div>
          </div>

          <span className="text-xs font-bold text-[#176B4D] dark:text-[#72D6A2] group-hover:translate-x-1 transition-transform flex items-center gap-1">
            Details
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
