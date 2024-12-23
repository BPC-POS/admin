'use client';
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import MenuList from '@/components/admin/menu/MenuList';
import MenuModal from '@/components/admin/menu/MenuModal';
import { MenuItem, MenuType, WeekDay } from '@/types/menu';
import { Product } from '@/types/product';

// Mock data - sẽ được thay thế bằng API call
const mockMenuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Menu chính',
    description: 'Các món bán chạy nhất',
    image: '/images/menu/main-menu.jpg',
    isActive: true,
    sortOrder: 0,
    type: MenuType.REGULAR,
    products: [1, 2, 3],
    timeAvailable: {
      start: '07:00',
      end: '22:00'
    },
    daysAvailable: [
      WeekDay.MONDAY,
      WeekDay.TUESDAY,
      WeekDay.WEDNESDAY,
      WeekDay.THURSDAY,
      WeekDay.FRIDAY,
      WeekDay.SATURDAY,
      WeekDay.SUNDAY
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: 'Menu sáng',
    description: 'Các món ăn sáng',
    image: '/images/menu/breakfast-menu.jpg',
    isActive: true,
    sortOrder: 1,
    type: MenuType.BREAKFAST,
    products: [4, 5, 6],
    timeAvailable: {
      start: '06:00',
      end: '10:00'
    },
    daysAvailable: [
      WeekDay.MONDAY,
      WeekDay.TUESDAY,
      WeekDay.WEDNESDAY,
      WeekDay.THURSDAY,
      WeekDay.FRIDAY
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Thêm các menu items khác
];

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleAddMenu = async (data: any) => {
    try {
      setIsLoading(true);
      // TODO: API call
      const newItem: MenuItem = {
        ...data,
        id: menuItems.length + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setMenuItems(prev => [...prev, newItem]);
      setIsModalOpen(false);
      showSnackbar('Thêm menu thành công', 'success');
    } catch (error) {
      showSnackbar('Có lỗi xảy ra', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMenu = async (data: any) => {
    if (!editingItem) return;

    try {
      setIsLoading(true);
      // TODO: API call
      const updatedItem: MenuItem = {
        ...editingItem,
        ...data,
        updatedAt: new Date(),
      };
      setMenuItems(prev =>
        prev.map(item => item.id === editingItem.id ? updatedItem : item)
      );
      setIsModalOpen(false);
      setEditingItem(undefined);
      showSnackbar('Cập nhật menu thành công', 'success');
    } catch (error) {
      showSnackbar('Có lỗi xảy ra', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMenu = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa menu này?')) return;

    try {
      setIsLoading(true);
      // TODO: API call
      setMenuItems(prev => prev.filter(item => item.id !== id));
      showSnackbar('Xóa menu thành công', 'success');
    } catch (error) {
      showSnackbar('Có lỗi xảy ra', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      setIsLoading(true);
      // TODO: API call
      setMenuItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, isActive, updatedAt: new Date() } : item
        )
      );
      showSnackbar('Cập nhật trạng thái thành công', 'success');
    } catch (error) {
      showSnackbar('Có lỗi xảy ra', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReorderMenu = async (items: MenuItem[]) => {
    try {
      setIsLoading(true);
      // TODO: API call
      setMenuItems(items);
    } catch (error) {
      showSnackbar('Có lỗi xảy ra khi sắp xếp menu', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <div className="p-6">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" component="h1" className="font-bold">
          Quản lý Menu
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsModalOpen(true)}
        >
          Thêm menu
        </Button>
      </Box>

      <MenuList
        menuItems={menuItems}
        onEdit={(item) => {
          setEditingItem(item);
          setIsModalOpen(true);
        }}
        onDelete={handleDeleteMenu}
        onToggleActive={handleToggleActive}
        onReorder={handleReorderMenu}
      />

      <MenuModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(undefined);
        }}
        onSubmit={editingItem ? handleEditMenu : handleAddMenu}
        editItem={editingItem}
        products={[]} // TODO: Pass actual products
        isLoading={isLoading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MenuPage;