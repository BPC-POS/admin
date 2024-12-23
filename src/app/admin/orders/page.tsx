"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
} from '@mui/material';
import OrderList from '@/components/admin/orders/OrderList';
import OrderFilter from '@/components/admin/orders/OrderFilter';
import OrderStats from '@/components/admin/orders/OrderStats';
import OrderDetailModal from '@/components/admin/orders/OrderDetailModal';
import { Order, OrderFilter as OrderFilterType, OrderStatus, PaymentStatus } from '@/types/order';

// Mock data
const mockOrders: Order[] = [
  {
    id: 1,
    orderNumber: 'ORD001',
    customerName: 'Nguyễn Văn A',
    customerPhone: '0123456789',
    tableId: 1,
    items: [
      {
        id: 1,
        productId: 1,
        productName: 'Cà phê sữa',
        quantity: 2,
        price: 29000,
        note: 'Ít đường'
      },
      {
        id: 2,
        productId: 2,
        productName: 'Bánh mì',
        quantity: 1,
        price: 15000
      }
    ],
    status: OrderStatus.PENDING,
    paymentStatus: PaymentStatus.UNPAID,
    totalAmount: 73000,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Thêm mock data khác...
];

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
        order.orderNumber.toLowerCase().includes(searchLower) ||
        order.customerName.toLowerCase().includes(searchLower) ||
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
    <div className="p-6">
      <Box className="mb-6">
        <Typography variant="h4" component="h1" className="font-bold mb-4">
          Quản lý đơn hàng
        </Typography>
        <OrderStats orders={filteredOrders} />
      </Box>

      <Paper className="mb-6">
        <OrderFilter
          filter={filter}
          onFilterChange={setFilter}
        />
      </Paper>

      <OrderList
        orders={filteredOrders}
        onStatusChange={handleStatusChange}
        onPaymentStatusChange={handlePaymentStatusChange}
        onViewDetail={handleViewDetail}
      />

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
    </div>
  );
};

export default OrdersPage;