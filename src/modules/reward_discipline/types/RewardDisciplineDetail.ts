import { ActionType, ActionSubtype, ActionStatus } from '../../../types/Action';
import { ApprovalLog } from '../../../types/ApprovalLog';

export interface RewardDisciplineDetail {
    actionId: number; // ID của hành động
    employeeId: number;
    employeeName: string;
    actionType: ActionType;
    actionSubtype: ActionSubtype;
    actionDate: string;
    status: ActionStatus;
    amount?: number;
    duration?: number;
    reason: string; // Lý do khen thưởng/kỷ luật
    note?: string; // Ghi chú thêm (không bắt buộc)
    departmentName: string; // Tên phòng ban
    approvalLogs: ApprovalLog[]; 
}
