'use client';
import { useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { registerCustomer } from '@/services/auth-api';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import Link from 'next/link';

export default function RegisterPage() {
  const { login: setAuth } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    password_confirmation: '',
    postcode: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationErrors({});

    try {
      const data = await registerCustomer(formData);
      setAuth(data.token, data.user);
    } // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (err: any) {
      console.error('Register Error:', err);
      if (err.data?.errors) {
        setValidationErrors(err.data.errors);
      } else {
        setError(err.data?.message || 'Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PublicHeader />
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white p-8 rounded-lg shadow border">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Register as a Customer</h1>
          
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input id="name" type="text" name="name" required className="w-full p-2 border rounded" value={formData.name} onChange={handleChange} />
              {validationErrors.name && <p className="mt-1 text-xs text-red-500">{validationErrors.name[0]}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input id="email" type="email" name="email" required className="w-full p-2 border rounded" value={formData.email} onChange={handleChange} />
              {validationErrors.email && <p className="mt-1 text-xs text-red-500">{validationErrors.email[0]}</p>}
            </div>

            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
              <input id="mobile" type="text" name="mobile" className="w-full p-2 border rounded" value={formData.mobile} onChange={handleChange} />
              {validationErrors.mobile && <p className="mt-1 text-xs text-red-500">{validationErrors.mobile[0]}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input id="password" type="password" name="password" required className="w-full p-2 border rounded" value={formData.password} onChange={handleChange} />
                {validationErrors.password && <p className="mt-1 text-xs text-red-500">{validationErrors.password[0]}</p>}
              </div>
              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                <input id="password_confirmation" type="password" name="password_confirmation" required className="w-full p-2 border rounded" value={formData.password_confirmation} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
              <input id="postcode" type="text" name="postcode" className="w-full p-2 border rounded" value={formData.postcode} onChange={handleChange} />
              {validationErrors.postcode && <p className="mt-1 text-xs text-red-500">{validationErrors.postcode[0]}</p>}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input id="address" type="text" name="address" className="w-full p-2 border rounded" value={formData.address} onChange={handleChange} />
              {validationErrors.address && <p className="mt-1 text-xs text-red-500">{validationErrors.address[0]}</p>}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 mt-4"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
