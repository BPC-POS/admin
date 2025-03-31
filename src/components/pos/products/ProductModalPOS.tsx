import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
  Divider, // Import Divider
} from "@mui/material";
import Image from "next/image";
import { Product } from "@/types/product";
import { Add, Remove, Close } from "@mui/icons-material"; // Thêm icon Close
import { OrderItemAPI } from "@/types/order";
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
  onAddToOrder: (items: OrderItemAPI[]) => void;
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
      if (product?.id) {
        setIsLoading(true);
        setVariants([]);
        setSelectedVariant(null);
        setVariantError(null);
        setQuantity(1); // Reset quantity khi đổi sản phẩm
        try {
          const response = await getProductById(product.id);
          if (response?.status === 200 && response.data && Array.isArray(response.data.variants)) {
            const activeVariants = response.data.variants.filter((v: ProductVariant) => v.status === 1);
            setVariants(activeVariants);
            if (activeVariants.length > 0) {
              setSelectedVariant(activeVariants[0]);
            } else {
              setVariantError("Sản phẩm hiện không có phiên bản nào.");
            }
          } else {
             setVariantError("Không tìm thấy thông tin phiên bản.");
          }
        } catch (error) {
          console.error("Error fetching product variants:", error);
          setVariantError("Lỗi khi tải thông tin phiên bản.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (open && product) {
      fetchProductDetails();
    }

    return () => {
      if (!open) { // Chỉ reset khi modal thực sự đóng
          setSelectedVariant(null);
          setQuantity(1);
          setVariantError(null);
          setVariants([]);
      }
    };
  }, [product, open]);

  if (!product) return null;

  const handleVariantChange = (event: SelectChangeEvent<string>) => {
    const variantId = Number(event.target.value);
    const chosenVariant = variants.find((v) => v.id === variantId);
    setSelectedVariant(chosenVariant || null);
    setVariantError(null);
    setQuantity(1); // Reset quantity khi đổi variant
  };

  const getVariantDisplayName = (variant: ProductVariant): string => {
    const sizeAttribute = variant.attributes.find((attr) => attr.attribute_id === 1); // Assuming ID 1 is Size
    return `${sizeAttribute ? sizeAttribute.value : "Default"} (${variant.sku}) - ${variant.price.toLocaleString("vi-VN")}đ`.trim();
  };

  const handleAddToOrderClick = () => {
    if (!selectedVariant) {
      setVariantError("Vui lòng chọn một phiên bản.");
      return;
    }

    const newItem: OrderItemAPI = {
      product_id: product.id,
      quantity: quantity,
      unit_price: selectedVariant.price,
      variant_id: selectedVariant.id,
      meta: {
        variant_display_name: getVariantDisplayName(selectedVariant),
        product_image: product.image
      },
      product_name: product.name,
    };

    onAddToOrder([newItem]);
    onClose();
  };

  const handleIncreaseQuantity = () => setQuantity((q) => q + 1);
  const handleDecreaseQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  const formatCurrency = (value: number): string => value.toLocaleString("vi-VN") + "đ";

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="product-modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: '95%', sm: '85%', md: '70%', lg: '50%' }, // Responsive width
          maxWidth: 650, // Giới hạn max width
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column', // Cho phép phần content scroll
          overflow: 'hidden', // Ẩn scroll của box chính
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
             <Typography className="text-black" variant="h6" component="h2" fontWeight="bold" id="product-modal-title">
                {product.name}
             </Typography>
             <IconButton onClick={onClose} size="small">
                 <Close />
             </IconButton>
         </Box>

         {/* Phần nội dung chính có thể scroll */}
        <Box sx={{ overflowY: 'auto', p: { xs: 2, sm: 3 } }}> {/* Padding cho nội dung */}
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12} sm={5}>
                <Box sx={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', borderRadius: 1.5, overflow: 'hidden', bgcolor: 'grey.200' }}>
                  <Image
                    src={product.image || '/images/placeholder.png'} // Luôn có ảnh placeholder
                    alt={product.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 600px) 90vw, (max-width: 900px) 40vw, 300px"
                    priority
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={7} sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box flexGrow={1}> {/* Phần mô tả và chọn variant chiếm không gian còn lại */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, maxHeight: { xs: 60, sm: 80 }, overflowY: 'auto' }}
                  >
                    {product.description || "Không có mô tả."}
                  </Typography>

                  {isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" p={2}>
                      <CircularProgress size={20} />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>Đang tải phiên bản...</Typography>
                    </Box>
                  ) : variants.length > 0 ? (
                    <FormControl fullWidth margin="dense" error={!!variantError} required disabled={isLoading}>
                      <InputLabel id="variant-select-label">Chọn phiên bản</InputLabel>
                      <Select
                        labelId="variant-select-label"
                        value={selectedVariant ? String(selectedVariant.id) : ""}
                        label="Chọn phiên bản"
                        onChange={handleVariantChange}
                        MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }} // Giới hạn chiều cao dropdown
                      >
                        {variants.map((variant) => (
                          <MenuItem key={variant.id} value={String(variant.id)}>
                            {getVariantDisplayName(variant)}
                          </MenuItem>
                        ))}
                      </Select>
                      {variantError && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                          {variantError}
                        </Typography>
                      )}
                    </FormControl>
                  ) : (
                    <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
                      {variantError || "Sản phẩm chưa có phiên bản."}
                    </Typography>
                  )}
                </Box>

                {/* Chỉ hiển thị khi đã chọn variant */}
                {selectedVariant && (
                  <Box sx={{ mt: 2 }}>
                    <Divider sx={{ my: 1.5 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography className="text-black" variant="body1" fontWeight="500">Số lượng:</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', border: 1, borderColor: 'divider', borderRadius: 1 }}>
                        <IconButton onClick={handleDecreaseQuantity} disabled={quantity <= 1 || isLoading} size="small" sx={{ borderRight: 1, borderColor: 'divider', borderRadius: '4px 0 0 4px', p: 0.5 }}>
                          <Remove fontSize="small"/>
                        </IconButton>
                        <Typography sx={{ px: 1.5, minWidth: 30, textAlign: 'center' }}>{quantity}</Typography>
                        <IconButton onClick={handleIncreaseQuantity} disabled={isLoading} size="small" sx={{ borderLeft: 1, borderColor: 'divider', borderRadius: '0 4px 4px 0', p: 0.5 }}>
                          <Add fontSize="small"/>
                        </IconButton>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end' }}>
                        <Typography variant="body1" color="text.secondary" sx={{ mr: 0.5 }}>Tổng:</Typography>
                        <Typography variant="h6" fontWeight="bold" color="error.main">
                          {formatCurrency(selectedVariant.price * quantity)}
                        </Typography>
                    </Box>
                  </Box>
                )}
              </Grid>
            </Grid>
        </Box>

        {/* Footer với các nút hành động */}
        <Box
          sx={{
              p: 2,
              display: "flex",
              justifyContent: "flex-end",
              gap: 1.5,
              borderTop: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper', 
          }}
        >
          <Button
              onClick={onClose}
              variant="outlined"
              color="error" 
              sx={{ fontWeight: 500 }} // Chữ đậm vừa
          >
            Huỷ
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddToOrderClick}
            disabled={!selectedVariant || isLoading}
            startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null} // Icon loading nhỏ
            sx={{
              fontWeight: 'bold',
              minWidth: 140, // Đặt chiều rộng tối thiểu
              bgcolor: 'primary.main', // Màu chính từ theme
              '&:hover': {
                bgcolor: 'primary.dark', // Màu tối hơn khi hover
              },
              '&.Mui-disabled': {
                bgcolor: 'action.disabledBackground',
                color: 'action.disabled',
              }
            }}
          >
            {isLoading ? 'Đang thêm...' : 'Thêm vào order'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProductModalPOS;