import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Input, DatePicker, Select, notification, Spin, message, InputNumber, Card } from 'antd';
import { updateAction, getActionDetailById } from '../services/reward_discipline_service';
import { CreateRewardDiscipline } from '../types/create_reward_discipline';
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
    const [approver, setApprover] = useState<string>("Phòng nhân sự");
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

                // Set fields values including actionSubtype
                form.setFieldsValue({
                    ...actionData,
                    actionDate: dayjs(actionData.actionDate),
                });

                // Load employees
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

    const onFinish = async (values: CreateRewardDiscipline, status: ActionStatus) => {
        setLoading(true);
        try {
            const actionData: CreateRewardDiscipline = {
                ...values,
                status: status
            };
            await updateAction(Number(actionId), actionData);

            message.success('Đề xuất hành động đã được cập nhật thành công.');
            form.resetFields();
        } catch (error) {
            message.error('Đã xảy ra lỗi khi cập nhật đề xuất hành động.');
        } finally {
            setLoading(false);
        }
    };

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

    const handleBack = () => {
        navigate(`/actions/${actionId}`);
    };

    const requiresDirectorApproval = (amount?: number, duration?: number, actionSubtype?: ActionSubtype) => {
        const highAmount = amount && amount > 10000000;
        const longDuration = duration && duration > 30;
        const criticalSubtypes = actionSubtype ? [ActionSubtype.Audit, ActionSubtype.Termination].includes(actionSubtype) : false;
        return highAmount || longDuration || criticalSubtypes;
    };


    const handleFieldChange = () => {
        const amount = form.getFieldValue('amount');
        const duration = form.getFieldValue('duration');
        const actionSubtype = form.getFieldValue('actionSubtype');

        if (requiresDirectorApproval(amount, duration, actionSubtype)) {
            setApprover("Ban giám đốc");
        } else {
            setApprover("Phòng nhân sự");
        }
    };

    if (loadingData) {
        return <div style={{ textAlign: 'center', marginTop: 50 }}><Spin size="large" /></div>;
    }

    return (
        <Card
            title="Cập nhật hành động"
            extra={<Button onClick={handleBack}>Quay lại</Button>}
            style={{ margin: '20px' }}>
            <Form layout="vertical" form={form}>
                <Form.Item
                    name="employeeId"
                    label="Nhân viên"
                    rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]} >
                    <Select placeholder="Chọn nhân viên">
                        {employeeOptions}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="actionType"
                    label="Loại hành động"
                    rules={[{ required: true, message: 'Vui lòng chọn loại hành động' }]}>
                    <Select
                        placeholder="Chọn loại hành động"
                        onChange={() => {
                            form.setFieldsValue({ actionSubtype: undefined });
                        }} >
                        {createOptionsFromEnum(ActionType)}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="actionSubtype"
                    label="Phân loại hành động"
                    rules={[{ required: true, message: 'Vui lòng chọn phân loại hành động' }]}
                >
                    <Select placeholder="Chọn phân loại hành động" onChange={handleFieldChange}>
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
                    rules={[{ required: true, message: 'Vui lòng chọn ngày thực hiện' }]}>
                    <DatePicker format="DD/MM/YYYY" />
                </Form.Item>

                <Form.Item
                    name="amount"
                    label="Số tiền"
                    rules={[{ type: 'number', min: 100000, max: 100000000, message: 'Số tiền phải nằm trong khoảng từ 100,000 đến 100,000,000' }]}>
                    <InputNumber
                        placeholder="Nhập số tiền"
                        addonAfter="VND"
                        formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                        onChange={handleFieldChange}
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
                            handleFieldChange();
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

                {/* Hiển thị người phê duyệt */}
                <div style={{ marginBottom: '20px', fontWeight: 'bold', color: '#000' }}>
                    Đơn sẽ được duyệt bởi: {approver}
                </div>

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
                            style={{ marginLeft: '8px' }}
                        >
                            Gửi
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default UpdateRewardDisciplinePage;
