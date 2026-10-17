import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  ArrowUpDown, 
  Sparkles, 
  Gift, 
  RefreshCw, 
  BookOpen, 
  Cpu, 
  FlaskConical, 
  PenTool, 
  Home, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Calculator,
  CheckCircle,
  Clock,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ItemCard from '../components/ItemCard';

export default function MarketplacePage() {
  const { listings: fallbackListings, fetchListingsApi } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL Query Sync
  const categoryParam = searchParams.get('category') || 'all';
  const typeParam = searchParams.get('type') || 'all';
  const searchParam = searchParams.get('q') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedType, setSelectedType] = useState(typeParam);
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all'); // 'all' | 'available' | 'reserved' | 'completed'
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'price-asc' | 'price-desc'
  const [page, setPage] = useState(pageParam);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [isLoading, setIsLoading] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    setSelectedType(searchParams.get('type') || 'all');
    if (searchParams.get('q') !== null) {
      setSearchQuery(searchParams.get('q') || '');
    }
  }, [searchParams]);

  const categories = [
    { id: 'all', name: 'All Categories', icon: Sparkles },
    { id: 'textbooks', name: 'Books & Textbooks', icon: BookOpen },
    { id: 'electronics', name: 'Calculators & Tech', icon: Calculator },
    { id: 'lab-gear', name: 'Lab Supplies & PPE', icon: FlaskConical },
    { id: 'stationery', name: 'Stationery & Drafting', icon: PenTool },
    { id: 'dorm', name: 'Other Essentials', icon: Home },
    { id: 'giveaways', name: 'Free Giveaways', icon: Gift },
  ];

  const listingTypes = [
    { id: 'all', label: 'All Exchange Types' },
    { id: 'sell', label: 'For Sale' },
    { id: 'free', label: 'Free Giveaways 🎁' },
    { id: 'trade', label: 'Trades / Swaps 🔄' },
  ];

  const conditions = [
    { id: 'all', label: 'Any Condition' },
    { id: 'Like New', label: 'Like New' },
    { id: 'Good', label: 'Good' },
    { id: 'Fair', label: 'Fair' },
  ];

  const availabilities = [
    { id: 'all', label: 'All Items' },
    { id: 'available', label: 'Available Only', icon: CheckCircle },
    { id: 'reserved', label: 'Reserved', icon: Clock },
    { id: 'completed', label: 'Completed', icon: CheckCircle },
  ];

  // Fetch listings from backend API
  const loadListings = useCallback(async () => {
    setIsLoading(true);

    const typeNormalized = selectedType === 'free' ? 'giveaway' : selectedType === 'trade' ? 'swap' : selectedType;
    const catNormalized = selectedCategory === 'giveaways' ? 'all' : selectedCategory;
    const effectiveType = selectedCategory === 'giveaways' ? 'giveaway' : typeNormalized;

    const queryArgs = {
      search: searchQuery.trim(),
      category: catNormalized !== 'all' ? catNormalized : undefined,
      type: effectiveType !== 'all' ? effectiveType : undefined,
      condition: selectedCondition !== 'all' ? selectedCondition : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sort: sortBy,
      page: page,
      limit: 8
    };

    try {
      const res = await fetchListingsApi(queryArgs);
      if (res && res.success) {
        let resultData = res.data;
        // Filter by availability on client if specified
        if (selectedAvailability !== 'all') {
          resultData = resultData.filter(i => (i.status || 'available') === selectedAvailability);
        }
        setItems(resultData);
        if (res.pagination) {
          setPagination(res.pagination);
        }
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Backend API query notice, applying client fallback:', err);
    }

    // Client-side fallback if backend request fails
    const filtered = fallbackListings.filter((item) => {
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = item.title?.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q);
        const matchTags = item.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchTags) return false;
      }

      if (effectiveType !== 'all') {
        const itemType = item.listingType === 'trade' ? 'swap' : item.listingType === 'free' ? 'giveaway' : item.listingType;
        if (itemType !== effectiveType) return false;
      }

      if (catNormalized !== 'all' && item.category !== catNormalized) {
        return false;
      }

      if (selectedCondition !== 'all' && item.condition !== selectedCondition) {
        return false;
      }

      if (selectedAvailability !== 'all' && (item.status || 'available') !== selectedAvailability) {
        return false;
      }

      const p = item.sellingPrice ?? item.price ?? 0;
      if (minPrice && p < Number(minPrice)) return false;
      if (maxPrice && p > Number(maxPrice)) return false;

      return true;
    });

    // Client-side sorting
    filtered.sort((a, b) => {
      if (sortBy === 'price-asc') {
        return (a.sellingPrice ?? a.price ?? 0) - (b.sellingPrice ?? b.price ?? 0);
      }
      if (sortBy === 'price-desc') {
        return (b.sellingPrice ?? b.price ?? 0) - (a.sellingPrice ?? a.price ?? 0);
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    setItems(filtered);
    setPagination({
      page: 1,
      limit: 8,
      total: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / 8)),
      hasNextPage: false,
      hasPrevPage: false
    });
    setIsLoading(false);
  }, [
    searchQuery,
    selectedCategory,
    selectedType,
    selectedCondition,
    selectedAvailability,
    minPrice,
    maxPrice,
    sortBy,
    page,
    fallbackListings,
    fetchListingsApi
  ]);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      if (searchQuery.trim()) {
        p.set('q', searchQuery.trim());
      } else {
        p.delete('q');
      }
      return p;
    });
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedCondition('all');
    setSelectedAvailability('all');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setPage(1);
    setSearchParams({});
  };

  // Check active filter count
  const activeFiltersCount = [
    selectedCategory !== 'all',
    selectedType !== 'all',
    selectedCondition !== 'all',
    selectedAvailability !== 'all',
    minPrice !== '',
    maxPrice !== '',
    searchQuery.trim() !== ''
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text)] tracking-tight">
            Browse Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-0.5">
            Showing <strong className="text-[var(--color-text)]">{items.length}</strong> items from verified students
          </p>
        </div>

        {/* Search Field */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search titles, textbooks, calculators, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-24 py-2.5 rounded-2xl glass-panel text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-hidden focus:ring-2 focus:ring-[#176B4D]/30 dark:focus:ring-[#72D6A2]/30"
          />
          <button
            type="submit"
            className="absolute right-2 top-1.5 px-3 py-1 bg-[#176B4D] dark:bg-[#72D6A2] text-white dark:text-[#0B110E] text-xs font-bold rounded-xl"
          >
            Search
          </button>
        </form>
      </div>

      {/* Mobile Filter & Sort Triggers */}
      <div className="flex items-center justify-between gap-2 md:hidden">
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl glass-panel border border-[var(--color-border)] text-xs font-bold text-[var(--color-text)]"
        >
          <Filter className="w-4 h-4 text-[#176B4D] dark:text-[#72D6A2]" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#176B4D] dark:bg-[#72D6A2] text-white dark:text-[#0B110E] text-[10px] font-black flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort listings"
          className="flex-1 py-2.5 px-3 rounded-xl glass-panel border border-[var(--color-border)] text-xs font-bold text-[var(--color-text)] focus:outline-hidden"
        >
          <option value="newest">Sort: Newest</option>
          <option value="oldest">Sort: Oldest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-[var(--color-text-muted)]">Active Filters:</span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-[#176B4D] dark:text-[#72D6A2]">
              Search: "{searchQuery}"
              <button onClick={() => { setSearchQuery(''); setSearchParams(prev => { const p = new URLSearchParams(prev); p.delete('q'); return p; }); }}><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-[#176B4D] dark:text-[#72D6A2]">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory('all')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedType !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-[#176B4D] dark:text-[#72D6A2]">
              Type: {selectedType}
              <button onClick={() => setSelectedType('all')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedCondition !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-[#176B4D] dark:text-[#72D6A2]">
              Condition: {selectedCondition}
              <button onClick={() => setSelectedCondition('all')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedAvailability !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-[#176B4D] dark:text-[#72D6A2]">
              Availability: {selectedAvailability}
              <button onClick={() => setSelectedAvailability('all')}><X className="w-3 h-3" /></button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 ml-2"
          >
            <RotateCcw className="w-3 h-3" />
            Clear all
          </button>
        </div>
      )}

      {/* Main Grid with Desktop Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Sidebar Filter Panel */}
        <div className="hidden lg:block space-y-6 glass-panel p-5 rounded-2xl border border-[var(--color-border)] sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--color-text)] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#176B4D] dark:text-[#72D6A2]" />
              Filter Catalog
            </span>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] font-bold text-rose-600 hover:underline"
              >
                Reset
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--color-text)] block">Categories</label>
            <div className="space-y-1">
              {categories.map((c) => {
                const Icon = c.icon;
                const isSelected = selectedCategory === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                      isSelected
                        ? 'bg-[#176B4D] dark:bg-[#72D6A2] text-white dark:text-[#0B110E] font-bold shadow-xs'
                        : 'text-[var(--color-text)] hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Listing Type / Exchange Mode */}
          <div className="space-y-2 pt-2 border-t border-[var(--color-border)]">
            <label className="text-xs font-bold text-[var(--color-text)] block">Exchange Type</label>
            <div className="space-y-1">
              {listingTypes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    selectedType === t.id
                      ? 'bg-emerald-500/10 text-[#176B4D] dark:text-[#72D6A2] font-bold border border-emerald-500/30'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div className="space-y-2 pt-2 border-t border-[var(--color-border)]">
            <label className="text-xs font-bold text-[var(--color-text)] block">Availability</label>
            <div className="grid grid-cols-2 gap-1.5">
              {availabilities.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedAvailability(a.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold text-center transition-all ${
                    selectedAvailability === a.id
                      ? 'bg-[#176B4D] dark:bg-[#72D6A2] text-white dark:text-[#0B110E]'
                      : 'bg-black/5 dark:bg-white/5 text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Condition Filter */}
          <div className="space-y-2 pt-2 border-t border-[var(--color-border)]">
            <label className="text-xs font-bold text-[var(--color-text)] block">Item Condition</label>
            <div className="space-y-1">
              {conditions.map((cond) => (
                <button
                  key={cond.id}
                  onClick={() => setSelectedCondition(cond.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    selectedCondition === cond.id
                      ? 'bg-emerald-500/10 text-[#176B4D] dark:text-[#72D6A2] font-bold border border-emerald-500/30'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {cond.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sorting */}
          <div className="space-y-2 pt-2 border-t border-[var(--color-border)]">
            <label className="text-xs font-bold text-[var(--color-text)] block">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Desktop sort listings"
              className="w-full px-3 py-2 rounded-xl glass-panel text-xs font-semibold text-[var(--color-text)] border border-[var(--color-border)] focus:outline-hidden"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid (Responsive: 1-2 on mobile, 2-3 on tablet, 3-4 on desktop) */}
        <div className="lg:col-span-3 space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass-card rounded-2xl h-80 animate-pulse bg-black/5 dark:bg-white/5" />
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center rounded-3xl space-y-4 max-w-md mx-auto my-8">
              <Sparkles className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-[var(--color-text)]">No matching items found</h3>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                Try clearing your search filters or adjusting the category selection.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#176B4D] dark:bg-[#72D6A2] dark:text-[#0B110E]"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-6 border-t border-[var(--color-border)]">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="p-2 rounded-xl glass-panel text-[var(--color-text)] disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-[var(--color-text)]">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-2 rounded-xl glass-panel text-[var(--color-text)] disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Slide-over Filter Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Sheet */}
          <div className="relative ml-auto w-full max-w-xs h-full glass-dropdown p-6 overflow-y-auto space-y-6 shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <h3 className="font-extrabold text-base text-[var(--color-text)]">Filter Marketplace</h3>
              <button onClick={() => setMobileDrawerOpen(false)} className="p-1 rounded-lg text-[var(--color-text)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--color-text)] block">Category</label>
              <div className="space-y-1">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCategory(c.id); setMobileDrawerOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                      selectedCategory === c.id
                        ? 'bg-[#176B4D] dark:bg-[#72D6A2] text-white dark:text-[#0B110E]'
                        : 'text-[var(--color-text-muted)] hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Exchange Type */}
            <div className="space-y-2 pt-2 border-t border-[var(--color-border)]">
              <label className="text-xs font-bold text-[var(--color-text)] block">Exchange Type</label>
              <div className="space-y-1">
                {listingTypes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setSelectedType(t.id); setMobileDrawerOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold ${
                      selectedType === t.id
                        ? 'bg-emerald-500/10 text-[#176B4D] dark:text-[#72D6A2] font-bold'
                        : 'text-[var(--color-text-muted)]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Availability */}
            <div className="space-y-2 pt-2 border-t border-[var(--color-border)]">
              <label className="text-xs font-bold text-[var(--color-text)] block">Availability</label>
              <div className="grid grid-cols-2 gap-1.5">
                {availabilities.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => { setSelectedAvailability(a.id); setMobileDrawerOpen(false); }}
                    className={`px-2 py-1.5 rounded-xl text-xs font-semibold ${
                      selectedAvailability === a.id
                        ? 'bg-[#176B4D] dark:bg-[#72D6A2] text-white dark:text-[#0B110E]'
                        : 'bg-black/5 dark:bg-white/5 text-[var(--color-text-muted)]'
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--color-border)] flex gap-2">
              <button
                onClick={() => { clearAllFilters(); setMobileDrawerOpen(false); }}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-500/10"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-[#176B4D] dark:bg-[#72D6A2] dark:text-[#0B110E]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
