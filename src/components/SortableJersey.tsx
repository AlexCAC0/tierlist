import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Jersey } from '../types';

interface SortableJerseyProps {
  id: string;
  jersey: Jersey;
  small?: boolean;
}

const SortableJersey = ({ id, jersey, small }: SortableJerseyProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 100 : 1,
  };

  // Badge configuration based on jersey type
  const typeBadgeMap = {
    Home: { text: 'L', style: 'bg-wc-red text-white shadow-[0_0_8px_rgba(255,26,77,0.4)]' },
    Away: { text: 'V', style: 'bg-wc-blue text-white shadow-[0_0_8px_rgba(26,140,255,0.4)]' },
    Third: { text: '3', style: 'bg-wc-gold text-black shadow-[0_0_8px_rgba(212,175,55,0.6)]' }
  };

  const badge = typeBadgeMap[jersey.type] || typeBadgeMap.Home;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        relative bg-[#f5f5f7]/95 backdrop-blur-md rounded-2xl shadow-lg border transition-all duration-300 shine-effect
        ${small ? 'w-[76px] h-[104px] sm:w-[92px] sm:h-[128px]' : 'w-24 h-32 sm:w-[110px] sm:h-[150px]'}
        flex items-center justify-center p-3 cursor-grab active:cursor-grabbing group
        ${isDragging 
          ? 'border-wc-red shadow-[0_0_25px_rgba(255,26,77,0.4)] scale-102 z-50' 
          : 'border-white/40 hover:border-wc-blue hover:shadow-[0_12px_25px_rgba(0,0,0,0.5)] hover:scale-105 hover:-translate-y-1.5'
        }
      `}
      title={`${jersey.country} - ${jersey.type}`}
    >
      {/* Hologram Card Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-white/20 to-white/40 rounded-2xl pointer-events-none z-0"></div>
      
      {/* Jersey Type Small Badge */}
      <div className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center font-wc-title font-black text-[9px] z-20 ${badge.style} select-none border border-white/20`}>
        {badge.text}
      </div>

      <img
        src={jersey.imageUrl}
        alt={jersey.id}
        className="w-full h-full object-contain pointer-events-none relative z-10 drop-shadow-[0_8px_12px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-transform duration-300"
      />
      
      {/* Country Name Tag Overlay */}
      <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-[#141517] text-white text-[8px] font-wc-title font-bold rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-30 shadow-xl border border-white/10 uppercase tracking-wider">
        {jersey.country}
      </div>
    </div>
  );
};

export default SortableJersey;
