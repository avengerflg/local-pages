import Image from 'next/image';
import Link from 'next/link';

export const FeaturedArticle = () => {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="rounded-[24px] overflow-hidden flex flex-col lg:flex-row shadow-sm min-h-[440px]">
          
          {/* Left Content */}
          <div className="lg:w-1/2 bg-[#0B1524] p-10 sm:p-14 lg:p-16 flex flex-col justify-center">
            <span className="text-brand-pink text-[11px] font-bold tracking-[0.1em] uppercase mb-4">
              POOL FENCING
            </span>
            <h3 className="text-[32px] sm:text-[36px] font-bold text-white mb-5 leading-[1.2]">
              How Much Does Glass Pool Fencing Cost? [2026]
            </h3>
            <p className="text-[#9CA3AF] text-[16px] leading-[1.7] mb-10 max-w-[500px]">
              Glass pool fencing allows you to have a view of your pool, but how much does it cost? There are ways to minimise the cost.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mt-auto">
              <Link href="/articles/glass-pool-fencing-cost" className="rounded-full bg-brand-pink px-8 py-3.5 text-[15px] font-bold text-white shadow-sm hover:bg-brand-pink-hover text-center transition-colors">
                Read article
              </Link>
              <Link href="/articles" className="text-[15px] font-bold text-white hover:text-gray-300 transition-colors">
                View all articles
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:w-1/2 relative h-[300px] sm:h-[400px] lg:h-auto">
            <Image 
              src="/images/pool-fencing.jpg" 
              alt="Luxury glass pool fencing at dusk"
              fill
              className="object-cover"
            />
          </div>
          
        </div>
      </div>
    </section>
  );
};
