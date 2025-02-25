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
    <Paper className="p-6 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg ">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm đơn hàng..."
            value={filter.search || ''}
            onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
            className="font-poppins"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="text-gray-500" />
                </InputAdornment>
              ),
              className: "rounded-lg bg-white",
            }}
          />
        </Grid>

        <Grid item xs={12} sm={4} md={2}>
          <FormControl fullWidth>
            <InputLabel className="font-poppins">Trạng thái</InputLabel>
            <Select
              value={filter.status || ''}
              label="Trạng thái"
              onChange={(e) => onFilterChange({ ...filter, status: e.target.value as OrderStatus })}
              className="rounded-lg bg-white font-poppins"
            >
              <MenuItem value="" className="font-poppins">Tất cả</MenuItem>
              {Object.values(OrderStatus).map((status) => (
                <MenuItem key={status} value={status} className="font-poppins">
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4} md={2}>
          <FormControl fullWidth>
            <InputLabel className="font-poppins">Thanh toán</InputLabel>
            <Select
              value={filter.paymentStatus || ''}
              label="Thanh toán"
              onChange={(e) => onFilterChange({ ...filter, paymentStatus: e.target.value as PaymentStatus })}
              className="rounded-lg bg-white font-poppins"
            >
              <MenuItem value="" className="font-poppins">Tất cả</MenuItem>
              {Object.values(PaymentStatus).map((status) => (
                <MenuItem key={status} value={status} className="font-poppins">
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
            className="font-poppins"
            InputProps={{
              className: "rounded-lg bg-white",
            }}
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
            className="font-poppins"
            InputProps={{
              className: "rounded-lg bg-white",
            }}
          />
        </Grid>

        <Grid item xs={12} className="flex justify-end gap-3">
          <Button
            variant="outlined"
            startIcon={<RestartAlt />}
            onClick={handleReset}
            className="bg-gradient-to-br from-[#2C3E50] to-[#3498DB] hover:to-blue-500 text-white font-bold py-2 px-4 rounded-xl font-poppins transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Đặt lại
          </Button>
          <Button
            variant="contained"
            startIcon={<FilterList />}
            onClick={() => {/* TODO: Apply filters */}}
            className="bg-gradient-to-br from-[#2C3E50] to-[#3498DB] hover:to-blue-500 text-white font-bold py-2 px-4 rounded-xl font-poppins transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Lọc
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default OrderFilter;
