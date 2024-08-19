import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { getActionById } from '../../employee/services/employeeService';
import { Action } from '../types/Action';

const RewardDisciplineDetailPage: React.FC = () => {
    const { actionId } = useParams<{ actionId: string }>();
    const [action, setAction] = useState<Action | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAction = async () => {
            setLoading(true);
            setError(null);
            try {
                if (actionId) {
                    const fetchedAction = await getActionById(parseInt(actionId, 10));
                    setAction(fetchedAction);
                }
            } catch (error: any) {
                console.error('Error fetching action:', error);
                setError(error.message || 'Network error');
            } finally {
                setLoading(false);
            }
        };

        fetchAction();
    }, [actionId]);

    const handleBack = () => {
        navigate('/actions');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!action) {
        return <div>Action not found</div>;
    }

    return (
        <div className='detail-container'>
            <h1>Action Detail</h1>
            <p><strong>Employee ID:</strong> {action.employeeId}</p>
            <p><strong>Action Type:</strong> {action.actionType}</p>
            <p><strong>Action Subtype:</strong> {action.actionSubtype}</p>
            <p><strong>Action Date:</strong> {action.actionDate}</p>
            <p><strong>Status:</strong> {action.status}</p>
            <p><strong>Reason:</strong> {action.reason}</p>
            {action.amount && <p><strong>Amount:</strong> {action.amount}</p>}
            {action.duration && <p><strong>Duration:</strong> {action.duration} days</p>}
            <Button onClick={handleBack}>Back</Button>
        </div>
    );
};

export default RewardDisciplineDetailPage;
