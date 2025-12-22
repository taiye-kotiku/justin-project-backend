import React, { useState } from 'react';

interface BulkItem {
  id: string;
  dogName: string;
  imageUrl?: string;
  imageFile?: File;
  generatedImage?: string;
  caption?: string;
  status: 'pending' | 'generating' | 'ready' | 'approved' | 'rejected';
  error?: string;
}

export const BulkGenerationUI: React.FC = () => {
  const [items, setItems] = useState<BulkItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [autoGenerateCount, setAutoGenerateCount] = useState(10);

  // CSV Upload Handler
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').slice(1); // Skip header
      
      const parsedItems: BulkItem[] = lines
        .filter(line => line.trim())
        .map((line, index) => {
          const [dogName, imageUrl] = line.split(',').map(s => s.trim());
          return {
            id: `csv-${index}`,
            dogName: dogName || `Dog ${index + 1}`,
            imageUrl: imageUrl || undefined,
            status: 'pending' as const
          };
        });
      
      setItems(parsedItems);
    };
    
    reader.readAsText(file);
  };

  // Batch Image Upload Handler
  const handleBatchImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const fileArray: File[] = Array.from(files);
    
    const newItems: BulkItem[] = fileArray.map((file: File, index: number) => ({
      id: `upload-${Date.now()}-${index}`,
      dogName: file.name.replace(/\.[^/.]+$/, ''), // Use filename without extension
      imageFile: file,
      status: 'pending' as const
    }));
    
    setItems(prev => [...prev, ...newItems]);
  };

  // Auto-Generate Mock Dogs
  const handleAutoGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const newItems: BulkItem[] = [];
      
      for (let i = 0; i < autoGenerateCount; i++) {
        // Call backend to generate AI dog concept
        const response = await fetch('http://localhost:3001/api/generate-ai-dog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          const data = await response.json() as {
            success: boolean;
            name: string;
            breed: string;
            personality: string;
            imageBase64: string;
            mimeType: string;
          };
          
          if (data.success && data.name) {
            newItems.push({
              id: `ai-${Date.now()}-${i}`,
              dogName: data.name,
              imageUrl: `data:${data.mimeType};base64,${data.imageBase64}`,
              status: 'pending' as const
            });
          }
        }
      }
      
      setItems(prev => [...prev, ...newItems]);
    } catch (error) {
      console.error('Error generating AI dogs:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate All Coloring Pages
  const handleGenerateAll = async () => {
    setIsGenerating(true);
    
    const pendingItems = items.filter(item => item.status === 'pending');
    
    for (const item of pendingItems) {
      // Update status to generating
      setItems(prev => prev.map(i => 
        i.id === item.id ? { ...i, status: 'generating' as const } : i
      ));
      
      try {
        // Prepare image input
        let imageInput: string;
        
        if (item.imageFile) {
          // Convert file to base64
          const base64 = await fileToBase64(item.imageFile);
          imageInput = base64;
        } else if (item.imageUrl) {
          imageInput = item.imageUrl;
        } else {
          throw new Error('No image provided');
        }
        
        // Call generation API
        const response = await fetch('http://localhost:3001/api/generate-batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dogName: item.dogName,
            imageUrl: imageInput,
            themes: ['A fun coloring book adventure'],
            petHandle: ''
          })
        });
        
        const data = await response.json() as {
          success: boolean;
          results?: Array<{
            imageBase64: string;
            mimeType: string;
            caption: string;
          }>;
          error?: string;
        };
        
        if (data.success && data.results && data.results[0]) {
          const result = data.results[0];
          setItems(prev => prev.map(i => 
            i.id === item.id ? {
              ...i,
              status: 'ready' as const,
              generatedImage: `data:${result.mimeType};base64,${result.imageBase64}`,
              caption: result.caption
            } : i
          ));
        } else {
          throw new Error(data.error || 'Generation failed');
        }
        
      } catch (error) {
        setItems(prev => prev.map(i => 
          i.id === item.id ? {
            ...i,
            status: 'rejected' as const,
            error: error instanceof Error ? error.message : 'Failed'
          } : i
        ));
      }
    }
    
    setIsGenerating(false);
  };

  // Bulk Approve
  const handleBulkApprove = () => {
    setItems(prev => prev.map(item => 
      item.status === 'ready' ? { ...item, status: 'approved' as const } : item
    ));
  };

  // Bulk Reject
  const handleBulkReject = () => {
    setItems(prev => prev.map(item => 
      item.status === 'ready' ? { ...item, status: 'rejected' as const } : item
    ));
  };

  // Individual Approve
  const handleApprove = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'approved' as const } : item
    ));
  };

  // Individual Reject
  const handleReject = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'rejected' as const } : item
    ));
  };

  // Update Caption
  const handleCaptionChange = (id: string, newCaption: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, caption: newCaption } : item
    ));
  };

  // Schedule Approved Posts
  const handleScheduleAll = async () => {
    const approvedItems = items.filter(item => item.status === 'approved');
    
    // In a real implementation, this would call your n8n workflow or backend
    console.log('Scheduling posts:', approvedItems);
    alert(`Scheduled ${approvedItems.length} posts!`);
  };

  // Helper: Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const readyCount = items.filter(i => i.status === 'ready').length;
  const approvedCount = items.filter(i => i.status === 'approved').length;
  const rejectedCount = items.filter(i => i.status === 'rejected').length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            🚀 Bulk Content Generator
          </h1>
          <p className="text-slate-600">
            Generate multiple coloring pages at once - perfect for monthly content batches!
          </p>
        </div>

        {/* Upload Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* CSV Upload */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">📄 Upload CSV</h3>
            <p className="text-sm text-slate-600 mb-4">
              Format: DogName, ImageURL (one per line)
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="w-full text-sm"
            />
          </div>

          {/* Batch Image Upload */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">📸 Upload Images</h3>
            <p className="text-sm text-slate-600 mb-4">
              Select multiple images at once
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleBatchImageUpload}
              className="w-full text-sm"
            />
          </div>

          {/* Auto Generate */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">🤖 Auto-Generate</h3>
            <p className="text-sm text-slate-600 mb-4">
              Create AI mock dogs
            </p>
            <div className="flex gap-2">
              <input
                type="number"
                value={autoGenerateCount}
                onChange={(e) => setAutoGenerateCount(Number(e.target.value))}
                min="1"
                max="50"
                className="w-20 px-2 py-1 border rounded"
              />
              <button
                onClick={handleAutoGenerate}
                disabled={isGenerating}
                className="flex-1 bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 disabled:bg-gray-300 text-sm"
              >
                Generate
              </button>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        {items.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="text-sm text-slate-600">
                <strong>{items.length}</strong> items | 
                <span className="text-blue-600 ml-2"><strong>{readyCount}</strong> ready</span> | 
                <span className="text-green-600 ml-2"><strong>{approvedCount}</strong> approved</span> | 
                <span className="text-red-600 ml-2"><strong>{rejectedCount}</strong> rejected</span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleGenerateAll}
                  disabled={isGenerating || items.filter(i => i.status === 'pending').length === 0}
                  className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 disabled:bg-gray-300"
                >
                  {isGenerating ? 'Generating...' : '✨ Generate All'}
                </button>
                
                <button
                  onClick={handleBulkApprove}
                  disabled={readyCount === 0}
                  className="bg-green-600 text-white font-bold py-2 px-6 rounded hover:bg-green-700 disabled:bg-gray-300"
                >
                  ✅ Approve All Ready
                </button>
                
                <button
                  onClick={handleBulkReject}
                  disabled={readyCount === 0}
                  className="bg-red-600 text-white font-bold py-2 px-6 rounded hover:bg-red-700 disabled:bg-gray-300"
                >
                  ❌ Reject All Ready
                </button>
                
                <button
                  onClick={handleScheduleAll}
                  disabled={approvedCount === 0}
                  className="bg-purple-600 text-white font-bold py-2 px-6 rounded hover:bg-purple-700 disabled:bg-gray-300"
                >
                  📅 Schedule {approvedCount} Posts
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div
              key={item.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden border-4 ${
                item.status === 'approved' ? 'border-green-500' :
                item.status === 'rejected' ? 'border-red-500' :
                item.status === 'ready' ? 'border-blue-500' :
                'border-gray-200'
              }`}
            >
              {/* Image Preview */}
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                {item.generatedImage ? (
                  <img src={item.generatedImage} alt={item.dogName} className="h-full w-full object-cover" />
                ) : item.status === 'generating' ? (
                  <div className="text-center">
                    <svg className="animate-spin h-12 w-12 mx-auto text-blue-600" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-sm text-slate-600 mt-2">Generating...</p>
                  </div>
                ) : (
                  <p className="text-slate-400">Preview</p>
                )}
              </div>

              {/* Details */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{item.dogName}</h3>
                
                {item.caption && (
                  <textarea
                    value={item.caption}
                    onChange={(e) => handleCaptionChange(item.id, e.target.value)}
                    rows={3}
                    className="w-full text-sm px-2 py-1 border rounded mb-2 resize-none"
                  />
                )}
                
                {item.error && (
                  <p className="text-red-600 text-sm mb-2">{item.error}</p>
                )}

                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    item.status === 'approved' ? 'bg-green-100 text-green-800' :
                    item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    item.status === 'ready' ? 'bg-blue-100 text-blue-800' :
                    item.status === 'generating' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status.toUpperCase()}
                  </span>

                  {/* Action Buttons */}
                  {item.status === 'ready' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="bg-green-600 text-white text-xs font-bold py-1 px-3 rounded hover:bg-green-700"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        className="bg-red-600 text-white text-xs font-bold py-1 px-3 rounded hover:bg-red-700"
                      >
                        ✗
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              No Items Yet
            </h3>
            <p className="text-slate-600">
              Upload a CSV, select images, or auto-generate mock dogs to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};