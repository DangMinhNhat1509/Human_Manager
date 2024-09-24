import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Pagination, Spin, Typography, Input, Select, DatePicker, message, Card } from 'antd';
import { getActionsByDepartment, getAllActions } from '../services/reward_discipline_service';
import { RewardDisciplineListItem } from '../types/reward_discipline_list_item';
import { getCurrentUserRole, getCurrentUserDepartmentId } from '../../../utils/auth';
import { ActionStatus, ActionType } from '../../../types/action';
import { Role } from '../../../types/employee';
import dayjs from 'dayjs';
import { getAllDepartments } from '../../employee/services/employee_service';
import { Department } from '../../../types/department';


const { RangePicker } = DatePicker;

const RewardDisciplinePage: React.FC = () => {
    const [searchText, setSearchText] = useState<string>('');
    const [departments, setDepartments] = useState<Department[]>([]);
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

        const fetchDepartments = async () => {
            try {
                const fetchedDepartments = await getAllDepartments();
                setDepartments(fetchedDepartments);
            } catch (error) {
                message.error('Lỗi khi lấy danh sách phòng ban. Vui lòng thử lại sau.');
            }
        };

        fetchDepartments();
    }, []);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const filterActions = (actions: RewardDisciplineListItem[]) => {
        return actions
            .filter(action => {
                const matchesSearchText = action.employeeName.toLowerCase().includes(searchText);
                const matchesDepartment = selectedDepartment ? action.departmentName === selectedDepartment : true;
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

    const handleClearFilter = () => {
        setSelectedDepartment('');
        setSelectedActionType(undefined);
        setSelectedStatus(undefined);
    }

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
        ...userRole === Role.Director || userRole === Role.HR ? [{
            title: 'Phòng ban',
            dataIndex: 'departmentName',
            key: 'departmentName',
        }] : [],
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
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
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
            <Card
                title={'Quản lý khen thưởng và kỷ luật'}
                extra={userRole === Role.Manager &&
                    <Button
                        type="primary"
                        onClick={() => navigate('/actions/create')}
                    >
                        Tạo hành động mới
                    </Button>
                }
                style={{ margin: '0 auto', padding: '10px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            >

                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: 16 }}>
                    <Input.Search
                        placeholder="Tìm theo tên nhân viên"
                        enterButton
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ flex: '0 0 auto', maxWidth: '250px', marginRight: 'auto' }}
                    />
                    {userRole !== Role.Manager && (
                        <Select
                            placeholder="Chọn Phòng ban"
                            style={{ width: 150 }}
                            value={selectedDepartment || undefined}
                            onChange={(value) => setSelectedDepartment(value)}
                        >
                            {departments.map(department => (
                                <Select.Option key={department.departmentId} value={department.departmentName}>
                                    {department.departmentName}
                                </Select.Option>
                            ))}
                        </Select>
                    )}
                    <Select
                        placeholder="Chọn Loại hành động"
                        style={{ width: 150 }}
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
                        style={{ width: 150 }}
                        value={selectedStatus}
                        onChange={(value) => setSelectedStatus(value as ActionStatus)}
                    >
                        {Object.keys(ActionStatus)
                            .filter(key => ActionStatus[key as keyof typeof ActionStatus] !== ActionStatus.Draft)
                            .map((key) => (
                                <Select.Option key={key} value={ActionStatus[key as keyof typeof ActionStatus]}>
                                    {ActionStatus[key as keyof typeof ActionStatus]}
                                </Select.Option>
                            ))}
                    </Select>
                    <RangePicker
                        style={{ flex: '1 1 auto', maxWidth: '250px' }}
                        value={dateRange}
                        onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
                    />
                    <Button
                        onClick={handleClearFilter}
                        danger
                        type="primary"
                        style={{ fontSize: '16px' }}
                    >
                        X
                    </Button>
                </div>



                {actions && Array.isArray(actions) && (
                    <div>
                        <Table
                            dataSource={showActions}
                            columns={columns}
                            pagination={false}
                            rowKey="actionId"
                            style={{ marginBottom: '16px' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', marginRight: '20px' }}>
                            <Pagination
                                current={currentPage}
                                pageSize={itemsPerPage}
                                total={filterActions(actions).length}
                                onChange={handlePageChange}
                                style={{ textAlign: 'center' }}
                            />
                        </div>
                    </div>
                )}
            </Card>
        </div >
    );
};

export default RewardDisciplinePage;
