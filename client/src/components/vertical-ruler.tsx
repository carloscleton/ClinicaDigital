import React from "react";

interface VerticalRulerProps {
  height?: number; // Height in pixels
  maxCm?: number; // Maximum centimeter value
  className?: string;
}

export default function VerticalRuler({ 
  height = 500, 
  maxCm = 20, 
  className = "" 
}: VerticalRulerProps) {
  // Calculate pixel per cm ratio
  const pixelsPerCm = height / maxCm;
  
  // Generate ruler markings
  const generateMarkings = () => {
    const markings = [];
    
    // Create markings for each millimeter
    for (let mm = 0; mm <= maxCm * 10; mm++) {
      const position = height - (mm * pixelsPerCm / 10);
      const isCm = mm % 10 === 0;
      const isHalfCm = mm % 5 === 0;
      
      // Determine marking length based on position type
      const markLength = isCm ? 12 : isHalfCm ? 8 : 4;
      
      // Add cm number labels
      if (isCm) {
        const cmValue = mm / 10;
        markings.push(
          <g key={`cm-${mm}`}>
            <line 
              x1={0} 
              y1={position} 
              x2={markLength} 
              y2={position} 
              stroke="black" 
              strokeWidth={isCm ? 1.5 : 1} 
            />
            <text 
              x={16} 
              y={position + 4} 
              fontSize="12" 
              textAnchor="start"
            >
              {cmValue}
            </text>
          </g>
        );
      } else {
        // Add regular mm markings
        markings.push(
          <line 
            key={`mm-${mm}`}
            x1={0} 
            y1={position} 
            x2={markLength} 
            y2={position} 
            stroke="black" 
            strokeWidth={isHalfCm ? 1.2 : 0.8} 
          />
        );
      }
    }
    
    return markings;
  };

  return (
    <div className={`relative ${className}`}>
      <svg 
        width="40" 
        height={height} 
        viewBox={`0 0 40 ${height}`} 
        className="border-r border-gray-400"
      >
        {/* Ruler background */}
        <rect x="0" y="0" width="40" height={height} fill="white" />
        
        {/* Ruler markings */}
        {generateMarkings()}
        
        {/* Ruler border */}
        <rect 
          x="0" 
          y="0" 
          width="40" 
          height={height} 
          stroke="black" 
          strokeWidth="1" 
          fill="none" 
        />
      </svg>
    </div>
  );
}