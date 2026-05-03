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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        relative bg-white rounded-xl shadow-md border-2 transition-all duration-200
        ${small ? 'w-16 h-22 sm:w-20 sm:h-28' : 'w-24 h-32 sm:w-28 sm:h-40'}
        flex items-center justify-center p-2 cursor-grab active:cursor-grabbing group
        ${isDragging ? 'border-wc-red ring-4 ring-wc-red/20' : 'border-transparent hover:border-wc-blue hover:shadow-xl hover:-translate-y-1'}
      `}
      title={`${jersey.country} - ${jersey.type}`}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 to-transparent opacity-50 rounded-xl"></div>
      
      <img
        src={jersey.imageUrl}
        alt={jersey.id}
        className="w-full h-full object-contain pointer-events-none relative z-10"
      />
      
      {/* Label for small screens or hover */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-wc-dark-gray text-white text-[8px] font-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-lg border border-white/20 uppercase tracking-tighter">
        {jersey.country}
      </div>
    </div>
  );
};

export default SortableJersey;
