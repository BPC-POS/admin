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
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  // Lọc sản phẩm
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
      <Alert severity="error" className="mb-4">
        {error}
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Box className="flex flex-wrap gap-4 mb-6">
        <TextField
          placeholder="Tìm kiếm sản phẩm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <FormControl className="min-w-[200px]">
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={statusFilter}
            label="Trạng thái"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusFilters.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className="min-w-[200px]">
          <InputLabel>Sắp xếp</InputLabel>
          <Select
            value={sortBy}
            label="Sắp xếp"
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            startAdornment={
              <InputAdornment position="start">
                <Sort />
              </InputAdornment>
            }
          >
            {sortOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Results summary */}
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="body2" color="text.secondary">
          Hiển thị {paginatedProducts.length} trên tổng số {filteredProducts.length} sản phẩm
        </Typography>
      </Box>

      {/* Product grid */}
      {isLoading ? (
        <Box className="flex justify-center items-center h-[400px]">
          <CircularProgress />
        </Box>
      ) : paginatedProducts.length === 0 ? (
        <Box className="text-center py-8">
          <Typography variant="h6" color="text.secondary">
            Không tìm thấy sản phẩm nào
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {paginatedProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard
                product={product}
                onEdit={() => onEdit?.(product)}
                onDelete={() => onDelete?.(product.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box className="flex justify-center mt-6">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </div>
  );
};

export default ProductList;