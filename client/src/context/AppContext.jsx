import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_LISTINGS, CATEGORIES, DEMO_USER } from '../data/sampleData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [listings, setListings] = useState(INITIAL_LISTINGS);
  const [categories, setCategories] = useState(CATEGORIES);
  const [token, setToken] = useState(() => localStorage.getItem('campusloop_token') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('campusloop_user');
    return savedUser ? JSON.parse(savedUser) : DEMO_USER;
  });
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

  // Sync token and user profile on mount
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      setLoading(true);

      // Verify token with backend if exists
      const savedToken = localStorage.getItem('campusloop_token');
      if (savedToken) {
        try {
          const authRes = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${savedToken}`
            }
          });
          if (authRes.ok) {
            const authJson = await authRes.json();
            if (authJson.success && authJson.data) {
              setUser(authJson.data);
              localStorage.setItem('campusloop_user', JSON.stringify(authJson.data));
            }
          } else {
            // Token expired or invalid
            localStorage.removeItem('campusloop_token');
            localStorage.removeItem('campusloop_user');
            setToken(null);
          }
        } catch (e) {
          console.warn('Backend auth verification check offline, using cached session');
        }
      }

      // Fetch listings and impact statistics
      try {
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
        console.warn('Backend listings/stats request notice:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const toggleSave = (itemId) => {
    setSavedItemIds(prev => {
      const isSaved = prev.includes(itemId);
      const next = isSaved ? prev.filter(id => id !== itemId) : [...prev, itemId];
      showToast(isSaved ? 'Item removed from your saved list' : 'Item saved to your wishlist!', 'info');
      return next;
    });
  };

  // Real backend login integration with JWT storage
  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Login failed. Please check your credentials.');
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('campusloop_token', data.token);
    localStorage.setItem('campusloop_user', JSON.stringify(data.user));

    showToast(data.message || `Welcome back, ${data.user.name}!`, 'success');
    return data;
  };

  // Real backend registration integration with JWT storage
  const register = async (formData) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Registration failed. Please check your inputs.');
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('campusloop_token', data.token);
    localStorage.setItem('campusloop_user', JSON.stringify(data.user));

    showToast(data.message, 'success');
    return data;
  };

  // Real backend college verification integration
  const verifyCollege = async ({ studentIdCode, collegeEmail }) => {
    const activeToken = token || localStorage.getItem('campusloop_token');
    const res = await fetch('/api/auth/verify-college', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${activeToken}`
      },
      body: JSON.stringify({ studentIdCode, collegeEmail })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'College verification failed.');
    }

    setUser(data.data);
    localStorage.setItem('campusloop_user', JSON.stringify(data.data));
    showToast('Campus student verification confirmed!', 'success');
    return data.data;
  };

  // Real backend logout integration
  const logout = async () => {
    const activeToken = token || localStorage.getItem('campusloop_token');
    if (activeToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${activeToken}`
          }
        });
      } catch (err) {
        // continue local cleanup
      }
    }

    setToken(null);
    setUser(null);
    localStorage.removeItem('campusloop_token');
    localStorage.removeItem('campusloop_user');
    showToast('Signed out of CampusLoop', 'info');
  };

  // Create listing linked to authenticated seller
  const addListing = async (newListingData) => {
    const activeToken = token || localStorage.getItem('campusloop_token');
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (activeToken) {
        headers['Authorization'] = `Bearer ${activeToken}`;
      }

      const res = await fetch('/api/listings', {
        method: 'POST',
        headers,
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

    // Local fallback
    const created = {
      id: `item-${Date.now()}`,
      ...newListingData,
      createdAt: new Date().toISOString(),
      viewsCount: 1,
      seller: {
        id: user?._id || user?.id || 'usr-current',
        name: user?.name || 'Student Seller',
        department: user?.department || 'General Studies',
        year: user?.year || 'Junior',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        karmaScore: (user?.karmaScore || 100) + 25,
        itemsReused: (user?.itemsReused || 0) + 1,
        verifiedStudent: !!user?.isCollegeVerified
      }
    };

    setListings(prev => [created, ...prev]);
    showToast(`🌱 Listing posted! Thank you for choosing circular reuse!`, 'success');
    return created;
  };

  return (
    <AppContext.Provider
      value={{
        listings,
        setListings,
        categories,
        user,
        token,
        setUser,
        login,
        register,
        verifyCollege,
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
