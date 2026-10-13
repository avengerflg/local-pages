'use client';

import { useState, useEffect } from 'react';
import { resetPassword } from '@/services/auth-api';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { UtilityBar } from '@/components/layout/UtilityBar';
import Link from 'next/link';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';

export default function ResetPasswordPage() {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(params.get('token') || '');
    setEmail(params.get('email') || '');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationErrors({});
    
    try {
      await resetPassword({
        token,
        email,
        password,
        password_confirmation: passwordConfirmation
      });
      setSuccess(true);
    } // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (err: any) {
      if (err.data?.errors) {
        setValidationErrors(err.data.errors);
      } else {
        setError(err.data?.message || 'Failed to reset password.');
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

        <div className="max-w-md w-full relative z-10">
          <div className="bg-white rounded-3xl p-8 sm:p-11 border border-slate-200/90 shadow-[0_20px_50px_rgba(4,19,41,0.06)] relative">
            
            {/* Header Icon & Title */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-brand-pink/10 border border-brand-pink/15 flex items-center justify-center text-brand-pink shadow-sm">
                <KeyRound className="w-7 h-7" />
              </div>
              
              <h1 className="font-heading text-3xl font-extrabold text-brand-navy tracking-tight">
                Create New <span className="text-brand-pink">Password</span>
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm font-normal mt-2 leading-relaxed">
                Choose a strong new password for your Local Pages account
              </p>
            </div>

            {success ? (
              <div className="text-center py-4 space-y-5">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold text-brand-navy">Password Updated</h3>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1">Your password has been reset successfully.</p>
                </div>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-pink to-[#E01E5A] text-white font-heading font-bold text-sm transition-all shadow-md"
                >
                  <span>Sign In with New Password</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs sm:text-sm font-medium">
                    {error}
                  </div>
                )}
                
                {/* New Password */}
                <div>
                  <label htmlFor="password" className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1.5">
                    New Password <span className="text-brand-pink">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-10 pr-11 py-3 bg-slate-50/70 hover:bg-slate-100/60 focus:bg-white border ${
                        validationErrors.password ? 'border-rose-400' : 'border-slate-200/90'
                      } rounded-xl text-brand-navy placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink transition-all font-medium`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-brand-navy transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">{validationErrors.password[0]}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="password_confirmation" className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1.5">
                    Confirm Password <span className="text-brand-pink">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="password_confirmation"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      className="w-full pl-10 pr-11 py-3 bg-slate-50/70 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 rounded-xl text-brand-navy placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink transition-all font-medium"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-brand-navy transition-colors cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 py-4 px-6 rounded-xl bg-gradient-to-r from-brand-pink to-[#E01E5A] hover:from-[#E01E5A] hover:to-brand-pink text-white font-heading font-extrabold text-sm sm:text-base tracking-wide transition-all shadow-[0_10px_25px_rgba(245,43,104,0.25)] hover:shadow-[0_14px_30px_rgba(245,43,104,0.35)] disabled:opacity-50 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  {loading ? (
                    <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>UPDATE PASSWORD</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Security Guarantee Strip */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Bank-grade 256-bit SSL encryption</span>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
