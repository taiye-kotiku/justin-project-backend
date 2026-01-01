import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { GoogleGenAI, Modality } from '@google/genai';
import dotenv from 'dotenv';
import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const N8N_WEBHOOK_URL = process.env.N8N_LOGGING_WEBHOOK || 'https://justgurian.app.n8n.cloud/webhook/log-generation-event';

// Helper: Send logging event to N8N (fire and forget)
async function logToN8N(eventData) {
  try {
    const payload = {
      timestamp: new Date().toISOString(),
      eventType: 'image_generation',
      status: eventData.status,
      dogName: eventData.dogName,
      originalImageBase64: eventData.originalImageBase64,
      generatedImageBase64: eventData.generatedImageBase64,
      compositeImageBase64: eventData.compositeImageBase64,
      theme: eventData.theme,
      template: eventData.template,
      mimeType: eventData.mimeType,
      instagramPostId: eventData.instagramPostId,
      error: eventData.error
    };

    console.log('📡 Sending logging event to N8N...');
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      timeout: 5000 // Don't wait too long
    });

    if (response.ok) {
      console.log('✅ Event logged to N8N successfully');
    } else {
      console.warn('⚠️ N8N logging returned non-OK status:', response.status);
    }
  } catch (error) {
    // Non-blocking: log errors but don't fail the main operation
    console.warn('⚠️ N8N logging error (non-critical):', error.message);
  }
}

