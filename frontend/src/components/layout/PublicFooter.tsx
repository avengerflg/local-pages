'use client';

import Link from 'next/link';
import Image from 'next/image';

import { useState } from 'react';
import { ShieldCheck, Lock, Award, Mail, Phone, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';

export const PublicFooter = () => {
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  return (
    <footer className="bg-[#040E1E] text-white border-t border-white/10">
      
      {/* Top Trust Features Strip */}
      <div className="border-b border-white/10 bg-[#020813]">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-pink shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-heading font-bold text-xs sm:text-sm text-white">100% Verified Tradies</div>
                <div className="text-[11px] text-slate-400">ABN & license checked</div>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-heading font-bold text-xs sm:text-sm text-white">Free & Secure</div>
                <div className="text-[11px] text-slate-400">Zero middleman fees</div>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-heading font-bold text-xs sm:text-sm text-white">Australian Owned</div>
                <div className="text-[11px] text-slate-400">Local support team</div>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-blue shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-heading font-bold text-xs sm:text-sm text-white">24/7 Hotline</div>
                <div className="text-[11px] text-slate-400">1300 000 000</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-block p-2.5 bg-white rounded-2xl shadow-sm transition-transform hover:scale-105">
              <Image 
                src="/logo.jpeg" 
                alt="Local Pages Australia" 
                width={200} 
                height={65} 
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </Link>
            
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              Australia’s most dependable local trade network. We empower homeowners to find vetted plumbers, electricians, handymen, and specialists with zero friction.
            </p>

            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-pink shrink-0" />
                <span>Head Office: Sydney, NSW Australia</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-pink shrink-0" />
                <span>support@localpages.com.au</span>
              </div>
            </div>
          </div>
          
          {/* Column: Popular Trades */}
          <div className="lg:col-span-3">
            <h4 className="font-heading font-bold text-sm tracking-wider uppercase text-white mb-5">
              Popular Trades
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { name: 'Emergency Electricians', href: '/services?category=electrician' },
                { name: 'Emergency Plumbers', href: '/services?category=plumber' },
                { name: 'Air Conditioning Specialists', href: '/services?category=air-conditioning' },
                { name: 'Roof Repairs & Restorations', href: '/services?category=roofing' },
                { name: 'Carpenters & Decking', href: '/services?category=carpenter' },
                { name: 'Painters & Decorators', href: '/services?category=painter' },
                { name: 'Handymen & Maintenance', href: '/services?category=handyman' },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="text-slate-400 hover:text-brand-pink transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column: Major Cities */}
          <div className="lg:col-span-2">
            <h4 className="font-heading font-bold text-sm tracking-wider uppercase text-white mb-5">
              Coverage
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { name: 'Sydney, NSW', href: '/locations' },
                { name: 'Melbourne, VIC', href: '/locations' },
                { name: 'Brisbane, QLD', href: '/locations' },
                { name: 'Perth, WA', href: '/locations' },
                { name: 'Adelaide, SA', href: '/locations' },
                { name: 'Gold Coast, QLD', href: '/locations' },
                { name: 'Canberra, ACT', href: '/locations' },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="text-slate-400 hover:text-brand-pink transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column: For Tradies & Newsletter */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h4 className="font-heading font-bold text-sm tracking-wider uppercase text-white mb-5">
                For Trade Businesses
              </h4>
              <ul className="space-y-3 text-sm mb-6">
                <li>
                  <Link href="/register" className="font-bold text-brand-pink hover:text-brand-pink-light transition-colors">
                    List Your Business (Free) →
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-slate-400 hover:text-white transition-colors">
                    Tradie Portal Login
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-slate-400 hover:text-white transition-colors">
                    About Local Pages
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-slate-400 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-200 mb-2">
                Homeowner Newsletter
              </h5>
              <p className="text-xs text-slate-400 mb-3">
                Seasonal maintenance tips and cost saving guides.
              </p>
              {newsletterSubmitted ? (
                <div className="flex items-center gap-2 p-2.5 bg-white/10 rounded-xl text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Preview only: newsletters open soon!</span>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setNewsletterSubmitted(true); }} className="flex items-center gap-2">
                  <input 
                    type="email" 
                    placeholder="Enter email..."
                    required
                    className="w-full h-10 px-3 rounded-xl bg-white/10 text-white placeholder:text-slate-500 text-xs border border-white/10 focus:border-brand-pink outline-none"
                  />
                  <button
                    type="submit"
                    className="h-10 px-3.5 rounded-xl bg-brand-pink text-white hover:bg-brand-pink-dark transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <div>
            © 2026 Local Pages Australia. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <span className="cursor-default hover:text-slate-300 transition-colors" title="Legal policies available at platform launch">Terms of Service</span>
            <span className="cursor-default hover:text-slate-300 transition-colors" title="Legal policies available at platform launch">Privacy Policy</span>
            <span className="cursor-default hover:text-slate-300 transition-colors" title="Legal policies available at platform launch">Cookie Policy</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

