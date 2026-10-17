import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  ArrowUpDown, 
  Leaf, 
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
  DollarSign,
  Loader2
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
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(pageParam);

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
    if (searchParams.get('q')) {
      setSearchQuery(searchParams.get('q'));
    }
  }, [searchParams]);

  const categories = [
    { id: 'all', name: 'All Categories', icon: Sparkles },
    { id: 'textbooks', name: 'Textbooks', icon: BookOpen },
    { id: 'electronics', name: 'Calculators & Tech', icon: Cpu },
    { id: 'lab-gear', name: 'Lab Gear', icon: FlaskConical },
    { id: 'stationery', name: 'Stationery', icon: PenTool },
    { id: 'dorm', name: 'Dorm Essentials', icon: Home },
    { id: 'giveaways', name: 'Free Giveaways', icon: Gift },
  ];

  const listingTypes = [
    { id: 'all', label: 'All Listings' },
    { id: 'sell', label: 'For Sale' },
    { id: 'free', label: 'Free Giveaways 🎁' },
    { id: 'trade', label: 'Trades / Swaps 🔄' },
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
        setItems(res.data);
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

      const p = item.sellingPrice ?? item.price ?? 0;
      if (minPrice && p < Number(minPrice)) return false;
      if (maxPrice && p > Number(maxPrice)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return (a.sellingPrice ?? a.price) - (b.sellingPrice ?? b.price);
      if (sortBy === 'price-desc') return (b.sellingPrice ?? b.price) - (a.sellingPrice ?? a.price);
      if (sortBy === 'co2-desc') return (b.co2SavedKg || 0) - (a.co2SavedKg || 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / 8));
    const startIdx = (page - 1) * 8;
    setItems(filtered.slice(startIdx, startIdx + 8));
    setPagination({
      total,
      page,
      limit: 8,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    });
    setIsLoading(false);
  }, [searchQuery, selectedCategory, selectedType, selectedCondition, minPrice, maxPrice, sortBy, page, fallbackListings, fetchListingsApi]);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', catId);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (typeId === 'all') {
      newParams.delete('type');
    } else {
      newParams.set('type', typeId);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedCondition('all');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setPage(1);
    setSearchParams({});
  };

  const activeFiltersCount = 
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedType !== 'all' ? 1 : 0) +
    (selectedCondition !== 'all' ? 1 : 0) +
    (minPrice !== '' ? 1 : 0) +
    (maxPrice !== '' ? 1 : 0) +
    (searchQuery.trim() !== '' ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Search Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200/70 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-forest-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>Campus Circular Marketplace</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Exchange & Reuse Directory
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Find verified course materials, textbooks, and gear right on campus.
            </p>
          </div>

          {/* Quick Eco Stats Highlight */}
          <div className="hidden lg:flex items-center gap-3 bg-forest-50 border border-forest-200/80 px-4 py-2.5 rounded-2xl">
            <div className="w-9 h-9 rounded-xl bg-forest-800 text-white flex items-center justify-center">
              <Leaf className="w-5 h-5 text-sage-300" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-forest-900 block">Carbon Offset Mode</span>
              <span className="text-forest-700">Sort by highest CO₂ saved to maximize impact</span>
            </div>
          </div>
        </div>

        {/* Search Bar & Sorting Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by title, description, course codes (e.g. Campbell Biology, TI-84, CHEM 111)..."
              className="w-full pl-12 pr-10 py-3.5 bg-offwhite-100 border border-slate-200 rounded-2xl text-sm focus:outline-hidden focus:border-forest-600 focus:bg-white transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2 sm:w-64">
            <div className="relative w-full">
              <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-8 py-3.5 bg-offwhite-100 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 focus:outline-hidden focus:border-forest-600 appearance-none cursor-pointer"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="co2-desc">Sort: Highest CO₂ Saved 🌱</option>
                <option value="price-asc">Sort: Price: Low to High</option>
                <option value="price-desc">Sort: Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-forest-800 text-white shadow-sm'
                    : 'bg-offwhite-100 text-slate-700 hover:bg-forest-50 hover:text-forest-900 border border-slate-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-sage-300' : 'text-slate-500'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-Filters Toolbar (Listing Type, Condition, Price Range Filter) */}
      <div className="bg-white rounded-2xl p-4 border border-sage-200/70 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Listing Type Tabs */}
        <div className="inline-flex p-1 bg-offwhite-100 border border-slate-200 rounded-xl shadow-2xs">
          {listingTypes.map((type) => {
            const isSelected = selectedType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-forest-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {type.label}
              </button>
            );
          })}
        </div>

        {/* Price Range Filter for Sell Listings */}
        {(selectedType === 'all' || selectedType === 'sell') && (
          <div className="flex items-center gap-2 text-xs bg-offwhite-100 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-semibold flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-forest-700" />
              Price Range:
            </span>
            <input
              type="number"
              min="0"
              placeholder="Min $"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value);
                setPage(1);
              }}
              className="w-16 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-hidden focus:border-forest-600"
            />
            <span className="text-slate-400">-</span>
            <input
              type="number"
              min="0"
              placeholder="Max $"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                setPage(1);
              }}
              className="w-16 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-hidden focus:border-forest-600"
            />
          </div>
        )}

        {/* Condition Filter & Reset */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Condition:</span>
            <select
              value={selectedCondition}
              onChange={(e) => {
                setSelectedCondition(e.target.value);
                setPage(1);
              }}
              className="bg-white border border-slate-200 text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-hidden focus:border-forest-600 cursor-pointer"
            >
              <option value="all">All Conditions</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-forest-700 bg-forest-50 hover:bg-forest-100 rounded-xl transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset ({activeFiltersCount})
            </button>
          )}
        </div>
      </div>

      {/* Result Count Banner */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong>{items.length}</strong> of <strong>{pagination.total}</strong> sustainable items (Page {pagination.page} of {pagination.totalPages})
        </span>
        <span className="text-emerald-700 font-medium hidden sm:inline">
          🌱 Certified Safe-Exchange Campus Network
        </span>
      </div>

      {/* Items Grid, Loading State, or Empty State */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-sage-200/80">
          <Loader2 className="w-8 h-8 animate-spin text-forest-700 mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Discovering verified campus listings...</p>
        </div>
      ) : items.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 pb-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrevPage}
                className="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                      page === pageNum
                        ? 'bg-forest-800 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={!pagination.hasNextPage}
                className="inline-flex items-center gap-1 px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-sage-200/80 shadow-xs max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700 mx-auto">
            <Leaf className="w-8 h-8 text-sage-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No matching campus items found</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Try adjusting your search terms, removing price filters, or clearing category selections.
          </p>
          <div className="pt-2">
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-forest-800 text-white font-bold text-xs hover:bg-forest-900 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
