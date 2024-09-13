import { Action, ActionStatus } from '../../../types/action';
import { ApprovalLog, ApprovalAction } from '../../../types/approval_log';
import { CreateRewardDiscipline } from '../types/create_reward_discipline';
import { RewardDisciplineDetail } from '../types/reward_discipline_detail';
import { RewardDisciplineListItem } from '../types/reward_discipline_list_item';
import { getHrmData, saveHrmData, getEmployeesByRole, getEmployeeById } from '../../employee/services/employee_service';
import { Role } from '../../../types/employee';
import { message } from 'antd';

// Lấy tất cả các hành động
export const getAllActions = async (): Promise<RewardDisciplineListItem[]> => {
    try {
        const { actions } = getHrmData();

        if (!Array.isArray(actions)) {
            throw new Error('Định dạng dữ liệu hành động không hợp lệ.');
        }

        const employees = await getEmployeesByRole(Role.Employee);

        return actions.map(action => {
            const employee = employees.find(emp => emp.employeeId === action.employeeId);

            if (!employee) {
                throw new Error(`Nhân viên với id ${action.employeeId} không được tìm thấy`);
            }

            return {
                actionId: action.actionId,
                employeeId: action.employeeId,
                employeeName: employee.name,
                actionType: action.actionType,
                actionSubtype: action.actionSubtype,
                actionDate: action.actionDate,
                status: action.status,
                departmentId: employee.departmentId,
                departmentName: employee.departmentName,
            };
        });
    } catch (error) {
        message.error('Lỗi khi lấy tất cả các hành động!');
        throw error;
    }
};

// Lấy hành động theo phòng ban
export const getActionsByDepartment = async (departmentId: number): Promise<RewardDisciplineListItem[]> => {
    try {
        // Lấy tất cả các hành động
        const allActions = await getAllActions();

        if (!allActions || !Array.isArray(allActions)) {
            throw new Error('Không thể lấy các hành động: Định dạng dữ liệu không hợp lệ.');
        }

        // Lọc hành động theo tên phòng ban
        const filteredActions = allActions.filter(action => action.departmentId === departmentId);

        if (filteredActions.length === 0) {
            message.warning(`Không tìm thấy hành động cho phòng ban: ${departmentId}`);
        }

        return filteredActions;
    } catch (error) {
        message.error('Lỗi khi lấy hành động theo phòng ban!');
        throw error;
    }
};

// Lấy chi tiết hành động theo ID
export const getActionDetailById = async (actionId: number): Promise<RewardDisciplineDetail> => {
    try {
        const { actions, approvalLogs } = getHrmData();

        if (!Array.isArray(actions)) {
            throw new Error('Định dạng dữ liệu hành động không hợp lệ.');
        }
        if (!Array.isArray(approvalLogs)) {
            throw new Error('Định dạng dữ liệu approvalLogs không hợp lệ.');
        }

        const action = actions.find(action => action.actionId === actionId);
        if (!action) {
            throw new Error(`Hành động với ID ${actionId} không tồn tại!`);
        }

        const employee = await getEmployeeById(action.employeeId);
        const departmentName = employee?.departmentName ?? 'Không xác định!';

        const approvalLogsWithNames = await Promise.all(
            approvalLogs
                .filter(log => log.actionId === actionId)
                .map(async log => {
                    const approver = await getEmployeeById(log.approverId);
                    return {
                        ...log,
                        approverName: approver?.name ?? 'Người phê duyệt đã bị xóa',
                    }
                })
        )

        return {
            actionId: action.actionId,
            employeeId: action.employeeId,
            employeeName: employee?.name ?? 'Nhân viên đã bị xóa',
            actionType: action.actionType,
            actionSubtype: action.actionSubtype,
            actionDate: action.actionDate,
            amount: action.amount,
            duration: action.duration,
            status: action.status,
            reason: action.reason,
            departmentName: departmentName,
            approvalLogs: approvalLogsWithNames,
        };
    } catch (error) {
        message.error('Lỗi khi lấy chi tiết hành động theo ID!');
        throw error;
    }
};

