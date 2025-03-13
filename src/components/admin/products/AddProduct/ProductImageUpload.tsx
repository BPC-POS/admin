import React from 'react';
import { Grid } from '@mui/material';
import ImageUpload from '../ImageUpload';

interface ProductImageUploadProps {
  formData: any; // Use FormState interface if available
  errors: any;    // Use Record<string, string> if available
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  handleImageSelect: (file: File) => void;
}

const ProductImageUpload: React.FC<ProductImageUploadProps> = ({ formData, errors, setImageFile, handleImageSelect }) => {
  return (
    <Grid item xs={12} md={4}>
      <div className="space-y-4">
        <ImageUpload
          onImageSelect={(file) => file && handleImageSelect(file)}
          currentImage={formData.image || undefined}
          error={errors.image}
        />
      </div>
    </Grid>
  );
};

export default ProductImageUpload;