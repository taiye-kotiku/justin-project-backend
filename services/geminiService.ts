import { GoogleGenAI, Modality, Type } from "@google/genai";
import { GeneratedImage, GenerativePart, AIDogConcept } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * A helper function to introduce a delay.
 * @param ms Milliseconds to wait.
 */
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));


/**
 * Parses a potential API error to extract a user-friendly message.
 * @param error The error object caught from an API call.
 * @returns A new Error with a cleaner message.
 */
const handleApiError = (error: unknown): Error => {
  console.error("Gemini API Error:", error);
  if (error instanceof Error) {
    try {
      // The error message from the SDK might be a string containing a JSON object.
      // e.g., "[429 Too Many Requests] {"error":{"message":"...","code":429}}"
      const jsonStartIndex = error.message.indexOf('{');
      if (jsonStartIndex !== -1) {
        const jsonString = error.message.substring(jsonStartIndex);
        const parsedError = JSON.parse(jsonString);
        if (parsedError.error && parsedError.error.message) {
          return new Error(parsedError.error.message);
        }
      }
    } catch (e) {
      // Parsing failed, it's not the format we expected.
      // We'll fall through and return the original error message.
    }
    return error; // Return the original error if parsing is not possible.
  }
  return new Error('An unknown error occurred during an API call.');
};

/**
 * Optimizes a user's theme into a more detailed prompt for the image editing model.
 * @param theme The user-provided theme.
 * @returns An optimized prompt string.
 */
export const optimizePrompt = async (theme: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `A user wants to create a coloring book page of their pet(s) with a specific theme. Your task is to take their simple theme and expand it into a rich, descriptive, and imaginative prompt snippet suitable for an image generation AI. The goal is to inspire a visually interesting and fun coloring page.
      
      User's theme: "${theme}"
      
      Optimized prompt snippet:`,
      config: {
        temperature: 0.8,
        maxOutputTokens: 100,
      }
    });
    const optimizedText = response.text;
    return optimizedText ? optimizedText.trim() : theme;
  } catch (error) {
    console.error("Error optimizing prompt:", error);
    // Fallback to the original theme if optimization fails
    return theme;
  }
};

/**
 * Generates an engaging social media caption for a given coloring page image.
 * @param imagePart The generated image as a GenerativePart.
 * @param petName The optional name of the pet.
 * @param petHandle The optional social media handle of the pet.
 * @param petGender The optional gender of the pet.
 * @returns A promise that resolves to a caption string.
 */
const generateCaptionForImage = async (imagePart: GenerativePart, petName?: string, petHandle?: string, petGender?: string): Promise<string> => {
    try {
        let starringLine = '';
        if (petHandle?.trim()) {
            let handle = petHandle.trim();
            if (!handle.startsWith('@')) {
                handle = '@' + handle;
            }
            starringLine = `Starring the one and only ${handle}! 🌟`;
        } else if (petName?.trim()) {
            starringLine = `Starring the one and only ${petName.trim()}! 🌟`;
        }
        
        let genderInstruction = '';
        if (petGender === 'boy') {
            genderInstruction = "When describing the dog, refer to them as a 'good boy' and use male pronouns (he/him).";
        } else if (petGender === 'girl') {
            genderInstruction = "When describing the dog, refer to them as a 'good girl' and use female pronouns (she/her).";
        }

        const prompt = `You are a fun, witty social media manager for @dogcoloringbooks. Analyze the provided coloring book page image. Write an exciting and engaging social media caption.
${genderInstruction}
The caption MUST be formatted with double line breaks for readability on social media. Follow this exact structure:

1.  **Opener:** A short, fun, creative sentence describing the scene in the image. Use relevant, fun emojis.
2.  **Blank Line:** A double newline.
3.  **Starring Credit:** ${starringLine ? `Include this line exactly: "${starringLine}"` : 'Do not include a starring credit.'}
4.  **Blank Line:** A double newline.
5.  **Main Call to Action:** Include this text block exactly as written, with its internal line breaks:
    "Turn your own dog into a 32-page print-on-demand coloring book! The perfect gift for dog lovers. 
    🎁 Sign up to try it first at www.dogcoloringbooks.com! 
    🚀 Launching mid-November."
6.  **Blank Line:** A double newline.
7.  **Creator Credits:** End with this exact text block, with its internal line break:
    "Created by @justgurian.ai & @quinngolds. 
    Follow @dogcoloringbooks for more! 🎨🐶"`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, { text: prompt }] },
            config: { temperature: 0.7 }
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error generating caption:", error);
        // Return a generic but functional fallback caption
        return `Look at this amazing coloring page! 🐶🎨\n\nTurn your own dog into a 32-page print-on-demand coloring book! The perfect gift for dog lovers.\n🎁 Sign up to try it first at www.dogcoloringbooks.com!\n🚀 Launching mid-November.\n\nCreated by @justgurian.ai & @quinngolds.\nFollow @dogcoloringbooks for more! 🎨🐶`;
    }
};

