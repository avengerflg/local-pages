export const FeaturedArticle = () => {
  return (
    <section className="bg-brand-light py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-brand-border overflow-hidden lg:flex">
          <div className="p-8 sm:p-12 lg:w-1/2 flex flex-col justify-center">
            <span className="text-brand-pink text-[10px] font-bold tracking-widest uppercase mb-4">
              POOL FENCING
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-brand-navy mb-4 leading-tight">
              How Much Does Glass Pool Fencing Cost? [2026]
            </h3>
            <p className="text-brand-muted mb-8 leading-relaxed">
              Glass pool fencing is a popular choice for modern Australian homes. Discover the average costs, installation factors, and what to look for when hiring a professional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button className="rounded-lg bg-brand-pink px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-brand-pink-hover text-center transition-colors">
                Read article
              </button>
              <button className="rounded-lg border border-brand-border bg-white px-6 py-2.5 text-sm font-bold text-brand-navy hover:bg-gray-50 text-center transition-colors">
                View all articles
              </button>
            </div>
          </div>
          <div className="lg:w-1/2 h-64 sm:h-80 lg:h-auto bg-gray-200 flex items-center justify-center text-gray-500">
            [ Article Image: Pool ]
          </div>
        </div>
      </div>
    </section>
  );
};
