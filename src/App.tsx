import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import Employee from './pages/Employee';
import EmployeeDetailPage from './modules/employee/components/EmployeeDetailPage';
import CreateEmployeePage from './modules/employee/components/CreateEmployeePage';
// import ProposalsPage from './pages/ProposalsPage'; // Đảm bảo bạn có component này
// import RequestsPage from './pages/RequestsPage'; // Đảm bảo bạn có component này
// import NotificationsPage from './pages/NotificationsPage'; // Đảm bảo bạn có component này
import Sidebar from './components/SideBar'; // Đảm bảo đường dẫn nhập đúng
import RewardDisciplinePage from './modules/reward_discipline/components/RewardDisciplinePage';
import RewardDisciplineDetailPage from './modules/reward_discipline/components/RewardDisciplineDetailPage';
import CreateRewardDisciplinePage from './modules/reward_discipline/components/CreateRewardDisciplinePage';

const { Content } = Layout;

const App: React.FC = () => {

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar />
        <Layout style={{ padding: '0 24px', minHeight: 280 }}>
          <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/employees" />} />
              <Route path="/employees" element={<Employee />} />
              <Route path="/employees/create" element={<CreateEmployeePage />} />
              <Route path="/employees/:employeeId" element={<EmployeeDetailPage />} />
              {/* <Route path="/proposals" element={<ProposalsPage />} />
                            <Route path="/requests" element={<RequestsPage />} />
                            <Route path="/notifications" element={<NotificationsPage />} /> */}
              <Route path="/actions" element={<RewardDisciplinePage />} />
              <Route path="/actions/create" element={<CreateRewardDisciplinePage/>} />
              <Route path="/actions/:actionId" element={<RewardDisciplineDetailPage />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
