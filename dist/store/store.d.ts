import { EmployeeState } from './slices/employeeSlice';
declare const store: import("@reduxjs/toolkit").EnhancedStore<{
    employees: EmployeeState;
}, import("redux").UnknownAction, import("@reduxjs/toolkit").Tuple<[import("redux").StoreEnhancer<{
    dispatch: import("redux-thunk").ThunkDispatch<{
        employees: EmployeeState;
    }, undefined, import("redux").UnknownAction>;
}, {}>, import("redux").StoreEnhancer<{}, {}>]>>;
export type RootState = {
    employees: EmployeeState;
};
export type AppDispatch = typeof store.dispatch;
export default store;
