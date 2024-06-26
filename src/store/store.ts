import { combineReducers, configureStore } from '@reduxjs/toolkit';
import employeeReducer from './slices/employeeSlice';

const rootReducer = combineReducers({
    employees: employeeReducer,
});

const store = configureStore({ 
    reducer: rootReducer
 });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;