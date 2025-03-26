import React, { useState, useEffect } from 'react'; 
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
import { OrderFilter as OrderFilterType, OrderStatusAPI, PaymentStatus } from '@/types/order';

interface OrderFilterProps {
  filter: OrderFilterType;
  onFilterChange: (filter: OrderFilterType) => void;
}

const OrderFilter: React.FC<OrderFilterProps> = ({
  filter: propFilter, 
  onFilterChange,
}) => {
  const [localFilter, setLocalFilter] = useState<OrderFilterType>(propFilter); 

  useEffect(() => {
    setLocalFilter(propFilter);
  }, [propFilter]);


  const handleReset = () => {
    setLocalFilter({});
    onFilterChange({}); 
  };

  const handleFilterSubmit = () => {
    onFilterChange(localFilter);
  };

  const handleLocalFilterChange = (newFilter: OrderFilterType) => {
    setLocalFilter(newFilter); 
  };


  return (
    <Paper className="p-6 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg ">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm đơn hàng..."
            value={localFilter.search || ''} 
            onChange={(e) => handleLocalFilterChange({ ...localFilter, search: e.target.value })} 
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
              value={localFilter.status || ''}
              label="Trạng thái"
              onChange={(e) => handleLocalFilterChange({
                ...localFilter,
                status: e.target.value ? Number(e.target.value) as OrderStatusAPI : undefined 
              })}
              className="rounded-lg bg-white font-poppins"
            >
              <MenuItem value="" className="font-poppins">Tất cả</MenuItem>
              {Object.values(OrderStatusAPI).map((status) => (
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
              value={localFilter.paymentStatus || ''}
              label="Thanh toán"
              onChange={(e) => handleLocalFilterChange({ ...localFilter, paymentStatus: e.target.value as PaymentStatus })} 
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
            value={localFilter.startDate?.toISOString().split('T')[0] || ''} 
            onChange={(e) => handleLocalFilterChange({ ...localFilter, startDate: e.target.value ? new Date(e.target.value) : undefined })} 
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
            value={localFilter.endDate?.toISOString().split('T')[0] || ''} // Sử dụng localFilter
            onChange={(e) => handleLocalFilterChange({ ...localFilter, endDate: e.target.value ? new Date(e.target.value) : undefined })} 
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
            onClick={handleFilterSubmit} // Gọi handleFilterSubmit khi click Lọc
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