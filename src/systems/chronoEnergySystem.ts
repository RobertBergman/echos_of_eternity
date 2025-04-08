/**
 * ChronoEnergySystem manages the player's energy in the game
 * Chrono-Energy is used to manipulate time fragments and solve puzzles
 */

// Base chrono-energy settings
const BASE_ENERGY_CAPACITY = 100;
const BASE_ENERGY_REGEN_RATE = 1; // Energy points per second
const BASE_ACTION_COST = {
  moveFragment: 2,
  rotateFragment: 1,
  solvePatternPuzzle: 5,
  skipPuzzle: 25
};

/**
 * Calculate maximum energy capacity based on player level/upgrades
 * @param level The player's current level
 * @param upgrades Any upgrades that affect energy capacity
 * @returns The maximum energy capacity
 */
const calculateEnergyCapacity = (level: number, upgrades: number = 0): number => {
  return BASE_ENERGY_CAPACITY + (level * 10) + (upgrades * 20);
};

/**
 * Calculate energy regeneration rate based on player level/upgrades
 * @param level The player's current level
 * @param upgrades Any upgrades that affect regen rate
 * @returns Energy points regenerated per second
 */
const calculateRegenRate = (level: number, upgrades: number = 0): number => {
  return BASE_ENERGY_REGEN_RATE + (level * 0.1) + (upgrades * 0.5);
};

/**
 * Calculate action cost based on player level/upgrades
 * @param actionType The type of action being performed
 * @param level The player's current level
 * @param upgrades Any upgrades that affect action costs
 * @returns The cost of the action in energy points
 */
const calculateActionCost = (
  actionType: keyof typeof BASE_ACTION_COST,
  level: number = 1,
  upgrades: number = 0
): number => {
  // As player levels up, actions become slightly more efficient
  const levelDiscount = Math.min(0.3, level * 0.02); // Max 30% discount from levels
  const upgradeDiscount = upgrades * 0.05; // 5% discount per upgrade

  const baseCost = BASE_ACTION_COST[actionType];
  const discountedCost = baseCost * (1 - levelDiscount - upgradeDiscount);
  
  // Ensure minimum cost of at least 1
  return Math.max(1, Math.floor(discountedCost));
};

/**
 * Check if player has enough energy for an action
 * @param currentEnergy Current energy level
 * @param actionType Type of action being checked
 * @param level Player's level
 * @param upgrades Any relevant upgrades
 * @returns True if player has enough energy, false otherwise
 */
const hasEnoughEnergy = (
  currentEnergy: number,
  actionType: keyof typeof BASE_ACTION_COST,
  level: number = 1,
  upgrades: number = 0
): boolean => {
  const cost = calculateActionCost(actionType, level, upgrades);
  return currentEnergy >= cost;
};

/**
 * Consume energy for an action
 * @param currentEnergy Current energy level
 * @param actionType Type of action being performed
 * @param level Player's level
 * @param upgrades Any relevant upgrades
 * @returns The remaining energy after consumption
 */
const consumeEnergy = (
  currentEnergy: number,
  actionType: keyof typeof BASE_ACTION_COST,
  level: number = 1,
  upgrades: number = 0
): number => {
  const cost = calculateActionCost(actionType, level, upgrades);
  return Math.max(0, currentEnergy - cost);
};

/**
 * Replenish energy based on time elapsed
 * @param currentEnergy Current energy level
 * @param elapsedTimeInSeconds Time elapsed since last update in seconds
 * @param level Player's level
 * @param upgrades Any relevant upgrades
 * @param maxCapacity Maximum energy capacity (optional)
 * @returns The updated energy value after regeneration
 */
const regenerateEnergy = (
  currentEnergy: number,
  elapsedTimeInSeconds: number,
  level: number = 1,
  upgrades: number = 0,
  maxCapacity?: number
): number => {
  const regenRate = calculateRegenRate(level, upgrades);
  const energyGained = regenRate * elapsedTimeInSeconds;
  
  // If maxCapacity wasn't provided, calculate it
  const actualMaxCapacity = maxCapacity || calculateEnergyCapacity(level, upgrades);
  
  return Math.min(actualMaxCapacity, currentEnergy + energyGained);
};

export const chronoEnergySystem = {
  BASE_ENERGY_CAPACITY,
  BASE_ENERGY_REGEN_RATE,
  BASE_ACTION_COST,
  calculateEnergyCapacity,
  calculateRegenRate,
  calculateActionCost,
  hasEnoughEnergy,
  consumeEnergy,
  regenerateEnergy
};

export default chronoEnergySystem;
