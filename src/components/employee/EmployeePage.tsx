import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PacmanLoader } from 'react-spinners';
import { getAllEmployees } from '../../data/employeeService';
import PaginationNav from '../../utils/PaginationNav';
import { EmployeeListItem } from '../../types/EmployeeListItem';
import '../../styles/EmployeePage.css';

const EmployeePage: React.FC = () => {
    const [employees, setEmployees] = useState<EmployeeListItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getAllEmployees();
                console.log(response);

                setEmployees(response);
                setTotalPages(Math.ceil(response.length / itemsPerPage));
            } catch (error: any) {
                console.error('Error fetching employees:', error);
                setError(error.message || 'Network error');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber + 1);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const showEmployees = employees.slice(startIndex, endIndex);

    const handleViewDetail = (employeeId: number) => {
        navigate(`/employees/${employeeId}`, { state: { employee: { employeeId } }});
    };

    if (loading) {
        return (
            <div className="loader-container">
                <PacmanLoader color='#728FCE' size={70} />
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='container'>
            <h1 className='title'>Employee Page</h1>
            <div className='create-button'>
                <Link to="/employees/create">
                    <button className="button-name">
                        Create New Employee
                    </button>
                </Link>
            </div>
            {employees && Array.isArray(employees) && (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>Gender</th>
                                <th>Department</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showEmployees.map((employee) => (
                                <tr key={employee.employeeId}>
                                    <td>{employee.name}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.phoneNumber}</td>
                                    <td>{employee.gender}</td>  
                                    <td className="text-center">{employee.departmentName}</td>
                                    <td className="text-center">{employee.role}</td>
                                    <td className="text-center">
                                        <button
                                            onClick={() => handleViewDetail(employee.employeeId)}
                                            className="view-button">
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <PaginationNav
                        gotoPage={handlePageChange}
                        canPreviousPage={currentPage > 1}
                        canNextPage={currentPage < totalPages}
                        pageCount={totalPages}
                        pageIndex={currentPage - 1}
                    />
                </div>
            )}
        </div>
    );
};

export default EmployeePage;
