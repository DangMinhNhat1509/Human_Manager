import { EmployeeDetail } from '../types/EmployeeDetail';
import { Action } from '../types/Action';
import { RewardDisciplineListItem } from '../types/RewardDisciplineListItem';
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
        const hrmData = getHrmData();
        const { employees, departments, actions, approvalLogs } = hrmData;
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
        const hrmData = getHrmData();
        const { employees, departments, actions, approvalLogs } = hrmData;

        // Xóa nhân viên khỏi danh sách
        const updatedEmployees = employees.filter(e => e.employeeId !== employeeId);

        // Cập nhật dữ liệu vào localStorage
        localStorage.setItem(HRM_DATA_KEY, JSON.stringify({ employees: updatedEmployees, departments, actions, approvalLogs }));
    } catch (error) {
        console.error('Error deleting employee:', error);
        throw error;
    }
};

// Fetch all actions
export const getAllActions = async (): Promise<RewardDisciplineListItem[]> => {
    try {
        // Giả sử getHrmData() là một hàm để lấy dữ liệu từ nguồn nào đó
        const { actions } = getHrmData();

        // Kiểm tra xem `actions` có tồn tại trong `data` không
        if (actions) {
            // Ánh xạ dữ liệu từ Action sang RewardDisciplineListItem
            const mappedActions: RewardDisciplineListItem[] = actions.map((action: Action, index: number) => ({
                actionId: action.actionId,
                employeeId: action.employeeId,
                actionType: action.actionType,
                actionSubtype: action.actionSubtype,
                actionDate: action.actionDate,
                status: action.status,
                no: index + 1,  // Thêm thuộc tính `no` sau khi ánh xạ
            }));

            return mappedActions;
        } else {
            throw new Error('Actions not found in HRM data');
        }
    } catch (error: any) {
        console.error('Error fetching all actions:', error.message || error);
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
        const hrmData = getHrmData();
        const { actions, employees, departments, approvalLogs } = hrmData;

        // Tìm actionId cao nhất hiện có và tạo actionId mới cho action
        const maxId = actions.length > 0 ? Math.max(...actions.map(a => a.actionId)) : 0;
        const newAction: Action = {
            ...action,
            actionId: maxId + 1,  // Tạo actionId mới dựa trên actionId cao nhất hiện có
        };

        // Thêm action mới vào danh sách
        actions.push(newAction);

        // Cập nhật toàn bộ dữ liệu vào localStorage
        localStorage.setItem(HRM_DATA_KEY, JSON.stringify({
            employees,
            departments,
            actions,
            approvalLogs
        }));
    } catch (error) {
        console.error('Error creating action:', error);
        throw error;
    }
};

// Update action information
export const updateAction = async (id: number, updateData: Partial<Omit<Action, 'actionId'>>): Promise<void> => {
    try {
        const hrmData = getHrmData();
        const { actions, employees, departments, approvalLogs } = hrmData;

        const updatedActions = actions.map(act =>
            act.actionId === id ? { ...act, ...updateData } : act
        );
        localStorage.setItem(HRM_DATA_KEY, JSON.stringify({
            employees,
            departments,
            actions: updatedActions,
            approvalLogs
        }));
    } catch (error) {
        console.error('Error updating action:', error);
        throw error;
    }
};

// Delete action
export const deleteAction = async (id: number): Promise<void> => {
    try {
        const hrmData = getHrmData();
        const { actions, employees, departments, approvalLogs } = hrmData;

        const filteredActions = actions.filter(act => act.actionId !== id);
        localStorage.setItem(HRM_DATA_KEY, JSON.stringify({
            employees,
            departments,
            actions: filteredActions,
            approvalLogs
        }));
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
export const createApprovalLog = async (approvalLog: Omit<ApprovalLog, 'approvalLogId'>): Promise<void> => {
    try {
        const hrmData = getHrmData();
        const { approvalLogs, employees, departments, actions } = hrmData;

        // Tìm logId cao nhất hiện có và tạo logId mới cho approvalLog
        const maxId = approvalLogs.length > 0 ? Math.max(...approvalLogs.map(log => log.approvalLogId)) : 0;
        const newApprovalLog: ApprovalLog = {
            ...approvalLog,
            approvalLogId: maxId + 1,  // Tạo logId mới dựa trên logId cao nhất hiện có
        };

        // Thêm approvalLog mới vào danh sách
        approvalLogs.push(newApprovalLog);

        // Cập nhật toàn bộ dữ liệu vào localStorage
        localStorage.setItem(HRM_DATA_KEY, JSON.stringify({
            employees,
            departments,
            actions,
            approvalLogs
        }));
    } catch (error) {
        console.error('Error creating approval log:', error);
        throw error;
    }
};

// Update approval log information
export const updateApprovalLog = async (id: number, updateData: Partial<Omit<ApprovalLog, 'logId'>>): Promise<void> => {
    try {
        const hrmData = getHrmData();
        const { approvalLogs, employees, departments, actions } = hrmData;

        const updatedApprovalLogs = approvalLogs.map(log =>
            log.approvalLogId === id ? { ...log, ...updateData } : log
        );

        localStorage.setItem(HRM_DATA_KEY, JSON.stringify({
            employees,
            departments,
            actions,
            approvalLogs: updatedApprovalLogs
        }));
    } catch (error) {
        console.error('Error updating approval log:', error);
        throw error;
    }
};

// Delete approval log
export const deleteApprovalLog = async (id: number): Promise<void> => {
    try {
        const hrmData = getHrmData();
        const { approvalLogs, employees, departments, actions } = hrmData;

        const filteredApprovalLogs = approvalLogs.filter(log => log.approvalLogId !== id);

        localStorage.setItem(HRM_DATA_KEY, JSON.stringify({
            employees,
            departments,
            actions,
            approvalLogs: filteredApprovalLogs
        }));
    } catch (error) {
        console.error('Error deleting approval log:', error);
        throw error;
    }
};
