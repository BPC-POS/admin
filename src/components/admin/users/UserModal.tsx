import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { User, UserRole, CreateUserDTO, UpdateUserDTO } from '@/types/user';

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserDTO | UpdateUserDTO) => void;
  editItem?: User;
  isLoading?: boolean;
}

const initialFormState: CreateUserDTO = {
  username: '',
  email: '',
  password: '',
  fullName: '',
  phone: '',
  role: UserRole.STAFF,
};

const UserModal: React.FC<UserModalProps> = ({
  open,
  onClose,
  onSubmit,
  editItem,
  isLoading,
}) => {
  const [formData, setFormData] = useState<CreateUserDTO | UpdateUserDTO>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editItem) {
      const updateData: UpdateUserDTO = {
        email: editItem.email,
        fullName: editItem.fullName,
        phone: editItem.phone || '',
        role: editItem.role,
      };
      setFormData(updateData);
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
  }, [editItem]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!editItem) {
      const createData = formData as CreateUserDTO;
      if (!createData.username?.trim()) {
        newErrors.username = 'Vui lòng nhập tên đăng nhập';
      }
      if (!createData.password?.trim()) {
        newErrors.password = 'Vui lòng nhập mật khẩu';
      }
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.fullName?.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      className="font-poppins"
      PaperProps={{
        className: "bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg"
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle className="flex justify-between items-center bg-gradient-to-r from-[#2C3E50] to-[#3498DB] text-white p-4 rounded-t-2xl">
          <span className="text-xl font-bold">
            {editItem ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
          </span>
          <IconButton onClick={onClose} size="small" className="text-white hover:text-gray-200">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers className="p-6">
          <Grid container spacing={3}>
            {!editItem && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên đăng nhập"
                  value={(formData as CreateUserDTO).username}
                  onChange={(e) => setFormData({ ...(formData as CreateUserDTO), username: e.target.value })}
                  error={!!errors.username}
                  helperText={errors.username}
                  required
                  className="font-poppins"
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={!!errors.email}
                helperText={errors.email}
                required
                className="font-poppins"
              />
            </Grid>

            {!editItem && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mật khẩu"
                  type="password"
                  value={(formData as CreateUserDTO).password}
                  onChange={(e) => setFormData({ ...(formData as CreateUserDTO), password: e.target.value })}
                  error={!!errors.password}
                  helperText={errors.password}
                  required
                  className="font-poppins"
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Họ và tên"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                error={!!errors.fullName}
                helperText={errors.fullName}
                required
                className="font-poppins"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Số điện thoại"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="font-poppins"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel className="font-poppins">Vai trò</InputLabel>
                <Select
                  value={formData.role}
                  label="Vai trò"
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="font-poppins"
                >
                  <MenuItem value={UserRole.ADMIN} className="font-poppins">Quản trị viên</MenuItem>
                  <MenuItem value={UserRole.STAFF} className="font-poppins">Nhân viên</MenuItem>
                  <MenuItem value={UserRole.CASHIER} className="font-poppins">Thu ngân</MenuItem>
                  <MenuItem value={UserRole.WAITER} className="font-poppins">Phục vụ</MenuItem>
                  <MenuItem value={UserRole.CUSTOMER} className="font-poppins">Khách hàng</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions className="p-4">
          <Button 
            onClick={onClose} 
            className="font-poppins bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-xl"
          >
            Hủy bỏ
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={isLoading}
            className="bg-gradient-to-br from-[#2C3E50] to-[#3498DB] hover:to-blue-500 text-white font-bold py-2 px-6 rounded-xl font-poppins transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {isLoading ? 'Đang xử lý...' : editItem ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserModal;
