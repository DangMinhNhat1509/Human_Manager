import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, Card, Typography, Spin, message, Modal, Descriptions, Collapse } from 'antd';
import { getActionDetailById, approveOrRejectAction, updateActionStatus } from '../services/reward_discipline_service';
import { ActionStatus, ActionSubtype } from '../../../types/action';
import { RewardDisciplineDetail } from '../types/reward_discipline_detail';
import { Role } from '../../../types/employee';
import { ApprovalAction } from '../../../types/approval_log';
import { getCurrentUserId, getCurrentUserRole } from '../../../utils/auth';
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
    const userId = Number(getCurrentUserId());

    const fetchAction = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            if (actionId) {
                const fetchedAction = await getActionDetailById(Number(actionId));
                setAction(fetchedAction);
            }
        } catch (error: any) {
            setError(error.message || 'Lỗi kết nối mạng');
        } finally {
            setLoading(false);
        }
    }, [actionId]);


    useEffect(() => {
        fetchAction();
    }, [fetchAction]);

    const handleBack = () => {
        navigate('/actions');
    };

    const requiresDirectorApproval = (action: RewardDisciplineDetail) => {
        const highAmount = action.amount && action.amount > 10000000;
        const longDuration = action.duration && action.duration > 30;
        const criticalSubtypes = [ActionSubtype.Audit, ActionSubtype.Termination].includes(action.actionSubtype);
        return highAmount || longDuration || criticalSubtypes;
    };

    const handleApprove = async () => {
        if (action && actionId) {
            Modal.confirm({
                title: 'Bạn có chắc chắn muốn phê duyệt hành động này không?',
                onOk: async () => {
                    try {
                        await approveOrRejectAction(Number(actionId), ApprovalAction.Approve, note, userId);
                        setAction({ ...action, status: ActionStatus.Approved });
                        message.success('Phê duyệt thành công');
                        await fetchAction();
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
                        await approveOrRejectAction(Number(actionId), ApprovalAction.Reject, note, userId);
                        setAction({ ...action, status: ActionStatus.Rejected });
                        message.success('Từ chối thành công');
                        await fetchAction();
                    } catch (error) {
                        setError('Từ chối thất bại');
                    }
                },
            });
        }
    };

    const handleCancel = async () => {
        if (action && actionId) {
            Modal.confirm({
                title: 'Bạn có chắc muốn hủy bỏ đề xuất này?',
                onOk: async () => {
                    try {
                        await updateActionStatus(Number(actionId), ActionStatus.Cancelled);
                        setAction({ ...action, status: ActionStatus.Cancelled });
                        message.success('Hủy bỏ quyết định thành công')
                        navigate('/actions')
                    } catch {
                        setError('Hủy bỏ đề xuất thất bại')
                    }
                }
            })
        }
    }
    const handleRequestEdit = async () => {
        if (action && actionId) {
            Modal.confirm({
                title: 'Bạn có chắc muốn yêu cầu chỉnh sửa hành động này không?',
                onOk: async () => {
                    try {
                        await approveOrRejectAction(Number(actionId), ApprovalAction.RequestEdit, note, userId);
                        setAction(prevAction => prevAction ? { ...action, status: ActionStatus.Editing } : null);
                        message.success('Yêu cầu chỉnh sửa đã được gửi');
                        await fetchAction();
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
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Nhân viên">{action.employeeName}</Descriptions.Item>
                    <Descriptions.Item label="Phòng ban">{action.departmentName}</Descriptions.Item>
                    <Descriptions.Item label="Loại hành động">{action.actionType}</Descriptions.Item>
                    <Descriptions.Item label="Phân loại">{action.actionSubtype}</Descriptions.Item>
                    <Descriptions.Item label="Ngày thực hiện">{dayjs(action.actionDate).format('DD/MM/YYYY')}</Descriptions.Item>

                    {action.amount && (
                        <Descriptions.Item label="Số tiền">{action.amount.toLocaleString('vi-VN')} VND</Descriptions.Item>
                    )}
                    {action.duration && (
                        <Descriptions.Item label="Thời gian">{action.duration} ngày</Descriptions.Item>
                    )}

                    <Descriptions.Item label="Lý do">{action.reason}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">{action.status}</Descriptions.Item>
                </Descriptions>

                {/* Duyệt đơn nhẹ Role là HR */}
                {role === Role.HR && !requiresDirectorApproval(action) && action.status === ActionStatus.Pending && (
                    <>
                        <Input.TextArea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Nhập ghi chú của bạn"
                            rows={4}
                            style={{ margin: '16px 0' }}
                        />
                        <div style={{ textAlign: 'right' }}>
                            <Button type="default" onClick={handleRequestEdit} style={{ marginRight: 8 }}>
                                Yêu cầu chỉnh sửa
                            </Button>
                            <Button type="primary" onClick={handleApprove} style={{ marginRight: 8 }}>
                                Phê duyệt
                            </Button>
                            <Button danger type="primary" onClick={handleReject}>
                                Từ chối
                            </Button>
                        </div>
                    </>
                )}

                {/* Duyệt đơn nặng với role là Director */}
                {role === Role.Director && requiresDirectorApproval(action) && action.status === ActionStatus.Pending && (
                    <>
                        <Input.TextArea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Nhập ghi chú của bạn"
                            rows={4}
                            style={{ margin: '16px 0' }}
                        />
                        <div style={{ textAlign: 'right' }}>
                            <Button type="default" onClick={handleRequestEdit} style={{ marginRight: 8 }}>
                                Yêu cầu chỉnh sửa
                            </Button>
                            <Button type="primary" onClick={handleApprove} style={{ marginRight: 8 }}>
                                Phê duyệt
                            </Button>
                            <Button danger type="primary" onClick={handleReject}>
                                Từ chối
                            </Button>
                        </div>
                    </>
                )}


                {/* Cho phép manager cancel nếu đang pending */}
                {role === Role.Manager && (action.status === ActionStatus.Pending) && (
                    <div style={{ textAlign: 'right' }}>
                        <Button type="primary" danger onClick={handleCancel} style={{ marginTop: 24 }}>
                            Hủy bỏ đề xuất
                        </Button>
                    </div>
                )}

                {/* Cho phép chỉnh sửa nếu là Manager */}
                {role === Role.Manager && (action.status === ActionStatus.Draft || action.status === ActionStatus.Editing) && (
                    <div style={{ textAlign: 'right' }}>
                        <Button type="primary" onClick={handleEdit} style={{ marginTop: 24 }}>
                            Chỉnh sửa
                        </Button>
                    </div>
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
            </Card>
        </>
    );
};

export default RewardDisciplineDetailPage;

