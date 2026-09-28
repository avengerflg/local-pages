export const PartnerStrip = () => {
  return (
    <section className="bg-white pb-24 pt-8">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        <p className="text-center text-[11px] font-extrabold text-[#061A33] uppercase tracking-widest mb-10">
          PARTNERS
        </p>
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
          <div className="text-[22px] font-bold font-sans tracking-tight text-[#061A33]">BUNNINGS</div>
          <div className="text-[26px] font-bold font-serif tracking-tighter text-[#061A33]">IKEA</div>
          <div className="text-[22px] font-bold font-mono tracking-widest text-[#061A33]">REECE</div>
          <div className="text-[20px] font-semibold font-serif text-[#061A33]">James Hardie</div>
          <div className="text-[22px] font-bold font-sans tracking-tight text-[#061A33] lowercase">Colorbond</div>
          <div className="text-[24px] font-black font-sans tracking-tighter text-[#061A33] lowercase">makita</div>
        </div>
      </div>
    </section>
  );
};
