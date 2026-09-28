'use client';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { useService } from '@/hooks/use-service';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: service, isLoading, error } = useService(slug);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PublicHeader />
      <main className="flex-grow mx-auto max-w-3xl px-6 py-12 lg:px-8 w-full">
        {isLoading && <div className="text-center py-12 text-gray-500">Loading service details...</div>}
        {error && <div className="text-center py-12 text-red-500">Failed to load service details.</div>}
        
        {!isLoading && !error && service && (
          <div className="bg-white shadow rounded-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{service.name}</h1>
            {service.description && <p className="text-gray-700 mb-8">{service.description}</p>}
            
            {service.questions && service.questions.length > 0 && (
              <div className="border-t pt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">What we will ask you:</h2>
                <ul className="space-y-4">
                  {service.questions.map((q) => (
                    <li key={q.id} className="bg-gray-50 p-4 rounded border">
                      <div className="font-medium text-gray-900">
                        {q.question_text}
                        {q.required && <span className="ml-2 text-red-500 text-sm">* required</span>}
                      </div>
                      <div className="text-sm text-gray-500 mt-1 capitalize">Type: {q.question_type}</div>
                      {q.options && q.options.length > 0 && (
                        <div className="mt-2 text-sm text-gray-600">
                          Options: {q.options.map(o => o.option_text).join(', ')}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-8 pt-8 border-t text-center">
              <Link href="/register" className="inline-flex justify-center rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
                Log in to request this service
              </Link>
            </div>
          </div>
        )}
      </main>
      <PublicFooter />
    </div>
  );
}
