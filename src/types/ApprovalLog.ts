// Các hành động phê duyệt (Request Edit, Reject, Approve, Submit, Cancel)
export enum ApprovalAction {
    RequestEdit = 'REQUEST_EDIT',
    Reject = 'REJECT',
    Approve = 'APPROVE',
    Submit = 'SUBMIT',
    Cancel = 'CANCEL',
}

export interface ApprovalLog {
    approvalLogId: number;
    actionId: number;
    approverId: number; // ID của người thực hiện hành động phê duyệt
    note: string; // Ghi chú của người phê duyệt
    approvalDate: string; // ISO 8601 date string
    action: ApprovalAction; // Hành động phê duyệt
}
