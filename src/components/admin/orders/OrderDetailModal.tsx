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
  TableContainer,
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
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        className: "rounded-xl shadow-2xl"
      }}
    >
      <DialogTitle className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
        <Typography variant="h6" className="font-poppins font-semibold text-gray-800">
          Chi tiết đơn hàng #{order.orderNumber}
        </Typography>
        <Typography variant="caption" className="font-poppins text-gray-600">
          {new Date(order.createdAt).toLocaleString()}
        </Typography>
      </DialogTitle>

      <DialogContent className="px-6 py-4">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="font-poppins font-medium text-gray-700 mb-3">
              Thông tin khách hàng
            </Typography>
            <Box className="bg-gray-50 p-4 rounded-lg">
              <Typography className="font-poppins mb-2">{order.customerName}</Typography>
              {order.customerPhone && (
                <Typography className="font-poppins mb-2 text-gray-600">{order.customerPhone}</Typography>
              )}
              {order.tableId && (
                <Typography className="font-poppins text-gray-600">Bàn số: {order.tableId}</Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box className="flex flex-col gap-4">
              <div>
                <Typography variant="subtitle2" className="font-poppins font-medium text-gray-700 mb-3">
                  Trạng thái đơn hàng
                </Typography>
                <Box className="flex gap-2 flex-wrap">
                  {statusOptions.map((option) => (
                    <Chip
                      key={option.value}
                      label={option.label}
                      color={option.color}
                      variant={order.status === option.value ? 'filled' : 'outlined'}
                      onClick={() => onStatusChange(order.id, option.value)}
                      className="font-poppins cursor-pointer transition-all hover:shadow-md"
                    />
                  ))}
                </Box>
              </div>

              <div>
                <Typography variant="subtitle2" className="font-poppins font-medium text-gray-700 mb-3">
                  Trạng thái thanh toán
                </Typography>
                <Box className="flex gap-2 flex-wrap">
                  {paymentStatusOptions.map((option) => (
                    <Chip
                      key={option.value}
                      label={option.label}
                      color={option.color}
                      variant={order.paymentStatus === option.value ? 'filled' : 'outlined'}
                      onClick={() => onPaymentStatusChange(order.id, option.value)}
                      className="font-poppins cursor-pointer transition-all hover:shadow-md"
                    />
                  ))}
                </Box>
              </div>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" className="font-poppins font-medium text-gray-700 mb-3">
              Chi tiết đơn hàng
            </Typography>
            <TableContainer className="bg-white rounded-xl shadow-sm">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="font-poppins font-medium">Sản phẩm</TableCell>
                    <TableCell align="center" className="font-poppins font-medium">Số lượng</TableCell>
                    <TableCell align="right" className="font-poppins font-medium">Đơn giá</TableCell>
                    <TableCell align="right" className="font-poppins font-medium">Thành tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="font-poppins">
                        <Typography variant="body2" className="font-poppins">
                          {item.productName}
                        </Typography>
                        {item.note && (
                          <Typography variant="caption" className="font-poppins text-gray-500">
                            Ghi chú: {item.note}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center" className="font-poppins">{item.quantity}</TableCell>
                      <TableCell align="right" className="font-poppins">{formatCurrency(item.price)}</TableCell>
                      <TableCell align="right" className="font-poppins">
                        {formatCurrency(item.price * item.quantity)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-50">
                    <TableCell colSpan={3} align="right" className="font-poppins font-medium">
                      Tổng cộng
                    </TableCell>
                    <TableCell align="right" className="font-poppins font-semibold text-blue-600">
                      {formatCurrency(order.totalAmount)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {order.note && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" className="font-poppins font-medium text-gray-700 mb-2">
                Ghi chú
              </Typography>
              <Box className="bg-yellow-50 p-4 rounded-lg">
                <Typography className="font-poppins text-gray-700">{order.note}</Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions className="bg-gray-50 px-6 py-4">
        <Button 
          onClick={onClose}
          className="font-poppins text-gray-600 hover:bg-gray-100"
        >
          Đóng
        </Button>
        <Button 
          variant="contained" 
          onClick={() => window.print()}
          className="font-poppins bg-blue-600 hover:bg-blue-700"
        >
          In đơn hàng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailModal;
