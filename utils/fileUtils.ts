import { GenerativePart } from '../types';

export const fileToGenerativePart = async (file: File): Promise<GenerativePart> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // The result includes the data URL prefix (e.g., "data:image/jpeg;base64,"), 
        // which we need to remove.
        const base64Data = reader.result.split(',')[1];
        resolve(base64Data);
      } else {
        resolve(''); // Should not happen with readAsDataURL
      }
    };
    reader.readAsDataURL(file);
  });

  const base64Data = await base64EncodedDataPromise;
  
  return {
    inlineData: {
      data: base64Data,
      mimeType: file.type,
    },
  };
};

/**
 * Converts a base64 string directly into a GenerativePart object.
 * @param base64 The base64 encoded string.
 * @param mimeType The MIME type of the data.
 * @returns A GenerativePart object.
 */
export const base64ToGenerativePart = (base64: string, mimeType: string): GenerativePart => {
  return {
    inlineData: {
      data: base64,
      mimeType: mimeType,
    },
  };
};


/**
 * Converts a base64 string to a File object.
 * @param base64 The base64 encoded string.
 * @param mimeType The MIME type of the file.
 * @param filename The desired filename for the new File object.
 * @returns A File object.
 */
export const base64ToFile = (base64: string, mimeType: string, filename: string): File => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  return new File([blob], filename, { type: mimeType });
};