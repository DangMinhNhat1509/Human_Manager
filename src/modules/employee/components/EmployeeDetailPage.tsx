import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Col, Row, Typography, Modal, Spin } from 'antd';
import EmployeeUpdateModal from './EmployeeUpdateModal';
import { EmployeeDetail } from '../types/employee_detail';
import { Role } from '../../../types/employee';
import { getEmployeeById, deleteEmployee } from '../services/employee_service';
import { getCurrentUserId } from '../../../utils/auth';
import { ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;



const EmployeeDetailPage: React.FC = () => {
    const { employeeId } = useParams<{ employeeId: string }>();
    const navigate = useNavigate();
    const [employeeDetail, setEmployeeDetail] = useState<EmployeeDetail | null>(null);
    const [updating, setUpdating] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const currentUserId = getCurrentUserId();
    const handleBackClick = () => {
        navigate(-1);
    };

    useEffect(() => {
        const fetchEmployeeDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                if (!employeeId) {
                    throw new Error('ID nhân viên không tìm thấy');
                }
                const response = await getEmployeeById(Number(employeeId));
                setEmployeeDetail(response);
            } catch (error: any) {
                setError(error.response ? error.response.data : 'Lỗi mạng');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeDetail();
    }, [employeeId]);

    const handleUpdateClick = () => {
        setShowUpdateModal(true);
    };

    const handleUpdateSuccess = () => {
        setShowUpdateModal(false);
        setUpdating(true);
        if (employeeDetail) {
            getEmployeeById(employeeDetail.employeeId).then((response) => {
                setEmployeeDetail(response);
                setUpdating(false);
            }).catch((error) => {
                setError(error.response ? error.response.data : 'Lỗi mạng');
                setUpdating(false);
            });
        }
    };

    const handleDeleteClick = async () => {
        if (employeeDetail) {
            Modal.confirm({
                title: 'Xác nhận xóa nhân viên',
                content: `Bạn có chắc chắn muốn xóa nhân viên ${employeeDetail.name} không?`,
                okText: 'Xóa',
                cancelText: 'Hủy',
                onOk: async () => {
                    setLoading(true);
                    setError(null);
                    try {
                        await deleteEmployee(employeeDetail.employeeId);
                        Modal.success({
                            content: `${employeeDetail.name} đã bị xóa`,
                            onOk: () => navigate('/employees'),
                        })
                    } catch (error: any) {
                        setError(error.response ? error.response.data : 'Lỗi mạng');
                    } finally {
                        setLoading(false);
                    }
                },
                onCancel() { },
            })
        }
    }

    if (loading || updating) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Text type="danger">Lỗi: {error}</Text>
            </div>
        );
    }

    if (!employeeDetail) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Text>Không có thông tin chi tiết về nhân viên.</Text>
            </div>
        );
    }

    return (
        <div>
            {currentUserId !== employeeDetail.employeeId && (
                <Button
                    type="link"
                    icon={<ArrowLeftOutlined />}
                    onClick={handleBackClick}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '16px',
                        color: '#1890ff',
                        padding: '20px 0',
                    }}
                >
                    {employeeDetail.name}
                </Button>
            )}


            <Row style={{ marginBottom: '20px' }} gutter={24}>
                <Col span={7}>
                    <Card title="Ảnh đại diện" style={{ borderRadius: '8px', textAlign: 'center' }}>
                        <img
                            src={employeeDetail.avatar}
                            alt="Avatar"
                            style={{ width: '80%', borderRadius: '8px', marginBottom: '10px' }}
                        />
                        {currentUserId !== employeeDetail.employeeId && (
                            <>
                                <Button
                                    type="primary"
                                    block
                                    onClick={handleUpdateClick}
                                    style={{
                                        width: '80%',
                                        height: '36px',
                                        marginTop: '10px'
                                    }}
                                >
                                    Cập nhật hồ sơ
                                </Button>
                                <Button
                                    type="primary"
                                    danger
                                    block
                                    onClick={handleDeleteClick}
                                    style={{
                                        width: '80%',
                                        height: '36px',
                                        marginTop: '10px'
                                    }}
                                >
                                    Xóa nhân viên
                                </Button>
                            </>
                        )}
                    </Card>
                </Col>

                <Col span={16}>
                    <Card title="Chi tiết nhân viên" style={{ borderRadius: '8px' }}>
                        {[
                            { label: 'Tên', value: employeeDetail.name },
                            { label: 'Giới tính', value: employeeDetail.gender },
                            { label: 'Email', value: employeeDetail.email },
                            { label: 'Số điện thoại', value: employeeDetail.phoneNumber },
                            { label: 'Ngày sinh', value: dayjs(employeeDetail.dateOfBirth).format('DD/MM/YYYY') },
                            { label: 'Địa chỉ', value: employeeDetail.address },
                            { label: 'Trạng thái', value: employeeDetail.status ? 'Hoạt động' : 'Không hoạt động' },
                            { label: 'Phòng ban', value: employeeDetail.departmentName },
                            { label: 'Vai trò', value: Role[employeeDetail.role] }
                        ].map(({ label, value }, index) => (
                            <Row key={index} style={{ marginBottom: '16px' }}>
                                <Col span={8}>
                                    <Title level={5} style={{ margin: 0 }}>{label}</Title>
                                </Col>
                                <Col span={16}>
                                    <Text style={{ backgroundColor: '#f0f2f5', padding: '4px 8px', borderRadius: '4px' }}>
                                        {value}
                                    </Text>
                                </Col>
                            </Row>
                        ))}
                    </Card>
                </Col>
            </Row>

            {showUpdateModal && employeeDetail && (
                <EmployeeUpdateModal
                    show={showUpdateModal}
                    onHide={() => setShowUpdateModal(false)}
                    employeeDetail={employeeDetail}
                    onUpdateSuccess={handleUpdateSuccess}
                />
            )}
        </div>
    );
};

export default EmployeeDetailPage;
