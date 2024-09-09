import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Input, DatePicker, Select, notification, Spin } from 'antd';
import { updateAction, getActionDetailById } from '../services/RewardDisciplineService';
import { ActionType, ActionSubtype, ActionStatus } from '../../../types/Action';
import { getEmployeesByRole } from '../../employee/services/employeeService';
import { getCurrentUserDepartmentId } from '../../../utils/auth';
import { Role } from '../../../types/Employee';
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
    const navigate = useNavigate();

    useEffect(() => {
        fetchActionAndEmployees();
    }, [actionId, form]);

    const fetchActionAndEmployees = async () => {
        try {
            setLoading(true);
            setLoadingData(true);

            const actionData = await getActionDetailById(parseInt(actionId as string, 10));
            if (!actionData) {
                notification.error({
                    message: 'Error',
                    description: 'Action data not found.',
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
                    message: 'Error',
                    description: 'No employees found.',
                });
                return;
            }

            const filteredEmployees = employeesList.filter(emp => emp.departmentId === departmentId);
            if (filteredEmployees.length === 0) {
                notification.error({
                    message: 'Error',
                    description: 'No employees found for the current department.',
                });
                return;
            }

            setEmployeeOptions(
                filteredEmployees.map(emp => (
                    <Option key={emp.employeeId} value={emp.employeeId}>{emp.name}</Option>
                ))
            );
        } catch (error) {
            console.error('Error fetching data:', error);
            notification.error({
                message: 'Error',
                description: 'Failed to fetch action or employees data.',
            });
        } finally {
            setLoadingData(false);
            setLoading(false);
        }
    };

    const onFinish = async (values: any, status: ActionStatus) => {
        setLoading(true);
        try {
            const actionData = {
                ...values,
                actionType: values.actionType,
                actionSubtype: values.actionSubtype,
                status: status
            };
            await updateAction(parseInt(actionId as string, 10), actionData);

            notification.success({
                message: 'Success',
                description: 'The action has been updated successfully.',
            });

            navigate('/actions');
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'An error occurred while updating the action.',
            });
        } finally {
            setLoading(false);
        }
    };

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
        <Form
            layout="vertical"
            form={form}
        >
            <Form.Item
                name="employeeId"
                label="Employee ID"
                rules={[{ required: true, message: 'Please select an employee ID' }]}
            >
                <Select placeholder="Select Employee ID">
                    {employeeOptions}
                </Select>
            </Form.Item>

            <Form.Item
                name="actionType"
                label="Action Type"
                rules={[{ required: true, message: 'Please select the action type' }]}
            >
                <Select placeholder="Select Action Type">
                    {createOptionsFromEnum(ActionType)}
                </Select>
            </Form.Item>

            <Form.Item
                name="actionSubtype"
                label="Action Subtype"
                rules={[{ required: true, message: 'Please select the action subtype' }]}
            >
                <Select placeholder="Select Action Subtype">
                    {form.getFieldValue('actionType') === ActionType.Reward ? (
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
                label="Action Date"
                rules={[{ required: true, message: 'Please select the action date' }]}
            >
                <DatePicker format="YYYY-MM-DD" />
            </Form.Item>

            {form.getFieldValue('actionType') === ActionType.Reward && (
                <Form.Item
                    name="amount"
                    label="Amount"
                >
                    <Input placeholder="Enter amount" type="number" />
                </Form.Item>
            )}

            {form.getFieldValue('actionType') === ActionType.Disciplinary && (
                <Form.Item
                    name="duration"
                    label="Duration"
                >
                    <Input placeholder="Enter duration in days" type="number" />
                </Form.Item>
            )}

            <Form.Item
                name="reason"
                label="Reason"
                rules={[{ required: true, message: 'Please enter the reason' }]}
            >
                <TextArea placeholder="Enter the reason for the action" rows={4} />
            </Form.Item>

            <Form.Item>
                <Button
                    type="default"
                    onClick={handleDraft}
                    loading={loading}
                >
                    Save Draft
                </Button>
                <Button
                    type="primary"
                    onClick={handleSubmit}
                    loading={loading}
                    style={{ marginLeft: '10px' }}
                >
                    Update
                </Button>
            </Form.Item>
        </Form>
    );
};

export default UpdateRewardDisciplinePage;
