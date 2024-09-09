import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button, Pagination, Spin, Typography, Input, Select, DatePicker } from 'antd';
import { getActionsByDepartment, getAllActions } from '../services/RewardDisciplineService';
import { RewardDisciplineListItem } from '../types/RewardDisciplineListItem';
import { getCurrentUserRole, getCurrentUserDepartmentId } from '../../../utils/auth';
import { ActionStatus, ActionType } from '../../../types/Action';
import { Role } from '../../../types/Employee';
import dayjs from 'dayjs';


const { Title } = Typography;
const { RangePicker } = DatePicker;

const RewardDisciplinePage: React.FC = () => {
    const [searchText, setSearchText] = useState<string>('');
    const [selectedDepartment, setSelectedDepartment] = useState<string>('');
    const [selectedActionType, setSelectedActionType] = useState<ActionType | undefined>(undefined);
    const [selectedStatus, setSelectedStatus] = useState<ActionStatus | undefined>(undefined);
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
                if (role === Role.Manager) {
                    const departmentId = await getCurrentUserDepartmentId();
                    if (departmentId !== undefined) {
                        response = await getActionsByDepartment(departmentId);
                    } else {
                        setError('Không có ID phòng ban.');
                    }
                } else if (role === Role.HR || role === Role.Director) {
                    response = await getAllActions();
                    response = response.filter(action => action.status !== ActionStatus.Draft);
                }

                if (response) {
                    setActions(response);
                }
            } catch (error: any) {
                setError(error.message || 'Lỗi mạng');
            } finally {
                setLoading(false);
            }
        };

        fetchActions();
    }, []);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const filterActions = (actions: RewardDisciplineListItem[]) => {
        return actions
            .filter(action => {
                const matchesSearchText = action.employeeId.toString().includes(searchText) ||
                    action.actionType.toLowerCase().includes(searchText.toLowerCase());
                const matchesDepartment = userRole === Role.Manager || !selectedDepartment ? true : action.departmentName === selectedDepartment;
                const matchesActionType = selectedActionType ? action.actionType === selectedActionType : true;
                const matchesStatus = selectedStatus ? action.status === selectedStatus : true;
                const matchesDateRange = dateRange ? (
                    dayjs(action.actionDate).isAfter(dateRange[0], 'day') &&
                    dayjs(action.actionDate).isBefore(dateRange[1], 'day')
                ) : true;

                return matchesSearchText && matchesDepartment && matchesActionType && matchesStatus && matchesDateRange;
            })
            .sort((a, b) => dayjs(b.actionDate).unix() - dayjs(a.actionDate).unix());
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const showActions = filterActions(actions).slice(startIndex, startIndex + itemsPerPage);

    const handleViewDetail = (actionId: number) => {
        navigate(`/actions/${actionId}`, { state: { action: { actionId } } });
    };

    const columns = [
        {
            title: 'STT',
            key: 'no',
            render: (_: any, __: any, index: number) => startIndex + index + 1,
        },
        {
            title: 'Nhân viên',
            dataIndex: 'employeeName',
            key: 'employeeName',
        },
        {
            title: 'Loại hành động',
            dataIndex: 'actionType',
            key: 'actionType',
        },
        {
            title: 'Phân loại hành động',
            dataIndex: 'actionSubtype',
            key: 'actionSubtype',
        },
        {
            title: 'Ngày hành động',
            dataIndex: 'actionDate',
            key: 'actionDate',
            render: (date: string) => dayjs(date).format('MMMM D, YYYY h:mm:ss A'),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_: any, record: RewardDisciplineListItem) => (
                <Button type="link" onClick={() => handleViewDetail(record.actionId)}>
                    Xem
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
                <Typography.Text type="danger">Lỗi: {error}</Typography.Text>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            <Title level={1}>Quản lý khen thưởng và kỷ luật</Title>

            <div style={{ marginBottom: '16px' }}>
                <Input.Search
                    placeholder="Tìm theo ID nhân viên hoặc Loại hành động"
                    enterButton
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>
            <div style={{ marginBottom: '16px' }}>
                {userRole !== Role.Manager && (
                    <Select
                        placeholder="Chọn Phòng ban"
                        style={{ width: 200, marginRight: '8px' }}
                        value={selectedDepartment}
                        onChange={(value) => setSelectedDepartment(value)}
                    >
                    </Select>
                )}
                <Select
                    placeholder="Chọn Loại hành động"
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
                <Select
                    placeholder="Chọn Trạng thái"
                    style={{ width: 200, marginRight: '8px' }}
                    value={selectedStatus}
                    onChange={(value) => setSelectedStatus(value as ActionStatus)}
                >
                    {Object.keys(ActionStatus).map((key) => (
                        <Select.Option key={key} value={ActionStatus[key as keyof typeof ActionStatus]}>
                            {ActionStatus[key as keyof typeof ActionStatus]}
                        </Select.Option>
                    ))}
                </Select>
                <RangePicker
                    style={{ width: 300, marginLeft: '8px' }}
                    value={dateRange}
                    onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
                />
            </div>

            {userRole === Role.Manager && (
                <div style={{ marginBottom: '16px' }}>
                    <Link to="/actions/create">
                        <Button type="primary">Tạo hành động mới</Button>
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
                        total={filterActions(actions).length}
                        onChange={handlePageChange}
                        style={{ textAlign: 'center' }}
                    />
                </>
            )}
        </div>
    );
};

export default RewardDisciplinePage;
