import { Employee } from './Employee';
import { Department } from './Department';
import { Action } from './Action';
import { ApprovalLog } from './ApprovalLog';

export interface HRMData {
    employees: Employee[];
    departments: Department[];
    actions: Action[];
    approvalLogs: ApprovalLog[];
}
