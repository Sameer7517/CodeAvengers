import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, Heart, Recycle, ExternalLink, Globe, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-slate-300 border-t border-forest-800/80 mt-20">
      {/* Carbon Impact Banner Callout */}
      <div className="border-b border-forest-900 bg-forest-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-forest-800/80 border border-forest-700 flex items-center justify-center text-sage-300 shrink-0">
                <Recycle className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">100% Closed-Loop Campus</h4>
                <p className="text-xs text-sage-300/80 mt-0.5">Every exchange keeps functional gear out of student dumpsters.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-forest-800/80 border border-forest-700 flex items-center justify-center text-sage-300 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Verified Student Safety</h4>
                <p className="text-xs text-sage-300/80 mt-0.5">Exchanges occur exclusively in well-lit campus designated safe zones.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-forest-800/80 border border-forest-700 flex items-center justify-center text-sage-300 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Zero Platform Fees</h4>
                <p className="text-xs text-sage-300/80 mt-0.5">Free peer-to-peer exchanges and zero markups for campus students.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-forest-800 flex items-center justify-center text-sage-300 border border-forest-700">
                <Leaf className="w-5 h-5 text-sage-300" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Campus<span className="text-sage-400">Loop</span>
              </span>
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The hyper-local campus reuse network built for university students to exchange textbooks, lab essentials, calculators, and study supplies while shrinking our collegiate carbon footprint.
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-forest-900 border border-forest-800 text-xs text-sage-300">
                <Globe className="w-3.5 h-3.5 text-sage-400" />
                <span>Supporting UN SDG #12: Responsible Consumption & Production</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 text-sage-300">
              Exchange
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/marketplace?category=textbooks" className="hover:text-white transition-colors">
                  Textbooks & Manuals
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=electronics" className="hover:text-white transition-colors">
                  Calculators & Gear
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=lab-gear" className="hover:text-white transition-colors">
                  Lab Coats & Goggles
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=stationery" className="hover:text-white transition-colors">
                  Stationery & Drafting
                </Link>
              </li>
              <li>
                <Link to="/marketplace?type=free" className="text-sage-300 hover:text-white font-medium transition-colors">
                  Free Student Giveaways 🎁
                </Link>
              </li>
            </ul>
          </div>

          {/* Campus Guidelines */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 text-sage-300">
              Campus Safety
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">Safe Meeting Zones</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">Library & Student Union Spots</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">Condition Grading Guide</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">Eco-Karma Leaderboards</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">Zero-Tolerance Policy</span>
              </li>
            </ul>
          </div>

          {/* Hackathon Info */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 text-sage-300">
              Sustainability
            </h4>
            <div className="bg-forest-900/60 p-4 rounded-xl border border-forest-800 text-xs space-y-2.5">
              <p className="text-sage-200 font-semibold">Hackathon Prototype</p>
              <p className="text-slate-400 leading-relaxed">
                Phase 1 MVP architected for collegiate sustainability challenges.
              </p>
              <div className="pt-1 flex items-center gap-1.5 text-sage-300">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                <span>Goal: 5,000 kg CO₂ Saved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-forest-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CampusLoop. Dedicated to collegiate circular economy.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for campus climate action
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
