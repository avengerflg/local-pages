export const PlanningCTA = () => {
  return (
    <div className="bg-brand-light border-y border-brand-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-brand-pink/10 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-brand-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
          </div>
          <div>
            <h3 className="text-brand-navy font-bold text-base sm:text-lg">Planning your next home project?</h3>
            <p className="text-brand-muted text-sm mt-0.5">Get expert guidance to understand, plan and feel confident to start your project.</p>
          </div>
        </div>
        <button className="bg-brand-navy hover:bg-brand-navy-light text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0">
          Start a chat →
        </button>
      </div>
    </div>
  );
};
