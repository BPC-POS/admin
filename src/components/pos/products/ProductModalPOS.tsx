import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Chip,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent, 
} from '@mui/material';
import Image from 'next/image';
import { Product, Size } from '@/types/product'; 
import { Add, Remove } from '@mui/icons-material';

interface ProductModalPOSProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (product: Product, size: Size, quantity: number) => void; 
}

const ProductModalPOS: React.FC<ProductModalPOSProps> = ({ open, onClose, product, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null); 
  const [quantity, setQuantity] = useState<number>(1);
  const [sizeError, setSizeError] = useState<string | null>(null);

  React.useEffect(() => {
    if (product && product.size.length > 0) {
      const defaultSize = product.size.find(size => size.isDefault);
      setSelectedSize(defaultSize || product.size[0]);
    } else {
      setSelectedSize(null);
    }
    setQuantity(1); 
    setSizeError(null); 
  }, [product]);


  if (!product) {
    return null; 
  }

  const handleSizeChange = (event: SelectChangeEvent) => {
    const chosenSize = product.size.find(size => size.name === event.target.value);
    setSelectedSize(chosenSize || null);
    setSizeError(chosenSize ? null : 'Vui lòng chọn size');
  };

  const handleAddToCartClick = () => {
    if (!selectedSize) {
      setSizeError('Vui lòng chọn size');
      return;
    }
    onAddToCart(product, selectedSize, quantity);
    onClose(); // Close modal after adding to cart
  };

  const handleIncreaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };


  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
      }}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box className="relative w-full aspect-square">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6} className="flex flex-col justify-between">
                <Box>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {product.description}
                  </Typography>

                  {product.size && product.size.length > 0 && (
                    <FormControl fullWidth margin="normal" error={!!sizeError}>
                      <InputLabel id="size-select-label">Size</InputLabel>
                      <Select
                        labelId="size-select-label"
                        id="size-select"
                        value={selectedSize ? selectedSize.name : ''}
                        label="Size"
                        onChange={handleSizeChange}
                      >
                        {product.size.map((size) => (
                          <MenuItem key={size.name} value={size.name}>{size.name} - {size.price.toLocaleString('vi-VN')}đ</MenuItem>
                        ))}
                      </Select>
                      {sizeError && <Typography variant="caption" color="error">{sizeError}</Typography>}
                    </FormControl>
                  )}
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle1">Số lượng:</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton
                        onClick={handleDecreaseQuantity}
                        disabled={quantity <= 1}
                        size="small"
                      >
                        <Remove />
                      </IconButton>
                      <TextField
                        type="number"
                        size="small"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        inputProps={{ min: 1 }}
                        sx={{ width: 60, mx: 1 }}
                      />
                      <IconButton onClick={handleIncreaseQuantity} size="small">
                        <Add />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button onClick={onClose}>Huỷ</Button>
                    <Button variant="contained" color="primary" onClick={handleAddToCartClick} disabled={!selectedSize}>
                      Thêm vào order
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
};

export default ProductModalPOS;