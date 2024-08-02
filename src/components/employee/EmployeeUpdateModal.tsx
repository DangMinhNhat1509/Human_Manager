import React, { useState, useEffect } from 'react';
import { EmployeeDetail } from '../../types/EmployeeDetail';
import validateField from '../../utils/validation';
import employeeApi from '../../api/employeeApi'; // Đảm bảo rằng bạn đã nhập đúng đường dẫn
import '../../styles/EmployeeUpdateModal.css'; // Import file CSS

interface EmployeeUpdateModalProps {
    show: boolean;
    onHide: () => void;
    employeeDetail: EmployeeDetail;
    onUpdateSuccess: (updatedEmployee: EmployeeDetail) => void;
}

const EmployeeUpdateModal: React.FC<EmployeeUpdateModalProps> = ({ show, onHide, employeeDetail, onUpdateSuccess }) => {
    const [formData, setFormData] = useState({
        name: employeeDetail.name,
        gender: employeeDetail.gender,
        email: employeeDetail.email,
        dateOfBirth: employeeDetail.dateOfBirth.split('T')[0],
        phone: employeeDetail.phone,
        address: employeeDetail.address,
        status: employeeDetail.status,
        avatar: employeeDetail.avatar
    });

    const [formErrors, setFormErrors] = useState<{ [key in keyof typeof formData]?: string }>({});
    const [avatarPreview, setAvatarPreview] = useState<string>('');

    useEffect(() => {
        setFormData({
            name: employeeDetail.name,
            gender: employeeDetail.gender,
            email: employeeDetail.email,
            dateOfBirth: employeeDetail.dateOfBirth.split('T')[0],
            phone: employeeDetail.phone,
            address: employeeDetail.address,
            status: employeeDetail.status,
            avatar: employeeDetail.avatar
        });
        setAvatarPreview(employeeDetail.avatar);
    }, [employeeDetail]);

    const handleClose = () => {
        onHide();
        setFormData({
            name: employeeDetail.name,
            gender: employeeDetail.gender,
            email: employeeDetail.email,
            dateOfBirth: employeeDetail.dateOfBirth.split('T')[0],
            phone: employeeDetail.phone,
            address: employeeDetail.address,
            status: employeeDetail.status,
            avatar: employeeDetail.avatar
        });
        setAvatarPreview(employeeDetail.avatar);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (name === 'avatar') {
            setAvatarPreview(value);
        }

        const error = validateField(name, value);
        setFormErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setFormErrors((prevErrors) => ({ ...prevErrors, [name]: error }));

        if (name === 'avatar') {
            setAvatarPreview('');
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const hasErrors = Object.values(formErrors).some((error) => error !== null);

        if (hasErrors) {
            alert('Please fix the errors before submitting');
            return;
        }

        try {
            const updatedEmployee: EmployeeDetail = {
                id: employeeDetail.id, // Đảm bảo ID được bao gồm
                ...formData
            };

            await employeeApi.updateEmployee(employeeDetail.id, updatedEmployee);

            alert('Employee updated successfully!');
            onUpdateSuccess(updatedEmployee);
            handleClose();
        } catch (error) {
            console.error('Error updating employee:', error);
            alert('Error updating employee. Please try again.');
        }
    };

    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">Update Employee Information</h2>
                <form onSubmit={handleSubmit}>
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
                        <label htmlFor="email">Email address</label>
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

                    {/* Phone */}
                    <div className="form-group">
                        <label htmlFor="phone">Phone</label>
                        <div className="group-member">
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter phone number"
                                    required
                                />
                                {formErrors.phone && <p className="error-message">{formErrors.phone}</p>}
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
                                    placeholder="Enter address"
                                    required
                                />
                                {formErrors.address && <p className="error-message">{formErrors.address}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Avatar */}
                    <div className="form-group">
                        <label htmlFor="avatar">Avatar</label>
                        <div className="group-member">
                            <div className="input-wrapper">
                                <textarea
                                    rows={3}
                                    id="avatar"
                                    name="avatar"
                                    value={formData.avatar}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter avatar"
                                    required
                                />
                                {formErrors.avatar && <p className="error-message">{formErrors.avatar}</p>}
                                {avatarPreview && (
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar Preview"
                                        className="avatar-preview"
                                    />
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

                    {/* Buttons */}
                    <div className="button-container">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={handleClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="update-button"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

};

export default EmployeeUpdateModal;
