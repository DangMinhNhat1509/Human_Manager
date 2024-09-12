import { ActionType, ActionSubtype, ActionStatus } from '../../../types/action';
export interface CreateRewardDiscipline {
    actionId?: number; // ID của hành động (không bắt buộc khi tạo mới)
    employeeId: number;
    employeeName?: string; // Tên nhân viên (nếu cần)
    actionType: ActionType;
    actionSubtype: ActionSubtype;
    actionDate: string;
    status: ActionStatus;
    reason: string; // Lý do khen thưởng/kỷ luật
    amount: number;
    duration: number;
}
