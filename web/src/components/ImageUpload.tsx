import React, { useState, useRef } from 'react';
import { ImageService } from '@/services/imageService';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  type: 'avatar' | 'experience' | 'cover' | 'story';
  multiple?: boolean;
  token: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  type,
  multiple = false,
  token,
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      if (multiple && files.length > 1) {
        // Upload multiple images
        const result = await ImageService.uploadMultipleImages(files, token);
        
        if (result.success && result.data) {
          result.data.forEach((file: any) => {
            onImageUploaded(file.url);
          });
        } else {
          setError(result.message || 'Upload failed');
        }
      } else {
        // Upload single image
        const result = await ImageService.uploadImage(files[0], type, token);
        
        if (result.success && result.data) {
          onImageUploaded(result.data.url);
        } else {
          setError(result.message || 'Upload failed');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`image-upload ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <button
        onClick={handleClick}
        disabled={uploading}
        className={`
          px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 
          hover:border-blue-500 hover:bg-blue-50 transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center gap-2
          ${uploading ? 'cursor-wait' : 'cursor-pointer'}
        `}
      >
        {uploading ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
            </svg>
            Uploading...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {multiple ? 'Upload Images' : 'Upload Image'}
          </>
        )}
      </button>

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
};

export default ImageUpload;
