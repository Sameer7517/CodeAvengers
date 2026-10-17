import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ItemDetailModal from './components/ItemDetailModal';

// Pages
import LandingPage from './pages/LandingPage';
import MarketplacePage from './pages/MarketplacePage';
import ItemDetailPage from './pages/ItemDetailPage';
import CreateListingPage from './pages/CreateListingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ImpactPage from './pages/ImpactPage';
import CircularSwapPage from './pages/CircularSwapPage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <AppProvider>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-offwhite-100 text-slate-800 font-sans selection:bg-forest-100 selection:text-forest-900">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/item/:id" element={<ItemDetailPage />} />
              <Route path="/create" element={<CreateListingPage />} />
              <Route path="/impact" element={<ImpactPage />} />
              <Route path="/circular-swap" element={<CircularSwapPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/register" element={<AuthPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="*" element={<MarketplacePage />} />
            </Routes>
          </main>


          <Footer />

          {/* Global Item Detail Quick-View Modal */}
          <ItemDetailModal />
        </div>
      </AppProvider>
    </Router>
  );
}