/**
 * Generates an engaging social media caption for a product mockup image.
 * @param imagePart The generated image as a GenerativePart.
 * @param petName The optional name of the pet.
 * @param petHandle The optional social media handle of the pet.
 * @param petGender The optional gender of the pet.
 * @returns A promise that resolves to a caption string.
 */
const generateCaptionForMockup = async (imagePart: GenerativePart, petName?: string, petHandle?: string, petGender?: string): Promise<string> => {
    try {
        let starringLine = '';
        if (petHandle?.trim()) {
            let handle = petHandle.trim();
            if (!handle.startsWith('@')) {
                handle = '@' + handle;
            }
            starringLine = `Starring the one and only ${handle}! 🌟`;
        } else if (petName?.trim()) {
            starringLine = `Starring the one and only ${petName.trim()}! 🌟`;
        }
        
        let genderInstruction = '';
        if (petGender === 'boy') {
            genderInstruction = "When describing the dog, refer to them as a 'good boy' and use male pronouns (he/him).";
        } else if (petGender === 'girl') {
            genderInstruction = "When describing the dog, refer to them as a 'good girl' and use female pronouns (she/her).";
        }

        const prompt = `You are a fun, witty social media manager for @dogcoloringbooks. Analyze the provided product mockup image of a dog wearing a hoodie with a logo. Write an exciting and engaging social media caption.
${genderInstruction}
The caption MUST be formatted with double line breaks for readability on social media. Follow this exact structure:

1.  **Opener:** A short, fun, creative sentence describing the mockup (e.g., "New merch drop!"). Use relevant, fun emojis.
2.  **Blank Line:** A double newline.
3.  **Starring Credit:** ${starringLine ? `Include this line exactly: "${starringLine}"` : 'Do not include a starring credit.'}
4.  **Blank Line:** A double newline.
5.  **Main Call to Action:** Include this text block exactly as written, with its internal line breaks:
    "Turn your own dog into a brand! Create logos and mockups for your 32-page print-on-demand coloring book! 
    🎁 Sign up to try it first at www.dogcoloringbooks.com! 
    🚀 Launching mid-November."
6.  **Blank Line:** A double newline.
7.  **Creator Credits:** End with this exact text block, with its internal line break:
    "Created by @justgurian.ai & @quinngolds. 
    Follow @dogcoloringbooks for more! 🎨🐶"`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, { text: prompt }] },
            config: { temperature: 0.7 }
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error generating mockup caption:", error);
        // Fallback
        return `Check out this new hoodie! 🔥\n\nTurn your own dog into a brand! Create logos and mockups for your 32-page print-on-demand coloring book!\n🎁 Sign up to try it first at www.dogcoloringbooks.com!\n🚀 Launching mid-November.\n\nCreated by @justgurian.ai & @quinngolds.\nFollow @dogcoloringbooks for more! 🎨🐶`;
    }
};


/**
 * Generates an engaging social media caption for an animated video based on its source image.
 * @param imagePart The source image as a GenerativePart.
 * @param petName The optional name of the pet.
 * @param petHandle The optional social media handle of the pet.
 * @param petGender The optional gender of the pet.
 * @returns A promise that resolves to a caption string.
 */
