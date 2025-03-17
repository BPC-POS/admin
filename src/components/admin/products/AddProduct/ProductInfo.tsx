import React from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Grid, Chip } from '@mui/material';
import { FormState } from '@/types/product';
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
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth 
          label="Tên sản phẩm" 
          value={formData.name}
          onChange={handleInputChange} 
          name="name"
          error={!!errors.name} 
          helperText={errors.name} 
          required 
          className="rounded-lg"
          InputProps={{
            className: "bg-white rounded-lg"
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth 
          label="Mô tả" 
          multiline 
          rows={3} 
          value={formData.description}
          onChange={handleInputChange} 
          name="description" 
          className="rounded-lg"
          InputProps={{
            className: "bg-white rounded-lg"
          }}
          placeholder="Mô tả chi tiết về sản phẩm..."
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth 
          label="Giá" 
          type="number" 
          value={formData.price}
          onChange={handleInputChange} 
          name="price"
          error={!!errors.price} 
          helperText={errors.price} 
          required 
          className="rounded-lg"
          InputProps={{
            className: "bg-white rounded-lg",
            startAdornment: <span className="text-gray-500 mr-2">₫</span>
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth 
          label="Số lượng kho" 
          type="number" 
          value={formData.stock_quantity}
          onChange={handleInputChange} 
          name="stock_quantity"
          error={!!errors.stock_quantity} 
          helperText={errors.stock_quantity} 
          required 
          className="rounded-lg"
          InputProps={{
            className: "bg-white rounded-lg"
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth 
          label="SKU" 
          value={formData.sku}
          onChange={handleInputChange} 
          name="sku"
          error={!!errors.sku} 
          helperText={errors.sku} 
          required 
          className="rounded-lg"
          InputProps={{
            className: "bg-white rounded-lg"
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth className="rounded-lg">
          <InputLabel id="status-label">Trạng thái</InputLabel>
          <Select
            labelId="status-label"
            value={String(formData.status)} 
            label="Trạng thái"
            onChange={handleStatusChange}
            name="status"
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
      <Grid item xs={12}>
        <FormControl fullWidth error={!!errors.categories} required className="rounded-lg">
          <InputLabel id="categories-label">Danh mục</InputLabel>
          <Select
            labelId="categories-label"
            multiple
            value={Array.isArray(formData.categories) ? formData.categories : []}
            label="Danh mục"
            onChange={handleCategoryChange}
            className="bg-white rounded-lg"
            renderValue={(selected) => (
              <div className="flex flex-wrap gap-1">
                {(selected as string[]).map((value) => {
                  const category = categories.find(cat => String(cat.id) === value);
                  return (
                    <Chip 
                      key={value} 
                      label={category ? category.name : value} 
                      size="small"
                      className="bg-blue-100 text-blue-800"
                    />
                  );
                })}
              </div>
            )}
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
    </Grid>
  );
};

export default ProductInfo;