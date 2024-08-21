import { Role } from '../../../types/Employee'

export interface EmployeeDetail {
    employeeId: number;
    name: string;
    email: string;
    gender: string;
    phoneNumber: string;
    dateOfBirth: string;
    address: string;
    avatar: string;
    status: boolean;
    departmentName: string;  // Thay thế cho departmentId
    departmentId: number;
    role: Role;  // Sử dụng enum Role
}

