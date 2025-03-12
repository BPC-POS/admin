import React, { SyntheticEvent, forwardRef } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Tooltip,
  Stack,
  Snackbar,
  Alert as MuiAlert,
  CircularProgress
} from '@mui/material';
import { Edit, Delete, Circle } from '@mui/icons-material';
import { Product, ProductStatus } from '@/types/product';
import { deleteProductById } from '@/api/product';
import { AlertProps, AlertColor } from '@mui/material/Alert';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: number) => void;
}

const statusColors: { [key in ProductStatus]: AlertColor } = {
  [ProductStatus.ACTIVE]: 'success',
  [ProductStatus.INACTIVE]: 'error',
  [ProductStatus.SOLD_OUT]: 'warning',
  [ProductStatus.SEASONAL]: 'info',
  [ProductStatus.NEW]: 'primary' as AlertColor, // Explicitly cast to AlertColor
  [ProductStatus.BEST_SELLER]: 'secondary' as AlertColor // Explicitly cast to AlertColor
} as const;

const statusLabels = {
  [ProductStatus.ACTIVE]: 'Đang bán',
  [ProductStatus.INACTIVE]: 'Ngừng bán',
  [ProductStatus.SOLD_OUT]: 'Hết hàng',
  [ProductStatus.SEASONAL]: 'Theo mùa',
  [ProductStatus.NEW]: 'Mới',
  [ProductStatus.BEST_SELLER]: 'Bán chạy'
};

interface AlertForwardRefProps extends AlertProps {
  severity: AlertColor; // Use AlertColor directly here
}

const Alert = forwardRef<HTMLDivElement, AlertForwardRefProps>(
  function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  }
);

const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  // Safely access product.size and use find only if it exists and is an array
  const defaultSize = Array.isArray(product.size) ? product.size.find(s => s.isDefault) : undefined;
  const basePrice = defaultSize ? defaultSize.price : product.price;
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<AlertColor>('success'); // Use AlertColor here
  const [isDeleting, setIsDeleting] = React.useState(false); // Loading state for delete

  const showSnackbar = (message: string, severity: AlertColor) => { // Use AlertColor here
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleDeleteProduct = async () => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`)) {
      return; // User cancelled deletion
    }

    setIsDeleting(true); // Start loading
    try {
      await deleteProductById(product.id);
      showSnackbar(`Sản phẩm "${product.name}" đã được xóa thành công.`, 'success');
      if (onDelete) {
        onDelete(product.id); // Notify parent component to update product list
      }
    } catch (error: any) {
      console.error("Error deleting product:", error);
      showSnackbar(`Lỗi khi xóa sản phẩm "${product.name}". Vui lòng thử lại.`, 'error');
    } finally {
      setIsDeleting(false); // End loading
    }
  };

  return (
    <Card className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-poppins bg-white/90 backdrop-blur-lg rounded-xl overflow-hidden">
      <Box className="relative w-full pt-[100%] group">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 right-3">
          <Chip
            label={statusLabels[product.status]}
            color={statusColors[product.status]}
            size="small"
            className="shadow-lg font-poppins font-medium"
          />
        </div>
      </Box>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <Typography variant="h6" className="font-poppins font-bold line-clamp-2 text-gray-800">
                {product.name}
              </Typography>
              <div className="flex items-center gap-2 mt-1">
                <Circle
                  className={`w-2 h-2 ${product.isAvailable ? 'text-green-500' : 'text-red-500'}`}
                />
                <Typography variant="caption" className="font-poppins text-gray-600">
                  {product.isAvailable ? 'Còn hàng' : 'Hết hàng'}
                </Typography>
              </div>
            </div>
            <div className="flex gap-2">
              <Tooltip title="Chỉnh sửa">
                <IconButton
                  size="small"
                  className="bg-blue-50 hover:bg-blue-100 text-blue-600"
                  onClick={() => onEdit?.(product)}
                  disabled={isDeleting} // Disable edit button during deletion
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Xóa sản phẩm">
                <IconButton
                  size="small"
                  className="bg-red-50 hover:bg-red-100 text-red-600"
                  onClick={handleDeleteProduct}
                  disabled={isDeleting} // Disable delete button during deletion
                >
                  {isDeleting ? <CircularProgress size={24} color="inherit" /> : <Delete />} {/* Loading indicator */}
                </IconButton>
              </Tooltip>
            </div>
          </div>

          {/* Conditionally render sizes only if product.size is an array */}
          {Array.isArray(product.size) && (
            <Stack direction="row" spacing={1} className="flex-wrap gap-2">
              {product.size.map((size) => (
                <Chip
                  key={size.name}
                  label={`${size.name}: ${size.price.toLocaleString('vi-VN')}đ`}
                  size="small"
                  variant={size.isDefault ? "filled" : "outlined"}
                  className="font-poppins shadow-sm"
                />
              ))}
            </Stack>
          )}


          {product.toppings && product.toppings.length > 0 && (
            <Typography variant="body2" className="font-poppins text-gray-600 line-clamp-1">
              Topping: {product.toppings.map(t => t.name).join(', ')}
            </Typography>
          )}

          <Typography variant="body2" className="font-poppins text-gray-600 line-clamp-2">
            {product.description}
          </Typography>

          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <Typography variant="h6" className="font-poppins font-bold text-blue-600">
              {basePrice.toLocaleString('vi-VN')}đ
            </Typography>
            {product.originalPrice && (
              <Typography
                variant="body2"
                className="font-poppins line-through text-gray-400"
              >
                {product.originalPrice.toLocaleString('vi-VN')}đ
              </Typography>
            )}
          </div>
        </div>
      </CardContent>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert {...{ onClose: handleCloseSnackbar, severity: snackbarSeverity, sx: { width: '100%', fontFamily: 'Poppins' } }}> {/* Pass props as object */}
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default ProductCard;