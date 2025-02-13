import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Button,
} from '@mui/material';
import { Delete, Add, Remove } from '@mui/icons-material';
import { OrderItem } from '@/types/order';
import { Table as TableType } from '@/types/table';

interface SummaryPOSProps {
  selectedTable: TableType | null;
  orderItems: OrderItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onCheckout: () => void;
  onCancelOrder: () => void;
}

const SummaryPOS: React.FC<SummaryPOSProps> = ({
  selectedTable,
  orderItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onCancelOrder,
}) => {
  const [voucherCode, setVoucherCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  const totalPrice = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const discountedPrice = totalPrice - discountAmount;

  const handleCancelClick = () => {
    onCancelOrder(); 
    setVoucherCode(''); 
    setDiscountAmount(0);
  };
  
  return (
    <Box
      className="bg-white/90 backdrop-blur-lg rounded-xl p-6 shadow-lg h-full flex flex-col"
      style={{ maxWidth: 400 }}
    >
      <Typography variant="h6" gutterBottom className="font-poppins font-semibold">
        Đơn hàng
      </Typography>

      <Typography variant="subtitle2" className="mb-4 font-poppins">
          {selectedTable ? `Bàn được chọn: ${selectedTable.name}` : 'Chưa chọn bàn'}
      </Typography>

      <Typography variant="subtitle1" className="mb-2 font-poppins font-medium">
        Danh sách món:
      </Typography>

      <List style={{ maxHeight: 200, overflowY: 'auto' }}>
        {orderItems.map((item) => (
          <ListItem key={item.productId} className="py-2">
            <ListItemText
              primary={item.productName}
              secondary={`Số lượng: ${item.quantity} x ${item.price.toLocaleString('vi-VN')}đ`}
              className="font-poppins"
            />
            <ListItemSecondaryAction>
              <Box className="flex items-center gap-2">
                <IconButton
                  edge="end"
                  aria-label="remove"
                  onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Remove />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="add"
                  onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                >
                  <Add />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onRemoveItem(item.productId)}
                >
                  <Delete />
                </IconButton>
              </Box>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Box className="mt-4 space-y-2">
        <TextField
          label="Mã giảm giá"
          variant="outlined"
          size="small"
          value={voucherCode}
          onChange={(e) => setVoucherCode(e.target.value)}
          className="font-poppins"
          fullWidth
        />
        <TextField
          label="Giá trị giảm (VNĐ)"
          variant="outlined"
          size="small"
          type="number"
          value={discountAmount.toString()}
          onChange={(e) => setDiscountAmount(Number(e.target.value))}
          className="font-poppins"
          fullWidth
        />
      </Box>

      <Box className="mt-6 space-y-2">
        <Box className="flex justify-between items-center">
          <Typography variant="subtitle1" className="font-poppins font-medium">
            Tổng tiền:
          </Typography>
          <Typography variant="h6" className="font-poppins font-bold text-blue-600">
            {totalPrice.toLocaleString('vi-VN')}đ
          </Typography>
        </Box>
        <Box className="flex justify-between items-center">
          <Typography variant="subtitle1" className="font-poppins font-medium">
            Sau giảm giá:
          </Typography>
          <Typography variant="h6" className="font-poppins font-bold text-green-600">
            {discountedPrice.toLocaleString('vi-VN')}đ
          </Typography>
        </Box>
      </Box>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={onCheckout}
        className="mt-8 font-poppins"
      >
        Thanh toán
      </Button>
      <Button
        variant="contained"
        color="error"
        fullWidth
        onClick={handleCancelClick}
        className="mt-2 font-poppins"
      >
        Hủy
      </Button>
    </Box>
  );
};

export default SummaryPOS;


