import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TeamPrediction } from '../types';

interface SortableTeamProps {
  id: string;
  team: TeamPrediction;
  rank: number;
}

const getTeamCrest = (name: string) => {
  if (!name || name === "TBD") return "";
  const manualMap: Record<string, string> = {
    "México": "mexico.png",
    "Sudáfrica": "sudafrica.png",
    "Corea del Sur": "corea.png",
    "Canadá": "canada.png",
    "Bélgica": "belgica.png",
    "Turquía": "turquia.png",
    "Costa de Marfil": "costa de marfil.png",
    "Haití": "haiti.png",
    "Arabia Saudí": "arabia saudi.png",
    "Países Bajos": "paises bajos.png",
    "RD Congo": "congo.png",
    "Panamá": "panama.png",
    "Argelia": "argelia.png",
    "Jordania": "jordania.png",
    "Túnez": "tunez.png",
    "Irán": "iran.png",
    "Irak": "irak.png",
    "Uzbekistán": "uzbekistan.png",
    "Bosnia y Herzegovina": "bosnia.png",
    "España": "españa.png"
  };

  if (manualMap[name]) return `/Assets/Escudos/${manualMap[name]}`;
  
  const normalized = name.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace("ñ", "ñ"); // keep ñ

  return `/Assets/Escudos/${normalized}.png`;
};

const SortableTeam = ({ id, team, rank }: SortableTeamProps) => {
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
    zIndex: isDragging ? 10 : 1,
  };

  const rankColor = rank <= 2 
    ? 'bg-wc-green shadow-[0_0_8px_rgba(16,185,129,0.4)]' 
    : rank === 3 
      ? 'bg-wc-gold text-black shadow-[0_0_8px_rgba(212,175,55,0.4)]' 
      : 'bg-wc-red shadow-[0_0_8px_rgba(255,26,77,0.4)]';

  // Defensive check for team
  if (!team) {
    return (
      <div ref={setNodeRef} style={style} className="p-2 bg-red-500/10 border border-red-500 text-red-500 text-xs rounded-lg font-wc-title font-bold">
        Error: Team data missing for {id}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        flex items-center p-2.5 bg-white/5 border border-white/10 rounded-xl shadow-sm cursor-grab active:cursor-grabbing
        transition-all duration-300 hover:border-wc-blue group select-none
        ${isDragging ? 'opacity-30 border-wc-blue shadow-2xl scale-102 bg-wc-blue/5' : 'hover:bg-white/[0.02]'}
      `}
    >
      <div className={`w-5.5 h-5.5 rounded-lg ${rankColor} text-white flex items-center justify-center text-[10px] font-wc-title font-black mr-3 shrink-0`}>
        {rank}
      </div>
      
      <div className="w-8 h-6 flex items-center justify-center mr-3 shrink-0 bg-white/10 rounded overflow-hidden p-0.5">
        <img src={getTeamCrest(team.name)} alt={team.name} className="max-w-full max-h-full object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
      </div>
      
      <span className="text-xs font-wc-title font-bold truncate uppercase tracking-wide text-white/95 group-hover:text-white transition-colors">
        {team.name}
      </span>
      
      <div className="ml-auto opacity-20 group-hover:opacity-60 transition-opacity">
        <div className="w-1.5 h-4 flex flex-col space-y-0.5 justify-center">
          <div className="w-full h-[2px] bg-white rounded-full"></div>
          <div className="w-full h-[2px] bg-white rounded-full"></div>
          <div className="w-full h-[2px] bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SortableTeam;
