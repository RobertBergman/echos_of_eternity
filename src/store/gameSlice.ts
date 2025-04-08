import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, TimeFragment, Board } from '../types/game';

const initialState: GameState = {
  board: {
    width: 6,
    height: 6,
    cells: Array(6).fill(null).map(() => Array(6).fill(null))
  },
  timeFragments: [],
  chronoEnergy: 50,
  level: 1,
  score: 0,
  isPlaying: false,
  puzzlesSolved: 0
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // Board actions
    updateBoard(state, action: PayloadAction<Board>) {
      state.board = action.payload;
    },
    
    // Time Fragment actions
    addTimeFragment(state, action: PayloadAction<TimeFragment>) {
      state.timeFragments.push(action.payload);
    },
    updateTimeFragment(state, action: PayloadAction<TimeFragment>) {
      const index = state.timeFragments.findIndex(
        fragment => fragment.id === action.payload.id
      );
      if (index !== -1) {
        state.timeFragments[index] = action.payload;
      }
    },
    removeTimeFragment(state, action: PayloadAction<number>) {
      state.timeFragments = state.timeFragments.filter(
        fragment => fragment.id !== action.payload
      );
    },
    rotateTimeFragment(state, action: PayloadAction<{ id: number, rotation: number }>) {
      const { id, rotation } = action.payload;
      const index = state.timeFragments.findIndex(fragment => fragment.id === id);
      if (index !== -1) {
        state.timeFragments[index].rotation = rotation;
      }
    },
    
    // Chrono Energy actions
    updateChronoEnergy(state, action: PayloadAction<number>) {
      state.chronoEnergy = action.payload;
    },
    replenishChronoEnergy(state, action: PayloadAction<number>) {
      state.chronoEnergy += action.payload;
    },
    depleteChronoEnergy(state, action: PayloadAction<number>) {
      state.chronoEnergy = Math.max(0, state.chronoEnergy - action.payload);
    },
    
    // Game state actions
    startGame(state) {
      state.isPlaying = true;
    },
    pauseGame(state) {
      state.isPlaying = false;
    },
    updateScore(state, action: PayloadAction<number>) {
      state.score = action.payload;
    },
    incrementScore(state, action: PayloadAction<number>) {
      state.score += action.payload;
    },
    incrementLevel(state) {
      state.level += 1;
    },
    incrementPuzzlesSolved(state) {
      state.puzzlesSolved += 1;
    },
    resetGame(state) {
      return initialState;
    }
  }
});

export const { 
  updateBoard, 
  addTimeFragment, 
  updateTimeFragment,
  removeTimeFragment,
  rotateTimeFragment,
  updateChronoEnergy,
  replenishChronoEnergy,
  depleteChronoEnergy,
  startGame,
  pauseGame,
  updateScore,
  incrementScore,
  incrementLevel,
  incrementPuzzlesSolved,
  resetGame
} = gameSlice.actions;

export default gameSlice.reducer;
