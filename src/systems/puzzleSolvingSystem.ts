import { TimeFragment } from '../types/game';
import timeFragmentSystem from './timeFragmentSystem';

/**
 * Patterns that can form valid solutions
 * Each pattern defines a specific arrangement of fragment types
 */
const VALID_PATTERNS = [
  // Pattern: Time sequence (past -> present -> future)
  {
    name: 'Chronological Sequence',
    types: ['past', 'present', 'future'],
    arrangement: 'linear', // fragments must be adjacent in a line
    rotations: [0, 0, 0], // all fragments must be at 0 degrees rotation
    points: 100
  },
  // Pattern: Paradox resolution
  {
    name: 'Paradox Resolution',
    types: ['paradox', 'constant', 'void'],
    arrangement: 'triangle', // fragments must form a triangle
    rotations: [90, 180, 270], // specific rotations required
    points: 150
  },
  // Pattern: Temporal balance
  {
    name: 'Temporal Balance',
    types: ['past', 'future'],
    arrangement: 'adjacent', // fragments must be adjacent
    rotations: [180, 180], // both fragments must be at 180 degrees
    points: 50
  },
  // Pattern: Time loop
  {
    name: 'Time Loop',
    types: ['past', 'present', 'future', 'past'],
    arrangement: 'square', // fragments must form a square/rectangle
    rotations: [0, 90, 180, 270], // each fragment has a different rotation
    points: 200
  }
];

/**
 * Check if fragments form a linear pattern (in a line)
 * @param fragments Array of fragments to check
 * @returns true if fragments are in a line (horizontal or vertical)
 */
const isLinearArrangement = (fragments: TimeFragment[]): boolean => {
  // Check if all fragments share the same x-coordinate (vertical line)
  const sameX = fragments.every(f => f.x === fragments[0].x);
  if (sameX) {
    // Check that y-coordinates are consecutive
    const sortedByY = [...fragments].sort((a, b) => a.y - b.y);
    for (let i = 1; i < sortedByY.length; i++) {
      if (sortedByY[i].y !== sortedByY[i-1].y + 1) {
        return false;
      }
    }
    return true;
  }
  
  // Check if all fragments share the same y-coordinate (horizontal line)
  const sameY = fragments.every(f => f.y === fragments[0].y);
  if (sameY) {
    // Check that x-coordinates are consecutive
    const sortedByX = [...fragments].sort((a, b) => a.x - b.x);
    for (let i = 1; i < sortedByX.length; i++) {
      if (sortedByX[i].x !== sortedByX[i-1].x + 1) {
        return false;
      }
    }
    return true;
  }
  
  return false;
};

/**
 * Check if fragments form a triangular pattern
 * @param fragments Array of exactly 3 fragments to check
 * @returns true if fragments form a triangle
 */
const isTriangleArrangement = (fragments: TimeFragment[]): boolean => {
  if (fragments.length !== 3) return false;
  
  // For a triangle pattern, no two fragments should share both x and y coordinates
  // and they shouldn't all be in a straight line
  const unique = new Set();
  fragments.forEach(f => unique.add(`${f.x},${f.y}`));
  
  // Make sure we have 3 unique positions
  if (unique.size !== 3) return false;
  
  // Make sure they're not in a line
  return !isLinearArrangement(fragments);
};

/**
 * Check if fragments form a square/rectangular pattern
 * @param fragments Array of 4 fragments to check
 * @returns true if fragments form a square or rectangle
 */
