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
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { User, CreateUserDTO, UpdateUserDTO, UserStatus } from '@/types/user';

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserDTO | UpdateUserDTO) => void;
  editItem?: User;
  isLoading?: boolean;
}

const initialFormState: CreateUserDTO = {
  email: '',
  password: '',
  name: '',
  phone_number: '',
  gender: 1,
  day_of_birth: '', 
  status: UserStatus.ACTIVE,
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
        name: editItem.name,
        phone_number: editItem.phone_number || '',
        gender: editItem.gender,
        day_of_birth: editItem.day_of_birth,
        status: editItem.status
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
      if (!createData.password?.trim()) {
        newErrors.password = 'Vui lòng nhập mật khẩu';
      }
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.name?.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
    }

    if (!formData.phone_number?.trim()) {
      newErrors.phone_number = 'Vui lòng nhập số điện thoại';
    }

    if (!formData.day_of_birth?.trim()) {
      newErrors.day_of_birth = 'Vui lòng chọn ngày sinh';
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

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, gender: Number(event.target.value) });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      className="font-poppins"
      PaperProps={{
        className: "bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg"
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle className="flex justify-between items-center bg-gradient-to-r from-[#2C3E50] to-[#3498DB] text-white p-4 rounded-t-2xl">
          <span className="text-xl font-bold">
            {editItem ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
          </span>
          <IconButton onClick={onClose} size="small" className="text-white hover:text-gray-200">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers className="p-6">
          <Grid container spacing={3}>


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
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={!!errors.name}
                helperText={errors.name}
                required
                className="font-poppins"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Số điện thoại"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                error={!!errors.phone_number}
                helperText={errors.phone_number}
                required
                className="font-poppins"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="gender"
                  name="gender"
                  value={String(formData.gender)}
                  onChange={handleGenderChange}
                  row
                >
                  <FormControlLabel value="1" control={<Radio />} label="Nam" className="font-poppins" />
                  <FormControlLabel value="2" control={<Radio />} label="Nữ" className="font-poppins" />
                  <FormControlLabel value="3" control={<Radio />} label="Khác" className="font-poppins" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ngày sinh"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.day_of_birth}
                onChange={(e) => setFormData({ ...formData, day_of_birth: e.target.value })}
                error={!!errors.day_of_birth}
                helperText={errors.day_of_birth}
                required
                className="font-poppins"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel className="font-poppins">Trạng thái</InputLabel>
                <Select
                  value={formData.status}
                  label="Trạng thái"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
                  className="font-poppins"
                >
                  <MenuItem value={UserStatus.ACTIVE} className="font-poppins">Hoạt động</MenuItem>
                  <MenuItem value={UserStatus.INACTIVE} className="font-poppins">Không hoạt động</MenuItem>
                  <MenuItem value={UserStatus.PENDING} className="font-poppins">Chờ duyệt</MenuItem>
                  <MenuItem value={UserStatus.BANNED} className="font-poppins">Bị cấm</MenuItem>
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