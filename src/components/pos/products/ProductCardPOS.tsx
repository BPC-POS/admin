import React from 'react';
import Image from 'next/image';
import {
  Typography,
  Box,
} from '@mui/material';
import { Circle } from '@mui/icons-material';
import { Product, ProductStatus } from '@/types/product';

interface ProductCardPOSProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: number) => void;
  onProductClick: (product: Product) => void;
}

const mapApiStatusToProductStatus = (status: number): ProductStatus => {
  switch (status) {
    case 1: return ProductStatus.ACTIVE;
    case 0: return ProductStatus.INACTIVE;
    case 2: return ProductStatus.SOLD_OUT;
    case 3: return ProductStatus.SEASONAL;
    case 4: return ProductStatus.NEW;
    case 5: return ProductStatus.BEST_SELLER;
    default: return ProductStatus.ACTIVE;
  }
};

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
  const productStatus = typeof product.status === 'number'
    ? mapApiStatusToProductStatus(product.status)
    : product.status;

  const tailwindStatusColors = {
    'success': 'bg-green-500 text-white',
    'error': 'bg-red-500 text-white',
    'warning': 'bg-yellow-500 text-black',
    'info': 'bg-blue-500 text-white',
    'primary': 'bg-indigo-500 text-white',
    'secondary': 'bg-purple-500 text-white'
  };

  const getTailwindChipColor = (muiColor: 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary' | undefined) => {
    if (!muiColor) return 'bg-gray-200 text-gray-700'; // Default color if MUI color is undefined
    return tailwindStatusColors[muiColor] || 'bg-gray-200 text-gray-700'; // Fallback to default if color not found
  };


  return (
    <div
      className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-poppins bg-white/90 backdrop-blur-lg rounded-xl overflow-hidden cursor-pointer"
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
          <span
            className={`chip inline-flex items-center justify-center h-6 rounded-full text-xs font-medium shadow-lg px-2 ${getTailwindChipColor(statusColors[productStatus])}`}
          >
            {statusLabels[productStatus]}
          </span>
        </div>
      </Box>
      <div className="p-3">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <Typography variant="subtitle1" className="font-poppins font-bold line-clamp-2 text-gray-800">
                {product.name}
              </Typography>
              <div className="flex items-center gap-1 mt-0.5">
                <Circle
                  className={`w-2 h-2 ${product.isAvailable ? 'text-green-500' : 'text-red-500'}`}
                  sx={{ fontSize: '0.75rem' }}
                />
                <Typography variant="caption" className="font-poppins text-gray-600 text-sm">
                  {product.isAvailable ? 'Còn hàng' : 'Hết hàng'}
                </Typography>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {product.size && product.size.map((size: { name: React.Key | null | undefined; price: number; isDefault: boolean; }) => (
              <span
                key={size.name}
                className={`chip inline-flex items-center justify-center h-6 rounded-full text-xs font-medium shadow-sm px-2 ${size.isDefault ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}
              >
                {`${size.name ? `${size.name}: ` : ''}${size.price.toLocaleString('vi-VN')}đ`}
              </span>
            ))}
          </div>

          {product.toppings && product.toppings.length > 0 && (
            <Typography variant="caption" className="font-poppins text-gray-600 line-clamp-1 text-sm">
              Topping: {product.toppings.map(t => t.name).join(', ')}
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCardPOS;