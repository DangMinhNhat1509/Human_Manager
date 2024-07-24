import { Employee } from '../../types/Employee';
import { EmployeeDetail } from '../../types/EmployeeDetail';
import { CreateEmployee } from '../../types/CreateEmployee';
interface CreateEmployeeData {
    field: keyof CreateEmployee;
    value: any;
}
export interface EmployeeState {
    employees: Employee[];
    employeeDetail: EmployeeDetail | null;
    createEmployeeData: CreateEmployeeData[];
    loading: boolean;
    loadingDetail: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
}
export declare const fetchEmployees: import("@reduxjs/toolkit").AsyncThunk<{
    data: any;
    totalPages: number;
}, void, import("@reduxjs/toolkit/dist/createAsyncThunk").AsyncThunkConfig>;
export declare const fetchEmployeeDetail: import("@reduxjs/toolkit").AsyncThunk<any, number, import("@reduxjs/toolkit/dist/createAsyncThunk").AsyncThunkConfig>;
export declare const createEmployee: import("@reduxjs/toolkit").AsyncThunk<any, CreateEmployee, import("@reduxjs/toolkit/dist/createAsyncThunk").AsyncThunkConfig>;
export declare const updateEmployee: import("@reduxjs/toolkit").AsyncThunk<any, {
    id: number;
    data: Partial<Employee>;
}, import("@reduxjs/toolkit/dist/createAsyncThunk").AsyncThunkConfig>;
export declare const deleteEmployee: import("@reduxjs/toolkit").AsyncThunk<any, number, import("@reduxjs/toolkit/dist/createAsyncThunk").AsyncThunkConfig>;
export declare const setPage: import("@reduxjs/toolkit").ActionCreatorWithPayload<number, "employees/setPage">, clearEmployeeDetail: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"employees/clearEmployeeDetail">, setCreateEmployeeField: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    field: keyof CreateEmployee;
    value: any;
}, "employees/setCreateEmployeeField">, resetCreateEmployeeForm: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"employees/resetCreateEmployeeForm">;
declare const _default: import("redux").Reducer<EmployeeState, import("redux").UnknownAction, EmployeeState>;
export default _default;
