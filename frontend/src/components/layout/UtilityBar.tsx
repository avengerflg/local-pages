import Link from 'next/link';

export const UtilityBar = () => {
  return (
    <div className="bg-brand-navy text-white text-xs py-2 px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto whitespace-nowrap border-b border-brand-navy-light shrink-0">
      <div className="flex items-center space-x-4">
        <Link href="tel:1300000000" className="bg-brand-pink hover:bg-brand-pink-hover px-3 py-1 rounded font-bold transition-colors">
          NEED HELP NOW? CLICK TO CALL
        </Link>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4 ml-4">
        {['Emergency Locksmith', '24HR Plumber', 'Emergency Electrician', 'Air Conditioning', 'More Trades'].map(service => (
          <Link key={service} href={`/services`} className="px-3 py-1 border border-white/20 rounded-full hover:bg-white/10 transition-colors">
            {service}
          </Link>
        ))}
      </div>
    </div>
  );
};
