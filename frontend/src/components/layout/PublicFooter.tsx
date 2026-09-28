import Link from 'next/link';

export const PublicFooter = () => {
  return (
    <footer className="bg-brand-navy border-t border-brand-navy-light text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-6 xl:col-span-1">
            <Link href="/" className="font-bold text-2xl tracking-tight">
              Local <span className="text-brand-pink">Pages</span>
            </Link>
            <p className="text-sm leading-6 text-gray-300 max-w-xs">
              A better way to find a tradie. Helping homeowners connect with reliable, verified service.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-brand-pink">
                <span className="sr-only">Facebook</span>
                <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-pink">
                <span className="sr-only">Instagram</span>
                <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
              </a>
            </div>
          </div>
          
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white uppercase tracking-wider">For Homeowners</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {['Find a trade', 'Cost guides', 'Resources', 'FAQs'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-sm leading-6 text-gray-300 hover:text-brand-pink transition-colors">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white uppercase tracking-wider">For Businesses</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {['Find a trade', 'Cost guides', 'Resources', 'FAQs'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-sm leading-6 text-gray-300 hover:text-brand-pink transition-colors">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white uppercase tracking-wider">About</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {['Find a trade', 'Cost guides', 'Resources', 'FAQs'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-sm leading-6 text-gray-300 hover:text-brand-pink transition-colors">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white uppercase tracking-wider">Get the Latest</h3>
                <p className="mt-6 text-sm leading-6 text-gray-300">Home tips, trends and updates.</p>
                <form className="mt-4 sm:flex sm:max-w-md">
                  <label htmlFor="email-address" className="sr-only">Email address</label>
                  <input type="email" name="email-address" id="email-address" autoComplete="email" required className="w-full min-w-0 appearance-none rounded-md border-0 bg-white/5 px-3 py-1.5 text-base text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-pink sm:w-64 sm:text-sm sm:leading-6" placeholder="Your email address" />
                  <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
                    <button type="submit" className="flex w-full items-center justify-center rounded-md bg-brand-pink px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-pink-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink">
                      Subscribe
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t border-white/10 pt-8 sm:mt-16">
          <p className="text-xs leading-5 text-gray-400 text-center">
            Copyright © 2026 Local Pages | Designed & Developed By Webzoo Australia
          </p>
        </div>
      </div>
    </footer>
  );
};
