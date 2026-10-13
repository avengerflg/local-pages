'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { useCreateAdminService } from '@/hooks/use-admin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

export default function AdminNewServicePage() {
  const router = useRouter();
  const createServiceMutation = useCreateAdminService();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Auto-generate slug from name if user hasn't explicitly edited slug
  const handleNameChange = (val: string) => {
    setName(val);
    const generated = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setSlug(generated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError(null);

    if (!name.trim()) {
      setFieldErrors({ name: ['Service name is required.'] });
      return;
    }

    try {
      const created = await createServiceMutation.mutateAsync({
        name: name.trim(),
        slug: slug.trim() || undefined,
        description: description.trim() || undefined,
        status,
      });

      router.push(`/admin/services/${created.id}`);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'data' in err) {
        const apiErr = (err as { data?: { message?: string; errors?: Record<string, string[]> } }).data;
        if (apiErr?.errors) {
          setFieldErrors(apiErr.errors);
        }
        if (apiErr?.message) {
          setGeneralError(apiErr.message);
        }
      } else {
        setGeneralError('Failed to create service. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <AdminPageHeader
        title="Create New Service"
        description="Add a trade category or service offering to the marketplace catalog."
        breadcrumbs={[
          { label: 'Services', href: '/admin/services' },
          { label: 'New Service' },
        ]}
      />

      {generalError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{generalError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Service Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Emergency Plumbing, Solar Panel Installation"
            className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F52B68]/20 transition-all ${
              fieldErrors.name ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200 focus:border-[#F52B68]'
            }`}
          />
          {fieldErrors.name && (
            <p className="mt-1 text-xs text-rose-600 font-medium">
              {fieldErrors.name.join(' ')}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            URL Slug
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. emergency-plumbing"
            className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-mono text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F52B68]/20 transition-all ${
              fieldErrors.slug ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200 focus:border-[#F52B68]'
            }`}
          />
          {fieldErrors.slug && (
            <p className="mt-1 text-xs text-rose-600 font-medium">
              {fieldErrors.slug.join(' ')}
            </p>
          )}
          <p className="mt-1 text-[11px] text-slate-400">
            Leave blank or customize. Will be used in customer URLs: /services/[slug].
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Description
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed overview of what this trade includes, scope of work, etc."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F52B68]/20 focus:border-[#F52B68] transition-all resize-y"
          />
          {fieldErrors.description && (
            <p className="mt-1 text-xs text-rose-600 font-medium">
              {fieldErrors.description.join(' ')}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#F52B68]/20 focus:border-[#F52B68] cursor-pointer"
          >
            <option value="active">Active (Available immediately)</option>
            <option value="inactive">Inactive (Draft / Hidden)</option>
          </select>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <Link
            href="/admin/services"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel</span>
          </Link>

          <button
            type="submit"
            disabled={createServiceMutation.isPending}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#F52B68] hover:bg-[#E01E5A] text-white text-xs font-bold transition-all shadow-[0_4px_14px_rgba(245,43,104,0.3)] disabled:opacity-50 cursor-pointer"
          >
            {createServiceMutation.isPending ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save & Configure Questions</span>
          </button>
        </div>
      </form>
    </div>
  );
}
