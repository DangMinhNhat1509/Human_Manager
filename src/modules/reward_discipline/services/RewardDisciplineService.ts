// src/modules/reward_discipline/services/RewardDisciplineService.ts

import { Action, ActionStatus } from '../../../types/Action';
import { ApprovalLog, ApprovalAction } from '../../../types/ApprovalLog';
import { CreateRewardDiscipline } from '../types/CreateRewardDiscipline';
import { RewardDisciplineDetail } from '../types/RewardDisciplineDetail';
import { RewardDisciplineListItem } from '../types/RewardDisciplineListItem';
import { getHrmData, saveHrmData, getEmployeesByRole, getEmployeeById } from '../../employee/services/employeeService';
import { Role } from '../../../types/Employee';
// Fetch all actions
export const getAllActions = async (): Promise<RewardDisciplineListItem[]> => {
    try {
        const { actions } = getHrmData();

        if (!Array.isArray(actions)) {
            throw new Error('Invalid data format for actions.');
        }

        const employees = await getEmployeesByRole(Role.Employee);

        return actions.map(action => {
            const employee = employees.find(emp => emp.employeeId === action.employeeId);

            if (!employee) {
                throw new Error(`Employee with id ${action.employeeId} not found`);
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
        console.error('Error fetching all actions:', error);
        throw error;
    }
};

// Fetch actions by department
export const getActionsByDepartment = async (departmentId: number): Promise<RewardDisciplineListItem[]> => {
    try {
        // Lấy tất cả các hành động
        const allActions = await getAllActions();

        if (!allActions || !Array.isArray(allActions)) {
            console.error('Failed to fetch actions: Invalid data format.');
            throw new Error('Failed to fetch actions: Invalid data format.');
        }

        // Lọc hành động theo tên phòng ban
        const filteredActions = allActions.filter(action => action.departmentId === departmentId);

        if (filteredActions.length === 0) {
            console.warn(`No actions found for department: ${filteredActions}`);
        }

        return filteredActions;
    } catch (error) {
        console.error('Error fetching actions by department:', error);
        throw error;
    }
};

// Fetch action by ID
export const getActionDetailById = async (actionId: number): Promise<RewardDisciplineDetail> => {
    try {
        const { actions, approvalLogs } = getHrmData();

        if (!Array.isArray(actions)) {
            throw new Error('Invalid data format for actions.');
        }
        if (!Array.isArray(approvalLogs)) {
            throw new Error('Invalid data format for approvalLogs.');
        }

        const action = actions.find(action => action.actionId === actionId);
        if (!action) {
            throw new Error(`Hành động với ${actionId} không tồn tại!`);
        }

        const employee = await getEmployeeById(action.employeeId);
        const departmentName = employee?.departmentName ?? 'Không xác đinh!';

        const approvalLogsWithNames = await Promise.all(
            approvalLogs
                .filter(log => log.actionId === actionId)
                .map(async log => {
                    const approver = await getEmployeeById(log.approverId);
                    return {
                        ...log,
                        approverName: approver?.name?? 'Người phê duyệt đã bị xóa',
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
        console.error('Error fetching action by ID:', error);
        throw error;
    }
};

// Create a new action
export const createAction = async (action: CreateRewardDiscipline): Promise<void> => {
    try {
        const { actions } = getHrmData();

        // Kiểm tra định dạng của 'actions'
        if (!Array.isArray(actions)) {
            throw new Error('Invalid data format for actions.');
        }

        const maxId = actions.length > 0 ? Math.max(...actions.map(a => a.actionId)) : 0;

        const newAction: Action = {
            ...action,
            actionId: maxId + 1
        };

        actions.push(newAction);

        saveHrmData({ ...getHrmData(), actions });
    } catch (error) {
        console.error('Error creating action:', error);
        throw error;
    }
};


// Update an action
export const updateAction = async (actionId: number, updateData: Partial<CreateRewardDiscipline>): Promise<void> => {
    try {
        const { actions } = getHrmData();

        if (!Array.isArray(actions)) {
            throw new Error('Invalid data format for actions.');
        }

        const actionIndex = actions.findIndex(a => a.actionId === actionId);
        if (actionIndex === -1) {
            throw new Error('Action not found.');
        }

        actions[actionIndex] = {
            ...actions[actionIndex],
            ...updateData
        };
        saveHrmData({ ...getHrmData(), actions });
    } catch (error) {
        console.error('Error updating action:', error);
        throw error;
    }
};

export const updateActionStatus = async (actionId: number, newStatus: ActionStatus): Promise<void> => {
    try {
        const { actions } = getHrmData();

        if (!Array.isArray(actions)) {
            throw new Error('Invalid data format for actions.');
        }

        const actionIndex = actions.findIndex(a => a.actionId === actionId);
        if (actionIndex === -1) {
            throw new Error('Action not found.');
        }

        actions[actionIndex] = {
            ...actions[actionIndex],
            status: newStatus,
        };

        saveHrmData({ ...getHrmData(), actions });
    } catch (error) {
        console.error('Error updating action status:', error);
        throw error;
    }
};

// Delete an action
export const deleteAction = async (actionId: number): Promise<void> => {
    try {
        const { actions } = getHrmData();

        if (!Array.isArray(actions)) {
            throw new Error('Invalid data format for actions.');
        }

        const actionIndex = actions.findIndex(a => a.actionId === actionId);
        if (actionIndex === -1) {
            throw new Error('Action not found.');
        }

        actions.splice(actionIndex, 1);
        saveHrmData({ ...getHrmData(), actions });
    } catch (error) {
        console.error('Error deleting action:', error);
        throw error;
    }
};

// Approve or reject an action
export const approveOrRejectAction = async (
    actionId: number,
    approvalAction: ApprovalAction,
    note: string,
    approverId: number
): Promise<void> => {
    try {
        const { actions, approvalLogs } = getHrmData();

        if (!Array.isArray(actions) || !Array.isArray(approvalLogs)) {
            throw new Error('Invalid data format for actions or approvalLogs.');
        }

        const actionIndex = actions.findIndex(a => a.actionId === actionId);
        if (actionIndex === -1) {
            throw new Error('Action not found.');
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
            case ApprovalAction.Submit:
            case ApprovalAction.Cancel:
                // Xử lý các hành động khác nếu cần
                break;
            default:
                throw new Error('Invalid approval action.');
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
        console.error('Error approving or rejecting action:', error);
        throw error;
    }
};


