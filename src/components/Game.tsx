import React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../hooks/useAppDispatch';
import GameBoard from './GameBoard';
import ChronoEnergyBar from './ChronoEnergyBar';
import GameStats from './GameStats';
import GameControls from './GameControls';
import TimeParticles from './TimeParticles';

const GameContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const GameTitle = styled.h1`
  color: white;
  text-align: center;
  margin-bottom: 20px;
  font-size: 3.5rem;
  text-shadow: 0 0 10px rgba(77, 150, 255, 0.8), 0 0 20px rgba(77, 150, 255, 0.6);
  
  span {
    color: #5CE1E6;
  }
`;

const GamePanel = styled.div`
  background-color: rgba(10, 20, 40, 0.8);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  margin-bottom: 30px;
`;

const GameDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin-bottom: 30px;
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const GameFooter = styled.div`
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  margin-top: 30px;
  font-size: 0.9rem;
`;

const Game: React.FC = () => {
  // Game state is managed by Redux and used by child components
  useAppSelector(state => state.game);
  
  return (
    <GameContainer>
      <TimeParticles />
      <GameTitle>
        Echoes of <span>Eternity</span>
      </GameTitle>
      
      <GameDescription>
        Manipulate time fragments to solve patterns and restore the flow of time.
        Use your Chrono-Energy wisely to move and rotate fragments, creating patterns 
        that resolve temporal anomalies.
      </GameDescription>
      
      <GamePanel>
        <GameStats />
        <ChronoEnergyBar />
        <GameControls />
      </GamePanel>
      
      <GameBoard />
      
      <GameFooter>
        Echoes of Eternity v1.0 | A timeless puzzle experience
      </GameFooter>
    </GameContainer>
  );
};

export default Game;
