import Link from 'next/link';

export const PublicHeader = () => {
  return (
    <header className="bg-brand-navy border-b border-brand-navy-light sticky top-0 z-50">
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between p-4 lg:px-8 h-[72px] md:h-[84px]" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex flex-col justify-center relative">
            <div className="flex items-end">
              {/* Logo approximation */}
              <div className="relative w-10 h-10 mr-2 flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 95C50 95 90 65 90 40C90 17.9086 72.0914 0 50 0C27.9086 0 10 17.9086 10 40C10 65 50 95 50 95Z" fill="#F50067"/>
                  <circle cx="50" cy="35" r="15" fill="#061A33"/>
                  <path d="M50 25L30 45H70L50 25Z" fill="#FFFFFF"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="text-2xl font-bold tracking-tight text-white leading-none">
                  Local
                </div>
                <div className="text-2xl font-bold tracking-tight text-brand-pink leading-none -mt-1">
                  pages
                </div>
              </div>
            </div>
            <div className="text-[7px] text-gray-400 tracking-[0.2em] mt-1 whitespace-nowrap ml-[3.2rem]">
              CERTIFIED LOCAL TRADES AND SERVICES
            </div>
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white">
            <span className="sr-only">Open main menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-10">
          <Link href="/services" className="text-sm font-bold leading-6 text-white hover:text-brand-pink transition-colors">
            Find a Trade
          </Link>
          <Link href="/#how-it-works" className="text-sm font-medium leading-6 text-gray-400 hover:text-brand-pink transition-colors">
            How It Works
          </Link>
          <Link href="/register" className="text-sm font-medium leading-6 text-gray-400 hover:text-brand-pink transition-colors">
            For Businesses
          </Link>
          <Link href="#" className="text-sm font-medium leading-6 text-gray-400 hover:text-brand-pink transition-colors">
            About Us
          </Link>
          <Link href="#" className="text-sm font-medium leading-6 text-gray-400 hover:text-brand-pink transition-colors">
            Contact Us
          </Link>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link href="/register" className="rounded-lg bg-[#f50057] px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#d4004d] transition-colors">
            List Your Business
          </Link>
        </div>
      </nav>
    </header>
  );
};
