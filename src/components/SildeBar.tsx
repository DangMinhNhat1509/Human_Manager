import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Select } from 'antd';
import {
    UserOutlined,
    TrophyOutlined,
    FileTextOutlined,
    BellOutlined,
} from '@ant-design/icons';
import classNames from 'classnames';
import { getAllEmployees } from '../data/employeeService';

const { Sider } = Layout;
const { Option } = Select;

interface SidebarProps {
    roles: { role: string, ids: number[] }[]; // Danh sách các vai trò và ID
}

const Sidebar: React.FC<SidebarProps> = ({ roles }) => {
    const [selectedRole, setSelectedRole] = useState<string>('Employee');
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const location = useLocation();
    const currentPath = location.pathname;
    const navigate = useNavigate();

    const handleRoleChange = (value: string) => {
        setSelectedRole(value);
        setSelectedId(null); // Reset ID khi thay đổi role
        navigate('/'); // Điều hướng về trang chủ hoặc trang tương ứng
    };

    const handleIdChange = (value: number) => {
        setSelectedId(value);
        // Bạn có thể điều hướng tới trang tương ứng với ID, ví dụ:
        navigate(`/employee/${value}`);
    };

    return (
        <Sider width={250} className="site-layout-background">
            <div style={{ padding: '10px' }}>
                <Select
                    defaultValue={selectedRole}
                    onChange={handleRoleChange}
                    style={{ width: '100%', marginBottom: '10px' }}
                >
                    {roles.map(role => (
                        <Option key={role.role} value={role.role}>
                            {role.role}
                        </Option>
                    ))}
                </Select>

                {selectedRole && (
                    <Select
                        placeholder="Select ID"
                        value={selectedId}
                        onChange={handleIdChange}
                        style={{ width: '100%' }}
                    >
                        {roles.find(r => r.role === selectedRole)?.ids.map(id => (
                            <Option key={id} value={id}>
                                ID: {id}
                            </Option>
                        ))}
                    </Select>
                )}
            </div>

            <Menu
                mode="inline"
                defaultSelectedKeys={[currentPath]}
                style={{ height: '100%', borderRight: 0 }}
                className="sidebar-menu"
            >
                {/* Management Section */}
                {(selectedRole === 'Manager' || selectedRole === 'Director') && (
                    <Menu.SubMenu key="management" title="Quản lý" icon={<UserOutlined />}>
                        {selectedRole === 'Manager' && (
                            <>
                                <Menu.Item key="/employees" className={classNames({ 'menu-item-active': currentPath === '/employees' })}>
                                    <Link to="/employees">Quản lý Nhân viên</Link>
                                </Menu.Item>
                                <Menu.Item key="/proposals" className={classNames({ 'menu-item-active': currentPath === '/proposals' })}>
                                    <Link to="/proposals">Đề xuất</Link>
                                </Menu.Item>
                                <Menu.Item key="/requests" className={classNames({ 'menu-item-active': currentPath === '/requests' })}>
                                    <Link to="/requests">Tình trạng đơn</Link>
                                </Menu.Item>
                            </>
                        )}
                        {selectedRole === 'Director' && (
                            <Menu.Item key="/departments" className={classNames({ 'menu-item-active': currentPath === '/departments' })}>
                                <Link to="/departments">Quản lý Phòng ban</Link>
                            </Menu.Item>
                        )}
                    </Menu.SubMenu>
                )}

                {/* Actions Section */}
                {(selectedRole === 'HR' || selectedRole === 'Director') && (
                    <Menu.SubMenu key="actions" title="Khen thưởng/Kỷ luật" icon={<TrophyOutlined />}>
                        <Menu.Item key="/actions/rewards" className={classNames({ 'menu-item-active': currentPath === '/actions/rewards' })}>
                            <Link to="/actions/rewards">Quản lý Khen thưởng</Link>
                        </Menu.Item>
                        <Menu.Item key="/actions/discipline" className={classNames({ 'menu-item-active': currentPath === '/actions/discipline' })}>
                            <Link to="/actions/discipline">Quản lý Kỷ luật</Link>
                        </Menu.Item>
                    </Menu.SubMenu>
                )}

                {/* Notifications Section */}
                {selectedRole === 'Employee' && (
                    <Menu.Item key="/notifications" icon={<BellOutlined />} className={classNames({ 'menu-item-active': currentPath === '/notifications' })}>
                        <Link to="/notifications">Thông báo</Link>
                    </Menu.Item>
                )}

                {/* Reports Section */}
                <Menu.Item key="/reports" icon={<FileTextOutlined />} className={classNames({ 'menu-item-active': currentPath === '/reports' })}>
                    <Link to="/reports">Báo cáo & Thống kê</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    );
};

export default Sidebar;
