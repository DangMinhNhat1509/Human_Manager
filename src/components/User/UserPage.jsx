import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchUsers, setPage } from '../../store/slices/userSlice';
import { PacmanLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import PaginationNav from '../PaginationNav';

const UserPage = () => {
    const dispatch = useDispatch();
    const { users, loading, error, currentPage, totalPages } = useSelector((state) => state.users);
    const itemsPerPage = 10;

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handlePageChange = (pageNumber) => {
        dispatch(setPage(pageNumber + 1));
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const showUsers = users.slice(startIndex, endIndex);




    if (loading) {
        return (
            <div className="flex justify-center mt-40">
                <PacmanLoader color='#728FCE' size={70} />
            </div>
        );
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
                                <div className='flex mt-2 px-2 overflow-hidden text-ellipsis whitespace-nowra'>{user.name}</div>
                                <div className='flex mt-2 px-2 overflow-hidden text-ellipsis whitespace-nowra'>{user.email}</div>
                                <div className='flex mt-2 px-2 overflow-hidden text-ellipsis whitespace-nowra'>{user.phone}</div>
                                <div className='flex mt-2 px-2 overflow-hidden text-ellipsis whitespace-nowra'>{user.website}</div>
                                <div className=' flex items-center justify-center'>
                                    <Link to={`/users/${user.id}`}>
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
            <PaginationNav
                gotoPage={handlePageChange}
                canPreviousPage={currentPage > 1}
                canNextPage={currentPage < totalPages}
                pageCount={totalPages}
                pageIndex={currentPage - 1}
            />
        </div >
    )
}

export default UserPage;