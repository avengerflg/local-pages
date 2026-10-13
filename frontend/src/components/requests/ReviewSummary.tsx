'use client';

import React from 'react';
import { 
  Service, 
  Location, 
  ServiceQuestion 
} from '@/types/api';
import { FormAnswer, getOptionLabel, isQuestionVisible } from '@/lib/question-logic';
import { 
  Wrench, 
  MapPin, 
  FileText, 
  Paperclip, 
  Edit3, 
  CheckCircle2, 
  HelpCircle 
} from 'lucide-react';

interface ReviewSummaryProps {
  service: Service;
  questions: ServiceQuestion[];
  answers: Record<number, FormAnswer>;
  location: Location | null;
  postcode: string;
  title: string;
  description: string;
  files: File[];
  onGoToStep: (step: number) => void;
}

export function ReviewSummary({
  service,
  questions,
  answers,
  location,
  postcode,
  title,
  description,
  files,
  onGoToStep,
}: ReviewSummaryProps) {
  // Filter visible questions only
  const visibleQuestions = questions.filter((q) => isQuestionVisible(q, answers, questions));

  const getAnswerDisplay = (q: ServiceQuestion): string => {
    const ans = answers[q.id];
    if (!ans) return 'Not answered';

    if (ans.selected_option_id && q.options) {
      const opt = q.options.find((o) => o.id === ans.selected_option_id);
      return opt ? getOptionLabel(opt) : `Option #${ans.selected_option_id}`;
    }

    if (ans.structured_value && Array.isArray(ans.structured_value) && ans.structured_value.length > 0 && q.options) {
      const selectedLabels = ans.structured_value
        .map((optId) => {
          const opt = q.options?.find((o) => o.id === Number(optId));
          return opt ? getOptionLabel(opt) : String(optId);
        })
        .join(', ');
      return selectedLabels || 'None selected';
    }

    if (ans.answer_text) {
      return ans.answer_text;
    }

    if ((q.question_type === 'file_upload' || q.question_type === 'image_upload') && files.length > 0) {
      return `${files.length} file(s) attached`;
    }

    return 'Not answered';
  };

  return (
    <div className="space-y-6" data-testid="review-summary">
      {/* 1. Trade Service Section */}
      <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-pink/10 text-brand-pink flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <h4 className="font-heading text-sm font-bold text-brand-navy">Selected Service</h4>
          </div>
          <button
            type="button"
            onClick={() => onGoToStep(1)}
            className="text-xs font-bold text-brand-pink hover:underline flex items-center gap-1"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>
        <div className="text-sm font-extrabold text-slate-900">{service.name}</div>
        {service.description && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{service.description}</p>
        )}
      </div>

      {/* 2. Questions & Answers Section */}
      {visibleQuestions.length > 0 && (
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h4 className="font-heading text-sm font-bold text-brand-navy">Job Requirements</h4>
            </div>
            <button
              type="button"
              onClick={() => onGoToStep(2)}
              className="text-xs font-bold text-brand-pink hover:underline flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>
          <div className="space-y-3">
            {visibleQuestions.map((q) => (
              <div key={q.id} className="text-xs">
                <span className="font-bold text-slate-700 block">{q.question_text}</span>
                <span className="text-slate-900 font-semibold mt-0.5 block pl-2 border-l-2 border-brand-pink/30">
                  {getAnswerDisplay(q)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Location Section */}
      <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <h4 className="font-heading text-sm font-bold text-brand-navy">Service Location</h4>
          </div>
          <button
            type="button"
            onClick={() => onGoToStep(3)}
            className="text-xs font-bold text-brand-pink hover:underline flex items-center gap-1"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>
        <div className="text-sm font-extrabold text-slate-900">
          {location ? `${location.name} (${postcode})` : `Postcode: ${postcode}`}
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {location?.type ? `Location Type: ${location.type}` : 'Australia'}
        </p>
      </div>

      {/* 4. Details & Attachments Section */}
      <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="font-heading text-sm font-bold text-brand-navy">Job Details & Photos</h4>
          </div>
          <button
            type="button"
            onClick={() => onGoToStep(4)}
            className="text-xs font-bold text-brand-pink hover:underline flex items-center gap-1"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>
        
        <div className="space-y-3 text-xs">
          <div>
            <span className="font-bold text-slate-700 block">Title</span>
            <span className="text-slate-900 font-semibold block">{title || `Quote Request for ${service.name}`}</span>
          </div>

          {description && (
            <div>
              <span className="font-bold text-slate-700 block">Description</span>
              <p className="text-slate-600 mt-0.5 whitespace-pre-wrap">{description}</p>
            </div>
          )}

          <div>
            <span className="font-bold text-slate-700 block">Attachments ({files.length})</span>
            {files.length > 0 ? (
              <div className="mt-1 flex flex-wrap gap-2">
                {files.map((f, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                  >
                    <Paperclip className="w-3 h-3 text-slate-400" />
                    <span>{f.name}</span>
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-slate-400">No photos or documents attached</span>
            )}
          </div>
        </div>
      </div>

      {/* Trust & Guarantee Box */}
      <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
        <div className="text-xs text-slate-600">
          <span className="font-bold text-slate-800">Free, no-obligation quote request.</span>{' '}
          Your contact information will only be shared with verified tradespeople who accept your request.
        </div>
      </div>
    </div>
  );
}
