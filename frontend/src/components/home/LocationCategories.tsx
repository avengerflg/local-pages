import Link from 'next/link';

export const LocationCategories = () => {
  return (
    <section className="bg-white py-20 border-t border-brand-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-brand-navy mb-10 text-center sm:text-left">Explore Local Pages&apos; top categories</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          <div>
            <h3 className="font-bold text-lg text-brand-navy mb-4">Sydney</h3>
            <ul className="space-y-3">
              {['Electricians', 'Plumbers', 'Painters', 'Concreting', 'Pest Control'].map((item) => (
                <li key={item}><Link href="/locations" className="text-sm text-brand-muted hover:text-brand-pink">{item}</Link></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg text-brand-navy mb-4">Melbourne</h3>
            <ul className="space-y-3">
              {['Electricians', 'Plumbers', 'Painters', 'Concreting', 'Pest Control'].map((item) => (
                <li key={item}><Link href="/locations" className="text-sm text-brand-muted hover:text-brand-pink">{item}</Link></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg text-brand-navy mb-4">Brisbane</h3>
            <ul className="space-y-3">
              {['Electricians', 'Plumbers', 'Painters', 'Concreting', 'Pest Control'].map((item) => (
                <li key={item}><Link href="/locations" className="text-sm text-brand-muted hover:text-brand-pink">{item}</Link></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg text-brand-navy mb-4">Adelaide</h3>
            <ul className="space-y-3">
              {['Electricians', 'Plumbers', 'Painters', 'Concreting', 'Pest Control'].map((item) => (
                <li key={item}><Link href="/locations" className="text-sm text-brand-muted hover:text-brand-pink">{item}</Link></li>
              ))}
            </ul>
          </div>
          
        </div>
      </div>
    </section>
  );
};
