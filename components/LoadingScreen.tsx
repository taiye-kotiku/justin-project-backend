import React, { useState, useEffect, useRef } from 'react';

const funMessages = [
  "Trying to hold the pencil right...",
  "Consulting the squirrels for artistic advice...",
  "Warming up the crayons with our breath...",
  "Adding extra tail wags to the drawing...",
  "Making sure the ears are perfectly floppy...",
  "Sniffing out the best colors...",
  "Taking a quick nap to refuel creativity...",
  "Translating your theme into 'Bark'...",
  "Sharpening our claws... I mean, pencils.",
  "Digging for inspiration...",
  "Ensuring maximum cuteness in every line...",
  "This is harder than chasing my own tail!",
];

// Paw print SVG component using the path from the app's background style
const PawPrintIcon: React.FC = () => (
  <svg
    viewBox="20 20 80 80" // Adjusted viewBox to better center the complex paw shape
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <path d="M50 85 C 30 95, 25 70, 40 60 Q 50 50, 60 60 C 75 70, 70 95, 50 85 Z M35 52 C 28 58, 28 42, 35 38 C 42 34, 48 42, 42 52 Z M50 42 C 43 48, 43 32, 50 28 C 57 24, 63 32, 57 42 Z M65 52 C 58 58, 58 42, 65 38 C 72 34, 78 42, 72 52 Z M80 65 C 73 71, 73 55, 80 51 C 87 47, 93 55, 87 65 Z" />
  </svg>
);


interface PawPrint {
  id: number;
  x: number;
  y: number;
  rotation: number;
  size: number;
}

const PawPrintsAnimation: React.FC = () => {
  const [prints, setPrints] = useState<PawPrint[]>([]);
  const nextId = useRef(0);
  
  useEffect(() => {
    // Start with a few prints so it's not empty
    const initialPrints: PawPrint[] = Array.from({ length: 3 }).map(() => ({
      id: nextId.current++,
      x: Math.random() * 85,
      y: Math.random() * 85,
      rotation: Math.random() * 360 - 180,
      size: Math.random() * 15 + 25,
    }));
    setPrints(initialPrints);

    const interval = setInterval(() => {
      const newPrint: PawPrint = {
        id: nextId.current++,
        x: Math.random() * 85, // % of width (0-85 to stay inside)
        y: Math.random() * 85, // % of height
        rotation: Math.random() * 360 - 180, // -180 to 180 degrees
        size: Math.random() * 15 + 25, // size in pixels, from 25 to 40
      };
      
      setPrints(currentPrints => {
        const updatedPrints = [...currentPrints, newPrint];
        // Cap the number of prints on screen to avoid clutter
        if (updatedPrints.length > 12) { 
          return updatedPrints.slice(1);
        }
        return updatedPrints;
      });
    }, 400); // Add a new print every 400ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-40 h-40 overflow-hidden">
      <style>{`
        @keyframes paw-fade-in {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 0.7; transform: scale(1); }
        }
        .paw-print-instance {
          position: absolute;
          color: #a1a1aa; /* zinc-400 */
          animation: paw-fade-in 0.5s ease-out forwards;
          will-change: opacity, transform;
        }
      `}</style>
      {prints.map(print => (
        <div
          key={print.id}
          className="paw-print-instance"
          style={{
            left: `${print.x}%`,
            top: `${print.y}%`,
            transform: `rotate(${print.rotation}deg)`,
            width: `${print.size}px`,
            height: `${print.size}px`,
          }}
        >
          <PawPrintIcon />
        </div>
      ))}
    </div>
  );
};


interface LoadingScreenProps {
  statusMessage: string;
  progress?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ statusMessage, progress }) => {
  const [funMessage, setFunMessage] = useState(funMessages[0]);

  useEffect(() => {
    let intervalId: number | undefined;

    if (statusMessage.includes('Creating')) {
      // Immediately set a random message so it doesn't start with the default
      setFunMessage(funMessages[Math.floor(Math.random() * funMessages.length)]);
      
      intervalId = window.setInterval(() => {
        setFunMessage(prevMessage => {
          let newMessage = prevMessage;
          // Ensure we get a new message
          while (newMessage === prevMessage) {
            newMessage = funMessages[Math.floor(Math.random() * funMessages.length)];
          }
          return newMessage;
        });
      }, 2800); // Change message every 2.8 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [statusMessage]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 bg-amber-50/50">
        <PawPrintsAnimation />
        <p className="mt-4 text-slate-800 font-bold font-header text-xl">{statusMessage || 'Getting things ready...'}</p>
        
        {statusMessage.includes('Creating') && (
            <p className="mt-1 text-slate-600 italic h-10">"{funMessage}"</p>
        )}
        
        {typeof progress === 'number' && (
            <>
                <div className="w-full max-w-sm bg-slate-200 sketch-border mt-4 h-8 p-1 overflow-hidden">
                    <div 
                        className="bg-teal-500 h-full transition-all duration-200 ease-linear"
                        style={{ 
                            width: `${progress}%`,
                            borderRadius: '0.4rem 0.3rem 0.5rem 0.2rem/0.2rem 0.4rem 0.3rem 0.5rem',
                        }}
                    ></div>
                </div>
                <p className="text-sm text-slate-500 font-bold font-header mt-2 w-16 h-6 text-center">
                    {Math.floor(progress)}%
                </p>
            </>
        )}
    </div>
  );
};