import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import config from '../../../config';
import axios from 'axios';
import BookingDetailsDrawer from '../../../components/user/BookingDetailsDrawer';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { userReservationTranslations } from './translation/userReservationTranslations';

const TABS = ['All', 'Upcoming', 'Past', 'Cancel'];

const normalizeLang = (value) => {
  const lang = (value || '').toLowerCase();
  if (lang.startsWith('fr')) return 'fr';
  if (lang.startsWith('es')) return 'es';
  if (lang.startsWith('cn') || lang.startsWith('zh')) return 'cn';
  if (lang.startsWith('en')) return 'en';
  return 'fr';
};

const getCurrentLang = () =>
  normalizeLang(localStorage.getItem('lang') || localStorage.getItem('i18nextLng'));

const getCurrentTranslations = () => {
  const lang = getCurrentLang();
  return userReservationTranslations[lang] || userReservationTranslations.fr;
};

// --- Status Styles ---
const STATUS_STYLES = {
  pending: 'text-yellow-700 bg-yellow-100',
  accepted: 'text-blue-700 bg-blue-100',
  paid: 'text-green-700 bg-green-100',
  completed: 'text-gray-700 bg-gray-200',
  rejected: 'text-red-700 bg-red-100',
  cancelled: 'text-red-700 bg-red-100',
};

const FALLBACK_TRAILER_IMAGE = '/12.png';

const toDate = (value) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const startOfToday = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

// --- Reservation Item Component ---
const ReservationItem = ({ reservation, onSelectReservation, createChat, t }) => {
  const trailerTitle = reservation?.trailerId?.title || t.unknownTrailer || 'Unknown Trailer';
  const trailerImage = reservation?.trailerId?.images?.[0] || FALLBACK_TRAILER_IMAGE;
  const locationLabel = [reservation?.trailerId?.country, reservation?.trailerId?.city].filter(Boolean).join(', ');
  const dateLabel = [reservation?.startDate, reservation?.endDate].filter(Boolean).join(' - ');

  return (
    <div className="py-6 border-b border-gray-100 last:border-b-0">
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        <img
          src={trailerImage}
          alt={trailerTitle}
          className="w-full sm:w-40 h-48 sm:h-28 object-cover rounded-xl flex-shrink-0 shadow-sm"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_TRAILER_IMAGE;
          }}
        />
        <div className='flex-1 w-full'>
          <div className="flex justify-between items-start mb-2">
            <p className="font-bold text-gray-900 text-lg leading-tight truncate">{trailerTitle}</p>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${STATUS_STYLES[reservation?.status] || 'text-gray-700 bg-gray-100'}`}>
              {t.statusLabels?.[reservation?.status] || reservation?.status || '-'}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-600 mb-2">
            <FaUser className="w-3.5 h-3.5 mr-2 text-red-500" />
            <span className="font-medium">{reservation?.owner_id?.name || '-'}</span>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 mb-1">{locationLabel}</p>
          <p className="text-xs sm:text-sm text-gray-700 font-semibold mb-4">{dateLabel}</p>

          <div className='flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end'>
            <button
              onClick={() => onSelectReservation(reservation)}
              className="w-full sm:w-auto text-blue-600 hover:text-blue-800 text-sm font-bold py-2 transition duration-150 cursor-pointer"
            >
              {t.viewDetails}
            </button>
            <button
              onClick={() => createChat(reservation?.owner_id?._id)}
              className="w-full sm:w-auto bg-blue-50 border border-blue-200 text-blue-600 text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition duration-200 shadow-sm"
            >
              {t.contactOwner}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
const UserReservation = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [bookings, setBookings] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [t, setT] = useState(() => getCurrentTranslations());

  const nav = useNavigate();

  const tabs = Array.isArray(t.tabs) && t.tabs.length === TABS.length ? t.tabs : TABS;

  const filteredReservations = bookings.filter((booking) => {
    const today = startOfToday();
    const startDate = toDate(booking?.startDate);
    const endDate = toDate(booking?.endDate);

    switch (activeTab) {
      case 'All':
        return true;
      case 'Upcoming':
        return Boolean(startDate && startDate >= today && booking?.status !== 'cancelled');
      case 'Past':
        return Boolean((endDate && endDate < today) || booking?.status === 'completed');
      case 'Cancel':
        return booking?.status === 'cancelled';
      default:
        return true;
    }
  });

  const createChat = async (ownerId) => {
    try {
      const currentUserId = localStorage.getItem("userId");
      if (!currentUserId || !ownerId) {
        toast.error(t.contactOwnerError || "Unable to contact owner right now");
        return;
      }

      await axios.post(`${config.baseUrl}/chat/create`, {
        participants: [currentUserId, ownerId]
      });

      nav(`/user/dashboard/messaging`);
    } catch (chatError) {
      toast.error(chatError?.response?.data?.msg || t.contactOwnerError || "Failed to open conversation with owner");
    }
  };

  const fetchBookings = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setBookings([]);
        return;
      }

      const result = await axios.get(`${config.baseUrl}/booking/buyer/${userId}`);
      const nextBookings = Array.isArray(result?.data?.data) ? result.data.data : [];
      setBookings(nextBookings);
    } catch (fetchError) {
      setBookings([]);
      toast.error(fetchError?.response?.data?.msg || t.fetchError || "Failed to fetch bookings");
    }
  };

  useEffect(() => {
    fetchBookings();

    // Handle language changes dynamically
    const handleLangChange = () => {
      setT(getCurrentTranslations());
    };

    window.addEventListener("storage", handleLangChange);
    window.addEventListener("app-language-changed", handleLangChange);
    window.addEventListener("focus", handleLangChange);
    handleLangChange();

    return () => {
      window.removeEventListener("storage", handleLangChange);
      window.removeEventListener("app-language-changed", handleLangChange);
      window.removeEventListener("focus", handleLangChange);
    };
  }, []);

  return (
    <div>
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">{t.myReservations}</h1>

      {/* All Reservations Container */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="p-5">
          <h2 className="text-xl font-semibold text-gray-800">{t.allReservations}</h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-5 overflow-x-auto">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(TABS[idx])}
              className={`px-4 py-3 text-sm font-medium transition duration-150 ease-in-out
                ${activeTab === TABS[idx]
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Reservation List */}
        <div className="p-5">
          {filteredReservations.length > 0 ? (
            filteredReservations.map((reservation) => (
              <ReservationItem
                key={reservation?._id || reservation?.id}
                reservation={reservation}
                onSelectReservation={setSelectedReservation}
                createChat={createChat}
                t={t}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              {(t.noReservations || "No reservations found.").replace("{tab}", activeTab === "All" ? "" : (tabs[TABS.indexOf(activeTab)] || activeTab))}
            </div>
          )}
        </div>
      </div>

      <BookingDetailsDrawer
        reservation={selectedReservation}
        onClose={() => setSelectedReservation(null)}
        onRefresh={fetchBookings}
        StatusBadge={({ status }) => (
          <span className={`text-xs font-medium px-2 py-1 rounded-md w-fit ${STATUS_STYLES[status] || 'text-gray-700 bg-gray-100'}`}>
            {t.statusLabels?.[status] || status}
          </span>
        )}
      />
    </div>
  );
};

export default UserReservation;
