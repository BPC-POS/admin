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
import { UserFilter as UserFilterType, UserRole, UserStatus } from '@/types/user';

interface UserFilterProps {
  filter: UserFilterType;
  onFilterChange: (filter: UserFilterType) => void;
}

const UserFilter: React.FC<UserFilterProps> = ({
  filter,
  onFilterChange,
}) => {
  const handleReset = () => {
    onFilterChange({});
  };

  return (
    <Paper className="p-12 font-poppin bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg mb-6 ">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm người dùng"
            value={filter.search || ''}
            onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              className: "font-poppins"
            }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel className="font-poppins">Vai trò</InputLabel>
            <Select
              value={filter.role || ''}
              label="Vai trò"
              onChange={(e) => onFilterChange({ 
                ...filter, 
                role: e.target.value as UserRole || undefined 
              })}
              className="font-poppins"
            >
              <MenuItem value="" className="font-poppins">Tất cả vai trò</MenuItem>
              <MenuItem value={UserRole.ADMIN} className="font-poppins">Quản trị viên</MenuItem>
              <MenuItem value={UserRole.STAFF} className="font-poppins">Nhân viên</MenuItem>
              <MenuItem value={UserRole.CASHIER} className="font-poppins">Thu ngân</MenuItem>
              <MenuItem value={UserRole.WAITER} className="font-poppins">Phục vụ</MenuItem>
              <MenuItem value={UserRole.CUSTOMER} className="font-poppins">Khách hàng</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel className="font-poppins">Trạng thái</InputLabel>
            <Select
              value={filter.status || ''}
              label="Trạng thái"
              onChange={(e) => onFilterChange({ 
                ...filter, 
                status: e.target.value as UserStatus || undefined 
              })}
              className="font-poppins"
            >
              <MenuItem value="" className="font-poppins">Tất cả trạng thái</MenuItem>
              <MenuItem value={UserStatus.ACTIVE} className="font-poppins">Hoạt động</MenuItem>
              <MenuItem value={UserStatus.INACTIVE} className="font-poppins">Không hoạt động</MenuItem>
              <MenuItem value={UserStatus.BANNED} className="font-poppins">Bị cấm</MenuItem>
              <MenuItem value={UserStatus.PENDING} className="font-poppins">Chờ duyệt</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            type="date"
            label="Từ ngày"
            value={filter.startDate?.toISOString().split('T')[0] || ''}
            onChange={(e) => onFilterChange({ 
              ...filter, 
              startDate: e.target.value ? new Date(e.target.value) : undefined 
            })}
            InputLabelProps={{ shrink: true }}
            className="font-poppins"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            type="date"
            label="Đến ngày"
            value={filter.endDate?.toISOString().split('T')[0] || ''}
            onChange={(e) => onFilterChange({ 
              ...filter, 
              endDate: e.target.value ? new Date(e.target.value) : undefined 
            })}
            InputLabelProps={{ shrink: true }}
            className="font-poppins"
          />
        </Grid>

        <Grid item xs={12} className="flex justify-end gap-2">
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

export default UserFilter;
