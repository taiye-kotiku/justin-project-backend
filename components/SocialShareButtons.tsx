
import React, { useState } from 'react';
import { GeneratedImage } from '../types';
import { base64ToFile } from '../utils/fileUtils';

// Simple, stylized SVG icons
const FacebookIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);
const XIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const InstagramIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.398 1.363.444 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.046 1.064-.218 1.791-.444 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.398-2.427.444-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.046-1.791-.218-2.427-.444a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.398-1.363-.444-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.046 1.064.218 1.791.444 2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.398 2.427-.444C9.531 2.013 9.885 2 12.315 2zm-1.043.987h-.001c-2.396 0-2.71 0-3.66.059-1.02.046-1.58.21-1.97.377-.44.185-.79.41-1.14.757a3.91 3.91 0 00-.757 1.14c-.167.39-.33.95-.376 1.97-.059.95-.06 1.26-.06 3.66s0 2.71.06 3.66c.046 1.02.21 1.58.376 1.97.185.44.41.79.757 1.14a3.91 3.91 0 001.14.757c.39.167.95.33 1.97.376.95.059 1.26.06 3.66.06s2.71 0 3.66-.06c1.02-.046 1.58-.21 1.97-.376.44-.185.79-.41 1.14-.757a3.91 3.91 0 00.757-1.14c.167-.39.33.95.376-1.97.059-.95.06-1.26.06-3.66s0-2.71-.06-3.66c-.046-1.02-.21-1.58-.376-1.97a3.91 3.91 0 00-.757-1.14 3.91 3.91 0 00-1.14-.757c-.39-.167-.95-.33-1.97-.376C15.025 2.987 14.71 3 12.315 3h-1.043zm0 5.48a3.52 3.52 0 100 7.04 3.52 3.52 0 000-7.04zm-1.99 3.52a1.99 1.99 0 113.98 0 1.99 1.99 0 01-3.98 0zM18.045 6.012a1.43 1.43 0 100 2.86 1.43 1.43 0 000-2.86z" clipRule="evenodd" />
  </svg>
);
const WhatsAppIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.35 3.43 16.84L2 22L7.32 20.64C8.75 21.41 10.36 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 6.46 17.5 2 12.04 2M12.04 20.13C10.56 20.13 9.11 19.74 7.85 19L7.42 18.75L4.54 19.53L5.34 16.74L5.07 16.3C4.26 14.95 3.83 13.43 3.83 11.91C3.83 7.39 7.51 3.71 12.04 3.71C16.57 3.71 20.25 7.39 20.25 11.92C20.25 16.45 16.57 20.13 12.04 20.13M17.41 14.26C17.16 14.13 15.91 13.54 15.68 13.45C15.45 13.36 15.29 13.32 15.13 13.55C14.97 13.78 14.47 14.36 14.32 14.52C14.17 14.68 14.02 14.7 13.77 14.58C13.52 14.45 12.63 14.15 11.6 13.29C10.76 12.6 10.21 11.75 10.06 11.52C9.91 11.29 10.03 11.16 10.15 11.05C10.26 10.93 10.39 10.76 10.53 10.6C10.67 10.44 10.72 10.32 10.82 10.12C10.92 9.92 10.87 9.75 10.8 9.63C10.73 9.51 10.24 8.26 10.04 7.78C9.84 7.3 9.64 7.35 9.47 7.34H9.01C8.85 7.34 8.57 7.4 8.34 7.63C8.11 7.86 7.61 8.33 7.61 9.31C7.61 10.29 8.37 11.22 8.52 11.38C8.67 11.54 10.24 13.98 12.67 14.97C15.1 15.96 15.1 15.62 15.53 15.58C15.96 15.54 17.16 14.91 17.41 14.78C17.66 14.66 17.66 14.43 17.58 14.26Z" />
  </svg>
);
const VideoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
    </svg>
);

const ApparelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5.5 3.5A1.5 1.5 0 017 2h6a1.5 1.5 0 011.5 1.5v2.375a.75.75 0 001.5 0V3.5A3 3 0 0011.5 0H8.5A3 3 0 005.5 3v2.375a.75.75 0 001.5 0V3.5z" />
        <path fillRule="evenodd" d="M4 6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2H4zm.25 1.5a.75.75 0 01.75-.75h10a.75.75 0 01.75.75v.5c0 .414-.336.75-.75.75H5a.75.75 0 01-.75-.75v-.5z" clipRule="evenodd" />
    </svg>
);


interface SocialShareButtonsProps {
  image: GeneratedImage;
  onDownload: (image: GeneratedImage) => void;
  onStartStory?: () => void;
  onGenerateVideo?: (image: GeneratedImage, style?: string) => void;
  isGeneratingVideo?: boolean;
  onGenerateMockup?: (image: GeneratedImage) => void;
  isLoading?: boolean;
  onColorItIn?: (image: GeneratedImage) => void;
}

