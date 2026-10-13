'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { registerCustomer } from '@/services/auth-api';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { UtilityBar } from '@/components/layout/UtilityBar';

export default function RegisterPage() {
  const { login: setAuth } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    password_confirmation: '',
    postcode: '',
    address: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationErrors({});

    try {
      const data = await registerCustomer(formData);
      setAuth(data.token, data.user);
    } // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (err: any) {
      console.error('Register Error:', err);
      if (err.data?.errors) {
        setValidationErrors(err.data.errors);
      } else {
        setError(err.data?.message || 'Registration failed. Please check your information.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] selection:bg-brand-pink/20 selection:text-brand-pink">
      <UtilityBar />
      <PublicHeader />

      <main className="flex-grow flex items-center justify-center py-14 lg:py-20 px-5 sm:px-6 relative overflow-hidden">
        
        {/* Subtle Ambient Lighting Accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-pink/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl w-full relative z-10">
          
          {/* Main Register Card - Clean Light Theme */}
          <div className="bg-white rounded-3xl p-8 sm:p-11 border border-slate-200/90 shadow-[0_20px_50px_rgba(4,19,41,0.06)] relative">
            
            {/* Header / Security Badge */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-pink/10 border border-brand-pink/15 text-brand-pink text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Join Australia’s Trusted Network</span>
              </div>
              
              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight leading-tight">
                Create an <span className="text-brand-pink">Account</span>
              </h1>
              
              <p className="text-slate-500 text-xs sm:text-sm font-normal mt-2 leading-relaxed">
                Connect directly with verified local trades with zero middleman fees
              </p>
            </div>

            {/* Error Feedback */}
            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs sm:text-sm font-medium text-center">
                {error}
              </div>
            )}

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              
              {/* Full Name */}
              <div>
                <label 
                  htmlFor="name" 
                  className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                  Full Name <span className="text-brand-pink">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4 text-brand-navy" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. David Miller"
                    className="w-full h-12 pl-10 pr-4 bg-slate-50/70 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 rounded-xl text-sm font-semibold text-brand-navy placeholder:text-slate-400 placeholder:font-normal outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink/60 transition-all shadow-inner"
                  />
                </div>
                {validationErrors.name && (
                  <p className="mt-1.5 text-xs text-rose-600 font-medium">
                    {validationErrors.name[0]}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                  Email Address <span className="text-brand-pink">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4 text-brand-navy" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="david@example.com.au"
                    className="w-full h-12 pl-10 pr-4 bg-slate-50/70 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 rounded-xl text-sm font-semibold text-brand-navy placeholder:text-slate-400 placeholder:font-normal outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink/60 transition-all shadow-inner"
                  />
                </div>
                {validationErrors.email && (
                  <p className="mt-1.5 text-xs text-rose-600 font-medium">
                    {validationErrors.email[0]}
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label 
                  htmlFor="mobile" 
                  className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5"
                >
                  Mobile Number
                </label>
                <div className="relative flex items-center">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4 text-brand-navy" />
                  </div>
                  <input
                    id="mobile"
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="0400 000 000"
                    className="w-full h-12 pl-10 pr-4 bg-slate-50/70 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 rounded-xl text-sm font-semibold text-brand-navy placeholder:text-slate-400 placeholder:font-normal outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink/60 transition-all shadow-inner"
                  />
                </div>
                {validationErrors.mobile && (
                  <p className="mt-1.5 text-xs text-rose-600 font-medium">
                    {validationErrors.mobile[0]}
                  </p>
                )}
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label 
                    htmlFor="password" 
                    className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5"
                  >
                    Password <span className="text-brand-pink">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4 text-brand-navy" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full h-12 pl-10 pr-10 bg-slate-50/70 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 rounded-xl text-sm font-semibold text-brand-navy placeholder:text-slate-400 placeholder:font-normal outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink/60 transition-all shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-brand-pink transition-colors"
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

                <div>
                  <label 
                    htmlFor="password_confirmation" 
                    className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5"
                  >
                    Confirm Password <span className="text-brand-pink">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4 text-brand-navy" />
                    </div>
                    <input
                      id="password_confirmation"
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="password_confirmation"
                      required
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full h-12 pl-10 pr-10 bg-slate-50/70 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 rounded-xl text-sm font-semibold text-brand-navy placeholder:text-slate-400 placeholder:font-normal outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink/60 transition-all shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-brand-pink transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Postcode & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label 
                    htmlFor="postcode" 
                    className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5"
                  >
                    Postcode
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <MapPin className="w-4 h-4 text-brand-navy" />
                    </div>
                    <input
                      id="postcode"
                      type="text"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleChange}
                      placeholder="2000"
                      className="w-full h-12 pl-9 pr-3 bg-slate-50/70 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 rounded-xl text-sm font-semibold text-brand-navy placeholder:text-slate-400 placeholder:font-normal outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink/60 transition-all shadow-inner"
                    />
                  </div>
                  {validationErrors.postcode && (
                    <p className="mt-1.5 text-xs text-rose-600 font-medium">
                      {validationErrors.postcode[0]}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label 
                    htmlFor="address" 
                    className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1.5"
                  >
                    Street Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g. 123 George St"
                    className="w-full h-12 px-4 bg-slate-50/70 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 rounded-xl text-sm font-semibold text-brand-navy placeholder:text-slate-400 placeholder:font-normal outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink/60 transition-all shadow-inner"
                  />
                  {validationErrors.address && (
                    <p className="mt-1.5 text-xs text-rose-600 font-medium">
                      {validationErrors.address[0]}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-brand-pink to-[#E01E5A] hover:brightness-110 text-white rounded-xl font-heading font-extrabold text-sm tracking-wide transition-all shadow-[0_8px_25px_rgba(245,43,104,0.35)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
              >
                <span>{loading ? 'Creating Account...' : 'Create Free Account'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>

            </form>

            {/* Bottom Login Switch */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-600">
              <span>Already have an account? </span>
              <Link 
                href="/login" 
                className="font-bold text-brand-navy hover:text-brand-pink underline underline-offset-4 decoration-slate-300 hover:decoration-brand-pink transition-colors"
              >
                Log in here
              </Link>
            </div>

            {/* Trust Assurances */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL Secured</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-pink" />
                <span>100% Free for Homeowners</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Privacy Compliant</span>
              </div>
            </div>

          </div>

        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
