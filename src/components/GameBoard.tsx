import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { 
  updateTimeFragment, 
  depleteChronoEnergy,
  incrementScore,
  incrementPuzzlesSolved
} from '../store/gameSlice';
import { TimeFragment as TimeFragmentType } from '../types/game';
import TimeFragment from './TimeFragment';
import chronoEnergySystem from '../systems/chronoEnergySystem';
import puzzleSolvingSystem from '../systems/puzzleSolvingSystem';

const BoardContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 0 20px rgba(77, 150, 255, 0.5);
  margin: 20px auto;
  max-width: 800px;
`;

const BoardGrid = styled.div<{ width: number; height: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.width}, 100px);
  grid-template-rows: repeat(${props => props.height}, 100px);
  gap: 10px;
  padding: 15px;
  background-color: rgba(10, 20, 50, 0.5);
  border-radius: 5px;
  margin: 20px 0;
`;

const GridCell = styled.div<{ $isHighlighted: boolean }>`
  width: 100px;
  height: 100px;
  border: 1px dashed ${props => props.$isHighlighted ? '#ffffff' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.$isHighlighted ? 'rgba(77, 150, 255, 0.2)' : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(77, 150, 255, 0.1);
  }
`;

const FragmentWrapper = styled.div<{ x: number, y: number }>`
  grid-column: ${props => props.x + 1};
  grid-row: ${props => props.y + 1};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const PatternMatchNotification = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px 30px;
  border-radius: 10px;
  font-size: 24px;
  font-weight: bold;
  z-index: 10;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 0.5s ease;
  pointer-events: none;
  box-shadow: 0 0 30px rgba(77, 150, 255, 0.8);
  text-align: center;
`;

const GameBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { board, timeFragments, chronoEnergy, level } = useAppSelector(state => state.game);
  const [selectedFragmentId, setSelectedFragmentId] = useState<number | null>(null);
  const [highlightedCell, setHighlightedCell] = useState<{ x: number, y: number } | null>(null);
  const [patternNotification, setPatternNotification] = useState<{ visible: boolean, text: string }>({ 
    visible: false, 
    text: '' 
  });
  
  // Generate the grid cells for the board
  const renderGridCells = () => {
    const cells = [];
    
    for (let y = 0; y < board.height; y++) {
      for (let x = 0; x < board.width; x++) {
        const isHighlighted = highlightedCell?.x === x && highlightedCell?.y === y;
        
        cells.push(
          <GridCell
            key={`cell-${x}-${y}`}
            $isHighlighted={isHighlighted}
            onClick={() => handleCellClick(x, y)}
          />
        );
      }
    }
    
    return cells;
  };
  
  // Handle selecting a fragment
  const handleFragmentSelect = (id: number) => {
    setSelectedFragmentId(id === selectedFragmentId ? null : id);
  };
  
  // Handle clicking on a grid cell to move a fragment
  const handleCellClick = (x: number, y: number) => {
    if (selectedFragmentId === null) return;
    
    // Find the selected fragment
    const fragment: TimeFragmentType | undefined = timeFragments.find(f => f.id === selectedFragmentId);
    if (!fragment) return;
    
    // Check if energy is available for movement
    if (!chronoEnergySystem.hasEnoughEnergy(chronoEnergy, 'moveFragment', level)) {
      // Not enough energy - show notification?
      return;
    }
    
    // Check if cell is already occupied
    const isCellOccupied = timeFragments.some(f => 
      f.id !== selectedFragmentId && f.x === x && f.y === y
    );
    
    if (isCellOccupied) return;
    
    // Calculate energy cost
    const cost = chronoEnergySystem.calculateActionCost('moveFragment', level);
    
    // Update fragment position
    const updatedFragment = { ...fragment, x, y };
    dispatch(updateTimeFragment(updatedFragment));
    
    // Deplete energy
    dispatch(depleteChronoEnergy(cost));
    
    // Deselect the fragment
    setSelectedFragmentId(null);
    
    // Check for pattern matches
    checkForPatternMatches();
  };
  
  // Check for pattern matches after moving or rotating fragments
  const checkForPatternMatches = useCallback(() => {
    // Get unsolved fragments
    const unsolvedFragments = timeFragments.filter(f => !f.solved);
    
    // Check for pattern matches
    const match = puzzleSolvingSystem.checkForPatternMatch(unsolvedFragments);
    
    if (match) {
      const { pattern, fragments } = match;
      
      // Mark these fragments as solved
      fragments.forEach(fragment => {
        dispatch(updateTimeFragment({ ...fragment, solved: true }));
      });
      
      // Add points to score
      dispatch(incrementScore(pattern.points));
      
      // Increment puzzles solved
      dispatch(incrementPuzzlesSolved());
      
      // Show notification
      setPatternNotification({
        visible: true,
        text: `${pattern.name} Solved! +${pattern.points} points`
      });
      
      // Hide notification after a delay
      setTimeout(() => {
        setPatternNotification(prev => ({ ...prev, visible: false }));
      }, 3000);
    }
  }, [timeFragments, dispatch, setPatternNotification]);
  
  // Show the potential cell when a fragment is selected
  useEffect(() => {
    if (selectedFragmentId !== null) {
      const fragment = timeFragments.find(f => f.id === selectedFragmentId);
      if (fragment) {
        setHighlightedCell({ x: fragment.x, y: fragment.y });
      }
    } else {
      setHighlightedCell(null);
    }
  }, [selectedFragmentId, timeFragments]);
  
  // Check for pattern matches whenever fragments change
  useEffect(() => {
    if (timeFragments.length > 0) {
      checkForPatternMatches();
    }
  }, [timeFragments, checkForPatternMatches]);
  
  return (
    <BoardContainer>
      <BoardGrid width={board.width} height={board.height}>
        {renderGridCells()}
        
        {/* Render time fragments */}
        {timeFragments.map((fragment, index) => (
          <FragmentWrapper 
            key={fragment.id} 
            x={fragment.x} 
            y={fragment.y}
          >
            <TimeFragment
              fragment={fragment}
              index={index}
              chronoEnergy={chronoEnergy}
              level={level}
              isSelected={selectedFragmentId === fragment.id}
              onSelect={handleFragmentSelect}
            />
          </FragmentWrapper>
        ))}
      </BoardGrid>
      
      <PatternMatchNotification $isVisible={patternNotification.visible}>
        {patternNotification.text}
      </PatternMatchNotification>
    </BoardContainer>
  );
};

export default GameBoard;
