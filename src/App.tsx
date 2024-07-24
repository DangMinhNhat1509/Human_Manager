import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Employee from "./pages/Employee";
import EmployeeDetail from "./components/employee/EmployeeDetailPage";
import CreateEmployeePage from "./components/employee/CreateEmployeePage";
import EmployeeUpdateModal from "./components/employee/EmployeeUpdateModal";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";

const App = () => {
  const employeeDetail = useSelector((state: RootState) => state.employees.employeeDetail);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/employees" />} />
        <Route path="/employees" element={<Employee />} />
        <Route path="/employees/create" element={<CreateEmployeePage />} />
        <Route
          path="/employees/:id"
          element={<EmployeeDetail />}
        />
        <Route
          path="/employees/:id/update"
          element={employeeDetail ? (
            <EmployeeUpdateModal show={true} onHide={() => { }}
              employeeDetail={employeeDetail} onUpdateSuccess={() => { }} />
          ) : (<Navigate to="/employees" />)
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
