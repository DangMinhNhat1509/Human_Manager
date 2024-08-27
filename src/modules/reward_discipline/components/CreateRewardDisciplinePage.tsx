import React, { useState, useEffect } from 'react';
import { Button, Form, Input, DatePicker, Select, notification } from 'antd';
import { createAction } from '../services/RewardDisciplineService';
import { ActionType, ActionSubtype, ActionStatus } from '../../../types/Action';
import { CreateRewardDiscipline } from '../types/CreateRewardDiscipline';
import { getEmployeesByRole } from '../../employee/services/employeeService';
import { getCurrentUserDepartmentId } from '../../../utils/auth';
import { Role } from '../../../types/Employee';

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
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [employeeOptions, setEmployeeOptions] = useState<JSX.Element[]>([]);

    const actionType = Form.useWatch('actionType', form);

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
                console.error('Error fetching employees:', error);
                notification.error({
                    message: 'Error',
                    description: 'Failed to fetch employees.',
                });
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

            notification.success({
                message: 'Success',
                description: 'The action proposal has been created successfully.',
            });

            form.resetFields();
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'An error occurred while creating the action proposal.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDraft = () => {
        form.validateFields().then(value => {
            onFinish(value, ActionStatus.Draft);
        });
    }

    const handleSubmit = () => {
        form.validateFields().then(value => {
            onFinish(value, ActionStatus.Pending);
        });
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
                label="Action Date"
                rules={[{ required: true, message: 'Please select the action date' }]}
            >
                <DatePicker format="YYYY-MM-DD" />
            </Form.Item>

            {actionType === ActionType.Reward && (
                <Form.Item
                    name="amount"
                    label="Amount"
                >
                    <Input placeholder="Enter amount" type="number" />
                </Form.Item>
            )}

            {actionType === ActionType.Disciplinary && (
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
                    Create Draft
                </Button>
                <Button
                    type="primary"
                    onClick={handleSubmit}
                    loading={loading}
                    style={{ marginLeft: '10px' }}

                >
                    Create Proposal
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CreateRewardDisciplinePage;
