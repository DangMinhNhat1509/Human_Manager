import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, Card, List, Typography, Spin, message, Modal } from 'antd';
import { getActionById, approveOrRejectAction, getApprovalLogs } from '../services/RewardDisciplineService';
import { Action, ActionStatus, ActionType } from '../../../types/Action';
import { Role } from '../../../types/Employee';
import { ApprovalAction, ApprovalLog } from '../../../types/ApprovalLog';
import { getCurrentUserRole } from '../../../utils/auth';
import dayjs from 'dayjs';
const { Title, Paragraph } = Typography;

const RewardDisciplineDetailPage: React.FC = () => {
    const { actionId } = useParams<{ actionId: string }>();
    const [action, setAction] = useState<Action | null>(null);
    const [loading, setLoading] = useState(false);
    const [approvalLogs, setApprovalLogs] = useState<ApprovalLog[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [note, setNote] = useState<string>('');
    const navigate = useNavigate();
    const role = getCurrentUserRole();

    useEffect(() => {
        const fetchAction = async () => {
            setLoading(true);
            setError(null);
            try {
                if (actionId) {

                    const fetchedAction = await getActionById(parseInt(actionId, 10));
                    setAction(fetchedAction);
                    const logs = await getApprovalLogs(parseInt(actionId, 10));
                    setApprovalLogs(logs);
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

    const handleApprove = async () => {
        if (action && actionId) {
            Modal.confirm({
                title: 'Are you sure you want to approve this action?',
                onOk: async () => {
                    try {
                        await approveOrRejectAction(parseInt(actionId, 10), ApprovalAction.Approve, note, 1);
                        setAction({ ...action, status: ActionStatus.Approved });
                        message.success('Action approved successfully');
                    } catch (error) {
                        console.error('Error approving action:', error);
                        setError('Failed to approve action');
                    }
                },
            });

        }
    };

    const handleReject = async () => {
        if (action && actionId) {
            Modal.confirm({
                title: 'Are you sure you want to reject this action?',
                onOk: async () => {
                    try {
                        await approveOrRejectAction(parseInt(actionId, 10), ApprovalAction.Reject, note, 1);
                        setAction({ ...action, status: ActionStatus.Rejected });
                        message.success('Action rejected successfully');
                    } catch (error) {
                        console.error('Error rejecting action:', error);
                        setError('Failed to reject action');
                    }
                },
            });
        }
    };

    const handleRequestEdit = async () => {
        if (action && actionId) {
            try {
                await approveOrRejectAction(parseInt(actionId, 10), ApprovalAction.RequestEdit, note, 1);
                setAction(prevAction => prevAction ? { ...action, status: ActionStatus.Editing } : null);
                message.success('Request for edit sent successfully');
            } catch (error) {
                console.error('Error requesting edit:', error);
                setError('Failed to request edit');
            }
        }
    };

    const handleEdit = () => {
        if (action && role === Role.Manager && (action.status === ActionStatus.Draft || action.status === ActionStatus.Editing)) {
            navigate(`/actions/update/${actionId}`);
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>;
    }

    if (error) {
        return <div style={{ textAlign: 'center', marginTop: 50 }}><Paragraph type="danger">{error}</Paragraph></div>;
    }

    if (!action) {
        return <div style={{ textAlign: 'center', marginTop: 50 }}><Paragraph>Action not found</Paragraph></div>;
    }

    return (
        <Card
            title="Action Detail"
            extra={<Button onClick={handleBack}>Back</Button>}
            style={{ maxWidth: 800, margin: '0 auto' }}
        >
            <Title level={2}>Details</Title>
            <Paragraph><strong>Employee ID:</strong> {action.employeeId}</Paragraph>
            <Paragraph><strong>Action Type:</strong> {action.actionType}</Paragraph>
            <Paragraph><strong>Action Subtype:</strong> {action.actionSubtype}</Paragraph>
            <Paragraph><strong>Action Date:</strong> {dayjs(action.actionDate).format('MMMM D, YYYY h:mm:ss A')}</Paragraph>
            {action.actionType === ActionType.Reward && action.amount && (
                <Paragraph><strong>Amount:</strong> {action.amount}</Paragraph>
            )}
            {action.actionType === ActionType.Disciplinary && action.duration && (
                <Paragraph><strong>Duration:</strong> {action.duration} days</Paragraph>
            )}
            <Paragraph><strong>Status:</strong> {action.status}</Paragraph>
            <Paragraph><strong>Reason:</strong> {action.reason}</Paragraph>

            {(role === Role.HR || role === Role.Director) && (
                <>
                    <Input.TextArea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Enter your note"
                        rows={4}
                        style={{ marginBottom: 16 }}
                    />
                    {action.status !== ActionStatus.Approved && action.status !== ActionStatus.Rejected && (
                        <>
                            <Button type="default" onClick={handleRequestEdit} style={{ marginTop: 16 }}>
                                Request Edit
                            </Button>
                            <Button type="primary" onClick={handleApprove} style={{ marginRight: 8 }}>
                                Approve
                            </Button>
                            <Button danger type="primary" onClick={handleReject}>
                                Reject
                            </Button>
                        </>
                    )}
                </>
            )}

            <Title level={3}>Approval Logs</Title>
            <List
                bordered
                dataSource={approvalLogs}
                renderItem={(log) => (
                    <List.Item>
                        <Typography.Text><strong>Approver:</strong> {log.approverId}</Typography.Text>
                        <Typography.Text><strong>Action:</strong> {log.action}</Typography.Text>
                        <Typography.Text><strong>Date:</strong> {dayjs(log.approvalDate).format('MMMM D, YYYY h:mm:ss A')}</Typography.Text>
                        <Typography.Text><strong>Note:</strong> {log.note}</Typography.Text>
                    </List.Item>
                )}
            />

            {role === Role.Manager && (action.status === ActionStatus.Draft || action.status === ActionStatus.Editing) && (
                <Button type="primary" onClick={handleEdit} style={{ marginTop: 16 }}>
                    Edit
                </Button>
            )}
        </Card>
    );

};

export default RewardDisciplineDetailPage;
