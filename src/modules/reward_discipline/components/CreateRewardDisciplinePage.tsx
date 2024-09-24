import React, { useState, useEffect } from 'react';
import { Button, Form, Input, DatePicker, Select, InputNumber, message, Card } from 'antd';
import { createAction } from '../services/reward_discipline_service';
import { ActionType, ActionSubtype, ActionStatus } from '../../../types/action';
import { CreateRewardDiscipline } from '../types/create_reward_discipline';
import { getEmployeesByRole } from '../../employee/services/employee_service';
import { getCurrentUserDepartmentId } from '../../../utils/auth';
import { Role } from '../../../types/employee';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();

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
            navigate('/actions');
        }).catch(() => {
            message.error("Hãy sửa lại biểu mẫu.");
        });
    };

    const handleSubmit = () => {
        form.validateFields().then(value => {
            onFinish(value, ActionStatus.Pending);
            navigate('/actions');
        }).catch(() => {
            message.error("Hãy sửa lại biểu mẫu.");
        });
    };

    return (
        <Card
            style={{ margin: '0 20px', padding: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            title="Tạo Đề Xuất Khen Thưởng/Kỷ Luật"
        >
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
                                Fines: ActionSubtype.Fines,
                                Termination: ActionSubtype.Termination
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

                <Form.Item
                    name="amount"
                    label="Số tiền"
                    rules={[{ type: 'number', min: 100000, max: 100000000, message: 'Số tiền phải nằm trong khoảng từ 100,000 đến 100,000,000' }]}
                >
                    <InputNumber
                        placeholder="Nhập số tiền"
                        addonAfter="VND"
                        formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                    />
                </Form.Item>

                <Form.Item
                    name="duration"
                    label="Thời gian"
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
        </Card >
    );
};

export default CreateRewardDisciplinePage;
