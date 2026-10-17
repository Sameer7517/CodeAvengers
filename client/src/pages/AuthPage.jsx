import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Leaf, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  
  const { login, user, showToast } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('s.rodriguez@campus.edu');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Environmental Studies');
  const [year, setYear] = useState('Junior (3rd Year)');
  const [pledgeAccepted, setPledgeAccepted] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email);
    navigate('/dashboard');
  };

  const handleDemoLogin = () => {
    login('s.rodriguez@campus.edu');
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      {/* Brand Header */}
      <div className="text-center mb-8 space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-forest-800 text-white flex items-center justify-center mx-auto shadow-md">
          <Leaf className="w-6 h-6 text-sage-300" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          {mode === 'login' ? 'Welcome Back to CampusLoop' : 'Join the Circular Campus'}
        </h1>
        <p className="text-xs text-slate-500">
          The official sustainable reuse network for campus students
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage-200/80 shadow-xs space-y-6">
        {/* Quick Demo Access Callout for Hackathon Judges */}
        <div className="bg-forest-50 border border-forest-200 p-4 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-forest-900">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Hackathon Quick Test
            </span>
            <span className="text-[10px] bg-forest-200/60 px-2 py-0.5 rounded text-forest-800">
              1-Click Demo
            </span>
          </div>
          <p className="text-[11px] text-forest-700">
            Click below to instantly log in as a verified student demo account with 485 Eco-Karma.
          </p>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2 px-3 rounded-xl bg-forest-800 text-white text-xs font-bold hover:bg-forest-900 transition-colors shadow-xs"
          >
            Sign In with Demo Student Profile
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 p-1 bg-offwhite-100 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode('login')}
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
            onClick={() => setMode('register')}
            className={`py-2 rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-white text-forest-950 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
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
              Campus Email (.edu)
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
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
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
                    <option>Biological Sciences</option>
                    <option>Computer Science</option>
                    <option>Engineering</option>
                    <option>Environmental Studies</option>
                    <option>Architecture & Design</option>
                    <option>Business / Economics</option>
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
            className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-forest-800 hover:bg-forest-900 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 mt-2"
          >
            <span>{mode === 'login' ? 'Sign In to CampusLoop' : 'Create Student Profile'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-sage-300" />
          </button>
        </form>

        {/* Security badge */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
          <span>Restricted to accredited university email addresses</span>
        </div>
      </div>
    </div>
  );
}
