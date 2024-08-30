import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button, Pagination, Spin, Typography } from 'antd';
import { getActionsByDepartment, getAllActions } from '../services/RewardDisciplineService';
import { RewardDisciplineListItem } from '../types/RewardDisciplineListItem';
import { getCurrentUserRole, getCurrentUserDepartmentId } from '../../../utils/auth';
import { ActionStatus, ActionSubtype, ActionType } from '../../../types/Action'
import { Input, Select, DatePicker } from 'antd';
// import {getDepart}

import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const RewardDisciplinePage: React.FC = () => {
    const [searchText, setSearchText] = useState<string>('');
    const [selectedDepartment, setSelectedDepartment] = useState<string>('');
    const [selectedActionType, setSelectedActionType] = useState<ActionType | undefined>(undefined);
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
    const [actions, setActions] = useState<RewardDisciplineListItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [userRole, setUserRole] = useState<string | undefined>(undefined);
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

                    if (departmentId !== undefined) {
                        response = await getActionsByDepartment(departmentId);
                    } else {
                        setError('Department ID is not available.');
                    }
                } else if (role === 'HR' || role === 'Director') {
                    response = await getAllActions();
                    response = response.filter(action => action.status !== ActionStatus.Draft);
                }

                if (response) {
                    setActions(response);
                }
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

            <div style={{ marginBottom: '16px' }}>
                <Input.Search
                    placeholder="Search by EmployeeId or Action Type"
                    enterButton
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>
            <div style={{ marginBottom: '16px' }}>
                <Select
                    placeholder="Select Department"
                    style={{ width: 200, marginRight: '8px' }}
                    value={selectedDepartment}
                    onChange={(value) => setSelectedDepartment(value)}
                ></Select>
                <Select
                    placeholder="Select Action Type"
                    style={{ width: 200, marginRight: '8px' }}
                    value={selectedActionType}
                    onChange={(value) => setSelectedActionType(value as ActionType)}
                >
                    {Object.keys(ActionType).map((key) => (
                        <Select.Option key={key} value={ActionType[key as keyof typeof ActionType]}>
                            {ActionType[key as keyof typeof ActionType]}
                        </Select.Option>
                    ))}
                </Select>
                <RangePicker
                    style={{ width: 300 }}
                    value={dateRange}
                    onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
                />
            </div>

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
