import Link from 'next/link';

export const PublicHeader = () => {
  return (
    <header className="bg-white border-b border-brand-border sticky top-0 z-50">
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between p-4 lg:px-8 h-[72px] md:h-[84px]" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <img 
              src="/logo.jpg" 
              alt="Local Pages - Certified Local Trades and Services" 
              className="h-12 md:h-14 w-auto object-contain"
            />
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-brand-navy">
            <span className="sr-only">Open main menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-8 xl:gap-x-10">
          <Link href="/services" className="text-[15px] font-bold leading-6 text-brand-navy hover:text-brand-pink transition-colors">
            Find a Trade
          </Link>
          <Link href="/#how-it-works" className="text-[15px] font-medium leading-6 text-gray-500 hover:text-brand-pink transition-colors">
            How It Works
          </Link>
          <Link href="/register" className="text-[15px] font-medium leading-6 text-gray-500 hover:text-brand-pink transition-colors">
            For Businesses
          </Link>
          <Link href="#" className="text-[15px] font-medium leading-6 text-gray-500 hover:text-brand-pink transition-colors">
            About Us
          </Link>
          <Link href="#" className="text-[15px] font-medium leading-6 text-gray-500 hover:text-brand-pink transition-colors">
            Contact Us
          </Link>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link href="/register" className="rounded-md bg-brand-pink px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-brand-pink-hover transition-colors">
            List Your Business
          </Link>
        </div>
      </nav>
    </header>
  );
};
