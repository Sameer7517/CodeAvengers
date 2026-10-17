import React, { useState } from 'react';
import { 
  X, 
  Leaf, 
  MapPin, 
  ShieldCheck, 
  Bookmark, 
  Share2, 
  Clock, 
  Calendar, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  TrendingDown,
  Gift,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ItemDetailModal() {
  const { selectedItemForModal, setSelectedItemForModal, savedItemIds, toggleSave, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'pickup'
  const [selectedMeetingTime, setSelectedMeetingTime] = useState('Today after 3:00 PM');
  const [meetingNote, setMeetingNote] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  if (!selectedItemForModal) return null;
  const item = selectedItemForModal;
  const isSaved = savedItemIds.includes(item.id);

  const handleSendRequest = (e) => {
    e.preventDefault();
    setRequestSent(true);
    showToast(`Pickup request sent to ${item.seller?.name}! Check your dashboard for updates.`, 'success');
    setTimeout(() => {
      setRequestSent(false);
      setSelectedItemForModal(null);
    }, 2200);
  };

  const copyShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + `/marketplace?item=${item.id}`);
      showToast('Item link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-sage-200 overflow-hidden relative my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedItemForModal(null)}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-slate-950 shadow-md backdrop-blur-sm transition-colors"
          title="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image & Carbon Footprint Highlights */}
          <div className="relative bg-slate-900 flex flex-col justify-between min-h-[300px] md:min-h-[480px]">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-transparent" />

            {/* Top Badges */}
            <div className="relative z-10 p-5 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-900/80 text-sage-200 border border-forest-600 backdrop-blur-md">
                {item.category.replace('-', ' ')}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-slate-800 backdrop-blur-md">
                Condition: {item.condition}
              </span>
            </div>

            {/* Bottom Carbon Savings Widget */}
            <div className="relative z-10 p-5">
              <div className="bg-forest-950/85 backdrop-blur-md border border-forest-700/80 rounded-2xl p-4 text-white space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sage-300 font-semibold text-xs tracking-wide uppercase">
                    <Leaf className="w-4 h-4 text-emerald-400" />
                    <span>Environmental Impact Saved</span>
                  </div>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-bold">
                    100% Circular
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-forest-800">
                  <div>
                    <span className="text-2xl font-black text-emerald-400">-{item.co2SavedKg} kg</span>
                    <p className="text-[11px] text-slate-300">CO₂ emissions averted</p>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-sage-300">
                      {Math.max(1, Math.round(item.co2SavedKg * 1.8))} gal
                    </span>
                    <p className="text-[11px] text-slate-300">Embodied water saved</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Listing Details & Actions */}
          <div className="p-6 sm:p-7 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div className="space-y-4">
              {/* Header Price & Type */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  {item.listingType === 'free' ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-sm">
                      <Gift className="w-4 h-4" />
                      Free Campus Giveaway
                    </div>
                  ) : item.listingType === 'trade' ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-100 text-indigo-800 font-bold text-sm">
                      <RefreshCw className="w-4 h-4" />
                      Open for Peer Exchange / Trade
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-forest-950">${item.price}</span>
                      {item.originalPrice > item.price && (
                        <>
                          <span className="text-sm text-slate-400 line-through">${item.originalPrice}</span>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            Save ${item.originalPrice - item.price} ({(100 - (item.price / item.originalPrice * 100)).toFixed(0)}% off)
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick actions: bookmark & share */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleSave(item.id)}
                    className={`p-2 rounded-xl border transition-colors ${
                      isSaved
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                    title={isSaved ? "Saved" : "Save to wishlist"}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-rose-600' : ''}`} />
                  </button>
                  <button
                    onClick={copyShareLink}
                    className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                    title="Share listing link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-slate-900 leading-snug">
                {item.title}
              </h2>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs px-2.5 py-0.5 bg-offwhite-200 text-slate-700 rounded-lg font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Campus Meeting Zone Info */}
              <div className="bg-sage-50/70 border border-sage-200/80 rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-forest-900 uppercase tracking-wide">
                  <MapPin className="w-3.5 h-3.5 text-forest-600" />
                  <span>Campus Designated Safe Zone</span>
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  {item.location?.campusSpot || 'Main Library 2nd Floor'}
                </p>
                <p className="text-xs text-slate-500">
                  Building: {item.location?.building || 'W.E.B. Du Bois Library'} · Well-lit public area
                </p>
              </div>

              {/* Seller Profile Card */}
              <div className="border border-slate-100 bg-white p-3.5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.seller?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={item.seller?.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-forest-600"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 text-sm">{item.seller?.name}</span>
                      {item.seller?.verifiedStudent && (
                        <span className="inline-flex items-center text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                          .edu Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{item.seller?.department} · {item.seller?.year}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-forest-700 block">
                    {item.seller?.karmaScore || 350} Karma
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {item.seller?.itemsReused || 5} items reused
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Pickup Proposal / Interaction */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              {requestSent ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-center space-y-1">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" />
                  <p className="font-bold text-sm">Meeting Request Sent!</p>
                  <p className="text-xs text-emerald-700">The seller has been notified via their campus portal.</p>
                </div>
              ) : (
                <form onSubmit={handleSendRequest} className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-forest-600" />
                      Propose Meetup Window:
                    </span>
                    <select
                      value={selectedMeetingTime}
                      onChange={(e) => setSelectedMeetingTime(e.target.value)}
                      className="bg-offwhite-100 border border-slate-200 text-xs rounded-lg px-2 py-1 focus:ring-1 focus:ring-forest-600 outline-hidden font-medium"
                    >
                      <option>Today after 3:00 PM</option>
                      <option>Tomorrow between 11 AM - 1 PM</option>
                      <option>Tomorrow after 4:00 PM</option>
                      <option>Flexible this week</option>
                    </select>
                  </div>

                  <input
                    type="text"
                    placeholder="Add quick message (e.g., 'Can meet outside library cafe!')"
                    value={meetingNote}
                    onChange={(e) => setMeetingNote(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-forest-600"
                  />

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-forest-800 hover:bg-forest-900 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 text-sage-300" />
                    <span>Request Campus Pickup</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
