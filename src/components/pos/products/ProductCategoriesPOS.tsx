import React, { useState } from 'react';
import {
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import {
  VisibilityOff,
} from '@mui/icons-material';
import { Category } from '@/types/product';

interface ProductCategoriesPOSProps {
  categories: Category[];
  currentCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onAddCategory?: (category: Omit<Category, 'id'>) => void;
  onEditCategory?: (id: string, category: Omit<Category, 'id'>) => void;
  onDeleteCategory?: (id: string) => void;
  onToggleCategory?: (id: string) => void;
  isLoading?: boolean;
}

const ProductCategoriesPOS: React.FC<ProductCategoriesPOSProps> = ({
  categories,
  currentCategory,
  onCategoryChange,

}) => {
  const [, setAnchorEl] = useState<null | HTMLElement>(null);
  const [, setSelectedCategory] = useState<Category | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, category: Category) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedCategory(category);
  };

  return (
    <>
      <div className="mb-6 bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg font-poppins"> {/* Thêm font-poppins vào đây */}
        <Box className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Danh mục sản phẩm</h2> 
        </Box>
        <Tabs
          value={currentCategory}
          onChange={(_, value) => onCategoryChange(value)}
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{
            style: {
              backgroundColor: '#3498DB',
            }
          }}
        >
          <Tab label="Tất cả" value="all" className="font-bold" /> 
          {categories.map((category) => (
            <Tab
            key={category.id}
            label={
              <div className="flex items-center gap-2"> 
                {category.name}
                {!category.isActive && (
                  <VisibilityOff fontSize="small" className="text-gray-400" />
                )}
              </div>
            }
            value={category.id}
            className="font-bold" 
            onClick={(e) => handleMenuOpen(e, category)}
          />
          ))}
        </Tabs>
      </div>

    </>
  );
};

export default ProductCategoriesPOS;