// Định nghĩa các enum
export enum ActionType {
    Reward = 'Reward',
    Disciplinary = 'Disciplinary'
}

export enum ActionSubtype {
    Bonus = 'Bonus',
    Promotion = 'Promotion',
    Warning = 'Warning',
    Suspension = 'Suspension'
}

export enum ActionStatus {
    Draft = 'DRAFT',
    Pending = 'PENDING',
    Approved = 'APPROVED',
    Rejected = 'REJECTED'
}

// Khai báo interface sử dụng các enum
export interface Action {
    actionType: ActionType;
    actionSubtype: ActionSubtype;
    status: ActionStatus;
    actionId: number;
    employeeId: number;
    reason: string;
    actionDate: string; // ISO 8601 date string
    currentApproverId: number; // ID của người phê duyệt hiện tại
    amount?: number; // Tùy chọn, dùng cho phần thưởng
    duration?: number; // Tùy chọn, dùng cho các hành động kỷ luật
}
