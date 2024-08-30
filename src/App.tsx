import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import Employee from './pages/Employee';
import EmployeeDetailPage from './modules/employee/components/EmployeeDetailPage';
import CreateEmployeePage from './modules/employee/components/CreateEmployeePage';
import RewardDisciplinePage from './modules/reward_discipline/components/RewardDisciplinePage';
import RewardDisciplineDetailPage from './modules/reward_discipline/components/RewardDisciplineDetailPage';
import CreateRewardDisciplinePage from './modules/reward_discipline/components/CreateRewardDisciplinePage';
import UpdateRewardDisciplinePage from './modules/reward_discipline/components/UpdateRewardDisciplinePage';
import { getCurrentUserRole } from './utils/auth';
import { Role } from './types/Employee';
import Sidebar from './components/SideBar';

// Component để kiểm tra quyền truy cập
const PrivateRoute: React.FC<{ roles: Role[], element: JSX.Element }> = ({ roles, element }) => {
  const userRole = getCurrentUserRole();
  if (!userRole || !roles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }
  return element;
};

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar />
        <Layout style={{ padding: '0 24px', minHeight: 280, marginLeft: 250 }}>
          <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
            <Routes>

              {/* Routes cho Employee */}
              <Route path="/employees" element={<PrivateRoute roles={[Role.Director, Role.HR]} element={<Employee />} />} />
              <Route path="/employees/create" element={<PrivateRoute roles={[Role.HR]} element={<CreateEmployeePage />} />} />
              <Route path="/employees/:employeeId" element={<PrivateRoute roles={[Role.Director, Role.HR, Role.Manager, Role.Employee]} element={<EmployeeDetailPage />} />} />

              {/* Routes cho Reward/Discipline */}
              <Route path="/actions" element={<PrivateRoute roles={[Role.Director, Role.Manager, Role.HR]} element={<RewardDisciplinePage />} />} />
              <Route path="/actions/create" element={<PrivateRoute roles={[Role.Manager]} element={<CreateRewardDisciplinePage />} />} />
              <Route path="/actions/:actionId" element={<PrivateRoute roles={[Role.Director, Role.Manager, Role.HR]} element={<RewardDisciplineDetailPage />} />} />
              <Route path="/actions/update/:actionId" element={<PrivateRoute roles={[Role.Manager]} element={<UpdateRewardDisciplinePage />} />} />

              <Route path="/unauthorized" element={<h1>Unauthorized - You do not have permission to view this page.</h1>} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
