import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Select, MenuItem } from '@mui/material';
import { Coupon, CreateCouponDTO, CouponStatus } from '@/types/coupon';

interface CouponModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCouponDTO) => void;
  editItem?: Coupon;
}

// Giá trị enum status
const statusOptions = [
  { value: CouponStatus.ACTIVE, label: 'Kích hoạt' },
  { value: CouponStatus.INACTIVE, label: 'Không kích hoạt' },
];

const CouponModal: React.FC<CouponModalProps> = ({ open, onClose, onSubmit, editItem }) => {
  const [formData, setFormData] = useState<CreateCouponDTO>({
    id: undefined,
    code: '',
    description: '',
    discount_amount: null,
    discount_percentage: null,
    max_usage: undefined,
    start_date: new Date(),
    end_date: new Date(),
    status: CouponStatus.ACTIVE,
  });
  const [discountType, setDiscountType] = useState<'amount' | 'percentage'>('amount');

  useEffect(() => {
    if (editItem) {
      setFormData({
        id: editItem.id,
        code: editItem.code,
        description: editItem.description,
        discount_amount: editItem.discount_amount !== null ? editItem.discount_amount : null,
        discount_percentage: editItem.discount_percentage !== null ? editItem.discount_percentage : null,
        max_usage: editItem.max_usage !== null ? editItem.max_usage : undefined,
        start_date: editItem.start_date ? new Date(editItem.start_date) : new Date(),
        end_date: editItem.end_date ? new Date(editItem.end_date) : new Date(),
        status: editItem.status || CouponStatus.ACTIVE,
      });
      if (editItem.discount_percentage !== null && editItem.discount_percentage !== undefined) {
        setDiscountType('percentage');
      } else {
        setDiscountType('amount');
      }
    } else {
      setFormData({
        id: undefined,
        code: '',
        description: '',
        discount_amount: null,
        discount_percentage: null,
        max_usage: undefined,
        start_date: new Date(),
        end_date: new Date(),
        status: CouponStatus.ACTIVE,
      });
      setDiscountType('amount');
    }
  }, [editItem]);

  const handleChange = <K extends keyof CreateCouponDTO>(key: K, value: CreateCouponDTO[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      discount_amount: formData.discount_amount !== null ? Number(formData.discount_amount) : null,
      discount_percentage: formData.discount_percentage !== null ? Number(formData.discount_percentage) : null,
      max_usage: formData.max_usage !== undefined ? Number(formData.max_usage) : undefined,
      start_date: formData.start_date instanceof Date ? formData.start_date.toISOString() : formData.start_date,
      end_date: formData.end_date instanceof Date ? formData.end_date.toISOString() : formData.end_date,
    };
    onSubmit(submitData as CreateCouponDTO); // Ensure type соответствие
    onClose();
  };

  const handleDiscountTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const type = event.target.value as 'amount' | 'percentage';
    setDiscountType(type);
    if (type === 'amount') {
      setFormData(prevFormData => ({ ...prevFormData, discount_percentage: null }));
    } else {
      setFormData(prevFormData => ({ ...prevFormData, discount_amount: null }));
    }
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
            {editItem ? 'Chỉnh sửa Coupon' : 'Thêm Coupon'}
          </span>
        </DialogTitle>

        <DialogContent dividers className="p-6">
          <TextField
            label="Mã Coupon"
            value={formData.code}
            onChange={(e) => handleChange('code', e.target.value as string)}
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

          <FormControl component="fieldset" className="mb-4 font-poppins">
            <FormLabel component="legend">Loại giảm giá</FormLabel>
            <RadioGroup
              aria-label="discount-type"
              name="discountType"
              value={discountType}
              onChange={handleDiscountTypeChange}
              row
            >
              <FormControlLabel value="amount" control={<Radio />} label="Số tiền" />
              <FormControlLabel value="percentage" control={<Radio />} label="Phần trăm" />
            </RadioGroup>
          </FormControl>

          {discountType === 'amount' && (
            <TextField
              label="Giá trị giảm giá (Số tiền)"
              type="number"
              value={formData.discount_amount !== null ? formData.discount_amount : ''}
              onChange={(e) => handleChange('discount_amount', Number(e.target.value))}
              fullWidth
              className="mb-4 font-poppins"
            />
          )}

          {discountType === 'percentage' && (
            <TextField
              label="Giá trị giảm giá (Phần trăm)"
              type="number"
              value={formData.discount_percentage !== null ? formData.discount_percentage : ''}
              onChange={(e) => handleChange('discount_percentage', Number(e.target.value))}
              fullWidth
              className="mb-4 font-poppins"
            />
          )}

          <TextField
            label="Số lần sử dụng tối đa"
            type="number"
            value={formData.max_usage !== undefined ? formData.max_usage : ''}
            onChange={(e) => handleChange('max_usage', Number(e.target.value))}
            fullWidth
            className="mb-4 font-poppins"
          />

          <TextField
            label="Ngày bắt đầu"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.start_date instanceof Date ? formData.start_date.toISOString().split('T')[0] : ''}
            onChange={(e) => handleChange('start_date', new Date(e.target.value))}
            fullWidth
            required
            className="mb-4 font-poppins"
          />
          <TextField
            label="Ngày kết thúc"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.end_date instanceof Date ? formData.end_date.toISOString().split('T')[0] : ''}
            onChange={(e) => handleChange('end_date', new Date(e.target.value))}
            fullWidth
            required
            className="mb-4 font-poppins"
          />

          {/* Select component for Status */}
          <FormControl fullWidth className="mb-4 font-poppins">
            <FormLabel id="status-label">Trạng thái</FormLabel>
            <Select
              labelId="status-label"
              id="status-select"
              value={formData.status}
              label="Trạng thái"
              onChange={(e) => handleChange('status', e.target.value as CouponStatus)}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

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

export default CouponModal;