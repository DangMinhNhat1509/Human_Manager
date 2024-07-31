import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PacmanLoader } from 'react-spinners';
import employeeApi from '../../api/employeeApi';
import PaginationNav from '../../utils/PaginationNav';
import { Employee } from '../../types/Employee';

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
            <div className="flex justify-center mt-40">
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
        <div className='max-w-7xl text-center mx-auto'>
            <h1 className='text-2xl font-bold text-center mx-auto py-10'>Employee Page</h1>
            <div className="flex justify-end mb-4">
                <Link to="/employees/create">
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold px-4 py-2 rounded">
                        Create New Employee
                    </button>
                </Link>
            </div>
            {employees && Array.isArray(employees) && (
                <div className="w-full mx-5 mb-10">
                    <table className="min-w-full bg-neutral-100 border-gray-300">
                        <thead>
                            <tr className="text-xl border-b">
                                <th className="py-2 px-4 border-b">Name</th>
                                <th className="py-2 px-4 border-b">Email</th>
                                <th className="py-2 px-4 border-b">Phone</th>
                                <th className="py-2 px-4 border-b">Gender</th>
                                <th className="py-2 px-4 border-b">Status</th>
                                <th className="py-2 px-4 border-b">Detail</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showEmployees.map((employee) => (
                                <tr key={employee.id} className="bg-white text-left">
                                    <td className="py-2 px-4 border-b">{employee.name}</td>
                                    <td className="py-2 px-4 border-b">{employee.email}</td>
                                    <td className="py-2 px-4 border-b">{employee.phone}</td>
                                    <td className="py-2 px-4 border-b">{employee.gender}</td>
                                    <td className="py-2 px-4 border-b text-center">{employee.status ? 'Active' : 'Inactive'}</td>
                                    <td className="py-2 px-4 border-b text-center">
                                        <button 
                                            onClick={() => handleViewDetail(employee)} 
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded">
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <PaginationNav
                gotoPage={handlePageChange}
                canPreviousPage={currentPage > 1}
                canNextPage={currentPage < totalPages}
                pageCount={totalPages}
                pageIndex={currentPage - 1}
            />
        </div>
    );
};

export default EmployeePage;
