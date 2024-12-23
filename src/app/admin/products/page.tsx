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
  const [currentTab, setCurrentTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

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
      setIsModalOpen(false);
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
      
      setIsModalOpen(false);
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
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
          {error}
        </Alert>
      )}

      <ProductCategories
        categories={mockCategories}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
      />

      <ProductList
        products={products}
        currentCategory={currentTab}
        isLoading={isLoading}
        onEdit={handleOpenModal}
        onDelete={handleDeleteProduct}
      />

      <AddProductModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
        categories={mockCategories}
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