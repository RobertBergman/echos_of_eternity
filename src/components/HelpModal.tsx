import React from 'react';
import styled from 'styled-components';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalOverlay = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${props => props.$isVisible ? 1 : 0};
  visibility: ${props => props.$isVisible ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const ModalContent = styled.div`
  background-color: rgba(10, 20, 40, 0.95);
  color: white;
  border-radius: 15px;
  padding: 30px;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 0 30px rgba(77, 150, 255, 0.5);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: transparent;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  
  &:hover {
    color: #5CE1E6;
  }
`;

const ModalTitle = styled.h2`
  color: #5CE1E6;
  text-align: center;
  margin-bottom: 20px;
  font-size: 2rem;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  color: #4D96FF;
  margin-bottom: 10px;
  font-size: 1.4rem;
`;

const List = styled.ul`
  padding-left: 20px;
  margin-bottom: 15px;
`;

const ListItem = styled.li`
  margin-bottom: 8px;
  line-height: 1.4;
`;

const PatternSection = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: rgba(77, 150, 255, 0.1);
  border-radius: 10px;
`;

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  // Close modal when clicking outside
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <ModalOverlay $isVisible={isOpen} onClick={handleOverlayClick}>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        
        <ModalTitle>How to Play Echoes of Eternity</ModalTitle>
        
        <Section>
          <p>Echoes of Eternity is a puzzle game where you manipulate time fragments to solve temporal patterns.</p>
        </Section>
        
        <Section>
          <SectionTitle>Game Objective</SectionTitle>
          <p>Your goal is to arrange time fragments on the board to form specific patterns that resolve temporal anomalies.</p>
        </Section>
        
        <Section>
          <SectionTitle>Getting Started</SectionTitle>
          <List>
            <ListItem>Click the "Start Game" button in the game controls area.</ListItem>
            <ListItem>This generates time fragments on the 6x6 game board.</ListItem>
          </List>
        </Section>
        
        <Section>
          <SectionTitle>Basic Mechanics</SectionTitle>
          
          <p><strong>Time Fragments:</strong></p>
          <List>
            <ListItem><strong>Type:</strong> past, present, future, paradox, void, or constant</ListItem>
            <ListItem><strong>Pattern:</strong> circle, square, triangle, diamond, hexagon, or star</ListItem>
            <ListItem><strong>Color:</strong> Various colors represent different fragments</ListItem>
            <ListItem><strong>Rotation:</strong> 0°, 90°, 180°, or 270°</ListItem>
          </List>
          
          <p><strong>Moving Fragments:</strong></p>
          <List>
            <ListItem>Click on a fragment to select it (it will glow).</ListItem>
            <ListItem>Click on an empty cell to move the fragment there.</ListItem>
            <ListItem>Moving costs Chrono-Energy.</ListItem>
          </List>
          
          <p><strong>Rotating Fragments:</strong></p>
          <List>
            <ListItem>Select a fragment by clicking on it.</ListItem>
            <ListItem>Use the rotation buttons that appear:
              <ul>
                <li>Top-right button: Rotate clockwise (90°)</li>
                <li>Bottom-right button: Rotate counter-clockwise (-90°)</li>
              </ul>
            </ListItem>
            <ListItem>Rotating costs Chrono-Energy.</ListItem>
          </List>
        </Section>
        
        <Section>
          <SectionTitle>Chrono-Energy</SectionTitle>
          <List>
            <ListItem>You start with 50 Chrono-Energy.</ListItem>
            <ListItem>Each action (moving or rotating fragments) depletes your energy.</ListItem>
            <ListItem>When energy is depleted, you can't perform more actions.</ListItem>
            <ListItem>Energy may be replenished when solving patterns.</ListItem>
          </List>
        </Section>
        
        <Section>
          <SectionTitle>Solving Patterns</SectionTitle>
          <p>To solve puzzles, arrange fragments to form these valid patterns:</p>
          
          <PatternSection>
            <p><strong>1. Chronological Sequence</strong> (100 points)</p>
            <List>
              <ListItem>Fragments: past → present → future</ListItem>
              <ListItem>Arrangement: Linear (horizontal or vertical)</ListItem>
              <ListItem>Rotation: All at 0°</ListItem>
            </List>
          </PatternSection>
          
          <PatternSection>
            <p><strong>2. Paradox Resolution</strong> (150 points)</p>
            <List>
              <ListItem>Fragments: paradox, constant, void</ListItem>
              <ListItem>Arrangement: Triangle</ListItem>
              <ListItem>Rotation: 90°, 180°, 270° respectively</ListItem>
            </List>
          </PatternSection>
          
          <PatternSection>
            <p><strong>3. Temporal Balance</strong> (50 points)</p>
            <List>
              <ListItem>Fragments: past, future</ListItem>
              <ListItem>Arrangement: Adjacent</ListItem>
              <ListItem>Rotation: Both at 180°</ListItem>
            </List>
          </PatternSection>
          
          <PatternSection>
            <p><strong>4. Time Loop</strong> (200 points)</p>
            <List>
              <ListItem>Fragments: past → present → future → past</ListItem>
              <ListItem>Arrangement: Square</ListItem>
              <ListItem>Rotation: 0°, 90°, 180°, 270° respectively</ListItem>
            </List>
          </PatternSection>
          
          <p>When you successfully form a pattern, the fragments will become slightly transparent, you'll receive points, and a notification will appear.</p>
        </Section>
        
        <Section>
          <SectionTitle>Game Controls</SectionTitle>
          <List>
            <ListItem><strong>Start/Resume Game:</strong> Begins or continues gameplay</ListItem>
            <ListItem><strong>Pause Game:</strong> Temporarily halts the game</ListItem>
            <ListItem><strong>Next Level:</strong> Advances to the next level with more fragments</ListItem>
            <ListItem><strong>Reset Game:</strong> Starts over from the beginning</ListItem>
            <ListItem><strong>Help:</strong> Shows this help screen</ListItem>
          </List>
        </Section>
        
        <Section>
          <SectionTitle>Strategy Tips</SectionTitle>
          <List>
            <ListItem>Observe fragment types carefully before planning your moves</ListItem>
            <ListItem>Consider both positioning and rotation when forming patterns</ListItem>
            <ListItem>Try to solve simpler patterns first to conserve energy</ListItem>
            <ListItem>Plan your moves efficiently to maximize your score with limited energy</ListItem>
          </List>
        </Section>
        
        <p>As you progress through levels, the game becomes more challenging with more fragments to manage. Good luck restoring the flow of time!</p>
      </ModalContent>
    </ModalOverlay>
  );
};

export default HelpModal;
