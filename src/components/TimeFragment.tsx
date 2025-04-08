import React from 'react';
import styled from 'styled-components';
import { TimeFragment as TimeFragmentType } from '../types/game';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { rotateTimeFragment, updateTimeFragment } from '../store/gameSlice';
import chronoEnergySystem from '../systems/chronoEnergySystem';

interface TimeFragmentProps {
  fragment: TimeFragmentType;
  index: number;
  chronoEnergy: number;
  level: number;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

const TimeFragmentContainer = styled.div<{
  $color: string;
  $rotation: number;
  $pattern: string;
  $isSelected: boolean;
  $solved: boolean;
}>`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: ${props => props.$pattern === 'circle' ? '50%' : 
                  props.$pattern === 'triangle' ? '0' : 
                  props.$pattern === 'diamond' ? '0' : 
                  props.$pattern === 'hexagon' ? '10px' : '8px'};
  background-color: ${props => props.$color || '#4D96FF'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transform: rotate(${props => props.$rotation}deg);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: ${props => props.$isSelected 
    ? '0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px ' + props.$color 
    : props.$solved 
      ? '0 0 15px rgba(255, 255, 255, 0.5), 0 0 20px ' + props.$color
      : '0 0 10px rgba(255, 255, 255, 0.3)'};
  opacity: ${props => props.$solved ? 0.7 : 1};
  
  ${props => props.$pattern === 'triangle' && `
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  `}
  
  ${props => props.$pattern === 'diamond' && `
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  `}
  
  ${props => props.$pattern === 'hexagon' && `
    clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  `}
  
  ${props => props.$pattern === 'star' && `
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  `}
  
  &:hover {
    box-shadow: ${props => !props.$solved ? '0 0 25px rgba(255, 255, 255, 0.8), 0 0 35px ' + props.$color : ''};
  }
`;

const TypeIndicator = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  pointer-events: none;
`;

const RotateButton = styled.button`
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: white;
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const RotateClockwise = styled(RotateButton)`
  top: -10px;
  right: -10px;
`;

const RotateCounterClockwise = styled(RotateButton)`
  bottom: -10px;
  right: -10px;
`;

const TimeFragment: React.FC<TimeFragmentProps> = ({
  fragment,
  index,
  chronoEnergy,
  level,
  isSelected,
  onSelect
}) => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    onSelect(fragment.id);
  };

  const handleRotate = (degrees: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!chronoEnergySystem.hasEnoughEnergy(chronoEnergy, 'rotateFragment', level)) {
      // Not enough energy
      return;
    }
    
    // Calculate new rotation (0, 90, 180, 270)
    let newRotation = (fragment.rotation + degrees) % 360;
    if (newRotation < 0) newRotation += 360;
    
    dispatch(rotateTimeFragment({ 
      id: fragment.id, 
      rotation: newRotation as 0 | 90 | 180 | 270 
    }));
    
    // Deplete energy
    // Note: The actual energy depletion should be handled in a game effect
  };

  return (
    <TimeFragmentContainer
      $color={fragment.color || '#4D96FF'}
      $rotation={fragment.rotation || 0}
      $pattern={fragment.pattern || 'square'}
      $isSelected={isSelected}
      $solved={fragment.solved || false}
      onClick={handleClick}
    >
      <TypeIndicator>
        {fragment.type?.substring(0, 3).toUpperCase()}
      </TypeIndicator>
      
      {isSelected && !fragment.solved && (
        <>
          <RotateClockwise onClick={(e) => handleRotate(90, e)}>
            ⟳
          </RotateClockwise>
          <RotateCounterClockwise onClick={(e) => handleRotate(-90, e)}>
            ⟲
          </RotateCounterClockwise>
        </>
      )}
    </TimeFragmentContainer>
  );
};

export default TimeFragment;
