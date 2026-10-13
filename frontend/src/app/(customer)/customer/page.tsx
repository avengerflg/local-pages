'use client';

import { useAuth } from '@/providers/auth-provider';
import { useCustomerJobs, useCustomerAppointments } from '@/hooks/use-customer';
import Link from 'next/link';
import { 
  PlusCircle, 
  ArrowRight, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Zap, 
  AlertCircle, 
  Wrench, 
  ChevronRight, 
  Search, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const { data: jobs, isLoading: jobsLoading } = useCustomerJobs();
  const { data: appointments, isLoading: apptsLoading } = useCustomerAppointments();

  const activeJobs = jobs?.filter(j => j.status === 'scheduled' || j.status === 'in_progress') || [];
  const upcomingAppts = appointments?.filter(a => a.status === 'scheduled') || [];

  const quickCategories = [
    { name: 'Plumbing', slug: 'plumber', icon: '🚰', tag: 'Fast response' },
    { name: 'Electrician', slug: 'electrician', icon: '⚡', tag: '24/7 Available' },
    { name: 'Air Conditioning', slug: 'air-conditioning', icon: '❄️', tag: 'Top Rated' },
    { name: 'Roofing & Gutters', slug: 'roofing', icon: '🏠', tag: 'Inspected' },
    { name: 'Pest Control', slug: 'pest-control', icon: '🐜', tag: 'Licensed' },
    { name: 'Painter', slug: 'painter', icon: '🎨', tag: 'Free Quotes' },
  ];

  return (
    <div className="space-y-7">
      
      {/* Welcome Hero Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-9 border border-slate-200/90 shadow-[0_10px_35px_rgba(4,19,41,0.04)] relative overflow-hidden">
        {/* Subtle Ambient Decorative Gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-brand-pink/10 via-brand-pink/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-slate-700 text-xs font-semibold mb-3 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Australian Homeowner Portal</span>
              </div>
              
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight">
                Welcome back, <span className="text-brand-pink">{user?.name || 'Customer'}</span> 👋
              </h1>
              
              <p className="text-slate-500 text-xs sm:text-sm font-normal mt-1.5 max-w-xl leading-relaxed">
                Manage your service quotes, scheduled tradie visits, and connect with licensed Australian trade experts.
              </p>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-brand-pink to-[#E01E5A] hover:from-[#E01E5A] hover:to-brand-pink text-white font-heading font-extrabold text-xs sm:text-sm tracking-wide transition-all shadow-[0_8px_20px_rgba(245,43,104,0.25)] hover:shadow-[0_12px_25px_rgba(245,43,104,0.35)] cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>POST A JOB</span>
              </Link>
              
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-heading font-bold text-xs sm:text-sm transition-all shadow-xs"
              >
                <Search className="w-4 h-4 text-slate-400" />
                <span>Browse Trades</span>
              </Link>
            </div>
          </div>

          {/* Unverified Email Warning Notification */}
          {user && !user.email_verified_at && (
            <div className="mt-6 p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Please verify your email address to receive immediate SMS & email notifications when tradies quote.
                </span>
              </div>
              <button 
                onClick={() => alert('Verification email resent to ' + user.email)}
                className="inline-flex items-center gap-1 font-bold text-amber-800 hover:text-amber-950 underline underline-offset-2 shrink-0 cursor-pointer text-xs"
              >
                Resend verification email &rarr;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4 Key Vital Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Active Requests */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_8px_25px_rgba(4,19,41,0.03)] hover:border-slate-300 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Requests
            </span>
            <div className="w-9 h-9 rounded-xl bg-brand-pink/10 text-brand-pink flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-navy">
              {jobsLoading ? '—' : activeJobs.length}
            </span>
            <span className="text-xs font-medium text-slate-400">active jobs</span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Awaiting quotes</span>
            <Link href="/customer/jobs" className="text-brand-pink font-bold hover:underline inline-flex items-center gap-0.5">
              <span>View</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_8px_25px_rgba(4,19,41,0.03)] hover:border-slate-300 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Appointments
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-navy">
              {apptsLoading ? '—' : upcomingAppts.length}
            </span>
            <span className="text-xs font-medium text-slate-400">scheduled</span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Upcoming tradie visits</span>
            <Link href="/customer/appointments" className="text-brand-pink font-bold hover:underline inline-flex items-center gap-0.5">
              <span>View</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Verified Tradies In Area */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_8px_25px_rgba(4,19,41,0.03)] hover:border-slate-300 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Verified Tradies
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-navy">
              1,280+
            </span>
            <span className="text-xs font-medium text-emerald-600 font-bold">100% Vetted</span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Insured & licensed</span>
            <Link href="/services" className="text-brand-pink font-bold hover:underline inline-flex items-center gap-0.5">
              <span>Directory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Average Match Time */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_8px_25px_rgba(4,19,41,0.03)] hover:border-slate-300 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Fast Response
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-navy">
              &lt; 60s
            </span>
            <span className="text-xs font-medium text-slate-400">avg response</span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Emergency priority dispatch</span>
            <span className="text-emerald-600 font-bold">Active</span>
          </div>
        </div>

      </div>

      {/* Quick Trade Selector */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-[0_8px_25px_rgba(4,19,41,0.03)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="font-heading text-lg sm:text-xl font-bold text-brand-navy">
              Need Something Repaired or Built?
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Select a popular trade to get connected with vetted local contractors in seconds.
            </p>
          </div>
          <Link
            href="/services"
            className="text-xs font-bold text-brand-pink hover:text-[#E01E5A] inline-flex items-center gap-1 shrink-0"
          >
            <span>All 48+ Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/services/${cat.slug}`}
              className="p-3.5 rounded-2xl border border-slate-200/90 hover:border-brand-pink/50 hover:bg-brand-pink/5 transition-all group flex flex-col items-center text-center bg-slate-50/50 hover:shadow-xs"
            >
              <span className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="font-heading font-bold text-xs text-brand-navy group-hover:text-brand-pink transition-colors">
                {cat.name}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 font-medium">
                {cat.tag}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Dual Grid: Recent Requests & Scheduled Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7">
        
        {/* Left Column: Recent Requests */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-[0_8px_25px_rgba(4,19,41,0.03)] flex flex-col">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-heading text-lg font-bold text-brand-navy">
                My Service Requests
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">
                Active jobs and quote submissions
              </p>
            </div>
            <Link
              href="/customer/jobs"
              className="text-xs font-bold text-brand-pink hover:text-[#E01E5A] inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-grow">
            {jobsLoading ? (
              <div className="py-12 text-center text-slate-400 text-xs font-medium">
                Loading your service requests...
              </div>
            ) : jobs && jobs.length > 0 ? (
              <div className="space-y-3.5">
                {jobs.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-100/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-brand-pink/10 text-brand-pink text-[10px] font-bold uppercase tracking-wider mb-1.5">
                          {job.service_request?.service?.name || 'Trade Service'}
                        </span>
                        <h4 className="font-heading font-bold text-slate-900 text-sm">
                          {job.service_request?.title || `Job #${job.id}`}
                        </h4>
                      </div>
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider shrink-0 ${
                        job.status === 'scheduled' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        job.status === 'in_progress' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        job.status === 'completed' ? 'bg-slate-100 text-slate-600' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {job.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs line-clamp-2 mt-1.5 leading-relaxed">
                      {job.tradie?.business_name ? `Assigned to ${job.tradie.business_name}` : 'Awaiting tradie assignment'}
                      {job.service_request?.postcode ? ` • Postcode ${job.service_request.postcode}` : ''}
                    </p>
                    <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                      <span>
                        {job.started_at ? `Started ${new Date(job.started_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}` :
                         job.created_at ? `Created ${new Date(job.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}` :
                         `Job #${job.id}`}
                      </span>
                      <Link href="/customer/jobs" className="text-brand-pink font-bold hover:underline">
                        Check Quotes &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                  <Wrench className="w-7 h-7" />
                </div>
                <h4 className="font-heading font-bold text-slate-800 text-sm mb-1">
                  No active requests
                </h4>
                <p className="text-slate-500 text-xs max-w-xs mb-5">
                  Have a job that needs doing? Post a request to receive competitive quotes from verified local tradies.
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-heading font-bold transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-brand-pink" />
                  <span>Post Your First Job</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Scheduled Appointments */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-[0_8px_25px_rgba(4,19,41,0.03)] flex flex-col">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-heading text-lg font-bold text-brand-navy">
                Tradie Appointments
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">
                Upcoming site visits and inspections
              </p>
            </div>
            <Link
              href="/customer/appointments"
              className="text-xs font-bold text-brand-pink hover:text-[#E01E5A] inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-grow">
            {apptsLoading ? (
              <div className="py-12 text-center text-slate-400 text-xs font-medium">
                Loading appointments...
              </div>
            ) : appointments && appointments.length > 0 ? (
              <div className="space-y-3.5">
                {appointments.slice(0, 3).map((appt) => {
                  const dateObj = appt.starts_at ? new Date(appt.starts_at) : null;
                  return (
                    <div
                      key={appt.id}
                      className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="p-2.5 rounded-xl bg-brand-pink/10 border border-brand-pink/20 text-brand-pink text-center min-w-[55px]">
                          <div className="text-[10px] font-bold uppercase tracking-wider">
                            {dateObj ? dateObj.toLocaleDateString('en-AU', { month: 'short' }) : 'TBD'}
                          </div>
                          <div className="text-lg font-extrabold leading-tight">
                            {dateObj ? dateObj.getDate() : '—'}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-heading font-bold text-slate-900 text-sm">
                            {appt.service_request?.title || 'Site Inspection & Quote'}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>
                              {dateObj ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Time pending'}
                            </span>
                            <span>•</span>
                            <span>{appt.tradie?.business_name || (appt.tradie?.id ? `Tradie #${appt.tradie.id}` : 'Assigned Tradie')}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider shrink-0 ${
                        appt.status === 'scheduled' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        appt.status === 'completed' ? 'bg-slate-100 text-slate-600' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {appt.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                  <Calendar className="w-7 h-7" />
                </div>
                <h4 className="font-heading font-bold text-slate-800 text-sm mb-1">
                  No upcoming appointments
                </h4>
                <p className="text-slate-500 text-xs max-w-xs mb-5">
                  When you accept a quote from a tradie, their arrival schedule will appear here with instant reminders.
                </p>
                <Link
                  href="/customer/jobs"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-heading font-bold transition-all shadow-xs"
                >
                  <span>Review Active Requests</span>
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Safety & Homeowner Guarantee Strip */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-brand-navy to-slate-900 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-brand-pink/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-brand-pink">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Australian Fair Trading Protection</span>
            </div>
            <h3 className="font-heading text-lg sm:text-xl font-extrabold">
              Local Pages Customer Protection Standard
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Every professional on Local Pages undergoes licence checks, public liability insurance auditing, and community vetting before receiving quotes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-200">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero Middleman Markup</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Free Quote Comparison</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Direct Tradie Contact</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
