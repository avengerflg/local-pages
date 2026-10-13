'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Save,
  Plus,
  Edit2,
  HelpCircle,
} from 'lucide-react';
import {
  useAdminService,
  useUpdateAdminService,
  useAdminServiceQuestions,
  useCreateAdminServiceQuestion,
  useUpdateAdminServiceQuestion,
  useCreateAdminQuestionOption,
} from '@/hooks/use-admin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { LoadingState } from '@/components/admin/LoadingState';
import { ErrorState } from '@/components/admin/ErrorState';
import { EmptyState } from '@/components/admin/EmptyState';
import {
  AdminQuestionType,
  AdminService,
  AdminServiceQuestion,
} from '@/types/admin';

interface ServiceConfigSectionProps {
  service: AdminService;
  serviceId: number;
}

function ServiceConfigSection({ service, serviceId }: ServiceConfigSectionProps) {
  const updateServiceMutation = useUpdateAdminService();

  const [name, setName] = useState(service.name || '');
  const [slug, setSlug] = useState(service.slug || '');
  const [description, setDescription] = useState(service.description || '');
  const [status, setStatus] = useState<'active' | 'inactive'>(service.status || 'active');
  const [serviceFeedback, setServiceFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServiceFeedback(null);

    try {
      await updateServiceMutation.mutateAsync({
        id: serviceId,
        data: {
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim() || undefined,
          status,
        },
      });
      setServiceFeedback({
        type: 'success',
        message: 'Service details updated successfully.',
      });
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { message?: string } }).data?.message || 'Failed to update service.'
          : 'Failed to update service.';
      setServiceFeedback({ type: 'error', message: errorMsg });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-[#172033]">
            Service Configuration
          </h3>
          <p className="text-xs text-[#64748B]">
            Public title, URL routing slug, and directory availability.
          </p>
        </div>
        <StatusBadge status={service.status} variant={service.status} />
      </div>

      {serviceFeedback && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between ${
            serviceFeedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{serviceFeedback.message}</span>
          <button
            onClick={() => setServiceFeedback(null)}
            className="underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleServiceSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Service Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F52B68]/20 focus:border-[#F52B68] transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F52B68]/20 focus:border-[#F52B68] transition-all"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F52B68]/20 focus:border-[#F52B68] transition-all resize-y"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#F52B68]/20 focus:border-[#F52B68] cursor-pointer"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={updateServiceMutation.isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#071B3A] hover:bg-[#0B2342] text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Service Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminServiceDetailPage() {
  const params = useParams();
  const serviceId = Number(params.id);

  const { data: service, isLoading, isError, refetch } = useAdminService(serviceId);
  const { data: questions, isLoading: qLoading } = useAdminServiceQuestions(serviceId);

  const createQuestionMutation = useCreateAdminServiceQuestion(serviceId);
  const updateQuestionMutation = useUpdateAdminServiceQuestion(serviceId);
  const createOptionMutation = useCreateAdminQuestionOption(serviceId);

  // New question form modal/drawer state
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<AdminServiceQuestion | null>(null);
  const [qText, setQText] = useState('');
  const [qType, setQType] = useState<AdminQuestionType>('single_choice');
  const [qRequired, setQRequired] = useState(true);
  const [qSortOrder, setQSortOrder] = useState(0);
  const [qDependsOn, setQDependsOn] = useState<number | ''>('');
  const [qParentOptionId, setQParentOptionId] = useState<number | ''>('');
  const [qError, setQError] = useState<string | null>(null);

  // Adding option modal state
  const [addingOptionQId, setAddingOptionQId] = useState<number | null>(null);
  const [optLabel, setOptLabel] = useState('');
  const [optValue, setOptValue] = useState('');
  const [optSortOrder, setOptSortOrder] = useState(0);
  const [optError, setOptError] = useState<string | null>(null);

  const openAddQuestion = () => {
    setEditingQuestion(null);
    setQText('');
    setQType('single_choice');
    setQRequired(true);
    setQSortOrder((questions?.length ?? 0) * 10);
    setQDependsOn('');
    setQParentOptionId('');
    setQError(null);
    setIsAddingQuestion(true);
  };

  const openEditQuestion = (q: AdminServiceQuestion) => {
    setEditingQuestion(q);
    setQText(q.question_text);
    setQType(q.question_type as AdminQuestionType);
    setQRequired(q.required);
    setQSortOrder(q.sort_order);
    const rule = q.conditional_rule;
    const parentId = rule?.depends_on_question_id ?? rule?.parent_question_id;
    const parentOpt = rule?.selected_option_id ?? rule?.parent_option_id;
    setQDependsOn(parentId ? Number(parentId) : '');
    setQParentOptionId(parentOpt ? Number(parentOpt) : '');
    setQError(null);
    setIsAddingQuestion(true);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setQError(null);

    if (!qText.trim()) {
      setQError('Question prompt text is required.');
      return;
    }

    let conditionalRule: Record<string, unknown> | null = null;
    if (qDependsOn) {
      conditionalRule = {
        depends_on_question_id: Number(qDependsOn),
      };
      if (qParentOptionId) {
        conditionalRule.selected_option_id = Number(qParentOptionId);
      }
    }

    try {
      if (editingQuestion) {
        await updateQuestionMutation.mutateAsync({
          questionId: editingQuestion.id,
          data: {
            question_text: qText.trim(),
            question_type: qType,
            required: qRequired,
            sort_order: qSortOrder,
            conditional_rule: conditionalRule,
          },
        });
      } else {
        await createQuestionMutation.mutateAsync({
          question_text: qText.trim(),
          question_type: qType,
          required: qRequired,
          sort_order: qSortOrder,
          conditional_rule: conditionalRule,
          status: 'active',
        });
      }
      setIsAddingQuestion(false);
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { message?: string } }).data?.message || 'Failed to save question.'
          : 'Failed to save question.';
      setQError(errorMsg);
    }
  };

  const openAddOption = (questionId: number) => {
    setAddingOptionQId(questionId);
    setOptLabel('');
    setOptValue('');
    const targetQ = questions?.find((q) => q.id === questionId);
    setOptSortOrder((targetQ?.options?.length ?? 0) * 10);
    setOptError(null);
  };

  const handleSaveOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingOptionQId) return;
    setOptError(null);

    if (!optLabel.trim()) {
      setOptError('Option label is required.');
      return;
    }

    const valueToSave = optValue.trim() || optLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_');

    try {
      await createOptionMutation.mutateAsync({
        questionId: addingOptionQId,
        data: {
          label: optLabel.trim(),
          value: valueToSave,
          sort_order: optSortOrder,
        },
      });
      setAddingOptionQId(null);
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === 'object' && 'data' in err
          ? (err as { data?: { message?: string } }).data?.message || 'Failed to save option.'
          : 'Failed to save option.';
      setOptError(errorMsg);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Service Details"
          breadcrumbs={[{ label: 'Services', href: '/admin/services' }, { label: 'Loading...' }]}
        />
        <LoadingState message="Loading service details..." />
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Service Not Found"
          breadcrumbs={[{ label: 'Services', href: '/admin/services' }, { label: 'Not Found' }]}
        />
        <ErrorState
          title="Service could not be loaded"
          message="Could not find the requested service entry."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  // Parent questions available for conditional rule dropdown
  const potentialParentQuestions = (questions || []).filter(
    (q) =>
      (!editingQuestion || q.id !== editingQuestion.id) &&
      (q.question_type === 'single_choice' || q.question_type === 'multiple_choice')
  );

  const selectedParentQuestion = potentialParentQuestions.find((q) => q.id === Number(qDependsOn));

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={service.name}
        description={`Manage service metadata, catalog settings, and customer request intake questions.`}
        breadcrumbs={[
          { label: 'Services', href: '/admin/services' },
          { label: service.name },
        ]}
      />

      {/* Service Details Form */}
      <ServiceConfigSection service={service} serviceId={serviceId} />

      {/* Service Questions & Options Bay */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-[#172033]">
              Intake Questions & Conditional Logic ({questions?.length ?? 0})
            </h3>
            <p className="text-xs text-[#64748B]">
              Questions presented to customers during the Phase F5 service request intake wizard.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddQuestion}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F52B68] hover:bg-[#E01E5A] text-white text-xs font-bold transition-all shadow-[0_4px_14px_rgba(245,43,104,0.3)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
        </div>

        {qLoading ? (
          <LoadingState message="Loading questions..." />
        ) : !questions || questions.length === 0 ? (
          <EmptyState
            title="No questions defined yet"
            description="Customers will only be asked for location and general description unless trade-specific questions are configured."
            icon={HelpCircle}
            action={
              <button
                type="button"
                onClick={openAddQuestion}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F52B68] text-white text-xs font-bold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Question</span>
              </button>
            }
          />
        ) : (
          <div className="space-y-4">
            {questions
              .slice()
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((q, idx) => (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-[#071B3A] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="font-bold text-[#172033] text-sm">
                          {q.question_text}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500">
                          <span className="font-semibold text-slate-700 capitalize">
                            Type: {q.question_type.replace(/_/g, ' ')}
                          </span>
                          <span>•</span>
                          <span>{q.required ? 'Required' : 'Optional'}</span>
                          <span>•</span>
                          <span>Order: #{q.sort_order}</span>
                          {q.conditional_rule && (
                            <>
                              <span>•</span>
                              <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-semibold border border-amber-200/80 text-[11px]">
                                Conditional (Parent #{q.conditional_rule.depends_on_question_id ?? q.conditional_rule.parent_question_id})
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => openEditQuestion(q)}
                      className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>

                  {/* Options List if single_choice or multiple_choice */}
                  {(q.question_type === 'single_choice' ||
                    q.question_type === 'multiple_choice') && (
                    <div className="pt-3 border-t border-slate-200/60">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider text-[11px]">
                          Selectable Options ({q.options?.length ?? 0})
                        </span>
                        <button
                          type="button"
                          onClick={() => openAddOption(q.id)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#F52B68] hover:underline cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Option</span>
                        </button>
                      </div>

                      {!q.options || q.options.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">
                          No choices defined. Customers won&apos;t be able to select anything until choices are added.
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {q.options
                            .slice()
                            .sort((a, b) => a.sort_order - b.sort_order)
                            .map((opt) => (
                              <span
                                key={opt.id}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs"
                              >
                                <span>{opt.label}</span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  ({opt.value})
                                </span>
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Add / Edit Question Modal */}
      {isAddingQuestion && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071B3A]/60 backdrop-blur-xs"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-[#172033]">
              {editingQuestion ? 'Edit Service Question' : 'Add New Service Question'}
            </h3>

            {qError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                {qError}
              </div>
            )}

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Question Text *
                </label>
                <input
                  type="text"
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder="e.g. What type of hot water system do you need?"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F52B68]/20 focus:border-[#F52B68]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Question Type
                  </label>
                  <select
                    value={qType}
                    onChange={(e) => setQType(e.target.value as AdminQuestionType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    <option value="single_choice">Single Choice (Radio)</option>
                    <option value="multiple_choice">Multiple Choice (Checkbox)</option>
                    <option value="text">Free Text Input</option>
                    <option value="file_upload">Document Upload</option>
                    <option value="image_upload">Photo Upload</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={qSortOrder}
                    onChange={(e) => setQSortOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="q_req"
                  checked={qRequired}
                  onChange={(e) => setQRequired(e.target.checked)}
                  className="w-4 h-4 rounded text-[#F52B68] focus:ring-[#F52B68]"
                />
                <label htmlFor="q_req" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Required question (customer must answer before continuing)
                </label>
              </div>

              {/* Conditional Display Rule */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                  Conditional Visibility (Optional)
                </span>
                <p className="text-[11px] text-slate-500">
                  Only display this question when a previous question matches a specific answer.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">
                      Parent Question
                    </label>
                    <select
                      value={qDependsOn}
                      onChange={(e) => {
                        setQDependsOn(e.target.value ? Number(e.target.value) : '');
                        setQParentOptionId('');
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    >
                      <option value="">None (Always visible)</option>
                      {potentialParentQuestions.map((pq) => (
                        <option key={pq.id} value={pq.id}>
                          #{pq.id} - {pq.question_text.slice(0, 30)}...
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedParentQuestion && (
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">
                        When Selected Option Is
                      </label>
                      <select
                        value={qParentOptionId}
                        onChange={(e) => setQParentOptionId(e.target.value ? Number(e.target.value) : '')}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="">Any answer</option>
                        {selectedParentQuestion.options?.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingQuestion(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createQuestionMutation.isPending || updateQuestionMutation.isPending}
                  className="px-5 py-2 rounded-xl bg-[#F52B68] hover:bg-[#E01E5A] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Option Modal */}
      {addingOptionQId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071B3A]/60 backdrop-blur-xs"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-[#172033]">
              Add Choice Option
            </h3>

            {optError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                {optError}
              </div>
            )}

            <form onSubmit={handleSaveOption} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Option Label *
                </label>
                <input
                  type="text"
                  value={optLabel}
                  onChange={(e) => setOptLabel(e.target.value)}
                  placeholder="e.g. Gas Continuous Flow"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Machine Value (Slug)
                </label>
                <input
                  type="text"
                  value={optValue}
                  onChange={(e) => setOptValue(e.target.value)}
                  placeholder="e.g. gas_continuous"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={optSortOrder}
                  onChange={(e) => setOptSortOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddingOptionQId(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createOptionMutation.isPending}
                  className="px-5 py-2 rounded-xl bg-[#F52B68] hover:bg-[#E01E5A] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Add Option
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
