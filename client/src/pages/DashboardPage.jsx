import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  Coins, 
  Recycle, 
  Award, 
  Bookmark, 
  Package, 
  MessageSquare, 
  Clock, 
  MapPin, 
  PlusCircle, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink,
  Calendar,
  Trash2,
  CheckCircle,
  RefreshCw,
  Gift,
  AlertCircle,
  XCircle,
  X,
  Bell,
  CheckCheck,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ItemCard from '../components/ItemCard';

export default function DashboardPage() {
  const { 
    user, 
    listings, 
    savedItemIds, 
    verifyCollege, 
    showToast, 
    updateListingStatus, 
    deleteListing,
    fetchExchangeRequests,
    acceptExchangeRequest,
    rejectExchangeRequest,
    cancelExchangeRequest,
    completeExchangeRequest,
    notifications,
    unreadNotifCount,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useApp();

  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'saved' | 'messages' | 'notifications' | 'impact'
  const [studentIdInput, setStudentIdInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Exchange requests state
  const [exchangeRequests, setExchangeRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestRole, setRequestRole] = useState('all'); // 'all' | 'incoming' | 'outgoing'
  const [requestStatusFilter, setRequestStatusFilter] = useState('all'); // 'all' | 'pending' | 'accepted' | 'completed' | 'rejected' | 'cancelled'
  const [declineModal, setDeclineModal] = useState({ isOpen: false, requestId: null, reason: '' });
  const [listingStatusFilter, setListingStatusFilter] = useState('all'); // 'all' | 'available' | 'reserved' | 'completed'

  const loadRequests = async () => {
    if (!user) return;
    setLoadingRequests(true);
    try {
      const data = await fetchExchangeRequests({
        role: requestRole,
        status: requestStatusFilter !== 'all' ? requestStatusFilter : undefined
      });
      setExchangeRequests(data || []);
    } catch (err) {
      console.warn('Could not load exchange requests:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user, requestRole, requestStatusFilter, activeTab]);

  const handleVerifyStudent = async (e) => {
    e.preventDefault();
    if (!studentIdInput.trim()) return;
    setIsVerifying(true);
    try {
      await verifyCollege({ studentIdCode: studentIdInput.trim() });
      setStudentIdInput('');
    } catch (err) {
      showToast(err.message || 'Verification failed', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  // User's active listings (checks owner ID, seller ID, and seller name)
  const myListings = listings.filter((item) => {
    if (!user) return false;
    const userId = (user._id || user.id || '').toString();
    const ownerId = (item.owner?._id || item.owner || '').toString();
    const sellerId = (item.seller?.id || item.seller?._id || '').toString();
    const sellerName = item.seller?.name;
    return (
      (ownerId && ownerId === userId) ||
      (sellerId && sellerId === userId) ||
      (sellerName && user.name && sellerName.toLowerCase() === user.name.toLowerCase())
    );
  });

  const handleStatusChange = async (itemId, newStatus) => {
    setActionLoadingId(itemId);
    try {
      await updateListingStatus(itemId, newStatus);
    } catch (err) {
      showToast(err.message || 'Could not update status', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteListing = async (itemId, itemTitle) => {
    if (window.confirm(`Are you sure you want to delete "${itemTitle}"? This cannot be undone.`)) {
      setActionLoadingId(itemId);
      try {
        await deleteListing(itemId);
      } catch (err) {
        showToast(err.message || 'Could not delete listing', 'error');
      } finally {
        setActionLoadingId(null);
      }
    }
  };

  // User's bookmarked listings
  const savedListings = listings.filter((item) => savedItemIds.includes(item.id));

  // Handler for accepting an exchange request (reserves items)
  const handleAcceptRequest = async (requestId) => {
    setActionLoadingId(requestId);
    try {
      await acceptExchangeRequest(requestId);
      await loadRequests();
    } catch (err) {
      showToast(err.message || 'Could not accept proposal', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handler for declining an exchange request
  const handleConfirmDecline = async () => {
    if (!declineModal.requestId) return;
    setActionLoadingId(declineModal.requestId);
    try {
      await rejectExchangeRequest(declineModal.requestId, declineModal.reason);
      setDeclineModal({ isOpen: false, requestId: null, reason: '' });
      await loadRequests();
    } catch (err) {
      showToast(err.message || 'Could not decline proposal', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handler for cancelling an exchange request
  const handleCancelRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to cancel this proposal?')) {
      setActionLoadingId(requestId);
      try {
        await cancelExchangeRequest(requestId);
        await loadRequests();
      } catch (err) {
        showToast(err.message || 'Could not cancel proposal', 'error');
      } finally {
        setActionLoadingId(null);
      }
    }
  };

  // Handler for completing an exchange request (handover confirmation)
  const handleCompleteRequest = async (requestId) => {
    setActionLoadingId(requestId);
    try {
      await completeExchangeRequest(requestId);
      await loadRequests();
    } catch (err) {
      showToast(err.message || 'Could not complete exchange', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4 p-8 bg-white rounded-3xl border border-sage-200">
        <Leaf className="w-10 h-10 text-forest-700 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Please Sign In to Access Your Dashboard</h2>
        <p className="text-xs text-slate-500">Track your carbon diversion, manage listings, and arrange safe campus meetups.</p>
        <Link
          to="/login"
          className="inline-block py-2.5 px-6 rounded-xl bg-forest-800 text-white text-xs font-bold hover:bg-forest-900"
        >
          Sign In with Campus ID
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Student Profile Header & Eco Karma Tier Banner */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-850 rounded-3xl p-6 sm:p-8 text-white border border-forest-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-forest-950 p-1 rounded-full shadow">
                <CheckCircle2 className="w-4 h-4 fill-emerald-400 text-forest-950" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight">{user.name}</h1>
                {user.isCollegeVerified ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-800 text-emerald-200 border border-emerald-600">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    .edu Verified Student
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-900/80 text-amber-300 border border-amber-700">
                    ⚠️ Unverified Student
                  </span>
                )}
              </div>
              <p className="text-xs text-sage-300 mt-0.5">
                {user.department} · {user.year} · {user.campus}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  Campus Eco-Champion (Top 5%)
                </span>
                {!user.isCollegeVerified && (
                  <span className="text-[11px] text-amber-300 bg-amber-900/60 px-2 py-0.5 rounded border border-amber-700/60">
                    Campus ID Verification Needed
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action */}
          <div className="flex items-center gap-3">
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-bold text-xs shadow-md transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List New Item</span>
            </Link>
          </div>
        </div>

        {/* Live Personal Sustainability Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-forest-800/80">
          <div>
            <span className="text-xs uppercase tracking-wider text-sage-300 block font-semibold">
              CO₂ Emissions Diverted
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">
              {user.co2DivertedKg} <span className="text-sm">kg</span>
            </span>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-sage-300 block font-semibold">
              Total Student Savings
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-300">
              ₹{user.rupeesSaved ?? user.dollarsSaved}
            </span>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-sage-300 block font-semibold">
              Items Reused
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white">
              {user.itemsReused}
            </span>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-sage-300 block font-semibold">
              Campus Eco-Karma
            </span>
            <span className="text-2xl sm:text-3xl font-black text-sage-300">
              {user.karmaScore} <span className="text-xs font-normal">pts</span>
            </span>
          </div>
        </div>
      </div>

      {/* Unverified Account Action Card */}
      {!user.isCollegeVerified && (
        <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Complete Campus Student Verification</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed max-w-xl">
              You registered with a non-institutional email. Enter your 4+ digit campus student ID or verification code to earn the verified student badge and build community trust.
            </p>
          </div>

          <form onSubmit={handleVerifyStudent} className="flex items-center gap-2 shrink-0">
            <input
              type="text"
              placeholder="Student ID / Code (e.g. 8421)"
              value={studentIdInput}
              onChange={(e) => setStudentIdInput(e.target.value)}
              className="text-xs px-3 py-2 border border-amber-300 rounded-xl bg-white focus:outline-hidden focus:border-amber-600 font-medium"
            />
            <button
              type="submit"
              disabled={isVerifying}
              className="text-xs font-bold px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              {isVerifying ? 'Verifying...' : 'Verify Now'}
            </button>
          </form>
        </div>
      )}

      {/* Badges Bar */}
      <div className="bg-white rounded-2xl p-5 border border-sage-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-forest-700" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Earned Sustainability Badges:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {user.badges?.map((badge, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-forest-50 border border-forest-200/70 text-forest-900 text-xs font-semibold"
              title={badge.desc}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>{badge.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dashboard Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex flex-wrap gap-2 sm:gap-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'listings'
                ? 'border-forest-700 text-forest-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Listings ({myListings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors relative ${
              activeTab === 'messages'
                ? 'border-forest-700 text-forest-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Exchanges & Proposals ({exchangeRequests.length})</span>
            {exchangeRequests.filter(r => r.status === 'pending').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors relative ${
              activeTab === 'notifications'
                ? 'border-forest-700 text-forest-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
            {unreadNotifCount > 0 && (
              <span className="px-1.5 py-0.2 bg-emerald-600 text-white rounded-full text-[10px] font-black">
                {unreadNotifCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'saved'
                ? 'border-forest-700 text-forest-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved ({savedListings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('impact')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'impact'
                ? 'border-forest-700 text-forest-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Leaf className="w-4 h-4" />
            <span>Eco Certificate</span>
          </button>
        </nav>
      </div>

      {/* Tab 1: My Listings */}
      {activeTab === 'listings' && (
        <div className="space-y-6">
          {/* Sub-tabs for Available, Reserved, Completed & Add Listing Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 p-1 rounded-xl glass-panel">
              {[
                { id: 'all', label: 'All Listings', count: myListings.length },
                { id: 'available', label: 'Available', count: myListings.filter(i => (i.status || 'available') === 'available').length },
                { id: 'reserved', label: 'Reserved', count: myListings.filter(i => i.status === 'reserved').length },
                { id: 'completed', label: 'Completed', count: myListings.filter(i => i.status === 'completed').length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setListingStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    listingStatusFilter === tab.id
                      ? 'bg-[#176B4D] dark:bg-[#72D6A2] text-white dark:text-[#0B110E] shadow-xs'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#176B4D] dark:bg-[#72D6A2] text-white dark:text-[#0B110E] text-xs font-bold rounded-xl shadow-xs hover:shadow transition-all self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Listing</span>
            </Link>
          </div>

          {myListings.filter(item => listingStatusFilter === 'all' || (item.status || 'available') === listingStatusFilter).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {myListings
                .filter(item => listingStatusFilter === 'all' || (item.status || 'available') === listingStatusFilter)
                .map((item) => (
                  <div key={item.id} className="flex flex-col">
                    <ItemCard item={item} />
                    {/* Owner Listing Management Controls */}
                    <div className="mt-2 glass-panel rounded-xl border border-[var(--color-border)] p-2.5 flex items-center justify-between gap-2 shadow-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase">Status:</span>
                        <select
                          value={item.status || 'available'}
                          disabled={actionLoadingId === item.id}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className="text-xs font-semibold py-1 px-2 rounded-lg border border-[var(--color-border)] glass-panel text-[var(--color-text)] focus:outline-hidden cursor-pointer"
                        >
                          <option value="available">🟢 Available</option>
                          <option value="reserved">🟡 Reserved</option>
                          <option value="completed">⚪ Completed</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteListing(item.id, item.title)}
                        disabled={actionLoadingId === item.id}
                        className="p-1.5 text-[var(--color-text-muted)] hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete Listing"
                        aria-label="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-10 text-center border border-[var(--color-border)] space-y-3">
              <Package className="w-10 h-10 text-[var(--color-text-muted)] mx-auto opacity-50" />
              <h3 className="text-base font-bold text-[var(--color-text)]">
                {listingStatusFilter === 'all' ? "You haven't posted any listings yet" : `No ${listingStatusFilter} listings found`}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                Help fellow students and divert carbon by sharing your textbooks, calculators, or lab gear.
              </p>
              <Link
                to="/create"
                className="inline-block px-5 py-2.5 rounded-xl bg-[#176B4D] dark:bg-[#72D6A2] text-white dark:text-[#0B110E] font-bold text-xs"
              >
                + List an Item Now
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved / Wishlist */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          {savedListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {savedListings.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-sage-200/80 space-y-3">
              <Bookmark className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">Your wishlist is empty</h3>
              <p className="text-xs text-slate-500">
                Bookmark items you plan to pick up around campus.
              </p>
              <Link
                to="/marketplace"
                className="inline-block px-5 py-2.5 rounded-xl bg-forest-800 text-white font-bold text-xs hover:bg-forest-900"
              >
                Browse Marketplace
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Exchanges & Proposals */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          {/* Controls & Filter Bar */}
          <div className="bg-white rounded-2xl p-4 border border-sage-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Role Filter */}
            <div className="flex items-center gap-1.5 bg-offwhite-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setRequestRole('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  requestRole === 'all'
                    ? 'bg-forest-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Proposals ({exchangeRequests.length})
              </button>
              <button
                onClick={() => setRequestRole('incoming')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  requestRole === 'incoming'
                    ? 'bg-forest-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Incoming Proposals
              </button>
              <button
                onClick={() => setRequestRole('outgoing')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  requestRole === 'outgoing'
                    ? 'bg-forest-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                My Sent Requests
              </button>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Status:</span>
              <select
                value={requestStatusFilter}
                onChange={(e) => setRequestStatusFilter(e.target.value)}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:border-forest-600"
              >
                <option value="all">All Statuses</option>
                <option value="pending">🟡 Pending Review</option>
                <option value="accepted">🔵 Reserved / Accepted</option>
                <option value="completed">🟢 Completed (+50 Karma)</option>
                <option value="rejected">🔴 Declined</option>
                <option value="cancelled">⚪ Cancelled</option>
              </select>
            </div>
          </div>

          {/* Proposals List */}
          {loadingRequests ? (
            <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-sage-200">
              <Loader2 className="w-8 h-8 animate-spin text-forest-700 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">Loading proposals from database...</p>
            </div>
          ) : exchangeRequests.length > 0 ? (
            <div className="space-y-4">
              {exchangeRequests.map((req) => {
                const userId = (user._id || user.id || '').toString();
                const ownerId = (req.owner?._id || req.owner?.id || req.owner || '').toString();
                const requesterId = (req.requester?._id || req.requester?.id || req.requester || '').toString();
                const isOwner = ownerId === userId || (req.listing?.seller?.name && user.name && req.listing.seller.name.toLowerCase() === user.name.toLowerCase());
                const isRequester = requesterId === userId;
                const isSwap = req.type === 'swap' || Boolean(req.offeredListing);
                const isGiveaway = req.type === 'giveaway';
                const isActionLoading = actionLoadingId === req.id;

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-sage-200/90 shadow-xs hover:shadow-eco transition-all space-y-5"
                  >
                    {/* Top Row: Type Tag, Status Badge & Timestamp */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        {isSwap ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                            <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                            Swap Exchange
                          </span>
                        ) : isGiveaway ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <Gift className="w-3.5 h-3.5 text-emerald-600" />
                            Free Give Away
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                            <Coins className="w-3.5 h-3.5 text-slate-600" />
                            Cash Purchase Inquiry
                          </span>
                        )}

                        <span className="text-[11px] text-slate-400 font-medium">
                          Ref #{req.id.slice(-6)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {req.status === 'pending' && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Pending Review
                          </span>
                        )}
                        {req.status === 'accepted' && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-indigo-600" />
                            Reserved & In Progress
                          </span>
                        )}
                        {req.status === 'completed' && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            Completed (+50 Karma)
                          </span>
                        )}
                        {req.status === 'rejected' && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            Declined
                          </span>
                        )}
                        {req.status === 'cancelled' && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1">
                            <X className="w-3 h-3 text-slate-500" />
                            Cancelled
                          </span>
                        )}

                        <span className="text-[11px] text-slate-400">
                          {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                    </div>

                    {/* Middle Row: Items Involved */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-offwhite-100/70 p-4 rounded-2xl border border-slate-200/70">
                      {/* Requested Item */}
                      <div className="flex items-center gap-3">
                        <img
                          src={req.listing?.imageUrl || (req.listing?.images && req.listing.images[0]) || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80'}
                          alt={req.listing?.title || 'Requested Item'}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Requested Item
                          </span>
                          <Link
                            to={`/item/${req.listing?.id || req.listing?._id || req.listing}`}
                            className="font-bold text-sm text-slate-900 hover:text-forest-700 truncate block"
                          >
                            {req.listing?.title || 'Campus Item'}
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-forest-700 font-semibold">
                              {req.listing?.listingType === 'free' || req.listing?.listingType === 'giveaway'
                                ? '100% Free'
                                : req.listing?.listingType === 'swap'
                                ? 'Open for Swap'
                                : `₹${req.listing?.sellingPrice ?? req.listing?.price ?? 0}`}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-200/60 text-slate-700 font-medium">
                              Status: {req.listing?.status || 'available'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* If Swap: Offered Item */}
                      {isSwap ? (
                        <div className="flex items-center gap-3 md:border-l md:border-slate-200 md:pl-4">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                            <RefreshCw className="w-3.5 h-3.5" />
                          </div>
                          {req.offeredListing ? (
                            <>
                              <img
                                src={req.offeredListing.imageUrl || (req.offeredListing.images && req.offeredListing.images[0]) || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80'}
                                alt={req.offeredListing.title}
                                className="w-16 h-16 rounded-xl object-cover border border-indigo-200 shrink-0"
                              />
                              <div className="min-w-0">
                                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                                  Offered in Return
                                </span>
                                <p className="font-bold text-sm text-slate-900 truncate">
                                  {req.offeredListing.title}
                                </p>
                                <span className="text-[10px] text-slate-500 block">
                                  Condition: {req.offeredListing.condition || 'Good'} · Status: {req.offeredListing.status}
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="text-xs text-slate-500 italic">
                              Offered item details loading...
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 md:border-l md:border-slate-200 md:pl-4 text-xs text-slate-500">
                          <ShieldCheck className="w-4 h-4 text-forest-600 shrink-0" />
                          <span>
                            {isGiveaway
                              ? 'Direct campus donation to help student peer.'
                              : 'In-person campus safe-zone cash exchange agreement.'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Details: Counterpart, Meetup Info & Student Message */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Counterpart Student */}
                      <div className="flex items-center gap-2.5">
                        <img
                          src={isOwner ? req.requester?.avatar : req.owner?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                          alt={isOwner ? req.requester?.name : req.owner?.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-forest-600 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1 font-bold text-slate-900 truncate">
                            <span>{isOwner ? req.requester?.name : req.owner?.name || 'Campus Student'}</span>
                            {(isOwner ? req.requester?.isCollegeVerified : req.owner?.isCollegeVerified) && (
                              <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" title="Verified Student" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {isOwner ? 'Requester' : 'Listing Owner'} · {isOwner ? req.requester?.department : req.owner?.department || 'Student'}
                          </p>
                        </div>
                      </div>

                      {/* Meetup Logistics */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                          <Clock className="w-3.5 h-3.5 text-forest-600" />
                          <span>{req.proposedMeetingTime || 'Flexible this week'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-sage-600" />
                          <span className="truncate">{req.proposedSpot || 'Campus Safe Zone'}</span>
                        </div>
                      </div>

                      {/* Student Message */}
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                          Note / Message:
                        </span>
                        <p className="text-slate-700 italic line-clamp-2">
                          "{req.message || 'Ready to exchange on campus.'}"
                        </p>
                      </div>
                    </div>

                    {/* Rejection Reason Notice (if rejected) */}
                    {req.status === 'rejected' && req.rejectionReason && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Decline Reason:</span> {req.rejectionReason}
                        </div>
                      </div>
                    )}

                    {/* Handover Notice (if accepted) */}
                    {req.status === 'accepted' && (
                      <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                          <span>
                            <strong>Items Reserved for Meetup!</strong> Meet safely at {req.proposedSpot} to inspect and complete exchange.
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons Row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                      <div className="text-[11px] text-slate-400">
                        {req.status === 'pending' && isOwner && 'Review this proposal and reserve items.'}
                        {req.status === 'pending' && isRequester && 'Waiting for owner review.'}
                        {req.status === 'accepted' && 'Both items locked in safe campus reservation.'}
                        {req.status === 'completed' && '🌱 Circular exchange complete! +50 Eco-Karma credited.'}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Owner on Pending: Accept & Reserve or Decline */}
                        {req.status === 'pending' && isOwner && (
                          <>
                            <button
                              onClick={() => handleAcceptRequest(req.id)}
                              disabled={isActionLoading}
                              className="px-4 py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                            >
                              {isActionLoading ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <CheckCircle className="w-3.5 h-3.5 text-sage-300" />
                              )}
                              <span>Accept & Reserve Items</span>
                            </button>

                            <button
                              onClick={() => setDeclineModal({ isOpen: true, requestId: req.id, reason: '' })}
                              disabled={isActionLoading}
                              className="px-3.5 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-xl font-bold text-xs transition-colors"
                            >
                              Decline
                            </button>
                          </>
                        )}

                        {/* Requester on Pending: Cancel */}
                        {req.status === 'pending' && isRequester && (
                          <button
                            onClick={() => handleCancelRequest(req.id)}
                            disabled={isActionLoading}
                            className="px-3.5 py-2 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-xl font-bold text-xs transition-colors"
                          >
                            Cancel Request
                          </button>
                        )}

                        {/* Accepted State: Confirm Handover & Complete */}
                        {req.status === 'accepted' && (
                          <button
                            onClick={() => handleCompleteRequest(req.id)}
                            disabled={isActionLoading}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                          >
                            {isActionLoading ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            )}
                            <span>Confirm Handover & Complete (+50 Karma)</span>
                          </button>
                        )}

                        {/* Completed State Badge */}
                        {req.status === 'completed' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                            Loop Closed · +50 Karma Added
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-sage-200/80 space-y-3">
              <RefreshCw className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Exchange Proposals Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {requestRole === 'incoming'
                  ? 'You have not received any proposals for your listings yet.'
                  : requestRole === 'outgoing'
                  ? 'You have not submitted any exchange proposals yet.'
                  : 'Start swapping or claiming free items across campus to view proposals here.'}
              </p>
              <Link
                to="/marketplace"
                className="inline-block px-5 py-2.5 rounded-xl bg-forest-800 text-white font-bold text-xs hover:bg-forest-900"
              >
                Explore Campus Marketplace
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: In-App Notifications History */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-sage-200/80 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-forest-700" />
              <h3 className="text-sm font-bold text-slate-900">Campus Notification History</h3>
              {unreadNotifCount > 0 && (
                <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {unreadNotifCount} unread
                </span>
              )}
            </div>

            {unreadNotifCount > 0 && (
              <button
                onClick={async () => {
                  await markAllNotificationsAsRead();
                }}
                className="text-xs font-bold text-forest-700 hover:text-forest-900 flex items-center gap-1"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all as read
              </button>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-sage-200/80 divide-y divide-slate-100 overflow-hidden shadow-xs">
            {notifications && notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={async () => {
                    if (!notif.read) {
                      await markNotificationAsRead(notif.id);
                    }
                  }}
                  className={`p-4 flex items-start justify-between gap-4 transition-colors cursor-pointer hover:bg-slate-50 ${
                    !notif.read ? 'bg-forest-50/40' : ''
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center shrink-0 mt-0.5">
                      {notif.type?.includes('completed') ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      ) : notif.type?.includes('swap') ? (
                        <RefreshCw className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <Bell className="w-5 h-5 text-forest-700" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{notif.title}</span>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{notif.message}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {new Date(notif.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <button
                      onClick={() => setActiveTab('messages')}
                      className="text-xs font-bold text-forest-700 hover:text-forest-900 flex items-center gap-1"
                    >
                      <span>View Proposals</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center space-y-2">
                <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No notifications on file</p>
                <p className="text-xs text-slate-400">Activity regarding your proposals and listings will appear here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Decline Reason Modal */}
      {declineModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-sage-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Decline Exchange Proposal</span>
              </div>
              <button
                onClick={() => setDeclineModal({ isOpen: false, requestId: null, reason: '' })}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Please provide a polite reason for declining so the student understands (e.g., item already promised to classmate, or looking for specific course materials).
            </p>

            <textarea
              rows={3}
              placeholder="e.g. Sorry, I am currently looking for the 12th edition textbook for Biology 101."
              value={declineModal.reason}
              onChange={(e) => setDeclineModal(prev => ({ ...prev, reason: e.target.value }))}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:border-rose-600 resize-none font-medium text-slate-800"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeclineModal({ isOpen: false, requestId: null, reason: '' })}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Back
              </button>
              <button
                onClick={handleConfirmDecline}
                disabled={actionLoadingId === declineModal.requestId}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 shadow-xs disabled:opacity-50"
              >
                {actionLoadingId === declineModal.requestId ? 'Declining...' : 'Confirm Decline'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Eco Impact Certificate */}
      {activeTab === 'impact' && (
        <div className="bg-white rounded-3xl p-8 border-2 border-forest-600/30 shadow-eco-lg max-w-2xl mx-auto space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-forest-50 border border-forest-200 flex items-center justify-center text-forest-800 mx-auto">
            <Leaf className="w-8 h-8 text-emerald-600" />
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-forest-700">
              Campus Climate Action Leadership
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              Certificate of Circular Stewardship
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Awarded to <strong>{user.name}</strong> for actively recirculating university equipment.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 py-4 border-y border-dashed border-slate-200">
            <div>
              <span className="text-xl font-black text-emerald-600">{user.co2DivertedKg} kg</span>
              <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">CO₂ Averted</p>
            </div>
            <div>
              <span className="text-xl font-black text-amber-600">₹{user.rupeesSaved ?? user.dollarsSaved}</span>
              <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">Campus Wealth Kept</p>
            </div>
            <div>
              <span className="text-xl font-black text-forest-800">{user.itemsReused} Items</span>
              <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">Saved from Landfills</p>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            By exchanging course supplies rather than buying new, you prevented carbon-intensive supply chain emissions and supported peer accessibility.
          </p>

          <button
            onClick={() => window.print()}
            className="px-6 py-2.5 rounded-xl bg-forest-800 text-white font-bold text-xs hover:bg-forest-900 shadow transition-colors"
          >
            Download / Print Official PDF Badge
          </button>
        </div>
      )}
    </div>
  );
}
