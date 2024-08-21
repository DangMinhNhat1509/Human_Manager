// src/modules/reward_discipline/services/RewardDisciplineService.ts

import { Action, ActionStatus } from '../../../types/Action';
import { ApprovalLog, ApprovalAction } from '../../../types/ApprovalLog';
import { CreateRewardDiscipline } from '../types/CreateRewardDiscipline';
import { RewardDisciplineDetail } from '../types/RewardDisciplineDetail';
import { RewardDisciplineListItem } from '../types/RewardDisciplineListItem';
import { getHrmData, saveHrmData, getAllEmployees, getEmployeeById } from '../../employee/services/employeeService';

// Fetch all actions
export const getAllActions = async (): Promise<RewardDisciplineListItem[]> => {
    try {
        const { actions } = getHrmData();

        if (!Array.isArray(actions)) {
            throw new Error('Invalid data format for actions.');
        }

        const employees = await getAllEmployees();

        return actions.map(action => {
            const employee = employees.find(emp => emp.employeeId === action.employeeId);

            if (!employee) {
                throw new Error(`Employee with id ${action.employeeId} not found`);
            }

            return {
                actionId: action.actionId,
                employeeId: action.employeeId,
                employeeName: employee.name ?? 'Unknown',
                actionType: action.actionType,
                actionSubtype: action.actionSubtype,
                actionDate: action.actionDate,
                status: action.status,
                departmentName: employee.departmentName ?? 'Unknown',
            };
        });
    } catch (error) {
        console.error('Error fetching all actions:', error);
        throw error;
    }
};

// Fetch actions by department
export const getActionsByDepartment = async (departmentName: string): Promise<RewardDisciplineListItem[]> => {
    try {
        const { actions } = getHrmData();

        if (!Array.isArray(actions)) {
            throw new Error('Invalid data format for actions.');
        }

        const employees = await getAllEmployees();
        const departmentEmployees = employees.filter(employee => employee.departmentName === departmentName);

        return actions
            .filter(action => departmentEmployees.some(emp => emp.employeeId === action.employeeId))
            .map(action => {
                const employee = employees.find(emp => emp.employeeId === action.employeeId);

                if (!employee) {
                    return {
                        no: action.actionId,
                        employeeId: action.employeeId,
                        employeeName: 'Unknown',
                        actionType: action.actionType,
                        actionSubtype: action.actionSubtype,
                        actionDate: action.actionDate,
                        status: action.status,
                        actionId: action.actionId,
                        departmentName: 'Unknown',
                    };
                }

                return {
                    no: action.actionId,
                    employeeId: action.employeeId,
                    employeeName: employee.name ?? 'Unknown',
                    actionType: action.actionType,
                    actionSubtype: action.actionSubtype,
                    actionDate: action.actionDate,
                    status: action.status,
                    actionId: action.actionId,
                    departmentName: employee.departmentName ?? 'Unknown',
                };
            });
    } catch (error) {
        console.error('Error fetching actions by department:', error);
        throw error;
    }
};

// Fetch action by ID
export const getActionById = async (actionId: number): Promise<RewardDisciplineDetail | null> => {
    try {
        const { actions } = getHrmData();

        if (!Array.isArray(actions)) {
            throw new Error('Invalid data format for actions.');
        }

        const action = actions.find(action => action.actionId === actionId);
        if (!action) return null;

        const employee = await getEmployeeById(action.employeeId);
        const departmentName = employee?.departmentName ?? 'Unknown';

        const approvalLogs = await getApprovalLogs(actionId);

        return {
            actionId: action.actionId,
            employeeId: action.employeeId,
            employeeName: employee?.name ?? 'Unknown',
            actionType: action.actionType,
            actionSubtype: action.actionSubtype,
            actionDate: action.actionDate,
            status: action.status,
            reason: action.reason,
            departmentName: departmentName,
            approvalLogs: approvalLogs,
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

        // Tìm actionId lớn nhất để tạo actionId mới
        const maxId = actions.length > 0 ? Math.max(...actions.map(a => a.actionId)) : 0;

        // Tạo action mới với actionId tăng dần
        const newAction: Action = {
            ...action,
            actionId: maxId + 1,
            status: ActionStatus.Draft
        };

        // Thêm action mới vào danh sách actions
        actions.push(newAction);

        // Lưu lại dữ liệu HRM sau khi cập nhật
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
export const approveOrRejectAction = async (actionId: number, approvalAction: ApprovalAction, note: string, approverId: number, approverName: string): Promise<void> => {
    try {
        const { actions, approvalLogs } = getHrmData();

        if (!Array.isArray(actions) || !Array.isArray(approvalLogs)) {
            throw new Error('Invalid data format for actions or approvalLogs.');
        }

        const actionIndex = actions.findIndex(a => a.actionId === actionId);
        if (actionIndex === -1) {
            throw new Error('Action not found.');
        }

        const action = actions[actionIndex];
        if (approvalAction === ApprovalAction.Approve) {
            action.status = ActionStatus.Approved;
        } else if (approvalAction === ApprovalAction.Reject) {
            action.status = ActionStatus.Rejected;
        }

        const maxLogId = approvalLogs.length > 0 ? Math.max(...approvalLogs.map(log => log.approvalLogId)) : 0;
        const newApprovalLog: ApprovalLog = {
            approvalLogId: maxLogId + 1,
            actionId: action.actionId,
            approverId,
            action: approvalAction,
            note,
            approvalDate: new Date().toISOString(),
        };

        approvalLogs.push(newApprovalLog);
        saveHrmData({ ...getHrmData(), actions, approvalLogs });
    } catch (error) {
        console.error('Error approving or rejecting action:', error);
        throw error;
    }
};

// Fetch approval logs
export const getApprovalLogs = async (actionId: number): Promise<ApprovalLog[]> => {
    try {
        const { approvalLogs } = getHrmData();

        if (!Array.isArray(approvalLogs)) {
            throw new Error('Invalid data format for approvalLogs.');
        }

        return approvalLogs.filter(log => log.actionId === actionId);
    } catch (error) {
        console.error('Error fetching approval logs:', error);
        throw error;
    }
};
