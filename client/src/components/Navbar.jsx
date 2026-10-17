import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Leaf, 
  PlusCircle, 
  Search, 
  User, 
  Menu, 
  X, 
  Sparkles, 
  LayoutDashboard,
  ShieldCheck, 
  LogOut, 
  Bell, 
  CheckCheck, 
  CheckCircle, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateInitialsAvatar } from '../utils/avatar';
import ThemeSelector from './ThemeSelector';

export default function Navbar() {
  const { 
    user, 
    logout, 
    stats,
    notifications,
    unreadNotifCount,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleNavSearch = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/marketplace?q=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
    } else {
      navigate('/marketplace');
    }
  };

  return (
    <header className="sticky top-0 z-40 glass-nav transition-colors duration-200">
      {/* Top Value Proposition & Sustainability Announcement Bar */}
      <div className="bg-[#176B4D] dark:bg-[#131C17] text-white/95 dark:text-emerald-100 text-xs py-1.5 px-4 border-b border-black/10 dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 dark:bg-emerald-900/50 text-white dark:text-emerald-200 border border-white/20">
              🌱 Campus Sustainability
            </span>
            <span className="hidden sm:inline text-white/90 dark:text-emerald-200/90">
              Together students have diverted <strong>{Number(stats?.totalCo2SavedKg ?? stats?.completedMetrics?.verifiedCo2SavedKg ?? 1542).toLocaleString()} kg of CO₂</strong> this semester!
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hidden md:flex items-center gap-1 text-emerald-100 dark:text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Student Exchanges
            </span>
            <Link 
              to="/marketplace?type=free" 
              className="text-white hover:text-emerald-200 font-semibold underline underline-offset-2 transition-colors"
            >
              Browse Free Items ({stats?.freeItemsAvailable ?? stats?.catalogStatus?.currentlyAvailableListings ?? 2})
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#176B4D] to-[#4F8F70] dark:from-[#72D6A2] dark:to-[#176B4D] flex items-center justify-center text-white dark:text-[#0B110E] shadow-sm shadow-emerald-900/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-[var(--color-text)]">Campus</span>
                <span className="text-xl font-extrabold tracking-tight text-[#176B4D] dark:text-[#72D6A2]">Exchange</span>
              </div>
              <p className="text-[10px] font-bold tracking-wider uppercase text-[var(--color-text-muted)] -mt-1">
                Reuse. Save. Grow.
              </p>
            </div>
          </Link>

          {/* Nav Search Input (Desktop) */}
          <form onSubmit={handleNavSearch} className="hidden lg:flex items-center relative max-w-xs w-full ml-4 mr-2">
            <Search className="w-4 h-4 absolute left-3 text-[var(--color-text-muted)] pointer-events-none" />
            <input
              type="text"
              placeholder="Search textbooks, calculators..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--color-border)] focus:bg-white dark:focus:bg-[#19251E] focus:outline-hidden focus:ring-2 focus:ring-[#176B4D]/30 dark:focus:ring-[#72D6A2]/30 text-[var(--color-text)] placeholder-[var(--color-text-muted)] transition-all"
            />
          </form>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/')
                  ? 'bg-emerald-600/10 dark:bg-emerald-400/10 text-[#176B4D] dark:text-[#72D6A2]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              Home
            </Link>

            <Link
              to="/marketplace"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                isActive('/marketplace')
                  ? 'bg-emerald-600/10 dark:bg-emerald-400/10 text-[#176B4D] dark:text-[#72D6A2]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              Browse Items
            </Link>

            <Link
              to="/circular-swap"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/circular-swap')
                  ? 'bg-emerald-600/10 dark:bg-emerald-400/10 text-[#176B4D] dark:text-[#72D6A2]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#176B4D] dark:text-[#72D6A2]" />
              <span>Swap Finder</span>
            </Link>

            <Link
              to="/impact"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/impact')
                  ? 'bg-emerald-600/10 dark:bg-emerald-400/10 text-[#176B4D] dark:text-[#72D6A2]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Eco Impact</span>
            </Link>

            {user && (
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  isActive('/dashboard')
                    ? 'bg-emerald-600/10 dark:bg-emerald-400/10 text-[#176B4D] dark:text-[#72D6A2]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#176B4D] dark:text-[#72D6A2]" />
                <span>My Listings</span>
              </Link>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Theme Selector */}
            <ThemeSelector />

            {/* List an Item CTA */}
            <Link
              to="/create"
              className="inline-flex items-center gap-2 bg-[#176B4D] hover:bg-[#12563D] dark:bg-[#72D6A2] dark:hover:bg-[#8BE0B2] text-white dark:text-[#0B110E] text-sm font-bold px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all group"
            >
              <PlusCircle className="w-4 h-4 text-emerald-200 dark:text-[#0B110E] group-hover:rotate-90 transition-transform duration-300" />
              <span>List an Item</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[var(--color-border)]">
                {/* Notification Bell Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative"
                    title="In-App Notifications"
                    aria-label="View notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotifCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center animate-pulse shadow-xs">
                        {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown Panel */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-dropdown z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                      <div className="p-3.5 bg-[#176B4D] dark:bg-[#19251E] text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-emerald-200" />
                          <span className="text-xs font-bold uppercase tracking-wider">Campus Notifications</span>
                          {unreadNotifCount > 0 && (
                            <span className="bg-emerald-400 text-[#0B110E] text-[10px] font-black px-1.5 py-0.2 rounded-full">
                              {unreadNotifCount} new
                            </span>
                          )}
                        </div>
                        {unreadNotifCount > 0 && (
                          <button
                            onClick={async () => {
                              await markAllNotificationsAsRead();
                            }}
                            className="text-[11px] text-emerald-100 hover:text-white flex items-center gap-1 font-semibold underline underline-offset-2"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-[var(--color-border)]">
                        {notifications && notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={async () => {
                                if (!notif.read) {
                                  await markNotificationAsRead(notif.id);
                                }
                                setNotificationsOpen(false);
                              }}
                              className={`p-3.5 text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer flex items-start gap-3 ${
                                !notif.read ? 'bg-emerald-500/10' : ''
                              }`}
                            >
                              <div className="mt-0.5 shrink-0">
                                {notif.type?.includes('swap') ? (
                                  <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
                                    <Sparkles className="w-3.5 h-3.5" />
                                  </div>
                                ) : notif.type?.includes('completed') ? (
                                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                  </div>
                                ) : (
                                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-[#176B4D] dark:text-[#72D6A2] flex items-center justify-center">
                                    <Leaf className="w-3.5 h-3.5" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <p className="text-xs font-bold text-[var(--color-text)] truncate">{notif.title}</p>
                                  {!notif.read && (
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                  )}
                                </div>
                                <p className="text-[11px] text-[var(--color-text-muted)] line-clamp-2 mt-0.5 leading-snug">
                                  {notif.message}
                                </p>
                                <span className="text-[10px] text-[var(--color-text-muted)] opacity-70 mt-1 block">
                                  {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-8 text-center px-4 space-y-1">
                            <Leaf className="w-6 h-6 text-emerald-500 mx-auto" />
                            <p className="text-xs font-bold text-[var(--color-text)]">All caught up!</p>
                            <p className="text-[11px] text-[var(--color-text-muted)]">No active notifications for your listings or proposals.</p>
                          </div>
                        )}
                      </div>

                      <div className="p-2.5 bg-black/5 dark:bg-white/5 border-t border-[var(--color-border)] text-center">
                        <Link
                          to="/dashboard"
                          onClick={() => setNotificationsOpen(false)}
                          className="text-xs font-bold text-[#176B4D] dark:text-[#72D6A2] hover:underline inline-flex items-center gap-1"
                        >
                          <span>Open Exchange Dashboard & Requests</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
                  title="View Profile & Dashboard"
                >
                  <img
                    src={user.avatar || generateInitialsAvatar(user.name)}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#176B4D]/30 dark:border-[#72D6A2]/40"
                  />
                  <div className="hidden lg:block text-xs">
                    <div className="flex items-center gap-1 font-semibold text-[var(--color-text)] leading-none">
                      <span>{user.name.split(' ')[0]}</span>
                      {user.isCollegeVerified && (
                        <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" title="Verified Student" />
                      )}
                    </div>
                    <p className="text-[10px] text-[#176B4D] dark:text-[#72D6A2] font-semibold mt-0.5">{user.karmaScore || 100} Karma</p>
                  </div>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 text-[var(--color-text-muted)] hover:text-rose-600 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text)] hover:text-[#176B4D] dark:hover:text-[#72D6A2] px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu & Theme Controls */}
          <div className="flex items-center gap-1.5 md:hidden">
            <ThemeSelector />
            <Link
              to="/create"
              className="p-2 text-white bg-[#176B4D] dark:bg-[#72D6A2] dark:text-[#0B110E] rounded-xl"
              title="Post Listing"
              aria-label="Post a new listing"
            >
              <PlusCircle className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[var(--color-text)] hover:bg-black/5 dark:hover:bg-white/5 focus:outline-hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-[var(--color-border)] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          {/* Mobile Search */}
          <form onSubmit={(e) => { handleNavSearch(e); setMobileMenuOpen(false); }} className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--color-text-muted)] pointer-events-none" />
            <input
              type="text"
              placeholder="Search items on Campus Exchange..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-hidden"
            />
          </form>

          <div className="grid grid-cols-2 gap-2 pb-2">
            <Link
              to="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 text-center rounded-xl bg-black/5 dark:bg-white/5 text-[var(--color-text)] font-semibold text-sm"
            >
              Browse All
            </Link>
            <Link
              to="/marketplace?type=free"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 text-center rounded-xl bg-emerald-500/10 text-[#176B4D] dark:text-[#72D6A2] font-semibold text-sm"
            >
              Free Items 🎁
            </Link>
          </div>

          <nav className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-[var(--color-text)] hover:bg-black/5 dark:hover:bg-white/5"
            >
              🏠 Home
            </Link>
            <Link
              to="/marketplace?category=textbooks"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm text-[var(--color-text)] hover:bg-black/5 dark:hover:bg-white/5"
            >
              📚 Books & Textbooks
            </Link>
            <Link
              to="/marketplace?category=electronics"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm text-[var(--color-text)] hover:bg-black/5 dark:hover:bg-white/5"
            >
              💻 Calculators & Electronics
            </Link>
            <Link
              to="/marketplace?category=lab-gear"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm text-[var(--color-text)] hover:bg-black/5 dark:hover:bg-white/5"
            >
              🥼 Lab Supplies & Goggles
            </Link>
            <Link
              to="/marketplace?category=stationery"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm text-[var(--color-text)] hover:bg-black/5 dark:hover:bg-white/5"
            >
              📐 Stationery & Drafting
            </Link>
            <Link
              to="/circular-swap"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#176B4D] dark:text-[#72D6A2] hover:bg-emerald-500/10"
            >
              🔄 Circular Swap Finder (Loops)
            </Link>
            <Link
              to="/impact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10"
            >
              📊 Campus Sustainability & Leaderboard
            </Link>

            {user && (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold text-[var(--color-text)] hover:bg-black/5 dark:hover:bg-white/5"
              >
                <span className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-[#176B4D] dark:text-[#72D6A2]" />
                  My Listings & Requests
                </span>
                {unreadNotifCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                    {unreadNotifCount}
                  </span>
                )}
              </Link>
            )}
          </nav>

          <div className="pt-2 border-t border-[var(--color-border)] flex flex-col gap-2">
            <Link
              to="/create"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 px-4 bg-[#176B4D] dark:bg-[#72D6A2] text-white dark:text-[#0B110E] rounded-xl font-bold text-sm shadow-sm"
            >
              + List an Item Now
            </Link>

            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-center text-sm text-rose-600 font-semibold hover:bg-rose-500/10 rounded-xl transition-colors"
              >
                Sign Out ({user.name})
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 px-4 border border-[var(--color-border)] rounded-xl font-semibold text-sm text-[var(--color-text)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Sign In with Campus Account
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
