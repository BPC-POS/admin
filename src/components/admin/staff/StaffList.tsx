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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Pagination,
} from '@mui/material';
import {
  Edit,
  MoreVert,
  Schedule,
  RequestPage,
  Payments,
} from '@mui/icons-material';
import { Staff, StaffPosition, Department } from '@/types/staff';
import { formatDate, formatCurrency } from '@/utils/format';

interface StaffListProps {
  staff: Staff[];
  onEdit: (staff: Staff) => void;
}

const ITEMS_PER_PAGE = 10;

const StaffList: React.FC<StaffListProps> = ({ staff, onEdit }) => {
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, staffMember: Staff) => {
    setAnchorEl(event.currentTarget);
    setSelectedStaff(staffMember);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStaff(null);
  };

  const getPositionLabel = (position: StaffPosition) => {
    const labels: Record<StaffPosition, string> = {
      [StaffPosition.MANAGER]: 'Quản lý',
      [StaffPosition.SUPERVISOR]: 'Giám sát',
      [StaffPosition.BARISTA]: 'Pha chế',
      [StaffPosition.WAITER]: 'Phục vụ',
      [StaffPosition.CASHIER]: 'Thu ngân',
    };
    return labels[position];
  };

  const getDepartmentLabel = (department: Department) => {
    const labels: Record<Department, string> = {
      [Department.COFFEE_BAR]: 'Quầy pha chế',
      [Department.KITCHEN]: 'Nhà bếp',
      [Department.SERVICE]: 'Phục vụ',
      [Department.CASHIER]: 'Thu ngân',
    };
    return labels[department];
  };

  const paginatedStaff = staff.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nhân viên</TableCell>
              <TableCell>Vị trí</TableCell>
              <TableCell>Bộ phận</TableCell>
              <TableCell>Ngày vào làm</TableCell>
              <TableCell>Lương cơ bản</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedStaff.map((staffMember) => (
              <TableRow key={staffMember.id}>
                <TableCell>
                  <Box className="flex items-center gap-3">
                    <Avatar>{staffMember.id}</Avatar>
                    <div>
                      <Typography variant="subtitle2">
                        ID: {staffMember.userId}
                      </Typography>
                    </div>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getPositionLabel(staffMember.position)}
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{getDepartmentLabel(staffMember.department)}</TableCell>
                <TableCell>{formatDate(staffMember.startDate)}</TableCell>
                <TableCell>{formatCurrency(staffMember.salary.base)}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, staffMember)}
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
          count={Math.ceil(staff.length / ITEMS_PER_PAGE)}
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
          if (selectedStaff) onEdit(selectedStaff);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Chỉnh sửa thông tin</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Schedule fontSize="small" />
          </ListItemIcon>
          <ListItemText>Xem lịch làm việc</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <RequestPage fontSize="small" />
          </ListItemIcon>
          <ListItemText>Xem đơn xin nghỉ</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Payments fontSize="small" />
          </ListItemIcon>
          <ListItemText>Xem bảng lương</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default StaffList;
