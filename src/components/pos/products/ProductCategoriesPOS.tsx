import React, { useState } from 'react';
import {
  Paper,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import {
  VisibilityOff,
} from '@mui/icons-material';
import { Category } from '@/types/product';
import CategoryModalPOS from './CategoryModalPOS';

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
  onAddCategory,
  onEditCategory,
  isLoading = false,
}) => {
  const [, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, category: Category) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleSubmit = (data: Omit<Category, 'id'>) => {
    if (selectedCategory && onEditCategory) {
      onEditCategory(selectedCategory.id, data);
    } else if (onAddCategory) {
      onAddCategory(data);
    }
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <>
      <Paper className="mb-6 bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
        <Box className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold font-poppins">Danh mục sản phẩm</h2>
        </Box>
        <Tabs
          value={currentCategory}
          onChange={(_, value) => onCategoryChange(value)}
          variant="scrollable"
          scrollButtons="auto"
          className="font-poppins"
          TabIndicatorProps={{
            style: {
              backgroundColor: '#3498DB',
              fontFamily: 'Poppins',
            }
          }}
        >
          <Tab label="Tất cả" value="all" className="font-poppins font-bold" />
          {categories.map((category) => (
            <Tab
            key={category.id}
            label={
              <div className="flex items-center gap-2 font-poppins">
                {category.name}
                {!category.isActive && (
                  <VisibilityOff fontSize="small" className="text-gray-400" />
                )}
              </div>
            }
            value={category.id}
            className="font-poppins font-bold"
            onClick={(e) => handleMenuOpen(e, category)}
          />
          ))}
        </Tabs>
      </Paper>

      <CategoryModalPOS
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleSubmit}
        editItem={selectedCategory || undefined}
        isLoading={isLoading}
      />
    </>
  );
};

export default ProductCategoriesPOS;
