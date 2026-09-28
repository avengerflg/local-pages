'use client';
import { useAuth } from '@/providers/auth-provider';

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}</h1>
      
      {user && !user.email_verified_at && (
        <div className="mb-6 p-4 bg-yellow-50 text-yellow-800 rounded-md text-sm">
          Please verify your email address to fully activate your account.
        </div>
      )}
      
      <div className="mt-8 border-4 border-dashed border-gray-200 rounded-lg h-64 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Your service requests will appear here.</p>
      </div>
    </div>
  );
}
