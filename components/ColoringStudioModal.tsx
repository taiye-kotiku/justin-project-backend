import React, { useState, useCallback, useRef } from 'react';
import { GeneratedImage } from '../types';
import { NumberOfImagesSlider } from './NumberOfImagesSlider';
import { Carousel } from './Carousel';
import { LoadingScreen } from './LoadingScreen';

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const CheckmarkIcon = () => (
    <div className="absolute top-1 right-1 bg-white rounded-full p-0.5 sketch-border border-2 border-emerald-800 animate-scale-in shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-800" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
    </div>
);

// --- SCENE ICONS ---
const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {children}
    </svg>
);
const StudioDeskIcon = () => <IconWrapper><path d="M4 8V6a2 2 0 012-2h12a2 2 0 012 2v2M4 8v4M12 8v4M20 8v4M4 12h16M7 12v4h10v-4M7 16h4m2 0h2M9 20h6" /></IconWrapper>;
const ArtGalleryIcon = () => <IconWrapper><path d="M3 6h18M3 10h18M3 14h18M3 18h18M6 3v18M18 3v18" /><rect x="8" y="8" width="8" height="6" rx="1" /></IconWrapper>;
const GraffitiAlleyIcon = () => <IconWrapper><path d="M3 6h18M3 18h18M6 3v18M18 3v18" /><path d="M10 10c-1 2 1 4 3 4s3-2 2-4-2-3-4-2-2 2-1 2zm3 1s1-1 0-2" /></IconWrapper>;
const CoffeeShopIcon = () => <IconWrapper><path d="M10 8H8v8h2M14 8h-2v8h2M6 8h12M6 16h12M8 4h8l1 4H7z" /><path d="M10 20h4" /></IconWrapper>;
const PartyDecorIcon = () => <IconWrapper><path d="M12 12l-4-4 4-4 4 4-4 4zm0 0l-4 4 4 4 4-4-4-4z" /><path d="M12 2v2m0 16v2m-9-9H1m18 0h-2" /></IconWrapper>;
const ScrapbookIcon = () => <IconWrapper><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 7h8M8 11h8M8 15h4" /><path d="M14 3v4l-2-2-2 2V3" /></IconWrapper>;
const AutumnSceneIcon = () => <IconWrapper><path d="M12 4c-4 4-4 8 0 12s8 4 12 0" /><path d="M12 4c4 4 4 8 0 12s-8 4-12 0" /><path d="M12 2v20" /></IconWrapper>;
const CorkboardIcon = () => <IconWrapper><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 8v6" /><path d="M12 8v6" /><path d="M15 8v6" /></IconWrapper>;
const CozyBookshelfIcon = () => <IconWrapper><path d="M4 20h16M4 4h16M8 4v16M12 4v16M16 4v16" /><path d="M6 8h2m-2 4h2m-2 4h2" /></IconWrapper>;
const BakingMessIcon = () => <IconWrapper><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" /><circle cx="16" cy="18" r="2" /><path d="M18 16V8" /></IconWrapper>;
const KidsPlayroomIcon = () => <IconWrapper><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 8h8v8H8z" /><path d="M12 4v4m0 8v4m-4-8h8" /></IconWrapper>;
const BeachDayIcon = () => <IconWrapper><path d="M12 2c-4 0-8 3-8 8s3 8 8 8 8-3 8-8-3-8-8-8zm0 14c-3 0-6-2-6-6s3-6 6-6 6 2 6 6-3 6-6 6z" /><path d="M12 10a2 2 0 100-4 2 2 0 000 4z" /><path d="M4 18h16" /></IconWrapper>;
const SpaceshipCockpitIcon = () => <IconWrapper><path d="M2 12h20" /><path d="M12 2l8 10H4z" /><circle cx="12" cy="16" r="2" /><path d="M10 20h4" /></IconWrapper>;
const CampsiteFireIcon = () => <IconWrapper><path d="M12 2l-4 4h8z" /><path d="M12 22l-4-4h8z" /><path d="M2 12l4-4v8z" /><path d="M22 12l-4-4v8z" /></IconWrapper>;
const SubwayPosterIcon = () => <IconWrapper><path d="M8 6h8v12H8z" /><path d="M4 4h16v16H4z" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="M2 12h2" /><path d="M20 12h2" /></IconWrapper>;
const ArtistsEaselIcon = () => <IconWrapper><path d="M12 4l8 16H4z" /><path d="M12 4v16" /><path d="M8 12h8" /></IconWrapper>;
const DogParkIcon = () => <IconWrapper><path d="M4 16v-8a2 2 0 012-2h12a2 2 0 012 2v8M8 16V6M16 16V6M12 16V6" /><circle cx="18" cy="14" r="2" /><path d="M4 20h16" /></IconWrapper>;
const GroomingSalonIcon = () => <IconWrapper><path d="M12 14c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4z" /><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" /></IconWrapper>;
const PupBirthdayIcon = () => <IconWrapper><path d="M4 20h16v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2z" /><path d="M12 10V4l2 2 2-2" /><path d="M12 14a2 2 0 100-4 2 2 0 000 4z" /></IconWrapper>;
const VintageCorvetteIcon = () => <IconWrapper><path d="M5 12h14" /><rect x="3" y="8" width="18" height="8" rx="2" /><path d="M3 16h2m14 0h2" /><circle cx="7" cy="12" r="1" /><circle cx="17" cy="12" r="1" /></IconWrapper>;
const PetStoreIcon = () => <IconWrapper><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8H4z" /><path d="M16 12V4a2 2 0 00-4-2h-4a2 2 0 00-4 2v8" /><path d="M12 17a1 1 0 100-2 1 1 0 000 2z" /></IconWrapper>;
const VetWaitingRoomIcon = () => <IconWrapper><path d="M4 8v4a4 4 0 004 4h4a4 4 0 004-4V8" /><path d="M4 8a2 2 0 10-4 0v10a2 2 0 104 0" /><path d="M20 8a2 2 0 11-4 0v10a2 2 0 114 0" /><circle cx="12" cy="18" r="2" /></IconWrapper>;
const CozyBedIcon = () => <IconWrapper><path d="M2 8v12h20V8" /><path d="M4 12h16" /><path d="M6 8a4 4 0 014-4h4a4 4 0 014 4" /><path d="M18 8a4 4 0 00-4-4h-4a4 4 0 00-4 4" /></IconWrapper>;
const HikingTrailIcon = () => <IconWrapper><path d="M3 20h18" /><path d="M5 16l4-8 4 8 4-4 4 4" /></IconWrapper>;
const PoolsideLoungeIcon = () => <IconWrapper><path d="M4 4h16v2H4zM4 10h16v2H4zM4 16h16v2H4zM8 4v16M16 4v16" /></IconWrapper>;
const AirportTerminalIcon = () => <IconWrapper><path d="M2 14l6-1 2 5 2-5 6 1v-4l-8-8-8 8v4z" /><path d="M8 19h8" /></IconWrapper>;


