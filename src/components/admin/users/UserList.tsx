import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Avatar,
  Typography,
  Box,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Pagination,
} from '@mui/material';
import {
  Edit,
  Delete,
  MoreVert,
  Block,
  CheckCircle,
} from '@mui/icons-material';
import { User, UserRole, UserStatus } from '@/types/user';
import { formatDate } from '@/utils/format';

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: UserStatus) => void;
}

const ITEMS_PER_PAGE = 10;

const UserList: React.FC<UserListProps> = ({
  users,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const getRoleLabel = (role: UserRole) => {
    const labels: Record<UserRole, string> = {
      [UserRole.ADMIN]: 'Quản trị viên',
      [UserRole.STAFF]: 'Nhân viên',
      [UserRole.CASHIER]: 'Thu ngân',
      [UserRole.WAITER]: 'Phục vụ',
      [UserRole.CUSTOMER]: 'Khách hàng',
    };
    return labels[role];
  };

  const getStatusColor = (status: UserStatus) => {
    const colors: Record<UserStatus, 'success' | 'error' | 'warning' | 'default'> = {
      [UserStatus.ACTIVE]: 'success',
      [UserStatus.INACTIVE]: 'default',
      [UserStatus.BANNED]: 'error',
      [UserStatus.PENDING]: 'warning',
    };
    return colors[status];
  };

  const paginatedUsers = users.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Người dùng</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Đăng nhập cuối</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Box className="flex items-center gap-3">
                    <Avatar src={user.avatar} alt={user.fullName}>
                      {user.fullName.charAt(0)}
                    </Avatar>
                    <div>
                      <Typography variant="subtitle2">{user.fullName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.phone}
                      </Typography>
                    </div>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={getRoleLabel(user.role)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.status}
                    size="small"
                    color={getStatusColor(user.status)}
                  />
                </TableCell>
                <TableCell>
                  {user.lastLogin ? formatDate(user.lastLogin) : 'Chưa đăng nhập'}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, user)}
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box className="mt-4 flex justify-center">
        <Pagination
          count={Math.ceil(users.length / ITEMS_PER_PAGE)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          if (selectedUser) onEdit(selectedUser);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Chỉnh sửa</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedUser) {
            const newStatus = selectedUser.status === UserStatus.ACTIVE
              ? UserStatus.INACTIVE
              : UserStatus.ACTIVE;
            onStatusChange(selectedUser.id, newStatus);
          }
          handleMenuClose();
        }}>
          <ListItemIcon>
            {selectedUser?.status === UserStatus.ACTIVE ? (
              <Block fontSize="small" />
            ) : (
              <CheckCircle fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {selectedUser?.status === UserStatus.ACTIVE
              ? 'Vô hiệu hóa'
              : 'Kích hoạt'}
          </ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedUser) onDelete(selectedUser.id);
            handleMenuClose();
          }}
          className="text-red-600"
        >
          <ListItemIcon>
            <Delete fontSize="small" className="text-red-600" />
          </ListItemIcon>
          <ListItemText>Xóa</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserList;
