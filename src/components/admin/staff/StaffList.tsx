import React from 'react';
import { Staff, StaffStatus } from '@/types/staff';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  styled,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

interface StaffListProps {
  staff: Staff[];
  onEdit: (staff: Staff) => void;
  onDelete: (staff: Staff) => void;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.MuiTableCell-head`]: {
    backgroundColor: '#F3F4F6',
    color: '#374151',
    fontWeight: '600',
    fontSize: '0.875rem',
    padding: theme.spacing(1.5),
    borderBottom: `2px solid ${theme.palette.divider}`,
  },
  [`&.MuiTableCell-body`]: {
    fontSize: '0.875rem',
    padding: theme.spacing(1.5),
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: '#E5E7EB',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    transform: 'translateY(-1px)',
    transition: 'all 0.2s ease-in-out',
  },
}));

const StaffList: React.FC<StaffListProps> = ({ staff, onEdit, onDelete }) => {
  const getStatusLabel = (status: StaffStatus) => {
    const labels: Record<StaffStatus, string> = {
      [StaffStatus.ACTIVE]: 'Hoạt động',
      [StaffStatus.INACTIVE]: 'Không hoạt động',
    };
    return labels[status];
  };

  return (
    <TableContainer component={Paper} className="shadow-md rounded-lg overflow-hidden">
      <Table sx={{ minWidth: 650 }} aria-label="staff table" className="font-poppins">
        <TableHead className="bg-gray-100">
          <TableRow>
            <StyledTableCell className="font-semibold uppercase tracking-wider">Tên</StyledTableCell>
            <StyledTableCell align="left" className="uppercase tracking-wider">Email</StyledTableCell>
            <StyledTableCell align="left" className="uppercase tracking-wider">Số điện thoại</StyledTableCell>
            <StyledTableCell align="left" className="uppercase tracking-wider">Vị trí</StyledTableCell>
            <StyledTableCell align="left" className="uppercase tracking-wider">Trạng thái</StyledTableCell>
            <StyledTableCell align="right" className="uppercase tracking-wider">Hành động</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {staff.map((staffMember) => (
            <StyledTableRow key={staffMember.id}>
              <StyledTableCell component="th" scope="row">{staffMember.name}</StyledTableCell>
              <StyledTableCell align="left">{staffMember.email}</StyledTableCell>
              <StyledTableCell align="left">{staffMember.phone_number}</StyledTableCell>
              <StyledTableCell align="left">{staffMember.role?.name}</StyledTableCell>
              <StyledTableCell align="left">{staffMember.status ? getStatusLabel(staffMember.status) : 'N/A'}</StyledTableCell>
              <StyledTableCell align="right">
                <IconButton aria-label="edit" onClick={() => onEdit(staffMember)} className="hover:bg-blue-100 rounded-full">
                  <Edit className="text-blue-500" />
                </IconButton>
                <IconButton aria-label="delete" onClick={() => onDelete(staffMember)} className="hover:bg-red-100 rounded-full ml-2">
                  <Delete className="text-red-500" />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StaffList;