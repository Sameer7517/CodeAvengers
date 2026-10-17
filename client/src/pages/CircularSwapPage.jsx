import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Leaf,
  DollarSign,
  ChevronRight,
  Filter,
  Users,
  Layers,
  ArrowDownRight,
  Send,
  ThumbsUp,
  ThumbsDown,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CircularSwapPage = () => {
  const {
    user,
    token,
    fetchCircularSuggestions,
    fetchUserProposals,
    proposeCircularCycle,
    respondToCircularProposal,
    categories
  } = useApp();

  const [activeTab, setActiveTab] = useState('suggestions'); // 'suggestions' | 'proposals'
  const [cycles, setCycles] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all'); // 'all' | '2-way' | '3-way'
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [declineModalProposalId, setDeclineModalProposalId] = useState(null);
  const [declineReason, setDeclineReason] = useState('');

  // Load cycle suggestions and active proposals
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [suggestionsData, userProposals] = await Promise.all([
        fetchCircularSuggestions({ category: selectedCategory }),
        token ? fetchUserProposals() : Promise.resolve([])
      ]);
      setCycles(suggestionsData.cycles || []);
      setProposals(userProposals || []);
    } catch (err) {
      setError(err.message || 'Could not load circular swap suggestions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, token]);

  // Handle Initiating a Proposal
  const handlePropose = async (cycle) => {
    if (!token) {
      alert('Please sign in with your campus student account to initiate a circular swap proposal.');
      return;
    }

    setActionLoadingId(cycle.id);
    try {
      await proposeCircularCycle(cycle);
      setActiveTab('proposals');
      const updatedProposals = await fetchUserProposals();
      setProposals(updatedProposals);
    } catch (err) {
      alert(err.message || 'Failed to propose circular loop');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Responding to a Proposal (Accept or Decline)
  const handleRespond = async (proposalId, decision, note = '') => {
    setActionLoadingId(proposalId);
    try {
      await respondToCircularProposal(proposalId, decision, note);
      const updatedProposals = await fetchUserProposals();
      setProposals(updatedProposals);
      setDeclineModalProposalId(null);
      setDeclineReason('');
    } catch (err) {
      alert(err.message || 'Failed to respond to circular proposal');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter cycles
  const filteredCycles = cycles.filter(c => {
    if (selectedTypeFilter !== 'all' && c.cycleType !== selectedTypeFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Hero Header */}
        <div className="bg-gradient-to-br from-forest-900 via-forest-800 to-forest-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-forest-700/60">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-sage-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage-500/20 border border-sage-400/30 text-sage-300 text-xs font-semibold tracking-wide uppercase">
              <RefreshCw className="w-3.5 h-3.5 text-sage-400 animate-spin-slow" />
              Multi-Party Exchange Engine
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight leading-tight">
              Circular Swap Finder
            </h1>
            <p className="text-sage-200 text-base sm:text-lg leading-relaxed">
              Unlock multi-student trade loops when direct swaps are unavailable. Our transparent graph algorithm connects students who desire each other's items in closed loops:
              <strong className="text-white"> Student A gives to B, B gives to C, and C gives to A.</strong>
            </p>

            {/* Suggestions Only Safety Disclaimer */}
            <div className="p-3.5 rounded-2xl bg-forest-950/60 border border-sage-500/30 flex items-start gap-3 text-xs text-sage-200">
              <Info className="w-4 h-4 text-sage-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Strict Participant Safety: </strong>
                All discovered loops are non-binding prospective suggestions. CampusLoop does not automatically accept requests or reserve items. Every participant must provide explicit consent, and item availability is strictly revalidated before finalizing.
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-200 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
                activeTab === 'suggestions'
                  ? 'bg-forest-900 text-white shadow-md'
                  : 'bg-white text-forest-800 hover:bg-sand-100 border border-sand-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Prospective Loops ({cycles.length})
            </button>

            <button
              onClick={() => setActiveTab('proposals')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 relative ${
                activeTab === 'proposals'
                  ? 'bg-forest-900 text-white shadow-md'
                  : 'bg-white text-forest-800 hover:bg-sand-100 border border-sand-200'
              }`}
            >
              <Users className="w-4 h-4" />
              My Loop Proposals
              {proposals.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-forest-950 text-xs font-bold inline-flex items-center justify-center">
                  {proposals.length}
                </span>
              )}
            </button>
          </div>

          {activeTab === 'suggestions' && (
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Type Filter */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-sand-200">
                <button
                  onClick={() => setSelectedTypeFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedTypeFilter === 'all' ? 'bg-forest-900 text-white' : 'text-forest-700 hover:text-forest-950'
                  }`}
                >
                  All Loops
                </button>
                <button
                  onClick={() => setSelectedTypeFilter('3-way')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedTypeFilter === '3-way' ? 'bg-forest-900 text-white' : 'text-forest-700 hover:text-forest-950'
                  }`}
                >
                  3-Way Loops
                </button>
                <button
                  onClick={() => setSelectedTypeFilter('2-way')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedTypeFilter === '2-way' ? 'bg-forest-900 text-white' : 'text-forest-700 hover:text-forest-950'
                  }`}
                >
                  2-Way Swaps
                </button>
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white border border-sand-200 rounded-xl px-3 py-2 text-xs font-medium text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              <button
                onClick={loadData}
                title="Refresh loops"
                className="p-2 bg-white rounded-xl border border-sand-200 text-forest-700 hover:text-forest-950 transition"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          )}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="py-24 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-forest-700 font-medium text-sm">
              Analyzing marketplace listings and computing cross-student exchange cycles...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Error loading circular cycles</h3>
              <p className="text-sm text-amber-800">{error}</p>
              <button
                onClick={loadData}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* SECTION A: SUGGESTIONS TAB */}
        {!loading && !error && activeTab === 'suggestions' && (
          <div className="space-y-6">
            {filteredCycles.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-sand-200 space-y-4 max-w-xl mx-auto">
                <div className="w-16 h-16 rounded-full bg-forest-50 text-forest-600 flex items-center justify-center mx-auto">
                  <RefreshCw className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-serif text-forest-950">No Exchange Loops Discovered Yet</h3>
                <p className="text-sm text-forest-700 leading-relaxed">
                  No multi-party cycles currently match your filter criteria. Add a swap listing with specified desired items or broaden your category selection to discover new cycles!
                </p>
                <div className="pt-2">
                  <Link
                    to="/create-listing"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-900 text-white text-sm font-semibold hover:bg-forest-800 transition"
                  >
                    Create Swap Listing
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8">
                {filteredCycles.map((cycle) => (
                  <div
                    key={cycle.id}
                    className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-sm hover:shadow-md transition-all space-y-6 relative overflow-hidden"
                  >
                    {/* Card Header & Badges */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-100 pb-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            cycle.cycleType === '3-way'
                              ? 'bg-purple-100 text-purple-900 border border-purple-200'
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          }`}>
                            {cycle.cycleType === '3-way' ? '3-Way Circular Loop' : '2-Way Direct Swap'}
                          </span>
                          <span className="text-xs font-semibold text-forest-600 bg-sand-100 px-2.5 py-1 rounded-full">
                            {cycle.participantCount} Students Involved
                          </span>
                          <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                            Match Score: {cycle.efficiencyScore}%
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-forest-950">{cycle.summary}</h3>
                      </div>

                      {/* Environmental Impact Metrics for this Loop */}
                      <div className="flex items-center gap-4 bg-sand-50/80 px-4 py-2.5 rounded-2xl border border-sand-200 self-start sm:self-auto">
                        <div className="text-center">
                          <div className="text-xs text-forest-600 font-medium flex items-center gap-1">
                            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                            Loop CO₂ Averted
                          </div>
                          <div className="font-bold text-forest-950 text-base">
                            {cycle.totalCo2SavedKg} kg
                          </div>
                        </div>
                        <div className="h-6 w-px bg-sand-200" />
                        <div className="text-center">
                          <div className="text-xs text-forest-600 font-medium flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                            Loop Savings
                          </div>
                          <div className="font-bold text-forest-950 text-base">
                            ${cycle.totalDollarsSaved}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step-by-Step Cycle Visual Flow */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-forest-600 uppercase tracking-wider">
                        Proposed Exchange Flow & Transparent Match Rationale:
                      </h4>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {cycle.steps.map((step, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-sand-50/90 border border-sand-200/90 space-y-3 flex flex-col justify-between relative"
                          >
                            <div className="space-y-3">
                              {/* Step indicator */}
                              <div className="flex items-center justify-between text-xs font-bold text-forest-600">
                                <span className="bg-white px-2.5 py-1 rounded-lg border border-sand-200 shadow-xs">
                                  Step {idx + 1}
                                </span>
                                <span className="text-forest-700 flex items-center gap-1 font-semibold">
                                  Transfer Item <ArrowRight className="w-3 h-3 text-forest-600" />
                                </span>
                              </div>

                              {/* Item transferred */}
                              <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-sand-200/70 shadow-xs">
                                <img
                                  src={step.item.imageUrl || (step.item.images && step.item.images[0])}
                                  alt={step.item.title}
                                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-sand-100"
                                />
                                <div className="min-w-0 flex-1">
                                  <h5 className="font-semibold text-xs text-forest-950 truncate">
                                    {step.item.title}
                                  </h5>
                                  <div className="text-[11px] text-forest-600 flex items-center gap-2 mt-0.5">
                                    <span className="capitalize">{step.item.category}</span>
                                    <span>·</span>
                                    <span className="text-emerald-700 font-medium">+{step.item.co2SavedKg}kg CO₂</span>
                                  </div>
                                </div>
                              </div>

                              {/* Student Giver and Receiver */}
                              <div className="text-xs space-y-1.5 pt-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-forest-600">From Student:</span>
                                  <span className="font-semibold text-forest-950 flex items-center gap-1.5">
                                    <img src={step.fromStudent.avatar} alt="" className="w-4 h-4 rounded-full" />
                                    {step.fromStudent.name}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-forest-600">To Student:</span>
                                  <span className="font-semibold text-forest-950 flex items-center gap-1.5">
                                    <img src={step.toStudent.avatar} alt="" className="w-4 h-4 rounded-full" />
                                    {step.toStudent.name}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Transparent Match Reason */}
                            <div className="p-2.5 rounded-xl bg-white border border-sand-200 text-[11px] text-forest-700 flex items-start gap-2">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                              <span>{step.reason}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Propose Action Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-sand-100">
                      <div className="text-xs text-forest-700 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>Requires explicit consent from all {cycle.participantCount} students before any items are finalized.</span>
                      </div>

                      <button
                        onClick={() => handlePropose(cycle)}
                        disabled={actionLoadingId === cycle.id}
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-semibold text-sm transition shadow-sm hover:shadow disabled:opacity-50"
                      >
                        {actionLoadingId === cycle.id ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Initiating Loop...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Propose Circular Loop
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION B: PROPOSALS TAB */}
        {!loading && !error && activeTab === 'proposals' && (
          <div className="space-y-6">
            {proposals.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-sand-200 space-y-4 max-w-xl mx-auto">
                <div className="w-16 h-16 rounded-full bg-forest-50 text-forest-600 flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-serif text-forest-950">No Active Proposals</h3>
                <p className="text-sm text-forest-700 leading-relaxed">
                  You haven't initiated or received any circular swap loop proposals yet. Discover a loop from the Prospective Loops tab to begin!
                </p>
                <button
                  onClick={() => setActiveTab('suggestions')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-900 text-white text-sm font-semibold hover:bg-forest-800 transition"
                >
                  Explore Prospective Loops
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {proposals.map((prop) => {
                  const currentUserId = user?.id || user?._id;
                  const myConsent = prop.consents?.find(
                    c => (c.userId?._id || c.userId || '').toString() === currentUserId?.toString()
                  );
                  const isConfirmed = prop.status === 'confirmed';
                  const isDeclined = prop.status === 'declined';
                  const isExpired = prop.status === 'expired';
                  const isPending = prop.status === 'pending_consent';

                  return (
                    <div
                      key={prop.id}
                      className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-sm space-y-6"
                    >
                      {/* Proposal Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-100 pb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              isConfirmed
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                                : isDeclined
                                ? 'bg-rose-100 text-rose-900 border border-rose-200'
                                : isExpired
                                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                : 'bg-blue-100 text-blue-900 border border-blue-200'
                            }`}>
                              {isConfirmed && '🎉 Loop Confirmed & Finalized'}
                              {isDeclined && '❌ Proposal Declined'}
                              {isExpired && '⚠️ Expired (Item Unavailable)'}
                              {isPending && '⏳ Awaiting Participant Consents'}
                            </span>
                            <span className="text-xs text-forest-600 bg-sand-100 px-2.5 py-1 rounded-full">
                              {prop.cycleType || '3-way'} Loop
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-forest-950">{prop.summaryText || 'Multi-Student Circular Swap'}</h4>
                        </div>

                        <div className="text-xs text-forest-600 font-medium">
                          Created {new Date(prop.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Revalidation Error Banner (if expired) */}
                      {isExpired && prop.revalidationError && (
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong className="font-semibold">Revalidation Abort: </strong>
                            {prop.revalidationError}
                          </div>
                        </div>
                      )}

                      {/* Participant Consents Tracker */}
                      <div className="space-y-2">
                        <h5 className="text-xs font-bold text-forest-600 uppercase tracking-wider">
                          Participant Explicit Consent Status:
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {prop.consents?.map((c, i) => (
                            <div
                              key={i}
                              className="p-3 rounded-xl bg-sand-50 border border-sand-200 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img
                                  src={c.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                                  alt=""
                                  className="w-8 h-8 rounded-full object-cover border border-sand-200 flex-shrink-0"
                                />
                                <div className="truncate">
                                  <div className="font-semibold text-xs text-forest-950 truncate">
                                    {c.userName}
                                  </div>
                                  <div className="text-[10px] text-forest-600 truncate">
                                    {c.userDepartment || 'Student'}
                                  </div>
                                </div>
                              </div>

                              <div>
                                {c.status === 'accepted' && (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Agreed
                                  </span>
                                )}
                                {c.status === 'declined' && (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                                    <XCircle className="w-3 h-3" />
                                    Declined
                                  </span>
                                )}
                                {c.status === 'pending' && (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                    <Clock className="w-3 h-3" />
                                    Pending
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Transfer Steps Flow */}
                      <div className="space-y-2">
                        <h5 className="text-xs font-bold text-forest-600 uppercase tracking-wider">
                          Exchange Items in Loop:
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {prop.steps?.map((step, idx) => (
                            <div key={idx} className="p-3 bg-white rounded-xl border border-sand-200 flex items-center gap-3">
                              <img
                                src={step.itemImageUrl}
                                alt={step.itemTitle}
                                className="w-10 h-10 rounded-lg object-cover border border-sand-100 flex-shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-xs text-forest-950 truncate">{step.itemTitle}</div>
                                <div className="text-[10px] text-forest-600">
                                  {step.fromUserName} → {step.toUserName}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* User's Action Section if Pending */}
                      {isPending && myConsent?.status === 'pending' && (
                        <div className="p-4 rounded-2xl bg-forest-50/70 border border-forest-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h6 className="font-bold text-sm text-forest-950">Your Explicit Consent Required</h6>
                            <p className="text-xs text-forest-700 mt-0.5">
                              Do you agree to participate in this circular exchange loop? Items are only finalized if all peers consent.
                            </p>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            <button
                              onClick={() => handleRespond(prop.id, 'accepted')}
                              disabled={actionLoadingId === prop.id}
                              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-xs disabled:opacity-50"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              Accept Loop
                            </button>
                            <button
                              onClick={() => setDeclineModalProposalId(prop.id)}
                              disabled={actionLoadingId === prop.id}
                              className="px-4 py-2 bg-white hover:bg-sand-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                              Decline
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Confirmation Success Message */}
                      {isConfirmed && (
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                          <div className="text-xs">
                            <strong className="font-semibold">Exchange Completed! </strong>
                            All participants approved. Items were transitioned to completed, averting {prop.totalCo2SavedKg}kg CO₂ and awarding +35 Eco-Karma.
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Decline Confirmation Modal */}
        {declineModalProposalId && (
          <div className="fixed inset-0 z-50 bg-forest-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-sand-200 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold font-serif text-lg text-forest-950">Decline Circular Proposal</h4>
                <button
                  onClick={() => setDeclineModalProposalId(null)}
                  className="text-forest-400 hover:text-forest-700"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-forest-700">
                Are you sure you want to decline? Declining will safely cancel the circular loop proposal for all students without modifying or reserving any items.
              </p>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="Optional reason for declining..."
                className="w-full h-20 p-3 rounded-xl border border-sand-200 text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
              />
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeclineModalProposalId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-forest-700 hover:bg-sand-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRespond(declineModalProposalId, 'declined', declineReason)}
                  disabled={actionLoadingId === declineModalProposalId}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition disabled:opacity-50"
                >
                  Confirm Decline
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CircularSwapPage;
