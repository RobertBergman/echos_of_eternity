import { TimeFragment } from '../types/game';

// Colors for the time fragments
const FRAGMENT_COLORS = ['#4D96FF', '#5CE1E6', '#6C4AB6', '#8D72E1', '#FF6B6B', '#FFD56F'];
// Types of time fragments
const FRAGMENT_TYPES = ['past', 'present', 'future', 'paradox', 'void', 'constant'];
// Patterns for time fragments
const FRAGMENT_PATTERNS = ['circle', 'square', 'triangle', 'diamond', 'hexagon', 'star'];

/**
 * Generate a random time fragment
 * @param id The ID for the fragment
 * @param boardWidth The width of the game board
 * @param boardHeight The height of the game board
 * @returns A time fragment with random properties
 */
const generateRandomTimeFragment = (
  id: number, 
  boardWidth: number, 
  boardHeight: number
): TimeFragment => {
  return {
    id,
    x: Math.floor(Math.random() * boardWidth),
    y: Math.floor(Math.random() * boardHeight),
    rotation: Math.floor(Math.random() * 4) * 90, // 0, 90, 180, or 270 degrees
    type: FRAGMENT_TYPES[Math.floor(Math.random() * FRAGMENT_TYPES.length)],
    color: FRAGMENT_COLORS[Math.floor(Math.random() * FRAGMENT_COLORS.length)],
    pattern: FRAGMENT_PATTERNS[Math.floor(Math.random() * FRAGMENT_PATTERNS.length)],
    solved: false
  };
};

/**
 * Generate a set of time fragments for a level
 * @param level The current game level
 * @param boardWidth The width of the game board
 * @param boardHeight The height of the game board
 * @returns An array of time fragments appropriate for the level
 */
const generateTimeFragmentsForLevel = (
  level: number, 
  boardWidth: number, 
  boardHeight: number
): TimeFragment[] => {
  // Calculate number of fragments based on level (more fragments as level increases)
  const fragmentCount = Math.min(3 + level, boardWidth * boardHeight / 2);
  
  const fragments: TimeFragment[] = [];
  
  for (let i = 0; i < fragmentCount; i++) {
    fragments.push(generateRandomTimeFragment(i, boardWidth, boardHeight));
  }
  
  return fragments;
};

/**
 * Check if a time fragment position is valid (not overlapping with other fragments)
 * @param fragment The fragment to check
 * @param existingFragments Existing fragments on the board
 * @returns True if the position is valid, false otherwise
 */
const isValidFragmentPosition = (
  fragment: TimeFragment,
  existingFragments: TimeFragment[]
): boolean => {
  return !existingFragments.some(
    existing => existing.id !== fragment.id && existing.x === fragment.x && existing.y === fragment.y
  );
};

/**
 * Move a time fragment to a new position
 * @param fragment The fragment to move
 * @param dx The x-axis change
 * @param dy The y-axis change
 * @param boardWidth The width of the game board
 * @param boardHeight The height of the game board
 * @param existingFragments Other fragments on the board
 * @returns The updated fragment with new position if valid, or the original fragment
 */
const moveTimeFragment = (
  fragment: TimeFragment,
  dx: number,
  dy: number,
  boardWidth: number,
  boardHeight: number,
  existingFragments: TimeFragment[]
): TimeFragment => {
  const newX = Math.max(0, Math.min(boardWidth - 1, fragment.x + dx));
  const newY = Math.max(0, Math.min(boardHeight - 1, fragment.y + dy));
  
  const newFragment = {
    ...fragment,
    x: newX,
    y: newY
  };
  
  if (isValidFragmentPosition(newFragment, existingFragments)) {
    return newFragment;
  }
  
  return fragment;
};

export const timeFragmentSystem = {
  generateRandomTimeFragment,
  generateTimeFragmentsForLevel,
  isValidFragmentPosition,
  moveTimeFragment,
  FRAGMENT_COLORS,
  FRAGMENT_TYPES,
  FRAGMENT_PATTERNS
};

export default timeFragmentSystem;
