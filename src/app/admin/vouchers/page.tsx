'use client';
import React, { useState } from 'react';
import { Box, Typography, Button, Snackbar, Alert } from '@mui/material';
import VoucherList from '@/components/admin/vouchers/VoucherList';
import VoucherModal from '@/components/admin/vouchers/VoucherModal';
import VoucherDetailModal from '@/components/admin/vouchers/VoucherDetailModal';
import { CreateVoucherDTO, Voucher } from '@/types/voucher';

// Mock data cho voucher
const mockVouchers: Voucher[] = [
  {
    id: 1,
    code: 'VOUCHER1',
    value: 10000,
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    isActive: true,
  },
  // Thêm các voucher khác
];

const VoucherPage = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>(mockVouchers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | undefined>();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleAddOrEditVoucher = (data: CreateVoucherDTO) => {
    if (editingVoucher) {
      // Cập nhật voucher
      setVouchers((prev) =>
        prev.map((voucher) => (voucher.id === editingVoucher.id ? { ...voucher, ...data } : voucher))
      );
    } else {
      // Thêm voucher mới
      const newVoucher: Voucher = { id: Date.now(), ...data };
      setVouchers((prev) => [...prev, newVoucher]);
    }
    setSnackbar({ open: true, message: 'Thao tác thành công!', severity: 'success' });
    setIsModalOpen(false);
    setEditingVoucher(undefined);
  };

  const handleDeleteVoucher = (id: number) => {
    setVouchers((prev) => prev.filter((voucher) => voucher.id !== id));
    setSnackbar({ open: true, message: 'Xóa voucher thành công!', severity: 'success' });
  };

  return (
    <Box className="min-h-screen p-10 bg-gradient-to-b from-[#2C3E50] to-[#3498DB] font-poppins">
      <Box className="mb-6 bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
      <Typography variant="h4" className="font-bold mb-4 font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-200">Quản lý Voucher</Typography>
      <Button variant="contained" onClick={() => setIsModalOpen(true)} className="bg-gradient-to-br from-[#2C3E50] to-[#3498DB] hover:to-blue-500 text-white font-bold py-2 px-4 rounded-xl font-poppins transition-all duration-300 shadow-md hover:shadow-lg">Thêm Voucher</Button>
      </Box>
      <Box className="mb-6">
        <VoucherList
          vouchers={vouchers}
          onEdit={(voucher) => {
            setEditingVoucher(voucher);
            setIsModalOpen(true);
          }}
          onDelete={handleDeleteVoucher}
          onViewDetail={(voucher) => {
            setSelectedVoucher(voucher);
            setIsDetailModalOpen(true);
          }}
        />
      </Box>
      <VoucherModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddOrEditVoucher}
        editItem={editingVoucher}
      />
      <VoucherDetailModal
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        voucher={selectedVoucher}
      />
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default VoucherPage;
