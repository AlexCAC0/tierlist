import { useState } from 'react';
import { GROUPS } from '../constants/teams';
import { INDIVIDUAL_JERSEYS } from '../data/individualJerseys';
import { Maximize2, X, Info, ChevronRight } from 'lucide-react';

const Gallery = () => {
  const [selectedJersey, setSelectedJersey] = useState<{
    country: string;
    imageUrl: string;
    group: string;
  } | null>(null);

  const [viewType, setViewType] = useState<'Group' | 'Home' | 'Away' | 'Third'>('Group');

  const openFullscreen = (team: { name: string; imageUrl: string }, groupName: string) => {
    setSelectedJersey({
      country: team.name,
      imageUrl: team.imageUrl,
      group: groupName
    });
    setViewType('Group');
  };

  const closeFullscreen = () => {
    setSelectedJersey(null);
    setViewType('Group');
  };

  const getIndividualJersey = (type: 'Home' | 'Away' | 'Third') => {
    if (!selectedJersey) return null;
    const matches = INDIVIDUAL_JERSEYS.filter(j => j.country === selectedJersey.country && j.type === type);
    return matches.length > 0 ? matches[0] : null;
  };

  const currentDisplayUrl = () => {
    if (!selectedJersey) return '';
    if (viewType === 'Group') return selectedJersey.imageUrl;
    const individual = getIndividualJersey(viewType);
    return individual ? individual.imageUrl : selectedJersey.imageUrl;
  };

  const isNA = (url: string) => url.toLowerCase().includes('na.txt');

  return (
    <div className="space-y-16 md:space-y-24 pb-20 font-wc-font">
      {/* Dynamic Header */}
      <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] border border-white/10 relative overflow-hidden group shadow-2xl">
         <div className="absolute inset-0 bg-gradient-to-r from-wc-blue/5 via-transparent to-wc-red/5 opacity-40"></div>
         <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity select-none">
            <Maximize2 size={150} strokeWidth={1.5} />
         </div>
         <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center space-x-2 bg-wc-blue/10 border border-wc-blue/30 text-wc-blue px-4 py-1 rounded-full font-wc-title font-bold uppercase text-[9px] tracking-wider">
               <span className="w-1.5 h-1.5 rounded-full bg-wc-blue animate-ping"></span>
               <span>Equipment Discovery</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-wc-title font-black uppercase tracking-tighter italic leading-none select-none">
               The <span className="text-wc-blue drop-shadow-[0_4px_10px_rgba(26,140,255,0.3)]">Gallery</span>
            </h2>
            <p className="text-white/40 font-semibold uppercase tracking-wider text-[9px]">
               Créditos de imágenes a planetafobal.com
            </p>
         </div>
      </div>

      {/* Groups Section */}
      <div className="grid grid-cols-1 gap-20">
        {GROUPS.map((group) => (
          <section key={group.name} className="space-y-8">
            <div className="flex items-center space-x-5 select-none">
               <span className="text-5xl md:text-6xl font-wc-title font-black text-white/5 uppercase italic tracking-tighter leading-none">{group.name.split(' ')[1]}</span>
               <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
               <h3 className="text-lg md:text-xl font-wc-title font-black uppercase italic tracking-widest text-wc-blue">{group.name}</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {group.teams.map((team) => {
                const na = isNA(team.imageUrl);
                return (
                  <div 
                    key={team.name} 
                    onClick={() => !na && openFullscreen(team, group.name)}
                    className={`
                      group relative aspect-[3/4] rounded-[2rem] overflow-hidden transition-all duration-500 shadow-xl border
                      ${na 
                        ? 'border-white/5 bg-white/[0.02] cursor-default opacity-30 grayscale' 
                        : 'border-white/10 bg-white/5 cursor-pointer hover:border-wc-blue hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(26,140,255,0.1)]'
                      }
                    `}
                  >
                    {/* Glass shine overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 opacity-60 rounded-[2rem] z-10 pointer-events-none"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 opacity-70 group-hover:opacity-90 transition-opacity z-10"></div>
                    
                    <div className="absolute inset-0 p-6 flex items-center justify-center z-0">
                      {na ? (
                        <div className="text-center space-y-3 opacity-60">
                           <Info size={36} className="mx-auto text-wc-blue/60" />
                           <p className="text-[9px] font-wc-title font-bold uppercase tracking-widest max-w-[150px] leading-relaxed">Camiseta no presentada aún</p>
                        </div>
                      ) : (
                        <img
                          src={team.imageUrl}
                          alt={team.name}
                          className="w-[85%] h-[85%] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)] transform group-hover:scale-108 group-hover:rotate-1 transition-all duration-500"
                        />
                      )}
                    </div>
                    
                    <div className="absolute bottom-0 inset-x-0 p-6 z-20 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                      <div className="flex items-center justify-between">
                         <span className="text-lg md:text-xl font-wc-title font-black text-white uppercase tracking-wider italic">
                           {team.name}
                         </span>
                         {!na && (
                           <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 shadow-lg">
                              <Maximize2 size={12} strokeWidth={2.5} />
                           </div>
                         )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Modern Fullscreen Modal */}
      {selectedJersey && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/96 backdrop-blur-3xl animate-in fade-in duration-300 p-4 md:p-8"
          onClick={closeFullscreen}
        >
          <div 
            className="w-full h-full max-w-6xl flex flex-col md:flex-row items-center gap-8 md:gap-12 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={closeFullscreen}
              className="absolute top-0 right-0 text-white/30 hover:text-white transition-colors p-3 group z-50 cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                 <span className="text-[9px] font-wc-title font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Cerrar</span>
                 <X size={32} />
              </div>
            </button>

            {/* Showcase Stage (Spotlight & Floating Jersey) */}
            <div className="flex-1 flex flex-col items-center justify-center h-full relative group/stage">
              
              {/* Stadium Spotlight Beam */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[400px] bg-gradient-to-b from-white/10 via-white/[0.02] to-transparent pointer-events-none z-0 rounded-full blur-2xl origin-top transform scale-y-125"></div>
              
              <div className="relative w-full h-[45vh] md:h-[60vh] flex items-center justify-center">
                 {/* Floating Glow Pedestal */}
                 <div className="absolute bottom-10 w-[240px] h-[30px] bg-wc-blue/15 blur-xl rounded-full opacity-60 group-hover/stage:opacity-90 transition-opacity duration-700 animate-pulse"></div>
                 <div className="absolute bottom-12 w-[180px] h-[8px] bg-wc-blue/20 rounded-full border border-wc-blue/40 pointer-events-none"></div>

                 <img 
                   src={currentDisplayUrl()} 
                   alt={selectedJersey.country} 
                   className="relative z-10 w-full h-[90%] object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-500 animate-float-straight"
                 />
              </div>

              <div className="text-center mt-6 space-y-1.5 select-none relative z-10">
                <h4 className="text-4xl md:text-6xl font-wc-title font-black text-white uppercase tracking-tighter italic leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                  {selectedJersey.country}
                </h4>
                <div className="inline-block px-4 py-1.5 bg-wc-red text-white font-wc-title font-bold uppercase text-[9px] tracking-widest skew-x-[-10deg] shadow-[0_4px_10px_rgba(255,26,77,0.35)] border border-white/10">
                  {viewType === 'Group' ? 'Equipación' : 
                   viewType === 'Home' ? 'Local' : 
                   viewType === 'Away' ? 'Visitante' : 'Tercera'}
                </div>
              </div>
            </div>

            {/* Dashboard Control Panel */}
            <div className="w-full md:w-72 space-y-6 relative z-10">
              <div className="space-y-1.5 select-none">
                 <p className="text-white/30 font-wc-title font-bold uppercase text-[9px] tracking-widest italic">Seleccionar Kit</p>
                 <div className="h-[2px] w-8 bg-wc-blue shadow-[0_0_8px_rgba(26,140,255,0.8)]"></div>
              </div>
              
              <div className="grid grid-cols-1 gap-2.5">
                <button 
                  onClick={() => setViewType('Group')}
                  className={`
                    p-4 rounded-xl border transition-all duration-300 flex items-center justify-between group/btn cursor-pointer skew-x-[-4deg]
                    ${viewType === 'Group' 
                      ? 'border-wc-blue bg-wc-blue/15 text-white shadow-[0_0_15px_rgba(26,140,255,0.25)] font-bold' 
                      : 'border-white/15 text-white/60 hover:border-white/30 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <span className="font-wc-title uppercase tracking-widest text-[10px] italic transform skew-x-[4deg]">Equipación Completa</span>
                  <ChevronRight size={14} className={`${viewType === 'Group' ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'} transition-all transform skew-x-[4deg]`} />
                </button>

                {(['Home', 'Away', 'Third'] as const).map((type) => {
                  const individual = getIndividualJersey(type);
                  const isActive = viewType === type;
                  const buttonColor = type === 'Home' ? 'wc-red' : type === 'Away' ? 'wc-blue' : 'wc-gold';
                  const activeColorClass = 
                    type === 'Home' ? 'border-wc-red bg-wc-red/15 text-white shadow-[0_0_15px_rgba(255,26,77,0.25)]' :
                    type === 'Away' ? 'border-wc-blue bg-wc-blue/15 text-white shadow-[0_0_15px_rgba(26,140,255,0.25)]' :
                                      'border-wc-gold bg-wc-gold/15 text-white shadow-[0_0_15px_rgba(212,175,55,0.25)]';

                  return (
                    <button 
                      key={type}
                      onClick={() => setViewType(type)}
                      className={`
                        p-4 rounded-xl border transition-all duration-300 flex items-center justify-between group/btn cursor-pointer skew-x-[-4deg]
                        ${isActive 
                          ? activeColorClass + ' font-bold' 
                          : 'border-white/10 text-white/60 hover:border-white/35 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      <span className="font-wc-title uppercase tracking-widest text-[10px] italic transform skew-x-[4deg]">
                        {type === 'Home' ? 'Local (L)' : type === 'Away' ? 'Visitante (V)' : 'Tercera (3)'}
                      </span>
                      {individual ? (
                         <div className="w-8 h-8 rounded-lg bg-black/30 p-1 border border-white/5 transform skew-x-[4deg]">
                           <img src={individual.imageUrl} alt="" className="w-full h-full object-contain" />
                         </div>
                      ) : (
                         <div className="w-8 h-8 rounded-lg bg-black/30 flex items-center justify-center border border-white/5 transform skew-x-[4deg]">
                            <Info size={12} className="opacity-25" />
                         </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Modal footer credits */}
              <div className="pt-6 space-y-4">
                 <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center select-none">
                    <p className="text-[9px] text-white/35 font-bold uppercase tracking-wider leading-relaxed">
                      Créditos de imágenes a<br/>
                      <span className="text-wc-blue font-wc-title font-black tracking-widest block mt-0.5">PLANETAFOBAL.COM</span>
                    </p>
                 </div>
                 <p className="text-[8px] text-white/20 font-semibold text-center uppercase tracking-widest select-none">
                    Haz clic fuera de la zona para salir
                 </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
