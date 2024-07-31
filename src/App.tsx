import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Employee from "./pages/Employee";
import EmployeeDetailPage from "./components/employee/EmployeeDetailPage";
import CreateEmployeePage from "./components/employee/CreateEmployeePage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/employees" />} />
        <Route path="/employees" element={<Employee />} />
        <Route path="/employees/create" element={<CreateEmployeePage />} />
        <Route path="/employees/:id" element={<EmployeeDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
