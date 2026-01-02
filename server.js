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

// ============================================
// CRITICAL HELPER: Strip data URL prefix
// ============================================
// Gemini API needs RAW base64 ONLY, not "data:image/jpeg;base64,..."
function stripDataUrlPrefix(base64String) {
  if (typeof base64String !== 'string') return base64String;
  
  if (base64String.startsWith('data:')) {
    // Extract just the base64 part: data:image/jpeg;base64,XXX => XXX
    const parts = base64String.split(',');
    if (parts.length === 2) {
      return parts[1];
    }
  }
  return base64String;
}

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
  // ✅ STRIP DATA URL PREFIX
  const cleanBase64 = stripDataUrlPrefix(base64Image);
  
  const imagePart = {
    inlineData: {
      data: cleanBase64,
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
  // ✅ STRIP DATA URL PREFIX - THIS IS THE KEY FIX
  const cleanBase64 = stripDataUrlPrefix(dogImageBase64);
  
  const imagePart = {
    inlineData: {
      data: cleanBase64,  // Now just raw base64, no "data:image/jpeg;base64," prefix
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
  console.log('🔍 Gemini response candidate:', JSON.stringify(candidate, null, 2));
  
  if (candidate?.content?.parts) {
    console.log('📦 Response parts:', candidate.content.parts.length);
    for (let i = 0; i < candidate.content.parts.length; i++) {
      const part = candidate.content.parts[i];
      console.log(`  Part ${i}:`, Object.keys(part));
      
      // Try inlineData format
      if (part.inlineData && part.inlineData.data) {
        console.log('✅ Found inlineData format');
        return {
          base64: part.inlineData.data,
          mimeType: part.inlineData.mimeType
        };
      }
      
      // Try direct base64 field
      if (part.base64) {
        console.log('✅ Found base64 field');
        return {
          base64: part.base64,
          mimeType: part.mimeType || 'image/png'
        };
      }
      
      // Try imageData field
      if (part.imageData) {
        console.log('✅ Found imageData field');
        return {
          base64: part.imageData.data || part.imageData,
          mimeType: part.imageData.mimeType || 'image/png'
        };
      }
    }
  }

  console.error('❌ No image data found in response. Full response:', JSON.stringify(response, null, 2));
  throw new Error('Failed to generate image - no image data in Gemini response');
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
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Blotato upload failed: ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    
    // Return the Blotato media URL
    return data.url;
  } catch (error) {
    console.error('Error uploading to Blotato:', error);
    throw error;
  }
}

// Helper: Upload base64 image to Blotato
async function uploadBase64ToBlotato(base64Data, fileName = 'image.jpg') {
  try {
    // Strip data URL prefix if present
    const cleanBase64 = stripDataUrlPrefix(base64Data);
    
    console.log('Uploading base64 image to Blotato...');
    
    const response = await fetch('https://backend.blotato.com/v2/media/base64', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BLOTATO_API_KEY}`
      },
      body: JSON.stringify({
        file: cleanBase64,
        fileName: fileName,
        mimeType: 'image/jpeg'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Blotato base64 upload failed: ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    
    // Return the Blotato media URL
    return data.url;
  } catch (error) {
    console.error('Error uploading base64 to Blotato:', error);
    throw error;
  }
}

// ============================================
// API ENDPOINT 1: Generate Single Coloring Page
// ============================================
app.post('/api/generate-single', async (req, res) => {
  try {
    const { dogName, imageBase64, mimeType, theme, petHandle } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    console.log(`🎨 Generating single coloring page for: ${dogName}`);

    // Generate coloring page
    const coloringResult = await generateColoringPage(imageBase64, mimeType, theme, dogName);

    // Log to N8N (fire and forget)
    logToN8N({
      status: 'success',
      dogName,
      originalImageBase64: imageBase64,
      generatedImageBase64: coloringResult.base64,
      theme,
      mimeType
    });

    res.json({
      success: true,
      imageBase64: coloringResult.base64,
      mimeType: coloringResult.mimeType
    });

  } catch (error) {
    console.error('❌ Error generating single coloring page:', error.message);
    
    // Log error to N8N
    logToN8N({
      status: 'error',
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// API ENDPOINT 2: Create Marketing Image (Customizable)
// ============================================
app.post('/api/create-marketing-image', async (req, res) => {
  try {
    const {
      coloringPageBase64,
      dogName,
      headerLine1,
      headerLine2,
      arrowText,
      websiteText,
      circleColor,
      backgroundColor,
      mimeType
    } = req.body;

    if (!coloringPageBase64) {
      return res.status(400).json({ error: 'coloringPageBase64 is required' });
    }

    console.log(`📊 Creating marketing image for: ${dogName}`);

    // ✅ STRIP DATA URL PREFIX
    const cleanBase64 = stripDataUrlPrefix(coloringPageBase64);
    
    const imagePart = {
      inlineData: {
        data: cleanBase64,
        mimeType: mimeType || 'image/png'
      }
    };

    const prompt = `Create a professional Instagram marketing composite for a dog coloring book. The image shows a coloring book page on the left side and text/graphics on the right side.

**Image Setup:**
- Canvas size: 1080x1080px (Instagram square format)
- Background color: ${backgroundColor || '#f5f5f5'}
- Left side: The provided coloring book page (scaled to 50% width)
- Right side: Text and design elements

**Right Side Design (50% of canvas):**
- Header Line 1: "${headerLine1 || 'Turn Your Dog into'}"
- Header Line 2: "${headerLine2 || 'A Coloring Book'}"
- Arrow Element pointing from text to image
- Arrow Text: "${arrowText || 'See the Transformation'}"
- Website URL: "${websiteText || 'www.dogcoloringbooks.com'}"
- Circle accent color: ${circleColor || '#FF6B9D'}

**Style:**
- Professional, clean, modern design
- Use the provided circle color for accents and highlights
- Make the coloring book page look appealing and clear
- Use typography that's Instagram-friendly
- Ensure good contrast and readability

Generate the composite image exactly as described.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { 
        parts: [imagePart, { text: prompt }] 
      },
      config: { 
        responseModalities: [Modality.IMAGE, Modality.TEXT]
      }
    });

    const candidate = response.candidates?.[0];
    console.log('🔍 Marketing image response candidate:', JSON.stringify(candidate, null, 2));
    
    if (candidate?.content?.parts) {
      console.log('📦 Response parts:', candidate.content.parts.length);
      for (let i = 0; i < candidate.content.parts.length; i++) {
        const part = candidate.content.parts[i];
        console.log(`  Part ${i}:`, Object.keys(part));
        
        if (part.inlineData && part.inlineData.data) {
          console.log('✅ Marketing image created successfully!');
          logToN8N({
            status: 'success',
            dogName,
            compositeImageBase64: part.inlineData.data,
            template: 'customizable',
            mimeType: part.inlineData.mimeType
          });
          return res.json({
            success: true,
            imageBase64: part.inlineData.data,
            mimeType: part.inlineData.mimeType,
            template: 'customizable'
          });
        }
        
        if (part.base64) {
          console.log('✅ Marketing image created successfully! (base64 format)');
          logToN8N({
            status: 'success',
            dogName,
            compositeImageBase64: part.base64,
            template: 'customizable',
            mimeType: part.mimeType || 'image/png'
          });
          return res.json({
            success: true,
            imageBase64: part.base64,
            mimeType: part.mimeType || 'image/png',
            template: 'customizable'
          });
        }
      }
    }

    console.error('❌ No image data in marketing response:', JSON.stringify(response, null, 2));
    throw new Error('Failed to generate marketing image - no image data in response');

  } catch (error) {
    console.error('❌ Error creating marketing image:', error.message);
    
    // Log error to N8N
    logToN8N({
      status: 'error',
      template: 'customizable',
      error: error.message
    });

    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ============================================
// API ENDPOINT 3: Generate Marketing Composite (Polaroid)
// ============================================
app.post('/api/generate-marketing-composite', async (req, res) => {
  try {
    const { originalImageBase64, coloringPageBase64, dogName, mimeType } = req.body;

    if (!originalImageBase64 || !coloringPageBase64) {
      return res.status(400).json({ error: 'originalImageBase64 and coloringPageBase64 are required' });
    }

    console.log(`📷 Creating Polaroid composite for: ${dogName}`);

    // ✅ STRIP DATA URL PREFIXES FOR BOTH IMAGES
    const cleanOriginalBase64 = stripDataUrlPrefix(originalImageBase64);
    const cleanColoringBase64 = stripDataUrlPrefix(coloringPageBase64);

    const originalPart = {
      inlineData: {
        data: cleanOriginalBase64,
        mimeType: mimeType || 'image/jpeg'
      }
    };

    const coloringPart = {
      inlineData: {
        data: cleanColoringBase64,
        mimeType: mimeType || 'image/png'
      }
    };

    const prompt = `Create a premium scrapbook-style marketing composite for dog coloring books. This is a sophisticated Instagram post with precise layout specifications.

**CANVAS:** 1080x1080px square

**BACKGROUND:** CRITICAL - Must have visible rough, textured kraft paper appearance with:
- Visible paper grain texture (NOT smooth or plain)
- Color variation (aged/vintage look with slight brown/tan spots)
- Paper fiber details visible
- Authentic weathered scrapbook paper aesthetic
- This is the most important visual element after the big polaroid

**LAYOUT - EXACT SPECIFICATIONS:**

1. **BIG POLAROID (MAIN COLORING IMAGE) - THE DOMINANT ELEMENT**
   - Contains: The provided coloring book page illustration
   - Size: VERY LARGE - occupies 80-85% of the entire canvas space
   - Position: Centered, with minimal white space around it
   - Polaroid Frame: White border - 6px sides/top, 20px bottom
   - Dog Name: "${dogName}" in elegant black script on the white bottom border
   - Shadow: Strong drop shadow underneath
   - The coloring page should be EXTREMELY PROMINENT and take up most of the visible space

2. **SMALL POLAROID (ORIGINAL DOG PHOTO) - SECONDARY ACCENT**
   - Contains: Original dog photo
   - Size: 15-20% the width of big polaroid (very small)
   - Position: Left side, vertically centered (50% down from top)
   - Overlap: Slightly overlaps the left edge of big polaroid
   - Shadow: Subtle

3. **PAPERCLIP - SMALL FASTENER**
   - Size: 20-30px (SMALL, not prominent)
   - Position: At vertical middle (50%) of big polaroid's left edge
   - Style: Realistic metal, silver/gray
   - Purpose: Functional fastener, not decorative

**CRITICAL REQUIREMENTS:**
- NO PENCILS OR COLORED PENCILS ANYWHERE - completely remove
- NO decorative elements besides the two polaroids and paperclip
- BIG POLAROID must be 80-85% of canvas (NOT 60%)
- BACKGROUND must show visible paper texture/grain (NOT plain white)
- PAPERCLIP must be 20-30px (smaller than current)
- Clean, minimal composition focused on the transformation

This is a scrapbook-style transformation showcase with textured background and clean layout.`;

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
    console.log('🔍 Polaroid composite response candidate:', JSON.stringify(candidate, null, 2));
    
    if (candidate?.content?.parts) {
      console.log('📦 Response parts:', candidate.content.parts.length);
      for (let i = 0; i < candidate.content.parts.length; i++) {
        const part = candidate.content.parts[i];
        console.log(`  Part ${i}:`, Object.keys(part));
        
        if (part.inlineData && part.inlineData.data) {
          console.log('✅ Polaroid composite created successfully!');
          logToN8N({
            status: 'success',
            dogName,
            compositeImageBase64: part.inlineData.data,
            template: 'polaroid',
            mimeType: part.inlineData.mimeType
          });
          return res.json({
            success: true,
            imageBase64: part.inlineData.data,
            mimeType: part.inlineData.mimeType,
            template: 'polaroid'
          });
        }
        
        if (part.base64) {
          console.log('✅ Polaroid composite created successfully! (base64 format)');
          logToN8N({
            status: 'success',
            dogName,
            compositeImageBase64: part.base64,
            template: 'polaroid',
            mimeType: part.mimeType || 'image/png'
          });
          return res.json({
            success: true,
            imageBase64: part.base64,
            mimeType: part.mimeType || 'image/png',
            template: 'polaroid'
          });
        }
      }
    }

    console.error('❌ No image data in Polaroid response:', JSON.stringify(response, null, 2));
    throw new Error('Failed to generate composite image - no image data in response');

  } catch (error) {
    console.error('❌ Error creating Polaroid composite:', error.message);
    
    // Log error to N8N
    logToN8N({
      status: 'error',
      template: 'polaroid',
      error: error.message
    });

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
  console.log(`🎨 Generate single coloring: POST http://localhost:${PORT}/api/generate-single`);
  console.log(`📊 Create marketing (customizable): POST http://localhost:${PORT}/api/create-marketing-image`);
  console.log(`📷 Create marketing (polaroid): POST http://localhost:${PORT}/api/generate-marketing-composite`);
  console.log(`📸 Post to Instagram: POST http://localhost:${PORT}/api/post-to-instagram`);
  console.log(`🤖 Generate AI dog: POST http://localhost:${PORT}/api/generate-ai-dog`);
});