'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { useCustomerProfile, useUpdateCustomerProfile } from '@/hooks/use-customer';

export default function CustomerProfilePage() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useCustomerProfile();
  const updateProfile = useUpdateCustomerProfile();
  
  const [postcode, setPostcode] = useState('');
  const [address, setAddress] = useState('');
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    if (profile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPostcode(profile.postcode || '');
      setAddress(profile.address || '');
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    updateProfile.mutate({ postcode, address }, {
      onSuccess: () => {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    });
  };

  if (isLoading) return <div className="p-4">Loading profile...</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-md border">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Account Information</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-500">Name</label>
              <div className="mt-1 text-sm text-gray-900">{user?.name}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <div className="mt-1 text-sm text-gray-900">{user?.email} {user?.email_verified_at ? '(Verified)' : '(Unverified)'}</div>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">Name and email cannot be updated from the profile panel.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="border-t pt-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Location Details</h2>
          
          {success && <div className="p-3 bg-green-50 text-green-700 rounded text-sm mb-4">Profile updated successfully!</div>}
          {updateProfile.isError && <div className="p-3 bg-red-50 text-red-700 rounded text-sm mb-4">Failed to update profile.</div>}
          
          <div>
            <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
            <input
              id="postcode"
              type="text"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              value={postcode}
              onChange={e => setPostcode(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              id="address"
              type="text"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
