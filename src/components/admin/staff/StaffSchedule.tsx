import React, { useState } from 'react';
import {
  Paper,
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Add,
  Delete,
  Person,
} from '@mui/icons-material';
import { Staff, WorkSchedule, ScheduleStatus, Shift } from '@/types/staff';
import { formatDate } from '@/utils/format';

interface StaffScheduleProps {
  staff: Staff[];
}

const SHIFTS = [
  { id: 1, name: 'Ca sáng', startTime: '07:00', endTime: '11:00', color: '#4caf50' },
  { id: 2, name: 'Ca trưa', startTime: '11:00', endTime: '15:00', color: '#ff9800' },
  { id: 3, name: 'Ca tối', startTime: '15:00', endTime: '22:00', color: '#2196f3' },
];

interface ScheduleDialogProps {
  open: boolean;
  onClose: () => void;
  shift: typeof SHIFTS[0];
  date: Date;
  staff: Staff[];
  assignedStaff: number[];
  onAssign: (staffId: number) => void;
  onRemove: (staffId: number) => void;
}

const ScheduleDialog: React.FC<ScheduleDialogProps> = ({
  open,
  onClose,
  shift,
  date,
  staff,
  assignedStaff,
  onAssign,
  onRemove,
}) => {
  const [selectedStaff, setSelectedStaff] = useState<number>(0);

  const availableStaff = staff.filter(s => !assignedStaff.includes(s.id));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Sắp xếp lịch làm - {shift.name}
        <Typography variant="subtitle2" color="text.secondary">
          {formatDate(date)} ({shift.startTime} - {shift.endTime})
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Box className="space-y-4">
          {/* Thêm nhân viên mới */}
          <Box className="flex gap-2">
            <FormControl fullWidth size="small">
              <InputLabel>Chọn nhân viên</InputLabel>
              <Select
                value={selectedStaff}
                label="Chọn nhân viên"
                onChange={(e) => setSelectedStaff(Number(e.target.value))}
              >
                <MenuItem value={0}>-- Chọn nhân viên --</MenuItem>
                {availableStaff.map(s => (
                  <MenuItem key={s.id} value={s.id}>
                    ID: {s.userId} 
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={() => {
                if (selectedStaff) {
                  onAssign(selectedStaff);
                  setSelectedStaff(0);
                }
              }}
              disabled={!selectedStaff}
            >
              Thêm
            </Button>
          </Box>

          {/* Danh sách nhân viên đã phân công */}
          <List>
            {assignedStaff.map(staffId => {
              const staffMember = staff.find(s => s.id === staffId);
              if (!staffMember) return null;
              return (
                <ListItem key={staffId} divider>
                  <ListItemText
                    primary={`ID: ${staffMember.userId}`}
                    secondary={staffMember.position}
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      color="error"
                      onClick={() => onRemove(staffId)}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

const StaffSchedule: React.FC<StaffScheduleProps> = ({ staff }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduleDialog, setScheduleDialog] = useState<{
    open: boolean;
    shift: typeof SHIFTS[0];
    date: Date;
  } | null>(null);
  
  // Mock data - replace with actual schedule data
  const [schedules, setSchedules] = useState<Record<string, number[]>>({});

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Start from Monday

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const getScheduleKey = (date: Date, shiftId: number) => {
    return `${date.toISOString().split('T')[0]}-${shiftId}`;
  };

  const getAssignedStaff = (date: Date, shiftId: number) => {
    const key = getScheduleKey(date, shiftId);
    return schedules[key] || [];
  };

  const handleAssignStaff = (staffId: number) => {
    if (!scheduleDialog) return;
    const key = getScheduleKey(scheduleDialog.date, scheduleDialog.shift.id);
    setSchedules(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), staffId],
    }));
  };

  const handleRemoveStaff = (staffId: number) => {
    if (!scheduleDialog) return;
    const key = getScheduleKey(scheduleDialog.date, scheduleDialog.shift.id);
    setSchedules(prev => ({
      ...prev,
      [key]: prev[key]?.filter(id => id !== staffId) || [],
    }));
  };

  return (
    <Box>
      <Box className="mb-4 flex justify-between items-center">
        <Typography variant="h6">
          Lịch làm việc tuần {formatDate(getWeekDates()[0])} - {formatDate(getWeekDates()[6])}
        </Typography>
        <Box className="flex gap-2">
          <IconButton onClick={handlePreviousWeek}>
            <ChevronLeft />
          </IconButton>
          <IconButton onClick={handleNextWeek}>
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ca làm việc</TableCell>
              {getWeekDates().map((date) => (
                <TableCell key={date.toISOString()} align="center" style={{ minWidth: 150 }}>
                  <Typography variant="subtitle2">
                    {date.toLocaleDateString('vi-VN', { weekday: 'long' })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(date)}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {SHIFTS.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell>
                  <Typography variant="subtitle2" style={{ color: shift.color }}>
                    {shift.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {shift.startTime} - {shift.endTime}
                  </Typography>
                </TableCell>
                {getWeekDates().map((date) => {
                  const assignedStaff = getAssignedStaff(date, shift.id);
                  return (
                    <TableCell 
                      key={date.toISOString()} 
                      align="center"
                      onClick={() => setScheduleDialog({ open: true, shift, date })}
                      style={{ 
                        cursor: 'pointer',
                        backgroundColor: assignedStaff.length ? `${shift.color}10` : undefined,
                      }}
                    >
                      {assignedStaff.length > 0 ? (
                        <Box className="flex flex-wrap justify-center gap-1">
                          {assignedStaff.map(staffId => {
                            const staffMember = staff.find(s => s.id === staffId);
                            return (
                              <Tooltip 
                                key={staffId} 
                                title={`ID: ${staffMember?.userId}`}
                              >
                                <Avatar 
                                  sx={{ width: 24, height: 24, fontSize: '0.75rem' }}
                                >
                                  <Person />
                                </Avatar>
                              </Tooltip>
                            );
                          })}
                        </Box>
                      ) : (
                        <IconButton size="small">
                          <Add />
                        </IconButton>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {scheduleDialog && (
        <ScheduleDialog
          open={scheduleDialog.open}
          onClose={() => setScheduleDialog(null)}
          shift={scheduleDialog.shift}
          date={scheduleDialog.date}
          staff={staff}
          assignedStaff={getAssignedStaff(scheduleDialog.date, scheduleDialog.shift.id)}
          onAssign={handleAssignStaff}
          onRemove={handleRemoveStaff}
        />
      )}
    </Box>
  );
};

export default StaffSchedule;
