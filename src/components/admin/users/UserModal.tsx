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
        newErrors.username = 'Tên đăng nhập không được để trống';
      }
      if (!createData.password?.trim()) {
        newErrors.password = 'Mật khẩu không được để trống';
      }
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.fullName?.trim()) {
      newErrors.fullName = 'Họ tên không được để trống';
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
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle className="flex justify-between items-center">
          {editItem ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
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
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Họ tên"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                error={!!errors.fullName}
                helperText={errors.fullName}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Số điện thoại"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Vai trò</InputLabel>
                <Select
                  value={formData.role}
                  label="Vai trò"
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                >
                  <MenuItem value={UserRole.ADMIN}>Quản trị viên</MenuItem>
                  <MenuItem value={UserRole.STAFF}>Nhân viên</MenuItem>
                  <MenuItem value={UserRole.CASHIER}>Thu ngân</MenuItem>
                  <MenuItem value={UserRole.WAITER}>Phục vụ</MenuItem>
                  <MenuItem value={UserRole.CUSTOMER}>Khách hàng</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : editItem ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserModal;
