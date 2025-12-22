
import React from 'react';

interface MoviePosterToggleProps {
  value: 'flyer' | 'premiere' | 'mix';
  onChange: (value: 'flyer' | 'premiere' | 'mix') => void;
}

export const MoviePosterToggle: React.FC<MoviePosterToggleProps> = ({ value, onChange }) => {
  return (
    <div>
        <label className="font-bold text-slate-700">Select Poster Style:</label>
        <div className="mt-2 grid grid-cols-3 gap-2">
            <button
                onClick={() => onChange('flyer')}
                className={`py-2 px-1 text-center font-bold sketch-button transition-all duration-200 text-sm ${
                    value === 'flyer' ? 'bg-crayon-violet text-white' : 'bg-white text-slate-600'
                }`}
            >
                Flyer Style
            </button>
            <button
                onClick={() => onChange('premiere')}
                className={`py-2 px-1 text-center font-bold sketch-button transition-all duration-200 text-sm ${
                    value === 'premiere' ? 'bg-crayon-violet text-white' : 'bg-white text-slate-600'
                }`}
            >
                Premiere Mockup
            </button>
            <button
                onClick={() => onChange('mix')}
                className={`py-2 px-1 text-center font-bold sketch-button transition-all duration-200 text-sm ${
                    value === 'mix' ? 'bg-crayon-violet text-white' : 'bg-white text-slate-600'
                }`}
            >
                Mix of Both
            </button>
        </div>
    </div>
  );
};
