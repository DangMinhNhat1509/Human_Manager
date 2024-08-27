import { Role } from '../types/Employee'; // Import enum Role
import { getEmployeeById } from '../modules/employee/services/employeeService';

// Lưu thông tin người dùng vào localStorage
export const setUserRole = (role: Role): void => {
    localStorage.setItem('currentUserRole', role);
};

export const setUserId = (id: number): void => {
    localStorage.setItem('currentUserId', id.toString());
};

// Lấy thông tin người dùng từ localStorage
export const getCurrentUserRole = (): Role => {
    const role = localStorage.getItem('currentUserRole');
    if (role && Object.values(Role).includes(role as Role)) {
        return role as Role;
    }
    throw new Error('Role không hợp lệ được tìm thấy trong localStorage');
};


export const getCurrentUserDepartmentId = async (): Promise<number> => {
    const userId = getCurrentUserId();
    console.log(userId);
    const employeeDetail = await getEmployeeById(userId);
    if (employeeDetail && employeeDetail.departmentId) {
        return employeeDetail.departmentId;
    }
    throw new Error('Không thể tìm thấy department cho user');
};

export const getCurrentUserId = (): number => {
    const id = localStorage.getItem('currentUserId');
    if (id) {
        const parsedId = parseInt(id, 10);
        if (!isNaN(parsedId)) {
            return parsedId;
        }
    }
    throw new Error('User ID không hợp lệ được tìm thấy trong localStorage');
};

// Xóa thông tin người dùng khỏi localStorage
export const clearUserData = (): void => {
    localStorage.removeItem('currentUserRole');
    localStorage.removeItem('currentUserId');
};
