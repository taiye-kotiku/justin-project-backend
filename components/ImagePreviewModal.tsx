

import React, { useEffect, useState } from 'react';
import { GeneratedImage } from '../types';
import { SocialShareButtons } from './SocialShareButtons';

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

interface ImagePreviewModalProps {
  preview: { image: GeneratedImage; index: number } | null;
  onClose: () => void;
  onCaptionChange: (index: number, newCaption: string) => void;
  onDownload: (image: GeneratedImage) => void;
  onGenerateVideo: (image: GeneratedImage, style?: string) => void;
  isGeneratingVideo: boolean;
  onGenerateMockup: (image: GeneratedImage) => void;
  isLoading: boolean;
  onColorItIn: (image: GeneratedImage) => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ preview, onClose, onCaptionChange, onDownload, onGenerateVideo, isGeneratingVideo, onGenerateMockup, isLoading, onColorItIn }) => {
  const [captionCopied, setCaptionCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (preview) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setCaptionCopied(false); // Reset copied state when new image is shown
    }
    
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [preview, onClose]);
  
  const handleCopyCaption = () => {
      if (preview?.image.caption) {
          navigator.clipboard.writeText(preview.image.caption);
          setCaptionCopied(true);
          setTimeout(() => setCaptionCopied(false), 2500);
      }
  };

  if (!preview) return null;
  const { image, index } = preview;

  return (
    <div 
        className="fixed inset-0 bg-slate-900 bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300" 
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="relative bg-white sketch-border sketch-shadow max-w-4xl w-full max-h-[95vh] flex flex-col md:flex-row animate-[slide-up_0.3s_ease-out]" 
        onClick={e => e.stopPropagation()}
      >
        <style>{`
          @keyframes slide-up {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}</style>
        
        <div className="p-4 flex-grow overflow-auto flex justify-center items-center min-h-0 md:w-2/3">
            <img 
                src={`data:${image.mimeType};base64,${image.base64}`} 
                alt="Full-size preview of coloring page" 
                className="w-auto h-auto max-w-full max-h-full object-contain"
            />
        </div>
        
        <div className="flex-shrink-0 flex flex-col justify-between gap-4 p-4 bg-amber-50 border-t-4 md:border-t-0 md:border-l-4 border-slate-800 md:w-1/3 overflow-y-auto">
           <div>
             <h3 className="font-header text-lg text-slate-700 mb-2">Social Media Caption <span className="text-xs font-normal text-slate-500">(Editable)</span></h3>
              <textarea
                value={image.caption}
                onChange={(e) => onCaptionChange(index, e.target.value)}
                className="w-full text-slate-800 whitespace-pre-wrap text-sm h-48 md:h-60 p-1 bg-white/50 resize-none focus:outline-none focus:ring-1 focus:ring-amber-400 rounded-sm"
                aria-label="Editable social media caption"
              />
           </div>
           <div className="flex flex-col items-center gap-3">
             <button
                onClick={handleCopyCaption}
                className="w-full bg-crayon-teal text-slate-800 font-header py-2 px-5 sketch-button interactive-wiggle-hover flex items-center justify-center"
              >
                {captionCopied ? <CheckIcon /> : <CopyIcon />}
                {captionCopied ? 'Copied!' : 'Copy Caption'}
              </button>
             <div className="flex flex-col items-center gap-2 w-full">
                <button
                    onClick={() => onDownload(image)}
                    className="w-full bg-crayon-emerald text-slate-800 font-header py-2 px-4 sketch-button interactive-wiggle-hover flex items-center justify-center"
                >
                    <DownloadIcon />
                    Download
                </button>
                <SocialShareButtons 
                    image={image} 
                    onDownload={onDownload} 
                    onGenerateVideo={onGenerateVideo} 
                    isGeneratingVideo={isGeneratingVideo}
                    onGenerateMockup={onGenerateMockup}
                    isLoading={isLoading}
                    onColorItIn={onColorItIn}
                />
              </div>
           </div>
        </div>
        
        <button 
            onClick={onClose} 
            className="absolute -top-4 -right-4 bg-crayon-rose text-white rounded-full p-2 transition-all sketch-button interactive-wiggle-hover border-white"
            aria-label="Close preview"
        >
            <CloseIcon />
        </button>
      </div>
    </div>
  );
};
