import Image from 'next/image';

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        
        <div className="mx-auto max-w-2xl text-center mb-16 sm:mb-20">
          <h2 className="text-[32px] font-extrabold tracking-tight text-[#061A33] sm:text-4xl mb-4">
            How it works
          </h2>
          <p className="text-[17px] leading-8 text-[#6B7280]">
            Getting a tradie is simple, fast and stress-free.
          </p>
        </div>
        
        <div className="mx-auto max-w-[1200px]">
          <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-3 lg:gap-x-8">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-[250px] h-[250px] mb-8">
                <div className="w-full h-full rounded-full overflow-hidden border border-gray-100 shadow-sm relative">
                  <Image 
                    src="/images/how-it-works-1.jpg" 
                    alt="Tell us what you need"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute top-[18px] left-[18px] w-8 h-8 rounded-full bg-brand-pink text-white flex items-center justify-center font-bold text-[14px] shadow-sm border-[3px] border-white z-10">
                  1
                </div>
              </div>
              <h3 className="text-[20px] font-bold text-[#061A33] mb-3">Tell us what you need</h3>
              <p className="text-[#64748B] text-[15px] leading-relaxed max-w-[280px]">
                Answer a few quick questions and even upload a photo.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-[250px] h-[250px] mb-8">
                <div className="w-full h-full rounded-full overflow-hidden border border-gray-100 shadow-sm relative">
                  <Image 
                    src="/images/how-it-works-2.jpg" 
                    alt="Get multiple quotes"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute top-[18px] left-[18px] w-8 h-8 rounded-full bg-brand-pink text-white flex items-center justify-center font-bold text-[14px] shadow-sm border-[3px] border-white z-10">
                  2
                </div>
              </div>
              <h3 className="text-[20px] font-bold text-[#061A33] mb-3">Get multiple quotes</h3>
              <p className="text-[#64748B] text-[15px] leading-relaxed max-w-[280px]">
                Our free service instantly alerts local tradies for quotes.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-[250px] h-[250px] mb-8">
                <div className="w-full h-full rounded-full overflow-hidden border border-gray-100 shadow-sm relative">
                  <Image 
                    src="/images/how-it-works-3.jpg" 
                    alt="Choose the best tradie"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute top-[18px] left-[18px] w-8 h-8 rounded-full bg-brand-pink text-white flex items-center justify-center font-bold text-[14px] shadow-sm border-[3px] border-white z-10">
                  3
                </div>
              </div>
              <h3 className="text-[20px] font-bold text-[#061A33] mb-3">Choose the best tradie</h3>
              <p className="text-[#64748B] text-[15px] leading-relaxed max-w-[280px]">
                Compare profiles and verified reviews to get started.
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};
