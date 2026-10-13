'use client';

import React from 'react';
import { 
  ServiceQuestion, 
  ServiceQuestionOption 
} from '@/types/api';
import { FormAnswer, getOptionLabel } from '@/lib/question-logic';
import { Check, UploadCloud } from 'lucide-react';

interface QuestionFieldProps {
  question: ServiceQuestion;
  answer: FormAnswer | undefined;
  onChange: (answer: FormAnswer) => void;
  error?: string;
  attachmentsCount?: number;
}

export function QuestionField({
  question,
  answer,
  onChange,
  error,
  attachmentsCount = 0,
}: QuestionFieldProps) {
  const options: ServiceQuestionOption[] = question.options || [];

  // Single choice handler
  const handleSingleChoice = (optionId: number) => {
    onChange({
      question_id: question.id,
      selected_option_id: optionId,
      answer_text: null,
      structured_value: null,
    });
  };

  // Multiple choice handler
  const handleMultipleChoice = (optionId: number) => {
    const currentValues = (answer?.structured_value || []).map(Number);
    const exists = currentValues.includes(optionId);
    const updatedValues = exists
      ? currentValues.filter((id) => id !== optionId)
      : [...currentValues, optionId];

    onChange({
      question_id: question.id,
      selected_option_id: null,
      answer_text: null,
      structured_value: updatedValues,
    });
  };

  // Text handler
  const handleTextChange = (text: string) => {
    onChange({
      question_id: question.id,
      selected_option_id: null,
      answer_text: text,
      structured_value: null,
    });
  };

  return (
    <div 
      className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-sm transition-all hover:border-slate-300"
      data-testid={`question-card-${question.id}`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <label 
            htmlFor={`question-${question.id}`}
            className="block font-heading text-base font-bold text-brand-navy"
          >
            {question.question_text}
            {question.required && (
              <span className="ml-1.5 text-brand-pink font-extrabold text-sm" title="Required field">*</span>
            )}
          </label>
          <div className="text-xs text-slate-400 mt-0.5">
            {question.question_type === 'single_choice' && 'Select one option'}
            {question.question_type === 'multiple_choice' && 'Select all that apply'}
            {question.question_type === 'text' && 'Type your answer below'}
            {(question.question_type === 'file_upload' || question.question_type === 'image_upload') && 'Upload photos or documents'}
          </div>
        </div>

        {question.required ? (
          <span className="px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase rounded-full bg-rose-50 text-brand-pink border border-rose-100 shrink-0">
            Required
          </span>
        ) : (
          <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-slate-100 text-slate-500 shrink-0">
            Optional
          </span>
        )}
      </div>

      {/* Single Choice Options */}
      {question.question_type === 'single_choice' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3" role="radiogroup" aria-label={question.question_text}>
          {options.map((option) => {
            const isSelected = answer?.selected_option_id === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSingleChoice(option.id)}
                className={`flex items-center justify-between p-3.5 rounded-xl border text-left text-sm font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-50/70 border-brand-pink text-brand-navy ring-1 ring-brand-pink shadow-sm'
                    : 'bg-slate-50/70 hover:bg-slate-100/70 border-slate-200/80 text-slate-700'
                }`}
                data-testid={`option-${option.id}`}
              >
                <span>{getOptionLabel(option)}</span>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 transition-colors ${
                    isSelected
                      ? 'bg-brand-pink border-brand-pink text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Multiple Choice Options */}
      {question.question_type === 'multiple_choice' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3" role="group" aria-label={question.question_text}>
          {options.map((option) => {
            const currentSelected = (answer?.structured_value || []).map(Number);
            const isSelected = currentSelected.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                role="checkbox"
                aria-checked={isSelected}
                onClick={() => handleMultipleChoice(option.id)}
                className={`flex items-center justify-between p-3.5 rounded-xl border text-left text-sm font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-50/70 border-brand-pink text-brand-navy ring-1 ring-brand-pink shadow-sm'
                    : 'bg-slate-50/70 hover:bg-slate-100/70 border-slate-200/80 text-slate-700'
                }`}
                data-testid={`checkbox-option-${option.id}`}
              >
                <span>{getOptionLabel(option)}</span>
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ml-2 transition-colors ${
                    isSelected
                      ? 'bg-brand-pink border-brand-pink text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Text / Textarea input */}
      {(question.question_type === 'text' || question.question_type === 'textarea') && (
        <div className="mt-2">
          <input
            id={`question-${question.id}`}
            type="text"
            value={answer?.answer_text || ''}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink transition-all"
            data-testid={`text-input-${question.id}`}
          />
        </div>
      )}

      {/* File/Image Upload question helper */}
      {(question.question_type === 'file_upload' || question.question_type === 'image_upload') && (
        <div className="mt-2 p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-pink/10 text-brand-pink flex items-center justify-center shrink-0">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div className="text-xs text-slate-600">
            <p className="font-semibold text-slate-800">
              {attachmentsCount > 0 
                ? `${attachmentsCount} attachment(s) attached` 
                : 'Attachments can be added in the Attachments step.'}
            </p>
            <p className="text-slate-400">Photos help tradies quote faster and more accurately.</p>
          </div>
        </div>
      )}

      {/* Field Validation Error */}
      {error && (
        <p className="text-xs text-rose-600 font-bold mt-2.5 flex items-center gap-1" role="alert" data-testid={`question-error-${question.id}`}>
          <span>⚠</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
