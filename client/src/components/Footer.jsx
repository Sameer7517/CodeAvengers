import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, Heart, Recycle, Globe, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0B110E] text-slate-300 border-t border-[rgba(210,245,220,0.12)] mt-20 transition-colors">
      {/* 3 Core Value Props Banner */}
      <div className="border-b border-white/10 bg-[#131C17]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-800/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Recycle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">1. Save Money on Essentials</h4>
                <p className="text-xs text-slate-400 mt-0.5">High textbook prices and expensive supplies become student savings.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-800/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">2. Give Pre-Loved Items a Second Life</h4>
                <p className="text-xs text-slate-400 mt-0.5">Calculators, lab gear, and textbooks stay in use instead of landfills.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-800/40 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">3. Simple & Convenient Exchanges</h4>
                <p className="text-xs text-slate-400 mt-0.5">Quick handovers at verified campus safe zones like libraries and unions.</p>
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
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#176B4D] to-[#4F8F70] flex items-center justify-center text-white">
                <Leaf className="w-5 h-5 text-emerald-200" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Campus<span className="text-[#72D6A2]">Exchange</span>
              </span>
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The modern collegiate marketplace empowering university students to list, discover, and exchange pre-owned textbooks, calculators, lab supplies, and stationery.
            </p>

            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-[11px] font-semibold text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Tagline: Reuse. Save. Grow.
              </span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-4 text-emerald-400">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/marketplace?category=textbooks" className="hover:text-emerald-300 transition-colors">
                  Books & Textbooks
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=electronics" className="hover:text-emerald-300 transition-colors">
                  Calculators & Electronics
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=lab-gear" className="hover:text-emerald-300 transition-colors">
                  Lab Supplies & Gear
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=stationery" className="hover:text-emerald-300 transition-colors">
                  Stationery & Drafting
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=dorm" className="hover:text-emerald-300 transition-colors">
                  Other Essentials
                </Link>
              </li>
              <li>
                <Link to="/marketplace?type=free" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                  Free Giveaways 🎁
                </Link>
              </li>
            </ul>
          </div>

          {/* Campus Safety */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-4 text-emerald-400">
              Campus Safety
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Designated Safe Zones</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Library & Union Meetups</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Verified Student Badges</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Zero Platform Fees</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Peer Rating & Eco-Karma</span>
              </li>
            </ul>
          </div>

          {/* Sustainability Mission */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-4 text-emerald-400">
              Our Mission
            </h4>
            <div className="bg-[#131C17] p-4 rounded-2xl border border-[rgba(210,245,220,0.12)] text-xs space-y-2">
              <p className="text-emerald-300 font-bold">Closed-Loop Education</p>
              <p className="text-slate-400 leading-relaxed">
                By recirculating high-value university supplies, we reduce campus waste and make college course materials accessible for all.
              </p>
              <div className="pt-1 flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Leaf className="w-3.5 h-3.5" />
                <span>Zero-Waste Campus Goal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Campus Exchange. All rights reserved. Built for collegiate sustainability.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-slate-400">
              Reuse. Save. Grow. <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
