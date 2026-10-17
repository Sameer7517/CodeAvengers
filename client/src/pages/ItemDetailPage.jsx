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
  Loader2
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
        <Loader2 className="w-8 h-8 animate-spin text-forest-700 mx-auto" />
        <p className="text-sm text-slate-500 font-medium">Loading listing details from CampusLoop...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Item Not Found</h2>
        <p className="text-sm text-slate-500">This listing may have been completed, deleted, or expired.</p>
        <Link to="/marketplace" className="inline-block px-5 py-2.5 rounded-xl bg-forest-800 text-white font-bold text-sm">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const isSaved = savedItemIds.includes(item.id);
  const isAvailable = (item.status || 'available') === 'available';
  const isSwap = item.listingType === 'swap' || item.listingType === 'trade';
  const isGiveaway = item.listingType === 'giveaway' || item.listingType === 'free';
  const isSell = item.listingType === 'sell' || (!isSwap && !isGiveaway);

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
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-600 text-white shadow-xs flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5" />
          Completed
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        Available
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back to Marketplace Breadcrumb */}
      <div>
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 text-xs font-bold text-forest-700 hover:text-forest-900 bg-forest-50 px-3.5 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Campus Marketplace</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-sage-200/80 shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Media Container */}
          <div className="relative bg-slate-900 min-h-[360px] md:min-h-[500px]">
            <img
              src={item.imageUrl || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-transparent" />

            <div className="relative z-10 p-6 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-900/80 text-sage-200 border border-forest-600 backdrop-blur-md">
                  {item.category?.replace('-', ' ')}
                </span>
                <div className="flex items-center gap-2">
                  {statusBadge()}
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-slate-800 backdrop-blur-md">
                    {item.condition}
                  </span>
                </div>
              </div>

              {/* Carbon Savings Widget */}
              <div className="bg-forest-950/85 backdrop-blur-md border border-forest-700/80 rounded-2xl p-4 text-white space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sage-300 font-semibold text-xs tracking-wide uppercase">
                    <Leaf className="w-4 h-4 text-emerald-400" />
                    <span>Environmental Impact Avoided</span>
                  </div>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-bold">
                    Zero Waste
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-forest-800">
                  <div>
                    <span className="text-2xl font-black text-emerald-400">-{item.co2SavedKg} kg</span>
                    <p className="text-[11px] text-slate-300">Emissions averted</p>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-sage-300">
                      {Math.max(1, Math.round(item.co2SavedKg * 1.8))} gal
                    </span>
                    <p className="text-[11px] text-slate-300">Water preserved</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Price & Wishlist Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  {item.listingType === 'free' || item.listingType === 'giveaway' ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-sm">
                      <Gift className="w-4 h-4" />
                      Free Campus Giveaway
                    </div>
                  ) : item.listingType === 'trade' || item.listingType === 'swap' ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-100 text-indigo-800 font-bold text-sm">
                      <RefreshCw className="w-4 h-4" />
                      Open for Swap / Exchange
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-forest-950">${item.sellingPrice ?? item.price}</span>
                      {(item.originalPrice || 0) > (item.sellingPrice ?? item.price) && (
                        <>
                          <span className="text-sm text-slate-400 line-through">${item.originalPrice}</span>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
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
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                    title={isSaved ? "Saved" : "Save to wishlist"}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-rose-600' : ''}`} />
                  </button>
                  <button
                    onClick={copyShareLink}
                    className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    title="Share item"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-black text-slate-900 leading-snug">
                {item.title}
              </h1>

              {/* Swap Desired Items Details */}
              {(item.listingType === 'trade' || item.listingType === 'swap') && item.desiredItems && (
                <div className="p-3.5 bg-indigo-50/80 border border-indigo-200 rounded-2xl">
                  <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider block">
                    🔄 Desired Items in Swap:
                  </span>
                  <p className="text-sm font-semibold text-indigo-900 mt-1">
                    {item.desiredItems}
                  </p>
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>

              {/* Campus Safe Zone Info */}
              <div className="bg-sage-50/70 border border-sage-200/80 rounded-2xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-forest-900 uppercase tracking-wide">
                  <MapPin className="w-4 h-4 text-forest-600" />
                  <span>Campus Designated Safe Zone</span>
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  {item.location?.campusSpot || 'Main Library 2nd Floor'}
                </p>
                <p className="text-xs text-slate-500">
                  Building: {item.location?.building || item.campus || 'Main Campus'} · Well-lit public student facility
                </p>
              </div>

              {/* Seller Information */}
              <div className="border border-slate-100 bg-offwhite-100 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.seller?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={item.seller?.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-forest-600"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 text-sm">{item.seller?.name || 'Campus Student'}</span>
                      {(item.seller?.verifiedStudent || item.seller?.isCollegeVerified) && (
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                          .edu Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{item.seller?.department || 'General Studies'} · {item.seller?.year || 'Student'}</p>
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

            {/* Meetup Proposal Form or Status Notice */}
            <div className="pt-4 border-t border-slate-100">
              {errorMessage && (
                <div className="mb-3 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {isOwner ? (
                <div className="p-4 bg-forest-50 border border-forest-200 rounded-2xl text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-4 h-4 text-forest-700" />
                  </div>
                  <p className="text-sm font-bold text-forest-900">This is your listing</p>
                  <p className="text-xs text-forest-700">
                    You can manage incoming proposals or update availability in your dashboard.
                  </p>
                  <Link
                    to="/dashboard"
                    className="inline-block px-4 py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    View in Eco Dashboard
                  </Link>
                </div>
              ) : !user ? (
                <div className="p-5 bg-offwhite-100 border border-sage-200 rounded-2xl text-center space-y-3">
                  <Leaf className="w-7 h-7 text-forest-600 mx-auto" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">Sign in to Request this Item</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Join our campus circular network to propose swaps, free pickups, or meetups.
                    </p>
                  </div>
                  <Link
                    to="/login"
                    className="inline-block px-5 py-2.5 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    Sign In with Campus Account
                  </Link>
                </div>
              ) : !isAvailable ? (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mx-auto" />
                  <p className="text-sm font-bold text-slate-800">
                    This item is currently {item.status.toUpperCase()}
                  </p>
                  <p className="text-xs text-slate-500">
                    New exchange proposals cannot be accepted while an item is reserved or completed.
                  </p>
                </div>
              ) : requestSent ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-center space-y-2">
                  <CheckCircle className="w-7 h-7 text-emerald-600 mx-auto" />
                  <p className="font-bold text-sm">Proposal Dispatched Successfully!</p>
                  <p className="text-xs text-emerald-700">
                    The owner was notified. You can track this proposal in your Eco Dashboard.
                  </p>
                  <Link
                    to="/dashboard"
                    className="inline-block px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:bg-emerald-800 mt-1"
                  >
                    Go to My Dashboard
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSendRequest} className="space-y-4">
                  {/* Workflow-specific Banner */}
                  {isSwap ? (
                    <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                        <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Swap Exchange Proposal</span>
                      </div>
                      <p className="text-[11px] text-indigo-800">
                        Select one of your available items to offer in exchange for this item.
                      </p>

                      {myAvailableItems.length > 0 ? (
                        <div className="space-y-1 pt-1">
                          <label className="text-[10px] font-bold uppercase text-indigo-950 block">
                            Choose Your Item to Offer:
                          </label>
                          <select
                            value={selectedOfferedItemId}
                            onChange={(e) => setSelectedOfferedItemId(e.target.value)}
                            className="w-full text-xs font-semibold p-2 bg-white border border-indigo-300 rounded-lg text-slate-800 focus:outline-hidden focus:border-indigo-600"
                          >
                            {myAvailableItems.map((offered) => (
                              <option key={offered.id} value={offered.id}>
                                {offered.title} ({offered.condition} · {offered.category?.replace('-', ' ')})
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 space-y-1">
                          <p className="font-semibold">You don't have any available items to offer.</p>
                          <Link to="/create" className="text-forest-800 font-bold underline block">
                            + Post an item to offer first
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : isGiveaway ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                        <Gift className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Free Campus Give Away</span>
                      </div>
                      <p className="text-[11px] text-emerald-800">
                        This item is offered 100% free! Simply propose a meetup time to claim it.
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <MapPin className="w-3.5 h-3.5 text-forest-600" />
                        <span>In-Person Campus Cash Inquiry</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        CampusLoop does not process online payments. Meet safely at the designated campus safe zone and inspect the item before paying cash.
                      </p>
                    </div>
                  )}

                  {/* Meeting Time & Spot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 flex items-center gap-1 mb-1">
                        <Clock className="w-3 h-3 text-forest-600" />
                        Meetup Window:
                      </label>
                      <select
                        value={selectedMeetingTime}
                        onChange={(e) => setSelectedMeetingTime(e.target.value)}
                        className="w-full bg-offwhite-100 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800"
                      >
                        <option>Today after 3:00 PM</option>
                        <option>Tomorrow between 11 AM - 1 PM</option>
                        <option>Tomorrow after 4:00 PM</option>
                        <option>Flexible this week</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 flex items-center gap-1 mb-1">
                        <MapPin className="w-3 h-3 text-forest-600" />
                        Campus Safe Zone:
                      </label>
                      <select
                        value={selectedSpot}
                        onChange={(e) => setSelectedSpot(e.target.value)}
                        className="w-full bg-offwhite-100 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800"
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
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
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
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-forest-600 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || (isSwap && myAvailableItems.length === 0)}
                    className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-forest-800 hover:bg-forest-900 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-sage-300" />
                        <span>Transmitting Request...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-sage-300" />
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
