
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { optimizePrompt, createColoringPage, generateStoryChoices, startStory, continueStory, generateVideoFromImage, generateCaptionForVideo, createApparelMockup, colorInImage, generateAIDogConcept, generateAIDogImage } from './services/geminiService';
import { fileToGenerativePart, base64ToGenerativePart, base64ToFile } from './utils/fileUtils';
import { ImageUploader } from './components/ImageUploader';
import { ThemeSelector } from './components/ThemeSelector';
import { GenerateButton } from './components/GenerateButton';
import { ResultDisplay } from './components/ResultDisplay';
import { Header } from './components/Header';
import { NumberOfImagesSlider } from './components/NumberOfImagesSlider';
// FIX: Imported 'Theme' type from './types' instead of './themes' to fix a circular dependency error.
import { GeneratedImage, Theme } from './types';
import { 
    themes, 
    RANDOM_THEME_VALUE, 
    CANNABIS_RANDOM_VALUE, 
    SPORTS_CARD_VALUE, 
    LOGO_RANDOM_VALUE, 
    MOVIE_POSTER_VALUE, 
    HALLOWEEN_VALUE,
    CUSTOM_FOOD_VALUE,
    sportsForCard, 
    activityThemes, 
    MOVIE_POSTER_FLYER_VALUE, 
    MOVIE_POSTER_PREMIERE_VALUE,
    standardThemeCategories,
    CATEGORY_RANDOM_PREFIX,
    halloweenCostumeSuggestions
} from './themes';
import { VideoLoadingModal } from './components/VideoLoadingModal';
import { VideoPreviewModal } from './components/VideoPreviewModal';
import { ColoringStudioModal } from './components/ColoringStudioModal';
import { MoviePosterToggle } from './components/MoviePosterToggle';
import { HalloweenOptions } from './components/HalloweenOptions';

const MAX_PET_FILES = 5;
const MAX_PRODUCT_FILES = 1;
const MAX_LOGO_FILES = 4;
const PROGRESS_ANIMATION_DURATION_MS = 120 * 1000;
const VIDEO_PROGRESS_DURATION_MS = 150 * 1000;

/**
 * Shuffles an array in place using the Fisher-Yates (aka Knuth) algorithm.
 * This provides a much more robust and less biased shuffle than `sort()`.
 * @param array The array to shuffle.
 * @returns A new, shuffled array.
 */
// FIX: Changed from generic arrow function to a function declaration to resolve TSX parsing ambiguity.
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
  }
  return shuffled;
}

const halloweenBackgrounds = [
    "a classic Halloween scene with elements like carved jack-o'-lanterns, friendly cartoon ghosts, bats flying in front of a full moon, and some candy scattered on the ground.",
    "a spooky, misty graveyard with old, funny-named tombstones and a creepy, gnarled tree under a crescent moon.",
    "the inside of a grand, haunted mansion ballroom, with floating candelabras, spectral ghosts dancing, and intricate spiderwebs in the corners.",
    "a magical pumpkin patch at night, where some pumpkins are carved into glowing jack-o'-lanterns and vines curl into spooky shapes.",
    "a trick-or-treating scene on a charming, decorated suburban street at dusk, with other cute costumed animals visible.",
    "a whimsical witch's cottage interior, with a bubbling cauldron, potion bottles on shelves, and a black cat familiar lounging nearby.",
    "a festive Day of the Dead (Día de los Muertos) celebration with sugar skulls, marigold flowers, and colorful papel picado banners."
];


