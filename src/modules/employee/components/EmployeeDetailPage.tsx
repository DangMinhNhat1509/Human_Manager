import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Col, Row, Typography, Modal, Spin } from 'antd';
import EmployeeUpdateModal from './EmployeeUpdateModal';
import { EmployeeDetail } from '../types/EmployeeDetail';
import { Role } from '../types/Employee';
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
            <Title level={1}>Employee Details</Title>
            <Card>
                <Row gutter={16}>
                    <Col span={8}>
                        <img src={employeeDetail.avatar} alt="Avatar" style={{ width: '100%', borderRadius: '8px' }} />
                    </Col>
                    <Col span={16}>
                        <div>
                            <Title level={4}>Name</Title>
                            <Text>{employeeDetail.name}</Text>
                        </div>
                        <div>
                            <Title level={4}>Gender</Title>
                            <Text>{employeeDetail.gender}</Text>
                        </div>
                        <div>
                            <Title level={4}>Email</Title>
                            <Text>{employeeDetail.email}</Text>
                        </div>
                        <div>
                            <Title level={4}>Phone</Title>
                            <Text>{employeeDetail.phoneNumber}</Text>
                        </div>
                        <div>
                            <Title level={4}>Date of Birth</Title>
                            <Text>{employeeDetail.dateOfBirth}</Text>
                        </div>
                        <div>
                            <Title level={4}>Address</Title>
                            <Text>{employeeDetail.address}</Text>
                        </div>
                        <div>
                            <Title level={4}>Status</Title>
                            <Text>{employeeDetail.status ? 'Active' : 'Inactive'}</Text>
                        </div>
                        <div>
                            <Title level={4}>Department</Title>
                            <Text>{employeeDetail.departmentName}</Text>
                        </div>
                        <div>
                            <Title level={4}>Role</Title>
                            <Text>{Role[employeeDetail.role]}</Text>
                        </div>
                    </Col>
                </Row>
                <div style={{ marginTop: '20px' }}>
                    <Link to="/employees">
                        <Button>Back to List</Button>
                    </Link>
                    <Button type="primary" style={{ margin: '0 8px' }} onClick={handleUpdateClick}>
                        Update Info
                    </Button>
                    <Button
                        type="primary"
                        danger
                        onClick={handleDeleteClick}
                    >
                        Delete
                    </Button>
                </div>
            </Card>

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
