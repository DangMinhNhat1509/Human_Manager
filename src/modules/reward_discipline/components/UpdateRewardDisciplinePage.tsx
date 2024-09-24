import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Input, DatePicker, Select, notification, Spin, message, InputNumber, Card } from 'antd';
import { updateAction, getActionDetailById } from '../services/reward_discipline_service';
import { ActionType, ActionSubtype, ActionStatus } from '../../../types/action';
import { getEmployeesByRole } from '../../employee/services/employee_service';
import { getCurrentUserDepartmentId } from '../../../utils/auth';
import { Role } from '../../../types/employee';
import dayjs from 'dayjs';

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

const UpdateRewardDisciplinePage: React.FC = () => {
    const [form] = Form.useForm();
    const { actionId } = useParams<{ actionId: string }>();
    const [loading, setLoading] = useState(false);
    const [employeeOptions, setEmployeeOptions] = useState<JSX.Element[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const actionType = Form.useWatch('actionType', form);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchActionAndEmployees = async () => {
            try {
                setLoading(true);
                setLoadingData(true);

                const actionData = await getActionDetailById(Number(actionId));
                if (!actionData) {
                    notification.error({
                        message: 'Lỗi',
                        description: 'Dữ liệu hành động không được tìm thấy.',
                    });
                    navigate('/actions');
                    return;
                }

                form.setFieldsValue({
                    ...actionData,
                    actionDate: dayjs(actionData.actionDate),
                });

                const departmentId = await getCurrentUserDepartmentId();
                const role = Role.Employee;
                const employeesList = await getEmployeesByRole(role);

                if (!employeesList || employeesList.length === 0) {
                    notification.error({
                        message: 'Lỗi',
                        description: 'Không tìm thấy nhân viên.',
                    });
                    return;
                }

                const filteredEmployees = employeesList.filter(emp => emp.departmentId === departmentId);
                if (filteredEmployees.length === 0) {
                    notification.error({
                        message: 'Lỗi',
                        description: 'Không tìm thấy nhân viên cho phòng ban hiện tại.',
                    });
                    return;
                }

                setEmployeeOptions(
                    filteredEmployees.map(emp => (
                        <Option key={emp.employeeId} value={emp.employeeId}>{emp.name}</Option>
                    ))
                );
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
                notification.error({
                    message: 'Lỗi',
                    description: 'Lấy dữ liệu hành động hoặc nhân viên không thành công.',
                });
            } finally {
                setLoadingData(false);
                setLoading(false);
            }
        };
        fetchActionAndEmployees();
    }, [actionId, form, navigate]);

    const onFinish = async (values: any, status: ActionStatus) => {
        setLoading(true);
        try {
            const actionData = {
                ...values,
                actionType: values.actionType,
                actionSubtype: values.actionSubtype,
                status: status
            };
            await updateAction(Number(actionId), actionData);

            notification.success({
                message: 'Thành công',
                description: 'Hành động đã được cập nhật thành công.',
            });

            navigate('/actions');
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Đã xảy ra lỗi khi cập nhật hành động.',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        form.setFieldsValue({ actionSubtype: undefined });
    }, [actionType, form]);

    const handleDraft = () => {
        form.validateFields().then(value => {
            onFinish(value, ActionStatus.Draft);
        });
    };

    const handleSubmit = () => {
        form.validateFields().then(value => {
            onFinish(value, ActionStatus.Pending);
        });
    };

    if (loadingData) {
        return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>;
    }

    return (
        <Card title="Cập nhật hành động" style={{ margin: '20px' }}>
            <Form layout="vertical" form={form}>
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
                    <div style={{ textAlign: 'right' }}>
                        <Button
                            type="default"
                            onClick={handleDraft}
                            loading={loading}
                        >
                            Lưu nháp
                        </Button>

                        <Button
                            type="primary"
                            onClick={handleSubmit}
                            loading={loading}
                            style={{ marginLeft: '10px' }}
                        >
                            Cập nhật
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default UpdateRewardDisciplinePage;
