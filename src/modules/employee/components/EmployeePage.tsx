import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button, Spin, Pagination, Alert } from 'antd';
import { getAllEmployees } from '../services/employeeService';
import { EmployeeListItem } from '../types/EmployeeListItem';

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
                const response = await getAllEmployees();
                setEmployees(response);
            } catch (error: any) {
                setError(error.message || 'Network error');
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
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Phone Number', dataIndex: 'phoneNumber', key: 'phoneNumber' },
        { title: 'Gender', dataIndex: 'gender', key: 'gender' },
        { title: 'Department', dataIndex: 'departmentName', key: 'departmentName' },
        { title: 'Role', dataIndex: 'role', key: 'role' },
        {
            title: 'Actions',
            key: 'actions',
            render: (text: any, record: EmployeeListItem) => (
                <Button
                    type="link"
                    onClick={() => navigate(`/employees/${record.employeeId}`, { state: { employee: { employeeId: record.employeeId } } })}
                >
                    View
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
        return <Alert message="Error" description={error} type="error" showIcon />;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ textAlign: 'center' }}>Employee Page</h1>
            <div style={{ marginBottom: '20px', textAlign: 'right' }}>
                <Link to="/employees/create">
                    <Button type="primary">Create New Employee</Button>
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
