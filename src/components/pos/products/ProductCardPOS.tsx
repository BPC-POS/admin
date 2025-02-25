import React from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack
} from '@mui/material';
import { Circle } from '@mui/icons-material';
import { Product, ProductStatus } from '@/types/product';

interface ProductCardPOSProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: number) => void;
  onProductClick: (product: Product) => void;
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

const ProductCardPOS = ({ product, onProductClick }: ProductCardPOSProps) => {
  return (
    <Card
      className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-poppins bg-white/90 backdrop-blur-lg rounded-xl overflow-hidden"
      onClick={() => onProductClick(product)}
    >
      <Box className="relative w-full pt-[75%] group">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 right-2">
          <Chip
            label={statusLabels[product.status]}
            color={statusColors[product.status]}
            size="small"
            className="shadow-lg font-poppins font-medium"
          />
        </div>
      </Box>
      <CardContent className="p-3">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <Typography variant="subtitle1" className="font-poppins font-bold line-clamp-2 text-gray-800">
                {product.name}
              </Typography>
              <div className="flex items-center gap-1 mt-0.5">
                <Circle
                  className={`w-2 h-2 ${product.isAvailable ? 'text-green-500' : 'text-red-500'}`}
                />
                <Typography variant="caption" className="font-poppins text-gray-600">
                  {product.isAvailable ? 'Còn hàng' : 'Hết hàng'}
                </Typography>
              </div>
            </div>
          </div>

          <Stack direction="row" spacing={0.5} className="flex-wrap gap-1">
            {product.size.map((size) => (
              <Chip
                key={size.name}
                label={`${size.name}: ${size.price.toLocaleString('vi-VN')}đ`}
                size="small"
                variant={size.isDefault ? "filled" : "outlined"}
                className="font-poppins shadow-sm text-xs"
              />
            ))}
          </Stack>

          {product.toppings && product.toppings.length > 0 && (
            <Typography variant="caption" className="font-poppins text-gray-600 line-clamp-1">
              Topping: {product.toppings.map(t => t.name).join(', ')}
            </Typography>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCardPOS;