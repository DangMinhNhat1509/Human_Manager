import { message } from 'antd'; 
import { EmployeeDetail } from '../types/employee_detail';
import { CreateEmployee } from '../types/create_employee';
import { EmployeeListItem } from '../types/employee_list_item';
import { Role } from '../../../types/employee';
import { HRMData } from '../../../types/hrm_data';
import { Department } from '../../../types/department';

const HRM_DATA_KEY = 'hrmData';

export const getHrmData = (): HRMData => {
    const data = localStorage.getItem(HRM_DATA_KEY);
    return data ? JSON.parse(data) : { employees: [], departments: [], actions: [], approvalLogs: [] };
};

export const saveHrmData = (data: HRMData) => {
    localStorage.setItem(HRM_DATA_KEY, JSON.stringify(data));
};

export const getAllDepartments = async (): Promise<Department[]> => {
    try {
        const { departments } = getHrmData();
        if (!Array.isArray(departments)) {
            throw new Error('Dữ liệu phòng ban không hợp lệ');
        }

        return departments.map(dep => ({
            departmentId: dep.departmentId,
            departmentName: dep.departmentName,
            managerId: dep.managerId
        }));
    } catch (error) {
        message.error('Lỗi khi lấy danh sách phòng ban');
        throw error;
    }
};

// Fetch all employees
export const getAllEmployees = async (): Promise<EmployeeListItem[]> => {
    try {
        const { employees, departments } = getHrmData();
        if (!Array.isArray(employees) || !Array.isArray(departments)) {
            throw new Error('Dữ liệu nhân viên hoặc phòng ban không hợp lệ');
        }

        if (!employees.every(emp => 'employeeId' in emp) ||
            !departments.every(dept => 'departmentId' in dept && 'departmentName' in dept)) {
            throw new Error('Dữ liệu nhân viên hoặc phòng ban không hợp lệ');
        }

        const result = employees.map(emp => {
            const department = departments.find(dept => dept.departmentId === emp.departmentId);
            return {
                ...emp,
                departmentName: department ? department.departmentName : 'Chưa xác định'
            };
        });

        return result;
    } catch (error) {
        message.error('Lỗi khi lấy danh sách nhân viên');
        throw error;
    }
};

// Fetch employees by role
export const getEmployeesByRole = async (role: Role): Promise<EmployeeListItem[]> => {
    try {
        const employees: EmployeeListItem[] = await getAllEmployees();
        return employees.filter((employee: EmployeeListItem) => employee.role === role);
    } catch (error) {
        message.error('Lỗi khi lấy nhân viên theo vai trò');
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
                departmentName: department ? department.departmentName : 'Chưa xác định',
            };
        } else {
            return null;
        }
    } catch (error) {
        message.error('Lỗi khi lấy thông tin nhân viên theo ID');
        throw error;
    }
};

// Create a new employee
export const createEmployee = async (employee: CreateEmployee): Promise<void> => {
    try {
        const { employees, departments } = getHrmData();

        if (employee.role !== Role.Employee) {
            throw new Error('Chỉ nhân viên với vai trò "Employee" mới có thể được tạo.');
        }

        if (!employee.departmentId || !departments.some(dep => dep.departmentId === employee.departmentId)) {
            throw new Error('ID phòng ban không hợp lệ.');
        }

        const maxId = employees.length > 0 ? Math.max(...employees.map(e => e.employeeId)) : 0;
        const newEmployee = {
            ...employee,
            employeeId: maxId + 1,
        };

        employees.push(newEmployee);
        saveHrmData({ ...getHrmData(), employees });
    } catch (error) {
        message.error('Lỗi khi tạo nhân viên mới');
        throw error;
    }
};

// Update employee information
export const updateEmployee = async (id: number, updateData: Partial<Omit<EmployeeDetail, 'employeeId'>>): Promise<void> => {
    try {
        const { employees, departments } = getHrmData();

        const employeeIndex = employees.findIndex(emp => emp.employeeId === id);
        if (employeeIndex === -1) {
            throw new Error('Nhân viên không tìm thấy.');
        }

        const employee = employees[employeeIndex];
        if (employee.role !== Role.Employee) {
            throw new Error('Chỉ nhân viên với vai trò "Employee" mới có thể được cập nhật.');
        }

        if (updateData.departmentId && !departments.some(dep => dep.departmentId === updateData.departmentId)) {
            throw new Error('ID phòng ban không hợp lệ.');
        }

        // Cập nhật nhân viên
        employees[employeeIndex] = { ...employee, ...updateData };
        saveHrmData({ ...getHrmData(), employees });
    } catch (error) {
        message.error('Lỗi khi cập nhật thông tin nhân viên');
        throw error;
    }
};

// Delete employee
export const deleteEmployee = async (employeeId: number): Promise<void> => {
    try {
        const { employees } = getHrmData();

        const employeeIndex = employees.findIndex(e => e.employeeId === employeeId);
        if (employeeIndex === -1) {
            throw new Error('Nhân viên không tìm thấy.');
        }

        const employee = employees[employeeIndex];
        if (employee.role !== Role.Employee) {
            throw new Error('Chỉ nhân viên với vai trò "Employee" mới có thể bị xóa.');
        }

        employees.splice(employeeIndex, 1);
        saveHrmData({ ...getHrmData(), employees });
    } catch (error) {
        message.error('Lỗi khi xóa nhân viên');
        throw error;
    }
};