const coloringStyles = [
    { id: 'colored-pencil', title: 'Colored Pencil', description: 'Soft, textured, and layered, like a hand-drawn sketch.' },
    { id: 'marker-art', title: 'Marker Art', description: 'Bold, vibrant, and saturated with a smooth finish.' },
    { id: 'watercolor', title: 'Watercolor Wash', description: 'Soft, dreamy, and painterly with beautiful color bleeds.' },
    { id: 'vibrant-cartoon', title: 'Vibrant Cartoon', description: 'Flat, bright colors with sharp shadows, like an animation cel.' },
    { id: 'realistic-shading', title: 'Realistic Shading', description: 'Deep, rich colors with photorealistic lighting and depth.' },
    { id: 'psychedelic', title: 'Psychedelic', description: 'Wild, swirling rainbow colors in a trippy, tie-dye style.' },
];

const skillLevels = [
    { id: 'pro', name: 'Pro Artist ✨', description: 'Perfect, in-the-lines coloring with skillful shading.' },
    { id: 'amateur', name: 'Amateur Fun 🖍️', description: 'Neat coloring, mostly in the lines, but without professional blending.' },
    { id: 'kid', name: 'Kid Scribbles 🎨', description: 'Enthusiastic coloring that goes outside the lines sometimes.' },
    { id: 'toddler', name: 'Toddler Time 🤪', description: 'Gloriously messy, scribbled-everywhere fun!' }
];

