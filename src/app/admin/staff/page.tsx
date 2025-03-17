"use client";

import React, { useState, useEffect } from 'react'; // Import useEffect
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
import { createEmployee, getEmployees, updateEmployeeById, deleteEmployeeById } from '@/api/employee';

// Define a type for API errors
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
  const [activeTab, setActiveTab] = useState<number>(0);
  const [staff, setStaff] = useState<Staff[]>([]);
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

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await getEmployees();
      setStaff(response.data);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Error fetching employees:", apiError);
      setSnackbar({
        open: true,
        message: 'Lỗi khi tải danh sách nhân viên',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []); 

  const handleAddStaff = async (data: Omit<Staff, 'id'>) => {
    console.log("Adding staff:", data);
    try {
      setIsLoading(true);
      const response = await createEmployee(data); 
      if (response.status === 201) { 
        setSnackbar({
          open: true,
          message: 'Thêm nhân viên thành công',
          severity: 'success',
        });
        fetchEmployees();
        setIsModalOpen(false);
      } else {
        setSnackbar({
          open: true,
          message: 'Có lỗi xảy ra khi thêm nhân viên',
          severity: 'error',
        });
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Error creating employee:", apiError);
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
    console.log("Editing staff:", id, data);
    try {
      setIsLoading(true);
      // Type assertion to Staff with all required fields having fallback values
      const staffData = {
        name: data.name || '',
        email: data.email || '',
        phone_number: data.phone_number || '',
        role_id: data.role_id,
        status: data.status,
        member_id: data.member_id,
        shifts: data.shifts,
        ...data
      } as Staff;
      
      const response = await updateEmployeeById(id, staffData);
      if (response.status === 200) { 
        setSnackbar({
          open: true,
          message: 'Cập nhật thông tin nhân viên thành công',
          severity: 'success',
        });
        fetchEmployees();
        setIsModalOpen(false);
        setEditingStaff(undefined);
      } else {
        setSnackbar({
          open: true,
          message: 'Có lỗi xảy ra khi cập nhật thông tin nhân viên',
          severity: 'error',
        });
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Error updating employee:", apiError);
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi cập nhật thông tin nhân viên',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStaff = async (staff: Staff) => {
    try {
      if (!staff.id) {
        throw new Error('Staff ID is undefined');
      }
        setIsLoading(true);
        const response = await deleteEmployeeById(staff.id);
        if (response.status === 200) {
          setSnackbar({
            open: true,
            message: 'Xóa nhân viên thành công',
            severity: 'success',
          });
          fetchEmployees();
        } else {
          setSnackbar({
            open: true,
            message: 'Có lỗi xảy ra khi xóa nhân viên',
            severity: 'error',
          });
        }
      } catch (error: unknown) {
        const apiError = error as ApiError;
        console.error("Error deleting employee:", apiError);
        setSnackbar({
          open: true,
          message: 'Có lỗi xảy ra khi xóa nhân viên',
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
            onDelete={handleDeleteStaff}
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
          if (editingStaff && typeof editingStaff.id === 'number') {
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