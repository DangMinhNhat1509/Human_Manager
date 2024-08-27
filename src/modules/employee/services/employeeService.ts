import { EmployeeDetail } from '../types/EmployeeDetail';
import { CreateEmployee } from '../types/CreateEmployee';
import { EmployeeListItem } from '../types/EmployeeListItem';
import { Role } from '../../../types/Employee';
import { HRMData } from '../../../types/HRMData';
import {Department} from '../../../types/Department';
const HRM_DATA_KEY = 'hrmData';

export const getHrmData = (): HRMData => {
    const data = localStorage.getItem(HRM_DATA_KEY);
    return data ? JSON.parse(data) : { employees: [], departments: [], actions: [], approvalLogs: [] };
};

export const saveHrmData = (data: HRMData) => {
    localStorage.setItem(HRM_DATA_KEY, JSON.stringify(data));
};

const getDepartmentIdByName = (departmentName: string): number | undefined => {
    const { departments } = getHrmData();
    const department = departments.find(dep => dep.departmentName === departmentName);
    return department ? department.departmentId : undefined;
};

export const getAllDepartments = async (): Promise<Department[]> =>{
    try {
        const {departments} = getHrmData();
        if (!Array.isArray(departments)){
            throw new Error('Invalid data format for departments');
        }

        return departments.map(dep => ({
            departmentId: dep.departmentId,
            departmentName: dep.departmentName,
            managerId: dep.managerId
        }));
    } catch(error) {
        console.error('Error fetching all departments', error);
        throw error;    
    }

    
    
}

// Fetch all employees
export const getAllEmployees = async (): Promise<EmployeeListItem[]> => {
    try {
        const { employees, departments } = getHrmData();
        if (!Array.isArray(employees) || !Array.isArray(departments)) {
            throw new Error('Invalid data format');
        }

        if (!employees.every(emp => 'employeeId' in emp) ||
            !departments.every(dept => 'departmentId' in dept && 'departmentName' in dept)) {
            throw new Error('Invalid employee or department object');
        }
        

        const result = employees.map(emp => {
            const department = departments.find(dept => dept.departmentId === emp.departmentId);
            return {
                ...emp,
                departmentName: department ? department.departmentName : 'Unknown'
            };
        });

        return result;
    } catch (error) {
        console.error('Error fetching all employees:', error);
        throw error;
    }
};

// Fetch employees by role
export const getEmployeesByRole = async (role: Role): Promise<EmployeeListItem[]> => {
    try {
        const employees: EmployeeListItem[] = await getAllEmployees();
        return employees.filter((employee: EmployeeListItem) => employee.role === role);
    } catch (error) {
        console.error('Error fetching employees by role:', error);
        throw error;
    }
};

// Fetch employee by ID
export const getEmployeeById = async (id: number): Promise<EmployeeDetail | null> => {
    try {
        const { employees, departments } = getHrmData();

        const employee = employees.find(emp => emp.employeeId === id);
        if (employee) {
            const department = departments.find(dept => dept.departmentId === employee.departmentId);
            return {
                ...employee,
                departmentName: department ? department.departmentName : 'Unknown',
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching employee by ID:', error);
        throw error;
    }
};

// Create a new employee
export const createEmployee = async (employee: CreateEmployee): Promise<void> => {
    console.log(typeof employee.departmentId);
    try {
        const { employees, departments, actions, approvalLogs } = getHrmData();
        
        if (employee.role !== Role.Employee) {
            throw new Error('Only employees with role "Employee" can be created.');
        }

        if (employee.departmentId && !departments.some(dep => dep.departmentId === employee.departmentId)) {
            throw new Error('Invalid department ID.');
        }

        const maxId = employees.length > 0 ? Math.max(...employees.map(e => e.employeeId)) : 0;
        const newEmployee = {
            ...employee,
            employeeId: maxId + 1,
        };

        employees.push(newEmployee);
        saveHrmData({ employees, departments, actions, approvalLogs });
    } catch (error) {
        console.error('Error creating employee:', error);
        throw error;
    }
};

// Update employee information
export const updateEmployee = async (
    id: number,
    updateData: Partial<Omit<EmployeeDetail, 'employeeId'>> & { departmentName?: string }
): Promise<void> => {
    try {
        const { employees, departments } = getHrmData();

        const employeeIndex = employees.findIndex(emp => emp.employeeId === id);
        if (employeeIndex === -1) {
            throw new Error('Employee not found.');
        }

        const employee = employees[employeeIndex];
        if (employee.role !== Role.Employee) {
            throw new Error('Only employees with role "Employee" can be updated.');
        }

        // Xử lý departmentName
        if (updateData.departmentName) {
            const departmentId = getDepartmentIdByName(updateData.departmentName);
            if (!departmentId) {
                throw new Error(`Department with name ${updateData.departmentName} not found.`);
            }
            // Cập nhật departmentId vào updateData
            updateData.departmentId = departmentId;
        }

        // Cập nhật nhân viên
        employees[employeeIndex] = { ...employee, ...updateData };
        saveHrmData({ employees, departments, actions: [], approvalLogs: [] });
    } catch (error) {
        console.error('Error updating employee:', error);
        throw error;
    }
};


// Delete employee
export const deleteEmployee = async (employeeId: number): Promise<void> => {
    try {
        const { employees, departments } = getHrmData();

        const employeeIndex = employees.findIndex(e => e.employeeId === employeeId);
        if (employeeIndex === -1) {
            throw new Error('Employee not found.');
        }

        const employee = employees[employeeIndex];
        if (employee.role !== Role.Employee) {
            throw new Error('Only employees with role "Employee" can be deleted.');
        }

        employees.splice(employeeIndex, 1);
        saveHrmData({ employees, departments, actions: [], approvalLogs: [] });
    } catch (error) {
        console.error('Error deleting employee:', error);
        throw error;
    }
};
