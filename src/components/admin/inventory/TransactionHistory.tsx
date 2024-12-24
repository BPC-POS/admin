import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Visibility } from '@mui/icons-material';
import { 
  InventoryItem, 
  InventoryTransaction, 
  TransactionType 
} from '@/types/inventory';
import { formatCurrency, formatDate } from '@/utils/format';

interface TransactionHistoryProps {
  inventory: InventoryItem[];
}

// Mock data
const mockTransactions: InventoryTransaction[] = [
  {
    id: 1,
    itemId: 1,
    type: TransactionType.PURCHASE,
    quantity: 10,
    date: new Date(),
    reason: 'Nhập hàng từ nhà cung cấp',
    performedBy: 1,
    cost: 2800000,
    supplierId: 1,
  },
  // Thêm mock data khác...
];

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ inventory }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [itemFilter, setItemFilter] = useState<number>(0);
  const [selectedTransaction, setSelectedTransaction] = useState<InventoryTransaction | null>(null);

  const getTransactionTypeLabel = (type: TransactionType) => {
    const labels: Record<TransactionType, string> = {
      [TransactionType.PURCHASE]: 'Nhập kho',
      [TransactionType.USAGE]: 'Sử dụng',
      [TransactionType.ADJUSTMENT]: 'Điều chỉnh',
      [TransactionType.WASTE]: 'Hủy bỏ',
      [TransactionType.RETURN]: 'Trả hàng',
    };
    return labels[type];
  };

  const getTransactionTypeColor = (type: TransactionType) => {
    const colors: Record<TransactionType, 'success' | 'error' | 'warning' | 'default'> = {
      [TransactionType.PURCHASE]: 'success',
      [TransactionType.USAGE]: 'error',
      [TransactionType.ADJUSTMENT]: 'warning',
      [TransactionType.WASTE]: 'error',
      [TransactionType.RETURN]: 'default',
    };
    return colors[type];
  };

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesType = !typeFilter || transaction.type === typeFilter;
    const matchesItem = !itemFilter || transaction.itemId === itemFilter;
    const matchesDateRange = (!startDate || new Date(transaction.date) >= startDate) &&
      (!endDate || new Date(transaction.date) <= endDate);
    return matchesType && matchesItem && matchesDateRange;
  });

  return (
    <Box>
      <Box className="mb-4 flex flex-wrap gap-4">
        <DatePicker
          label="Từ ngày"
          value={startDate}
          onChange={(date) => setStartDate(date)}
          slotProps={{ textField: { size: 'small' } }}
        />

        <DatePicker
          label="Đến ngày"
          value={endDate}
          onChange={(date) => setEndDate(date)}
          slotProps={{ textField: { size: 'small' } }}
        />

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Loại giao dịch</InputLabel>
          <Select
            value={typeFilter}
            label="Loại giao dịch"
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {Object.values(TransactionType).map((type) => (
              <MenuItem key={type} value={type}>
                {getTransactionTypeLabel(type)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Vật phẩm</InputLabel>
          <Select
            value={itemFilter}
            label="Vật phẩm"
            onChange={(e) => setItemFilter(Number(e.target.value))}
          >
            <MenuItem value={0}>Tất cả</MenuItem>
            {inventory.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ngày</TableCell>
              <TableCell>Vật phẩm</TableCell>
              <TableCell>Loại giao dịch</TableCell>
              <TableCell align="right">Số lượng</TableCell>
              <TableCell align="right">Đơn giá</TableCell>
              <TableCell>Lý do</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.map((transaction) => {
              const item = inventory.find(i => i.id === transaction.itemId);
              return (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell>{item?.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={getTransactionTypeLabel(transaction.type)}
                      color={getTransactionTypeColor(transaction.type)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    {transaction.quantity} {item?.unit}
                  </TableCell>
                  <TableCell align="right">
                    {transaction.cost ? formatCurrency(transaction.cost) : '-'}
                  </TableCell>
                  <TableCell>{transaction.reason}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => setSelectedTransaction(transaction)}
                    >
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={Boolean(selectedTransaction)}
        onClose={() => setSelectedTransaction(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chi tiết giao dịch</DialogTitle>
        <DialogContent dividers>
          {selectedTransaction && (
            <Box className="space-y-4">
              <Typography>
                <strong>Mã giao dịch:</strong> #{selectedTransaction.id}
              </Typography>
              <Typography>
                <strong>Ngày:</strong> {formatDate(selectedTransaction.date)}
              </Typography>
              <Typography>
                <strong>Loại giao dịch:</strong>{' '}
                {getTransactionTypeLabel(selectedTransaction.type)}
              </Typography>
              <Typography>
                <strong>Số lượng:</strong>{' '}
                {selectedTransaction.quantity} {inventory.find(i => i.id === selectedTransaction.itemId)?.unit}
              </Typography>
              {selectedTransaction.cost && (
                <Typography>
                  <strong>Đơn giá:</strong> {formatCurrency(selectedTransaction.cost)}
                </Typography>
              )}
              <Typography>
                <strong>Lý do:</strong> {selectedTransaction.reason}
              </Typography>
              {selectedTransaction.notes && (
                <Typography>
                  <strong>Ghi chú:</strong> {selectedTransaction.notes}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedTransaction(null)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransactionHistory; 