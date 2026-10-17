import React, { useState } from 'react';
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
  CheckCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CreateListingPage() {
  const { addListing, user, token } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'textbooks',
    listingType: 'sell',
    price: '',
    originalPrice: '',
    desiredItems: '',
    condition: 'Like New',
    description: '',
    campus: 'UMass Amherst',
    campusSpot: 'Main Library 2nd Floor Cafe',
    building: 'W.E.B. Du Bois Library',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    tags: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Preset images for realistic demo creation
  const demoImages = [
    { label: 'Textbook', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' },
    { label: 'Calculator', url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80' },
    { label: 'Lab Coat', url: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80' },
    { label: 'Stationery', url: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80' },
    { label: 'Art Kit', url: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80' },
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
        setError('Please enter a valid price greater than $0 for sell listings.');
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
            <div className="flex items-center gap-2 text-forest-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>Circular Campus Marketplace</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              List an Item for Campus Reuse
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Give your unused course gear a second life and divert carbon from our university.
            </p>
          </div>

          {/* Real-time Carbon Impact Estimator Preview */}
          <div className="bg-gradient-to-br from-forest-900 to-forest-950 text-white p-4 rounded-2xl border border-forest-700/80 shadow-md flex items-center gap-3.5 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-forest-800 text-emerald-400 flex items-center justify-center shrink-0 border border-forest-600">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sage-300 block">
                Estimated Offset
              </span>
              <span className="text-xl font-black text-emerald-300">
                -{estimatedCo2} kg CO₂
              </span>
            </div>
          </div>
        </div>

        {/* Auth / Error notice */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!token && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl flex items-center justify-between gap-4">
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
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200/80 shadow-xs space-y-8">
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              1. Item Details
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Listing Title * (min 3 chars)
              </label>
              <input
                type="text"
                required
                minLength={3}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Campbell Biology 12th Ed / TI-84 Plus CE / Chem Lab Coat Size M"
                className="w-full px-4 py-3 bg-offwhite-100 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-forest-600 focus:bg-white"
              />
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Category *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'textbooks', name: 'Textbooks', icon: BookOpen },
                  { id: 'electronics', name: 'Calculators & Tech', icon: Cpu },
                  { id: 'lab-gear', name: 'Lab Gear', icon: FlaskConical },
                  { id: 'stationery', name: 'Stationery & Drafting', icon: PenTool },
                  { id: 'dorm', name: 'Dorm Essentials', icon: Home },
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
                          ? 'border-forest-600 bg-forest-50 text-forest-900 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-forest-700' : 'text-slate-400'}`} />
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
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
                          ? 'border-forest-600 bg-forest-50 text-forest-900'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="block text-xs font-bold">{cond.value}</span>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">{cond.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2: Listing Type & Pricing */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              2. Exchange Type & Details
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'sell', label: 'Sell for Cash', icon: DollarSign, sub: 'Set your reuse price' },
                { id: 'free', label: '100% Free Giveaway', icon: Gift, sub: 'Zero waste pass-it-forward' },
                { id: 'trade', label: 'Course Trade / Swap', icon: RefreshCw, sub: 'Exchange for other gear' }
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
                        ? 'border-forest-600 bg-forest-50 text-forest-900 ring-1 ring-forest-600'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-forest-700' : 'text-slate-400'}`} />
                    <span className="block text-xs font-bold">{type.label}</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">{type.sub}</span>
                  </button>
                );
              })}
            </div>

            {/* If Swap: show desiredItems */}
            {formData.listingType === 'trade' && (
              <div className="p-4 bg-indigo-50/60 border border-indigo-200/80 rounded-2xl space-y-1.5 animate-in fade-in duration-200">
                <label className="block text-xs font-bold text-indigo-950 uppercase tracking-wider">
                  Desired Items for Swap / Exchange *
                </label>
                <input
                  type="text"
                  required
                  value={formData.desiredItems}
                  onChange={(e) => setFormData({ ...formData, desiredItems: e.target.value })}
                  placeholder="e.g. TI-84 Plus, CHEM 102 Lab manual, Organic Chemistry model kit..."
                  className="w-full px-4 py-3 bg-white border border-indigo-300 rounded-xl text-sm focus:outline-hidden focus:border-indigo-600 font-medium text-slate-800"
                />
                <span className="text-[11px] text-indigo-700 block">
                  Classmates will see what gear or course supplies you are looking to exchange for this item.
                </span>
              </div>
            )}

            {/* If Sell: show price inputs */}
            {formData.listingType === 'sell' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Selling Price ($) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g. 35"
                      className="w-full pl-8 pr-4 py-3 bg-offwhite-100 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-forest-600 focus:bg-white font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Original Bookstore Retail Price ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      placeholder="e.g. 150"
                      className="w-full pl-8 pr-4 py-3 bg-offwhite-100 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-forest-600 focus:bg-white"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">Used to showcase student dollars saved</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Photo Preview & Selection */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              3. Item Image
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-32 h-32 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                <img
                  src={formData.imageUrl}
                  alt="Item Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-2">
                <label className="block text-xs font-semibold text-slate-600">
                  Select a realistic demo preset image or enter image URL:
                </label>
                <div className="flex flex-wrap gap-2">
                  {demoImages.map((demo, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: demo.url })}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${
                        formData.imageUrl === demo.url
                          ? 'bg-forest-800 text-white border-forest-800'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
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
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-600"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Safe Campus Meeting Spot */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              4. Campus Safe-Exchange Location
            </h2>

            <div className="bg-sage-50/70 border border-sage-200 p-4 rounded-2xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-forest-700 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 leading-relaxed">
                <strong className="text-forest-900 font-semibold block">Campus Safe Zone Guarantee</strong>
                All CampusLoop exchanges occur in well-lit, public campus facilities with security presence.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Designated Campus Building
                </label>
                <select
                  value={formData.building}
                  onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                  className="w-full px-4 py-3 bg-offwhite-100 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-forest-600 cursor-pointer font-medium"
                >
                  <option value="W.E.B. Du Bois Library">Main Campus Library</option>
                  <option value="Student Union Complex">Student Union Atrium</option>
                  <option value="ISB Science Complex">Science Center South Lobby</option>
                  <option value="Marston Hall Engineering">Engineering Hall Commons</option>
                  <option value="Olver Design Building">Sustainability Hub Terrace</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Specific Meeting Spot
                </label>
                <input
                  type="text"
                  value={formData.campusSpot}
                  onChange={(e) => setFormData({ ...formData, campusSpot: e.target.value })}
                  placeholder="e.g. 2nd Floor Cafe / Study Pods / Front Desks"
                  className="w-full px-4 py-3 bg-offwhite-100 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-forest-600"
                />
              </div>
            </div>

            {/* Description & Course Tags */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Item Story & Course Details
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mention which course this was used for (e.g. 'Used for BIO 110 with Prof Davis', 'Clean notes included')..."
                className="w-full px-4 py-3 bg-offwhite-100 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-forest-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Calculus, STEM, Math131, TI84"
                className="w-full px-4 py-2.5 bg-offwhite-100 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-forest-600"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/marketplace')}
              className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>{isSubmitting ? 'Publishing to CampusLoop...' : 'Publish Sustainable Listing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
