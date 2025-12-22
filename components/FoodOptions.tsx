
import React from 'react';

interface FoodOptionsProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  onShuffle: () => void;
  isRandomMode: boolean;
  onRandomModeChange: (isRandom: boolean) => void;
}

const ShuffleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
);

export const FoodOptions: React.FC<FoodOptionsProps> = ({ value, onChange, suggestions, onShuffle, isRandomMode, onRandomModeChange }) => {
  const isInputDisabled = isRandomMode;

  return (
    <div className="flex flex-col gap-3">
        <button
            onClick={() => onRandomModeChange(!isRandomMode)}
            className={`w-full py-2 px-3 text-center font-bold sketch-button transition-all duration-200 text-sm flex items-center justify-center gap-1.5 ${
                isRandomMode ? 'bg-amber-500 text-slate-900' : 'bg-white text-slate-600 hover:bg-amber-100'
            }`}
        >
            <ShuffleIcon />
            Randomize Foods ✨
        </button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-dashed border-slate-300"></div>
          <span className="flex-shrink mx-2 text-slate-400 font-bold text-xs">OR</span>
          <div className="flex-grow border-t border-dashed border-slate-300"></div>
        </div>
        
        <div className={isInputDisabled ? 'opacity-50 pointer-events-none' : ''}>
            <div className="flex justify-between items-center mb-2">
                <label htmlFor="food-select" className="font-bold text-slate-700">Choose a Meal:</label>
                <button 
                    onClick={onShuffle}
                    className="flex items-center gap-1.5 text-sm font-bold sketch-button bg-white text-slate-600 px-2 py-1 hover:bg-amber-100"
                    disabled={isInputDisabled}
                >
                    <ShuffleIcon />
                    Shuffle
                </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
                {suggestions.map(food => (
                     <button
                        key={food}
                        onClick={() => onChange(food)}
                        disabled={isInputDisabled}
                        className={`py-2 px-1 text-center font-bold sketch-button transition-all duration-200 text-xs ${
                            value === food && !isInputDisabled ? 'bg-amber-500 text-slate-900' : 'bg-white text-slate-600'
                        }`}
                    >
                        {food}
                    </button>
                ))}
            </div>
        </div>
        <div className={isInputDisabled ? 'opacity-50 pointer-events-none' : ''}>
            <label htmlFor="custom-food-input" className="font-bold text-slate-700">Or Create Your Own Feast:</label>
            <input
                id="custom-food-input"
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder="e.g., A pile of pup cups"
                disabled={isInputDisabled}
                className="mt-1 w-full px-3 py-2 bg-white sketch-input focus:ring-2 focus:ring-amber-400 focus:border-amber-500 transition-shadow outline-none"
            />
        </div>
    </div>
  );
};
