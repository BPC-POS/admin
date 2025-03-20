import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Typography,
  Autocomplete,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { Staff, StaffStatus, Role } from '@/types/staff';
import { Member } from '@/types/user';
import { getMembers } from '@/api/member';
import { getRole } from '@/api/role'; 

interface StaffModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Staff>) => void;
  editItem?: Staff;
  isLoading?: boolean;
}

const initialFormState: Partial<Staff> = {
  name: '',
  email: '',
  phone_number: '',
  role_id: undefined, 
  status: StaffStatus.ACTIVE,
  member_id: undefined,
};

const StaffModal: React.FC<StaffModalProps> = ({
  open,
  onClose,
  onSubmit,
  editItem,
  isLoading,
}) => {
  const [formData, setFormData] = useState<Partial<Staff>>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [members, setMembers] = useState<Member[]>([]);
  const [memberSearchValue, setMemberSearchValue] = useState<string>('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [roles, setRoles] = useState<Role[]>([]); 

  useEffect(() => {
    if (editItem) {
      setFormData({
        ...editItem,
        role_id: editItem.role_id 
      });
      setSelectedMember((editItem.member as unknown as Member) || null);
    } else {
      setFormData(initialFormState);
      setSelectedMember(null);
    }
    setErrors({});
  }, [editItem]);

  const fetchMembersData = useCallback(async () => {
    try {
      const response = await getMembers();
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  }, []);

  const fetchRolesData = useCallback(async () => { // Hàm fetch roles
    try {
      const response = await getRole();
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchMembersData();
      fetchRolesData(); // Gọi fetch roles khi modal mở
    }
  }, [open, fetchMembersData, fetchRolesData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Tên không được để trống';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.phone_number?.trim()) {
      newErrors.phone_number = 'Số điện thoại không được để trống';
    } else if (!/^\d{10,11}$/.test(formData.phone_number.replace(/[-\s]/g, ''))) {
      newErrors.phone_number = 'Số điện thoại không hợp lệ (10-11 chữ số)';
    }
    if (formData.role_id === undefined) {
      newErrors.role_id = 'Vị trí không được để trống';
    }
    if (selectedMember === null && !editItem) {
      newErrors.member_id = 'Member không được để trống';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        member_id: selectedMember?.id,
      });
    }
  };

  const getStatusLabel = (status: StaffStatus) => {
    const labels: Record<StaffStatus, string> = {
      [StaffStatus.ACTIVE]: 'Hoạt động',
      [StaffStatus.INACTIVE]: 'Không hoạt động',
    };
    return labels[status];
  };

  const handleMemberChange = (event: React.SyntheticEvent<Element, Event>, value: Member | null) => {
    setSelectedMember(value);
    setFormData({ ...formData, member_id: value?.id });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className="font-poppins"
      PaperProps={{
        className: "bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg"
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle className="flex justify-between items-center bg-gradient-to-r from-[#2C3E50] to-[#3498DB] text-white p-4 rounded-t-2xl">
          <span className="text-xl font-bold">
            {editItem ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên'}
          </span>
          <IconButton onClick={onClose} size="small" className="text-white hover:text-gray-200">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers className="p-6">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên nhân viên"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={!!errors.name}
                helperText={errors.name}
                required
                className="font-poppins"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={!!errors.email}
                helperText={errors.email}
                className="font-poppins"
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                value={formData.phone_number || ''}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                error={!!errors.phone_number}
                helperText={errors.phone_number}
                className="font-poppins"
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.role_id}>
                <InputLabel id="role-id-label" className="font-poppins">Vị trí</InputLabel>
                <Select
                  labelId="role-id-label"
                  id="role-id-select"
                  value={formData.role_id === undefined ? '' : formData.role_id}
                  label="Vị trí"
                  onChange={(e) => setFormData({ ...formData, role_id: Number(e.target.value) })} // Lưu role_id là number
                  className="font-poppins"
                >
                  {roles.map((role) => ( // Map qua danh sách roles từ API
                    <MenuItem key={role.id} value={role.id} className="font-poppins">
                      {role.name} {/* Hiển thị role.name */}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.role_id && <Typography variant="caption" color="error" className="font-poppins">{errors.role_id}</Typography>}
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.status}>
                <InputLabel id="status-label" className="font-poppins">Trạng thái</InputLabel>
                <Select
                  labelId="status-label"
                  id="status-select"
                  value={formData.status === undefined ? '' : formData.status}
                  label="Trạng thái"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as StaffStatus })}
                  className="font-poppins"
                >
                  {Object.values(StaffStatus).map((status) => (
                    <MenuItem key={status} value={status} className="font-poppins">
                      {getStatusLabel(status as StaffStatus)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.status && <Typography variant="caption" color="error" className="font-poppins">{errors.status}</Typography>}
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.member_id}>
                <Autocomplete
                  id="member-autocomplete"
                  options={members}
                  getOptionLabel={(option) => option.email || ''} // Display email in autocomplete
                  value={selectedMember}
                  onChange={handleMemberChange}
                  inputValue={memberSearchValue}
                  onInputChange={(event, newInputValue) => {
                    setMemberSearchValue(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Member (Email)"
                      error={!!errors.member_id}
                      helperText={errors.member_id}
                      required
                      className="font-poppins"
                    />
                  )}
                />
              </FormControl>
              {errors.member_id && <Typography variant="caption" color="error" className="font-poppins">{errors.member_id}</Typography>}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions className="p-4">
          <Button
            onClick={onClose}
            className="font-poppins bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-xl"
          >Hủy</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            className="bg-gradient-to-br from-[#2C3E50] to-[#3498DB] hover:to-blue-500 text-white font-bold py-2 px-6 rounded-xl font-poppins transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {isLoading ? 'Đang xử lý...' : editItem ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StaffModal;