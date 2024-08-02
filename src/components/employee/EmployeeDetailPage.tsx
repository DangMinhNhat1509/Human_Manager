import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PacmanLoader } from 'react-spinners';
import EmployeeUpdateModal from './EmployeeUpdateModal';
import { EmployeeDetail } from '../../types/EmployeeDetail';
import employeeApi from '../../api/employeeApi';
import '../../styles/EmployeeDetailPage.css'; // Import file CSS

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
            <div className="loader-container">
                <PacmanLoader color='#728FCE' size={70} />
            </div>
        );
    }

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    if (!employeeDetail) {
        return (
            <div className="no-details">
                <p>No employee details available.</p>
            </div>
        );
    }

    return (
        <div className="container">
            <h1 className="title">Employee Details</h1>
            <form className="form-container">

                <div className="form-group">
                    <label htmlFor="avatar">Avatar</label>
                    <div className="group-member">
                        <div className="input-wrapper">
                            <img src={employeeDetail.avatar} alt="Avatar" className="avatar" />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <div className="group-member">
                        <div className="input-wrapper">
                            <p>{employeeDetail.name}</p>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="gender">Gender</label>
                    <div className="group-member">
                        <div className="input-wrapper">
                            <p>{employeeDetail.gender}</p>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <div className="group-member">
                        <div className="input-wrapper">
                            <p>{employeeDetail.email}</p>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <div className="group-member">
                        <div className="input-wrapper">
                            <p>{employeeDetail.phone}</p>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <div className="group-member">
                        <div className="input-wrapper">
                            <p>{employeeDetail.dateOfBirth}</p>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <div className="group-member">
                        <div className="input-wrapper">
                            <p>{employeeDetail.address}</p>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <div className="group-member">
                        <div className="input-wrapper">
                            <p>{employeeDetail.status ? 'Active' : 'Inactive'}</p>
                        </div>
                    </div>
                </div>
            </form>



            <div className="button-container">
                <div className="back-button-container">
                    <Link to="/employees">
                        <button className="button back-button">
                            Back to List
                        </button>
                    </Link>
                </div>
                <div className="action-buttons">
                    <button onClick={handleUpdateClick} className="button button-update">
                        Update Info
                    </button>
                    <button onClick={handleDeleteClick} className="button button-delete">
                        Delete
                    </button>
                </div>
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
