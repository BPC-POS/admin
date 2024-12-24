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
      icon: <TrendingUp sx={{ fontSize: 32 }} />,
      color: 'from-blue-500/10 to-blue-500/20',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Chờ xác nhận',
      value: stats.pending,
      icon: <AccessTime sx={{ fontSize: 32 }} />,
      color: 'from-orange-500/10 to-orange-500/20',
      iconColor: 'text-orange-500',
    },
    {
      title: 'Đang pha chế',
      value: stats.preparing,
      icon: <AccessTime sx={{ fontSize: 32 }} />,
      color: 'from-yellow-500/10 to-yellow-500/20',
      iconColor: 'text-yellow-500',
    },
    {
      title: 'Hoàn thành',
      value: stats.completed,
      icon: <CheckCircle sx={{ fontSize: 32 }} />,
      color: 'from-green-500/10 to-green-500/20',
      iconColor: 'text-green-500',
    },
    {
      title: 'Đã hủy',
      value: stats.cancelled,
      icon: <Cancel sx={{ fontSize: 32 }} />,
      color: 'from-red-500/10 to-red-500/20',
      iconColor: 'text-red-500',
    },
    {
      title: 'Chưa thanh toán',
      value: stats.unpaid,
      icon: <Payment sx={{ fontSize: 32 }} />,
      color: 'from-purple-500/10 to-purple-500/20',
      iconColor: 'text-purple-500',
    },
    {
      title: 'Doanh thu',
      value: formatCurrency(stats.totalAmount),
      icon: <LocalAtm sx={{ fontSize: 32 }} />,
      color: 'from-emerald-500/10 to-emerald-500/20',
      iconColor: 'text-emerald-500',
    },
  ];

  return (
    <Grid container spacing={3}>
      {statCards.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper 
            className="p-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            elevation={0}
          >
            <Box className={`flex items-center gap-6 bg-gradient-to-br ${stat.color} p-4 rounded-xl mb-4`}>
              <div className={`${stat.iconColor} bg-white/80 p-2 rounded-lg shadow-sm`}>
                {stat.icon}
              </div>
              <Typography 
                variant="h5" 
                component="div" 
                className="font-poppins font-semibold"
              >
                {stat.value}
              </Typography>
            </Box>
            <Typography 
              color="text.secondary" 
              className="font-poppins text-sm font-medium"
            >
              {stat.title}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default OrderStats;
