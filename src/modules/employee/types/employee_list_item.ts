import { Role } from '../../../types/employee'
export interface EmployeeListItem {
    employeeId: number;
    name: string;
    email: string;
    gender: string;
    phoneNumber: string;
    departmentId: number;
    departmentName: string;
    role: Role;
}

