'use client';
import { useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { login } from '@/services/auth-api';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import Link from 'next/link';


export default function LoginPage() {
  const { login: setAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationErrors({});

    try {
      const data = await login({ email, password, device_name: 'web' });
      setAuth(data.token, data.user);
    } // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (err: any) {
      console.error('Login Error:', err);
      if (err.data?.errors) {
        setValidationErrors(err.data.errors);
      } else {
        setError(err.data?.message || 'Login failed. Please check your credentials.');
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
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Log In</h1>
          
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                type="email"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              {validationErrors.email && <p className="mt-1 text-xs text-red-500">{validationErrors.email[0]}</p>}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                type="password"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              {validationErrors.password && <p className="mt-1 text-xs text-red-500">{validationErrors.password[0]}</p>}
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <Link href="/forgot-password" className="text-blue-600 hover:underline">Forgot password?</Link>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account? <Link href="/register" className="text-blue-600 hover:underline">Register</Link>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
