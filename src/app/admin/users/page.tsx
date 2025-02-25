"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import UserList from '@/components/admin/users/UserList';
import UserModal from '@/components/admin/users/UserModal';
import UserFilter from '@/components/admin/users/UserFilter';
import { User, UserStatus, UserFilter as UserFilterType } from '@/types/user'; // Đảm bảo import đúng User, UserStatus, UserFilter
import mockUsers from '@/mocks/mockUsers';

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const [filter, setFilter] = useState<UserFilterType>({});
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleAddUser = async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);

      const newUser: User = { // Đảm bảo type của newUser là User
        ...data,
        id: Date.now(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setUsers(prev => [...prev, newUser]);
      setIsModalOpen(false);
      setSnackbar({
        open: true,
        message: 'Thêm người dùng thành công',
        severity: 'success',
      });
    } catch{
      setSnackbar({
        open: true,
        message: 'Đã xảy ra lỗi khi thêm người dùng',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = async (id: number, data: Partial<User>) => {
    try {
      setIsLoading(true);

      setUsers(prev =>
        prev.map(user =>
          user.id === id
            ? { ...user, ...data, updatedAt: new Date() }
            : user
        )
      );
      setIsModalOpen(false);
      setEditingUser(undefined);
      setSnackbar({
        open: true,
        message: 'Cập nhật người dùng thành công',
        severity: 'success',
      });
    } catch{
      setSnackbar({
        open: true,
        message: 'Đã xảy ra lỗi khi cập nhật người dùng',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;

    try {
      setIsLoading(true);
      // TODO: Call API
      setUsers(prev => prev.filter(user => user.id !== id));
      setSnackbar({
        open: true,
        message: 'Xóa người dùng thành công',
        severity: 'success',
      });
    } catch{
      setSnackbar({
        open: true,
        message: 'Đã xảy ra lỗi khi xóa người dùng',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: UserStatus) => {
    try {
      setIsLoading(true);
      // TODO: Call API
      setUsers(prev =>
        prev.map(user =>
          user.id === id
            ? { ...user, status: status, updatedAt: new Date() }
            : user
        )
      );
      setSnackbar({
        open: true,
        message: 'Cập nhật trạng thái thành công',
        severity: 'success',
      });
    } catch{
      setSnackbar({
        open: true,
        message: 'Đã xảy ra lỗi khi cập nhật trạng thái',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      const found =
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.fullName.toLowerCase().includes(searchTerm) ||
        user.phone?.includes(filter.search);
      if (!found) return false;
    }

    if (filter.role && user.role !== filter.role) return false;
    if (filter.status && user.status !== filter.status) return false;
    if (filter.startDate && new Date(user.createdAt) < filter.startDate) return false;
    if (filter.endDate && new Date(user.createdAt) > filter.endDate) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2C3E50] to-[#3498DB] p-6 [font-family:system-ui,Poppins,sans-serif]">
      <Box className="mb-6 bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
        <Typography variant="h4" component="h1" className="font-bold mb-4 font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-200">
          Quản lý người dùng
        </Typography>
        <Button
          variant="contained"
          className="bg-gradient-to-br from-[#2C3E50] to-[#3498DB] hover:to-blue-500 text-white font-bold py-2 px-4 rounded-xl font-poppins transition-all duration-300 shadow-md hover:shadow-lg"
          startIcon={<Add />}
          onClick={() => {
            setEditingUser(undefined);
            setIsModalOpen(true);
          }}
        >
          Thêm người dùng
        </Button>
      </Box>

      <div className="">
        <UserFilter
          filter={filter}
          onFilterChange={setFilter}
        />
      </div>

      <div className="">
        <UserList
          users={filteredUsers}
          onEdit={(user) => {
            setEditingUser(user);
            setIsModalOpen(true);
          }}
          onDelete={handleDeleteUser}
          onStatusChange={handleStatusChange}
        />
      </div>

      <UserModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(undefined);
        }}
        onSubmit={(data) => {
          if (editingUser) {
            handleEditUser(editingUser.id, data);
          } else {
            handleAddUser(data as Omit<User, 'id' | 'createdAt' | 'updatedAt'>);
          }
        }}
        editItem={editingUser}
        isLoading={isLoading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} className="backdrop-blur-lg shadow-lg [font-family:system-ui,Poppins,sans-serif]">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UsersPage;