import { useState, useRef } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  PointerSensor, 
  useSensor, 
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  rectIntersection
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  horizontalListSortingStrategy
} from '@dnd-kit/sortable';
import { RefreshCw, Trophy, Share2, Maximize2 } from 'lucide-react';

import { INDIVIDUAL_JERSEYS } from '../data/individualJerseys';
import type { TierRank } from '../types';
import TierRow from './TierRow';
import SortableJersey from './SortableJersey';

interface RankConfig {
  name: TierRank;
  color: string;
  desc: string;
}

const RANKS: RankConfig[] = [
  { name: 'Hermosa', color: 'bg-[#E61D25]', desc: 'Elite Style' },
  { name: 'Locura', color: 'bg-[#FF4D00]', desc: 'Top Tier' },
  { name: 'Ta bien', color: 'bg-[#FFB800]', desc: 'Decent' },
  { name: 'Meh', color: 'bg-[#3CAC3B]', desc: 'Average' },
  { name: 'Horrible', color: 'bg-[#2A398D]', desc: 'Disaster' },
];

const TierList = () => {
  const [items, setItems] = useState<Record<string, string[]>>({
    Hermosa: [],
    Locura: [],
    'Ta bien': [],
    Meh: [],
    Horrible: [],
    unranked: INDIVIDUAL_JERSEYS.map(j => j.id),
  });
  
  const [activeId, setActiveId] = useState<string | null>(null);
  const tierListRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const findContainer = (id: string) => {
    if (id in items) return id;
    return Object.keys(items).find((key) => items[key].includes(id));
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    const overId = over?.id;

    if (!overId || active.id === overId) return;

    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(overId as string);

    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    setItems((prev) => {
      const overItems = prev[overContainer];
      const overIndex = overItems.indexOf(overId as string);

      let newIndex;
      if (overId in prev) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowLastItem = over && overIndex === overItems.length - 1;
        const modifier = isBelowLastItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: [...prev[activeContainer].filter((item) => item !== active.id)],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          active.id as string,
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ],
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeContainer = findContainer(active.id as string);
    const overId = over?.id;

    if (!overId || !activeContainer) {
      setActiveId(null);
      return;
    }

    const overContainer = findContainer(overId as string);

    if (overContainer) {
      const activeIndex = items[activeContainer].indexOf(active.id as string);
      const overIndex = items[overContainer].indexOf(overId as string);

      if (activeIndex !== overIndex) {
        setItems((prev) => ({
          ...prev,
          [overContainer]: arrayMove(prev[overContainer], activeIndex, overIndex),
        }));
      }
    }

    setActiveId(null);
  };

  const toggleFullscreen = () => {
    if (tierListRef.current) {
      if (!document.fullscreenElement) {
        tierListRef.current.requestFullscreen().catch(err => {
          alert(`Error: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  const resetTierList = () => {
    if (window.confirm('¿Quieres reiniciar tu clasificación?')) {
      setItems({
        Hermosa: [],
        Locura: [],
        'Ta bien': [],
        Meh: [],
        Horrible: [],
        unranked: INDIVIDUAL_JERSEYS.map(j => j.id),
      });
    }
  };

  const activeJersey = activeId ? INDIVIDUAL_JERSEYS.find(j => j.id === activeId) : null;

  return (
    <div className="space-y-12 pb-24">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
           <Trophy size={180} strokeWidth={1} />
        </div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center space-x-4 text-wc-red font-black uppercase text-[10px] tracking-[0.4em]">
            <div className="w-8 h-[2px] bg-wc-red"></div>
            <span>Kit Authority System</span>
          </div>
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none drop-shadow-2xl">
            Jersey <span className="text-wc-red skew-x-[-10deg] inline-block">Rankings</span>
          </h2>
          <p className="text-white/20 font-bold uppercase tracking-[0.3em] text-[10px]">Define the style of the North American Era</p>
        </div>
        
        <div className="relative z-10 flex flex-wrap gap-4">
          <button 
            onClick={resetTierList}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-3 bg-white/5 border border-white/10 px-8 py-4 rounded-2xl hover:bg-wc-red hover:text-white transition-all font-black uppercase text-[10px] tracking-widest text-white/40"
          >
            <RefreshCw size={18} />
            <span>Reset List</span>
          </button>
          <button 
            onClick={toggleFullscreen}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-3 bg-white text-black px-10 py-5 rounded-2xl hover:bg-wc-blue hover:text-white transition-all font-black uppercase text-xs tracking-[0.2em] shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform hover:-translate-y-1 skew-x-[-10deg]"
          >
            <Maximize2 size={20} />
            <span>Modo Captura</span>
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-wc-red/5 via-wc-blue/5 to-wc-green/5 opacity-50 blur-[100px] rounded-[4rem]"></div>
          
          <div 
            ref={tierListRef} 
            className="relative bg-[#050505] p-2 sm:p-6 rounded-[3.5rem] shadow-2xl border border-white/5 overflow-hidden"
          >
             <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] z-10 bg-[length:100%_4px]"></div>

             <div className="rounded-[2.5rem] overflow-hidden border border-white/5">
              {RANKS.map((rank) => (
                <TierRow 
                  key={rank.name} 
                  id={rank.name} 
                  label={rank.name} 
                  color={rank.color} 
                  items={items[rank.name]} 
                  desc={rank.desc}
                />
              ))}
             </div>

             <div className="mt-8 flex justify-between items-center px-8 opacity-10">
                <span className="font-black italic uppercase tracking-widest text-sm">Alex.G Design</span>
                <span className="font-black italic uppercase tracking-[0.5em] text-[10px]">WE ARE 26</span>
             </div>
          </div>
        </div>

        <div className="mt-20 space-y-10">
          <div className="flex items-center justify-between px-10">
            <div className="space-y-1">
               <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center space-x-4 text-white">
                 <span className="bg-wc-red text-white px-3 py-1 rounded-lg skew-x-[-15deg]">48</span>
                 <span>Equipaciones</span>
               </h3>
               <p className="text-white/10 font-bold uppercase text-[9px] tracking-[0.4em]">Arrastra las camisetas para clasificarlas</p>
            </div>
            <div className="hidden md:block text-white/5 font-black uppercase text-4xl tracking-tighter italic select-none">
               DRAFT SELECTION
            </div>
          </div>
          
          <SortableContext items={items.unranked} strategy={horizontalListSortingStrategy}>
            <div className="flex flex-wrap gap-6 justify-center min-h-[400px] p-12 bg-white/[0.02] rounded-[4rem] border border-white/5 relative overflow-hidden shadow-inner">
               <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>

              {items.unranked.length === 0 && (
                <div className="flex flex-col items-center justify-center text-white/5 space-y-6 relative z-10 py-20">
                   <Share2 size={120} strokeWidth={1} className="animate-pulse" />
                   <p className="font-black uppercase tracking-[1em] text-xs text-center">Clasificación Completada</p>
                </div>
              )}
              {items.unranked.map((id) => (
                <SortableJersey key={id} id={id} jersey={INDIVIDUAL_JERSEYS.find(j => j.id === id)!} />
              ))}
            </div>
          </SortableContext>
        </div>

        <DragOverlay dropAnimation={null}>
          {activeId ? (
            <div className="w-28 h-40 sm:w-36 sm:h-52 bg-white rounded-[2rem] shadow-[0_60px_100px_rgba(0,0,0,0.9)] border-8 border-wc-red flex items-center justify-center p-4 cursor-grabbing rotate-6 scale-110 transition-transform relative">
              <div className="absolute -top-4 -right-4 bg-wc-red text-white w-10 h-10 rounded-full flex items-center justify-center font-black animate-bounce shadow-xl">!</div>
              <img src={activeJersey?.imageUrl} alt={activeJersey?.id} className="w-full h-full object-contain" />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default TierList;
