'use client';
import { useState, useEffect } from 'react';
import { verifyEmail } from '@/services/auth-api';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import Link from 'next/link';
import { useAuth } from '@/providers/auth-provider';

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const performVerification = async () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      const hash = params.get('hash');
      
      // We pass the full search string so signature logic works on the backend
      const queryParams = window.location.search.substring(1);

      if (!id || !hash) {
        setError('Invalid verification link.');
        setLoading(false);
        return;
      }

      try {
        await verifyEmail(id, hash, queryParams);
        setSuccess(true);
      } // eslint-disable-next-line @typescript-eslint/no-explicit-any
      catch (err: any) {
        setError(err.data?.message || 'Verification failed. The link may have expired.');
      } finally {
        setLoading(false);
      }
    };

    performVerification();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PublicHeader />
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow border text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Email Verification</h1>
          
          {loading && <p className="text-gray-500">Verifying your email address...</p>}
          
          {!loading && success && (
            <div>
              <div className="p-4 bg-green-50 text-green-700 rounded mb-4">
                Your email has been successfully verified!
              </div>
              <Link href={user ? '/customer' : '/login'} className="inline-block bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700">
                {user ? 'Go to Dashboard' : 'Log In'}
              </Link>
            </div>
          )}
          
          {!loading && error && (
            <div>
              <div className="p-4 bg-red-50 text-red-700 rounded mb-4">
                {error}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Note: Laravel backend natively generates links to the backend URL. To use this frontend page, the backend <code>VerifyEmail</code> notification must be configured to point to the frontend <code>/email/verify?id=...&hash=...</code> route instead.
              </p>
            </div>
          )}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
