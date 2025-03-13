'use client';
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Snackbar, Alert } from '@mui/material';
import CouponList from '@/components/admin/coupons/CouponList';
import CouponModal from '@/components/admin/coupons/CouponModal';
import CouponDetailModal from '@/components/admin/coupons/CouponDetailModal';
import { Coupon, CreateCouponDTO, CouponStatus } from '@/types/coupon';
import { getCoupon, createCoupon, updateCoupon, deleteCoupon } from '@/api/coupon';

const CouponPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | undefined>();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await getCoupon('all');
      setCoupons(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Lỗi khi fetch coupons:", error);
      setSnackbar({ open: true, message: 'Lỗi khi tải danh sách Coupons.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleAddOrEditCoupon = async (data: CreateCouponDTO) => {
    console.log("handleAddOrEditCoupon - Dữ liệu nhận từ Modal (data):", data);
    setLoading(true);
    try {
      if (editingCoupon && editingCoupon.id) {
        const couponData = {
          ...data,
          discount_amount: data.discount_amount ?? null,
          discount_percentage: data.discount_percentage ?? null,
          max_usage: data.max_usage ?? null,
          status: data.status ? CouponStatus.ACTIVE : CouponStatus.INACTIVE 
        };
        console.log("handleAddOrEditCoupon - Dữ liệu trước khi UPDATE API (couponData):", couponData);
        await updateCoupon(editingCoupon.id, couponData);
      } else {
        const couponData = {
          ...data,
          discount_amount: data.discount_amount ?? null,
          discount_percentage: data.discount_percentage ?? null,
          max_usage: data.max_usage ?? null,
          status: data.status ? CouponStatus.ACTIVE : CouponStatus.INACTIVE 
        };
        console.log("handleAddOrEditCoupon - Dữ liệu trước khi CREATE API (couponData):", couponData); 
        await createCoupon(couponData);
      }
      fetchCoupons();
      setSnackbar({ open: true, message: 'Thao tác thành công!', severity: 'success' });
      setIsModalOpen(false);
      setEditingCoupon(undefined);
    } catch (error: any) {
      console.error("Lỗi khi thêm/sửa coupon:", error);
      setSnackbar({ open: true, message: `Lỗi: ${error?.response?.data?.message || 'Có lỗi xảy ra.'}`, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCoupon = async (id: number) => { 
    setLoading(true);
    try {
      await deleteCoupon(id); 
      fetchCoupons();
      setSnackbar({ open: true, message: 'Xóa coupon thành công!', severity: 'success' });
    } catch (error: any) {
      console.error("Lỗi khi xóa coupon:", error);
      setSnackbar({ open: true, message: `Lỗi: ${error?.response?.data?.message || 'Có lỗi xảy ra.'}`, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen p-10 bg-gradient-to-b from-[#2C3E50] to-[#3498DB] font-poppins">
      <Box className="mb-6 bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
        <Typography variant="h4" className="font-bold mb-4 font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-200">Quản lý Coupons</Typography>
        <Button variant="contained" onClick={() => setIsModalOpen(true)} className="bg-gradient-to-br from-[#2C3E50] to-[#3498DB] hover:to-blue-500 text-white font-bold py-2 px-4 rounded-xl font-poppins transition-all duration-300 shadow-md hover:shadow-lg">Thêm Coupon</Button>
      </Box>
      <Box className="mb-6">
        <CouponList
          coupons={coupons}
          onEdit={(couponId) => {
            const couponToEdit = coupons.find(c => c.id === couponId);
            setEditingCoupon(couponToEdit);
            setIsModalOpen(true);
          }}
          onDelete={handleDeleteCoupon}
          onViewDetail={(coupon) => {
            setSelectedCoupon(coupon);
            setIsDetailModalOpen(true);
          }}
          loading={loading}
        />
      </Box>
      <CouponModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddOrEditCoupon}
        editItem={editingCoupon}
      />
      <CouponDetailModal
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        coupon={selectedCoupon}
      />
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CouponPage;