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
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { TableArea, CreateTableAreaDTO } from '@/types/table';

interface TableAreaModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTableAreaDTO) => void;
  editItem?: TableArea;
  isLoading?: boolean;
}

const initialFormState: CreateTableAreaDTO = {
  name: '',
  description: '',
  isActive: true,
};

const TableAreaModal: React.FC<TableAreaModalProps> = ({
  open,
  onClose,
  onSubmit,
  editItem,
  isLoading,
}) => {
  const [formData, setFormData] = useState<CreateTableAreaDTO>(initialFormState);

  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name,
        description: editItem.description || '',
        isActive: editItem.isActive,
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{
          p: 3,
          m: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(0,0,0,0.1)'
        }}>
          <Typography variant="h5" sx={{
            fontWeight: 600,
            fontFamily: 'Poppins, sans-serif',
            color: '#1a1a1a'
          }}>
            {editItem ? 'Chỉnh sửa khu vực' : 'Thêm khu vực mới'}
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: 'rgba(0,0,0,0.5)' }}>
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên khu vực"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{
                p: 2,
                bgcolor: 'rgba(0,0,0,0.02)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Typography sx={{
                  fontFamily: 'Poppins, sans-serif',
                  color: 'rgba(0,0,0,0.7)'
                }}>
                  Trạng thái kích hoạt
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#2196f3',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#2196f3',
                        },
                      }}
                    />
                  }
                  label={formData.isActive ? 'Đang kích hoạt' : 'Đã vô hiệu'}
                  labelPlacement="start"
                  sx={{ m: 0 }}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
          <Button
            onClick={onClose}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontFamily: 'Poppins, sans-serif',
              px: 3
            }}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontFamily: 'Poppins, sans-serif',
              px: 3,
              bgcolor: '#2196f3',
              '&:hover': {
                bgcolor: '#1976d2'
              }
            }}
          >
            {isLoading ? 'Đang xử lý...' : editItem ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TableAreaModal;