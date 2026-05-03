const Header = () => {
  return (
    <header className="relative bg-[#050505] overflow-hidden border-b border-white/5 pt-12 pb-20">
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale invert scale-125">
        <img 
          src="/Assets/Fifa World Cup 2026/Trionda.png" 
          alt="pattern" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-wc-red/20 blur-[100px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-wc-blue/20 blur-[100px] rounded-full animate-pulse delay-700"></div>

      <div className="max-w-[1400px] mx-auto px-6 relative flex flex-col items-center lg:flex-row lg:justify-between gap-12">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
           <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-wc-red animate-ping"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">FIFA World Cup 2026</span>
           </div>
           
           <div className="flex flex-col md:flex-row items-center gap-6">
              <img 
                src="/Assets/Fifa World Cup 2026/LogoMundial.png" 
                alt="FIFA 2026" 
                className="h-32 md:h-48 drop-shadow-[0_0_50px_rgba(255,255,255,0.1)] hover:scale-105 transition-transform duration-500"
              />
              <div className="space-y-1">
                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8] italic flex flex-col">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/20">MUNDIAL</span>
                  <span className="text-wc-red italic">2026</span>
                </h1>
                <p className="text-xl md:text-3xl font-black text-white/20 uppercase tracking-[0.4em] italic pl-1">
                  WE ARE 26
                </p>
              </div>
           </div>
        </div>
        
        {/* Host Cities Card */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-br from-wc-red/10 via-transparent to-wc-blue/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
           <div className="relative z-10 space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-center text-white/40 italic">North American Spirit</p>
              <div className="flex items-center justify-center gap-8">
                 <div className="flex flex-col items-center space-y-2">
                    <span className="text-4xl font-black text-white italic tracking-tighter">CAN</span>
                    <div className="h-1 w-8 bg-wc-red rounded-full"></div>
                 </div>
                 <div className="text-white/10 font-black text-4xl">/</div>
                 <div className="flex flex-col items-center space-y-2">
                    <span className="text-4xl font-black text-white italic tracking-tighter">USA</span>
                    <div className="h-1 w-8 bg-wc-blue rounded-full"></div>
                 </div>
                 <div className="text-white/10 font-black text-4xl">/</div>
                 <div className="flex flex-col items-center space-y-2">
                    <span className="text-4xl font-black text-white italic tracking-tighter">MEX</span>
                    <div className="h-1 w-8 bg-wc-green rounded-full"></div>
                 </div>
              </div>
              <div className="flex justify-center pt-2">
                 <span className="bg-white text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest italic shadow-xl">Fan Hub</span>
              </div>
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
