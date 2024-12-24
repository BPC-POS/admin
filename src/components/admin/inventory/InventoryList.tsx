import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Edit,
  Delete,
  MoreVert,
  Search,
  Warning,
  Add,
  Remove,
} from '@mui/icons-material';
import { InventoryItem, InventoryCategory, InventoryStatus } from '@/types/inventory';
import { formatCurrency } from '@/utils/format';

interface InventoryListProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
}

const InventoryList: React.FC<InventoryListProps> = ({ items, onEdit }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, item: InventoryItem) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const getCategoryLabel = (category: InventoryCategory) => {
    const labels: Record<InventoryCategory, string> = {
      [InventoryCategory.COFFEE_BEANS]: 'Cà phê',
      [InventoryCategory.MILK]: 'Sữa',
      [InventoryCategory.SYRUP]: 'Syrup',
      [InventoryCategory.TEA]: 'Trà',
      [InventoryCategory.FOOD]: 'Thực phẩm',
      [InventoryCategory.PACKAGING]: 'Bao bì',
      [InventoryCategory.EQUIPMENT]: 'Thiết bị',
      [InventoryCategory.OTHER]: 'Khác',
    };
    return labels[category];
  };

  const getStatusColor = (status: InventoryStatus) => {
    const colors: Record<InventoryStatus, 'default' | 'primary' | 'error' | 'warning'> = {
      [InventoryStatus.IN_STOCK]: 'primary',
      [InventoryStatus.LOW_STOCK]: 'warning',
      [InventoryStatus.OUT_OF_STOCK]: 'error',
      [InventoryStatus.EXPIRED]: 'error',
      [InventoryStatus.DISCONTINUED]: 'default',
    };
    return colors[status];
  };

  const getStatusLabel = (status: InventoryStatus) => {
    const labels: Record<InventoryStatus, string> = {
      [InventoryStatus.IN_STOCK]: 'Còn hàng',
      [InventoryStatus.LOW_STOCK]: 'Sắp hết',
      [InventoryStatus.OUT_OF_STOCK]: 'Hết hàng',
      [InventoryStatus.EXPIRED]: 'Hết hạn',
      [InventoryStatus.DISCONTINUED]: 'Ngừng kinh doanh',
    };
    return labels[status];
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    const matchesStatus = !statusFilter || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <Box>
      <Box className="mb-4 flex flex-wrap gap-4">
        <TextField
          size="small"
          placeholder="Tìm kiếm theo tên hoặc SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Danh mục</InputLabel>
          <Select
            value={categoryFilter}
            label="Danh mục"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {Object.values(InventoryCategory).map((category) => (
              <MenuItem key={category} value={category}>
                {getCategoryLabel(category)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={statusFilter}
            label="Trạng thái"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {Object.values(InventoryStatus).map((status) => (
              <MenuItem key={status} value={status}>
                {getStatusLabel(status)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell align="right">Số lượng</TableCell>
              <TableCell align="right">Giá nhập</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Typography variant="subtitle2">
                    {item.name}
                  </Typography>
                  {item.quantity <= item.minQuantity && (
                    <Typography variant="caption" color="error" className="flex items-center gap-1">
                      <Warning fontSize="small" />
                      Dưới mức tồn kho tối thiểu
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>
                  <Chip
                    label={getCategoryLabel(item.category)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  {item.quantity} {item.unit}
                </TableCell>
                <TableCell align="right">
                  {formatCurrency(item.cost)}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={getStatusLabel(item.status)}
                    color={getStatusColor(item.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, item)}
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          if (selectedItem) onEdit(selectedItem);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Chỉnh sửa</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Add fontSize="small" />
          </ListItemIcon>
          <ListItemText>Nhập kho</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Remove fontSize="small" />
          </ListItemIcon>
          <ListItemText>Xuất kho</ListItemText>
        </MenuItem>
        <MenuItem className="text-red-600">
          <ListItemIcon>
            <Delete fontSize="small" className="text-red-600" />
          </ListItemIcon>
          <ListItemText>Xóa</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default InventoryList; 