export const generateCaptionForVideo = async (imagePart: GenerativePart, petName?: string, petHandle?: string, petGender?: string): Promise<string> => {
    try {
        let starringLine = '';
        if (petHandle?.trim()) {
            let handle = petHandle.trim();
            if (!handle.startsWith('@')) {
                handle = '@' + handle;
            }
            starringLine = `Starring the one and only ${handle}! 🌟`;
        } else if (petName?.trim()) {
            starringLine = `Starring the one and only ${petName.trim()}! 🌟`;
        }
        
        let genderInstruction = '';
        if (petGender === 'boy') {
            genderInstruction = "When describing the dog, refer to them as a 'good boy' and use male pronouns (he/him).";
        } else if (petGender === 'girl') {
            genderInstruction = "When describing the dog, refer to them as a 'good girl' and use female pronouns (she/her).";
        }
        
        const prompt = `You are a fun, witty social media manager for @dogcoloringbooks. An image was just animated into a fun video.
Based on the provided source image, write an exciting and engaging social media caption for the resulting VIDEO, perfect for TikTok/Reels.
${genderInstruction}
The caption MUST be formatted with double line breaks for readability. Follow this exact structure:

1.  **Opener:** A short, fun, creative sentence imagining what's happening in the animation. Use relevant, fun emojis.
2.  **Blank Line:** A double newline.
3.  **Starring Credit:** ${starringLine ? `Include this line exactly: "${starringLine}"` : 'Do not include a starring credit.'}
4.  **Blank Line:** A double newline.
5.  **Main Call to Action:** Include this text block exactly as written, with its internal line breaks:
    "Turn your own dog into a 32-page print-on-demand coloring book! The perfect gift for dog lovers. 
    🎁 Sign up to try it first at www.dogcoloringbooks.com! 
    🚀 Launching mid-November."
6.  **Blank Line:** A double newline.
7.  **Creator Credits & Hashtags:** End with this exact text block, with its internal line break:
    "Created by @justgurian.ai & @quinngolds. 
    Follow @dogcoloringbooks for more! ✨ #dogcoloringbook #petanimation #aiart #veo #customgift #doglovergift"`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, { text: prompt }] },
            config: { temperature: 0.75 }
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error generating video caption:", error);
        // Fallback
        return `Watch this coloring page come to life! 🐶🎬\n\nTurn your own dog into a 32-page print-on-demand coloring book! The perfect gift for dog lovers.\n🎁 Sign up to try it first at www.dogcoloringbooks.com!\n🚀 Launching mid-November.\n\nCreated by @justgurian.ai & @quinngolds.\nFollow @dogcoloringbooks for more! ✨ #dogcoloringbook #petanimation #aiart #veo #customgift #doglovergift`;
    }
};

/**
 * Generates four "choose your own adventure" style choices based on an image and story context.
 * @param imagePart The image to generate choices from.
 * @param storyContextText The text of the current story scene.
 * @returns A promise that resolves to an array of four choice strings.
 */
export const generateStoryChoices = async (imagePart: GenerativePart, storyContextText: string): Promise<string[]> => {
  try {
    const prompt = `This is a scene from a children's story: "${storyContextText}". 
    Look at the accompanying illustration.
    Your task is to generate exactly 4 creative, distinct, and short "choose your own adventure" style options for what could happen next. The choices should be positive, whimsical, or adventurous. Avoid scary, dangerous, or negative options.
    Each option should be a single sentence, phrased as an action or event.
    For example: "The dog discovers a hidden map.", "A friendly dragon lands nearby.", "They find a mysterious, glowing cave."`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        temperature: 0.9,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            choices: {
              type: Type.ARRAY,
              description: 'An array of exactly 4 string choices for the story.',
              items: {
                type: Type.STRING,
                description: 'A single story choice.'
              }
            }
          },
          required: ['choices']
        }
      }
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    if (result.choices && Array.isArray(result.choices) && result.choices.length > 0) {
      return result.choices.slice(0, 4); // Ensure we only return 4
    }
    
    throw new Error("Invalid response format from model.");

  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Starts a story by generating an opening paragraph and the first set of choices.
 * @param imagePart The first image of the story.
 * @param themeContext The theme of the first image.
 * @returns A promise that resolves to the story text and choices.
 */
