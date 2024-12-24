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
import { Staff, StaffPosition, Department } from '@/types/staff';

interface StaffModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Staff>) => void;
  editItem?: Staff;
  isLoading?: boolean;
}

const initialFormState: Partial<Staff> = {
  position: StaffPosition.WAITER,
  department: Department.SERVICE,
  salary: {
    base: 0,
    hourly: 0,
    allowance: 0,
  },
  startDate: new Date(),
};

const StaffModal: React.FC<StaffModalProps> = ({
  open,
  onClose,
  onSubmit,
  editItem,
  isLoading,
}) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editItem) {
      setFormData(editItem);
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
  }, [editItem]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.userId) {
      newErrors.userId = 'ID người dùng không được để trống';
    }
    if (!formData.position) {
      newErrors.position = 'Vị trí không được để trống';
    }
    if (!formData.department) {
      newErrors.department = 'Bộ phận không được để trống';
    }
    if (!formData.salary?.base) {
      newErrors.salary = 'Lương cơ bản không được để trống';
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

  const getPositionLabel = (position: StaffPosition) => {
    const labels: Record<StaffPosition, string> = {
      [StaffPosition.MANAGER]: 'Quản lý',
      [StaffPosition.SUPERVISOR]: 'Giám sát',
      [StaffPosition.BARISTA]: 'Pha chế',
      [StaffPosition.WAITER]: 'Phục vụ',
      [StaffPosition.CASHIER]: 'Thu ngân',
    };
    return labels[position];
  };

  const getDepartmentLabel = (department: Department) => {
    const labels: Record<Department, string> = {
      [Department.COFFEE_BAR]: 'Quầy pha chế',
      [Department.KITCHEN]: 'Nhà bếp',
      [Department.SERVICE]: 'Phục vụ',
      [Department.CASHIER]: 'Thu ngân',
    };
    return labels[department];
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className="font-poppins"
      PaperProps={{
        className: "bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg"
      }}
    >
      <form onSubmit={handleSubmit}>
      <DialogTitle className="flex justify-between items-center bg-gradient-to-r from-[#2C3E50] to-[#3498DB] text-white p-4 rounded-t-2xl">
          <span className="text-xl font-bold">
            {editItem ? 'Chỉnh sửa thông tin nhân viên' : 'Thêm nhân viên mới'}
          </span>
          <IconButton onClick={onClose} size="small" className="text-white hover:text-gray-200">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers className="p-6">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ID người dùng"
                type="number"
                value={formData.userId || ''}
                onChange={(e) => setFormData({ ...formData, userId: Number(e.target.value) })}
                error={!!errors.userId}
                helperText={errors.userId}
                required
                className="font-poppins"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.position}>
                <InputLabel className="font-poppins">Vị trí</InputLabel>
                <Select
                  value={formData.position || ''}
                  label="Vị trí"
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    position: e.target.value as StaffPosition 
                  })}
                  className="font-poppins"
                >
                  {Object.values(StaffPosition).map((position) => (
                    <MenuItem key={position} value={position} className="font-poppins">
                      {getPositionLabel(position)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.department}>
                <InputLabel className="font-poppins">Bộ phận</InputLabel>
                <Select
                  value={formData.department || ''}
                  label="Bộ phận"
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    department: e.target.value as Department 
                  })}
                  className="font-poppins"
                >
                  {Object.values(Department).map((dept) => (
                    <MenuItem key={dept} value={dept} className="font-poppins">
                      {getDepartmentLabel(dept)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày vào làm"
                type="date"
                value={formData.startDate?.toISOString().split('T')[0] || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  startDate: new Date(e.target.value) 
                })}
                InputLabelProps={{ shrink: true }}
                required
                className="font-poppins"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Lương cơ bản"
                type="number"
                value={formData.salary?.base || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  salary: { 
                    base: Number(e.target.value),
                    hourly: formData.salary?.hourly || 0,
                    allowance: formData.salary?.allowance || 0
                  } 
                })}
                error={!!errors.salary}
                helperText={errors.salary}
                required
                className="font-poppins"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Lương theo giờ"
                type="number"
                value={formData.salary?.hourly || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  salary: { 
                    base: formData.salary?.base || 0,
                    hourly: Number(e.target.value),
                    allowance: formData.salary?.allowance || 0
                  } 
                })}
                className="font-poppins"
              />
            </Grid> 

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Phụ cấp"
                type="number"
                value={formData.salary?.allowance || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  salary: { 
                    base: formData.salary?.base || 0,
                    hourly: formData.salary?.hourly || 0,
                    allowance: Number(e.target.value)
                  } 
                })}
                className="font-poppins"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions className="p-4">
          <Button 
            onClick={onClose}
            className="font-poppins bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-xl"
            >Hủy</Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={isLoading}
            className="bg-gradient-to-br from-[#2C3E50] to-[#3498DB] hover:to-blue-500 text-white font-bold py-2 px-6 rounded-xl font-poppins transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {isLoading ? 'Đang xử lý...' : editItem ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StaffModal;