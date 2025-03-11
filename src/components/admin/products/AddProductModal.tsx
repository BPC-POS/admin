import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Box,
  Chip,
  FormHelperText,
  Grid,
  Alert,
} from '@mui/material';
import { Close, Add, Remove } from '@mui/icons-material';
import ImageUpload from './ImageUpload';
import { Category, Product, ProductStatus, Size, Topping } from '@/types/product';
import { LoadingButton } from '@mui/lab';

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  categories: Category[];
  editProduct?: Product;
  isLoading?: boolean;
  error?: string;
}

interface FormState {
  name: string;
  price: string;
  originalPrice: string;
  category: string;
  description: string;
  image: string;
  status: ProductStatus;
  sizes: Size[];
  toppings: Topping[];
  isAvailable: boolean;
  sku: string; // Add sku to form state
  stock_quantity: string; // Add stock_quantity to form state, initially string for input
  meta: object; // Add meta to form state
}

const initialFormState: FormState = {
  name: '',
  price: '',
  originalPrice: '',
  category: '',
  description: '',
  image: '',
  status: ProductStatus.ACTIVE,
  sizes: [{ name: '', price: 0, isDefault: true }],
  toppings: [],
  isAvailable: true,
  sku: '', // Initialize sku
  stock_quantity: '', // Initialize stock_quantity
  meta: {} // Initialize meta
};

