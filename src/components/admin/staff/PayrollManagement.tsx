import React, { useState } from 'react';
import {
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
} from '@mui/material';
import {
  MoreVert,
  Visibility,
  PictureAsPdf,
  Calculate,
  Close,
} from '@mui/icons-material';
import { Staff, PayrollRecord, PayrollStatus } from '@/types/staff';
import { formatCurrency } from '@/utils/format';

interface PayrollManagementProps {
  staff: Staff[];
}

const PayrollManagement: React.FC<PayrollManagementProps> = ({ staff }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(null);

  const getStatusColor = (status: PayrollStatus) => {
    const colors: Record<PayrollStatus, 'default' | 'primary' | 'success'> = {
      [PayrollStatus.DRAFT]: 'default',
      [PayrollStatus.APPROVED]: 'primary',
      [PayrollStatus.PAID]: 'success',
    };
    return colors[status];
  };

  const getStatusLabel = (status: PayrollStatus) => {
    const labels: Record<PayrollStatus, string> = {
      [PayrollStatus.DRAFT]: 'Bản nháp',
      [PayrollStatus.APPROVED]: 'Đã duyệt',
      [PayrollStatus.PAID]: 'Đã thanh toán',
    };
    return labels[status];
  };

  const handleGeneratePayroll = () => {
    // TODO: Implement payroll generation logic
  };

  const handleViewDetail = (payroll: PayrollRecord) => {
    setSelectedPayroll(payroll);
    setIsDetailModalOpen(true);
  };

  // Mock data - replace with actual data from API
  const payrollRecords: PayrollRecord[] = staff.map(member => ({
    id: member.id,
    staffId: member.id,
    month: selectedMonth,
    year: selectedYear,
    workingDays: 22,
    totalHours: 176,
    overtime: 8,
    baseSalary: member.salary.base,
    allowance: member.salary.allowance,
    bonus: 500000,
    deductions: 0,
    netSalary: member.salary.base + member.salary.allowance + 500000,
    status: PayrollStatus.DRAFT,
  }));

  return (
    <Box>
      <Box className="mb-4 flex justify-between items-center">
        <Box className="flex gap-4">
          <FormControl sx={{ minWidth: 120 }} className="font-poppins">
            <InputLabel className="font-poppins">Tháng</InputLabel>
            <Select
              value={selectedMonth}
              label="Tháng"
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="font-poppins"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i} value={i} className="font-poppins">
                  Tháng {i + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }} className="font-poppins">
            <InputLabel className="font-poppins">Năm</InputLabel>
            <Select
              value={selectedYear}
              label="Năm"
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="font-poppins"
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return (
                  <MenuItem key={year} value={year} className="font-poppins">
                    {year}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>

        <Button
          variant="contained"
          startIcon={<Calculate />}
          onClick={handleGeneratePayroll}
          className="bg-gradient-to-br from-[#2C3E50] to-[#3498DB] hover:to-blue-500 text-white font-bold py-2 px-6 rounded-xl font-poppins transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Tính lương
        </Button>
      </Box>

      <TableContainer component={Paper} className="font-poppins mb-6 bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-lg">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="font-poppins">Nhân viên</TableCell>
              <TableCell align="center" className="font-poppins">Ngày công</TableCell>
              <TableCell align="right" className="font-poppins">Lương cơ bản</TableCell>
              <TableCell align="right" className="font-poppins">Phụ cấp</TableCell>
              <TableCell align="right" className="font-poppins">Thưởng</TableCell>
              <TableCell align="right" className="font-poppins">Khấu trừ</TableCell>
              <TableCell align="right" className="font-poppins">Thực lĩnh</TableCell>
              <TableCell align="center" className="font-poppins">Trạng thái</TableCell>
              <TableCell align="right" className="font-poppins">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payrollRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  <Typography variant="subtitle2" className="font-poppins">
                    ID: {record.staffId}
                  </Typography>
                </TableCell>
                <TableCell align="center" className="font-poppins">
                  {record.workingDays} ngày
                  <Typography variant="caption" display="block" color="text.secondary" className="font-poppins">
                    ({record.totalHours} giờ)
                  </Typography>
                </TableCell>
                <TableCell align="right" className="font-poppins">{formatCurrency(record.baseSalary)}</TableCell>
                <TableCell align="right" className="font-poppins">{formatCurrency(record.allowance)}</TableCell>
                <TableCell align="right" className="font-poppins">{formatCurrency(record.bonus)}</TableCell>
                <TableCell align="right" className="font-poppins">{formatCurrency(record.deductions)}</TableCell>
                <TableCell align="right" className="font-poppins">
                  <Typography color="primary" fontWeight="bold" className="font-poppins">
                    {formatCurrency(record.netSalary)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={getStatusLabel(record.status)}
                    color={getStatusColor(record.status)}
                    size="small"
                    className="font-poppins"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleViewDetail(record)}
                  >
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        maxWidth="md"
        fullWidth
        className="font-poppins"
        PaperProps={{
          className: "bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg"
        }}
      >
        <DialogTitle className="flex justify-between items-center bg-gradient-to-r from-[#2C3E50] to-[#3498DB] text-white p-4 rounded-t-2xl">
          <span className="text-xl font-bold font-poppins">Chi tiết bảng lương</span>
          <Box className="flex gap-2">
            <Button
              startIcon={<PictureAsPdf />}
              onClick={() => {/* TODO: Export PDF */}}
              className="text-white hover:text-gray-200 font-poppins"
            >
              Xuất PDF
            </Button>
            <IconButton onClick={() => setIsDetailModalOpen(false)} size="small" className="text-white hover:text-gray-200">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent className="p-6">
          {selectedPayroll && (
            <Grid container spacing={3} className="mt-2">
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" className="font-poppins">Thông tin cơ bản</Typography>
                <Box className="mt-2 space-y-2">
                  <Typography className="font-poppins">Nhân viên ID: {selectedPayroll.staffId}</Typography>
                  <Typography className="font-poppins">
                    Kỳ lương: Tháng {selectedPayroll.month + 1}/{selectedPayroll.year}
                  </Typography>
                  <Typography className="font-poppins">Số ngày làm việc: {selectedPayroll.workingDays} ngày</Typography>
                  <Typography className="font-poppins">Tổng giờ làm: {selectedPayroll.totalHours} giờ</Typography>
                  <Typography className="font-poppins">Giờ làm thêm: {selectedPayroll.overtime} giờ</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" className="font-poppins">Chi tiết lương</Typography>
                <Box className="mt-2 space-y-2">
                  <Typography className="font-poppins">Lương cơ bản: {formatCurrency(selectedPayroll.baseSalary)}</Typography>
                  <Typography className="font-poppins">Phụ cấp: {formatCurrency(selectedPayroll.allowance)}</Typography>
                  <Typography className="font-poppins">Thưởng: {formatCurrency(selectedPayroll.bonus)}</Typography>
                  <Typography className="font-poppins">Khấu trừ: {formatCurrency(selectedPayroll.deductions)}</Typography>
                  <Typography color="primary" fontWeight="bold" className="font-poppins">
                    Thực lĩnh: {formatCurrency(selectedPayroll.netSalary)}
                  </Typography>
                </Box>
              </Grid>
              {selectedPayroll.note && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" className="font-poppins">Ghi chú</Typography>
                  <Typography className="mt-1 font-poppins">{selectedPayroll.note}</Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions className="p-4">
          <Button 
            onClick={() => setIsDetailModalOpen(false)}
            className="font-poppins bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-xl"
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PayrollManagement;
