import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
} from "@mui/material";
import Image from "next/image";
import { Product } from "@/types/product";
import { Add, Remove } from "@mui/icons-material";
import { OrderItem } from "@/types/order";
import { getProductById } from "@/api/product";

interface ProductVariant {
  id: number;
  sku: string;
  price: number;
  stock_quantity: number;
  status: number;
  attributes: {
    attribute_id: number;
    value: string;
  }[];
}

interface ProductModalPOSProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToOrder: (items: OrderItem[]) => void;
}

const ProductModalPOS: React.FC<ProductModalPOSProps> = ({
  open,
  onClose,
  product,
  onAddToOrder,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [variantError, setVariantError] = useState<string | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (product && product.id) {
        setIsLoading(true);
        try {
          const response = await getProductById(product.id);
          if (response.status === 200 && response.data.variants) {
            setVariants(response.data.variants);
            // Set default variant if available
            if (response.data.variants.length > 0) {
              setSelectedVariant(response.data.variants[0]);
            }
          }
        } catch (error) {
          console.error("Error fetching product variants:", error);
          setVariantError("Không thể tải thông tin variant");
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (open && product) {
      fetchProductDetails();
    }

    return () => {
      setSelectedVariant(null);
      setQuantity(1);
      setVariantError(null);
    };
  }, [product, open]);

  if (!product) {
    return null;
  }

  const handleVariantChange = (event: SelectChangeEvent) => {
    const variantId = Number(event.target.value);
    const chosenVariant = variants.find(v => v.id === variantId);
    setSelectedVariant(chosenVariant || null);
    setVariantError(chosenVariant ? null : "Vui lòng chọn phiên bản");
  };

  const getVariantDisplayName = (variant: ProductVariant) => {
    const sizeAttribute = variant.attributes.find(attr => attr.attribute_id === 1);
    return `${sizeAttribute ? sizeAttribute.value : ''} ${variant.sku} - ${variant.price.toLocaleString("vi-VN")}đ`.trim();
  };

  const handleAddToOrderClick = () => {
    if (!selectedVariant) {
      setVariantError("Vui lòng chọn phiên bản");
      return;
    }

    const orderItem: OrderItem = {
      id: Date.now(),
      productId: product.id,
      variantId: selectedVariant.id,
      productName: product.name,
      price: selectedVariant.price,
      quantity: quantity,
      total: selectedVariant.price * quantity,
    };

    onAddToOrder([orderItem]);
    onClose();
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box className="relative w-full aspect-square font-poppins">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover rounded-lg font-poppins"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                className="flex flex-col justify-between"
              >
                <Box className="font-poppins">
                  <Typography variant="h6" component="h2" gutterBottom className="font-poppins font-semibold text-black">
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {product.description}
                  </Typography>

                  {isLoading ? (
                    <Box display="flex" justifyContent="center" p={2}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : variants.length > 0 ? (
                    <FormControl fullWidth margin="normal" error={!!variantError}>
                      <InputLabel id="variant-select-label">Phiên bản</InputLabel>
                      <Select
                        labelId="variant-select-label"
                        id="variant-select"
                        value={selectedVariant ? String(selectedVariant.id) : ""}
                        label="Phiên bản"
                        onChange={handleVariantChange}
                      >
                        {variants.map((variant) => (
                          <MenuItem key={variant.id} value={variant.id}>
                            {getVariantDisplayName(variant)}
                          </MenuItem>
                        ))}
                      </Select>
                      {variantError && (
                        <Typography variant="caption" color="error">
                          {variantError}
                        </Typography>
                      )}
                    </FormControl>
                  ) : (
                    <Typography color="error" variant="body2">
                      Không có phiên bản nào cho sản phẩm này
                    </Typography>
                  )}
                </Box>

                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Typography className="font-poppins" variant="subtitle1">Số lượng:</Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
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

                  {selectedVariant && (
                    <Typography variant="subtitle1" className="mb-4 font-poppins text-right">
                      Tổng: {(selectedVariant.price * quantity).toLocaleString("vi-VN")}đ
                    </Typography>
                  )}

                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
                  >
                    <Button onClick={onClose}>Huỷ</Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddToOrderClick}
                      disabled={!selectedVariant || isLoading}
                      style={{background: 'linear-gradient(90deg, #2C3E50 0%, #3498DB 100%)'}}
                      className='font-poppins font-semibold'
                    >
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
