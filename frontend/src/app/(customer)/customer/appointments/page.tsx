'use client';

import { useCustomerAppointments } from '@/hooks/use-customer';
import Link from 'next/link';
import { Calendar, Clock, ChevronRight } from 'lucide-react';

export default function CustomerAppointmentsPage() {
  const { data: appointments, isLoading } = useCustomerAppointments();

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-9 border border-slate-200/90 shadow-[0_10px_35px_rgba(4,19,41,0.04)]">
      
      {/* Header */}
      <div className="pb-6 mb-6 border-b border-slate-100">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>Tradie Calendar</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
          Upcoming Appointments
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Confirmed tradie visits, site inspections, and repair schedules.
        </p>
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-400 text-sm font-medium">
          Loading your appointments...
        </div>
      ) : appointments && appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appt) => {
            const dateObj = appt.starts_at ? new Date(appt.starts_at) : null;
            return (
              <div
                key={appt.id}
                className="bg-slate-50/70 hover:bg-slate-100/60 border border-slate-200/80 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-all"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="bg-brand-pink/10 border border-brand-pink/20 text-brand-pink p-3.5 rounded-2xl text-center min-w-[75px] shadow-xs">
                    <div className="text-[10px] font-extrabold uppercase tracking-widest">
                      {dateObj ? dateObj.toLocaleDateString('en-AU', { month: 'short' }) : 'TBD'}
                    </div>
                    <div className="text-2xl font-black leading-none mt-1">
                      {dateObj ? dateObj.getDate() : '—'}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-slate-900 text-base mb-1">
                      {appt.service_request?.title || 'Confirmed Tradie On-Site Visit'}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        {appt.job?.id ? `Job #${appt.job.id}` : `Request #${appt.request_id}`}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        {appt.tradie?.business_name || (appt.tradie?.id ? `Tradie #${appt.tradie.id}` : 'Assigned Tradie')}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-brand-pink mt-2 uppercase tracking-wide flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{dateObj ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Schedule TBD'}</span>
                    </div>
                  </div>
                </div>

                <span className={`px-3 py-1.5 text-[10px] font-bold rounded-xl uppercase tracking-wider text-center shrink-0 ${
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
        <div className="border border-dashed border-slate-200 bg-slate-50/50 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center mb-4 shadow-xs">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="font-heading text-lg font-bold text-slate-900 mb-1">
            No upcoming appointments
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm max-w-sm mb-6 leading-relaxed">
            You don&apos;t have any appointments scheduled with tradies right now. Once you accept a quote, the booking confirmation will appear here.
          </p>
          <Link
            href="/customer/jobs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-black text-white font-heading font-extrabold text-xs sm:text-sm tracking-wide"
          >
            <span>CHECK ACTIVE JOBS</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
