
import React, { useState } from 'react';
import JSZip from 'jszip';
import { GeneratedImage } from '../types';
import { ImagePreviewModal } from './ImagePreviewModal';
import { SocialShareButtons } from './SocialShareButtons';
import { LoadingScreen } from './LoadingScreen';
import { generateTextPageAsImage } from '../utils/imageGenerator';

interface ResultDisplayProps {
  isLoading: boolean;
  statusMessage: string;
  error: string | null;
  generatedImages: GeneratedImage[] | null;
  progress: number;
  onCaptionChange: (index: number, newCaption: string) => void;
  isStoryMode: boolean;
  onStartStory: () => void;
  storyChoices: string[];
  onChoiceSelected: (choice: string) => void;
  isGeneratingChoices: boolean;
  petName: string;
  onGenerateVideo: (image: GeneratedImage, style?: string) => void;
  isGeneratingVideo: boolean;
  onGenerateMockup: (image: GeneratedImage) => void;
  onColorItIn: (image: GeneratedImage) => void;
}

const StoryChoices: React.FC<{ choices: string[]; onSelect: (choice: string) => void; isLoading: boolean; disabled: boolean }> = ({ choices, onSelect, isLoading, disabled }) => {
    if (isLoading) {
        return (
            <div className="w-full text-center p-4">
                <p className="font-header text-lg text-slate-600 animate-pulse">Thinking of what happens next...</p>
            </div>
        );
    }

    if (choices.length === 0) return null;

    return (
        <div className="w-full p-2 grid grid-cols-2 gap-3">
            {choices.map((choice, index) => (
                <button
                    key={index}
                    onClick={() => onSelect(choice)}
                    disabled={disabled}
                    className="w-full p-3 text-center rounded-lg border-2 transition-all duration-200 sketch-shadow-sm h-full interactive-wiggle-hover bg-crayon-sky-light border-sky-400 text-sky-900 font-bold disabled:bg-slate-200 disabled:text-slate-500 disabled:transform-none disabled:shadow-none"
                >
                    {choice}
                </button>
            ))}
        </div>
    );
};

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const Placeholder: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center bg-amber-50/50 rounded-lg p-4">
        <div 
          className="text-7xl animate-pulse-subtle" 
          style={{ filter: 'drop-shadow(3px 3px 0px #a1a1aa)' }} 
          role="img" 
          aria-label="Dog face emoji waiting for input"
        >
            🐶
        </div>
        <p className="mt-4 font-header text-2xl sm:text-3xl text-colored-in">Your Masterpiece Awaits!</p>
        <p className="mt-1 text-slate-500 font-bold">Fill in the details and let the magic begin.</p>
    </div>
);


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, statusMessage, error, generatedImages, progress, onCaptionChange, isStoryMode, onStartStory, storyChoices, onChoiceSelected, isGeneratingChoices, petName, onGenerateVideo, isGeneratingVideo, onGenerateMockup, onColorItIn }) => {
  const [previewingImage, setPreviewingImage] = useState<{ image: GeneratedImage; index: number } | null>(null);
  const [captionCopied, setCaptionCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadSingle = (image: GeneratedImage) => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = `data:${image.mimeType};base64,${image.base64}`;
    const extension = image.mimeType.split('/')[1] || 'png';
    link.download = `coloring-page.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = async () => {
    if (!generatedImages || generatedImages.length === 0 || isDownloading) return;

    setIsDownloading(true);
    try {
        const zip = new JSZip();

        // The image generation relies on a canvas, which needs the DOM.
        // We'll process each image sequentially to avoid overwhelming the browser.
        for (let i = 0; i < generatedImages.length; i++) {
            const image = generatedImages[i];
            const pageNum = i + 1;
            
            // Add the main coloring page image
            const extension = image.mimeType.split('/')[1] || 'png';
            zip.file(`Page-${pageNum}-Coloring.${extension}`, image.base64, { base64: true });
            
            // If there's story text, generate the text page image
            if (image.storyText) {
                // Use a standard 8.5x11 aspect ratio for print quality
                const textImageBase64 = await generateTextPageAsImage(image.storyText, 850, 1100);
                zip.file(`Page-${pageNum}-Story.png`, textImageBase64, { base64: true });
            }
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);

        // Name the zip file based on the pet's name, or use a default
        const sanitizedPetName = petName.trim().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-');
        const fileName = sanitizedPetName ? `${sanitizedPetName}-story.zip` : 'coloring-story.zip';
        link.download = fileName;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch (err) {
        console.error("Failed to generate or download zip file:", err);
        // You could set an error state here to notify the user
    } finally {
        setIsDownloading(false);
    }
  };
  
  const handleCopyCaption = () => {
      if (generatedImages && generatedImages.length > 0 && generatedImages[0].caption) {
          navigator.clipboard.writeText(generatedImages[0].caption);
          setCaptionCopied(true);
          setTimeout(() => setCaptionCopied(false), 2500);
      }
  };


  const hasImages = generatedImages && generatedImages.length > 0;
  const isMultiple = hasImages && generatedImages.length > 1;

  if (isStoryMode && hasImages) {
      const currentPage = generatedImages[generatedImages.length - 1];
      const previousPages = generatedImages.slice(0, -1);
      return (
        <div className="w-full aspect-[8.5/11] sketch-border bg-white flex flex-col justify-start items-center p-2 relative overflow-y-auto">
           {isLoading && (
              <div className="absolute inset-0 z-20">
                <LoadingScreen statusMessage={statusMessage} progress={progress} />
              </div>
           )}
           <h3 className="font-header text-xl text-colored-in flex-shrink-0 mb-2">Story Mode - Page {generatedImages.length}</h3>
           
           <div className="w-full h-full flex flex-col lg:flex-row items-stretch justify-start gap-3 p-1">
              {currentPage.storyText && (
                <div className="w-full lg:w-1/2 bg-amber-50/50 p-4 rounded-lg sketch-border flex flex-col justify-center">
                    <p className="font-serif text-lg leading-relaxed text-slate-800" style={{ fontFamily: "'Comic Neue', cursive" }}>
                        {currentPage.storyText}
                    </p>
                </div>
              )}

              <div 
                className="w-full lg:w-1/2 relative flex items-center justify-center min-h-0 aspect-[8.5/11] lg:aspect-auto cursor-pointer"
                onClick={() => setPreviewingImage({ image: currentPage, index: generatedImages.length - 1 })}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setPreviewingImage({ image: currentPage, index: generatedImages.length - 1 });
                }}
              >
                  <img
                    src={`data:${currentPage.mimeType};base64,${currentPage.base64}`}
                    alt={`Story page ${generatedImages.length}`}
                    className="max-h-full max-w-full object-contain rounded-md sketch-border bg-white"
                  />
              </div>
           </div>
           
           <div className="flex-shrink-0 w-full flex flex-col items-center gap-3 mt-4">
               {generatedImages.length < 25 ? (
                  <>
                    <h4 className="font-header text-lg text-slate-700">What happens next?</h4>
                    <StoryChoices 
                        choices={storyChoices} 
                        onSelect={onChoiceSelected} 
                        isLoading={isGeneratingChoices}
                        disabled={isLoading}
                    />
                  </>
               ) : (
                <div className="text-center p-4 bg-amber-50/50 rounded-lg sketch-border w-full max-w-md">
                    <h4 className="font-header text-xl text-colored-in">The End!</h4>
                    <p className="text-slate-600 mt-1 font-bold">You've reached the end of this grand adventure! You can now download your 25-page storybook.</p>
                </div>
               )}
              
              <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
                  <button
                      onClick={handleDownloadAll}
                      disabled={isDownloading}
                      className="bg-crayon-teal font-header py-2 px-6 sketch-button interactive-wiggle-hover flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
                      >
                      {isDownloading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-slate-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Zipping...
                          </>
                      ) : (
                          <>
                            <DownloadIcon />
                            Download Story
                          </>
                      )}
                  </button>
              </div>

              {previousPages.length > 0 && (
                  <div className="w-full p-2 bg-slate-100/80 sketch-border overflow-x-auto mt-2">
                      <p className="text-sm font-bold text-slate-500 mb-1">Previous Pages:</p>
                      <div className="flex space-x-2">
                          {previousPages.map((page, index) => (
                               <div key={index} className="flex-shrink-0 w-20 h-28 bg-white sketch-shadow-sm border-2 border-slate-300 rounded-sm">
                                  <img 
                                      src={`data:${page.mimeType};base64,${page.base64}`} 
                                      alt={`Story page thumbnail ${index + 1}`}
                                      className="w-full h-full object-contain"
                                  />
                               </div>
                          ))}
                      </div>
                  </div>
              )}
           </div>
        </div>
      )
  }

  return (
    <>
      <div className="w-full max-h-[85vh] md:max-h-none md:aspect-[8.5/11] sketch-border bg-white flex flex-col justify-start items-center p-3 gap-2 relative overflow-y-auto">
        {isLoading && <LoadingScreen statusMessage={statusMessage} progress={progress} />}
        {!isLoading && error && <div className="text-red-600 bg-red-100 p-4 sketch-border text-center font-bold">{error}</div>}
        {!isLoading && !error && hasImages && (
            isMultiple ? (
              <>
                <div className="flex-grow w-full grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 overflow-y-auto">
                   {generatedImages.map((image, index) => (
                      <div 
                        key={index} 
                        className="relative aspect-[8.5/11] bg-white rounded-md sketch-shadow-sm group cursor-pointer border-2 border-slate-200" 
                        onClick={() => setPreviewingImage({ image, index })}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setPreviewingImage({ image, index });
                        }}
                      >
                        <img
                            src={`data:${image.mimeType};base64,${image.base64}`}
                            alt={`Generated coloring page ${index + 1}`}
                            className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex justify-center items-center">
                            <p className="text-white font-bold text-xl font-header opacity-0 group-hover:opacity-100 transition-opacity">View Details</p>
                        </div>
                      </div>
                   ))}
                </div>
                <div className="flex-shrink-0 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={handleDownloadAll}
                      disabled={isDownloading}
                      className="bg-crayon-teal font-header py-2 px-6 sketch-button interactive-wiggle-hover disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                      {isDownloading ? 'Zipping...' : 'Download All (.zip)'}
                    </button>
                </div>
              </>
            ) : (
               <>
                <div 
                  className="flex-grow w-full relative flex items-center justify-center min-h-0 cursor-pointer"
                  onClick={() => setPreviewingImage({ image: generatedImages[0], index: 0 })}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setPreviewingImage({ image: generatedImages[0], index: 0 });
                  }}
                >
                    <img
                      src={`data:${generatedImages[0].mimeType};base64,${generatedImages[0].base64}`}
                      alt="Generated coloring page"
                      className="max-h-full max-w-full object-contain rounded-md"
                    />
                </div>
                <div className="flex-shrink-0 w-full flex flex-col items-center gap-3">
                    <div className="bg-slate-50 p-3 rounded-lg sketch-border border-2 border-slate-200 relative w-full max-w-md">
                        <h3 className="font-header text-md text-slate-700 mb-1.5 text-center">Your Social Media Caption! <span className="text-xs font-normal text-slate-500">(Editable)</span></h3>
                        <textarea
                            value={generatedImages[0].caption}
                            onChange={(e) => onCaptionChange(0, e.target.value)}
                            className="w-full text-slate-800 whitespace-pre-wrap text-sm leading-snug h-24 p-1 bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-amber-400 rounded-sm"
                            aria-label="Editable social media caption"
                        />
                        <button
                            onClick={handleCopyCaption}
                            className="absolute -top-3 -right-3 bg-crayon-teal text-slate-800 font-header py-1 px-3 sketch-button text-sm flex items-center gap-1.5"
                            >
                            {captionCopied ? <CheckIcon /> : <CopyIcon />}
                            {captionCopied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <div className="flex flex-col items-center gap-3 w-full max-w-md">
                        <SocialShareButtons 
                            image={generatedImages[0]} 
                            onDownload={handleDownloadSingle}
                            onStartStory={onStartStory}
                            onGenerateVideo={onGenerateVideo}
                            isGeneratingVideo={isGeneratingVideo}
                            onGenerateMockup={onGenerateMockup}
                            isLoading={isLoading}
                            onColorItIn={onColorItIn}
                        />
                    </div>
                </div>
              </>
            )
        )}
        {!isLoading && !error && !hasImages && <Placeholder />}
      </div>
      <ImagePreviewModal 
        preview={previewingImage} 
        onClose={() => setPreviewingImage(null)} 
        onCaptionChange={onCaptionChange}
        onDownload={handleDownloadSingle}
        onGenerateVideo={onGenerateVideo}
        isGeneratingVideo={isGeneratingVideo}
        onGenerateMockup={onGenerateMockup}
        isLoading={isLoading}
        onColorItIn={onColorItIn}
      />
    </>
  );
};
