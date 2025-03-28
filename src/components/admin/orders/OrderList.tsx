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
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  Receipt,
  LocalPrintshop,
} from '@mui/icons-material';
import { OrderAPI, OrderStatusAPI, PaymentStatus } from '@/types/order';
import { formatCurrency } from '@/utils/format';
import { getPaymentQRCodeImage } from '@/api/payment';
import InvoiceModal from '@/components/pos/layout/InvoiceModal';

interface OrderListProps {
  orders: OrderAPI[];
  onViewDetail: (order: OrderAPI) => void;
  onStatusChange: (orderId: number, status: OrderStatusAPI) => void;
  onPaymentStatusChange: (orderId: number, status: PaymentStatus) => void;
}

const statusColors = {
  [OrderStatusAPI.PENDING]: 'warning',
  [OrderStatusAPI.CONFIRMED]: 'info',
  [OrderStatusAPI.PREPARING]: 'primary',
  [OrderStatusAPI.READY]: 'secondary',
  [OrderStatusAPI.COMPLETED]: 'success',
  [OrderStatusAPI.CANCELLED]: 'error',
} as const;

const statusLabels = {
  [OrderStatusAPI.PENDING]: 'Chờ xác nhận',
  [OrderStatusAPI.CONFIRMED]: 'Đã xác nhận',
  [OrderStatusAPI.PREPARING]: 'Đang pha chế',
  [OrderStatusAPI.READY]: 'Sẵn sàng phục vụ',
  [OrderStatusAPI.COMPLETED]: 'Hoàn thành',
  [OrderStatusAPI.CANCELLED]: 'Đã hủy',
};

const paymentMethodLabels = {
  1: 'Tiền mặt',
  2: 'Chuyển khoản',
} as const;

const ITEMS_PER_PAGE = 10;

const OrderList: React.FC<OrderListProps> = ({
  orders,
  onViewDetail,
}) => {
  const [page, setPage] = useState(1);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false); 
  const [invoicePdfBlob, setInvoicePdfBlob] = useState<Blob | null>(null);
  const [loadingInvoice, setLoadingInvoice] = useState<boolean>(false); 
  const [currentInvoiceOrderId, setCurrentInvoiceOrderId] = useState<number | null>(null); 

  const paginatedOrders = orders.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrintInvoice = async (order: OrderAPI) => {
    if (!order.id) {
      console.error("Order ID không hợp lệ để in hóa đơn");
      return;
    }
    setLoadingInvoice(true);
    setCurrentInvoiceOrderId(order.id); 
    try {
      const pdfBlob = await getPaymentQRCodeImage(order.id);
      setInvoicePdfBlob(pdfBlob);
      setIsInvoiceModalOpen(true);
    } catch (error) {
      console.error("Lỗi khi tải hóa đơn PDF:", error);
    } finally {
      setLoadingInvoice(false);
      setCurrentInvoiceOrderId(null); 
    }
  };

  const handleCloseInvoiceModal = () => {
    setIsInvoiceModalOpen(false);
    setInvoicePdfBlob(null);
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
                key={order.id?.toString()}
                hover
                className="transition-colors duration-150 hover:bg-blue-50/50"
              >
                <TableCell className="border-b border-blue-100/30">
                  <Typography variant="subtitle2" className="font-poppins font-medium">
                    {order.id?.toString()}
                  </Typography>
                  <Typography variant="caption" className="font-poppins text-gray-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleString() : '-'}
                  </Typography>
                </TableCell>
                <TableCell className="border-b border-blue-100/30">
                  <Typography variant="subtitle2" className="font-poppins font-medium">
                    User ID: {order.user_id} 
                  </Typography>
                </TableCell>
                <TableCell align="center" className="border-b border-blue-100/30 font-poppins">
                  {order.meta?.table_id?.toString() || '-'}
                </TableCell>
                <TableCell align="center" className="border-b border-blue-100/30">
                  <Chip
                    label={statusLabels[order.status]}
                    color={statusColors[order.status]}
                    size="small"
                    className="font-poppins"
                  />
                </TableCell>
                <TableCell align="center" className="border-b border-blue-100/30 font-poppins"> 
                  {paymentMethodLabels[order.meta?.payment_method as keyof typeof paymentMethodLabels] || '-'}
                </TableCell>
                <TableCell align="right" className="border-b border-blue-100/30 font-poppins font-medium">
                  {formatCurrency(Number(order.total_amount))} 
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
                      <IconButton
                        size="small"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => handlePrintInvoice(order)} 
                        disabled={loadingInvoice && currentInvoiceOrderId === order.id} 
                      >
                        {loadingInvoice && currentInvoiceOrderId === order.id ? (
                          <CircularProgress size={24} color="inherit" /> 
                        ) : (
                          <Receipt /> 
                        )}
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
      <InvoiceModal
        open={isInvoiceModalOpen}
        onClose={handleCloseInvoiceModal}
        pdfBlob={invoicePdfBlob}
      />
    </Box>
  );
};

export default OrderList;