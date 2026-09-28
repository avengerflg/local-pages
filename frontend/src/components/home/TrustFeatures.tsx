export const TrustFeatures = () => {
  return (
    <section className="bg-white py-12 border-y border-brand-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-brand-border">
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 pt-8 md:pt-0 md:px-6 first:pt-0 first:px-0">
            <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center shrink-0">
              <span className="text-brand-pink font-bold">♥</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-navy">Customer support</h3>
              <p className="text-sm text-brand-muted mt-1">Our team is on hand if you need help.</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 pt-8 md:pt-0 md:px-6">
            <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center shrink-0">
              <span className="text-brand-pink font-bold">✓</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-navy">Registered and licensed</h3>
              <p className="text-sm text-brand-muted mt-1">ABNs and licenses checked.</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 pt-8 md:pt-0 md:pl-6">
            <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center shrink-0">
              <span className="text-brand-pink font-bold">★</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-navy">A trusted community</h3>
              <p className="text-sm text-brand-muted mt-1">Helping Australians find quality local trades.</p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};
