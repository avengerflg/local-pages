'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  Briefcase,
  Layers,
  Star,
  AlertTriangle,
  ClipboardList,
  Calendar,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useAdminDashboard } from '@/hooks/use-admin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import { LoadingState } from '@/components/admin/LoadingState';
import { ErrorState } from '@/components/admin/ErrorState';

export default function AdminDashboardPage() {
  const { data: stats, isLoading, isError, refetch } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Platform Dashboard"
          description="Real-time operational metrics across customer and tradie activity."
        />
        <LoadingState message="Loading platform metrics..." />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Platform Dashboard"
          description="Real-time operational metrics across customer and tradie activity."
        />
        <ErrorState
          title="Unable to load dashboard data"
          message="Could not retrieve platform metrics from the API. Please ensure your session is active."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Platform Dashboard"
        description="Comprehensive real-time overview of users, tradie verifications, requests, and moderation."
      />

      {/* Priority Action Alerts if pending items exist */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.tradies.pending > 0 && (
          <Link
            href="/admin/tradies?verification_status=pending"
            className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 hover:bg-amber-100/60 transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-200/80 text-amber-800 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-900">
                  Pending Tradie Verifications
                </div>
                <div className="text-lg font-extrabold text-amber-950">
                  {stats.tradies.pending} tradies waiting
                </div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-amber-700 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}

        {stats.reviews.pending > 0 && (
          <Link
            href="/admin/reviews"
            className="p-4 rounded-2xl bg-pink-50 border border-pink-200/80 hover:bg-pink-100/60 transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F52B68]/15 text-[#F52B68] flex items-center justify-center font-bold">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-pink-900">
                  Reviews Awaiting Moderation
                </div>
                <div className="text-lg font-extrabold text-pink-950">
                  {stats.reviews.pending} pending reviews
                </div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#F52B68] group-hover:translate-x-1 transition-transform" />
          </Link>
        )}

        <Link
          href="/admin/review-reports"
          className="p-4 rounded-2xl bg-purple-50 border border-purple-200/80 hover:bg-purple-100/60 transition-colors flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-200/80 text-purple-800 flex items-center justify-center font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-purple-900">
                Review Disputes & Reports
              </div>
              <div className="text-xs text-purple-700 font-medium">
                Review dispute resolution
              </div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-purple-700 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Primary Key Metrics Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#172033]">
          Platform Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard
            title="Total Users"
            value={stats.users.total}
            icon={Users}
            subStats={[
              { label: 'Customers', value: stats.users.customers },
              { label: 'Tradies', value: stats.users.tradies },
              { label: 'Active', value: stats.users.active, color: 'text-emerald-600' },
              { label: 'Suspended', value: stats.users.suspended, color: 'text-rose-600' },
            ]}
          />

          <AdminStatCard
            title="Tradie Profiles"
            value={stats.tradies.total}
            icon={Briefcase}
            subStats={[
              { label: 'Verified', value: stats.tradies.verified, color: 'text-emerald-600' },
              { label: 'Pending', value: stats.tradies.pending, color: 'text-amber-600' },
              { label: 'Under Review', value: stats.tradies.under_review, color: 'text-blue-600' },
              { label: 'Rejected', value: stats.tradies.rejected, color: 'text-rose-600' },
            ]}
          />

          <AdminStatCard
            title="Service Requests"
            value={stats.service_requests.total}
            icon={ClipboardList}
            subStats={[
              { label: 'Submitted', value: stats.service_requests.submitted },
              { label: 'Matching', value: stats.service_requests.matching },
              { label: 'Quoting', value: stats.service_requests.quoting },
              { label: 'Completed', value: stats.service_requests.completed, color: 'text-emerald-600' },
            ]}
          />

          <AdminStatCard
            title="Active Services"
            value={`${stats.services.active} / ${stats.services.total}`}
            icon={Layers}
            subStats={[
              { label: 'Active Services', value: stats.services.active, color: 'text-emerald-600' },
              { label: 'Inactive', value: stats.services.inactive, color: 'text-slate-500' },
            ]}
          />
        </div>
      </div>

      {/* Operational Breakdown Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Marketplace Lifecycle Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-[#172033]">
                Workflow & Fulfillment
              </h3>
              <p className="text-xs text-[#64748B]">
                Quotes, appointments, and job execution states
              </p>
            </div>
            <span className="p-2 rounded-xl bg-slate-50 text-slate-500">
              <Calendar className="w-5 h-5" />
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs text-slate-500 font-semibold uppercase">Quotes</div>
              <div className="text-2xl font-extrabold text-[#172033] mt-1">{stats.quotes.total}</div>
              <div className="mt-2 text-[11px] text-slate-500 space-y-0.5 text-left">
                <div>Accepted: <strong className="text-emerald-600">{stats.quotes.accepted}</strong></div>
                <div>Pending: <strong>{stats.quotes.pending}</strong></div>
                <div>Rejected: <strong className="text-rose-600">{stats.quotes.rejected}</strong></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs text-slate-500 font-semibold uppercase">Appointments</div>
              <div className="text-2xl font-extrabold text-[#172033] mt-1">{stats.appointments.total}</div>
              <div className="mt-2 text-[11px] text-slate-500 space-y-0.5 text-left">
                <div>Scheduled: <strong>{stats.appointments.scheduled}</strong></div>
                <div>Completed: <strong className="text-emerald-600">{stats.appointments.completed}</strong></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs text-slate-500 font-semibold uppercase">Jobs</div>
              <div className="text-2xl font-extrabold text-[#172033] mt-1">{stats.jobs.total}</div>
              <div className="mt-2 text-[11px] text-slate-500 space-y-0.5 text-left">
                <div>In Progress: <strong>{stats.jobs.in_progress}</strong></div>
                <div>Completed: <strong className="text-emerald-600">{stats.jobs.completed}</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* Reputation & Moderation Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-[#172033]">
                Customer Reviews Moderation
              </h3>
              <p className="text-xs text-[#64748B]">
                Approval status of ratings submitted by verified customers
              </p>
            </div>
            <span className="p-2 rounded-xl bg-slate-50 text-slate-500">
              <Star className="w-5 h-5" />
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs text-slate-500 font-semibold uppercase">Total Submitted</div>
              <div className="text-2xl font-extrabold text-[#172033] mt-1">{stats.reviews.total}</div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <div className="text-xs text-emerald-700 font-semibold uppercase">Approved</div>
              <div className="text-2xl font-extrabold text-emerald-700 mt-1">{stats.reviews.approved}</div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100">
              <div className="text-xs text-amber-700 font-semibold uppercase">Pending</div>
              <div className="text-2xl font-extrabold text-amber-700 mt-1">{stats.reviews.pending}</div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Link
              href="/admin/reviews"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#071B3A] hover:bg-[#0B2342] text-white text-xs font-bold transition-colors"
            >
              <span>Moderate Pending Reviews</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
