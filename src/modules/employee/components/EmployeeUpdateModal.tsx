import React, { useState } from 'react';
import { EmployeeDetail } from '../types/EmployeeDetail';
import { Modal, Form, Input, Checkbox, Button, DatePicker, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { updateEmployee } from '../services/employeeService'; // Đảm bảo rằng bạn đã nhập đúng đường dẫn

interface EmployeeUpdateModalProps {
    show: boolean;
    onHide: () => void;
    employeeDetail: EmployeeDetail;
    onUpdateSuccess: (updatedEmployee: EmployeeDetail) => void;
}

const EmployeeUpdateModal: React.FC<EmployeeUpdateModalProps> = ({ show, onHide, employeeDetail, onUpdateSuccess }) => {
    const [form] = Form.useForm();

    const handleClose = () => {
        form.resetFields();
        onHide();
    };

    const handleSubmit = async (values: any) => {
        try {
            const updatedEmployee: EmployeeDetail = {
                ...values,
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
            title="Update Employee Information"
            visible={show}
            onCancel={handleClose}
            footer={null}
            width={800}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={employeeDetail}
                onFinish={handleSubmit}
            >
                {/* Name */}
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: 'Please enter the employee name' }]}
                >
                    <Input />
                </Form.Item>

                {/* Gender */}
                <Form.Item
                    name="gender"
                    label="Gender"
                    rules={[{ required: true, message: 'Please enter the gender' }]}
                >
                    <Input />
                </Form.Item>

                {/* Email */}
                <Form.Item
                    name="email"
                    label="Email address"
                    rules={[{ required: true, type: 'email', message: 'Please enter a valid email address' }]}
                >
                    <Input />
                </Form.Item>

                {/* Phone */}
                <Form.Item
                    name="phoneNumber"
                    label="Phone"
                    rules={[{ required: true, message: 'Please enter the phone number' }]}
                >
                    <Input />
                </Form.Item>

                {/* Date of Birth */}
                <Form.Item
                    name="dateOfBirth"
                    label="Date of Birth"
                    rules={[{ required: true, message: 'Please select the date of birth' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                {/* Address */}
                <Form.Item
                    name="address"
                    label="Address"
                    rules={[{ required: true, message: 'Please enter the address' }]}
                >
                    <Input.TextArea rows={3} />
                </Form.Item>

                {/* Avatar */}
                <Form.Item
                    name="avatar"
                    label="Avatar"
                >
                    <Upload
                        showUploadList={false}
                        customRequest={({ file, onSuccess }) => {
                            setTimeout(() => {
                                onSuccess && onSuccess("ok");
                                message.success('Avatar uploaded successfully!');
                            }, 1000);
                        }}
                    >
                        <Button icon={<UploadOutlined />}>Upload Avatar</Button>
                    </Upload>
                </Form.Item>

                {/* Status */}
                <Form.Item
                    name="status"
                    label="Status"
                    valuePropName="checked"
                >
                    <Checkbox>Active</Checkbox>
                </Form.Item>

                {/* Department */}
                <Form.Item
                    name="departmentName"
                    label="Department"
                    rules={[{ required: true, message: 'Please enter the department name' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                        Save Changes
                    </Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EmployeeUpdateModal;
