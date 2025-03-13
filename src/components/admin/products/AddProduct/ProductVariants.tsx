import React from 'react';
import { Box, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem, IconButton, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { ProductStatus } from '@/types/product';

interface ProductVariantsProps {
  formData: any; // Use FormState interface if available
  handleAddVariant: () => void;
  handleRemoveVariant: (index: number) => void;
  handleVariantChange: (index: number, field: 'sku' | 'price' | 'stock_quantity' | 'status', value: string | ProductStatus) => void;
  handleVariantAttributeChange: (variantIndex: number, attributeIndex: number, field: 'attribute_id' | 'value', value: string) => void;
  handleAddVariantAttribute: (variantIndex: number) => void;
  handleRemoveVariantAttribute: (variantIndex: number, attributeIndex: number) => void;
}

const ProductVariants: React.FC<ProductVariantsProps> = ({
  formData, handleAddVariant, handleRemoveVariant, handleVariantChange, handleVariantAttributeChange, handleAddVariantAttribute, handleRemoveVariantAttribute
}) => {
  return (
    <Grid item xs={12}>
      <Box className="bg-white/50 backdrop-blur-sm rounded-lg p-2 mt-2">
        <div className="flex justify-between items-center mb-2">
          <div className="font-semibold">Biến thể (Sizes)</div>
          <div className="text-blue-600 cursor-pointer" onClick={handleAddVariant}>Thêm biến thể</div>
        </div>
        {formData.variants.map((variant: { sku: unknown; price: unknown; stock_quantity: unknown; status: unknown; attributes: any[]; }, index: number) => (
          <Box key={index} className="mb-2 p-2 border rounded">
            <div className="font-semibold mb-1">Biến thể {index + 1}</div>
            <div className="flex gap-2 mb-1">
              <TextField
                size="small" label="SKU biến thể" value={variant.sku}
                onChange={(e) => handleVariantChange(index, 'sku', e.target.value)} className="flex-1 bg-white/70"
              />
              <TextField
                size="small" label="Giá biến thể" type="number" value={variant.price}
                onChange={(e) => handleVariantChange(index, 'price', e.target.value)} className="flex-1 bg-white/70"
              />
              <TextField
                size="small" label="Số lượng kho" type="number" value={variant.stock_quantity}
                onChange={(e) => handleVariantChange(index, 'stock_quantity', e.target.value)} className="flex-1 bg-white/70"
              />
              <FormControl size="small" className="flex-1 bg-white/70">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={formData.status} label="Trạng thái"
                  onChange={(e) => formData({ ...formData, status: Number(e.target.value) as ProductStatus })} // Ép kiểu sang number và sau đó sang ProductStatus
                  name="status"
                >
                  {Object.values(ProductStatus).map((status) => (
                    <MenuItem key={status} value={status}> {/* Giá trị value là số từ enum */}
                      {status === ProductStatus.ACTIVE ? 'Đang bán' :
                      status === ProductStatus.INACTIVE ? 'Ngừng bán' :
                      status === ProductStatus.SOLD_OUT ? 'Hết hàng' :
                      status === ProductStatus.SEASONAL ? 'Theo mùa' :
                      status === ProductStatus.NEW ? 'Mới' :
                      status === ProductStatus.BEST_SELLER ? 'Bán chạy nhất' :
                      String(status) // Fallback nếu có status mới chưa được xử lý tên
                      }
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {formData.variants.length > 1 && index !== 0 && (
                <div onClick={() => handleRemoveVariant(index)} className="cursor-pointer text-red-500"><RemoveIcon /></div>
              )}
            </div>

            <Box className="ml-2">
              <div className="flex justify-between items-center mb-1">
                <div className="font-semibold">Thuộc tính biến thể (Size)</div>
              </div>
              {variant.attributes.map((attribute, attributeIndex) => (
                <Box key={attributeIndex} className="flex gap-2 items-center mb-1 ml-2">
                  <TextField
                    size="small" label="Giá trị Size" value={attribute.value}
                    onChange={(e) => handleVariantAttributeChange(index, attributeIndex, 'value', e.target.value)} className="flex-1 bg-white/70"
                  />
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Grid>
  );
};

export default ProductVariants;