'use client';

import { useCustomerJobs } from '@/hooks/use-customer';
import Link from 'next/link';
import { PlusCircle, Wrench, Clock, ChevronRight, FileText } from 'lucide-react';

export default function CustomerJobsPage() {
  const { data: jobs, isLoading } = useCustomerJobs();

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-9 border border-slate-200/90 shadow-[0_10px_35px_rgba(4,19,41,0.04)]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 mb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-pink/10 text-brand-pink text-xs font-bold uppercase tracking-wider mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Service Requests</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
            My Posted Jobs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track and manage your trade quote requests in real time.
          </p>
        </div>

        <Link
          href="/customer/requests/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-pink to-[#E01E5A] hover:from-[#E01E5A] hover:to-brand-pink text-white font-heading font-extrabold text-xs sm:text-sm tracking-wide transition-all shadow-[0_6px_18px_rgba(245,43,104,0.25)] shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>POST NEW JOB</span>
        </Link>
      </div>

      {/* Body / List */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-400 text-sm font-medium">
          Loading your service requests...
        </div>
      ) : jobs && jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-slate-50/70 hover:bg-slate-100/60 border border-slate-200/80 rounded-2xl p-5 sm:p-6 transition-all group"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-3">
                <div>
                  <span className="inline-block px-3 py-1 bg-brand-pink/10 border border-brand-pink/15 text-brand-pink text-[10px] font-bold rounded-lg uppercase tracking-wider mb-2">
                    {job.service_request?.service?.name || 'Trade Service'}
                  </span>
                  <h3 className="font-heading text-lg font-bold text-slate-900">
                    {job.service_request?.title || `Job #${job.id}`}
                  </h3>
                </div>
                
                <span className={`px-3 py-1 text-[11px] font-bold rounded-xl uppercase tracking-wider shrink-0 ${
                  job.status === 'scheduled' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                  job.status === 'in_progress' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  job.status === 'completed' ? 'bg-slate-100 text-slate-600' :
                  'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {job.status.replace('_', ' ')}
                </span>
              </div>

              <p className="text-slate-600 text-xs sm:text-sm mb-4 leading-relaxed">
                {job.tradie?.business_name ? `Assigned Tradie: ${job.tradie.business_name}` : 'Awaiting tradie assignment'}
                {job.service_request?.postcode ? ` • Suburb Postcode: ${job.service_request.postcode}` : ''}
              </p>

              <div className="flex items-center justify-between text-xs font-medium text-slate-400 border-t border-slate-200/70 pt-4">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {job.started_at ? `Started ${new Date(job.started_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}` :
                     job.created_at ? `Posted ${new Date(job.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}` :
                     `Job #${job.id}`}
                  </span>
                </span>
                
                <span className="text-brand-pink font-bold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Quotes & Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-slate-200 bg-slate-50/50 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 text-brand-pink flex items-center justify-center mb-4 shadow-xs">
            <Wrench className="w-8 h-8" />
          </div>
          <h3 className="font-heading text-lg font-bold text-slate-900 mb-1">
            No service requests yet
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm max-w-sm mb-6 leading-relaxed">
            Need emergency plumbing, roof repair, electrical wiring, or renovations? Post a job to receive direct quotes from licensed tradies.
          </p>
          <Link
            href="/customer/requests/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-pink to-[#E01E5A] text-white font-heading font-extrabold text-xs sm:text-sm tracking-wide shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>POST A JOB IN 60 SECONDS</span>
          </Link>
        </div>
      )}
    </div>
  );
}
