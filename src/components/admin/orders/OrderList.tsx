import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Typography,
  Box,
  Tooltip,
  Pagination,
} from '@mui/material';
import {
  Visibility,
  Receipt,
  LocalPrintshop,
} from '@mui/icons-material';
import { Order, OrderStatus, PaymentStatus } from '@/types/order';
import { formatCurrency } from '@/utils//format';

interface OrderListProps {
  orders: Order[];
  onViewDetail: (order: Order) => void;
  onStatusChange: (orderId: number, status: OrderStatus) => void;
  onPaymentStatusChange: (orderId: number, status: PaymentStatus) => void;
}

const statusColors = {
  [OrderStatus.PENDING]: 'warning',
  [OrderStatus.CONFIRMED]: 'info',
  [OrderStatus.PREPARING]: 'primary',
  [OrderStatus.READY]: 'secondary',
  [OrderStatus.COMPLETED]: 'success',
  [OrderStatus.CANCELLED]: 'error',
} as const;

const statusLabels = {
  [OrderStatus.PENDING]: 'Chờ xác nhận',
  [OrderStatus.CONFIRMED]: 'Đã xác nhận',
  [OrderStatus.PREPARING]: 'Đang pha chế',
  [OrderStatus.READY]: 'Sẵn sàng phục vụ',
  [OrderStatus.COMPLETED]: 'Hoàn thành',
  [OrderStatus.CANCELLED]: 'Đã hủy',
};

const paymentStatusColors = {
  [PaymentStatus.UNPAID]: 'error',
  [PaymentStatus.PARTIALLY_PAID]: 'warning',
  [PaymentStatus.PAID]: 'success',
  [PaymentStatus.REFUNDED]: 'info',
} as const;

const paymentStatusLabels = {
  [PaymentStatus.UNPAID]: 'Chưa thanh toán',
  [PaymentStatus.PARTIALLY_PAID]: 'Thanh toán một phần',
  [PaymentStatus.PAID]: 'Đã thanh toán',
  [PaymentStatus.REFUNDED]: 'Đã hoàn tiền',
};

const ITEMS_PER_PAGE = 10;

const OrderList: React.FC<OrderListProps> = ({
  orders,
  onViewDetail,
  onStatusChange,
  onPaymentStatusChange,
}) => {
  const [page, setPage] = useState(1);

  const paginatedOrders = orders.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box>
      <TableContainer component={Paper} className="rounded-xl overflow-hidden shadow-lg bg-white/90 backdrop-blur-sm">
        <Table>
          <TableHead>
            <TableRow className="bg-gradient-to-r from-blue-100 to-blue-50">
              <TableCell className="font-poppins font-semibold">Mã đơn</TableCell>
              <TableCell className="font-poppins font-semibold">Khách hàng</TableCell>
              <TableCell align="center" className="font-poppins font-semibold">Bàn</TableCell>
              <TableCell align="center" className="font-poppins font-semibold">Trạng thái</TableCell>
              <TableCell align="center" className="font-poppins font-semibold">Thanh toán</TableCell>
              <TableCell align="right" className="font-poppins font-semibold">Tổng tiền</TableCell>
              <TableCell align="center" className="font-poppins font-semibold">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedOrders.map((order) => (
              <TableRow 
                key={order.id} 
                hover 
                className="transition-colors duration-150 hover:bg-blue-50/50"
              >
                <TableCell className="border-b border-blue-100/30">
                  <Typography variant="subtitle2" className="font-poppins font-medium">
                    {order.orderNumber}
                  </Typography>
                  <Typography variant="caption" className="font-poppins text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell className="border-b border-blue-100/30">
                  <Typography variant="subtitle2" className="font-poppins font-medium">
                    {order.customerName}
                  </Typography>
                  {order.customerPhone && (
                    <Typography variant="caption" className="font-poppins text-gray-500">
                      {order.customerPhone}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="center" className="border-b border-blue-100/30 font-poppins">
                  {order.tableId || '-'}
                </TableCell>
                <TableCell align="center" className="border-b border-blue-100/30">
                  <Chip
                    label={statusLabels[order.status]}
                    color={statusColors[order.status]}
                    size="small"
                    className="font-poppins"
                  />
                </TableCell>
                <TableCell align="center" className="border-b border-blue-100/30">
                  <Chip
                    label={paymentStatusLabels[order.paymentStatus]}
                    color={paymentStatusColors[order.paymentStatus]}
                    size="small"
                    className="font-poppins"
                  />
                </TableCell>
                <TableCell align="right" className="border-b border-blue-100/30 font-poppins font-medium">
                  {formatCurrency(order.totalAmount)}
                </TableCell>
                <TableCell align="center" className="border-b border-blue-100/30">
                  <Box className="flex justify-center gap-1">
                    <Tooltip title="Xem chi tiết">
                      <IconButton
                        size="small"
                        onClick={() => onViewDetail(order)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="In hóa đơn">
                      <IconButton size="small" className="text-green-600 hover:bg-green-50">
                        <Receipt />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="In chế biến">
                      <IconButton size="small" className="text-purple-600 hover:bg-purple-50">
                        <LocalPrintshop />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box className="mt-6 flex justify-center">
        <Pagination
          count={Math.ceil(orders.length / ITEMS_PER_PAGE)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          className="font-poppins"
          size="large"
        />
      </Box>
    </Box>
  );
};

export default OrderList;
