import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../../config';
import toast from 'react-hot-toast';


const AdminTransactionage = () => {

    const [transactions, setTransactions] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('payments'); // 'payments' or 'bookings'

    const fetchTransactions = async () => {
        try {
            const res = await axios.get(`${config.baseUrl}/transaction/all`);
            setTransactions(res.data.data || []);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            toast.error('Failed to load transactions');
        }
    };

    const fetchBookings = async () => {
        try {
            const res = await axios.get(`${config.baseUrl}/booking/all`);
            // Filter only paid bookings
            const paidBookings = (res.data.data || []).filter(b => b.status === 'paid' || b.total_paid > 0);
            setBookings(paidBookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    useEffect(() => {
        fetchTransactions();
        fetchBookings();
    }, []);

    // Calculate totals
    const totalRevenue = transactions
        .filter(t => t.status === 'paid')
        .reduce((sum, t) => sum + (t.amount || 0), 0) / 2; // Divide by 2 since we have both renter and owner transactions
    
    const totalBookingsPaid = bookings.reduce((sum, b) => sum + (b.total_paid || 0), 0);

    return (
        <div className='min-h-screen space-y-8 pb-10'>
            {/* Header & Stats */}
            <header className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className='text-2xl sm:text-3xl font-black text-gray-900 tracking-tight'>Payments & Transactions</h1>
                        <p className="text-sm text-gray-500 font-medium">Monitor all payment activities and booking transactions</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Revenue</p>
                        <p className="text-3xl font-black text-green-600">${totalRevenue.toFixed(2)}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Paid Bookings</p>
                        <p className="text-3xl font-black text-blue-600">{bookings.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Transactions</p>
                        <p className="text-3xl font-black text-gray-900">{transactions.length}</p>
                    </div>
                </div>

                {/* Tab Buttons */}
                <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 w-fit">
                    <button
                        onClick={() => setActiveTab('payments')}
                        className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'payments' 
                            ? 'bg-blue-600 text-white shadow-lg' 
                            : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        All Transactions ({transactions.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'bookings' 
                            ? 'bg-blue-600 text-white shadow-lg' 
                            : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Paid Bookings ({bookings.length})
                    </button>
                </div>
            </header>

            <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                {activeTab === 'payments' ? (
                    <>
                        {/* Transactions Table */}
                        <div className='hidden xl:block overflow-hidden rounded-3xl border border-gray-100'>
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction ID</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {transactions.length > 0 ? transactions.map((t) => (
                                        <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-black text-gray-900 tracking-tight">#{t?._id.slice(-8).toUpperCase()}</td>
                                            <td className="px-6 py-4 text-xs font-bold text-gray-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-black text-blue-600">{t?.userId?.firstName || 'N/A'} {t?.userId?.lastName || ''}</p>
                                                <p className="text-[10px] font-medium text-gray-400">{t?.userId?.email || ''}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium text-gray-700 truncate max-w-[250px]">{t?.description || 'N/A'}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-black text-gray-900">${parseFloat(t?.amount || 0).toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${t?.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {t?.status || 'pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-400 font-medium">
                                                No transactions found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className='xl:hidden grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {transactions.length > 0 ? transactions.map((t) => (
                                <div key={t._id} className="p-6 bg-white border border-gray-100 rounded-[2rem] hover:border-blue-200 transition-colors space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Transaction ID</p>
                                            <h4 className="text-lg font-black text-gray-900 tracking-tight">#{t?._id.slice(-8).toUpperCase()}</h4>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${t?.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {t?.status || 'pending'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Amount</p>
                                            <p className="text-gray-900 font-black text-xl">${parseFloat(t?.amount || 0).toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">User</p>
                                            <p className="text-blue-600 font-bold">{t?.userId?.firstName || 'N/A'} {t?.userId?.lastName || ''}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Description</p>
                                            <p className="text-gray-600 text-sm">{t?.description || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full text-center py-12 text-gray-400 font-medium">
                                    No transactions found
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Paid Bookings Table */}
                        <div className='hidden xl:block overflow-hidden rounded-3xl border border-gray-100'>
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Booking ID</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Trailer</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Renter</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Base Price</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Paid</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {bookings.length > 0 ? bookings.map((b) => (
                                        <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-black text-gray-900 tracking-tight">#{b?._id.slice(-6).toUpperCase()}</td>
                                            <td className="px-6 py-4 text-xs font-bold text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{b?.trailerId?.title || 'N/A'}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-black text-blue-600">{b?.user_id?.firstName || 'N/A'} {b?.user_id?.lastName || ''}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-700">${parseFloat(b?.price || 0).toFixed(2)}</td>
                                            <td className="px-6 py-4 text-sm font-black text-green-600">${parseFloat(b?.total_paid || 0).toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-800">
                                                    {b?.status}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-gray-400 font-medium">
                                                No paid bookings found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards for Bookings */}
                        <div className='xl:hidden grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {bookings.length > 0 ? bookings.map((b) => (
                                <div key={b._id} className="p-6 bg-white border border-gray-100 rounded-[2rem] hover:border-blue-200 transition-colors space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Booking ID</p>
                                            <h4 className="text-lg font-black text-gray-900 tracking-tight">#{b?._id.slice(-6).toUpperCase()}</h4>
                                        </div>
                                        <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-800">
                                            {b?.status}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Paid</p>
                                            <p className="text-green-600 font-black text-xl">${parseFloat(b?.total_paid || 0).toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Renter</p>
                                            <p className="text-blue-600 font-bold">{b?.user_id?.firstName || 'N/A'} {b?.user_id?.lastName || ''}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Trailer</p>
                                            <p className="text-gray-700 font-medium">{b?.trailerId?.title || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full text-center py-12 text-gray-400 font-medium">
                                    No paid bookings found
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminTransactionage;