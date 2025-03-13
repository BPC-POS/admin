import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Tooltip, Box, Chip, CircularProgress, Typography } from '@mui/material';
import { Coupon } from '@/types/coupon';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

interface CouponListProps { coupons: Coupon[]; onEdit: (id: number) => void; onDelete: (id: number) => void; onViewDetail: (coupon: Coupon) => void; loading: boolean; }

const CouponList: React.FC<CouponListProps> = ({ coupons, onEdit, onDelete, onViewDetail, loading }) => {
  const renderDiscountValue = (coupon: Coupon) => {
    if (coupon.discount_amount != null) return <Typography>{coupon.discount_amount} VNĐ</Typography>;
    else if (coupon.discount_percentage != null) return <Typography>{coupon.discount_percentage}%</Typography>;
    else return <Typography>Không có giảm giá</Typography>;
  };

  const formatDate = (date: string | Date) => {
    const validDate = typeof date === 'string' ? new Date(date) : date;
    return validDate instanceof Date && !isNaN(validDate.getTime()) ? validDate.toLocaleDateString() : 'Invalid Date';
  };

  return (
    <Box>
      <TableContainer component={Paper} className="font-poppins mb-6 bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-lg">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="font-poppins">Mã Coupon</TableCell>
              <TableCell className="font-poppins">Mô tả</TableCell>
              <TableCell className="font-poppins">Giảm giá</TableCell>
              <TableCell className="font-poppins">Số lần sử dụng tối đa</TableCell>
              <TableCell className="font-poppins">Ngày bắt đầu</TableCell>
              <TableCell className="font-poppins">Ngày kết thúc</TableCell>
              <TableCell className="font-poppins">Trạng thái</TableCell>
              <TableCell align="right" className="font-poppins">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (<TableRow><TableCell colSpan={8} align="center"><CircularProgress /></TableCell></TableRow>) : coupons.length === 0 ? (<TableRow><TableCell colSpan={8} align="center">Không có coupons</TableCell></TableRow>) : (
              coupons.map((coupon) => (
                <TableRow key={coupon.id} className="hover:bg-gray-100 transition-colors">
                  <TableCell>{coupon.code}</TableCell>
                  <TableCell>{coupon.description}</TableCell>
                  <TableCell>{renderDiscountValue(coupon)}</TableCell>
                  <TableCell>{coupon.max_usage != null ? coupon.max_usage : 'Không giới hạn'}</TableCell>
                  <TableCell>{formatDate(coupon.start_date)}</TableCell>
                  <TableCell>{formatDate(coupon.end_date)}</TableCell>
                  <TableCell><Chip label={coupon.status ? 'Kích hoạt' : 'Không kích hoạt'} color={coupon.status ? 'success' : 'default'} size="small" className="font-poppins" /></TableCell>
                  <TableCell align="right">
                    <Tooltip title="Sửa"><Button onClick={() => onEdit(coupon.id!)} variant="outlined" color="primary" className="mr-2"><EditIcon sx={{ border: 'none' }} /></Button></Tooltip><Tooltip title="Xóa"><Button onClick={() => onDelete(coupon.id!)} variant="outlined" color="secondary" className="mr-2"><DeleteIcon sx={{ border: 'none' }} /></Button></Tooltip><Tooltip title="Chi tiết"><Button onClick={() => onViewDetail(coupon)} variant="outlined"><InfoIcon sx={{ border: 'none' }} /></Button></Tooltip>
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

export default CouponList;