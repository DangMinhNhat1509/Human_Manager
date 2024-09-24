export interface Employee {
    employeeId: number;
    name: string;
    email: string;
    gender: string;
    phoneNumber: string;
    dateOfBirth: string;
    address: string;
    avatar: string;
    status: boolean;
    departmentId: number;
    role: Role;  
}

export enum Role {
    Manager = 'Manager',
    Employee = 'Employee',
    HR = 'HR',
    Director = 'Director'
}
