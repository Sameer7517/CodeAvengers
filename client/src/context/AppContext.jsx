import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_LISTINGS, CATEGORIES, DEMO_USER } from '../data/sampleData';
import { apiUrl } from '../utils/api';

const customFetch = (url, options) => {
  const target = typeof url === 'string' && url.startsWith('/api') ? apiUrl(url) : url;
  return window.fetch(target, options);
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const fetch = customFetch;
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
            const d = statsJson.data;
            setStats(prev => ({
              ...prev,
              ...d,
              totalCo2SavedKg: d.completedMetrics?.verifiedCo2SavedKg ?? d.totalCo2SavedKg ?? prev.totalCo2SavedKg,
              totalDollarsSaved: d.completedMetrics?.actualDollarsSaved ?? d.totalDollarsSaved ?? prev.totalDollarsSaved,
              freeItemsAvailable: d.catalogStatus?.currentlyAvailableListings ?? d.freeItemsAvailable ?? prev.freeItemsAvailable,
            }));
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
    if (!activeToken) {
      throw new Error('You must be signed in to list an item on CampusLoop.');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${activeToken}`
    };

    const res = await fetch('/api/listings', {
      method: 'POST',
      headers,
      body: JSON.stringify(newListingData)
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to publish listing. Please check required fields.');
    }

    setListings(prev => [json.data, ...prev]);
    showToast(`🌱 "${json.data.title}" posted to CampusLoop! Estimated -${json.data.co2SavedKg}kg CO₂ saved!`, 'success');
    return json.data;
  };

  // Update listing details
  const updateListing = async (id, updateData) => {
    const activeToken = token || localStorage.getItem('campusloop_token');
    const res = await fetch(`/api/listings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${activeToken}`
      },
      body: JSON.stringify(updateData)
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to update listing.');
    }

    setListings(prev => prev.map(item => (item.id === id ? json.data : item)));
    showToast('Listing updated successfully!', 'success');
    return json.data;
  };

  // Update listing availability status (available, reserved, completed)
  const updateListingStatus = async (id, status) => {
    const activeToken = token || localStorage.getItem('campusloop_token');
    const res = await fetch(`/api/listings/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${activeToken}`
      },
      body: JSON.stringify({ status })
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to update listing status.');
    }

    setListings(prev => prev.map(item => (item.id === id ? json.data : item)));
    const statusText = status === 'available' ? 'Available' : status === 'reserved' ? 'Reserved' : 'Completed';
    showToast(`Listing marked as ${statusText}`, 'success');
    return json.data;
  };

  // Delete listing (enforced by backend ownership)
  const deleteListing = async (id) => {
    const activeToken = token || localStorage.getItem('campusloop_token');
    const res = await fetch(`/api/listings/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${activeToken}`
      }
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to delete listing.');
    }

    setListings(prev => prev.filter(item => item.id !== id));
    showToast('Listing removed from CampusLoop', 'info');
    return true;
  };

  // Request exchange/pickup for an item
  const requestExchange = async (id, payload) => {
    const activeToken = token || localStorage.getItem('campusloop_token');
    const headers = { 'Content-Type': 'application/json' };
    if (activeToken) {
      headers['Authorization'] = `Bearer ${activeToken}`;
    }

    const res = await fetch(`/api/listings/${id}/request-exchange`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Could not dispatch exchange request.');
    }

    showToast('Pickup request dispatched to seller!', 'success');
    return json;
  };

  // Phase 4: Submit formal exchange request (Swap, Give Away, or Sell inquiry)
  const createExchangeRequest = async ({ listingId, offeredListingId, proposedMeetingTime, proposedSpot, message }) => {
    const activeToken = token || localStorage.getItem('campusloop_token');
    if (!activeToken) {
      throw new Error('Please sign in to submit an exchange or pickup request.');
    }

    const res = await fetch('/api/exchanges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${activeToken}`
      },
      body: JSON.stringify({
        listingId,
        offeredListingId: offeredListingId || undefined,
        proposedMeetingTime,
        proposedSpot,
        message
      })
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Could not submit exchange proposal.');
    }

    showToast('🌱 Proposal dispatched! Check your dashboard for updates.', 'success');
    return json.data;
  };

  // Phase 4: Fetch user's incoming and outgoing exchange requests
  const fetchExchangeRequests = async ({ role = 'all', status } = {}) => {
    const activeToken = token || localStorage.getItem('campusloop_token');
    if (!activeToken) return [];

    const params = new URLSearchParams();
    if (role) params.set('role', role);
    if (status && status !== 'all') params.set('status', status);

    const res = await fetch(`/api/exchanges?${params.toString()}`, {
      headers: { 'Authorization': `Bearer ${activeToken}` }
    });

    const json = await res.json();
    if (res.ok && json.success) {
      return json.data || [];
    }
    return [];
  };

  // Phase 4: Owner accepts exchange request (reserves items)
  const acceptExchangeRequest = async (requestId) => {
    const activeToken = token || localStorage.getItem('campusloop_token');
    const res = await fetch(`/api/exchanges/${requestId}/accept`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${activeToken}` }
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Could not accept proposal.');
    }

    showToast('Exchange proposal accepted! Items are now reserved.', 'success');
    // Refresh listings to show updated reserved badge
    try {
      const lRes = await fetch('/api/listings');
      const lJson = await lRes.json();
      if (lJson.success) setListings(lJson.data);
    } catch (e) {}

    return json.data;
  };

  // Phase 4: Owner declines exchange request
  const rejectExchangeRequest = async (requestId, reason = '') => {
    const activeToken = token || localStorage.getItem('campusloop_token');
    const res = await fetch(`/api/exchanges/${requestId}/reject`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${activeToken}`
      },
      body: JSON.stringify({ reason })
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Could not decline proposal.');
    }

    showToast('Exchange proposal declined.', 'info');
    return json.data;
  };

  // Phase 4: Requester cancels pending exchange request
  const cancelExchangeRequest = async (requestId) => {
    const activeToken = token || localStorage.getItem('campusloop_token');
    const res = await fetch(`/api/exchanges/${requestId}/cancel`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${activeToken}` }
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Could not cancel proposal.');
    }

    showToast('Proposal cancelled.', 'info');
    return json.data;
  };

  // Phase 4: Handover confirmation and completion (marks completed and awards karma)
  const completeExchangeRequest = async (requestId) => {
    const activeToken = token || localStorage.getItem('campusloop_token');
    const res = await fetch(`/api/exchanges/${requestId}/complete`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${activeToken}` }
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Could not complete exchange.');
    }

    showToast('🎉 Handover confirmed! +50 Eco-Karma awarded for circular reuse!', 'success');
    
    // Refresh user profile & listings
    if (user) {
      setUser(prev => ({
        ...prev,
        karmaScore: (prev.karmaScore || 100) + 50,
        itemsReused: (prev.itemsReused || 0) + 1
      }));
    }

    try {
      const lRes = await fetch('/api/listings');
      const lJson = await lRes.json();
      if (lJson.success) setListings(lJson.data);
    } catch (e) {}

    return json.data;
  };

  // Phase 4: In-app student notifications
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);

  const fetchNotifications = async () => {
    const activeToken = token || localStorage.getItem('campusloop_token');
    if (!activeToken) return;

    try {
      const res = await fetch('/api/notifications', {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setNotifications(json.data || []);
        setUnreadNotifCount(json.unreadCount || 0);
      }
    } catch (err) {}
  };

  const markNotificationAsRead = async (notifId) => {
    const activeToken = token || localStorage.getItem('campusloop_token');
    if (!activeToken) return;

    try {
      await fetch(`/api/notifications/${notifId}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      setNotifications(prev => prev.map(n => (n.id === notifId ? { ...n, read: true } : n)));
      setUnreadNotifCount(prev => Math.max(0, prev - 1));
    } catch (e) {}
  };

  const markAllNotificationsAsRead = async () => {
    const activeToken = token || localStorage.getItem('campusloop_token');
    if (!activeToken) return;

    try {
      await fetch('/api/notifications/read-all', {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadNotifCount(0);
    } catch (e) {}
  };

  // Poll / fetch notifications on mount & token changes
  useEffect(() => {
    if (token) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [token]);

  // Phase 5: Fetch Detailed Sustainability Impact Statistics
  const fetchImpactStats = async () => {
    try {
      const res = await fetch('/api/stats/impact');
      const json = await res.json();
      if (res.ok && json.success) {
        return json.data;
      }
      throw new Error(json.message || 'Failed to fetch impact stats');
    } catch (err) {
      console.warn('Error fetching detailed impact stats:', err);
      throw err;
    }
  };

  // Phase 5: Fetch Top Campus Recyclers Leaderboard
  const fetchLeaderboard = async (limit = 10) => {
    try {
      const res = await fetch(`/api/stats/leaderboard?limit=${limit}`);
      const json = await res.json();
      if (res.ok && json.success) {
        return json.data;
      }
      throw new Error(json.message || 'Failed to fetch leaderboard');
    } catch (err) {
      console.warn('Error fetching leaderboard:', err);
      throw err;
    }
  };

  // Phase 5: Fetch Circular Swap Suggestions (Transparent Multi-Party Loops)
  const fetchCircularSuggestions = async ({ category } = {}) => {
    const activeToken = token || localStorage.getItem('campusloop_token');
    const headers = activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {};
    const query = category && category !== 'all' ? `?category=${category}` : '';

    try {
      const res = await fetch(`/api/circular-swap/suggestions${query}`, { headers });
      const json = await res.json();
      if (res.ok && json.success) {
        return json.data;
      }
      throw new Error(json.message || 'Failed to discover circular cycles');
    } catch (err) {
      console.warn('Error fetching circular suggestions:', err);
      throw err;
    }
  };

  // Phase 5: Fetch Circular Proposals for Current Student
  const fetchUserProposals = async () => {
    const activeToken = token || localStorage.getItem('campusloop_token');
    if (!activeToken) return [];

    try {
      const res = await fetch('/api/circular-swap/proposals', {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      const json = await res.json();
      if (res.ok && json.success) {
        return json.data || [];
      }
      return [];
    } catch (err) {
      console.warn('Error fetching user proposals:', err);
      return [];
    }
  };

  // Phase 5: Propose a Circular Exchange Cycle
  const proposeCircularCycle = async (cycleData) => {
    const activeToken = token || localStorage.getItem('campusloop_token');
    if (!activeToken) throw new Error('Please sign in to initiate a circular swap proposal');

    const res = await fetch('/api/circular-swap/propose', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${activeToken}`
      },
      body: JSON.stringify({ cycleData })
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to propose circular exchange cycle');
    }

    showToast('🔄 Circular proposal initiated! Awaiting participant consent.');
    fetchNotifications();
    return json.data;
  };

  // Phase 5: Submit Explicit Consent Response ('accepted' or 'declined')
  const respondToCircularProposal = async (proposalId, decision, note = '') => {
    const activeToken = token || localStorage.getItem('campusloop_token');
    if (!activeToken) throw new Error('Please sign in to respond to circular proposal');

    const res = await fetch(`/api/circular-swap/proposals/${proposalId}/respond`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${activeToken}`
      },
      body: JSON.stringify({ decision, note })
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to respond to circular proposal');
    }

    if (decision === 'accepted') {
      showToast('✅ Explicit consent registered for circular swap loop!');
    } else {
      showToast('❌ Circular swap proposal declined. No items reserved.');
    }

    fetchNotifications();
    return json.data;
  };

  // Confirm Step Handover in Circular Swap
  const confirmCircularHandover = async (proposalId, { stepIndex, itemId } = {}) => {
    const activeToken = token || localStorage.getItem('campusloop_token');
    if (!activeToken) throw new Error('Please sign in to confirm item handover');

    const res = await fetch(`/api/circular-swap/proposals/${proposalId}/handover`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${activeToken}`
      },
      body: JSON.stringify({ stepIndex, itemId })
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to confirm item handover');
    }

    showToast('🤝 Handover verified! Item received.');
    fetchNotifications();
    return json.data;
  };

  // Cancel Circular Proposal
  const cancelCircularProposal = async (proposalId) => {
    const activeToken = token || localStorage.getItem('campusloop_token');
    if (!activeToken) throw new Error('Please sign in to cancel proposal');

    const res = await fetch(`/api/circular-swap/proposals/${proposalId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${activeToken}`
      }
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to cancel circular proposal');
    }

    showToast('❌ Circular swap proposal cancelled cleanly.');
    fetchNotifications();
    return json.data;
  };

  // Fetch filtered listings from backend with pagination
  const fetchListingsApi = async (params = {}) => {
    const cleanParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '' && val !== 'all') {
        cleanParams.append(key, val);
      }
    });

    const res = await fetch(`/api/listings?${cleanParams.toString()}`);
    const json = await res.json();
    if (res.ok && json.success) {
      return json;
    }
    throw new Error(json.message || 'Failed to fetch listings');
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
        addListing,
        updateListing,
        updateListingStatus,
        deleteListing,
        requestExchange,
        createExchangeRequest,
        fetchExchangeRequests,
        acceptExchangeRequest,
        rejectExchangeRequest,
        cancelExchangeRequest,
        completeExchangeRequest,
        notifications,
        unreadNotifCount,
        fetchNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        fetchListingsApi,
        fetchImpactStats,
        fetchLeaderboard,
        fetchCircularSuggestions,
        fetchUserProposals,
        proposeCircularCycle,
        respondToCircularProposal,
        confirmCircularHandover,
        cancelCircularProposal
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
