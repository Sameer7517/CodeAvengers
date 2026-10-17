import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_LISTINGS, CATEGORIES, DEMO_USER } from '../data/sampleData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [listings, setListings] = useState(INITIAL_LISTINGS);
  const [categories, setCategories] = useState(CATEGORIES);
  const [user, setUser] = useState(DEMO_USER); // logged in by default for seamless hackathon testing
  const [savedItemIds, setSavedItemIds] = useState(['item-102', 'item-103']);
  const [selectedItemForModal, setSelectedItemForModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState({
    totalListings: 8,
    totalCo2SavedKg: 1542,
    totalDollarsSaved: 13420,
    freeItemsAvailable: 2,
    activeStudents: 640,
    treesEquivalent: 74
  });
  const [loading, setLoading] = useState(false);

  // Fetch from Express backend on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [listingsRes, statsRes] = await Promise.allSettled([
          fetch('/api/listings'),
          fetch('/api/stats')
        ]);

        if (listingsRes.status === 'fulfilled' && listingsRes.value.ok) {
          const listingsJson = await listingsRes.value.json();
          if (listingsJson.success && listingsJson.data) {
            setListings(listingsJson.data);
          }
        }

        if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
          const statsJson = await statsRes.value.json();
          if (statsJson.success && statsJson.data) {
            setStats(statsJson.data);
          }
        }
      } catch (err) {
        console.warn('Backend not reached yet, using robust sample dataset:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  const toggleSave = (itemId) => {
    setSavedItemIds(prev => {
      const isSaved = prev.includes(itemId);
      const next = isSaved ? prev.filter(id => id !== itemId) : [...prev, itemId];
      showToast(isSaved ? 'Item removed from your saved list' : 'Item saved to your wishlist!', 'info');
      return next;
    });
  };

  const addListing = async (newListingData) => {
    try {
      // Send to backend
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newListingData)
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setListings(prev => [json.data, ...prev]);
          showToast(`🌱 "${json.data.title}" posted to CampusLoop! Estimated -${json.data.co2SavedKg}kg CO₂ saved!`, 'success');
          return json.data;
        }
      }
    } catch (e) {
      console.warn('Backend request failed, falling back to local state:', e);
    }

    // Local state fallback if backend isn't reached
    const created = {
      id: `item-${Date.now()}`,
      ...newListingData,
      createdAt: new Date().toISOString(),
      viewsCount: 1,
      seller: {
        id: user?.id || 'usr-current',
        name: user?.name || 'Student Seller',
        department: user?.department || 'General Studies',
        year: user?.year || 'Junior',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        karmaScore: (user?.karmaScore || 100) + 25,
        itemsReused: (user?.itemsReused || 0) + 1,
        verifiedStudent: true
      }
    };

    setListings(prev => [created, ...prev]);
    showToast(`🌱 Listing posted! Thank you for choosing circular reuse!`, 'success');
    return created;
  };

  const login = (email) => {
    setUser({
      ...DEMO_USER,
      email: email || DEMO_USER.email
    });
    showToast(`Welcome back, ${DEMO_USER.name}!`, 'success');
  };

  const logout = () => {
    setUser(null);
    showToast('Signed out of CampusLoop', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        listings,
        setListings,
        categories,
        user,
        setUser,
        login,
        logout,
        savedItemIds,
        toggleSave,
        selectedItemForModal,
        setSelectedItemForModal,
        stats,
        loading,
        showToast,
        addListing
      }}
    >
      {children}
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-forest-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-forest-700/60 transition-all animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-sage-400 animate-ping" />
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
