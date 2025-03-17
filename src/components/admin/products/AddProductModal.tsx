'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Grid, Alert, SelectChangeEvent, Typography, Divider
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { Category, Product, ProductStatus, VariantFormState, FormState } from '@/types/product';
import { LoadingButton } from '@mui/lab';

import ProductInfo from './AddProduct/ProductInfo';
import ProductAttributes from './AddProduct/ProductAttributes';
import ProductVariants from './AddProduct/ProductVariants';
import ProductImageUpload from './AddProduct/ProductImageUpload';
import RecipesProduct from './AddProduct/Recipes';

// Define interfaces for metadata
interface ProductMeta {
  image_url?: string;
  image_id?: string;
  extension?: string;
  recipes?: {
    ingredients: string;
    instructions: string;
  };
  [key: string]: unknown;
}

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onImageUpload: (file: File | null) => Promise<string | null>;
  categories: Category[];
  editProduct?: Product;
  isLoading?: boolean;
  error?: string;
}

interface ChangedFields {
  name?: boolean;
  description?: boolean;
  price?: boolean;
  stock_quantity?: boolean;
  sku?: boolean;
  status?: boolean;
  meta?: boolean;
  categories?: boolean;
  attributes?: boolean;
  variants?: boolean;
  image?: boolean;
}

const initialVariantFormState: VariantFormState = {
  sku: '',
  price: '',
  stock_quantity: '',
  status: ProductStatus.ACTIVE,
  attributes: [{ attribute_id: '', value: '' }],
};

const initialFormState: FormState = {
  name: '',
  description: '',
  price: '',
  stock_quantity: '',
  sku: '',
  status: ProductStatus.ACTIVE,
  meta: {},
  categories: [],
  attributes: [{ attribute_id: '', value: '' }],
  variants: [initialVariantFormState],
  image: '',
};

