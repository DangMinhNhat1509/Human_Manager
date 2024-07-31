import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import validateField from '../../utils/validation';
import { CreateEmployee } from '../../types/CreateEmployee';
import employeeApi from '../../api/employeeApi';

const CreateEmployeePage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<CreateEmployee>({
        name: '',
        gender: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: '',
        avatar: '',
        status: false
    });
    const [formErrors, setFormErrors] = useState<{ [key in keyof CreateEmployee]?: string }>({});
    const [avatarPreview, setAvatarPreview] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        const fieldValue = type === 'checkbox' ? checked : value;

        setFormData((prevData) => ({
            ...prevData,
            [name as keyof CreateEmployee]: fieldValue
        }));

        if (name === 'avatar') {
            setAvatarPreview(value);
        }

        const error = validateField(name, value);
        setFormErrors((prevErrors) => ({ ...prevErrors, [name as keyof CreateEmployee]: error }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'avatar') {
            setAvatarPreview('');
        }

        const error = validateField(name, value);
        setFormErrors((prevErrors) => ({ ...prevErrors, [name as keyof CreateEmployee]: error }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const hasErrors = Object.values(formErrors).some((error) => error !== null);
        if (hasErrors) {
            alert('Please fix the errors before submitting');
            return;
        }

        setLoading(true);

        try {
            const response = await employeeApi.createEmployee(formData); // Gọi API với toàn bộ formData
            alert('Employee created successfully!');
            navigate('/employees');
        } catch (err) {
            console.error('Error creating employee:', err);
            alert('Failed to create employee. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='max-w-4xl mx-auto p-5'>
            <h1 className='text-3xl font-bold text-center mb-10'>Create Employee</h1>
            <form onSubmit={handleSubmit}>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4">
                    {/* Name */}
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <label htmlFor="name" className="text-md font-medium pt-4">Name</label>
                        <div className="col-span-2">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            />
                            {formErrors.name && <p className="text-red-500 text-sm mt-1" style={{ minHeight: '1rem' }}>{formErrors.name}</p>}
                        </div>
                    </div>

                    {/* Gender */}
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <label htmlFor="gender" className="text-md font-medium pt-4">Gender</label>
                        <div className="col-span-2">
                            <input
                                type="text"
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            />
                            {formErrors.gender && <p className="text-red-500 text-sm mt-1" style={{ minHeight: '1rem' }}>{formErrors.gender}</p>}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <label htmlFor="email" className="text-md font-medium pt-4">Email</label>
                        <div className="col-span-2">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            />
                            {formErrors.email && <p className="text-red-500 text-sm mt-1" style={{ minHeight: '1rem' }}>{formErrors.email}</p>}
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <label htmlFor="phone" className="text-md font-medium pt-4">Phone</label>
                        <div className="col-span-2">
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            />
                            {formErrors.phone && <p className="text-red-500 text-sm mt-1" style={{ minHeight: '1rem' }}>{formErrors.phone}</p>}
                        </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <label htmlFor="dateOfBirth" className="text-md font-medium pt-4">Date of Birth</label>
                        <div className="col-span-2">
                            <input
                                type="date"
                                id="dateOfBirth"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            />
                            {formErrors.dateOfBirth && <p className="text-red-500 text-sm mt-1" style={{ minHeight: '1rem' }}>{formErrors.dateOfBirth}</p>}
                        </div>
                    </div>

                    {/* Address */}
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <label htmlFor="address" className="text-md font-medium pt-4">Address</label>
                        <div className="col-span-2">
                            <textarea
                                rows={3}
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            />
                            {formErrors.address && <p className="text-red-500 text-sm mt-1" style={{ minHeight: '1rem' }}>{formErrors.address}</p>}
                        </div>
                    </div>

                    {/* Avatar */}
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <label htmlFor="avatar" className="text-md font-medium pt-4">Avatar URL</label>
                        <div className="col-span-2">
                            <textarea
                                rows={3}
                                id="avatar"
                                name="avatar"
                                value={formData.avatar}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
                    </div>

                    {/* Status */}
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <label htmlFor="status" className="text-md font-medium pt-4">Status</label>
                        <div className="col-span-2 flex items-center rounded-lg">
                            <input
                                type="checkbox"
                                id="status"
                                name="status"
                                checked={formData.status}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="h-8 w-8 text-blue-600 border-gray-300 rounded-lg"
                            />
                            {formErrors.status && <p className="text-red-500 text-sm ml-2">{formErrors.status}</p>}
                        </div>
                    </div>

                    <div className="sm:text-right mx-6 my-2">
                        <button
                            type="submit"
                            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 text-center"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Employee'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateEmployeePage;
