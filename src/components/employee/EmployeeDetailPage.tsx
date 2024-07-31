import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PacmanLoader } from 'react-spinners';
import EmployeeUpdateModal from './EmployeeUpdateModal';
import { EmployeeDetail } from '../../types/EmployeeDetail';
import employeeApi from '../../api/employeeApi';

const EmployeeDetailPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [employeeDetail, setEmployeeDetail] = useState<EmployeeDetail | null>(null);
    const [updating, setUpdating] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmployeeDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const employeeId = location.state?.employee?.id;
                if (!employeeId) {
                    throw new Error('Employee ID is not found');
                }
                const response = await employeeApi.getEmployeeById(employeeId);
                setEmployeeDetail(response.data);
            } catch (error: any) {
                console.error('Error fetching employee detail:', error);
                setError(error.response ? error.response.data : 'Network error');
            } finally {
                setLoading(false);
            }
        };
        fetchEmployeeDetail();

    }, [location.state?.employee?.id]);

    const handleUpdateClick = () => {
        setShowUpdateModal(true);
    };

    const handleUpdateSuccess = () => {
        setShowUpdateModal(false);
        setUpdating(true);
        if (employeeDetail) {
            employeeApi.getEmployeeById(employeeDetail.id).then((response) => {
                setEmployeeDetail(response.data);
                setUpdating(false);
            }).catch((error) => {
                console.error('Error fetching employee detail:', error);
                setError(error.response ? error.response.data : 'Network error');
                setUpdating(false);
            });
        }
    };

    const handleDeleteClick = async () => {
        if (employeeDetail && window.confirm('Are you sure you want to delete this employee?')) {
            setLoading(true);
            setError(null);
            try {
                await employeeApi.deleteEmployee(employeeDetail.id);
                alert(`${employeeDetail.name} has been deleted`);
                navigate('/employees');
            } catch (error: any) {
                console.error('Error deleting employee:', error);
                setError(error.response ? error.response.data : 'Network error');
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading || updating) {
        return (
            <div className="flex justify-center mt-40">
                <PacmanLoader color='#728FCE' size={70} />
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500 mt-10">Error: {error}</div>;
    }

    if (!employeeDetail) {
        return (
            <div className="text-center text-xl mt-10">
                <p>No employee details available.</p>
            </div>
        );
    }

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
                <div className="border-t border-gray-200">
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
                            <dt className="text-md font-medium text-gray-500">Day of Birth</dt>
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
                <Link to="/employees">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Back to List
                    </button>
                </Link>
            </div>

            {showUpdateModal && employeeDetail && (
                <EmployeeUpdateModal
                    show={showUpdateModal}
                    onHide={() => setShowUpdateModal(false)}
                    employeeDetail={employeeDetail}
                    onUpdateSuccess={handleUpdateSuccess}
                />
            )}
        </div>
    );
};

export default EmployeeDetailPage;
