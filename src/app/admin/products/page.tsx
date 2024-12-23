'use client';
import React, { useState } from 'react';
import { 
  Typography, 
  Box,
  Button,
  Alert,
  Snackbar
} from '@mui/material';
import { Add } from '@mui/icons-material';
import ProductCategories from '@/components/admin/products/ProductCategories';
import ProductList from '@/components/admin/products/ProductList';
import AddProductModal from '@/components/admin/products/AddProductModal';
import { Product, Category, ProductStatus } from '@/types/product';

// Mock data - sau này sẽ được thay thế bằng API call
const mockCategories: Category[] = [
  { 
    id: 'coffee', 
    name: 'Cà phê', 
    description: 'Các loại cà phê',
    isActive: true 
  },
  { 
    id: 'tea', 
    name: 'Trà', 
    description: 'Các loại trà',
    isActive: true 
  },
  { 
    id: 'milktea', 
    name: 'Trà sữa', 
    description: 'Các loại trà sữa',
    isActive: true 
  },
  { 
    id: 'smoothie', 
    name: 'Sinh tố', 
    description: 'Các loại sinh tố',
    isActive: true 
  }
];

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Cà phê đen',
    price: 25000,
    image: '/images/products/black-coffee.jpg',
    category: 'coffee',
    description: 'Cà phê đen đậm đà hương vị Việt Nam',
    status: ProductStatus.ACTIVE,
    size: [
      { name: 'S', price: 0, isDefault: true },
      { name: 'M', price: 5000, isDefault: false },
      { name: 'L', price: 10000, isDefault: false }
    ],
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Thêm các sản phẩm mock khác
];

const ProductsPage = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [currentCategory, setCurrentCategory] = useState('all');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Category handlers
  const handleAddCategory = async (data: Omit<Category, 'id'>) => {
    try {
      setIsLoading(true);
      // TODO: API call
      const newCategory = {
        ...data,
        id: `category-${Date.now()}`, // Temporary ID
      };
      setCategories(prev => [...prev, newCategory]);
      setSnackbar({
        open: true,
        message: 'Thêm danh mục thành công',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi thêm danh mục',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCategory = async (id: string, data: Omit<Category, 'id'>) => {
    try {
      setIsLoading(true);
      // TODO: API call
      setCategories(prev =>
        prev.map(category =>
          category.id === id
            ? { ...category, ...data }
            : category
        )
      );
      setSnackbar({
        open: true,
        message: 'Cập nhật danh mục thành công',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi cập nhật danh mục',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa danh mục này?')) return;
    
    try {
      setIsLoading(true);
      // TODO: API call
      setCategories(prev => prev.filter(category => category.id !== id));
      if (currentCategory === id) {
        setCurrentCategory('all');
      }
      setSnackbar({
        open: true,
        message: 'Xóa danh mục thành công',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa danh mục',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleCategory = async (id: string) => {
    try {
      setIsLoading(true);
      // TODO: API call
      setCategories(prev =>
        prev.map(category =>
          category.id === id
            ? { ...category, isActive: !category.isActive }
            : category
        )
      );
      setSnackbar({
        open: true,
        message: 'Cập nhật trạng thái danh mục thành công',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi cập nhật trạng thái danh mục',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      // TODO: Thay thế bằng API call
      const newProduct: Product = {
        ...productData,
        id: products.length + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setProducts(prev => [...prev, newProduct]);
      setIsProductModalOpen(false);
      showSnackbar('Thêm sản phẩm thành công', 'success');
    } catch (err) {
      showSnackbar('Có lỗi xảy ra khi thêm sản phẩm', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingProduct) return;

    try {
      setIsLoading(true);
      // TODO: Thay thế bằng API call
      const updatedProduct: Product = {
        ...productData,
        id: editingProduct.id,
        createdAt: editingProduct.createdAt,
        updatedAt: new Date()
      };

      setProducts(prev =>
        prev.map(p => p.id === editingProduct.id ? updatedProduct : p)
      );
      
      setIsProductModalOpen(false);
      setEditingProduct(undefined);
      showSnackbar('Cập nhật sản phẩm thành công', 'success');
    } catch (err) {
      showSnackbar('Có lỗi xảy ra khi cập nhật sản phẩm', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

    try {
      setIsLoading(true);
      // TODO: Thay thế bằng API call
      setProducts(prev => prev.filter(p => p.id !== productId));
      showSnackbar('Xóa sản phẩm thành công', 'success');
    } catch (err) {
      showSnackbar('Có lỗi xảy ra khi xóa sản phẩm', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleOpenModal = (product?: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(undefined);
  };

  return (
    <div className="p-6">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" component="h1" className="font-bold">
          Quản lý sản phẩm
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenModal()}
        >
          Thêm sản phẩm
        </Button>
      </Box>

      {error && (
        <Alert severity="error" className="mb-4">
          {error.toString()}
        </Alert>
      )}

      <ProductCategories
        categories={categories}
        currentCategory={currentCategory}
        onCategoryChange={setCurrentCategory}
        onAddCategory={handleAddCategory}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
        onToggleCategory={handleToggleCategory}
      />

      <ProductList
        products={products}
        currentCategory={currentCategory}
        isLoading={isLoading}
        onEdit={handleOpenModal}
        onDelete={handleDeleteProduct}
      />

      <AddProductModal
        open={isProductModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
        categories={categories}
        editProduct={editingProduct}
        isLoading={isLoading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProductsPage;