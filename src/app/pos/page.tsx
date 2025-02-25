"use client";

import React, { useState } from 'react';
import {
  Alert,
  Snackbar,
  Grid,
  Paper,
} from '@mui/material';
import TableListPOS from '@/components/pos/tables/TableListPOS';
import TableModalPOS from '@/components/pos/tables/TableModalPOS';
import TableAreaTabsPOS from '@/components/pos/tables/TableAreaTabsPOS';
import { Table, TableStatus } from '@/types/table';
import mockTables from '@/mocks/mockTables';
import mockAreas from '@/mocks/mockAreas';
import { mockCategories } from '@/mocks/mockCategories';
import mockProducts from '@/mocks/mockProducts';
import { Category, Product, Size } from '@/types/product';
import ProductCategoriesPOS from '@/components/pos/products/ProductCategoriesPOS';
import ProductListPOS from '@/components/pos/products/ProductListPOS';
import SummaryPOS from '@/components/pos/layout/SummaryPOS';
import { OrderItem } from '@/types/order';
import ProductModalPOS from '@/components/pos/products/ProductModalPOS';

const PosPage = () => {
  const [tables, setTables] = useState<Table[]>(mockTables);
  const [currentArea, setCurrentArea] = useState<string>('all');
  const [isEditTableModalOpen, setIsEditTableModalOpen] = useState(false);
  const [tableToEdit, setTableToEdit] = useState<Table | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info',
  });

  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [products, ] = useState<Product[]>(mockProducts);
  const [currentCategory, setCurrentCategory] = useState('all');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [, setEditingProduct] = useState<Product | undefined>();
  const [orderItemsForSummary, setOrderItemsForSummary] = useState<OrderItem[]>([]);

  const [selectedTableForOrder, setSelectedTableForOrder] = useState<Table | null>(null);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  const handleConfirmEditTable = async (tableData: Partial<Table>) => { // Changed 'any' to 'Partial<Table>'
    if (!tableToEdit) return;

    try {
      setIsLoading(true);
      const updatedTable: Table = {
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
    } catch {
      showSnackbar('Có lỗi xảy ra', 'error');
    } finally {
      setIsLoading(false);
    }
  };


  const handleStatusChange = async (id: number, status: TableStatus) => {
    try {
      setIsLoading(true);
      setTables(prev =>
        prev.map(table =>
          table.id === id ? { ...table, status, updatedAt: new Date() } : table
        )
      );
      showSnackbar('Cập nhật trạng thái thành công', 'success');
    } catch {
      showSnackbar('Có lỗi xảy ra', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const filteredTables = currentArea === 'all'
    ? tables
    : tables.filter(table => table.area === currentArea);

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
          setSnackbar({
            open: true,
            message: 'Cập nhật danh mục thành công',
            severity: 'success',
          });
        } catch {
          setSnackbar({
            open: true,
            message: 'Có lỗi xảy ra khi cập nhật danh mục',
            severity: 'error',
          });
        } finally {
          setIsLoading(false);
        }
      };

      const handleDeleteCategory = async (id: string) => {
        if (!window.confirm('Bạn có chắc muốn xóa danh mục này?')) return;

        try {
          setIsLoading(true);
          setCategories(prev => prev.filter(category => category.id !== id));
          if (currentCategory === id) {
            setCurrentCategory('all');
          }
          setSnackbar({
            open: true,
            message: 'Xóa danh mục thành công',
            severity: 'success',
          });
        } catch {
          setSnackbar({
            open: true,
            message: 'Có lỗi xảy ra khi xóa danh mục',
            severity: 'error',
          });
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
          setSnackbar({
            open: true,
            message: 'Cập nhật trạng thái danh mục thành công',
            severity: 'success',
          });
        } catch {
          setSnackbar({
            open: true,
            message: 'Có lỗi xảy ra khi cập nhật trạng thái danh mục',
            severity: 'error',
          });
        } finally {
          setIsLoading(false);
        }
      };

      const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
      };

      const handleOpenModal = (product?: Product) => {
        setEditingProduct(product);
        setIsProductModalOpen(true);
      };

      const handleCloseModal = () => {
        setIsProductModalOpen(false);
        setEditingProduct(undefined);
      };

      const handleTableSelect = (table: Table) => {
        setSelectedTableForOrder(table);
        showSnackbar(`Bàn ${table.name} đã được chọn`, 'success');
      };

      const handleEditTableFromList = (table: Table) => {
        setTableToEdit(table);
        setIsEditTableModalOpen(true);
      };

      const handleCancelOrder = () => {
        setSelectedTableForOrder(null);
        setOrderItemsForSummary([]);
        showSnackbar('Order đã được hủy', 'info');
      };

      const handleAddToCart = (product: Product, size: Size, quantity: number) => {
        const newItem: OrderItem = {
          productId: product.id,
          productName: product.name,
          price: size.price,
          quantity: quantity,
          id: 0
        };

        setOrderItemsForSummary(prevItems => {
          const existingItemIndex = prevItems.findIndex(item => item.productId === product.id && item.price === size.price);

          if (existingItemIndex > -1) {
            const updatedItems = [...prevItems];
            updatedItems[existingItemIndex].quantity += quantity;
            return updatedItems;
          } else {
            return [...prevItems, newItem];
          }
        });

        showSnackbar(`${product.name} (${size.name}) x ${quantity} đã được thêm vào order`, 'success');
      };

      const handleProductClick = (product: Product) => {
        console.log("PosPage - handleProductClick CALLED", product);
        setSelectedProductForModal(product);
        setIsProductModalOpen(true);
      };

      const handleUpdateQuantity = (productId: number, quantityChange: number) => {
        setOrderItemsForSummary(prevItems => {
          return prevItems.map(item => {
            if (item.productId === productId) {
              const newQuantity = item.quantity + quantityChange;
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
          return prevItems.filter(item => item.productId !== productId);
        });
        showSnackbar('Món đã được xóa khỏi order', 'success');
      };

      const handleCheckout = () => {
        if (orderItemsForSummary.length === 0) {
          showSnackbar('Không có món nào trong order để thanh toán.', 'info');
          return;
        }
        console.log('Thanh toán order:', orderItemsForSummary);
        alert('Thanh toán thành công!');
        setOrderItemsForSummary([]);
        setSelectedTableForOrder(null);
        showSnackbar('Thanh toán thành công', 'success');
      };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C3E50] to-[#3498DB] p-5">
      <Paper className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
      <Grid container spacing={3}>
          <Grid item xs={12} md sx={{ flexGrow: 1 }}>
            <TableAreaTabsPOS
              areas={mockAreas}
              currentArea={currentArea}
              onAreaChange={setCurrentArea}
              tables={tables}
            />

            <TableListPOS
              tables={filteredTables}
              onEdit={handleEditTableFromList}
              onStatusChange={handleStatusChange}
              onTableSelect={handleTableSelect}
            />
            <ProductCategoriesPOS
             categories={categories}
             currentCategory={currentCategory}
             onCategoryChange={setCurrentCategory}
             onEditCategory={handleEditCategory}
             onDeleteCategory={handleDeleteCategory}
             onToggleCategory={handleToggleCategory}
           />
           <ProductListPOS
           products={products}
           currentCategory={currentCategory}
           isLoading={isLoading}
           onEdit={handleOpenModal}
           onProductClick={handleProductClick}
          />
          </Grid>
          <Grid item xs={12} md={3}>
                <SummaryPOS
                  selectedTable={selectedTableForOrder}
                  orderItems={orderItemsForSummary}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItemSummary}
                  onCheckout={handleCheckout}
                  onCancelOrder={handleCancelOrder}
                />
           </Grid>
        </Grid>
      </Paper>

      <TableModalPOS
        open={isEditTableModalOpen}
        onClose={() => {
          setIsEditTableModalOpen(false);
          setTableToEdit(null);
        }}
        table={tableToEdit}
        onConfirm={handleConfirmEditTable}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
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
      onAddToCart={handleAddToCart}
      />
    </div>

  );
};

export default PosPage;