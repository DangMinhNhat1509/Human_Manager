import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, DatePicker, message, Card, Row, Col, Typography, Select } from 'antd';
import { createEmployee, getAllDepartments } from '../services/employee_service';
import dayjs from 'dayjs';
import { Department } from '../../../types/department';
import { Role } from '../../../types/employee';
import { CreateEmployee } from '../types/create_employee';
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
                message.error('Lỗi khi lấy danh sách phòng ban. Vui lòng thử lại sau.');
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

    const handleSubmit = async (values: CreateEmployee) => {
        setLoading(true);
        try {
            const formattedData = {
                ...values,
                dateOfBirth: dayjs(values.dateOfBirth).format('YYYY-MM-DD'),
                role: Role.Employee,
                departmentId: values.departmentId,
            };

            await createEmployee(formattedData);
            message.success('Nhân viên đã được tạo thành công!');
            navigate('/employees');
        } catch (err) {
            message.error('Đã xảy ra lỗi khi tạo nhân viên. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Card
                bordered={false}
                style={{ maxWidth: 800, margin: '0 auto', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            >
                <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>Tạo Nhân Viên</Title>
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
                                label="Tên"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập tên!' },
                                    { max: 100, message: 'Tên không được dài quá 100 ký tự!' },
                                ]}
                            >
                                <Input placeholder="Nhập tên nhân viên" />
                            </Form.Item>
                        </Col>

                        <Col span={24} md={12}>
                            <Form.Item
                                name="gender"
                                label="Giới tính"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập giới tính!' },
                                    { max: 10, message: 'Giới tính không được dài quá 10 ký tự!' },
                                ]}
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
                                    { required: true, message: 'Vui lòng chọn ngày sinh!' },
                                    {
                                        validator: (_, value) => {
                                            if (value && !dayjs(value).isValid()) {
                                                return Promise.reject('Định dạng ngày không hợp lệ!');
                                            }
                                            if (value) {
                                                const today = dayjs();
                                                const dob = dayjs(value);
                                                const age = today.diff(dob, 'year');
                                                if (age < 18 || age > 80) {
                                                    return Promise.reject('Tuổi phải từ 18 đến 80 tuổi');
                                                }

                                            }
                                            return Promise.resolve();
                                        },
                                    },

                                ]}
                            >
                                <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={24} md={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { type: 'email', message: 'Vui lòng nhập email hợp lệ!' },
                                    { required: true, message: 'Vui lòng nhập email!' },
                                ]}
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
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                    { pattern: /^[0-9]+$/, message: 'Số điện thoại phải là số!' },
                                ]}
                            >
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>
                        </Col>

                        <Col span={24} md={12}>
                            <Form.Item
                                name="departmentId"
                                label="Phòng ban"
                                rules={[
                                    { required: true, message: 'Vui lòng chọn phòng ban!' },
                                ]}
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
                        rules={[
                            { required: true, message: 'Vui lòng nhập địa chỉ!' },
                            { max: 300, message: 'Địa chỉ không được dài quá 300 ký tự!' },
                        ]}
                    >
                        <Input.TextArea placeholder="Nhập địa chỉ" rows={4} />
                    </Form.Item>

                    <Form.Item
                        name="avatar"
                        label="URL Ảnh đại diện"
                        rules={[
                            {
                                validator: (_, value) => {
                                    if (value && !/^https?:\/\/.+/.test(value)) {
                                        return Promise.reject('Định dạng URL ảnh đại diện không hợp lệ!');
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Input
                            placeholder="Nhập URL Ảnh đại diện"
                            value={avatarUrl}
                            onChange={handleAvatarChange}
                            onFocus={() => handleFocusBlur(true)}
                            onBlur={() => handleFocusBlur(false)}
                        />
                    </Form.Item>

                    {isPreviewVisible && (
                        <Form.Item label="Xem trước ảnh đại diện">
                            <img
                                src={avatarUrl}
                                alt="Avatar"
                                style={{ width: '150px', height: '150px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #d9d9d9' }}
                            />
                        </Form.Item>
                    )}

                    <Form.Item name="status" valuePropName="checked">
                        <Checkbox>Trạng thái</Checkbox>
                    </Form.Item>

                    <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type='default' onClick={handleClear} style={{ marginRight: '16px' }}>
                            Xóa mẫu
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Tạo Nhân Viên
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CreateEmployeePage;
