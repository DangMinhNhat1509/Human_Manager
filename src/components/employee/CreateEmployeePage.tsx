import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ValidateField from '../../utils/validation';
import { CreateEmployee } from '../../types/CreateEmployee';
import { createEmployee } from '../../data/employeeService'; // Import API đã sửa
import '../../styles/CreateEmployeePage.css';
import { Role } from '../../types/Employee';

const CreateEmployeePage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<CreateEmployee>({
        name: '',
        email: '',
        gender: '',
        phoneNumber: '',
        dateOfBirth: '',
        address: '',
        avatar: '',
        status: false,
        departmentId: 0,
        role: Role.Employee, // Role luôn là "employee"
    });
    const [formErrors, setFormErrors] = useState<{ [key in keyof CreateEmployee]?: string }>({});
    const [avatarPreview, setAvatarPreview] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        const fieldValue = type === 'checkbox' ? checked : name === 'departmentId' ? parseInt(value) : value;

        setFormData((prevData) => ({
            ...prevData,
            [name as keyof CreateEmployee]: fieldValue
        }));

        if (name === 'avatar') {
            setAvatarPreview(value);
        }

        const error = ValidateField(name, value);
        setFormErrors((prevErrors) => ({ ...prevErrors, [name as keyof CreateEmployee]: error }));
    };


    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'avatar') {
            setAvatarPreview('');
        }

        const error = ValidateField(name, value);
        setFormErrors((prevErrors) => ({ ...prevErrors, [name as keyof CreateEmployee]: error }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const hasErrors = Object.values(formErrors).some((error) => error !== null);
        if (hasErrors) {
            alert('Please fix the errors before submitting the form.');
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            await createEmployee(formData); // Call API with formData
            setMessage('Employee has been successfully created!');
            navigate('/employees');
        } catch (err) {
            console.error('Error creating employee:', err);
            setMessage('An error occurred while creating the employee. Please try again later.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="container">
            <h1 className="title">Create Employee</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-container">
                    {/* Name */}
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <div className="group-member">
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                />
                                {formErrors.name && <p className="error-message">{formErrors.name}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Gender */}
                    <div className="form-group">
                        <label htmlFor="gender">Gender</label>
                        <div className="group-member">
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                />
                                {formErrors.gender && <p className="error-message">{formErrors.gender}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <div className="group-member">
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                />
                                {formErrors.email && <p className="error-message">{formErrors.email}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div className="form-group">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <div className="group-member">
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                />
                                {formErrors.phoneNumber && <p className="error-message">{formErrors.phoneNumber}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="form-group">
                        <label htmlFor="dateOfBirth">Date of Birth</label>
                        <div className="group-member">
                            <div className="input-wrapper">
                                <input
                                    type="date"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                />
                                {formErrors.dateOfBirth && <p className="error-message">{formErrors.dateOfBirth}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <div className="group-member">
                            <div className="input-wrapper">
                                <textarea
                                    rows={3}
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                />
                                {formErrors.address && <p className="error-message">{formErrors.address}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Avatar */}
                    <div className="form-group">
                        <label htmlFor="avatar">Avatar URL</label>
                        <div className="group-member">
                            <div className="input-wrapper">
                                <textarea
                                    rows={3}
                                    id="avatar"
                                    name="avatar"
                                    value={formData.avatar}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                />
                                {formErrors.avatar && <p className="error-message">{formErrors.avatar}</p>}
                                {avatarPreview && (
                                    <div className="avatar-preview">
                                        <img
                                            src={avatarPreview}
                                            alt="Avatar Preview"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <div className="group-member">
                            <div className="checkbox-group">
                                <input
                                    type="checkbox"
                                    id="status"
                                    name="status"
                                    checked={formData.status}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <label htmlFor="status">Active</label>
                                {formErrors.status && <p className="error-message">{formErrors.status}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Department ID */}
                    <div className="form-group">
                        <label htmlFor="departmentId">Department ID</label>
                        <div className="group-member">
                            <div className="input-wrapper">
                                <input
                                    type="number"
                                    id="departmentId"
                                    name="departmentId"
                                    value={formData.departmentId || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                />
                                {formErrors.departmentId && <p className="error-message">{formErrors.departmentId}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="button-container">
                        <div className='button-right'>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-create"
                            >
                                {loading ? 'Creating...' : 'Create Employee'}
                            </button>
                        </div>
                    </div>
                    {message && <p className="success-message">{message}</p>}
                </div>
            </form>
        </div>
    );
};

export default CreateEmployeePage;
