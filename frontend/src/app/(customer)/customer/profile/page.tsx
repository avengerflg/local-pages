'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { useCustomerProfile, useUpdateCustomerProfile } from '@/hooks/use-customer';
import { User, Mail, MapPin, CheckCircle2, ShieldCheck, AlertCircle, Save } from 'lucide-react';

export default function CustomerProfilePage() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useCustomerProfile();
  const updateProfile = useUpdateCustomerProfile();
  
  const [postcode, setPostcode] = useState('');
  const [address, setAddress] = useState('');
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    if (profile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPostcode(profile.postcode || '');
      setAddress(profile.address || '');
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    updateProfile.mutate({ postcode, address }, {
      onSuccess: () => {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3500);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-10 border border-slate-200/90 shadow-[0_10px_35px_rgba(4,19,41,0.04)] text-center text-slate-400">
        Loading profile information...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-9 border border-slate-200/90 shadow-[0_10px_35px_rgba(4,19,41,0.04)] max-w-4xl">
      
      {/* Header */}
      <div className="pb-6 mb-7 border-b border-slate-100">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-pink/10 text-brand-pink text-xs font-bold uppercase tracking-wider mb-2">
          <User className="w-3.5 h-3.5" />
          <span>Account Settings</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
          Your Profile & Location
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your contact credentials and default service location for accurate quote dispatch.
        </p>
      </div>

      <div className="space-y-8">
        
        {/* Account Information Section */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 sm:p-7">
          <div className="flex items-center gap-2 mb-5">
            <ShieldCheck className="w-4 h-4 text-brand-pink" />
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Account Credentials
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="flex items-center gap-2.5 p-3.5 bg-white border border-slate-200 rounded-xl text-brand-navy font-semibold text-sm">
                <User className="w-4 h-4 text-slate-400" />
                <span>{user?.name || 'Homeowner'}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl text-brand-navy font-semibold text-sm">
                <div className="flex items-center gap-2.5 truncate">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{user?.email}</span>
                </div>
                {user?.email_verified_at ? (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase shrink-0">
                    Verified
                  </span>
                ) : (
                  <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase shrink-0">
                    Unverified
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Account name and login email are managed securely via system authentication.
          </p>
        </div>

        {/* Location & Address Form */}
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-brand-pink" />
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Default Service Address
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              This address helps us find nearby tradies and accurately calculate travel dispatch.
            </p>
          </div>

          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs sm:text-sm font-medium flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Your profile address details have been updated successfully!</span>
            </div>
          )}

          {updateProfile.isError && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs sm:text-sm font-medium flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Failed to update profile. Please verify your connection and try again.</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <label htmlFor="postcode" className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
                Postcode
              </label>
              <div className="relative">
                <input
                  id="postcode"
                  type="text"
                  className="w-full px-4 py-3.5 bg-slate-50/70 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 rounded-xl text-brand-navy placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink transition-all font-medium"
                  placeholder="e.g. 2000"
                  value={postcode}
                  onChange={e => setPostcode(e.target.value)}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="address" className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
                Street Address
              </label>
              <input
                id="address"
                type="text"
                className="w-full px-4 py-3.5 bg-slate-50/70 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 rounded-xl text-brand-navy placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink transition-all font-medium"
                placeholder="e.g. 42 George Street, Sydney NSW"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={updateProfile.isPending}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-pink to-[#E01E5A] hover:from-[#E01E5A] hover:to-brand-pink text-white font-heading font-extrabold text-xs sm:text-sm tracking-wide transition-all shadow-[0_8px_20px_rgba(245,43,104,0.25)] hover:shadow-[0_12px_25px_rgba(245,43,104,0.35)] disabled:opacity-50 cursor-pointer"
            >
              {updateProfile.isPending ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>SAVING...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>SAVE CHANGES</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
