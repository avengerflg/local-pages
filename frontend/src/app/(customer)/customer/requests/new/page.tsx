import React, { Suspense } from 'react';
import { ServiceRequestWizard } from '@/components/requests/ServiceRequestWizard';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Post a Service Request | Local Pages',
  description: 'Submit your trade service request to get free quotes from verified Australian tradies.',
};

export default function NewServiceRequestPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-brand-pink" />
          <p className="text-sm font-semibold">Loading Service Request Wizard...</p>
        </div>
      }
    >
      <ServiceRequestWizard />
    </Suspense>
  );
}
