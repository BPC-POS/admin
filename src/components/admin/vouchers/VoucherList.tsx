import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Tooltip,
  Box,
  Chip,
} from '@mui/material';
import { Voucher } from '@/types/voucher';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

interface VoucherListProps {
  vouchers: Voucher[];
  onEdit: (voucher: Voucher) => void;
  onDelete: (id: number) => void;
  onViewDetail: (voucher: Voucher) => void;
}

const VoucherList: React.FC<VoucherListProps> = ({
  vouchers,
  onEdit,
  onDelete,
  onViewDetail,
}) => {
  return (
    <Box>
      <TableContainer component={Paper} className="font-poppins mb-6 bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-lg">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="font-poppins">Mã Voucher</TableCell>
              <TableCell className="font-poppins">Giá trị</TableCell>
              <TableCell className="font-poppins">Ngày bắt đầu</TableCell>
              <TableCell className="font-poppins">Ngày kết thúc</TableCell>
              <TableCell className="font-poppins">Trạng thái</TableCell>
              <TableCell align="right" className="font-poppins">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vouchers.map((voucher) => (
              <TableRow key={voucher.id} className="hover:bg-gray-100 transition-colors">
                <TableCell>{voucher.code}</TableCell>
                <TableCell>{voucher.value}</TableCell>
                <TableCell>{voucher.startDate.toLocaleDateString()}</TableCell>
                <TableCell>{voucher.endDate.toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip
                    label={voucher.isActive ? 'Kích hoạt' : 'Không kích hoạt'}
                    color={voucher.isActive ? 'success' : 'default'}
                    size="small"
                    className="font-poppins"
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Sửa">
                    <Button onClick={() => onEdit(voucher)} variant="outlined" color="primary" className="mr-2">
                      <EditIcon sx={{ border: 'none' }} />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <Button onClick={() => onDelete(voucher.id)} variant="outlined" color="secondary" className="mr-2">
                      <DeleteIcon sx={{ border: 'none' }} />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Chi tiết">
                    <Button onClick={() => onViewDetail(voucher)} variant="outlined">
                      <InfoIcon sx={{ border: 'none' }} />
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default VoucherList; 