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
import Image from 'next/image'; // Import Next.js Image

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
      <Typography variant="subtitle2" className="mb-2 font-poppins">
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
            className="font-poppins"
          />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.id}> {/* Added key here */}
            <Box className="flex items-center gap-2">
              {option.image && (
                <Image
                  src={option.image}
                  alt={option.name}
                  width={40} // Adjust size as needed
                  height={40}
                  className="w-10 h-10 rounded-md object-cover"
                />
              )}
              <div>
                <Typography variant="body1" className="font-poppins">
                  {option.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" className="font-poppins">
                  {option.category} - {option.price.toLocaleString()}đ
                </Typography>
              </div>
            </Box>
          </li>
        )}
        renderTags={(selected, getTagProps) =>
          selected.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index }); // Lấy key từ getTagProps
            return (
              <Chip
                key={key} // Thêm key vào đây
                label={option.name}
                {...tagProps}
                className="font-poppins"
                avatar={
                  option.image ? (
                    <Image
                      src={option.image}
                      alt={option.name}
                      width={24}
                      height={24}
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
          <Typography variant="subtitle2" className="mb-2 font-poppins">
            Sản phẩm đã chọn ({selectedProducts.length})
          </Typography>
          <Box className="flex flex-wrap gap-2">
            {selectedProductObjects.map(product => (
              <Box
                key={product.id}
                className="p-2 border rounded-md flex items-center gap-2"
              >
                {product.image && (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={40} // Adjust size as needed
                    height={40}
                    className="w-10 h-10 rounded-md object-cover"
                  />
                )}
                <div>
                  <Typography variant="body2" className="font-poppins">
                    {product.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" className="font-poppins">
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

  // Corrected handleChange with Generic
  const handleChange = <K extends keyof CreateMenuItemDTO>(field: K, value: CreateMenuItemDTO[K]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: "bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg"
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle className="flex justify-between items-center bg-gradient-to-r from-[#2C3E50] to-[#3498DB] text-white p-4 rounded-t-2xl">
          <Typography variant="h6" className="font-poppins">
            {editItem ? 'Chỉnh sửa menu' : 'Thêm menu mới'}
          </Typography>
        </DialogTitle>
        <DialogContent dividers className="p-6">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ImageUpload
                currentImage={formData.image}
                onImageSelect={(file) => {
                  if (file) {
                    const imageUrl = URL.createObjectURL(file);
                    handleChange('image', imageUrl);
                  } else {
                    handleChange('image', ''); // Handle case when no file is selected (remove image)
                  }
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
                onChange={(e) => handleChange('name', e.target.value as string)} // Type assertion here
                required
                className="font-poppins"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mô tả"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value as string)} // Type assertion here
                className="font-poppins"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel className="font-poppins">Loại menu</InputLabel>
                <Select
                  value={formData.type}
                  label="Loại menu"
                  onChange={(e) => handleChange('type', e.target.value as MenuType)} // Type assertion here
                  required
                  className="font-poppins"
                >
                  {Object.values(MenuType).map((type) => (
                    <MuiMenuItem key={type} value={type} className="font-poppins">
                      {type === MenuType.REGULAR ? 'Thường xuyên' : 'Theo mùa'}
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
                  start: e.target.value,
                  end: formData.timeAvailable?.end || '23:59'
                })}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                className="font-poppins"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Giờ kết thúc"
                type="time"
                value={formData.timeAvailable?.end}
                onChange={(e) => handleChange('timeAvailable', {
                  start: formData.timeAvailable?.start || '00:00',
                  end: e.target.value
                })}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                className="font-poppins"
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={Object.values(WeekDay)}
                value={formData.daysAvailable || []}
                onChange={(_, newValue) => handleChange('daysAvailable', newValue as WeekDay[])} // Type assertion here
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Ngày phục vụ"
                    placeholder="Chọn ngày"
                    className="font-poppins"
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option} className="font-poppins"> {/* Added key here */}
                    {option === WeekDay.MONDAY ? 'Thứ 2' :
                     option === WeekDay.TUESDAY ? 'Thứ 3' :
                     option === WeekDay.WEDNESDAY ? 'Thứ 4' :
                     option === WeekDay.THURSDAY ? 'Thứ 5' :
                     option === WeekDay.FRIDAY ? 'Thứ 6' :
                     option === WeekDay.SATURDAY ? 'Thứ 7' :
                     'Chủ nhật'}
                  </li>
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
                className="font-poppins"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className="p-4">
          <Button
            onClick={onClose}
            className="font-poppins"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            className="bg-gradient-to-br from-[#2C3E50] to-[#3498DB] hover:to-blue-500 font-poppins"
          >
            {isLoading ? 'Đang xử lý...' : editItem ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MenuModal;