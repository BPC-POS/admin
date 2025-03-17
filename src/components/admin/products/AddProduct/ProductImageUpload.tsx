import React, { useCallback } from 'react';
import {  Typography } from '@mui/material';
import ImageUpload from '../ImageUpload';
import { FormState } from '@/types/product';

interface ProductImageUploadProps {
  formData: FormState; 
  errors: Record<string, string>;
  onFileSelect: (file: File | null) => void;
}

const ProductImageUpload: React.FC<ProductImageUploadProps> = ({ formData, errors, onFileSelect }) => {
  const handleFileChange = useCallback((file: File | null) => {
    onFileSelect(file);
  }, [onFileSelect]);

  return (
    <div className="space-y-4">
      <Typography variant="body2" className="text-gray-600 mb-2">
        Hình ảnh sản phẩm sẽ được hiển thị trên trang sản phẩm và trong kết quả tìm kiếm.
      </Typography>
      
      <ImageUpload
        onImageSelect={handleFileChange}
        currentImage={formData.image || undefined}
        error={errors.image}
      />
      
      {!formData.image && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <Typography variant="caption" className="text-blue-700">
            Gợi ý: Hình ảnh sản phẩm chất lượng cao sẽ giúp tăng tỷ lệ chuyển đổi và giảm tỷ lệ hoàn trả.
          </Typography>
        </div>
      )}
    </div>
  );
};

export default ProductImageUpload;