export const startStory = async (imagePart: GenerativePart, themeContext: string): Promise<{ storyText: string; choices: string[] }> => {
    try {
        const prompt = `Based on the provided image of a pet and the theme "${themeContext}", write a short, one-paragraph opening for a children's storybook (2-3 engaging sentences). Then, provide exactly 4 creative, distinct, and short "choose your own adventure" options for what could happen next. The choices should be positive, whimsical, or adventurous. Avoid scary, dangerous, or negative options.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                temperature: 0.8,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        storyText: {
                            type: Type.STRING,
                            description: 'The opening paragraph of the story.'
                        },
                        choices: {
                            type: Type.ARRAY,
                            description: 'An array of exactly 4 string choices for what happens next.',
                            items: { type: Type.STRING }
                        }
                    },
                    required: ['storyText', 'choices']
                }
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        if (result.storyText && result.choices && Array.isArray(result.choices) && result.choices.length > 0) {
            return { storyText: result.storyText, choices: result.choices.slice(0, 4) };
        }
        throw new Error("Invalid response format from model.");
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Continues a story by generating the next page (image and text). This is a two-step process
 * for improved reliability: first generate the text, then generate the image.
 * @param petImageParts The original pet photos for likeness.
 * @param previousPageImagePart The last generated image for style context.
 * @param fullStoryText The entire story text so far.
 * @param choice The user's selected next action.
 * @param petName Optional pet name for caption.
 * @param petHandle Optional pet handle for caption.
 * @param petGender Optional pet gender for caption.
 * @returns A promise that resolves to a new GeneratedImage object with storyText, or null.
 */
export const continueStory = async (
    petImageParts: GenerativePart[],
    previousPageImagePart: GenerativePart,
    fullStoryText: string,
    choice: string,
    petName?: string,
    petHandle?: string,
    petGender?: string
): Promise<GeneratedImage | null> => {
    try {
        // Step 1: Generate the story text using a text-only model for reliability.
        const storyGenerationPrompt = `You are a children's storybook author continuing a story.

        **STORY SO FAR:**
        ${fullStoryText}

        **THE NEXT CHAPTER:**
        The character decides to: "${choice}"

        **YOUR TASK:**
        Write a short, engaging paragraph (2-3 sentences) describing this new scene. This text will appear next to the illustration. DO NOT repeat the user's choice verbatim in your story text. Keep it whimsical, positive, and suitable for all ages.`;

        const storyResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: storyGenerationPrompt,
            config: { temperature: 0.85 }
        });
        const newStoryText = storyResponse.text?.trim();

        if (!newStoryText) {
            console.error("Failed to generate story text from the model.");
            return null;
        }

        // Step 2: Generate the illustration based on the new story text.
        const imageGenerationPrompt = `You are a children's storybook illustrator. Create a new coloring page illustration for the following scene:
        **SCENE:**
        ${newStoryText}

        **CRITICAL ILLUSTRATION INSTRUCTIONS:**
        -   This is a brand new scene. DO NOT simply edit or copy the composition of the previous page image provided.
        -   **Character Consistency:** The main character's appearance, breed, and markings MUST be based on the provided original pet photos (the first images in the input).
        -   **Style Consistency:** Use the immediately preceding page's illustration (the last image in the input) ONLY as a reference for the artistic style (e.g., greyscale comic book, bold lines, artistic shading).
        -   The final image MUST have a portrait aspect ratio of 8.5:11, making it perfect for printing.
        -   **Output ONLY an image.** Do not output any accompanying text.`;

        const imageResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    ...petImageParts,
                    previousPageImagePart,
                    { text: imageGenerationPrompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT], // As per guidelines
            },
        });

        const candidate = imageResponse.candidates?.[0];
        if (candidate?.content?.parts) {
            for (const part of candidate.content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    const newImage = { base64: part.inlineData.data, mimeType: part.inlineData.mimeType };
                    const generatedImagePart: GenerativePart = { inlineData: { data: newImage.base64, mimeType: newImage.mimeType } };
                    const caption = await generateCaptionForImage(generatedImagePart, petName, petHandle, petGender);

                    return {
                        ...newImage,
                        caption: caption,
                        storyText: newStoryText,
                    };
                }
            }
        }
        
        console.error("Failed to generate an image from the model for the story.");
        return null;

    } catch (error) {
        throw handleApiError(error);
    }
};


