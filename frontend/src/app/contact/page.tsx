'use client';

import { useState } from 'react';
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle, 
  Building, 
  MessageSquare, 
  Lock,
  Zap,
  ChevronDown
} from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { UtilityBar } from '@/components/layout/UtilityBar';

const faqs = [
  {
    q: 'How does Local Pages verify tradies before they appear on the site?',
    a: 'Every trade contractor must pass our four-step compliance audit: Australian Business Register (ABN) validation, state trade licensing checks (Fair Trading NSW, QBCC, VBA, etc.), verification of current Public Liability Insurance (minimum $5M–$20M cover), and photo ID matching.',
  },
  {
    q: 'Is Local Pages completely free for homeowners?',
    a: 'Yes, 100% free. Homeowners can search our directory, browse verified reviews, and request quotes without any platform fees or subscription charges. We do not inflate quotes or take commissions from your job.',
  },
  {
    q: 'How fast can an emergency tradie respond?',
    a: 'Our on-call emergency trade partners (plumbers, electricians, locksmiths, and glaziers) maintain priority standby across all capital cities and major suburbs, with average arrival times typically between 15 and 30 minutes.',
  },
  {
    q: 'How do I list my trade business on Local Pages?',
    a: 'Simply click "List Your Business" in the top navigation or visit our registration page. Once you submit your business details, ABN, and license number, our compliance team reviews your documents within 24 business hours.',
  },
  {
    q: 'Can I speak directly to the tradie before hiring them?',
    a: 'Absolutely. Unlike other platforms that hide contact information behind paywalls, Local Pages provides direct phone numbers and clear quote pathways so you deal directly with the tradesperson doing the work.',
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    suburb: '',
    subject: 'general',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
              <span>Australian Support Center • Sydney, NSW</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-white mb-6 leading-tight">
              We’re Here to <span className="text-brand-pink">Help You</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto mb-10">
              Have questions about hiring a verified local tradie, urgent emergency dispatches, or listing your trade business? Our Australian-based support team is here for you.
            </p>

            {/* Quick Contact Micro-Strip */}
            <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/15 text-xs font-semibold text-slate-200 shadow-xl">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>24/7 Emergency Line: <strong className="text-white">1300 000 000</strong></span>
              </div>
              <div className="hidden sm:inline text-white/30">•</div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-pink" />
                <span>support@localpages.com.au</span>
              </div>
              <div className="hidden sm:inline text-white/30">•</div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Avg Reply: &lt; 2 Hours</span>
              </div>
            </div>

          </div>
        </section>


        {/* 2. Main Contact Console & Channels */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              
              {/* Left Column: Direct Support Hub */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-pink mb-2">
                    <span>Direct Channels</span>
                  </div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-navy">
                    Get in Touch Directly
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Connect directly with the appropriate department for rapid assistance.
                  </p>
                </div>

                {/* Channel 1: 24/7 Emergency Priority Hotline */}
                <div className="bg-gradient-to-br from-brand-navy to-[#0F2A4A] rounded-3xl p-7 text-white border border-slate-700/60 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-brand-pink/15 rounded-full blur-2xl pointer-events-none" />
                  <div className="relative z-10 flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-pink text-white flex items-center justify-center shrink-0 shadow-md">
                      <PhoneCall className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-brand-pink bg-white/10 px-2.5 py-0.5 rounded-full mb-1">
                        <span>24/7 Priority Standby</span>
                      </div>
                      <h3 className="font-heading font-extrabold text-xl text-white">Emergency Hotline</h3>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    For burst pipes, power hazards, storm damage, and urgent lockouts. Direct phone dispatch across Australia.
                  </p>
                  <a
                    href="tel:1300000000"
                    className="w-full inline-flex items-center justify-center gap-2 bg-brand-pink hover:bg-brand-pink-bright text-white font-heading font-extrabold text-base py-3 px-4 rounded-xl transition-all shadow-md active:scale-95"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Call 1300 000 000</span>
                  </a>
                </div>

                {/* Channel 2: Homeowner Inquiries */}
                <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue border border-blue-100 flex items-center justify-center shrink-0 shadow-sm">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-brand-navy">Homeowner Support</h3>
                    <p className="text-xs text-slate-500 mb-2">Help with booking quotes, verified tradie reviews & account assistance.</p>
                    <a href="mailto:support@localpages.com.au" className="text-sm font-bold text-brand-pink hover:underline">
                      support@localpages.com.au
                    </a>
                  </div>
                </div>

                {/* Channel 3: Trade Business Partnerships */}
                <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 shadow-sm">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-brand-navy">Tradie Onboarding</h3>
                    <p className="text-xs text-slate-500 mb-2">Verification support, ABN accreditation and trade business growth.</p>
                    <a href="mailto:tradies@localpages.com.au" className="text-sm font-bold text-emerald-600 hover:underline">
                      tradies@localpages.com.au
                    </a>
                  </div>
                </div>

                {/* Channel 4: Sydney Headquarters */}
                <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-brand-navy">National Head Office</h3>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">Level 14, 175 Pitt Street, Sydney NSW 2000</p>
                    <p className="text-[11px] text-slate-400 mt-1">Operating Mon – Fri, 8:00am – 6:00pm AEST</p>
                  </div>
                </div>

              </div>

              {/* Right Column: Modern Contact Form Console */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-[2rem] p-8 sm:p-11 border border-slate-200/90 shadow-[0_15px_40px_rgba(4,19,41,0.06)] relative">
                  
                  {submitted ? (
                    <div className="py-16 text-center space-y-4">
                      <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                        <CheckCircle2 className="w-9 h-9" />
                      </div>
                      <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-navy">
                        Inquiry Received (Demo Preview)
                      </h3>
                      <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                        This contact form is currently in demonstration mode. For active inquiries or direct assistance, please contact us at <span className="font-bold text-brand-navy">support@localpages.com.au</span>.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({ name: '', email: '', phone: '', suburb: '', subject: 'general', message: '' });
                        }}
                        className="mt-4 px-7 py-3 rounded-xl bg-brand-navy hover:bg-brand-pink text-white text-sm font-bold transition-all shadow-md"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="mb-8">
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-pink mb-1.5">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Direct Message</span>
                        </div>
                        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-navy">
                          Send Us a Message
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                          Have a question or need assistance? Fill out the details below and we’ll reply promptly.
                        </p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* Subject Chips */}
                        <div>
                          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                            How Can We Help? *
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {[
                              { id: 'general', label: 'General Inquiry' },
                              { id: 'quote', label: 'Quote Help' },
                              { id: 'tradie', label: 'Tradie Listing' },
                              { id: 'urgent', label: 'Urgent Dispatch' },
                            ].map((tab) => (
                              <button
                                key={tab.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, subject: tab.id })}
                                className={`text-xs font-bold py-2.5 px-3 rounded-xl transition-all border text-center ${
                                  formData.subject === tab.id
                                    ? 'bg-brand-navy text-white border-brand-navy shadow-sm'
                                    : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100'
                                }`}
                              >
                                {tab.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Name & Phone */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                              Your Name *
                            </label>
                            <input 
                              type="text"
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder="e.g. Sarah Jenkins"
                              className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-brand-navy placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                              Phone Number *
                            </label>
                            <input 
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="0400 000 000"
                              className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-brand-navy placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
                            />
                          </div>
                        </div>

                        {/* Email & Suburb */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                              Email Address *
                            </label>
                            <input 
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="sarah@example.com.au"
                              className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-brand-navy placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                              Suburb or Postcode
                            </label>
                            <input 
                              type="text"
                              value={formData.suburb}
                              onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                              placeholder="e.g. Parramatta 2150"
                              className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-brand-navy placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none transition-all"
                            />
                          </div>
                        </div>

                        {/* Message Textarea */}
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                            Your Message *
                          </label>
                          <textarea 
                            rows={4}
                            required
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Please tell us what you need help with (e.g. trade requirements, listing questions, or feedback)..."
                            className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-semibold text-brand-navy placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 outline-none resize-none transition-all"
                          />
                        </div>

                        {/* Submit Button & Security Note */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <button
                            type="submit"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-pink to-[#E01E5A] hover:brightness-110 text-white font-heading font-extrabold text-sm transition-all shadow-[0_6px_20px_rgba(245,43,104,0.35)] active:scale-95"
                          >
                            <Send className="w-4 h-4" />
                            <span>Send Message</span>
                          </button>

                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Lock className="w-3.5 h-3.5 text-slate-400" />
                            <span>100% Private • No spam guaranteed</span>
                          </div>
                        </div>

                      </form>
                    </>
                  )}

                </div>
              </div>

            </div>
          </div>
        </section>


        {/* 3. Frequently Asked Questions (FAQ) Accordion */}
        <section className="py-16 lg:py-24 bg-white border-y border-slate-200/80">
          <div className="mx-auto max-w-[900px] px-5 sm:px-6 lg:px-8">
            
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-brand-blue text-xs font-bold uppercase tracking-wider mb-3">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
                Quick Answers to Common Inquiries
              </h2>
              <p className="text-slate-500 text-sm sm:text-base mt-2">
                Everything you need to know about contacting tradies, quotes, and safety standards.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div 
                    key={index}
                    className="border border-slate-200/90 rounded-2xl overflow-hidden transition-all bg-slate-50/50"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFaq(isOpen ? null : index)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-heading font-bold text-base sm:text-lg text-brand-navy hover:text-brand-pink transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-pink' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </section>


        {/* 4. Urgent Emergency Standby Banner */}
        <section className="py-16 lg:py-20 bg-[#F8FAFC]">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-[#071731] border border-slate-700/60 p-8 sm:p-12 shadow-[0_20px_50px_rgba(4,19,41,0.2)] text-white">
              <div className="absolute top-0 right-0 w-80 h-80 bg-brand-pink/20 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-pink mb-2">
                    <Zap className="w-4 h-4" />
                    <span>Emergency Priority Dispatches</span>
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                    Need Urgent Trade Help Right Now?
                  </h3>
                  <p className="text-slate-300 text-sm mt-1 max-w-xl">
                    Immediate phone dispatch for burst pipes, power outages, security lockouts, and storm damage across Australia.
                  </p>
                </div>

                <a
                  href="tel:1300000000"
                  className="inline-flex items-center justify-center gap-2.5 bg-brand-pink hover:bg-brand-pink-bright text-white font-heading font-extrabold text-base py-3.5 px-7 rounded-2xl transition-all shadow-[0_8px_25px_rgba(245,43,104,0.4)] active:scale-95 shrink-0"
                >
                  <PhoneCall className="w-5 h-5" />
                  <span>Call 1300 000 000</span>
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  );
}
