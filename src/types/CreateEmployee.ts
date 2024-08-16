import {Role} from './Employee'

export interface CreateEmployee {
    name: string;
    email: string;
    gender: string;
    phoneNumber: string;
    dateOfBirth: string;
    address: string;
    avatar: string;
    status: boolean;
    departmentId: number;
    role: Role;  // Sử dụng enum Role
}