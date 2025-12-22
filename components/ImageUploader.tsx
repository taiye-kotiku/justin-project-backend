import React, { useRef, useCallback, useState } from 'react';

interface ImageUploaderProps {
  onFilesChange: (files: File[]) => void;
  files: File[];
  imagePreviews: string[];
  maxFiles: number;
  id: string;
  label: string;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const RemoveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ onFilesChange, files, imagePreviews, maxFiles, id, label }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = useCallback((incomingFiles: File[]) => {
      const validImageFiles = incomingFiles.filter(file => file.type.startsWith('image/'));
      if (validImageFiles.length > 0) {
        const combined = [...files, ...validImageFiles];
        onFilesChange(combined.slice(0, maxFiles));
      }
  }, [files, maxFiles, onFilesChange]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files ? Array.from(event.target.files) : [];
    processFiles(newFiles);
    // Reset the input value to allow re-uploading the same file
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }, [processFiles]);

  const handleRemoveImage = useCallback((indexToRemove: number) => {
    onFilesChange(files.filter((_, index) => index !== indexToRemove));
  }, [files, onFilesChange]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFiles = event.dataTransfer.files ? Array.from(event.dataTransfer.files) : [];
    processFiles(droppedFiles);
  }, [processFiles]);


  const canUploadMore = files.length < maxFiles;
  const dragClasses = isDragging ? 'border-teal-500 bg-teal-50' : 'border-slate-400';

  return (
    <div 
        className={`w-full p-2 bg-slate-50/50 sketch-border transition-colors ${dragClasses}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
    >
        <input
            type="file"
            id={id}
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
            multiple
        />
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {imagePreviews.map((previewUrl, index) => (
                <div key={previewUrl} className="relative aspect-square group">
                    <img src={previewUrl} alt={`Preview ${index + 1}`} className="w-full h-full object-cover sketch-border sketch-shadow-sm bg-white" />
                    <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-black bg-opacity-60 rounded-full p-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                        aria-label={`Remove image ${index + 1}`}
                    >
                       <RemoveIcon />
                    </button>
                </div>
            ))}
            {canUploadMore && (
                 <button
                    type="button"
                    onClick={handleClick}
                    className="aspect-square bg-white rounded-lg flex flex-col justify-center items-center text-center p-2 cursor-pointer hover:bg-amber-50 transition-colors sketch-border sketch-shadow-sm interactive-wiggle-hover"
                    aria-label={label}
                >
                     <UploadIcon />
                     <p className="text-xs font-bold text-slate-600 mt-1">Add Photo{files.length > 0 ? 's' : ''}</p>
                     <p className="text-xs text-slate-400">({files.length}/{maxFiles})</p>
                </button>
            )}
        </div>
        {isDragging && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex justify-center items-center pointer-events-none rounded-lg">
                <p className="font-bold text-teal-600 text-lg font-header">Drop images here!</p>
            </div>
        )}
    </div>
  );
};