import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import SortableTeam from './SortableTeam';
import type { GroupData } from '../types';

interface GroupPredictorProps {
  group: GroupData;
  rankings: string[];
  onRankChange: (groupId: string, newRankings: string[]) => void;
}

const GroupPredictor = ({ group, rankings, onRankChange }: GroupPredictorProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = rankings.indexOf(active.id as string);
      const newIndex = rankings.indexOf(over.id as string);
      onRankChange(group.name, arrayMove(rankings, oldIndex, newIndex));
    }
  };

  const getTeamData = (name: string) => {
    const team = group.teams.find(t => t.name === name);
    if (!team) {
      console.warn(`Team ${name} not found in group ${group.name}`);
    }
    return team!;
  };

  return (
    <div className="bg-white/5 rounded-2xl shadow-xl overflow-hidden border border-white/10 flex flex-col backdrop-blur-sm group hover:border-wc-blue/30 transition-all duration-500">
      <div className="bg-black/40 px-5 py-3 flex justify-between items-center border-b border-white/5">
        <h3 className="text-white font-black uppercase tracking-widest text-xs italic">{group.name}</h3>
        <div className="w-2 h-2 rounded-full bg-wc-red animate-pulse"></div>
      </div>
      
      <div className="p-4 space-y-2 flex-1">
        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCorners} 
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={rankings} strategy={verticalListSortingStrategy}>
            {rankings.map((teamName, index) => (
              <SortableTeam 
                key={`${group.name}-${teamName}`} 
                id={teamName} 
                team={getTeamData(teamName)} 
                rank={index + 1} 
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      
      <div className="bg-black/20 px-4 py-3 border-t border-white/5 text-[9px] flex justify-between font-black uppercase tracking-tighter opacity-40">
        <div className="flex items-center space-x-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-wc-green"></div>
          <span>Qualify</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-wc-red"></div>
          <span>Out</span>
        </div>
      </div>
    </div>
  );
};

export default GroupPredictor;
