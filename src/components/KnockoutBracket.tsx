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
  label?: string; // e.g. "1°A vs 2°B"
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

// CSS Confetti implementation
const ConfettiRain = () => {
  const particles = Array.from({ length: 48 });
  const colors = ['bg-wc-red', 'bg-wc-blue', 'bg-wc-green', 'bg-wc-gold', 'bg-[#FFE082]', 'bg-white'];
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30 select-none">
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .confetti-particle {
          animation: fall 4s linear infinite;
        }
      `}</style>
      {particles.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 4;
        const size = Math.random() * 8 + 6;
        const color = colors[Math.floor(Math.random() * colors.length)];
        return (
          <div
            key={i}
            className={`absolute confetti-particle ${color} rounded-sm`}
            style={{
              left: `${left}%`,
              top: `-20px`,
              width: `${size}px`,
              height: `${size * 1.5}px`,
              animationDelay: `${delay}s`,
              animationDuration: `${Math.random() * 2 + 3}s`,
            }}
          />
        );
      })}
    </div>
  );
};

// Helper: get team by position from groupRankings
const getTeam = (groupRankings: Record<string, string[]>, groupLetter: string, pos: number): string => {
  const key = `Grupo ${groupLetter}`;
  return groupRankings[key]?.[pos] ?? "TBD";
};

// Helper: get best third from a list of valid group letters given selected thirds
const getBestThird = (
  groupRankings: Record<string, string[]>,
  thirdPlaceSelected: string[],
  validGroups: string[]
): string => {
  // Find the first selected group that falls in validGroups
  const match = thirdPlaceSelected.find(groupName => {
    const letter = groupName.replace("Grupo ", "");
    return validGroups.includes(letter);
  });
  if (match) return groupRankings[match]?.[2] ?? "TBD";
  return "TBD";
};

/**
 * Builds the official FIFA World Cup 2026 Round of 32 bracket.
 * Source: https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_knockout_stage
 *
 * The 16 R32 matches and their subsequent R16 pairings:
 *   M1:  2°A vs 2°B                     ─┐
 *   M2:  1°C vs 3°(A/D/F/G/L)           ─┘ → R16-0 (M1 winner vs M2 winner)
 *   M3:  1°E vs 3°(A/B/C/D/F)           ─┐
 *   M4:  1°F vs 2°C                      ─┘ → R16-1 (M3 winner vs M4 winner)
 *   M5:  2°E vs 2°I                      ─┐
 *   M6:  1°I vs 3°(C/D/F/G/H)           ─┘ → R16-2 (M5 winner vs M6 winner)
 *   M7:  1°A vs 3°(C/E/F/H/I)           ─┐
 *   M8:  1°L vs 3°(E/H/I/J/K)           ─┘ → R16-3 (M7 winner vs M8 winner)
 *   M9:  1°G vs 3°(A/E/H/I/J)           ─┐
 *   M10: 1°D vs 3°(B/E/F/I/J)           ─┘ → R16-4 (M9 winner vs M10 winner)
 *   M11: 1°H vs 2°J                     ─┐
 *   M12: 2°K vs 2°L                     ─┘ → R16-5 (M11 winner vs M12 winner)
 *   M13: 1°B vs 3°(E/F/G/I/J)          ─┐
 *   M14: 2°D vs 2°G                     ─┘ → R16-6 (M13 winner vs M14 winner)
 *   M15: 1°J vs 2°H                     ─┐
 *   M16: 1°K vs 3°(D/E/I/J/L)          ─┘ → R16-7 (M15 winner vs M16 winner)
 */
const buildInitialMatches = (
  groupRankings: Record<string, string[]>,
  thirdPlaceSelected: string[]
): Record<string, Match> => {
  const initialMatches: Record<string, Match> = {};

  // Initialize all rounds
  const rounds = ['R32', 'R16', 'QF', 'SF', 'F'];
  const counts = [16, 8, 4, 2, 1];
  rounds.forEach((round, rIdx) => {
    for (let i = 0; i < counts[rIdx]; i++) {
      const id = `${round}-${i}`;
      initialMatches[id] = { id, home: null, away: null, winner: null };
    }
  });

  // Helper shorthands
  const w = (letter: string, pos: number) => getTeam(groupRankings, letter, pos);
  const t3 = (validGroups: string[]) => getBestThird(groupRankings, thirdPlaceSelected, validGroups);

  // R32 matches (0-indexed, matching the Wikipedia numbering M1=R32-0 ... M16=R32-15)
  const r32 = [
    // M1: 2°A vs 2°B
    { home: w('A', 1), away: w('B', 1), label: '2°A vs 2°B' },
    // M2: 1°C vs 3°(A/D/F/G/L)
    { home: w('C', 0), away: t3(['A', 'D', 'F', 'G', 'L']), label: '1°C vs Mejor 3°(A/D/F/G/L)' },
    // M3: 1°E vs 3°(A/B/C/D/F)
    { home: w('E', 0), away: t3(['A', 'B', 'C', 'D', 'F']), label: '1°E vs Mejor 3°(A/B/C/D/F)' },
    // M4: 1°F vs 2°C
    { home: w('F', 0), away: w('C', 1), label: '1°F vs 2°C' },
    // M5: 2°E vs 2°I
    { home: w('E', 1), away: w('I', 1), label: '2°E vs 2°I' },
    // M6: 1°I vs 3°(C/D/F/G/H)
    { home: w('I', 0), away: t3(['C', 'D', 'F', 'G', 'H']), label: '1°I vs Mejor 3°(C/D/F/G/H)' },
    // M7: 1°A vs 3°(C/E/F/H/I)
    { home: w('A', 0), away: t3(['C', 'E', 'F', 'H', 'I']), label: '1°A vs Mejor 3°(C/E/F/H/I)' },
    // M8: 1°L vs 3°(E/H/I/J/K)
    { home: w('L', 0), away: t3(['E', 'H', 'I', 'J', 'K']), label: '1°L vs Mejor 3°(E/H/I/J/K)' },
    // M9: 1°G vs 3°(A/E/H/I/J)
    { home: w('G', 0), away: t3(['A', 'E', 'H', 'I', 'J']), label: '1°G vs Mejor 3°(A/E/H/I/J)' },
    // M10: 1°D vs 3°(B/E/F/I/J)
    { home: w('D', 0), away: t3(['B', 'E', 'F', 'I', 'J']), label: '1°D vs Mejor 3°(B/E/F/I/J)' },
    // M11: 1°H vs 2°J
    { home: w('H', 0), away: w('J', 1), label: '1°H vs 2°J' },
    // M12: 2°K vs 2°L
    { home: w('K', 1), away: w('L', 1), label: '2°K vs 2°L' },
    // M13: 1°B vs 3°(E/F/G/I/J)
    { home: w('B', 0), away: t3(['E', 'F', 'G', 'I', 'J']), label: '1°B vs Mejor 3°(E/F/G/I/J)' },
    // M14: 2°D vs 2°G
    { home: w('D', 1), away: w('G', 1), label: '2°D vs 2°G' },
    // M15: 1°J vs 2°H
    { home: w('J', 0), away: w('H', 1), label: '1°J vs 2°H' },
    // M16: 1°K vs 3°(D/E/I/J/L)
    { home: w('K', 0), away: t3(['D', 'E', 'I', 'J', 'L']), label: '1°K vs Mejor 3°(D/E/I/J/L)' },
  ];

  r32.forEach((match, i) => {
    initialMatches[`R32-${i}`] = {
      id: `R32-${i}`,
      home: { name: match.home },
      away: { name: match.away },
      winner: null,
      label: match.label,
    };
  });

  return initialMatches;
};

/**
 * Maps R32 match index to the next R16 match index and slot (home/away).
 * Pairs: (0,1)→R16-0, (2,3)→R16-1, (4,5)→R16-2, (6,7)→R16-3,
 *        (8,9)→R16-4, (10,11)→R16-5, (12,13)→R16-6, (14,15)→R16-7
 */
const getNextMatch = (round: string, idx: number): { nextId: string; isHome: boolean } | null => {
  const nextRoundMap: Record<string, string> = {
    'R32': 'R16',
    'R16': 'QF',
    'QF': 'SF',
    'SF': 'F',
  };
  const nextRound = nextRoundMap[round];
  if (!nextRound) return null;
  const nextMatchIdx = Math.floor(idx / 2);
  return { nextId: `${nextRound}-${nextMatchIdx}`, isHome: idx % 2 === 0 };
};

const KnockoutBracket: React.FC<KnockoutBracketProps> = ({ groupRankings, thirdPlaceSelected, onBack }) => {
  const [matches, setMatches] = useState<Record<string, Match>>({});
  const bracketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMatches(buildInitialMatches(groupRankings, thirdPlaceSelected));
  }, [groupRankings, thirdPlaceSelected]);

  const handleWinner = (matchId: string, winnerName: string) => {
    if (winnerName === "TBD") return;

    setMatches(prev => {
      const newMatches = { ...prev };
      newMatches[matchId] = { ...newMatches[matchId], winner: winnerName };

      const [round, index] = matchId.split('-');
      const idx = parseInt(index);
      const next = getNextMatch(round, idx);

      if (next) {
        const winnerTeam = winnerName === prev[matchId].home?.name ? prev[matchId].home : prev[matchId].away;
        newMatches[next.nextId] = {
          ...newMatches[next.nextId],
          [next.isHome ? 'home' : 'away']: winnerTeam,
          // Reset winner when a slot changes
          winner: null,
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
        flex flex-col w-52 relative group/card rounded-xl overflow-hidden border
        ${match.winner 
          ? 'border-wc-red shadow-[0_0_20px_rgba(255,26,77,0.25)] scale-102 z-20' 
          : 'border-white/10 opacity-75 hover:opacity-100 hover:border-white/20'
        }
        transition-all duration-300
      `}>
        {/* Card Background Overlay */}
        <div className="absolute inset-0 bg-[#080808]/90 backdrop-blur-md"></div>
        <div className="absolute top-0 left-0 w-1 h-full bg-wc-blue"></div>
        {match.winner && <div className="absolute top-0 left-0 w-1 h-full bg-wc-red"></div>}

        {/* Match label */}
        {match.label && (
          <div className="relative z-10 px-3 pt-2 pb-0">
            <span className="text-[8px] font-wc-title font-bold uppercase tracking-wider text-white/20 truncate block">
              {match.label}
            </span>
          </div>
        )}
        
        <button 
          onClick={() => match.home && handleWinner(id, match.home.name)}
          className={`relative z-10 flex items-center justify-between p-3 pt-1.5 transition-all cursor-pointer ${match.winner === match.home?.name ? 'text-white font-black' : 'text-white/40'}`}
        >
          <div className="flex items-center space-x-2 truncate">
            {match.home && match.home.name !== "TBD" ? (
              <img src={getTeamCrest(match.home.name)} alt="" className="w-7 h-7 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-wc-title text-[9px]">?</div>
            )}
            <span className="font-wc-title text-[11px] uppercase tracking-wider italic">{match.home?.name || "TBD"}</span>
          </div>
          {match.winner === match.home?.name && <Star size={12} className="fill-wc-gold text-wc-gold animate-bounce" />}
        </button>

        <div className="h-[1px] bg-white/10 relative z-10 mx-3"></div>

        <button 
          onClick={() => match.away && handleWinner(id, match.away.name)}
          className={`relative z-10 flex items-center justify-between p-3 transition-all cursor-pointer ${match.winner === match.away?.name ? 'text-white font-black' : 'text-white/40'}`}
        >
          <div className="flex items-center space-x-2 truncate">
            {match.away && match.away.name !== "TBD" ? (
              <img src={getTeamCrest(match.away.name)} alt="" className="w-7 h-7 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-wc-title text-[9px]">?</div>
            )}
            <span className="font-wc-title text-[11px] uppercase tracking-wider italic">{match.away?.name || "TBD"}</span>
          </div>
          {match.winner === match.away?.name && <Star size={12} className="fill-wc-gold text-wc-gold animate-bounce" />}
        </button>
      </div>
    );
  };

  const winner = getWinner();

  return (
    <div className="space-y-12 font-wc-font">
      {/* Navigation and Fullscreen Controls */}
      <div className="glass-panel p-6 md:p-8 rounded-[2.5rem] border border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-wc-blue/5 via-transparent to-wc-red/5 opacity-40"></div>
        
        <button 
          onClick={onBack}
          className="relative z-10 flex items-center space-x-3 text-white/40 hover:text-white transition-all uppercase font-wc-title font-bold text-xs tracking-widest cursor-pointer group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Volver a Grupos</span>
        </button>

        <div className="relative z-10 text-center select-none">
          <p className="text-[9px] font-wc-title font-bold uppercase tracking-[0.3em] text-wc-gold/70 mb-0.5">Cuadro Oficial FIFA</p>
          <h2 className="text-lg font-wc-title font-black uppercase italic tracking-tight text-white">Copa Mundial 2026</h2>
        </div>

        <button 
          onClick={toggleFullscreen}
          className="relative z-10 flex items-center space-x-3 bg-white text-black px-10 py-4.5 rounded-xl font-wc-title font-bold uppercase text-xs tracking-[0.15em] hover:bg-wc-red hover:text-white hover:shadow-[0_0_20px_rgba(255,26,77,0.4)] transition-all duration-300 shadow-xl skew-x-[-8deg] cursor-pointer"
        >
          <div className="transform skew-x-[8deg] flex items-center gap-2">
            <Maximize2 size={16} />
            <span>Pantalla Completa</span>
          </div>
        </button>
      </div>

      {/* Bracket Area */}
      <div className="overflow-x-auto pb-16 rounded-[2.5rem] border border-white/10 bg-black/40 shadow-inner p-3">
        <div 
          ref={bracketRef} 
          className="min-w-max p-12 bg-[#020202] relative overflow-hidden flex items-center justify-center rounded-[2.2rem] border border-white/5"
          style={{ minHeight: '920px' }}
        >
          {/* Tactical Pitch Lines Decoration */}
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none select-none football-pitch-grid"></div>
          
          {/* Central Pitch Markings */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] border-[3px] border-white/[0.03] rounded-full pointer-events-none z-0"></div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white/[0.03] rounded-full pointer-events-none z-0"></div>
          <div className="absolute left-1/2 top-0 bottom-0 w-[3px] bg-white/[0.03] pointer-events-none z-0"></div>

          <div className="flex justify-between items-center gap-16 relative z-10 px-8">
            
            {/* Left Side: R32 M1-M8, R16 0-3, QF 0-1, SF 0 */}
            <div className="flex gap-10 items-center h-full">
              {/* R32 left (M1-M8 = indices 0-7) */}
              <div className="flex flex-col justify-around h-full space-y-6">
                 {[0, 1, 2, 3, 4, 5, 6, 7].map(i => <MatchCard key={`R32-${i}`} id={`R32-${i}`} />)}
              </div>
              {/* R16 left (0-3) */}
              <div className="flex flex-col justify-around h-full py-10 space-y-12">
                 {[0, 1, 2, 3].map(i => <MatchCard key={`R16-${i}`} id={`R16-${i}`} />)}
              </div>
              {/* QF left (0-1) */}
              <div className="flex flex-col justify-around h-full py-20 space-y-24">
                 {[0, 1].map(i => <MatchCard key={`QF-${i}`} id={`QF-${i}`} />)}
              </div>
              {/* SF left (0) */}
              <div className="flex flex-col justify-around h-full py-40">
                 <MatchCard id="SF-0" />
              </div>
            </div>

            {/* Central Stage (Podium and Trophy) */}
            <div className="flex flex-col items-center justify-center space-y-16 w-[580px] px-6 min-w-max relative">
               
               {/* Ambient Trophy Aura */}
               <div className="absolute w-[350px] h-[350px] bg-wc-gold/10 blur-[90px] rounded-full top-[-50px] pointer-events-none animate-pulse-glow z-0"></div>

               <div className="text-center space-y-8 relative z-10">
                  <div className={`relative w-44 h-44 bg-gradient-to-br from-[#FFE082] via-wc-gold to-[#8D6E63] rounded-[2.5rem] flex items-center justify-center mx-auto shadow-[0_0_80px_rgba(212,175,55,0.35)] border-4 border-white/20 transform transition-all duration-1000 select-none ${winner ? 'animate-float' : 'rotate-45'}`}>
                    <div className="transform -rotate-45">
                       <Trophy size={80} className="text-black drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]" />
                    </div>
                  </div>
                  <div className="space-y-2 select-none">
                    <h3 className="text-5xl font-wc-title font-black uppercase italic tracking-tighter text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">GRAND FINAL</h3>
                    <div className="flex items-center justify-center space-x-4">
                       <div className="h-[2px] w-12 bg-wc-blue/50"></div>
                       <p className="text-wc-red font-wc-title font-bold uppercase tracking-[0.8em] text-[9px]">Mundial 2026</p>
                       <div className="h-[2px] w-12 bg-wc-red/50"></div>
                    </div>
                  </div>
               </div>

               {/* Grand Final Match Card (Scaled) */}
               <div className="scale-[1.7] transform transition-all duration-700 relative z-10">
                 <MatchCard id="F-0" />
               </div>

               {/* Epic Winner Ceremony Overlay */}
               {winner && (
                 <div className="text-center space-y-10 animate-in fade-in zoom-in slide-in-from-top-12 duration-1000 relative z-40 max-w-full">
                    <ConfettiRain />
                    
                    <div className="flex flex-col items-center space-y-6">
                       <div className="relative select-none">
                          <div className="absolute -inset-6 bg-wc-red/35 blur-xl animate-ping rounded-full"></div>
                          <div className="bg-gradient-to-r from-wc-red to-wc-red/80 text-white px-10 py-2.5 font-wc-title font-black uppercase tracking-[0.8em] text-xs skew-x-[-15deg] shadow-[0_15px_35px_rgba(255,26,77,0.4)] relative z-10 border border-white/10">
                             Campeón
                          </div>
                       </div>
                       
                       <div className="flex items-center space-x-6 md:space-x-8">
                          <Star size={40} className="text-wc-gold fill-wc-gold animate-spin hidden sm:block" />
                          <h2 className="text-7xl md:text-8xl lg:text-[7.5rem] font-wc-title font-black uppercase italic tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFE082] to-wc-gold drop-shadow-[0_10px_35px_rgba(212,175,55,0.4)] leading-none">
                             {winner}
                          </h2>
                          <Star size={40} className="text-wc-gold fill-wc-gold animate-spin hidden sm:block" />
                       </div>
                    </div>
                    
                    {/* Pulsing ceremony indicators */}
                    <div className="flex justify-center space-x-5 select-none">
                       {[...Array(9)].map((_, i) => (
                         <div key={i} className={`w-3.5 h-3.5 rounded-full bg-wc-gold animate-ping`} style={{ animationDelay: `${i*200}ms` }}></div>
                       ))}
                    </div>
                 </div>
               )}
            </div>

            {/* Right Side: R32 M9-M16, R16 4-7, QF 2-3, SF 1 */}
            <div className="flex gap-10 items-center h-full flex-row-reverse">
              {/* R32 right (M9-M16 = indices 8-15) */}
              <div className="flex flex-col justify-around h-full space-y-6">
                 {[8, 9, 10, 11, 12, 13, 14, 15].map(i => <MatchCard key={`R32-${i}`} id={`R32-${i}`} />)}
              </div>
              {/* R16 right (4-7) */}
              <div className="flex flex-col justify-around h-full py-10 space-y-12">
                 {[4, 5, 6, 7].map(i => <MatchCard key={`R16-${i}`} id={`R16-${i}`} />)}
              </div>
              {/* QF right (2-3) */}
              <div className="flex flex-col justify-around h-full py-20 space-y-24">
                 {[2, 3].map(i => <MatchCard key={`QF-${i}`} id={`QF-${i}`} />)}
              </div>
              {/* SF right (1) */}
              <div className="flex flex-col justify-around h-full py-40">
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
