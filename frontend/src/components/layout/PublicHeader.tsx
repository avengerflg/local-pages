import Link from 'next/link';

export const PublicHeader = () => {
  return (
    <header className="bg-brand-navy border-b border-brand-navy-light sticky top-0 z-50">
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between p-4 lg:px-8 h-[72px] md:h-[84px]" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex flex-col justify-center relative group">
            <div className="flex items-center">
              {/* Logo approximation */}
              <div className="relative w-12 h-12 mr-2.5 flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Swoosh */}
                  <path d="M10 50 A 40 40 0 0 1 80 15" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
                  <path d="M85 80 A 40 40 0 0 1 15 85" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
                  {/* Pin */}
                  <path d="M50 85C50 85 80 55 80 35C80 18.4315 66.5685 5 50 5C33.4315 5 20 18.4315 20 35C20 55 50 85 50 85Z" fill="#F50067"/>
                  <circle cx="50" cy="30" r="10" fill="#061A33"/>
                  {/* House Roof & Tools */}
                  <path d="M50 35L25 55H75L50 35Z" fill="#FFFFFF"/>
                  <path d="M30 75L40 65M70 75L60 65" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="flex flex-col justify-center -space-y-1.5">
                <div className="text-[28px] font-extrabold tracking-tight text-white leading-none font-sans">
                  Local
                </div>
                <div className="text-[28px] font-extrabold tracking-tight text-brand-pink leading-none font-sans">
                  pages
                </div>
              </div>
            </div>
            <div className="text-[6.5px] text-gray-400 font-medium tracking-[0.22em] mt-1.5 whitespace-nowrap ml-[3.6rem]">
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

        <div className="hidden lg:flex lg:gap-x-8 xl:gap-x-10">
          <Link href="/services" className="text-[15px] font-semibold leading-6 text-white hover:text-brand-pink transition-colors">
            Find a Trade
          </Link>
          <Link href="/#how-it-works" className="text-[15px] font-medium leading-6 text-slate-300 hover:text-white transition-colors">
            How It Works
          </Link>
          <Link href="/register" className="text-[15px] font-medium leading-6 text-slate-300 hover:text-white transition-colors">
            For Businesses
          </Link>
          <Link href="#" className="text-[15px] font-medium leading-6 text-slate-300 hover:text-white transition-colors">
            About Us
          </Link>
          <Link href="#" className="text-[15px] font-medium leading-6 text-slate-300 hover:text-white transition-colors">
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
