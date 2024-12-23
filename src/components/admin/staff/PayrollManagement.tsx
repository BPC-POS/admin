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
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Tháng</InputLabel>
            <Select
              value={selectedMonth}
              label="Tháng"
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i} value={i}>
                  Tháng {i + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Năm</InputLabel>
            <Select
              value={selectedYear}
              label="Năm"
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return (
                  <MenuItem key={year} value={year}>
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
        >
          Tính lương
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nhân viên</TableCell>
              <TableCell align="center">Ngày công</TableCell>
              <TableCell align="right">Lương cơ bản</TableCell>
              <TableCell align="right">Phụ cấp</TableCell>
              <TableCell align="right">Thưởng</TableCell>
              <TableCell align="right">Khấu trừ</TableCell>
              <TableCell align="right">Thực lĩnh</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payrollRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  <Typography variant="subtitle2">
                    ID: {record.staffId}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  {record.workingDays} ngày
                  <Typography variant="caption" display="block" color="text.secondary">
                    ({record.totalHours} giờ)
                  </Typography>
                </TableCell>
                <TableCell align="right">{formatCurrency(record.baseSalary)}</TableCell>
                <TableCell align="right">{formatCurrency(record.allowance)}</TableCell>
                <TableCell align="right">{formatCurrency(record.bonus)}</TableCell>
                <TableCell align="right">{formatCurrency(record.deductions)}</TableCell>
                <TableCell align="right">
                  <Typography color="primary" fontWeight="bold">
                    {formatCurrency(record.netSalary)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={getStatusLabel(record.status)}
                    color={getStatusColor(record.status)}
                    size="small"
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
      >
        <DialogTitle className="flex justify-between items-center">
          Chi tiết bảng lương
          <Button
            startIcon={<PictureAsPdf />}
            onClick={() => {/* TODO: Export PDF */}}
          >
            Xuất PDF
          </Button>
        </DialogTitle>
        <DialogContent>
          {selectedPayroll && (
            <Grid container spacing={3} className="mt-2">
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Thông tin cơ bản</Typography>
                <Box className="mt-2 space-y-2">
                  <Typography>Nhân viên ID: {selectedPayroll.staffId}</Typography>
                  <Typography>
                    Kỳ lương: Tháng {selectedPayroll.month + 1}/{selectedPayroll.year}
                  </Typography>
                  <Typography>Số ngày làm việc: {selectedPayroll.workingDays} ngày</Typography>
                  <Typography>Tổng giờ làm: {selectedPayroll.totalHours} giờ</Typography>
                  <Typography>Giờ làm thêm: {selectedPayroll.overtime} giờ</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Chi tiết lương</Typography>
                <Box className="mt-2 space-y-2">
                  <Typography>Lương cơ bản: {formatCurrency(selectedPayroll.baseSalary)}</Typography>
                  <Typography>Phụ cấp: {formatCurrency(selectedPayroll.allowance)}</Typography>
                  <Typography>Thưởng: {formatCurrency(selectedPayroll.bonus)}</Typography>
                  <Typography>Khấu trừ: {formatCurrency(selectedPayroll.deductions)}</Typography>
                  <Typography color="primary" fontWeight="bold">
                    Thực lĩnh: {formatCurrency(selectedPayroll.netSalary)}
                  </Typography>
                </Box>
              </Grid>
              {selectedPayroll.note && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Ghi chú</Typography>
                  <Typography className="mt-1">{selectedPayroll.note}</Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDetailModalOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PayrollManagement;
