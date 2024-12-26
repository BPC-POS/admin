import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { Voucher, CreateVoucherDTO } from '@/types/voucher';

interface VoucherModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateVoucherDTO) => void;
  editItem?: Voucher;
}

const VoucherModal: React.FC<VoucherModalProps> = ({ open, onClose, onSubmit, editItem }) => {
  const [formData, setFormData] = useState<CreateVoucherDTO>({
    code: '',
    value: 0,
    startDate: new Date(),
    endDate: new Date(),
    isActive: true,
  });

  useEffect(() => {
    if (editItem) {
      setFormData({
        code: editItem.code,
        value: editItem.value,
        startDate: editItem.startDate,
        endDate: editItem.endDate,
        isActive: editItem.isActive,
      });
    }
  }, [editItem]);

  const handleChange = (key: keyof CreateVoucherDTO, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      className="font-poppins"
      PaperProps={{
        className: "bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg"
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle className="flex justify-between items-center bg-gradient-to-r from-[#2C3E50] to-[#3498DB] text-white p-4 rounded-t-2xl">
          <span className="text-xl font-bold">
            {editItem ? 'Chỉnh sửa Voucher' : 'Thêm Voucher'}
          </span>
        </DialogTitle>

        <DialogContent dividers className="p-6">
          <TextField
            label="Mã Voucher"
            value={formData.code}
            onChange={(e) => handleChange('code', e.target.value)}
            fullWidth
            required
            className="mb-4 font-poppins"
          />
          <TextField
            label="Giá trị"
            type="number"
            value={formData.value}
            onChange={(e) => handleChange('value', Number(e.target.value))}
            fullWidth
            required
            className="mb-4 font-poppins"
          />
          <TextField
            label="Ngày bắt đầu"
            type="date"
            value={formData.startDate.toISOString().split('T')[0]}
            onChange={(e) => handleChange('startDate', new Date(e.target.value))}
            fullWidth
            required
            className="mb-4 font-poppins"
          />
          <TextField
            label="Ngày kết thúc"
            type="date"
            value={formData.endDate.toISOString().split('T')[0]}
            onChange={(e) => handleChange('endDate', new Date(e.target.value))}
            fullWidth
            required
            className="mb-4 font-poppins"
          />
        </DialogContent>

        <DialogActions className="p-4">
          <Button onClick={onClose} className="font-poppins bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-xl">
            Hủy
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            className="bg-gradient-to-br from-[#2C3E50] to-[#3498DB] hover:to-blue-500 text-white font-bold py-2 px-6 rounded-xl font-poppins transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Lưu
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default VoucherModal; 