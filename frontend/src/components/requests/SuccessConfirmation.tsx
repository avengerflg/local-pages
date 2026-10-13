'use client';

import React from 'react';
import Link from 'next/link';
import { ServiceRequest } from '@/types/api';
import { 
  CheckCircle2, 
  ArrowRight, 
  ClipboardList, 
  Clock, 
  Wrench, 
  MapPin, 
  PlusCircle, 
  ShieldCheck 
} from 'lucide-react';

interface SuccessConfirmationProps {
  request: ServiceRequest;
  onReset: () => void;
}

export function SuccessConfirmation({
  request,
  onReset,
}: SuccessConfirmationProps) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-[0_10px_35px_rgba(4,19,41,0.04)] text-center max-w-2xl mx-auto" data-testid="success-confirmation">
      
      {/* Big Animated Success Icon */}
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto mb-6 shadow-[0_10px_25px_rgba(16,185,129,0.3)] animate-bounce-short">
        <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold uppercase tracking-wider mb-3">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Request #{request.id} Submitted</span>
      </div>

      <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight mb-2">
        Your Service Request is Live!
      </h2>

      <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
        We have notified verified and licensed tradespeople in your local area. You will receive free quotes shortly.
      </p>

      {/* Request Details Box */}
      <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl text-left space-y-3 mb-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider">Status</span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold capitalize">
            {request.status}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <Wrench className="w-3.5 h-3.5 text-brand-pink" />
            <span>Service</span>
          </div>
          <span className="font-bold text-slate-900">{request.service?.name || 'Trade Service'}</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Location</span>
          </div>
          <span className="font-bold text-slate-900">
            {request.location?.name ? `${request.location.name} (${request.postcode})` : request.postcode}
          </span>
        </div>

        {request.title && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Title</span>
            <span className="font-bold text-slate-900 truncate max-w-xs">{request.title}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60 text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Submitted</span>
          </div>
          <span>{request.submitted_at ? new Date(request.submitted_at).toLocaleDateString() : 'Just now'}</span>
        </div>
      </div>

      {/* Next Steps Card */}
      <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-2xl text-left mb-8">
        <h4 className="font-heading text-xs font-bold text-blue-950 uppercase tracking-wider mb-2">
          What happens next?
        </h4>
        <ul className="text-xs text-blue-900 space-y-1.5 list-disc list-inside">
          <li>Local tradespeople will review your job requirements.</li>
          <li>You will be alerted when new quotes are submitted.</li>
          <li>Review ratings, compare prices, and confirm appointments right in your portal.</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/customer/jobs"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-pink to-[#E01E5A] hover:from-[#E01E5A] hover:to-brand-pink text-white font-heading font-extrabold text-sm tracking-wide transition-all shadow-[0_6px_20px_rgba(245,43,104,0.3)]"
          data-testid="view-requests-button"
        >
          <ClipboardList className="w-4 h-4" />
          <span>VIEW IN MY REQUESTS</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading font-bold text-sm transition-all cursor-pointer"
          data-testid="submit-another-button"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Submit Another Request</span>
        </button>
      </div>
    </div>
  );
}
