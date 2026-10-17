import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Recycle, 
  BookOpen, 
  Cpu, 
  FlaskConical, 
  PenTool, 
  CheckCircle,
  Home,
  Clock,
  PlusCircle,
  RefreshCw,
  Search,
  Calculator,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ItemCard from '../components/ItemCard';

export default function LandingPage() {
  const { listings, stats, loading } = useApp();
  const [activeTab, setActiveTab] = useState('featured'); // 'featured' | 'recent'

  // Categories specified by Master Prompt:
  // 1. Books & Textbooks
  // 2. Calculators
  // 3. Lab Supplies
  // 4. Electronics
  // 5. Stationery
  // 6. Other Essentials
  const categoryTiles = [
    {
      id: 'textbooks',
      name: 'Books & Textbooks',
      query: '/marketplace?category=textbooks',
      icon: BookOpen,
      count: '42+ listed',
      tag: 'STEM & Humanities',
      desc: 'Calculus, Organic Chem, Biology, & study guides from students who aced the course.'
    },
    {
      id: 'calculators',
      name: 'Calculators',
      query: '/marketplace?category=electronics&q=calculator',
      icon: Calculator,
      count: '18+ listed',
      tag: 'TI-84 & Casio',
      desc: 'Graphing and scientific calculators ready for calculus, stats, and engineering labs.'
    },
    {
      id: 'lab-gear',
      name: 'Lab Supplies',
      query: '/marketplace?category=lab-gear',
      icon: FlaskConical,
      count: '19+ listed',
      tag: 'PPE & Kits',
      desc: '100% cotton lab coats, splash goggles, molecular model sets, and dissection tools.'
    },
    {
      id: 'electronics',
      name: 'Electronics',
      query: '/marketplace?category=electronics',
      icon: Cpu,
      count: '28+ listed',
      tag: 'Tech & Chargers',
      desc: 'Monitors, USB-C hubs, mechanical keyboards, chargers, and drawing tablets.'
    },
    {
      id: 'stationery',
      name: 'Stationery',
      query: '/marketplace?category=stationery',
      icon: PenTool,
      count: '35+ listed',
      tag: 'Drafting & Art',
      desc: 'T-squares, architectural scales, engineering pads, Prismacolor markers, and notebooks.'
    },
    {
      id: 'dorm',
      name: 'Other Essentials',
      query: '/marketplace?category=dorm',
      icon: Home,
      count: '24+ listed',
      tag: 'Campus Life',
      desc: 'Desk lamps, mini appliances, backpacks, storage bins, and dorm accessories.'
    }
  ];

  // Available real listings from backend
  const availableListings = listings.filter((l) => (l.status || 'available') === 'available');
  const featuredListings = availableListings.slice(0, 4);
  const recentListings = [...listings].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 4);
  const displayListings = activeTab === 'featured' ? (featuredListings.length > 0 ? featuredListings : listings.slice(0, 4)) : recentListings;

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-[var(--color-border)] bg-ambient-sage transition-colors">
        {/* Floating decorative glass shapes */}
        <div className="absolute top-12 left-10 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-8 right-10 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Text & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Brand Tagline Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#176B4D] dark:text-[#72D6A2] text-xs font-bold tracking-wide">
                <span className="flex h-2 w-2 rounded-full bg-[#176B4D] dark:bg-[#72D6A2] animate-pulse" />
                <span>Campus Exchange</span>
                <span className="opacity-40">•</span>
                <span className="uppercase tracking-wider">Reuse. Save. Grow.</span>
              </div>

              {/* Exact Master Prompt Headline */}
              <h1 className="fluid-hero-headline font-extrabold text-[var(--color-text)] tracking-tight">
                Give pre-loved items a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#176B4D] via-[#4F8F70] to-[#72D6A2]">second life.</span>
              </h1>

              {/* Exact Master Prompt Supporting Text */}
              <p className="text-base sm:text-lg text-[var(--color-text-muted)] leading-relaxed max-w-xl">
                Discover affordable student essentials, exchange what you no longer need, and make campus life more sustainable.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  to="/marketplace"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white bg-[#176B4D] hover:bg-[#12563D] dark:bg-[#72D6A2] dark:hover:bg-[#8BE0B2] dark:text-[#0B110E] shadow-sm hover:shadow-md transition-all text-base"
                >
                  <span>Browse Items</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/create"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-[var(--color-text)] glass-panel hover:bg-black/5 dark:hover:bg-white/5 border border-[var(--color-border)] transition-all text-base"
                >
                  <PlusCircle className="w-4 h-4 text-[#176B4D] dark:text-[#72D6A2]" />
                  <span>List an Item</span>
                </Link>

                <Link
                  to="/circular-swap"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all text-sm"
                >
                  <RefreshCw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Swap Finder</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[var(--color-text-muted)]">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle className="w-4 h-4 text-[#176B4D] dark:text-[#72D6A2]" />
                  Zero Platform Fees
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#176B4D] dark:text-[#72D6A2]" />
                  Safe Campus Safe-Zone Pickups
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Leaf className="w-4 h-4 text-[#176B4D] dark:text-[#72D6A2]" />
                  Verified Reuse & Carbon Tracking
                </span>
              </div>
            </div>

            {/* Right Column: Visual Collage of Student Essentials */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Essentials Glass Card Showcase */}
                <div className="glass-card p-4 sm:p-5 relative z-10 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-xs font-bold text-[var(--color-text)]">Live Campus Marketplace</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#176B4D] dark:text-[#72D6A2] bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Verified .edu Only
                    </span>
                  </div>

                  {/* Collage Grid of Essentials */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Item 1: Textbook */}
                    <div className="group/item relative rounded-xl overflow-hidden aspect-square bg-slate-100 dark:bg-slate-800">
                      <img 
                        src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80" 
                        alt="Campbell Biology Textbook"
                        className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2.5 flex flex-col justify-end text-white">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Textbook</span>
                        <p className="text-xs font-bold leading-tight line-clamp-1">Campbell Biology 12th Ed.</p>
                        <span className="text-[11px] font-extrabold text-white mt-0.5">$38 <span className="line-through text-slate-400 font-normal">$165</span></span>
                      </div>
                    </div>

                    {/* Item 2: Calculator */}
                    <div className="group/item relative rounded-xl overflow-hidden aspect-square bg-slate-100 dark:bg-slate-800">
                      <img 
                        src="https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80" 
                        alt="TI-84 Plus CE Graphing Calculator"
                        className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2.5 flex flex-col justify-end text-white">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Calculator</span>
                        <p className="text-xs font-bold leading-tight line-clamp-1">TI-84 Plus CE Color</p>
                        <span className="text-[11px] font-extrabold text-white mt-0.5">$55 <span className="line-through text-slate-400 font-normal">$140</span></span>
                      </div>
                    </div>

                    {/* Item 3: Lab Coat & Goggles */}
                    <div className="group/item relative rounded-xl overflow-hidden aspect-square bg-slate-100 dark:bg-slate-800">
                      <img 
                        src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=600&q=80" 
                        alt="Chemistry Lab Coat + Goggles"
                        className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2.5 flex flex-col justify-end text-white">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Lab Gear</span>
                        <p className="text-xs font-bold leading-tight line-clamp-1">Cotton Coat + Splash Kit</p>
                        <span className="text-[11px] font-extrabold text-emerald-400 mt-0.5">Free Give Away 🎁</span>
                      </div>
                    </div>

                    {/* Item 4: Stationery & Drafting */}
                    <div className="group/item relative rounded-xl overflow-hidden aspect-square bg-slate-100 dark:bg-slate-800">
                      <img 
                        src="https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=600&q=80" 
                        alt="Staedtler Engineering Drafting Kit"
                        className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2.5 flex flex-col justify-end text-white">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Stationery</span>
                        <p className="text-xs font-bold leading-tight line-clamp-1">Drafting & Compass Set</p>
                        <span className="text-[11px] font-extrabold text-indigo-300 mt-0.5">Open for Swap 🔄</span>
                      </div>
                    </div>
                  </div>

                  {/* Floating Eco Badge */}
                  <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--color-border)] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-[var(--color-text)] font-semibold">Average Savings Per Student:</span>
                    </div>
                    <span className="font-extrabold text-[#176B4D] dark:text-[#72D6A2]">$120 / semester</span>
                  </div>
                </div>

                {/* Ambient Decorative Behind Shape */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-3xl bg-gradient-to-br from-[#176B4D] to-[#4F8F70] opacity-20 blur-xl pointer-events-none" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Category Section (6 exact prompt categories) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#176B4D] dark:text-[#72D6A2] mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Campus Essentials</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] tracking-tight">
              Browse by Category
            </h2>
          </div>
          <Link
            to="/marketplace"
            className="text-xs sm:text-sm font-bold text-[#176B4D] dark:text-[#72D6A2] hover:underline inline-flex items-center gap-1 group"
          >
            <span>Explore all categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {categoryTiles.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={cat.query}
                className="group glass-card p-4 rounded-2xl flex flex-col justify-between hover:border-[#176B4D]/40 dark:hover:border-[#72D6A2]/40 transition-all text-left"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-[#176B4D] dark:text-[#72D6A2] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[var(--color-text)] group-hover:text-[#176B4D] dark:group-hover:text-[#72D6A2] transition-colors leading-tight">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] font-semibold text-[var(--color-text-muted)] block mt-0.5">
                    {cat.tag}
                  </span>
                </div>

                <div className="mt-4 pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-[11px]">
                  <span className="text-[var(--color-text-muted)] font-medium">{cat.count}</span>
                  <ArrowRight className="w-3 h-3 text-[#176B4D] dark:text-[#72D6A2] group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured & Recent Listings Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#176B4D] dark:text-[#72D6A2] block mb-1">
              Verified Campus Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] tracking-tight">
              Available on Campus Now
            </h2>
          </div>

          {/* Toggle Tabs: Featured vs Recently Added */}
          <div className="flex items-center p-1 rounded-xl glass-panel self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'featured'
                  ? 'bg-[#176B4D] dark:bg-[#72D6A2] text-white dark:text-[#0B110E] shadow-xs'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              Featured Items
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'recent'
                  ? 'bg-[#176B4D] dark:bg-[#72D6A2] text-white dark:text-[#0B110E] shadow-xs'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              Recently Added
            </button>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="glass-card rounded-2xl h-80 animate-pulse bg-black/5 dark:bg-white/5" />
            ))}
          </div>
        ) : displayListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayListings.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center rounded-2xl max-w-lg mx-auto space-y-3">
            <BookOpen className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-[var(--color-text)]">No items currently displayed</h3>
            <p className="text-xs text-[var(--color-text-muted)]">Be the first student to post an item for exchange or sale!</p>
            <Link
              to="/create"
              className="inline-block px-5 py-2.5 rounded-xl font-bold text-white bg-[#176B4D] dark:bg-[#72D6A2] dark:text-[#0B110E] text-xs"
            >
              List an Item Now
            </Link>
          </div>
        )}

        <div className="text-center pt-8">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-[var(--color-text)] glass-panel hover:bg-black/5 dark:hover:bg-white/5 border border-[var(--color-border)] shadow-xs transition-all"
          >
            <span>View All Campus Marketplace Items</span>
            <ArrowRight className="w-4 h-4 text-[#176B4D] dark:text-[#72D6A2]" />
          </Link>
        </div>
      </section>

      {/* How It Works (Exact 3 Steps from Prompt) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl relative overflow-hidden border border-[var(--color-border)]">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#176B4D] dark:text-[#72D6A2]">
              Simple & Convenient
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] tracking-tight">
              How Campus Exchange Works
            </h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              Three seamless steps to get what you need and give gear a second life on campus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {/* Step 1 */}
            <div className="glass-card p-6 rounded-2xl flex flex-col justify-between text-left space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-[#176B4D] dark:text-[#72D6A2] flex items-center justify-center font-extrabold text-lg">
                1
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-[var(--color-text)]">
                  Discover what you need
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  Search textbooks, graphing calculators, lab equipment, and stationery listed directly by classmates in your courses.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-semibold text-[#176B4D] dark:text-[#72D6A2] flex items-center gap-1">
                <Search className="w-3.5 h-3.5" />
                <span>Instant campus search</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-card p-6 rounded-2xl flex flex-col justify-between text-left space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-[#176B4D] dark:text-[#72D6A2] flex items-center justify-center font-extrabold text-lg">
                2
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-[var(--color-text)]">
                  Connect with another student
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  Submit a swap request with an item of your own, claim a free donation, or send an inquiry to arrange an in-person meetup.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-semibold text-[#176B4D] dark:text-[#72D6A2] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Designated Safe Meeting Zones</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-card p-6 rounded-2xl flex flex-col justify-between text-left space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-[#176B4D] dark:text-[#72D6A2] flex items-center justify-center font-extrabold text-lg">
                3
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-[var(--color-text)]">
                  Reuse, exchange, and save
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  Complete the handover at the campus library or student center. Save money, reduce waste, and build your Eco-Karma score.
                </p>
              </div>
              <div className="pt-2 text-[11px] font-semibold text-[#176B4D] dark:text-[#72D6A2] flex items-center gap-1">
                <Recycle className="w-3.5 h-3.5" />
                <span>Zero waste, maximum savings</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Message (Grounded, Authentic, No Fake Stats) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 sm:p-12 rounded-3xl border border-[var(--color-border)] relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-[#176B4D] dark:text-[#72D6A2] text-xs font-bold">
                <Leaf className="w-3.5 h-3.5" />
                <span>Sustainable Campus Action</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] tracking-tight">
                Why collegiate reuse matters
              </h2>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                Every semester, thousands of dollars worth of functional textbooks, calculators, and lab gear end up discarded or forgotten in dorm drawers. By establishing a direct, hyper-local exchange on campus, students save significantly on rising semester costs while preventing unnecessary manufacturing emissions and electronic waste.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-[var(--color-text)]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Lower textbook & tech costs
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  No packaging or delivery emissions
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Support classmates in the same courses
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <Link
                to="/impact"
                className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--color-border)] text-left hover:border-[#176B4D]/50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#176B4D] dark:text-[#72D6A2] uppercase tracking-wider">Eco Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-sm font-bold text-[var(--color-text)] mt-1">Explore Campus Impact & Leaderboard</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Track real completed exchanges and CO₂ diverted.</p>
              </Link>

              <Link
                to="/circular-swap"
                className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-left hover:bg-emerald-500/20 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Swap Finder</span>
                  <RefreshCw className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:rotate-180 transition-transform duration-500" />
                </div>
                <p className="text-sm font-bold text-[var(--color-text)] mt-1">Circular Multi-Party Cycles</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Discover 2-way and 3-way triangular student swaps.</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