// Helper: Download image from URL and convert to base64
async function downloadImageAsBase64(url) {
  // Handle Google Drive URLs
  if (url.includes('drive.google.com')) {
    // Extract file ID from Google Drive URL
    const fileIdMatch = url.match(/\/d\/([^\/]+)/);
    if (fileIdMatch) {
      const fileId = fileIdMatch[1];
      url = `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
  }
  
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString('base64');
}

// Helper: Generate caption for image
async function generateCaption(base64Image, mimeType, petName, petHandle) {
  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: mimeType
    }
  };

  let starringLine = '';
  if (petHandle?.trim()) {
    let handle = petHandle.trim();
    if (!handle.startsWith('@')) handle = '@' + handle;
    starringLine = `Starring the one and only ${handle}! 🌟`;
  } else if (petName?.trim()) {
    starringLine = `Starring the one and only ${petName.trim()}! 🌟`;
  }

  const prompt = `You are a fun, witty social media manager for @dogcoloringbooks. Analyze the provided coloring book page image. Write an exciting and engaging social media caption.

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
}

// Helper: Generate a single coloring page
async function generateColoringPage(dogImageBase64, mimeType, theme, petName) {
  const imagePart = {
    inlineData: {
      data: dogImageBase64,
      mimeType: mimeType
    }
  };

  const prompt = `Based on the provided pet photo(s), accurately represent their core likeness and features. The main subjects are the pets from the uploaded image(s), so feature them prominently. 

${petName ? `Incorporate the name '${petName}' into the design in a fun, comic book style font (e.g., on a collar, a banner, or as a hero title). ` : ''}

Integrate this theme: "${theme}". Add whimsical and fun elements related to the theme in the background and around the pet(s). 

CRITICAL STYLE INSTRUCTIONS: The final output must be a high-quality, greyscale comic book style coloring page. It needs clean, bold line art. Most importantly, it MUST include beautiful, artistic shading. This shading is essential to give the image depth and to make it very easy and enjoyable for someone to color in. The final image MUST have a portrait aspect ratio of 8.5:11, making it perfect for printing on a standard letter-sized paper.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [imagePart, { text: prompt }] },
    config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
  });

  const candidate = response.candidates?.[0];
  if (candidate?.content?.parts) {
    for (const part of candidate.content.parts) {
      if (part.inlineData && part.inlineData.data) {
        return {
          base64: part.inlineData.data,
          mimeType: part.inlineData.mimeType
        };
      }
    }
  }

  throw new Error('Failed to generate image');
}

async function prepareImageForGeneration(imageInput) {
  // If it's a data URL (base64), extract the base64 part
  if (imageInput.startsWith('data:')) {
    const base64Data = imageInput.split(',')[1];
    const mimeType = imageInput.match(/data:([^;]+);/)?.[1] || 'image/jpeg';
    return { base64: base64Data, mimeType };
  }
  
  // If it's a URL, download it
  const response = await fetch(imageInput);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString('base64');
  const mimeType = response.headers.get('content-type') || 'image/jpeg';
  
  return { base64, mimeType };
}

// Helper: Convert Google Drive URL to direct download format
function convertGoogleDriveUrl(url) {
  // Check if it's already in the correct format
  if (url.includes('uc?export=download')) {
    return url;
  }
  
  // Extract file ID from various Google Drive URL formats
  let fileId = null;
  
  // Format: https://drive.google.com/file/d/FILE_ID/view
  const match1 = url.match(/\/file\/d\/([^\/]+)/);
  if (match1) {
    fileId = match1[1];
  }
  
  // Format: https://drive.google.com/open?id=FILE_ID
  const match2 = url.match(/[?&]id=([^&]+)/);
  if (match2) {
    fileId = match2[1];
  }
  
  if (fileId) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  
  // If not a Google Drive URL, return as is
  return url;
}

// Helper: Upload media URL to Blotato
async function uploadUrlToBlotato(imageUrl) {
  try {
    // Convert Google Drive URL if needed
    const directUrl = convertGoogleDriveUrl(imageUrl);
    
    console.log('Uploading URL to Blotato:', directUrl);
    
    const response = await fetch('https://backend.blotato.com/v2/media', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BLOTATO_API_KEY}`
      },
      body: JSON.stringify({
        url: directUrl
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Blotato media upload error:', data);
      throw new Error(`Failed to upload to Blotato (${response.status}): ${JSON.stringify(data)}`);
    }
    
    console.log('✅ Media uploaded to Blotato:', data.url);
    return data.url; // Returns https://database.blotato.com/...
    
  } catch (error) {
    console.error('Error uploading to Blotato:', error);
    throw error;
  }
}

// ============================================
// API ENDPOINT 0.5: Generate Single Image (from base64)
// ============================================
app.post('/api/generate-single', async (req, res) => {
  try {
    const { dogName, imageBase64, mimeType, theme, petHandle } = req.body;

    if (!dogName || !imageBase64 || !mimeType) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: dogName, imageBase64, mimeType' 
      });
    }

    console.log('🎨 Generating single coloring page for:', dogName);

    // Generate the coloring page from base64
    const generatedImage = await generateColoringPage(
      imageBase64,
      mimeType,
      theme || 'Adventure',
      dogName
    );

    // Return with data URLs for immediate frontend use
    const originalDataUrl = `data:${mimeType};base64,${imageBase64}`;
    const generatedDataUrl = `data:${generatedImage.mimeType};base64,${generatedImage.base64}`;

    // Log to N8N (fire and forget)
    logToN8N({
      status: 'success',
      dogName,
      originalImageBase64: imageBase64,
      generatedImageBase64: generatedImage.base64,
      theme: theme || 'Adventure',
      mimeType: generatedImage.mimeType
    });

    res.json({
      success: true,
      originalImageUrl: originalDataUrl,
      generatedImageUrl: generatedDataUrl,
      originalImageBase64: imageBase64,
      generatedImageBase64: generatedImage.base64,
      mimeType: generatedImage.mimeType
    });

  } catch (error) {
    console.error('❌ Error generating single coloring page:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ============================================
// API ENDPOINT 1: Generate Batch of Images
// ============================================
app.post('/api/generate-batch', async (req, res) => {
  try {
    const { dogName, imageUrl, themes, petHandle } = req.body;

    console.log('Generating batch for:', dogName);

    // Handle both base64 and URL inputs
    const { base64: dogImageBase64, mimeType } = await prepareImageForGeneration(imageUrl);

    const results = [];

    // Generate image for each theme
    for (const theme of themes) {
      console.log(`Generating: ${theme}`);
      
      // Generate the coloring page
      const generatedImage = await generateColoringPage(
        dogImageBase64,
        mimeType,
        theme,
        dogName
      );

      // Generate caption
      const caption = await generateCaption(
        generatedImage.base64,
        generatedImage.mimeType,
        dogName,
        petHandle
      );

      results.push({
        theme: theme,
        imageBase64: generatedImage.base64,
        mimeType: generatedImage.mimeType,
        caption: caption
      });
    }

    res.json({
      success: true,
      results: results
    });

  } catch (error) {
    console.error('Error generating batch:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// API ENDPOINT 2: Create Marketing Image (Customizable Template)
// ============================================
app.post('/api/create-marketing-image', async (req, res) => {
  try {
    let { 
      originalImageBase64,
      coloringImageBase64,
      originalImageUrl,
      generatedImageUrl,
      dogName,
      headerLine1 = 'TURN ONE PICTURE OF YOUR DOG INTO',
      headerLine2 = 'ONE HUNDRED PICTURES OF YOUR DOG!',
      arrowText = '←---STARTING IMAGE',
      websiteText = 'dogcoloringbooks.com',
      circleColor = '#7C3AED',
      backgroundColor = '#FFFFFF'
    } = req.body;

    console.log('Creating customizable marketing composite for:', dogName);

    // Handle both base64 and URL inputs
    let originalBase64 = originalImageBase64;
    let coloringBase64 = coloringImageBase64;

    // If URLs provided instead of base64, extract the base64 part
    if (!originalBase64 && originalImageUrl) {
      if (originalImageUrl.startsWith('data:')) {
        originalBase64 = originalImageUrl.split(',')[1];
      } else {
        originalBase64 = await downloadImageAsBase64(originalImageUrl);
      }
    }

    if (!coloringBase64 && generatedImageUrl) {
      if (generatedImageUrl.startsWith('data:')) {
        coloringBase64 = generatedImageUrl.split(',')[1];
      } else {
        coloringBase64 = await downloadImageAsBase64(generatedImageUrl);
      }
    }

    const originalPart = {
      inlineData: { data: originalBase64, mimeType: 'image/jpeg' }
    };
    
    const coloringPart = {
      inlineData: { data: coloringBase64, mimeType: 'image/jpeg' }
    };

    const prompt = `You are creating a professional Instagram marketing post image. This image will be posted to Instagram, so you MUST follow these CRITICAL requirements:

**ASPECT RATIO REQUIREMENTS:**
- MUST be EXACTLY 1:1 square ratio (1080x1080 pixels)
- NO vertical or horizontal cropping
- ALL content must fit within the square
- Leave adequate margins on all sides (at least 50px padding)

**LAYOUT STRUCTURE:**

**TOP (15% of image):**
"${headerLine1}"
"${headerLine2}"
Style: Bold, large font (but not too large - must fit), black text, centered

**MIDDLE-CENTER (50% of image):**
The coloring book image (second provided image)
- Center it horizontally and vertically
- Scale it to fit comfortably with margins
- DO NOT let it touch the edges
- Leave space above for header and below for footer elements

**BOTTOM-LEFT (15% of image, left side):**
A circular frame (diameter ~150-180px) with ${circleColor} border
- Contains the original dog photo (first provided image)
- Position in bottom-left corner with 80px margin from edges
- Make sure the circle doesn't get cut off

**BOTTOM-LEFT-CENTER (next to circle):**
"${arrowText}"
Style: Bold text with arrow, positioned to the right of the circular photo

**BOTTOM-RIGHT (15% of image, right side):**
"${websiteText}"
- Position in bottom-right corner with 80px margin from edges  
- The word "coloring" should be rainbow colored (each letter: red, orange, yellow, green, blue, indigo, violet)
- Rest of text is black
- Add paw emoji 🐾

**BACKGROUND:** ${backgroundColor}

**CRITICAL SPACING RULES:**
1. Top margin: 40px minimum
2. Side margins: 60px minimum  
3. Bottom margin: 40px minimum
4. Space between elements: 20px minimum
5. Nothing should touch the image borders
6. The coloring book image in center should be scaled to fit comfortably

**OUTPUT:**
- Final image MUST be EXACTLY 1080x1080 pixels (square)
- High quality, professional marketing material
- Clean, not cluttered
- All elements clearly visible and not cut off
- Safe for Instagram posting without any cropping`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [originalPart, coloringPart, { text: prompt }] },
      config: { 
        responseModalities: [Modality.IMAGE, Modality.TEXT]
      }
    });

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData && part.inlineData.data) {
          console.log('✅ Customizable marketing composite created!');
          const mimeType = part.inlineData.mimeType || 'image/png';
          const compositeDataUrl = `data:${mimeType};base64,${part.inlineData.data}`;
          
          // Log to N8N (fire and forget)
          logToN8N({
            status: 'success',
            dogName: req.body.dogName,
            originalImageBase64: originalBase64,
            generatedImageBase64: coloringBase64,
            compositeImageBase64: part.inlineData.data,
            template: 'customizable',
            mimeType: mimeType
          });
          
          return res.json({
            success: true,
            imageBase64: part.inlineData.data,
            compositeImageBase64: part.inlineData.data,
            compositeImageUrl: compositeDataUrl,
            mimeType: mimeType,
            template: 'customizable'
          });
        }
      }
    }

    throw new Error('Failed to generate marketing image');

  } catch (error) {
    console.error('Error creating marketing image:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// FINAL CORRECTED ENDPOINT - SQUARE CANVAS (Enforcing 1:1 Aspect Ratio)
// ============================================
app.post('/api/generate-marketing-composite', async (req, res) => {
  try {
    const { originalImageBase64, coloringImageBase64, dogName } = req.body;

    if (!originalImageBase64 || !coloringImageBase64 || !dogName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Creating Strictly Square Composite for:', dogName);

    const originalPart = {
      inlineData: { data: originalImageBase64, mimeType: 'image/jpeg' }
    };
    
    const coloringPart = {
      inlineData: { data: coloringImageBase64, mimeType: 'image/jpeg' }
    };

    // --- PROMPT MODIFIED FOR STRICT SQUARE CANVAS (1:1) ---
    const prompt = `You are creating a professional marketing composite image for a dog coloring book. You MUST follow these layout rules exactly:

**IMAGE SHAPE (CRITICAL AND NON-NEGOTIABLE):**
- **FINAL ASPECT RATIO MUST BE PERFECTLY SQUARE (1:1).** The image must be SQUARE (1080x1080 pixels).
- The entire background of the square canvas is **white**.

**LAYER 1: MAIN BACKGROUND (Fitted Illustration):**
- Use the coloring page (second image) as the dominant black and white illustration.
- **SCALING RULE:** The coloring page (which is a tall portrait format) MUST be scaled down and **fitted** into the center of the square canvas.
- This creates **wide, clean white margins on the left and right sides** of the illustration.
- The illustration MUST contain a readable tagline (e.g., 'CHARLIE'S COLORING BOOK ADVENTURE!') integrated into a banner at the top of the drawing.

**LAYER 2: POLAROID OVERLAY (Upper-Middle Placement):**
- **POSITION:** Place the Polaroid-style photo frame in the **upper-left corner of the square canvas** (with a 20px margin from the top and left edges).
- **POSITION:** MAAKE SURE MOST OF IT IS ON AN EMPTY CANVAS, BUT IT SHOULD OVERLAP THE COLORBOOK ILLUSTRATION
- **ORIENTATION:** The Polaroid MUST be **slightly tilted/rotated** to the left (matching the visual style of your successful output).
- **Content:** The real dog photo (first image) fills this frame.
- **Details:** Use a crisp, thick white Polaroid border and a small, realistic **paperclip graphic** near the top edge.
- **Shadow:** Add a subtle shadow under the Polaroid.

**LAYER 3: TEXT TITLE (Integrated Graphic):**
- **POSITION:** The dog's name: "${dogName}" MUST be placed **BELOW** the main fitted illustration but **INTEGRATED into a decorative graphic element** (like a scroll or banner) that sits near the bottom edge of the square canvas, in the bottom white margin area.
- **Font:** Use a very large, bold, black, heavy, and stylized typeface.

**VISUAL GOAL:** The final output MUST be A PERFECT SQUARE CANVAS (1080x1080 pixels), containing the portrait illustration fitted inside slightly to the right, the tilted Polaroid in the upper-left corner, and the title graphic at the bottom.
`;
    // --- END MODIFIED PROMPT ---

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [originalPart, coloringPart, { text: prompt }] },
      config: { 
        responseModalities: [Modality.IMAGE, Modality.TEXT]
      }
    });

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData && part.inlineData.data) {
          console.log('✅ Final Composite created!');
          
          // Log to N8N (fire and forget)
          logToN8N({
            status: 'success',
            dogName: dogName,
            originalImageBase64: origBase64,
            generatedImageBase64: colorBase64,
            compositeImageBase64: part.inlineData.data,
            template: 'polaroid',
            mimeType: part.inlineData.mimeType || 'image/png'
          });
          
          return res.json({
            success: true,
            imageBase64: part.inlineData.data,
            compositeImageBase64: part.inlineData.data,
            compositeImageUrl: `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`,
            mimeType: part.inlineData.mimeType,
            template: 'polaroid',
            style: 'square-fitted-tilted'
          });
        }
      }
    }

    throw new Error('Failed to generate marketing image');

  } catch (error) {
    console.error('Error creating Polaroid composite:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});


// ============================================
// REBEL COMPOSITE - THREE FIXES
// 1. Narrower box (no pencil cutting)
// 2. Full coloring coverage (Math.max)
// 3. Paperclip on top layer
// ============================================

app.post('/api/generate-rebel-composite', async (req, res) => {
  try {
    const { originalImageBase64, coloringImageBase64, dogName } = req.body;

    // Handle both base64 and URL inputs
    let origBase64 = originalImageBase64;
    let colorBase64 = coloringImageBase64;
    
    if (!origBase64 && req.body.originalImageUrl) {
      if (req.body.originalImageUrl.startsWith('data:')) {
        origBase64 = req.body.originalImageUrl.split(',')[1];
      } else {
        origBase64 = await downloadImageAsBase64(req.body.originalImageUrl);
      }
    }

    if (!colorBase64 && req.body.generatedImageUrl) {
      if (req.body.generatedImageUrl.startsWith('data:')) {
        colorBase64 = req.body.generatedImageUrl.split(',')[1];
      } else {
        colorBase64 = await downloadImageAsBase64(req.body.generatedImageUrl);
      }
    }

    if (!origBase64 || !colorBase64 || !dogName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Creating Rebel composite for:', dogName);

    const originalPart = {
      inlineData: { data: origBase64, mimeType: 'image/jpeg' }
    };
    
    const coloringPart = {
      inlineData: { data: colorBase64, mimeType: 'image/jpeg' }
    };

    // PRODUCTION-READY PROMPT with detailed layout instructions
    const prompt = `You are creating a professional marketing composite image for a dog coloring books business. The output MUST follow this EXACT structure:

**CRITICAL OUTPUT REQUIREMENTS:**
- Canvas size: 1080 pixels wide x 1080 pixels tall (SQUARE)
- Background: Clean WHITE
- Quality: High resolution, professional, Instagram-ready
- Style: Clean, elegant, professional

**LAYOUT STRUCTURE:**

**BACKGROUND:**
- Pure white canvas (1080 x 1080 pixels - SQUARE)
- The large Polaroid frame will be positioned on this canvas (height 100%, width proportional)

**DECORATIVE ELEMENTS: COLORED PENCILS**
- Colored pencils should appear at 2 ALTERNATE CORNERS
- For example: Top-Left and Bottom-Right OR Top-Right and Bottom-Left
- Pencils should be realistic colored pencils (sharpened, with visible colors - red, yellow, green, blue, purple, orange)
- They should appear to be lying on the canvas naturally
- Size: Medium (approximately 100-150px long each)
- Position: Near the corners, The sharpened pencil should show through the canvas corner
- Style: Colorful, playful, matches the brand aesthetic
- NOT obscuring the main Polaroids

**MAIN ELEMENT: LARGE POLAROID FRAME (Coloring Book)**
- Size: The Polaroid should ALMOST FILL the entire canvas (similar to how the coloring book image fills the Polaroid)
  - Height: ~95-98% of canvas (very close to 100%, minimal white space at top/bottom)
  - Width: Proportional to maintain Polaroid aspect ratio
  - Centered on canvas with only small margins
- The POLAROID FRAME fills most of the canvas vertically and is centered horizontally
- Polaroid Frame Details:
  - MINIMAL white border/frame inside the Polaroid to maximize image size
  - Sides: 10-15px (very small)
  - Top: 10-15px (very small)
  - Bottom: 30-40px (small, maintains traditional Polaroid look)
  - The frame maintains traditional Polaroid proportions/styling but is very minimal
- Content: The coloring book image (second image) inside the Polaroid
  - The coloring book image should be SCALED TO FIT HEIGHT 100% of the Polaroid interior
  - Maintain aspect ratio - NO CROPPING
  - The entire image should be visible and fully contained
  - Scale proportionally so the full height is visible, width adjusted to maintain proportions
  - The image will be VERY LARGE within the frame due to minimal white borders
  - Positioned naturally within the Polaroid frame, centered
- Position: The Polaroid frame almost fills the entire canvas, centered, with minimal margins
- Shadow: Drop shadow below the Polaroid frame (approximately 10-15px blur, 8px downward offset) to create 3D depth effect

**DOG NAME ON POLAROID BORDER:**
- Text: "${dogName.toUpperCase()}"
- Location: ON THE WHITE BORDER at the bottom of the large Polaroid frame
- Style: Bold, like handwriting/marker style
- Size: Large and prominent (approximately 100-120px font)
- Color: Black
- Position: Centered horizontally within the white bottom border area
- NOT on the coloring book image - ONLY on the white Polaroid border

**SECONDARY ELEMENT: SMALL POLAROID FRAME (Dog Photo)**
- Size: Smaller Polaroid frame (approximately 40-50% of the large Polaroid width)
- Content: The original dog photo (first image), square-cropped from center
- Polaroid Frame Details:
  - White border around the dog photo (approximately 20-30px on all sides)
- Position: MIDDLE-LEFT side of the canvas, positioned so it overlaps the large Polaroid
  - Horizontally: Approximately 50-100px from left edge of canvas
  - Vertically: Approximately middle of the canvas (vertically centered at 50% height)
- Effect: The small Polaroid overlaps the left edge of the large Polaroid
- Shadow: Subtle shadow around the small Polaroid for depth

**PAPERCLIP - CRITICAL POSITIONING:**
- A realistic, NORMAL-SIZED paperclip should bridge between the small and large Polaroids
- The paperclip connects the small Polaroid to the large Polaroid, showing they are clipped together
- Position Details:
  - TOP POINT: At the TOP of the small Polaroid frame
  - BOTTOM POINT: At the LEFT BORDER/FRAME of the large Polaroid at vertical middle (50% height)
  - The paperclip bridges diagonally from top of small Polaroid down to left border of large Polaroid
  - This creates a clear visual showing the small Polaroid is clipped/pinned to the large Polaroid
  - The connection is clear and obvious - the small Polaroid is held by the paperclip to the large Polaroid
- SIZE - NORMAL:
  - The paperclip should be REGULAR/NORMAL size (approximately 20-30px)
  - Realistic, not over-emphasized
  - Clearly visible but not oversized
  - Proportional to the composition
- Appearance: Metallic/gray color, realistic 3D look, normal proportions
- CRITICAL: The paperclip MUST be on the TOP layer - it should NOT be hidden or covered
- The clip MUST be completely visible - clearly shows the connection/clipping point
- The paperclip should appear to be holding the small frame pinned to the large frame

**ASSEMBLY INSTRUCTIONS (LAYER ORDER - CRITICAL):**
1. Layer 1: Pure white canvas background (1080 x 1080)
2. Layer 2: Colored pencils at 2 alternate corners (inside canvas composition)
3. Layer 3: Large Polaroid frame that ALMOST FILLS canvas (95-98% height, minimal margins), width proportional, centered horizontally, with VERY LARGE coloring book image scaled to fit height 100% (minimal borders, no cropping)
4. Layer 4: Shadow below the large Polaroid
5. Layer 5: Dog name text ON the white border of large Polaroid
6. Layer 6: Small Polaroid frame with dog photo, positioned middle-left overlapping large Polaroid
7. Layer 7: Shadow around small Polaroid
8. Layer 8 (TOP): NORMAL-SIZED realistic paperclip (40-60px) that BRIDGES from TOP of small Polaroid down to LEFT BORDER/FRAME of large Polaroid at vertical middle height - FULLY VISIBLE, properly positioned, clearly shows clipping connection

**CRITICAL QUALITY REQUIREMENTS:**
- ✓ Square canvas (1080 x 1080) - NOT rectangular
- ✓ Large Polaroid ALMOST FILLS the entire canvas (95-98% height, minimal margins around edges)
- ✓ Polaroid is centered horizontally with minimal white space around it
- ✓ WHITE BORDERS ARE MINIMAL (10-15px sides/top, 30-40px bottom) - to maximize image size
- ✓ Coloring book image is VERY LARGE within the Polaroid frame
- ✓ Coloring book image SCALED TO FIT HEIGHT 100% of Polaroid interior (no cropping, maintains aspect ratio)
- ✓ Entire coloring book image is fully visible and contained within Polaroid
- ✓ Colored pencils visible and colorful at 2 alternate corners (inside canvas)
- ✓ Dog name clearly written on the white border, NOT on the image
- ✓ Shadow effects create realistic 3D depth
- ✓ Small Polaroid with dog photo clearly visible, overlapping left side of large Polaroid
- ✓ PAPERCLIP is NORMAL SIZE (20-30px, realistic proportions)
- ✓ Paperclip STARTS at the TOP of the small Polaroid
- ✓ Paperclip ENDS at the LEFT BORDER/FRAME of the large Polaroid at vertical middle (50% height)
- ✓ Paperclip bridges diagonally between the two Polaroids
- ✓ Paperclip clearly shows the clipping/pinning connection
- ✓ Paperclip is the TOP layer - FULLY visible, NOT hidden or partially obscured
- ✓ Small Polaroid appears to overlap the large Polaroid naturally
- ✓ All elements sharp and clear
- ✓ Professional, Instagram-ready quality

**DO NOT:**
- Do NOT make the canvas rectangular
- Do NOT make the Polaroid frame height less than 95-98% of canvas - it should ALMOST FILL the canvas
- Do NOT forget to scale the Polaroid WIDTH proportionally (narrower, maintaining aspect ratio)
- Do NOT leave large white margins around the Polaroid - it should have minimal margins
- Do NOT make the white Polaroid borders large - they should be MINIMAL (10-15px sides/top, 30-40px bottom only)
- Do NOT reduce the coloring book image size - it should be VERY LARGE within the frame
- Do NOT CROP the coloring book image - scale it to fit HEIGHT 100% with NO cropping
- Do NOT stretch the coloring book image - maintain natural aspect ratio while scaling to fit height
- Do NOT make the paperclip too large - it should be NORMAL size (40-60px, realistic, proportional)
- Do NOT position the paperclip incorrectly - it should BRIDGE from TOP of small Polaroid to LEFT BORDER of big Polaroid at vertical middle
- Do NOT position pencils outside the canvas - they should be ONLY at 2 alternate CORNERS inside the canvas
- Do NOT hide any part of the paperclip
- Do NOT put dog name on the coloring book image - ONLY on the white Polaroid border
- Do NOT forget the colored pencils at alternate corners
- Do NOT make the pencils subtle or hard to see
- Do NOT make the paperclip invisible or partially hidden
- Do NOT forget the shadow effects
- Do NOT add other decorative elements beyond the pencils and Polaroids

**IMPORTANT:** The output should look like a professional marketing post showing:
1. A clean white SQUARE canvas (1080x1080)
2. A large Polaroid frame that ALMOST FILLS the entire canvas (95-98% height, minimal margins)
3. MINIMAL white Polaroid borders (10-15px sides/top, 30-40px bottom) - to make image VERY LARGE
4. The coloring book illustration VERY LARGE within the Polaroid (scaled to fit height, minimal borders, no cropping)
5. Colorful pencils at 2 alternate corners (inside the canvas)
6. The dog's name elegantly written on the white bottom border of the large Polaroid
7. A smaller Polaroid frame with the original dog photo positioned at the middle-left, overlapping the large Polaroid
8. A NORMAL-SIZED, REALISTIC paperclip (40-60px, proportional)
9. The paperclip positioned at the TOP of the small Polaroid (starting point)
10. The paperclip extends down to the LEFT BORDER/FRAME of the large Polaroid at vertical middle (ending point)
11. The paperclip bridges diagonally between the two Polaroids, clearly showing they are clipped together
12. Realistic shadow effects for depth and dimension
13. Professional, clean, elegant composition suitable for Instagram

This is a premium marketing composite with a VERY LARGE coloring book image that almost fills the canvas, featuring both the coloring book and the original dog in a professional scrapbook/collage style with decorative colored pencils and a paperclip that bridges from the top of the small Polaroid to the left border of the large Polaroid.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { 
        parts: [originalPart, coloringPart, { text: prompt }] 
      },
      config: { 
        responseModalities: [Modality.IMAGE, Modality.TEXT]
      }
    });

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData && part.inlineData.data) {
          console.log('✅ Rebel composite created successfully!');
          return res.json({
            success: true,
            imageBase64: part.inlineData.data,
            mimeType: part.inlineData.mimeType,
            template: 'rebel'
          });
        }
      }
    }

    throw new Error('Failed to generate Rebel composite');

  } catch (error) {
    console.error('❌ Error creating Rebel composite:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ============================================
// API ENDPOINT 4: Post to Instagram via Blotato
// ============================================
app.post('/api/post-to-instagram', async (req, res) => {
  try {
    const { imageUrl, caption } = req.body;

    if (!process.env.BLOTATO_API_KEY) {
      throw new Error('BLOTATO_API_KEY not set in environment variables');
    }

    if (!process.env.BLOTATO_ACCOUNT_ID) {
      throw new Error('BLOTATO_ACCOUNT_ID not set in environment variables');
    }

    console.log('Posting to Instagram via Blotato...');
    console.log('Original image URL:', imageUrl);
    console.log('Caption preview:', caption.substring(0, 50) + '...');

    // Step 1: Upload the image URL to Blotato first
    const blotatoMediaUrl = await uploadUrlToBlotato(imageUrl);

    // Step 2: Create the Instagram post with the Blotato URL
    const blotatoPayload = {
      post: {
        accountId: process.env.BLOTATO_ACCOUNT_ID,
        content: {
          text: caption,
          mediaUrls: [blotatoMediaUrl],
          platform: 'instagram'
        },
        target: {
          targetType: 'instagram'
        }
      }
    };

    console.log('Creating Instagram post...');

    const response = await fetch('https://backend.blotato.com/v2/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BLOTATO_API_KEY}`
      },
      body: JSON.stringify(blotatoPayload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Blotato post error:', data);
      throw new Error(`Blotato API error (${response.status}): ${JSON.stringify(data)}`);
    }

    console.log('✅ Post queued successfully!');
    console.log('Post Submission ID:', data.postSubmissionId);

    // Log to N8N (fire and forget)
    logToN8N({
      status: 'success',
      eventType: 'instagram_post',
      instagramPostId: data.postSubmissionId,
      blotatoMediaUrl: blotatoMediaUrl
    });

    res.json({
      success: true,
      postSubmissionId: data.postSubmissionId,
      blotatoMediaUrl: blotatoMediaUrl,
      message: 'Post queued successfully! Check https://my.blotato.com if it fails'
    });

  } catch (error) {
    console.error('❌ Error posting to Instagram:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// API ENDPOINT 5: Generate AI Dog Concept
// ============================================
app.post('/api/generate-ai-dog', async (req, res) => {
  try {
    console.log('Generating AI dog concept...');
    
    // Generate a random dog concept using Gemini
    const conceptResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a random, unique dog character. Provide:
      - A fun, creative name
      - A specific breed (can be mixed)
      - A brief personality description
      
      Return as JSON with: name, breed, personality`,
      config: {
        temperature: 1.0,
        responseMimeType: 'application/json'
      }
    });

    const concept = JSON.parse(conceptResponse.text);
    
    // Generate an image of this dog
    const imagePrompt = `A professional studio portrait photo of a ${concept.breed} dog. The dog should look friendly and photogenic, perfect for a social media pet account. High quality, well-lit, clear details.`;
    
    const imageResponse = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: imagePrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '4:3'
      }
    });

    const image = imageResponse.generatedImages?.[0]?.image;
    
    if (!image?.imageBytes) {
      throw new Error('Failed to generate dog image');
    }

    console.log('✅ AI dog generated:', concept.name);

    res.json({
      success: true,
      name: concept.name,
      breed: concept.breed,
      personality: concept.personality,
      imageBase64: image.imageBytes,
      mimeType: 'image/png'
    });

  } catch (error) {
    console.error('Error generating AI dog:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// Health Check Endpoint
// ============================================
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// Start Server
// ============================================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend API running on http://localhost:${PORT}`);
  console.log(`📝 Generate batch: POST http://localhost:${PORT}/api/generate-batch`);
  console.log(`🎨 Create marketing (customizable): POST http://localhost:${PORT}/api/create-marketing-image`);
  console.log(`📷 Create marketing (polaroid): POST http://localhost:${PORT}/api/generate-marketing-composite`);
  console.log(`📸 Post to Instagram: POST http://localhost:${PORT}/api/post-to-instagram`);
  console.log(`🤖 Generate AI dog: POST http://localhost:${PORT}/api/generate-ai-dog`);
});