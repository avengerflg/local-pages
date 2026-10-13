import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, 
  HeartHandshake, 
  MapPin, 
  CheckCircle2, 
  Zap, 
  FileCheck, 
  Star,
  ArrowRight,
  Sparkles,
  Building,
  BadgeCheck
} from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { UtilityBar } from '@/components/layout/UtilityBar';

export const metadata = {
  title: 'About Us | Local Pages Australia',
  description: 'Learn about Local Pages — Australia’s verified local trades directory connecting homeowners directly with licensed, insured tradies.',
};

const verificationSteps = [
  {
    step: '01',
    title: 'ABN & Entity Registration',
    desc: 'Every business is cross-checked with the Australian Business Register (ABR) to ensure valid registration and active GST status.',
    icon: FileCheck,
    color: 'text-blue-600 bg-blue-50 border-blue-100',
  },
  {
    step: '02',
    title: 'State Trade Licensing',
    desc: 'We verify license validity across state authorities including Fair Trading NSW, QBCC QLD, VBA Victoria, and Consumer Protection WA.',
    icon: BadgeCheck,
    color: 'text-amber-600 bg-amber-50 border-amber-100',
  },
  {
    step: '03',
    title: 'Public Liability Insurance',
    desc: 'Contractors must hold active insurance policies (min. $5M–$20M cover) to safeguard homeowners and property during all project phases.',
    icon: ShieldCheck,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  },
  {
    step: '04',
    title: 'Real Homeowner Reviews',
    desc: 'Ratings and feedback are verified to prevent fake reviews and ensure transparent, honest reputational scores for every pro.',
    icon: Star,
    color: 'text-rose-600 bg-rose-50 border-rose-100',
  },
];

