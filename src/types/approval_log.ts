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
    approverId: number;
    note: string;
    approvalDate: string;
    action: ApprovalAction;
}
