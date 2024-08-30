import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Checkbox, Button, DatePicker, message, Select, Row, Col, Typography, Card } from 'antd';
import dayjs from 'dayjs';
import { EmployeeDetail } from '../types/EmployeeDetail';
import { updateEmployee, getAllDepartments } from '../services/employeeService';
import { Department } from '../../../types/Department';

const { Option } = Select;
const { Title } = Typography;

interface EmployeeUpdateModalProps {
    show: boolean;
    onHide: () => void;
    employeeDetail: EmployeeDetail;
    onUpdateSuccess: (updatedEmployee: EmployeeDetail) => void;
}

const EmployeeUpdateModal: React.FC<EmployeeUpdateModalProps> = ({ show, onHide, employeeDetail, onUpdateSuccess }) => {
    const [form] = Form.useForm();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [avatarUrl, setAvatarUrl] = useState<string>(employeeDetail.avatar || '');
    const [isFocused, setIsFocused] = useState(false);

    const isPreviewVisible = avatarUrl && isFocused;

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const fetchedDepartments = await getAllDepartments();
                setDepartments(fetchedDepartments);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };

        fetchDepartments();
    }, []);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAvatarUrl(e.target.value);
    };

    const handleFocusBlur = (focus: boolean) => {
        setIsFocused(focus);
    };

    const handleClose = () => {
        form.resetFields();
        onHide();
    };

    const handleSubmit = async (values: any) => {
        try {
            const updatedEmployee: EmployeeDetail = {
                ...values,
                dateOfBirth: values.dateOfBirth ? dayjs(values.dateOfBirth).format('YYYY-MM-DD') : '',
                employeeId: employeeDetail.employeeId
            };

            await updateEmployee(employeeDetail.employeeId, updatedEmployee);

            message.success('Employee updated successfully!');
            onUpdateSuccess(updatedEmployee);
            handleClose();
        } catch (error) {
            console.error('Error updating employee:', error);
            message.error('Error updating employee. Please try again.');
        }
    };

    return (
        <Modal
            title={<Title level={2}>Update Employee Information</Title>}
            visible={show}
            onCancel={handleClose}
            footer={null}
            width={800}
        >
            <Card
                bordered={false}
                style={{ padding: '30px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        ...employeeDetail,
                        dateOfBirth: employeeDetail.dateOfBirth ? dayjs(employeeDetail.dateOfBirth) : null,
                    }}
                    onFinish={handleSubmit}
                >
                    <Row gutter={16}>
                        <Col span={24} md={12}>
                            <Form.Item
                                name="name"
                                label="Name"
                                rules={[{ required: true, message: 'Please enter the employee name' }]}
                            >
                                <Input placeholder="Enter employee name" />
                            </Form.Item>
                        </Col>

                        <Col span={24} md={12}>
                            <Form.Item
                                name="gender"
                                label="Gender"
                                rules={[{ required: true, message: 'Please enter the gender' }]}
                            >
                                <Input placeholder="Enter gender" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24} md={12}>
                            <Form.Item
                                name="dateOfBirth"
                                label="Date of Birth"
                                rules={[
                                    { required: true, message: 'Please select the date of birth' },
                                    {
                                        validator: (_, value) => {
                                            if (value && !dayjs(value).isValid()) {
                                                return Promise.reject('Invalid date format!');
                                            }
                                            const age = dayjs().diff(dayjs(value), 'year');
                                            if (age < 18 || age > 80) {
                                                return Promise.reject('Age must be between 18 and 80 years!');
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]}
                            >
                                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                            </Form.Item>
                        </Col>

                        <Col span={24} md={12}>
                            <Form.Item
                                name="email"
                                label="Email address"
                                rules={[{ required: true, type: 'email', message: 'Please enter a valid email address' }]}
                            >
                                <Input placeholder="Enter email" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24} md={12}>
                            <Form.Item
                                name="phoneNumber"
                                label="Phone"
                                rules={[{ required: true, message: 'Please enter the phone number' }]}
                            >
                                <Input placeholder="Enter phone number" />
                            </Form.Item>
                        </Col>

                        <Col span={24} md={12}>
                            <Form.Item
                                name="departmentId"
                                label="Department"
                                rules={[{ required: true, message: 'Please select the department' }]}
                            >
                                <Select placeholder="Select department">
                                    {departments.map(dep => (
                                        <Option key={dep.departmentId} value={dep.departmentId}>
                                            {dep.departmentName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="address"
                        label="Address"
                        rules={[{ required: true, message: 'Please enter the address' }]}
                    >
                        <Input.TextArea rows={3} placeholder="Enter address" />
                    </Form.Item>

                    <Form.Item
                        name="avatar"
                        label="Avatar URL"
                        rules={[
                            {
                                validator: (_, value) => {
                                    if (value && !/^https?:\/\/.+/.test(value)) {
                                        return Promise.reject('Invalid URL format for avatar!');
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Input
                            placeholder="Enter Avatar URL"
                            value={avatarUrl}
                            onChange={handleAvatarChange}
                            onFocus={() => handleFocusBlur(true)}
                            onBlur={() => handleFocusBlur(false)}
                        />
                    </Form.Item>

                    {avatarUrl && isFocused && (
                        <Form.Item label="Avatar Preview">
                            <img
                                src={avatarUrl}
                                alt="Avatar"
                                style={{ width: '150px', height: '150px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #d9d9d9' }}
                            />
                        </Form.Item>
                    )}

                    <Form.Item
                        name="status"
                        label="Status"
                        valuePropName="checked"
                    >
                        <Checkbox>Active</Checkbox>
                    </Form.Item>

                    <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="primary" htmlType="submit" style={{ marginRight: '16px' }}>
                            Save Changes
                        </Button>
                        <Button onClick={handleClose}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Modal>
    );
};

export default EmployeeUpdateModal;
