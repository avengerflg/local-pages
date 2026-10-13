'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, ArrowLeft, KeyRound, CheckCircle2, ShieldCheck } from 'lucide-react';
import { forgotPassword } from '@/services/auth-api';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { UtilityBar } from '@/components/layout/UtilityBar';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await forgotPassword(email);
      setSuccess(true);
    } // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (err: any) {
      setError(err.data?.message || 'Failed to send reset link.');
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
                Reset <span className="text-brand-pink">Password</span>
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm font-normal mt-2 leading-relaxed">
                Enter your email address and we&apos;ll send you a secure link to reset your password.
              </p>
            </div>

            {success ? (
              <div className="text-center py-4 space-y-5">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 text-emerald-800 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed">
                  If an account exists for <span className="font-bold text-emerald-950">{email}</span>, we have dispatched a password reset link.
                </div>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-black text-white font-heading font-bold text-sm transition-all shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs sm:text-sm font-medium">
                    {error}
                  </div>
                )}
                
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
                    Email Address <span className="text-brand-pink">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      className="w-full pl-10 pr-4 py-3.5 bg-slate-50/70 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 rounded-xl text-brand-navy placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink transition-all font-medium"
                      placeholder="name@example.com.au"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-brand-pink to-[#E01E5A] hover:from-[#E01E5A] hover:to-brand-pink text-white font-heading font-extrabold text-sm sm:text-base tracking-wide transition-all shadow-[0_10px_25px_rgba(245,43,104,0.25)] hover:shadow-[0_14px_30px_rgba(245,43,104,0.35)] disabled:opacity-50 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  {loading ? (
                    <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>SEND RESET LINK</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <div className="pt-2 text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-brand-pink transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to login</span>
                  </Link>
                </div>
              </form>
            )}

            {/* Security Guarantee Strip */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Encrypted & secure password verification</span>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
