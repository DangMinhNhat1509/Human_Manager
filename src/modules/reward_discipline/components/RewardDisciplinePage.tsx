import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button, Pagination, Spin, Typography } from 'antd';
import { getActionsByDepartment, getAllActions } from '../services/RewardDisciplineService';
import { RewardDisciplineListItem } from '../types/RewardDisciplineListItem';
import { getCurrentUserRole, getCurrentUserDepartmentId } from '../../../utils/auth';
import { ActionStatus } from '../../../types/Action'
import dayjs from 'dayjs';

const { Title } = Typography;

const RewardDisciplinePage: React.FC = () => {
    const [actions, setActions] = useState<RewardDisciplineListItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [userRole, setUserRole] = useState<string | null>(null);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchActions = async () => {
            setLoading(true);
            setError(null);
            try {
                const role = getCurrentUserRole();
                setUserRole(role);

                let response: RewardDisciplineListItem[] = [];
                if (role === 'Manager') {
                    const departmentId = await getCurrentUserDepartmentId();
                    response = await getActionsByDepartment(departmentId);
                } else if (role === 'HR' || role === 'Director') {
                    response = await getAllActions();
                    response = response.filter(action => action.status !== ActionStatus.Draft);
                }

                setActions(response);
            } catch (error: any) {
                console.error('Error fetching actions:', error);
                setError(error.message || 'Network error');
            } finally {
                setLoading(false);
            }
        };

        fetchActions();
    }, []);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const showActions = actions.slice(startIndex, startIndex + itemsPerPage);

    const handleViewDetail = (actionId: number) => {
        navigate(`/actions/${actionId}`, { state: { action: { actionId } } });
    };

    const columns = [
        {
            title: 'No',
            key: 'no',
            render: (_: any, __: any, index: number) => startIndex + index + 1,
        },
        {
            title: 'Employee ID',
            dataIndex: 'employeeId',
            key: 'employeeId',
        },
        {
            title: 'Action Type',
            dataIndex: 'actionType',
            key: 'actionType',
        },
        {
            title: 'Action Subtype',
            dataIndex: 'actionSubtype',
            key: 'actionSubtype',
        },
        {
            title: 'Action Date',
            dataIndex: 'actionDate',
            key: 'actionDate',
            render: (date: string) => dayjs(date).format('MMMM D, YYYY h:mm:ss A'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: RewardDisciplineListItem) => (
                <Button type="link" onClick={() => handleViewDetail(record.actionId)}>
                    View
                </Button>
            ),
        },
    ];

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Typography.Text type="danger">Error: {error}</Typography.Text>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            <Title level={1}>Reward and Discipline Management</Title>
            {userRole === 'Manager' && (
                <div style={{ marginBottom: '16px' }}>
                    <Link to="/actions/create">
                        <Button type="primary">Create New Action</Button>
                    </Link>
                </div>
            )}
            {actions && Array.isArray(actions) && (
                <>
                    <Table
                        dataSource={showActions}
                        columns={columns}
                        pagination={false}
                        rowKey="actionId"
                        style={{ marginBottom: '16px' }}
                    />
                    <Pagination
                        current={currentPage}
                        pageSize={itemsPerPage}
                        total={actions.length}
                        onChange={handlePageChange}
                        style={{ textAlign: 'center' }}
                    />
                </>
            )}
        </div>
    );
};

export default RewardDisciplinePage;
