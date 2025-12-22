import React from 'react';

interface NumberOfImagesSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export const NumberOfImagesSlider: React.FC<NumberOfImagesSliderProps> = ({
  value,
  onChange,
  min = 1,
  max = 25,
}) => {
  return (
    <div className="flex flex-col space-y-2 bg-slate-50/50 p-3 sketch-border">
      <div className="flex justify-between items-center">
        <label htmlFor="image-count-slider" className="font-bold text-slate-700">
          Number of Pages
        </label>
        <span className="font-header text-teal-800 text-lg bg-teal-200 sketch-border border-2 border-teal-800 rounded-md px-3 py-1">{value}</span>
      </div>
      <input
        id="image-count-slider"
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-teal-500"
      />
    </div>
  );
};