const isSquareArrangement = (fragments: TimeFragment[]): boolean => {
  if (fragments.length !== 4) return false;
  
  // For a square, we need fragments at all 4 corners
  const positions = fragments.map(f => ({ x: f.x, y: f.y }));
  
  // Get min and max x, y values
  const minX = Math.min(...positions.map(p => p.x));
  const maxX = Math.max(...positions.map(p => p.x));
  const minY = Math.min(...positions.map(p => p.y));
  const maxY = Math.max(...positions.map(p => p.y));
  
  // For a rectangle, we expect to find fragments at exactly
  // (minX, minY), (maxX, minY), (minX, maxY), and (maxX, maxY)
  const cornerPositions = [
    { x: minX, y: minY },
    { x: maxX, y: minY },
    { x: minX, y: maxY },
    { x: maxX, y: maxY }
  ];
  
  // Check if every corner has a fragment
  return cornerPositions.every(corner => 
    positions.some(pos => pos.x === corner.x && pos.y === corner.y)
  );
};

/**
 * Check if fragments are adjacent to each other
 * @param fragments Array of fragments to check
 * @returns true if all fragments are adjacent to at least one other fragment
 */
const isAdjacentArrangement = (fragments: TimeFragment[]): boolean => {
  if (fragments.length < 2) return false;
  
  // Helper to check if two fragments are adjacent
  const areAdjacent = (f1: TimeFragment, f2: TimeFragment): boolean => {
    // Adjacent if they share an edge (differ by 1 in exactly one coordinate)
    const xDiff = Math.abs(f1.x - f2.x);
    const yDiff = Math.abs(f1.y - f2.y);
    return (xDiff === 1 && yDiff === 0) || (xDiff === 0 && yDiff === 1);
  };
  
  // Create a graph of adjacency
  const adjacencyMap = new Map<number, number[]>();
  
  // Initialize each fragment with an empty adjacency list
  fragments.forEach(f => {
    adjacencyMap.set(f.id, []);
  });
  
  // Fill the adjacency map
  for (let i = 0; i < fragments.length; i++) {
    for (let j = i + 1; j < fragments.length; j++) {
      if (areAdjacent(fragments[i], fragments[j])) {
        adjacencyMap.get(fragments[i].id)?.push(fragments[j].id);
        adjacencyMap.get(fragments[j].id)?.push(fragments[i].id);
      }
    }
  }
  
  // Check if every fragment is adjacent to at least one other
  let allAdjacent = true;
  adjacencyMap.forEach(adjacentIds => {
    if (adjacentIds.length === 0) {
      allAdjacent = false;
    }
  });
  return allAdjacent;
};

/**
 * Check if a set of fragments matches a pattern
 * @param fragments Array of fragments to check
 * @param pattern The pattern to check against
 * @returns true if fragments match the pattern
 */
const matchesPattern = (fragments: TimeFragment[], pattern: typeof VALID_PATTERNS[0]): boolean => {
  if (fragments.length !== pattern.types.length) return false;
  
  // Check fragment types (in any order)
  const fragmentTypes = fragments.map(f => f.type);
  const typesMatch = pattern.types.every(type => 
    fragmentTypes.includes(type) && 
    fragmentTypes.filter(t => t === type).length === 
    pattern.types.filter(t => t === type).length
  );
  
  if (!typesMatch) return false;
  
  // Check the arrangement
  let arrangementMatches = false;
  switch (pattern.arrangement) {
    case 'linear':
      arrangementMatches = isLinearArrangement(fragments);
      break;
    case 'triangle':
      arrangementMatches = isTriangleArrangement(fragments);
      break;
    case 'square':
      arrangementMatches = isSquareArrangement(fragments);
      break;
    case 'adjacent':
      arrangementMatches = isAdjacentArrangement(fragments);
      break;
    default:
      arrangementMatches = false;
  }
  
  if (!arrangementMatches) return false;
  
  // Check rotations for specific patterns
  if (pattern.rotations) {
    // Sort fragments to match the pattern type order
    const fragmentsByType: Record<string, TimeFragment[]> = {};
    
    // Group fragments by type
    fragments.forEach(fragment => {
      if (!fragment.type) return;
      
      if (!fragmentsByType[fragment.type]) {
        fragmentsByType[fragment.type] = [];
      }
      
      fragmentsByType[fragment.type].push(fragment);
    });
    
    // Match each pattern type to a fragment
    const sortedFragments: TimeFragment[] = [];
    const usedFragmentIds = new Set<number>();
    
    for (const type of pattern.types) {
      const availableFragments = fragmentsByType[type] || [];
      const fragment = availableFragments.find(f => !usedFragmentIds.has(f.id));
      
      if (!fragment) return false; // Missing required fragment type
      
      sortedFragments.push(fragment);
      usedFragmentIds.add(fragment.id);
    }
    
    const rotationsMatch = sortedFragments.every((fragment, index) => 
      fragment.rotation === pattern.rotations[index]
    );
    
    if (!rotationsMatch) return false;
  }
  
  return true;
};

