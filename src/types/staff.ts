export interface Staff {
  id?: number; 
  createdAt?: string; 
  updatedAt?: string; 
  name: string;       
  email: string;       
  phone_number: string; 
  role_id?: StaffPosition | null; 
  status?: StaffStatus;     
  meta?: any;        
  member_id?: number;   
  shifts?: number[];   
  member?: any;       
  position?: StaffPosition; 
  department?: Department; 
  startDate?: string | Date;
  userId?: string | number; 
}


export enum StaffPosition {
  MANAGER = 1,
  SUPERVISOR = 2,
  BARISTA = 3,
  WAITER = 4,
  CASHIER = 5,
}

export enum Department {
  COFFEE_BAR = 1,
  KITCHEN = 2,
  SERVICE = 3,
  CASHIER = 4,
}

export enum StaffStatus {
  ACTIVE = 1,
  INACTIVE = 0,
}

export interface WorkSchedule {
  id: number;
  staffId: number;
  date: Date;
  shift: Shift;
  status: ScheduleStatus;
  note?: string;
}

export interface Shift {
  id: number;
  name: string;
  startTime: string; 
  endTime: string;
  requiredStaff: number;
}

export enum ScheduleStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  ABSENT = 'absent',
  ON_LEAVE = 'on_leave',
}

export interface LeaveRequest {
  id: number;
  staffId: number;
  type: LeaveType;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: LeaveStatus;
  approvedBy?: number;
  approvedAt?: Date;
  note?: string;
}

export enum LeaveType {
  ANNUAL = 'annual',
  SICK = 'sick',
  PERSONAL = 'personal',
  OTHER = 'other',
}

export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export interface ShiftAssignment {
  id: number;
  staffId: number;
  shiftId: number;
  date: Date;
  status: ShiftStatus;
  checkin?: Date;
  checkout?: Date;
  note?: string;
}

export enum ShiftStatus {
  PENDING = 'pending',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  MISSED = 'missed',
}

export interface PayrollRecord {
  id: number;
  staffId: number;
  month: number;
  year: number;
  workingDays: number;
  totalHours: number;
  overtime: number;
  baseSalary: number;
  allowance: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  status: PayrollStatus;
  note?: string;
}

export enum PayrollStatus {
  DRAFT = 'draft',
  APPROVED = 'approved',
  PAID = 'paid',
}
