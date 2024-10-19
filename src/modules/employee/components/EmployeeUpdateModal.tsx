import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Checkbox, Button, DatePicker, message, Select, Row, Col, Typography, Card } from 'antd';
import dayjs from 'dayjs';
import { EmployeeDetail } from '../types/employee_detail';
import { updateEmployee, getAllDepartments } from '../services/employee_service';
import { Department } from '../../../types/department';

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

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const fetchedDepartments = await getAllDepartments();
                setDepartments(fetchedDepartments);
            } catch (error) {
                message.error('Lỗi khi lấy danh sách phòng ban!');
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

            message.success('Cập nhật nhân viên thành công!');
            onUpdateSuccess(updatedEmployee);
            handleClose();
        } catch (error) {
            message.error('Lỗi khi cập nhật nhân viên. Vui lòng thử lại.');
        }
    };

    return (
        <Modal
            title={<Title level={2}>Cập nhật thông tin nhân viên</Title>}
            open={show}
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
                                label="Tên"
                                rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên' }]}
                            >
                                <Input placeholder="Nhập tên nhân viên" />
                            </Form.Item>
                        </Col>

                        <Col span={24} md={12}>
                            <Form.Item
                                name="gender"
                                label="Giới tính"
                                rules={[{ required: true, message: 'Vui lòng nhập giới tính' }]}
                            >
                                <Input placeholder="Nhập giới tính" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24} md={12}>
                            <Form.Item
                                name="dateOfBirth"
                                label="Ngày sinh"
                                rules={[
                                    { required: true, message: 'Vui lòng chọn ngày sinh' },
                                    {
                                        validator: (_, value) => {
                                            if (value && !dayjs(value).isValid()) {
                                                return Promise.reject('Định dạng ngày không hợp lệ!');
                                            }
                                            const age = dayjs().diff(dayjs(value), 'year');
                                            if (age < 18 || age > 80) {
                                                return Promise.reject('Tuổi phải từ 18 đến 80!');
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]}
                            >
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>

                        <Col span={24} md={12}>
                            <Form.Item
                                name="email"
                                label="Địa chỉ email"
                                rules={[{ required: true, type: 'email', message: 'Vui lòng nhập địa chỉ email hợp lệ' }]}
                            >
                                <Input placeholder="Nhập email" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24} md={12}>
                            <Form.Item
                                name="phoneNumber"
                                label="Số điện thoại"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                            >
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>
                        </Col>

                        <Col span={24} md={12}>
                            <Form.Item
                                name="departmentId"
                                label="Phòng ban"
                                rules={[{ required: true, message: 'Vui lòng chọn phòng ban' }]}
                            >
                                <Select placeholder="Chọn phòng ban">
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
                        label="Địa chỉ"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                    >
                        <Input.TextArea rows={3} placeholder="Nhập địa chỉ" />
                    </Form.Item>

                    <Form.Item
                        name="avatar"
                        label="URL Avatar"
                        rules={[
                            {
                                validator: (_, value) => {
                                    if (value && !/^https?:\/\/.+/.test(value)) {
                                        return Promise.reject('Định dạng URL không hợp lệ!');
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Input
                            placeholder="Nhập URL Avatar"
                            value={avatarUrl}
                            onChange={handleAvatarChange}
                            onFocus={() => handleFocusBlur(true)}
                            onBlur={() => handleFocusBlur(false)}
                        />
                    </Form.Item>

                    {avatarUrl && isFocused && (
                        <Form.Item label="Xem trước Avatar">
                            <img
                                src={avatarUrl}
                                alt="Avatar"
                                style={{ width: '150px', height: '150px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #d9d9d9' }}
                            />
                        </Form.Item>
                    )}

                    <Form.Item
                        name="status"
                        label="Trạng thái"
                        valuePropName="checked"
                    >
                        <Checkbox>Đang hoạt động</Checkbox>
                    </Form.Item>

                    <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="primary" htmlType="submit" style={{ marginRight: '16px' }}>
                            Lưu thay đổi
                        </Button>
                        <Button onClick={handleClose}>
                            Hủy bỏ
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Modal>
    );
};

export default EmployeeUpdateModal;
