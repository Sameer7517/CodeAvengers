import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Leaf, 
  MapPin, 
  ShieldCheck, 
  Bookmark, 
  Share2, 
  ArrowLeft, 
  Clock, 
  Send, 
  CheckCircle,
  Gift,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  AlertCircle,
  Loader2,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings, savedItemIds, toggleSave, showToast, user, createExchangeRequest } = useApp();

  const [item, setItem] = useState(() => listings.find((i) => i.id === id) || null);
  const [loading, setLoading] = useState(!item);
  const [selectedMeetingTime, setSelectedMeetingTime] = useState('Today after 3:00 PM');
  const [selectedSpot, setSelectedSpot] = useState('Main Library 2nd Floor Cafe');
  const [meetingNote, setMeetingNote] = useState('');
  const [selectedOfferedItemId, setSelectedOfferedItemId] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // User's own available items for swap offering
  const myAvailableItems = listings.filter((l) => {
    if (!user) return false;
    const userId = (user._id || user.id || '').toString();
    const ownerId = (l.owner?._id || l.owner || l.seller?.id || '').toString();
    const isOwner = (ownerId && ownerId === userId) || (l.seller?.name && user.name && l.seller.name.toLowerCase() === user.name.toLowerCase());
    return isOwner && (l.status || 'available') === 'available' && l.id !== id;
  });

  // Set default offered item if swap
  useEffect(() => {
    if (myAvailableItems.length > 0 && !selectedOfferedItemId) {
      setSelectedOfferedItemId(myAvailableItems[0].id);
    }
  }, [myAvailableItems, selectedOfferedItemId]);

  // Fetch from backend API on mount or ID change
  useEffect(() => {
    let isMounted = true;
    const fetchItem = async () => {
      try {
        const res = await fetch(`/api/listings/${id}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && isMounted) {
            setItem(json.data);
          }
        }
      } catch (err) {
        console.warn('Could not fetch listing from API:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchItem();
    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#176B4D] dark:text-[#72D6A2] mx-auto" />
        <p className="text-sm text-[var(--color-text-muted)] font-medium">Loading listing details from Campus Exchange...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[var(--color-text)]">Item Not Found</h2>
        <p className="text-sm text-[var(--color-text-muted)]">This listing may have been completed, deleted, or expired.</p>
        <Link to="/marketplace" className="inline-block px-5 py-2.5 rounded-xl bg-[#176B4D] dark:bg-[#72D6A2] text-white dark:text-[#0B110E] font-bold text-sm">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const isSaved = savedItemIds.includes(item.id);
  const isAvailable = (item.status || 'available') === 'available';
  const isSwap = item.listingType === 'swap' || item.listingType === 'trade';
  const isGiveaway = item.listingType === 'giveaway' || item.listingType === 'free';

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
      navigate('/login');
      return;
    }

    if (isOwner) {
      setErrorMessage('You cannot submit an exchange request for your own listing.');
      return;
    }

    if (!isAvailable) {
      setErrorMessage(`Cannot request pickup: item is already marked as ${item.status}.`);
      return;
    }

    if (isSwap && !selectedOfferedItemId) {
      setErrorMessage('Please select one of your available items to offer in this exchange.');
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
      navigator.clipboard.writeText(window.location.href);
      showToast('Item link copied to clipboard!', 'info');
    }
  };

  // Availability badge requirements:
  // Available: green, Reserved: amber, Completed: neutral gray
  const statusBadge = () => {
    const status = item.status || 'available';
    if (status === 'reserved') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          Reserved
        </span>
      );
    }
    if (status === 'completed') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-500 text-white shadow-xs flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5" />
          Completed
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#176B4D] dark:bg-[#72D6A2] text-white dark:text-[#0B110E] shadow-xs flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-white dark:bg-[#0B110E] animate-pulse" />
        Available
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-muted)]">
        <Link to="/" className="hover:text-[var(--color-text)]">Home</Link>
        <span>/</span>
        <Link to="/marketplace" className="hover:text-[var(--color-text)]">Marketplace</Link>
        <span>/</span>
        <span className="text-[var(--color-text)] truncate max-w-xs">{item.title}</span>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border border-[var(--color-border)]">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Image Gallery & Carbon Card */}
          <div className="relative bg-slate-900 min-h-[380px] md:min-h-[520px]">
            <img
              src={item.imageUrl || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            <div className="relative z-10 p-6 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 text-emerald-300 border border-white/20 backdrop-blur-md">
                  {item.category?.replace('-', ' ')}
                </span>
                <div className="flex items-center gap-2">
                  {statusBadge()}
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-slate-900 backdrop-blur-md">
                    {item.condition}
                  </span>
                </div>
              </div>

              {/* Environmental Offset Widget */}
              <div className="bg-[#0B110E]/80 backdrop-blur-md border border-[rgba(210,245,220,0.12)] rounded-2xl p-4 text-white space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs tracking-wide uppercase">
                    <Leaf className="w-4 h-4 text-emerald-400" />
                    <span>Collegiate Reuse Impact</span>
                  </div>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-bold">
                    Zero Waste
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
                    <p className="text-[11px] text-slate-300">Water preserved</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Price & Wishlist Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  {item.listingType === 'free' || item.listingType === 'giveaway' ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                      <Gift className="w-4 h-4" />
                      Free Campus Giveaway
                    </div>
                  ) : item.listingType === 'trade' || item.listingType === 'swap' ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-bold text-sm">
                      <RefreshCw className="w-4 h-4" />
                      Open for Swap / Exchange
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

                <div className="flex items-center gap-1.5">
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
                    aria-label="Share item link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-extrabold text-[var(--color-text)] leading-snug">
                {item.title}
              </h1>

              {/* Swap Desired Items Details */}
              {(item.listingType === 'trade' || item.listingType === 'swap') && item.desiredItems && (
                <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider block">
                    🔄 Desired in Swap:
                  </span>
                  <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-200 mt-1">
                    {item.desiredItems}
                  </p>
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                {item.description}
              </p>

              {/* Campus Safe Zone Info */}
              <div className="glass-panel border border-[var(--color-border)] rounded-2xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#176B4D] dark:text-[#72D6A2] uppercase tracking-wide">
                  <MapPin className="w-4 h-4" />
                  <span>Campus Designated Safe Zone</span>
                </div>
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  {item.location?.campusSpot || 'Main Library 2nd Floor'}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Building: {item.location?.building || item.campus || 'Main Campus'} · Well-lit public student space
                </p>
              </div>

              {/* Owner Information */}
              <div className="glass-panel border border-[var(--color-border)] p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.seller?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={item.seller?.name || 'Owner'}
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#176B4D]/40"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[var(--color-text)] text-sm">{item.seller?.name || 'Campus Student'}</span>
                      {(item.seller?.verifiedStudent || item.seller?.isCollegeVerified) && (
                        <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 px-1.5 py-0.2 rounded-full">
                          .edu Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)]">{item.seller?.department || 'University Student'} · {item.seller?.year || 'Student'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#176B4D] dark:text-[#72D6A2] block">
                    {item.seller?.karmaScore || 350} Karma
                  </span>
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    {item.seller?.itemsReused || 5} items reused
                  </span>
                </div>
              </div>
            </div>

            {/* Meetup Proposal Form or Status Notice */}
            <div className="pt-4 border-t border-[var(--color-border)]">
              {errorMessage && (
                <div className="mb-3 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {isOwner ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-2">
                  <p className="text-sm font-bold text-[var(--color-text)]">This is your listing</p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Manage incoming proposals or update availability in your dashboard.
                  </p>
                  <Link
                    to="/dashboard"
                    className="inline-block px-4 py-2 bg-[#176B4D] dark:bg-[#72D6A2] text-white dark:text-[#0B110E] rounded-xl text-xs font-bold transition-colors"
                  >
                    View in My Dashboard
                  </Link>
                </div>
              ) : !user ? (
                <div className="p-5 glass-panel border border-[var(--color-border)] rounded-2xl text-center space-y-3">
                  <Leaf className="w-7 h-7 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <div>
                    <p className="text-sm font-bold text-[var(--color-text)]">Sign in to Request this Item</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                      Join our campus exchange network to propose swaps, free pickups, or meetups.
                    </p>
                  </div>
                  <Link
                    to="/login"
                    className="inline-block px-5 py-2.5 bg-[#176B4D] dark:bg-[#72D6A2] text-white dark:text-[#0B110E] rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    Sign In with Campus Account
                  </Link>
                </div>
              ) : !isAvailable ? (
                <div className="p-4 glass-panel border border-[var(--color-border)] rounded-2xl text-center space-y-1">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mx-auto" />
                  <p className="text-sm font-bold text-[var(--color-text)]">
                    This item is currently {item.status.toUpperCase()}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    New exchange proposals cannot be submitted while an item is reserved or completed.
                  </p>
                </div>
              ) : requestSent ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 p-4 rounded-xl text-center space-y-2">
                  <CheckCircle className="w-7 h-7 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <p className="font-bold text-sm">Proposal Dispatched Successfully!</p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">
                    The owner was notified. You can track this proposal in your Dashboard.
                  </p>
                  <Link
                    to="/dashboard"
                    className="inline-block px-4 py-2 bg-[#176B4D] dark:bg-[#72D6A2] text-white dark:text-[#0B110E] text-xs font-bold rounded-xl mt-1"
                  >
                    Go to My Dashboard
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSendRequest} className="space-y-4">
                  {/* Workflow-specific Banner */}
                  {isSwap ? (
                    <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-300">
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Swap Exchange Proposal</span>
                      </div>
                      <p className="text-[11px] text-indigo-800 dark:text-indigo-300">
                        Select one of your available items to offer in exchange for this item.
                      </p>

                      {myAvailableItems.length > 0 ? (
                        <div className="space-y-1 pt-1">
                          <label className="text-[10px] font-bold uppercase text-[var(--color-text)] block">
                            Choose Your Item to Offer:
                          </label>
                          <select
                            value={selectedOfferedItemId}
                            onChange={(e) => setSelectedOfferedItemId(e.target.value)}
                            aria-label="Select item to offer"
                            className="w-full text-xs font-semibold p-2 glass-panel rounded-lg text-[var(--color-text)] border border-[var(--color-border)] focus:outline-hidden"
                          >
                            {myAvailableItems.map((offered) => (
                              <option key={offered.id} value={offered.id}>
                                {offered.title} ({offered.condition} · {offered.category?.replace('-', ' ')})
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[11px] text-amber-800 dark:text-amber-300 space-y-1">
                          <p className="font-semibold">You don't have any available items to offer.</p>
                          <Link to="/create" className="text-[#176B4D] dark:text-[#72D6A2] font-bold underline block">
                            + Post an item to offer first
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : isGiveaway ? (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-300">
                        <Gift className="w-3.5 h-3.5" />
                        <span>Free Campus Give Away</span>
                      </div>
                      <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                        This item is offered 100% free! Simply propose a meetup time to claim it.
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 glass-panel border border-[var(--color-border)] rounded-xl space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text)]">
                        <MapPin className="w-3.5 h-3.5 text-[#176B4D] dark:text-[#72D6A2]" />
                        <span>In-Person Campus Cash Inquiry</span>
                      </div>
                      <p className="text-[11px] text-[var(--color-text-muted)]">
                        Meet safely at the designated campus safe zone and inspect the item before paying cash.
                      </p>
                    </div>
                  )}

                  {/* Meeting Time & Spot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="font-semibold text-[var(--color-text)] flex items-center gap-1 mb-1">
                        <Clock className="w-3 h-3 text-[#176B4D] dark:text-[#72D6A2]" />
                        Meetup Window:
                      </label>
                      <select
                        value={selectedMeetingTime}
                        onChange={(e) => setSelectedMeetingTime(e.target.value)}
                        aria-label="Meeting time window"
                        className="w-full glass-panel border border-[var(--color-border)] rounded-lg px-2.5 py-1.5 font-medium text-[var(--color-text)]"
                      >
                        <option>Today after 3:00 PM</option>
                        <option>Tomorrow between 11 AM - 1 PM</option>
                        <option>Tomorrow after 4:00 PM</option>
                        <option>Flexible this week</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-[var(--color-text)] flex items-center gap-1 mb-1">
                        <MapPin className="w-3 h-3 text-[#176B4D] dark:text-[#72D6A2]" />
                        Campus Safe Zone:
                      </label>
                      <select
                        value={selectedSpot}
                        onChange={(e) => setSelectedSpot(e.target.value)}
                        aria-label="Campus meetup spot"
                        className="w-full glass-panel border border-[var(--color-border)] rounded-lg px-2.5 py-1.5 font-medium text-[var(--color-text)]"
                      >
                        <option>Main Library 2nd Floor Cafe</option>
                        <option>Engineering Hall Commons</option>
                        <option>Student Union Info Desk</option>
                        <option>Science Complex Courtyard</option>
                      </select>
                    </div>
                  </div>

                  {/* Personal Note */}
                  <div>
                    <label className="text-xs font-semibold text-[var(--color-text)] block mb-1">
                      Message to Owner:
                    </label>
                    <textarea
                      rows={2}
                      placeholder={
                        isSwap
                          ? "Explain why you'd like to swap and mention any additional details..."
                          : isGiveaway
                          ? "Share why this free item will help your coursework or studies..."
                          : "Mention cash availability or any questions about the item..."
                      }
                      value={meetingNote}
                      onChange={(e) => setMeetingNote(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl glass-panel border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-hidden resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || (isSwap && myAvailableItems.length === 0)}
                    className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#176B4D] hover:bg-[#12563D] dark:bg-[#72D6A2] dark:hover:bg-[#8BE0B2] dark:text-[#0B110E] shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white dark:text-[#0B110E]" />
                        <span>Transmitting Request...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>
                          {isSwap
                            ? 'Propose Swap Exchange'
                            : isGiveaway
                            ? 'Claim Free Item'
                            : 'Send Cash Meetup Inquiry'}
                        </span>
                      </>
                    )}
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
