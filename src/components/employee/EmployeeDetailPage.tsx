import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { PacmanLoader } from 'react-spinners';
import { RootState, AppDispatch } from '../../store/store';
import { fetchEmployeeDetail, deleteEmployee } from '../../store/slices/employeeSlice';
import EmployeeUpdateModal from './EmployeeUpdateModal';

const EmployeeDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const employeeDetail = useSelector((state: RootState) => state.employees.employeeDetail);
    const loading: boolean = useSelector((state: RootState) => state.employees.loading);
    const error: string | null = useSelector((state: RootState) => state.employees.error);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchEmployeeDetail(Number(id)));
        }
    }, [dispatch, id]);

    const handleUpdateClick = () => {
        setShowUpdateModal(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center mt-40">
                <PacmanLoader color="#728FCE" size={70} />
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!employeeDetail) {
        return (
            <div className="text-center text-xl mt-10">
                <p>No employee details.</p>
            </div>
        );
    }
    const handleDeleteClick = () => {
        if (id && window.confirm('Are you sure you want to delete this employee?')) {
            dispatch(deleteEmployee(Number(id)));
            navigate('/employees');
        }
    };
    return (
        <div className="max-w-4xl mx-auto p-5">
            <h1 className="text-3xl font-bold text-center mb-10">Employee Details</h1>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Employee Information</h3>
                    <div>
                        <button
                            onClick={handleUpdateClick}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2"
                        >
                            Update Info
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Delete
                        </button>
                    </div>
                </div>
                <div className="border-t border-gray-2000">
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-md font-medium text-gray-500">Avatar</dt>
                        <dd className="mt-1 text-md text-gray-900 sm:mt-0 sm:col-span-2">
                            <img src={employeeDetail.avatar} alt="Avatar" className="w-16 h-16 rounded-full" />
                        </dd>
                    </div>
                    <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-md font-medium text-gray-500">Name</dt>
                            <dd className="mt-1 text-md text-gray-900 sm:mt-0 sm:col-span-2">{employeeDetail.name}</dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-md font-medium text-gray-500">Gender</dt>
                            <dd className="mt-1 text-md text-gray-900 sm:mt-0 sm:col-span-2">{employeeDetail.gender}</dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-md font-medium text-gray-500">Email</dt>
                            <dd className="mt-1 text-md text-gray-900 sm:mt-0 sm:col-span-2">{employeeDetail.email}</dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-md font-medium text-gray-500">Day of birth</dt>
                            <dd className="mt-1 text-md text-gray-900 sm:mt-0 sm:col-span-2">{employeeDetail.dateOfBirth}</dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-md font-medium text-gray-500">Phone</dt>
                            <dd className="mt-1 text-md text-gray-900 sm:mt-0 sm:col-span-2">{employeeDetail.phone}</dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-md font-medium text-gray-500">Address</dt>
                            <dd className="mt-1 text-md text-gray-900 sm:mt-0 sm:col-span-2">{employeeDetail.address}</dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-md font-medium text-gray-500">Status</dt>
                            <dd className="mt-1 text-md text-gray-900 sm:mt-0 sm:col-span-2">{employeeDetail.status ? 'Active' : 'Inactive'}</dd>
                        </div>
                    </dl>
                </div>
            </div>
            <div className="mt-5">
                <Link to="/">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Back to List
                    </button>
                </Link>
            </div>

            <EmployeeUpdateModal
                show={showUpdateModal}
                onHide={() => setShowUpdateModal(false)}
            />
        </div>
    );
};

export default EmployeeDetailPage;

