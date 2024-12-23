'use client';
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
  Grid,
  Paper,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import TableList from '@/components/admin/tables/TableList';
import TableModal from '@/components/admin/tables/TableModal';
import TableAreaTabs from '@/components/admin/tables/TableAreaTabs';
import { Table, TableStatus, TableArea } from '@/types/table';

// Mock data
const mockAreas: TableArea[] = [
  { id: 'indoor', name: 'Trong nhà', isActive: true },
  { id: 'outdoor', name: 'Ngoài trời', isActive: true },
  { id: 'vip', name: 'Phòng VIP', isActive: true },
];

const mockTables: Table[] = [
  {
    id: 1,
    name: 'Bàn 1',
    capacity: 4,
    status: TableStatus.AVAILABLE,
    area: 'indoor',
    isActive: true,
    qrCode: '/qr/table-1.png',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Thêm mock data khác...
];

const TablesPage = () => {
  const [tables, setTables] = useState<Table[]>(mockTables);
  const [currentArea, setCurrentArea] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleAddTable = async (data: any) => {
    try {
      setIsLoading(true);
      // TODO: API call
      const newTable: Table = {
        ...data,
        id: tables.length + 1,
        status: TableStatus.AVAILABLE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setTables(prev => [...prev, newTable]);
      setIsModalOpen(false);
      showSnackbar('Thêm bàn thành công', 'success');
    } catch (error) {
      showSnackbar('Có lỗi xảy ra', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTable = async (data: any) => {
    if (!editingTable) return;

    try {
      setIsLoading(true);
      // TODO: API call
      const updatedTable: Table = {
        ...editingTable,
        ...data,
        updatedAt: new Date(),
      };
      setTables(prev =>
        prev.map(table => table.id === editingTable.id ? updatedTable : table)
      );
      setIsModalOpen(false);
      setEditingTable(undefined);
      showSnackbar('Cập nhật bàn thành công', 'success');
    } catch (error) {
      showSnackbar('Có lỗi xảy ra', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTable = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bàn này?')) return;

    try {
      setIsLoading(true);
      // TODO: API call
      setTables(prev => prev.filter(table => table.id !== id));
      showSnackbar('Xóa bàn thành công', 'success');
    } catch (error) {
      showSnackbar('Có lỗi xảy ra', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: TableStatus) => {
    try {
      setIsLoading(true);
      // TODO: API call
      setTables(prev =>
        prev.map(table =>
          table.id === id ? { ...table, status, updatedAt: new Date() } : table
        )
      );
      showSnackbar('Cập nhật trạng thái thành công', 'success');
    } catch (error) {
      showSnackbar('Có lỗi xảy ra', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const filteredTables = currentArea === 'all' 
    ? tables 
    : tables.filter(table => table.area === currentArea);

  return (
    <div className="p-6">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" component="h1" className="font-bold">
          Quản lý bàn
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsModalOpen(true)}
        >
          Thêm bàn
        </Button>
      </Box>

      <TableAreaTabs
        areas={mockAreas}
        currentArea={currentArea}
        onAreaChange={setCurrentArea}
        tables={tables}
      />

      <TableList
        tables={filteredTables}
        onEdit={(table) => {
          setEditingTable(table);
          setIsModalOpen(true);
        }}
        onDelete={handleDeleteTable}
        onStatusChange={handleStatusChange}
      />

      <TableModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTable(undefined);
        }}
        onSubmit={editingTable ? handleEditTable : handleAddTable}
        editItem={editingTable}
        areas={mockAreas}
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

export default TablesPage; 