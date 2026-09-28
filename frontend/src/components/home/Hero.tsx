import Link from 'next/link';

export const Hero = () => {
  return (
    <div className="bg-brand-navy relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 sm:py-24 lg:flex lg:items-center">
        
        {/* Left Column */}
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 z-10 pt-8 pb-12 lg:pt-16 lg:pb-24">
          <p className="text-sm font-semibold text-gray-300 tracking-wide uppercase mb-4">
            Australia&apos;s local trade referral service.
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[64px] leading-[1.1] mb-6">
            Find Trusted<br />
            <span className="text-brand-pink">Local Trades</span> Fast.
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300 max-w-md">
            Australia&apos;s local trade referral service. Connect with trusted tradies in your area in seconds.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link href="/services" className="rounded-lg bg-brand-pink px-8 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-brand-pink-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink transition-colors w-full sm:w-auto text-center">
              FIND A TRADE NOW
            </Link>
            <Link href="/#how-it-works" className="rounded-lg border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-white/10 transition-colors w-full sm:w-auto text-center">
              HOW IT WORKS
            </Link>
          </div>
          
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-brand-pink"></div> Verified
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-brand-pink"></div> Rated & Reviewed
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-brand-pink"></div> Police Checked
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 flex items-center justify-center lg:justify-end mt-10 lg:mt-0 relative">
          <div className="w-full max-w-lg aspect-square lg:aspect-auto lg:h-full bg-brand-navy-light/50 rounded-2xl lg:rounded-none lg:rounded-l-[4rem] relative overflow-hidden flex items-center justify-center text-gray-500">
            {/* Temporary Placeholder for Trade Professional Photograph */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy to-brand-navy-light opacity-80 mix-blend-multiply"></div>
            <p className="z-10">[ Trade Professional Image ]</p>
            
            {/* Trusted Local Card */}
            <div className="absolute bottom-8 lg:bottom-16 left-8 lg:-left-12 z-20 bg-brand-navy border border-white/10 rounded-2xl p-6 shadow-2xl max-w-[280px]">
              <div className="text-[10px] font-bold text-brand-pink tracking-widest uppercase mb-1">TRUSTED LOCAL</div>
              <h3 className="text-white font-bold text-lg mb-4 leading-tight">TRADE YOU CAN RELY ON</h3>
              
              <ul className="space-y-2 mb-4">
                {['Police Checked', 'Licensed & Insured', 'Verified Reviews', 'Quality Workmanship'].map((item) => (
                  <li key={item} className="flex items-center text-xs text-gray-300 gap-2">
                    <svg className="w-4 h-4 text-brand-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {item}
                  </li>
                ))}
              </ul>
              
              <div className="border-t border-white/10 pt-4 mt-2">
                <div className="flex text-yellow-400 text-sm mb-1">
                  ★★★★★
                </div>
                <div className="text-[10px] text-gray-400">4.8/5 from verified reviews</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
