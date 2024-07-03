import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createEmployee, setCreateEmployeeField, resetCreateEmployeeForm } from '../../store/slices/employeeSlice';
import { RootState, AppDispatch } from '../../store/store';
import { CreateEmployee } from '../../types/CreateEmployee';
import { validateField } from '../../utils/validation';


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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        const fieldValue = type === 'checkbox' ? checked : value;

        dispatch(setCreateEmployeeField({ field: name as keyof CreateEmployee, value: fieldValue }));

        if (name === 'avatar') {
            setAvatarPreview(value);
        };

        const error = validateField(name, value);
        setFormErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        if (name === 'avatar') {
            setAvatarPreview('');
        }

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
                        <label htmlFor="name" className="text-md font-medium pt-4">Name</label>
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

                    {/* Gender */}
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <label htmlFor="gender" className="text-md font-medium pt-4">Gender</label>
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
                        <label htmlFor="phone" className="text-md font-medium pt-4">Phone</label>
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

                    {/* Date of Birth */}
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <label htmlFor="dateOfBirth" className="text-md font-medium pt-4">Date of Birth</label>
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

                    {/* Address */}
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <label htmlFor="address" className="text-md font-medium pt-4">Address</label>
                        <div className="col-span-2">
                            <textarea
                                rows={3}
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

                    {/* Avatar */}
                    <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <label htmlFor="avatar" className="text-md font-medium pt-4">Avatar URL</label>
                        <div className="col-span-2">
                            <textarea
                                rows={3}
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
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar Preview"
                                        className={`block mx-auto ${avatarPreview ? 'h-70' : 'h-0'}`}
                                    />
                                </div>
                            )}
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
