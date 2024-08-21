import { ActionType, ActionSubtype, ActionStatus } from '../../../types/Action';

export interface RewardDisciplineListItem {
    employeeId: number;
    employeeName: string;
    actionType: ActionType;
    actionSubtype: ActionSubtype;
    actionDate: string;
    status: ActionStatus;
    actionId: number; // ID của hành động
    departmentName: string; // Tên phòng ban
}
