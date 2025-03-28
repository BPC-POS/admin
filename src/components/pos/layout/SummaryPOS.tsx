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
  Menu,
  MenuItem,
} from '@mui/material';
import { Delete, Add, Remove } from '@mui/icons-material';
import { OrderItemAPI } from '@/types/order';
import { Table as TableType } from '@/types/table';

interface SummaryPOSProps {
  selectedTable: TableType | null;
  orderItems: OrderItemAPI[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onCheckoutOrder: (paymentMethod: 'cash' | 'transfer', taxAmount: number, shippingAddress: string) => void;
  onCancelOrder: () => void;
}

const SummaryPOS: React.FC<SummaryPOSProps> = ({
  selectedTable,
  orderItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckoutOrder,
  onCancelOrder,
}) => {
  const [voucherCode, setVoucherCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openPaymentMenu = Boolean(anchorEl);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [shippingAddress, setShippingAddress] = useState<string>('');

  const totalPrice = orderItems.reduce((total, item) => total + Number(item.unit_price) * Number(item.quantity), 0);
  const discountedPrice = totalPrice - discountAmount;
  const priceWithTax = discountedPrice + taxAmount;

  const handleCancelClick = () => {
    onCancelOrder();
    setVoucherCode('');
    setDiscountAmount(0);
    setTaxAmount(0);
    setShippingAddress('');
  };

  const handlePaymentButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePaymentMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSelectPaymentMethod = (method: 'cash' | 'transfer') => {
    onCheckoutOrder(method, taxAmount, shippingAddress);
    handlePaymentMenuClose();
  };

  return (
    <Box
      className="bg-white/90 backdrop-blur-lg rounded-xl p-6 shadow-lg h-full flex flex-col max-w-md"
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

      <List className="max-h-52 overflow-y-auto">
        {orderItems.map((item, index) => (
          <ListItem key={item.product_id?.toString() || `no-product-id-item-${index}`} className="py-2">
            <ListItemText
              primary={`  ${item.product_name}`}
              secondary={`Số lượng: ${item.quantity} x ${Number(item.unit_price).toLocaleString('vi-VN')}đ`}
              className="font-poppins"
            />
            <ListItemSecondaryAction>
              <Box className="flex items-center gap-2">
                <IconButton
                  edge="end"
                  aria-label="remove"
                  onClick={() => onUpdateQuantity(Number(item.product_id), -1)}
                  disabled={Number(item.quantity) <= 1}
                >
                  <Remove />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="add"
                  onClick={() => onUpdateQuantity(Number(item.product_id), 1)}
                >
                  <Add />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onRemoveItem(Number(item.product_id))}
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
         <TextField
          label="Thuế (VNĐ)"
          variant="outlined"
          size="small"
          type="number"
          value={taxAmount.toString()}
          onChange={(e) => setTaxAmount(Number(e.target.value))}
          className="font-poppins"
          fullWidth
        />
        <TextField
          label="Địa chỉ giao hàng"
          variant="outlined"
          size="small"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          className="font-poppins"
          fullWidth
          multiline
          rows={2}
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
        <Box className="flex justify-between items-center">
          <Typography variant="subtitle1" className="font-poppins font-medium">
            Tổng tiền sau thuế:
          </Typography>
          <Typography variant="h6" className="font-poppins font-bold text-indigo-600">
            {priceWithTax.toLocaleString('vi-VN')}đ
          </Typography>
        </Box>
      </Box>


      <Box mt={8} display="flex" flexDirection="column" gap={2}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handlePaymentButtonClick}
          className="font-poppins bg-gradient-to-r from-gray-700 to-blue-500 hover:from-gray-600 hover:to-blue-400 text-white font-bold"
        >
          Thanh toán
        </Button>
        <Menu
          id="payment-menu"
          anchorEl={anchorEl}
          open={openPaymentMenu}
          onClose={handlePaymentMenuClose}
          MenuListProps={{
            'aria-labelledby': 'payment-button',
          }}
        >
          <MenuItem 
            onClick={() => handleSelectPaymentMethod('cash')} 
            className="font-poppins"
            style={{
              background: 'linear-gradient(to right, #27ae60, #2ecc71)', 
              color: 'white', 
              borderRadius: '8px', 
              margin: '4px', 
              textAlign: 'center',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Tiền mặt
          </MenuItem>

          <MenuItem 
            onClick={() => handleSelectPaymentMethod('transfer')} 
            className="font-poppins"
            style={{
              background: 'linear-gradient(to right, #8e44ad, #9b59b6)', 
              color: 'white', 
              borderRadius: '8px', 
              margin: '4px', 
              textAlign: 'center',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Chuyển khoản
          </MenuItem>
        </Menu>

        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={handleCancelClick}
          className="mt-2 font-poppins bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-bold"
        >
          Hủy
        </Button>
      </Box>
    </Box>
  );
};

export default SummaryPOS;