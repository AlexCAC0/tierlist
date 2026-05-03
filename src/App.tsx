import { useState } from 'react';
import { Layout, Palette, Target } from 'lucide-react';
import Gallery from './components/Gallery';
import TierList from './components/TierList';
import Header from './components/Header';
import Predictions from './components/Predictions';

function App() {
  const [activeTab, setActiveTab] = useState<'gallery' | 'tierlist' | 'predictions'>('tierlist');

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-wc-font text-white selection:bg-wc-red selection:text-white">
      <Header />
      
      {/* Dynamic Navigation */}
      <div className="sticky top-0 z-50 bg-black/60 backdrop-blur-2xl border-b border-white/5 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center">
            {[
              { id: 'tierlist', label: 'Tier List', icon: Palette, color: 'text-wc-red', border: 'border-wc-red' },
              { id: 'gallery', label: 'Camisetas', icon: Layout, color: 'text-wc-blue', border: 'border-wc-blue' },
              { id: 'predictions', label: 'Simulador', icon: Target, color: 'text-wc-green', border: 'border-wc-green' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center space-x-3 py-6 px-8 border-b-4 font-black uppercase tracking-[0.1em] text-sm transition-all duration-300
                  ${activeTab === tab.id 
                    ? `${tab.border} ${tab.color} bg-white/5` 
                    : 'border-transparent text-white/40 hover:text-white hover:bg-white/5'}
                `}
              >
                <tab.icon size={18} strokeWidth={2.5} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <main className="relative z-10 max-w-[1400px] mx-auto px-4 py-12 md:py-20 min-h-[80vh]">
        <div className="">
          {activeTab === 'gallery' && <Gallery />}
          {activeTab === 'tierlist' && <TierList />}
          {activeTab === 'predictions' && <Predictions />}
        </div>
      </main>

      {/* Futuristic Footer */}
      <footer className="relative z-10 bg-black border-t border-white/5 pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
           <img src="/Assets/Fifa World Cup 2026/Trionda.png" alt="" className="w-full h-full object-cover" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center">
            <div className="space-y-4">
              <h4 className="text-wc-red font-black uppercase tracking-widest italic">Host Nations</h4>
              <div className="flex justify-center space-x-6 font-black text-2xl tracking-tighter italic">
                 <span className="hover:text-wc-red transition-colors cursor-default">CAN</span>
                 <span className="text-white/20">/</span>
                 <span className="hover:text-wc-blue transition-colors cursor-default">USA</span>
                 <span className="text-white/20">/</span>
                 <span className="hover:text-wc-green transition-colors cursor-default">MEX</span>
              </div>
            </div>

            <div className="flex justify-center items-center space-x-8">
              <img src="/Assets/Fifa World Cup 2026/Mascotas/Clutch.png" alt="Clutch" className="h-28 object-contain hover:scale-110 transition-transform duration-500 drop-shadow-2xl" />
              <img src="/Assets/Fifa World Cup 2026/Mascotas/Maple.png" alt="Maple" className="h-32 object-contain hover:scale-110 transition-transform duration-500 drop-shadow-2xl" />
              <img src="/Assets/Fifa World Cup 2026/Mascotas/Zayu.png" alt="Zayu" className="h-28 object-contain hover:scale-110 transition-transform duration-500 drop-shadow-2xl" />
            </div>

            <div className="space-y-4">
              <p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.3em]">Interactive Fan Experience</p>
              <p className="font-black text-xl italic uppercase tracking-tighter">WE ARE <span className="text-wc-red">26</span></p>
            </div>
          </div>
          
          <div className="mt-20 pt-8 border-t border-white/5 text-center">
            <p className="text-white/20 font-bold uppercase text-[10px] tracking-widest">
              Idea original y diseño: Alex.G ; Creditos de imágenes a planetafobal.com
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
