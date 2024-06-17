import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserDetail } from '../../store/slices/userSlice';
import { PacmanLoader } from 'react-spinners';

const UserDetailPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { userDetail, loading, error } = useSelector((state) => state.users);

    useEffect(() => {
        dispatch(fetchUserDetail(id));
    }, [dispatch, id]);
    console.log(userDetail);

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

    return (
        <div className='max-w-4xl mx-auto p-5'>
            <h1 className='text-3xl font-bold text-center mb-10'>User Detail</h1>
            {userDetail ? (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">User Information</h3>
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                            UPDATE INFO
                        </button>
                    </div>
                    <div className="border-t border-gray-200">
                        <dl>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Name</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userDetail.name}</dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Email</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userDetail.email}</dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userDetail.phone}</dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Address</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userDetail.address}</dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Website</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userDetail.website}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            ) : (
                <div className="text-center text-xl">
                    <p>No user details available.</p>
                </div>
            )}
            <div className="mt-5">
                <Link to="/">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Back to Users
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default UserDetailPage;