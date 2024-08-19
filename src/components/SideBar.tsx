import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Select, Button, Modal } from 'antd';
import { UserOutlined, TrophyOutlined, FileTextOutlined, BellOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { getEmployeesByRole } from '../modules/employee/services/employeeService';
import { Role } from '../modules/employee/types/Employee';
import { EmployeeListItem } from '../modules/employee/types/EmployeeListItem';
const { Sider } = Layout;
const { Option } = Select;

const Sidebar: React.FC = () => {
    const [employeeList, setEmployeeList] = useState<EmployeeListItem[]>([]);
    const [managerList, setManagerList] = useState<EmployeeListItem[]>([]);
    const [hrList, setHrList] = useState<EmployeeListItem[]>([]);
    const [directorList, setDirectorList] = useState<EmployeeListItem[]>([]);
    const [selectedDirector, setSelectedDirector] = useState<number | undefined>(undefined);
    const [selectedHR, setSelectedHR] = useState<number | undefined>(undefined);
    const [selectedManager, setSelectedManager] = useState<number | undefined>(undefined);
    const [selectedEmployee, setSelectedEmployee] = useState<number | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState(false); // Đổi từ `isModalVisible` sang `isModalOpen`
    const location = useLocation();
    const currentPath = location.pathname;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const directors = await getEmployeesByRole(Role.Director);
                setDirectorList(directors);

                const hrMembers = await getEmployeesByRole(Role.HR);
                setHrList(hrMembers);

                const managers = await getEmployeesByRole(Role.Manager);
                setManagerList(managers);

                const employees = await getEmployeesByRole(Role.Employee);
                setEmployeeList(employees);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchEmployees();
    }, []);

    const handleRoleSelection = (role: Role, id: number) => {
        switch (role) {
            case Role.Director:
                setSelectedDirector(id);
                break;
            case Role.HR:
                setSelectedHR(id);
                break;
            case Role.Manager:
                setSelectedManager(id);
                break;
            case Role.Employee:
                setSelectedEmployee(id);
                break;
            default:
                break;
        }
        localStorage.setItem(`${role}_selectedId`, id.toString());
    };

    const handleSwitchAccount = () => {
        setIsModalOpen(true);
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
    };

    const menuItems = [
        {
            key: "management",
            icon: <UserOutlined />,
            label: "Quản lý",
            children: [
                {
                    key: "/employees",
                    label: <Link to="/employees">Quản lý Nhân viên</Link>,
                    className: classNames({ 'menu-item-active': currentPath === '/employees' }),
                },
                {
                    key: "/proposals",
                    label: <Link to="/proposals">Đề xuất</Link>,
                    className: classNames({ 'menu-item-active': currentPath === '/proposals' }),
                },
                {
                    key: "/reward-discipline",
                    label: <Link to="/reward-discipline">Tình trạng đơn</Link>,
                    className: classNames({ 'menu-item-active': currentPath === '/reward-discipline' }),
                },
                (selectedDirector || selectedHR || selectedManager || selectedEmployee) && {
                    key: "/employee-info",
                    label: <Link to={`/employee-info/${selectedEmployee || selectedManager || selectedHR || selectedDirector}`}>Thông tin nhân viên</Link>,
                    className: classNames({ 'menu-item-active': currentPath.startsWith('/employee-info') }),
                },
            ],
        },
        {
            key: "actions",
            icon: <TrophyOutlined />,
            label: "Khen thưởng/Kỷ luật",
            children: [
                {
                    key: "/actions",
                    label: <Link to="/actions">Quản lý Khen thưởng/Kỷ luật</Link>,
                    className: classNames({ 'menu-item-active': currentPath === '/actions' }),
                },
            ],
        },
        {
            key: "/notifications",
            icon: <BellOutlined />,
            label: <Link to="/notifications">Thông báo</Link>,
            className: classNames({ 'menu-item-active': currentPath === '/notifications' }),
        },
        {
            key: "/reports",
            icon: <FileTextOutlined />,
            label: <Link to="/reports">Báo cáo & Thống kê</Link>,
            className: classNames({ 'menu-item-active': currentPath === '/reports' }),
        },
    ];

    return (
        <>
            <Sider width={250} className="site-layout-background">
                <div style={{ padding: '10px' }}>
                    <Button type="primary" onClick={handleSwitchAccount} style={{ marginBottom: '10px' }}>
                        Switch Account
                    </Button>
                </div>

                <Menu
                    mode="inline"
                    defaultSelectedKeys={[currentPath]}
                    style={{ height: '100%', borderRight: 0 }}
                    className="sidebar-menu"
                    items={menuItems} // Sử dụng `items` thay vì `children`
                />
            </Sider>

            <Modal
                title="Switch Account"
                open={isModalOpen} // Đổi từ `visible` sang `open`
                onCancel={handleModalCancel}
                footer={null}
            >
                <Select
                    placeholder="Select Director"
                    onChange={(id) => handleRoleSelection(Role.Director, id)}
                    value={selectedDirector}
                    style={{ width: '100%', marginBottom: '10px' }}
                >
                    {directorList.map(director => (
                        <Option key={director.employeeId} value={director.employeeId}>
                            {director.name}
                        </Option>
                    ))}
                </Select>

                <Select
                    placeholder="Select HR"
                    onChange={(id) => handleRoleSelection(Role.HR, id)}
                    value={selectedHR}
                    style={{ width: '100%', marginBottom: '10px' }}
                >
                    {hrList.map(hr => (
                        <Option key={hr.employeeId} value={hr.employeeId}>
                            {hr.name}
                        </Option>
                    ))}
                </Select>

                <Select
                    placeholder="Select Manager"
                    onChange={(id) => handleRoleSelection(Role.Manager, id)}
                    value={selectedManager}
                    style={{ width: '100%', marginBottom: '10px' }}
                >
                    {managerList.map(manager => (
                        <Option key={manager.employeeId} value={manager.employeeId}>
                            {manager.name}
                        </Option>
                    ))}
                </Select>

                <Select
                    placeholder="Select Employee"
                    onChange={(id) => handleRoleSelection(Role.Employee, id)}
                    value={selectedEmployee}
                    style={{ width: '100%' }}
                >
                    {employeeList.map(employee => (
                        <Option key={employee.employeeId} value={employee.employeeId}>
                            {employee.name}
                        </Option>
                    ))}
                </Select>
            </Modal>
        </>
    );
};

export default Sidebar;
