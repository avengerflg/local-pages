import { Hero } from '@/components/home/Hero';
import { EmergencyTradeCards } from '@/components/home/EmergencyTradeCards';
import { TradeSearch } from '@/components/home/TradeSearch';
import { PopularJobs } from '@/components/home/PopularJobs';
import { HowItWorks } from '@/components/home/HowItWorks';
import { TrustFeatures } from '@/components/home/TrustFeatures';
import { LocationCategories } from '@/components/home/LocationCategories';
import { BusinessCTA } from '@/components/home/BusinessCTA';
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
        <EmergencyTradeCards />
        <TradeSearch />
        <TrustFeatures />
        <HowItWorks />
        <PopularJobs />
        <LocationCategories />
        <BusinessCTA />
      </main>
      <PublicFooter />
    </div>
  );
}
