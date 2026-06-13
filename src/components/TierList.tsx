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
  { name: 'Hermosa', color: 'from-[#FF1A4D]/80 to-[#FF1A4D]/40 border-l-[#FF1A4D]', desc: 'Elite Style' },
  { name: 'Locura', color: 'from-[#FF6B00]/80 to-[#FF6B00]/40 border-l-[#FF6B00]', desc: 'Top Tier' },
  { name: 'Ta bien', color: 'from-[#FFB800]/80 to-[#FFB800]/40 border-l-[#FFB800]', desc: 'Decent' },
  { name: 'Meh', color: 'from-[#10B981]/80 to-[#10B981]/40 border-l-[#10B981]', desc: 'Average' },
  { name: 'Horrible', color: 'from-[#1A8CFF]/80 to-[#1A8CFF]/40 border-l-[#1A8CFF]', desc: 'Disaster' },
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
    <div className="space-y-12 pb-24 font-wc-font">
      {/* Header Panel */}
      <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden group shadow-2xl border border-white/10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-wc-red/5 via-transparent to-wc-blue/5 opacity-40"></div>
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 group-hover:opacity-[0.07] transition-all duration-1000 select-none">
           <Trophy size={180} strokeWidth={1.5} />
        </div>
        
        <div className="relative z-10 space-y-3">
          <div className="flex items-center space-x-3 text-wc-red font-wc-title font-bold uppercase text-[10px] tracking-[0.25em]">
            <div className="w-6 h-[2px] bg-wc-red shadow-[0_0_8px_rgba(255,26,77,0.8)]"></div>
            <span>Kit Authority System</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-wc-title font-black uppercase tracking-tighter italic leading-none select-none">
            Jersey <span className="text-wc-red skew-x-[-8deg] inline-block drop-shadow-[0_4px_10px_rgba(255,26,77,0.3)]">Rankings</span>
          </h2>
          <p className="text-white/40 font-semibold uppercase tracking-[0.2em] text-[10px]">Define the style of the North American Era</p>
        </div>
        
        <div className="relative z-10 flex flex-wrap gap-4">
          <button 
            onClick={resetTierList}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-3 bg-white/5 border border-white/10 px-8 py-4 rounded-xl hover:bg-wc-red/20 hover:border-wc-red hover:text-wc-red transition-all duration-300 font-wc-title font-bold uppercase text-[10px] tracking-widest cursor-pointer skew-x-[-8deg]"
          >
            <div className="transform skew-x-[8deg] flex items-center gap-2">
              <RefreshCw size={14} />
              <span>Reset List</span>
            </div>
          </button>
          
          <button 
            onClick={toggleFullscreen}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-3 bg-white text-black px-10 py-4.5 rounded-xl hover:bg-wc-blue hover:text-white hover:shadow-[0_0_25px_rgba(26,140,255,0.4)] transition-all duration-300 font-wc-title font-bold uppercase text-xs tracking-[0.15em] shadow-[0_15px_30px_rgba(0,0,0,0.5)] transform hover:-translate-y-0.5 skew-x-[-8deg] cursor-pointer"
          >
            <div className="transform skew-x-[8deg] flex items-center gap-2">
              <Maximize2 size={16} />
              <span>Modo Captura</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Dnd Context */}
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="relative group">
          {/* Subtle Ambient Red/Blue/Green Glow under the Tier List */}
          <div className="absolute -inset-6 bg-gradient-to-r from-wc-red/5 via-wc-blue/5 to-wc-green/5 opacity-40 blur-[80px] rounded-[3rem] pointer-events-none"></div>
          
          <div 
            ref={tierListRef} 
            className="relative glass-panel-heavy p-2 sm:p-5 rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden"
          >
             {/* Scanlines effect for CRT/Stadium Screen vibe */}
             <div className="absolute inset-0 pointer-events-none opacity-[0.015] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] z-10 bg-[length:100%_4px]"></div>

             <div className="rounded-[1.8rem] overflow-hidden border border-white/10 bg-[#080808]">
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

             <div className="mt-6 flex justify-between items-center px-6 opacity-30 select-none">
                <span className="font-wc-title font-bold italic uppercase tracking-wider text-[10px]">Alex.G Design</span>
                <span className="font-wc-title font-bold italic uppercase tracking-[0.4em] text-[9px]">WE ARE 26</span>
             </div>
          </div>
        </div>

        {/* Unranked Locker Room */}
        <div className="mt-16 space-y-8">
          <div className="flex items-center justify-between px-8">
            <div className="space-y-1">
               <h3 className="text-xl md:text-2xl font-wc-title font-black uppercase italic tracking-tighter flex items-center space-x-3 text-white select-none">
                 <span className="bg-wc-red text-white px-2.5 py-0.5 rounded-lg skew-x-[-10deg] shadow-[0_0_15px_rgba(255,26,77,0.2)]">48</span>
                 <span>Equipaciones</span>
               </h3>
               <p className="text-white/30 font-bold uppercase text-[9px] tracking-[0.3em]">Arrastra las camisetas para clasificarlas</p>
            </div>
            <div className="hidden md:block text-white/5 font-wc-title font-black uppercase text-3xl tracking-tighter italic select-none">
               DRAFT LOCKER ROOM
            </div>
          </div>
          
          <SortableContext items={items.unranked} strategy={horizontalListSortingStrategy}>
            <div className="flex flex-wrap gap-4 md:gap-5 justify-center min-h-[350px] p-8 md:p-10 bg-white/[0.01] rounded-[2.5rem] border border-white/5 relative overflow-hidden shadow-inner football-pitch-grid">
               <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 pointer-events-none"></div>

              {items.unranked.length === 0 && (
                <div className="flex flex-col items-center justify-center text-white/15 space-y-5 relative z-10 py-16 animate-pulse select-none">
                   <Share2 size={80} strokeWidth={1} />
                   <p className="font-wc-title font-black uppercase tracking-[0.6em] text-[10px] text-center">Clasificación Completada</p>
                </div>
              )}
              {items.unranked.map((id) => (
                <SortableJersey key={id} id={id} jersey={INDIVIDUAL_JERSEYS.find(j => j.id === id)!} />
              ))}
            </div>
          </SortableContext>
        </div>

        {/* Drag Overlay with custom hologram card */}
        <DragOverlay dropAnimation={null}>
          {activeId ? (
            <div className="w-24 h-32 sm:w-28 sm:h-38 bg-[#0c0c0c] rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] border-2 border-wc-red flex items-center justify-center p-3 cursor-grabbing rotate-3 scale-105 z-[1000] relative">
              <div className="absolute -top-3 -right-3 bg-wc-red text-white w-7 h-7 rounded-full flex items-center justify-center font-wc-title font-black text-xs animate-pulse shadow-lg">!</div>
              <img src={activeJersey?.imageUrl} alt={activeJersey?.id} className="w-full h-full object-contain pointer-events-none" />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default TierList;
