import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaSearch, FaChevronDown, FaChevronUp, FaEye, FaPlus, FaTimes } from 'react-icons/fa'
import { IoIosArrowRoundBack } from 'react-icons/io'
import config from '../../../config'
import toast from 'react-hot-toast'
import { supportTranslations } from './translation/supportTranslations'

const getTranslatedFaqs = (t) => [
    { id: 1, question: t.faqQuestion1, answer: t.faqAnswer1 },
    { id: 2, question: t.faqQuestion2, answer: t.faqAnswer2 },
    { id: 3, question: t.faqQuestion3, answer: t.faqAnswer3 },
];
// --- COMPONENTS ---
const FaqSection = ({ faqs, t }) => {
    const [openId, setOpenId] = useState(null)
    const toggleFaq = (id) => setOpenId(openId === id ? null : id)

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-10">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{t.helpCenter}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">Trouvez des réponses aux questions courantes sur l'utilisation de Lorepa en tant qu'hôte.</p>
            </div>

            <div className="relative mb-8">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition shadow-sm"
                />
            </div>

            <div className="space-y-3">
                {faqs.length ? faqs.map((faq) => (
                    <div key={faq.id} className="bg-white rounded-2xl border border-gray-50 overflow-hidden transition-all duration-300">
                        <button
                            onClick={() => toggleFaq(faq.id)}
                            className="flex justify-between items-center w-full p-5 text-left group"
                        >
                            <span className="text-gray-900 font-bold leading-snug pr-4 group-hover:text-blue-600 transition">{faq.question}</span>
                            <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${openId === faq.id ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                                {openId === faq.id ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                            </div>
                        </button>
                        <div className={`transition-all duration-300 overflow-hidden ${openId === faq.id ? 'max-h-96' : 'max-h-0'}`}>
                            <div className="px-5 pb-6 pt-0 text-gray-500 text-sm font-medium leading-relaxed">
                                {faq.answer}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="py-20 text-center bg-gray-50 rounded-2xl">
                        <FaSearch className="text-4xl mx-auto mb-4 opacity-10" />
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">{t.noFaqs}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

const TicketsTable = ({ tickets, onViewTicket, t }) => {
    const [activeTab, setActiveTab] = useState('open')
    const filteredTickets = activeTab === 'open' ? tickets.filter(t => t.status === 'Open') : tickets.filter(t => t.status !== 'Open')

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex bg-gray-50 p-1.5 rounded-2xl w-full sm:w-fit mb-8">
                <button
                    onClick={() => setActiveTab('open')}
                    className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'open' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    {t.openTickets} ({tickets.filter(t => t.status === 'Open').length})
                </button>
                <button
                    onClick={() => setActiveTab('closed')}
                    className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'closed' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    {t.closedTickets} ({tickets.filter(t => t.status !== 'Open').length})
                </button>
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <th className="px-8 py-4">Ticket ID</th>
                            <th className="px-8 py-4">Subject</th>
                            <th className="px-8 py-4">Status</th>
                            <th className="px-8 py-4">Last Update</th>
                            <th className="px-8 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredTickets.map((ticket) => (
                            <tr key={ticket._id} className="hover:bg-gray-50/50 transition">
                                <td className="px-8 py-6 text-xs text-gray-400 font-medium">#{ticket._id.slice(-6)}</td>
                                <td className="px-8 py-6 text-sm text-gray-900 font-bold">{ticket.subject}</td>
                                <td className="px-8 py-6">
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-green-50 text-green-600 rounded-full">
                                        {ticket.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-xs text-gray-500 font-medium">{ticket.updatedAt?.slice(0, 10)}</td>
                                <td className="px-8 py-6">
                                    <div className="flex justify-center">
                                        <button onClick={() => onViewTicket(ticket)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition">
                                            <FaEye />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden space-y-4">
                {filteredTickets.map((ticket) => (
                    <div key={ticket._id} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <FaEye className="text-6xl" />
                        </div>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">#{ticket._id.slice(-6)}</p>
                                <h3 className="text-base font-bold text-gray-900 leading-tight">{ticket.subject}</h3>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-green-50 text-green-600 rounded-full">
                                {ticket.status}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500 font-medium">Updated: {ticket.updatedAt?.slice(0, 10)}</p>
                            <button
                                onClick={() => onViewTicket(ticket)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition"
                            >
                                <FaEye className="text-sm" />
                                Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const CreateTicketModal = ({ isOpen, onClose, onSubmit, t }) => {
    const [userType, setUserType] = useState("Guest")
    const [subject, setSubject] = useState("")
    const [category, setCategory] = useState("")
    const [description, setDescription] = useState("")
    const [attachment, setAttachment] = useState(null)

    if (!isOpen) return null
    const submitHandler = () => onSubmit({ userType, subject, category, description, attachment })

    return (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
                <div className="p-6 sm:p-8 border-b border-gray-50 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 leading-tight">{t.createSupportTicket}</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Our team typically responds in 24 hours</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-xl transition text-gray-400">
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
                    <div className="flex bg-gray-50 p-1.5 rounded-xl w-fit">
                        <button
                            onClick={() => setUserType("Guest")}
                            className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${userType === "Guest" ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}
                        >
                            {t.guest}
                        </button>
                        <button
                            onClick={() => setUserType("Host")}
                            className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${userType === "Host" ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}
                        >
                            {t.host}
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-3">{t.subject}</label>
                            <input
                                placeholder="Briefly summarize the issue"
                                className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 py-3.5 px-5 rounded-2xl text-sm font-medium transition outline-none"
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-3">{t.selectCategory}</label>
                            <select
                                className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 py-3.5 px-5 rounded-2xl text-sm font-medium transition outline-none appearance-none"
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                            >
                                <option value="" disabled>{t.selectCategory}</option>
                                <option>{t.billing}</option>
                                <option>{t.technical}</option>
                                <option>{t.reservation}</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-3">{t.uploadAttachment}</label>
                            <label className="block w-full bg-gray-50 border-2 border-dashed border-gray-100 p-8 rounded-2xl text-center cursor-pointer hover:border-blue-200 transition">
                                <input type="file" className="hidden" onChange={(e) => setAttachment(e.target.files[0])} />
                                <FaPlus className="text-gray-300 text-2xl mx-auto mb-2" />
                                <p className="text-xs text-gray-500 font-bold">{attachment ? attachment.name : t.uploadAttachment}</p>
                            </label>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-3">{t.describeIssue}</label>
                            <textarea
                                placeholder="Be as descriptive as possible..."
                                className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 py-4 px-5 rounded-2xl text-sm font-medium transition outline-none resize-none"
                                rows="4"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        onClick={submitHandler}
                        className="w-full py-4.5 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition active:scale-[0.98] mt-4"
                    >
                        {t.submitTicket}
                    </button>
                </div>
            </div>
        </div>
    )
}

// --- MAIN COMPONENT ---
const BuyerSupport = () => {
    const [mainView, setMainView] = useState('tickets')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [tickets, setTickets] = useState([])
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'fr')
    const t = supportTranslations[lang]
    const userId = localStorage.getItem("userId")

    const fetchTickets = async () => {
        try {
            const res = await axios.get(`${config.baseUrl}/ticket/user/${userId}`)
            setTickets(res.data.data)
        } catch {
            toast.error(t.failedLoadTickets)
        }
    }

    useEffect(() => {
        fetchTickets()
        const handleStorageChange = () => setLang(localStorage.getItem('lang') || 'fr')
        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])

    const createTicket = async ({ userType, subject, category, description, attachment }) => {
        const form = new FormData()
        form.append("userId", userId)
        form.append("userType", userType)
        form.append("subject", subject)
        form.append("category", category)
        form.append("description", description)
        if (attachment) form.append("attachment", attachment)

        const loadingToast = toast.loading(t.creatingTicket)
        try {
            await axios.post(`${config.baseUrl}/ticket/create`, form)
            toast.success(t.ticketCreated, { id: loadingToast })
            setIsModalOpen(false)
            fetchTickets()
        } catch {
            toast.error(t.failedCreateTicket, { id: loadingToast })
        }
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">{t.pageTitle}</h1>
                    <p className="text-gray-500 mt-2 font-medium">Nous sommes là pour vous aider à réussir en tant qu'hôte</p>
                </div>
                {mainView !== 'chat' && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto flex items-center justify-center px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition active:scale-[0.98]"
                    >
                        <FaPlus className="mr-2" /> {t.createTicket}
                    </button>
                )}
            </div>

            <div className="flex bg-gray-100 p-1.5 rounded-2xl w-full sm:w-fit mb-10">
                <button
                    onClick={() => setMainView('tickets')}
                    className={`flex-1 sm:flex-none px-8 py-3 rounded-xl text-sm font-black transition-all ${mainView === 'tickets' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    {t.ticketsTab}
                </button>
                <button
                    onClick={() => setMainView('faqs')}
                    className={`flex-1 sm:flex-none px-8 py-3 rounded-xl text-sm font-black transition-all ${mainView === 'faqs' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    {t.faqsTab}
                </button>
            </div>

            <div className="min-h-[400px]">
                {mainView === 'faqs' && <FaqSection faqs={getTranslatedFaqs(t)} t={t} />}
                {mainView === 'tickets' && <TicketsTable tickets={tickets} onViewTicket={setSelectedTicket} t={t} />}
            </div>

            <CreateTicketModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={createTicket} t={t} />
        </div>
    )
}

export default BuyerSupport
