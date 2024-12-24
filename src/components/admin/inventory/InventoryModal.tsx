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
import { InventoryItem, InventoryCategory, InventoryStatus } from '@/types/inventory';

interface InventoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<InventoryItem>) => void;
  editItem?: InventoryItem;
  isLoading?: boolean;
}

const initialFormState: Partial<InventoryItem> = {
  name: '',
  sku: '',
  category: InventoryCategory.OTHER,
  unit: '',
  quantity: 0,
  minQuantity: 0,
  maxQuantity: 0,
  location: '',
  cost: 0,
  status: InventoryStatus.IN_STOCK,
};

const InventoryModal: React.FC<InventoryModalProps> = ({
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
    
    if (!formData.name) {
      newErrors.name = 'Tên không được để trống';
    }
    if (!formData.sku) {
      newErrors.sku = 'SKU không được để trống';
    }
    if (!formData.unit) {
      newErrors.unit = 'Đơn vị không được để trống';
    }
    if (formData.quantity! < 0) {
      newErrors.quantity = 'Số lượng không được âm';
    }
    if (formData.minQuantity! < 0) {
      newErrors.minQuantity = 'Số lượng tối thiểu không được âm';
    }
    if (formData.maxQuantity! <= formData.minQuantity!) {
      newErrors.maxQuantity = 'Số lượng tối đa phải lớn hơn số lượng tối thiểu';
    }
    if (formData.cost! < 0) {
      newErrors.cost = 'Giá nhập không được âm';
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
          {editItem ? 'Chỉnh sửa vật phẩm' : 'Thêm vật phẩm mới'}
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tên vật phẩm"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SKU"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                error={!!errors.sku}
                helperText={errors.sku}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Danh mục</InputLabel>
                <Select
                  value={formData.category}
                  label="Danh mục"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as InventoryCategory })}
                >
                  {Object.values(InventoryCategory).map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Đơn vị"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                error={!!errors.unit}
                helperText={errors.unit}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Số lượng"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                error={!!errors.quantity}
                helperText={errors.quantity}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Số lượng tối thiểu"
                value={formData.minQuantity}
                onChange={(e) => setFormData({ ...formData, minQuantity: Number(e.target.value) })}
                error={!!errors.minQuantity}
                helperText={errors.minQuantity}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Số lượng tối đa"
                value={formData.maxQuantity}
                onChange={(e) => setFormData({ ...formData, maxQuantity: Number(e.target.value) })}
                error={!!errors.maxQuantity}
                helperText={errors.maxQuantity}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Vị trí"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Giá nhập"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                error={!!errors.cost}
                helperText={errors.cost}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={formData.status}
                  label="Trạng thái"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as InventoryStatus })}
                >
                  {Object.values(InventoryStatus).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Ghi chú"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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

export default InventoryModal; 