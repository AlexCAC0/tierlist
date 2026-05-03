import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Star, ArrowLeft, Maximize2 } from 'lucide-react';

interface Team {
  name: string;
}

interface Match {
  id: string;
  home: Team | null;
  away: Team | null;
  winner: string | null;
}

interface KnockoutBracketProps {
  groupRankings: Record<string, string[]>;
  thirdPlaceSelected: string[];
  onBack: () => void;
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

const KnockoutBracket: React.FC<KnockoutBracketProps> = ({ groupRankings, thirdPlaceSelected, onBack }) => {
  const [matches, setMatches] = useState<Record<string, Match>>({});
  const bracketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialMatches: Record<string, Match> = {};
    const qualifiedTeams: Team[] = [];

    Object.keys(groupRankings).forEach(groupName => {
      qualifiedTeams.push({ name: groupRankings[groupName][0] });
    });
    Object.keys(groupRankings).forEach(groupName => {
      qualifiedTeams.push({ name: groupRankings[groupName][1] });
    });
    thirdPlaceSelected.forEach(groupName => {
      qualifiedTeams.push({ name: groupRankings[groupName][2] });
    });

    while (qualifiedTeams.length < 32) {
      qualifiedTeams.push({ name: "TBD" });
    }

    const rounds = ['R32', 'R16', 'QF', 'SF', 'F'];
    const counts = [16, 8, 4, 2, 1];

    rounds.forEach((round, rIdx) => {
      for (let i = 0; i < counts[rIdx]; i++) {
        const id = `${round}-${i}`;
        initialMatches[id] = { id, home: null, away: null, winner: null };
      }
    });

    for (let i = 0; i < 16; i++) {
      initialMatches[`R32-${i}`].home = qualifiedTeams[i];
      initialMatches[`R32-${i}`].away = qualifiedTeams[31 - i];
    }

    setMatches(initialMatches);
  }, [groupRankings, thirdPlaceSelected]);

  const handleWinner = (matchId: string, winnerName: string) => {
    if (winnerName === "TBD") return;

    setMatches(prev => {
      const newMatches = { ...prev };
      newMatches[matchId].winner = winnerName;

      const [round, index] = matchId.split('-');
      const idx = parseInt(index);
      
      const nextRoundMap: Record<string, string> = {
        'R32': 'R16',
        'R16': 'QF',
        'QF': 'SF',
        'SF': 'F'
      };

      const nextRound = nextRoundMap[round];
      if (nextRound) {
        const nextMatchIdx = Math.floor(idx / 2);
        const nextMatchId = `${nextRound}-${nextMatchIdx}`;
        const isHome = idx % 2 === 0;
        
        const winnerTeam = winnerName === prev[matchId].home?.name ? prev[matchId].home : prev[matchId].away;
        
        newMatches[nextMatchId] = {
          ...newMatches[nextMatchId],
          [isHome ? 'home' : 'away']: winnerTeam
        };
      }

      return newMatches;
    });
  };

  const toggleFullscreen = () => {
    if (bracketRef.current) {
      if (!document.fullscreenElement) {
        bracketRef.current.requestFullscreen().catch(err => {
          alert(`Error: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  const getWinner = () => matches['F-0']?.winner;

  const MatchCard = ({ id }: { id: string }) => {
    const match = matches[id];
    if (!match) return null;

    return (
      <div className={`
        flex flex-col w-52 relative group/card
        ${match.winner ? 'scale-105 z-20 shadow-[0_0_30px_rgba(42,57,141,0.3)]' : 'opacity-80 hover:opacity-100'}
        transition-all duration-500
      `}>
        <div className={`absolute inset-0 bg-[#0c0c0c] border-l-4 ${match.winner ? 'border-wc-red' : 'border-wc-blue'} transform -skew-x-3`}></div>
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] z-10 bg-[length:100%_4px]"></div>

        <button 
          onClick={() => match.home && handleWinner(id, match.home.name)}
          className={`relative z-20 flex items-center justify-between p-3 transition-all ${match.winner === match.home?.name ? 'text-white' : 'text-white/40'}`}
        >
          <div className="flex items-center space-x-2 truncate">
            {match.home && <img src={getTeamCrest(match.home.name)} alt="" className="w-8 h-8 object-contain" />}
            <span className="font-black text-xs uppercase tracking-tighter italic">{match.home?.name || "TBD"}</span>
          </div>
          {match.winner === match.home?.name && <Star size={10} className="fill-wc-red text-wc-red" />}
        </button>

        <div className="h-[1px] bg-white/10 relative z-20 mx-3"></div>

        <button 
          onClick={() => match.away && handleWinner(id, match.away.name)}
          className={`relative z-20 flex items-center justify-between p-3 transition-all ${match.winner === match.away?.name ? 'text-white' : 'text-white/40'}`}
        >
          <div className="flex items-center space-x-2 truncate">
            {match.away && <img src={getTeamCrest(match.away.name)} alt="" className="w-8 h-8 object-contain" />}
            <span className="font-black text-xs uppercase tracking-tighter italic">{match.away?.name || "TBD"}</span>
          </div>
          {match.winner === match.away?.name && <Star size={10} className="fill-wc-red text-wc-red" />}
        </button>
      </div>
    );
  };

  const winner = getWinner();

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#0a0a0a] p-8 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-wc-blue/5 via-transparent to-wc-red/5 opacity-50"></div>
        
        <button 
          onClick={onBack}
          className="relative z-10 flex items-center space-x-4 text-white/30 hover:text-white transition-all uppercase font-black text-xs tracking-[0.3em]"
        >
          <ArrowLeft size={20} />
          <span>Volver a Grupos</span>
        </button>

        <button 
          onClick={toggleFullscreen}
          className="relative z-10 flex items-center space-x-4 bg-white text-black px-12 py-5 rounded-2xl font-black uppercase text-sm tracking-[0.2em] hover:bg-wc-red hover:text-white transition-all shadow-[0_25px_60px_rgba(0,0,0,0.6)] skew-x-[-10deg]"
        >
          <Maximize2 size={20} />
          <span>Pantalla Completa</span>
        </button>
      </div>

      <div className="overflow-x-auto pb-20 rounded-[4rem] border border-white/5 bg-black/60 shadow-inner p-4">
        <div 
          ref={bracketRef} 
          className="min-w-max p-20 bg-[#050505] football-pitch relative overflow-hidden flex items-center justify-center"
          style={{ minHeight: '900px' }}
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.2] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

          <div className="flex justify-between items-center gap-20 relative z-20 px-20">
            
            <div className="flex gap-12 items-center h-full">
              <div className="flex flex-col justify-around h-full space-y-6">
                 {[0, 1, 2, 3, 4, 5, 6, 7].map(i => <MatchCard key={`R32-${i}`} id={`R32-${i}`} />)}
              </div>
              <div className="flex flex-col justify-around h-full py-20 space-y-12">
                 {[0, 1, 2, 3].map(i => <MatchCard key={`R16-${i}`} id={`R16-${i}`} />)}
              </div>
              <div className="flex flex-col justify-around h-full py-40 space-y-24">
                 {[0, 1].map(i => <MatchCard key={`QF-${i}`} id={`QF-${i}`} />)}
              </div>
              <div className="flex flex-col justify-around h-full py-60">
                 <MatchCard id="SF-0" />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-24 w-[700px] px-10 min-w-max">
               <div className="text-center space-y-12 relative">
                  <div className={`relative w-52 h-52 bg-gradient-to-br from-yellow-500 via-yellow-200 to-yellow-600 rounded-[3rem] flex items-center justify-center mx-auto shadow-[0_0_150px_rgba(234,179,8,0.4)] border-8 border-white/5 transform transition-transform duration-1000 ${winner ? 'animate-float' : 'rotate-45'}`}>
                    <div className="transform -rotate-45">
                       <Trophy size={110} className="text-black drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-8xl font-black uppercase italic tracking-tighter text-white drop-shadow-[0_15px_30px_rgba(0,0,0,1)]">GRAND FINAL</h3>
                    <div className="flex items-center justify-center space-x-6">
                       <div className="h-px w-20 bg-wc-blue"></div>
                       <p className="text-wc-red font-black uppercase tracking-[1.2em] text-xs">Mundial 2026</p>
                       <div className="h-px w-20 bg-wc-red"></div>
                    </div>
                  </div>
               </div>

               <div className="scale-[2.2] transform transition-all duration-1000 relative">
                 <div className="absolute -inset-20 bg-wc-blue/20 blur-[100px] rounded-full opacity-30 animate-pulse"></div>
                 <MatchCard id="F-0" />
               </div>

               {winner && (
                 <div className="text-center space-y-12 animate-in fade-in zoom-in slide-in-from-top-20 duration-1000">
                    <div className="flex flex-col items-center space-y-8">
                       <div className="relative">
                          <div className="absolute -inset-10 bg-white/10 blur-2xl animate-ping rounded-full"></div>
                          <div className="bg-wc-red text-white px-12 py-3 font-black uppercase tracking-[1.5em] text-md skew-x-[-20deg] shadow-[0_20px_50px_rgba(230,29,37,0.5)] relative z-10">
                             Winner
                          </div>
                       </div>
                       
                       <div className="flex items-center space-x-12">
                          <Star size={60} className="text-yellow-500 fill-yellow-500 animate-spin" />
                          <h2 className="text-[10rem] font-black uppercase italic tracking-tighter text-white drop-shadow-[0_0_80px_rgba(255,255,255,0.6)] leading-none">
                             {winner}
                          </h2>
                          <Star size={60} className="text-yellow-500 fill-yellow-500 animate-spin" />
                       </div>
                    </div>
                    
                    <div className="flex justify-center space-x-8">
                       {[...Array(15)].map((_, i) => (
                         <div key={i} className={`w-5 h-5 rounded-full bg-wc-red animate-ping`} style={{ animationDelay: `${i*150}ms` }}></div>
                       ))}
                    </div>
                 </div>
               )}
            </div>

            <div className="flex gap-12 items-center h-full flex-row-reverse">
              <div className="flex flex-col justify-around h-full space-y-6">
                 {[8, 9, 10, 11, 12, 13, 14, 15].map(i => <MatchCard key={`R32-${i}`} id={`R32-${i}`} />)}
              </div>
              <div className="flex flex-col justify-around h-full py-20 space-y-12">
                 {[4, 5, 6, 7].map(i => <MatchCard key={`R16-${i}`} id={`R16-${i}`} />)}
              </div>
              <div className="flex flex-col justify-around h-full py-40 space-y-24">
                 {[2, 3].map(i => <MatchCard key={`QF-${i}`} id={`QF-${i}`} />)}
              </div>
              <div className="flex flex-col justify-around h-full py-60">
                 <MatchCard id="SF-1" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default KnockoutBracket;