const coreValues = [
  {
    icon: ShieldCheck,
    title: 'Trust & Accountability',
    desc: 'We independently audit licenses and police checks so you never have to guess whether someone working in your home is qualified.',
    accent: 'bg-blue-50 text-brand-blue border-blue-100',
  },
  {
    icon: HeartHandshake,
    title: 'Zero Middleman Markup',
    desc: 'We do not take a cut from your job. You get direct quotes from tradespeople without hidden fees inflating the final price.',
    accent: 'bg-rose-50 text-brand-pink border-rose-100',
  },
  {
    icon: Zap,
    title: '24/7 Priority Emergency Standby',
    desc: 'When an urgent disaster strikes — burst pipes, switchboard fires, storm leaks — our directory connects you with on-call trades instantly.',
    accent: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  {
    icon: Building,
    title: 'Supporting Australian Tradies',
    desc: 'We champion honest, hard-working Australian trade business owners by giving them a transparent platform to grow their local client base.',
    accent: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
];

const coverageStats = [
  { region: 'New South Wales', tradies: '2,850+ Pros', tag: 'Sydney, Newcastle, Wollongong, Central Coast' },
  { region: 'Victoria', tradies: '2,400+ Pros', tag: 'Melbourne, Geelong, Ballarat, Bendigo' },
  { region: 'Queensland', tradies: '1,750+ Pros', tag: 'Brisbane, Gold Coast, Sunshine Coast, Cairns' },
  { region: 'Western Australia', tradies: '920+ Pros', tag: 'Perth, Fremantle, Mandurah, Bunbury' },
  { region: 'South Australia & ACT', tradies: '650+ Pros', tag: 'Adelaide, Canberra, Barossa, Hills' },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <UtilityBar />
      <PublicHeader />

      <main className="flex-grow">

        {/* 1. Hero Banner */}
        <section className="relative overflow-hidden bg-[#071731] text-white py-16 lg:py-24 border-b border-slate-700/60">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60" />
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-pink/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white/90 border border-white/15 text-xs font-bold uppercase tracking-wider mb-5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-brand-pink" />
              <span>Proudly Australian Owned & Operated</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-white mb-6 leading-tight">
              A Better, Safer Way to Find <span className="text-brand-pink">Trusted Local Tradies</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto mb-10">
              Local Pages was created to eliminate the anxiety, fake reviews, and inflated commissions of hiring contractors. We connect Australian homeowners directly with vetted, licensed, and reliable local professionals.
            </p>

            {/* Metric Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/10 backdrop-blur-xl p-5 sm:p-6 rounded-2xl border border-white/15 shadow-xl text-left">
              <div>
                <div className="font-heading font-extrabold text-2xl sm:text-3xl text-white">8,500+</div>
                <div className="text-xs text-slate-300 font-medium">Licensed Tradies</div>
              </div>
              <div>
                <div className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-pink">100%</div>
                <div className="text-xs text-slate-300 font-medium">License & ABN Audited</div>
              </div>
              <div>
                <div className="font-heading font-extrabold text-2xl sm:text-3xl text-emerald-400">4.9 / 5</div>
                <div className="text-xs text-slate-300 font-medium">18,400+ Verified Reviews</div>
              </div>
              <div>
                <div className="font-heading font-extrabold text-2xl sm:text-3xl text-amber-400">$0 Fee</div>
                <div className="text-xs text-slate-300 font-medium">Free for Homeowners</div>
              </div>
            </div>

          </div>
        </section>


        {/* 2. Our Story / Split Section */}
        <section className="py-16 lg:py-24 bg-white border-b border-slate-200/80">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: Authentic Photography with Badges */}
              <div className="lg:col-span-6 relative">
                <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80">
                  <Image
                    src="/images/tradie-hero.jpg"
                    alt="Licensed Australian Electrician"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                </div>

                {/* Floating Verified Tradie Badge */}
                <div className="absolute -bottom-6 -right-2 sm:-right-6 bg-white rounded-2xl p-4 shadow-[0_20px_45px_rgba(7,27,58,0.14)] border border-slate-100 max-w-[280px]">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-brand-navy">100% Pre-Screened</div>
                      <div className="text-[11px] text-emerald-600 font-semibold">Fair Trading NSW & QBCC Audited</div>
                    </div>
                  </div>
                </div>

                {/* Floating Experience Pill */}
                <div className="absolute -top-4 -left-2 sm:-left-4 bg-brand-navy text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg border border-white/10 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Serving All Australian Suburbs</span>
                </div>
              </div>

              {/* Right Column: Mission Content */}
              <div className="lg:col-span-6">
                <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-brand-pink mb-3">
                  <span>Our Mission & Purpose</span>
                </div>
                
                <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight leading-tight mb-6">
                  We’re Bringing Honesty and Transparency Back to Hiring Tradies
                </h2>

                <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
                  <p>
                    Every Australian homeowner has experienced the headache: calling five different contractors, waiting days for a callback, or getting an inflated invoice with unexpected middleman commissions tacked on.
                  </p>
                  <p>
                    <strong>Local Pages was built to fix this.</strong> We don&apos;t hide phone numbers behind paywalls or take commission cuts from tradies&apos; hard work. Instead, we independently audit licenses, insurance, and police checks so you can contact honest local professionals with absolute peace of mind.
                  </p>
                </div>

                {/* Key Commitments Checklist */}
                <div className="space-y-3.5 pt-4 border-t border-slate-100">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-slate-800">
                      <strong>Direct Contact:</strong> Call or chat directly with the business owner, not a call-center middleman.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-slate-800">
                      <strong>Zero Markup:</strong> Free for homeowners, with zero commission surcharges on your project quote.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-slate-800">
                      <strong>Hyper-Local Accountability:</strong> Support licensed tradies living and working in your own neighborhood.
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>


        {/* 3. The 4-Step Verification Standard */}
        <section className="py-16 lg:py-24 bg-[#F8FAFC] border-b border-slate-200/80">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>The Verification Pipeline</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
                How We Vet Every Tradie
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2.5">
                Before any business profile goes live on Local Pages, our compliance team reviews four mandatory security standards.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {verificationSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div 
                    key={step.step}
                    className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-sm ${step.color}`}>
                          <Icon className="w-6 h-6" strokeWidth={2.2} />
                        </div>
                        <span className="font-heading font-extrabold text-2xl text-slate-200">
                          {step.step}
                        </span>
                      </div>

                      <h3 className="font-heading font-bold text-lg text-brand-navy mb-2 leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified Standard</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>


        {/* 4. Core Values & Principles */}
        <section className="py-16 lg:py-24 bg-white border-b border-slate-200/80">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-pink/10 text-brand-pink text-xs font-bold uppercase tracking-wider mb-3">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Our Principles</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
                Built On Australian Community Values
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2.5">
                We believe fair trade, quality craftsmanship, and transparent pricing benefit both homeowners and contractors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreValues.map((val, idx) => {
                const Icon = val.icon;
                return (
                  <div 
                    key={idx}
                    className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-brand-pink/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className={`w-13 h-13 rounded-2xl border flex items-center justify-center mb-6 shadow-sm ${val.accent}`}>
                        <Icon className="w-6 h-6" strokeWidth={2.2} />
                      </div>
                      <h3 className="font-heading font-bold text-lg sm:text-xl text-brand-navy mb-2.5 leading-snug">
                        {val.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                        {val.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>


        {/* 5. National Coverage by Region */}
        <section className="py-16 lg:py-20 bg-[#F8FAFC] border-b border-slate-200/80">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-brand-blue text-xs font-bold uppercase tracking-wider mb-3">
                <MapPin className="w-3.5 h-3.5" />
                <span>Coast to Coast Coverage</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
                Active Across Every State & Territory
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                Whether you live in capital metropolitan centers or regional communities, Local Pages connects you to local tradies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {coverageStats.map((reg, idx) => (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm text-center flex flex-col justify-between"
                >
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center mx-auto mb-3">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <h3 className="font-heading font-bold text-base text-brand-navy mb-1">
                      {reg.region}
                    </h3>
                    <div className="font-extrabold text-brand-pink text-sm mb-2">
                      {reg.tradies}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pt-3 border-t border-slate-100">
                    {reg.tag}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* 6. Dual Call to Action */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Homeowner Card */}
              <div className="bg-gradient-to-br from-brand-navy to-[#0F2A4A] rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-pink/15 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 mb-8">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-pink mb-3">
                    <span>For Homeowners</span>
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-3">
                    Need a Qualified Tradie Today?
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Browse licensed professionals by suburb, read genuine reviews, and get fast free quotes with zero obligations.
                  </p>
                </div>

                <div className="relative z-10">
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 bg-brand-pink hover:bg-brand-pink-bright text-white font-heading font-extrabold text-sm py-3.5 px-6 rounded-xl transition-all shadow-md active:scale-95"
                  >
                    <span>Browse All Services</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Trade Business Card */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-3xl p-8 sm:p-10 text-brand-navy relative overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-3">
                    <span>For Trade Businesses</span>
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-navy leading-tight mb-3">
                    Are You a Licensed Australian Tradie?
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Join over 8,500+ verified trade contractors growing their business with zero commission on won jobs.
                  </p>
                </div>

                <div>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 bg-brand-navy hover:bg-slate-800 text-white font-heading font-extrabold text-sm py-3.5 px-6 rounded-xl transition-all shadow-md active:scale-95"
                  >
                    <span>List Your Business Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  );
}
