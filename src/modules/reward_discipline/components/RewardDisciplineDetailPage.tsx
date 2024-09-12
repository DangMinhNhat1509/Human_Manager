import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, Card, Typography, Spin, message, Modal, Descriptions, Collapse } from 'antd';
import { getActionDetailById, approveOrRejectAction } from '../services/reward_discipline_service';
import { ActionStatus, ActionType } from '../../../types/action';
import { RewardDisciplineDetail } from '../types/reward_discipline_detail';
import { Role } from '../../../types/employee';
import { ApprovalAction } from '../../../types/approval_log';
import { getCurrentUserRole } from '../../../utils/auth';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const RewardDisciplineDetailPage: React.FC = () => {
    const { actionId } = useParams<{ actionId: string }>();
    const [action, setAction] = useState<RewardDisciplineDetail | null>(null);
    const [loading, setLoading] = useState(false);
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
                    const fetchedAction = await getActionDetailById(parseInt(actionId, 10));
                    setAction(fetchedAction);
                }
            } catch (error: any) {
                setError(error.message || 'Lỗi kết nối mạng');
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
                title: 'Bạn có chắc chắn muốn phê duyệt hành động này không?',
                onOk: async () => {
                    try {
                        await approveOrRejectAction(parseInt(actionId, 10), ApprovalAction.Approve, note, 1);
                        setAction({ ...action, status: ActionStatus.Approved });
                        message.success('Phê duyệt thành công');
                    } catch (error) {
                        setError('Phê duyệt thất bại');
                    }
                },
            });
        }
    };

    const handleReject = async () => {
        if (action && actionId) {
            Modal.confirm({
                title: 'Bạn có chắc chắn muốn từ chối hành động này không?',
                onOk: async () => {
                    try {
                        await approveOrRejectAction(parseInt(actionId, 10), ApprovalAction.Reject, note, 1);
                        setAction({ ...action, status: ActionStatus.Rejected });
                        message.success('Từ chối thành công');
                    } catch (error) {
                        setError('Từ chối thất bại');
                    }
                },
            });
        }
    };

    const handleRequestEdit = async () => {
        if (action && actionId) {
            Modal.confirm({
                title: 'Bạn có chắc muốn yêu cầu chỉnh sửa hành động này không?',
                onOk: async () => {
                    try {
                        await approveOrRejectAction(parseInt(actionId, 10), ApprovalAction.RequestEdit, note, 1);
                        setAction(prevAction => prevAction ? { ...action, status: ActionStatus.Editing } : null);
                        message.success('Yêu cầu chỉnh sửa đã được gửi');
                    } catch (error) {
                        setError('Yêu cầu chỉnh sửa thất bại');
                    }
                },
            });
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
        return <div style={{ textAlign: 'center', marginTop: 50 }}><Paragraph>Không tìm thấy hành động</Paragraph></div>;
    }

    return (
        <>
            <Card
                title="Chi tiết hành động"
                extra={<Button onClick={handleBack}>Quay lại</Button>}
                style={{ maxWidth: 800, margin: '0 auto' }}
            >
                <Title level={2}>Chi tiết</Title>
                <Paragraph><strong>Nhân viên:</strong> {action.employeeName}</Paragraph>
                <Paragraph><strong>Phòng ban:</strong> {action.departmentName}</Paragraph>
                <Paragraph><strong>Loại hành động:</strong> {action.actionType}</Paragraph>
                <Paragraph><strong>Phân loại:</strong> {action.actionSubtype}</Paragraph>
                <Paragraph><strong>Ngày thực hiện:</strong> {dayjs(action.actionDate).format('DD/MM/YYYY')}</Paragraph>
                {action.actionType === ActionType.Reward && action.amount && (
                    <Paragraph><strong>Số tiền:</strong> {action.amount}</Paragraph>
                )}
                {action.actionType === ActionType.Disciplinary && action.duration && (
                    <Paragraph><strong>Thời gian:</strong> {action.duration} ngày</Paragraph>
                )}
                <Paragraph><strong>Trạng thái:</strong> {action.status}</Paragraph>
                <Paragraph><strong>Lý do:</strong> {action.reason}</Paragraph>

                {(role === Role.HR || role === Role.Director) && action.status === ActionStatus.Pending && (
                    <>
                        <Input.TextArea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Nhập ghi chú của bạn"
                            rows={4}
                            style={{ marginBottom: 16 }}
                        />
                        <Button type="default" onClick={handleRequestEdit} style={{ marginRight: 8 }}>
                            Yêu cầu chỉnh sửa
                        </Button>
                        <Button type="primary" onClick={handleApprove} style={{ marginRight: 8 }}>
                            Phê duyệt
                        </Button>
                        <Button danger type="primary" onClick={handleReject}>
                            Từ chối
                        </Button>
                    </>
                )}

                {action.approvalLogs && action.approvalLogs.length > 0 && (
                    <>
                        <Title level={3}>Nhật ký phê duyệt</Title>
                        <Collapse>
                            {action.approvalLogs.map((log) => (
                                <Panel header={`Phê duyệt bởi ${log.approverName}`} key={log.approvalLogId}>
                                    <Descriptions bordered column={1}>
                                        <Descriptions.Item label="Người phê duyệt">
                                            {log.approverName}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Hành động">
                                            {log.action}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Ngày">
                                            {dayjs(log.approvalDate).format('MMMM D, YYYY h:mm:ss A')}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Ghi chú">
                                            {log.note}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Panel>
                            ))}
                        </Collapse>
                    </>
                )}

                {role === Role.Manager && (action.status === ActionStatus.Draft || action.status === ActionStatus.Editing) && (
                    <Button type="primary" onClick={handleEdit} style={{ marginTop: 16 }}>
                        Chỉnh sửa
                    </Button>
                )}
            </Card>
        </>
    );
};

export default RewardDisciplineDetailPage;
