/**
 * Draws a rectangle with a "sketchy" or "wobbly" border.
 * @param ctx The canvas rendering context.
 * @param x The x-coordinate of the top-left corner.
 * @param y The y-coordinate of the top-left corner.
 * @param width The width of the rectangle.
 * @param height The height of the rectangle.
 * @param wobble The amount of randomness in the lines.
 */
const drawSketchyRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, wobble: number = 2) => {
    ctx.beginPath();
    // Helper to add randomness
    const rand = (val: number) => val + (Math.random() - 0.5) * wobble;

    // Top line
    ctx.moveTo(rand(x), rand(y));
    ctx.quadraticCurveTo(rand(x + width / 2), rand(y), rand(x + width), rand(y));

    // Right line
    ctx.quadraticCurveTo(rand(x + width), rand(y + height / 2), rand(x + width), rand(y + height));

    // Bottom line
    ctx.quadraticCurveTo(rand(x + width / 2), rand(y + height), rand(x), rand(y + height));
    
    // Left line
    ctx.quadraticCurveTo(rand(x), rand(y + height / 2), rand(x), rand(y));
    
    ctx.closePath();
    ctx.stroke();
};


/**
 * Wraps text to fit within a max width on a canvas.
 * @param ctx The canvas rendering context.
 * @param text The text to wrap.
 * @param x The starting x-coordinate.
 * @param y The starting y-coordinate.
 * @param maxWidth The maximum width for a line of text.
 * @param lineHeight The height of each line.
 * @returns The total height of the wrapped text block.
 */
const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number => {
    const words = text.split(' ');
    let line = '';
    let totalHeight = 0;

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            y += lineHeight;
            totalHeight += lineHeight;
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
    totalHeight += lineHeight;
    return totalHeight;
};

/**
 * Creates an image from text, styled like a coloring book story page.
 * @param text The story text.
 * @param width The width of the output image.
 * @param height The height of the output image.
 * @returns A promise that resolves to a base64 encoded PNG string (without the data URL prefix).
 */
export const generateTextPageAsImage = async (text: string, width: number, height: number): Promise<string> => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error("Could not get canvas context");
    }

    // The font is loaded in index.html, but we can wait for fonts to be ready for robustness.
    await document.fonts.ready;

    // 1. Fill background
    ctx.fillStyle = '#fef3c7'; // amber-100
    ctx.fillRect(0, 0, width, height);

    // 2. Draw sketchy border
    const padding = 40;
    const borderWidth = 4;
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = '#4a4a4a';
    drawSketchyRect(ctx, padding, padding, width - padding * 2, height - padding * 2, 3);
    
    // 3. Prepare and wrap text
    const fontSize = 36;
    const lineHeight = fontSize * 1.4;
    ctx.font = `bold ${fontSize}px "Comic Neue", cursive`;
    ctx.fillStyle = '#3f3f46'; // zinc-700
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    const textX = padding + 25;
    const textMaxWidth = width - (padding + 25) * 2;

    // To vertically center, we need to pre-calculate the height
    const tempWords = text.split(' ');
    let tempLine = '';
    let lineCount = 1;
     for (let n = 0; n < tempWords.length; n++) {
        const testLine = tempLine + tempWords[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > textMaxWidth && n > 0) {
            lineCount++;
            tempLine = tempWords[n] + ' ';
        } else {
            tempLine = testLine;
        }
    }
    const textBlockHeight = lineCount * lineHeight;
    const textY = (height / 2) - (textBlockHeight / 2);
    
    // Now, actually draw the text
    wrapText(ctx, text, textX, textY, textMaxWidth, lineHeight);

    // 4. Export as base64
    // `toDataURL` returns the full data URL, we need to strip the prefix for JSZip
    return canvas.toDataURL('image/png').split(',')[1];
};
