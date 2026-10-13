import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock, Sparkles } from 'lucide-react';

const steps = [
  {
    step: '01',
    time: 'Takes ~60 seconds',
    title: 'Describe Your Job',
    description: 'Select your trade service, enter your suburb or postcode, and tell us what you need done. Add details or photos for precise quotes.',
    image: '/images/how-it-works-1.jpg',
    points: ['No obligation to hire', 'Instant suburb matching', 'Photos accepted'],
  },
  {
    step: '02',
    time: 'Within 5–15 mins',
    title: 'Compare Verified Quotes',
    description: 'Local, licensed, and insured trade businesses review your job and provide transparent estimates or call you directly.',
    image: '/images/how-it-works-2.jpg',
    points: ['Verified ABN & licenses', 'Genuine past customer ratings', 'Direct contact options'],
  },
  {
    step: '03',
    time: 'Stress-free finish',
    title: 'Hire With Confidence',
    description: 'Pick the best tradie based on price, reviews, and availability. Pay the tradie directly when the job is completed to your satisfaction.',
    image: '/images/how-it-works-3.jpg',
    points: ['Zero middleman markups', 'Quality workmanship', 'Leave your feedback'],
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="bg-white py-20 lg:py-28 relative overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Simple 3-Step Process
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-brand-navy leading-tight">
            How <span className="text-brand-pink">Local Pages</span> Works
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Finding a trusted, licensed Australian tradie has never been this straightforward and stress-free.
          </p>
        </div>
        
        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 relative">
          
          {steps.map((item, idx) => (
            <div 
              key={idx}
              className="group relative bg-[#F8FAFC] rounded-3xl p-6 sm:p-7 border border-slate-200/80 transition-all duration-300 hover:shadow-[0_20px_45px_rgba(4,19,41,0.08)] hover:-translate-y-1.5 flex flex-col"
            >
              {/* Image Container with Step Number */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-sm border border-slate-200/60">
                <Image 
                  src={item.image} 
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Step Badge */}
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-brand-navy/90 backdrop-blur-md text-white font-heading font-extrabold text-xs tracking-wider flex items-center gap-1.5 shadow-md">
                  <span className="text-brand-pink">STEP</span>
                  <span>{item.step}</span>
                </div>

                {/* Time Badge */}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md text-slate-700 font-semibold text-[11px] flex items-center gap-1.5 shadow-sm">
                  <Clock className="w-3 h-3 text-brand-pink" />
                  <span>{item.time}</span>
                </div>
              </div>

              {/* Title & Desc */}
              <h3 className="font-heading text-xl font-bold text-brand-navy mb-2.5 group-hover:text-brand-pink transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-grow">
                {item.description}
              </p>

              {/* Bullet Highlights */}
              <ul className="space-y-2 pt-4 border-t border-slate-200/70">
                {item.points.map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-brand-pink text-white font-heading font-bold text-base hover:bg-brand-pink-dark transition-all shadow-[0_8px_25px_rgba(245,43,104,0.3)] hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Post a Job & Get Free Quotes</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-xs text-slate-500 mt-3 font-medium">
            100% Free for Homeowners • No Credit Card Required • Zero Obligation
          </p>
        </div>

      </div>
    </section>
  );
};

