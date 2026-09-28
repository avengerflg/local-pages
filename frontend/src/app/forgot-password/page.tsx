'use client';
import { useState } from 'react';
import { forgotPassword } from '@/services/auth-api';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await forgotPassword(email);
      setSuccess(true);
    } // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (err: any) {
      setError(err.data?.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PublicHeader />
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow border">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Forgot Password</h1>
          
          {success ? (
            <div className="p-4 bg-green-50 text-green-700 rounded text-center">
              If an account exists with that email, we&apos;ve sent a password reset link.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full p-2 border rounded"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
