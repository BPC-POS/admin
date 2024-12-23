import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Autocomplete,
  Chip,
  Box,
  Select,
  MenuItem as MuiMenuItem,
  FormControl,
  InputLabel,
  Grid,
  Typography,
} from '@mui/material';
import { MenuItem, CreateMenuItemDTO, MenuType, WeekDay } from '@/types/menu';
import { Product } from '@/types/product';
import ImageUpload from '../products/ImageUpload';

interface MenuModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMenuItemDTO) => void;
  editItem?: MenuItem;
  products: Product[];
  isLoading?: boolean;
}

const initialFormState: CreateMenuItemDTO = {
  name: '',
  description: '',
  image: '',
  isActive: true,
  sortOrder: 0,
  products: [],
  type: MenuType.REGULAR,
  timeAvailable: {
    start: '00:00',
    end: '23:59'
  },
  daysAvailable: Object.values(WeekDay),
  tags: []
};

const ProductSelection: React.FC<{
  products: Product[];
  selectedProducts: number[];
  onChange: (productIds: number[]) => void;
}> = ({ products, selectedProducts, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedProductObjects = products.filter(p => 
    selectedProducts.includes(p.id)
  );

  return (
    <Box>
      <Typography variant="subtitle2" className="mb-2">
        Chọn sản phẩm cho menu
      </Typography>
      <Autocomplete
        multiple
        options={filteredProducts}
        value={selectedProductObjects}
        getOptionLabel={(option) => option.name}
        onChange={(_, newValue) => {
          onChange(newValue.map(p => p.id));
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Sản phẩm"
            placeholder="Tìm kiếm sản phẩm..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}
        renderOption={(props, option) => (
          <li {...props}>
            <Box className="flex items-center gap-2">
              {option.image && (
                <img 
                  src={option.image} 
                  alt={option.name}
                  className="w-10 h-10 rounded-md object-cover"
                />
              )}
              <div>
                <Typography variant="body1">
                  {option.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {option.category} - {option.price.toLocaleString()}đ
                </Typography>
              </div>
            </Box>
          </li>
        )}
        renderTags={(selected, getTagProps) =>
          selected.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <Chip
                key={option.id}
                label={option.name}
                {...tagProps}
                avatar={
                  option.image ? (
                    <img 
                      src={option.image} 
                      alt={option.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : undefined
                }
              />
            );
          })
        }
      />
      
      {selectedProducts.length > 0 && (
        <Box className="mt-4">
          <Typography variant="subtitle2" className="mb-2">
            Sản phẩm đã chọn ({selectedProducts.length})
          </Typography>
          <Box className="flex flex-wrap gap-2">
            {selectedProductObjects.map(product => (
              <Box 
                key={product.id}
                className="p-2 border rounded-md flex items-center gap-2"
              >
                {product.image && (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-10 h-10 rounded-md object-cover"
                  />
                )}
                <div>
                  <Typography variant="body2">
                    {product.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {product.price.toLocaleString()}đ
                  </Typography>
                </div>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

const MenuModal: React.FC<MenuModalProps> = ({
  open,
  onClose,
  onSubmit,
  editItem,
  products,
  isLoading
}) => {
  const [formData, setFormData] = useState<CreateMenuItemDTO>(initialFormState);

  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name,
        description: editItem.description || '',
        image: editItem.image || '',
        isActive: editItem.isActive,
        sortOrder: editItem.sortOrder,
        products: editItem.products,
        type: editItem.type,
        timeAvailable: editItem.timeAvailable || initialFormState.timeAvailable,
        daysAvailable: editItem.daysAvailable || initialFormState.daysAvailable,
        seasonal: editItem.seasonal,
        tags: editItem.tags || []
      });
    } else {
      setFormData(initialFormState);
    }
  }, [editItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof CreateMenuItemDTO, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {editItem ? 'Chỉnh sửa menu' : 'Thêm menu mới'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ImageUpload
                currentImage={formData.image}
                onImageSelect={(file) => {
                  // TODO: Implement actual image upload
                  // For now, just create a temporary URL
                  const imageUrl = URL.createObjectURL(file);
                  handleChange('image', imageUrl);
                }}
                error={undefined}
                isLoading={isLoading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên menu"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mô tả"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Loại menu</InputLabel>
                <Select
                  value={formData.type}
                  label="Loại menu"
                  onChange={(e) => handleChange('type', e.target.value)}
                  required
                >
                  {Object.values(MenuType).map((type) => (
                    <MuiMenuItem key={type} value={type}>
                      {type}
                    </MuiMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <ProductSelection
                products={products}
                selectedProducts={formData.products}
                onChange={(productIds) => handleChange('products', productIds)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Giờ bắt đầu"
                type="time"
                value={formData.timeAvailable?.start}
                onChange={(e) => handleChange('timeAvailable', {
                  ...formData.timeAvailable,
                  start: e.target.value
                })}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Giờ kết thúc"
                type="time"
                value={formData.timeAvailable?.end}
                onChange={(e) => handleChange('timeAvailable', {
                  ...formData.timeAvailable,
                  end: e.target.value
                })}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={Object.values(WeekDay)}
                value={formData.daysAvailable || []}
                onChange={(_, newValue) => handleChange('daysAvailable', newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Ngày phục vụ"
                    placeholder="Chọn ngày"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => handleChange('isActive', e.target.checked)}
                  />
                }
                label="Hiển thị menu"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : editItem ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MenuModal;