function App() {
  const [petFiles, setPetFiles] = useState<File[]>([]);
  const [productFiles, setProductFiles] = useState<File[]>([]);
  const [logoFiles, setLogoFiles] = useState<File[]>([]);
  
  const [petPreviews, setPetPreviews] = useState<string[]>([]);
  const [productPreviews, setProductPreviews] = useState<string[]>([]);
  const [logoPreviews, setLogoPreviews] = useState<string[]>([]);

  const [petName, setPetName] = useState<string>('');
  const [teamName, setTeamName] = useState<string>('');
  const [petHandle, setPetHandle] = useState<string>('');
  const [petGender, setPetGender] = useState<'boy' | 'girl' | 'unspecified'>('unspecified');
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [customTheme, setCustomTheme] = useState<string>('');
  const [customFood, setCustomFood] = useState<string>('');
  const [sportscardSport, setSportscardSport] = useState<string>('');
  const [moviePosterStyle, setMoviePosterStyle] = useState<'flyer' | 'premiere' | 'mix'>('mix');
  const [halloweenCostume, setHalloweenCostume] = useState<string>('');
  const [isHalloweenRandomMode, setIsHalloweenRandomMode] = useState<boolean>(false);
  const [displayedHalloweenSuggestions, setDisplayedHalloweenSuggestions] = useState<string[]>([]);

  const [numberOfImages, setNumberOfImages] = useState<number>(1);
  
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingAIDog, setIsGeneratingAIDog] = useState<boolean>(false);
  const [showCustomDogCreator, setShowCustomDogCreator] = useState<boolean>(false);
  const [customAiDogBreed, setCustomAiDogBreed] = useState<string>('');
  const [customAiDogColor, setCustomAiDogColor] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<number | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const [isStoryMode, setIsStoryMode] = useState<boolean>(false);
  const [storyChoices, setStoryChoices] = useState<string[]>([]);
  const [isGeneratingChoices, setIsGeneratingChoices] = useState<boolean>(false);
  
  const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false);
  const [videoStatusMessage, setVideoStatusMessage] = useState<string>('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [generatedVideoBlob, setGeneratedVideoBlob] = useState<Blob | null>(null);
  const [generatedVideoCaption, setGeneratedVideoCaption] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoProgressIntervalRef = useRef<number | null>(null);
  const videoStatusIntervalRef = useRef<number | null>(null);

  const [coloringStudioImage, setColoringStudioImage] = useState<GeneratedImage | null>(null);
  
  const isSportscardMode = selectedThemes.includes(SPORTS_CARD_VALUE);
  const isMoviePosterMode = selectedThemes.includes(MOVIE_POSTER_VALUE);
  const isHalloweenMode = selectedThemes.includes(HALLOWEEN_VALUE);
  const isCustomFoodMode = selectedThemes.includes(CUSTOM_FOOD_VALUE);

  const shuffleHalloweenSuggestions = useCallback(() => {
    setDisplayedHalloweenSuggestions(shuffleArray(halloweenCostumeSuggestions).slice(0, 6));
  }, []);

  // Set initial suggestions
  useEffect(() => {
    shuffleHalloweenSuggestions();
  }, [shuffleHalloweenSuggestions]);

  // Effect to manage side-effects of changing exclusive theme modes
  useEffect(() => {
    if (!isSportscardMode) {
        setSportscardSport('');
        setTeamName('');
    }
    if (!isHalloweenMode) {
        setHalloweenCostume('');
        setIsHalloweenRandomMode(false);
    }
    if (!isCustomFoodMode) {
        setCustomFood('');
    }
    // When random mode is on, clear the specific costume selection
    if (isHalloweenRandomMode) {
        setHalloweenCostume('');
    }
  }, [isSportscardMode, isHalloweenMode, isHalloweenRandomMode, isCustomFoodMode]);


  const scrollToResults = useCallback(() => {
    // A small timeout can help ensure the browser has time to start the state updates
    // before trying to scroll, especially on complex layouts or slower devices.
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  // Effect to manage the progress bar animation
  useEffect(() => {
    if (isLoading) {
      const startTime = Date.now();
      progressIntervalRef.current = window.setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        
        // Linear progress over the full animation duration.
        const currentProgress = (elapsedTime / PROGRESS_ANIMATION_DURATION_MS) * 100;
        
        setProgress(Math.min(99, currentProgress)); // Stop at 99% until complete

      }, 100);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      // If we were loading, flash 100% briefly before disappearing.
      if (progress > 0) {
        setProgress(100);
        setTimeout(() => setProgress(0), 500);
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isLoading]);


  // Effect to manage Object URLs for pet previews
  useEffect(() => {
    const urls = petFiles.map(file => URL.createObjectURL(file));
    setPetPreviews(urls);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [petFiles]);

  // Effect to manage Object URLs for product previews
  useEffect(() => {
    const urls = productFiles.map(file => URL.createObjectURL(file));
    setProductPreviews(urls);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [productFiles]);


  // Effect to manage Object URLs for logo previews
  useEffect(() => {
    const urls = logoFiles.map(file => URL.createObjectURL(file));
    setLogoPreviews(urls);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [logoFiles]);


  const buildPromptForTheme = useCallback(async (theme: Theme, allThemesForContext: Theme[]): Promise<string> => {
    const playerName = petName.trim();

    if (theme.prompt.startsWith(HALLOWEEN_VALUE)) {
        const promptParts = theme.prompt.split('::');
        const costume = promptParts.length > 1 ? promptParts[1] : halloweenCostume.trim();

        if (!costume) {
          // This will be caught by validation in handleGenerateClick, but good to have a safeguard.
          throw new Error("A Halloween costume must be specified.");
        }

        const randomBackground = shuffleArray(halloweenBackgrounds)[0];
        let promptText = `Create a fun and spooky greyscale coloring page with a Halloween theme. The dog from the provided photo must be the main subject, and it MUST be wearing a cute, full-body onesie costume of a ${costume}. The background should be ${randomBackground}`;

        if (playerName) {
            promptText += ` In a fun, spooky font, incorporate the name '${playerName}' into the scene, perhaps carved into a pumpkin, written on a tombstone, or on a banner.`;
        }
        
        if (logoFiles.length > 0) {
          promptText += ` Also, creatively incorporate the provided logos into the background of the Halloween scene (e.g., on a trick-or-treat bag, a haunted house sign, or a banner). The logos are the last image(s) uploaded.`;
        }

        if (productFiles.length > 0) {
            promptText += ` The image uploaded after the pet photo is a product. Creatively and naturally integrate this product into the fun Halloween scene. For example, the dog could be holding it, it could be part of a candy pile, or featured on a spooky poster in the background.`;
        }
        
        promptText += `
        
        CRITICAL STYLE INSTRUCTIONS: The final output must be a high-quality, greyscale comic book style coloring page with clean, bold line art and beautiful, artistic shading. It MUST have a portrait aspect ratio of 8.5:11 for printing.`;
        
        return promptText;
    } else if (theme.category === 'food') {
        let promptText = '';
        // Handle the special custom food theme
        if (theme.prompt === CUSTOM_FOOD_VALUE) {
            const foodItem = customFood.trim();
            if (!foodItem) {
              // This is a safeguard, main validation is in handleGenerateClick
              throw new Error("A custom food must be specified.");
            }
            promptText = `A fun and hilarious food-themed scene where the dog is ecstatically devouring a ridiculously large, comically oversized ${foodItem}. The scene is messy and joyful.`;
        } else {
            // Use the predefined prompt for other food themes
            promptText = theme.prompt;
        }

        // Add essential styling instructions to all food themes
        promptText += `
        
        CRITICAL STYLE INSTRUCTIONS: The final output must be a high-quality, greyscale comic book style coloring page with clean, bold line art and beautiful, artistic shading. It MUST have a portrait aspect ratio of 8.5:11 for printing.`;
        
        return promptText;
    } else if (theme.prompt === MOVIE_POSTER_FLYER_VALUE) {
        return `Create a classic, dramatic movie poster featuring the dog from the photo. The poster must be a greyscale coloring page with clean, bold lines and artistic shading.

        **POSTER DETAILS:**
        - **Star's Name:** The name "${playerName}" MUST be prominently displayed as the lead actor.
        - **Movie Title:** Invent a fun, dog-themed movie title (e.g., 'The Last Fetch', 'Indiana Bones and the Temple of Squeak').
        - **Tagline:** Include a catchy tagline.
        - **Billing Block:** Add a classic movie poster billing block at the bottom.
        - **Style:** The overall aesthetic should be that of a blockbuster movie poster.
        - **Output:** The final image must be a single, complete poster layout with a portrait aspect ratio of 8.5:11 for printing.`;
    } else if (theme.prompt === MOVIE_POSTER_PREMIERE_VALUE) {
        return `Create a photorealistic movie premiere scene. The dog from the provided photo is the celebrity, posing dramatically on a red carpet in front of a giant movie poster of themselves.

        **SCENE DETAILS:**
        - **The Dog:** The dog should look glamorous, maybe wearing a bow tie or sunglasses, posing for the cameras.
        - **The Poster:** The movie poster in the background should feature the same dog and include the name "${playerName}" as the star and a fun, invented movie title. The poster itself should be detailed.
        - **Environment:** Include elements of a movie premiere like velvet ropes, flashing camera lights (paparazzi), and a red carpet.
        
        **CRITICAL STYLE INSTRUCTIONS:**
        The entire scene must be a high-quality, greyscale comic book style coloring page with clean, bold line art and beautiful, artistic shading. It MUST have a portrait aspect ratio of 8.5:11.`;
    } else if (theme.category === 'sportscard') {
        const sport = sportscardSport;
        const currentTeamName = teamName.trim();
        return `Create a complete, single, vintage-style sports trading card featuring the dog from the provided photo. The card must be a greyscale coloring page with clean, bold lines and artistic shading.

        **CARD DETAILS:**
        - **Player Name:** The name "${playerName}" MUST be prominently displayed on the card.
        - **Sport:** The card should be themed for ${sport}. The dog should be depicted in an action pose relevant to ${sport} (e.g., hitting a baseball, dunking a basketball).
        - **Team Name:** The card MUST feature the team name "${currentTeamName}". Create a cool, relevant logo for this team.
        - **Card Design:** Include classic trading card elements: a dynamic border, a space for the team logo, and empty stat boxes that can be colored or filled in.
        - **Style:** The overall aesthetic should be that of a classic 1980s or 1990s sports card.
        - **Output:** The final image must be a single, complete card layout with a portrait aspect ratio of 8.5:11 for printing.`;
    } else if (theme.category === 'logo') {
        const brandName = petName.trim();
        // FIX: Renamed `prompt` variable to `promptText` to avoid potential conflict with window.prompt.
        let promptText = `Using the likeness of the pet from the provided photo(s), create a clean, professional, vector-style brand logo on a solid white background. The final image must be suitable for branding purposes (e.g., website, merchandise). The logo must have a square 1:1 aspect ratio.

        The logo MUST incorporate the following text EXACTLY: "${brandName}". Do not add, omit, or change any words from this text.
        
        The theme for the logo is: "${theme.prompt}"`;
        
        return promptText;
    } else if (theme.category === 'activity') {
        // Find a base theme from the user's selections that is NOT an activity page.
        const baseTheme = allThemesForContext.find(t => t.category !== 'activity' && !t.isSpecial);
        // If no other theme is selected, pick a fun random one.
        const baseThemeTitle = baseTheme ? baseTheme.title : shuffleArray(themes.filter(t => !t.isSpecial && t.category !== 'activity' && t.category !== 'logo'))[0]?.title || 'a fun day at the park';
        
        let promptText = theme.prompt
          .replace('{baseTheme}', baseThemeTitle)
          .replace('{petName}', petName.trim() || 'the dog');
          
        return promptText;
    } else {
        const optimizedTheme = await optimizePrompt(theme.prompt);
        let promptText = `Based on the provided pet photo(s), accurately represent their core likeness and features. The main subjects are the pets from the first uploaded image(s), so feature them prominently. `;
        
        if (petName.trim()) {
          promptText += `Incorporate the name '${petName.trim()}' into the design in a fun, comic book style font (e.g., on a collar, a banner, or as a hero title). `;
        }

        promptText += `Integrate this theme: "${optimizedTheme}". Add whimsical and fun elements related to the theme in the background and around the pet(s). `;
        
        const isCannabisTheme = theme.category === 'cannabis';
        if (productFiles.length > 0 && isCannabisTheme) {
            promptText += `The image uploaded after the pet photo is a product. Creatively and naturally integrate this product into the fun cannabis-themed scene. For example, the dog could be interacting with it, it could be on a table, or featured on a billboard in the background. `;
        }

        if (logoFiles.length > 0) {
          promptText += `Also, creatively incorporate the provided logos into the background or as elements within the scene (e.g., on a t-shirt, a poster, a sign). The logos are the last image(s) uploaded. `;
        }
        
        promptText += `CRITICAL STYLE INSTRUCTIONS: The final output must be a high-quality, greyscale comic book style coloring page. It needs clean, bold line art. Most importantly, it MUST include beautiful, artistic shading. This shading is essential to give the image depth and to make it very easy and enjoyable for someone to color in. The final image MUST have a portrait aspect ratio of 8.5:11, making it perfect for printing on a standard letter-sized paper.`;
        return promptText;
    }
  }, [petName, productFiles, logoFiles, sportscardSport, teamName, halloweenCostume, customFood]);

  const runGeneration = useCallback(async (themesToProcess: string[]) => {
    if (petFiles.length === 0) {
      setError('Please upload at least one photo of your pet.');
      return;
    }
     if (themesToProcess.length === 0) {
      setError('No themes were provided for generation.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages(null);
    setIsStoryMode(false);
    setStoryChoices([]);
    
    const themesToProcessObjects = themesToProcess
        .map(prompt => {
            // Handle dynamically-created Halloween prompts for random costume mode
            if (prompt.startsWith(HALLOWEEN_VALUE) && prompt.includes('::')) {
                const costume = prompt.split('::')[1];
                return {
                    title: `Halloween: ${costume}`,
                    prompt: prompt, // Keep the unique prompt
                    category: 'halloween',
                    isSpecial: true,
                };
            }
            return themes.find(t => t.prompt === prompt);
        })
        .filter((t): t is Theme => !!t);

    const BATCH_SIZE = 5;
    const totalImages = themesToProcessObjects.length;

    try {
      setStatusMessage('Preparing your photos...');
      const allFiles = [...petFiles, ...productFiles, ...logoFiles];
      const imageParts = await Promise.all(allFiles.map(fileToGenerativePart));
      
      let successfulResults: GeneratedImage[] = [];
      
      if (totalImages < 10) {
          // For smaller requests, generate one-by-one for a smooth sequential feedback loop.
          for (let i = 0; i < totalImages; i++) {
              const theme = themesToProcessObjects[i];
              setStatusMessage(`Creating page ${i + 1} of ${totalImages}...`);
              const finalPrompt = await buildPromptForTheme(theme, themesToProcessObjects);
              const result = await createColoringPage(imageParts, finalPrompt, petName, petHandle, petGender, theme.category);
              
              if (result) {
                  successfulResults.push(result);
                  setGeneratedImages([...successfulResults]); // Update UI with new image in real-time
              }
          }
      } else {
          // For larger requests, process in concurrent batches for speed.
          const numBatches = Math.ceil(totalImages / BATCH_SIZE);
          for (let i = 0; i < numBatches; i++) {
              const batchStart = i * BATCH_SIZE;
              const batchEnd = Math.min(batchStart + BATCH_SIZE, totalImages);
              const batchThemes = themesToProcessObjects.slice(batchStart, batchEnd);

              setStatusMessage(`Creating batch ${i + 1} of ${numBatches} (pages ${batchStart + 1}-${batchEnd})...`);

              const batchPromises = batchThemes.map(async (theme) => {
                  const finalPrompt = await buildPromptForTheme(theme, themesToProcessObjects);
                  return createColoringPage(imageParts, finalPrompt, petName, petHandle, petGender, theme.category);
              });
              
              const batchResults = await Promise.all(batchPromises);

              const newSuccessfulResultsInBatch = batchResults.filter((result): result is GeneratedImage => result !== null);

              if (newSuccessfulResultsInBatch.length > 0) {
                  successfulResults = [...successfulResults, ...newSuccessfulResultsInBatch];
                  setGeneratedImages(successfulResults); // Update UI after each batch completes
              }
          }
      }


      if (successfulResults.length === 0) {
        throw new Error('The model did not return any images. Please try different images or a new prompt.');
      }
      
      if (successfulResults.length < numberOfImages) {
        setError(`Successfully generated ${successfulResults.length} of ${numberOfImages} pages. Some may have failed.`);
      }

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
      setStatusMessage('');
    }
  }, [petFiles, productFiles, logoFiles, petName, petHandle, petGender, numberOfImages, buildPromptForTheme]);

 const handleEasyButtonClick = useCallback(async () => {
    scrollToResults();
    setIsStoryMode(false);
    setStoryChoices([]);
    const standardThemes = themes.filter(t => !t.isSpecial && t.category !== 'logo' && t.category !== 'cannabis' && t.category !== 'activity' && t.category !== 'food');
    if (standardThemes.length < numberOfImages) {
      setError(`Not enough unique standard themes for ${numberOfImages} pages. Please select ${standardThemes.length} or fewer pages.`);
      return;
    }
    const easyButtonThemes = shuffleArray(standardThemes).slice(0, numberOfImages).map(t => t.prompt);
    await runGeneration(easyButtonThemes);
  }, [numberOfImages, runGeneration, setError, scrollToResults]);

  const handleGenerateClick = useCallback(async () => {
    scrollToResults();
    setIsStoryMode(false);
    setStoryChoices([]);
    const allUserThemes = customTheme.trim() ? [...selectedThemes, customTheme.trim()] : [...selectedThemes];
    const isRandomMode = selectedThemes.includes(RANDOM_THEME_VALUE);
    const isCannabisRandomMode = selectedThemes.includes(CANNABIS_RANDOM_VALUE);
    
    if (petFiles.length === 0 || (!isSportscardMode && !isMoviePosterMode && !isHalloweenMode && !isCustomFoodMode && !isRandomMode && !isCannabisRandomMode && allUserThemes.length === 0)) {
      setError('Please upload at least one photo of your pet and select one or more themes.');
      return;
    }
    
    const selectedThemeObjects = selectedThemes
        .map(prompt => themes.find(t => t.prompt === prompt))
        .filter((t): t is Theme => !!t);
    
    const isLogoRandomMode = selectedThemes.includes(LOGO_RANDOM_VALUE);
    const hasLogoTheme = selectedThemeObjects.some(t => t.category === 'logo') || isLogoRandomMode;
    if (hasLogoTheme && !petName.trim()) {
      setError("Please enter a brand name for logo themes.");
      return;
    }
    const hasActivityTheme = selectedThemeObjects.some(t => t.category === 'activity');
    if (hasActivityTheme && !petName.trim()) {
        setError("Please enter your pet's name for activity pages.");
        return;
    }
    if (isSportscardMode && (!petName.trim() || !sportscardSport || !teamName.trim())) {
        setError("Please provide a player name, team name, and select a sport for the sports card.");
        return;
    }
    if (isMoviePosterMode && !petName.trim()) {
        setError("Please provide a name for the movie star!");
        return;
    }
    if (isHalloweenMode && !isHalloweenRandomMode && !halloweenCostume.trim()) {
        setError("Please choose or enter a costume for the Halloween theme, or select 'Randomize Costumes'.");
        return;
    }
    if (isCustomFoodMode && !customFood.trim()) {
        setError("Please enter a food for the 'Create Your Own Feast' theme.");
        return;
    }


    let themesToProcess: string[] = [];
    if (isSportscardMode) {
        themesToProcess = Array.from({ length: numberOfImages }).map(() => SPORTS_CARD_VALUE);
    } else if (isMoviePosterMode) {
        if (numberOfImages === 1 && moviePosterStyle === 'mix') {
            themesToProcess = [MOVIE_POSTER_FLYER_VALUE];
        } else if (moviePosterStyle === 'mix') {
            themesToProcess = Array.from({ length: numberOfImages }).map((_, i) => i % 2 === 0 ? MOVIE_POSTER_FLYER_VALUE : MOVIE_POSTER_PREMIERE_VALUE);
        } else if (moviePosterStyle === 'flyer') {
            themesToProcess = Array.from({ length: numberOfImages }).map(() => MOVIE_POSTER_FLYER_VALUE);
        } else { // 'premiere'
            themesToProcess = Array.from({ length: numberOfImages }).map(() => MOVIE_POSTER_PREMIERE_VALUE);
        }
    } else if (isHalloweenMode) {
        if (isHalloweenRandomMode) {
            if (halloweenCostumeSuggestions.length < numberOfImages) {
              setError(`Not enough unique Halloween costumes for ${numberOfImages} pages. Please select ${halloweenCostumeSuggestions.length} or fewer.`);
              return;
            }
            const randomCostumes = shuffleArray(halloweenCostumeSuggestions).slice(0, numberOfImages);
            themesToProcess = randomCostumes.map(costume => `${HALLOWEEN_VALUE}::${costume}`);
        } else {
            themesToProcess = Array.from({ length: numberOfImages }).map(() => HALLOWEEN_VALUE);
        }
    } else if (isCustomFoodMode) {
        themesToProcess = Array.from({ length: numberOfImages }).map(() => CUSTOM_FOOD_VALUE);
    } else if (isRandomMode) {
        const randomizableThemes = themes.filter(t => !t.isSpecial && t.category !== 'logo' && t.category !== 'cannabis' && t.category !== 'activity');
        if (randomizableThemes.length < numberOfImages) {
          setError(`Not enough unique themes for ${numberOfImages} pages. Please select ${randomizableThemes.length} or fewer pages for random mode.`);
          return;
        }
        themesToProcess = shuffleArray(randomizableThemes).slice(0, numberOfImages).map(t => t.prompt);
    } else if (isCannabisRandomMode) {
        const cannabisThemes = themes.filter(t => t.category === 'cannabis');
         if (cannabisThemes.length < numberOfImages) {
          setError(`Not enough unique cannabis themes for ${numberOfImages} pages. Please select ${cannabisThemes.length} or fewer pages for this mode.`);
          return;
        }
        themesToProcess = shuffleArray(cannabisThemes).slice(0, numberOfImages).map(t => t.prompt);
    } else {
      if (allUserThemes.length === 0) {
        setError("Please select one or more themes, or use the Easy Button.");
        return;
      }
      
      // Distribute the number of images across the selected themes, which may include randomizer placeholders.
      themesToProcess = Array.from({ length: numberOfImages }).map((_, i) => allUserThemes[i % allUserThemes.length]);

      // Handle Category Randomizers
      const categoryRandomValues = themesToProcess.filter(p => p.startsWith(CATEGORY_RANDOM_PREFIX));
      if (categoryRandomValues.length > 0) {
        const categoryThemePools = new Map<string, Theme[]>();
        const uniqueCategoryIds = [...new Set(categoryRandomValues.map(p => p.replace(CATEGORY_RANDOM_PREFIX, '')))];
        const explicitlySelectedPrompts = themesToProcess.filter(p => !p.startsWith(CATEGORY_RANDOM_PREFIX) && p !== LOGO_RANDOM_VALUE);

        for (const categoryId of uniqueCategoryIds) {
            const category = standardThemeCategories.find(c => c.id === categoryId);
            if (category) {
                const allCategoryThemes = category.subcategories.flatMap(sub => sub.themes);
                let availableThemes = allCategoryThemes.filter(theme => !explicitlySelectedPrompts.includes(theme.prompt));
                if (availableThemes.length === 0) availableThemes = allCategoryThemes;
                categoryThemePools.set(categoryId, shuffleArray(availableThemes));
            }
        }
        
        themesToProcess = themesToProcess.map(themePrompt => {
            if (themePrompt.startsWith(CATEGORY_RANDOM_PREFIX)) {
                const categoryId = themePrompt.replace(CATEGORY_RANDOM_PREFIX, '');
                const themePool = categoryThemePools.get(categoryId);
                if (themePool && themePool.length > 0) {
                    const randomTheme = themePool.shift()!;
                    themePool.push(randomTheme); // Cycle themes for reuse
                    return randomTheme.prompt;
                }
            }
            return themePrompt;
        });
      }

      // Handle Logo Randomizer (can run after category randomizers)
      if (themesToProcess.includes(LOGO_RANDOM_VALUE)) {
        const allLogoThemePrompts = themes.filter(t => t.category === 'logo').map(t => t.prompt);
        const explicitlySelectedLogoThemes = themesToProcess.filter(prompt => themes.find(t => t.prompt === prompt)?.category === 'logo');
        let availableLogoThemes = allLogoThemePrompts.filter(p => !explicitlySelectedLogoThemes.includes(p));
        if (availableLogoThemes.length === 0) availableLogoThemes = allLogoThemePrompts;
        
        const shuffledLogoThemes = shuffleArray(availableLogoThemes);
        let logoThemeIndex = 0;
        themesToProcess = themesToProcess.map(themePrompt => {
          if (themePrompt === LOGO_RANDOM_VALUE) {
            const randomLogoPrompt = shuffledLogoThemes[logoThemeIndex % shuffledLogoThemes.length];
            logoThemeIndex++;
            return randomLogoPrompt;
          }
          return themePrompt;
        });
      }
    }

    await runGeneration(themesToProcess);
  }, [petFiles, selectedThemes, customTheme, numberOfImages, runGeneration, setError, scrollToResults, petName, isSportscardMode, isMoviePosterMode, isHalloweenMode, isCustomFoodMode, sportscardSport, teamName, moviePosterStyle, halloweenCostume, isHalloweenRandomMode, customFood]);

  const handleStartStory = useCallback(async () => {
    if (!generatedImages || generatedImages.length === 0) return;
    
    setIsStoryMode(true);
    setIsGeneratingChoices(true);
    setError(null);
    setStoryChoices([]);

    try {
        const firstPage = generatedImages[0];
        const imagePart = base64ToGenerativePart(firstPage.base64, firstPage.mimeType);
        // The caption is generated from the image, good enough context.
        const themeContext = firstPage.caption; 
        
        const result = await startStory(imagePart, themeContext);

        // Update the first page with its new story text
        setGeneratedImages(prev => {
            if (!prev) return null;
            const newPages = [...prev];
            newPages[0] = { ...newPages[0], storyText: result.storyText };
            return newPages;
        });
        
        setStoryChoices(result.choices);
    } catch (err) {
        console.error(err);
        setError("Could not start the story. Please try again.");
    } finally {
        setIsGeneratingChoices(false);
    }
  }, [generatedImages]);

  const handleStoryChoice = useCallback(async (choice: string) => {
    if (!generatedImages || generatedImages.length === 0 || petFiles.length === 0) return;
    
    scrollToResults();
    setIsLoading(true);
    setError(null);
    setStoryChoices([]);

    try {
        setStatusMessage(`Continuing the story...`);
        
        const lastPage = generatedImages[generatedImages.length - 1];
        const previousPageImagePart = base64ToGenerativePart(lastPage.base64, lastPage.mimeType);
        const fullStoryText = generatedImages.map(p => p.storyText).filter(Boolean).join('\n\n');
        const petImageParts = await Promise.all(petFiles.map(fileToGenerativePart));

        const newPage = await continueStory(petImageParts, previousPageImagePart, fullStoryText, choice, petName, petHandle, petGender);
        
        if (newPage) {
            setGeneratedImages(prev => [...(prev || []), newPage]);
            
            setStatusMessage('Thinking of what happens next...');
            setIsGeneratingChoices(true);
            const newImagePart = base64ToGenerativePart(newPage.base64, newPage.mimeType);

            if (newPage.storyText) {
                const newChoices = await generateStoryChoices(newImagePart, newPage.storyText);
                setStoryChoices(newChoices);
            } else {
                 throw new Error("The model didn't provide text for the new page.");
            }

        } else {
            throw new Error("The model couldn't continue the story. Please try a different choice.");
        }

    } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred while creating the next page.');
    } finally {
        setIsLoading(false);
        setIsGeneratingChoices(false);
        setStatusMessage('');
    }

  }, [generatedImages, petFiles, scrollToResults, petName, petHandle, petGender]);
  
  const handleGenerateVideo = useCallback(async (image: GeneratedImage, style?: string) => {
    setIsGeneratingVideo(true);
    setVideoError(null);
    setGeneratedVideoCaption(null);
    setGeneratedVideoBlob(null);

    if (generatedVideoUrl) {
      URL.revokeObjectURL(generatedVideoUrl);
      setGeneratedVideoUrl(null);
    }
    
    const videoMessages = [
        "Waking up the movie director...",
        "Storyboarding your pet's big scene...",
        "Setting up the camera and lights...",
        "Action! Your masterpiece is rolling...",
        "This is a long take! Polishing the final cut...",
        "Adding cinematic sparkle...",
        "Rolling the credits... almost done!"
    ];
    let messageIndex = 0;
    setVideoStatusMessage(videoMessages[messageIndex]);

    if (videoStatusIntervalRef.current) clearInterval(videoStatusIntervalRef.current);
    videoStatusIntervalRef.current = window.setInterval(() => {
        messageIndex = (messageIndex + 1) % videoMessages.length;
        setVideoStatusMessage(videoMessages[messageIndex]);
    }, 8000);

    // Start progress bar animation
    setVideoProgress(0);
    const startTime = Date.now();
    if (videoProgressIntervalRef.current) clearInterval(videoProgressIntervalRef.current);
    videoProgressIntervalRef.current = window.setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const currentProgress = (elapsedTime / VIDEO_PROGRESS_DURATION_MS) * 100;
        setVideoProgress(Math.min(99, currentProgress));
    }, 100);

    try {
        const downloadUri = await generateVideoFromImage(image.base64, image.mimeType, style);
        
        if (downloadUri && process.env.API_KEY) {
            const fullVideoUrl = `${downloadUri}&key=${process.env.API_KEY}`;
            
            if (videoStatusIntervalRef.current) clearInterval(videoStatusIntervalRef.current);
            setVideoStatusMessage("Downloading your animation...");

            const response = await fetch(fullVideoUrl);
            if (!response.ok) {
              const errorText = await response.text();
              console.error("Video fetch error:", errorText);
              throw new Error(`Failed to download video: ${response.status} ${response.statusText}`);
            }
            const videoBlob = await response.blob();
            const objectUrl = URL.createObjectURL(videoBlob);
            setGeneratedVideoBlob(videoBlob);
            setGeneratedVideoUrl(objectUrl);
            setVideoProgress(100); // Mark progress as complete

            // Now, generate caption
            setVideoStatusMessage("Writing a witty caption...");
            const imagePart = base64ToGenerativePart(image.base64, image.mimeType);
            const caption = await generateCaptionForVideo(imagePart, petName, petHandle, petGender);
            setGeneratedVideoCaption(caption);

        } else if (!process.env.API_KEY) {
             throw new Error("API key is not available to fetch the video.");
        } else {
            throw new Error("Video generation failed to return a valid URL.");
        }
    } catch (err) {
        console.error(err);
        setVideoError(err instanceof Error ? err.message : 'An unknown error occurred while creating the video.');
    } finally {
        if (videoStatusIntervalRef.current) clearInterval(videoStatusIntervalRef.current);
        if (videoProgressIntervalRef.current) clearInterval(videoProgressIntervalRef.current);
        
        // Only set generating to false if there was an error.
        // If successful, the modal is shown, and `isGeneratingVideo` stays true until it's closed.
        if (videoError) {
          setIsGeneratingVideo(false);
          setVideoStatusMessage('');
        }
    }
  }, [generatedVideoUrl, petName, petHandle, petGender]);
  
    const handleGenerateMockup = useCallback(async (logoImage: GeneratedImage) => {
    if (petFiles.length === 0) {
        setError('The original pet photo is missing. Please re-upload.');
        return;
    }

    scrollToResults();
    setIsLoading(true);
    setStatusMessage('Stitching your mockup...');
    setError(null);

    try {
        const dogImagePart = await fileToGenerativePart(petFiles[0]);
        const logoImagePart = base64ToGenerativePart(logoImage.base64, logoImage.mimeType);

        const result = await createApparelMockup(dogImagePart, logoImagePart, petName, petHandle, petGender);
        
        if (result) {
            setGeneratedImages(prev => [...(prev || []), result]);
        } else {
            throw new Error("The model failed to create a mockup. Please try again.");
        }
    } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred while creating the mockup.');
    } finally {
        setIsLoading(false);
        setStatusMessage('');
    }
}, [petFiles, petName, petHandle, petGender, scrollToResults]);

  const handleCloseVideoModal = () => {
    if (generatedVideoUrl) {
        URL.revokeObjectURL(generatedVideoUrl);
    }
    setGeneratedVideoUrl(null);
    setVideoError(null);
    setGeneratedVideoBlob(null);
    setGeneratedVideoCaption(null);
    setIsGeneratingVideo(false); // Make sure to turn off the loading state
    setVideoProgress(0);
  };

  const handleOpenColoringStudio = useCallback((image: GeneratedImage) => {
    setColoringStudioImage(image);
  }, []);

  const handleGenerateColoredImages = useCallback(async (
    sourceImage: GeneratedImage,
    style: string,
    outputType: 'flat' | 'mockup',
    scene: string,
    count: number,
    coloringProgress: string,
    artistSkill: string
  ): Promise<GeneratedImage[]> => {
    
    const imagePart = base64ToGenerativePart(sourceImage.base64, sourceImage.mimeType);
    const results: GeneratedImage[] = [];

    // Use a Promise.all for concurrent generation.
    const generationPromises = Array.from({ length: count }).map(() => 
      colorInImage(imagePart, style, outputType, scene, petName, petHandle, petGender, coloringProgress, artistSkill)
    );

    const settledResults = await Promise.allSettled(generationPromises);

    settledResults.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
            results.push(result.value);
        } else if (result.status === 'rejected') {
            console.error("A coloring generation failed:", result.reason);
        }
    });

    return results;
  }, [petName, petHandle, petGender]);


  const handleCaptionChange = useCallback((index: number, newCaption: string) => {
    setGeneratedImages(prevImages => {
      if (!prevImages) return null;
      const newImages = [...prevImages];
      if (newImages[index]) {
        newImages[index] = { ...newImages[index], caption: newCaption };
      }
      return newImages;
    });
  }, []);

  const handleVideoCaptionChange = useCallback((newCaption: string) => {
    setGeneratedVideoCaption(newCaption);
  }, []);

  const handleGenerateAIDog = useCallback(async (options: { isCustom: boolean }) => {
    if (options.isCustom && !customAiDogBreed.trim()) {
        setError("Please enter a breed for your custom dog.");
        return;
    }

    setIsGeneratingAIDog(true);
    setError(null);
    setPetFiles([]);
    setPetName('');
    setPetHandle('');
    
    try {
        const concept = options.isCustom 
            ? await generateAIDogConcept(customAiDogBreed.trim(), customAiDogColor.trim())
            : await generateAIDogConcept();

        const dogImage = await generateAIDogImage(concept.imagePrompt);

        if (dogImage) {
            const dogFile = base64ToFile(dogImage.base64, dogImage.mimeType, `${concept.name.toLowerCase().replace(/\s+/g, '-')}.png`);
            setPetFiles([dogFile]);
            setPetName(concept.name);
            setPetHandle(concept.handle);
            // Hide and clear the creator after successful generation
            setShowCustomDogCreator(false);
            setCustomAiDogBreed('');
            setCustomAiDogColor('');
        } else {
            throw new Error("Failed to generate the AI dog's portrait.");
        }
    } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred while creating the AI dog.');
    } finally {
        setIsGeneratingAIDog(false);
    }
  }, [customAiDogBreed, customAiDogColor]);

  const totalThemesSelected = (customTheme.trim() ? 1 : 0) + selectedThemes.length;
  
  const isLogoRandomMode = selectedThemes.includes(LOGO_RANDOM_VALUE);
  const hasLogoThemeSelected = selectedThemes.some(prompt => {
      const theme = themes.find(t => t.prompt === prompt);
      return theme?.category === 'logo';
  }) || isLogoRandomMode;
  
  const hasActivityThemeSelected = selectedThemes.some(prompt => {
      const theme = themes.find(t => t.prompt === prompt);
      return theme?.category === 'activity';
  });

  let nameInputTitle = "2. Name Your Star";
  let nameInputPlaceholder = "Pet's Name (e.g., Fido)";
  let nameInputIsOptional = true;

  if (isSportscardMode) {
      nameInputTitle = "2. Player Name for Card";
      nameInputPlaceholder = "Player Name (e.g., 'Air Bud')";
      nameInputIsOptional = false;
  } else if (isMoviePosterMode) {
      nameInputTitle = "2. Movie Star's Name";
      nameInputPlaceholder = "Star's Name (e.g., 'Leonardo DiCorgio')";
      nameInputIsOptional = false;
  } else if (hasLogoThemeSelected) {
      nameInputTitle = "2. Enter Brand Name";
      nameInputPlaceholder = "Brand Name (e.g., Fido's Fine Wares)";
      nameInputIsOptional = false;
  } else if (hasActivityThemeSelected) {
      nameInputTitle = "2. Pet's Name";
      nameInputPlaceholder = "Pet's Name (Required for Activities)";
      nameInputIsOptional = false;
  }


  return (
    <div className="min-h-screen text-slate-800 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      {isGeneratingVideo && <VideoLoadingModal statusMessage={videoStatusMessage} progress={videoProgress} />}
      {(generatedVideoUrl || videoError) && (
        <VideoPreviewModal 
            videoUrl={generatedVideoUrl}
            videoBlob={generatedVideoBlob}
            caption={generatedVideoCaption} 
            onCaptionChange={handleVideoCaptionChange}
            error={videoError} 
            onClose={handleCloseVideoModal} 
        />
      )}
      {coloringStudioImage && (
        <ColoringStudioModal
          sourceImage={coloringStudioImage}
          onClose={() => setColoringStudioImage(null)}
          onGenerate={handleGenerateColoredImages}
          onGenerateVideo={handleGenerateVideo}
          isGeneratingVideo={isGeneratingVideo}
        />
      )}
      
      <div className="w-full max-w-6xl mx-auto">
        <Header />

        <main className="mt-8 bg-paper-texture sketch-border sketch-shadow p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="flex flex-col space-y-8 md:col-span-1">
            
            <div>
              <h2 className="text-2xl sm:text-3xl font-header text-colored-in mb-3">1. Add Your Pet(s)</h2>
              <ImageUploader 
                onFilesChange={setPetFiles} 
                files={petFiles}
                imagePreviews={petPreviews} 
                maxFiles={MAX_PET_FILES} 
                id="pet-uploader"
                label="Upload photos of one or more pets"
              />
              <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t-2 border-dashed border-slate-300"></div>
                  <span className="flex-shrink mx-4 text-slate-500 font-bold">OR</span>
                  <div className="flex-grow border-t-2 border-dashed border-slate-300"></div>
              </div>
               <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleGenerateAIDog({ isCustom: false })}
                    disabled={isLoading || isGeneratingAIDog}
                    className="w-full flex justify-center items-center font-header text-lg py-3 px-4 sketch-button interactive-wiggle-hover bg-crayon-violet text-white focus:outline-none transition-all duration-300 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                  >
                    Surprise Me! 🪄
                  </button>
                  <button
                    onClick={() => setShowCustomDogCreator(!showCustomDogCreator)}
                    disabled={isLoading || isGeneratingAIDog}
                    className={`w-full flex justify-center items-center font-header text-lg py-3 px-4 sketch-button interactive-wiggle-hover focus:outline-none transition-all duration-300 disabled:bg-slate-300 disabled:cursor-not-allowed ${
                      showCustomDogCreator ? 'bg-crayon-amber text-slate-900' : 'bg-white text-slate-700'
                    }`}
                  >
                    Create My Own... 🎨
                  </button>
                </div>

                {showCustomDogCreator && (
                  <div className="p-4 bg-amber-50/50 sketch-border animate-[fade-in_0.3s_ease-out]">
                    <style>{`@keyframes fade-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                    <div className="space-y-3">
                      <div>
                        <label className="font-bold text-slate-700">Breed <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={customAiDogBreed}
                          onChange={(e) => setCustomAiDogBreed(e.target.value)}
                          placeholder="e.g., Golden Retriever, Fluffy Mutt"
                          className="w-full px-4 py-2 mt-1 bg-white sketch-input focus:ring-2 focus:ring-amber-400 outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700">Color & Markings <span className="text-slate-500 font-normal">(Optional)</span></label>
                        <input
                          type="text"
                          value={customAiDogColor}
                          onChange={(e) => setCustomAiDogColor(e.target.value)}
                          placeholder="e.g., White with brown spots"
                          className="w-full px-4 py-2 mt-1 bg-white sketch-input focus:ring-2 focus:ring-amber-400 outline-none"
                        />
                      </div>
                      <button
                        onClick={() => handleGenerateAIDog({ isCustom: true })}
                        disabled={isLoading || isGeneratingAIDog || !customAiDogBreed.trim()}
                        className="w-full flex justify-center items-center font-header text-lg py-3 px-4 sketch-button bg-crayon-amber text-slate-900 focus:outline-none transition-all duration-300 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                      >
                        Generate Custom Dog 🐾
                      </button>
                    </div>
                  </div>
                )}

                {isGeneratingAIDog && (
                  <div className="mt-2 text-center flex justify-center items-center text-slate-600 font-bold">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Dreaming up a dog...
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-header text-colored-in mb-3">
                {nameInputTitle}
                {nameInputIsOptional && <span className="font-normal text-slate-500 text-lg filter-none">(Optional)</span>}
              </h2>
               <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder={nameInputPlaceholder}
                className="w-full px-4 py-3 bg-white sketch-input focus:ring-2 focus:ring-amber-400 focus:border-amber-500 transition-shadow outline-none"
                aria-label={nameInputTitle}
               />
               <input
                type="text"
                value={petHandle}
                onChange={(e) => setPetHandle(e.target.value)}
                placeholder="Social Handle (e.g., @fidos_adventures)"
                className="mt-2 w-full px-4 py-3 bg-white sketch-input focus:ring-2 focus:ring-amber-400 focus:border-amber-500 transition-shadow outline-none"
                aria-label="Pet's social media handle"
               />
                <div className="mt-3 grid grid-cols-3 gap-2">
                    <button
                        onClick={() => setPetGender('boy')}
                        className={`py-2 px-2 text-sm font-bold sketch-button ${petGender === 'boy' ? 'bg-crayon-sky text-slate-900' : 'bg-white text-slate-600'}`}
                    >
                        Good Boy ♂
                    </button>
                    <button
                        onClick={() => setPetGender('girl')}
                        className={`py-2 px-2 text-sm font-bold sketch-button ${petGender === 'girl' ? 'bg-crayon-rose text-white' : 'bg-white text-slate-600'}`}
                    >
                        Good Girl ♀
                    </button>
                    <button
                        onClick={() => setPetGender('unspecified')}
                        className={`py-2 px-2 text-sm font-bold sketch-button ${petGender === 'unspecified' ? 'bg-crayon-amber text-slate-900' : 'bg-white text-slate-600'}`}
                    >
                        Just my dog
                    </button>
                </div>
               <p className="text-xs text-slate-500 mt-2 pl-1">Choose one to personalize captions!</p>
            </div>
            
            {(isSportscardMode || isMoviePosterMode || isHalloweenMode) && (
              <div className="animate-[fade-in_0.3s_ease-out]">
                  <style>{`@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }`}</style>
                  <h2 className="text-2xl sm:text-3xl font-header text-colored-in mb-3">3. Theme Options</h2>
                  <div className="p-3 bg-amber-50/50 sketch-border flex flex-col gap-2">
                    {isSportscardMode && (
                        <div className="flex flex-col gap-2">
                            <div>
                                <label htmlFor="team-name-input" className="font-bold text-slate-700">Team Name:</label>
                                <input
                                    id="team-name-input"
                                    type="text"
                                    value={teamName}
                                    onChange={e => setTeamName(e.target.value)}
                                    placeholder="e.g., The Yard Goats"
                                    className="mt-1 w-full px-3 py-2 bg-white sketch-input focus:ring-2 focus:ring-amber-400 focus:border-amber-500 transition-shadow outline-none"
                                />
                            </div>
                             <div>
                                <label htmlFor="sport-select" className="font-bold text-slate-700">Select a Sport:</label>
                                <select
                                id="sport-select"
                                value={sportscardSport}
                                onChange={e => setSportscardSport(e.target.value)}
                                className="mt-1 w-full px-3 py-2 bg-white sketch-input focus:ring-2 focus:ring-amber-400 focus:border-amber-500 transition-shadow outline-none"
                                >
                                <option value="" disabled>-- Choose Sport --</option>
                                {sportsForCard.map(sport => <option key={sport} value={sport}>{sport}</option>)}
                                </select>
                            </div>
                        </div>
                    )}
                     {isMoviePosterMode && (
                        <MoviePosterToggle value={moviePosterStyle} onChange={setMoviePosterStyle} />
                    )}
                    {isHalloweenMode && (
                        <HalloweenOptions 
                            value={halloweenCostume} 
                            onChange={setHalloweenCostume} 
                            suggestions={displayedHalloweenSuggestions} 
                            onShuffle={shuffleHalloweenSuggestions}
                            isRandomMode={isHalloweenRandomMode}
                            onRandomModeChange={setIsHalloweenRandomMode}
                        />
                    )}
                  </div>
              </div>
            )}
            
            <div>
                <h2 className="text-2xl sm:text-3xl font-header text-colored-in mb-3">4. Add a Product <span className="font-normal text-slate-500 text-lg filter-none">(Optional)</span></h2>
                <ImageUploader 
                    onFilesChange={setProductFiles}
                    files={productFiles}
                    imagePreviews={productPreviews}
                    maxFiles={MAX_PRODUCT_FILES}
                    id="product-uploader"
                    label="Upload a product to feature"
                />
            </div>
            
            <div>
                <h2 className="text-2xl sm:text-3xl font-header text-colored-in mb-3">5. Add Logos <span className="font-normal text-slate-500 text-lg filter-none">(Optional)</span></h2>
                <ImageUploader 
                    onFilesChange={setLogoFiles}
                    files={logoFiles}
                    imagePreviews={logoPreviews}
                    maxFiles={MAX_LOGO_FILES}
                    id="logo-uploader"
                    label="Upload up to 4 logos to include"
                />
            </div>
            
            <div>
                <h2 className="text-2xl sm:text-3xl font-header text-colored-in mb-3">6. How Many Pages?</h2>
                <NumberOfImagesSlider value={numberOfImages} onChange={setNumberOfImages} />
            </div>

            <div className="text-center my-4 p-4 bg-emerald-50/50 sketch-border border-emerald-300 border-2 border-dashed">
              <button
                onClick={handleEasyButtonClick}
                disabled={isLoading || petFiles.length === 0 || isSportscardMode || isMoviePosterMode || isHalloweenMode || isCustomFoodMode}
                className="w-full flex justify-center items-center font-header text-2xl sm:text-3xl py-4 px-4 sketch-button interactive-wiggle-hover bg-crayon-emerald cta-glow focus:outline-none transition-all duration-300 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none disabled:opacity-60"
              >
                The Easy Button ✨
              </button>
              <p className="mt-3 text-slate-600 font-bold">
                Click here to generate a random selection of our fun standard themes!
              </p>
            </div>
            
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t-2 border-dashed border-slate-300"></div>
              <span className="flex-shrink mx-4 text-slate-500 font-bold">OR</span>
              <div className="flex-grow border-t-2 border-dashed border-slate-300"></div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-header text-colored-in mb-3">Pick Fun Themes</h2>
              <ThemeSelector 
                selectedThemes={selectedThemes} 
                onThemesChange={setSelectedThemes}
                customTheme={customTheme}
                onCustomThemeChange={setCustomTheme}
                isCustomFoodMode={isCustomFoodMode}
                customFood={customFood}
                onCustomFoodChange={setCustomFood}
              />
            </div>

            <GenerateButton
              onClick={handleGenerateClick}
              isLoading={isLoading}
              disabled={petFiles.length === 0 || totalThemesSelected === 0}
            />
          </div>

          <div className="flex flex-col md:col-span-2" ref={resultsRef}>
            <h2 className="text-2xl sm:text-3xl font-header text-colored-in mb-3">Your Coloring Page</h2>
            <ResultDisplay
              isLoading={isLoading}
              statusMessage={statusMessage}
              error={error}
              generatedImages={generatedImages}
              onCaptionChange={handleCaptionChange}
              progress={progress}
              isStoryMode={isStoryMode}
              onStartStory={handleStartStory}
              storyChoices={storyChoices}
              onChoiceSelected={handleStoryChoice}
              isGeneratingChoices={isGeneratingChoices}
              petName={petName}
              onGenerateVideo={handleGenerateVideo}
              isGeneratingVideo={isGeneratingVideo}
              onGenerateMockup={handleGenerateMockup}
              onColorItIn={handleOpenColoringStudio}
            />
          </div>
        </main>
        <footer className="text-center text-md text-slate-600 mt-8">
          <p className="font-bold">Created with love for our furry friends.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
