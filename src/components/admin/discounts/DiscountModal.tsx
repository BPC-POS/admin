import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { Discount, CreateDiscountDTO, DiscountStatus } from '@/types/discount';

interface DiscountModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDiscountDTO) => void;
  editItem?: Discount;
}

const DiscountModal: React.FC<DiscountModalProps> = ({ open, onClose, onSubmit, editItem }) => {
  const [formData, setFormData] = useState<CreateDiscountDTO>({
    id: 0,
    code: '',
    discount_percentage: 0,
    start_date: new Date(),
    end_date: new Date(),
    status: DiscountStatus.ACTIVE,
    description: '', 
  });

  useEffect(() => {
    if (editItem) {
      setFormData({
        id: editItem.id,
        code: editItem.code,
        discount_percentage: editItem.discount_percentage,
        start_date: editItem.start_date ? new Date(editItem.start_date) : new Date(),
        end_date: editItem.end_date ? new Date(editItem.end_date) : new Date(),
        status: editItem.status,
        description: editItem.description, 
      });
    }
  }, [editItem]);

  const handleChange = <K extends keyof CreateDiscountDTO>(key: K, value: CreateDiscountDTO[K]) => {
    setFormData((prev) => {
      if (key === 'discount_percentage') {
        console.log('discount_percentage changed to:', value); 
      }
      return ({ ...prev, [key]: value });
    });
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
            {editItem ? 'Chỉnh sửa Discount' : 'Thêm Discount'}
          </span>
        </DialogTitle>

        <DialogContent dividers className="p-6">
          <TextField
            label="Mã Discount"
            value={formData.code}
            onChange={(e) => handleChange('code', e.target.value as string)}
            fullWidth
            required
            className="mb-4 font-poppins"
          />
          <TextField
            label="Phần trăm giảm giá"
            type="number"
            value={formData.discount_percentage}
            onChange={(e) => handleChange('discount_percentage', Number(e.target.value))}
            fullWidth
            required
            className="mb-4 font-poppins"
          />
           <TextField
            label="Mô tả"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value as string)}
            fullWidth
            multiline
            rows={2}
            className="mb-4 font-poppins"
          />
          <TextField
            label="Ngày bắt đầu"
            type="date"
            value={formData.start_date.toISOString().split('T')[0]}
            onChange={(e) => handleChange('start_date', new Date(e.target.value))}
            fullWidth
            required
            className="mb-4 font-poppins"
          />
          <TextField
            label="Ngày kết thúc"
            type="date"
            value={formData.end_date.toISOString().split('T')[0]}
            onChange={(e) => handleChange('end_date', new Date(e.target.value))}
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

export default DiscountModal;