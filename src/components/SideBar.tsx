import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Select, Button, Modal, message } from 'antd';
import { UserOutlined, TrophyOutlined, FileTextOutlined, BellOutlined } from '@ant-design/icons';
import { getAllEmployees, getAllDepartments } from '../modules/employee/services/employeeService';
import { Role } from '../types/Employee';
import { EmployeeListItem } from '../modules/employee/types/EmployeeListItem';
import { Department } from '../types/Department';
import { getCurrentUserRole, getCurrentUserId, setUserRole, setUserId } from '../utils/auth';

const { Sider } = Layout;
const { Option } = Select;

const Sidebar: React.FC = () => {
    const [employeeList, setEmployeeList] = useState<EmployeeListItem[]>([]);
    const [departmentList, setDepartmentList] = useState<Department[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<number | undefined>(undefined);
    const [selectedDepartmentName, setSelectedDepartmentName] = useState<string | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | undefined>(undefined);
    const [filteredEmployees, setFilteredEmployees] = useState<EmployeeListItem[]>([]);
    const [selectedEmployeeName, setSelectedEmployeeName] = useState<string | undefined>(undefined);

    const location = useLocation();
    const currentPath = location.pathname;
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const role = getCurrentUserRole();
            const employeeId = getCurrentUserId();
            setSelectedRole(role);
            setSelectedEmployee(employeeId);
        } catch (error) {
            setIsModalOpen(true);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [employees, departments] = await Promise.all([getAllEmployees(), getAllDepartments()]);
                setEmployeeList(employees);
                setDepartmentList(departments);
            } catch (error) {
                console.error('Error fetching data in Sidebar:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (selectedRole) {
            const roleFilteredEmployees = selectedRole === Role.Employee
                ? employeeList.filter(emp => emp.departmentName === selectedDepartmentName)
                : employeeList.filter(emp => emp.role === selectedRole);
            setFilteredEmployees(roleFilteredEmployees);
        }
    }, [employeeList, selectedDepartmentName, selectedRole]);

    useEffect(() => {
        if (selectedRole === Role.Employee && selectedEmployee) {
            const employee = employeeList.find(emp => emp.employeeId === selectedEmployee);
            setSelectedEmployeeName(employee?.name);
        } else {
            setSelectedEmployeeName(undefined);
        }
    }, [selectedEmployee, selectedRole, employeeList]);

    const handleRoleChange = (role: Role) => {
        setSelectedRole(role);
        setSelectedEmployee(undefined);
        setSelectedDepartmentName(undefined);
        setSelectedEmployeeName(undefined);
    };

    const handleDepartmentChange = (departmentName: string | undefined) => {
        setSelectedDepartmentName(departmentName);
    };

    const handleEmployeeChange = (employeeId: number | undefined) => {
        setSelectedEmployee(employeeId);
    };

    const handleSwitchAccount = () => {
        setIsModalOpen(true);
    };

    const handleModalOk = () => {
        if (selectedEmployee && selectedRole) {
            setUserRole(selectedRole);
            setUserId(selectedEmployee);
            navigate(`/employees/${selectedEmployee}`);
            setIsModalOpen(false);
        } else {
            message.error('Please select both role and employee.');
        }
    };

    const handleModalCancel = () => {
        setSelectedRole(undefined);
        setSelectedEmployee(undefined);
        setSelectedDepartmentName(undefined);
        setSelectedEmployeeName(undefined);
        setIsModalOpen(false);
    };

    const getMenuItems = () => {
        const role = getCurrentUserRole();
        const employeeId = getCurrentUserId();

        if (!role) return [];

        const menuItems = [];

        if (role === Role.Manager) {
            menuItems.push({
                key: "management",
                icon: <UserOutlined />,
                label: "Management",
                children: [
                    { key: "/employees", label: <Link to="/employees">Manage Employees</Link> },
                    { key: "/proposals", label: <Link to="/proposals">Proposals</Link> },
                    { key: "/reward-discipline", label: <Link to="/reward-discipline">Request Status</Link> },
                    employeeId && {
                        key: `/employees/${employeeId}`,
                        label: <Link to={`/employees/${employeeId}`}>Employee Information</Link>,
                    },
                ].filter(Boolean),
            });
            menuItems.push({
                key: "actions",
                icon: <TrophyOutlined />,
                label: "Rewards/Disciplinary Actions",
                children: [{ key: "/actions", label: <Link to="/actions">Manage Rewards/Disciplinary Actions</Link> }],
            });
        }

        if (role === Role.Director || role === Role.HR) {
            menuItems.push({
                key: "actions",
                icon: <TrophyOutlined />,
                label: "Rewards/Disciplinary Actions",
                children: [{ key: "/actions", label: <Link to="/actions">Manage Rewards/Disciplinary Actions</Link> }],
            });
        }

        menuItems.push(
            {
                key: "/notifications",
                icon: <BellOutlined />,
                label: <Link to="/notifications">Notifications</Link>,
            },
            {
                key: "/reports",
                icon: <FileTextOutlined />,
                label: <Link to="/reports">Reports & Statistics</Link>,
            }
        );

        return menuItems;
    };

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
                    selectedKeys={[currentPath]}
                    style={{ height: '100%', borderRight: 0 }}
                    items={getMenuItems()}
                />
            </Sider>

            <Modal
                title="Switch Account"
                open={isModalOpen}
                onCancel={handleModalCancel}
                onOk={handleModalOk}
                footer={[
                    <Button key="cancel" onClick={handleModalCancel}>
                        Cancel
                    </Button>,
                    <Button key="ok" type="primary" onClick={handleModalOk}>
                        Confirm
                    </Button>,
                ]}
            >
                <Select
                    placeholder="Select Role"
                    onChange={handleRoleChange}
                    value={selectedRole}
                    style={{ width: '100%', marginBottom: '10px' }}
                >
                    {Object.values(Role).map(role => (
                        <Option key={role} value={role}>
                            {role}
                        </Option>
                    ))}
                </Select>
                {selectedRole === Role.Employee && (
                    <Select
                        placeholder="Select Department"
                        onChange={handleDepartmentChange}
                        value={selectedDepartmentName}
                        style={{ width: '100%', marginBottom: '10px' }}
                    >
                        {departmentList.map(department => (
                            <Option key={department.departmentName} value={department.departmentName}>
                                {department.departmentName}
                            </Option>
                        ))}
                    </Select>
                )}
                <Select
                    placeholder={`Select ${selectedRole}`}
                    onChange={handleEmployeeChange}
                    value={selectedEmployee}
                    style={{ width: '100%', marginBottom: '10px' }}
                >
                    {filteredEmployees.map(employee => (
                        <Option key={employee.employeeId} value={employee.employeeId}>
                            {employee.name}
                        </Option>
                    ))}
                </Select>
                {selectedEmployeeName && (
                    <div>
                        <strong>Selected Employee:</strong> {selectedEmployeeName}
                    </div>
                )}
            </Modal>
        </>
    );
};

export default Sidebar;
