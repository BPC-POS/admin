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
import { createProduct, getProducts, uploadImage, deleteProductById, getProductById, updateProduct } from '@/api/product';
import { getCategories, createCategory, deleteCategoryById } from '@/api/category';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
  status?: number;
}

interface ProductAttribute {
  id?: string | number;
  attribute_id: string | number;
  value: string;
}

interface ProductVariant {
  sku?: string;
  price: string | number;
  stock_quantity: string | number;
  status: string | number;
  attributes: ProductAttribute[];
}

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
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setError(apiError.response?.data?.message || apiError.message || 'Lỗi không xác định khi tải danh mục');
      showSnackbar('Lỗi khi tải danh mục', 'error');
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
    } catch (error: unknown) {
      const apiError = error as ApiError;
      showSnackbar('Có lỗi xảy ra khi thêm danh mục', 'error');
      setError(apiError.response?.data?.message || apiError.message || 'Lỗi không xác định khi thêm danh mục');
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

    } catch (error: unknown) {
      console.error("Error deleting category:", error);
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

  const handleImageUploadToApi = useCallback(async (file: File | null): Promise<string | null> => {
    if (!file) return null;

    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await uploadImage(formData);

      if ((response.status === 200 || response.status === 201) && response.data) {
        let imageUrl = null;
        let imageId = null;
        // Not using extension so removing it
        
        if (response.data.id) {
          imageId = response.data.id;
          
          const cdnUrl = 'https://bpc-pos.s3.ap-southeast-1.amazonaws.com';
          imageUrl = `${cdnUrl}/${imageId}`;
        }

        if (imageUrl) {
          showSnackbar('Upload ảnh thành công', 'success');
          return imageUrl;
        }
      }
      
      if (response.status === 201 && response.data && response.data.id) {
        const imageId = response.data.id;
        const cdnUrl = 'https://bpc-pos.s3.ap-southeast-1.amazonaws.com';
        const mockUrl = `${cdnUrl}/${imageId}`;

        showSnackbar('Đã nhận ID ảnh từ server', 'success');
        return mockUrl;
      }
      
      showSnackbar(`Lỗi khi upload ảnh: Status code ${response.status}`, 'error');
      setError(`Lỗi upload ảnh: Status code ${response.status}`);
      return null;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      showSnackbar('Lỗi khi upload ảnh', 'error');
      setError(apiError.response?.data?.message || apiError.message || 'Lỗi không xác định khi upload ảnh');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [showSnackbar]);


  const handleAddProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      setError(null);

      let imageUrl = null;
      let imageId = null;
      let imageExtension = null;
      
      if (productData.meta && typeof productData.meta === 'object') {
        if ('image_url' in productData.meta) {
          imageUrl = productData.meta.image_url;
        }
        
        if ('image_id' in productData.meta) {
          imageId = productData.meta.image_id;
        }
        
        if ('extension' in productData.meta) {
          imageExtension = productData.meta.extension;
        }
      }
      
      if (!imageUrl && productData.image) {
        imageUrl = productData.image;
      }
      
      const apiProductData = {
        name: productData.name,
        description: productData.description,
        price: Number(productData.price),
        stock_quantity: Number(productData.stock_quantity),
        status: Number(productData.status),
        sku: productData.name.toLowerCase().replace(/\s+/g, '-'),
        meta: {
          ...productData.meta,
          image_url: imageUrl,
          image_id: imageId,
          extension: imageExtension
        },
        categories: productData.categories?.map(Number) || [],
        attributes: productData.attributes.filter((attr: ProductAttribute) => 
          attr.attribute_id && attr.value
        ).map((attr: ProductAttribute) => ({
          attribute_id: Number(attr.attribute_id),
          value: attr.value
        })),
        variants: productData.variants.map((variant: ProductVariant) => ({
          sku: variant.sku || productData.name.toLowerCase().replace(/\s+/g, '-'),
          price: Number(variant.price),
          stock_quantity: Number(variant.stock_quantity),
          status: Number(variant.status),
          attributes: variant.attributes.filter((attr: ProductAttribute) => attr.attribute_id && attr.value).map((attr: ProductAttribute) => ({
            attribute_id: Number(attr.attribute_id),
            value: attr.value
          }))
        }))
      };
      
      const response = await createProduct(apiProductData);
      if (response.status === 201) {
        setIsProductModalOpen(false);
        showSnackbar('Thêm sản phẩm thành công', 'success');
        fetchProducts(); 
      } else {
        console.error('Failed to create product. Status code:', response.status);
        showSnackbar('Có lỗi xảy ra khi thêm sản phẩm', 'error');
        setError(`Lỗi khi tạo sản phẩm: Status code ${response.status}`);
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      showSnackbar('Có lỗi xảy ra khi thêm sản phẩm', 'error');
      setError(apiError.response?.data?.message || apiError.message || 'Lỗi không xác định khi tạo sản phẩm');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = async (productData: Partial<Product>) => {
    if (!editingProduct) return;

    try {
      setIsLoading(true);
      setError(null);

      console.log('=== EDIT PRODUCT DATA ===');
      console.log('Original product:', editingProduct);
      console.log('Update data:', productData);
      console.log('Image data:', {
        image: productData.image,
        meta: productData.meta
      });

      const response = await updateProduct(editingProduct.id, productData);
      
      if (response.status === 200) {
        setIsProductModalOpen(false);
        setEditingProduct(undefined);
        showSnackbar('Cập nhật sản phẩm thành công', 'success');
        fetchProducts();
      } else {
        console.error('Failed to update product. Status code:', response.status);
        showSnackbar('Có lỗi xảy ra khi cập nhật sản phẩm', 'error');
        setError(`Lỗi khi cập nhật sản phẩm: Status code ${response.status}`);
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error('Error updating product:', apiError);
      if (apiError.response) {
        console.error('Error response data:', apiError.response.data);
      }
      showSnackbar('Có lỗi xảy ra khi cập nhật sản phẩm', 'error');
      setError(apiError.response?.data?.message || apiError.message || 'Lỗi không xác định khi cập nhật sản phẩm');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

    try {
      setIsLoading(true);
      const response = await deleteProductById(productId);
      
      if (response.status === 200 || response.status === 204) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        showSnackbar('Xóa sản phẩm thành công', 'success');
        fetchProducts();
      } else {
        showSnackbar(`Lỗi khi xóa sản phẩm: Mã lỗi ${response.status}`, 'error');
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error(`Lỗi khi xóa sản phẩm ID ${productId}:`, apiError);
      
      if (apiError.response && 
          apiError.response.data && 
          apiError.response.data.message && 
          apiError.response.data.message.includes("violates foreign key constraint")) {
        showSnackbar(
          'Không thể xóa sản phẩm này vì nó có các biến thể. Vui lòng xóa tất cả biến thể trước.', 
          'error'
        );
      } else {
        showSnackbar('Có lỗi xảy ra khi xóa sản phẩm', 'error');
      }
      
      if (apiError.response) {
        console.error('Thông tin phản hồi lỗi:', apiError.response.data);
        console.error('Mã trạng thái:', apiError.response.status);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleOpenModal = async (product?: Product) => {
    if (product) {
      try {
        setIsLoading(true);
        const response = await getProductById(product.id);
        
        if (response.status === 200) {
          const productDetail = response.data;
          const productToEdit = {
            ...productDetail,
            attributes: Array.isArray(productDetail.attributes) ? productDetail.attributes : [],
            variants: Array.isArray(productDetail.variants) ? productDetail.variants.map((variant: ProductVariant) => ({
              ...variant,
              price: variant.price?.toString() || '0',
              stock_quantity: variant.stock_quantity?.toString() || '0',
              attributes: Array.isArray(variant.attributes) ? variant.attributes.map((attr: ProductAttribute) => ({
                attribute_id: attr.id?.toString() || attr.attribute_id?.toString() || '',
                value: attr.value || ''
              })) : []
            })) : [],
            categories: Array.isArray(productDetail.categories) 
              ? productDetail.categories.map((cat: Category | number) => 
                  typeof cat === 'object' && cat !== null 
                    ? cat.id?.toString() || '' 
                    : cat?.toString() || '')
              : []
          };
          
          setEditingProduct(productToEdit);
        } else {
          setEditingProduct({
            ...product,
            attributes: Array.isArray(product.attributes) ? product.attributes : [],
            variants: Array.isArray(product.variants) ? product.variants : []
          });
          console.error('Failed to fetch product details:', response.status);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        // Sử dụng dữ liệu có sẵn nếu API bị lỗi
        setEditingProduct({
          ...product,
          attributes: Array.isArray(product.attributes) ? product.attributes : [],
          variants: Array.isArray(product.variants) ? product.variants : []
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setEditingProduct(undefined);
    }
    setIsProductModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(undefined);
  };

  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const response = await getProducts();
      if (response.status === 200) {
        setProducts(response.data);
      } else {
        showSnackbar('Lỗi khi tải sản phẩm', 'error');
      }
    } catch (error: unknown) {
      console.error('Error fetching products:', error);
      showSnackbar('Lỗi khi tải sản phẩm', 'error');
    } finally {
      setProductsLoading(false);
    }
  }, [showSnackbar]);

  const handleCategoryChange = (categoryId: string) => {
    console.log('Products in selected category:', products.filter(product => 
      categoryId === 'all' || 
      (Array.isArray(product.categories) && product.categories.includes(Number(categoryId)))
    ));
    setCurrentCategory(categoryId);
  };

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

      <Box className="rounded-2xl shadow-lg">
        <ProductCategories
          categories={categories}
          currentCategory={currentCategory}
          onCategoryChange={handleCategoryChange}
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
          products={products} 
          currentCategory={currentCategory}
          isLoading={productsLoading} 
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
        onImageUpload={handleImageUploadToApi} // Truyền handleImageUploadToApi vào prop onImageUpload
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