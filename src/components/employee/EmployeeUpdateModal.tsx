import React, { useState, useEffect } from 'react';
import { EmployeeDetail } from '../../types/EmployeeDetail';
import validateField from '../../utils/validation';
import employeeApi from '../../api/employeeApi'; // Đảm bảo rằng bạn đã nhập đúng đường dẫn

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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-[500px]">
                <h2 className="text-lg font-semibold mb-4 text-center">Update Employee Information</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="mt-1 p-2 w-full border-gray-300 rounded-md"
                            required
                        />
                        {formErrors.name && <p className="text-red-500 text-sm mt-1" style={{ minHeight: '1rem' }}>{formErrors.name}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                        <input
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="mt-1 p-2 w-full border-gray-300 rounded-md"
                            required
                        />
                        {formErrors.gender && <p className="text-red-500 text-sm mt-1" style={{ minHeight: '1rem' }}>{formErrors.gender}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="mt-1 p-2 w-full border-gray-300 rounded-md"
                            required
                        />
                        {formErrors.email && <p className="text-red-500 text-sm mt-1" style={{ minHeight: '1rem' }}>{formErrors.email}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="mt-1 p-2 w-full border-gray-300 rounded-md"
                            required
                        />
                        {formErrors.dateOfBirth && <p className="text-red-500 text-sm mt-1" style={{ minHeight: '1rem' }}>{formErrors.dateOfBirth}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="mt-1 p-2 w-full border-gray-300 rounded-md"
                            placeholder="Enter phone number"
                            required
                        />
                        {formErrors.phone && <p className="text-red-500 text-sm mt-1" style={{ minHeight: '1rem' }}>{formErrors.phone}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="mt-1 p-2 w-full border-gray-300 rounded-md resize-none"
                            rows={3}
                            placeholder="Enter address"
                            required
                        />
                        {formErrors.address && <p className="text-red-500 text-sm mt-1" style={{ minHeight: '1rem' }}>{formErrors.address}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">Avatar</label>
                        <textarea
                            id="avatar"
                            name="avatar"
                            value={formData.avatar}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="mt-1 p-2 w-full border-gray-300 rounded-md resize-none"
                            rows={3}
                            placeholder="Enter avatar"
                            required
                        />
                        {formErrors.avatar && <p className="text-red-500 text-sm mt-1" style={{ minHeight: '1rem' }}>{formErrors.avatar}</p>}
                        {avatarPreview && (
                            <div className="mt-2">
                                <img
                                    src={avatarPreview}
                                    alt="Avatar Preview"
                                    className={`block mx-auto ${avatarPreview ? 'h-70' : 'h-0'}`}
                                />
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <input
                            type="checkbox"
                            id="status"
                            name="status"
                            checked={formData.status}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="rounded text-blue-500"
                        />
                        {formErrors.name && <p className="text-red-500 text-sm mt-1" style={{ minHeight: '1rem' }}>{formErrors.status}</p>}
                        <label htmlFor="status" className="ml-2 text-sm text-gray-700">Active</label>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                            onClick={handleClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
