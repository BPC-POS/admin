'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Grid, Alert, SelectChangeEvent
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { Category, Product, ProductStatus } from '@/types/product';
import { LoadingButton } from '@mui/lab';

// Import các component con
import ProductInfo from './AddProduct/ProductInfo';
import MetaInfo from './AddProduct/MetaInfo';
import ProductAttributes from './AddProduct/ProductAttributes';
import ProductVariants from './AddProduct/ProductVariants';
import ProductImageUpload from './AddProduct/ProductImageUpload';

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  categories: Category[];
  editProduct?: Product;
  isLoading?: boolean;
  error?: string;
}

interface VariantFormState {
  sku: string;
  price: string;
  stock_quantity: string;
  status: ProductStatus;
  attributes: { attribute_id: string; value: string }[];
}

export interface FormState {
  name: string;
  description: string;
  price: string;
  stock_quantity: string;
  sku: string;
  status: ProductStatus;
  meta: object;
  categories: string[];
  attributes: { attribute_id: string; value: string }[];
  variants: VariantFormState[];
  image: string;
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
  open, onClose, onSubmit, categories, editProduct, isLoading, error
}) => {
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (editProduct) {
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
          attribute_id: String(attr.attribute_id),
          value: attr.value
        })),
        variants: (editProduct.variants || []).map(variant => ({
          ...variant,
          price: variant.price.toString(),
          stock_quantity: variant.stock_quantity.toString(),
          attributes: variant.attributes.map(attr => ({
            attribute_id: String(attr.attribute_id),
            value: attr.value
          }))
        })),
        image: editProduct.image,
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const productCategories = formData.categories.map(Number);
    const productAttributes = formData.attributes.map(attr => ({ attribute_id: Number(attr.attribute_id), value: attr.value }));
    const productVariants = formData.variants.map(variant => ({
      sku: variant.sku,
      price: Number(variant.price),
      stock_quantity: Number(variant.stock_quantity),
      status: variant.status,
      attributes: variant.attributes.map(attr => ({ attribute_id: Number(attr.attribute_id), value: attr.value }))
    }));

    const productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      stock_quantity: Number(formData.stock_quantity),
      sku: formData.sku,
      status: formData.status,
      meta: formData.meta,
      categories: productCategories,
      attributes: productAttributes,
      variants: productVariants,
      image: '',
      isAvailable: false
    };

    onSubmit(productData);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setFormData({ ...formData, categories: Array.isArray(value) ? value : [] });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMetaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const parsedMeta = JSON.parse(e.target.value);
      setFormData({ ...formData, meta: parsedMeta });
    } catch (e) {
      setErrors(prevErrors => ({ ...prevErrors, meta: "Invalid JSON format" }));
      setFormData({ ...formData, meta: {} });
    }
  };
  const handleAddAttribute = () => {
    setFormData(prev => ({ ...prev, attributes: [...prev.attributes, { attribute_id: '', value: '' }] }));
  };
  const handleRemoveAttribute = (index: number) => {
    setFormData(prev => ({ ...prev, attributes: prev.attributes.filter((_, i) => i !== index) }));
  };
  const handleAttributeChange = (index: number, field: 'attribute_id' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.map((attr, i) => i === index ? { ...attr, [field]: field === 'attribute_id' ? Number(value) : value } : attr)
    }));
  };

  const handleAddVariant = () => {
    setFormData(prev => ({ ...prev, variants: [...prev.variants, { ...initialVariantFormState }] }));
  };
  const handleRemoveVariant = (index: number) => {
    setFormData(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
  };
  const handleVariantChange = (index: number, field: keyof VariantFormState, value: string | ProductStatus) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => i === index ? { ...variant, [field]: value } : variant)
    }));
  };
  const handleVariantAttributeChange = (variantIndex: number, attributeIndex: number, field: 'attribute_id' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, vIndex) =>
        vIndex === variantIndex
          ? {
              ...variant,
              attributes: variant.attributes.map((attr, aIndex) =>
                aIndex === attributeIndex ? { ...attr, [field]: field === 'attribute_id' ? Number(value) : value } : attr
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

  const handleImageSelect = useCallback((file: File) => {
    // No setImageFile here as it's handled in ProductImageUpload component
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.image;
      return newErrors;
    });
    if (file) {
      setFormData(prev => ({...prev, image: URL.createObjectURL(file)}))
    }
  }, [setErrors])


  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ className: 'max-h-[90vh] bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg font-poppins' }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle className="flex justify-between items-center border-b bg-gradient-to-r from-[#2C3E50] to-[#3498DB] text-white">
          <div className="font-bold font-poppins text-lg">
            {editProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </div>
          <div onClick={onClose} className="text-white cursor-pointer">
            <Close />
          </div>
        </DialogTitle>

        <DialogContent className="overflow-y-auto">
          {error && <Alert severity="error" className="mb-4 mt-4 backdrop-blur-lg">{error}</Alert>}
          {errors.categories && <Alert severity="error" className="mb-4 mt-4 backdrop-blur-lg">{errors.categories}</Alert>}

          <Grid container spacing={2} className="mt-2 font-poppins">
            <Grid item xs={12} md={8}> {/* Product Details Container */}
              <ProductInfo
                formData={formData}
                errors={errors}
                categories={categories}
                handleInputChange={handleInputChange}
                handleCategoryChange={handleCategoryChange} handleStatusChange={function (event: SelectChangeEvent<string>): void {
                  throw new Error('Function not implemented.');
                } }              />
              <MetaInfo
                formData={formData}
                errors={errors}
                handleMetaChange={handleMetaChange}
              />
              <ProductAttributes
                formData={formData}
                handleAddAttribute={handleAddAttribute}
                handleRemoveAttribute={handleRemoveAttribute}
                handleAttributeChange={handleAttributeChange}
              />
              <ProductVariants
                formData={formData}
                handleAddVariant={handleAddVariant}
                handleRemoveVariant={handleRemoveVariant}
                handleVariantChange={handleVariantChange}
                handleVariantAttributeChange={handleVariantAttributeChange}
                handleAddVariantAttribute={handleAddVariantAttribute}
                handleRemoveVariantAttribute={handleRemoveVariantAttribute}
              />
            </Grid>

            <Grid item xs={12} md={4}> {/* Product Image Container */}
              <ProductImageUpload
                formData={formData}
                errors={errors}
                setImageFile={setImageFile}
                handleImageSelect={handleImageSelect}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions className="border-t p-4 bg-gradient-to-r ">
          <Button onClick={onClose} className="mr-2 text-black hover:bg-white/20">Hủy</Button>
          <LoadingButton type="submit" variant="contained" loading={isLoading} className="bg-white text-[#2C3E50] hover:bg-white/90 font-poppins font-semibold ">
            {editProduct ? 'Cập nhật' : 'Thêm sản phẩm'}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddProductModal;