import React, { useEffect, useRef } from 'react';

const TimeParticles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Create floating time particles
    const container = containerRef.current;
    if (!container) return;
    
    // Clear any existing particles
    container.innerHTML = '';
    
    // Number of particles based on screen size
    const particleCount = Math.min(50, window.innerWidth / 20);
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('time-particle');
      
      // Random position
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      
      // Random size
      const size = 2 + Math.random() * 6;
      
      // Random color (blue or teal tones)
      const colors = ['#4D96FF', '#5CE1E6', '#6C4AB6', '#8D72E1'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Random animation delay
      const delay = Math.random() * 8;
      
      // Set styles
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = color;
      particle.style.opacity = (0.2 + Math.random() * 0.5).toString();
      particle.style.animationDelay = `${delay}s`;
      particle.style.animationDuration = `${8 + Math.random() * 12}s`;
      
      container.appendChild(particle);
    }
    
    // Clean up
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);
  
  return <div ref={containerRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: -1 }} />;
};

export default TimeParticles;
