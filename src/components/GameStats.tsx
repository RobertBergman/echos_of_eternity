import React from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../hooks/useAppDispatch';

const StatsContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  padding: 15px;
  color: white;
  margin-bottom: 20px;
  box-shadow: 0 0 15px rgba(77, 150, 255, 0.3);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  background-color: rgba(77, 150, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(77, 150, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 5px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: white;
`;

const GameStats: React.FC = () => {
  const { level, score, puzzlesSolved } = useAppSelector(state => state.game);
  
  return (
    <StatsContainer>
      <StatsGrid>
        <StatItem>
          <StatLabel>Level</StatLabel>
          <StatValue>{level}</StatValue>
        </StatItem>
        
        <StatItem>
          <StatLabel>Score</StatLabel>
          <StatValue>{score}</StatValue>
        </StatItem>
        
        <StatItem>
          <StatLabel>Puzzles Solved</StatLabel>
          <StatValue>{puzzlesSolved}</StatValue>
        </StatItem>
      </StatsGrid>
    </StatsContainer>
  );
};

export default GameStats;
