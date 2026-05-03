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
    // Map team name to Individual Jersey name (Handling different naming conventions)
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
    <div className="space-y-20 pb-20">
      {/* Dynamic Header */}
      <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Maximize2 size={120} strokeWidth={1} />
         </div>
         <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-wc-blue text-white px-4 py-1 rounded-full font-black uppercase text-[10px] tracking-[0.2em]">
               <span>Equipment Discovery</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">
               The <span className="text-wc-blue">Gallery</span>
            </h2>
            <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-xs">
               Créditos a planetafobal.com por las imágenes
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-24">
        {GROUPS.map((group) => (
          <section key={group.name} className="space-y-10">
            <div className="flex items-center space-x-6">
               <span className="text-7xl font-black text-white/5 uppercase italic tracking-tighter leading-none">{group.name.split(' ')[1]}</span>
               <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
               <h3 className="text-2xl font-black uppercase italic tracking-widest text-wc-blue">{group.name}</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {group.teams.map((team) => {
                const na = isNA(team.imageUrl);
                return (
                  <div 
                    key={team.name} 
                    onClick={() => !na && openFullscreen(team, group.name)}
                    className={`
                      group relative aspect-[3/4] rounded-[2.5rem] overflow-hidden transition-all duration-700
                      ${na ? 'cursor-default opacity-40 grayscale' : 'cursor-pointer hover:-translate-y-4'}
                    `}
                  >
                    {/* Glass card effect */}
                    <div className="absolute inset-0 bg-white/5 border border-white/10 backdrop-blur-sm group-hover:bg-white/10 transition-colors"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 opacity-60 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="absolute inset-0 p-8 flex items-center justify-center">
                      {na ? (
                        <div className="text-center space-y-4 opacity-50">
                          <Info size={48} className="mx-auto text-wc-blue" />
                          <p className="text-[10px] font-black uppercase tracking-widest max-w-[150px]">Camiseta no presentada aún</p>
                        </div>
                      ) : (
                        <img
                          src={team.imageUrl}
                          alt={team.name}
                          className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] transform group-hover:scale-110 group-hover:rotate-2 transition-all duration-700"
                        />
                      )}
                    </div>
                    
                    <div className="absolute bottom-0 inset-x-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <div className="flex items-center justify-between">
                         <span className="text-2xl font-black text-white uppercase tracking-tighter italic">
                           {team.name}
                         </span>
                         {!na && (
                           <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                              <Maximize2 size={16} />
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500 p-4 md:p-10"
          onClick={closeFullscreen}
        >
          {/* Overlay controls - Not bubbling clicks to prevent close */}
          <div 
            className="w-full h-full max-w-7xl flex flex-col md:flex-row items-center gap-12 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button UI */}
            <button 
              onClick={closeFullscreen}
              className="absolute top-0 right-0 text-white/20 hover:text-white transition-colors p-4 group"
            >
              <div className="flex items-center space-x-2">
                 <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Cerrar</span>
                 <X size={40} />
              </div>
            </button>

            {/* Main Visual */}
            <div className="flex-1 flex flex-col items-center justify-center group/main h-full">
              <div className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center">
                 {/* Glow Background */}
                 <div className="absolute w-[80%] h-[80%] bg-wc-blue/20 blur-[100px] rounded-full opacity-50 group-hover/main:opacity-100 transition-opacity"></div>
                 
                 <img 
                   src={currentDisplayUrl()} 
                   alt={selectedJersey.country} 
                   className="relative z-10 w-full h-full object-contain drop-shadow-[0_45px_65px_rgba(0,0,0,0.7)] animate-in zoom-in-95 duration-700"
                 />
              </div>

              <div className="text-center mt-12 space-y-2">
                <h4 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter italic leading-none drop-shadow-2xl">
                  {selectedJersey.country}
                </h4>
                <div className="inline-block px-4 py-1 bg-wc-red text-white font-black uppercase text-xs tracking-[0.3em] skew-x-[-10deg]">
                  {viewType === 'Group' ? 'Equipación' : 
                   viewType === 'Home' ? 'Local' : 
                   viewType === 'Away' ? 'Visitante' : 'Tercera'}
                </div>
              </div>
            </div>

            {/* Kit Selector Panel */}
            <div className="w-full md:w-80 space-y-6">
              <div className="space-y-1">
                 <p className="text-white/30 font-black uppercase text-[10px] tracking-widest italic">Seleccionar Kit</p>
                 <div className="h-px w-10 bg-wc-blue"></div>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => setViewType('Group')}
                  className={`
                    p-5 rounded-2xl border-2 transition-all flex items-center justify-between group/btn
                    ${viewType === 'Group' ? 'border-wc-blue bg-wc-blue text-white shadow-[0_0_30px_rgba(42,57,141,0.4)]' : 'border-white/5 text-white/60 hover:border-white/20 hover:text-white'}
                  `}
                >
                  <span className="font-black uppercase tracking-widest text-xs italic">Equipación (G)</span>
                  <ChevronRight size={16} className={`${viewType === 'Group' ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'} transition-all`} />
                </button>

                {(['Home', 'Away', 'Third'] as const).map((type) => {
                  const individual = getIndividualJersey(type);
                  // We show buttons only if they exist OR we show them with a placeholder if they SHOULD exist
                  // Based on user feedback, "every team has individual versions"
                  return (
                    <button 
                      key={type}
                      onClick={() => setViewType(type)}
                      className={`
                        p-5 rounded-2xl border-2 transition-all flex items-center justify-between group/btn
                        ${viewType === type ? 'border-wc-red bg-wc-red text-white shadow-[0_0_30px_rgba(230,29,37,0.4)]' : 'border-white/5 text-white/60 hover:border-white/20 hover:text-white'}
                      `}
                    >
                      <span className="font-black uppercase tracking-widest text-xs italic">
                        {type === 'Home' ? 'Local' : type === 'Away' ? 'Visitante' : 'Tercera'}
                      </span>
                      {individual ? (
                         <div className="w-10 h-10 rounded-lg bg-black/20 p-1">
                           <img src={individual.imageUrl} alt="" className="w-full h-full object-contain" />
                         </div>
                      ) : (
                         <div className="w-10 h-10 rounded-lg bg-black/20 flex items-center justify-center">
                            <Info size={14} className="opacity-20" />
                         </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-10 space-y-4">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest leading-loose">
                      Créditos de imágenes a<br/>
                      <span className="text-wc-blue font-black tracking-widest">planetafobal.com</span>
                    </p>
                 </div>
                 <p className="text-[9px] text-white/20 font-medium text-center uppercase tracking-widest">
                    Haz clic fuera de la foto para salir
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
