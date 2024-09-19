export enum ActionSubtype {
    Bonus = 'Bonus',
    Promotion = 'Promotion',
    Training = 'Training', // Đào tạo
    Compliance = 'Compliance', // Tuân thủ
    Audit = 'Audit', // Kiểm toán
    Certification = 'Certification', // Chứng nhận
    Warning = 'Warning',
    Suspension = 'Suspension',
    Fines = 'Fines', 
    Termination = 'Termination',
}

// Các loại hành động (Reward hoặc Disciplinary)
export enum ActionType {
    Reward = 'Reward',
    Disciplinary = 'Disciplinary',
}

// Trạng thái của hành động (Draft, Pending, Editing, Approved, Rejected, Cancelled)
export enum ActionStatus {
    Draft = 'DRAFT',
    Pending = 'PENDING',
    Editing = 'EDITING',
    Approved = 'APPROVED',
    Rejected = 'REJECTED',
    Cancelled = 'CANCELLED',
}


export interface Action {
    actionType: ActionType;
    actionSubtype: ActionSubtype;
    status: ActionStatus;
    actionId: number;
    employeeId: number;
    reason: string;
    actionDate: string; // ISO 8601 date string
    currentApproverId?: number; // ID của người phê duyệt hiện tại
    amount?: number; // Tùy chọn, dùng cho phần thưởng
    duration?: number; // Tùy chọn, dùng cho các hành động kỷ luật
}
