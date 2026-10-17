import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Leaf, 
  Upload, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  AlertCircle, 
  BookOpen, 
  Cpu, 
  FlaskConical, 
  PenTool, 
  Home, 
  Gift, 
  DollarSign, 
  RefreshCw,
  CheckCircle,
  X,
  Image as ImageIcon,
  Calculator
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CreateListingPage() {
  const { addListing, user, token } = useApp();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'textbooks',
    listingType: 'sell',
    price: '',
    originalPrice: '',
    desiredItems: '',
    condition: 'Like New',
    description: '',
    campus: 'COEP Technological University, Pune',
    campusSpot: 'Central Reading Hall (2nd Floor)',
    building: 'COEP Main Library',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    tags: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Preset images for realistic demo creation
  const demoImages = [
    { label: 'Nirali Textbook', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' },
    { label: 'Casio Calculator', url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80' },
    { label: 'Workshop Apron', url: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80' },
    { label: 'Omega Drafter', url: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80' },
    { label: 'Technical Pubs DSA', url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=800&q=80' },
  ];

  // Dynamic CO2 calculation based on category
  const co2Estimates = {
    'textbooks': 9.5,
    'electronics': 28.0,
    'lab-gear': 12.5,
    'stationery': 4.5,
    'dorm': 32.0,
    'giveaways': 8.0,
  };

  const estimatedCo2 = co2Estimates[formData.category] || 8.0;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, or WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setFormData(prev => ({ ...prev, imageUrl: uploadEvent.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Form validations
    if (formData.title.trim().length < 3) {
      setError('Listing title must be at least 3 characters.');
      return;
    }

    if (formData.description.trim().length < 10) {
      setError('Please provide an item description of at least 10 characters.');
      return;
    }

    const typeNormalized = formData.listingType === 'free' ? 'giveaway' : formData.listingType === 'trade' ? 'swap' : 'sell';

    if (typeNormalized === 'sell') {
      const priceVal = Number(formData.price);
      if (!priceVal || priceVal <= 0) {
        setError('Please enter a valid price greater than ₹0 for sell listings.');
        return;
      }
    }

    if (typeNormalized === 'swap' && !formData.desiredItems.trim()) {
      setError('Please specify the desired items or course gear you would like to swap for.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newListing = {
        title: formData.title.trim(),
        category: formData.category,
        listingType: typeNormalized,
        sellingPrice: typeNormalized === 'sell' ? Number(formData.price) : 0,
        price: typeNormalized === 'sell' ? Number(formData.price) : 0,
        originalPrice: Number(formData.originalPrice) || (Number(formData.price) ? Number(formData.price) * 2 : 50),
        desiredItems: typeNormalized === 'swap' ? formData.desiredItems.trim() : '',
        condition: formData.condition,
        campus: formData.campus,
        co2SavedKg: estimatedCo2,
        description: formData.description.trim(),
        images: [formData.imageUrl],
        imageUrl: formData.imageUrl,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [formData.category],
        location: {
          campusSpot: formData.campusSpot,
          building: formData.building,
          safeMeetingZone: true
        }
      };

      await addListing(newListing);
      setIsSubmitting(false);
      navigate('/marketplace');
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || 'Could not publish listing. Please check your credentials and try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#176B4D] dark:text-[#72D6A2] text-xs font-bold uppercase tracking-wider mb-1">
              <Leaf className="w-4 h-4" />
              <span>Campus Exchange Marketplace</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[var(--color-text)] tracking-tight">
              List an Item for Campus Reuse
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              Give your unused textbooks, calculators, or lab gear a second life and divert campus waste.
            </p>
          </div>

          {/* Real-time Carbon Impact Estimator Preview */}
          <div className="glass-card bg-[#176B4D] dark:bg-[#131C17] text-white p-4 rounded-2xl border border-[var(--color-border)] shadow-md flex items-center gap-3.5 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-white/20 dark:bg-emerald-950/80 text-emerald-200 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-white/20">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 dark:text-emerald-300 block">
                Estimated Offset
              </span>
              <span className="text-xl font-black text-white dark:text-emerald-300">
                -{estimatedCo2} kg CO₂
              </span>
            </div>
          </div>
        </div>

        {/* Auth / Error notice */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300 p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!token && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 p-4 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
              <span>You are currently browsing as a guest. Please sign in to link this listing to your verified campus profile.</span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-xs font-bold px-3 py-1.5 bg-amber-700 text-white rounded-xl hover:bg-amber-800 shrink-0"
            >
              Sign In
            </button>
          </div>
        )}

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 sm:p-8 border border-[var(--color-border)] space-y-8">
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-2">
              1. Item Details
            </h2>

            <div>
              <label className="block text-xs font-bold text-[var(--color-text)] uppercase tracking-wider mb-1.5">
                Listing Title * (min 3 chars)
              </label>
              <input
                type="text"
                required
                minLength={3}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Campbell Biology 12th Ed / TI-84 Plus CE / Chem Lab Coat Size M"
                className="w-full px-4 py-3 glass-panel border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-hidden focus:ring-2 focus:ring-[#176B4D]/30"
              />
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-bold text-[var(--color-text)] uppercase tracking-wider mb-2">
                Category *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'textbooks', name: 'Books & Textbooks', icon: BookOpen },
                  { id: 'electronics', name: 'Calculators & Tech', icon: Calculator },
                  { id: 'lab-gear', name: 'Lab Supplies & PPE', icon: FlaskConical },
                  { id: 'stationery', name: 'Stationery & Drafting', icon: PenTool },
                  { id: 'dorm', name: 'Other Essentials', icon: Home },
                  { id: 'giveaways', name: 'Free Giveaways', icon: Gift },
                ].map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = formData.category === cat.id;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setFormData({ ...formData, category: cat.id })}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                        isSelected
                          ? 'border-[#176B4D] dark:border-[#72D6A2] bg-emerald-500/10 text-[#176B4D] dark:text-[#72D6A2] shadow-xs'
                          : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-[#176B4D] dark:text-[#72D6A2]' : 'opacity-60'}`} />
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-xs font-bold text-[var(--color-text)] uppercase tracking-wider mb-2">
                Item Condition *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'Like New', desc: 'Flawless or barely touched' },
                  { value: 'Good', desc: 'Minor cosmetic wear, fully working' },
                  { value: 'Fair', desc: 'Noted marks/creases, totally usable' }
                ].map((cond) => {
                  const isSelected = formData.condition === cond.value;
                  return (
                    <button
                      type="button"
                      key={cond.value}
                      onClick={() => setFormData({ ...formData, condition: cond.value })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#176B4D] dark:border-[#72D6A2] bg-emerald-500/10 text-[#176B4D] dark:text-[#72D6A2]'
                          : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                      }`}
                    >
                      <span className="block text-xs font-bold">{cond.value}</span>
                      <span className="text-[11px] text-[var(--color-text-muted)] mt-0.5 block">{cond.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2: Listing Type & Pricing */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-2">
              2. Exchange Type & Pricing
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'sell', label: 'Sell for Cash', icon: DollarSign, sub: 'Set your reuse price' },
                { id: 'free', label: 'Free Giveaway', icon: Gift, sub: 'Pass forward to peers' },
                { id: 'trade', label: 'Swap / Trade', icon: RefreshCw, sub: 'Exchange for other items' }
              ].map((type) => {
                const Icon = type.icon;
                const isSelected = formData.listingType === type.id;
                return (
                  <button
                    type="button"
                    key={type.id}
                    onClick={() => {
                      setFormData({ 
                        ...formData, 
                        listingType: type.id,
                        price: type.id === 'free' ? '0' : formData.price
                      });
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#176B4D] dark:border-[#72D6A2] bg-emerald-500/10 text-[#176B4D] dark:text-[#72D6A2] ring-1 ring-[#176B4D]'
                        : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-[#176B4D] dark:text-[#72D6A2]' : 'opacity-60'}`} />
                    <span className="block text-xs font-bold">{type.label}</span>
                    <span className="text-[11px] text-[var(--color-text-muted)] block mt-0.5">{type.sub}</span>
                  </button>
                );
              })}
            </div>

            {/* If Swap: show desiredItems */}
            {formData.listingType === 'trade' && (
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl space-y-1.5 animate-in fade-in duration-200">
                <label className="block text-xs font-bold text-indigo-950 dark:text-indigo-300 uppercase tracking-wider">
                  Desired Items in Swap / Exchange *
                </label>
                <input
                  type="text"
                  required
                  value={formData.desiredItems}
                  onChange={(e) => setFormData({ ...formData, desiredItems: e.target.value })}
                  placeholder="e.g. TI-84 Plus, CHEM 102 Lab manual, Organic Chemistry model kit..."
                  className="w-full px-4 py-3 glass-panel border border-[var(--color-border)] rounded-xl text-sm font-medium text-[var(--color-text)] focus:outline-hidden"
                />
                <span className="text-[11px] text-indigo-800 dark:text-indigo-300 block">
                  Students will see what gear or course supplies you are looking to exchange for this item.
                </span>
              </div>
            )}

            {/* If Sell: show price inputs */}
            {formData.listingType === 'sell' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-[var(--color-text)] uppercase tracking-wider mb-1.5">
                    Your Selling Price (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[var(--color-text-muted)]">₹</span>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g. 250"
                      className="w-full pl-8 pr-4 py-3 glass-panel border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] focus:outline-hidden font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--color-text)] uppercase tracking-wider mb-1.5">
                    Original Retail Price (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[var(--color-text-muted)]">₹</span>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      placeholder="e.g. 650"
                      className="w-full pl-8 pr-4 py-3 glass-panel border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] focus:outline-hidden"
                    />
                  </div>
                  <span className="text-[11px] text-[var(--color-text-muted)] mt-1 block">Used to showcase student rupees saved</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Drag & Drop Image Dropzone & Preview */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-2">
              3. Item Image Upload
            </h2>

            {/* Dropzone Container */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragging 
                  ? 'border-[#176B4D] dark:border-[#72D6A2] bg-emerald-500/10 scale-101' 
                  : 'border-[var(--color-border)] hover:border-[#176B4D]/50 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              <Upload className="w-8 h-8 text-[#176B4D] dark:text-[#72D6A2] mb-2" />
              <p className="text-xs font-bold text-[var(--color-text)]">
                Drag and drop your item photo here, or click to browse
              </p>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                PNG, JPG, or WebP up to 10MB
              </p>
            </div>

            {/* Image Preview & Replacement */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <div className="w-28 h-28 rounded-2xl overflow-hidden border border-[var(--color-border)] shrink-0 bg-slate-900 relative group">
                <img
                  src={formData.imageUrl}
                  alt="Item Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' }))}
                  className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Reset to default image"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              <div className="flex-1 space-y-2 w-full">
                <label className="block text-xs font-semibold text-[var(--color-text)]">
                  Or select a realistic student essentials preset:
                </label>
                <div className="flex flex-wrap gap-2">
                  {demoImages.map((demo, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: demo.url })}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                        formData.imageUrl === demo.url
                          ? 'bg-[#176B4D] dark:bg-[#72D6A2] text-white dark:text-[#0B110E] border-transparent'
                          : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      {demo.label}
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full text-xs px-3 py-2 glass-panel border border-[var(--color-border)] rounded-lg text-[var(--color-text)]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Safe Campus Meeting Spot */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-2">
              4. Campus Safe-Exchange Location
            </h2>

            <div className="glass-panel border border-[var(--color-border)] p-4 rounded-2xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#176B4D] dark:text-[#72D6A2] shrink-0 mt-0.5" />
              <div className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                <strong className="text-[var(--color-text)] font-semibold block">Campus Safe Zone Guarantee</strong>
                All Campus Exchange handovers take place in well-lit, public university facilities with staff or campus security presence.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--color-text)] uppercase tracking-wider mb-1.5">
                  Designated Campus Building
                </label>
                <select
                  value={formData.building}
                  onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                  className="w-full px-4 py-3 glass-panel border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] focus:outline-hidden font-medium cursor-pointer"
                >
                  <option value="COEP Main Library">COEP Central Reading Hall (Pune)</option>
                  <option value="VJTI Main Quadrangle">VJTI Main Quadrangle (Mumbai)</option>
                  <option value="PICT Central Campus">PICT Student Center (Pune)</option>
                  <option value="SPPU Jayakar Library">SPPU Jayakar Library (Pune)</option>
                  <option value="WCE Administrative Building">Walchand Admin Porch (Sangli)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-text)] uppercase tracking-wider mb-1.5">
                  Specific Safe Pickup Spot
                </label>
                <input
                  type="text"
                  required
                  value={formData.campusSpot}
                  onChange={(e) => setFormData({ ...formData, campusSpot: e.target.value })}
                  placeholder="e.g. 2nd Floor Study Cafe, Ground Floor Lobby..."
                  className="w-full px-4 py-3 glass-panel border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] focus:outline-hidden font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Description & Tags */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-[var(--color-text)] border-b border-[var(--color-border)] pb-2">
              5. Description & Course Tags
            </h2>

            <div>
              <label className="block text-xs font-bold text-[var(--color-text)] uppercase tracking-wider mb-1.5">
                Item Description * (min 10 chars)
              </label>
              <textarea
                required
                rows={4}
                minLength={10}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Include course code (e.g. BIOL 1101, MATH 131), edition number, notes on highlighting, accessories included, etc."
                className="w-full px-4 py-3 glass-panel border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] focus:outline-hidden resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-text)] uppercase tracking-wider mb-1.5">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Calculus, Engineering, Pre-Med, Fall 2026"
                className="w-full px-4 py-3 glass-panel border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text)] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/marketplace')}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-[#176B4D] hover:bg-[#12563D] dark:bg-[#72D6A2] dark:hover:bg-[#8BE0B2] dark:text-[#0B110E] shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Publishing to Campus...</span>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Publish Item to Marketplace</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
