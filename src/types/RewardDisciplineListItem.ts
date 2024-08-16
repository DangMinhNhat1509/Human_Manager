import { ActionType, ActionSubtype, ActionStatus } from './Action'; 
export interface RewardDisciplineListItem {
    no: number;
    employeeId: number;
    actionType: ActionType;
    actionSubtype: ActionSubtype;
    actionDate: string;
    status: ActionStatus;
    actionId: number; // ID for the specific action
}
