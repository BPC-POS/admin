import React, { useState } from 'react';
import {
  Grid,
  Typography,
  Box,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Pagination,
  Alert,
  CircularProgress
} from '@mui/material';
import { Search, Sort } from '@mui/icons-material';
import ProductCard from './ProductCard';
import { Product, ProductStatus } from '@/types/product';

interface ProductListProps {
  products: Product[];
  currentCategory: string; 
  isLoading?: boolean;
  error?: string;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: number) => void;
}

type SortOption = 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'newest' | 'oldest';

const sortOptions = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'oldest', label: 'Cũ nhất' },
  { value: 'price_asc', label: 'Giá tăng dần' },
  { value: 'price_desc', label: 'Giá giảm dần' },
  { value: 'name_asc', label: 'Tên A-Z' },
  { value: 'name_desc', label: 'Tên Z-A' },
];

const statusFilters = [
  { value: 'all', label: 'Tất cả trạng thái' },
  ...Object.values(ProductStatus).map(status => ({
    value: status,
    label: status === ProductStatus.ACTIVE ? 'Đang bán' :
           status === ProductStatus.INACTIVE ? 'Ngừng bán' :
           status === ProductStatus.SOLD_OUT ? 'Hết hàng' :
           status === ProductStatus.SEASONAL ? 'Theo mùa' :
           status === ProductStatus.NEW ? 'Mới' : 'Bán chạy'
  }))
];

const ITEMS_PER_PAGE = 12;

const ProductList: React.FC<ProductListProps> = ({
  products,
  currentCategory,
  isLoading,
  error,
  onEdit,
  onDelete
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'all'>('all');
  const [page, setPage] = useState(1);

  React.useEffect(() => {
  }, [currentCategory, products]);

  const filteredProducts = products
    .filter(product => {
      const matchesCategory = currentCategory === 'all' || (
        Array.isArray(product.categories) && product.categories.includes(Number(currentCategory))
      );
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
      return matchesCategory && matchesSearch && matchesStatus;
    })


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
    <div className="space-y-6 p-8 font-poppins">
      <Box className="flex flex-wrap gap-6 mb-8 bg-white/50 backdrop-blur-lg p-6 rounded-xl shadow-lg">
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

        <FormControl className="min-w-[200px]">
          <InputLabel className="font-poppins">Trạng thái</InputLabel>
          <Select
            value={statusFilter}
            label="Trạng thái"
            onChange={(e) => setStatusFilter(e.target.value as ProductStatus | 'all')}
            className="bg-white rounded-lg"
          >
            {statusFilters.map(option => (
              <MenuItem key={option.value} value={option.value} className="font-poppins">
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className="min-w-[200px]">
          <InputLabel className="font-poppins">Sắp xếp</InputLabel>
          <Select
            value={sortBy}
            label="Sắp xếp"
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-white rounded-lg"
            startAdornment={
              <InputAdornment position="start">
                <Sort className="text-gray-500" />
              </InputAdornment>
            }
          >
            {sortOptions.map(option => (
              <MenuItem key={option.value} value={option.value} className="font-poppins">
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box className="flex justify-between items-center mb-6 px-4">
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
        <Grid container spacing={4}>
          {paginatedProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <div className="transform transition-all duration-300 hover:scale-105">
                <ProductCard
                  product={product}
                  onEdit={() => onEdit?.(product)}
                  onDelete={() => onDelete?.(product.id)}
                />
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

export default ProductList;