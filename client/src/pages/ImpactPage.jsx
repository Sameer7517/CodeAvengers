import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Leaf,
  DollarSign,
  Droplets,
  TreePine,
  Award,
  ShieldCheck,
  CheckCircle2,
  Info,
  Layers,
  ArrowRight,
  TrendingUp,
  Sparkles,
  BookOpen,
  Cpu,
  FlaskConical,
  Compass,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ImpactPage = () => {
  const { fetchImpactStats, fetchLeaderboard } = useApp();
  const [impactData, setImpactData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState('all'); // 'all' | 'verified'

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [stats, leaders] = await Promise.all([
        fetchImpactStats(),
        fetchLeaderboard(15)
      ]);
      setImpactData(stats);
      setLeaderboard(leaders || []);
    } catch (err) {
      setError(err.message || 'Could not load sustainability impact statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const completed = impactData?.completedMetrics || {
    totalReusedItems: 0,
    completedExchanges: 0,
    completedDonations: 0,
    completedSwaps: 0,
    completedSales: 0,
    verifiedCo2SavedKg: 0,
    actualDollarsSaved: 0,
    waterPreservedGallons: 0,
    treesEquivalent: 0
  };

  const assumptions = impactData?.environmentalAssumptions || {};
  const catalogStatus = impactData?.catalogStatus || {};

  const filteredLeaderboard = activeLeaderboardTab === 'verified'
    ? leaderboard.filter(u => u.isCollegeVerified)
    : leaderboard;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Hero & Title Section */}
        <div className="bg-gradient-to-br from-forest-900 via-forest-800 to-forest-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-forest-700/60">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-sage-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage-500/20 border border-sage-400/30 text-sage-300 text-xs font-semibold tracking-wide uppercase">
              <Leaf className="w-3.5 h-3.5 text-sage-400" />
              Verified Campus Circularity
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight leading-tight">
              Collegiate Sustainability & Circular Reuse Impact
            </h1>
            <p className="text-sage-200 text-base sm:text-lg leading-relaxed">
              Transparent environmental metrics calculated exclusively from verified, completed campus exchanges.
              Listings in the marketplace represent active student intent and are strictly excluded from completed reuse totals.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/circular-swap"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sage-500 text-forest-950 font-semibold hover:bg-sage-400 transition-all shadow-md hover:shadow-lg text-sm"
              >
                <RefreshCw className="w-4 h-4 text-forest-950 animate-spin-slow" />
                Find Circular Swap Loops
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 text-white font-medium hover:bg-white/15 transition-all border border-white/20 text-sm backdrop-blur-sm"
              >
                Browse Available Items
              </Link>
            </div>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="py-20 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-forest-700 font-medium">Aggregating verified campus reuse records...</p>
          </div>
        )}

        {error && (
          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Unable to load impact data</h3>
              <p className="text-sm text-amber-800">{error}</p>
              <button
                onClick={loadData}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Primary Completed Metrics KPI Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-forest-950 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Actual Completed Reuse Metrics
                  </h2>
                  <p className="text-sm text-forest-700">
                    Counts only finalized peer-to-peer handovers and confirmed recirculations.
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-forest-600 bg-white px-3 py-1.5 rounded-full border border-sand-200 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Verified Data
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* 1. Actual Reused Items */}
                <div className="bg-white rounded-2xl p-6 border border-sand-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-3">
                      <Layers className="w-5 h-5" />
                    </div>
                    <span className="text-xs uppercase font-bold tracking-wider text-forest-600">Reused Items</span>
                    <div className="text-3xl font-bold font-serif text-forest-950 mt-1">
                      {completed.totalReusedItems}
                    </div>
                    <p className="text-xs text-forest-600 mt-2">
                      {completed.completedDonations} donated · {completed.completedSwaps} swapped · {completed.completedSales} resold
                    </p>
                  </div>
                </div>

                {/* 2. CO2 Avoided */}
                <div className="bg-white rounded-2xl p-6 border border-sand-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-sage-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center text-sage-700 mb-3">
                      <Leaf className="w-5 h-5" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-bold tracking-wider text-forest-600">CO₂ Avoided</span>
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        Estimate
                      </span>
                    </div>
                    <div className="text-3xl font-bold font-serif text-forest-950 mt-1">
                      {completed.verifiedCo2SavedKg} <span className="text-lg font-sans font-normal text-forest-600">kg</span>
                    </div>
                    <p className="text-xs text-forest-600 mt-2">
                      Equivalent to {completed.treesEquivalent} tree-years of carbon absorption
                    </p>
                  </div>
                </div>

                {/* 3. Estimated Dollars Saved */}
                <div className="bg-white rounded-2xl p-6 border border-sand-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 mb-3">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-bold tracking-wider text-forest-600">Student Savings</span>
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        Stored Catalog
                      </span>
                    </div>
                    <div className="text-3xl font-bold font-serif text-forest-950 mt-1">
                      ₹{completed.actualDollarsSaved?.toLocaleString('en-IN') || 0}
                    </div>
                    <p className="text-xs text-forest-600 mt-2">
                      Supported strictly by recorded retail replacement price data
                    </p>
                  </div>
                </div>

                {/* 4. Water Preserved */}
                <div className="bg-white rounded-2xl p-6 border border-sand-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 mb-3">
                      <Droplets className="w-5 h-5" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-bold tracking-wider text-forest-600">Water Preserved</span>
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        Estimate
                      </span>
                    </div>
                    <div className="text-3xl font-bold font-serif text-forest-950 mt-1">
                      {completed.waterPreservedGallons} <span className="text-lg font-sans font-normal text-forest-600">gal</span>
                    </div>
                    <p className="text-xs text-forest-600 mt-2">
                      Industrial process water avoided via extended product life cycles
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Catalog Segregation Notice Card */}
            <div className="bg-white rounded-2xl p-6 border border-sand-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-forest-950">Active Catalog vs. Completed Reuse Transparency</h4>
                  <p className="text-xs text-forest-700 max-w-2xl mt-0.5">
                    Currently, <strong className="text-forest-900">{catalogStatus.currentlyAvailableListings || 0} listings</strong> are active in the campus marketplace and <strong className="text-forest-900">{catalogStatus.currentlyReservedListings || 0} items</strong> are pending pickup. Per sustainability accounting standards, active and pending items are strictly segregated from completed impact.
                  </p>
                </div>
              </div>
              <Link
                to="/marketplace"
                className="text-xs font-semibold text-forest-800 hover:text-forest-950 flex items-center gap-1.5 whitespace-nowrap bg-sand-100 hover:bg-sand-200 px-4 py-2 rounded-xl transition"
              >
                View Active Marketplace
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Documented Environmental Assumptions Card */}
            <div className="bg-white rounded-3xl p-8 border border-sand-200 shadow-sm space-y-6">
              <div className="border-b border-sand-200 pb-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-2 border border-amber-200">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Documentation & Methodology Notice
                </div>
                <h3 className="text-2xl font-bold font-serif text-forest-950">
                  Documented Assumptions for Environmental Estimates
                </h3>
                <p className="text-sm text-forest-700 mt-1 max-w-3xl">
                  {assumptions.notice || 'Environmental metrics and dollar savings are estimates derived from completed collegiate reuse transactions and stored catalog data. Available listings and pending proposals are strictly excluded from completed reuse totals.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Textbook Benchmark */}
                <div className="p-4 rounded-xl bg-sand-50/80 border border-sand-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-forest-950 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-forest-700" />
                      Textbooks
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      7.5 kg CO₂
                    </span>
                  </div>
                  <p className="text-xs text-forest-700 leading-relaxed">
                    {assumptions.benchmarks?.textbook?.basis || 'Paper pulp harvesting, chemical milling, offset printing, binding, and university supply-chain freight.'}
                  </p>
                </div>

                {/* Electronics Benchmark */}
                <div className="p-4 rounded-xl bg-sand-50/80 border border-sand-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-forest-950 flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-forest-700" />
                      Electronics
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      18.5 kg CO₂
                    </span>
                  </div>
                  <p className="text-xs text-forest-700 leading-relaxed">
                    {assumptions.benchmarks?.electronics?.basis || 'Semiconductor silicon wafer fabrication, battery cell production, surface mount assembly, and e-waste mitigation.'}
                  </p>
                </div>

                {/* Lab Gear Benchmark */}
                <div className="p-4 rounded-xl bg-sand-50/80 border border-sand-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-forest-950 flex items-center gap-1.5">
                      <FlaskConical className="w-4 h-4 text-forest-700" />
                      Lab Gear
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      4.2 kg CO₂
                    </span>
                  </div>
                  <p className="text-xs text-forest-700 leading-relaxed">
                    {assumptions.benchmarks?.labGear?.basis || 'Bleached cotton/poly synthetic fiber spinning, sterile barrier packaging, and chemical splash gear molding.'}
                  </p>
                </div>

                {/* Stationery Benchmark */}
                <div className="p-4 rounded-xl bg-sand-50/80 border border-sand-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-forest-950 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-forest-700" />
                      Stationery
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      2.8 kg CO₂
                    </span>
                  </div>
                  <p className="text-xs text-forest-700 leading-relaxed">
                    {assumptions.benchmarks?.stationery?.basis || 'Aluminum extrusion for drafting compasses/rulers, polymer injection molding, and freight packaging.'}
                  </p>
                </div>
              </div>

              {/* Dollar Savings Methodology */}
              <div className="p-4 rounded-xl bg-forest-50/60 border border-forest-100 text-xs text-forest-800 flex items-start gap-3">
                <DollarSign className="w-4 h-4 text-forest-700 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-forest-950">Financial Savings Methodology: </strong>
                  {assumptions.dollarSavingsMethodology || 'Calculated strictly when supported by stored catalog data: For completed free giveaways, 100% of the verified replacement retail price is credited. For completed swaps, peer retail replacement values are credited. For sell listings, the difference between original retail and student price is credited.'}
                </div>
              </div>
            </div>

            {/* Campus Reuse Leaderboard */}
            <div className="bg-white rounded-3xl p-8 border border-sand-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-200 pb-5">
                <div>
                  <h3 className="text-2xl font-bold font-serif text-forest-950 flex items-center gap-2">
                    <Award className="w-6 h-6 text-amber-500" />
                    Student Circularity Leaderboard
                  </h3>
                  <p className="text-sm text-forest-700 mt-0.5">
                    Top student contributors ranked by verified recirculations and Eco-Karma score.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-sand-100 p-1 rounded-xl self-start sm:self-auto">
                  <button
                    onClick={() => setActiveLeaderboardTab('all')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                      activeLeaderboardTab === 'all'
                        ? 'bg-white text-forest-950 shadow-sm'
                        : 'text-forest-700 hover:text-forest-950'
                    }`}
                  >
                    All Recyclers ({leaderboard.length})
                  </button>
                  <button
                    onClick={() => setActiveLeaderboardTab('verified')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                      activeLeaderboardTab === 'verified'
                        ? 'bg-white text-forest-950 shadow-sm'
                        : 'text-forest-700 hover:text-forest-950'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
                    Verified Students Only
                  </button>
                </div>
              </div>

              {/* Leaderboard Table / Cards */}
              {filteredLeaderboard.length === 0 ? (
                <div className="text-center py-12 text-forest-600 space-y-2">
                  <Award className="w-10 h-10 text-forest-400 mx-auto" />
                  <p className="font-medium">No verified recyclers in this filter yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-sand-200 text-xs font-bold text-forest-600 uppercase tracking-wider">
                        <th className="py-3 px-3">Rank</th>
                        <th className="py-3 px-3">Student</th>
                        <th className="py-3 px-3">Department & Campus</th>
                        <th className="py-3 px-3 text-center">Items Reused</th>
                        <th className="py-3 px-3 text-center">CO₂ Diverted</th>
                        <th className="py-3 px-3 text-right">Eco-Karma</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sand-100">
                      {filteredLeaderboard.map((student, idx) => {
                        const isTopThree = idx < 3;
                        const rankBadges = ['bg-amber-400 text-amber-950', 'bg-slate-300 text-slate-800', 'bg-amber-600 text-white'];

                        return (
                          <tr key={student.id || idx} className="hover:bg-sand-50/70 transition-colors">
                            <td className="py-4 px-3">
                              {isTopThree ? (
                                <span className={`w-7 h-7 rounded-full inline-flex items-center justify-center font-bold text-xs shadow-sm ${rankBadges[idx]}`}>
                                  {student.rank || idx + 1}
                                </span>
                              ) : (
                                <span className="font-semibold text-forest-600 text-sm ml-2">
                                  {student.rank || idx + 1}
                                </span>
                              )}
                            </td>

                            <td className="py-4 px-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={student.avatar}
                                  alt={student.name}
                                  className="w-10 h-10 rounded-full object-cover border border-sand-200 flex-shrink-0"
                                />
                                <div>
                                  <div className="font-semibold text-forest-950 flex items-center gap-1.5">
                                    {student.name}
                                    {student.isCollegeVerified && (
                                      <span title="College Verified Student">
                                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-forest-600">
                                    {student.year || 'Student'}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-3">
                              <div className="font-medium text-forest-900">{student.department}</div>
                              <div className="text-xs text-forest-600">{student.campus}</div>
                            </td>

                            <td className="py-4 px-3 text-center">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-100">
                                {student.itemsReused || 0} items
                              </span>
                            </td>

                            <td className="py-4 px-3 text-center">
                              <span className="text-sm font-semibold text-forest-900">
                                {student.co2DivertedKg || 0} kg
                              </span>
                            </td>

                            <td className="py-4 px-3 text-right">
                              <div className="font-bold text-forest-950 flex items-center justify-end gap-1">
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                {student.karmaScore || 100}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default ImpactPage;
