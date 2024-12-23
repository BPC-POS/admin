import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Table, CreateTableDTO, TableArea } from '@/types/table';

interface TableModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTableDTO) => void;
  editItem?: Table;
  areas: TableArea[];
  isLoading?: boolean;
}

const initialFormState: CreateTableDTO = {
  name: '',
  capacity: 4,
  area: '',
  isActive: true,
  note: '',
};

const TableModal: React.FC<TableModalProps> = ({
  open,
  onClose,
  onSubmit,
  editItem,
  areas,
  isLoading,
}) => {
  const [formData, setFormData] = useState<CreateTableDTO>(initialFormState);

  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name,
        capacity: editItem.capacity,
        area: editItem.area,
        isActive: editItem.isActive,
        note: editItem.note || '',
      });
    } else {
      setFormData(initialFormState);
    }
  }, [editItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {editItem ? 'Chỉnh sửa bàn' : 'Thêm bàn mới'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên bàn"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Khu vực</InputLabel>
                <Select
                  value={formData.area}
                  label="Khu vực"
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                >
                  {areas.map((area) => (
                    <MenuItem key={area.id} value={area.id}>
                      {area.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Sức chứa"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                required
                inputProps={{ min: 1, max: 20 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ghi chú"
                multiline
                rows={3}
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                }
                label="Kích hoạt"
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

export default TableModal;
