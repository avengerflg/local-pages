import Link from 'next/link';

export const BusinessCTA = () => {
  return (
    <div className="bg-brand-navy relative overflow-hidden rounded-2xl mx-4 sm:mx-6 lg:mx-8 mb-16 lg:flex lg:items-stretch max-w-7xl xl:mx-auto">
      <div className="px-6 py-16 sm:px-12 sm:py-20 lg:w-1/2 lg:py-24 z-10 relative">
        <span className="inline-block px-3 py-1 rounded-full bg-brand-pink/20 text-brand-pink text-[10px] font-bold tracking-widest uppercase mb-6">
          FOR BUSINESSES
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
          Connect with more local clients
        </h2>
        <p className="text-lg leading-8 text-gray-300 mb-10 max-w-md">
          We send you job leads so you can manage opportunities and save time on admin.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/register" className="rounded-lg bg-brand-pink px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-pink-hover text-center transition-colors">
            List your business
          </Link>
          <Link href="/#how-it-works" className="rounded-lg border border-white/20 bg-transparent px-6 py-3 text-sm font-bold text-white hover:bg-white/10 text-center transition-colors">
            How it works
          </Link>
        </div>
      </div>
      <div className="lg:w-1/2 h-64 sm:h-80 lg:h-auto relative bg-brand-navy-light flex items-center justify-center text-gray-400">
        [ Business Professional Image ]
      </div>
    </div>
  );
};
