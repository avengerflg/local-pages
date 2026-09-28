import Link from 'next/link';

export const UtilityBar = () => {
  return (
    <div className="bg-[#0b1426] text-white text-[11px] font-semibold h-10 flex items-stretch justify-between overflow-x-auto whitespace-nowrap border-b border-white/5 shrink-0">
      <div className="flex items-stretch shrink-0">
        <Link href="tel:1300000000" className="bg-[#f50057] hover:bg-[#d4004d] px-6 flex items-center justify-center transition-colors h-full">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
          NEED HELP NOW? CLICK TO CALL
        </Link>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-3 px-4 shrink-0">
        <Link href="/services" className="flex items-center px-3 py-1.5 border border-white/10 rounded hover:bg-white/5 transition-colors text-gray-300">
          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
          Emergency Locksmith
        </Link>
        <Link href="/services" className="flex items-center px-3 py-1.5 border border-white/10 rounded hover:bg-white/5 transition-colors text-gray-300">
          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          24HR Plumber
        </Link>
        <Link href="/services" className="flex items-center px-3 py-1.5 border border-white/10 rounded hover:bg-white/5 transition-colors text-gray-300">
          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          Emergency Electrician
        </Link>
        <Link href="/services" className="flex items-center px-3 py-1.5 border border-white/10 rounded hover:bg-white/5 transition-colors text-gray-300">
          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
          Air Conditioning
        </Link>
        <Link href="/services" className="flex items-center px-3 py-1.5 border border-white/10 rounded hover:bg-white/5 transition-colors text-gray-300">
          <svg className="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          More Trades
        </Link>
      </div>
    </div>
  );
};
