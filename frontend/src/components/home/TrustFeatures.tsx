export const TrustFeatures = () => {
  return (
    <section className="bg-white py-12 lg:py-[60px] border-y border-gray-100">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 lg:gap-12">
          
          {/* Feature 1 */}
          <div className="flex items-center gap-5">
            <div className="w-[60px] h-[60px] rounded-full bg-[#FCECF3] flex items-center justify-center shrink-0">
              <svg className="w-[28px] h-[28px] text-brand-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a9 9 0 00-9 9v4a2 2 0 002 2h2a2 2 0 002-2v-4a2 2 0 00-2-2H4a9 9 0 1116 0h-3a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 002-2v-4a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#061A33] mb-1.5 leading-tight">Customer support</h3>
              <p className="text-[14px] text-[#64748B] leading-snug">
                Our team is on hand if you need help.
              </p>
            </div>
          </div>
          
          {/* Feature 2 */}
          <div className="flex items-center gap-5">
            <div className="w-[60px] h-[60px] rounded-full bg-[#FCECF3] flex items-center justify-center shrink-0">
              <svg className="w-[28px] h-[28px] text-brand-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#061A33] mb-1.5 leading-tight">Registered and licensed</h3>
              <p className="text-[14px] text-[#64748B] leading-snug">
                ABNs and licenses checked.
              </p>
            </div>
          </div>
          
          {/* Feature 3 */}
          <div className="flex items-center gap-5">
            <div className="w-[60px] h-[60px] rounded-full bg-[#FCECF3] flex items-center justify-center shrink-0">
              <svg className="w-[28px] h-[28px] text-brand-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#061A33] mb-1.5 leading-tight">A trusted community</h3>
              <p className="text-[14px] text-[#64748B] leading-snug">
                Helping Australians find quality trades since 2010.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};
