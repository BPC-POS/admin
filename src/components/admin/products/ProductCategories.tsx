import React, { useState } from 'react';
import {
  Paper,
  Tabs,
  Tab,
  IconButton,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Tooltip,
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
  onAddCategory?: (category: Omit<Category, 'id'>) => void;
  onEditCategory?: (id: string, category: Omit<Category, 'id'>) => void;
  onDeleteCategory?: (id: string) => void;
  onToggleCategory?: (id: string) => void;
}

const ProductCategories: React.FC<ProductCategoriesProps> = ({
  categories,
  currentCategory,
  onCategoryChange,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onToggleCategory,
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
      <Paper className="mb-4">
        <Box className="p-4 flex justify-between items-center">
          <Typography variant="h6">Danh mục sản phẩm</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setSelectedCategory(null);
              setIsModalOpen(true);
            }}
          >
            Thêm danh mục
          </Button>
        </Box>
        <Tabs
          value={currentCategory}
          onChange={(_, value) => onCategoryChange(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Tất cả" value="all" />
          {categories.map((category) => (
            <Tab
              key={category.id}
              label={
                <div className="flex items-center gap-2">
                  {category.name}
                  {!category.isActive && (
                    <VisibilityOff fontSize="small" className="text-gray-400" />
                  )}
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, category)}
                    className="ml-1"
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                </div>
              }
              value={category.id}
            />
          ))}
        </Tabs>
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Chỉnh sửa</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleToggle}>
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
        <MenuItem onClick={handleDelete} className="text-red-600">
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
        onSubmit={handleSubmit}
        editItem={selectedCategory || undefined}
      />
    </>
  );
};

export default ProductCategories;
