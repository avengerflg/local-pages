import Link from 'next/link';
import Image from 'next/image';

export const Hero = () => {
  return (
    <div className="relative w-full h-[600px] lg:h-[700px] overflow-hidden flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/tradie-hero.jpg" 
          alt="Trusted Local Tradesman" 
          fill
          priority
          className="object-cover object-top lg:object-[center_25%]"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#061A33] via-[#061A33]/90 lg:via-[#061A33]/80 to-transparent z-10"></div>
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-4 lg:px-8 relative z-20 flex flex-col lg:flex-row justify-between items-center mt-8 lg:mt-0">
        
        {/* Left Content */}
        <div className="w-full lg:w-[60%] max-w-2xl pt-4 lg:pt-0">
          <p className="text-[11px] font-bold text-gray-300 tracking-[0.15em] uppercase mb-4">
            Australia&apos;s local trade referral service.
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-[72px] font-extrabold tracking-tight text-white leading-[1.05] mb-6">
            Find Trusted<br />
            <span className="text-brand-pink">Local Trades</span> Fast.
          </h1>
          <p className="text-[17px] leading-relaxed text-gray-300 max-w-md mb-8">
            Australia&apos;s local trade referral service. Connect with trusted tradies in your area in seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12">
            <Link href="/services" className="flex items-center justify-center gap-2 rounded-md bg-brand-pink px-6 py-3.5 text-left w-full sm:w-auto shadow-lg hover:bg-brand-pink-hover transition-colors group">
              <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              <div>
                <div className="text-sm font-bold text-white leading-tight">FIND A TRADE NOW</div>
                <div className="text-[10px] text-white/80 font-normal mt-0.5">Search by trade or suburb</div>
              </div>
            </Link>
            <Link href="/#how-it-works" className="flex items-center justify-center gap-3 rounded-md border border-white/20 bg-[#0B1524]/70 px-6 py-3.5 text-left w-full sm:w-auto hover:bg-[#0B1524] transition-colors backdrop-blur-sm">
              <div className="w-6 h-6 rounded-full border border-white flex items-center justify-center shrink-0">
                <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
              <div>
                <div className="text-sm font-bold text-white leading-tight">HOW IT WORKS</div>
                <div className="text-[10px] text-white/70 font-normal mt-0.5">See how it works</div>
              </div>
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-8 gap-y-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-brand-pink/30 text-brand-pink bg-[#0B1524]/50 backdrop-blur-sm shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <div className="text-[12px] font-bold text-white leading-tight tracking-wide">Verified<br/><span className="text-gray-400 font-medium">Businesses</span></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-brand-pink/30 text-brand-pink bg-[#0B1524]/50 backdrop-blur-sm shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
              </div>
              <div className="text-[12px] font-bold text-white leading-tight tracking-wide">Rated &<br/><span className="text-gray-400 font-medium">Reviewed</span></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-brand-pink/30 text-brand-pink bg-[#0B1524]/50 backdrop-blur-sm shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
              </div>
              <div className="text-[12px] font-bold text-white leading-tight tracking-wide">Police<br/><span className="text-gray-400 font-medium">Checked</span></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-brand-pink/30 text-brand-pink bg-[#0B1524]/50 backdrop-blur-sm shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div className="text-[12px] font-bold text-white leading-tight tracking-wide">Available<br/><span className="text-gray-400 font-medium">24/7</span></div>
            </div>
          </div>
        </div>

        {/* Right Content - Floating Card */}
        <div className="hidden lg:block lg:w-[320px] xl:w-[380px] shrink-0 transform lg:translate-x-4 z-20">
          <div className="bg-[#0B1524] rounded-2xl p-7 shadow-2xl border border-[#1A273D]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-[52px] h-[52px] rounded-xl bg-brand-pink flex items-center justify-center shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <div>
                <div className="text-[12px] font-bold text-white tracking-widest uppercase mb-0.5">TRUSTED LOCAL</div>
                <div className="text-[11px] font-bold text-brand-pink tracking-wide uppercase">TRADES YOU CAN RELY ON</div>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8">
              {['Police Checked', 'Licensed & Insured', 'Verified Reviews', 'Quality Workmanship', 'Local Australian Businesses'].map((item) => (
                <li key={item} className="flex items-center text-[14px] font-bold text-white gap-3.5">
                  <div className="w-5 h-5 rounded-full border border-brand-pink flex items-center justify-center text-brand-pink shrink-0">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            
            <div className="border-t border-[#1A273D] pt-5">
              <div className="flex text-[#FFC107] text-lg mb-1.5 gap-1">
                {'★★★★★'.split('').map((star, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>
                ))}
              </div>
              <div className="text-[13px] font-medium text-white/70">
                <strong className="text-white">4.8/5</strong> from 2,500+ verified reviews
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
