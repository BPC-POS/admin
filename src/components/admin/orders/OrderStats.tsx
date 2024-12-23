import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import {
  TrendingUp,
  AccessTime,
  CheckCircle,
  Cancel,
  Payment,
  LocalAtm,
} from '@mui/icons-material';
import { Order, OrderStatus, PaymentStatus } from '@/types/order';
import { formatCurrency } from '@/utils/format';

interface OrderStatsProps {
  orders: Order[];
}

const OrderStats: React.FC<OrderStatsProps> = ({ orders }) => {
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === OrderStatus.PENDING).length,
    preparing: orders.filter(o => o.status === OrderStatus.PREPARING).length,
    completed: orders.filter(o => o.status === OrderStatus.COMPLETED).length,
    cancelled: orders.filter(o => o.status === OrderStatus.CANCELLED).length,
    unpaid: orders.filter(o => o.paymentStatus === PaymentStatus.UNPAID).length,
    totalAmount: orders.reduce((sum, order) => sum + order.totalAmount, 0),
  };

  const statCards = [
    {
      title: 'Tổng đơn hàng',
      value: stats.total,
      icon: <TrendingUp className="text-blue-500" />,
      color: 'bg-blue-50',
    },
    {
      title: 'Chờ xác nhận',
      value: stats.pending,
      icon: <AccessTime className="text-orange-500" />,
      color: 'bg-orange-50',
    },
    {
      title: 'Đang pha chế',
      value: stats.preparing,
      icon: <AccessTime className="text-yellow-500" />,
      color: 'bg-yellow-50',
    },
    {
      title: 'Hoàn thành',
      value: stats.completed,
      icon: <CheckCircle className="text-green-500" />,
      color: 'bg-green-50',
    },
    {
      title: 'Đã hủy',
      value: stats.cancelled,
      icon: <Cancel className="text-red-500" />,
      color: 'bg-red-50',
    },
    {
      title: 'Chưa thanh toán',
      value: stats.unpaid,
      icon: <Payment className="text-purple-500" />,
      color: 'bg-purple-50',
    },
    {
      title: 'Doanh thu',
      value: formatCurrency(stats.totalAmount),
      icon: <LocalAtm className="text-emerald-500" />,
      color: 'bg-emerald-50',
    },
  ];

  return (
    <Grid container spacing={3}>
      {statCards.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper className="p-4">
            <Box className={`flex items-center gap-4 ${stat.color} p-3 rounded-lg mb-3`}>
              {stat.icon}
              <Typography variant="h6" component="div">
                {stat.value}
              </Typography>
            </Box>
            <Typography color="text.secondary" variant="body2">
              {stat.title}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default OrderStats;
