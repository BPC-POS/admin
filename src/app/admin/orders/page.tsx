"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  CircularProgress,
} from '@mui/material';
import OrderList from '@/components/admin/orders/OrderList';
import OrderFilter from '@/components/admin/orders/OrderFilter';
import OrderStats from '@/components/admin/orders/OrderStats';
import OrderDetailModal from '@/components/admin/orders/OrderDetailModal';
import { OrderAPI, OrderFilter as OrderFilterType, OrderStatusAPI, PaymentStatus } from '@/types/order';
import { getOrder, getOrderById } from '@/api/order'; 

const OrdersPage: React.FC= () => {
  const [orders, setOrders] = useState<OrderAPI[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderAPI | null>(null);
  const [filter, setFilter] = useState<OrderFilterType>({});
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);

  const fetchOrdersData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getOrder();
      if (response.status === 200) {
        setOrders(response.data);
        console.log(response.data);
      } else {
        console.error("Lỗi khi tải dữ liệu orders:", response.status);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu orders:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrdersData();
  }, [fetchOrdersData]);

  const handleStatusChange = async (orderId: number, status: OrderStatusAPI) => {
    try {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: status as OrderStatusAPI, updatedAt: new Date().toISOString() } : order
        )
      );
      if (selectedOrder?.id === orderId) { 
        setSelectedOrder(prevSelectedOrder => prevSelectedOrder ? { ...prevSelectedOrder, status: status as OrderStatusAPI, updatedAt: new Date().toISOString() } : null);
      }
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái đơn hàng:', error);
    }
  };

  const handlePaymentStatusChange = async (orderId: number, status: PaymentStatus) => {
    try {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, paymentStatus: status, updatedAt: new Date().toISOString() } : order
        )
      );
      if (selectedOrder?.id === orderId) { 
        setSelectedOrder(prevSelectedOrder => prevSelectedOrder ? { ...prevSelectedOrder, paymentStatus: status, updatedAt: new Date().toISOString() } : null);
      }
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái thanh toán:', error);
    }
  };

  const handleViewDetail = async (order: OrderAPI) => {
    setLoadingDetail(true); 
    try {
      const response = await getOrderById(Number(order.id));
      if (response.status === 200) {
        setSelectedOrder(response.data); 
        setIsDetailModalOpen(true);
      } else {
        console.error("Lỗi khi tải chi tiết đơn hàng:", response.status);
      }
    } catch (error) {
      console.error("Lỗi khi tải chi tiết đơn hàng:", error);
    } finally {
      setLoadingDetail(false); 
    }
  };


  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2C3E50] to-[#3498DB] p-6 font-poppins">
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }} className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
          <Typography
            variant="h4"
            className="font-bold mb-4 font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-100"
            component="h1"
            sx={{
              fontWeight: 600,
              mb: 3,
              color: '#ffffff'
            }}
          >
            Quản lý đơn hàng
          </Typography>
          <OrderStats orders={orders as OrderAPI[]} /> 
        </Box>

        <Paper
          elevation={0}
          sx={{
            mb: 4,
            borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            overflow: 'hidden'
          }}
        >
          <OrderFilter
            filter={filter}
            onFilterChange={setFilter}
          />
        </Paper>

        <Paper
          elevation={0}
          sx={{
            borderRadius: '16px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            overflow: 'hidden'
          }}
        >
          <OrderList
            orders={orders} 
            onStatusChange={handleStatusChange}
            onPaymentStatusChange={handlePaymentStatusChange}
            onViewDetail={handleViewDetail}
          />
        </Paper>

        <OrderDetailModal
          open={isDetailModalOpen}
          order={selectedOrder}
          onClose={handleCloseDetailModal}
          onStatusChange={handleStatusChange}
          onPaymentStatusChange={handlePaymentStatusChange}
          loadingDetail={loadingDetail}
        />
      </Container>
    </div>
  );
};

export default OrdersPage;