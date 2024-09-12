import { ActionType, ActionSubtype, ActionStatus } from '../../../types/action';

export interface RewardDisciplineListItem {
    employeeId: number;
    employeeName: string;
    actionType: ActionType;
    actionSubtype: ActionSubtype;
    actionDate: string;
    status: ActionStatus;
    actionId: number; // ID của hành động
    departmentId:number;
    departmentName: string; // Tên phòng ban
}
