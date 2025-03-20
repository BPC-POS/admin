/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Alert,
  Snackbar,
  Grid,
  Paper,
  CircularProgress,
  Box,
} from '@mui/material';
import TableListPOS from '@/components/pos/tables/TableListPOS';
import TableModalPOS from '@/components/pos/tables/TableModalPOS';
import TableAreaTabsPOS from '@/components/pos/tables/TableAreaTabsPOS';
import { TableArea, TableStatus, numericStatusToTableStatus, tableStatusToNumericStatus } from '@/types/table';
import { Category, Product } from '@/types/product';
import ProductCategoriesPOS from '@/components/pos/products/ProductCategoriesPOS';
import ProductListPOS from '@/components/pos/products/ProductListPOS';
import SummaryPOS from '@/components/pos/layout/SummaryPOS';
import { OrderAPI, OrderStatusAPI, OrderItemAPI } from '@/types/order';
import ProductModalPOS from '@/components/pos/products/ProductModalPOS';
import { getTables, getTableAreas, updateTable, getTableById } from '@/api/table';
import { getProducts } from '@/api/product';
import { getCategories, createCategory, deleteCategoryById } from '@/api/category';
import { createOrder } from '@/api/order';
import { getPaymentQRCodeImage } from '@/api/payment';
import InvoiceModal from '@/components/pos/layout/InvoiceModal';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
  status?: number;
}

interface ProductAttribute {
  attribute_id: number;
  id?: number;
  value: string;
}

interface ProductVariant {
  id?: number;
  sku?: string;
  price: number | string;
  stock_quantity: number | string;
  status: number | string;
  attributes: ProductAttribute[];
}

interface PosTable {
  id: number;
  name: string;
  capacity: number;
  status: TableStatus;
  area?: string | { id: string | number; name: string } | TableArea;
  area_id?: number;
  areaId: number;
  isActive: boolean;
  qrCode?: string;
  note?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  meta: Record<string, unknown>;
}

interface PosCategory extends Category {
  status?: number;
  meta?: {
    image_url?: string;
  };
}