/**
 * Check if a set of fragments forms any valid pattern
 * @param fragments Array of fragments to check
 * @returns The matching pattern or null if no match
 */
const checkForPatternMatch = (
  fragments: TimeFragment[]
): { pattern: typeof VALID_PATTERNS[0], fragments: TimeFragment[] } | null => {
  // Don't check single fragments
  if (fragments.length < 2) return null;
  
  // Try each valid pattern
  for (const pattern of VALID_PATTERNS) {
    // Skip if the fragment count doesn't match the pattern
    if (fragments.length !== pattern.types.length) continue;
    
    if (matchesPattern(fragments, pattern)) {
      return { pattern, fragments };
    }
  }
  
  return null;
};

/**
 * Rotate a fragment by the specified degrees
 * @param fragment The fragment to rotate
 * @param degrees The degrees to rotate (must be 0, 90, 180, or 270)
 * @returns The rotated fragment
 */
const rotateFragment = (fragment: TimeFragment, degrees: 0 | 90 | 180 | 270): TimeFragment => {
  // Only allow valid rotation angles
  if (![0, 90, 180, 270].includes(degrees)) {
    return fragment;
  }
  
  return {
    ...fragment,
    rotation: degrees
  };
};

/**
 * Get all possible pattern combinations from a set of fragments
 * @param fragments Array of all fragments to consider
 * @returns Array of possible combinations that form valid patterns
 */
const getPossiblePatterns = (fragments: TimeFragment[]): Array<{
  pattern: typeof VALID_PATTERNS[0],
  fragments: TimeFragment[]
}> => {
  const possiblePatterns: Array<{
    pattern: typeof VALID_PATTERNS[0],
    fragments: TimeFragment[]
  }> = [];
  
  // For each pattern, try to find matching fragment combinations
  for (const pattern of VALID_PATTERNS) {
    // Skip if we don't have enough fragments for this pattern
    if (fragments.length < pattern.types.length) continue;
    
    // Get all combinations of fragments with the right length
    const combinations = getCombinations(fragments, pattern.types.length);
    
    // Check each combination against the pattern
    for (const combo of combinations) {
      if (matchesPattern(combo, pattern)) {
        possiblePatterns.push({ pattern, fragments: combo });
      }
    }
  }
  
  return possiblePatterns;
};

/**
 * Helper function to get all combinations of a specific size
 * @param array The array to generate combinations from
 * @param size The size of each combination
 * @returns Array of all possible combinations
 */
const getCombinations = <T>(array: T[], size: number): T[][] => {
  const result: T[][] = [];
  
  // Base case
  if (size === 1) {
    return array.map(item => [item]);
  }
  
  // Recursive case
  for (let i = 0; i <= array.length - size; i++) {
    const firstElement = array[i];
    const remainingElements = array.slice(i + 1);
    const smallerCombinations = getCombinations(remainingElements, size - 1);
    
    for (const smallerCombo of smallerCombinations) {
      result.push([firstElement, ...smallerCombo]);
    }
  }
  
  return result;
};

export const puzzleSolvingSystem = {
  VALID_PATTERNS,
  isLinearArrangement,
  isTriangleArrangement,
  isSquareArrangement,
  isAdjacentArrangement,
  matchesPattern,
  checkForPatternMatch,
  rotateFragment,
  getPossiblePatterns
};

export default puzzleSolvingSystem;
