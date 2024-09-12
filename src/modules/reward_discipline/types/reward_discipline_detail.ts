import { ActionType, ActionSubtype, ActionStatus } from '../../../types/action';
import { ApprovalLog } from '../../../types/approval_log';


export interface RewardDisciplineDetail {
    actionId: number;
    employeeId: number;
    employeeName: string;
    actionType: ActionType;
    actionSubtype: ActionSubtype;
    actionDate: string;
    status: ActionStatus;
    amount?: number;
    duration?: number;
    reason: string;
    note?: string;
    departmentName: string;
    approvalLogs: (ApprovalLog & { approverName?: string })[];
}
