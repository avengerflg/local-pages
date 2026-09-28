export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-white py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">How it works</h2>
          <p className="mt-4 text-lg leading-8 text-brand-muted">
            Getting a tradie is simple, fast and stress-free.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:max-w-5xl">
          <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-3 lg:gap-x-12">
            
            <div className="flex flex-col items-center text-center">
              <div className="relative w-32 h-32 mb-6">
                <div className="w-full h-full rounded-full bg-brand-light border border-brand-border flex items-center justify-center text-brand-muted">
                  [ Image 1 ]
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-brand-pink text-white flex items-center justify-center font-bold text-lg shadow-lg border-2 border-white">
                  1
                </div>
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">Tell us what you need</h3>
              <p className="text-brand-muted text-sm leading-relaxed">Answer a few quick questions and even upload a photo.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="relative w-32 h-32 mb-6">
                <div className="w-full h-full rounded-full bg-brand-light border border-brand-border flex items-center justify-center text-brand-muted">
                  [ Image 2 ]
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-brand-pink text-white flex items-center justify-center font-bold text-lg shadow-lg border-2 border-white">
                  2
                </div>
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">Get multiple quotes</h3>
              <p className="text-brand-muted text-sm leading-relaxed">Our free service instantly alerts local tradies for quotes.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="relative w-32 h-32 mb-6">
                <div className="w-full h-full rounded-full bg-brand-light border border-brand-border flex items-center justify-center text-brand-muted">
                  [ Image 3 ]
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-brand-pink text-white flex items-center justify-center font-bold text-lg shadow-lg border-2 border-white">
                  3
                </div>
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">Choose the best tradie</h3>
              <p className="text-brand-muted text-sm leading-relaxed">Compare profiles and verified reviews to get started.</p>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};
