import React from 'react';

const FilmIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-slate-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
    </svg>
);


interface VideoLoadingModalProps {
    statusMessage: string;
    progress: number;
}

export const VideoLoadingModal: React.FC<VideoLoadingModalProps> = ({ statusMessage, progress }) => {
    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex justify-center items-center z-[60] p-4 animate-[fade-in_0.3s_ease-out]">
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
            <div className="bg-amber-50/80 sketch-border sketch-shadow p-8 rounded-lg text-center max-w-md w-full">
                <FilmIcon />
                <h2 className="text-2xl font-header text-colored-in mt-4">Bringing Your Page to Life!</h2>
                <p className="text-slate-600 mt-2 font-bold">This can take a few minutes. Please wait while the magic happens...</p>
                <p className="mt-4 text-slate-800 font-bold font-header text-lg h-12 italic">"{statusMessage}"</p>

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
            </div>
        </div>
    );
};