import React from 'react';
import {
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  InputAdornment,
} from '@mui/material';
import { Search, FilterList, RestartAlt } from '@mui/icons-material';
import { OrderFilter as OrderFilterType, OrderStatus, PaymentStatus } from '@/types/order';

interface OrderFilterProps {
  filter: OrderFilterType;
  onFilterChange: (filter: OrderFilterType) => void;
}

const OrderFilter: React.FC<OrderFilterProps> = ({
  filter,
  onFilterChange,
}) => {
  const handleReset = () => {
    onFilterChange({});
  };

  return (
    <Paper className="p-4">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm đơn hàng..."
            value={filter.search || ''}
            onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={4} md={2}>
          <FormControl fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={filter.status || ''}
              label="Trạng thái"
              onChange={(e) => onFilterChange({ ...filter, status: e.target.value as OrderStatus })}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {Object.values(OrderStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4} md={2}>
          <FormControl fullWidth>
            <InputLabel>Thanh toán</InputLabel>
            <Select
              value={filter.paymentStatus || ''}
              label="Thanh toán"
              onChange={(e) => onFilterChange({ ...filter, paymentStatus: e.target.value as PaymentStatus })}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {Object.values(PaymentStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            type="date"
            label="Từ ngày"
            value={filter.startDate?.toISOString().split('T')[0] || ''}
            onChange={(e) => onFilterChange({ ...filter, startDate: e.target.value ? new Date(e.target.value) : undefined })}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            type="date"
            label="Đến ngày"
            value={filter.endDate?.toISOString().split('T')[0] || ''}
            onChange={(e) => onFilterChange({ ...filter, endDate: e.target.value ? new Date(e.target.value) : undefined })}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} className="flex justify-end gap-2">
          <Button
            variant="outlined"
            startIcon={<RestartAlt />}
            onClick={handleReset}
          >
            Đặt lại
          </Button>
          <Button
            variant="contained"
            startIcon={<FilterList />}
            onClick={() => {/* TODO: Apply filters */}}
          >
            Lọc
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default OrderFilter;
