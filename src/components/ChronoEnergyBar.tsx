import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useAppSelector, useAppDispatch } from '../hooks/useAppDispatch';
import { replenishChronoEnergy } from '../store/gameSlice';
import chronoEnergySystem from '../systems/chronoEnergySystem';

const EnergyBarContainer = styled.div`
  width: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50px;
  padding: 5px;
  box-shadow: 0 0 10px rgba(77, 150, 255, 0.5);
  margin: 10px 0;
`;

const EnergyBarLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  color: #fff;
  font-weight: bold;
`;

const EnergyBarFill = styled.div<{ $width: number; $lowEnergy: boolean }>`
  height: 20px;
  width: ${props => props.$width}%;
  background: ${props => props.$lowEnergy 
    ? 'linear-gradient(90deg, #ff4d4d, #ff8c1a)' 
    : 'linear-gradient(90deg, #4D96FF, #5CE1E6)'
  };
  border-radius: 50px;
  transition: width 0.3s ease, background 0.5s ease;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0.1) 100%
    );
    background-size: 200% 100%;
    animation: pulse 1.5s infinite;
  }
  
  @keyframes pulse {
    0% {
      background-position: 100% 0%;
    }
    100% {
      background-position: -100% 0%;
    }
  }
`;

const ChronoEnergyBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { chronoEnergy, level, isPlaying } = useAppSelector(state => state.game);
  const lastUpdateTimeRef = useRef(Date.now());
  
  // Calculate max energy for current level
  const maxEnergy = chronoEnergySystem.calculateEnergyCapacity(level);
  
  // Calculate energy percentage
  const energyPercentage = Math.min(100, (chronoEnergy / maxEnergy) * 100);
  
  // Determine if energy is low (less than 20%)
  const isLowEnergy = energyPercentage < 20;
  
  // Regenerate energy over time if the game is active
  useEffect(() => {
    if (!isPlaying) return;
    
    const energyRegenInterval = setInterval(() => {
      const now = Date.now();
      const elapsedTimeInSeconds = (now - lastUpdateTimeRef.current) / 1000;
      lastUpdateTimeRef.current = now;
      
      if (chronoEnergy < maxEnergy) {
        const regenRate = chronoEnergySystem.calculateRegenRate(level);
        const energyGained = regenRate * elapsedTimeInSeconds;
        
        // Only dispatch if there's a meaningful amount of energy to add
        if (energyGained > 0.01) {
          dispatch(replenishChronoEnergy(energyGained));
        }
      }
    }, 1000); // Update every second
    
    return () => clearInterval(energyRegenInterval);
  }, [isPlaying, chronoEnergy, maxEnergy, level, dispatch]);
  
  // Reset the timer when the component mounts or game play state changes
  useEffect(() => {
    lastUpdateTimeRef.current = Date.now();
  }, [isPlaying]);
  
  return (
    <div>
      <EnergyBarLabel>
        <span>Chrono-Energy</span>
        <span>{Math.floor(chronoEnergy)} / {maxEnergy}</span>
      </EnergyBarLabel>
      
      <EnergyBarContainer>
        <EnergyBarFill 
          $width={energyPercentage} 
          $lowEnergy={isLowEnergy} 
        />
      </EnergyBarContainer>
    </div>
  );
};

export default ChronoEnergyBar;
