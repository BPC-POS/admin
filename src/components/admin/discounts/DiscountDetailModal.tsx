import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { Discount } from '@/types/discount';

interface DiscountDetailModalProps {
  open: boolean;
  onClose: () => void;
  discount: Discount | null;
}

const DiscountDetailModal: React.FC<DiscountDetailModalProps> = ({ open, onClose, discount }) => {
  if (!discount) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Chi tiết Discount</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">Mã Discount: {discount.code}</Typography>
        <Typography variant="subtitle1">Phần trăm giảm giá: {discount.discount_percentage}%</Typography>
        <Typography variant="subtitle1">Mô tả: {discount.description}</Typography>
        <Typography variant="subtitle1">Ngày bắt đầu: {new Date(discount.start_date).toLocaleDateString()}</Typography>
        <Typography variant="subtitle1">Ngày kết thúc: {new Date(discount.end_date).toLocaleDateString()}</Typography>
        <Typography variant="subtitle1">Trạng thái: {discount.status ? 'Kích hoạt' : 'Không kích hoạt'}</Typography>
        {/* Thêm các thông tin chi tiết khác nếu cần */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DiscountDetailModal;