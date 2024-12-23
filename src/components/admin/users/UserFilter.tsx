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
    <Paper className="p-4 mb-4">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm người dùng..."
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

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Vai trò</InputLabel>
            <Select
              value={filter.role || ''}
              label="Vai trò"
              onChange={(e) => onFilterChange({ 
                ...filter, 
                role: e.target.value as UserRole || undefined 
              })}
            >
              <MenuItem value="">Tất cả vai trò</MenuItem>
              <MenuItem value={UserRole.ADMIN}>Quản trị viên</MenuItem>
              <MenuItem value={UserRole.STAFF}>Nhân viên</MenuItem>
              <MenuItem value={UserRole.CASHIER}>Thu ngân</MenuItem>
              <MenuItem value={UserRole.WAITER}>Phục vụ</MenuItem>
              <MenuItem value={UserRole.CUSTOMER}>Khách hàng</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={filter.status || ''}
              label="Trạng thái"
              onChange={(e) => onFilterChange({ 
                ...filter, 
                status: e.target.value as UserStatus || undefined 
              })}
            >
              <MenuItem value="">Tất cả trạng thái</MenuItem>
              <MenuItem value={UserStatus.ACTIVE}>Đang hoạt động</MenuItem>
              <MenuItem value={UserStatus.INACTIVE}>Không hoạt động</MenuItem>
              <MenuItem value={UserStatus.BANNED}>Đã khóa</MenuItem>
              <MenuItem value={UserStatus.PENDING}>Chờ xác nhận</MenuItem>
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

export default UserFilter;
