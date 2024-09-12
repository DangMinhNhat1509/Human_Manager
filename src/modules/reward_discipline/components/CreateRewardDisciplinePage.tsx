import React, { useState, useEffect } from 'react';
import { Button, Form, Input, DatePicker, Select, InputNumber, message } from 'antd';
import { createAction } from '../services/reward_discipline_service';
import { ActionType, ActionSubtype, ActionStatus } from '../../../types/action';
import { CreateRewardDiscipline } from '../types/create_reward_discipline';
import { getEmployeesByRole } from '../../employee/services/employee_service';
import { getCurrentUserDepartmentId } from '../../../utils/auth';
import { Role } from '../../../types/employee';

const { TextArea } = Input;
const { Option } = Select;

type EnumType = {
    [key: string]: string;
};

const createOptionsFromEnum = (enumObj: EnumType) => {
    return Object.keys(enumObj).map(key => (
        <Option key={enumObj[key]} value={enumObj[key]}>
            {key}
        </Option>
    ));
};

const CreateRewardDisciplinePage: React.FC = () => {
    const [form] = Form.useForm<CreateRewardDiscipline>();
    const [loading, setLoading] = useState(false);
    const [employeeOptions, setEmployeeOptions] = useState<JSX.Element[]>([]);

    const actionType = Form.useWatch('actionType', form);

    // Lấy danh sách nhân viên theo phòng ban
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const departmentId = await getCurrentUserDepartmentId();
                const role = Role.Employee;
                const employeesList = await getEmployeesByRole(role);

                const filteredEmployees = employeesList.filter(emp => emp.departmentId === departmentId);

                setEmployeeOptions(
                    filteredEmployees.map(emp => (
                        <Option key={emp.employeeId} value={emp.employeeId}>{emp.name}</Option>
                    ))
                );
            } catch (error) {
                message.error('Không thể lấy danh sách nhân viên.');
            }
        };

        fetchEmployees();
    }, []);

    const onFinish = async (values: CreateRewardDiscipline, status: ActionStatus) => {
        setLoading(true);
        try {
            const actionData: CreateRewardDiscipline = {
                ...values,
                actionType: values.actionType,
                actionSubtype: values.actionSubtype,
                status: status
            };
            await createAction(actionData);

            message.success('Đề xuất hành động đã được tạo thành công.');
            form.resetFields();
        } catch (error) {
            message.error('Đã xảy ra lỗi khi tạo đề xuất hành động.');
        } finally {
            setLoading(false);
        }
    };

    // Reset actionSubtype khi actionType thay đổi
    useEffect(() => {
        form.setFieldsValue({ actionSubtype: undefined });
    }, [actionType, form]);

    const handleDraft = () => {
        form.validateFields().then(value => {
            onFinish(value, ActionStatus.Draft);
        }).catch(() => {
            message.error("Hãy sửa lại biểu mẫu.");
        });
    };

    const handleSubmit = () => {
        form.validateFields().then(value => {
            onFinish(value, ActionStatus.Pending);
        }).catch(() => {
            message.error("Hãy sửa lại biểu mẫu.");
        });
    };

    return (
        <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
        >
            <Form.Item
                name="employeeId"
                label="Nhân viên"
                rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
            >
                <Select placeholder="Chọn nhân viên">
                    {employeeOptions}
                </Select>
            </Form.Item>

            <Form.Item
                name="actionType"
                label="Loại hành động"
                rules={[{ required: true, message: 'Vui lòng chọn loại hành động' }]}
            >
                <Select placeholder="Chọn loại hành động">
                    {createOptionsFromEnum(ActionType)}
                </Select>
            </Form.Item>

            <Form.Item
                name="actionSubtype"
                label="Phân loại hành động"
                rules={[{ required: true, message: 'Vui lòng chọn phân loại hành động' }]}
            >
                <Select placeholder="Chọn phân loại hành động">
                    {actionType === ActionType.Reward ? (
                        createOptionsFromEnum({
                            Bonus: ActionSubtype.Bonus,
                            Promotion: ActionSubtype.Promotion,
                            Certification: ActionSubtype.Certification,
                            Training: ActionSubtype.Training,
                            Compliance: ActionSubtype.Compliance,
                            Audit: ActionSubtype.Audit,
                        })
                    ) : (
                        createOptionsFromEnum({
                            Warning: ActionSubtype.Warning,
                            Suspension: ActionSubtype.Suspension,
                        })
                    )}
                </Select>
            </Form.Item>

            <Form.Item
                name="actionDate"
                label="Ngày thực hiện"
                rules={[{ required: true, message: 'Vui lòng chọn ngày thực hiện' }]}
            >
                <DatePicker format="DD/MM/YYYY" />
            </Form.Item>

            {actionType === ActionType.Reward && (
                <Form.Item
                    name="amount"
                    label="Số tiền"
                    rules={[
                        { required: true, message: 'Vui lòng nhập số tiền!' },
                        { type: 'number', max: 10000, message: 'Số tiền không được vượt quá 10.000!' },
                        { type: 'number', min: 0, message: 'Số tiền phải lớn hơn 0!' }
                    ]}
                >
                    <InputNumber placeholder="Nhập số tiền" />
                </Form.Item>
            )}

            {actionType === ActionType.Disciplinary && (
                <Form.Item
                    name="duration"
                    label="Thời gian"
                    rules={[{ required: true, message: 'Vui lòng nhập thời gian' }]}
                >
                    <InputNumber
                        placeholder="Nhập thời gian (ngày)"
                        min={0}
                        max={90}
                        style={{ width: '100%' }}
                        onChange={(value) => {
                            if (value && value > 90) {
                                message.error('Thời gian không được quá 90 ngày.');
                            }
                        }}
                    />
                </Form.Item>
            )}

            <Form.Item
                name="reason"
                label="Lý do"
                rules={[{ required: true, message: 'Vui lòng nhập lý do' }]}
            >
                <TextArea placeholder="Nhập lý do thực hiện" rows={4} />
            </Form.Item>

            <Form.Item>
                <Button
                    type="default"
                    onClick={handleDraft}
                    loading={loading}
                >
                    Lưu nháp
                </Button>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{ marginLeft: '10px' }}
                >
                    Tạo đề xuất
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CreateRewardDisciplinePage;
