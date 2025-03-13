import React from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Grid } from '@mui/material';
import { FormState } from '../AddProductModal';
import { Category, ProductStatus } from '@/types/product';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';

interface ProductInfoProps {
  formData: FormState;
  errors: Record<string, string>;
  categories: Category[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCategoryChange: (event: SelectChangeEvent<string[]>) => void;
  handleStatusChange: (event: SelectChangeEvent<string>) => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  formData, errors, categories, handleInputChange, handleCategoryChange, handleStatusChange
}) => {
  return (
    <>
      <Grid item xs={12}>
        <TextField
          fullWidth label="Tên sản phẩm" value={formData.name}
          onChange={handleInputChange} name="name"
          error={!!errors.name} helperText={errors.name} required className="bg-white/50 backdrop-blur-sm rounded-lg"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth label="Mô tả" multiline rows={2} value={formData.description}
          onChange={handleInputChange} name="description" className="bg-white/50 backdrop-blur-sm rounded-lg"
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth label="Giá" type="number" value={formData.price}
          onChange={handleInputChange} name="price"
          error={!!errors.price} helperText={errors.price} required className="bg-white/50 backdrop-blur-sm rounded-lg"
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          fullWidth label="Số lượng kho" type="number" value={formData.stock_quantity}
          onChange={handleInputChange} name="stock_quantity"
          error={!!errors.stock_quantity} helperText={errors.stock_quantity} required className="bg-white/50 backdrop-blur-sm rounded-lg"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth label="SKU" value={formData.sku}
          onChange={handleInputChange} name="sku"
          error={!!errors.sku} helperText={errors.sku} required className="bg-white/50 backdrop-blur-sm rounded-lg"
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth className="bg-white/50 backdrop-blur-sm rounded-lg">
        <Select
            value={String(formData.status)} label="Trạng thái"
            onChange={handleStatusChange}
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
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth error={!!errors.categories} required className="bg-white/90 backdrop-blur-sm rounded-lg">
          <InputLabel id="categories-label">Danh mục</InputLabel>
          <Select
            labelId="categories-label"
            multiple
            value={Array.isArray(formData.categories) ? formData.categories : []}
            label="Danh mục"
            onChange={handleCategoryChange}
            renderValue={(selected) => Array.isArray(selected) ? selected.join(', ') : ''}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={String(category.id)}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
          {errors.categories && <FormHelperText>{errors.categories}</FormHelperText>}
        </FormControl>
      </Grid>
    </>
  );
};

export default ProductInfo;