export const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({ image, onDownload, onStartStory, onGenerateVideo, isGeneratingVideo, onGenerateMockup, isLoading, onColorItIn }) => {
  const [shareMessage, setShareMessage] = useState<string>('');

  const siteUrl = 'https://dogcoloringbooks.com';
  const encodedUrl = encodeURIComponent(siteUrl);

  /**
   * Attempts to use the Web Share API to share the image and caption.
   * This provides a native sharing experience on supported devices (mostly mobile).
   * @returns {Promise<boolean>} - True if the share API was triggered, false otherwise.
   */
  const tryNativeShare = async (): Promise<boolean> => {
    const file = base64ToFile(image.base64, image.mimeType, 'coloring-page.png');
    const shareData = {
      files: [file],
      title: 'My Dog Coloring Page!',
      text: image.caption,
      url: siteUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return true; // Share dialog was successfully opened
      } catch (error: any) {
        // User might have cancelled the share, which is not a failure of the API.
        if (error.name !== 'AbortError') { // Don't show message if user just cancelled
            setShareMessage('Sharing failed.');
            setTimeout(() => setShareMessage(''), 3000);
        }
        return true; // Still return true to prevent fallback actions.
      }
    }
    return false; // Web Share API not supported for this content
  };

  const shareOnFacebook = async () => {
    const sharedNatively = await tryNativeShare();
    if (sharedNatively) return;

    // Fallback for desktop: open web sharer
    const encodedCaption = encodeURIComponent(image.caption);
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedCaption}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareOnX = async () => {
    const sharedNatively = await tryNativeShare();
    if (sharedNatively) return;

    // Fallback for desktop
    const fullText = `${image.caption} #DogColoringBook #AIArt`;
    const encodedText = encodeURIComponent(fullText);
    const url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareOnInstagram = () => {
    if (!image?.caption) {
        setShareMessage('Content not ready.');
        setTimeout(() => setShareMessage(''), 3000);
        return;
    }
    // This flow is now used on all devices for Instagram, as requested.
    navigator.clipboard.writeText(image.caption);
    onDownload(image);
    setShareMessage('Caption copied & image saved! Opening Instagram...');
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
    setTimeout(() => setShareMessage(''), 3500);
  };
  
  const shareOnWhatsApp = async () => {
    const sharedNatively = await tryNativeShare();
    if (sharedNatively) return;

    // Fallback for desktop
    const fullText = `${image.caption} Create your own at ${siteUrl}`;
    const encodedText = encodeURIComponent(fullText);
    const url = `https://api.whatsapp.com/send?text=${encodedText}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };


  return (
    <div className="w-full relative flex flex-col items-center gap-3">
       {onColorItIn && (
           <button
                onClick={() => onColorItIn(image)}
                disabled={isLoading || isGeneratingVideo}
                className="bg-crayon-violet text-white font-header py-2 px-6 sketch-button interactive-wiggle-hover flex items-center justify-center gap-2 w-full disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
                🎨 Color It In!
            </button>
        )}
       {onStartStory && (
           <button
                onClick={onStartStory}
                className="bg-crayon-amber font-header py-2 px-6 sketch-button interactive-wiggle-hover flex items-center justify-center gap-2 w-full"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.642 0 3.219-.487 4.5-1.32V4.804z" />
                    <path d="M15 4.804A7.968 7.968 0 0011.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0111.5 16c1.642 0 3.219-.487 4.5-1.32V4.804z" />
                </svg>
                Start a Story!
            </button>
        )}
        {image.themeCategory === 'logo' && onGenerateMockup && (
            <button
                onClick={() => onGenerateMockup(image)}
                disabled={isLoading || isGeneratingVideo}
                className="bg-slate-800 text-white font-header py-2 px-6 sketch-button interactive-wiggle-hover flex items-center justify-center gap-2 w-full disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
                <ApparelIcon />
                Create Apparel Mockup
            </button>
        )}
        {onGenerateVideo && (
            <button
                onClick={() => onGenerateVideo(image)}
                disabled={isGeneratingVideo || isLoading}
                className="bg-crayon-violet text-white font-header py-2 px-6 sketch-button interactive-wiggle-hover flex items-center justify-center gap-2 w-full disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
                <VideoIcon />
                Animate This Page!
            </button>
        )}
      <div className="social-button-group w-full">
        <button onClick={shareOnFacebook} className="social-button" style={{ backgroundColor: '#1877F2' }} aria-label="Share on Facebook"><FacebookIcon /></button>
        <button onClick={shareOnX} className="social-button" style={{ backgroundColor: '#14171A' }} aria-label="Share on X"><XIcon /></button>
        <button onClick={shareOnInstagram} className="social-button" style={{ background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)' }} aria-label="Share on Instagram"><InstagramIcon /></button>
        <button onClick={shareOnWhatsApp} className="social-button" style={{ backgroundColor: '#25D366' }} aria-label="Share on WhatsApp"><WhatsAppIcon /></button>
      </div>
      {shareMessage && (
        <p className="text-sm font-bold text-teal-700 mt-2 bg-teal-100 px-3 py-1 rounded-md sketch-border border-2 border-teal-300 animate-[fade-in-out_3.5s_ease-in-out]">
           <style>{`@keyframes fade-in-out { 0%, 100% { opacity: 0; transform: translateY(5px); } 10%, 90% { opacity: 1; transform: translateY(0); } }`}</style>
           {shareMessage}
        </p>
      )}
    </div>
  );
};
