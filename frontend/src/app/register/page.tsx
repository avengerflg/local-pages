import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';

export const metadata = {
  title: 'Register | Local Pages',
};

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PublicHeader />
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow border text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Register</h1>
          <p className="text-gray-600 mb-6">Registration flow placeholder for future phases.</p>
          <div className="text-sm text-gray-500 italic">(The UI forms for Customers/Tradies will be built in later phases.)</div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
