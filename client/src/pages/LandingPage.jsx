import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Recycle, 
  Coins, 
  TreePine, 
  BookOpen, 
  Cpu, 
  FlaskConical, 
  PenTool, 
  CheckCircle,
  Users,
  Compass,
  Gift,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ItemCard from '../components/ItemCard';

export default function LandingPage() {
  const { listings, stats } = useApp();
  const featuredListings = listings.slice(0, 4);

  const categoryCards = [
    {
      id: 'textbooks',
      name: 'Textbooks & Notes',
      icon: BookOpen,
      count: '42+ listed',
      co2: '7.5kg CO₂/bk',
      desc: 'Save hundreds on STEM & Humanities books from peers who aced the class.',
      color: 'from-forest-900 to-forest-800'
    },
    {
      id: 'electronics',
      name: 'Calculators & Tech',
      icon: Cpu,
      count: '28+ listed',
      co2: '28kg CO₂/calc',
      desc: 'TI-84s, Casios, chargers & peripherals without the bookstore markup.',
      color: 'from-emerald-900 to-forest-900'
    },
    {
      id: 'lab-gear',
      name: 'Lab Coats & Goggles',
      icon: FlaskConical,
      count: '19+ listed',
      co2: '12kg CO₂/kit',
      desc: 'Don’t buy a brand-new coat for one semester. Reuse sanitized gear.',
      color: 'from-sage-800 to-forest-900'
    },
    {
      id: 'stationery',
      name: 'Stationery & Drafting',
      icon: PenTool,
      count: '35+ listed',
      desc: 'Architectural rulers, fine art fineliners, engineering kits and sketchpads.',
      co2: '4.2kg CO₂/set',
      color: 'from-forest-850 to-sage-900'
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 bg-gradient-to-b from-forest-50/70 via-offwhite-100 to-transparent border-b border-sage-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Sustainability Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-100/80 border border-forest-300 text-forest-900 text-xs sm:text-sm font-semibold shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Campus Sustainability Hackathon 2026</span>
              <span className="text-forest-400">|</span>
              <span className="text-forest-700 font-bold">Zero-Waste Campus Mission</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              The Circular Campus <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-700 via-forest-600 to-emerald-600">
                Exchange & Reuse Hub
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Never let textbooks, lab coats, or graphing calculators gather dust. Buy, sell, trade, and giveaway course gear with verified classmates right here on campus.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link
                to="/marketplace"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-white bg-forest-800 hover:bg-forest-900 shadow-md hover:shadow-lg transition-all text-base"
              >
                <span>Browse Marketplace</span>
                <ArrowRight className="w-4 h-4 text-sage-300" />
              </Link>

              <Link
                to="/circular-swap"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 shadow-xs hover:shadow transition-all text-base"
              >
                <RefreshCw className="w-4 h-4 text-emerald-800 animate-spin-slow" />
                <span>Circular Swap Finder</span>
              </Link>

              <Link
                to="/create"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-forest-900 bg-white hover:bg-sage-50 border border-forest-200/80 shadow-xs hover:shadow transition-all text-base"
              >
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>List Item Free</span>
              </Link>
            </div>


            {/* Mini Trust Indicators */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Zero Platform Fees
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-forest-700" />
                Safe Library & Union Pickups
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Leaf className="w-4 h-4 text-sage-600" />
                Verified Carbon Tracking
              </span>
            </div>
          </div>
        </div>

        {/* Subtle Decorative Background Leaf SVG */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 opacity-10 pointer-events-none text-forest-800">
          <Leaf className="w-full h-full" />
        </div>
      </section>

      {/* Sustainability Impact Live Scoreboard */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-forest-800 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-forest-800">
            {/* Stat 1: CO2 Saved */}
            <div className="pt-4 md:pt-0 md:px-4 text-center md:text-left">
              <div className="inline-flex p-3 rounded-xl bg-forest-900 text-emerald-400 mb-3 border border-forest-800">
                <Leaf className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-300">
                {stats.totalCo2SavedKg.toLocaleString()} <span className="text-lg font-bold">kg</span>
              </div>
              <p className="text-xs uppercase tracking-wider text-sage-300 font-semibold mt-1">
                Carbon Emissions Diverted
              </p>
              <p className="text-xs text-slate-400 mt-1">From avoided manufacturing & transport</p>
            </div>

            {/* Stat 2: Student Dollars Saved */}
            <div className="pt-6 md:pt-0 md:px-6 text-center md:text-left">
              <div className="inline-flex p-3 rounded-xl bg-forest-900 text-amber-400 mb-3 border border-forest-800">
                <Coins className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-300">
                ${stats.totalDollarsSaved.toLocaleString()}
              </div>
              <p className="text-xs uppercase tracking-wider text-sage-300 font-semibold mt-1">
                Student Money Saved
              </p>
              <p className="text-xs text-slate-400 mt-1">Compared to bookstore retail list prices</p>
            </div>

            {/* Stat 3: Mature Tree Equivalent */}
            <div className="pt-6 md:pt-0 md:px-6 text-center md:text-left">
              <div className="inline-flex p-3 rounded-xl bg-forest-900 text-sage-300 mb-3 border border-forest-800">
                <TreePine className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-sage-200">
                {stats.treesEquivalent}+
              </div>
              <p className="text-xs uppercase tracking-wider text-sage-300 font-semibold mt-1">
                Tree Absorption Equivalent
              </p>
              <p className="text-xs text-slate-400 mt-1">Annual CO₂ absorption workload spared</p>
            </div>

            {/* Stat 4: Circular Items */}
            <div className="pt-6 md:pt-0 md:px-6 text-center md:text-left">
              <div className="inline-flex p-3 rounded-xl bg-forest-900 text-emerald-400 mb-3 border border-forest-800">
                <Recycle className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">
                {stats.totalListings * 14 + 180}
              </div>
              <p className="text-xs uppercase tracking-wider text-sage-300 font-semibold mt-1">
                Items Recirculated
              </p>
              <p className="text-xs text-slate-400 mt-1">Textbooks, tools & essentials reused</p>
            </div>
          </div>

          {/* Link to Full Impact Dashboard */}
          <div className="mt-8 pt-6 border-t border-forest-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <span className="text-sage-300">
              🌱 Environmental metrics and student savings are calculated from verified completed reuse data.
            </span>
            <Link
              to="/impact"
              className="inline-flex items-center gap-1.5 font-bold text-sage-300 hover:text-white transition underline underline-offset-4"
            >
              <span>View Full Sustainability Dashboard & Leaderboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>


      {/* Category Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-forest-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Campus Reuse Categories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Essential Student Equipment
            </h2>
          </div>
          <Link
            to="/marketplace"
            className="text-forest-700 hover:text-forest-900 text-sm font-bold inline-flex items-center gap-1 group mt-2 md:mt-0"
          >
            Explore all categories
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryCards.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={`/marketplace?category=${cat.id}`}
                className="group bg-white rounded-2xl p-6 border border-sage-200/70 hover:border-forest-400 shadow-xs hover:shadow-eco transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-800 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-forest-700 bg-forest-50 px-2.5 py-1 rounded-full border border-forest-200">
                      {cat.co2}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-forest-800 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-forest-700">
                  <span>{cat.count}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Items Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-forest-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>Available for Pickup</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured Campus Listings
            </h2>
          </div>
          <Link
            to="/marketplace"
            className="text-forest-700 hover:text-forest-900 text-sm font-bold inline-flex items-center gap-1 group mt-2 sm:mt-0"
          >
            View all {listings.length} items
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredListings.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* How CampusLoop Works */}
      <section className="bg-white border-y border-sage-200/60 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
              Simple & Safe Exchange
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
              How Circular Reuse Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Three simple steps to keep materials circulating within our campus community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-offwhite-100 rounded-2xl p-6 border border-sage-200/60 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-forest-800 text-white font-black text-lg flex items-center justify-center mx-auto shadow-md">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-lg">List in 30 Seconds</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Snap a photo of your textbook, calculator, or lab goggles. Our automated tool calculates your estimated CO₂ diversion instantly.
              </p>
            </div>

            <div className="bg-offwhite-100 rounded-2xl p-6 border border-sage-200/60 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-forest-800 text-white font-black text-lg flex items-center justify-center mx-auto shadow-md">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Safe Campus Pickup</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chat with verified students. Meet in well-lit designated campus zones like the Library, Student Union, or Science Atrium.
              </p>
            </div>

            <div className="bg-offwhite-100 rounded-2xl p-6 border border-sage-200/60 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-forest-800 text-white font-black text-lg flex items-center justify-center mx-auto shadow-md">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Earn Eco-Karma</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Save money, divert materials from local landfills, and climb your department’s sustainability leaderboard!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-forest-950 rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-2xl border border-forest-700">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-forest-800 text-sage-200 border border-forest-600">
              <Sparkles className="w-3.5 h-3.5 text-sage-300" />
              Join 640+ Campus Students
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready to give your course gear a second life?
            </h2>
            <p className="text-sm text-sage-200 leading-relaxed">
              Every item you exchange spares unnecessary raw materials and puts money right back into fellow students' pockets.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/create"
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-white text-forest-950 font-bold hover:bg-sage-100 transition-colors shadow-lg"
              >
                + Post Your First Listing
              </Link>
              <Link
                to="/marketplace"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-forest-800/80 hover:bg-forest-800 text-white border border-forest-600 font-semibold transition-colors"
              >
                Browse All Items
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
