import axios from 'axios';
import React, { useEffect, useState } from 'react';
import config from '../../../config';
import toast from 'react-hot-toast';

const AdminBookingPage = () => {
    const [bookings, setBookings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchBookings = async () => {
        try {
            const res = await axios.get(`${config.baseUrl}/booking/all`);
            setBookings(res.data.data);
        } catch (err) {
            toast.error('Failed to fetch bookings');
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`${config.baseUrl}/booking/status/${id}`, { status });
            toast.success(`Status updated to ${status}`);
            fetchBookings();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const indexOfLastBooking = currentPage * itemsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - itemsPerPage;
    const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);
    const totalPages = Math.ceil(bookings.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className='min-h-screen space-y-8 pb-10'>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className='text-2xl sm:text-3xl font-black text-gray-900 tracking-tight'>Booking Management</h1>
                    <p className="text-sm text-gray-500 font-medium">Track and manage all trailer reservations.</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest border border-blue-100">
                        {bookings.length} Total Bookings
                    </span>
                </div>
            </header>

            <div className='bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8'>
                {/* Desktop Table (Visible on XL screens) */}
                <div className='hidden xl:block overflow-hidden rounded-3xl border border-gray-100'>
                    <table className='min-w-full divide-y divide-gray-100'>
                        <thead className='bg-gray-50'>
                            <tr>
                                <th className='px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest'>S/N</th>
                                <th className='px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest'>Booking ID</th>
                                <th className='px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest'>Trailer</th>
                                <th className='px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest'>Renter</th>
                                <th className='px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest'>Dates</th>
                                <th className='px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest'>Price</th>
                                <th className='px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest'>Status</th>
                                <th className='px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest'>Payment</th>
                                <th className='px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest'>Action</th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-100'>
                            {currentBookings.map((booking, index) => (
                                <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                                    <td className='px-6 py-4 text-sm font-bold text-gray-400'>{indexOfFirstBooking + index + 1}</td>
                                    <td className='px-6 py-4 text-sm font-black text-gray-900 tracking-tight'>#{booking._id.slice(-6).toUpperCase()}</td>
                                    <td className='px-6 py-4'>
                                        <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{booking?.trailerId?.title || 'N/A'}</p>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <p className="text-sm font-black text-blue-600">{booking.firstname} {booking.lastname}</p>
                                    </td>
                                    <td className='px-6 py-4'>
                                        {booking?.startDate ? (
                                            <div className="text-xs font-medium text-gray-500">
                                                <p>{new Date(booking.startDate).toLocaleDateString()}</p>
                                                <p>to {new Date(booking.endDate).toLocaleDateString()}</p>
                                            </div>
                                        ) : 'N/A'}
                                    </td>
                                    <td className='px-6 py-4'>
                                        <p className="text-sm font-black text-gray-900">${booking?.price || '0'}</p>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <select
                                            value={booking.status || 'Pending'}
                                            onChange={(e) => updateStatus(booking._id, e.target.value)}
                                            className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border-2 transition-all outline-none appearance-none cursor-pointer ${booking.status === 'Completed' ? 'bg-green-50 border-green-200 text-green-700' :
                                                booking.status === 'Active' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                                    'bg-yellow-50 border-yellow-200 text-yellow-700'
                                                }`}
                                        >
                                            <option value='Pending'>Pending</option>
                                            <option value='Active'>Active</option>
                                            <option value='Completed'>Completed</option>
                                        </select>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${booking.price == booking.total_paid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                            {booking.price == booking.total_paid ? "Paid" : "Unpaid"}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <button className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards (Visible below XL screens) */}
                <div className='xl:hidden grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {currentBookings.map((booking, index) => (
                        <div key={booking._id} className="p-6 bg-white border border-gray-100 rounded-[2rem] hover:border-blue-200 transition-colors space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Booking ID</p>
                                    <h4 className="text-lg font-black text-gray-900 tracking-tight">#{booking._id.slice(-6).toUpperCase()}</h4>
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${booking.price == booking.total_paid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                    {booking.price == booking.total_paid ? "Paid" : "Unpaid"}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs font-bold">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Trailer</p>
                                    <p className="text-gray-900 truncate">{booking?.trailerId?.title || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Renter</p>
                                    <p className="text-blue-600">{booking.firstname} {booking.lastname}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Price</p>
                                    <p className="text-gray-900 font-black text-base">${booking?.price || '0'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Dates</p>
                                    <p className="text-gray-500">{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                                <select
                                    value={booking.status || 'Pending'}
                                    onChange={(e) => updateStatus(booking._id, e.target.value)}
                                    className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest outline-none focus:border-blue-600 transition appearance-none"
                                >
                                    <option value='Pending'>Set to Pending</option>
                                    <option value='Active'>Set to Active</option>
                                    <option value='Completed'>Set to Completed</option>
                                </select>
                                <button className="p-3.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition shadow-sm">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className='flex flex-col sm:flex-row justify-between items-center gap-6 pt-6 border-t border-gray-50'>
                    <p className='text-sm font-bold text-gray-400 uppercase tracking-widest'>Page {currentPage} of {totalPages}</p>
                    <div className='flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 max-w-full scrollbar-hide'>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`w-10 h-10 shrink-0 rounded-xl text-sm font-black transition-all ${currentPage === page
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                    : 'bg-white border-2 border-gray-100 text-gray-400 hover:border-blue-200'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminBookingPage;
