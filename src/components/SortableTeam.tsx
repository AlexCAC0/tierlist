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

  const rankColor = rank <= 2 ? 'bg-wc-green' : rank === 3 ? 'bg-yellow-500' : 'bg-wc-red';

  // Defensive check for team
  if (!team) {
    return (
      <div ref={setNodeRef} style={style} className="p-2 bg-red-500/10 border border-red-500 text-red-500 text-xs rounded-lg">
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
        flex items-center p-2 bg-white/5 border border-white/10 rounded-xl shadow-sm cursor-grab active:cursor-grabbing
        transition-all hover:border-wc-blue group
        ${isDragging ? 'opacity-30 border-wc-blue shadow-2xl scale-105' : ''}
      `}
    >
      <div className={`w-6 h-6 rounded-lg ${rankColor} text-white flex items-center justify-center text-[10px] font-black mr-3 shrink-0 shadow-lg`}>
        {rank}
      </div>
      
      <div className="w-8 h-6 flex items-center justify-center mr-3 shrink-0 bg-white/10 rounded overflow-hidden">
        <img src={getTeamCrest(team.name)} alt={team.name} className="max-w-full max-h-full object-contain" />
      </div>
      
      <span className="text-sm font-bold truncate uppercase tracking-tight text-white/90">
        {team.name}
      </span>
      
      <div className="ml-auto opacity-20 group-hover:opacity-100 transition-opacity">
        <div className="w-1 h-4 bg-white/20 rounded-full flex flex-col space-y-0.5 justify-center px-0.5">
          <div className="w-full h-0.5 bg-white/40"></div>
          <div className="w-full h-0.5 bg-white/40"></div>
          <div className="w-full h-0.5 bg-white/40"></div>
        </div>
      </div>
    </div>
  );
};

export default SortableTeam;
