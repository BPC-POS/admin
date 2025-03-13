import React from 'react';
import { Box, Typography, Button, TextField, IconButton, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface ProductAttributesProps {
  formData: any; // Use FormState interface if available
  handleAddAttribute: () => void;
  handleRemoveAttribute: (index: number) => void;
  handleAttributeChange: (index: number, field: 'attribute_id' | 'value', value: string) => void;
}

const ProductAttributes: React.FC<ProductAttributesProps> = ({ formData, handleAddAttribute, handleRemoveAttribute, handleAttributeChange }) => {
  return (
    <Grid item xs={12}>
      <Box className="bg-white/50 backdrop-blur-sm rounded-lg p-2 mt-2">
        <div className="flex justify-between items-center mb-2">
          <div className="font-semibold">Thuộc tính sản phẩm</div>
          <div className="text-blue-600 cursor-pointer text-sm" onClick={handleAddAttribute}>Thêm thuộc tính</div>
        </div>
        {formData.attributes.map((attribute: { attribute_id: any; value: unknown; }, index: number) => (
          <Box key={index} className="flex gap-2 items-center mb-2">
            <TextField
              size="small"
              label="ID thuộc tính"
              value={String(attribute.attribute_id)} // Cast to String here
              onChange={(e) => handleAttributeChange(index, 'attribute_id', e.target.value)}
              className="w-24 bg-white/70"
            />
            <TextField
              size="small" label="Giá trị" value={attribute.value}
              onChange={(e) => handleAttributeChange(index, 'value', e.target.value)} className="flex-1 bg-white/70"
            />
            {formData.attributes.length > 1 && (
              <div onClick={() => handleRemoveAttribute(index)} className="cursor-pointer text-red-500"><RemoveIcon /></div>
            )}
          </Box>
        ))}
      </Box>
    </Grid>
  );
};

export default ProductAttributes;