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
  const isSell = item.listingType === 'sell' || (!isSwap && !isGiveaway);

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
      setTimeout(() => {
        setRequestSent(false);
        setSelectedItemForModal(null);
      }, 2500);
    } catch (err) {
      setErrorMessage(err.message || 'Could not send exchange request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + `/marketplace?item=${item.id}`);
      showToast('Item link copied to clipboard!', 'info');
    }
  };

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
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-600 text-white shadow-xs flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5" />
          Completed
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        Available for Pickup
      </span>
    );
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
              src={item.imageUrl || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-transparent" />

            {/* Top Badges */}
            <div className="relative z-10 p-5 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-900/80 text-sage-200 border border-forest-600 backdrop-blur-md">
                {item.category?.replace('-', ' ')}
              </span>
              <div className="flex items-center gap-1.5">
                {statusBadge()}
              </div>
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
                    Condition: {item.condition}
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
                  {item.listingType === 'free' || item.listingType === 'giveaway' ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-sm">
                      <Gift className="w-4 h-4" />
                      100% Free Campus Give Away
                    </div>
                  ) : item.listingType === 'trade' || item.listingType === 'swap' ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-100 text-indigo-800 font-bold text-sm">
                      <RefreshCw className="w-4 h-4" />
                      Swap / Exchange
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-forest-950">${item.sellingPrice ?? item.price}</span>
                      {item.originalPrice > (item.sellingPrice ?? item.price) && (
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

              {/* Swap Desired Items Callout */}
              {(item.listingType === 'swap' || item.listingType === 'trade' || item.desiredItems) && item.desiredItems && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Desired Items for Swap:</span>
                  </div>
                  <p className="text-xs text-indigo-950 font-medium">
                    {item.desiredItems}
                  </p>
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>

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
                  Building: {item.location?.building || item.campus || 'Main Campus Library'} · Well-lit public area
                </p>
              </div>

              {/* Seller Profile Card */}
              <div className="border border-slate-100 bg-white p-3.5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.seller?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={item.seller?.name || 'Seller'}
                    className="w-11 h-11 rounded-full object-cover border-2 border-forest-600"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 text-sm">{item.seller?.name || 'Student Seller'}</span>
                      {(item.seller?.isCollegeVerified || item.seller?.verifiedStudent) ? (
                        <span className="inline-flex items-center text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                          .edu Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-full">
                          Unverified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{item.seller?.department || 'Student'} · {item.seller?.year || 'Campus'}</p>
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
              {errorMessage && (
                <div className="mb-3 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {isOwner ? (
                <div className="p-3.5 bg-forest-50 border border-forest-200 rounded-xl text-center space-y-1.5">
                  <p className="text-xs font-bold text-forest-900">This is your listing</p>
                  <p className="text-[11px] text-forest-700">
                    Manage proposals or update item status directly in your dashboard.
                  </p>
                  <Link
                    to="/dashboard"
                    onClick={() => setSelectedItemForModal(null)}
                    className="inline-block px-3.5 py-1.5 bg-forest-800 text-white rounded-lg text-xs font-semibold hover:bg-forest-900"
                  >
                    Open Eco Dashboard
                  </Link>
                </div>
              ) : !user ? (
                <div className="p-4 bg-offwhite-100 border border-slate-200 rounded-xl text-center space-y-2">
                  <p className="text-xs font-bold text-slate-800">Sign in to Request this Item</p>
                  <p className="text-[11px] text-slate-500">
                    Join verified students in our circular exchange network.
                  </p>
                  <Link
                    to="/login"
                    onClick={() => setSelectedItemForModal(null)}
                    className="inline-block px-4 py-2 bg-forest-800 text-white rounded-xl text-xs font-bold"
                  >
                    Sign In with Campus ID
                  </Link>
                </div>
              ) : !isAvailable ? (
                <div className="bg-slate-100 border border-slate-200 text-slate-700 p-4 rounded-xl text-center space-y-1">
                  <div className="flex items-center justify-center gap-1.5 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Item Unavailable for Exchange</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    This listing is marked as <strong>{item.status}</strong> and is not accepting new exchange requests.
                  </p>
                </div>
              ) : requestSent ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-center space-y-1">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto" />
                  <p className="font-bold text-sm">Proposal Dispatched!</p>
                  <p className="text-xs text-emerald-700">The owner was notified. Check your Eco Dashboard for updates.</p>
                </div>
              ) : (
                <form onSubmit={handleSendRequest} className="space-y-3">
                  {/* Listing Type Banner */}
                  {isSwap ? (
                    <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                        <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Swap Exchange Proposal</span>
                      </div>
                      {myAvailableItems.length > 0 ? (
                        <div>
                          <label className="text-[10px] font-bold uppercase text-indigo-950 block mb-1">
                            Select Item to Offer:
                          </label>
                          <select
                            value={selectedOfferedItemId}
                            onChange={(e) => setSelectedOfferedItemId(e.target.value)}
                            className="w-full text-xs font-semibold p-1.5 bg-white border border-indigo-300 rounded-lg text-slate-800"
                          >
                            {myAvailableItems.map((offered) => (
                              <option key={offered.id} value={offered.id}>
                                {offered.title} ({offered.condition})
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <p className="text-[11px] text-amber-800">
                          You need at least one available listing to propose a swap.{' '}
                          <Link to="/create" onClick={() => setSelectedItemForModal(null)} className="font-bold underline">
                            Post an item
                          </Link>
                        </p>
                      )}
                    </div>
                  ) : isGiveaway ? (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                        <Gift className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Free Campus Give Away</span>
                      </div>
                      <p className="text-[11px] text-emerald-800">
                        Free donation! No offered item or payment needed.
                      </p>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <MapPin className="w-3.5 h-3.5 text-forest-600" />
                        <span>In-Person Campus Cash Inquiry</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        No online payment gateway. Meet safely on campus and inspect before paying.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="flex items-center gap-1 text-[11px] font-medium text-slate-700 mb-0.5">
                        <Clock className="w-3 h-3 text-forest-600" />
                        Time Window:
                      </span>
                      <select
                        value={selectedMeetingTime}
                        onChange={(e) => setSelectedMeetingTime(e.target.value)}
                        className="w-full bg-offwhite-100 border border-slate-200 text-xs rounded-lg px-2 py-1.5 font-medium"
                      >
                        <option>Today after 3:00 PM</option>
                        <option>Tomorrow between 11 AM - 1 PM</option>
                        <option>Tomorrow after 4:00 PM</option>
                        <option>Flexible this week</option>
                      </select>
                    </div>

                    <div>
                      <span className="flex items-center gap-1 text-[11px] font-medium text-slate-700 mb-0.5">
                        <MapPin className="w-3 h-3 text-forest-600" />
                        Safe Zone:
                      </span>
                      <select
                        value={selectedSpot}
                        onChange={(e) => setSelectedSpot(e.target.value)}
                        className="w-full bg-offwhite-100 border border-slate-200 text-xs rounded-lg px-2 py-1.5 font-medium"
                      >
                        <option>Main Library 2nd Floor Cafe</option>
                        <option>Engineering Hall Commons</option>
                        <option>Student Union Info Desk</option>
                      </select>
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Add message (e.g. 'Can meet at 3:30 right after class')"
                    value={meetingNote}
                    onChange={(e) => setMeetingNote(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-forest-600"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting || (isSwap && myAvailableItems.length === 0)}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-forest-800 hover:bg-forest-900 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-sage-300" />
                        <span>Transmitting...</span>
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
