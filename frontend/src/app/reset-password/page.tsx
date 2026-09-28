'use client';
import { useState, useEffect } from 'react';
import { resetPassword } from '@/services/auth-api';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(params.get('token') || '');
    setEmail(params.get('email') || '');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationErrors({});
    
    try {
      await resetPassword({
        token,
        email,
        password,
        password_confirmation: passwordConfirmation
      });
      setSuccess(true);
    } // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (err: any) {
      if (err.data?.errors) {
        setValidationErrors(err.data.errors);
      } else {
        setError(err.data?.message || 'Failed to reset password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PublicHeader />
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow border">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Reset Password</h1>
          
          {success ? (
            <div className="text-center">
              <div className="p-4 bg-green-50 text-green-700 rounded mb-4">
                Your password has been successfully reset.
              </div>
              <Link href="/login" className="text-blue-600 hover:underline font-medium">Return to Login</Link>
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
                  readOnly
                  className="w-full p-2 border rounded bg-gray-100"
                  value={email}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  id="password"
                  type="password"
                  required
                  className="w-full p-2 border rounded"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                {validationErrors.password && <p className="mt-1 text-xs text-red-500">{validationErrors.password[0]}</p>}
              </div>
              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  id="password_confirmation"
                  type="password"
                  required
                  className="w-full p-2 border rounded"
                  value={passwordConfirmation}
                  onChange={e => setPasswordConfirmation(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !token}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
