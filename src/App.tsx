  import React from 'react';
  import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
  import { Layout } from 'antd';
  import Employee from './pages/Employee';
  import EmployeeDetailPage from './components/employee/EmployeeDetailPage';
  import CreateEmployeePage from './components/employee/CreateEmployeePage';
  // import ProposalsPage from './pages/ProposalsPage'; // Đảm bảo bạn có component này
  // import RequestsPage from './pages/RequestsPage'; // Đảm bảo bạn có component này
  // import NotificationsPage from './pages/NotificationsPage'; // Đảm bảo bạn có component này
  import Sidebar from './components/SildeBar'; // Đảm bảo đường dẫn nhập đúng
  import RewardDisciplinePage from './components/RewardDiscipline/RewardDisciplinePage'; 
  const { Content } = Layout;

  const App: React.FC = () => {
    const role: 'Manager' | 'Employee' | 'HR' | 'Director' = 'Manager'; // Đặt vai trò theo yêu cầu

    return (
      <BrowserRouter>
        <Layout style={{ minHeight: '100vh' }}>
          <Sidebar role={role} />
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
                <Route path="/reward-discipline" element={<RewardDisciplinePage />} />
                <Route path="*" element={<Navigate to="/employees" />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </BrowserRouter>
    );
  };

  export default App;
