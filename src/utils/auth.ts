import { message } from 'antd';
import { Role } from '../types/employee';
import { getEmployeeById } from '../modules/employee/services/employee_service';

// Lưu thông tin người dùng vào sessionStorage
export const setUserRole = (role: Role): void => {
    sessionStorage.setItem('currentUserRole', role);
};

// Lưu ID người dùng vào sessionStorage
export const setUserId = (id: number): void => {
    sessionStorage.setItem('currentUserId', id.toString());
};

// Lấy thông tin vai trò người dùng từ sessionStorage
export const getCurrentUserRole = (): Role | undefined => {
    try {
        const role = sessionStorage.getItem('currentUserRole');
        if (role && Object.values(Role).includes(role as Role)) {
            return role as Role;
        }
        return undefined;
    } catch (error) {
        message.error('Lỗi khi lấy vai trò người dùng từ sessionStorage');
        return undefined;
    }
};

// Lấy thông tin ID người dùng từ sessionStorage
export const getCurrentUserId = (): number | undefined => {
    try {
        const id = sessionStorage.getItem('currentUserId');
        if (id) {
            const parsedId = parseInt(id, 10);
            if (!isNaN(parsedId)) {
                return parsedId;
            }
        }
        return undefined;
    } catch (error) {
        message.error('Lỗi khi lấy ID người dùng từ sessionStorage');
        return undefined;
    }
};

// Lấy ID phòng ban của người dùng hiện tại
export const getCurrentUserDepartmentId = async (): Promise<number | undefined> => {
    try {
        const userId = getCurrentUserId();
        if (userId === undefined) {
            throw new Error('ID người dùng không hợp lệ trong sessionStorage');
        }
        const employeeDetail = await getEmployeeById(userId);
        if (employeeDetail && employeeDetail.departmentId) {
            return employeeDetail.departmentId;
        }
        return undefined;
    } catch (error) {
        message.error('Lỗi khi lấy ID phòng ban của người dùng hiện tại');
        return undefined;
    }
};

// Xóa thông tin người dùng khỏi sessionStorage
export const clearUserData = (): void => {
    sessionStorage.removeItem('currentUserRole');
    sessionStorage.removeItem('currentUserId');
};
