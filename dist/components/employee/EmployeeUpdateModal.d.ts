import React from 'react';
import { EmployeeDetail } from '../../types/EmployeeDetail';
interface EmployeeUpdateModalProps {
    show: boolean;
    onHide: () => void;
    employeeDetail: EmployeeDetail;
    onUpdateSuccess: () => void;
}
declare const EmployeeUpdateModal: React.FC<EmployeeUpdateModalProps>;
export default EmployeeUpdateModal;
