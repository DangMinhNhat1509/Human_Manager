import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PacmanLoader } from 'react-spinners';
import { Table, Button, Pagination } from 'antd';
import { getAllActions } from '../../data/employeeService';
import { RewardDisciplineListItem } from '../../types/RewardDisciplineListItem';
import '../../styles/RewardDiscipline/RewardDiscipline.css';

const RewardDisciplinePage: React.FC = () => {
    const [actions, setActions] = useState<RewardDisciplineListItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchActions = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getAllActions();
                console.log(response);
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

    if (loading) {
        return (
            <div className="loader-container">
                <PacmanLoader color='#728FCE' size={70} />
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const columns = [
        {
            title: 'No',
            dataIndex: 'no',
            key: 'no',
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
                <Button onClick={() => handleViewDetail(record.actionId)}>
                    View
                </Button>
            ),
        },
    ];

    return (
        <div className='container'>
            <h1 className='title'>Action Page</h1>
            <div className='create-button'>
                <Link to="/actions/create">
                    <Button type="primary">Create New Action</Button>
                </Link>
            </div>
            {actions && Array.isArray(actions) && (
                <div className="table-container">
                    <Table
                        dataSource={showActions}
                        columns={columns}
                        pagination={false}
                        rowKey="actionId"
                    />
                    <Pagination
                        current={currentPage}
                        total={actions.length}
                        pageSize={itemsPerPage}
                        onChange={handlePageChange}
                        className="pagination"
                    />
                </div>
            )}
        </div>
    );
};

export default RewardDisciplinePage;
