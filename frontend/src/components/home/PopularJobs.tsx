import Link from 'next/link';

export const PopularJobs = () => {
  const categories = [
    { name: 'Handymen', active: true },
    { name: 'Electricians', active: false },
    { name: 'Plumbers', active: false },
    { name: 'Fencers', active: false },
    { name: 'Concreters', active: false },
    { name: 'Gardeners', active: false },
    { name: 'Painters', active: false },
    { name: 'Tilers', active: false }
  ];

  return (
    <section className="bg-white py-16 sm:py-24 border-b border-brand-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">Most popular jobs</h2>
          <p className="mt-3 text-brand-muted">Browse top categories and find trusted local experts.</p>
        </div>
        
        <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar snap-x">
          {categories.map((cat) => (
            <Link key={cat.name} href={`/services?type=${cat.name.toLowerCase()}`} className={`snap-start shrink-0 flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border transition-all ${cat.active ? 'border-brand-pink shadow-[0_0_15px_rgba(245,0,103,0.15)] bg-pink-50/30' : 'border-brand-border hover:border-brand-pink/50 bg-white'}`}>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 mb-2 rounded-full flex items-center justify-center ${cat.active ? 'bg-brand-pink text-white' : 'bg-brand-light text-brand-navy'}`}>
                {/* Placeholder Icon */}
                <span className="text-xs">✦</span>
              </div>
              <span className={`text-xs sm:text-sm font-semibold ${cat.active ? 'text-brand-pink' : 'text-brand-navy'}`}>{cat.name}</span>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 flex items-center justify-center flex-wrap gap-2 text-sm">
          <span className="text-brand-muted font-medium mr-2">Popular in Handyman:</span>
          {['Furniture Assembly', 'Door Repair', 'Picture Hanging', 'TV Wall Mounting'].map((tag) => (
            <span key={tag} className="px-3 py-1 bg-brand-light text-brand-navy rounded-full text-xs font-semibold border border-brand-border">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
