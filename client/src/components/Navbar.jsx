import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Leaf, 
  PlusCircle, 
  Search, 
  User, 
  Menu, 
  X, 
  Sparkles, 
  Bookmark, 
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

export default function Navbar() {
  const { 
    user, 
    logout, 
    savedItemIds, 
    stats,
    notifications,
    unreadNotifCount,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-sage-200/60 shadow-xs">
      {/* Top Sustainability Announcement Bar */}
      <div className="bg-forest-900 text-sage-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-forest-800 text-sage-300 border border-forest-700">
              🌱 Sustainability Hackathon Edition
            </span>
            <span className="hidden sm:inline text-sage-200">
              Together our campus has diverted <strong>{stats.totalCo2SavedKg.toLocaleString()} kg of CO₂</strong> this term!
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hidden md:flex items-center gap-1 text-sage-300">
              <ShieldCheck className="w-3.5 h-3.5 text-sage-400" />
              Verified .edu Student Exchanges Only
            </span>
            <Link to="/marketplace?type=free" className="text-sage-300 hover:text-white font-medium underline underline-offset-2">
              Browse {stats.freeItemsAvailable} Free Items
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-700 via-forest-800 to-forest-950 flex items-center justify-center text-white shadow-md shadow-forest-900/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-sage-300 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-forest-950">Campus</span>
                <span className="text-xl font-extrabold tracking-tight text-forest-600">Loop</span>
              </div>
              <p className="text-[10px] font-medium tracking-wider uppercase text-sage-600 -mt-1">
                Circular Campus Exchange
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/marketplace"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/marketplace')
                  ? 'bg-forest-50 text-forest-800 font-semibold'
                  : 'text-slate-600 hover:text-forest-800 hover:bg-forest-50/50'
              }`}
            >
              Marketplace
            </Link>

            <Link
              to="/circular-swap"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/circular-swap')
                  ? 'bg-forest-50 text-forest-800 font-semibold'
                  : 'text-slate-600 hover:text-forest-800 hover:bg-forest-50/50'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5 text-forest-600" />
              <span>Swap Finder</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Loop
              </span>
            </Link>

            <Link
              to="/impact"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/impact')
                  ? 'bg-forest-50 text-forest-800 font-semibold'
                  : 'text-slate-600 hover:text-forest-800 hover:bg-forest-50/50'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>Eco Impact</span>
            </Link>

            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/dashboard')
                  ? 'bg-forest-50 text-forest-800 font-semibold'
                  : 'text-slate-600 hover:text-forest-800 hover:bg-forest-50/50'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-forest-600" />
              <span>Dashboard</span>
            </Link>
          </nav>


          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/create"
              className="inline-flex items-center gap-2 bg-forest-800 hover:bg-forest-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all group"
            >
              <PlusCircle className="w-4 h-4 text-sage-300 group-hover:rotate-90 transition-transform duration-300" />
              <span>List an Item</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                {/* Notification Bell Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 text-slate-500 hover:text-forest-800 rounded-xl hover:bg-forest-50 transition-colors relative"
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
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-sage-200/90 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                      <div className="p-3.5 bg-forest-900 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-sage-300" />
                          <span className="text-xs font-bold uppercase tracking-wider">Campus Notifications</span>
                          {unreadNotifCount > 0 && (
                            <span className="bg-emerald-500 text-forest-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                              {unreadNotifCount} new
                            </span>
                          )}
                        </div>
                        {unreadNotifCount > 0 && (
                          <button
                            onClick={async () => {
                              await markAllNotificationsAsRead();
                            }}
                            className="text-[11px] text-sage-200 hover:text-white flex items-center gap-1 font-semibold underline underline-offset-2"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
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
                              className={`p-3.5 text-left hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 ${
                                !notif.read ? 'bg-forest-50/40' : ''
                              }`}
                            >
                              <div className="mt-0.5 shrink-0">
                                {notif.type?.includes('swap') ? (
                                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                                    <Sparkles className="w-3.5 h-3.5" />
                                  </div>
                                ) : notif.type?.includes('completed') ? (
                                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                  </div>
                                ) : (
                                  <div className="w-7 h-7 rounded-lg bg-sage-100 text-forest-800 flex items-center justify-center">
                                    <Leaf className="w-3.5 h-3.5" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <p className="text-xs font-bold text-slate-900 truncate">{notif.title}</p>
                                  {!notif.read && (
                                    <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                                  {notif.message}
                                </p>
                                <span className="text-[10px] text-slate-400 mt-1 block">
                                  {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-8 text-center px-4 space-y-1">
                            <Leaf className="w-6 h-6 text-emerald-500 mx-auto" />
                            <p className="text-xs font-bold text-slate-700">All caught up!</p>
                            <p className="text-[11px] text-slate-400">No active notifications for your listings or proposals.</p>
                          </div>
                        )}
                      </div>

                      <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                        <Link
                          to="/dashboard"
                          onClick={() => setNotificationsOpen(false)}
                          className="text-xs font-bold text-forest-700 hover:text-forest-900 inline-flex items-center gap-1"
                        >
                          <span>Open Eco Dashboard & Proposals</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-left"
                  title="View Profile & Dashboard"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-sage-300"
                  />
                  <div className="hidden lg:block text-xs">
                    <div className="flex items-center gap-1 font-semibold text-slate-800 leading-none">
                      <span>{user.name.split(' ')[0]}</span>
                      {user.isCollegeVerified && (
                        <ShieldCheck className="w-3 h-3 text-emerald-600" title="Verified Student" />
                      )}
                    </div>
                    <p className="text-[10px] text-forest-600 font-medium mt-0.5">{user.karmaScore} Karma</p>
                  </div>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-800 hover:text-forest-950 px-3 py-2 rounded-lg hover:bg-forest-50 transition-colors"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/create"
              className="p-2 text-forest-800 bg-forest-50 rounded-lg"
              title="Post Listing"
            >
              <PlusCircle className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <Link
              to="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 text-center rounded-xl bg-offwhite-100 text-slate-800 font-medium text-sm"
            >
              Browse All
            </Link>
            <Link
              to="/marketplace?type=free"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 text-center rounded-xl bg-forest-50 text-forest-800 font-medium text-sm"
            >
              Free Items
            </Link>
          </div>

          <nav className="space-y-1">
            <Link
              to="/marketplace?category=textbooks"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
            >
              📚 Textbooks & Study Materials
            </Link>
            <Link
              to="/marketplace?category=electronics"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
            >
              💻 Calculators & Electronics
            </Link>
            <Link
              to="/marketplace?category=lab-gear"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
            >
              🥼 Lab Coats & Goggles
            </Link>
            <Link
              to="/marketplace?category=stationery"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
            >
              📐 Stationery & Drafting
            </Link>
            <Link
              to="/circular-swap"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-forest-800 hover:bg-forest-50"
            >
              🔄 Circular Swap Finder (Loops)
            </Link>
            <Link
              to="/impact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
            >
              📊 Campus Sustainability & Leaderboard
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-forest-700 hover:bg-forest-50"
            >
              🌱 My Eco Impact Dashboard
            </Link>

            {user && (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
              >
                <span className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-forest-700" />
                  Notifications
                </span>
                {unreadNotifCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                    {unreadNotifCount}
                  </span>
                )}
              </Link>
            )}
          </nav>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/create"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 px-4 bg-forest-800 text-white rounded-xl font-medium text-sm"
            >
              + List an Item Now
            </Link>

            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-center text-sm text-rose-600 font-medium"
              >
                Sign Out ({user.name})
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 px-4 border border-slate-300 rounded-xl font-medium text-sm text-slate-700"
              >
                Sign In with Campus Email
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
