// Game types for Echoes of Eternity

export interface TimeFragment {
  id: number;
  x: number;
  y: number;
  rotation: number;
  type?: string;
  color?: string;
  pattern?: string;
  solved?: boolean;
}

export interface Board {
  width: number;
  height: number;
  cells?: Array<Array<number | null>>;
}

export interface GameState {
  board: Board;
  timeFragments: TimeFragment[];
  chronoEnergy: number;
  level: number;
  score: number;
  isPlaying: boolean;
  puzzlesSolved: number;
}
