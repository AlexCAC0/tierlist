import { useDroppable } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import SortableJersey from './SortableJersey';
import { INDIVIDUAL_JERSEYS } from '../data/individualJerseys';

interface TierRowProps {
  id: string;
  label: string;
  color: string;
  items: string[];
  desc: string;
}

const TierRow = ({ id, label, color, items, desc }: TierRowProps) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className={`flex border-b border-white/10 last:border-b-0 min-h-[110px] sm:min-h-[130px] transition-all duration-300 ${isOver ? 'bg-white/[0.02]' : ''}`}>
      {/* Tier Label Column with Gradient Background and Angled Badge feel */}
      <div className={`bg-gradient-to-r ${color} border-l-4 flex flex-col items-center justify-center w-24 sm:w-36 text-center p-3 shrink-0 relative overflow-hidden select-none`}>
        {/* Glow / Glass overlay */}
        <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
        <div className="absolute top-[-50%] left-[-50%] w-full h-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-12 pointer-events-none"></div>
        
        <span className="relative text-white font-wc-title font-black uppercase text-xs sm:text-base tracking-tighter leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          {label}
        </span>
        <span className="relative text-white/70 font-wc-font font-bold uppercase text-[7px] sm:text-[9px] tracking-widest mt-1.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
          {desc}
        </span>
      </div>
      
      {/* Droppable Items Column */}
      <SortableContext id={id} items={items} strategy={horizontalListSortingStrategy}>
        <div 
          ref={setNodeRef} 
          className={`flex-1 flex flex-wrap items-center gap-3 p-4 transition-all duration-300 relative ${isOver ? 'bg-wc-blue/5' : ''}`}
        >
          {items.map((itemId) => (
            <SortableJersey 
              key={itemId} 
              id={itemId} 
              jersey={INDIVIDUAL_JERSEYS.find(j => j.id === itemId)!} 
              small
            />
          ))}
          
          {items.length === 0 && !isOver && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <span className="text-white/15 font-wc-title font-bold uppercase tracking-[0.25em] text-[10px] sm:text-xs select-none">
                 [ ARRASA AQUÍ ]
               </span>
            </div>
          )}

          {isOver && items.length === 0 && (
            <div className="absolute inset-2 border-2 border-dashed border-wc-blue/40 rounded-2xl bg-wc-blue/5 flex items-center justify-center pointer-events-none">
               <span className="text-wc-blue font-wc-title font-bold uppercase tracking-[0.25em] text-[10px] sm:text-xs animate-pulse">
                 SOLTAR CAMISETA
               </span>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export default TierRow;
