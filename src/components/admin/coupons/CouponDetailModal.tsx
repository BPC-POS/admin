import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { Coupon } from '@/types/coupon';

interface CouponDetailModalProps {
  open: boolean;
  onClose: () => void;
  coupon: Coupon | null;
}

const CouponDetailModal: React.FC<CouponDetailModalProps> = ({ open, onClose, coupon }) => {
  if (!coupon) return null;

  const renderDiscountDetail = (coupon: Coupon) => {
    if (coupon.discount_amount != null) {
      return <Typography variant="subtitle1">Giá trị giảm giá: {coupon.discount_amount} VNĐ</Typography>; // Replace VNĐ with your currency symbol
    } else if (coupon.discount_percentage != null) {
      return <Typography variant="subtitle1">Phần trăm giảm giá: {coupon.discount_percentage}%</Typography>;
    } else {
      return <Typography variant="subtitle1">Loại giảm giá: Không có giảm giá</Typography>;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="bg-gradient-to-r from-[#2C3E50] to-[#3498DB] text-white p-4 rounded-t-2xl">
        Chi tiết Coupon
      </DialogTitle>
      <DialogContent dividers>
        <Box p={2}>
          <Typography variant="h6" gutterBottom>Thông tin chung</Typography>
          <Typography variant="subtitle1">Mã Coupon: {coupon.code}</Typography>
          <Typography variant="subtitle1">Mô tả: {coupon.description || 'Không có mô tả'}</Typography>
        </Box>

        <Box p={2}>
          <Typography variant="h6" gutterBottom>Chi tiết giảm giá</Typography>
          {renderDiscountDetail(coupon)}
          <Typography variant="subtitle1">
            Số lần sử dụng tối đa: {coupon.max_usage != null ? coupon.max_usage : 'Không giới hạn'}
          </Typography>
        </Box>

        <Box p={2}>
          <Typography variant="h6" gutterBottom>Thời gian và trạng thái</Typography>
          <Typography variant="subtitle1">Ngày bắt đầu: {new Date(coupon.start_date).toLocaleDateString()}</Typography>
          <Typography variant="subtitle1">Ngày kết thúc: {new Date(coupon.end_date).toLocaleDateString()}</Typography>
          <Typography variant="subtitle1">
            Trạng thái: {coupon.status ? 'Kích hoạt' : 'Không kích hoạt'}
          </Typography>
        </Box>

      </DialogContent>
      <DialogActions className="p-4">
        <Button onClick={onClose} className="font-poppins bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-xl">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CouponDetailModal;