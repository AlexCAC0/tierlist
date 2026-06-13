const Header = () => {
  return (
    <header className="relative bg-[#040404] overflow-hidden border-b border-white/10 pt-16 pb-20">
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none select-none grayscale invert scale-110">
        <img 
          src="/Assets/Fifa World Cup 2026/Trionda.png" 
          alt="pattern" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-wc-blue/15 blur-[120px] rounded-full animate-pulse-glow"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-wc-red/15 blur-[120px] rounded-full animate-pulse-glow" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-[1400px] mx-auto px-6 relative flex flex-col items-center lg:flex-row lg:justify-between gap-12">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-5">
           <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-wc-red animate-ping"></span>
              <span className="text-[10px] font-wc-title font-bold uppercase tracking-[0.25em] text-white/90">FIFA World Cup 2026</span>
           </div>
           
           <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                {/* Logo Glowing Halo */}
                <div className="absolute inset-0 bg-wc-gold/15 blur-[35px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
                <img 
                  src="/Assets/Fifa World Cup 2026/LogoMundial.png" 
                  alt="FIFA 2026" 
                  className="h-32 md:h-44 object-contain relative z-10 drop-shadow-[0_10px_30px_rgba(255,255,255,0.15)] hover:scale-105 transition-transform duration-500 cursor-pointer"
                />
              </div>
              <div className="space-y-1">
                <h1 className="text-6xl md:text-8xl font-wc-title font-black uppercase tracking-tighter leading-[0.8] italic flex flex-col select-none">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">MUNDIAL</span>
                  <span className="text-wc-red italic drop-shadow-[0_4px_10px_rgba(255,26,77,0.3)]">2026</span>
                </h1>
                <p className="text-xl md:text-2xl font-wc-title font-bold text-white/20 uppercase tracking-[0.35em] italic pl-1">
                  WE ARE 26
                </p>
              </div>
           </div>
        </div>
        
        {/* Host Cities Glass Card */}
        <div className="glass-panel p-8 rounded-[2rem] relative overflow-hidden group w-full max-w-sm border border-white/10">
           {/* Color Accent Borders */}
           <div className="absolute top-0 left-0 w-1/3 h-[2px] bg-wc-red"></div>
           <div className="absolute top-0 left-1/3 w-1/3 h-[2px] bg-wc-blue"></div>
           <div className="absolute top-0 right-0 w-1/3 h-[2px] bg-wc-green"></div>

           <div className="absolute inset-0 bg-gradient-to-br from-wc-red/5 via-transparent to-wc-blue/5 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
           
           <div className="relative z-10 space-y-6">
              <p className="text-[10px] font-wc-title font-bold uppercase tracking-[0.3em] text-center text-white/40 italic">North American Spirit</p>
              <div className="flex items-center justify-between px-4">
                 <div className="flex flex-col items-center space-y-2">
                    <span className="text-3xl font-wc-title font-black text-white italic tracking-tighter hover:text-wc-red transition-colors cursor-default">CAN</span>
                    <div className="h-[3px] w-6 bg-wc-red rounded-full shadow-[0_0_10px_rgba(255,26,77,0.8)]"></div>
                 </div>
                 <div className="text-white/10 font-wc-title font-black text-3xl">/</div>
                 <div className="flex flex-col items-center space-y-2">
                    <span className="text-3xl font-wc-title font-black text-white italic tracking-tighter hover:text-wc-blue transition-colors cursor-default">USA</span>
                    <div className="h-[3px] w-6 bg-wc-blue rounded-full shadow-[0_0_10px_rgba(26,140,255,0.8)]"></div>
                 </div>
                 <div className="text-white/10 font-wc-title font-black text-3xl">/</div>
                 <div className="flex flex-col items-center space-y-2">
                    <span className="text-3xl font-wc-title font-black text-white italic tracking-tighter hover:text-wc-green transition-colors cursor-default">MEX</span>
                    <div className="h-[3px] w-6 bg-wc-green rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                 </div>
              </div>
              
              <div className="flex justify-center pt-2 select-none">
                 <span className="bg-white/10 text-white border border-white/20 px-5 py-1.5 rounded-full text-[10px] font-wc-title font-black uppercase tracking-widest italic shadow-lg hover:bg-white hover:text-black transition-all duration-300">
                    Estadio Digital
                 </span>
              </div>
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
