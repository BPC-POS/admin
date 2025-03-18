import React from 'react';
import { Staff, StaffStatus } from '@/types/staff';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

interface StaffListProps {
  staff: Staff[];
  onEdit: (staff: Staff) => void;
  onDelete: (staff: Staff) => void;
}

const StaffList: React.FC<StaffListProps> = ({ staff, onEdit, onDelete }) => {

  const getStatusLabel = (status: StaffStatus) => {
    const labels: Record<StaffStatus, string> = {
      [StaffStatus.ACTIVE]: 'Hoạt động',
      [StaffStatus.INACTIVE]: 'Không hoạt động',
    };
    return labels[status];
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Tên</TableCell>
            <TableCell align="left">Email</TableCell>
            <TableCell align="left">Số điện thoại</TableCell>
            <TableCell align="left">Vị trí</TableCell>
            <TableCell align="left">Trạng thái</TableCell>
            <TableCell align="right">Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {staff.map((staffMember) => (
            <TableRow key={staffMember.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">{staffMember.name}</TableCell>
              <TableCell align="left">{staffMember.email}</TableCell>
              <TableCell align="left">{staffMember.phone_number}</TableCell>
              <TableCell align="left">{staffMember.role?.name}</TableCell>
              <TableCell align="left">{staffMember.status ? getStatusLabel(staffMember.status) : 'N/A'}</TableCell>
              <TableCell align="right">
                <IconButton aria-label="edit" onClick={() => onEdit(staffMember)}>
                  <Edit />
                </IconButton>
                <IconButton aria-label="delete" onClick={() => onDelete(staffMember)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StaffList;