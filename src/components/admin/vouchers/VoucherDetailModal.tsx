import React from 'react';
import { Modal, Typography, Button } from '@mui/material';
import { Voucher } from '@/types/voucher';

interface VoucherDetailModalProps {
  open: boolean;
  onClose: () => void;
  voucher: Voucher | null;
}

const VoucherDetailModal: React.FC<VoucherDetailModalProps> = ({ open, onClose, voucher }) => {
  if (!voucher) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex items-center justify-center h-full">
        <div className="p-6 bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg font-poppins">
          <Typography variant="h5" className="font-bold mb-4 text-black">
            Chi tiết Voucher
          </Typography>
          <Typography className="mb-2 text-black">Mã Voucher: <span className="font-semibold">{voucher.code}</span></Typography>
          <Typography className="mb-2 text-black">Giá trị: <span className="font-semibold">{voucher.value}</span></Typography>
          <Typography className="mb-2 text-black">Ngày bắt đầu: <span className="font-semibold">{voucher.startDate.toLocaleDateString()}</span></Typography>
          <Typography className="mb-2 text-black">Ngày kết thúc: <span className="font-semibold">{voucher.endDate.toLocaleDateString()}</span></Typography>
          <Typography className="mb-4 text-black">Trạng thái: <span className="font-semibold">{voucher.isActive ? 'Kích hoạt' : 'Không kích hoạt'}</span></Typography>
          <Button onClick={onClose} variant="contained" className="bg-gradient-to-br from-[#2C3E50] to-[#3498DB] hover:to-blue-500 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg">Đóng</Button>
        </div>
      </div>
    </Modal>
  );
};

export default VoucherDetailModal; 