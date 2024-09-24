import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Select, Button, Modal, message, Switch } from 'antd';
import { UserOutlined, TrophyOutlined, FileTextOutlined, BellOutlined, SettingOutlined, SyncOutlined, BgColorsOutlined } from '@ant-design/icons';
import { getAllEmployees, getAllDepartments } from '../modules/employee/services/employee_service';
import { Role } from '../types/employee';
import { EmployeeListItem } from '../modules/employee/types/employee_list_item';
import { Department } from '../types/department';
import { getCurrentUserRole, getCurrentUserId, setUserRole, setUserId } from '../utils/auth';

const { Sider } = Layout;
const { Option } = Select;

interface SidebarProps {
    onThemeChange: (theme: 'light' | 'dark') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onThemeChange }) => {
    const [employeeList, setEmployeeList] = useState<EmployeeListItem[]>([]);
    const [departmentList, setDepartmentList] = useState<Department[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<number | undefined>(undefined);
    const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | undefined>(undefined);
    const [filteredEmployees, setFilteredEmployees] = useState<EmployeeListItem[]>([]);
    const [menuTheme, setMenuTheme] = useState<'light' | 'dark'>('light');

    const location = useLocation();
    const currentPath = location.pathname;
    const navigate = useNavigate();
    const role = getCurrentUserRole();
    const userId = getCurrentUserId();

    useEffect(() => {
        try {
            if (!role || !userId) {
                setIsModalOpen(true);
            } else {
                setSelectedRole(role);
                setSelectedEmployee(userId);
            }
        } catch (error) {
            setIsModalOpen(true);
        }
    }, [role, userId]);


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
                ? employeeList.filter(emp => emp.role === Role.Employee && emp.departmentName === selectedDepartment)
                : employeeList.filter(emp => emp.role === selectedRole);
            setFilteredEmployees(roleFilteredEmployees);
        }
    }, [employeeList, selectedDepartment, selectedRole]);

    const handleThemeChange = (checked: boolean) => {
        const newTheme = checked ? 'dark' : 'light';
        setMenuTheme(newTheme);
        onThemeChange(newTheme);
    };

    const handleRoleChange = (role: Role) => {
        setSelectedRole(role);
        setSelectedEmployee(undefined);
        setSelectedDepartment(undefined);
    };

    const handleDepartmentChange = (departmentName: string | undefined) => {
        setSelectedDepartment(departmentName);
        setSelectedEmployee(undefined);
    };

    const handleEmployeeChange = (employeeId: number | undefined) => {
        setSelectedEmployee(employeeId);
    };

    const handleSwitchAccount = () => {
        setIsModalOpen(true);
        setSelectedRole(undefined);
        setSelectedDepartment(undefined);
        setSelectedEmployee(undefined);
    };

    const handleModalOk = () => {
        if (selectedEmployee && selectedRole) {
            if (selectedEmployee === userId) {
                message.error('Không thể đổi tài khoản với chính bạn.');
                return;
            }
            setUserRole(selectedRole);
            setUserId(selectedEmployee);
            navigate(`/employees/${selectedEmployee}`);
            setIsModalOpen(false);
        } else {
            message.error('Vui lòng chọn cả vai trò và nhân viên.');
        }
    };

    const handleModalCancel = () => {
        setSelectedRole(undefined);
        setSelectedEmployee(undefined);
        setSelectedDepartment(undefined);
        setIsModalOpen(false);
    };

    const getMenuItems = () => {
        if (!role) return [];

        const menuItems = [];

        menuItems.push({
            key: "/accounts",
            icon: <SyncOutlined />,
            label: <Link to='#' onClick={handleSwitchAccount}>Đổi tài khoản</Link>
        },
            {
                key: "/account",
                icon: <UserOutlined />,
                label: <Link to={`/employees/${userId}`}>Trang cá nhân</Link>
            }
        )

        if (role === Role.Director || role === Role.HR) {
            menuItems.push({
                key: "/employees",
                icon: <UserOutlined />,
                label: <Link to="/employees">Quản lý nhân viên</Link>
            },
                {
                    key: "/Statistics",
                    icon: <FileTextOutlined />,
                    label: <Link to="/statistics">Báo cáo và thống kê</Link>,
                });
        }

        if (role === Role.Manager || role === Role.Director || role === Role.HR) {
            menuItems.push({
                key: "/actions",
                icon: <TrophyOutlined />,
                label: <Link to="/actions">Quản lý khen thưởng và kỷ luật</Link>
            });
        }

        if (role === Role.Employee) {
            menuItems.push({
                key: "/notifications",
                icon: <BellOutlined />,
                label: <Link to="/notifications">Thông báo</Link>,

            })
        }

        menuItems.push(
            {
                key: "/settings",
                icon: <SettingOutlined />,
                label: 'Cài đặt',
                children: [
                    {
                        key: "theme",
                        icon: <BgColorsOutlined />,
                        label: (
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                Chủ đề
                                <Switch
                                    style={{ marginLeft: '8px' }}
                                    checkedChildren='Tối'
                                    unCheckedChildren='Sáng'
                                    checked={menuTheme === 'dark'}
                                    onChange={handleThemeChange}
                                />
                            </span>
                        )
                    }
                ]
            }

        );

        return menuItems;
    };

    return (
        <>
            <Sider
                trigger={null}
                width={'300px'}
                theme={menuTheme}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    insetInlineStart: 0,
                    top: 0,
                    bottom: 0,
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'unset',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}

            >
                <Menu
                    theme={menuTheme}
                    selectedKeys={[currentPath]}
                    mode="inline"
                    items={getMenuItems()}
                />

                <Modal
                    title="Đổi tài khoản"
                    open={isModalOpen}
                    onCancel={handleModalCancel}
                    onOk={handleModalOk}
                    footer={[
                        <Button key="cancel" onClick={handleModalCancel}>
                            Hủy
                        </Button>,
                        <Button key="ok" type="primary" onClick={handleModalOk}>
                            Xác nhận
                        </Button>,
                    ]}
                >
                    <Select
                        placeholder="Chọn vai trò"
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

                    {/* Chỉ hiện trường chọn phòng ban khi vai trò là "Employee" */}
                    {selectedRole === Role.Employee && (
                        <Select
                            placeholder="Chọn phòng ban"
                            onChange={handleDepartmentChange}
                            value={selectedDepartment}
                            style={{ width: '100%', marginBottom: '10px' }}
                        >
                            {departmentList.map(department => (
                                <Option key={department.departmentName} value={department.departmentName}>
                                    {department.departmentName}
                                </Option>
                            ))}
                        </Select>
                    )}

                    {/* Chỉ hiện trường chọn nhân viên khi đã chọn phòng ban (với vai trò Employee) hoặc với các vai trò khác */}
                    {selectedRole && ((selectedRole === Role.Employee && selectedDepartment) || selectedRole !== Role.Employee) && (
                        <Select
                            placeholder={`Chọn ${selectedRole}`}
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
                    )}
                </Modal>

            </Sider>
        </>
    );
};

export default Sidebar;
