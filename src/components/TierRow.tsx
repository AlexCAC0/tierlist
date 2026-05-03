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
    <div className={`flex border-b border-gray-200 last:border-b-0 min-h-[100px] sm:min-h-[120px] transition-colors ${isOver ? 'bg-gray-50/80' : ''}`}>
      <div className={`${color} flex flex-col items-center justify-center w-24 sm:w-40 text-center p-4 shrink-0 relative overflow-hidden`}>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-white/20 mix-blend-overlay"></div>
        <span className="relative text-white font-black uppercase text-sm sm:text-lg tracking-tighter leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
          {label}
        </span>
        <span className="relative text-white/60 font-bold uppercase text-[8px] sm:text-[10px] tracking-widest mt-1">
          {desc}
        </span>
      </div>
      
      <SortableContext id={id} items={items} strategy={horizontalListSortingStrategy}>
        <div 
          ref={setNodeRef} 
          className={`flex-1 flex flex-wrap gap-2 p-4 transition-all ${isOver ? 'ring-4 ring-inset ring-wc-blue/10' : ''}`}
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
            <div className="flex-1 flex items-center justify-center">
               <span className="text-gray-200 font-black uppercase tracking-[0.3em] text-xs sm:text-sm select-none">Drop Here</span>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export default TierRow;
