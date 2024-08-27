import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, DatePicker, message } from 'antd';
import { createEmployee } from '../services/employeeService';
import dayjs from 'dayjs';
import ValidateField from '../utils/validation';  // Import ValidateField

const CreateEmployeePage: React.FC = () => {
    const navigate = useNavigate();
    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const [isFocused, setIsFocused] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const isPreviewVisible = avatarUrl && isFocused;

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAvatarUrl(e.target.value);
    };

    const handleFocusBlur = (focus: boolean) => {
        setIsFocused(focus);
    };

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const formattedData = {
                ...values,
                dateOfBirth: dayjs(values.dateOfBirth).format('YYYY-MM-DD'),
                departmentId: parseInt(values.departmentId, 10),
                role: 'Employee',  // Set role as Employee
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
        <div className="container">
            <h1 className="title">Create Employee</h1>
            <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                style={{ maxWidth: 600, margin: '0 auto' }}
                onValuesChange={(changedValues) => {
                    // Validate fields on change
                    Object.keys(changedValues).forEach((key) => {
                        const error = ValidateField(key, changedValues[key]);
                        if (error) {
                            form.setFields([
                                {
                                    name: key,
                                    errors: [error],
                                },
                            ]);
                        } else {
                            form.setFields([
                                {
                                    name: key,
                                    errors: [],
                                },
                            ]);
                        }
                    });
                }}
            >
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                        { required: true, message: 'Please input the name!' },
                        {
                            validator: (_, value) => {
                                const error = ValidateField('name', value);
                                return error ? Promise.reject(new Error(error)) : Promise.resolve();
                            },
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="gender"
                    label="Gender"
                    rules={[
                        { required: true, message: 'Please input the gender!' },
                        {
                            validator: (_, value) => {
                                const error = ValidateField('gender', value);
                                return error ? Promise.reject(new Error(error)) : Promise.resolve();
                            },
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="dateOfBirth"
                    label="Date of Birth"
                    rules={[
                        { required: true, message: 'Please select the date of birth!' },
                        {
                            validator: (_, value) => {
                                const dob = value ? dayjs(value).format('YYYY-MM-DD') : '';
                                const error = ValidateField('dateOfBirth', dob);
                                return error ? Promise.reject(new Error(error)) : Promise.resolve();
                            },
                        },
                    ]}
                >
                    <DatePicker format="YYYY-MM-DD" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { type: 'email', message: 'Please input a valid email!' },
                        { required: true, message: 'Please input the email!' },
                        {
                            validator: (_, value) => {
                                const error = ValidateField('email', value);
                                return error ? Promise.reject(new Error(error)) : Promise.resolve();
                            },
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="phoneNumber"
                    label="Phone Number"
                    rules={[
                        { required: true, message: 'Please input the phone number!' },
                        {
                            validator: (_, value) => {
                                const error = ValidateField('phone', value);
                                return error ? Promise.reject(new Error(error)) : Promise.resolve();
                            },
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="address"
                    label="Address"
                    rules={[
                        { required: true, message: 'Please input the address!' },
                        {
                            validator: (_, value) => {
                                const error = ValidateField('address', value);
                                return error ? Promise.reject(new Error(error)) : Promise.resolve();
                            },
                        },
                    ]}
                >
                    <Input.TextArea />
                </Form.Item>

                <Form.Item
                    name="avatar"
                    label="Avatar URL"
                    rules={[
                        {
                            validator: (_, value) => {
                                const error = ValidateField('avatar', value);
                                return error ? Promise.reject(new Error(error)) : Promise.resolve();
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
                    <Form.Item label="Preview">
                        <img
                            src={avatarUrl}
                            alt="Avatar"
                            style={{ width: '150px', height: '150px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                    </Form.Item>
                )}

                <Form.Item name="status" valuePropName="checked">
                    <Checkbox>Status</Checkbox>
                </Form.Item>

                <Form.Item
                    name="departmentId"
                    label="Department"
                    rules={[
                        { required: true, message: 'Please input the department ID!' },
                        {
                            validator: (_, value) => {
                                const error = ValidateField('departmentId', value);
                                return error ? Promise.reject(new Error(error)) : Promise.resolve();
                            },
                        },
                    ]}
                >
                    <Input type="number" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Create Employee
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CreateEmployeePage;