const PosPage = () => {
  const [tables, setTables] = useState<PosTable[]>([]);
  const [areas, setAreas] = useState<TableArea[]>([]);
  const [currentArea, setCurrentArea] = useState("all");
  const [isEditTableModalOpen, setIsEditTableModalOpen] = useState(false);
  const [tableToEdit, setTableToEdit] = useState<PosTable | null>(null);
  const [, setIsLoading] = useState(false);
  const [tablesLoading, setTablesLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('all');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [, setEditingProduct] = useState<Product | undefined>();
  const [orderItemsForSummary, setOrderItemsForSummary] = useState<OrderItemAPI[]>([]);

  const [selectedTableForOrder, setSelectedTableForOrder] = useState<PosTable | null>(null);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState<boolean>(false);
  const [invoicePdfBlob, setInvoicePdfBlob] = useState<Blob | null>(null);

  const fetchTablesData = useCallback(async () => {
    setTablesLoading(true);
    try {
      const response = await getTables();
      const mappedTables = response.data.map((table: PosTable) => ({
        ...table,
        status:
          (typeof table.status === 'number' && table.status in numericStatusToTableStatus)
            ? numericStatusToTableStatus[table.status as keyof typeof numericStatusToTableStatus]
            : TableStatus.AVAILABLE,
      }));
      setTables(mappedTables);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Error fetching tables:", apiError);
      showSnackbar("Lỗi tải dữ liệu bàn", "error");
    } finally {
      setTablesLoading(false);
    }
  }, []);

  const fetchAreasData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getTableAreas();
      setAreas(response.data);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Error fetching areas:", apiError);
      showSnackbar("Lỗi tải dữ liệu khu vực", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const response = await getCategories();
      if (response.status === 200) {
        const apiCategories = response.data.map((category: PosCategory) => ({
          id: category.id.toString(),
          name: category.name,
          description: category.description || '',
          isActive: category.status === 1,
          image: category.meta?.image_url || null,
        }));
        setCategories(apiCategories);
      } else {
        showSnackbar("Không thể tải danh mục sản phẩm", "error");
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Error fetching categories:", apiError);
      showSnackbar("Lỗi khi tải danh mục sản phẩm", "error");
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const response = await getProducts();
      if (response.status === 200) {
        const apiProducts = response.data.map((product: Product) => ({
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: product.price || 0,
          image: product.meta?.image_url,
          category: product.category_id ? product.category_id.toString() : 'all',
          isAvailable: product.status === 1 || product.status === 5,
          status: product.status,
          createdAt: product.created_at || new Date(),
          updatedAt: product.updated_at || new Date(),
          size: product.variants?.map((variant: ProductVariant) => ({
            name: variant.attributes?.find((attr: ProductAttribute) => attr.attribute_id === 1)?.value || 'Default',
            price: variant.price || product.price,
            isDefault: true
          })) || [{ name: 'Default', price: product.price, isDefault: true }]
        }));
        setProducts(apiProducts);
      } else {
        showSnackbar("Không thể tải sản phẩm", "error");
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Error fetching products:", apiError);
      showSnackbar("Lỗi khi tải sản phẩm", "error");
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTablesData();
    fetchAreasData();
    fetchProducts();
    fetchCategories();
  }, [fetchTablesData, fetchAreasData, fetchProducts, fetchCategories]);

  const handleConfirmEditTable = async (tableData: Partial<PosTable>) => {
    if (!tableToEdit) return;

    try {
      setIsLoading(true);
      const updatedTable: PosTable = {
        ...tableToEdit,
        ...tableData,
        updatedAt: new Date(),
      };
      setTables(prev =>
        prev.map(table => table.id === tableToEdit.id ? updatedTable : table)
      );
      setIsEditTableModalOpen(false);
      setTableToEdit(null);
      showSnackbar('Cập nhật bàn thành công', 'success');
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Error updating table:", apiError);
      showSnackbar('Có lỗi xảy ra', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: TableStatus) => {
    try {
      setIsLoading(true);
      const tableResponse = await getTableById(id);
      if (tableResponse.data) {
        const tableData = {
          id: id,
          name: tableResponse.data.name,
          capacity: tableResponse.data.capacity,
          notes: tableResponse.data.note || "",
          status: tableStatusToNumericStatus[status] as unknown as number,
          areaId: tableResponse.data.areaId || 0,
          meta: tableResponse.data.meta || {},
        };
        await updateTable(tableData);
        setTables(prev =>
          prev.map(table =>
            table.id === id ? { ...table, status, updatedAt: new Date() } : table
          )
        );
        showSnackbar('Cập nhật trạng thái thành công', 'success');
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Error updating table status:", apiError);
      showSnackbar('Có lỗi xảy ra khi cập nhật trạng thái', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const filteredTables = currentArea === 'all'
    ? tables
    : tables.filter(table =>
        String(table.areaId) === currentArea ||
        String(table.area_id) === currentArea ||
        (typeof table.area === 'object' && table.area && 'id' in table.area && String(table.area.id) === currentArea) ||
        String(table.area) === currentArea
      );

  useEffect(() => {
  }, [currentArea, filteredTables]);

  const handleEditCategory = async (id: string, data: Omit<Category, 'id'>) => {
    try {
      setIsLoading(true);
      setCategories(prev =>
        prev.map(category =>
          category.id === id
            ? { ...category, ...data }
            : category
        )
      );
      showSnackbar('Cập nhật danh mục thành công', 'success');
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Error updating category:", apiError);
      showSnackbar('Có lỗi xảy ra khi cập nhật danh mục', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa danh mục này?')) return;

    try {
      setIsLoading(true);
      const numericId = parseInt(id, 10);
      if (!isNaN(numericId)) {
        const response = await deleteCategoryById(numericId);
        if (response.status === 200) {
          setCategories(prev => prev.filter(category => category.id !== id));
          if (currentCategory === id) {
            setCurrentCategory('all');
          }
          showSnackbar('Xóa danh mục thành công', 'success');
        } else {
          showSnackbar('Không thể xóa danh mục', 'error');
        }
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Error deleting category:", apiError);
      showSnackbar('Có lỗi xảy ra khi xóa danh mục', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleCategory = async (id: string) => {
    try {
      setIsLoading(true);
      setCategories(prev =>
        prev.map(category =>
          category.id === id
            ? { ...category, isActive: !category.isActive }
            : category
        )
      );
      showSnackbar('Cập nhật trạng thái danh mục thành công', 'success');
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Error toggling category:", apiError);
      showSnackbar('Có lỗi xảy ra khi cập nhật trạng thái danh mục', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleCloseModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(undefined);
  };

  const handleTableSelect = (table: PosTable) => {
    setSelectedTableForOrder(table);
    showSnackbar(`Bàn ${table.name} đã được chọn`, 'success');
  };

  const handleEditTableFromList = (table: PosTable) => {
    setTableToEdit(table);
    setIsEditTableModalOpen(true);
  };

  const handleCancelOrder = () => {
    setSelectedTableForOrder(null);
    setOrderItemsForSummary([]);
    showSnackbar('Order đã được hủy', 'info');
  };

  const handleProductClick = (product: Product) => {
    setSelectedProductForModal(product);
    setIsProductModalOpen(true);
  };

  const handleAddToOrder = (items: OrderItemAPI[]) => {
    if (!selectedTableForOrder) {
      showSnackbar('Vui lòng chọn bàn trước khi thêm sản phẩm', 'error');
      return;
    }

    setOrderItemsForSummary(prevItems => {
      const updatedItems = [...prevItems];
      items.forEach(newItem => {
        const existingItemIndex = updatedItems.findIndex(
          item => item.product_id === newItem.product_id &&
                 (item.variant_id !== undefined && newItem.variant_id !== undefined &&
                  item.variant_id === newItem.variant_id)
        );
        if (existingItemIndex !== -1) {
          updatedItems[existingItemIndex].quantity = Number(updatedItems[existingItemIndex].quantity) + Number(newItem.quantity);
        } else {
          updatedItems.push(newItem);
        }
      });
      return updatedItems;
    });

    showSnackbar('Đã thêm sản phẩm vào đơn hàng', 'success');
  };

  const handleUpdateQuantity = (productId: number, quantityChange: number) => {
    setOrderItemsForSummary(prevItems => {
      return prevItems.map(item => {
        if (item.product_id === productId) {
          const newQuantity = Number(item.quantity) + quantityChange;
          return {
            ...item,
            quantity: newQuantity > 0 ? newQuantity : item.quantity
          };
        }
        return item;
      });
    });
  };

  const handleRemoveItemSummary = (productId: number) => {
    setOrderItemsForSummary(prevItems => {
      return prevItems.filter(item => item.product_id !== productId);
    });
    showSnackbar('Món đã được xóa khỏi order', 'success');
  };

  const handleAddCategory = async (categoryData: Omit<Category, 'id'>) => {
    try {
      setIsLoading(true);
      const response = await createCategory(categoryData);
      if (response.status === 201 || response.status === 200) {
        showSnackbar('Thêm danh mục thành công', 'success');
        fetchCategories();
      } else {
        showSnackbar('Không thể thêm danh mục', 'error');
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Error adding category:", apiError);
      showSnackbar('Có lỗi xảy ra khi thêm danh mục', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckoutOrder = async (paymentMethod: 'cash' | 'transfer', taxAmount: number, shippingAddress: string) => {
    if (orderItemsForSummary.length === 0 || !selectedTableForOrder) {
      showSnackbar('Vui lòng chọn bàn và thêm món trước khi thanh toán.', 'info');
      return;
    }

    setIsLoading(true);
    try {
      const orderItemsForApi: OrderItemAPI[] = orderItemsForSummary.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: Number(item.unit_price),
        discount: item.discount || 0,
        variant_id: item.variant_id || 0,
        meta: {}
      }));

      let totalAmount = 0;
      orderItemsForSummary.forEach(item => {
        totalAmount += Number(item.unit_price) * Number(item.quantity);
      });

      const orderPayload: OrderAPI = {
        user_id: 1,
        order_date: new Date().toISOString(),
        total_amount: totalAmount,
        discount: 0,
        tax: taxAmount,
        status: OrderStatusAPI.CONFIRMED,
        payment_info: paymentMethod === 'cash' ? "Thanh toán tiền mặt tại quầy" : "Thanh toán chuyển khoản",
        shipping_address: shippingAddress || "Take Away",
        items: orderItemsForApi,
        meta: {
          table_id: selectedTableForOrder.id,
          payment_method: paymentMethod === 'cash' ? 1 : 2
        }
      };

      const response = await createOrder(orderPayload);
      if (response.status === 201 || response.status === 200) {
        const orderId = response.data.id;

        if (paymentMethod === 'transfer') {
          try {
            const pdfBlob = await getPaymentQRCodeImage(orderId);
            setInvoicePdfBlob(pdfBlob);
            setIsInvoiceModalOpen(true);
            showSnackbar(`Thanh toán chuyển khoản thành công, Invoice đang được hiển thị!`, 'success');
          } catch (downloadError: any) {
            console.error("Error downloading invoice:", downloadError);
            showSnackbar(`Thanh toán chuyển khoản thành công, nhưng lỗi khi tải Invoice. Vui lòng thử lại sau.`, 'error');
          }
        } else {
          showSnackbar(`Thanh toán thành công bằng ${paymentMethod === 'cash' ? 'tiền mặt' : 'chuyển khoản'} và tạo order thành công!`, 'success');
        }

        if (selectedTableForOrder) {
          await handleStatusChange(selectedTableForOrder.id, TableStatus.OCCUPIED); 
        } else {
          console.log("selectedTableForOrder is null, cannot update table status."); 
        }


        setOrderItemsForSummary([]);
        setSelectedTableForOrder(null);
      } else {
        showSnackbar(`Thanh toán bằng ${paymentMethod === 'cash' ? 'tiền mặt' : 'chuyển khoản'} thành công, nhưng có lỗi khi tạo order.`, 'info');
      }
    } catch (error: any) {
      console.error("Error during checkout and creating order:", error);
      showSnackbar('Lỗi khi thanh toán và tạo order.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseInvoiceModal = () => {
    setIsInvoiceModalOpen(false);
    setInvoicePdfBlob(null); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C3E50] to-[#3498DB] p-5">
      <Paper className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
        {tablesLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md sx={{ flexGrow: 1 }}>
              <TableAreaTabsPOS
                areas={areas}
                currentArea={currentArea}
                onAreaChange={(area) => setCurrentArea(typeof area === 'string' ? area : String(area))}
                tables={tables as any}
              />
              <TableListPOS
                tables={filteredTables as any}
                onEdit={handleEditTableFromList as any}
                onStatusChange={handleStatusChange}
                onTableSelect={handleTableSelect as any}
                onShowSnackbar={showSnackbar}
              />
              <ProductCategoriesPOS
                categories={categories}
                currentCategory={currentCategory}
                onCategoryChange={setCurrentCategory}
                onAddCategory={handleAddCategory}
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteCategory}
                onToggleCategory={handleToggleCategory}
                isLoading={categoriesLoading}
              />
              <ProductListPOS
                products={products}
                currentCategory={currentCategory}
                onProductClick={handleProductClick}
                isLoading={productsLoading}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <SummaryPOS
                selectedTable={selectedTableForOrder as any}
                orderItems={orderItemsForSummary}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItemSummary}
                onCheckoutOrder={handleCheckoutOrder}
                onCancelOrder={handleCancelOrder}
              />
            </Grid>
          </Grid>
        )}
      </Paper>

      <InvoiceModal
        open={isInvoiceModalOpen}
        onClose={handleCloseInvoiceModal}
        pdfBlob={invoicePdfBlob}
      />

      <TableModalPOS
        open={isEditTableModalOpen}
        onClose={() => {
          setIsEditTableModalOpen(false);
          setTableToEdit(null);
        }}
        table={tableToEdit as any}
        onConfirm={handleConfirmEditTable as any}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          className="backdrop-blur-lg shadow-lg [font-family:system-ui,Poppins,sans-serif]"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <ProductModalPOS
        open={isProductModalOpen}
        onClose={handleCloseModal}
        product={selectedProductForModal}
        onAddToOrder={handleAddToOrder}
      />
    </div>
  );
};

export default PosPage;