const mockupScenes = [
    { id: 'studio-desk', icon: StudioDeskIcon, shortTitle: 'Studio Desk', title: 'Your open coloring book on a vibey studio desk, with a monitor, keyboard, and coffee mug in the background.' },
    { id: 'art-gallery', icon: ArtGalleryIcon, shortTitle: 'Art Gallery', title: 'Your open coloring book resting on an elegant bench in a clean, modern art gallery, with abstract paintings on the walls.' },
    { id: 'dog-park', icon: DogParkIcon, shortTitle: 'Dog Park', title: 'Your open coloring book on a park bench at a sunny dog park, with happy dogs playing in the background.' },
    { id: 'graffiti-alley', icon: GraffitiAlleyIcon, shortTitle: 'Graffiti Alley', title: 'Your open coloring book on a milk crate in a gritty graffiti alley, surrounded by colorful street art.' },
    { id: 'coffee-shop', icon: CoffeeShopIcon, shortTitle: 'Coffee Shop', title: 'Your open coloring book on a small table at a cozy, artisanal coffee shop, next to a latte with latte art.' },
    { id: 'grooming-salon', icon: GroomingSalonIcon, shortTitle: 'Fluff Bar', title: "Your open coloring book on a stylish counter at a chic pet grooming salon named 'Fluff Bar', with cute grooming tools and shampoo bottles around it." },
    { id: 'party-decor', icon: PartyDecorIcon, shortTitle: 'Party Decor', title: 'Your open coloring book on a table amidst fun party decorations, with balloons and confetti in the background.' },
    { id: 'pup-birthday', icon: PupBirthdayIcon, shortTitle: 'Pup Party', title: 'Your open coloring book on a table in the middle of a chaotic and joyful dog birthday party, surrounded by presents, cake, and excited pups.' },
    { id: 'scrapbook', icon: ScrapbookIcon, shortTitle: 'Scrapbook', title: 'Your open coloring book on a crafting table, surrounded by scrapbooking supplies like photos, stickers, and washi tape.' },
    { id: 'red-corvette', icon: VintageCorvetteIcon, shortTitle: 'Corvette', title: 'Your open coloring book resting on the hood of a shiny, classic 1978 red Corvette, parked on a scenic street.' },
    { id: 'autumn-scene', icon: AutumnSceneIcon, shortTitle: 'Autumn Scene', title: 'Your open coloring book on a rustic wooden floor, surrounded by cozy autumn leaves, acorns, and a warm blanket.' },
    { id: 'pet-store', icon: PetStoreIcon, shortTitle: 'Pet Store', title: 'Your open coloring book on the floor of a colorful pet store aisle, surrounded by shelves packed with squeaky toys and treats.' },
    { id: 'corkboard', icon: CorkboardIcon, shortTitle: 'Corkboard', title: 'Your open coloring book on a desk in front of a busy, creative corkboard filled with sketches and photos.' },
    { id: 'cozy-bookshelf', icon: CozyBookshelfIcon, shortTitle: 'Bookshelf', title: 'Your open coloring book leaning against a stack of classic books on a cozy, well-lit bookshelf.' },
    { id: 'vet-waiting-room', icon: VetWaitingRoomIcon, shortTitle: 'Vet Office', title: "Your open coloring book on a chair in a clean, friendly veterinarian's waiting room, with animal-themed posters on the wall." },
    { id: 'baking-mess', icon: BakingMessIcon, shortTitle: 'Baking Mess', title: 'Your open coloring book on a flour-dusted kitchen counter next to a rolling pin and cookie cutters.' },
    { id: 'cozy-bed', icon: CozyBedIcon, shortTitle: 'Cozy Bed', title: 'Your open coloring book resting amongst fluffy pillows and a soft duvet on a cozy, sunlit, unmade bed.' },
    { id: 'kids-playroom', icon: KidsPlayroomIcon, shortTitle: 'Playroom', title: 'Your open coloring book on the floor of a bright, cheerful child\'s playroom, surrounded by building blocks and toys.' },
    { id: 'beach-day', icon: BeachDayIcon, shortTitle: 'Beach Day', title: 'Your open coloring book on a beach towel next to a sandcastle and sunglasses, with the ocean in the background.' },
    { id: 'hiking-trail', icon: HikingTrailIcon, shortTitle: 'Hiking Trail', title: 'Your open coloring book peeking out of a hiking backpack resting against a tree on a beautiful mountain trail.' },
    { id: 'spaceship-cockpit', icon: SpaceshipCockpitIcon, shortTitle: 'Spaceship', title: 'Your open coloring book floating in the zero-gravity cockpit of a futuristic spaceship, with stars visible outside.' },
    { id: 'poolside-lounge', icon: PoolsideLoungeIcon, shortTitle: 'Poolside', title: 'Your open coloring book on a lounge chair next to a sparkling blue swimming pool, with sunglasses and a tropical drink.' },
    { id: 'campsite-fire', icon: CampsiteFireIcon, shortTitle: 'Campsite', title: 'Your open coloring book resting on a log next to a crackling campfire at dusk, with a tent in the background.' },
    { id: 'airport-terminal', icon: AirportTerminalIcon, shortTitle: 'Airport', title: 'Your open coloring book on a seat in a modern airport terminal, with a plane visible through the large windows in the background.' },
    { id: 'subway-poster', icon: SubwayPosterIcon, shortTitle: 'Subway Ride', title: 'Your open coloring book resting on your lap during a commute on a bright, modern subway train.' },
    { id: 'artists-easel', icon: ArtistsEaselIcon, shortTitle: 'Artist\'s Easel', title: 'Your open coloring book on a table in a bright, sunlit art studio, with an easel and paint supplies nearby.' },
];


