import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Col, Row, Typography, Modal, Spin } from 'antd';
import EmployeeUpdateModal from './EmployeeUpdateModal';
import { EmployeeDetail } from '../types/EmployeeDetail';
import { Role } from '../../../types/Employee';
import { getEmployeeById, deleteEmployee } from '../services/employeeService';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface EmployeeDetailPageProps {
    viewOnly?: boolean;
}

const EmployeeDetailPage: React.FC<EmployeeDetailPageProps> = ({ viewOnly = false }) => {
    const { employeeId } = useParams<{ employeeId: string }>();
    const navigate = useNavigate();
    const [employeeDetail, setEmployeeDetail] = useState<EmployeeDetail | null>(null);
    const [updating, setUpdating] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleBackClick = () => {
        navigate(-1);
    };

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
        <div>
            {!viewOnly && (
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
                    <Card title="Profile Picture" style={{ borderRadius: '8px', textAlign: 'center' }}>
                        <img
                            src={employeeDetail.avatar}
                            alt="Avatar"
                            style={{ width: '80%', borderRadius: '8px', marginBottom: '10px' }}
                        />
                        {!viewOnly && (
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
                                    Update Profile
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
                                    Delete Employee
                                </Button>
                            </>
                        )}
                    </Card>
                </Col>

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

            {showUpdateModal && employeeDetail && !viewOnly && (
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
