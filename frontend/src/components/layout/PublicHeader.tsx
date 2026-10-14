"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';

export const PublicHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
      <nav className="mx-auto flex max-w-[1340px] items-center justify-between px-5 lg:px-8 h-[80px] lg:h-[96px]" aria-label="Global">
        
        {/* Brand Logo - Enlarged for Strong Brand Presence */}
        <div className="flex items-center">
          <Link href="/" className="transition-transform duration-200 hover:scale-[1.02] flex items-center py-1">
            <Image 
              src="/logo.jpeg" 
              alt="Local Pages - Certified Local Trades and Services" 
              width={260} 
              height={85} 
              priority 
              className="h-13 sm:h-15 lg:h-[72px] w-auto object-contain"
            />
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-x-7 xl:gap-x-9">
          <Link 
            href="/services" 
            className="text-[15px] font-extrabold text-brand-navy hover:text-brand-pink transition-colors relative py-1 group"
          >
            Find a Trade
            <span className="absolute bottom-0 left-0 w-0 h-[2.5px] bg-brand-pink rounded-full transition-all duration-200 group-hover:w-full"></span>
          </Link>
          <Link 
            href="/#how-it-works" 
            className="text-[15px] font-extrabold text-brand-navy hover:text-brand-pink transition-colors relative py-1 group"
          >
            How It Works
            <span className="absolute bottom-0 left-0 w-0 h-[2.5px] bg-brand-pink rounded-full transition-all duration-200 group-hover:w-full"></span>
          </Link>
          <Link 
            href="/register" 
            className="text-[15px] font-extrabold text-brand-navy hover:text-brand-pink transition-colors relative py-1 group"
          >
            List Your Business
            <span className="absolute bottom-0 left-0 w-0 h-[2.5px] bg-brand-pink rounded-full transition-all duration-200 group-hover:w-full"></span>
          </Link>
          <Link 
            href="/about" 
            className="text-[15px] font-extrabold text-brand-navy hover:text-brand-pink transition-colors relative py-1 group"
          >
            About Us
            <span className="absolute bottom-0 left-0 w-0 h-[2.5px] bg-brand-pink rounded-full transition-all duration-200 group-hover:w-full"></span>
          </Link>
          <Link 
            href="/contact" 
            className="text-[15px] font-extrabold text-brand-navy hover:text-brand-pink transition-colors relative py-1 group"
          >
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-[2.5px] bg-brand-pink rounded-full transition-all duration-200 group-hover:w-full"></span>
          </Link>
        </div>

        {/* Desktop Right Side CTA */}
        <div className="hidden lg:flex lg:items-center lg:gap-5">
          {user ? (
            <Link 
              href={user.role === 'admin' ? '/admin' : '/customer'} 
              className="inline-flex items-center gap-2 text-[14px] font-bold text-brand-navy hover:text-brand-pink transition-colors px-4 py-2 rounded-xl bg-gray-50 border border-gray-200/80"
            >
              <User className="w-4 h-4 text-brand-pink" />
              <span>{user.role === 'admin' ? 'Admin Portal' : `Dashboard (${user.name?.split(' ')[0] || 'Account'})`}</span>
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="inline-flex items-center gap-1.5 text-[15px] font-bold text-brand-navy hover:text-brand-pink transition-colors px-3 py-2"
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </Link>
          )}

          <Link 
            href="/register" 
            className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-pink to-brand-pink-bright px-5 py-3 text-[14px] font-extrabold text-white shadow-[0_4px_18px_rgba(245,43,104,0.3)] hover:shadow-[0_6px_22px_rgba(245,43,104,0.45)] hover:-translate-y-[1px] transition-all duration-200 uppercase tracking-wider"
          >
            <span>List Your Business</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center gap-3">
          <Link 
            href="/register" 
            className="text-[12px] font-extrabold text-white bg-brand-pink px-3 py-2 rounded-lg uppercase tracking-wider"
          >
            List Your Business
          </Link>
          <button 
            type="button" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-xl p-2.5 text-brand-navy hover:bg-gray-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-3 text-[17px] text-brand-navy">
            <Link 
              href="/services" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-gray-100 font-extrabold flex items-center justify-between hover:text-brand-pink transition-colors"
            >
              <span>Find a Trade</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link 
              href="/#how-it-works" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-gray-100 font-extrabold hover:text-brand-pink transition-colors"
            >
              How It Works
            </Link>
            <Link 
              href="/register" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-gray-100 font-extrabold flex items-center justify-between hover:text-brand-pink transition-colors"
            >
              <span>List Your Business</span>
              <span className="text-xs bg-brand-pink/10 text-brand-pink font-bold px-2.5 py-0.5 rounded-full">Tradies</span>
            </Link>
            <Link 
              href="/about" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-gray-100 font-extrabold hover:text-brand-pink transition-colors"
            >
              About Us
            </Link>
            <Link 
              href="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 border-b border-gray-100 font-extrabold hover:text-brand-pink transition-colors"
            >
              Contact
            </Link>
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
            {user ? (
              <Link 
                href={user.role === 'admin' ? '/admin' : '/customer'} 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-50 border border-gray-200 font-bold text-brand-navy"
              >
                <User className="w-4 h-4 text-brand-pink" />
                <span>{user.role === 'admin' ? 'Admin Portal' : 'My Customer Dashboard'}</span>
              </Link>
            ) : (
              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-50 border border-gray-200 font-bold text-brand-navy"
              >
                <User className="w-4 h-4" />
                <span>Sign In to Account</span>
              </Link>
            )}

            <Link 
              href="/register" 
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-brand-pink text-white font-extrabold shadow-md uppercase tracking-wider text-sm"
            >
              <span>List Your Business</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
