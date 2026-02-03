import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../../config';
import toast from 'react-hot-toast';


const AdminTransactionage = () => {

    const [data, setData] = useState([]);
    const [taxModel, setTaxModel] = useState(false);
    const [taxData, settaxData] = useState(null);
    const [value, setvalue] = useState(0)

    const fetchDashboardData = async () => {
        try {
            const totalUser = await axios.get(`${config.baseUrl}/transfer/all`);
            const tax = await axios.get(`${config.baseUrl}/tax/single`);
            setData(totalUser?.data?.data);
            settaxData(tax?.data?.data)
            setvalue(tax?.data?.data?.value)

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const approvedRequest = async (id) => {
        let loader = toast.loading("Processing Request")
        try {
            const res = await axios.put(`${config.baseUrl}/transfer/approved/${id}`);
            if (res?.data) {
                toast.dismiss(loader)
                toast.success("Payment Approved")
                fetchDashboardData()
            }
        }
        catch (error) {
            toast.dismiss(loader)
        }
    }
    const declineRequest = async (id) => {
        let loader = toast.loading("Processing Request")
        try {
            const res = await axios.put(`${config.baseUrl}/transfer/decline/${id}`);
            if (res?.data) {
                toast.dismiss(loader)
                toast.success("Payment Decline")
                fetchDashboardData()
            }
        }
        catch (error) {
            toast.dismiss(loader)
        }
    }

    const updateTax = async (id) => {
        let loader = toast.loading("Processing Request")
        try {
            const res = await axios.put(`${config.baseUrl}/tax/update/${taxData?._id}`, { value });
            if (res?.data) {
                toast.dismiss(loader)
                toast.success("Tax Updated")
                setTaxModel(false)
                fetchDashboardData()
            }
        }
        catch (error) {
            toast.dismiss(loader)
        }
    }

    useEffect(() => {
        fetchDashboardData();
    }, []);

    console.log(taxData, 'taxData')

    return (
        <div className='min-h-screen space-y-8 pb-10'>
            {/* Header & Controls */}
            <header className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className='text-2xl sm:text-3xl font-black text-gray-900 tracking-tight'>Transactions</h1>
                        <p className="text-sm text-gray-500 font-medium">Monitor financial transfers and manage tax settings.</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100">
                    <div className="relative flex-1 group">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input
                            type="text"
                            placeholder="Search by ID, Name..."
                            className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium outline-none focus:border-blue-600 focus:bg-white transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setTaxModel(!taxModel)}
                            className="flex-1 sm:flex-none px-6 py-3 bg-blue-50 text-blue-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-100 transition flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 012-2H5a2 2 0 012 2v14a2 2 0 002 2z" /></svg>
                            Tax Settings
                        </button>
                        <button className="p-3.5 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition shadow-sm">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                        </button>
                    </div>
                </div>
            </header>

            <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                {/* Desktop Table (Visible on XL screens) */}
                <div className='hidden xl:block overflow-hidden rounded-3xl border border-gray-100'>
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction ID</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {data.map((i) => (
                                <tr key={i._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-black text-gray-900 tracking-tight">#{i?._id.slice(-8).toUpperCase()}</td>
                                    <td className="px-6 py-4 text-xs font-bold text-gray-500">{new Date(i.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-black text-blue-600">{i?.userId?.firstName} {i?.userId?.lastName}</p>
                                        <p className="text-[10px] font-medium text-gray-400 truncate max-w-[150px]">{i?.reciverAccountNumber}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-black text-gray-900">${i?.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${i.decline && !i?.approved ? 'bg-red-100 text-red-800' : i?.approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                                            {(i.decline && !i?.approved) ? 'Declined' : i?.approved ? "Approved" : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            {(!i?.decline && !i?.approved) ? (
                                                <>
                                                    <button onClick={() => approvedRequest(i?._id)} className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-100 transition">Approve</button>
                                                    <button onClick={() => declineRequest(i?._id)} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition">Decline</button>
                                                </>
                                            ) : (
                                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No Actions</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards (Visible below XL screens) */}
                <div className='xl:hidden grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {data.map((i) => (
                        <div key={i._id} className="p-6 bg-white border border-gray-100 rounded-[2rem] hover:border-blue-200 transition-colors space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Transaction ID</p>
                                    <h4 className="text-lg font-black text-gray-900 tracking-tight">#{i?._id.slice(-8).toUpperCase()}</h4>
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${i.decline && !i?.approved ? 'bg-red-100 text-red-800' : i?.approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                                    {(i.decline && !i?.approved) ? 'Declined' : i?.approved ? "Approved" : 'Pending'}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Amount</p>
                                    <p className="text-gray-900 font-black text-xl">${i?.amount}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">User</p>
                                    <p className="text-blue-600 font-bold">{i?.userId?.firstName} {i?.userId?.lastName}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Transfer Details</p>
                                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl text-[11px] font-bold text-gray-600">
                                        <div>
                                            <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Method</p>
                                            {i?.paymentMethod}
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Delivery</p>
                                            {i?.deliveryMode}
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Account Info</p>
                                            {i?.reciverAccountNumber}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {(!i?.decline && !i?.approved) && (
                                <div className="flex gap-2 pt-4 border-t border-gray-50">
                                    <button onClick={() => approvedRequest(i?._id)} className="flex-1 py-3.5 bg-green-50 text-green-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-100 transition shadow-sm">Approve</button>
                                    <button onClick={() => declineRequest(i?._id)} className="flex-1 py-3.5 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-100 transition shadow-sm">Decline</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Tax Update Modal */}
            {taxModel && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
                    <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl relative animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute top-4 right-4 w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 transition"
                            onClick={() => setTaxModel(false)}
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="text-center space-y-4 mb-8">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center mx-auto">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" /></svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900 tracking-tight">Tax Configuration</h2>
                                <p className="text-sm text-gray-500 font-medium">Update the platform processing tax.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Tax Value (%)</label>
                                <input
                                    defaultValue={value}
                                    placeholder='Enter percentage'
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-6 text-2xl font-black text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none"
                                    onChange={(e) => setvalue(e?.target?.value)}
                                    type="number"
                                />
                            </div>
                            <button onClick={updateTax} className="w-full py-4 bg-blue-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-all">Update Tax Rate</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTransactionage;