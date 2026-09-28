import Link from 'next/link';

export const PublicFooter = () => {
  return (
    <footer className="bg-[#061A33] text-white">
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:py-20 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 xl:gap-8">
          
          {/* Logo and Description */}
          <div className="space-y-6 xl:col-span-4 pr-4">
            <Link href="/" className="flex items-center gap-2">
              <svg className="w-8 h-8 text-[#F50067]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <span className="font-bold text-[24px] tracking-tight">
                Local <span className="text-[#F50067]">Pages</span>
              </span>
            </Link>
            <p className="text-[13px] leading-[1.6] text-[#9CA3AF] max-w-[280px]">
              A better way to find a tradie. Helping homeowners connect with reliable, verified service pros.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center hover:opacity-80 transition-opacity">
                <span className="text-white font-bold text-xs">f</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center hover:opacity-80 transition-opacity">
                <span className="text-white font-bold text-xs">ig</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:opacity-80 transition-opacity">
                <span className="text-blue-500 font-bold text-xs">G</span>
              </a>
            </div>
          </div>
          
          {/* Links and Subscription */}
          <div className="xl:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              
              <div>
                <h3 className="text-[13px] font-bold text-white mb-6">For homeowners</h3>
                <ul role="list" className="space-y-4">
                  {['Find a tradie', 'Cost guides', 'Resources', 'FAQs'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-[13px] text-[#9CA3AF] hover:text-white transition-colors">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-[13px] font-bold text-white mb-6">For businesses</h3>
                <ul role="list" className="space-y-4">
                  {['Find a tradie', 'Cost guides', 'Resources', 'FAQs'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-[13px] text-[#9CA3AF] hover:text-white transition-colors">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-[13px] font-bold text-white mb-6">About</h3>
                <ul role="list" className="space-y-4">
                  {['Find a tradie', 'Cost guides', 'Resources', 'FAQs'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-[13px] text-[#9CA3AF] hover:text-white transition-colors">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="col-span-2 md:col-span-1 min-w-[240px]">
                <h3 className="text-[13px] font-bold text-white mb-3">Get the latest</h3>
                <p className="text-[13px] text-[#9CA3AF] mb-4">Home tips, trends and updates.</p>
                <form className="relative flex items-center w-full max-w-sm">
                  <input 
                    type="email" 
                    required 
                    className="w-full h-11 pl-4 pr-12 rounded-full border-none text-[13px] text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#F50067] outline-none" 
                    placeholder="Your email address" 
                  />
                  <button 
                    type="submit" 
                    className="absolute right-1 w-9 h-9 rounded-full bg-[#F50067] flex items-center justify-center text-white hover:bg-[#d40058] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </form>
              </div>
              
            </div>
          </div>
          
        </div>
        
        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-center items-center gap-2">
          <p className="text-[12px] text-[#9CA3AF]">
            Copyright © 2026 Local Pages | Designed & Developed By <a href="#" className="text-[#F50067] hover:text-white transition-colors">Webzee Australia</a>
          </p>
        </div>
        
      </div>
    </footer>
  );
};
