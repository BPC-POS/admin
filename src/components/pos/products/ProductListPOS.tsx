import React, { useState } from 'react';
import {
  Grid,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Pagination,
  Alert,
  CircularProgress
} from '@mui/material';
import { Search } from '@mui/icons-material';
import ProductCardPOS from './ProductCardPOS';
import { Product } from '@/types/product';

interface ProductListPOSProps {
  products: Product[];
  currentCategory: string;
  isLoading?: boolean;
  error?: string;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: number) => void;
  onProductClick: (product: Product) => void;
}

type SortOption = 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'newest' | 'oldest';

const ITEMS_PER_PAGE = 12;

const ProductListPOS: React.FC<ProductListPOSProps> = ({
  products,
  currentCategory,
  isLoading,
  error,
  onEdit,
  onDelete,
  onProductClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, ] = useState<SortOption>('newest');
  const [statusFilter, ] = useState('all');
  const [page, setPage] = useState(1);

  const filteredProducts = products
    .filter(product => {
      const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
      return matchesCategory && matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default:
          return 0;
      }
    });

  // Phân trang
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <Alert severity="error" className="mb-4 font-poppins">
        {error}
      </Alert>
    );
  }

  return (
    <div className=" font-poppins">
      <Box className="flex flex-wrap gap-6 mb-8 bg-white/50 backdrop-blur-lg p-3 rounded-xl shadow-lg">
        <TextField
          placeholder="Tìm kiếm sản phẩm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search className="text-gray-500" />
              </InputAdornment>
            ),
            className: "bg-white rounded-lg"
          }}
        />

      </Box>

      <Box className="flex justify-between items-center mb-2 px-4">
        <Typography variant="body2" className="text-gray-600 font-poppins">
          Hiển thị {paginatedProducts.length} trên tổng số {filteredProducts.length} sản phẩm
        </Typography>
      </Box>

      {isLoading ? (
        <Box className="flex justify-center items-center h-[400px]">
          <CircularProgress />
        </Box>
      ) : paginatedProducts.length === 0 ? (
        <Box className="text-center py-12 bg-white/50 backdrop-blur-lg rounded-xl shadow-lg">
          <Typography variant="h6" className="text-gray-600 font-poppins mb-2">
            Không tìm thấy sản phẩm nào
          </Typography>
          <Typography variant="body2" className="text-gray-500 font-poppins">
            Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {paginatedProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={product.id}>
              <div className="transform transition-all duration-300 hover:scale-105">
                <ProductCardPOS
                  product={product}
                  onEdit={() => onEdit?.(product)}
                  onDelete={() => onDelete?.(product.id)}
                  onProductClick={onProductClick}/>
              </div>
            </Grid>
          ))}
        </Grid>
      )}

      {totalPages > 1 && (
        <Box className="flex justify-center mt-8">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            className="font-poppins"
            sx={{
              '& .MuiPaginationItem-root': {
                fontFamily: 'Poppins',
                fontSize: '0.9rem'
              }
            }}
          />
        </Box>
      )}
    </div>
  );
};

export default ProductListPOS;