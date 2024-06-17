import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import userApi from '../../api/userApi';

const UserPage = () => {
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; //users per page

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true)
                const response = await userApi.getAllUser()
                setUsers(response.data)
            } catch (error) {
                setError(error)
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, [currentPage, pageSize]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    const totalPages = users ? Math.ceil(users.length / pageSize) : 0;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const showUsers = users ? users.slice(startIndex, endIndex) : [];

    const paginationItems = () => {
        let items = [];
        let startPage = 1;

        if (currentPage > 6) {
            startPage = currentPage - 4;
            items.push(
                <button
                    key="ellipsisStart"
                    className='px-4 py-2 mr-2 text-gray-700 bg-slate-100 rounded-md hover:bg-gray-50'
                >
                    ...
                </button>
            );
        }

        for (let i = startPage; i <= totalPages && i < startPage + 6; i++) {
            items.push(
                <button
                    key={i}
                    className={`px-4 py-2 mr-2 text-gray-700 ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-slate-100'} rounded-md hover:bg-gray-50`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }

        if (currentPage < totalPages - 4) {
            items.push(
                <button
                    key="ellipsisEnd"
                    className='px-4 py-2 mr-2 text-gray-700 bg-slate-100 rounded-md hover:bg-gray-50'
                >
                    ...
                </button>
            );
        }

        return items;
    }


    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <div className='max-w-7xl text-center mx-auto'>
            <h1 className='text-2xl font-bold text-center mx-auto py-10'>User Page</h1>
            {users && Array.isArray(users) && (
                <div className="w-full mx-5 mb-10">
                    <div className="grid grid-cols-5 bg-gray-200 uppercase py-5 font-bold">
                        <div>Name</div>
                        <div>Email</div>
                        <div>Phone</div>
                        <div>Website</div>
                        <div>Action</div>
                    </div>
                    <div className="divide-y divide-gray-200 overflow-hidden text-left">
                        {showUsers.map((user) => (
                            <div key={user.id} className="grid grid-cols-5 px-3 my-1 py-2 align-middle">
                                <div className='flex mt-2 px-2'>{user.name}</div>
                                <div className='flex mt-2 px-2'>{user.email}</div>
                                <div className='flex mt-2 px-2'>{user.phone}</div>
                                <div className='flex mt-2 px-2'>{user.website}</div>
                                <div className=' flex items-center justify-center'>
                                    <Link to={`/user/${user.id}`}>
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded">
                                            Edit
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className='flex justify-center items-center'>
                <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className='px-4 py-2 mr-2 text-gray-700 bg-slate-100 rounded-md hover:bg-gray-50'
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                {paginationItems()}
                <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className='px-4 py-2 mr-2 text-gray-700 bg-slate-100 rounded-md hover:bg-gray-50'
                >
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </div>
        </div >
    )
}

export default UserPage;