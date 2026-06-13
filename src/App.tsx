import { useState } from 'react';
import { Layout, Palette, Target } from 'lucide-react';
import Gallery from './components/Gallery';
import TierList from './components/TierList';
import Header from './components/Header';
import Predictions from './components/Predictions';

function App() {
  const [activeTab, setActiveTab] = useState<'gallery' | 'tierlist' | 'predictions'>('tierlist');

  return (
    <div className="min-h-screen bg-[#030303] font-wc-font text-white selection:bg-wc-red selection:text-white relative">
      <Header />
      
      {/* Dynamic Navigation Dashboard */}
      <div className="sticky top-0 z-50 bg-[#050505]/75 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center py-2">
            <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 gap-1.5 w-full max-w-lg md:max-w-xl">
              {[
                { 
                  id: 'tierlist', 
                  label: 'Tier List', 
                  icon: Palette, 
                  color: 'text-wc-red', 
                  bg: 'bg-wc-red/10',
                  border: 'border-wc-red/30',
                  glow: 'shadow-[0_0_20px_rgba(255,26,77,0.25)]' 
                },
                { 
                  id: 'gallery', 
                  label: 'Camisetas', 
                  icon: Layout, 
                  color: 'text-wc-blue', 
                  bg: 'bg-wc-blue/10',
                  border: 'border-wc-blue/30',
                  glow: 'shadow-[0_0_20px_rgba(26,140,255,0.25)]' 
                },
                { 
                  id: 'predictions', 
                  label: 'Simulador', 
                  icon: Target, 
                  color: 'text-wc-green', 
                  bg: 'bg-wc-green/10',
                  border: 'border-wc-green/30',
                  glow: 'shadow-[0_0_20px_rgba(16,185,129,0.25)]' 
                }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      flex-1 flex items-center justify-center space-x-2 md:space-x-3 py-3 px-3 md:px-6 rounded-xl font-wc-title font-bold uppercase tracking-wider text-xs transition-all duration-500 skew-x-[-8deg]
                      ${isActive 
                        ? `${tab.bg} ${tab.color} ${tab.border} ${tab.glow} border border-solid scale-102` 
                        : 'border border-transparent text-white/50 hover:text-white hover:bg-white/5'}
                    `}
                  >
                    <div className="transform skew-x-[8deg] flex items-center gap-2">
                      <tab.icon size={16} strokeWidth={2.5} className="shrink-0" />
                      <span>{tab.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area with Stadium Ambient Light */}
      <main className="relative z-10 max-w-[1400px] mx-auto px-4 py-8 md:py-16 min-h-[80vh]">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] football-pitch-grid rounded-[4rem]"></div>
        <div className="relative z-10">
          {activeTab === 'gallery' && <Gallery />}
          {activeTab === 'tierlist' && <TierList />}
          {activeTab === 'predictions' && <Predictions />}
        </div>
      </main>

      {/* Futuristic Stadium Footer */}
      <footer className="relative z-10 bg-[#050505] border-t border-white/10 pt-20 pb-10 overflow-hidden">
        {/* Background Trionda with Overlay Gradient */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-screen select-none">
          <img src="/Assets/Fifa World Cup 2026/Trionda.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black to-transparent opacity-60 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-center text-center">
            
            {/* Host Nations Section */}
            <div className="space-y-4">
              <h4 className="text-wc-red font-wc-title font-black uppercase tracking-widest italic text-sm">Host Nations</h4>
              <div className="flex justify-center items-center space-x-6 font-wc-title font-black text-3xl italic tracking-tighter">
                <span className="hover:text-wc-red transition-all duration-300 cursor-default hover:scale-105 drop-shadow-[0_2px_10px_rgba(255,26,77,0.3)]">CAN</span>
                <span className="text-white/20 select-none">/</span>
                <span className="hover:text-wc-blue transition-all duration-300 cursor-default hover:scale-105 drop-shadow-[0_2px_10px_rgba(26,140,255,0.3)]">USA</span>
                <span className="text-white/20 select-none">/</span>
                <span className="hover:text-wc-green transition-all duration-300 cursor-default hover:scale-105 drop-shadow-[0_2px_10px_rgba(16,185,129,0.3)]">MEX</span>
              </div>
            </div>

            {/* Mascot Podiums */}
            <div className="flex justify-center items-end space-x-6 md:space-x-8 h-40">
              {[
                { name: 'Clutch', file: 'Clutch.png', color: 'border-wc-blue/40 bg-wc-blue/5 shadow-[0_0_20px_rgba(26,140,255,0.15)] hover:shadow-[0_0_40px_rgba(26,140,255,0.4)]', size: 'h-24 hover:h-28' },
                { name: 'Maple', file: 'Maple.png', color: 'border-wc-red/40 bg-wc-red/5 shadow-[0_0_25px_rgba(255,26,77,0.15)] hover:shadow-[0_0_45px_rgba(255,26,77,0.4)]', size: 'h-28 hover:h-32' },
                { name: 'Zayu', file: 'Zayu.png', color: 'border-wc-green/40 bg-wc-green/5 shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]', size: 'h-24 hover:h-28' }
              ].map((mascot) => (
                <div 
                  key={mascot.name}
                  className={`
                    group flex flex-col items-center justify-end p-3 rounded-2xl border backdrop-blur-md transition-all duration-500 cursor-pointer w-20 sm:w-24 relative overflow-hidden
                    ${mascot.color}
                  `}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                  <img 
                    src={`/Assets/Fifa World Cup 2026/Mascotas/${mascot.file}`} 
                    alt={mascot.name} 
                    className={`
                      ${mascot.size} object-contain transition-all duration-500 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] group-hover:-translate-y-2 relative z-10
                    `}
                  />
                  <span className="text-[9px] font-wc-title font-black uppercase tracking-wider text-white/50 mt-2 relative z-10 group-hover:text-white transition-colors select-none">{mascot.name}</span>
                </div>
              ))}
            </div>

            {/* Hub info */}
            <div className="space-y-3">
              <p className="text-white/30 font-bold uppercase text-[9px] tracking-[0.3em]">Interactive Fan Experience</p>
              <p className="font-wc-title font-black text-2xl italic uppercase tracking-tighter">
                WE ARE <span className="text-transparent bg-clip-text bg-gradient-to-r from-wc-red via-wc-blue to-wc-green">26</span>
              </p>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-white/5 text-center">
            <p className="text-white/25 font-semibold uppercase text-[9px] tracking-widest max-w-lg mx-auto leading-relaxed">
              Diseño original de Alex.G • Imágenes cortesía de planetafobal.com
              <br/>
              <span className="opacity-40 text-[8px] font-normal tracking-normal mt-1 block">Esta es una aplicación interactiva creada por fans y no está afiliada oficialmente con la FIFA.</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