/**
 * Calls the Gemini image editing model to create a coloring book page, with a robust fallback mechanism.
 * @param imageParts The user's uploaded images as an array of GenerativePart.
 * @param prompt The detailed prompt for the transformation.
 * @param petName Optional pet name for caption.
 * @param petHandle Optional pet handle for caption.
 * @param petGender Optional pet gender for caption.
 * @param themeCategory Optional category of the theme, used for fallback logic.
 * @returns A promise that resolves to a GeneratedImage object or null if all attempts fail.
 */
export const createColoringPage = async (
    imageParts: GenerativePart[], 
    prompt: string, 
    petName?: string, 
    petHandle?: string, 
    petGender?: string,
    themeCategory?: string
): Promise<GeneratedImage | null> => {
  
  // A helper to run a single generation attempt and process the response.
  const attemptGeneration = async (currentPrompt: string): Promise<GeneratedImage> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [...imageParts, { text: currentPrompt }] },
        config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
    });

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
            if (part.inlineData && part.inlineData.data) {
                const generatedImagePart: GenerativePart = { inlineData: { data: part.inlineData.data, mimeType: part.inlineData.mimeType } };
                const caption = await generateCaptionForImage(generatedImagePart, petName, petHandle, petGender);
                return {
                    base64: part.inlineData.data,
                    mimeType: part.inlineData.mimeType,
                    caption: caption,
                    themeCategory: themeCategory,
                };
            }
        }
    }
    // If we get here, no image was in the response, so we throw to trigger the catch/retry logic.
    throw new Error("Model did not return an image part.");
  }

  // --- Primary Attempt: Try the original prompt with retries ---
  const MAX_PRIMARY_ATTEMPTS = 2;
  for (let i = 0; i < MAX_PRIMARY_ATTEMPTS; i++) {
    try {
      return await attemptGeneration(prompt); // If successful, the function returns here.
    } catch (error) {
      console.warn(`Primary attempt ${i + 1} failed:`, error);
      if (i < MAX_PRIMARY_ATTEMPTS - 1) {
        await delay(1000 * (i + 1)); // Wait 1s before the next retry
      }
    }
  }

  // --- Fallback Attempt: If all primary attempts failed ---
  console.warn("Primary attempts failed. Trying a simplified fallback prompt.");
  let fallbackPrompt: string;
  let captionPrefix: string;

  if (themeCategory === 'logo') {
    // Fallback for logos: create a simple, text-less icon. This is much more reliable.
    fallbackPrompt = `Using the likeness of the pet from the provided photo(s), create a very simple, clean, icon-style brand logo on a solid white background. The logo should be a black and white line drawing. The logo must have a square 1:1 aspect ratio. CRITICAL: Do NOT include any text in the image.`;
    captionPrefix = "(Logo theme failed, but here's a simple icon!)\n\n";
  } else {
    // Fallback for all other themes: create a classic portrait.
    fallbackPrompt = `Based on the provided pet photo(s), accurately represent their core likeness and features. CRITICAL STYLE INSTRUCTIONS: The final output must be a high-quality, greyscale comic book style coloring page with clean, bold line art and beautiful, artistic shading. It MUST have a portrait aspect ratio of 8.5:11.`;
    captionPrefix = "(Theme failed, but here's a classic portrait!)\n\n";
  }

  try {
    const fallbackResult = await attemptGeneration(fallbackPrompt);
    // If the fallback works, prepend the caption to inform the user and return.
    if (fallbackResult) {
      return { ...fallbackResult, caption: captionPrefix + fallbackResult.caption, themeCategory: themeCategory };
    }
  } catch (error) {
    console.error("Fallback attempt also failed:", error);
  }

  // If we reach here, everything has failed.
  console.error("All generation attempts, including fallback, have failed for this request.");
  return null;
};


/**
 * Generates an apparel mockup using a dog photo and a logo.
 * @param dogImagePart The user's uploaded dog photo.
 * @param logoImagePart The generated logo image.
 * @param petName Optional pet name for caption.
 * @param petHandle Optional pet handle for caption.
 * @param petGender Optional pet gender for caption.
 * @returns A promise that resolves to a GeneratedImage object or null.
 */
