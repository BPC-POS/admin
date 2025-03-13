import React, { useState } from 'react';
import {
  Paper,
  Tabs,
  Tab,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
} from '@mui/material';
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { Category } from '@/types/product';
import CategoryModal from './CategoryModal';

interface ProductCategoriesProps {
  categories: Category[];
  currentCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onAddCategory?: (categoryData: Omit<Category, 'id'>) => void;
  onEditCategory?: (id: string, category: Omit<Category, 'id'>) => void;
  onDeleteCategory?: (id: string) => void;
  onToggleCategory?: (id: string) => void;
  isLoading?: boolean;
  onCategoriesUpdated?: () => void;
}

const ProductCategories: React.FC<ProductCategoriesProps> = ({
  categories,
  currentCategory,
  onCategoryChange,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onToggleCategory,
  isLoading,
  onCategoriesUpdated,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, category: Category) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCategory(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    if (selectedCategory && onDeleteCategory) {
      onDeleteCategory(selectedCategory.id);
    }
    handleMenuClose();
  };

  const handleToggle = () => {
    if (selectedCategory && onToggleCategory) {
      onToggleCategory(selectedCategory.id);
    }
    handleMenuClose();
  };

  const handleCategoryCreatedNotification = () => {
    if (onCategoriesUpdated) {
      onCategoriesUpdated();
    }
  };

  const handleCreateCategorySubmit = (formData: Omit<Category, 'id'>, editItem?: Category) => { // Nhận thêm editItem
    if (editItem) {
      // Trường hợp chỉnh sửa: gọi onEditCategory
      if (onEditCategory && selectedCategory) { // Đảm bảo selectedCategory không null khi edit
        onEditCategory(selectedCategory.id, formData);
      }
    } else {
      // Trường hợp thêm mới: gọi onAddCategory
      if (onAddCategory) {
        onAddCategory(formData);
      }
    }
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <>
      <Paper className="mb-6 bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
        <Box className="flex justify-between items-center">
          <Typography variant="h6" className="font-poppins text-black">Danh mục sản phẩm</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setSelectedCategory(null);
              setIsModalOpen(true);
            }}
            className="bg-gradient-to-br from-[#2C3E50] to-[#3498DB] hover:to-blue-500 font-poppins"
          >
            Thêm danh mục
          </Button>
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
                  <div // Thay IconButton bằng div
                    className="ml-1 cursor-pointer" // Thêm class cursor-pointer để giống button hơn
                    onClick={(e) => handleMenuOpen(e, category)}
                    aria-label="Options" // Thêm aria-label cho accessibility
                    tabIndex={0}       // Để div có thể focus bằng tab (nếu cần)
                    role="button"      // Để div được nhận diện là button về mặt semantic
                  >
                    <MoreVert fontSize="small" />
                  </div>
                </div>
              }
              value={category.id}
              className="font-poppins font-bold"
            />
          ))}
        </Tabs>
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          className: "bg-white/90 backdrop-blur-lg rounded-xl shadow-lg"
        }}
      >
        <MenuItem onClick={handleEdit} className="font-poppins">
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Chỉnh sửa</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleToggle} className="font-poppins">
          <ListItemIcon>
            {selectedCategory?.isActive ? (
              <VisibilityOff fontSize="small" />
            ) : (
              <Visibility fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {selectedCategory?.isActive ? 'Ẩn danh mục' : 'Hiện danh mục'}
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} className="text-red-600 font-poppins">
          <ListItemIcon>
            <Delete fontSize="small" className="text-red-600" />
          </ListItemIcon>
          <ListItemText>Xóa</ListItemText>
        </MenuItem>
      </Menu>

      <CategoryModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleCreateCategorySubmit}
        editItem={selectedCategory || undefined}
        isLoading={isLoading}
        onCategoryCreated={handleCategoryCreatedNotification}
      />
    </>
  );
};

export default ProductCategories;