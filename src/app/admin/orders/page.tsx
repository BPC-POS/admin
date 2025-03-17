"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
} from '@mui/material';
import OrderList from '@/components/admin/orders/OrderList';
import OrderFilter from '@/components/admin/orders/OrderFilter';
import OrderStats from '@/components/admin/orders/OrderStats';
import OrderDetailModal from '@/components/admin/orders/OrderDetailModal';
import { Order, OrderFilter as OrderFilterType, OrderStatus, PaymentStatus } from '@/types/order';
import mockOrders from '@/mocks/mockOrders';

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<OrderFilterType>({});
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleStatusChange = async (orderId: number, status: OrderStatus) => {
    try {
      // TODO: API call
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, status, updatedAt: new Date() }
            : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handlePaymentStatusChange = async (orderId: number, status: PaymentStatus) => {
    try {
      // TODO: API call
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? { ...order, paymentStatus: status, updatedAt: new Date() }
            : order
        )
      );
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      const matchesSearch = 
        order.orderNumber?.toLowerCase().includes(searchLower) ||
        order.customerName?.toLowerCase().includes(searchLower) ||
        order.customerPhone?.includes(filter.search);
      if (!matchesSearch) return false;
    }

    if (filter.status && order.status !== filter.status) return false;
    if (filter.paymentStatus && order.paymentStatus !== filter.paymentStatus) return false;
    if (filter.tableId && order.tableId !== filter.tableId) return false;

    if (filter.startDate && new Date(order.createdAt) < filter.startDate) return false;
    if (filter.endDate && new Date(order.createdAt) > filter.endDate) return false;

    return true;
  });

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2C3E50] to-[#3498DB] p-6 [font-family:system-ui,Poppins,sans-serif]">
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
          <OrderStats orders={filteredOrders} />
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
            orders={filteredOrders}
            onStatusChange={handleStatusChange}
            onPaymentStatusChange={handlePaymentStatusChange}
            onViewDetail={handleViewDetail}
          />
        </Paper>

        <OrderDetailModal
          open={isDetailModalOpen}
          order={selectedOrder}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedOrder(null);
          }}
          onStatusChange={handleStatusChange}
          onPaymentStatusChange={handlePaymentStatusChange}
        />
      </Container>
    </div>
  );
};

export default OrdersPage;