import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Employee from "./pages/Employee";
import EmployeeDetail from "./components/employee/EmployeeDetailPage";
import CreateEmployeePage from "./components/employee/CreateEmployeePage";
import UpdateEmployeePage from "./components/employee/EmployeeUpdateModal";

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/employees" />} />
        <Route path="/employees" element={<Employee />} />
        <Route path="/employees/:id" element={<EmployeeDetail />} />
        <Route path="/employees/create" element={<CreateEmployeePage />} />
        <Route path="/employees/:id/update" element={<UpdateEmployeePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;