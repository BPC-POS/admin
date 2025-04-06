import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
} from '@mui/icons-material';
import { Staff, Shift } from '@/types/staff';
import { formatDate } from '@/utils/format';
import { updateEmployeeById, getEmployees } from '@/api/employee';
import { getShifts, createShift, updateShift, deleteShift } from '@/api/shift';

interface StaffScheduleProps {
  staff: Staff[];
  onStaffUpdate: (updatedStaffList: Staff[]) => void;
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
  employee: Staff;
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

  const availableStaff = staff.filter(s => s.id !== undefined && !assignedStaff.includes(s.id));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: "bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg"
      }}
    >
      <DialogTitle className="flex justify-between items-center bg-gradient-to-r from-[#2C3E50] to-[#3498DB] text-white p-4 rounded-t-2xl">
        <div>
          <Typography variant="h6" className="font-poppins">Sắp xếp lịch làm - {shift.name}</Typography>
          <Typography variant="subtitle2" className="font-poppins text-gray-200">
            {formatDate(date)} ({shift.startTime} - {shift.endTime})
          </Typography>
        </div>
      </DialogTitle>
      <DialogContent dividers className="p-6">
        <Box className="space-y-4">
          <Box className="flex gap-2">
            <FormControl fullWidth size="small" className="font-poppins">
              <InputLabel>Chọn nhân viên</InputLabel>
              <Select
                value={selectedStaff}
                label="Chọn nhân viên"
                onChange={(e) => setSelectedStaff(Number(e.target.value))}
              >
                <MenuItem value={0} className="font-poppins">-- Chọn nhân viên --</MenuItem>
                {availableStaff.map(s => (
                  <MenuItem key={s.id} value={s.id} className="font-poppins">
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={() => {
                if (selectedStaff) {
                  onAssign(selectedStaff as number);
                  setSelectedStaff(0);
                }
              }}
              disabled={!selectedStaff}
              className="bg-gradient-to-br from-[#2C3E50] to-[#3498DB] hover:to-blue-500 font-poppins"
            >
              Thêm
            </Button>
          </Box>

          <List>
            {assignedStaff.map(staffId => {
              const staffMember = staff.find(s => s.id === staffId);
              if (!staffMember) return null;
              return (
                <ListItem key={staffId} divider className="font-poppins">
                  <ListItemText
                    primary={staffMember?.name}
                    secondary={`ID: ${staffMember?.id}`}
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
      <DialogActions className="p-4">
        <Button onClick={onClose} className="font-poppins">Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};


const StaffSchedule = ({ staff, onStaffUpdate }: StaffScheduleProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduleDialog, setScheduleDialog] = useState<
    {
      open: boolean;
      shift: typeof SHIFTS[0];
      date: Date;
      employee: Staff;
    } | null
  >(null);
  const [, setIsLoadingSchedule] = useState<boolean>(false);
  const [shiftsData, setShiftsData] = useState<Shift[]>([]);

  useEffect(() => {
    const fetchShifts = async () => {
      setIsLoadingSchedule(true);
      try {
        const response = await getShifts();
        if (response.status === 200) {
          setShiftsData(response.data);
        } else {
          console.error("Failed to fetch shifts:", response.status);
        }
      } catch (error) {
        console.error("Error fetching shifts:", error);
      } finally {
        setIsLoadingSchedule(false);
      }
    };

    fetchShifts();
  }, []);

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);

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

  const getAssignedStaffIdsForShift = (date: Date, shiftId: number): number[] => {
    const dateString = date.toISOString().split('T')[0];
    const assignedShifts = shiftsData?.filter(
      (shift: Shift) => formatDate(new Date(shift.start_time)) === dateString && shift.meta?.shiftId === shiftId
    ) || [];

  return assignedShifts.map(shift => shift.employee_id);
};


  const handleAssignStaff = async (selectedStaffId: number) => {
    if (!scheduleDialog) return;
    setIsLoadingSchedule(true);
    try {
      const dateString = scheduleDialog.date.toISOString().split('T')[0];
      const shift = scheduleDialog.shift;
      const employeeToUpdate = staff.find(s => s.id === selectedStaffId);

      if (!employeeToUpdate) {
        console.error("Employee not found for ID:", selectedStaffId);
        return; 
      }

      const newShift: Shift = {
        employee_id: employeeToUpdate.id as number,
        start_time: new Date(`${dateString}T${shift.startTime}:00`).toISOString(),
        end_time: new Date(`${dateString}T${shift.endTime}:00`).toISOString(),
        meta: {
          shiftId: shift.id,
          additionalData: {}
        }
      };

      const response = await createShift(newShift);
      
      if (response.status === 201) { 
        const updatedShiftsListResponse = await getShifts();
        if (updatedShiftsListResponse.status === 200) {
          setShiftsData(updatedShiftsListResponse.data);
        } else {
          console.error("Failed to refresh shifts after creating:", updatedShiftsListResponse.status);
        }
        const updatedStaffListResponse = await getEmployees();
        if (updatedStaffListResponse.status === 200) {
          onStaffUpdate(updatedStaffListResponse.data);
        } else {
          console.error("Failed to refresh staff list after creating shift");
        }
        setScheduleDialog(null);
      } else {
        console.error("Failed to create shift:", response.status);
      }
    } catch (error) {
      console.error("Error assigning staff to shift:", error);
    } finally {
      setIsLoadingSchedule(false);
    }
  };

  const handleRemoveStaff = async () => {
    if (!scheduleDialog) return;
    setIsLoadingSchedule(true);
    try {
      const dateString = scheduleDialog.date.toISOString().split('T')[0];
      const shiftToRemove = scheduleDialog.shift;
      const employeeToRemove = scheduleDialog.employee; 

      const shiftToDelete = shiftsData.find(
        (shift: Shift) => 
          formatDate(new Date(shift.start_time)) === dateString && 
          shift.meta?.shiftId === shiftToRemove.id &&
          shift.employee_id === employeeToRemove.id
      );

      if (shiftToDelete && shiftToDelete.id) {
        const response = await deleteShift(shiftToDelete.id);
        if (response.status === 204 || response.status === 200) { 
          const updatedShiftsListResponse = await getShifts();
          if (updatedShiftsListResponse.status === 200) {
            setShiftsData(updatedShiftsListResponse.data);
          } else {
            console.error("Failed to refresh shifts after deleting:", updatedShiftsListResponse.status);
          }
          const updatedStaffListResponse = await getEmployees();
          if (updatedStaffListResponse.status === 200) {
            onStaffUpdate(updatedStaffListResponse.data);
          } else {
            console.error("Failed to refresh staff list after deleting shift");
          }
          setScheduleDialog(null);
        } else {
          console.error("Failed to delete shift:", response.status);
        }
      } else {
        console.warn("No shift found to delete");
        setScheduleDialog(null); 
      }

    } catch (error) {
      console.error("Error removing staff from shift:", error);
    } finally {
      setIsLoadingSchedule(false);
    }
  };



  const getAssignedStaffForCell = (date: Date, shift: typeof SHIFTS[0]) => {
    const assignedStaffIds = getAssignedStaffIdsForShift(date, shift.id);
    return staff.filter(emp => assignedStaffIds.includes(emp.id as number));
  }


  return (
    <Box>
      <Box className="mb-4 flex justify-between items-center">
        <Typography variant="h6" className="font-poppins text-black">
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

      <TableContainer component={Paper} className="font-poppins mb-6 bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-lg">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="font-poppins">Ca làm việc</TableCell>
              {getWeekDates().map((date) => (
                <TableCell key={date.toISOString()} align="center" className="font-poppins" style={{ minWidth: 150 }}>
                  <Typography variant="subtitle2" className="font-poppins">
                    {date.toLocaleDateString('vi-VN', { weekday: 'long' })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className="font-poppins">
                    {date.toLocaleDateString('vi-VN')}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {SHIFTS.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell className="font-poppins">
                  <Typography variant="subtitle2" style={{ color: shift.color }} className="font-poppins">
                    {shift.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" className="font-poppins">
                    {shift.startTime} - {shift.endTime}
                  </Typography>
                </TableCell>
                {getWeekDates().map((date) => {
                  const assignedStaffForCell = getAssignedStaffForCell(date, shift);
                  const assignedStaffIds = getAssignedStaffIdsForShift(date, shift.id);

                  return (
                    <TableCell
                      key={date.toISOString()}
                      align="center"
                      onClick={() => {
                        const firstStaffMember = staff.length > 0 ? staff[0] : undefined;
                        if (firstStaffMember) {
                          setScheduleDialog({ open: true, shift, date, employee: firstStaffMember });
                        } else {
                          console.warn("Không có nhân viên nào để lên lịch.");
                        }
                      }}
                      className="font-poppins cursor-pointer"
                      style={{
                        backgroundColor: assignedStaffForCell.length ? `${shift.color}10` : undefined,
                      }}
                    >
                      {assignedStaffForCell.length > 0 ? (
                        <Box className="flex flex-wrap justify-center gap-1">
                          {assignedStaffForCell.map(staffMember => (
                            <Tooltip
                              key={staffMember.id}
                              title={staffMember?.name}
                            >
                              <Avatar
                                sx={{ width: 24, height: 24, fontSize: '0.75rem' }}
                              >
                                {staffMember?.name[0]}
                              </Avatar>
                            </Tooltip>
                          ))}
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
          assignedStaff={getAssignedStaffIdsForShift(scheduleDialog.date, scheduleDialog.shift.id)}
          employee={scheduleDialog.employee}
          onAssign={handleAssignStaff}
          onRemove={handleRemoveStaff}
        />
      )}
    </Box>
  );
};

export default StaffSchedule;