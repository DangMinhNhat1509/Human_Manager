import { EmployeeDetail } from '../types/EmployeeDetail';
import { Action } from '../types/Action';
import { ApprovalLog } from '../types/ApprovalLog';
import { Employee } from '../types/Employee';
import { Department } from '../types/Department';
import { HRMData } from '../types/HRMData';
import { CreateEmployee } from '../types/CreateEmployee';
import { EmployeeListItem } from '../types/EmployeeListItem';

const HRM_DATA_KEY = 'hrmData';

const getHrmData = (): HRMData => {
    const data = localStorage.getItem(HRM_DATA_KEY);
    return data ? JSON.parse(data) : { employees: [], departments: [], actions: [], approvalLogs: [] };
};

const getDepartmentIdByName = (departmentName: string): number | undefined => {
    const { departments } = getHrmData();
    const department = departments.find(dep => dep.departmentName === departmentName);
    return department ? department.departmentId : undefined;
};

// Fetch all employees
export const getAllEmployees = async (): Promise<EmployeeListItem[]> => {
    try {
        const { employees, departments } = getHrmData();

        // Log the data to inspect its structure
        console.log('Employees:', employees);
        console.log('Departments:', departments);

        if (!Array.isArray(employees) || !Array.isArray(departments)) {
            throw new Error('Invalid data format');
        }

        if (!employees.every(emp => 'employeeId' in emp && 'departmentId' in emp) ||
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
    try {
        const hrmData = getHrmData();
        const { employees, departments, actions, approvalLogs } = hrmData;

        // Tìm ID cao nhất hiện có và tạo ID mới cho nhân viên
        const maxId = employees.length > 0 ? Math.max(...employees.map(e => e.employeeId)) : 0;
        const newEmployee: Employee = {
            ...employee,
            employeeId: maxId + 1,  // Tạo ID mới dựa trên ID cao nhất hiện có
        };

        // Thêm nhân viên mới vào danh sách
        employees.push(newEmployee);

        // Cập nhật toàn bộ dữ liệu vào localStorage
        localStorage.setItem(HRM_DATA_KEY, JSON.stringify({
            employees,
            departments,
            actions,
            approvalLogs
        }));
    } catch (error) {
        console.error('Error creating employee:', error);
        throw error;
    }
};


// Update employee information
export const updateEmployee = async (
    id: number,
    updateData: Partial<Omit<EmployeeDetail, 'employeeId'>> & { departmentId?: number }
): Promise<void> => {
    try {
        const { employees, departments, actions, approvalLogs } = getHrmData();
        console.log('Data from getHrmData:', { employees, departments, actions, approvalLogs });

        // Chuyển đổi departmentName thành departmentId nếu có
        if (updateData.departmentName) {
            const departmentId = getDepartmentIdByName(updateData.departmentName);
            console.log('Department ID:', departmentId);

            if (departmentId) {
                updateData = { ...updateData, departmentId };
            } else {
                throw new Error(`Department with name ${updateData.departmentName} not found.`);
            }
        }

        console.log('Update Data:', updateData);

        // Kiểm tra dữ liệu nhân viên trước và sau khi cập nhật
        const updatedEmployees = employees.map(emp => {
            if (emp.employeeId === id) {
                console.log('Updating employee:', emp);
                return { ...emp, ...updateData };
            }
            return emp;
        });
        console.log('Updated Employees:', updatedEmployees);

        // Lưu dữ liệu vào localStorage
        localStorage.setItem(HRM_DATA_KEY, JSON.stringify({ employees: updatedEmployees, departments, actions, approvalLogs }));
        console.log('Data saved to localStorage:', JSON.parse(localStorage.getItem(HRM_DATA_KEY) || '{}'));

    } catch (error) {
        console.error('Error updating employee:', error);
        throw error;
    }
};




// Delete employee
export const deleteEmployee = async (employeeId: number): Promise<void> => {
    try {
        const { employees, departments } = getHrmData();

        // Xóa nhân viên khỏi danh sách
        const updatedEmployees = employees.filter(e => e.employeeId !== employeeId);

        // Cập nhật dữ liệu vào localStorage
        localStorage.setItem(HRM_DATA_KEY, JSON.stringify({ employees: updatedEmployees, departments }));
    } catch (error) {
        console.error('Error deleting employee:', error);
        throw error;
    }
};

// Fetch all actions
export const getAllActions = async (): Promise<Action[]> => {
    try {
        const { actions } = getHrmData();
        return actions;
    } catch (error) {
        console.error('Error fetching all actions:', error);
        throw error;
    }
};

// Fetch action by ID
export const getActionById = async (id: number): Promise<Action | null> => {
    try {
        const { actions } = getHrmData();
        return actions.find(action => action.actionId === id) || null;
    } catch (error) {
        console.error('Error fetching action by ID:', error);
        throw error;
    }
};

// Create a new action
export const createAction = async (action: Omit<Action, 'actionId'>): Promise<void> => {
    try {
        const { actions } = getHrmData();
        const newAction = { ...action, actionId: actions.length + 1 };
        actions.push(newAction);
        localStorage.setItem(HRM_DATA_KEY, JSON.stringify({ actions }));
    } catch (error) {
        console.error('Error creating action:', error);
        throw error;
    }
};

// Update action information
export const updateAction = async (id: number, updateData: Partial<Omit<Action, 'actionId'>>): Promise<void> => {
    try {
        const { actions } = getHrmData();
        const updatedActions = actions.map(act =>
            act.actionId === id ? { ...act, ...updateData } : act
        );
        localStorage.setItem(HRM_DATA_KEY, JSON.stringify({ actions: updatedActions }));
    } catch (error) {
        console.error('Error updating action:', error);
        throw error;
    }
};

// Delete action
export const deleteAction = async (id: number): Promise<void> => {
    try {
        const { actions } = getHrmData();
        const filteredActions = actions.filter(act => act.actionId !== id);
        localStorage.setItem(HRM_DATA_KEY, JSON.stringify({ actions: filteredActions }));
    } catch (error) {
        console.error('Error deleting action:', error);
        throw error;
    }
};

// Fetch all approval logs
export const getAllApprovalLogs = async (): Promise<ApprovalLog[]> => {
    try {
        const { approvalLogs } = getHrmData();
        return approvalLogs;
    } catch (error) {
        console.error('Error fetching all approval logs:', error);
        throw error;
    }
};

// Fetch approval log by ID
export const getApprovalLogById = async (id: number): Promise<ApprovalLog | null> => {
    try {
        const { approvalLogs } = getHrmData();
        return approvalLogs.find(log => log.approvalLogId === id) || null;
    } catch (error) {
        console.error('Error fetching approval log by ID:', error);
        throw error;
    }
};

// Create a new approval log
export const createApprovalLog = async (log: Omit<ApprovalLog, 'approvalLogId'>): Promise<void> => {
    try {
        const { approvalLogs } = getHrmData();
        const newLog = { ...log, approvalLogId: approvalLogs.length + 1 };
        approvalLogs.push(newLog);
        localStorage.setItem(HRM_DATA_KEY, JSON.stringify({ approvalLogs }));
    } catch (error) {
        console.error('Error creating approval log:', error);
        throw error;
    }
};

// Update approval log information
export const updateApprovalLog = async (id: number, updateData: Partial<Omit<ApprovalLog, 'approvalLogId'>>): Promise<void> => {
    try {
        const { approvalLogs } = getHrmData();
        const updatedLogs = approvalLogs.map(log =>
            log.approvalLogId === id ? { ...log, ...updateData } : log
        );
        localStorage.setItem(HRM_DATA_KEY, JSON.stringify({ approvalLogs: updatedLogs }));
    } catch (error) {
        console.error('Error updating approval log:', error);
        throw error;
    }
};

// Delete approval log
export const deleteApprovalLog = async (id: number): Promise<void> => {
    try {
        const { approvalLogs } = getHrmData();
        const filteredLogs = approvalLogs.filter(log => log.approvalLogId !== id);
        localStorage.setItem(HRM_DATA_KEY, JSON.stringify({ approvalLogs: filteredLogs }));
    } catch (error) {
        console.error('Error deleting approval log:', error);
        throw error;
    }
};