const AddProductModal: React.FC<AddProductModalProps> = ({
  open, onClose, onSubmit, categories, editProduct, isLoading, error, onImageUpload
}) => {
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [changedFields, setChangedFields] = useState<ChangedFields>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (editProduct) {
      let imageUrl = editProduct.image;
      if (!imageUrl && editProduct.meta && typeof editProduct.meta === 'object') {
        imageUrl = (editProduct.meta as ProductMeta).image_url || '';
      }

      setFormData({
        name: editProduct.name,
        description: editProduct.description,
        price: editProduct.price.toString(),
        stock_quantity: editProduct.stock_quantity.toString(),
        sku: editProduct.sku,
        status: editProduct.status,
        meta: editProduct.meta || {},
        categories: editProduct.categories?.map(String) || [],
        attributes: (editProduct.attributes || []).map(attr => ({
          attribute_id: String((attr as {attribute_id?: number; id?: number}).attribute_id || (attr as {attribute_id?: number; id?: number}).id || ''),
          value: attr.value || ''
        })),
        variants: (editProduct.variants || []).map(variant => ({
          ...variant,
          price: variant.price?.toString() || '0',
          stock_quantity: variant.stock_quantity?.toString() || '0',
          attributes: Array.isArray(variant.attributes) ? variant.attributes.map(attr => ({
            attribute_id: String((attr as {attribute_id?: number; id?: number}).attribute_id || (attr as {attribute_id?: number; id?: number}).id || ''),
            value: attr.value || ''
          })) : []
        })),
        image: imageUrl || '',
      });
      
      setChangedFields({});
      
      if (imageUrl) {
        setUploadedImageUrl(imageUrl);
      }
    } else {
      setFormData(initialFormState);
      setUploadedImageUrl(null);
      setChangedFields({
        name: true,
        description: true,
        price: true,
        stock_quantity: true,
        sku: true,
        status: true,
        meta: true,
        categories: true,
        attributes: true,
        variants: true,
        image: true
      });
    }
    setErrors({});
    setImageFile(null);
  }, [editProduct, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập tên sản phẩm';
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) newErrors.price = 'Vui lòng nhập giá hợp lệ';
    if (!formData.stock_quantity || isNaN(Number(formData.stock_quantity)) || Number(formData.stock_quantity) < 0) newErrors.stock_quantity = 'Vui lòng nhập số lượng kho hợp lệ (>= 0)';
    if (!formData.sku.trim()) newErrors.sku = 'Vui lòng nhập SKU sản phẩm';
    if (!formData.categories.length) newErrors.categories = 'Vui lòng chọn ít nhất một danh mục';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setChangedFields(prev => ({ ...prev, [name]: true }));
  };

  const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setFormData({ ...formData, categories: Array.isArray(value) ? value : [] });
    setChangedFields(prev => ({ ...prev, categories: true }));
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    const newStatus = Number(event.target.value) as ProductStatus;
    setFormData(prev => ({ ...prev, status: newStatus }));
    setChangedFields(prev => ({ ...prev, status: true }));
  };

  const handleAttributeChange = (index: number, field: 'attribute_id' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.map((attr, i) => i === index ? { 
        ...attr, 
        [field]: field === 'attribute_id' ? value : value,
        id: (attr as {id?: string}).id
      } : attr)
    }));
    setChangedFields(prev => ({ ...prev, attributes: true }));
  };

  const handleVariantChange = (index: number, field: keyof VariantFormState, value: string | ProductStatus) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => i === index ? { 
        ...variant, 
        [field]: value,
        id: (variant as {id?: number}).id 
      } : variant)
    }));
    setChangedFields(prev => ({ ...prev, variants: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    let imageUrl = uploadedImageUrl;
    let imageId: string | null = null;
    let imageExtension: string | null = null;
    
    console.log('Initial state:', { 
      imageFile, 
      uploadedImageUrl, 
      editProductImage: editProduct?.image,
      editProductMetaImageUrl: (editProduct?.meta as ProductMeta)?.image_url
    });
    
    if (imageFile) {
      imageUrl = await onImageUpload(imageFile);
      
      if (!imageUrl) {
        console.error('Image upload failed - no URL returned');
        setErrors(prev => ({ ...prev, image: "Failed to upload image" }));
        return;
      }
      
      if (imageUrl.includes('amazonaws.com/')) {
        imageId = imageUrl.split('amazonaws.com/')[1];
      }
      
      const originalExtension = imageFile.name.split('.').pop()?.toLowerCase();
      imageExtension = originalExtension || 'jpg';
      
      setUploadedImageUrl(imageUrl);
      setChangedFields(prev => ({ ...prev, image: true, meta: true }));
      
      console.log('After image upload:', { imageUrl, imageId, imageExtension });
    }

    const updatedData: Partial<Product> = {};

    if (changedFields.name) updatedData.name = formData.name;
    if (changedFields.description) updatedData.description = formData.description;
    if (changedFields.price) updatedData.price = Number(formData.price);
    if (changedFields.stock_quantity) updatedData.stock_quantity = Number(formData.stock_quantity);
    if (changedFields.sku) updatedData.sku = formData.sku;
    if (changedFields.status) updatedData.status = formData.status;
    
    if (editProduct) {
      if (imageFile && imageUrl) {
        updatedData.image = imageUrl as string;
        updatedData.meta = {
          ...formData.meta,
          image_url: imageUrl,
          image_id: imageId || undefined,
          extension: imageExtension || undefined
        };
        console.log('Using new uploaded image:', updatedData.image);
      } else {
        const currentImage = formData.image || editProduct.image;
        const currentImageId = (editProduct.meta as ProductMeta)?.image_id;
        const currentExtension = (editProduct.meta as ProductMeta)?.extension;
        
        updatedData.image = currentImage;
        updatedData.meta = {
          ...formData.meta,
          image_url: currentImage,
          image_id: currentImageId,
          extension: currentExtension
        };
        console.log('Preserving existing image:', updatedData.image);
      }
    } else {
      if (imageFile && imageUrl) {
        updatedData.image = imageUrl as string;
        updatedData.meta = {
          ...formData.meta,
          image_url: imageUrl,
          image_id: imageId || undefined,
          extension: imageExtension || undefined
        };
      }
    }

    if (changedFields.categories) {
      updatedData.categories = formData.categories
        .map(Number)
        .filter(id => !isNaN(id));
    }

    if (changedFields.attributes) {
      const validAttributes = formData.attributes
        .filter(attr => attr.attribute_id && attr.value)
        .map(attr => ({
          attribute_id: Number(attr.attribute_id),
          value: attr.value
        }));
      
      if (validAttributes.length > 0) {
        updatedData.attributes = validAttributes;
      }
    }

    if (changedFields.variants) {
      const validVariants = formData.variants
        .map(variant => ({
          ...(variant.id ? { id: variant.id } : {}),
          sku: variant.sku,
          price: Number(variant.price),
          stock_quantity: Number(variant.stock_quantity),
          status: variant.status,
          attributes: variant.attributes
            .filter(attr => attr.attribute_id && attr.value)
            .map(attr => ({
              ...(attr.id ? { id: attr.id } : {}),
              attribute_id: Number(attr.attribute_id),
              value: attr.value
            }))
        }))
        .filter(variant => 
          variant.sku && 
          !isNaN(variant.price) && 
          !isNaN(variant.stock_quantity) &&
          variant.attributes.length > 0
        );

      if (validVariants.length > 0) {
        updatedData.variants = validVariants;
      }
    }

    if (Object.keys(updatedData).length === 0) {
      onClose();
      return;
    }
    onSubmit(updatedData as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>);
  };

  const handleAddAttribute = () => {
    setFormData(prev => ({ ...prev, attributes: [...prev.attributes, { attribute_id: '', value: '' }] }));
  };
  const handleRemoveAttribute = (index: number) => {
    setFormData(prev => ({ ...prev, attributes: prev.attributes.filter((_, i) => i !== index) }));
  };

  const handleAddVariant = () => {
    setFormData(prev => ({ ...prev, variants: [...prev.variants, { ...initialVariantFormState }] }));
  };
  const handleRemoveVariant = (index: number) => {
    setFormData(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
  };
  const handleVariantAttributeChange = (variantIndex: number, attributeIndex: number, field: 'attribute_id' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, vIndex) =>
        vIndex === variantIndex
          ? {
              ...variant,
              attributes: variant.attributes.map((attr, aIndex) =>
                aIndex === attributeIndex ? { 
                  ...attr, 
                  [field]: field === 'attribute_id' ? value : value,
                  id: (attr as {id?: number}).id
                } : attr
              ),
            }
          : variant
      ),
    }));
  };
  const handleAddVariantAttribute = (variantIndex: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, vIndex) =>
        vIndex === variantIndex
          ? { ...variant, attributes: [...variant.attributes, { attribute_id: '', value: '' }] }
          : variant
      ),
    }));
  };

  const handleRemoveVariantAttribute = (variantIndex: number, attributeIndex: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, vIndex) =>
        vIndex === variantIndex
          ? {
            ...variant,
            attributes: variant.attributes.filter((_, aIndex) => aIndex !== attributeIndex),
          }
          : variant
      ),
    }));
  };

  const handleImageSelect = useCallback(async (file: File | null) => {
    setImageFile(file);
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.image;
      return newErrors;
    });
    
    if (file) {
      setFormData(prev => ({...prev, image: URL.createObjectURL(file)}));
    } else {
      setFormData(prev => ({...prev, image: ''}));
      setUploadedImageUrl(null);
    }
  }, [setErrors]);

  const handleRecipesChange = (recipes: { ingredients: string; instructions: string }) => {
    setFormData(prev => ({
      ...prev,
      meta: {
        ...prev.meta,
        recipes
      }
    }));
    setChangedFields(prev => ({ ...prev, meta: true }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ 
        className: 'h-[90vh] bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl font-poppins'
      }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <DialogTitle className="flex justify-between items-center border-b bg-gradient-to-r from-[#2C3E50] to-[#3498DB] text-white p-4 flex-shrink-0">
          <div className="font-bold font-poppins text-xl">
            {editProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </div>
          <IconButton onClick={onClose} className="text-white hover:bg-white/20">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent className="overflow-y-auto p-6 flex-grow">
          {error && <Alert severity="error" className="mb-6 mt-2 backdrop-blur-lg shadow-sm">{error}</Alert>}
          {errors.categories && <Alert severity="error" className="mb-6 mt-2 backdrop-blur-lg shadow-sm">{errors.categories}</Alert>}

          <Grid container spacing={4} className="mt-0 font-poppins">
            <Grid item xs={12} md={8} className="order-2 md:order-1"> 
              <div className="bg-white/80 backdrop-blur-md rounded-xl p-5 shadow-sm border border-gray-100">
                <Typography variant="h6" className="font-semibold mb-4 text-[#2C3E50]">
                  Thông tin sản phẩm
                </Typography>
                <Divider className="mb-4" />
                
                <ProductInfo
                  formData={formData}
                  errors={errors}
                  categories={categories}
                  handleInputChange={handleInputChange}
                  handleCategoryChange={handleCategoryChange} 
                  handleStatusChange={handleStatusChange}
                />
              </div>
              
              <div className="bg-white/80 backdrop-blur-md rounded-xl p-5 shadow-sm border border-gray-100 mt-6">
                <Typography variant="h6" className="font-semibold mb-4 text-[#2C3E50]">
                  Thuộc tính sản phẩm
                </Typography>
                <Divider className="mb-4" />
                
                <ProductAttributes
                  formData={formData}
                  handleAddAttribute={handleAddAttribute}
                  handleRemoveAttribute={handleRemoveAttribute}
                  handleAttributeChange={handleAttributeChange}
                />
              </div>
              
              <div className="bg-white/80 backdrop-blur-md rounded-xl p-5 shadow-sm border border-gray-100 mt-6">
                <Typography variant="h6" className="font-semibold mb-4 text-[#2C3E50]">
                  Biến thể sản phẩm
                </Typography>
                <Divider className="mb-4" />
                
                <ProductVariants
                  formData={formData}
                  handleAddVariant={handleAddVariant}
                  handleRemoveVariant={handleRemoveVariant}
                  handleVariantChange={handleVariantChange}
                  handleVariantAttributeChange={handleVariantAttributeChange}
                  handleAddVariantAttribute={handleAddVariantAttribute}
                  handleRemoveVariantAttribute={handleRemoveVariantAttribute}
                />
              </div>

              <div className="bg-white/80 backdrop-blur-md rounded-xl p-5 shadow-sm border border-gray-100 mt-6">
                <Typography variant="h6" className="font-semibold mb-4 text-[#2C3E50]">
                  Công thức sản phẩm
                </Typography>
                <Divider className="mb-4" />
                
                <RecipesProduct 
                  recipes={(formData.meta as ProductMeta)?.recipes || { ingredients: '', instructions: '' }}
                  onChange={handleRecipesChange}
                />
              </div>
            </Grid>

            <Grid item xs={12} md={4} className="order-1 md:order-2">
              <div className="bg-white/80 backdrop-blur-md rounded-xl p-5 shadow-sm border border-gray-100 md:sticky md:top-2">
                <Typography variant="h6" className="font-semibold mb-4 text-[#2C3E50]">
                  Hình ảnh sản phẩm
                </Typography>
                <Divider className="mb-4" />
                
                <ProductImageUpload
                  formData={formData}
                  errors={errors}
                  onFileSelect={handleImageSelect}
                />
              </div>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions className="border-t p-4 bg-gradient-to-r from-gray-50 to-gray-100 flex justify-between flex-shrink-0">
          <Button 
            onClick={onClose} 
            className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded-lg font-medium"
          >
            Hủy
          </Button>
          <LoadingButton 
            type="submit" 
            variant="contained" 
            loading={isLoading} 
            className="bg-gradient-to-r from-[#2C3E50] to-[#3498DB] hover:from-[#1e2b38] hover:to-[#2980b9] text-white font-semibold px-6 py-2 rounded-lg shadow-md"
          >
            {editProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddProductModal;