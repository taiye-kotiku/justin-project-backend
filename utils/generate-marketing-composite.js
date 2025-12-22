const canvas = require('canvas');
const fs = require('fs');
const path = require('path');

/**
 * Generate Marketing Composite Image
 * Creates a Polaroid-style composite with:
 * - Original dog photo (top-left, Polaroid style)
 * - Coloring page (main background)
 * - Dog name (bottom text)
 * - dogcoloringbooks.com branding
 */

async function generateMarketingComposite(options) {
  const {
    coloringPageImagePath,  // Path to generated coloring page
    originalDogImagePath,   // Path to original dog photo
    dogName,                // Dog's name for bottom text
    outputPath = null       // Where to save (optional)
  } = options;

  try {
    // Load images
    const coloringPageImage = await canvas.loadImage(coloringPageImagePath);
    const originalDogImage = await canvas.loadImage(originalDogImagePath);

    // Create main canvas - Instagram size: 1080x1350
    const mainCanvas = canvas.createCanvas(1080, 1350);
    const ctx = mainCanvas.getContext('2d');

    // Set background to white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 1080, 1350);

    // ===== STEP 1: Draw coloring page as main background =====
    // Scale coloring page to fit (keeping aspect ratio)
    const coloringPageWidth = 900;
    const coloringPageHeight = (coloringPageImage.height / coloringPageImage.width) * coloringPageWidth;
    const coloringPageX = (1080 - coloringPageWidth) / 2;
    const coloringPageY = 100;

    ctx.drawImage(
      coloringPageImage,
      coloringPageX,
      coloringPageY,
      coloringPageWidth,
      coloringPageHeight
    );

    // ===== STEP 2: Create Polaroid frame for original dog photo =====
    const polaroidWidth = 280;
    const polaroidHeight = 320;
    const polaroidX = 60;
    const polaroidY = 150;

    // Polaroid background (white with shadow)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(polaroidX + 8, polaroidY + 8, polaroidWidth, polaroidHeight);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(polaroidX, polaroidY, polaroidWidth, polaroidHeight);

    // Polaroid border (white frame inside)
    const photoInsetX = polaroidX + 15;
    const photoInsetY = polaroidY + 15;
    const photoWidth = polaroidWidth - 30;
    const photoHeight = 220; // Shorter to leave room for Polaroid text area

    // Clip photo to rectangular area
    ctx.save();
    ctx.beginPath();
    ctx.rect(photoInsetX, photoInsetY, photoWidth, photoHeight);
    ctx.clip();

    // Scale and center original dog image to fit photo area
    const dogImgAspect = originalDogImage.width / originalDogImage.height;
    let drawWidth, drawHeight, drawX, drawY;

    if (dogImgAspect > photoWidth / photoHeight) {
      // Image is wider - fit to height
      drawHeight = photoHeight;
      drawWidth = drawHeight * dogImgAspect;
      drawY = photoInsetY;
      drawX = photoInsetX + (photoWidth - drawWidth) / 2;
    } else {
      // Image is taller - fit to width
      drawWidth = photoWidth;
      drawHeight = drawWidth / dogImgAspect;
      drawX = photoInsetX;
      drawY = photoInsetY + (photoHeight - drawHeight) / 2;
    }

    ctx.drawImage(
      originalDogImage,
      drawX,
      drawY,
      drawWidth,
      drawHeight
    );

    ctx.restore();

    // Polaroid bottom text area (white space)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(polaroidX, polaroidY + 235, polaroidWidth, 85);

    // Add subtle Polaroid border details
    ctx.strokeStyle = '#EEEEEE';
    ctx.lineWidth = 1;
    ctx.strokeRect(polaroidX, polaroidY, polaroidWidth, polaroidHeight);

    // ===== STEP 3: Add dog name at bottom of Polaroid =====
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';

    // Measure text to center it
    const textMetrics = ctx.measureText(dogName);
    const textX = polaroidX + polaroidWidth / 2;
    const textY = polaroidY + 265;

    ctx.fillText(dogName, textX, textY);

    // ===== STEP 4: Add branding at bottom =====
    ctx.fillStyle = '#666666';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('dogcoloringbooks.com', 540, 1320);

    // ===== STEP 5: Save or return =====
    const buffer = mainCanvas.toBuffer('image/png');

    if (outputPath) {
      fs.writeFileSync(outputPath, buffer);
      console.log(`✅ Marketing composite saved: ${outputPath}`);
      return outputPath;
    }

    return buffer;

  } catch (error) {
    console.error('❌ Error generating marketing composite:', error);
    throw error;
  }
}

