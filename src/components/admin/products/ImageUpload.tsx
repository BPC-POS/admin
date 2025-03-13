import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Edit
} from '@mui/icons-material';

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  currentImage?: string;
  error?: string;
  isLoading?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  currentImage,
  error,
  isLoading
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 5MB');
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onImageSelect(file);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
  });

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onImageSelect(null);
  };

  return (
    <Box className="w-full">
      <Box
        {...getRootProps()}
        className={`
          relative
          border-2 border-dashed rounded-lg
          transition-all duration-200 ease-in-out
          min-h-[200px]
          flex flex-col items-center justify-center
          cursor-pointer
          overflow-hidden
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
          ${error ? 'border-red-500' : ''}
          hover:border-primary
        `}
      >
        <input {...getInputProps()} />

        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <CircularProgress />
          </div>
        )}

        {(preview || currentImage) ? (
          <div className="relative w-full h-full min-h-[200px]">
            {preview || currentImage ? (
              <Image
                src={preview || currentImage as string}
                alt="Preview"
                fill
                className="object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200">
              <div className="absolute top-2 right-2 flex gap-2">
                <IconButton
                  size="small"
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white hover:bg-gray-100"
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleRemoveImage}
                  className="bg-white hover:bg-gray-100"
                >
                  <Delete fontSize="small" />
                </IconButton>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-6">
            <CloudUpload className="w-12 h-12 text-gray-400 mb-4" />
            <Typography variant="body1" className="mb-2">
              {isDragActive ? (
                'Thả ảnh vào đây'
              ) : (
                'Kéo thả ảnh vào đây hoặc click để chọn ảnh'
              )}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              PNG, JPG, WEBP (tối đa 5MB)
            </Typography>
          </div>
        )}
      </Box>

      {error && (
        <Alert severity="error" className="mt-2">
          {error}
        </Alert>
      )}

      <Typography variant="caption" color="textSecondary" className="mt-2 block">
        * Khuyến nghị sử dụng ảnh có tỷ lệ 1:1 và kích thước tối thiểu 500x500px
      </Typography>
    </Box>
  );
};

export default ImageUpload;