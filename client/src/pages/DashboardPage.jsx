import React, { useState } from 'react';
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
  CheckCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ItemCard from '../components/ItemCard';

export default function DashboardPage() {
  const { user, listings, savedItemIds, verifyCollege, showToast, updateListingStatus, deleteListing } = useApp();
  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'saved' | 'messages' | 'impact'
  const [studentIdInput, setStudentIdInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

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
    const userId = user._id || user.id;
    const ownerId = item.owner?._id || item.owner;
    const sellerId = item.seller?.id || item.seller?._id;
    const sellerName = item.seller?.name;
    return (
      (ownerId && String(ownerId) === String(userId)) ||
      (sellerId && String(sellerId) === String(userId)) ||
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

  // Mock incoming pickup proposals
  const mockRequests = [
    {
      id: 'req-1',
      buyerName: 'Alex Thorne',
      buyerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      itemTitle: 'Campbell Biology (12th Edition)',
      proposedTime: 'Today @ 3:30 PM',
      proposedSpot: 'Main Library 2nd Floor Cafe',
      status: 'pending',
      message: 'Hi Samira! Can meet right after my Bio lecture. Have exact cash!'
    },
    {
      id: 'req-2',
      buyerName: 'Priya Sharma',
      buyerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      itemTitle: 'Casio fx-991EX ClassWiz Calculator',
      proposedTime: 'Tomorrow @ 11:00 AM',
      proposedSpot: 'Engineering Hall Commons',
      status: 'confirmed',
      message: 'Confirmed! I will be by the front entrance near the solar charging table.'
    }
  ];

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
              ${user.dollarsSaved}
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
        <nav className="flex space-x-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'listings'
                ? 'border-forest-700 text-forest-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Active Listings ({myListings.length})</span>
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
            <span>Saved Wishlist ({savedListings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'messages'
                ? 'border-forest-700 text-forest-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Pickup Proposals ({mockRequests.length})</span>
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
        <div className="space-y-4">
          {myListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {myListings.map((item) => (
                <div key={item.id} className="flex flex-col">
                  <ItemCard item={item} />
                  {/* Owner Listing Management Controls */}
                  <div className="mt-2 bg-white rounded-xl border border-slate-200 p-2.5 flex items-center justify-between gap-2 shadow-2xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Status:</span>
                      <select
                        value={item.status || 'available'}
                        disabled={actionLoadingId === item.id}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className="text-xs font-semibold py-1 px-2 rounded-lg border border-slate-200 bg-offwhite-100 focus:outline-hidden focus:border-forest-600 cursor-pointer"
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
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 text-center border border-sage-200/80 space-y-3">
              <Package className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">You haven't posted any listings yet</h3>
              <p className="text-xs text-slate-500">
                Help fellow students and divert carbon by sharing your textbooks or lab gear.
              </p>
              <Link
                to="/create"
                className="inline-block px-5 py-2.5 rounded-xl bg-forest-800 text-white font-bold text-xs hover:bg-forest-900"
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

      {/* Tab 3: Pickup Proposals */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-sage-200/80 divide-y divide-slate-100">
            {mockRequests.map((req) => (
              <div key={req.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <img
                    src={req.buyerAvatar}
                    alt={req.buyerName}
                    className="w-10 h-10 rounded-full object-cover border border-sage-300 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{req.buyerName}</span>
                      <span className="text-xs text-slate-400">wants to exchange for</span>
                      <span className="font-semibold text-xs text-forest-800 bg-forest-50 px-2 py-0.5 rounded">
                        {req.itemTitle}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 italic">"{req.message}"</p>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-forest-600" />
                        {req.proposedTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-sage-600" />
                        {req.proposedSpot}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button className="px-4 py-2 rounded-xl bg-forest-800 text-white font-bold text-xs hover:bg-forest-900 transition-colors">
                    Accept Meeting
                  </button>
                  <button className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50">
                    Reschedule
                  </button>
                </div>
              </div>
            ))}
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
              <span className="text-xl font-black text-amber-600">${user.dollarsSaved}</span>
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
