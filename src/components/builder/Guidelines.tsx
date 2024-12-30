import React from 'react';
import { useGuidelinesStore } from '../../store/useGuidelinesStore';

const Guidelines = () => {
  const { showGuidelines, guidelines } = useGuidelinesStore();
  
  console.log('Guidelines state:', { showGuidelines, guidelines });

  if (!showGuidelines) {
    console.log('Guidelines not showing - showGuidelines is false');
    return null;
  }

  return (
    <>
      {guidelines.vertical.map((position, index) => (
        <div
          key={`v-${index}`}
          className="guideline guideline-vertical"
          style={{
            left: `${position}px`,
          }}
        />
      ))}

      {guidelines.horizontal.map((position, index) => (
        <div
          key={`h-${index}`}
          className="guideline guideline-horizontal"
          style={{
            top: `${position}px`,
          }}
        />
      ))}
    </>
  );
};

export default Guidelines; 