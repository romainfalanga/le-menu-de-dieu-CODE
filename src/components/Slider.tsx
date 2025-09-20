import React from 'react';

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min,
  max,
  step,
  onChange,
  className = ''
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.target.value));
  };

  return (
    <div className="relative">
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
        className={`appearance-none bg-transparent cursor-pointer slider w-full ${className}`}
        style={{
          background: `linear-gradient(to right, 
            #3b82f6 0%, 
            #3b82f6 ${((value - min) / (max - min)) * 100}%, 
            #e5e7eb ${((value - min) / (max - min)) * 100}%, 
            #e5e7eb 100%)`,
          borderRadius: '9999px',
          height: '8px'
        }}
      />
      {/* Track background avec gradient */}
      <div 
        className="absolute top-1/2 left-0 right-0 h-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full pointer-events-none transform -translate-y-1/2 shadow-inner"
        style={{ zIndex: -1 }}
      />
      {/* Progress bar avec gradient */}
      <div 
        className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full pointer-events-none transform -translate-y-1/2 shadow-lg"
        style={{ 
          width: `${((value - min) / (max - min)) * 100}%`,
          zIndex: -1
        }}
      />
    </div>
  );
};