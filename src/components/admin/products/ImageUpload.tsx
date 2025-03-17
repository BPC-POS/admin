import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { CloudUpload, Delete, Edit } from '@mui/icons-material';
import Image from 'next/image';

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  currentImage?: string;
  error?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, currentImage, error }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentImage && typeof currentImage === 'string' && currentImage.trim() !== '') {
      setPreview(currentImage);
    } else {
      setPreview(null);
    }
  }, [currentImage]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  }, []);

  const handleFile = useCallback((file: File) => {
    // Kiểm tra loại file
    if (!file.type.match('image.*')) {
      alert('Vui lòng chọn file hình ảnh');
      return;
    }
    
    // Tạo preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Gửi file lên component cha
    onImageSelect(file);
  }, [onImageSelect]);

  const handleButtonClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleRemoveImage = useCallback(() => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageSelect(null);
  }, [onImageSelect]);

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      
      {!preview ? (
        <Box 
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-64 transition-colors ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'} ${error ? 'border-red-500' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleButtonClick}
          sx={{ cursor: 'pointer' }}
        >
          <CloudUpload className="text-gray-400 mb-3" style={{ fontSize: 48 }} />
          <Typography variant="body1" className="font-medium text-gray-600 mb-1">
            Kéo thả hình ảnh hoặc nhấp để tải lên
          </Typography>
          <Typography variant="caption" className="text-gray-500 text-center">
            Hỗ trợ JPG, PNG, WEBP. Kích thước tối đa 5MB.
          </Typography>
          
          {error && (
            <Typography variant="caption" className="text-red-500 mt-2">
              {error}
            </Typography>
          )}
        </Box>
      ) : (
        <Box className="relative rounded-lg overflow-hidden h-64 group">
          <Image 
            src={preview} 
            alt="Preview" 
            className="object-contain"
            fill
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="space-x-2">
              <IconButton 
                onClick={handleButtonClick}
                className="bg-white text-blue-600 hover:bg-blue-100"
              >
                <Edit />
              </IconButton>
              <IconButton 
                onClick={handleRemoveImage}
                className="bg-white text-red-600 hover:bg-red-100"
              >
                <Delete />
              </IconButton>
            </div>
          </div>
        </Box>
      )}
    </div>
  );
};

export default ImageUpload;