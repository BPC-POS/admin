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
  TableContainer,
  CircularProgress,
} from '@mui/material';
import { OrderAPI, OrderStatusAPI, PaymentStatus } from '@/types/order';
import { formatCurrency } from '@/utils/format';

interface OrderDetailModalProps {
  open: boolean;
  order: OrderAPI | null;
  onClose: () => void;
  onStatusChange: (orderId: number, status: OrderStatusAPI) => void;
  onPaymentStatusChange: (orderId: number, status: PaymentStatus) => void;
  loadingDetail?: boolean;
}

const statusOptions = [
  { value: OrderStatusAPI.PENDING, label: 'Chờ xác nhận', color: 'warning' },
  { value: OrderStatusAPI.CONFIRMED, label: 'Đã xác nhận', color: 'info' },
  { value: OrderStatusAPI.PREPARING, label: 'Đang pha chế', color: 'primary' },
  { value: OrderStatusAPI.READY, label: 'Sẵn sàng phục vụ', color: 'secondary' },
  { value: OrderStatusAPI.COMPLETED, label: 'Hoàn thành', color: 'success' },
  { value: OrderStatusAPI.CANCELLED, label: 'Đã hủy', color: 'error' },
] as const;

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  open,
  order,
  onClose,
  onStatusChange,
  loadingDetail,
}) => {
  if (!open || !order) return null;
  if (loadingDetail) { 
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
        <DialogContent className="flex justify-center items-center py-24">
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }
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
          Chi tiết đơn hàng #{order.id?.toString() ?? 'N/A'}
        </Typography>
        <Typography variant="caption" className="font-poppins text-gray-600">
          {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
        </Typography>
      </DialogTitle>

      <DialogContent className="px-6 py-4">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" className="font-poppins font-medium text-gray-700 mb-3">
              Thông tin khách hàng
            </Typography>
            <Box className="bg-gray-50 p-4 rounded-lg">
              <Typography className="font-poppins mb-2">User ID: {order.user_id}</Typography>
              {order.meta?.table_id && (
                <Typography className="font-poppins text-gray-600">Bàn số: {String(order.meta.table_id)}</Typography>
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
                      onClick={() => onStatusChange(Number(order.id), option.value)}
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
                  {(order.orderItems ?? []).map((item) => (
                    <TableRow key={item.id?.toString()} className="hover:bg-gray-50">
                      <TableCell className="font-poppins">
                        <Typography variant="body2" className="font-poppins">
                          {item.product?.name ?? 'Unknown Product'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" className="font-poppins">{String(item.quantity)}</TableCell>
                      <TableCell align="right" className="font-poppins">{formatCurrency(Number(item.unit_price))}</TableCell>
                      <TableCell align="right" className="font-poppins">
                        {formatCurrency(Number(item.unit_price) * Number(item.quantity))}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-50">
                    <TableCell colSpan={3} align="right" className="font-poppins font-medium">
                      Tổng cộng
                    </TableCell>
                    <TableCell align="right" className="font-poppins font-semibold text-blue-600">
                      {formatCurrency(Number(order.total_amount))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
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