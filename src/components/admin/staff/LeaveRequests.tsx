import React, { useState } from 'react';
import {
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Pagination,
} from '@mui/material';
import {
  MoreVert,
  Check,
  Close,
} from '@mui/icons-material';
import { Staff, LeaveRequest, LeaveStatus, LeaveType } from '@/types/staff';
import { formatDate } from '@/utils/format';

interface LeaveRequestsProps {
  staff: Staff[];
}

const ITEMS_PER_PAGE = 10;

const LeaveRequests: React.FC<LeaveRequestsProps> = ({ staff }) => {
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewNote, setReviewNote] = useState('');

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, request: LeaveRequest) => {
    setAnchorEl(event.currentTarget);
    setSelectedRequest(request);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRequest(null);
  };

  const handleReviewModalOpen = () => {
    handleMenuClose();
    setIsReviewModalOpen(true);
  };

  const handleReviewModalClose = () => {
    setIsReviewModalOpen(false);
    setReviewNote('');
    setSelectedRequest(null);
  };

  const getLeaveTypeLabel = (type: LeaveType) => {
    const labels: Record<LeaveType, string> = {
      [LeaveType.ANNUAL]: 'Nghỉ phép năm',
      [LeaveType.SICK]: 'Nghỉ ốm',
      [LeaveType.PERSONAL]: 'Việc riêng',
      [LeaveType.OTHER]: 'Khác',
    };
    return labels[type];
  };

  const getStatusColor = (status: LeaveStatus) => {
    const colors: Record<LeaveStatus, 'default' | 'primary' | 'success' | 'error'> = {
      [LeaveStatus.PENDING]: 'primary',
      [LeaveStatus.APPROVED]: 'success',
      [LeaveStatus.REJECTED]: 'error',
      [LeaveStatus.CANCELLED]: 'default',
    };
    return colors[status];
  };

  const getStatusLabel = (status: LeaveStatus) => {
    const labels: Record<LeaveStatus, string> = {
      [LeaveStatus.PENDING]: 'Chờ duyệt',
      [LeaveStatus.APPROVED]: 'Đã duyệt',
      [LeaveStatus.REJECTED]: 'Từ chối',
      [LeaveStatus.CANCELLED]: 'Đã hủy',
    };
    return labels[status];
  };

  // Mock data - replace with actual data from API
  const leaveRequests: LeaveRequest[] = [];
  staff.forEach(member => {
    if (member.leaves) {
      leaveRequests.push(...member.leaves);
    }
  });

  const paginatedRequests = leaveRequests.slice(
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
              <TableCell>Loại nghỉ phép</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Lý do</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <Typography variant="subtitle2">
                    ID: {request.staffId}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getLeaveTypeLabel(request.type)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(request.startDate)} - {formatDate(request.endDate)}
                  </Typography>
                </TableCell>
                <TableCell>{request.reason}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={getStatusLabel(request.status)}
                    color={getStatusColor(request.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, request)}
                    disabled={request.status !== LeaveStatus.PENDING}
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
          count={Math.ceil(leaveRequests.length / ITEMS_PER_PAGE)}
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
        <MenuItem onClick={handleReviewModalOpen}>
          <ListItemIcon>
            <Check fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText>Phê duyệt</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleReviewModalOpen}>
          <ListItemIcon>
            <Close fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Từ chối</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog
        open={isReviewModalOpen}
        onClose={handleReviewModalClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Phê duyệt đơn xin nghỉ
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Ghi chú"
            value={reviewNote}
            onChange={(e) => setReviewNote(e.target.value)}
            className="mt-4"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReviewModalClose}>Hủy</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleReviewModalClose}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeaveRequests;
