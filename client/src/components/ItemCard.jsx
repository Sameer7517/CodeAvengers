import React from 'react';
import { Bookmark, MapPin, ShieldCheck, ArrowRight, Sparkles, RefreshCw, Gift, CheckCircle, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ItemCard({ item, onClick }) {
  const { savedItemIds, toggleSave, setSelectedItemForModal } = useApp();
  const isSaved = savedItemIds.includes(item.id);

  const handleCardClick = () => {
    if (onClick) {
      onClick(item);
    } else {
      setSelectedItemForModal(item);
    }
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    toggleSave(item.id);
  };

  const conditionColors = {
    'Like New': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Good': 'bg-sage-50 text-sage-800 border-sage-200',
    'Fair': 'bg-amber-50 text-amber-800 border-amber-200',
  };

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
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-600 text-white shadow-xs">
          <CheckCircle className="w-3 h-3" />
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        Available
      </span>
    );
  };

  const listingTypeBadge = () => {
    const type = item.listingType || 'sell';
    if (type === 'free' || type === 'giveaway') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-700 text-white shadow-xs">
          <Gift className="w-3 h-3" />
          Give Away
        </span>
      );
    }
    if (type === 'trade' || type === 'swap') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-600 text-white shadow-xs">
          <RefreshCw className="w-3 h-3" />
          Swap
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-forest-900 text-sage-200 shadow-xs">
        ${item.sellingPrice ?? item.price}
      </span>
    );
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`group bg-white rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col overflow-hidden relative ${
        item.status === 'completed'
          ? 'border-slate-200 opacity-80'
          : item.status === 'reserved'
          ? 'border-amber-300 shadow-xs'
          : 'border-sage-100 hover:border-forest-300 shadow-xs hover:shadow-eco-lg'
      }`}
    >
      {/* Top Media Container */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
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
          <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${conditionColors[item.condition] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
            {item.condition}
          </span>
        </div>

        {/* Bookmark/Wishlist Button */}
        <button
          onClick={handleSaveClick}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all ${
            isSaved
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/80 text-slate-600 hover:bg-white hover:text-slate-900 shadow-xs'
          }`}
          title={isSaved ? "Remove from wishlist" : "Save item"}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
        </button>

        {/* Carbon Offset Floating Pill */}
        <div className="absolute bottom-3 left-3 bg-forest-950/85 backdrop-blur-md text-sage-200 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-forest-700/60 shadow-sm">
          <span className="text-emerald-400">🌱</span>
          <span>-{item.co2SavedKg} kg CO₂</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Campus Spot */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-semibold text-forest-700 uppercase tracking-wider text-[10px]">
              {item.category?.replace('-', ' ')}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-500 truncate max-w-[140px]">
              <MapPin className="w-3 h-3 text-sage-600 shrink-0" />
              <span className="truncate">{item.location?.building || item.campus || 'Campus'}</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 group-hover:text-forest-800 transition-colors line-clamp-2 text-base leading-snug">
            {item.title}
          </h3>

          {/* Pricing or Swap Desired details */}
          <div className="mt-2.5">
            {item.listingType === 'free' || item.listingType === 'giveaway' ? (
              <span className="text-base font-extrabold text-emerald-700">100% Free Give Away</span>
            ) : item.listingType === 'trade' || item.listingType === 'swap' ? (
              <div className="space-y-1">
                <span className="text-sm font-bold text-indigo-700 flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Swap / Exchange
                </span>
                {item.desiredItems && (
                  <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                    Seeking: {item.desiredItems}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-900">${item.sellingPrice ?? item.price}</span>
                {(item.originalPrice || 0) > (item.sellingPrice ?? item.price) && (
                  <>
                    <span className="text-xs text-slate-400 line-through">${item.originalPrice}</span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Save ${item.originalPrice - (item.sellingPrice ?? item.price)}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Card Footer: Seller & CTA */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={item.seller?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={item.seller?.name || 'Seller'}
              className="w-6 h-6 rounded-full object-cover border border-sage-300"
            />
            <div className="text-[11px] leading-tight">
              <span className="font-medium text-slate-700 flex items-center gap-1">
                {item.seller?.name || 'Student'}
                {(item.seller?.isCollegeVerified || item.seller?.verifiedStudent) && (
                  <ShieldCheck className="w-3 h-3 text-forest-600" title="Verified Campus Student" />
                )}
              </span>
              <span className="text-[10px] text-slate-400 block">{item.seller?.year || 'Student'}</span>
            </div>
          </div>

          <span className="text-xs font-semibold text-forest-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
            Details
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
