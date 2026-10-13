'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, UserCheck, Filter } from 'lucide-react';
import { useAdminUsers } from '@/hooks/use-admin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminSearch } from '@/components/admin/AdminSearch';
import { AdminPagination } from '@/components/admin/AdminPagination';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { LoadingState } from '@/components/admin/LoadingState';
import { EmptyState } from '@/components/admin/EmptyState';
import { ErrorState } from '@/components/admin/ErrorState';

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');

  const { data, isLoading, isError, refetch } = useAdminUsers({
    page,
    per_page: 15,
    search: search || undefined,
    role: role || undefined,
    status: status || undefined,
  });

  const handleSearchChange = (term: string) => {
    setSearch(term);
    setPage(1);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="User Management"
        description="View and manage customer, tradie, and administrator accounts."
        breadcrumbs={[{ label: 'Users' }]}
      />

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <AdminSearch
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by user name or email..."
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={role}
              onChange={handleRoleChange}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#F52B68]/20 focus:border-[#F52B68] cursor-pointer"
              aria-label="Filter by role"
            >
              <option value="">All Roles</option>
              <option value="customer">Customers</option>
              <option value="tradie">Tradies</option>
              <option value="admin">Administrators</option>
            </select>
          </div>

          <select
            value={status}
            onChange={handleStatusChange}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#F52B68]/20 focus:border-[#F52B68] cursor-pointer"
            aria-label="Filter by status"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {isLoading ? (
          <LoadingState message="Loading users list..." />
        ) : isError ? (
          <ErrorState
            title="Failed to load users"
            message="Unable to fetch user list from the API."
            onRetry={() => refetch()}
          />
        ) : !data || data.data.length === 0 ? (
          <EmptyState
            title="No users match your criteria"
            description="Try adjusting your search query or filters to find what you're looking for."
            icon={UserCheck}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-3.5">User</th>
                    <th className="px-5 py-3.5">Role</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Phone / Mobile</th>
                    <th className="px-5 py-3.5">Registered</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.data.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="font-bold text-[#172033]">{user.name}</div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={user.role} variant={user.role} />
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={user.status} variant={user.status} />
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {user.mobile || '—'}
                      </td>
                      <td className="px-5 py-4 text-slate-500 text-xs">
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString()
                          : '—'}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <AdminPagination
              currentPage={data.meta.current_page}
              lastPage={data.meta.last_page}
              total={data.meta.total}
              perPage={data.meta.per_page}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
