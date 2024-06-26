import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import employeeApi from '../../api/employeeApi';
import { Employee } from '../../types/Employee';
import { EmployeeDetail } from '../../types/EmployeeDetail';
import { CreateEmployee } from '../../types/CreateEmployee';

interface CreateEmployeeData {
    field: keyof CreateEmployee;
    value: any;
}

interface EmployeeState {
    employees: Employee[];
    employeeDetail: EmployeeDetail | null;
    createEmployeeData: CreateEmployeeData[];
    loading: boolean;
    loadingDetail: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
}

const initialState: EmployeeState = {
    employees: [],
    employeeDetail: null,
    createEmployeeData: [],
    loading: false,
    loadingDetail: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
};

export const fetchEmployees = createAsyncThunk(
    "employees/fetchEmployees",
    async (_, { rejectWithValue }) => {
        try {
            const response = await employeeApi.getAllEmployee();
            const totalPages = Math.ceil(response.data.length / 10);
            return { data: response.data, totalPages };
        } catch (error: any) {
            console.error('Error fetching employees:', error);
            return rejectWithValue(error.response ? error.response.data : 'Network error');
        }
    }
);

export const fetchEmployeeDetail = createAsyncThunk(
    "employees/fetchEmployeeDetail",
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await employeeApi.getEmployeeById(id);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching employee detail:', error);
            return rejectWithValue(error.response ? error.response.data : 'Network error');
        }
    }
);

export const createEmployee = createAsyncThunk(
    "employees/createEmployee",
    async (data: CreateEmployee, { rejectWithValue }) => {
        try {
            const response = await employeeApi.createEmployee(data);
            return response.data;
        } catch (error: any) {
            console.error('Error creating employee:', error);
            return rejectWithValue(error.response ? error.response.data : 'Network error');
        }
    }
);

export const updateEmployee = createAsyncThunk(
    "employees/updateEmployee",
    async ({ id, data }: { id: number; data: Partial<Employee> }, { rejectWithValue }) => {
        try {
            const response = await employeeApi.updateEmployee(id, data);
            return response.data;
        } catch (error: any) {
            console.error('Error updating employee:', error);
            return rejectWithValue(error.response ? error.response.data : 'Network error');
        }
    }
);

export const deleteEmployee = createAsyncThunk(
    "employees/deleteEmployee",
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await employeeApi.deleteEmployee(id);
            return response.data;
        } catch (error: any) {
            console.error('Error deleting employee:', error);
            return rejectWithValue(error.response ? error.response.data : 'Network error');
        }
    }
);

const employeeSlice = createSlice({
    name: "employees",
    initialState,
    reducers: {
        setPage(state, action: PayloadAction<number>) {
            state.currentPage = action.payload;
        },
        clearEmployeeDetail(state) {
            state.employeeDetail = null;
        },
        setCreateEmployeeField(state, action: PayloadAction<{ field: keyof CreateEmployee, value: any }>) {
            const index = state.createEmployeeData.findIndex(item => item.field === action.payload.field);
            if (index !== -1) {
                state.createEmployeeData[index].value = action.payload.value;
            } else {
                state.createEmployeeData.push({ field: action.payload.field, value: action.payload.value });
            }
        },
        resetCreateEmployeeForm(state) {
            state.createEmployeeData = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployees.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployees.fulfilled, (state, action: PayloadAction<{ data: Employee[], totalPages: number }>) => {
                state.loading = false;
                state.employees = action.payload.data;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchEmployees.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload || 'Unable to fetch employees';
            })
            .addCase(fetchEmployeeDetail.pending, (state) => {
                state.loadingDetail = true;
                state.error = null;
            })
            .addCase(fetchEmployeeDetail.fulfilled, (state, action: PayloadAction<EmployeeDetail>) => {
                state.loadingDetail = false;
                state.employeeDetail = action.payload;
            })
            .addCase(fetchEmployeeDetail.rejected, (state, action: PayloadAction<any>) => {
                state.loadingDetail = false;
                state.error = action.payload || 'Unable to fetch employee details';
            })
            .addCase(createEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createEmployee.fulfilled, (state, action: PayloadAction<Employee>) => {
                state.loading = false;
                state.employees.push(action.payload);
            })
            .addCase(createEmployee.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload || 'Unable to create employee';
            })
            .addCase(updateEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEmployee.fulfilled, (state, action: PayloadAction<Employee>) => {
                state.loading = false;
                state.employees = state.employees.map(employee => employee.id === action.payload.id ? action.payload : employee);
            })
            .addCase(updateEmployee.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload || 'Unable to update employee';
            })
            .addCase(deleteEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteEmployee.fulfilled, (state, action: PayloadAction<number>) => {
                state.loading = false;
                state.employees = state.employees.filter(employee => employee.id !== action.payload);
            })
            .addCase(deleteEmployee.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload || 'Unable to delete employee';
            });
    }
});

export const { setPage, clearEmployeeDetail, setCreateEmployeeField, resetCreateEmployeeForm } = employeeSlice.actions;

export default employeeSlice.reducer;