// Tạo một hành động mới
export const createAction = async (action: CreateRewardDiscipline): Promise<void> => {
    try {
        const { actions } = getHrmData();

        // Kiểm tra định dạng của 'actions'
        if (!Array.isArray(actions)) {
            throw new Error('Định dạng dữ liệu hành động không hợp lệ.');
        }

        const maxId = actions.length > 0 ? Math.max(...actions.map(a => a.actionId)) : 0;

        const newAction: Action = {
            ...action,
            actionId: maxId + 1
        };

        actions.push(newAction);

        saveHrmData({ ...getHrmData(), actions });
    } catch (error) {
        message.error('Lỗi khi tạo hành động!');
        throw error;
    }
};

// Cập nhật một hành động
export const updateAction = async (actionId: number, updateData: Partial<CreateRewardDiscipline>): Promise<void> => {
    try {
        const { actions } = getHrmData();

        if (!Array.isArray(actions)) {
            throw new Error('Định dạng dữ liệu hành động không hợp lệ.');
        }

        const actionIndex = actions.findIndex(a => a.actionId === actionId);
        if (actionIndex === -1) {
            throw new Error('Hành động không được tìm thấy.');
        }

        actions[actionIndex] = {
            ...actions[actionIndex],
            ...updateData
        };
        saveHrmData({ ...getHrmData(), actions });
    } catch (error) {
        message.error('Lỗi khi cập nhật hành động!');
        throw error;
    }
};

// Cập nhật trạng thái hành động
export const updateActionStatus = async (actionId: number, newStatus: ActionStatus): Promise<void> => {
    try {
        const { actions } = getHrmData();

        if (!Array.isArray(actions)) {
            throw new Error('Định dạng dữ liệu hành động không hợp lệ.');
        }

        const actionIndex = actions.findIndex(a => a.actionId === actionId);
        if (actionIndex === -1) {
            throw new Error('Hành động không được tìm thấy.');
        }

        actions[actionIndex] = {
            ...actions[actionIndex],
            status: newStatus,
        };

        saveHrmData({ ...getHrmData(), actions });
    } catch (error) {
        message.error('Lỗi khi cập nhật trạng thái hành động!');
        throw error;
    }
};

// Xóa một hành động
export const deleteAction = async (actionId: number): Promise<void> => {
    try {
        const { actions } = getHrmData();

        if (!Array.isArray(actions)) {
            throw new Error('Định dạng dữ liệu hành động không hợp lệ.');
        }

        const actionIndex = actions.findIndex(a => a.actionId === actionId);
        if (actionIndex === -1) {
            throw new Error('Hành động không được tìm thấy.');
        }

        actions.splice(actionIndex, 1);
        saveHrmData({ ...getHrmData(), actions });
    } catch (error) {
        message.error('Lỗi khi xóa hành động!');
        throw error;
    }
};

// Phê duyệt hoặc từ chối một hành động
export const approveOrRejectAction = async (
    actionId: number,
    approvalAction: ApprovalAction,
    note: string,
    approverId: number
): Promise<void> => {
    try {
        const { actions, approvalLogs } = getHrmData();

        if (!Array.isArray(actions) || !Array.isArray(approvalLogs)) {
            throw new Error('Định dạng dữ liệu hành động hoặc approvalLogs không hợp lệ.');
        }

        const actionIndex = actions.findIndex(a => a.actionId === actionId);
        if (actionIndex === -1) {
            throw new Error('Hành động không được tìm thấy.');
        }


        // Cập nhật trạng thái hành động dựa trên loại phê duyệt
        const action = actions[actionIndex];
        switch (approvalAction) {
            case ApprovalAction.Approve:
                action.status = ActionStatus.Approved;
                break;
            case ApprovalAction.Reject:
                action.status = ActionStatus.Rejected;
                break;
            case ApprovalAction.RequestEdit:
                action.status = ActionStatus.Editing;
                break;
            default:
                throw new Error('Loại phê duyệt không hợp lệ.');
        }

        // Tạo và thêm một log phê duyệt mới
        const maxLogId = approvalLogs.length > 0 ? Math.max(...approvalLogs.map(log => log.approvalLogId)) : 0;
        const newApprovalLog: ApprovalLog = {
            approvalLogId: maxLogId + 1,
            actionId,
            approverId,
            note,
            approvalDate: new Date().toISOString(),
            action: approvalAction,
        };

        approvalLogs.push(newApprovalLog);

        saveHrmData({ ...getHrmData(), actions, approvalLogs });
    } catch (error) {
        message.error('Lỗi khi phê duyệt hoặc từ chối hành động!');
        throw error;
    }
};
