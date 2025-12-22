
import React, { useState } from 'react';
// FIX: Imported 'Theme' type from '../types' instead of '../themes' to fix a circular dependency error.
import { Theme } from '../types';
import { 
    themes, 
    standardThemeCategories, 
    cannabisThemes, 
    logoThemeCategories, 
    specialOccasionThemes, 
    RANDOM_THEME_VALUE, 
    CANNABIS_RANDOM_VALUE, 
    SPORTS_CARD_VALUE, 
    LOGO_RANDOM_VALUE, 
    MOVIE_POSTER_VALUE,
    HALLOWEEN_VALUE,
    CUSTOM_FOOD_VALUE,
    activityThemes,
    createCategoryRandomValue
} from '../themes';

interface ThemeSelectorProps {
  selectedThemes: string[];
  onThemesChange: (themes: string[]) => void;
  customTheme: string;
  onCustomThemeChange: (theme: string) => void;
  isCustomFoodMode: boolean;
  customFood: string;
  onCustomFoodChange: (food: string) => void;
}

const CheckmarkIcon = () => (
    <div className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 sketch-border border-2 border-slate-800 animate-scale-in shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-800" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
    </div>
);


const SparkleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block -mt-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v2.586l1.293-1.293a1 1 0 111.414 1.414L12.414 8H15a1 1 0 110 2h-2.586l1.293 1.293a1 1 0 11-1.414 1.414L11 11.414V14a1 1 0 11-2 0v-2.586l-1.293 1.293a1 1 0 11-1.414-1.414L7.586 10H5a1 1 0 110 2h2.586L6.293 6.707a1 1 0 111.414-1.414L9 6.586V4a1 1 0 011-1zM3 10a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1zm14 0a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm-7-7a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm0 14a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
);

const HalloweenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 9a1 1 0 011-1h2a1 1 0 110 2H5a1 1 0 01-1-1zm12 0a1 1 0 00-1 1h-2a1 1 0 100-2h2a1 1 0 001 1zM3.5 13a1.5 1.5 0 000 3h13a1.5 1.5 0 000-3H13v-1a1 1 0 10-2 0v1H9v-1a1 1 0 10-2 0v1H3.5zM10 4c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8z" clipRule="evenodd" />
    </svg>
);

const BirthdayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
    </svg>
);

const MemorialIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 4a4 4 0 00-4-1 4 4 0 00-4 1" />
    </svg>
);

const SportsCardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
        <path d="M11 9a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
);

const MoviePosterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm1 2.293A1 1 0 016.707 5h6.586a1 1 0 01.707 1.707l-3.293 3.293a1 1 0 01-1.414 0L5 6.707a1 1 0 010-1.414zM5 12a1 1 0 100 2h10a1 1 0 100-2H5z" clipRule="evenodd" />
    </svg>
);


const CannabisIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 3.5c-4.14 0-7.5 3.36-7.5 7.5S5.86 18.5 10 18.5s7.5-3.36 7.5-7.5-3.36-7.5-7.5-7.5zm0 13c-3.03 0-5.5-2.47-5.5-5.5S6.97 5.5 10 5.5s5.5 2.47 5.5 5.5-2.47 5.5-5.5 5.5z" opacity=".1"/>
        <path d="M13.62 6.51l-3.5 3.51-3.62-3.62c-1.55 1.55-1.55 4.07 0 5.62l3.62-3.62 3.5 3.5c1.55-1.55 1.55-4.07 0-5.61zM10 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm4.24 12.24l-2.12-2.12-1.41 1.41 2.12 2.12c-1.17 1.17-3.07 1.17-4.24 0l2.12-2.12-2.12-2.12-2.12 2.12c-1.17-1.17-1.17-3.07 0-4.24l2.12 2.12 1.41-1.41-2.12-2.12c1.17-1.17 3.07-1.17 4.24 0l-2.12 2.12 2.12 2.12 2.12-2.12c1.17 1.17 1.17 3.07 0 4.24z"/>
    </svg>
);

const RemoveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);


