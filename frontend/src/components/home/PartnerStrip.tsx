export const PartnerStrip = () => {
  return (
    <section className="bg-brand-light py-12 border-t border-brand-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold text-brand-muted uppercase tracking-wider mb-8">
          Brands & Resources
        </p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
          <div className="text-xl font-bold font-serif text-brand-navy">BUNNINGS</div>
          <div className="text-xl font-bold font-sans text-brand-navy">IKEA</div>
          <div className="text-xl font-bold font-mono text-brand-navy">REECE</div>
          <div className="text-xl font-bold font-serif text-brand-navy">James Hardie</div>
          <div className="text-xl font-bold font-sans text-brand-navy">Colorbond</div>
          <div className="text-xl font-bold font-mono text-brand-navy">makita</div>
        </div>
      </div>
    </section>
  );
};
