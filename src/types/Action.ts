export interface Action {
    actionId: number;
    employeeId: number;
    actionType: 'Reward' | 'Disciplinary';
    actionSubtype: 'Bonus' | 'Promotion' | 'Warning' | 'Suspension';
    reason: string;
    actionDate: string; // ISO 8601 date string
    currentApproverId: number; // ID of the current approver
    amount?: number; // Optional, used for rewards
    duration?: number; // Optional, used for disciplinary actions
    status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
}