export const createApparelMockup = async (
    dogImagePart: GenerativePart,
    logoImagePart: GenerativePart,
    petName?: string,
    petHandle?: string,
    petGender?: string
): Promise<GeneratedImage | null> => {
    const prompt = `This is a product mockup generation task.
    **Primary Subject:** Use the first provided image of the dog as a strict reference. Create a photorealistic image of the **exact same dog** (same breed, markings, and features).
    **Apparel:** The dog must be wearing a high-quality, plain black dog hoodie.
    **Logo Application:** The second provided image is a brand logo. Place this logo prominently and cleanly on the back or shoulder area of the hoodie. Do not alter the logo's design.
    **Scene:** The dog should be in a natural pose (sitting, standing) against a simple, clean background (like a soft-focus studio or outdoor setting) to emphasize the product. The final image should look like a professional e-commerce product photo. The final image MUST have a square 1:1 aspect ratio.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [dogImagePart, logoImagePart, { text: prompt }] },
            config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
        });

        const candidate = response.candidates?.[0];
        if (candidate?.content?.parts) {
            for (const part of candidate.content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    const generatedImagePart: GenerativePart = { inlineData: { data: part.inlineData.data, mimeType: part.inlineData.mimeType } };
                    const caption = await generateCaptionForMockup(generatedImagePart, petName, petHandle, petGender);
                    return {
                        base64: part.inlineData.data,
                        mimeType: part.inlineData.mimeType,
                        caption: caption,
                        themeCategory: 'mockup',
                    };
                }
            }
        }
        throw new Error("Model did not return an image for the mockup.");
    } catch (error) {
        throw handleApiError(error);
    }
};



/**
 * Generates a video by animating a provided coloring page image.
 * @param base64Image The base64 string of the image to animate.
 * @param mimeType The mimeType of the image.
 * @param style Optional coloring style to determine the tool shown in the video.
 * @returns A promise that resolves to the video's download URI, or null on failure.
 */
export const generateVideoFromImage = async (base64Image: string, mimeType: string, style?: string): Promise<string | null> => {
    try {
        const styleToToolMap: { [key: string]: string } = {
            'colored-pencil': 'a colored pencil',
            'marker-art': 'an art marker',
            'watercolor': 'a watercolor paintbrush',
            'vibrant-cartoon': 'an art marker',
            'realistic-shading': 'a set of colored pencils and blending stumps',
            'psychedelic': 'a vibrant, colorful paintbrush',
        };

        const tool = style ? styleToToolMap[style] : 'a colored pencil or marker';

        const prompt = `Create a satisfying POV (point-of-view) style timelapse video. The video must show a person's arm and hand holding ${tool}, coloring in the provided greyscale image. The video should show the complete image transitioning from black and white to fully colored. The coloring process should look skillful and artistic. The final video MUST have a portrait aspect ratio of 8.5:11.`;

        let operation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: prompt,
            image: {
                imageBytes: base64Image,
                mimeType: mimeType,
            },
            config: {
                numberOfVideos: 1,
            }
        });

        // Adaptive polling strategy to avoid rate limiting.
        const POLLING_INTERVALS_MS = [20000, 30000, 45000, 60000]; // Start at 20s, then 30s, 45s, and finally 60s for all subsequent checks.
        let pollAttempt = 0;

        while (!operation.done) {
            // Determine the wait time for this poll attempt. Use the last interval as the maximum.
            const waitTime = POLLING_INTERVALS_MS[pollAttempt] || POLLING_INTERVALS_MS[POLLING_INTERVALS_MS.length - 1];
            
            await delay(waitTime); 
            operation = await ai.operations.getVideosOperation({ operation: operation });
            pollAttempt++;
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        
        if (downloadLink) {
            return downloadLink;
        } else {
            console.error("Video generation operation completed, but no download link was found.");
            return null;
        }

    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * "Colors in" a greyscale coloring page using a specified style and outputs it as a flat image or a mockup.
 * @param imagePart The greyscale coloring page.
 * @param style The artistic style to use for coloring (e.g., "Colored Pencil", "Marker Art").
 * @param outputType Whether to generate a "flat" image or a "mockup".
 * @param scene A description of the scene for the mockup (e.g., "on a wooden desk").
 * @param petName Optional pet name for the new caption.
 * @param petHandle Optional pet handle for the new caption.
 * @param petGender Optional pet gender for the new caption.
 * @param coloringProgress How much of the image should be colored ('full', '3/4', '1/2', '1/4').
 * @param artistSkill The skill level of the artist ('pro', 'amateur', 'kid', 'toddler').
 * @returns A promise that resolves to a new GeneratedImage object, or null.
 */
export const colorInImage = async (
    imagePart: GenerativePart,
    style: string,
    outputType: 'flat' | 'mockup',
    scene: string,
    petName?: string,
    petHandle?: string,
    petGender?: string,
    coloringProgress: string = 'full',
    artistSkill: string = 'pro'
): Promise<GeneratedImage | null> => {
    
    let skillInstruction: string;
    switch (artistSkill) {
        case 'toddler':
            skillInstruction = "Color the image in the style of a very young child or toddler using crayons. The coloring should be very messy, scribble outside the lines frequently, use inconsistent pressure, and choose bright, sometimes unconventional colors. The goal is a chaotic, charming, 'my first coloring page' look.";
            break;
        case 'kid':
            skillInstruction = "Color the image in the style of a young child (around 5-7 years old). The coloring should mostly stay within the lines, but with some charming imperfections. Use bright, primary colors with inconsistent pressure, and don't worry about advanced techniques like blending or shading. The goal is a fun, enthusiastic, but not-quite-perfect look.";
            break;
        case 'amateur':
            skillInstruction = "Color the image in the style of a hobbyist or older child. The coloring should be neat and mostly within the lines, but without professional blending or shading. Some areas might have slight imperfections or go slightly over the lines. The goal is a clean but clearly hand-colored look.";
            break;
        case 'pro':
        default:
            skillInstruction = "Emulate the textures and techniques of a professional artist using this medium. The coloring should be skillful, with attention to light, shadow, and blending to create a stunning final piece. Stay within the lines of the original drawing.";
            break;
    }

    const progressMap: { [key: string]: string } = {
        '1/4': 'one quarter (25%)',
        '1/2': 'half (50%)',
        '3/4': 'three quarters (75%)',
    };

    const progressInstruction = coloringProgress !== 'full'
        ? `CRITICAL: This is a work-in-progress. Only color in about ${progressMap[coloringProgress]} of the image. The rest of the image MUST remain in its original greyscale line art form. The transition between colored and uncolored parts should look natural, as if someone stopped in the middle of coloring.`
        : '';
    
    let prompt: string;

    if (outputType === 'mockup') {
        prompt = `
You are a master of creating photorealistic mockups. Your task is to create an immersive Point-of-View (POV) image of a person coloring in a book.

**Core Task & Composition:**
1.  **Color the Artwork:** Take the provided greyscale coloring book page and color it in.
    - **Artistic Style:** Use a **"${style}"** style.
    - **Coloring Skill:** ${skillInstruction}
    - **Coloring Progress:** ${progressInstruction}
2.  **Create the Open Book:** Place this newly colored artwork as the **right-hand page** of a realistic, open coloring book. The book should look like a standard published coloring book (saddle-stitched or perfect-bound), with a visible center spine/gutter between the two pages. The paper should have a slight, natural curve into the spine. The book should look substantial, as if it has many pages.
3.  **The Other Page:** The **left-hand page** of the open book must also be visible. It should feature a different, uncolored, greyscale dog-themed coloring page to make the book feel authentic.
4.  **POV Action:** From a first-person perspective, show a person's hands holding a coloring tool (e.g., a colored pencil or marker that matches the chosen style). The hands should be actively coloring a small, unfinished section of the right-hand page, bringing the scene to life.

**Scene Integration:**
Set this entire coloring activity within the following high-quality, photorealistic scene: **"${scene}"**. The lighting, shadows, and perspective of the book and hands must match the environment perfectly.

**Final Output:**
The final image must be a professional-looking product photo with a square 1:1 aspect ratio.
`;
    } else { // 'flat'
        prompt = `
You are an expert digital artist. Your task is to take the provided greyscale coloring book page and bring it to life with color.

**Artistic Style:**
Color the image in a **${style}** style.

**Coloring Skill:**
${skillInstruction}

**Coloring Progress:**
${progressInstruction}

**Final Output - Flat Artwork:**
The final image should be JUST the colored artwork presented cleanly on a solid white background. The final image must have a square 1:1 aspect ratio, perfect for social media posts.`;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart, { text: prompt }] },
            config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
        });

        const candidate = response.candidates?.[0];
        if (candidate?.content?.parts) {
            for (const part of candidate.content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    const generatedImagePart: GenerativePart = { inlineData: { data: part.inlineData.data, mimeType: part.inlineData.mimeType } };
                    // Generate a new, relevant caption for the colored-in image.
                    const caption = await generateCaptionForImage(generatedImagePart, petName, petHandle, petGender);
                    
                    return {
                        base64: part.inlineData.data,
                        mimeType: part.inlineData.mimeType,
                        caption: caption, 
                        themeCategory: 'colored-in',
                    };
                }
            }
        }
        throw new Error("Model did not return an image for the coloring task.");
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Generates a creative concept for a new AI dog character, optionally based on user specifications.
 * @param breed Optional user-specified breed.
 * @param color Optional user-specified color/markings.
 * @returns A promise that resolves to an AIDogConcept object.
 */
