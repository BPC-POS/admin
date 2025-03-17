import React from 'react';
import { Box, Button, TextField, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { FormState } from '@/types/product';

interface ProductAttributesProps {
  formData: FormState;
  handleAddAttribute: () => void;
  handleRemoveAttribute: (index: number) => void;
  handleAttributeChange: (index: number, field: 'attribute_id' | 'value', value: string) => void;
}

const ProductAttributes: React.FC<ProductAttributesProps> = ({ 
  formData, 
  handleAddAttribute, 
  handleRemoveAttribute, 
  handleAttributeChange 
}) => {
  return (
    <div className="w-full">
      {formData.attributes.map((attribute, index) => (
        <Box key={index} className="flex gap-3 items-center mb-4 relative">
          <TextField
            size="small"
            label="ID thuộc tính"
            value={String(attribute.attribute_id)}
            onChange={(e) => handleAttributeChange(index, 'attribute_id', e.target.value)}
            className="w-1/3"
            InputProps={{
              className: "bg-white rounded-lg"
            }}
          />
          <TextField
            size="small" 
            label="Giá trị" 
            value={attribute.value}
            onChange={(e) => handleAttributeChange(index, 'value', e.target.value)} 
            className="flex-1"
            InputProps={{
              className: "bg-white rounded-lg"
            }}
          />
          <Tooltip title="Xóa thuộc tính">
            <IconButton 
              onClick={() => handleRemoveAttribute(index)} 
              className="text-red-500 hover:bg-red-50"
              size="small"
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ))}
      
      <Button 
        startIcon={<AddIcon />} 
        onClick={handleAddAttribute}
        variant="outlined"
        className="mt-2 border-blue-500 text-blue-600 hover:bg-blue-50"
        size="small"
      >
        Thêm thuộc tính
      </Button>
    </div>
  );
};

export default ProductAttributes;