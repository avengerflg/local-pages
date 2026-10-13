'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { login } from '@/services/auth-api';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { UtilityBar } from '@/components/layout/UtilityBar';

export default function LoginPage() {
  const { login: setAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationErrors({});

    try {
      const data = await login({ email, password, device_name: 'web' });
      setAuth(data.token, data.user);
    } // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (err: any) {
      console.error('Login Error:', err);
      if (err.data?.errors) {
        setValidationErrors(err.data.errors);
      } else {
        setError(err.data?.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] selection:bg-brand-pink/20 selection:text-brand-pink">
      <UtilityBar />
      <PublicHeader />

      <main className="flex-grow flex items-center justify-center py-16 lg:py-24 px-5 sm:px-6 relative overflow-hidden">
        
        {/* Subtle Ambient Lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-pink/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[480px] w-full relative z-10">
          
          {/* Main Login Card - Clean Light Theme */}
          <div className="bg-white rounded-3xl p-8 sm:p-11 border border-slate-200/90 shadow-[0_20px_50px_rgba(4,19,41,0.06)] relative">
            
            {/* Top Security Badge */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-pink/10 border border-brand-pink/15 text-brand-pink text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Secure Member Portal</span>
              </div>
              
              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight leading-tight">
                Welcome <span className="text-brand-pink">Back</span>
              </h1>
              
              <p className="text-slate-500 text-xs sm:text-sm font-normal mt-2 leading-relaxed">
                Sign in to manage your quotes, bookings & trade profile
              </p>
            </div>

            {/* Error Feedback */}
            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs sm:text-sm font-medium text-center">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              
              {/* Email Bay */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4 text-brand-navy" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com.au"
                    className="w-full h-12 pl-10 pr-4 bg-slate-50/70 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 rounded-xl text-sm font-semibold text-brand-navy placeholder:text-slate-400 placeholder:font-normal outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink/60 transition-all shadow-inner"
                  />
                </div>
                {validationErrors.email && (
                  <p className="mt-1.5 text-xs text-rose-600 font-medium">
                    {validationErrors.email[0]}
                  </p>
                )}
              </div>

              {/* Password Bay */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label 
                    htmlFor="password" 
                    className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700"
                  >
                    Password
                  </label>
                  <Link 
                    href="/forgot-password" 
                    className="text-xs font-bold text-brand-pink hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-brand-navy" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-12 pl-10 pr-11 bg-slate-50/70 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 rounded-xl text-sm font-semibold text-brand-navy placeholder:text-slate-400 placeholder:font-normal outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink/60 transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-brand-pink transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="mt-1.5 text-xs text-rose-600 font-medium">
                    {validationErrors.password[0]}
                  </p>
                )}
              </div>

              {/* Remember Me Option */}
              <div className="flex items-center pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 font-medium">
                  <input 
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-pink focus:ring-brand-pink border-slate-300"
                  />
                  <span>Remember this device for 30 days</span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-brand-pink to-[#E01E5A] hover:brightness-110 text-white rounded-xl font-heading font-extrabold text-sm tracking-wide transition-all shadow-[0_8px_25px_rgba(245,43,104,0.35)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                <span>{loading ? 'Signing In...' : 'Sign In to Account'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>

            </form>

            {/* Bottom Register Switch */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-600">
              <span>Don’t have an account? </span>
              <Link 
                href="/register" 
                className="font-bold text-brand-navy hover:text-brand-pink underline underline-offset-4 decoration-slate-300 hover:decoration-brand-pink transition-colors"
              >
                Register as Tradie or Homeowner
              </Link>
            </div>

            {/* Trust Assurances */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-4 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL Secured</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-pink" />
                <span>Australian Data Privacy</span>
              </div>
            </div>

          </div>

        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