export const generateAIDogConcept = async (breed?: string, color?: string): Promise<AIDogConcept> => {
  let prompt: string;

  if (breed || color) {
    // User has provided custom details
    const breedInstruction = breed ? `The dog's breed MUST be a ${breed}.` : "The dog's breed can be any creative mix.";
    const colorInstruction = color ? `The dog's color and markings MUST be described as: ${color}.` : "The dog can be any color.";
    
    prompt = `You are a creative assistant for a dog coloring book app. Your task is to invent a new, unique, and lovable AI dog character based on user specifications.

      **User Specifications:**
      - ${breedInstruction}
      - ${colorInstruction}

      **Your Tasks:**
      1.  Invent a charming, human-like name for this dog (e.g., 'Barnaby', 'Penelope').
      2.  Write a one-sentence personality description that fits the breed/color.
      3.  Create a clever social media handle (e.g., '@[name]_[adjective]').
      4.  Write a detailed, descriptive prompt for an AI image generator to create a high-quality, photorealistic studio portrait of this specific dog. This prompt MUST incorporate the specified breed and color/markings.

      Please provide the output in a JSON format.`;
  } else {
    // Original "surprise me" prompt
    prompt = `You are a creative assistant for a dog coloring book app. Your task is to invent a new, unique, and lovable AI dog character. Please provide the following details in a JSON format: 
- breed (be creative, can be a fun mix like 'Golden Doodle-Husky mix')
- a charming, human-like name (e.g., 'Barnaby', 'Penelope')
- a one-sentence personality description (e.g., 'A grumpy but lovable bulldog who loves naps.')
- a clever social media handle (e.g., '@[name]_[adjective]')
- a detailed, descriptive prompt for an AI image generator to create a high-quality, photorealistic studio portrait of this dog. This prompt should be exciting and specific.`;
  }
  
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 1.0,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        breed: { type: Type.STRING, description: 'The dog\\\'s breed or mix.' },
                        name: { type: Type.STRING, description: 'The dog\\\'s name.' },
                        personality: { type: Type.STRING, description: 'A short personality description.' },
                        handle: { type: Type.STRING, description: 'A social media handle.' },
                        imagePrompt: { type: Type.STRING, description: 'A detailed prompt for image generation.' },
                    },
                    required: ['breed', 'name', 'personality', 'handle', 'imagePrompt']
                }
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        return result as AIDogConcept;
    } catch (error) {
        throw handleApiError(error);
    }
};

/**
 * Generates a photorealistic image of a dog based on a prompt.
 * @param prompt The detailed prompt for the image generation.
 * @returns A promise that resolves to a simple object with base64 and mimeType, or null.
 */
export const generateAIDogImage = async (prompt: string): Promise<{ base64: string, mimeType: string } | null> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '4:3',
            },
        });

        const image = response.generatedImages?.[0]?.image;
        if (image?.imageBytes) {
            return {
                base64: image.imageBytes,
                mimeType: 'image/png' // Matches outputMimeType
            };
        }
        throw new Error("Imagen model did not return a valid image.");
    } catch (error) {
        throw handleApiError(error);
    }
};