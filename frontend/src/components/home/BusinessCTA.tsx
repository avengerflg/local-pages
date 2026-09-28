import Link from 'next/link';
import Image from 'next/image';

export const BusinessCTA = () => {
  return (
    <section className="w-full flex flex-col lg:flex-row border-y border-brand-navy-light/10">
      {/* Left Content */}
      <div className="w-full lg:w-1/2 bg-[#061A33] flex items-center justify-center py-24 px-8 sm:px-16 lg:py-32 xl:px-24">
        <div className="max-w-xl w-full">
          <div className="text-brand-pink text-[12px] font-bold tracking-[0.1em] uppercase mb-4">
            FOR HOMEOWNERS
          </div>
          <h2 className="text-[36px] sm:text-[44px] font-bold tracking-tight text-white leading-[1.1] mb-6">
            Connect with more local<br className="hidden sm:block" /> clients
          </h2>
          <p className="text-[17px] leading-[1.7] text-[#9CA3AF] mb-12 max-w-[480px]">
            We send you job leads and you can manage them all in one app so you&apos;ll save time on admin.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/register" className="flex items-center justify-center rounded-full bg-brand-pink px-8 py-3.5 text-[15px] font-bold text-white shadow-sm hover:bg-brand-pink-hover transition-colors">
              List your business
            </Link>
            <Link href="/#how-it-works" className="flex items-center justify-center gap-2 rounded-full border border-white/20 bg-transparent px-8 py-3.5 text-[15px] font-bold text-white hover:bg-white/5 transition-colors">
              <svg className="w-5 h-5 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              How it works
            </Link>
          </div>
        </div>
      </div>
      
      {/* Right Image */}
      <div className="w-full lg:w-1/2 relative min-h-[450px] lg:min-h-[600px] flex items-end justify-end">
        <Image 
          src="/images/business-cta.jpg"
          alt="Tradie working on site"
          fill
          className="object-cover"
        />
        
        {/* Floating Card */}
        <div className="absolute bottom-6 right-6 lg:bottom-12 lg:right-12 bg-[#FFFDF5] rounded-[10px] py-4 px-5 shadow-2xl max-w-[240px]">
          <h4 className="text-[#061A33] font-extrabold text-[15px] mb-1 leading-tight">More opportunities</h4>
          <p className="text-[#64748B] text-[13px] leading-snug">For what you do best.</p>
        </div>
      </div>
    </section>
  );
};
