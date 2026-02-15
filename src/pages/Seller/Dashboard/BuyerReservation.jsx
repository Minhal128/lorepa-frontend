import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import axios from 'axios';
import config from '../../../config';
import BookingDetailsDrawer from '../../../components/buyer/BookingDetailsDrawer';
import toast from 'react-hot-toast';
import { reservationTranslations, statusTranslations } from './translation/reservationTranslations';

const STATUS_STYLES = {
    pending: 'text-yellow-700 bg-yellow-100',
    accepted: 'text-blue-700 bg-blue-100',
    paid: 'text-green-700 bg-green-100',
    completed: 'text-gray-700 bg-gray-200',
    rejected: 'text-red-700 bg-red-100',
    cancelled: 'text-red-700 bg-red-100',
};

const TABS = ['All', 'Upcoming', 'Past', 'Cancel'];

const StatusBadge = ({ status, lang }) => (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full w-fit uppercase tracking-widest ${STATUS_STYLES[status] || 'text-gray-700 bg-gray-100'}`}>
        {statusTranslations[lang]?.[status] || status}
    </span>
);

const ReservationItem = ({ reservation, onSelectReservation, onChangeStatus, lang, t }) => {
    const handleStatusChange = async (newStatus) => {
        await onChangeStatus(reservation._id, newStatus);
    };

    return (
        <div className="py-6 border-b border-gray-100 last:border-b-0 group">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-6">
                <div className="relative shrink-0 self-center sm:self-start">
                    <img
                        src={reservation.trailerId?.images[0]}
                        alt={reservation.trailerId?.title}
                        className="w-full sm:w-40 h-48 sm:h-28 object-cover rounded-2xl border border-gray-50 shadow-sm"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/160x96/F3F4F6/9CA3AF?text=TRAILER"; }}
                    />
                    <div className="absolute top-3 left-3 sm:hidden">
                        <StatusBadge status={reservation.status} lang={lang} />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-3">
                        <p className="font-black text-gray-900 text-xl leading-tight group-hover:text-blue-600 transition truncate">{reservation.trailerId?.title}</p>
                        <div className="hidden sm:block">
                            <StatusBadge status={reservation.status} lang={lang} />
                        </div>
                    </div>

                    <div className="space-y-1.5 mb-6">
                        <div className="flex items-center text-sm text-gray-700 font-bold whitespace-nowrap">
                            <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center mr-2">
                                <FaUser className="text-[10px] text-red-500" />
                            </div>
                            <span className="truncate">{reservation.user_id?.name}</span>
                        </div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{[reservation.trailerId?.country, reservation.trailerId?.city].filter(Boolean).join(", ")}</p>
                        <p className="text-sm text-gray-600 font-bold">{[reservation.startDate, reservation?.endDate].filter(Boolean).join(" - ")}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
                        <button
                            onClick={() => onSelectReservation(reservation)}
                            className="w-full sm:w-auto text-blue-600 hover:text-blue-800 text-sm font-black py-2.5 px-4 rounded-xl hover:bg-blue-50 transition border border-transparent hover:border-blue-100"
                        >
                            {t.viewDetails}
                        </button>

                        {reservation.status === 'pending' && (
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button
                                    onClick={() => handleStatusChange('accepted')}
                                    className="flex-1 sm:flex-none bg-blue-600 text-white text-sm font-black px-6 py-2.5 rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition active:scale-[0.98]"
                                >
                                    {t.accept}
                                </button>
                                <button
                                    onClick={() => handleStatusChange('cancelled')}
                                    className="flex-1 sm:flex-none bg-red-50 text-red-600 text-sm font-black px-6 py-2.5 rounded-xl hover:bg-red-600 hover:text-white transition active:scale-[0.98]"
                                >
                                    {t.decline}
                                </button>
                            </div>
                        )}

                        {reservation.status === 'accepted' && (
                            <button
                                onClick={() => handleStatusChange('completed')}
                                className="w-full sm:w-auto bg-green-600 text-white text-sm font-black px-8 py-2.5 rounded-xl shadow-lg shadow-green-100 hover:bg-green-700 transition active:scale-[0.98]"
                            >
                                {t.complete}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const TAB_KEYS = ['All', 'Upcoming', 'Past', 'Cancel'];

const BuyerReservation = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'fr');
    const t = reservationTranslations[lang];

    const filteredReservations = bookings.filter((booking) => {
        const today = new Date();
        switch (activeTab) {
            case 'All': return true;
            case 'Upcoming': return new Date(booking.startDate) >= today && booking.status !== 'cancelled';
            case 'Past': return new Date(booking.endDate) < today || booking.status === 'completed';
            case 'Cancel': return booking.status === 'cancelled';
            default: return true;
        }
    });

    const fetchBookings = async () => {
        try {
            const result = await axios.get(`${config.baseUrl}/booking/seller/${localStorage.getItem("userId")}`);
            setBookings(result.data.data);
        } catch (err) {
            toast.error(t.fetchError);
        }
    };

    const handleChangeStatus = async (id, status) => {
        try {
            await axios.put(`${config.baseUrl}/booking/status/${id}`, { status });
            fetchBookings();
            toast.success(t.updateSuccess.replace('{status}', statusTranslations[lang][status]));
        } catch (err) {
            toast.error(t.updateError);
        }
    };

    useEffect(() => {
        fetchBookings();
        const handleStorageChange = () => setLang(localStorage.getItem('lang') || 'fr');
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-black text-gray-900 mb-8">{t.pageTitle}</h1>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-gray-50">
                    <h2 className="text-xl font-bold text-gray-900">{t.allReservations}</h2>
                </div>
                <div className="flex px-6 sm:px-8 overflow-x-auto scrollbar-hide border-b border-gray-50 gap-2">
                    {TAB_KEYS.map((key, index) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`py-4 px-6 text-sm font-bold whitespace-nowrap transition-all relative ${activeTab === key ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {t.tabs[index]}
                        </button>
                    ))}
                </div>
                <div className="p-6 sm:p-8">
                    {filteredReservations.length ? (
                        <div className="space-y-2">
                            {filteredReservations.map(reservation => (
                                <ReservationItem
                                    key={reservation._id}
                                    reservation={reservation}
                                    onSelectReservation={setSelectedReservation}
                                    onChangeStatus={handleChangeStatus}
                                    lang={lang}
                                    t={t}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-gray-400 font-bold bg-gray-50 rounded-2xl">
                            <FaUser className="text-4xl mx-auto mb-4 opacity-20" />
                            {t.noReservations}
                        </div>
                    )}
                </div>
            </div>

            <BookingDetailsDrawer
                reservation={selectedReservation}
                onClose={() => setSelectedReservation(null)}
                onRefresh={fetchBookings}
                StatusBadge={StatusBadge}
            />
        </div>
    );
};

export default BuyerReservation;
