'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Service, 
  Location, 
  ServiceRequest, 
  ServiceRequestAnswerPayload 
} from '@/types/api';
import { useServices } from '@/hooks/use-services';
import { useService } from '@/hooks/use-service';
import { useCreateServiceRequest } from '@/hooks/use-service-requests';
import { 
  FormAnswer, 
  isQuestionVisible, 
  isQuestionAnswered 
} from '@/lib/question-logic';
import { QuestionField } from './QuestionField';
import { LocationPicker } from './LocationPicker';
import { AttachmentUploader } from './AttachmentUploader';
import { ReviewSummary } from './ReviewSummary';
import { SuccessConfirmation } from './SuccessConfirmation';
import { 
  Wrench, 
  HelpCircle, 
  MapPin, 
  FileText, 
  CheckCircle, 
  ChevronRight, 
  ChevronLeft, 
  Loader2, 
  AlertCircle, 
  Search,
  Sparkles 
} from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Trade Service', icon: Wrench },
  { id: 2, title: 'Job Questions', icon: HelpCircle },
  { id: 3, title: 'Location', icon: MapPin },
  { id: 4, title: 'Details & Photos', icon: FileText },
  { id: 5, title: 'Review & Submit', icon: CheckCircle },
];

export function ServiceRequestWizard() {
  const searchParams = useSearchParams();
  const initialServiceParam = searchParams.get('service') || searchParams.get('service_id');

  // Step state
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [userSelectedServiceId, setUserSelectedServiceId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, FormAnswer>>({});
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [postcode, setPostcode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  // Validation & Error states
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [createdRequest, setCreatedRequest] = useState<ServiceRequest | null>(null);

  // Service catalog search in Step 1
  const [serviceSearch, setServiceSearch] = useState('');

  // API Queries & Mutations
  const { data: services, isLoading: isLoadingServices } = useServices();
  const createRequestMutation = useCreateServiceRequest();

  // Derive selectedServiceId from user selection or URL query parameter
  const selectedServiceId = useMemo(() => {
    if (userSelectedServiceId) return userSelectedServiceId;
    if (initialServiceParam && services && services.length > 0) {
      const match = services.find(
        (s) => s.slug === initialServiceParam || String(s.id) === initialServiceParam
      );
      if (match) return match.id;
    }
    return null;
  }, [userSelectedServiceId, initialServiceParam, services]);

  // Find selected service object from catalog
  const selectedServiceFromList = useMemo(() => {
    if (!services || !selectedServiceId) return null;
    return services.find((s) => s.id === selectedServiceId) || null;
  }, [services, selectedServiceId]);

  // Load selected service detail with full active questions and options
  const { 
    data: fullServiceDetail, 
    isLoading: isLoadingServiceDetail 
  } = useService(selectedServiceFromList?.slug || (selectedServiceId ? String(selectedServiceId) : ''));

  const activeService = fullServiceDetail || selectedServiceFromList;
  const questions = useMemo(() => activeService?.questions || [], [activeService]);

  // Filter visible questions for the active service
  const visibleQuestions = useMemo(() => {
    return questions.filter((q) => isQuestionVisible(q, answers, questions));
  }, [questions, answers]);

  // Handle question answer change
  const handleAnswerChange = (questionId: number, answer: FormAnswer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
    // Clear validation error for this question if any
    setValidationErrors((prev) => {
      const copy = { ...prev };
      delete copy[`question_${questionId}`];
      return copy;
    });
  };

  // Step 1: Select a service
  const handleSelectService = (service: Service) => {
    setUserSelectedServiceId(service.id);
    setValidationErrors({});
    setApiError(null);
  };

  // Validate current step before proceeding
  const validateCurrentStep = (): boolean => {
    const errors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!selectedServiceId) {
        errors.service = 'Please select a trade service to continue.';
      }
    } else if (currentStep === 2) {
      // Validate all required visible questions
      visibleQuestions.forEach((q) => {
        if (q.required) {
          const isAnswered = isQuestionAnswered(q, answers[q.id], files.length);
          if (!isAnswered) {
            errors[`question_${q.id}`] = `"${q.question_text}" is required.`;
          }
        }
      });
    } else if (currentStep === 3) {
      if (!postcode || !postcode.trim()) {
        errors.postcode = 'Postcode is required.';
      } else if (postcode.trim().length > 10) {
        errors.postcode = 'Postcode cannot exceed 10 characters.';
      } else if (selectedLocation?.postcode && selectedLocation.postcode !== postcode.trim()) {
        errors.postcode = `Postcode does not match ${selectedLocation.name} (${selectedLocation.postcode}).`;
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinue = () => {
    if (validateCurrentStep()) {
      setApiError(null);
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleBack = () => {
    setApiError(null);
    setValidationErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Submit Final Service Request
  const handleSubmit = async () => {
    if (!selectedServiceId || !activeService) return;
    if (!validateCurrentStep()) return;

    setApiError(null);
    setValidationErrors({});

    // Filter answers: only send answers for visible questions
    const finalAnswers: ServiceRequestAnswerPayload[] = [];
    visibleQuestions.forEach((q) => {
      const ans = answers[q.id];
      if (ans) {
        finalAnswers.push({
          question_id: q.id,
          selected_option_id: ans.selected_option_id || null,
          answer_text: ans.answer_text || null,
          structured_value: ans.structured_value || null,
        });
      }
    });

    try {
      const response = await createRequestMutation.mutateAsync({
        service_id: selectedServiceId,
        location_id: selectedLocation?.id || null,
        postcode: postcode.trim(),
        title: title.trim() || `Quote Request for ${activeService.name}`,
        description: description.trim() || undefined,
        answers: finalAnswers.length > 0 ? finalAnswers : undefined,
        attachments: files.length > 0 ? files : undefined,
      });

      setCreatedRequest(response);
      setCurrentStep(6); // Success step
    } catch (err: unknown) {
      const apiErr = err as { status?: number; data?: { message?: string; errors?: Record<string, string[]> } };
      if (apiErr?.data?.errors) {
        const fieldErrors: Record<string, string> = {};
        Object.entries(apiErr.data.errors).forEach(([field, msgs]) => {
          fieldErrors[field] = msgs.join(' ');
        });
        setValidationErrors(fieldErrors);
        setApiError(apiErr.data.message || 'Please correct the highlighted errors.');
      } else {
        setApiError(apiErr?.data?.message || 'Failed to submit service request. Please try again.');
      }
    }
  };

  const handleReset = () => {
    setUserSelectedServiceId(null);
    setAnswers({});
    setSelectedLocation(null);
    setPostcode('');
    setTitle('');
    setDescription('');
    setFiles([]);
    setValidationErrors({});
    setApiError(null);
    setCreatedRequest(null);
    setCurrentStep(1);
  };

  // Filter services for Step 1
  const filteredServices = useMemo(() => {
    if (!services) return [];
    if (!serviceSearch.trim()) return services;
    const q = serviceSearch.toLowerCase().trim();
    return services.filter(
      (s) => s.name.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q))
    );
  }, [services, serviceSearch]);

  // If in success step, render SuccessConfirmation
  if (currentStep === 6 && createdRequest) {
    return <SuccessConfirmation request={createdRequest} onReset={handleReset} />;
  }

  return (
    <div className="space-y-6" data-testid="service-request-wizard">
      
      {/* Step Header & Progress Indicator */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-[0_6px_25px_rgba(4,19,41,0.03)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 mb-5 border-b border-slate-100 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-pink/10 text-brand-pink text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Free Quotes from Licensed Tradies</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
              Post a Service Request
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1]?.title}
            </p>
          </div>

          {activeService && currentStep > 1 && (
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-2">
              <Wrench className="w-3.5 h-3.5 text-brand-pink" />
              <span>{activeService.name}</span>
            </div>
          )}
        </div>

        {/* Stepper Bar */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const isCompleted = currentStep > s.id;
            const isCurrent = currentStep === s.id;

            return (
              <div 
                key={s.id}
                className={`flex flex-col items-center text-center transition-all ${
                  isCurrent ? 'opacity-100' : isCompleted ? 'opacity-80' : 'opacity-40'
                }`}
              >
                <div 
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-heading font-extrabold text-xs sm:text-sm transition-all mb-1.5 ${
                    isCurrent
                      ? 'bg-gradient-to-r from-brand-pink to-[#E01E5A] text-white shadow-[0_4px_14px_rgba(245,43,104,0.35)] scale-105'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                </div>
                <span className="hidden md:inline text-[11px] font-bold text-slate-600 truncate max-w-full">
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* API Error Alert */}
      {apiError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-xs sm:text-sm text-rose-700 font-semibold" role="alert" data-testid="api-error-alert">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      {/* Main Form Bay */}
      <div className="bg-white rounded-3xl p-6 sm:p-9 border border-slate-200/90 shadow-[0_10px_35px_rgba(4,19,41,0.04)]">
        
        {/* STEP 1: Select Service */}
        {currentStep === 1 && (
          <div className="space-y-6" data-testid="step-1-service">
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-brand-navy mb-1">
                Select Your Required Trade Service
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Choose the category that best fits the work you need done.
              </p>
            </div>

            {/* Service Search Bar */}
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4 text-brand-pink" />
              </div>
              <input
                type="text"
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                placeholder="Search trades (e.g. plumbing, electrician...)"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink transition-all shadow-sm"
                data-testid="service-search-input"
              />
            </div>

            {validationErrors.service && (
              <p className="text-xs text-rose-600 font-bold" role="alert">
                {validationErrors.service}
              </p>
            )}

            {/* Services Grid */}
            {isLoadingServices ? (
              <div className="py-16 text-center text-slate-400 text-sm">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-pink" />
                <span>Loading available trade services...</span>
              </div>
            ) : filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="services-list">
                {filteredServices.map((service) => {
                  const isSelected = selectedServiceId === service.id;
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => handleSelectService(service)}
                      className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-brand-pink bg-rose-50/60 ring-2 ring-brand-pink/30 shadow-md'
                          : 'border-slate-200/90 hover:border-brand-pink/40 hover:bg-slate-50/60 bg-white shadow-sm'
                      }`}
                      data-testid={`select-service-${service.id}`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                            isSelected ? 'bg-brand-pink text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            <Wrench className="w-5 h-5" />
                          </div>
                          {isSelected && (
                            <span className="px-2 py-0.5 rounded-full bg-brand-pink text-white text-[10px] font-extrabold uppercase tracking-wider">
                              Selected
                            </span>
                          )}
                        </div>
                        <h3 className="font-heading text-base font-bold text-brand-navy mb-1">
                          {service.name}
                        </h3>
                        {service.description && (
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {service.description}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-sm bg-slate-50 rounded-2xl">
                No matching trade services found.
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Dynamic Question Engine */}
        {currentStep === 2 && (
          <div className="space-y-6" data-testid="step-2-questions">
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-brand-navy mb-1">
                Tell Us More About the Job
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Answer a few quick questions for {activeService?.name || 'this trade'} to get accurate quotes.
              </p>
            </div>

            {isLoadingServiceDetail ? (
              <div className="py-16 text-center text-slate-400 text-sm">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-pink" />
                <span>Loading questions for {activeService?.name}...</span>
              </div>
            ) : visibleQuestions.length > 0 ? (
              <div className="space-y-5" data-testid="dynamic-questions-container">
                {visibleQuestions.map((q) => (
                  <QuestionField
                    key={q.id}
                    question={q}
                    answer={answers[q.id]}
                    onChange={(ans) => handleAnswerChange(q.id, ans)}
                    error={validationErrors[`question_${q.id}`]}
                    attachmentsCount={files.length}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h4 className="font-heading font-bold text-slate-800 text-sm mb-1">No special questions required</h4>
                <p className="text-xs text-slate-500">
                  This trade does not require preliminary questions. You can continue to location and details.
                </p>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Location Selection */}
        {currentStep === 3 && (
          <div className="space-y-6" data-testid="step-3-location">
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-brand-navy mb-1">
                Where is the Job Located?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                We will match you with certified tradies servicing your specific Australian suburb.
              </p>
            </div>

            <LocationPicker
              locationId={selectedLocation?.id || null}
              postcode={postcode}
              selectedLocation={selectedLocation}
              onLocationChange={(loc, pcode) => {
                setSelectedLocation(loc);
                setPostcode(pcode);
                setValidationErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.postcode;
                  delete copy.location_id;
                  return copy;
                });
              }}
              error={validationErrors.postcode || validationErrors.location_id}
            />
          </div>
        )}

        {/* STEP 4: Title, Description & Photos */}
        {currentStep === 4 && (
          <div className="space-y-6" data-testid="step-4-details">
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-brand-navy mb-1">
                Job Title, Details & Photos
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Provide any extra notes, descriptions, or upload photos to help tradies provide firm pricing.
              </p>
            </div>

            {/* Request Title */}
            <div>
              <label htmlFor="request-title-input" className="block font-heading text-sm font-bold text-brand-navy mb-1.5">
                Job Title <span className="text-xs text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                id="request-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`e.g. ${activeService?.name || 'Emergency'} Repair Needed`}
                maxLength={255}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink transition-all shadow-sm"
                data-testid="request-title-input"
              />
            </div>

            {/* Request Description */}
            <div>
              <label htmlFor="request-description-input" className="block font-heading text-sm font-bold text-brand-navy mb-1.5">
                Job Description / Additional Notes <span className="text-xs text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                id="request-description-input"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what needs to be fixed, site access instructions, timing preferences, etc..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink transition-all shadow-sm"
                data-testid="request-description-input"
              />
            </div>

            {/* Attachments Upload */}
            <div>
              <label className="block font-heading text-sm font-bold text-brand-navy mb-1.5">
                Attachments & Photos <span className="text-xs text-slate-400 font-normal">(Optional)</span>
              </label>
              <AttachmentUploader
                files={files}
                onFilesChange={(newFiles) => setFiles(newFiles)}
                error={validationErrors.attachments}
              />
            </div>
          </div>
        )}

        {/* STEP 5: Final Review & Submit */}
        {currentStep === 5 && activeService && (
          <div className="space-y-6" data-testid="step-5-review">
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-brand-navy mb-1">
                Review Your Service Request
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Check your specifications below before submitting to local tradies.
              </p>
            </div>

            <ReviewSummary
              service={activeService}
              questions={questions}
              answers={answers}
              location={selectedLocation}
              postcode={postcode}
              title={title}
              description={description}
              files={files}
              onGoToStep={(step) => setCurrentStep(step)}
            />
          </div>
        )}

        {/* Navigation Actions Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={createRequestMutation.isPending}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
              data-testid="wizard-back-button"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleContinue}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-pink to-[#E01E5A] hover:from-[#E01E5A] hover:to-brand-pink text-white font-heading font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_4px_16px_rgba(245,43,104,0.3)] cursor-pointer"
              data-testid="wizard-continue-button"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={createRequestMutation.isPending}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-brand-pink to-[#E01E5A] hover:from-[#E01E5A] hover:to-brand-pink text-white font-heading font-extrabold text-sm uppercase tracking-wider transition-all shadow-[0_6px_22px_rgba(245,43,104,0.35)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="wizard-submit-button"
            >
              {createRequestMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>SUBMITTING REQUEST...</span>
                </>
              ) : (
                <>
                  <span>SUBMIT SERVICE REQUEST</span>
                  <CheckCircle className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
