import { useState, useEffect } from 'react';
import { GROUPS } from '../constants/teams';
import GroupPredictor from './GroupPredictor';
import KnockoutBracket from './KnockoutBracket';
import { RefreshCw, ArrowLeft } from 'lucide-react';

const Predictions = () => {
  const [groupRankings, setGroupRankings] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('wc2026_rankings');
    if (saved) return JSON.parse(saved);
    const initial: Record<string, string[]> = {};
    GROUPS.forEach(group => {
      initial[group.name] = group.teams.map(t => t.name);
    });
    return initial;
  });

  const [thirdPlaceSelected, setThirdPlaceSelected] = useState<string[]>(() => {
    const saved = localStorage.getItem('wc2026_thirds');
    return saved ? JSON.parse(saved) : [];
  });

  const [showBracket, setShowBracket] = useState(false);

  useEffect(() => {
    localStorage.setItem('wc2026_rankings', JSON.stringify(groupRankings));
  }, [groupRankings]);

  useEffect(() => {
    localStorage.setItem('wc2026_thirds', JSON.stringify(thirdPlaceSelected));
  }, [thirdPlaceSelected]);

  const handleRankChange = (groupId: string, newRankings: string[]) => {
    setGroupRankings(prev => ({ ...prev, [groupId]: newRankings }));
  };

  const toggleThirdPlace = (groupId: string) => {
    setThirdPlaceSelected(prev => {
      if (prev.includes(groupId)) return prev.filter(id => id !== groupId);
      if (prev.length >= 8) return prev;
      return [...prev, groupId];
    });
  };

  const getThirdPlaceTeam = (groupId: string) => groupRankings[groupId]?.[2] || "TBD";

  const resetPredictions = () => {
    if (window.confirm('¿Quieres reiniciar todas tus predicciones?')) {
      const initial: Record<string, string[]> = {};
      GROUPS.forEach(group => {
        initial[group.name] = group.teams.map(t => t.name);
      });
      setGroupRankings(initial);
      setThirdPlaceSelected([]);
      setShowBracket(false);
    }
  };

  if (showBracket) {
    return (
      <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 font-wc-font">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center justify-between">
          <button 
            onClick={() => setShowBracket(false)}
            className="flex items-center space-x-2 text-wc-blue font-wc-title font-bold uppercase text-xs tracking-wider hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Volver a Grupos</span>
          </button>
          <h2 className="text-xl md:text-2xl font-wc-title font-black uppercase text-white italic tracking-tighter select-none">
            Eliminatorias <span className="text-wc-blue drop-shadow-[0_0_10px_rgba(26,140,255,0.4)]">2026</span>
          </h2>
        </div>
        
        <KnockoutBracket 
          groupRankings={groupRankings} 
          thirdPlaceSelected={thirdPlaceSelected} 
          onBack={() => setShowBracket(false)} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-16 md:space-y-24 animate-in fade-in duration-700 font-wc-font">
      {/* Simulation Header */}
      <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] border border-white/10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-wc-green/5 via-transparent to-wc-blue/5 opacity-30"></div>
         <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center space-x-2 bg-wc-green/10 border border-wc-green/30 text-wc-green px-4 py-1 rounded-full font-wc-title font-bold uppercase text-[9px] tracking-wider">
               <span className="w-1.5 h-1.5 rounded-full bg-wc-green animate-ping"></span>
               <span>Tournament Engine</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-wc-title font-black uppercase tracking-tighter italic leading-none select-none">
               The <span className="text-wc-green drop-shadow-[0_4px_10px_rgba(16,185,129,0.3)]">Simulator</span>
            </h2>
            <p className="text-white/40 font-semibold uppercase tracking-wider text-[10px]">Define el destino de las 48 naciones</p>
         </div>
         <button 
            onClick={resetPredictions}
            className="relative z-10 flex items-center justify-center space-x-3 bg-white text-black px-8 py-4 rounded-xl font-wc-title font-bold uppercase tracking-wider text-xs hover:bg-wc-red hover:text-white transition-all duration-300 shadow-xl skew-x-[-8deg] cursor-pointer"
          >
            <div className="transform skew-x-[8deg] flex items-center gap-2">
              <RefreshCw size={14} />
              <span>Resetear Todo</span>
            </div>
          </button>
      </div>

      {/* Step 1: Groups */}
      <div className="space-y-8">
        <div className="flex items-center space-x-5 select-none">
           <div className="w-12 h-12 rounded-xl bg-wc-green text-white flex items-center justify-center font-wc-title font-black text-xl italic shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-white/10">1</div>
           <div className="space-y-0.5">
              <h3 className="text-xl md:text-2xl font-wc-title font-black uppercase italic tracking-tighter text-white">Fase de Grupos</h3>
              <p className="text-white/30 font-bold uppercase text-[9px] tracking-widest">Clasifican 1° y 2° de cada sector</p>
           </div>
           <div className="h-px flex-1 bg-gradient-to-r from-wc-green/30 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {GROUPS.map((group) => (
            <GroupPredictor 
              key={group.name} 
              group={group} 
              rankings={groupRankings[group.name]} 
              onRankChange={handleRankChange}
            />
          ))}
        </div>
      </div>

      {/* Step 2: Third Places */}
      <div className="space-y-8">
        <div className="flex items-center space-x-5 select-none">
           <div className="w-12 h-12 rounded-xl bg-wc-gold text-black flex items-center justify-center font-wc-title font-black text-xl italic shadow-[0_0_20px_rgba(212,175,55,0.4)] border border-white/10">2</div>
           <div className="space-y-0.5">
              <h3 className="text-xl md:text-2xl font-wc-title font-black uppercase italic tracking-tighter text-white">Mejores Terceros</h3>
              <p className="text-white/30 font-bold uppercase text-[9px] tracking-widest">Selecciona los 8 que avanzan ({thirdPlaceSelected.length}/8)</p>
           </div>
           <div className="h-px flex-1 bg-gradient-to-r from-wc-gold/30 to-transparent"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {GROUPS.map((group) => {
            const teamName = getThirdPlaceTeam(group.name);
            const isSelected = thirdPlaceSelected.includes(group.name);
            const isDisabled = !isSelected && thirdPlaceSelected.length >= 8;

            return (
              <button
                key={`third-${group.name}`}
                onClick={() => toggleThirdPlace(group.name)}
                disabled={isDisabled}
                className={`
                  p-5 rounded-2xl border transition-all duration-300 text-left flex flex-col items-center group relative overflow-hidden cursor-pointer
                  ${isSelected 
                    ? 'border-wc-gold bg-wc-gold/10 shadow-[0_0_20px_rgba(212,175,55,0.15)] scale-102 z-10' 
                    : 'border-white/5 bg-white/5 hover:border-white/20'
                  }
                  ${isDisabled ? 'opacity-20 cursor-not-allowed grayscale' : ''}
                `}
              >
                <span className="text-[9px] font-wc-title font-bold uppercase text-white/20 mb-2 tracking-widest select-none">{group.name}</span>
                <span className="text-xs font-wc-title font-bold text-center leading-snug mb-3.5 h-10 flex items-center text-white select-none">{teamName}</span>
                
                <div className={`
                  w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-500 select-none
                  ${isSelected 
                    ? 'bg-wc-gold border-wc-gold rotate-[360deg] shadow-[0_0_10px_rgba(212,175,55,0.5)]' 
                    : 'border-white/10 group-hover:border-white/30'
                  }
                `}>
                  {isSelected && (
                    <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Zone */}
      <div className={`
        p-12 md:p-16 rounded-[2.5rem] border-2 border-dashed text-center transition-all duration-500 relative overflow-hidden
        ${thirdPlaceSelected.length === 8 
          ? 'bg-gradient-to-r from-wc-blue/20 to-wc-blue/5 border-wc-blue/50 shadow-[0_15px_50px_rgba(26,140,255,0.15)]' 
          : 'bg-white/[0.01] border-white/10 opacity-60'}
      `}>
        {/* Mascot background silhouette */}
        <div className="absolute right-[-4%] bottom-[-12%] opacity-[0.035] pointer-events-none select-none">
           <img src="/Assets/Fifa World Cup 2026/Mascotas/Zayu.png" alt="" className="h-[280px] md:h-[350px] object-contain rotate-[-12deg]" />
        </div>

        <div className="relative z-10 space-y-6 md:space-y-8">
           <h3 className={`text-3xl md:text-5xl font-wc-title font-black uppercase italic tracking-tighter leading-none ${thirdPlaceSelected.length === 8 ? 'text-white' : 'text-white/20'}`}>
              Road to the <span className={thirdPlaceSelected.length === 8 ? 'text-wc-blue drop-shadow-[0_0_10px_rgba(26,140,255,0.4)]' : 'text-white/10'}>Final</span>
           </h3>
           <p className={`max-w-md mx-auto text-xs sm:text-sm font-semibold uppercase tracking-wider leading-relaxed ${thirdPlaceSelected.length === 8 ? 'text-white/75' : 'text-white/25'}`}>
              {thirdPlaceSelected.length === 8 
                ? '¡Estrategia completada! El cuadro de 32 equipos está listo para ser disputado.'
                : 'Debes elegir exactamente a los 8 mejores terceros para desbloquear el cuadro de eliminación directa.'}
           </p>
           
           {thirdPlaceSelected.length === 8 && (
             <button 
               onClick={() => setShowBracket(true)}
               className="px-12 py-5 bg-white text-wc-blue rounded-xl font-wc-title font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_15px_30px_rgba(0,0,0,0.4)] text-base italic cursor-pointer skew-x-[-8deg] hover:bg-wc-blue hover:text-white hover:shadow-[0_0_20px_rgba(26,140,255,0.4)]"
             >
               <div className="transform skew-x-[8deg]">
                 Generar Eliminatorias
               </div>
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default Predictions;
