import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  Leaf, 
  MapPin, 
  ShieldCheck, 
  Bookmark, 
  Share2, 
  Clock, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Gift, 
  RefreshCw, 
  AlertTriangle, 
  Loader2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ItemDetailModal() {
  const { 
    selectedItemForModal, 
    setSelectedItemForModal, 
    savedItemIds, 
    toggleSave, 
    showToast, 
    user, 
    listings,
    createExchangeRequest 
  } = useApp();

  const [selectedMeetingTime, setSelectedMeetingTime] = useState('Today after 3:00 PM');
  const [selectedSpot, setSelectedSpot] = useState('Main Library 2nd Floor Cafe');
  const [meetingNote, setMeetingNote] = useState('');
  const [selectedOfferedItemId, setSelectedOfferedItemId] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!selectedItemForModal) return null;
  const item = selectedItemForModal;
  const isSaved = savedItemIds.includes(item.id);
  const isAvailable = (item.status || 'available') === 'available';
  const isSwap = item.listingType === 'swap' || item.listingType === 'trade';
  const isGiveaway = item.listingType === 'giveaway' || item.listingType === 'free';

  // User's own available items for offering in swap
  const myAvailableItems = listings.filter((l) => {
    if (!user) return false;
    const userId = (user._id || user.id || '').toString();
    const ownerId = (l.owner?._id || l.owner || l.seller?.id || '').toString();
    const isOwner = (ownerId && ownerId === userId) || (l.seller?.name && user.name && l.seller.name.toLowerCase() === user.name.toLowerCase());
    return isOwner && (l.status || 'available') === 'available' && l.id !== item.id;
  });

  // Set default offered item if swap
  useEffect(() => {
    if (myAvailableItems.length > 0 && !selectedOfferedItemId) {
      setSelectedOfferedItemId(myAvailableItems[0].id);
    }
  }, [myAvailableItems, selectedOfferedItemId]);

  const isOwner = Boolean(
    user && (
      ((user._id || user.id) && (item.owner?._id || item.owner || item.seller?.id) &&
        String(user._id || user.id) === String(item.owner?._id || item.owner || item.seller?.id)) ||
      (user.name && item.seller?.name && user.name.toLowerCase() === item.seller.name.toLowerCase())
    )
  );

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (isOwner) {
      setErrorMessage('You cannot submit an exchange request for your own listing.');
      return;
    }

    if (!isAvailable) {
      setErrorMessage(`Cannot request meetup: item is currently marked as ${item.status}.`);
      return;
    }

    if (isSwap && !selectedOfferedItemId) {
      setErrorMessage('Please select one of your available items to offer in exchange.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await createExchangeRequest({
        listingId: item.id,
        offeredListingId: isSwap ? selectedOfferedItemId : undefined,
        proposedMeetingTime: selectedMeetingTime,
        proposedSpot: selectedSpot,
        message: meetingNote
      });
      setRequestSent(true);
    } catch (err) {
      setErrorMessage(err.message || 'Could not send exchange request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyShareLink = () => {
    if (navigator.clipboard) {
      const url = `${window.location.origin}/item/${item.id}`;
      navigator.clipboard.writeText(url);
      showToast('Item link copied to clipboard!', 'info');
    }
  };

  // Availability badge requirements:
  // Available: green, Reserved: amber, Completed: neutral gray
  const statusBadge = () => {
    const status = item.status || 'available';
    if (status === 'reserved') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          Reserved
        </span>
      );
    }
    if (status === 'completed') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-500 text-white shadow-xs flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5" />
          Completed
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#176B4D] dark:bg-[#72D6A2] text-white dark:text-[#0B110E] shadow-xs flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-white dark:bg-[#0B110E] animate-pulse" />
        Available for Pickup
      </span>
    );
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={() => setSelectedItemForModal(null)}
    >
      <div 
        className="glass-dropdown rounded-3xl max-w-3xl w-full shadow-2xl border border-[var(--color-border)] overflow-hidden relative my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedItemForModal(null)}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-[var(--color-text)] shadow-md backdrop-blur-sm transition-colors"
          title="Close details"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image & Carbon Footprint Highlights */}
          <div className="relative bg-slate-900 flex flex-col justify-between min-h-[300px] md:min-h-[480px]">
            <img
              src={item.imageUrl || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

            {/* Top Badges */}
            <div className="relative z-10 p-5 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 text-emerald-300 border border-white/20 backdrop-blur-md">
                {item.category?.replace('-', ' ')}
              </span>
              <div className="flex items-center gap-1.5">
                {statusBadge()}
              </div>
            </div>

            {/* Bottom Carbon Savings Widget */}
            <div className="relative z-10 p-5">
              <div className="bg-[#0B110E]/80 backdrop-blur-md border border-[rgba(210,245,220,0.12)] rounded-2xl p-4 text-white space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs tracking-wide uppercase">
                    <Leaf className="w-4 h-4 text-emerald-400" />
                    <span>Environmental Impact Saved</span>
                  </div>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-bold">
                    Condition: {item.condition}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-white/10">
                  <div>
                    <span className="text-2xl font-black text-emerald-400">-{item.co2SavedKg || 9.8} kg</span>
                    <p className="text-[11px] text-slate-300">CO₂ averted</p>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-emerald-200">
                      {Math.max(1, Math.round((item.co2SavedKg || 9.8) * 1.8))} gal
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
                  {item.listingType === 'free' || item.listingType === 'giveaway' ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                      <Gift className="w-4 h-4" />
                      100% Free Campus Give Away
                    </div>
                  ) : item.listingType === 'trade' || item.listingType === 'swap' ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-bold text-sm">
                      <RefreshCw className="w-4 h-4" />
                      Swap / Exchange
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-[var(--color-text)]">${item.sellingPrice ?? item.price}</span>
                      {(item.originalPrice || 0) > (item.sellingPrice ?? item.price) && (
                        <>
                          <span className="text-sm text-[var(--color-text-muted)] line-through">${item.originalPrice}</span>
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded">
                            Save ${item.originalPrice - (item.sellingPrice ?? item.price)}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 mr-8">
                  <button
                    onClick={() => toggleSave(item.id)}
                    className={`p-2 rounded-xl border transition-colors ${
                      isSaved
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-600'
                        : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                    title={isSaved ? "Saved" : "Save to wishlist"}
                    aria-label="Save item to wishlist"
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-rose-600' : ''}`} />
                  </button>
                  <button
                    onClick={copyShareLink}
                    className="p-2 rounded-xl border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-black/5 dark:hover:bg-white/5"
                    title="Share item"
                    aria-label="Share item"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl font-extrabold text-[var(--color-text)] leading-snug">
                {item.title}
              </h2>

              {/* Swap Desired items */}
              {(item.listingType === 'trade' || item.listingType === 'swap') && item.desiredItems && (
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                  <span className="text-[11px] font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider block">
                    🔄 Desired in Swap:
                  </span>
                  <p className="text-xs font-semibold text-indigo-800 dark:text-indigo-200 mt-0.5">
                    {item.desiredItems}
                  </p>
                </div>
              )}

              {/* Description */}
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line line-clamp-4">
                {item.description}
              </p>

              {/* Campus Safe Zone Info */}
              <div className="glass-panel border border-[var(--color-border)] rounded-xl p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#176B4D] dark:text-[#72D6A2] uppercase tracking-wide">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Campus Designated Safe Zone</span>
                </div>
                <p className="text-xs font-bold text-[var(--color-text)]">
                  {item.location?.campusSpot || 'Main Library 2nd Floor'}
                </p>
                <p className="text-[11px] text-[var(--color-text-muted)]">
                  Building: {item.location?.building || item.campus || 'Main Campus'} · Public student area
                </p>
              </div>

              {/* Seller Information */}
              <div className="glass-panel border border-[var(--color-border)] p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={item.seller?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={item.seller?.name || 'Seller'}
                    className="w-9 h-9 rounded-full object-cover border border-[#176B4D]/30"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-[var(--color-text)] text-xs">{item.seller?.name || 'Campus Student'}</span>
                      {(item.seller?.verifiedStudent || item.seller?.isCollegeVerified) && (
                        <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </div>
                    <p className="text-[10px] text-[var(--color-text-muted)]">{item.seller?.department || 'Student'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#176B4D] dark:text-[#72D6A2] block">
                    {item.seller?.karmaScore || 350} Karma
                  </span>
                </div>
              </div>
            </div>

            {/* Meetup Proposal Form or Status Notice */}
            <div className="pt-3 border-t border-[var(--color-border)] mt-4">
              {errorMessage && (
                <div className="mb-2 p-2 bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {isOwner ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center space-y-1">
                  <p className="text-xs font-bold text-[var(--color-text)]">This is your listing</p>
                  <p className="text-[11px] text-[var(--color-text-muted)]">
                    Manage incoming proposals or update availability in your dashboard.
                  </p>
                  <Link
                    to="/dashboard"
                    onClick={() => setSelectedItemForModal(null)}
                    className="inline-block px-3 py-1.5 bg-[#176B4D] dark:bg-[#72D6A2] text-white dark:text-[#0B110E] rounded-lg text-xs font-bold"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              ) : !user ? (
                <div className="p-3 glass-panel border border-[var(--color-border)] rounded-xl text-center space-y-2">
                  <p className="text-xs font-bold text-[var(--color-text)]">Sign in to propose exchange</p>
                  <Link
                    to="/login"
                    onClick={() => setSelectedItemForModal(null)}
                    className="inline-block px-4 py-2 bg-[#176B4D] dark:bg-[#72D6A2] text-white dark:text-[#0B110E] rounded-xl text-xs font-bold shadow-xs"
                  >
                    Sign In with Campus Account
                  </Link>
                </div>
              ) : !isAvailable ? (
                <div className="p-3 glass-panel border border-[var(--color-border)] rounded-xl text-center space-y-1">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mx-auto" />
                  <p className="text-xs font-bold text-[var(--color-text)]">Item is currently {item.status.toUpperCase()}</p>
                </div>
              ) : requestSent ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 p-3 rounded-xl text-center space-y-1">
                  <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <p className="font-bold text-xs">Proposal Sent to Owner!</p>
                  <Link
                    to="/dashboard"
                    onClick={() => setSelectedItemForModal(null)}
                    className="inline-block text-xs font-bold underline"
                  >
                    Track in Dashboard
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSendRequest} className="space-y-3">
                  {isSwap && (
                    <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-1">
                      <span className="text-[10px] font-bold uppercase text-[var(--color-text)] block">
                        Select an item to offer in swap:
                      </span>
                      {myAvailableItems.length > 0 ? (
                        <select
                          value={selectedOfferedItemId}
                          onChange={(e) => setSelectedOfferedItemId(e.target.value)}
                          aria-label="Offered item for swap"
                          className="w-full text-xs font-semibold p-1.5 glass-panel rounded-lg text-[var(--color-text)] border border-[var(--color-border)] focus:outline-hidden"
                        >
                          {myAvailableItems.map((offered) => (
                            <option key={offered.id} value={offered.id}>
                              {offered.title} ({offered.condition})
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-[10px] text-amber-700 dark:text-amber-300">
                          You don't have available items to offer. Please list one first.
                        </p>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <label className="font-semibold text-[var(--color-text)] block mb-0.5">Time:</label>
                      <select
                        value={selectedMeetingTime}
                        onChange={(e) => setSelectedMeetingTime(e.target.value)}
                        aria-label="Modal meeting time"
                        className="w-full glass-panel border border-[var(--color-border)] rounded-lg p-1.5 text-[var(--color-text)]"
                      >
                        <option>Today after 3:00 PM</option>
                        <option>Tomorrow 11 AM - 1 PM</option>
                        <option>Tomorrow after 4:00 PM</option>
                        <option>Flexible this week</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-[var(--color-text)] block mb-0.5">Location:</label>
                      <select
                        value={selectedSpot}
                        onChange={(e) => setSelectedSpot(e.target.value)}
                        aria-label="Modal meeting spot"
                        className="w-full glass-panel border border-[var(--color-border)] rounded-lg p-1.5 text-[var(--color-text)]"
                      >
                        <option>Main Library 2nd Floor Cafe</option>
                        <option>Engineering Hall Commons</option>
                        <option>Student Union Info Desk</option>
                      </select>
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Short message to owner..."
                    value={meetingNote}
                    onChange={(e) => setMeetingNote(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg glass-panel border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-hidden"
                  />

                  <div className="flex gap-2">
                    <Link
                      to={`/item/${item.id}`}
                      onClick={() => setSelectedItemForModal(null)}
                      className="px-3 py-2 rounded-xl text-xs font-bold border border-[var(--color-border)] text-[var(--color-text)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      Full Details
                    </Link>

                    <button
                      type="submit"
                      disabled={isSubmitting || (isSwap && myAvailableItems.length === 0)}
                      className="flex-1 py-2 px-3 rounded-xl font-bold text-xs text-white bg-[#176B4D] hover:bg-[#12563D] dark:bg-[#72D6A2] dark:hover:bg-[#8BE0B2] dark:text-[#0B110E] shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {isSwap
                          ? 'Send Swap Request'
                          : isGiveaway
                          ? 'Claim Free Item'
                          : 'Send Cash Meetup Inquiry'}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
