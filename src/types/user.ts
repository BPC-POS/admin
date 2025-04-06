export interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  email: string;
  phone_number: string;
  gender: gender;
  day_of_birth: string;
  name: string;
  password?: string;
  status: number;
  firebase_token?: string;
}

export interface Member {
  id?: number;
  name: string;
  email: string;
  phone_number: string;
  status: number;
  createdAt?: Date;
  updatedAt?: Date;
  gender: gender;
  day_of_birth: string;
  password: string;
  avatar?: string;
  token?: string;
  first_login?: boolean;
  meta?: Record<string, unknown>;
}

export enum UserRole {
  ADMIN = 1,     
  STAFF = 2,     
  CASHIER = 3,   
  WAITER = 4,    
  CUSTOMER = 5   
}

export enum UserStatus {
  ACTIVE = 1,    
  INACTIVE = 2, 
  BANNED = 3,    
  PENDING = 4   
}

export interface CreateUserDTO {
  phone_number?: string;
  status: UserStatus;
  email: string;
  password: string;
  name: string;
  gender?: gender;
  day_of_birth?: string;
  role?: UserRole;
}

export interface UpdateUserDTO {
  email: string;
  name: string;
  phone_number: string;
  gender: gender;
  day_of_birth: string;
  status: UserStatus;
  role?: UserRole;
}

export interface UserFilter {
  search?: string;
  role?: UserRole; 
  status?: UserStatus; 
  startDate?: Date;
  endDate?: Date;
}

export enum gender {
  man = 1,
  girl = 2,
  other = 3
}