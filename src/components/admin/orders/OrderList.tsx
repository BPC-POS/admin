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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã đơn</TableCell>
              <TableCell>Khách hàng</TableCell>
              <TableCell align="center">Bàn</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="center">Thanh toán</TableCell>
              <TableCell align="right">Tổng tiền</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedOrders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>
                  <Typography variant="subtitle2">
                    {order.orderNumber}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(order.createdAt).toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">
                    {order.customerName}
                  </Typography>
                  {order.customerPhone && (
                    <Typography variant="caption" color="text.secondary">
                      {order.customerPhone}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="center">
                  {order.tableId || '-'}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={statusLabels[order.status]}
                    color={statusColors[order.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={paymentStatusLabels[order.paymentStatus]}
                    color={paymentStatusColors[order.paymentStatus]}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  {formatCurrency(order.totalAmount)}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Xem chi tiết">
                    <IconButton
                      size="small"
                      onClick={() => onViewDetail(order)}
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="In hóa đơn">
                    <IconButton size="small">
                      <Receipt />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="In chế biến">
                    <IconButton size="small">
                      <LocalPrintshop />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box className="mt-4 flex justify-center">
        <Pagination
          count={Math.ceil(orders.length / ITEMS_PER_PAGE)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default OrderList;
