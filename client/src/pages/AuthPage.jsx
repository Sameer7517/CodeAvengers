import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Leaf, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  
  const { login, register, showToast } = useApp();
  const navigate = useNavigate();

  // Form State
  const [email, setEmail] = useState('s.rodriguez@campus.edu');
  const [password, setPassword] = useState('CampusLoop2026!');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Environmental Studies');
  const [year, setYear] = useState('Junior (3rd Year)');
  const [campus, setCampus] = useState('North Campus');
  const [pledgeAccepted, setPledgeAccepted] = useState(true);

  // Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Registration Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!pledgeAccepted) {
      setErrorMessage('Please accept the campus circular sustainability pledge.');
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        name,
        email,
        password,
        department,
        year,
        campus
      });
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Demo 1-Click Login for Hackathon Judges
  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await login(demoEmail, demoPassword);
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Demo login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEduEmail = email.toLowerCase().includes('.edu') || email.toLowerCase().includes('.ac.');

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      {/* Brand Header */}
      <div className="text-center mb-8 space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#176B4D] dark:bg-[#72D6A2] text-white dark:text-[#0B110E] flex items-center justify-center mx-auto shadow-md">
          <Leaf className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-[var(--color-text)] tracking-tight">
          {mode === 'login' ? 'Welcome Back to Campus Exchange' : 'Join the Campus Exchange'}
        </h1>
        <p className="text-xs text-[var(--color-text-muted)] font-medium">
          Reuse. Save. Grow. — The sustainable student reuse network
        </p>
      </div>

      {/* Main Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[var(--color-border)] shadow-xs space-y-6">
        {/* Quick Demo Access Callouts for Judges */}
        <div className="glass-panel border border-[var(--color-border)] p-4 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--color-text)]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Demo Test Accounts
            </span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">
              JWT + Express
            </span>
          </div>
          <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
            Test authentication with pre-seeded student accounts:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleDemoLogin('s.rodriguez@campus.edu', 'CampusLoop2026!')}
              className="py-2 px-3 rounded-xl bg-forest-800 text-white text-[11px] font-bold hover:bg-forest-900 transition-colors shadow-xs flex items-center justify-center gap-1 disabled:opacity-60"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sage-300" />
              <span>Verified Student</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleDemoLogin('guest.student@gmail.com', 'CampusLoop2026!')}
              className="py-2 px-3 rounded-xl bg-white text-slate-700 border border-slate-300 text-[11px] font-bold hover:bg-slate-50 transition-colors shadow-xs flex items-center justify-center gap-1 disabled:opacity-60"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Unverified User</span>
            </button>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 p-1 bg-offwhite-100 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage('');
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-white text-forest-950 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Student Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage('');
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-white text-forest-950 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Notification Alert */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl flex items-start gap-2.5 text-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block">Authentication Notice</span>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={mode === 'login' ? handleLoginSubmit : handleRegisterSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Samira Rodriguez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-offwhite-100 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-forest-600 focus:bg-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Campus Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="your.name@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-offwhite-100 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-forest-600 focus:bg-white"
              />
            </div>
            {mode === 'register' && (
              <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                {isEduEmail ? (
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Collegiate domain recognized — your account will be verified!
                  </span>
                ) : (
                  <span className="text-amber-700 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    Non-college email will remain unverified until student ID check.
                  </span>
                )}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="•••••••• (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-offwhite-100 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-forest-600 focus:bg-white"
              />
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-2.5 py-2 bg-offwhite-100 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-forest-600"
                  >
                    <option>Environmental Studies</option>
                    <option>Biological Sciences</option>
                    <option>Computer Science</option>
                    <option>Engineering</option>
                    <option>Architecture & Design</option>
                    <option>Business / Economics</option>
                    <option>General Studies</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Year of Study
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-2.5 py-2 bg-offwhite-100 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-forest-600"
                  >
                    <option>Freshman (1st Year)</option>
                    <option>Sophomore (2nd Year)</option>
                    <option>Junior (3rd Year)</option>
                    <option>Senior (4th Year)</option>
                    <option>Graduate Student</option>
                  </select>
                </div>
              </div>

              {/* Sustainability Pledge */}
              <label className="flex items-start gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={pledgeAccepted}
                  onChange={(e) => setPledgeAccepted(e.target.checked)}
                  className="mt-0.5 rounded text-forest-800 focus:ring-forest-600"
                />
                <span className="text-[11px] text-slate-600 leading-tight">
                  I pledge to keep reusable goods in campus circulation and meet only in designated public safe zones.
                </span>
              </label>
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-forest-800 hover:bg-forest-900 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 mt-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-sage-300" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In to CampusLoop' : 'Create Student Profile'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-sage-300" />
              </>
            )}
          </button>
        </form>

        {/* Verification transparency notice */}
        <div className="pt-2 border-t border-slate-100 text-center text-[10px] text-slate-400 leading-relaxed">
          🔒 Secure bcrypt password hashing & JWT session authentication.<br />
          Official verified badges require an accredited collegiate email.
        </div>
      </div>
    </div>
  );
}