interface ColoringStudioModalProps {
    sourceImage: GeneratedImage;
    onClose: () => void;
    onGenerate: (sourceImage: GeneratedImage, style: string, outputType: 'flat' | 'mockup', scene: string, count: number, coloringProgress: string, artistSkill: string) => Promise<GeneratedImage[]>;
    onGenerateVideo?: (image: GeneratedImage, style?: string) => void;
    isGeneratingVideo?: boolean;
}

export const ColoringStudioModal: React.FC<ColoringStudioModalProps> = ({ sourceImage, onClose, onGenerate, onGenerateVideo, isGeneratingVideo }) => {
    const [selectedStyle, setSelectedStyle] = useState<string>(coloringStyles[0].id);
    const [coloringProgress, setColoringProgress] = useState<'full' | '3/4' | '1/2' | '1/4'>('full');
    const [artistSkillIndex, setArtistSkillIndex] = useState<number>(0);
    const [outputType, setOutputType] = useState<'flat' | 'mockup'>('flat');
    const [selectedScene, setSelectedScene] = useState<string>(mockupScenes[0].title);
    const [customScene, setCustomScene] = useState<string>('');
    const [numberOfVersions, setNumberOfVersions] = useState<number>(1);
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [coloredImages, setColoredImages] = useState<GeneratedImage[] | null>(null);

    const handleGenerateClick = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setColoredImages(null);
        
        try {
            const finalScene = outputType === 'mockup' ? (customScene.trim() || selectedScene) : '';
            const artistSkill = skillLevels[artistSkillIndex].id;
            const results = await onGenerate(sourceImage, selectedStyle, outputType, finalScene, numberOfVersions, coloringProgress, artistSkill);
            
            if (results.length === 0) {
                throw new Error("The model didn't return any colored images. Please try again.");
            }
            setColoredImages(results);

        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }

    }, [onGenerate, sourceImage, selectedStyle, outputType, selectedScene, customScene, numberOfVersions, coloringProgress, artistSkillIndex]);
    
    const handleAnimateRequest = useCallback((imageFromCarousel: GeneratedImage) => {
        // The image from the carousel is the colored one, which is ignored.
        // The video generation service needs the original greyscale source image.
        // We pass the currently selected style from the modal's state.
        if (onGenerateVideo) {
            onGenerateVideo(sourceImage, selectedStyle);
        }
    }, [onGenerateVideo, sourceImage, selectedStyle]);


    return (
        <div 
            className="fixed inset-0 bg-slate-900 bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50 p-4" 
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="relative bg-white sketch-border sketch-shadow max-w-7xl w-full h-full md:h-[95vh] flex flex-col md:flex-row animate-[slide-up_0.3s_ease-out]" 
                onClick={e => e.stopPropagation()}
            >
                <style>{`
                  @keyframes slide-up {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                  }
                `}</style>
                
                {/* Controls Panel */}
                <div className="flex-shrink-0 flex flex-col gap-4 p-4 md:p-6 bg-amber-50 md:border-r-4 border-b-4 md:border-b-0 border-slate-800 md:w-1/3 overflow-y-auto h-1/2 md:h-full">
                    <h2 className="text-3xl font-header text-colored-in">Coloring Studio</h2>
                    <div className="flex items-center gap-3 bg-white p-2 sketch-border">
                        <img src={`data:${sourceImage.mimeType};base64,${sourceImage.base64}`} alt="Source coloring page" className="w-16 h-auto rounded-sm border-2 border-slate-300" />
                        <p className="text-sm font-bold text-slate-600">Now coloring this masterpiece!</p>
                    </div>

                    <div>
                        <h3 className="font-header text-xl text-slate-700 mb-2">1. Choose Your Style</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {coloringStyles.map(style => (
                                <button 
                                    key={style.id}
                                    onClick={() => setSelectedStyle(style.id)}
                                    className={`relative p-2 text-center rounded-lg border-2 transition-all duration-200 sketch-shadow-sm h-full flex items-center justify-center font-bold ${selectedStyle === style.id ? 'bg-crayon-violet text-white border-violet-600' : 'bg-white border-slate-400 hover:bg-violet-100'}`}
                                    title={style.description}
                                >
                                    {style.title}
                                    {selectedStyle === style.id && <CheckmarkIcon />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-header text-xl text-slate-700">2. Artist Skill</h3>
                            <span className="font-header text-violet-800 text-md bg-violet-200 sketch-border border-2 border-violet-800 rounded-md px-3 py-1">{skillLevels[artistSkillIndex].name}</span>
                        </div>
                         <div className="flex flex-col space-y-1 bg-white p-3 sketch-border">
                            <input
                                id="artist-skill-slider"
                                type="range"
                                min="0"
                                max={skillLevels.length - 1}
                                step="1"
                                value={artistSkillIndex}
                                onChange={(e) => setArtistSkillIndex(parseInt(e.target.value, 10))}
                                className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-violet-500"
                            />
                            <div className="flex justify-between text-xs font-bold text-slate-500 px-1">
                                <span>Pro</span>
                                <span>Amateur</span>
                                <span>Kid</span>
                                <span>Toddler</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 pl-1">{skillLevels[artistSkillIndex].description}</p>
                    </div>
                    
                    <div>
                        <h3 className="font-header text-xl text-slate-700 mb-2">3. Coloring Progress</h3>
                        <div className="grid grid-cols-4 gap-2">
                             <button onClick={() => setColoringProgress('1/4')} className={`relative p-2 text-center rounded-lg border-2 transition-all duration-200 sketch-shadow-sm h-full flex items-center justify-center font-bold ${coloringProgress === '1/4' ? 'bg-crayon-violet text-white border-violet-600' : 'bg-white border-slate-400 hover:bg-violet-100'}`}>1/4</button>
                             <button onClick={() => setColoringProgress('1/2')} className={`relative p-2 text-center rounded-lg border-2 transition-all duration-200 sketch-shadow-sm h-full flex items-center justify-center font-bold ${coloringProgress === '1/2' ? 'bg-crayon-violet text-white border-violet-600' : 'bg-white border-slate-400 hover:bg-violet-100'}`}>1/2</button>
                             <button onClick={() => setColoringProgress('3/4')} className={`relative p-2 text-center rounded-lg border-2 transition-all duration-200 sketch-shadow-sm h-full flex items-center justify-center font-bold ${coloringProgress === '3/4' ? 'bg-crayon-violet text-white border-violet-600' : 'bg-white border-slate-400 hover:bg-violet-100'}`}>3/4</button>
                             <button onClick={() => setColoringProgress('full')} className={`relative p-2 text-center rounded-lg border-2 transition-all duration-200 sketch-shadow-sm h-full flex items-center justify-center font-bold ${coloringProgress === 'full' ? 'bg-crayon-violet text-white border-violet-600' : 'bg-white border-slate-400 hover:bg-violet-100'}`}>Full</button>
                        </div>
                    </div>


                    <div>
                        <h3 className="font-header text-xl text-slate-700 mb-2">4. Choose Output</h3>
                        <div className="grid grid-cols-2 gap-2">
                             <button 
                                onClick={() => setOutputType('flat')}
                                className={`relative p-3 text-center rounded-lg border-2 transition-all duration-200 sketch-shadow-sm h-full flex items-center justify-center font-bold ${outputType === 'flat' ? 'bg-crayon-sky text-white border-sky-600' : 'bg-white border-slate-400 hover:bg-sky-100'}`}
                            >
                                Flat Artwork
                                {outputType === 'flat' && <CheckmarkIcon />}
                            </button>
                             <button 
                                onClick={() => setOutputType('mockup')}
                                className={`relative p-3 text-center rounded-lg border-2 transition-all duration-200 sketch-shadow-sm h-full flex items-center justify-center font-bold ${outputType === 'mockup' ? 'bg-crayon-sky text-white border-sky-600' : 'bg-white border-slate-400 hover:bg-sky-100'}`}
                            >
                                Realistic Mockup
                                {outputType === 'mockup' && <CheckmarkIcon />}
                            </button>
                        </div>
                    </div>

                    {outputType === 'mockup' && (
                        <div className="animate-[fade-in_0.3s_ease-out]">
                            <h3 className="font-header text-xl text-slate-700 mb-2">5. Choose Scene</h3>
                            <div className="p-2 bg-white sketch-border">
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    {mockupScenes.map(scene => {
                                        const isSelected = selectedScene === scene.title && !customScene;
                                        const Icon = scene.icon;
                                        return (
                                            <button
                                                key={scene.id}
                                                onClick={() => { setSelectedScene(scene.title); setCustomScene(''); }}
                                                title={scene.title}
                                                className={`relative flex flex-col items-center justify-center p-1 text-center rounded-lg border-2 sketch-shadow-sm transition-all duration-200 h-20 bg-white hover:border-emerald-400 ${isSelected ? 'border-emerald-500' : 'border-slate-300'}`}
                                            >
                                                <div className={`w-10 h-10 transition-colors ${isSelected ? 'text-emerald-600' : 'text-slate-500'}`}>
                                                    <Icon />
                                                </div>
                                                <span className={`text-[10px] leading-tight font-bold mt-1 transition-colors ${isSelected ? 'text-emerald-700' : 'text-slate-600'}`}>
                                                    {scene.shortTitle}
                                                </span>
                                                {isSelected && <CheckmarkIcon />}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                            <input
                                type="text"
                                value={customScene}
                                onChange={(e) => { setCustomScene(e.target.value); if (e.target.value) setSelectedScene(''); }}
                                placeholder="Or describe your own scene..."
                                className="mt-3 w-full px-3 py-2 bg-white sketch-input focus:ring-2 focus:ring-amber-400 outline-none"
                            />
                        </div>
                    )}
                    
                    <div>
                        <h3 className="font-header text-xl text-slate-700 mb-2">6. How Many Versions?</h3>
                        <NumberOfImagesSlider value={numberOfVersions} onChange={setNumberOfVersions} />
                    </div>

                    <button
                        onClick={handleGenerateClick}
                        disabled={isLoading}
                        className="w-full mt-auto flex justify-center items-center font-header text-xl sm:text-2xl py-3 px-4 sketch-button bg-crayon-emerald cta-glow interactive-wiggle-hover disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                         {isLoading ? 'Coloring...' : 'Generate Colored Images!'}
                    </button>
                </div>

                {/* Results Panel */}
                <div className="flex-grow flex justify-center items-center min-h-0 bg-slate-100/50 p-4 h-1/2 md:h-auto">
                    {isLoading ? (
                        <LoadingScreen statusMessage="Creating your colored masterpiece..." />
                    ) : error ? (
                        <div className="text-red-600 bg-red-100 p-4 sketch-border text-center font-bold">{error}</div>
                    ) : coloredImages ? (
                        <Carousel images={coloredImages} onGenerateVideo={handleAnimateRequest} isGeneratingVideo={isGeneratingVideo} />
                    ) : (
                        <div className="text-center">
                            <p className="text-5xl">🎨</p>
                            <p className="mt-4 font-header text-2xl text-colored-in">The Coloring Canvas</p>
                            <p className="mt-1 text-slate-500 font-bold">Your creations will appear here!</p>
                        </div>
                    )}
                </div>

                <button 
                    onClick={onClose} 
                    className="absolute top-2 right-2 bg-crayon-rose text-white rounded-full p-2 transition-all sketch-button interactive-wiggle-hover border-white z-10"
                    aria-label="Close coloring studio"
                >
                    <CloseIcon />
                </button>
            </div>
        </div>
    );
};