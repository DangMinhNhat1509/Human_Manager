import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, DatePicker, message, Card, Row, Col, Typography, Select } from 'antd';
import { createEmployee, getAllDepartments } from '../services/employeeService';
import dayjs from 'dayjs';
import { Department } from '../../../types/Department';

const { Title } = Typography;
const { Option } = Select;

const CreateEmployeePage: React.FC = () => {
    const navigate = useNavigate();
    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const [isFocused, setIsFocused] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState<Department[]>([]);

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

    const handleClear = () => {
        form.resetFields();
        setAvatarUrl('');
        setIsFocused(false);
    };

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const formattedData = {
                ...values,
                dateOfBirth: dayjs(values.dateOfBirth).format('YYYY-MM-DD'),
                departmentId: departments.find(dep => dep.departmentName === values.department)?.departmentId,
                role: 'Employee',
            };
            await createEmployee(formattedData);
            message.success('Employee has been successfully created!');
            navigate('/employees');
        } catch (err) {
            console.error('Error creating employee:', err);
            message.error('An error occurred while creating the employee. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Card
                bordered={false}
                style={{ maxWidth: 800, margin: '0 auto', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            >
                <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>Create Employee</Title>
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    layout="vertical"
                    style={{ maxWidth: '100%' }}
                >
                    <Row gutter={16}>
                        <Col span={24} md={12}>
                            <Form.Item
                                name="name"
                                label="Name"
                                rules={[
                                    { required: true, message: 'Please input the name!' },
                                    { max: 100, message: 'Name cannot be longer than 100 characters!' },
                                ]}
                            >
                                <Input placeholder="Enter employee name" />
                            </Form.Item>
                        </Col>

                        <Col span={24} md={12}>
                            <Form.Item
                                name="gender"
                                label="Gender"
                                rules={[
                                    { required: true, message: 'Please input the gender!' },
                                    { max: 10, message: 'Gender cannot be longer than 10 characters!' },
                                ]}
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
                                    { required: true, message: 'Please select the date of birth!' },
                                    {
                                        validator: (_, value) => {
                                            if (value && !dayjs(value).isValid()) {
                                                return Promise.reject('Invalid date format!');
                                            }
                                            if (value) {
                                                const today = dayjs();
                                                const dob = dayjs(value);
                                                const age = today.diff(dob, 'year');
                                                if (age < 18 || age > 80) {
                                                    return Promise.reject('Age must be between 18 and 80 years');
                                                }

                                            }
                                            return Promise.resolve();
                                        },
                                    },

                                ]}
                            >
                                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={24} md={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { type: 'email', message: 'Please input a valid email!' },
                                    { required: true, message: 'Please input the email!' },
                                ]}
                            >
                                <Input placeholder="Enter email" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24} md={12}>
                            <Form.Item
                                name="phoneNumber"
                                label="Phone Number"
                                rules={[
                                    { required: true, message: 'Please input the phone number!' },
                                    { pattern: /^[0-9]+$/, message: 'Phone number must be numeric!' },
                                ]}
                            >
                                <Input placeholder="Enter phone number" />
                            </Form.Item>
                        </Col>

                        <Col span={24} md={12}>
                            <Form.Item
                                name="department"
                                label="Department"
                                rules={[
                                    { required: true, message: 'Please select the department!' },
                                ]}
                            >
                                <Select placeholder="Select department">
                                    {departments.map(dep => (
                                        <Option key={dep.departmentId} value={dep.departmentName}>
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
                        rules={[
                            { required: true, message: 'Please input the address!' },
                            { max: 300, message: 'Address cannot be longer than 300 characters!' },
                        ]}
                    >
                        <Input.TextArea placeholder="Enter address" rows={4} />
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

                    {isPreviewVisible && (
                        <Form.Item label="Avatar Preview">
                            <img
                                src={avatarUrl}
                                alt="Avatar"
                                style={{ width: '150px', height: '150px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #d9d9d9' }}
                            />
                        </Form.Item>
                    )}

                    <Form.Item name="status" valuePropName="checked">
                        <Checkbox>Status</Checkbox>
                    </Form.Item>

                    <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type='default' onClick={handleClear} style={{ marginRight: '16px' }}>
                            Clear form
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Create Employee
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CreateEmployeePage;
