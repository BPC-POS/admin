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
import { User, UserRole, UserStatus, UserFilter as UserFilterType } from '@/types/user';

// Mock data
const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    fullName: 'Administrator',
    phone: '0123456789',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    username: 'staff1',
    email: 'staff1@example.com',
    fullName: 'Nhân viên 1',
    phone: '0987654321',
    role: UserRole.STAFF,
    status: UserStatus.ACTIVE,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Thêm mock data khác...
];

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

  const handleAddUser = async (data: any) => {
    try {
      setIsLoading(true);
      // TODO: API call
      const newUser = {
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
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi thêm người dùng',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = async (id: number, data: any) => {
    try {
      setIsLoading(true);
      // TODO: API call
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
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi cập nhật người dùng',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa người dùng này?')) return;

    try {
      setIsLoading(true);
      // TODO: API call
      setUsers(prev => prev.filter(user => user.id !== id));
      setSnackbar({
        open: true,
        message: 'Xóa người dùng thành công',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa người dùng',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: UserStatus) => {
    try {
      setIsLoading(true);
      // TODO: API call
      setUsers(prev =>
        prev.map(user =>
          user.id === id
            ? { ...user, status, updatedAt: new Date() }
            : user
        )
      );
      setSnackbar({
        open: true,
        message: 'Cập nhật trạng thái thành công',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi cập nhật trạng thái',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      const matchesSearch = 
        user.username.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.fullName.toLowerCase().includes(searchLower) ||
        user.phone?.includes(filter.search);
      if (!matchesSearch) return false;
    }

    if (filter.role && user.role !== filter.role) return false;
    if (filter.status && user.status !== filter.status) return false;
    if (filter.startDate && new Date(user.createdAt) < filter.startDate) return false;
    if (filter.endDate && new Date(user.createdAt) > filter.endDate) return false;

    return true;
  });

  return (
    <div className="p-6">
      <Box className="mb-6">
        <Typography variant="h4" component="h1" className="font-bold mb-4">
          Quản lý người dùng
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setEditingUser(undefined);
            setIsModalOpen(true);
          }}
        >
          Thêm người dùng
        </Button>
      </Box>

      <UserFilter
        filter={filter}
        onFilterChange={setFilter}
      />

      <UserList
        users={filteredUsers}
        onEdit={(user) => {
          setEditingUser(user);
          setIsModalOpen(true);
        }}
        onDelete={handleDeleteUser}
        onStatusChange={handleStatusChange}
      />

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
            handleAddUser(data);
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
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UsersPage;