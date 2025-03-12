'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Box,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import ProductCategories from '@/components/admin/products/ProductCategories';
import ProductList from '@/components/admin/products/ProductList';
import AddProductModal from '@/components/admin/products/AddProductModal';
import { Product, Category } from '@/types/product';
import { createProduct, getProducts } from '@/api/product';
import { getCategories, createCategory, deleteCategoryById } from '@/api/category';

const ProductsPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
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
  const [productsLoading, setProductsLoading] = useState(false); 
  const [, setProductsError] = useState<string | null>(null); 

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  }, []);

  const fetchCategoriesData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getCategories();
      if (response.status === 200) {
        setCategories(response.data);
      } else {
        setError(`Lỗi khi tải danh mục: Status code ${response.status}`);
        showSnackbar('Lỗi khi tải danh mục', 'error');
      }
    } catch (apiError: any) {
      setError(apiError.response?.data?.message || apiError.message || 'Lỗi không xác định khi tải danh mục');
      showSnackbar('Lỗi khi tải danh mục', 'error');
      console.error("Error fetching categories:", apiError);
    } finally {
      setIsLoading(false);
    }
  }, [showSnackbar]);

  const handleAddCategory = useCallback(async (categoryData: Omit<Category, 'id'>) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await createCategory(categoryData);
      if (response.status === 201) {
        showSnackbar('Thêm danh mục thành công', 'success');
        fetchCategoriesData();
      } else {
        showSnackbar('Có lỗi xảy ra khi thêm danh mục', 'error');
        setError(`Lỗi khi tạo danh mục: Status code ${response.status}`);
      }
    } catch (apiError: any) {
      showSnackbar('Có lỗi xảy ra khi thêm danh mục', 'error');
      setError(apiError.response?.data?.message || apiError.message || 'Lỗi không xác định khi thêm danh mục');
      console.error("Error creating category:", apiError);
    } finally {
      setIsLoading(false);
    }
  }, [fetchCategoriesData, showSnackbar]);

  const handleEditCategory = async (id: string, data: Omit<Category, 'id'>) => {
    try {
      setIsLoading(true);
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
    } catch {
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
    setIsLoading(true);
    let previousCategories: Category[] = []; 
    try {
      previousCategories = [...categories]; 
      setCategories(prevCategories => prevCategories.filter(category => category.id !== id));

      if (currentCategory === id) {
        setCurrentCategory('all'); 
      }
        const response = await deleteCategoryById(Number(id)); 
  
      if (response.status === 200) { 
        showSnackbar('Xóa danh mục thành công', 'success'); 
      } else {
        showSnackbar(`Lỗi khi xóa danh mục. Status code: ${response.status}`, 'error'); 
        setCategories(previousCategories); 
      }
  
    } catch (apiError: any) {
      console.error("Lỗi xóa danh mục:", apiError); 
      showSnackbar('Có lỗi xảy ra khi xóa danh mục', 'error'); 
      setCategories(previousCategories); 
    } finally {
      setIsLoading(false); 
    }
  };

  const handleToggleCategory = async (id: string) => {
    try {
      setIsLoading(true);
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
    } catch {
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
      setError(null);
      const response = await createProduct({
        ...productData,
        status: Number(productData.status)
      });
      if (response.status === 201) {
        setIsProductModalOpen(false);
        showSnackbar('Thêm sản phẩm thành công', 'success');
        fetchProducts(); // Re-fetch products after adding new one
      } else {
        showSnackbar('Có lỗi xảy ra khi thêm sản phẩm', 'error');
        setError(`Lỗi khi tạo sản phẩm: Status code ${response.status}`);
      }
    } catch (apiError: any) {
      showSnackbar('Có lỗi xảy ra khi thêm sản phẩm', 'error');
      setError(apiError.response?.data?.message || apiError.message || 'Lỗi không xác định khi tạo sản phẩm');
      console.error("Error creating product:", apiError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingProduct) return;

    try {
      setIsLoading(true);
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
      fetchProducts(); // Re-fetch products after editing
    } catch {
      showSnackbar('Có lỗi xảy ra khi cập nhật sản phẩm', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

    try {
      setIsLoading(true);
      setProducts(prev => prev.filter(p => p.id !== productId));
      showSnackbar('Xóa sản phẩm thành công', 'success');
      fetchProducts(); 
    } catch {
      showSnackbar('Có lỗi xảy ra khi xóa sản phẩm', 'error');
    } finally {
      setIsLoading(false);
    }
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

  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError(null);
    try {
      const response = await getProducts();
      if (response.status === 200) {
        setProducts(response.data);
      } else {
        setProductsError(`Lỗi khi tải sản phẩm: Status code ${response.status}`);
        showSnackbar('Lỗi khi tải sản phẩm', 'error');
      }
    } catch (apiError: any) {
      setProductsError(apiError.response?.data?.message || apiError.message || 'Lỗi không xác định khi tải sản phẩm');
      showSnackbar('Lỗi khi tải sản phẩm', 'error');
      console.error("Error fetching products:", apiError);
    } finally {
      setProductsLoading(false);
    }
  }, [getProducts, showSnackbar]); 

  useEffect(() => {
    fetchCategoriesData();
    fetchProducts();
  }, [fetchCategoriesData, fetchProducts]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2C3E50] to-[#3498DB] p-6 [font-family:system-ui,Poppins,sans-serif]">
      <Box className="mb-6 bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
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
          {error}
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
             isLoading={isLoading}
             onCategoriesUpdated={fetchCategoriesData}
           />
       </Box>

      <Box className="mt-6 bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
         <ProductList
           products={products} // Pass fetched products to ProductList
           currentCategory={currentCategory}
           isLoading={productsLoading} // Use productsLoading for ProductList loading state
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