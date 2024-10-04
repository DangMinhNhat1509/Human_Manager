import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button, Spin, Pagination, Alert, Card } from 'antd';
import { getEmployeesByRole } from '../services/employee_service';
import { EmployeeListItem } from '../types/employee_list_item';
import { Role } from '../../../types/employee';
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
        {
            title: 'STT',
            key: 'no',
            render: (_: any, __: any, index: number) => startIndex + index + 1,
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber'
        },
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
            render: (text: string) => <span>{dayjs(text).format('DD/MM/YYYY')}</span>
        },
        {
            title: 'Phòng ban',
            dataIndex: 'departmentName',
            key: 'departmentName',
            render: (text: string) => <span>{text}</span>
        },
        {
            title: 'Chi tiết',
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
        <div style={{ padding: '24px' }}>

            <Card
                style={{ margin: '0 auto', padding: '10px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                title={'Quản lý nhân viên'}
                extra={
                    <Link to="/employees/create">
                        <Button type="primary">Tạo nhân viên mới</Button>
                    </Link>
                }
            >

                <Table
                    dataSource={showEmployees}
                    columns={columns}
                    rowKey="employeeId"
                    pagination={false}
                    style={{ margin: '10px' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', marginRight: '20px' }}>
                    <Pagination
                        current={currentPage}
                        pageSize={itemsPerPage}
                        total={employees.length}
                        onChange={handlePageChange}
                    />
                </div>
            </Card>
        </div>
    );
};

export default EmployeePage;
