import { Hero } from '@/components/home/Hero';
import { HowItWorks } from '@/components/home/HowItWorks';
import { CTASection } from '@/components/home/CTASection';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';

export const metadata = {
  title: 'Local Pages | Find Trusted Local Tradies',
  description: 'Tell us what you need, choose local tradies, compare quotes, and arrange the job.',
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <CTASection />
      </main>
      <PublicFooter />
    </div>
  );
}