/**
 * Alternative: Create composite with dog name at bottom (full width)
 * This version puts the dog name at the very bottom of the entire image
 */
async function generateMarketingCompositeV2(options) {
  const {
    coloringPageImagePath,
    originalDogImagePath,
    dogName,
    outputPath = null
  } = options;

  try {
    const coloringPageImage = await canvas.loadImage(coloringPageImagePath);
    const originalDogImage = await canvas.loadImage(originalDogImagePath);

    // Create main canvas - Instagram size: 1080x1350
    const mainCanvas = canvas.createCanvas(1080, 1350);
    const ctx = mainCanvas.getContext('2d');

    // Set background to white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 1080, 1350);

    // Draw coloring page (larger, more centered)
    const coloringPageWidth = 850;
    const coloringPageHeight = (coloringPageImage.height / coloringPageImage.width) * coloringPageWidth;
    const coloringPageX = (1080 - coloringPageWidth) / 2;
    const coloringPageY = 80;

    ctx.drawImage(
      coloringPageImage,
      coloringPageX,
      coloringPageY,
      coloringPageWidth,
      coloringPageHeight
    );

    // Create Polaroid with original photo (left side, overlapping)
    const polaroidWidth = 260;
    const polaroidHeight = 300;
    const polaroidX = 70;
    const polaroidY = 200;

    // Polaroid shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(polaroidX + 6, polaroidY + 6, polaroidWidth, polaroidHeight);

    // Polaroid frame
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(polaroidX, polaroidY, polaroidWidth, polaroidHeight);

    // Photo area
    const photoX = polaroidX + 12;
    const photoY = polaroidY + 12;
    const photoW = polaroidWidth - 24;
    const photoH = 230;

    // Clip and draw photo
    ctx.save();
    ctx.beginPath();
    ctx.rect(photoX, photoY, photoW, photoH);
    ctx.clip();

    const imgAspect = originalDogImage.width / originalDogImage.height;
    let dw, dh, dx, dy;

    if (imgAspect > photoW / photoH) {
      dh = photoH;
      dw = dh * imgAspect;
      dy = photoY;
      dx = photoX + (photoW - dw) / 2;
    } else {
      dw = photoW;
      dh = dw / imgAspect;
      dx = photoX;
      dy = photoY + (photoH - dh) / 2;
    }

    ctx.drawImage(originalDogImage, dx, dy, dw, dh);
    ctx.restore();

    // Polaroid border
    ctx.strokeStyle = '#DDDDDD';
    ctx.lineWidth = 1;
    ctx.strokeRect(polaroidX, polaroidY, polaroidWidth, polaroidHeight);

    // ===== Large dog name at bottom of entire image =====
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(dogName.toUpperCase(), 540, 1280);

    // Branding
    ctx.fillStyle = '#999999';
    ctx.font = '12px Arial';
    ctx.fillText('dogcoloringbooks.com', 540, 1320);

    const buffer = mainCanvas.toBuffer('image/png');

    if (outputPath) {
      fs.writeFileSync(outputPath, buffer);
      console.log(`✅ Marketing composite V2 saved: ${outputPath}`);
      return outputPath;
    }

    return buffer;

  } catch (error) {
    console.error('❌ Error generating marketing composite V2:', error);
    throw error;
  }
}

module.exports = {
  generateMarketingComposite,
  generateMarketingCompositeV2
};
