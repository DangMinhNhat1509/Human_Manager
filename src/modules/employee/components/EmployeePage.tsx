import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button, Spin, Pagination, Alert } from 'antd';
import { getEmployeesByRole } from '../services/employeeService';
import { EmployeeListItem } from '../types/EmployeeListItem';
import { Role } from '../../../types/Employee';
import dayjs from 'dayjs'; 
import _ from 'lodash';

const EmployeePage: React.FC = () => {
    const [employees, setEmployees] = useState<EmployeeListItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getEmployeesByRole(Role.Employee);
                setEmployees(response);
            } catch (error: any) {
                setError(error.message || 'Lỗi mạng');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const showEmployees = employees.slice(startIndex, endIndex);

    const columns = [
        { title: 'Tên', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Số điện thoại', dataIndex: 'phoneNumber', key: 'phoneNumber' },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            render: (text: string) => <span>{_.capitalize(text)}</span>
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
            render: (text: string) => <span>{dayjs(text).format('MMMM D YYYY')}</span>
        },
        {
            title: 'Phòng ban',
            dataIndex: 'departmentName',
            key: 'departmentName',
            render: (text: string) => <span>{text}</span>
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (text: any, record: EmployeeListItem) => (
                <Button
                    type="link"
                    onClick={() => navigate(`/employees/${record.employeeId}`, { state: { employee: { employeeId: record.employeeId } } })}
                >
                    Xem
                </Button>
            ),
        },
    ];

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return <Alert message="Lỗi" description={error} type="error" showIcon />;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ textAlign: 'center' }}>Trang nhân viên</h1>
            <div style={{ marginBottom: '20px', textAlign: 'right' }}>
                <Link to="/employees/create">
                    <Button type="primary">Tạo nhân viên mới</Button>
                </Link>
            </div>
            <Table
                dataSource={showEmployees}
                columns={columns}
                rowKey="employeeId"
                pagination={false}
            />
            <Pagination
                current={currentPage}
                pageSize={itemsPerPage}
                total={employees.length}
                onChange={handlePageChange}
                style={{ textAlign: 'center', marginTop: '20px' }}
            />
        </div>
    );
};

export default EmployeePage;
