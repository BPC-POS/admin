import React from 'react';
import { Box, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem, IconButton, Grid, Divider, Tooltip, Card, CardContent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { ProductStatus } from '@/types/product';
import { FormState } from '@/types/product';

interface ProductVariantsProps {
  formData: FormState;
  handleAddVariant: () => void;
  handleRemoveVariant: (index: number) => void;
  handleVariantChange: (index: number, field: 'sku' | 'price' | 'stock_quantity' | 'status', value: string | ProductStatus) => void;
  handleVariantAttributeChange: (variantIndex: number, attributeIndex: number, field: 'attribute_id' | 'value', value: string) => void;
  handleAddVariantAttribute: (variantIndex: number) => void;
  handleRemoveVariantAttribute: (variantIndex: number, attributeIndex: number) => void;
}

const ProductVariants: React.FC<ProductVariantsProps> = ({
  formData, 
  handleAddVariant, 
  handleRemoveVariant, 
  handleVariantChange, 
  handleVariantAttributeChange, 
  handleAddVariantAttribute, 
  handleRemoveVariantAttribute
}) => {
  return (
    <div className="w-full">
      {formData.variants.map((variant, index) => (
        <Card key={index} className="mb-4 border border-gray-200 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gray-50 p-3 flex justify-between items-center border-b">
              <Typography variant="subtitle1" className="font-medium text-gray-800">
                Biến thể {index + 1}
              </Typography>
              <Tooltip title="Xóa biến thể">
                <IconButton 
                  onClick={() => handleRemoveVariant(index)} 
                  className="text-red-500 hover:bg-red-50"
                  size="small"
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
            
            <div className="p-4">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small" 
                    label="SKU biến thể" 
                    value={variant.sku}
                    onChange={(e) => handleVariantChange(index, 'sku', e.target.value)} 
                    InputProps={{
                      className: "bg-white rounded-lg"
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small" 
                    label="Giá biến thể" 
                    type="number" 
                    value={variant.price}
                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)} 
                    InputProps={{
                      className: "bg-white rounded-lg",
                      startAdornment: <span className="text-gray-500 mr-2">₫</span>
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small" 
                    label="Số lượng kho" 
                    type="number" 
                    value={variant.stock_quantity}
                    onChange={(e) => handleVariantChange(index, 'stock_quantity', e.target.value)} 
                    InputProps={{
                      className: "bg-white rounded-lg"
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                      value={String(variant.status)} 
                      label="Trạng thái"
                      onChange={(e) => handleVariantChange(index, 'status', Number(e.target.value) as ProductStatus)}
                      className="bg-white rounded-lg"
                    >
                      {Object.values(ProductStatus).map((status) => (
                        <MenuItem key={status} value={status}>
                          {status === ProductStatus.ACTIVE ? 'Đang bán' :
                          status === ProductStatus.INACTIVE ? 'Ngừng bán' :
                          status === ProductStatus.SOLD_OUT ? 'Hết hàng' :
                          status === ProductStatus.SEASONAL ? 'Theo mùa' :
                          status === ProductStatus.NEW ? 'Mới' :
                          status === ProductStatus.BEST_SELLER ? 'Bán chạy nhất' :
                          String(status)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Divider className="my-4" />
              
              <Typography variant="subtitle2" className="font-medium mb-3 text-gray-700">
                Thuộc tính biến thể
              </Typography>
              
              {variant.attributes.map((attribute, attributeIndex) => (
                <Box key={attributeIndex} className="flex gap-3 items-center mb-3">
                  <TextField
                    size="small"
                    label="ID thuộc tính"
                    value={String(attribute.attribute_id)}
                    onChange={(e) => handleVariantAttributeChange(index, attributeIndex, 'attribute_id', e.target.value)}
                    className="w-1/3"
                    InputProps={{
                      className: "bg-white rounded-lg"
                    }}
                  />
                  <TextField
                    size="small" 
                    label="Giá trị" 
                    value={attribute.value}
                    onChange={(e) => handleVariantAttributeChange(index, attributeIndex, 'value', e.target.value)} 
                    className="flex-1"
                    InputProps={{
                      className: "bg-white rounded-lg"
                    }}
                  />
                  <Tooltip title="Xóa thuộc tính">
                    <IconButton 
                      onClick={() => handleRemoveVariantAttribute(index, attributeIndex)} 
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
                onClick={() => handleAddVariantAttribute(index)}
                variant="outlined"
                className="mt-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                size="small"
              >
                Thêm thuộc tính
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button 
        startIcon={<AddIcon />} 
        onClick={handleAddVariant}
        variant="contained"
        className="mt-2 bg-blue-600 hover:bg-blue-700"
      >
        Thêm biến thể
      </Button>
    </div>
  );
};

export default ProductVariants;