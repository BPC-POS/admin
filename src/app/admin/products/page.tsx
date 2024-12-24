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
import test from '../../../../public/assets/images/tet.png'
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
    image: test.src,
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
    <div className="min-h-screen bg-gradient-to-b from-[#2C3E50] to-[#3498DB] p-6 [font-family:system-ui,Poppins,sans-serif]">
      <Box className="mb-6 bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
        <Typography variant="h4" component="h1" className="font-bold mb-4 font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-200">
          Quản lý sản phẩm
        </Typography>
        <Button
          variant="contained"
           className="bg-gradient-to-br from-[#2C3E50] to-[#3498DB] hover:to-blue-500 text-white font-bold py-2 px-4 rounded-xl font-poppins transition-all duration-300 shadow-md hover:shadow-lg"
          startIcon={<Add />}
          onClick={() => handleOpenModal()}
        >
          Thêm sản phẩm
        </Button>
      </Box>

      {error && (
        <Alert severity="error" className="mb-4 backdrop-blur-lg shadow-lg [font-family:system-ui,Poppins,sans-serif]">
          {error.toString()}
        </Alert>
      )}

       <Box className="rounded-2xl  shadow-lg">
           <ProductCategories
             categories={categories}
             currentCategory={currentCategory}
             onCategoryChange={setCurrentCategory}
             onAddCategory={handleAddCategory}
             onEditCategory={handleEditCategory}
             onDeleteCategory={handleDeleteCategory}
             onToggleCategory={handleToggleCategory}
           />
       </Box>

      <Box className="mt-6 bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
         <ProductList
           products={products}
           currentCategory={currentCategory}
           isLoading={isLoading}
           onEdit={handleOpenModal}
           onDelete={handleDeleteProduct}
          />
       </Box>
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
          className="backdrop-blur-lg shadow-lg [font-family:system-ui,Poppins,sans-serif]"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProductsPage;