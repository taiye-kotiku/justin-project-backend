import React, { useState } from 'react';

interface GeneratedResult {
  imageBase64: string;
  caption: string;
  mimeType: string;
}

export const SingleImageUI: React.FC = () => {
  const [dogName, setDogName] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<GeneratedResult | null>(null);
  const [editedCaption, setEditedCaption] = useState('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setError('');
    }
  };

  const handleGenerate = async () => {
    if (!uploadedFile || !dogName.trim()) {
      setError('Please provide both a dog name and photo!');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedResult(null);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(uploadedFile);
      
      await new Promise((resolve) => {
        reader.onloadend = resolve;
      });

      const base64 = (reader.result as string).split(',')[1];

      // Call backend API
      const response = await fetch('http://localhost:3001/api/generate-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dogName: dogName.trim(),
          imageUrl: `data:image/jpeg;base64,${base64}`,
          themes: ['A fun coloring book adventure'],
          petHandle: instagramHandle.trim()
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Generation failed');
      }

      const result = data.results[0];
      setGeneratedResult(result);
      setEditedCaption(result.caption);
      setSuccess('Generated successfully! Review and post below.');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePostToInstagram = async () => {
    if (!generatedResult) return;

    setIsPosting(true);
    setError('');

    try {
      // First, convert base64 to blob and upload to a temporary storage
      // For now, we'll use the base64 directly
      const imageDataUrl = `data:${generatedResult.mimeType};base64,${generatedResult.imageBase64}`;

      const response = await fetch('http://localhost:3001/api/post-to-instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: imageDataUrl,
          caption: editedCaption
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Posting failed');
      }

      setSuccess('🎉 Posted to Instagram successfully!');
      
      // Reset after 3 seconds
      setTimeout(() => {
        handleReset();
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post');
    } finally {
      setIsPosting(false);
    }
  };

  const handleReset = () => {
    setDogName('');
    setInstagramHandle('');
    setUploadedFile(null);
    setPreviewUrl('');
    setGeneratedResult(null);
    setEditedCaption('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            🐶 Dog Coloring Book Generator
          </h1>
          <p className="text-slate-600">
            Upload a photo, generate a coloring page, and post to Instagram!
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT SIDE: Input Form */}
          <div className="bg-slate-50 rounded-lg p-6 border-2 border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              1️⃣ Upload & Generate
            </h2>

            {/* Dog Name */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Dog Name *
              </label>
              <input
                type="text"
                value={dogName}
                onChange={(e) => setDogName(e.target.value)}
                placeholder="e.g., Buddy"
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                disabled={isGenerating || !!generatedResult}
              />
            </div>

            {/* Instagram Handle */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Instagram Handle (Optional)
              </label>
              <input
                type="text"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                placeholder="@buddys_adventures"
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                disabled={isGenerating || !!generatedResult}
              />
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Upload Photo *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full"
                disabled={isGenerating || !!generatedResult}
              />
              {previewUrl && (
                <div className="mt-4">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg border-2 border-slate-300"
                  />
                </div>
              )}
            </div>

            {/* Generate Button */}
            {!generatedResult && (
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !uploadedFile || !dogName.trim()}
                className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  '✨ Generate Coloring Page'
                )}
              </button>
            )}

            {/* Reset Button */}
            {generatedResult && (
              <button
                onClick={handleReset}
                className="w-full bg-gray-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-gray-700 transition-all"
              >
                ❌ Reject & Start Over
              </button>
            )}
          </div>

          {/* RIGHT SIDE: Generated Result */}
          <div className="bg-slate-50 rounded-lg p-6 border-2 border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              2️⃣ Review & Post
            </h2>

            {!generatedResult && !isGenerating && (
              <div className="flex items-center justify-center h-64 text-slate-400">
                <p>Your generated coloring page will appear here...</p>
              </div>
            )}

            {isGenerating && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-blue-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="text-slate-600 font-bold">Generating your coloring page...</p>
                </div>
              </div>
            )}

            {generatedResult && (
              <div className="space-y-4">
                {/* Generated Image */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Generated Coloring Page
                  </label>
                  <img
                    src={`data:${generatedResult.mimeType};base64,${generatedResult.imageBase64}`}
                    alt="Generated coloring page"
                    className="w-full rounded-lg border-2 border-slate-300"
                  />
                </div>

                {/* Editable Caption */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Caption (Editable)
                  </label>
                  <textarea
                    value={editedCaption}
                    onChange={(e) => setEditedCaption(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  />
                </div>

                {/* Post Button */}
                <button
                  onClick={handlePostToInstagram}
                  disabled={isPosting}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all"
                >
                  {isPosting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Posting to Instagram...
                    </span>
                  ) : (
                    '📸 Post to Instagram'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mt-6 bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        {success && (
          <div className="mt-6 bg-green-100 border-2 border-green-400 text-green-700 px-4 py-3 rounded-lg">
            <strong>Success:</strong> {success}
          </div>
        )}
      </div>
    </div>
  );
};