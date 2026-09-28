import { Hero } from '@/components/home/Hero';
import { PopularJobs } from '@/components/home/PopularJobs';
import { PlanningCTA } from '@/components/home/PlanningCTA';
import { HowItWorks } from '@/components/home/HowItWorks';
import { BusinessCTA } from '@/components/home/BusinessCTA';
import { TrustFeatures } from '@/components/home/TrustFeatures';
import { FeaturedArticle } from '@/components/home/FeaturedArticle';
import { LocationCategories } from '@/components/home/LocationCategories';
import { PartnerStrip } from '@/components/home/PartnerStrip';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { UtilityBar } from '@/components/layout/UtilityBar';

export const metadata = {
  title: 'Local Pages | Find Trusted Local Trades Fast.',
  description: 'Connect with trusted tradies in your area in seconds.',
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-light">
      <UtilityBar />
      <PublicHeader />
      <main className="flex-grow">
        <Hero />
        <PopularJobs />
        <PlanningCTA />
        <HowItWorks />
        <BusinessCTA />
        <TrustFeatures />
        <FeaturedArticle />
        <LocationCategories />
        <PartnerStrip />
      </main>
      <PublicFooter />
    </div>
  );
}
