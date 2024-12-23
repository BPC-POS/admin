import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Divider,
} from '@mui/material';
import { Order, OrderStatus, PaymentStatus, PaymentMethod } from '@/types/order';
import { formatCurrency } from '@/utils/format';

interface OrderDetailModalProps {
  open: boolean;
  order: Order | null;
  onClose: () => void;
  onStatusChange: (orderId: number, status: OrderStatus) => void;
  onPaymentStatusChange: (orderId: number, status: PaymentStatus) => void;
}

const statusOptions = [
  { value: OrderStatus.PENDING, label: 'Chờ xác nhận', color: 'warning' },
  { value: OrderStatus.CONFIRMED, label: 'Đã xác nhận', color: 'info' },
  { value: OrderStatus.PREPARING, label: 'Đang pha chế', color: 'primary' },
  { value: OrderStatus.READY, label: 'Sẵn sàng phục vụ', color: 'secondary' },
  { value: OrderStatus.COMPLETED, label: 'Hoàn thành', color: 'success' },
  { value: OrderStatus.CANCELLED, label: 'Đã hủy', color: 'error' },
] as const;

const paymentStatusOptions = [
  { value: PaymentStatus.UNPAID, label: 'Chưa thanh toán', color: 'error' },
  { value: PaymentStatus.PARTIALLY_PAID, label: 'Thanh toán một phần', color: 'warning' },
  { value: PaymentStatus.PAID, label: 'Đã thanh toán', color: 'success' },
  { value: PaymentStatus.REFUNDED, label: 'Đã hoàn tiền', color: 'info' },
] as const;

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  open,
  order,
  onClose,
  onStatusChange,
  onPaymentStatusChange,
}) => {
  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex justify-between items-center">
        <Typography variant="h6">
          Chi tiết đơn hàng #{order.orderNumber}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {new Date(order.createdAt).toLocaleString()}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Thông tin khách hàng
            </Typography>
            <Typography>{order.customerName}</Typography>
            {order.customerPhone && (
              <Typography>{order.customerPhone}</Typography>
            )}
            {order.tableId && (
              <Typography>Bàn số: {order.tableId}</Typography>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Box className="flex flex-col gap-2">
              <div>
                <Typography variant="subtitle2" gutterBottom>
                  Trạng thái đơn hàng
                </Typography>
                <Box className="flex gap-1 flex-wrap">
                  {statusOptions.map((option) => (
                    <Chip
                      key={option.value}
                      label={option.label}
                      color={option.color}
                      variant={order.status === option.value ? 'filled' : 'outlined'}
                      onClick={() => onStatusChange(order.id, option.value)}
                      className="cursor-pointer"
                    />
                  ))}
                </Box>
              </div>

              <div>
                <Typography variant="subtitle2" gutterBottom>
                  Trạng thái thanh toán
                </Typography>
                <Box className="flex gap-1 flex-wrap">
                  {paymentStatusOptions.map((option) => (
                    <Chip
                      key={option.value}
                      label={option.label}
                      color={option.color}
                      variant={order.paymentStatus === option.value ? 'filled' : 'outlined'}
                      onClick={() => onPaymentStatusChange(order.id, option.value)}
                      className="cursor-pointer"
                    />
                  ))}
                </Box>
              </div>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Chi tiết đơn hàng
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sản phẩm</TableCell>
                  <TableCell align="center">Số lượng</TableCell>
                  <TableCell align="right">Đơn giá</TableCell>
                  <TableCell align="right">Thành tiền</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Typography variant="body2">
                        {item.productName}
                      </Typography>
                      {item.note && (
                        <Typography variant="caption" color="text.secondary">
                          Ghi chú: {item.note}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(item.price * item.quantity)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    <Typography variant="subtitle2">Tổng cộng</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle2">
                      {formatCurrency(order.totalAmount)}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>

          {order.note && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Ghi chú
              </Typography>
              <Typography>{order.note}</Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
        <Button variant="contained" onClick={() => window.print()}>
          In đơn hàng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailModal;
