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
      <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex items-center justify-between bg-white/5 p-6 rounded-2xl border border-white/10">
          <button 
            onClick={() => setShowBracket(false)}
            className="flex items-center space-x-2 text-wc-blue font-black uppercase text-xs tracking-widest hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver a Grupos</span>
          </button>
          <h2 className="text-2xl font-black uppercase text-white italic tracking-tighter">Eliminatorias <span className="text-wc-blue">2026</span></h2>
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
    <div className="space-y-20 animate-in fade-in duration-700">
      {/* Simulation Header */}
      <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 relative overflow-hidden">
         <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center space-x-2 bg-wc-green text-white px-4 py-1 rounded-full font-black uppercase text-[10px] tracking-widest">
               <span>Tournament Engine</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">
               The <span className="text-wc-green text-outline-green">Simulator</span>
            </h2>
            <p className="text-white/40 font-medium">Define el destino de las 48 naciones.</p>
         </div>
         <button 
            onClick={resetPredictions}
            className="relative z-10 flex items-center justify-center space-x-3 bg-white text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-wc-green hover:text-white transition-all shadow-2xl"
          >
            <RefreshCw size={20} />
            <span>Resetear Todo</span>
          </button>
      </div>

      {/* Step 1: Groups */}
      <div className="space-y-10">
        <div className="flex items-center space-x-6">
           <div className="w-16 h-16 rounded-2xl bg-wc-green text-white flex items-center justify-center font-black text-3xl italic shadow-[0_0_30px_rgba(60,172,59,0.3)]">1</div>
           <div className="space-y-1">
              <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Fase de Grupos</h3>
              <p className="text-white/30 font-bold uppercase text-[10px] tracking-[0.2em]">Clasifican 1° y 2° de cada sector</p>
           </div>
           <div className="h-px flex-1 bg-gradient-to-r from-wc-green/30 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
      <div className="space-y-10">
        <div className="flex items-center space-x-6">
           <div className="w-16 h-16 rounded-2xl bg-yellow-500 text-white flex items-center justify-center font-black text-3xl italic shadow-[0_0_30px_rgba(234,179,8,0.3)]">2</div>
           <div className="space-y-1">
              <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Mejores Terceros</h3>
              <p className="text-white/30 font-bold uppercase text-[10px] tracking-[0.2em]">Selecciona los 8 que avanzan ({thirdPlaceSelected.length}/8)</p>
           </div>
           <div className="h-px flex-1 bg-gradient-to-r from-yellow-500/30 to-transparent"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
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
                  p-6 rounded-3xl border-2 transition-all text-left flex flex-col items-center group relative overflow-hidden
                  ${isSelected 
                    ? 'border-yellow-500 bg-yellow-500/10 shadow-[0_0_40px_rgba(234,179,8,0.2)] scale-105 z-10' 
                    : 'border-white/5 bg-white/5 hover:border-white/20'
                  }
                  ${isDisabled ? 'opacity-20 cursor-not-allowed grayscale' : ''}
                `}
              >
                <span className="text-[10px] font-black uppercase text-white/20 mb-3 tracking-widest">{group.name}</span>
                <span className="text-sm font-black text-center leading-tight mb-4 h-10 flex items-center text-white">{teamName}</span>
                
                <div className={`
                  w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500
                  ${isSelected ? 'bg-yellow-500 border-yellow-500 rotate-[360deg]' : 'border-white/10 group-hover:border-white/30'}
                `}>
                  {isSelected && (
                    <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        p-16 rounded-[4rem] border-4 border-dashed text-center transition-all duration-700 relative overflow-hidden
        ${thirdPlaceSelected.length === 8 
          ? 'bg-wc-blue border-wc-blue shadow-[0_0_80px_rgba(42,57,141,0.4)]' 
          : 'bg-white/5 border-white/10 opacity-50'}
      `}>
        {/* Massive Background Mascot */}
        <div className="absolute right-[-5%] bottom-[-10%] opacity-10 pointer-events-none">
           <img src="/Assets/Fifa World Cup 2026/Mascotas/Zayu.png" alt="" className="h-[400px] object-contain rotate-[-15deg]" />
        </div>

        <div className="relative z-10 space-y-8">
           <h3 className={`text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none ${thirdPlaceSelected.length === 8 ? 'text-white' : 'text-white/20'}`}>
              Road to the <span className={thirdPlaceSelected.length === 8 ? 'text-white' : 'text-white/10'}>Final</span>
           </h3>
           <p className={`max-w-xl mx-auto text-lg font-medium leading-relaxed ${thirdPlaceSelected.length === 8 ? 'text-white/80' : 'text-white/20'}`}>
              {thirdPlaceSelected.length === 8 
                ? '¡Estrategia completada! El cuadro de 32 equipos está listo para ser disputado.'
                : 'Debes elegir exactamente a los 8 mejores terceros para desbloquear el cuadro de eliminación directa.'}
           </p>
           
           {thirdPlaceSelected.length === 8 && (
             <button 
               onClick={() => setShowBracket(true)}
               className="px-16 py-6 bg-white text-wc-blue rounded-2xl font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-xl italic"
             >
               Generar Eliminatorias
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default Predictions;
