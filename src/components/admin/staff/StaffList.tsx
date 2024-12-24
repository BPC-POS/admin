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
    <Box className="">
      <TableContainer component={Paper} className="font-poppins mb-6 bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="font-poppins">Nhân viên</TableCell>
              <TableCell className="font-poppins">Vị trí</TableCell>
              <TableCell className="font-poppins">Bộ phận</TableCell>
              <TableCell className="font-poppins">Ngày vào làm</TableCell>
              <TableCell className="font-poppins">Lương cơ bản</TableCell>
              <TableCell align="right" className="font-poppins">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedStaff.map((staffMember) => (
              <TableRow key={staffMember.id}>
                <TableCell>
                  <Box className="flex items-center gap-3">
                    <Avatar>{staffMember.id}</Avatar>
                    <div>
                      <Typography variant="subtitle2" className="font-poppins">
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
                    className="font-poppins"
                  />
                </TableCell>
                <TableCell className="font-poppins">{getDepartmentLabel(staffMember.department)}</TableCell>
                <TableCell className="font-poppins">{formatDate(staffMember.startDate)}</TableCell>
                <TableCell className="font-poppins">{formatCurrency(staffMember.salary.base)}</TableCell>
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
          className="font-poppins"
        />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
          className="bg-white/80"
      >
        <MenuItem onClick={() => {
          if (selectedStaff) onEdit(selectedStaff);
          handleMenuClose();
        }} className="font-poppins">
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Chỉnh sửa thông tin</ListItemText>
        </MenuItem>
        <MenuItem className="font-poppins">
          <ListItemIcon>
            <Schedule fontSize="small" />
          </ListItemIcon>
          <ListItemText>Xem lịch làm việc</ListItemText>
        </MenuItem>
        <MenuItem className="font-poppins">
          <ListItemIcon>
            <RequestPage fontSize="small" />
          </ListItemIcon>
          <ListItemText>Xem đơn xin nghỉ</ListItemText>
        </MenuItem>
        <MenuItem className="font-poppins">
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