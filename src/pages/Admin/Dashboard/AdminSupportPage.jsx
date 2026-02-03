import axios from 'axios';
import React, { useEffect, useState } from 'react';
import config from '../../../config';
import toast from 'react-hot-toast';

const AdminSupportPage = () => {
    const [tickets, setTickets] = useState([]);
    const [expandedTicket, setExpandedTicket] = useState(null);

    const fetchTickets = async () => {
        try {
            const res = await axios.get(`${config.baseUrl}/ticket/all`);
            setTickets(res.data.data);
        } catch (err) {
            toast.error('Failed to fetch tickets');
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    return (
        <div className='min-h-screen space-y-8 pb-10'>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className='text-2xl sm:text-3xl font-black text-gray-900 tracking-tight'>Support Center</h1>
                    <p className="text-sm text-gray-500 font-medium">Manage and respond to user support requests.</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest border border-blue-100">
                        {tickets.length} Total Tickets
                    </span>
                    <span className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-black uppercase tracking-widest border border-green-100">
                        {tickets.filter(t => t.status === 'Open').length} Open
                    </span>
                </div>
            </header>

            <div className='grid grid-cols-1 gap-6'>
                {tickets.map((ticket, index) => (
                    <div key={ticket._id} className='bg-white border border-gray-100 rounded-[2.5rem] p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow space-y-8'>

                        {/* Ticket Summary Section */}
                        <div className='flex flex-col lg:flex-row justify-between items-start gap-8'>
                            <div className='space-y-6 w-full flex-1'>
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className='px-4 py-1.5 bg-gray-50 text-gray-400 text-[10px] font-black rounded-lg uppercase tracking-widest border border-gray-100'>
                                        #{index + 1}
                                    </span>
                                    <span className="text-sm font-bold text-gray-900">
                                        ID: <span className="text-blue-600 font-black">{ticket._id.slice(-6).toUpperCase()}</span>
                                    </span>
                                    <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${ticket.status === "Open" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                        }`}>
                                        {ticket.status}
                                    </span>
                                </div>

                                <div className='flex items-center gap-4 bg-gray-50 p-4 rounded-3xl border border-gray-100 w-fit min-w-[300px]'>
                                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-white text-lg shrink-0">
                                        {ticket.userId?.profilePicture ? (
                                            <img src={ticket.userId.profilePicture} alt='user' className='w-full h-full object-cover rounded-2xl' />
                                        ) : ticket.userId?.name?.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className='font-black text-gray-900 tracking-tight truncate'>{ticket.userId?.name}</p>
                                        <p className='text-xs text-gray-500 font-medium truncate'>
                                            {ticket.userId?.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject</p>
                                        <p className="font-bold text-gray-900">{ticket.subject}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</p>
                                        <p className="font-bold text-gray-900">{ticket.category}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">User Type</p>
                                        <p className="font-bold text-gray-900 capitalize">{ticket.userType}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Created On</p>
                                        <p className="font-bold text-gray-900 text-xs">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</p>
                                    <p className="text-sm font-medium text-gray-600 bg-gray-50 p-6 rounded-3xl border border-gray-100 leading-relaxed italic">"{ticket.description}"</p>
                                </div>

                                {ticket.attachment && (
                                    <a
                                        href={ticket.attachment}
                                        target='_blank'
                                        rel='noreferrer'
                                        className='inline-flex items-center gap-2 px-6 py-2.5 bg-blue-50 text-blue-600 font-bold text-xs rounded-xl hover:bg-blue-100 transition'
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                        View Attachment
                                    </a>
                                )}
                            </div>

                            <div className="shrink-0 space-y-2 w-full lg:w-fit">
                                <button
                                    onClick={() => setExpandedTicket(expandedTicket === ticket._id ? null : ticket._id)}
                                    className={`w-full lg:w-48 py-3.5 rounded-2xl font-black text-sm tracking-tight transition-all active:scale-95 flex items-center justify-center gap-2 ${expandedTicket === ticket._id ? 'bg-gray-900 text-white shadow-xl' : 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                        }`}
                                >
                                    {expandedTicket === ticket._id ? (
                                        <>Hide Messages <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 15l7-7 7 7" /></svg></>
                                    ) : (
                                        <>View Conversation <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 9l-7 7-7-7" /></svg></>
                                    )}
                                </button>
                                <button className="w-full lg:w-48 py-3.5 rounded-2xl font-black text-sm tracking-tight border-2 border-gray-100 text-gray-400 hover:border-blue-200 hover:text-blue-600 transition">
                                    Update Status
                                </button>
                            </div>
                        </div>

                        {/* Messages Flow Section */}
                        {expandedTicket === ticket._id && (
                            <div className='pt-8 border-t border-gray-100 space-y-6 animate-in slide-in-from-top duration-500'>
                                <div className="flex items-center gap-4">
                                    <div className="h-px bg-gray-100 flex-1"></div>
                                    <h3 className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Conversation Flow</h3>
                                    <div className="h-px bg-gray-100 flex-1"></div>
                                </div>

                                <div className="space-y-6">
                                    {ticket.messages?.length > 0 ? (
                                        ticket.messages.map((msg, i) => {
                                            const isUser = msg.senderId?._id === ticket.userId?._id;
                                            return (
                                                <div
                                                    key={i}
                                                    className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}
                                                >
                                                    <div className={`max-w-[85%] sm:max-w-[70%] space-y-2`}>
                                                        <div className={`flex items-center gap-2 mb-1 ${isUser ? 'flex-row' : 'flex-row-reverse'}`}>
                                                            <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center font-black text-[10px] text-gray-400 overflow-hidden">
                                                                {msg.senderId?.profilePicture ? <img src={msg.senderId.profilePicture} className="w-full h-full object-cover" /> : msg.senderId?.name?.charAt(0)}
                                                            </div>
                                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{msg.senderId?.name} • {msg.senderId?.role}</p>
                                                        </div>
                                                        <div className={`p-5 rounded-3xl shadow-sm border ${isUser ? 'bg-white rounded-tl-none border-gray-100 text-gray-900 font-medium' : 'bg-blue-600 rounded-tr-none border-blue-600 text-white font-bold'
                                                            }`}>
                                                            <p className='text-sm leading-relaxed'>{msg.message}</p>
                                                            {msg.attachment && (
                                                                <a
                                                                    href={msg.attachment}
                                                                    target='_blank'
                                                                    rel='noreferrer'
                                                                    className={`inline-flex items-center gap-2 mt-3 text-xs font-bold underline ${isUser ? 'text-blue-600' : 'text-blue-100 hover:text-white'}`}
                                                                >
                                                                    View Attachment
                                                                </a>
                                                            )}
                                                        </div>
                                                        <p className={`text-[10px] font-black text-gray-400 uppercase tracking-widest ${isUser ? 'text-left' : 'text-right'}`}>
                                                            {new Date(msg.createdAt).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className='text-center py-12 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200'>
                                            <p className='text-sm text-gray-400 font-bold uppercase tracking-widest'>No messages in this ticket yet.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="p-2 bg-gray-50 rounded-3xl border border-gray-100">
                                    <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm">
                                        <input type="text" placeholder="Type your response as Admin..." className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400" />
                                        <button className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminSupportPage;
