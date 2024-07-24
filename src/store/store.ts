// src/store/store.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import employeeReducer from './slices/employeeSlice';
import { EmployeeState } from './slices/employeeSlice';

const rootReducer = combineReducers({
    employees: employeeReducer,
});

const store = configureStore({
    reducer: rootReducer,
});

export type RootState = {
    employees: EmployeeState;
};

export type AppDispatch = typeof store.dispatch;

export default store;