const specialIcons: { [key: string]: React.ReactElement } = {
  "Happy Howl-o-ween": <HalloweenIcon />,
  "Happy Bark-day!": <BirthdayIcon />,
  "Rainbow Bridge Memorial": <MemorialIcon />,
  "Movie Poster Premiere": <MoviePosterIcon />,
};

const specialStyles: { [key: string]: string } = {
  "Happy Howl-o-ween": "bg-orange-100 border-orange-400 text-orange-800",
  "Happy Bark-day!": "bg-crayon-rose-light border-rose-400 text-rose-800",
  "Rainbow Bridge Memorial": "bg-crayon-sky-light border-sky-400 text-sky-800",
  "Movie Poster Premiere": "bg-crayon-violet/20 border-violet-400 text-violet-800",
};

const specialSelectedStyles: { [key: string]: string } = {
  "Happy Howl-o-ween": "bg-orange-500 border-orange-700 text-white",
  "Happy Bark-day!": "bg-crayon-rose border-rose-600 text-white",
  "Rainbow Bridge Memorial": "bg-crayon-sky border-sky-600 text-white",
  "Movie Poster Premiere": "bg-crayon-violet border-violet-600 text-white",
};

const specialDescriptions: { [key: string]: string } = {
  "Happy Howl-o-ween": "Create a spooky Halloween page with a custom costume!",
  "Happy Bark-day!": "Create a personalized birthday card coloring page.",
  "Rainbow Bridge Memorial": "A loving tribute for a friend who has crossed the Rainbow Bridge.",
  "Movie Poster Premiere": "Make your pet the star of their own blockbuster movie poster.",
};

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ selectedThemes, onThemesChange, customTheme, onCustomThemeChange, isCustomFoodMode, customFood, onCustomFoodChange }) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  
  const badgeStyles: { [key: string]: string } = {
    'Trending': 'bg-crayon-rose text-white',
    'Popular': 'bg-crayon-sky text-white',
    'Hot': 'bg-crayon-amber text-slate-800',
    'New': 'bg-crayon-emerald text-white',
    "@Charlies.CEO's favorite": 'bg-crayon-fuchsia text-white',
    "Dog's Favorite": 'bg-crayon-violet text-white',
    "Staff Pick": 'bg-slate-700 text-white',
    'Interactive': 'bg-crayon-teal text-white',
  };

  const isRandomSelected = selectedThemes.includes(RANDOM_THEME_VALUE);
  const isCannabisRandomSelected = selectedThemes.includes(CANNABIS_RANDOM_VALUE);
  const isLogoRandomSelected = selectedThemes.includes(LOGO_RANDOM_VALUE);
  const isSportscardSelected = selectedThemes.includes(SPORTS_CARD_VALUE);
  const isMoviePosterSelected = selectedThemes.includes(MOVIE_POSTER_VALUE);
  
  const handleThemeClick = (prompt: string) => {
    const isCurrentlySelected = selectedThemes.includes(prompt);
    let newThemes = [...selectedThemes];

    // These modes are mutually exclusive with any other selections.
    const fullyExclusiveModes = [SPORTS_CARD_VALUE, MOVIE_POSTER_VALUE, HALLOWEEN_VALUE, RANDOM_THEME_VALUE, CANNABIS_RANDOM_VALUE, CUSTOM_FOOD_VALUE];

    if (fullyExclusiveModes.includes(prompt)) {
        newThemes = isCurrentlySelected ? [] : [prompt];
    } else {
      // For any other theme, first clear out any fully exclusive modes.
      newThemes = newThemes.filter(t => !fullyExclusiveModes.includes(t));
      
      // Then, toggle the clicked theme.
      if (isCurrentlySelected) {
        newThemes = newThemes.filter(p => p !== prompt);
      } else {
        newThemes.push(prompt);
      }
    }
    onThemesChange(newThemes);
  };

  const handleRandomClick = (randomValue: string) => {
    const isSelected = selectedThemes.includes(randomValue);
    
    // Fully exclusive randomizers
    const exclusiveRandomizers = [RANDOM_THEME_VALUE, CANNABIS_RANDOM_VALUE];
    if (exclusiveRandomizers.includes(randomValue)) {
        onThemesChange(isSelected ? [] : [randomValue]);
        return;
    }
    
    // Non-exclusive randomizers (Logo, Category) can be toggled on/off.
    // They clear fully exclusive *modes* (like Sports Card) but can coexist with standard themes.
    let newThemes = [...selectedThemes];
    const fullyExclusiveModes = [SPORTS_CARD_VALUE, MOVIE_POSTER_VALUE, HALLOWEEN_VALUE, ...exclusiveRandomizers, CUSTOM_FOOD_VALUE];
    newThemes = newThemes.filter(t => !fullyExclusiveModes.includes(t));

    if (isSelected) {
        newThemes = newThemes.filter(p => p !== randomValue);
    } else {
        newThemes.push(randomValue);
    }
    onThemesChange(newThemes);
  };

  const handleRemoveStandardTheme = (promptToRemove: string) => {
      onThemesChange(selectedThemes.filter(p => p !== promptToRemove));
  };

  const handleCustomClick = () => {
    const newShowState = !showCustomInput;
    setShowCustomInput(newShowState);
    if (newShowState) {
        // Clear any mode that would prevent custom input
        const singleSelectionModes = [RANDOM_THEME_VALUE, CANNABIS_RANDOM_VALUE, SPORTS_CARD_VALUE, MOVIE_POSTER_VALUE, HALLOWEEN_VALUE, LOGO_RANDOM_VALUE, CUSTOM_FOOD_VALUE];
        onThemesChange(selectedThemes.filter(t => !singleSelectionModes.includes(t) && !t.startsWith('__RANDOM__')));
    } else {
        onCustomThemeChange(''); // Clear custom theme when closing
    }
  };
  
  const handleCategoryToggle = (categoryTitle: string) => {
    setOpenCategory(prev => prev === categoryTitle ? null : categoryTitle);
  };

  const isAnyCannabisThemeSelected = isCannabisRandomSelected || cannabisThemes.some(t => selectedThemes.includes(t.prompt));
  const isAnyLogoThemeSelected = isLogoRandomSelected || themes.some(t => t.category === 'logo' && selectedThemes.includes(t.prompt));
  const isAnyActivityThemeSelected = activityThemes.some(t => selectedThemes.includes(t.prompt));
  
  const selectedStandardThemes = selectedThemes
      .map(prompt => themes.find(t => t.prompt === prompt))
      .filter((theme): theme is Theme => !!(theme && !theme.isSpecial && theme.category !== 'cannabis' && theme.category !== 'logo'));

  const hasCategoryRandomizerSelected = selectedThemes.some(t => t.startsWith('__RANDOM__') && !isRandomSelected && !isCannabisRandomSelected && !isLogoRandomSelected);

  return (
    <div className="space-y-2">
      <details 
        className="bg-slate-50/50 sketch-border overflow-hidden"
        open={openCategory === 'special-occasions'}
      >
        <summary 
          className="font-header text-lg text-slate-800 p-3 cursor-pointer hover:bg-amber-100/50 flex justify-between items-center list-none"
          onClick={(e) => { e.preventDefault(); handleCategoryToggle('special-occasions'); }}
        >
          Special Occasions & Cards
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ${openCategory === 'special-occasions' ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </summary>
        <div className="p-4 border-t-2 border-dashed border-slate-300">
           <div className="grid grid-cols-1 gap-3">
            {specialOccasionThemes.map((theme) => {
              const isSelected = selectedThemes.includes(theme.prompt);
              return (
                <div key={theme.title} className="flex flex-col items-center">
                  <button
                    onClick={() => handleThemeClick(theme.prompt)}
                    className={`relative w-full h-24 col-span-1 p-2.5 text-center rounded-lg border-2 transition-all duration-200 sketch-shadow-sm flex items-center justify-center font-header text-lg interactive-wiggle-hover ${
                      isSelected
                        ? `${specialSelectedStyles[theme.title]} transform translate-x-px translate-y-px shadow-none`
                        : specialStyles[theme.title]
                    }`}
                  >
                    {specialIcons[theme.title]}
                    {theme.title}
                    {isSelected && <CheckmarkIcon />}
                  </button>
                  <p className="text-center text-xs text-slate-600 font-bold px-2 mt-1.5 h-8">
                    {specialDescriptions[theme.title]}
                  </p>
                </div>
              )
            })}
           </div>
        </div>
      </details>

      <details 
        className="bg-slate-50/50 sketch-border overflow-hidden"
        open={openCategory === 'activity-pages'}
      >
        <summary 
          className={`font-header text-lg p-3 cursor-pointer hover:bg-amber-100/50 flex justify-between items-center list-none transition-colors ${isAnyActivityThemeSelected ? 'text-emerald-700' : 'text-slate-800'}`}
          onClick={(e) => { e.preventDefault(); handleCategoryToggle('activity-pages'); }}
        >
          Activity Page
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ${openCategory === 'activity-pages' ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </summary>
        <div className="p-4 border-t-2 border-dashed border-slate-300">
          <p className="text-sm text-slate-600 mb-3">Combine this with any standard theme for a fun, interactive page! Requires pet's name.</p>
          <div className="flex justify-center">
            {activityThemes.map((theme) => {
              const isSelected = selectedThemes.includes(theme.prompt);
              return (
                <button
                  key={theme.title}
                  onClick={() => handleThemeClick(theme.prompt)}
                  className={`relative p-3 w-full max-w-xs text-center rounded-lg border-2 transition-all duration-200 sketch-shadow-sm h-full flex items-center justify-center gap-1.5 interactive-wiggle-hover text-lg font-header ${
                    isSelected
                      ? 'bg-crayon-emerald border-emerald-600 text-white font-bold transform translate-x-px translate-y-px shadow-none'
                      : 'bg-white border-emerald-400 hover:bg-emerald-100'
                  }`}
                >
                  {theme.title}
                  {isSelected && <CheckmarkIcon />}
                </button>
              );
            })}
          </div>
        </div>
      </details>

      <details 
        className="bg-slate-50/50 sketch-border overflow-hidden"
        open={openCategory === 'cannabis'}
      >
        <summary 
          className="font-header text-lg text-slate-800 p-3 cursor-pointer hover:bg-amber-100/50 flex justify-between items-center list-none"
          onClick={(e) => { e.preventDefault(); handleCategoryToggle('cannabis'); }}
        >
          <div className={`flex items-center transition-colors ${isAnyCannabisThemeSelected ? 'text-emerald-700' : ''}`}>
            <CannabisIcon />
            Dogs Smoking Weed (21+)
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ${openCategory === 'cannabis' ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </summary>
         <div className="p-4 border-t-2 border-dashed border-slate-300">
            <p className="text-sm text-slate-600 mb-3">For ages 21+. Explore hazy, hilarious themes for your 420-friendly pup.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                    onClick={() => handleRandomClick(CANNABIS_RANDOM_VALUE)}
                    className={`relative p-2 text-center rounded-lg border-2 transition-all duration-200 sketch-shadow-sm h-full flex items-center justify-center gap-1 interactive-wiggle-hover ${
                    isCannabisRandomSelected
                        ? 'bg-crayon-emerald border-emerald-600 text-white font-bold transform translate-x-px translate-y-px shadow-none'
                        : 'bg-white border-emerald-400 hover:bg-emerald-100'
                    }`}
                >
                    <SparkleIcon /> Random Vibe
                    {isCannabisRandomSelected && <CheckmarkIcon />}
                </button>
                {cannabisThemes.map((theme) => {
                const isSelected = selectedThemes.includes(theme.prompt);
                return (
                    <button
                    key={theme.title}
                    onClick={() => handleThemeClick(theme.prompt)}
                    className={`relative p-2 text-center rounded-lg border-2 transition-all duration-200 sketch-shadow-sm h-full interactive-wiggle-hover flex items-center justify-center gap-1.5 ${
                        isSelected
                        ? 'bg-crayon-emerald border-emerald-600 text-white font-bold transform translate-x-px translate-y-px shadow-none'
                        : 'bg-white border-emerald-400 hover:bg-emerald-100'
                    }`}
                    >
                      <span>{theme.title}</span>
                      {theme.badge && (
                          <span className={`px-1.5 py-0.5 text-[10px] leading-none font-bold rounded-md sketch-shadow-sm whitespace-nowrap ${badgeStyles[theme.badge] || 'bg-crayon-violet text-white'}`}>
                              {theme.badge}
                          </span>
                      )}
                      {isSelected && <CheckmarkIcon />}
                    </button>
                );
                })}
            </div>
        </div>
      </details>

      <details 
        className="bg-slate-50/50 sketch-border overflow-hidden"
        open={openCategory === 'logo-branding'}
      >
        <summary 
          className={`font-header text-lg p-3 cursor-pointer hover:bg-amber-100/50 flex justify-between items-center list-none transition-colors ${isAnyLogoThemeSelected ? 'text-violet-700' : 'text-slate-800'}`}
          onClick={(e) => { e.preventDefault(); handleCategoryToggle('logo-branding'); }}
        >
          Logo & Branding Themes
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ${openCategory === 'logo-branding' ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </summary>
        <div className="p-4 border-t-2 border-dashed border-slate-300 space-y-6">
          <p className="text-sm text-slate-600">Turn your pet into a professional brand! (Requires a brand name)</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                  onClick={() => handleRandomClick(LOGO_RANDOM_VALUE)}
                  className={`relative p-2 text-center rounded-lg border-2 transition-all duration-200 sketch-shadow-sm h-full flex items-center justify-center gap-1 interactive-wiggle-hover ${
                  isLogoRandomSelected
                      ? 'bg-crayon-violet border-violet-600 text-white font-bold transform translate-x-px translate-y-px shadow-none'
                      : 'bg-white border-violet-400 hover:bg-violet-100'
                  }`}
              >
                  <SparkleIcon /> Random Logo
                  {isLogoRandomSelected && <CheckmarkIcon />}
              </button>
          </div>

          {logoThemeCategories.map(category => (
            <div key={category.title} className="space-y-3">
              <h4 className="font-header text-lg text-slate-800 border-b-2 border-dashed border-slate-300 pb-1">{category.title}</h4>
              <p className="text-sm text-slate-500 -mt-2">{category.description}</p>
              {category.subcategories.map(subcategory => (
                <div key={subcategory.title}>
                  <h5 className="font-bold text-slate-700 text-sm">{subcategory.title}</h5>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {subcategory.themes.map(theme => {
                      const isSelected = selectedThemes.includes(theme.prompt);
                      return (
                        <button
                          key={theme.prompt}
                          onClick={() => handleThemeClick(theme.prompt)}
                          className={`relative p-2 text-sm text-center rounded-lg border-2 transition-all duration-200 sketch-shadow-sm h-full interactive-wiggle-hover flex items-center justify-center gap-1.5 ${
                            isSelected
                                ? 'bg-crayon-violet border-violet-600 text-white font-bold transform translate-x-px translate-y-px shadow-none'
                                : 'bg-white border-slate-400 hover:bg-violet-100'
                            }`}
                        >
                          <span>{theme.title}</span>
                          {theme.badge && (
                              <span className={`px-1.5 py-0.5 text-[10px] leading-none font-bold rounded-md sketch-shadow-sm whitespace-nowrap ${badgeStyles[theme.badge] || 'bg-crayon-violet text-white'}`}>
                                  {theme.badge}
                              </span>
                          )}
                          {isSelected && <CheckmarkIcon />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </details>

      <hr className="border-t-2 border-dashed border-slate-300 my-2" />
      <h3 className="text-xl font-header text-colored-in mb-2">Standard Themes</h3>

      {(selectedStandardThemes.length > 0 || hasCategoryRandomizerSelected) && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedThemes.map(prompt => {
              if(prompt.startsWith('__RANDOM__')) {
                const category = standardThemeCategories.find(c => createCategoryRandomValue(c.id!) === prompt);
                if (category) {
                  return (
                    <div key={prompt} className="flex items-center bg-amber-200/80 text-amber-900 text-sm font-bold px-3 py-1.5 rounded-lg sketch-border border-2 border-amber-400/80 animate-scale-in">
                      <span>Random: {category.title}</span>
                      <button onClick={() => handleRemoveStandardTheme(prompt)} className="ml-2 -mr-1 text-amber-900 hover:bg-amber-300/80 rounded-full p-0.5" aria-label={`Remove Random ${category.title}`}>
                        <RemoveIcon />
                      </button>
                    </div>
                  )
                }
              }
              const theme = themes.find(t => t.prompt === prompt && !t.isSpecial && t.category !== 'cannabis' && t.category !== 'logo');
              if (theme) {
                return (
                   <div key={theme.prompt} className="flex items-center bg-amber-200/80 text-amber-900 text-sm font-bold px-3 py-1.5 rounded-lg sketch-border border-2 border-amber-400/80 animate-scale-in">
                    <span>{theme.title}</span>
                    {theme.badge && (
                        <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-md sketch-shadow-sm whitespace-nowrap ${badgeStyles[theme.badge] || 'bg-crayon-violet text-white'}`}>
                            {theme.badge}
                        </span>
                    )}
                    <button onClick={() => handleRemoveStandardTheme(theme.prompt)} className="ml-2 -mr-1 text-amber-900 hover:bg-amber-300/80 rounded-full p-0.5" aria-label={`Remove ${theme.title}`}>
                      <RemoveIcon />
                    </button>
                  </div>
                )
              }
              return null;
            })}
          </div>
      )}
      
       <div className="space-y-2 mb-4">
          {standardThemeCategories.map(category => (
            <details 
              key={category.id} 
              className="bg-slate-50/50 sketch-border overflow-hidden"
              open={openCategory === category.title}
            >
              <summary 
                className="font-header text-lg text-slate-800 p-3 cursor-pointer hover:bg-amber-100/50 flex justify-between items-center list-none"
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryToggle(category.title);
                }}
              >
                {category.title}
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ${openCategory === category.title ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </summary>
              <div className="p-4 border-t-2 border-dashed border-slate-300 space-y-4">
                <button
                    onClick={() => handleRandomClick(createCategoryRandomValue(category.id!))}
                    className={`relative w-full p-2 text-center rounded-lg border-2 transition-all duration-200 sketch-shadow-sm flex items-center justify-center gap-1 font-bold interactive-wiggle-hover ${
                      selectedThemes.includes(createCategoryRandomValue(category.id!))
                        ? 'bg-crayon-amber border-amber-600 text-slate-900'
                        : 'bg-white border-amber-400 hover:bg-amber-100'
                    }`}
                >
                    <SparkleIcon /> Randomize This Category
                    {selectedThemes.includes(createCategoryRandomValue(category.id!)) && <CheckmarkIcon />}
                </button>
                
                {category.id === 'dogs-eating-food' ? (
                  <>
                    {category.subcategories.map(subcategory => (
                      <div key={subcategory.title}>
                        <h4 className="font-bold text-slate-700">{subcategory.title}</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {subcategory.themes
                            .filter(theme => theme.prompt !== CUSTOM_FOOD_VALUE) // Render normal themes as buttons
                            .map(theme => {
                              const isSelected = selectedThemes.includes(theme.prompt);
                              return (
                                <button
                                  key={theme.prompt}
                                  onClick={() => handleThemeClick(theme.prompt)}
                                  className={`relative p-2 text-sm text-center rounded-lg border-2 transition-all duration-200 sketch-shadow-sm h-full interactive-wiggle-hover flex items-center justify-center gap-1.5 ${
                                    isSelected
                                      ? 'bg-crayon-amber border-amber-600 text-slate-900 font-bold transform translate-x-px translate-y-px shadow-none'
                                      : 'bg-white border-slate-400 hover:bg-amber-100'
                                  }`}
                                >
                                  <span>{theme.title}</span>
                                  {isSelected && <CheckmarkIcon />}
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    ))}
                    <div className="mt-4 pt-4 border-t-2 border-dashed border-slate-300">
                      <div className={`p-3 rounded-lg border-2 transition-all duration-200 sketch-shadow-sm ${isCustomFoodMode ? 'bg-amber-100 border-amber-500' : 'bg-white border-slate-400'}`}>
                        <label htmlFor="custom-food-input" className="font-bold text-slate-700 text-lg text-center block mb-2 font-header">
                          <span className="text-2xl inline-block -mt-1 mr-2 animate-pulse-subtle">🎨</span> Create Your Own Feast...
                        </label>
                        <input
                          id="custom-food-input"
                          type="text"
                          value={customFood}
                          onChange={(e) => {
                            onCustomFoodChange(e.target.value);
                            if (!isCustomFoodMode) {
                              onThemesChange([CUSTOM_FOOD_VALUE]);
                            }
                          }}
                          onFocus={() => {
                            if (!isCustomFoodMode) {
                              onThemesChange([CUSTOM_FOOD_VALUE]);
                            }
                          }}
                          placeholder="e.g., a mountain of pup-peroni"
                          className="w-full px-3 py-2 bg-white sketch-input focus:ring-2 focus:ring-amber-400 outline-none text-center"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  category.subcategories.map(subcategory => (
                    <div key={subcategory.title}>
                      <h4 className="font-bold text-slate-700">{subcategory.title}</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {subcategory.themes.map(theme => {
                          const isSelected = selectedThemes.includes(theme.prompt);
                          return (
                            <button
                              key={theme.prompt}
                              onClick={() => handleThemeClick(theme.prompt)}
                              className={`relative p-2 text-sm text-center rounded-lg border-2 transition-all duration-200 sketch-shadow-sm h-full interactive-wiggle-hover flex items-center justify-center gap-1.5 ${
                                isSelected
                                  ? 'bg-crayon-amber border-amber-600 text-slate-900 font-bold transform translate-x-px translate-y-px shadow-none'
                                  : 'bg-white border-slate-400 hover:bg-amber-100'
                              }`}
                            >
                              <span>{theme.title}</span>
                              {theme.badge && (
                                  <span className={`px-1.5 py-0.5 text-[10px] leading-none font-bold rounded-md sketch-shadow-sm whitespace-nowrap ${badgeStyles[theme.badge] || 'bg-crayon-violet text-white'}`}>
                                      {theme.badge}
                                  </span>
                              )}
                              {isSelected && <CheckmarkIcon />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </details>
          ))}
       </div>

      <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleRandomClick(RANDOM_THEME_VALUE)}
            disabled={isSportscardSelected || isMoviePosterSelected}
            className={`relative p-2 text-center rounded-lg border-2 transition-all duration-200 sketch-shadow-sm h-full flex items-center justify-center gap-1 interactive-wiggle-hover disabled:opacity-60 disabled:cursor-not-allowed ${
              isRandomSelected
                ? 'bg-crayon-amber border-amber-600 text-slate-900 font-bold transform translate-x-px translate-y-px shadow-none'
                : 'bg-white border-slate-400 hover:bg-amber-100 hover:border-amber-400'
            }`}
          >
            <SparkleIcon /> Randomizer (All)
          </button>
          <button
            onClick={handleCustomClick}
            disabled={isSportscardSelected || isMoviePosterSelected}
            className={`p-2 text-center rounded-lg border-2 transition-all duration-200 sketch-shadow-sm interactive-wiggle-hover disabled:opacity-60 disabled:cursor-not-allowed ${
              showCustomInput || customTheme
                ? 'bg-crayon-amber border-amber-600 text-slate-900 font-bold transform translate-x-px translate-y-px shadow-none'
                : 'bg-white border-slate-400 hover:bg-amber-100 hover:border-amber-400'
            }`}
          >
            Custom...
          </button>
        </div>


      {showCustomInput && (
        <input
          type="text"
          value={customTheme}
          onChange={(e) => onCustomThemeChange(e.target.value)}
          placeholder="e.g., 'a superhero in space'"
          className="w-full px-4 py-3 bg-white sketch-input focus:ring-2 focus:ring-amber-400 focus:border-amber-500 transition-shadow outline-none mt-4"
          aria-label="Custom theme input"
        />
      )}
    </div>
  );
};
