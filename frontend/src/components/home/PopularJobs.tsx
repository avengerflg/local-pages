import Link from 'next/link';

export const PopularJobs = () => {
  const categories = [
    { 
      name: 'Handymen', 
      active: true,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7.5v9l-8 4.5-8-4.5v-9l8-4.5 8 4.5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7.5l8 4.5 8-4.5" />
        </svg>
      )
    },
    { 
      name: 'Electricians', 
      active: false,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5L18.5 8v8l-6.5 3.5L5.5 16V8L12 4.5z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    },
    { 
      name: 'Plumbers', 
      active: false,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          {/* Quick wrench approximation */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      )
    },
    { 
      name: 'Fencers', 
      active: false,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <rect x="5" y="4" width="2" height="16" rx="1" />
          <rect x="11" y="4" width="2" height="16" rx="1" />
          <rect x="17" y="4" width="2" height="16" rx="1" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18" />
        </svg>
      )
    },
    { 
      name: 'Concreters', 
      active: false,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 12h16M4 16h16" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 8c1.5 1.5 3.5 1.5 5 0s3.5-1.5 5 0 3.5 1.5 5 0" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12c1.5-1.5 3.5-1.5 5 0s3.5 1.5 5 0 3.5-1.5 5 0" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 16c1.5 1.5 3.5 1.5 5 0s3.5-1.5 5 0 3.5 1.5 5 0" />
        </svg>
      )
    },
    { 
      name: 'Gardeners', 
      active: false,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14c-3 0-5-2-5-5s2-5 5-5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14c3 0 5-2 5-5s-2-5-5-5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18c-2 0-4-1-4-3s1-3 4-3" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18c2 0 4-1 4-3s-1-3-4-3" />
        </svg>
      )
    },
    { 
      name: 'Painters', 
      active: false,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 6h10v4H7z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-7v4h-2v-4a2 2 0 0 1 2-2h4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v3" />
        </svg>
      )
    },
    { 
      name: 'Tilers', 
      active: false,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <rect x="4" y="4" width="16" height="16" rx="1" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16M4 12h16" />
        </svg>
      )
    }
  ];

  return (
    <section className="bg-white py-20 pb-24 border-b border-gray-100">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className="text-[36px] font-extrabold tracking-tight text-[#0B1524] mb-3">Most popular jobs</h2>
          <p className="text-[17px] text-[#6B7280]">Browse top categories and find trusted local experts.</p>
        </div>
        
        {/* Categories Grid/Row */}
        <div className="flex justify-start xl:justify-center overflow-x-auto pb-6 gap-5 hide-scrollbar px-2 snap-x">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              href={`/services?type=${cat.name.toLowerCase()}`} 
              className={`snap-start shrink-0 flex flex-col items-center justify-center w-[130px] h-[130px] rounded-2xl transition-all
                ${cat.active 
                  ? 'border-2 border-brand-pink shadow-[0_4px_24px_rgba(245,0,103,0.18)] bg-white z-10' 
                  : 'border border-gray-200 hover:border-gray-300 bg-white shadow-sm'
                }
              `}
            >
              <div className={`mb-3 flex items-center justify-center ${cat.active ? 'text-brand-pink' : 'text-[#1E293B]'}`}>
                {cat.icon}
              </div>
              <span className={`text-[13px] font-bold ${cat.active ? 'text-brand-pink' : 'text-[#1E293B]'}`}>
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
        
        {/* Popular Tags */}
        <div className="mt-8 flex items-center justify-center flex-wrap gap-2.5 text-sm">
          <span className="text-[#061A33] font-extrabold text-[13px] mr-1">Popular in Handymen:</span>
          {['Basic Bricklaying', 'Basic Carpentry', 'Basic Concreting', 'Furniture Assembly', 'Odd Jobs'].map((tag) => (
            <Link 
              key={tag} 
              href={`/services?search=${encodeURIComponent(tag)}`}
              className="px-4 py-1.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] hover:text-[#475569] rounded-full text-[12px] font-semibold transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
        
      </div>
    </section>
  );
};
