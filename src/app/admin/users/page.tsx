"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import UserList from '@/components/admin/users/UserList';
import UserModal from '@/components/admin/users/UserModal';
import UserFilter from '@/components/admin/users/UserFilter';
import { User, UserStatus, UserRole, UserFilter as UserFilterType } from '@/types/user'; // Import UserRole
import { getMembers, createMember, getMemberById, updateMember, deleteMember } from '@/api/member';

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const [filter, setFilter] = useState<UserFilterType>({});
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const response = await getMembers();
        const mappedUsers: User[] = response.data.map(member => ({
          id: member.id || 0,
          name: member.name,
          email: member.email,
          phone_number: member.phone_number,
          status: Number(member.status),
          createdAt: member.createdAt?.toString() || '',
          updatedAt: member.updatedAt?.toString() || '',
          gender: Number(member.gender) || 0,
          day_of_birth: member.day_of_birth,
          password: member.password,
          avatar: member.avatar || '',
          token: member.token || '',
          first_login: member.first_login || false,
          meta: member.meta || {}
        }));
        setUsers(mappedUsers);
      } catch (error: any) {
        console.error("Error fetching members:", error);
        setSnackbar({
          open: true,
          message: 'Không thể tải dữ liệu người dùng. Vui lòng thử lại sau.',
          severity: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleAddUser = async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      const memberData = {
        ...data,
        status: Number(data.status),
        gender: Number(data.gender),
      };
      console.log("Creating new member:", memberData);
      const response = await createMember(memberData);
      const member = response.data;
      const newUser: User = {
        id: member.id || 0,
        name: member.name,
        email: member.email,
        phone_number: member.phone_number,
        status: Number(member.status),
        createdAt: member.createdAt?.toString() || '',
        updatedAt: member.updatedAt?.toString() || '',
        gender: Number(member.gender),
        day_of_birth: member.day_of_birth,
        password: member.password,
      };
      setUsers(prev => [...prev, newUser]);
      setIsModalOpen(false);
      setSnackbar({
        open: true,
        message: 'Thêm người dùng thành công',
        severity: 'success',
      });
    } catch (error: any) {
      console.error("Error creating member:", error);
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
      const memberData = {
        name: data.name || '',
        email: data.email || '',
        phone_number: data.phone_number || '',
        status: Number(data.status) || 0,
        gender: Number(data.gender) || 0,
        day_of_birth: data.day_of_birth || '',
        ...(data.password && { password: data.password }),
      };
      const response = await updateMember(id, memberData); // Call API updateMember
      const updatedUser = response.data; // Get the updated user data from the API response
      const mappedUser: User = {
        id: response.data.id || 0,
        name: response.data.name,
        email: response.data.email,
        phone_number: response.data.phone_number,
        status: Number(response.data.status),
        createdAt: response.data.createdAt?.toString() || '',
        updatedAt: response.data.updatedAt?.toString() || '',
        gender: Number(response.data.gender) || 0,
        day_of_birth: response.data.day_of_birth,
        password: response.data.password,
      };
      setUsers(prev =>
        prev.map(user =>
          user.id === id ? mappedUser : user
        )
      );

      setIsModalOpen(false);
      setEditingUser(undefined);
      setSnackbar({
        open: true,
        message: 'Cập nhật người dùng thành công',
        severity: 'success',
      });
    } catch (error: any) {
      console.error("Error updating user:", error);
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
      await deleteMember(id); // Call API deleteMember with the user ID
      setUsers(prev => prev.filter(user => user.id !== id)); // Update UI by filtering out the deleted user (optional, can be removed if re-fetching data)
      setSnackbar({
        open: true,
        message: 'Xóa người dùng thành công',
        severity: 'success',
      });
    } catch (error: any) {
      console.error("Error deleting user:", error);
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
      // TODO: Call API updateMember status
      // const response = await updateMemberStatus(id, status);
      // const updatedUser = response.data;
      // setUsers(prev =>
      //   prev.map(user =>
      //     user.id === id ? updatedUser : user
      //   )
      // );

      // Mock update status - Remove when API is implemented
      setUsers(prev =>
        prev.map(user =>
          user.id === id
            ? { ...user, status: status, updatedAt: new Date().toISOString() }
            : user
        )
      );
      setSnackbar({
        open: true,
        message: 'Cập nhật trạng thái thành công',
        severity: 'success',
      });
    } catch (error: any) {
      console.error("Error updating status:", error);
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
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.phone_number?.includes(filter.search);
      if (!found) return false;
    }

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
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <UserList
            users={filteredUsers}
            onEdit={(user) => {
              setEditingUser(user);
              setIsModalOpen(true);
            }}
            onDelete={handleDeleteUser}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>

      <UserModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(undefined);
        }}
        onSubmit={(data) => {
          if (editingUser) {
            handleEditUser(editingUser.id, {
              ...data
            });
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