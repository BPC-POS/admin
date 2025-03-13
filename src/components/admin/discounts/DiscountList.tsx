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
  CircularProgress,
} from '@mui/material';
import { Discount } from '@/types/discount';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

interface DiscountListProps {
  discounts: Discount[];
  onEdit: (discount: Discount) => void;
  onDelete: (code: string) => void;
  onViewDetail: (discount: Discount) => void;
  loading: boolean;
}

const DiscountList: React.FC<DiscountListProps> = ({
  discounts,
  onEdit,
  onDelete,
  onViewDetail,
  loading,
}) => {
  return (
    <Box>
      <TableContainer component={Paper} className="font-poppins mb-6 bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-lg">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="font-poppins">Mã Discount</TableCell>
              <TableCell className="font-poppins">Phần trăm giảm giá</TableCell>
              <TableCell className="font-poppins">Ngày bắt đầu</TableCell>
              <TableCell className="font-poppins">Ngày kết thúc</TableCell>
              <TableCell className="font-poppins">Trạng thái</TableCell>
              <TableCell align="right" className="font-poppins">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : discounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không có discounts
                </TableCell>
              </TableRow>
            ) : (
              discounts.map((discount) => (
                <TableRow key={discount.code} className="hover:bg-gray-100 transition-colors">
                  <TableCell>{discount.code}</TableCell>
                  <TableCell>{discount.discount_percentage}%</TableCell>
                  <TableCell>{new Date(discount.start_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(discount.end_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={discount.status ? 'Kích hoạt' : 'Không kích hoạt'}
                      color={discount.status ? 'success' : 'default'}
                      size="small"
                      className="font-poppins"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Sửa">
                      <Button onClick={() => onEdit(discount)} variant="outlined" color="primary" className="mr-2">
                        <EditIcon sx={{ border: 'none' }} />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <Button onClick={() => onDelete(discount.code)} variant="outlined" color="secondary" className="mr-2">
                        <DeleteIcon sx={{ border: 'none' }} />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Chi tiết">
                      <Button onClick={() => onViewDetail(discount)} variant="outlined">
                        <InfoIcon sx={{ border: 'none' }} />
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DiscountList;