export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Member {
  id?: number;
  email: string;
  phone_number: string;
  gender: number; 
  day_of_birth: string;
  name: string;
  password?: string; 
  status: number; 
  createdAt?: Date;
  updatedAt?: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
  CASHIER = 'cashier',
  WAITER = 'waiter',
  CUSTOMER = 'customer'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
  PENDING = 'pending'
}

export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
}

export interface UpdateUserDTO {
  email?: string;
  fullName?: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UserFilter {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  startDate?: Date;
  endDate?: Date;
}
