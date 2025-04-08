import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { 
  startGame, 
  pauseGame, 
  resetGame, 
  incrementLevel 
} from '../store/gameSlice';
import timeFragmentSystem from '../systems/timeFragmentSystem';
import { addTimeFragment } from '../store/gameSlice';
import HelpModal from './HelpModal';

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
  
  background-color: ${props => 
    props.$variant === 'primary' ? '#4D96FF' : 
    props.$variant === 'danger' ? '#FF6B6B' : 
    '#5CE1E6'};
  
  color: white;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    background-color: #888;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    opacity: 0.6;
  }
`;

const GameStatus = styled.div<{ $isPlaying: boolean }>`
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
  background-color: ${props => props.$isPlaying ? 'rgba(92, 225, 230, 0.2)' : 'rgba(255, 107, 107, 0.2)'};
  color: ${props => props.$isPlaying ? '#5CE1E6' : '#FF6B6B'};
`;

const GameControls: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isPlaying, board, level, timeFragments } = useAppSelector(state => state.game);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  
  const handleStartGame = () => {
    dispatch(startGame());
    
    // If no time fragments exist, generate some for the first level
    if (timeFragments.length === 0) {
      generateTimeFragmentsForLevel();
    }
  };
  
  const handlePauseGame = () => {
    dispatch(pauseGame());
  };
  
  const handleResetGame = () => {
    dispatch(resetGame());
  };
  
  const handleNextLevel = () => {
    dispatch(incrementLevel());
    generateTimeFragmentsForLevel(level + 1);
  };
  
  const generateTimeFragmentsForLevel = (currentLevel = level) => {
    // Clear existing time fragments (handled by the reducer)
    
    // Generate new fragments for the level
    const fragments = timeFragmentSystem.generateTimeFragmentsForLevel(
      currentLevel,
      board.width,
      board.height
    );
    
    // Add each fragment to the state
    fragments.forEach(fragment => {
      dispatch(addTimeFragment(fragment));
    });
  };
  
  return (
    <ControlsContainer>
      <GameStatus $isPlaying={isPlaying}>
        Game Status: {isPlaying ? 'Playing' : 'Paused'}
      </GameStatus>
      
      <ButtonRow>
        {!isPlaying ? (
          <Button $variant="primary" onClick={handleStartGame}>
            {timeFragments.length === 0 ? 'Start Game' : 'Resume Game'}
          </Button>
        ) : (
          <Button $variant="secondary" onClick={handlePauseGame}>
            Pause Game
          </Button>
        )}
        
        <Button $variant="secondary" onClick={handleNextLevel} disabled={!isPlaying}>
          Next Level
        </Button>
        
        <Button $variant="danger" onClick={handleResetGame}>
          Reset Game
        </Button>
        
        <Button onClick={() => setHelpModalOpen(true)}>
          Help
        </Button>
      </ButtonRow>
      
      <HelpModal 
        isOpen={helpModalOpen} 
        onClose={() => setHelpModalOpen(false)} 
      />
    </ControlsContainer>
  );
};

export default GameControls;
