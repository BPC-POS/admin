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

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle className="flex justify-between items-center">
          {editItem ? 'Chỉnh sửa thông tin nhân viên' : 'Thêm nhân viên mới'}
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
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
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.position}>
                <InputLabel>Vị trí</InputLabel>
                <Select
                  value={formData.position || ''}
                  label="Vị trí"
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    position: e.target.value as StaffPosition 
                  })}
                >
                  {Object.values(StaffPosition).map((position) => (
                    <MenuItem key={position} value={position}>
                      {position}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.department}>
                <InputLabel>Bộ phận</InputLabel>
                <Select
                  value={formData.department || ''}
                  label="Bộ phận"
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    department: e.target.value as Department 
                  })}
                >
                  {Object.values(Department).map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
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
              />
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

export default StaffModal;
