import Link from 'next/link';

export const LocationCategories = () => {
  return (
    <section className="bg-white pt-24 pb-16">
      <div className="mx-auto max-w-[1000px] px-6 lg:px-8">
        <h2 className="text-[26px] font-extrabold text-[#061A33] mb-12 text-center">
          Explore Local Pages&apos;s top categories
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center sm:text-left">
          
          <div className="flex flex-col sm:items-start items-center">
            <h3 className="font-extrabold text-[15px] text-[#061A33] mb-5">Sydney</h3>
            <ul className="space-y-3.5">
              {['Electricians', 'Plumbers', 'Painters', 'Concreting', 'Pest Control'].map((item) => (
                <li key={item}><Link href="/locations" className="text-[14px] text-[#9CA3AF] hover:text-[#061A33] transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>
          
          <div className="flex flex-col sm:items-start items-center">
            <h3 className="font-extrabold text-[15px] text-[#061A33] mb-5">Melbourne</h3>
            <ul className="space-y-3.5">
              {['Electricians', 'Plumbers', 'Painters', 'Concreting', 'Pest Control'].map((item) => (
                <li key={item}><Link href="/locations" className="text-[14px] text-[#9CA3AF] hover:text-[#061A33] transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>
          
          <div className="flex flex-col sm:items-start items-center">
            <h3 className="font-extrabold text-[15px] text-[#061A33] mb-5">Brisbane</h3>
            <ul className="space-y-3.5">
              {['Electricians', 'Plumbers', 'Painters', 'Concreting', 'Pest Control'].map((item) => (
                <li key={item}><Link href="/locations" className="text-[14px] text-[#9CA3AF] hover:text-[#061A33] transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>
          
          <div className="flex flex-col sm:items-start items-center">
            <h3 className="font-extrabold text-[15px] text-[#061A33] mb-5">Adelaide</h3>
            <ul className="space-y-3.5">
              {['Electricians', 'Plumbers', 'Painters', 'Concreting', 'Pest Control'].map((item) => (
                <li key={item}><Link href="/locations" className="text-[14px] text-[#9CA3AF] hover:text-[#061A33] transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>
          
        </div>
      </div>
    </section>
  );
};
