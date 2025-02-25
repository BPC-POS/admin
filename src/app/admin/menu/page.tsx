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
import MenuDetailModal from '@/components/admin/menu/MenuDetailModal';
import { MenuItem } from '@/types/menu'; // Đảm bảo import MenuItem type từ đúng đường dẫn
import mockMenuItems from '@/mocks/mockMenuItems';
import mockProducts from '@/mocks/mockProducts';

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
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  const handleAddMenu = async (data: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      const newItem: MenuItem = {
        ...data,
        id: menuItems.length + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setMenuItems(prev => [...prev, newItem]);
      setIsModalOpen(false);
      showSnackbar('Thêm menu thành công', 'success');
    } catch {
      showSnackbar('Có lỗi xảy ra', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMenu = async (data: Partial<MenuItem>) => {
    if (!editingItem) return;

    try {
      setIsLoading(true);
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
    } catch {
      showSnackbar('Có lỗi xảy ra', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMenu = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa menu này?')) return;

    try {
      setIsLoading(true);
      setMenuItems(prev => prev.filter(item => item.id !== id));
      showSnackbar('Xóa menu thành công', 'success');
    } catch {
      showSnackbar('Có lỗi xảy ra', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      setIsLoading(true);
      setMenuItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, isActive, updatedAt: new Date() } : item
        )
      );
      showSnackbar('Cập nhật trạng thái thành công', 'success');
    } catch {
      showSnackbar('Có lỗi xảy ra', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReorderMenu = async (items: MenuItem[]) => {
    try {
      setIsLoading(true);
      setMenuItems(items);
    } catch {
      showSnackbar('Có lỗi xảy ra khi sắp xếp menu', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2C3E50] to-[#3498DB] p-6 [font-family:system-ui,Poppins,sans-serif]">
      <Box className="mb-6 bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
        <Typography variant="h4" component="h1" className="font-bold mb-4 font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-200">
          Quản lý Menu
        </Typography>
        <Button
          variant="contained"
          className="bg-gradient-to-br from-[#2C3E50] to-[#3498DB] hover:to-blue-500 text-white font-bold py-2 px-4 rounded-xl font-poppins transition-all duration-300 shadow-md hover:shadow-lg"
          startIcon={<Add />}
          onClick={() => setIsModalOpen(true)}
        >
          Thêm menu
        </Button>
      </Box>

      <div className="rounded-2xl shadow-lg">
        <MenuList
          menuItems={menuItems}
          onEdit={(item) => {
            setEditingItem(item);
            setIsModalOpen(true);
          }}
          onDelete={handleDeleteMenu}
          onToggleActive={handleToggleActive}
          onReorder={handleReorderMenu}
          onViewDetail={(item: MenuItem) => {
            setSelectedMenuItem(item);
            setIsDetailModalOpen(true);
          }}
        />
      </div>

      <MenuModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(undefined);
        }}
        onSubmit={editingItem ? handleEditMenu : handleAddMenu}
        editItem={editingItem}
        products={mockProducts}
        isLoading={isLoading}
      />

      <MenuDetailModal
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        menuItem={selectedMenuItem}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
        <Alert severity={snackbar.severity} className="backdrop-blur-lg shadow-lg [font-family:system-ui,Poppins,sans-serif]">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MenuPage;