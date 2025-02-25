'use client';
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
  Paper,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import TableList from '@/components/admin/tables/TableList';
import TableModal from '@/components/admin/tables/TableModal';
import TableAreaTabs from '@/components/admin/tables/TableAreaTabs';
import { Table, TableStatus } from '@/types/table'; // Đảm bảo import Table và TableStatus
import mockTables from '@/mocks/mockTables';
import mockAreas from '@/mocks/mockAreas';

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

  const handleAddTable = async (data: Omit<Table, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
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
    } catch {
      showSnackbar('Có lỗi xảy ra', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTable = async (data: Partial<Table>) => {
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
    } catch {
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
    } catch {
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
    } catch {
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
    <div className="min-h-screen bg-gradient-to-br from-[#2C3E50] to-[#3498DB] p-6">
      <Box className="mb-6 bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
        <Typography variant="h4" component="h1" className=" font-montserrat font-bold mb-4 bor bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-300">
          Quản lý bàn
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-br from-[#2C3E50] to-[#3498DB] hover:to-blue-500 text-white font-bold py-2 px-4 rounded-xl font-poppins transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Thêm bàn
        </Button>
      </Box>

      <Paper className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
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
      </Paper>

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