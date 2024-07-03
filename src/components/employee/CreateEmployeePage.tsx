import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createEmployee, setCreateEmployeeField, resetCreateEmployeeForm } from '../../store/slices/employeeSlice';
import { RootState, AppDispatch } from '../../store/store';
import { CreateEmployee } from '../../types/CreateEmployee';

const CreateEmployeePage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { createEmployeeData, loading, error } = useSelector((state: RootState) => state.employees);
    const [formErrors, setFormErrors] = useState<{ [key in keyof CreateEmployee]?: string }>({});
    const [avatarPreview, setAvatarPreview] = useState<string>('');

    useEffect(() => {
        return () => {
            dispatch(resetCreateEmployeeForm());
        };
    }, [dispatch]);

    const validateField = (name: string, value: string): string | null => {
        switch (name) {
            case 'name':
                if (!value) return 'Name is required';
                break;
            case 'email':
                if (!value) return 'Email is required';
                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) return 'Invalid email address';
                break;
            case 'phone':
                if (!value) return 'Phone is required';
                if (!/^[\d()\s\-]+(x\d+)?$/.test(value)) return 'Invalid phone number';
                break;
            case 'address':
                if (!value) return 'Address is required';
                break;
            case 'dateOfBirth':
                if (!value) return 'Date of birth is required';
                const dob = new Date(value);
                const age = new Date().getFullYear() - dob.getFullYear();
                if(age <18 || age >80) return 'Age must be between 18 and 80';
                break;
            case 'avatar':
                if (!value) return 'Avatar URL is required';
                if (!/^https?:\/\/.+/.test(value)) return 'Invalid URL';
                break;
            case 'gender':
                if (!value) return 'Gender is required';
                break;
            default:
                break;
        }
        return null;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        const fieldValue = type === 'checkbox' ? checked : value;

        dispatch(setCreateEmployeeField({ field: name as keyof CreateEmployee, value: fieldValue }));

        const error = validateField(name, value);
        setFormErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setFormErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const hasErrors = Object.values(formErrors).some((error) => error !== null);
        if (hasErrors) {
            alert('Please fix the errors before submitting');
            return;
        }

        try {
            const formattedData = createEmployeeData.reduce((acc, item) => {
                return { ...acc, [item.field]: item.value };
            }, {} as CreateEmployee);

            await dispatch(createEmployee(formattedData)).unwrap();
            alert('Employee created successfully!');
            navigate('/employees');
        } catch (err) {
            console.error('Error creating employee:', err);
        }
    };

    return (
        <div className='max-w-4xl mx-auto p-5'>
            <h1 className='text-3xl font-bold text-center mb-10'>Create Employee</h1>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4">
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <label htmlFor="name" className="text-md font-medium">Name</label>
                        <div className="col-span-2">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={createEmployeeData.find(item => item.field === 'name')?.value || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            />
                            {formErrors.name && <p className="text-red-500 text-sm mt-1" style={{ minHeight: '1rem' }}>{formErrors.name}</p>}
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
                                value={createEmployeeData.find(item => item.field === 'email')?.value || ''}
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
                        <label htmlFor="phone" className="text-md font-medium">Phone</label>
                        <div className="col-span-2">
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={createEmployeeData.find(item => item.field === 'phone')?.value || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            />
                            {formErrors.phone && <p className="text-red-500 text-sm mt-1" style={{ minHeight: '1rem' }}>{formErrors.phone}</p>}
                        </div>
                    </div>

                    {/* Address */}
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <label htmlFor="address" className="text-md font-medium">Address</label>
                        <div className="col-span-2">
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={createEmployeeData.find(item => item.field === 'address')?.value || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            />
                            {formErrors.address && <p className="text-red-500 text-sm mt-1" style={{ minHeight: '1rem' }}>{formErrors.address}</p>}
                        </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <label htmlFor="dateOfBirth" className="text-md font-medium">Date of Birth</label>
                        <div className="col-span-2">
                            <input
                                type="date"
                                id="dateOfBirth"
                                name="dateOfBirth"
                                value={createEmployeeData.find(item => item.field === 'dateOfBirth')?.value || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            />
                            {formErrors.dateOfBirth && <p className="text-red-500 text-sm mt-1" style={{ minHeight: '1rem' }}>{formErrors.dateOfBirth}</p>}
                        </div>
                    </div>

                    {/* Avatar */}
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <label htmlFor="avatar" className="text-md font-medium">Avatar URL</label>
                        <div className="col-span-2">
                            <input
                                type="url"
                                id="avatar"
                                name="avatar"
                                value={createEmployeeData.find(item => item.field === 'avatar')?.value || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            />
                            {formErrors.avatar && <p className="text-red-500 text-sm mt-1" style={{ minHeight: '1rem' }}>{formErrors.avatar}</p>}
                            {avatarPreview && (
                                <div className="mt-2">
                                    <img src={avatarPreview} alt="Avatar Preview" className="w-40 h-40" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Gender */}
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <label htmlFor="gender" className="text-md font-medium">Gender</label>
                        <div className="col-span-2">
                            <input
                                type="text"
                                id="gender"
                                name="gender"
                                value={createEmployeeData.find(item => item.field === 'gender')?.value || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                required
                            />
                            {formErrors.gender && <p className="text-red-500 text-sm mt-1" style={{ minHeight: '1rem' }}>{formErrors.gender}</p>}
                        </div>
                    </div>

                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <button
                            type="submit"
                            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-md px-5 py-2.5 text-center"
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
