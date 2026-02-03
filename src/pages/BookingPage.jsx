import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import config from '../config';
import toast from 'react-hot-toast';

// Only the translations we actually use
const bookingTranslations = {
    en: {
        selectTrailer: "Select Trailer",
        selectTrailerPlaceholder: "Select trailer",
        bookingStartDate: "Booking Start Date",
        bookingEndDate: "Booking End Date",
        estimatedPrice: "Estimated Price:",
        complete: "Complete",
        bookingSubmittedSuccess: "Booking submitted successfully",
        submissionFailed: "Submission failed",
    },
    es: {
        selectTrailer: "Seleccionar remolque",
        selectTrailerPlaceholder: "Seleccionar remolque",
        bookingStartDate: "Fecha de inicio de la reserva",
        bookingEndDate: "Fecha de finalización de la reserva",
        estimatedPrice: "Precio estimado:",
        complete: "Completar",
        bookingSubmittedSuccess: "Reserva enviada con éxito",
        submissionFailed: "Error al enviar",
    },
    cn: {
        selectTrailer: "选择拖车",
        selectTrailerPlaceholder: "选择拖车",
        bookingStartDate: "预订开始日期",
        bookingEndDate: "预订结束日期",
        estimatedPrice: "预计价格：",
        complete: "完成",
        bookingSubmittedSuccess: "预订提交成功",
        submissionFailed: "提交失败",
    },
    fr: {
        selectTrailer: "Sélectionner une remorque",
        selectTrailerPlaceholder: "Sélectionner une remorque",
        bookingStartDate: "Date de début de réservation",
        bookingEndDate: "Date de fin de réservation",
        estimatedPrice: "Prix estimé :",
        complete: "Terminer",
        bookingSubmittedSuccess: "Réservation soumise avec succès",
        submissionFailed: "Échec de la soumission",
    }
};

const BookingSuccessModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleGoHome = () => {
        onClose();
        window.location.href = '/';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 relative w-96">
                <button onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl">
                    &times;
                </button>
                <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="white" className="w-12 h-12" viewBox="0 0 24 24">
                            <path fillRule="evenodd" clipRule="evenodd"
                                d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9.75 10.5a.75.75 0 0 1-1.12.02L3.248 10.37a.75.75 0 1 1 1.06-1.06l5.25 5.25 9.25-9.998a.75.75 0 0 1 1.04-.208Z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 text-center">Booking Completed</h3>
                    <button onClick={handleGoHome}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

const BookingPage = () => {
    const [translations, setTranslations] = useState(() => {
        const storedLang = localStorage.getItem('lang');
        return bookingTranslations[storedLang] || bookingTranslations.fr;
    });

    const [trailers, setTrailers] = useState([]);
    const [selectedTrailer, setSelectedTrailer] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [price, setPrice] = useState(0);
    const [showBookingSuccessModal, setShowBookingSuccessModal] = useState(false);

    // Update translations if language changes
    useEffect(() => {
        const handleStorageChange = () => {
            const storedLang = localStorage.getItem('lang');
            setTranslations(bookingTranslations[storedLang] || bookingTranslations.fr);
        };
        window.addEventListener('storage', handleStorageChange);
        handleStorageChange();
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Fetch trailers
    useEffect(() => {
        axios.get(`${config.baseUrl}/trailer/all`)
            .then(res => setTrailers(res.data.data))
            .catch(err => console.error(err));
        window.scrollTo(0, 0);
    }, []);

    // Calculate price
    useEffect(() => {
        if (startDate && endDate && selectedTrailer) {
            const trailer = trailers.find(t => t._id === selectedTrailer);
            if (trailer) {
                const diffDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
                const rate = parseFloat(trailer.dailyRate || '0');
                setPrice(rate * diffDays);
            }
        }
    }, [startDate, endDate, selectedTrailer, trailers]);

    // Submit booking
    const handleSubmit = async () => {
        try {
            const user_id = localStorage.getItem('user_id');
            if (!user_id) return toast.error("User not found");

            const payload = {
                user_id,
                trailerId: selectedTrailer,
                startDate,
                endDate,
                price
            };

            const res = await axios.post(`${config.baseUrl}/booking/create`, payload);

            if (res.data) {
                toast.success(translations.bookingSubmittedSuccess);
                setShowBookingSuccessModal(true);
            }
        } catch (error) {
            console.error("Booking error:", error);
            toast.error(error.response?.data?.msg || translations.submissionFailed);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col font-inter">
            <Navbar />
            <div className="flex-1 container mx-auto p-6 flex">
                <div className="flex-1 px-4">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">{translations.selectTrailer}</h2>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{translations.selectTrailer}</label>
                            <select value={selectedTrailer} onChange={(e) => setSelectedTrailer(e.target.value)}
                                className="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                                <option value="" disabled>{translations.selectTrailerPlaceholder}</option>
                                {trailers.map(trailer => (
                                    <option key={trailer._id} value={trailer._id}>{trailer.title}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{translations.bookingStartDate}</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                                className="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{translations.bookingEndDate}</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                                className="w-full border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        {price > 0 && (
                            <div>
                                <p className="text-green-600 text-sm font-semibold">{translations.estimatedPrice} ${price.toFixed(2)}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end mt-8 pt-4 border-t">
                        <button onClick={handleSubmit}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md">
                            {translations.complete}
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
            <BookingSuccessModal isOpen={showBookingSuccessModal} onClose={() => setShowBookingSuccessModal(false)} />
        </div>
    );
};

export default BookingPage;
