import React from 'react';
import Image from 'next/image';
import { 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  Box,
  Chip,
  Tooltip,
  Stack
} from '@mui/material';
import { Edit, Delete, Circle } from '@mui/icons-material';
import { Product, ProductStatus } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: number) => void;
}

const statusColors = {
  [ProductStatus.ACTIVE]: 'success',
  [ProductStatus.INACTIVE]: 'error',
  [ProductStatus.SOLD_OUT]: 'warning',
  [ProductStatus.SEASONAL]: 'info',
  [ProductStatus.NEW]: 'primary',
  [ProductStatus.BEST_SELLER]: 'secondary'
} as const;

const statusLabels = {
  [ProductStatus.ACTIVE]: 'Đang bán',
  [ProductStatus.INACTIVE]: 'Ngừng bán',
  [ProductStatus.SOLD_OUT]: 'Hết hàng',
  [ProductStatus.SEASONAL]: 'Theo mùa',
  [ProductStatus.NEW]: 'Mới',
  [ProductStatus.BEST_SELLER]: 'Bán chạy'
};

const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  const defaultSize = product.size.find(s => s.isDefault);
  const basePrice = defaultSize ? defaultSize.price : product.price;

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <Box className="relative w-full pt-[100%]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 right-2">
          <Chip
            label={statusLabels[product.status]}
            color={statusColors[product.status]}
            size="small"
            className="shadow-md"
          />
        </div>
      </Box>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <Typography variant="h6" className="font-semibold line-clamp-2">
                {product.name}
              </Typography>
              <div className="flex items-center gap-1">
                <Circle 
                  className={`w-2 h-2 ${product.isAvailable ? 'text-green-500' : 'text-red-500'}`}
                />
                <Typography variant="caption" color="text.secondary">
                  {product.isAvailable ? 'Còn hàng' : 'Hết hàng'}
                </Typography>
              </div>
            </div>
            <div className="flex gap-1">
              <Tooltip title="Sửa">
                <IconButton 
                  size="small" 
                  color="primary"
                  onClick={() => onEdit?.(product)}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Xóa">
                <IconButton 
                  size="small" 
                  color="error"
                  onClick={() => onDelete?.(product.id)}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </div>
          </div>

          <Stack direction="row" spacing={1}>
            {product.size.map((size) => (
              <Chip
                key={size.name}
                label={`${size.name}: ${size.price.toLocaleString('vi-VN')}đ`}
                size="small"
                variant={size.isDefault ? "filled" : "outlined"}
              />
            ))}
          </Stack>

          {product.toppings && product.toppings.length > 0 && (
            <Typography variant="body2" color="text.secondary" className="line-clamp-1">
              Toppings: {product.toppings.map(t => t.name).join(', ')}
            </Typography>
          )}

          <Typography variant="body2" color="text.secondary" className="line-clamp-2">
            {product.description}
          </Typography>

          <div className="flex justify-between items-center">
            <Typography variant="h6" color="primary" className="font-bold">
              {basePrice.toLocaleString('vi-VN')}đ
            </Typography>
            {product.originalPrice && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                className="line-through"
              >
                {product.originalPrice.toLocaleString('vi-VN')}đ
              </Typography>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;