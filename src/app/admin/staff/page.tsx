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
import StaffList from '@/components/admin/staff/StaffList';
import StaffSchedule from '@/components/admin/staff/StaffSchedule';
import LeaveRequests from '@/components/admin/staff/LeaveRequests';
import PayrollManagement from '@/components/admin/staff/PayrollManagement';
import StaffModal from '@/components/admin/staff/StaffModal';
import { Staff} from '@/types/staff';
import mockStaff from '@/mocks/mockStaff';  


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

const StaffPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAddStaff = async (data: Omit<Staff, 'id'>) => {
    try {
      setIsLoading(true);
      // TODO: API call
      const newStaff = {
        ...data,
        id: Date.now(),
      };
      setStaff(prev => [...prev, newStaff]);
      setIsModalOpen(false);
      setSnackbar({
        open: true,
        message: 'Thêm nhân viên thành công',
        severity: 'success',
      });
    } catch {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi thêm nhân viên',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditStaff = async (id: number, data: Partial<Staff>) => {
    try {
      setIsLoading(true);
      // TODO: API call
      setStaff(prev =>
        prev.map(item =>
          item.id === id
            ? { ...item, ...data }
            : item
        )
      );
      setIsModalOpen(false);
      setEditingStaff(undefined);
      setSnackbar({
        open: true,
        message: 'Cập nhật thông tin nhân viên thành công',
        severity: 'success',
      });
    } catch {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi cập nhật thông tin nhân viên',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2C3E50] to-[#3498DB] p-6 [font-family:system-ui,Poppins,sans-serif]">
        <Box className="mb-6 bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
          <Typography variant="h4" component="h1" className="font-bold mb-4 font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-200">
            Quản lý nhân viên
          </Typography>
          <Button
            variant="contained"
            className="bg-gradient-to-br from-[#2C3E50] to-[#3498DB] hover:to-blue-500 text-white font-bold py-2 px-4 rounded-xl font-poppins transition-all duration-300 shadow-md hover:shadow-lg"
            startIcon={<Add />}
            onClick={() => {
              setEditingStaff(undefined);
              setIsModalOpen(true);
            }}
          >
            Thêm nhân viên
          </Button>
        </Box>

      <Box className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}
            TabIndicatorProps={{
                style: {
                  background: 'linear-gradient(to right, #2C3E50, #3498DB)',
                },
              }}
              className="text-gray-800"
          >
              <Tab label="Danh sách nhân viên" className="font-medium text-gray-800"/>
              <Tab label="Lịch làm việc" className="font-medium text-gray-800"/>
              <Tab label="Đơn xin nghỉ" className="font-medium text-gray-800"/>
              <Tab label="Bảng lương" className="font-medium text-gray-800"/>
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <StaffList
            staff={staff}
            onEdit={(staff) => {
              setEditingStaff(staff);
              setIsModalOpen(true);
            }}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <StaffSchedule staff={staff} />
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <LeaveRequests staff={staff} />
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <PayrollManagement staff={staff} />
        </TabPanel>
      </Box>

      <StaffModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStaff(undefined);
        }}
        onSubmit={(data) => {
          if (editingStaff) {
            handleEditStaff(editingStaff.id, data);
          } else {
            handleAddStaff(data as Omit<Staff, 'id'>);
          }
        }}
        editItem={editingStaff}
        isLoading={isLoading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} className="backdrop-blur-lg shadow-lg [font-family:system-ui,Poppins,sans-serif]">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default StaffPage;