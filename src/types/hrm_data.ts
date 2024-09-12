import { Employee } from './employee';
import { Department } from './department';
import { Action } from './action';
import { ApprovalLog } from './approval_log';

export interface HRMData {
    employees: Employee[];
    departments: Department[];
    actions: Action[];
    approvalLogs: ApprovalLog[];
}
