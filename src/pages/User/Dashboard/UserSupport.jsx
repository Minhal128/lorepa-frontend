import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaSearch, FaChevronDown, FaChevronUp, FaEye, FaPlus, FaTimes } from 'react-icons/fa';
import { IoIosArrowRoundBack } from 'react-icons/io';
import config from '../../../config';
import toast from 'react-hot-toast';
import { buyerSupportTranslations } from './translation/buyerSupportTranslations';

const getTranslatedFaqs = (t) => ([
    {
        id: 1,
        question: t.faqQuestion1,
        answer: t.faqAnswer1
    },
    {
        id: 2,
        question: t.faqQuestion2,
        answer: t.faqAnswer2
    },
    {
        id: 3,
        question: t.faqQuestion3,
        answer: t.faqAnswer3
    }
]);

// ------------------- FaqSection Component -------------------
const FaqSection = ({ faqs, t }) => {
    const [openId, setOpenId] = useState(null);
    const toggleFaq = (id) => setOpenId(openId === id ? null : id);

    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{t.helpCenter}</h3>
            <div className="relative mb-6">
                <input type="text" placeholder={t.searchPlaceholder} className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg" />
            </div>
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                {faqs.map((faq) => (
                    <div key={faq.id}>
                        <button onClick={() => toggleFaq(faq.id)} className="flex justify-between items-center w-full p-4 text-left">
                            <span className="text-gray-700 font-medium">{faq.question}</span>
                            {openId === faq.id ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        {openId === faq.id && (
                            <div className="px-4 pb-4 pt-2 bg-gray-50 text-gray-600 text-sm">
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ------------------- TicketsTable Component -------------------
const TicketsTable = ({ tickets, onViewTicket, t }) => {
    const [activeTab, setActiveTab] = useState('open');
    const filteredTickets = activeTab === 'open'
        ? tickets.filter(t => t.status === 'Open')
        : tickets.filter(t => t.status !== 'Open');

    return (
        <div className="mt-4">
            <div className="flex space-x-6 border-b border-gray-100 mb-6 px-2">
                <button
                    onClick={() => setActiveTab('open')}
                    className={`pb-3 text-sm font-bold transition-all relative ${activeTab === 'open' ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600' : 'text-gray-500'}`}
                >
                    {t.openTickets} <span className="ml-1 px-2 py-0.5 bg-gray-100 rounded-full text-[10px]">{tickets.filter(t => t.status === 'Open').length}</span>
                </button>
                <button
                    onClick={() => setActiveTab('closed')}
                    className={`pb-3 text-sm font-bold transition-all relative ${activeTab === 'closed' ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600' : 'text-gray-500'}`}
                >
                    {t.closedTickets} <span className="ml-1 px-2 py-0.5 bg-gray-100 rounded-full text-[10px]">{tickets.filter(t => t.status !== 'Open').length}</span>
                </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-hidden bg-white rounded-xl border border-gray-100 shadow-sm">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                        <tr>
                            {[t.ticketId, t.subject, t.status, t.lastUpdate, t.actions].map((h) => (
                                <th key={h} className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredTickets.map((ticket) => (
                            <tr key={ticket._id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 truncate max-w-[120px]">{ticket._id}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{ticket.subject}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-green-50 text-green-700 uppercase tracking-wider">{ticket.status}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{ticket.updatedAt?.slice(0, 10)}</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => onViewTicket(ticket)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                        <FaEye className="text-lg" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden space-y-4">
                {filteredTickets.map((ticket) => (
                    <div key={ticket._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm" onClick={() => onViewTicket(ticket)}>
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">ID: {ticket._id?.slice(-8)}</p>
                                <p className="text-base font-bold text-gray-900">{ticket.subject}</p>
                            </div>
                            <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-green-50 text-green-700 uppercase tracking-wider">{ticket.status}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                            <p>{ticket.updatedAt?.slice(0, 10)}</p>
                            <span className="text-blue-600 font-bold flex items-center gap-1">
                                {t.view} <FaEye />
                            </span>
                        </div>
                    </div>
                ))}
                {filteredTickets.length === 0 && (
                    <div className="text-center py-10 text-gray-500 italic">
                        No tickets found
                    </div>
                )}
            </div>
        </div>
    );
};

// ------------------- CreateTicketModal Component -------------------
const CreateTicketModal = ({ isOpen, onClose, onSubmit, t }) => {
    const [userType, setUserType] = useState("Guest");
    const [subject, setSubject] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [attachment, setAttachment] = useState(null);

    if (!isOpen) return null;

    const submitHandler = () => onSubmit({ userType, subject, category, description, attachment });

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">{t.createTicket}</h3>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"><FaTimes /></button>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex gap-6">
                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <input type="radio" className="w-4 h-4 text-blue-600 focus:ring-blue-500" checked={userType === "Guest"} onChange={() => setUserType("Guest")} />
                            <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition">{t.guest}</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <input type="radio" className="w-4 h-4 text-blue-600 focus:ring-blue-500" checked={userType === "Host"} onChange={() => setUserType("Host")} />
                            <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition">{t.host}</span>
                        </label>
                    </div>

                    <input placeholder={t.subjectPlaceholder} className="w-full bg-gray-50 border border-transparent p-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all outline-none" value={subject} onChange={e => setSubject(e.target.value)} />

                    <select className="w-full bg-gray-50 border border-transparent p-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all outline-none" value={category} onChange={e => setCategory(e.target.value)}>
                        <option value="">{t.selectCategory}</option>
                        <option>{t.billing}</option>
                        <option>{t.technicalIssue}</option>
                        <option>{t.reservation}</option>
                    </select>

                    <label className="block w-full border-2 border-dashed border-gray-200 p-4 bg-gray-50 text-center rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition group">
                        <input type="file" className="hidden" onChange={(e) => setAttachment(e.target.files[0])} />
                        <span className="text-sm font-bold text-gray-500 group-hover:text-blue-600 transition">
                            {attachment ? attachment.name : t.uploadAttachment}
                        </span>
                    </label>

                    <textarea placeholder={t.describeIssue} className="w-full bg-gray-50 border border-transparent p-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all outline-none" rows="4" value={description} onChange={e => setDescription(e.target.value)} />

                    <button onClick={submitHandler} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition active:scale-[0.98]">{t.submitTicket}</button>
                </div>
            </div>
        </div>
    );
};

// ------------------- Main BuyerSupport Component -------------------
const BuyerSupport = () => {
    const [mainView, setMainView] = useState('tickets');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [t, setT] = useState(() => {
        const lang = localStorage.getItem("lang") || "fr";
        return buyerSupportTranslations[lang] || buyerSupportTranslations.fr;
    });
    const userId = localStorage.getItem("userId");

    const fetchTickets = async () => {
        try {
            const res = await axios.get(`${config.baseUrl}/ticket/user/${userId}`);
            setTickets(res.data.data);
        } catch {
            toast.error(t.failedLoadTickets);
        }
    };

    useEffect(() => {
        fetchTickets();

        // dynamic language support
        const handleLangChange = () => {
            const lang = localStorage.getItem("lang") || "fr";
            setT(buyerSupportTranslations[lang] || buyerSupportTranslations.fr);
        };

        window.addEventListener("storage", handleLangChange);
        handleLangChange();
        return () => window.removeEventListener("storage", handleLangChange);
    }, []);

    const createTicket = async ({ userType, subject, category, description, attachment }) => {
        const form = new FormData();
        form.append("userId", userId);
        form.append("userType", userType);
        form.append("subject", subject);
        form.append("category", category);
        form.append("description", description);
        if (attachment) form.append("attachment", attachment);

        const loadingToast = toast.loading("Creating ticket...");

        try {
            await axios.post(`${config.baseUrl}/ticket/create`, form);
            toast.success(t.ticketCreated, { id: loadingToast });
            setIsModalOpen(false);
            fetchTickets();
        } catch {
            toast.error(t.failedCreateTicket, { id: loadingToast });
        }
    };

    const handleViewTicket = (ticket) => {
        setSelectedTicketId(ticket);
        setMainView('chat');
    };

    const handleBack = () => {
        setSelectedTicketId(null);
        setMainView('tickets');
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{t.supportTickets}</h1>
                {mainView !== 'chat' && (
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded">
                        <FaPlus className="mr-2" /> {t.createNewTicket}
                    </button>
                )}
            </div>

            {mainView !== 'chat' ? (
                <>
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="flex bg-gray-100 p-1.5 rounded-2xl w-full sm:w-fit">
                            <button
                                onClick={() => setMainView('tickets')}
                                className={`flex-1 sm:flex-none px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${mainView === 'tickets' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {t.ticketsTab}
                            </button>
                            <button
                                onClick={() => setMainView('faqs')}
                                className={`flex-1 sm:flex-none px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${mainView === 'faqs' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {t.faqsTab}
                            </button>
                        </div>
                    </div>
                    <div className="p-0 sm:p-6 sm:bg-white sm:rounded-2xl sm:shadow-sm sm:border sm:border-gray-100">
                        {mainView === 'faqs' && <FaqSection faqs={getTranslatedFaqs(t)} t={t} />}
                        {mainView === 'tickets' && <TicketsTable tickets={tickets} onViewTicket={handleViewTicket} t={t} />}
                    </div>
                </>
            ) : (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <button onClick={handleBack} className="text-blue-600 flex items-center gap-2 font-bold hover:gap-1 transition-all"><IoIosArrowRoundBack className="text-2xl" /> {t.back}</button>
                    <div className="mt-8">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">ID: {selectedTicketId?._id}</p>
                        <h2 className="text-2xl font-black text-gray-900 leading-tight">Subject: {selectedTicketId?.subject}</h2>
                        <div className="mt-6 p-6 bg-gray-50 rounded-2xl">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</p>
                            <p className="text-gray-700 leading-relaxed font-medium">{selectedTicketId?.description}</p>
                        </div>
                    </div>
                </div>
            )}

            <CreateTicketModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={createTicket} t={t} />
        </div>
    );
};

export default BuyerSupport;
