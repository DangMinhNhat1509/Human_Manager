import React, { useEffect, useState } from "react";
import { getCurrentUserId } from "../../../utils/auth";
import { RewardDisciplineListItem } from "../types/reward_discipline_list_item";
import { getActionDetailById, getApprovedActionsByEmployeeId } from "../services/reward_discipline_service";
import { Button, Card, Modal, Spin, Table, Typography } from "antd";
import dayjs from "dayjs";
import { RewardDisciplineDetail } from "../types/reward_discipline_detail";
import { ActionType } from "../../../types/action";
import { ApprovalLog } from "../../../types/approval_log";

const { Title, Paragraph } = Typography;


const EmployeeNotificationPage: React.FC = () => {
    const [actions, setActions] = useState<RewardDisciplineListItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAction, setSelectedAction] = useState<RewardDisciplineDetail | null>(null);
    const [lastApproval, setLastApproval] = useState<ApprovalLog & { approverName?: string } | null>(null);
    const employeeId = getCurrentUserId();

    useEffect(() => {

        const fetchActions = async () => {
            setLoading(true);
            setError(null);
            try {
                if (employeeId) {
                    const fetchedActions = await getApprovedActionsByEmployeeId(employeeId);
                    setActions(fetchedActions);
                }
            } catch (error: any) {
                setError(error.message || 'Lỗi kết nối mạng');
            } finally {
                setLoading(false);
            }
        }
        fetchActions();
    }, [employeeId]);

    const showActionDetail = async (actionId: number) => {
        setLoading(true);
        try {
            const actionDetail = await getActionDetailById(actionId);
            const lastApprovalLog = actionDetail.approvalLogs[actionDetail.approvalLogs.length - 1];
            setLastApproval(lastApprovalLog);
            setSelectedAction(actionDetail);
            setModalVisible(true);
        } catch (error: any) {
            setError(error.message || 'Lỗi khi lấy chi tiết hành động');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedAction(null);
    }

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>
    }

    if (error) {
        return <div style={{ textAlign: 'center', marginTop: 50 }}><Paragraph type="danger">{error}</Paragraph></div>
    }



    return (
        <>
            <Card
                title="Danh sách thông báo của bạn"
                style={{ margin: '0 20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            >
                <Table
                    columns={[
                        {
                            title: 'Quyết định số',
                            dataIndex: 'actionId',
                            key: 'actionId',
                        },
                        {
                            title: 'Loại hành động',
                            dataIndex: 'actionType',
                            key: 'actionType',
                            render: (actionType: string) => (
                                <span style={{ color: actionType === ActionType.Reward ? 'green' : 'red' }}>
                                    {actionType}
                                </span>
                            ),
                        },
                        {
                            title: 'Hình thức',
                            dataIndex: 'actionSubtype',
                            key: 'actionSubtype',
                        },
                        {
                            title: 'Ngày thực hiện',
                            dataIndex: 'actionDate',
                            key: 'actionDate',
                            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
                        },
                        {
                            title: 'Chi tiết',
                            key: 'details',
                            render: (_: any, record: RewardDisciplineListItem) => (
                                <Button onClick={() => showActionDetail(record.actionId)}>Xem chi tiết</Button>
                            ),
                        },
                    ]}
                    dataSource={actions}
                    rowKey="actionId"
                    style={{ backgroundColor: '#f9f9f9' }}
                />
            </Card>


            {/* Modal để hiển thị chi tiết */}
            <Modal
                title={`Chi tiết hành động ${selectedAction?.actionId}`}
                open={modalVisible}
                onCancel={handleCloseModal}
                footer={[
                    <Button key="close" onClick={handleCloseModal}>
                        Đóng
                    </Button>,
                ]}
            >
                {selectedAction && (
                    <>
                        {selectedAction.actionType === ActionType.Reward ?
                            (<Title><strong>Quyết định khen thưởng </strong></Title>)
                            : (<Title><strong>Quyết định kỷ luật </strong></Title>)
                        }
                        <Paragraph><strong>Nhân viên: </strong> {selectedAction.employeeName}</Paragraph>
                        <Paragraph><strong>Hình thức: </strong>{selectedAction.actionSubtype}</Paragraph>
                        <Paragraph><strong>Ngày thực hiện quyết định:</strong> {dayjs(selectedAction.actionDate).format('DD/MM/YYYY')}</Paragraph>
                        <Paragraph><strong>Lý do:</strong> {selectedAction.reason}</Paragraph>
                        {selectedAction.amount ? (
                            <Paragraph><strong>Số tiền:</strong> {selectedAction.amount.toLocaleString('vi-VN')} VND</Paragraph>
                        ) : null}
                        {selectedAction.duration ? (
                            <Paragraph><strong>Thời gian:</strong> {selectedAction.duration} ngày</Paragraph>
                        ) : undefined}

                        {lastApproval && (
                            <>
                                <Paragraph>
                                    <strong>Phê duyệt bởi: </strong> {lastApproval.approverName}
                                    {" vào ngày "} {dayjs(lastApproval.approvalDate).format('DD/MM/YYYY')}
                                </Paragraph>
                                {lastApproval.note ? (<Paragraph><strong>Ghi chú: </strong> {lastApproval.note}</Paragraph>) : null}

                            </>
                        )}

                    </>
                )}

            </Modal>
        </>
    );
}

export default EmployeeNotificationPage;