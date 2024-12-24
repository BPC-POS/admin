"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import InventoryList from '@/components/admin/inventory/InventoryList';
import InventoryModal from '@/components/admin/inventory/InventoryModal';
import TransactionHistory from '@/components/admin/inventory/TransactionHistory';
// import PurchaseOrders from '@/components/admin/inventory/PurchaseOrders';
// import Suppliers from '@/components/admin/inventory/Suppliers';
import { InventoryItem, InventoryCategory, InventoryStatus } from '@/types/inventory';

// Mock data
const mockInventory: InventoryItem[] = [
  {
    id: 1,
    name: 'Cà phê Arabica',
    sku: 'COF-ARA-001',
    category: InventoryCategory.COFFEE_BEANS,
    unit: 'kg',
    quantity: 25,
    minQuantity: 10,
    maxQuantity: 50,
    location: 'Kho A-01',
    cost: 280000,
    status: InventoryStatus.IN_STOCK,
  },
  // Thêm mock data khác...
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const InventoryPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleAddItem = async (data: Omit<InventoryItem, 'id'>) => {
    try {
      setIsLoading(true);
      // TODO: API call
      const newItem = {
        ...data,
        id: Date.now(),
      };
      setInventory(prev => [...prev, newItem]);
      setIsModalOpen(false);
      showSnackbar('Thêm vật phẩm thành công', 'success');
    } catch (err) {
      showSnackbar('Có lỗi xảy ra', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditItem = async (id: number, data: Partial<InventoryItem>) => {
    try {
      setIsLoading(true);
      // TODO: API call
      setInventory(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, ...data }
            : item
        )
      );
      setIsModalOpen(false);
      showSnackbar('Cập nhật thành công', 'success');
    } catch (err) {
      showSnackbar('Có lỗi xảy ra', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Box className="mb-6">
        <Typography variant="h4" component="h1" className="font-bold mb-4">
          Quản lý kho
        </Typography>
        {activeTab === 0 && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setEditingItem(undefined);
              setIsModalOpen(true);
            }}
          >
            Thêm vật phẩm
          </Button>
        )}
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Kho hàng" />
          <Tab label="Lịch sử giao dịch" />
          <Tab label="Đơn đặt hàng" />
          <Tab label="Nhà cung cấp" />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <InventoryList
          items={inventory}
          onEdit={(item) => {
            setEditingItem(item);
            setIsModalOpen(true);
          }}
        />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <TransactionHistory inventory={inventory} />
      </TabPanel>

      {/* <TabPanel value={activeTab} index={2}>
        <PurchaseOrders inventory={inventory} />
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <Suppliers />
      </TabPanel> */}

      <InventoryModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(undefined);
        }}
        onSubmit={(data) => {
          if (editingItem) {
            handleEditItem(editingItem.id, data);
          } else {
            handleAddItem(data as Omit<InventoryItem, 'id'>);
          }
        }}
        editItem={editingItem}
        isLoading={isLoading}
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
    </div>
  );
};

export default InventoryPage;