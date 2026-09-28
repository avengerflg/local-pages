export const PlanningCTA = () => {
  return (
    <div className="bg-[#F8FAFC] border-y border-gray-100">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-7 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="w-[52px] h-[52px] rounded-[14px] bg-[#FCECF3] flex items-center justify-center shrink-0">
            <svg className="w-[22px] h-[22px] text-brand-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v12H8l-4 4V4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-[#061A33] font-bold text-[18px] leading-tight mb-0.5">Planning your next home project?</h3>
            <p className="text-[#64748B] text-[15px]">Get expert guidance to understand, plan and feel confident to start your next project.</p>
          </div>
        </div>
        
        <button className="bg-[#061A33] hover:bg-[#0a274a] text-white px-7 py-3 rounded-full text-[14px] font-bold transition-colors whitespace-nowrap shrink-0 flex items-center justify-center gap-2 w-full md:w-auto shadow-sm">
          Start a chat
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
        
      </div>
    </div>
  );
};
