import React, { useState } from 'react';
import { EmployeeDetail } from '../../types/EmployeeDetail';
import ValidateField from '../../utils/validation';
import { updateEmployee } from '../../data/employeeService'; // Đảm bảo rằng bạn đã nhập đúng đường dẫn
import '../../styles/EmployeeUpdateModal.css'; // Import file CSS

interface EmployeeUpdateModalProps {
    show: boolean;
    onHide: () => void;
    employeeDetail: EmployeeDetail; // Sử dụng kiểu EmployeeDetail
    onUpdateSuccess: (updatedEmployee: EmployeeDetail) => void;
}

const EmployeeUpdateModal: React.FC<EmployeeUpdateModalProps> = ({ show, onHide, employeeDetail, onUpdateSuccess }) => {
    const [formData, setFormData] = useState<EmployeeDetail>({
        employeeId: employeeDetail.employeeId,
        name: employeeDetail.name,
        email: employeeDetail.email,
        gender: employeeDetail.gender,
        phoneNumber: employeeDetail.phoneNumber,
        dateOfBirth: employeeDetail.dateOfBirth,
        address: employeeDetail.address,
        avatar: employeeDetail.avatar,
        status: employeeDetail.status,
        departmentName: employeeDetail.departmentName,
        role: employeeDetail.role
    });
    console.log(formData);

    const [formErrors, setFormErrors] = useState<{ [key in keyof EmployeeDetail]?: string }>({});
    const [avatarPreview, setAvatarPreview] = useState<string>(employeeDetail.avatar);

    const handleClose = () => {
        onHide();
        setFormData({ ...employeeDetail });
        setAvatarPreview(employeeDetail.avatar);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        const fieldValue = type === 'checkbox' ? checked : name === 'departmentId' ? parseInt(value) : value;

        setFormData((prevData) => ({
            ...prevData,
            [name as keyof EmployeeDetail]: fieldValue
        }));

        if (name === 'avatar') {
            setAvatarPreview(value);
        }

        const error = ValidateField(name, value);
        setFormErrors((prevErrors) => ({ ...prevErrors, [name as keyof EmployeeDetail]: error }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const error = ValidateField(name, value);
        setFormErrors(prevErrors => ({ ...prevErrors, [name]: error }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Submit Event:', e);

        const hasErrors = Object.values(formErrors).some(error => error !== null);
        console.log('Form Errors:', formErrors);
        console.log('Has Errors:', hasErrors);

        if (hasErrors) {
            alert('Please fix the errors before submitting');
            return;
        }

        try {
            const updatedEmployee: EmployeeDetail = {
                ...formData,
                employeeId: employeeDetail.employeeId
            };


            console.log('Updated Employee:', updatedEmployee);

            await updateEmployee(employeeDetail.employeeId, updatedEmployee);

            alert('Employee updated successfully!');
            console.log('Update Success');
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
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter phone number"
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
                                <input
                                    type="text"
                                    id="avatar"
                                    name="avatar"
                                    value={formData.avatar}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter avatar URL"
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
                                />
                                <label htmlFor="status">Active</label>
                            </div>
                        </div>
                    </div>

                    {/* Department */}
                    <div className="form-group">
                        <label htmlFor="departmentName">Department</label>
                        <div className="group-member">
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    id="departmentName"
                                    name="departmentName"
                                    value={formData.departmentName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter department name"
                                    required
                                />
                                {/* {formErrors.departmentName && <p className="error-message">{formErrors.departmentName}</p>} */}
                            </div>
                        </div>
                    </div>

                    <div className="form-buttons">
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeUpdateModal;
