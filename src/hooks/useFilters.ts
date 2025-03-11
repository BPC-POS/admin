import { useMemo, useCallback, useState } from 'react';
import { Product } from '@/types/product';

export type SortOption = 'newest' | 'oldest' | 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc';

// Custom hook cho logic lọc và sắp xếp
export function useFilteredProducts(
  products: Product[], 
  currentCategory: string, 
  searchQuery: string,
  sortBy: SortOption,
  statusFilter: string
) {
  return useMemo(() => {
    return products
      .filter(product => {
        const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
        return matchesCategory && matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name_asc': return a.name.localeCompare(b.name);
          case 'name_desc': return b.name.localeCompare(a.name);
          case 'price_asc': return a.price - b.price;
          case 'price_desc': return b.price - a.price;
          case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          default: return 0;
        }
      });
  }, [products, currentCategory, searchQuery, sortBy, statusFilter]);
}

// Custom hook cho phân trang
export function usePagination(items: any[], itemsPerPage: number) {
  const [page, setPage] = useState(1);
  
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    return items.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );
  }, [items, page, itemsPerPage]);

  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return { page, totalPages, paginatedItems, handlePageChange };
}

// Hook quản lý snackbar
export function useSnackbar() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  return { snackbar, showSnackbar, hideSnackbar };
} 