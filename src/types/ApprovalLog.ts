export interface ApprovalLog {
    approvalLogId: number;
    actionId: number; // The ID of the action this log is associated with
    approverId: number; // ID of the person who approved or rejected
    note: string; // Additional notes regarding the approval or rejection
    approvalDate: string; // ISO 8601 date string
    action: 'APPROVED' | 'REJECT' | 'PENDING'; // The result of the approval action
}
