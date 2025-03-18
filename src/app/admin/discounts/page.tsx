'use client';
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import DiscountList from '@/components/admin/discounts/DiscountList';
import DiscountModal from '@/components/admin/discounts/DiscountModal';
import DiscountDetailModal from '@/components/admin/discounts/DiscountDetailModal';
import { Discount, CreateDiscountDTO } from '@/types/discount';
import { getDiscounts, createDiscount, updateDiscount, deleteDiscount } from '@/api/discount';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const DiscountPage = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | undefined>();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const response = await getDiscounts();
      if (response && response.data) {
        setDiscounts(response.data);
      } else {
        setDiscounts([]); 
      }
    } catch (error: unknown) {
      console.error("Lỗi khi fetch discounts:", error);
      const apiError = error as ApiError;
      setSnackbar({ open: true, message: apiError?.response?.data?.message || 'Lỗi khi tải danh sách Discounts.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleAddOrEditDiscount = async (data: CreateDiscountDTO) => {
    setLoading(true);
    try {
      if (editingDiscount) {
        await updateDiscount(editingDiscount.id, {
          ...data,
          discount_percentage: data.discount_percentage ?? null
        });
      } else {
        await createDiscount({
          ...data,
          discount_percentage: data.discount_percentage ?? null
        }); 
      }
      fetchDiscounts();
      setSnackbar({ open: true, message: 'Thao tác thành công!', severity: 'success' });
      setIsModalOpen(false);
      setEditingDiscount(undefined);
    } catch (error: unknown) {
      console.error("Lỗi khi thêm/sửa discount:", error);
      const apiError = error as ApiError;
      setSnackbar({ open: true, message: apiError?.response?.data?.message || 'Có lỗi xảy ra khi thêm/sửa Discount.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDiscount = async (id: number) => {
    setLoading(true);
    try {
      await deleteDiscount(id);
      fetchDiscounts();
      setSnackbar({ open: true, message: 'Xóa discount thành công!', severity: 'success' });
    } catch (error: unknown) {
      console.error("Lỗi khi xóa discount:", error);
      const apiError = error as ApiError;
      setSnackbar({ open: true, message: apiError?.response?.data?.message || 'Có lỗi xảy ra khi xóa Discount.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen p-10 bg-gradient-to-b from-[#2C3E50] to-[#3498DB] font-poppins">
      <Box className="mb-6 bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
        <Typography variant="h4" className="font-bold mb-4 font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-200">Quản lý Discounts</Typography>
        <Button
          variant="contained"
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-br from-[#2C3E50] to-[#3498DB] hover:to-blue-500 text-white font-bold py-2 px-4 rounded-xl font-poppins transition-all duration-300 shadow-md hover:shadow-lg"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Thêm Discount'}
        </Button>
      </Box>
      <Box className="mb-6">
        <DiscountList
          discounts={discounts}
          onEdit={(discount) => {
            setEditingDiscount(discount);
            setIsModalOpen(true);
          }}
          onDelete={handleDeleteDiscount}
          onViewDetail={(discount) => {
            setSelectedDiscount(discount);
            setIsDetailModalOpen(true);
          }}
          loading={loading}
        />
      </Box>
      <DiscountModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddOrEditDiscount}
        editItem={editingDiscount}
      />
      <DiscountDetailModal
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        discount={selectedDiscount}
      />
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DiscountPage;