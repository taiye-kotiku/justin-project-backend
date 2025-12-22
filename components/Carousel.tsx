import React, { useState, useEffect } from 'react';
import { GeneratedImage } from '../types';
import { SocialShareButtons } from './SocialShareButtons';

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);


interface CarouselProps {
    images: GeneratedImage[];
    onGenerateVideo?: (image: GeneratedImage) => void;
    isGeneratingVideo?: boolean;
}

export const Carousel: React.FC<CarouselProps> = ({ images, onGenerateVideo, isGeneratingVideo }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // When the images array changes (e.g., a new generation), reset to the first slide.
    useEffect(() => {
        setCurrentIndex(0);
    }, [images]);

    const handlePrev = () => {
        const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const handleNext = () => {
        const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const handleDownloadCurrent = () => {
        const image = images[currentIndex];
        if (!image) return;
        const link = document.createElement('a');
        link.href = `data:${image.mimeType};base64,${image.base64}`;
        const extension = image.mimeType.split('/')[1] || 'png';
        link.download = `colored-image-${currentIndex + 1}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    // Use a key on the image to force a re-render with animation on change
    const currentImage = images[currentIndex];
    
    return (
        <div className="w-full h-full flex flex-col items-center justify-between gap-4 relative">
            <div className="w-full flex-grow relative overflow-hidden flex items-center justify-center">
                 {currentImage && (
                    <img
                        key={currentIndex}
                        src={`data:${currentImage.mimeType};base64,${currentImage.base64}`}
                        alt={`Colored result ${currentIndex + 1}`}
                        className="max-w-full max-h-full object-contain rounded-md sketch-border bg-white animate-[fade-in_0.3s]"
                    />
                 )}
            </div>
            
            {currentImage && (
                 <div className="flex-shrink-0 flex flex-col items-center justify-center gap-2 w-full max-w-sm">
                    <div className="flex items-center justify-between w-full px-4">
                        <button 
                            onClick={handlePrev} 
                            className="bg-white p-2 rounded-full sketch-button disabled:opacity-50"
                            disabled={images.length <= 1}
                            aria-label="Previous image"
                        >
                            <ArrowLeftIcon />
                        </button>
                        <span className="font-bold text-slate-500 text-sm">
                            {currentIndex + 1} / {images.length}
                        </span>
                        <button 
                            onClick={handleNext} 
                            className="bg-white p-2 rounded-full sketch-button disabled:opacity-50"
                            disabled={images.length <= 1}
                            aria-label="Next image"
                        >
                            <ArrowRightIcon />
                        </button>
                    </div>
                    <SocialShareButtons 
                        image={currentImage}
                        onDownload={handleDownloadCurrent}
                        onGenerateVideo={onGenerateVideo}
                        isGeneratingVideo={isGeneratingVideo}
                    />
                </div>
            )}
        </div>
    );
};
