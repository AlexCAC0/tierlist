import type { Jersey } from "../types";
import { COUNTRY_MAP, GROUPS } from "../constants/teams";

const RAW_FILENAMES = [
  "AleL.png", "AleV.png", "AraL.png", "AraV.png", "ArgeL.png", "ArgeV.png", "ArgL.png", "ArgV.png",
  "AustraL.png", "AustraV.png", "AustriL.png", "AustriV.png", "BelL.png", "BelV.png", "BraL.png", "BraV.png",
  "CabL.png", "CabV.png", "Can3.png", "CanL.png", "CanV.png", "CatL.png", "CatV.png", "CdmL.png", "CdmV.png",
  "CheqL.png", "CheqV.png", "ColL.png", "ColV.png", "CoreaL.png", "CoreaV.png", "CroL.png", "CroV.png",
  "CuraV.png", "Ecu3.png", "EcuL.png", "EcuV.png", "EgiL.png", "EgiV.png", "EscL.png", "EscV.png",
  "EspL.png", "EspV.png", "FranL.png", "FranV.png", "GhaL.png", "GhaV.png", "Hai3.png", "HaiL.png", "HaiV.png",
  "IngL.png", "IngV.png", "JapL.png", "JapV.png", "MarL.png", "MarV.png", "MexL.png", "MexV.png",
  "Nor3.png", "NorL.png", "NorV.png", "NzlL.png", "NzlV.png", "PaisbL.png", "PaisbV.png", "Pan3.png", "PanL.png", "PanV.png",
  "ParL.png", "ParV.png", "PortL.png", "PortV.png", "Rdc3.png", "RdcL.png", "RdcV.png", "SenL.png", "SenV.png",
  "SudaL.png", "SudaV.png", "SueL.png", "SueV.png", "SuiL.png", "SuiV.png", "TurqL.png", "TurqV.png",
  "UruL.png", "UruV.png", "UsaL.png", "UsaV.png"
];

// Create a map from team name to group name for easy lookup
const TEAM_TO_GROUP: Record<string, string> = {};
GROUPS.forEach(group => {
  group.teams.forEach(team => {
    TEAM_TO_GROUP[team.name] = group.name;
  });
});

const parseJersey = (filename: string): Jersey => {
  const name = filename.replace(".png", "");
  // Find the index of the last uppercase letter or the '3'
  let typeChar = '';
  let countryCode = '';
  
  if (name.endsWith('3')) {
    typeChar = '3';
    countryCode = name.slice(0, -1);
  } else {
    // It's L or V. They are always uppercase.
    typeChar = name.slice(-1);
    countryCode = name.slice(0, -1);
  }

  const typeMap: Record<string, 'Home' | 'Away' | 'Third'> = {
    'L': 'Home',
    'V': 'Away',
    '3': 'Third'
  };

  const country = COUNTRY_MAP[countryCode] || countryCode;

  return {
    id: name,
    country: country,
    type: typeMap[typeChar] || 'Home',
    imageUrl: `/Assets/Camisetas Individuales/${filename}`,
    group: TEAM_TO_GROUP[country] || "Grupo Z"
  };
};

export const INDIVIDUAL_JERSEYS: Jersey[] = RAW_FILENAMES.map(parseJersey).sort((a, b) => {
  if (a.group < b.group) return -1;
  if (a.group > b.group) return 1;
  // Within same group, sort by country name
  if (a.country < b.country) return -1;
  if (a.country > b.country) return 1;
  // If same country, sort by type (Home, Away, Third)
  const typeOrder = { 'Home': 0, 'Away': 1, 'Third': 2 };
  return typeOrder[a.type] - typeOrder[b.type];
});
