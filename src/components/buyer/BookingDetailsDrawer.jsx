import axios from "axios";
import { FaEnvelope, FaMobileAlt, FaStar, FaTimes, FaUserCircle } from "react-icons/fa";
import config from "../../config";
import { useNavigate } from "react-router-dom";

const BookingDetailsDrawer = ({ reservation, onClose, StatusBadge }) => {
    if (!reservation) return null;
    const VerificationIcon = ({ isVerified, icon: Icon }) => (
        <span title={isVerified ? isVerified : "Not Verified"} className={`p-1 rounded-full ${isVerified ? 'text-green-500 bg-green-100' : 'text-gray-400 bg-gray-100'}`}>
            <Icon className="w-3 h-3" />
        </span>
    );

    const nav = useNavigate()
    const createChat = async () => {
        try {
            const currentUserId = localStorage.getItem("userId");
            const otherUserId = reservation?.user_id?._id;

            if (!currentUserId || !otherUserId) return;

            const response = await axios.post(`${config.baseUrl}/chat/create`, {
                participants: [currentUserId, otherUserId]
            });

            const chat = response.data.data;
            console.log("Chat created or existing chat returned:", chat);

            nav(`/seller/dashboard/messaging`);
        } catch (error) {
            console.error("Error creating chat:", error);
        }
    };

    return (
        <div className="fixed inset-0 z-40 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                {/* Backdrop */}
                <div className="absolute inset-0 bg-gray-600 bg-opacity-50 transition-opacity" onClick={onClose}></div>

                {/* Drawer */}
                <section className="absolute inset-y-0 right-0 max-w-full flex">
                    <div className="w-screen max-w-md">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                            {/* Header */}
                            <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                                <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
                                <button
                                    type="button"
                                    className="text-gray-400 hover:text-gray-500"
                                    onClick={onClose}
                                >
                                    <FaTimes className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-4 sm:p-6 space-y-6">
                                {/* Trailer Image and Status */}
                                <div className="space-y-4">
                                    <img
                                        src={reservation?.trailerId?.images[0]}
                                        alt={reservation?.trailerId?.title}
                                        className="w-full h-40 object-cover rounded-lg"
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x160/1E3A8A/FFFFFF?text=TRAILER"; }}
                                    />
                                    <div className="flex justify-between items-center">
                                        <p className="text-lg font-bold text-gray-900">{reservation?.trailerId?.title}</p>
                                        <StatusBadge status={reservation.status} />
                                    </div>
                                </div>

                                {/* Renter Details */}
                                <div className="border p-4 rounded-lg space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <FaUserCircle className="w-10 h-10 text-blue-600" />
                                        <div>
                                            <p className="font-semibold text-gray-800">{reservation?.user_id?.name}</p>
                                            <p className="text-xs text-gray-500">Member since {reservation?.user_id?.createdAt}</p>
                                        </div>
                                        <div className="flex items-center text-sm ml-auto font-medium text-yellow-500">
                                            {4}/5 <FaStar className="w-3 h-3 ml-1" />
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-600">
                                        <div className="flex items-center space-x-1">
                                            <FaStar className="w-3 h-3 text-yellow-500" />
                                            <span>Reliability Score: {4}/5</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <VerificationIcon isVerified={reservation?.user_id?.email} icon={FaEnvelope} />
                                            <VerificationIcon isVerified={reservation?.user_id?.phone} icon={FaMobileAlt} />
                                        </div>
                                    </div>
                                </div>

                                {/* Booking & Payment Summary */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Booking & Payment Summary</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm text-gray-700">
                                        <div className="flex justify-between border-b pb-1">
                                            <span className="font-medium">Booking Dates</span>
                                            <span className="text-blue-600 font-medium">{reservation?.startDate} - {reservation?.endDate}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Amount</span>
                                            <span>${reservation?.price}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Security Deposit</span>
                                            <span>${reservation?.trailerId?.depositRate}</span>
                                        </div>
                                        <div className="pt-2 flex justify-between font-bold text-lg text-gray-900">
                                            <span>Total Paid</span>
                                            <span className="text-blue-600">${0}</span>
                                        </div>
                                        {/* <div className="flex justify-end text-xs">
                                            <span className="text-green-600 bg-green-100 px-2 py-0.5 rounded-full font-medium">{bookingSummary.paymentStatus}</span>
                                        </div> */}
                                    </div>
                                </div>

                                {/* Documents & Reports (Mock) */}
                                {/* <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Documents & Reports (Mock)</h3>
                                    <button className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                                        <FaDownload className="w-4 h-4 mr-2" /> Rental Contract (PDF)
                                    </button>
                                </div> */}

                                {/* Check-in Photos */}
                                {/* <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Check-in Photos</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {checkInPhotos.map((label) => (
                                            <div key={label} className="bg-gray-200 h-16 rounded-lg flex items-center justify-center text-gray-700 font-semibold shadow-inner">
                                                {label}
                                            </div>
                                        ))}
                                    </div>
                                </div> */}

                                {/* Check-out Photos */}
                                {/* <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Check-out Photos</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {checkOutPhotos.map((label) => (
                                            <div key={label} className="bg-gray-200 h-16 rounded-lg flex items-center justify-center text-gray-700 font-semibold shadow-inner">
                                                {label}
                                            </div>
                                        ))}
                                    </div>
                                </div> */}

                                {/* Message Renter */}
                                <div className="pt-2">
                                    <button onClick={createChat} className="w-full p-3 border border-blue-600 rounded-lg text-blue-600 font-medium hover:bg-blue-50 transition">
                                        Message Renter
                                    </button>
                                </div>

                            </div>
                            {/* End Content */}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default BookingDetailsDrawer