import React from 'react';

const CrayonTitle: React.FC<{ text: string }> = ({ text }) => {
  const colors = [
    'text-crayon-rose',
    'text-crayon-amber',
    'text-crayon-emerald',
    'text-crayon-sky',
    'text-crayon-teal',
    'text-crayon-violet',
    'text-crayon-fuchsia',
  ];

  // A simple seeded "random" function to keep transformations consistent across renders.
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  return (
    <h1 className="text-4xl sm:text-5xl md:text-6xl font-header tracking-tight whitespace-nowrap">
      {text.split('').map((char, index) => {
        const style = {
          display: 'inline-block',
          transform: `rotate(${(seededRandom(index) - 0.5) * 8}deg) translateY(${(seededRandom(index * 2) - 0.5) * 4}px)`,
        };
        return (
          <span key={index} style={style} className={`crayon-title-letter ${colors[index % colors.length]}`}>
            {char}
          </span>
        );
      })}
    </h1>
  );
};


export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="flex justify-center items-center gap-3">
        <CrayonTitle text="dogcoloringbooks.com" />
      </div>
      <p className="mt-4 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-bold">
        Turn photos of your beloved pet(s) into unique, themed coloring pages in just a few clicks!
      </p>
    </header>
  );
};