const AddProductModal: React.FC<AddProductModalProps> = ({
  open,
  onClose,
  onSubmit,
  categories,
  editProduct,
  isLoading,
  error
}) => {
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name,
        price: editProduct.price.toString(),
        originalPrice: editProduct.originalPrice?.toString() || '',
        category: editProduct.category,
        description: editProduct.description,
        image: editProduct.image,
        status: editProduct.status,
        sizes: editProduct.size.map(s => ({
          ...s,
          isDefault: s.isDefault || false
        })),
        toppings: editProduct.toppings || [],
        isAvailable: editProduct.isAvailable,
        sku: editProduct.sku || '', // Set sku from editProduct or empty string
        stock_quantity: editProduct.stock_quantity?.toString() || '', // Set stock_quantity from editProduct or empty string
        meta: editProduct.meta || {} // Set meta from editProduct or empty object
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
  }, [editProduct, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên sản phẩm';
    }

    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Vui lòng nhập giá hợp lệ';
    }

    if (!formData.category) {
      newErrors.category = 'Vui lòng chọn danh mục';
    }

    if (!formData.image && !imageFile && !editProduct) {
      newErrors.image = 'Vui lòng chọn ảnh sản phẩm';
    }

    if (!formData.sizes.some(size => size.isDefault)) {
      newErrors.sizes = 'Phải có ít nhất một size mặc định';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'Vui lòng nhập SKU sản phẩm';
    }

    if (!formData.stock_quantity || isNaN(Number(formData.stock_quantity)) || Number(formData.stock_quantity) < 0) {
      newErrors.stock_quantity = 'Vui lòng nhập số lượng kho hợp lệ (>= 0)';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.name,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      category: formData.category,
      description: formData.description,
      image: formData.image,
      status: formData.status,
      size: formData.sizes.map(s => ({
        ...s,
        isDefault: s.isDefault || false
      })),
      toppings: formData.toppings,
      isAvailable: formData.isAvailable,
      sku: formData.sku, // Use sku from form
      stock_quantity: Number(formData.stock_quantity), // Use stock_quantity from form
      meta: formData.meta // Use meta from form
    };

    onSubmit(productData);
  };

  const handleAddSize = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, { name: '', price: 0, isDefault: false }]
    }));
  };

  const handleRemoveSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  const handleSizeChange = (index: number, field: keyof Size, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.map((size, i) => {
        if (i === index) {
          return {
            ...size,
            [field]: value,
            isDefault: field === 'isDefault' ? Boolean(value) : size.isDefault
          };
        }
        if (field === 'isDefault' && value === true) {
          return { ...size, isDefault: false };
        }
        return size;
      })
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        className: 'max-h-[100vh] bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg font-poppins'
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle className="flex justify-between items-center border-b bg-gradient-to-r from-[#2C3E50] to-[#3498DB] text-white">
          <Typography variant="h6" className="font-bold font-poppins">
            {editProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </Typography>
          <IconButton onClick={onClose} size="small" className="text-white">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent className="overflow-y-auto">
          {error && (
            <Alert severity="error" className="mb-4 mt-4 backdrop-blur-lg">
              {error}
            </Alert>
          )}

          <Grid container spacing={3} className="mt-0 font-poppins">
            <Grid item xs={12} md={8}>
              <div className="space-y-4">
                <TextField
                  fullWidth
                  label="Tên sản phẩm"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                  className="bg-white/50 backdrop-blur-sm rounded-lg"
                />

                <div className="flex gap-4">
                  <TextField
                    fullWidth
                    label="Giá"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    error={!!errors.price}
                    helperText={errors.price}
                    required
                    className="bg-white/50 backdrop-blur-sm rounded-lg"
                  />

                  <TextField
                    fullWidth
                    label="Giá gốc (nếu có giảm giá)"
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="bg-white/50 backdrop-blur-sm rounded-lg"
                  />
                </div>

                <FormControl fullWidth error={!!errors.category} required className="bg-white/90 backdrop-blur-sm rounded-lg">
                  <InputLabel>Danh mục</InputLabel>
                  <Select
                    value={formData.category}
                    label="Danh mục"
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
                </FormControl>

                <FormControl fullWidth className="bg-white/50 backdrop-blur-sm rounded-lg">
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={formData.status}
                    label="Trạng thái"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ProductStatus })}
                  >
                    {Object.values(ProductStatus).map((status) => (
                      <MenuItem key={status} value={status}>
                        {status === ProductStatus.ACTIVE ? 'Đang bán' :
                         status === ProductStatus.INACTIVE ? 'Ngừng bán' : status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Mô tả"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-white/50 backdrop-blur-sm rounded-lg"
                />

                <div className="flex gap-4">
                  <TextField
                    fullWidth
                    label="SKU"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    error={!!errors.sku}
                    helperText={errors.sku}
                    required
                    className="bg-white/50 backdrop-blur-sm rounded-lg"
                  />

                  <TextField
                    fullWidth
                    label="Số lượng kho"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    error={!!errors.stock_quantity}
                    helperText={errors.stock_quantity}
                    required
                    className="bg-white/50 backdrop-blur-sm rounded-lg"
                  />
                </div>

                <TextField
                  fullWidth
                  label="Meta (JSON Object)"
                  multiline
                  rows={2}
                  value={JSON.stringify(formData.meta)}
                  onChange={(e) => {
                    try {
                      const parsedMeta = JSON.parse(e.target.value);
                      setFormData({ ...formData, meta: parsedMeta });
                    } catch (e) {
                      console.error("Error parsing Meta JSON", e);
                      setErrors(prevErrors => ({ ...prevErrors, meta: "Invalid JSON format" }));
                      setFormData({ ...formData, meta: {} }); // Reset to empty object on parse error
                    }
                  }}
                  error={!!errors.meta}
                  helperText={errors.meta}
                  className="bg-white/50 backdrop-blur-sm rounded-lg"
                />
              </div>
            </Grid>

            <Grid item xs={12} md={4}>
              <div className="space-y-4">
                <ImageUpload
                  onImageSelect={(file) => {
                    setImageFile(file);
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.image;
                      return newErrors;
                    });
                  }}
                  currentImage={formData.image}
                  error={errors.image}
                />

                <Box className="bg-white/50 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <Typography variant="subtitle2" className="font-semibold">Kích thước</Typography>
                    <Button
                      size="small"
                      startIcon={<Add />}
                      onClick={handleAddSize}
                      className="text-blue-600 "
                    >
                      Thêm size
                    </Button>
                  </div>

                  {formData.sizes.map((size, index) => (
                    <Box key={index} className="flex gap-1 items-center mb-2">
                      <TextField
                        size="small"
                        label="Size"
                        value={size.name}
                        onChange={(e) => handleSizeChange(index, 'name', e.target.value)}
                        className="w-20 bg-white/70"
                      />
                      <TextField
                        size="small"
                        label="Giá"
                        type="number"
                        value={size.price}
                        onChange={(e) => handleSizeChange(index, 'price', Number(e.target.value))}
                        className="bg-white/70"
                      />
                      <Chip
                        label="Mặc định"
                        color={size.isDefault ? 'primary' : 'default'}
                        onClick={() => handleSizeChange(index, 'isDefault', !size.isDefault)}
                        className="cursor-pointer"
                      />
                      {formData.sizes.length > 1 && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveSize(index)}
                        >
                          <Remove />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                  {errors.sizes && (
                    <FormHelperText error>{errors.sizes}</FormHelperText>
                  )}
                </Box>
              </div>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions className="border-t p-4 bg-gradient-to-r ">
          <Button
            onClick={onClose}
            className="mr-2 text-black hover:bg-white/20"
          >
            Hủy
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isLoading}
            className="bg-white text-[#2C3E50] hover:bg-white/90 font-poppins font-semibold "
          >
            {editProduct ? 'Cập nhật' : 'Thêm sản phẩm'}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddProductModal;