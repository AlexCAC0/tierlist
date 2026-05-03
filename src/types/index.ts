export interface Jersey {
  id: string;
  country: string;
  type: 'Home' | 'Away' | 'Third';
  imageUrl: string;
  group: string;
}

export interface GroupData {
  name: string;
  teams: {
    name: string;
    imageUrl: string;
  }[];
}

export type TierRank = 'Hermosa' | 'Locura' | 'Ta bien' | 'Meh' | 'Horrible';

export interface TierListData {
  [key: string]: string[]; // rank -> jersey ids
}

// Predictions Types
export interface TeamPrediction {
  name: string;
  imageUrl: string;
}

export interface GroupPrediction {
  id: string; // "A", "B", etc.
  teams: TeamPrediction[];
}

export interface KnockoutMatch {
  id: string;
  homeTeam: string | null;
  awayTeam: string | null;
  winner: string | null;
  nextMatchId: string | null;
  round: 'R32' | 'R16' | 'QF' | 'SF' | 'F';
}

export interface PredictionState {
  groups: Record<string, string[]>; // groupId -> list of team names in order
  thirdPlaceSelected: string[]; // list of groupIds whose 3rd place team advances
  knockout: Record<string, KnockoutMatch>;
}
