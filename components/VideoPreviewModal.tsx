import React, { useEffect } from 'react';
import { VideoShareButtons } from './VideoShareButtons';

interface VideoPreviewModalProps {
  videoUrl: string | null;
  videoBlob: Blob | null;
  caption: string | null;
  onCaptionChange: (newCaption: string) => void;
  onClose: () => void;
  error: string | null;
}

export const VideoPreviewModal: React.FC<VideoPreviewModalProps> = ({ videoUrl, videoBlob, caption, onCaptionChange, onClose, error }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [onClose]);

    if (!videoUrl && !error) return null;

    return (
        <div 
            className="fixed inset-0 bg-slate-900 bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50 p-4" 
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <style>{`
              @keyframes slide-up {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
            `}</style>
            <div className="relative bg-white sketch-border sketch-shadow max-w-md w-full flex flex-col animate-[slide-up_0.3s_ease-out] max-h-[95vh]" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-header text-colored-in p-4 border-b-2 border-dashed border-slate-300 text-center">Your Animated Page!</h2>
                
                <div className="p-4 flex-grow flex justify-center items-center bg-slate-100/50 min-h-0">
                    {error ? (
                        <div className="text-red-600 bg-red-100 p-4 sketch-border text-center font-bold">{error}</div>
                    ) : (
                        <video src={videoUrl!} controls autoPlay loop className="w-full h-auto rounded-md" />
                    )}
                </div>
                
                <div className="flex-shrink-0 flex flex-col p-4 gap-3 overflow-y-auto">
                   {caption ? (
                    <div className="bg-amber-50 p-3 rounded-lg sketch-border border-2 border-amber-200 relative w-full">
                        <h3 className="font-header text-md text-slate-700 mb-1.5">Your Social Media Caption! <span className="text-xs font-normal text-slate-500">(Editable)</span></h3>
                         <textarea
                            value={caption}
                            onChange={(e) => onCaptionChange(e.target.value)}
                            className="w-full text-slate-800 whitespace-pre-wrap text-sm leading-snug h-28 p-1 bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-amber-400 rounded-sm"
                            aria-label="Editable video caption"
                        />
                    </div>
                   ) : (
                    <div className="text-center p-3">
                      <p className="font-header text-slate-500 animate-pulse">Writing your caption...</p>
                    </div>
                   )}
                  <VideoShareButtons videoBlob={videoBlob} caption={caption} videoUrl={videoUrl} />
                </div>

                 <div className="p-4 border-t-2 border-dashed border-slate-300 flex justify-end">
                    <button onClick={onClose} className="bg-crayon-rose text-white font-header py-2 px-6 sketch-button interactive-wiggle-hover">Close</button>
                </div>
            </div>
        </div>
    );
};