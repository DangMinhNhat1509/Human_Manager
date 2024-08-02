import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PacmanLoader } from 'react-spinners';
import employeeApi from '../../api/employeeApi';
import PaginationNav from '../../utils/PaginationNav';
import { Employee } from '../../types/Employee';
import '../../styles/EmployeePage.css'; // Import file CSS

const EmployeePage: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
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
                const response = await employeeApi.getAllEmployee();
                setEmployees(response.data);
                setTotalPages(Math.ceil(response.data.length / itemsPerPage));
            } catch (error: any) {
                console.error('Error fetching employees:', error);
                setError(error.response ? error.response.data : 'Network error');
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

    const handleViewDetail = (employee: Employee) => {
        navigate(`/employees/${employee.id}`, { state: { employee } });
    };

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
                            <tr className="table-header">
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Gender</th>
                                <th>Status</th>
                                <th>Detail</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {showEmployees.map((employee) => (
                                <tr key={employee.id}>
                                    <td>{employee.name}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.phone}</td>
                                    <td>{employee.gender}</td>
                                    <td className="text-center">{employee.status ? 'Active' : 'Inactive'}</td>
                                    <td className="text-center">
                                        <button
                                            onClick={() => handleViewDetail(employee)}
                                            className="view-button">
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="pagination-container">
                <PaginationNav
                    gotoPage={handlePageChange}
                    canPreviousPage={currentPage > 1}
                    canNextPage={currentPage < totalPages}
                    pageCount={totalPages}
                    pageIndex={currentPage - 1}
                />
            </div>
        </div>
    );
};

export default EmployeePage;
