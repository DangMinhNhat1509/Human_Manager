import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Col, Row, Typography, Modal, Spin } from 'antd';
import EmployeeUpdateModal from './EmployeeUpdateModal';
import { EmployeeDetail } from '../types/EmployeeDetail';
import { Role } from '../../../types/Employee';
import { getEmployeeById, deleteEmployee } from '../services/employeeService';

const { Title, Text } = Typography;

const EmployeeDetailPage: React.FC = () => {
    const { employeeId } = useParams<{ employeeId: string }>();
    const navigate = useNavigate();
    const [employeeDetail, setEmployeeDetail] = useState<EmployeeDetail | null>(null);
    const [updating, setUpdating] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmployeeDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                if (!employeeId) {
                    throw new Error('Employee ID is not found');
                }
                const response = await getEmployeeById(Number(employeeId)); // Convert employeeId to number if needed
                setEmployeeDetail(response);
            } catch (error: any) {
                console.error('Error fetching employee detail:', error);
                setError(error.response ? error.response.data : 'Network error');
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
                console.error('Error fetching employee detail:', error);
                setError(error.response ? error.response.data : 'Network error');
                setUpdating(false);
            });
        }
    };

    const handleDeleteClick = async () => {
        if (employeeDetail && window.confirm('Are you sure you want to delete this employee?')) {
            setLoading(true);
            setError(null);
            try {
                await deleteEmployee(employeeDetail.employeeId);
                Modal.success({
                    content: `${employeeDetail.name} has been deleted`,
                    onOk: () => navigate('/employees'),
                });
            } catch (error: any) {
                console.error('Error deleting employee:', error);
                setError(error.response ? error.response.data : 'Network error');
            } finally {
                setLoading(false);
            }
        }
    };

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
                <Text type="danger">Error: {error}</Text>
            </div>
        );
    }

    if (!employeeDetail) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Text>No employee details available.</Text>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <Row style={{ marginBottom: '20px' }} gutter={20}>
                <Col span={8}>
                    <Card
                        style={{ textAlign: 'center', borderRadius: '8px' }}
                        cover={
                            <img
                                src={employeeDetail.avatar}
                                alt="Avatar"
                                style={{ width: '100%', borderRadius: '8px' }}
                            />
                        }
                        actions={[
                            <Button type="primary" block onClick={handleUpdateClick}>
                                Update Profile
                            </Button>,
                            <Button type="primary" danger block onClick={handleDeleteClick}>
                                Delete Employee
                            </Button>
                        ]}
                    />
                </Col>

                {/* Card for Employee Details */}
                <Col span={16}>
                    <Card title="Employee Details" style={{ borderRadius: '8px' }}>
                        {[
                            { label: 'Name', value: employeeDetail.name },
                            { label: 'Gender', value: employeeDetail.gender },
                            { label: 'Email', value: employeeDetail.email },
                            { label: 'Phone', value: employeeDetail.phoneNumber },
                            { label: 'Date of Birth', value: employeeDetail.dateOfBirth },
                            { label: 'Address', value: employeeDetail.address },
                            { label: 'Status', value: employeeDetail.status ? 'Active' : 'Inactive' },
                            { label: 'Department', value: employeeDetail.departmentName },
                            { label: 'Role', value: Role[employeeDetail.role] }
                        ].map(({ label, value }, index) => (
                            <Row key={index} style={{ marginBottom: '16px' }}>
                                <Col span={8}>
                                    <Title level={4} style={{ margin: 0 }}>{label}</Title>
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
