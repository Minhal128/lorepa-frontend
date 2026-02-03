import axios from "axios";
import { FaCalendar, FaTimes, FaUser } from "react-icons/fa";
import config from "../../config";
import toast from "react-hot-toast";
import { useState } from "react";
import RequestBookingChangeDrawer from "./RequestBookingChangeDrawer";

const BookingDetailsDrawer = ({ reservation, onClose, StatusBadge }) => {
    if (!reservation) return null;
    const rentalDays = Math.ceil(
        (new Date(reservation?.endDate) - new Date(reservation?.startDate)) /
        (1000 * 60 * 60 * 24)
    );
    const [isChangeDrawerOpen, setIsChangeDrawerOpen] = useState(false);

    const handleCancelBooking = async () => {
        try {
            const result = await axios.put(`${config.baseUrl}/booking/status/${reservation?._id}`, { status: "cancelled" });
            if (result) {
                toast.success(`Booking Cancelled successfully`);
            }
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const handleRequestChange = () => {
        setIsChangeDrawerOpen(true);
    };

    console.log(isChangeDrawerOpen)

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

                                {/* Booking Details  */}

                                <div>
                                    <div className="flex items-center gap-x-3 mb-1">
                                        <FaCalendar className="text-blue-600" />
                                        <p className="font-semibold">Period</p>
                                        <p className="text-[#666666]">{reservation?.startDate} - {reservation?.endDate}</p>
                                    </div>
                                    <div className="flex items-center gap-x-1 mb-1">
                                        <FaUser className="text-blue-600" />
                                        <p className="font-semibold">Contact Owner</p>
                                        <p className="text-[#666666] text-sm">{reservation?.owner_id?.name?.split(" ")[0]} <span className="text-blue-600">({reservation?.owner_id?.email})</span></p>
                                    </div>
                                </div>

                                {/* Booking & Payment Summary */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Booking & Payment Summary</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm text-gray-700">
                                        <div className="flex justify-between border-b pb-1">
                                            <span className="font-medium">Price Breakdown</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Rental fee ({rentalDays} days)</span>
                                            <span>${reservation?.price}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Amount</span>
                                            <span>${reservation?.price}</span>
                                        </div>
                                        <div className="pt-2 flex justify-between font-bold text-lg text-gray-900">
                                            <span>Total Paid</span>
                                            <span className="text-blue-600">${reservation?.total_paid}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Message Renter */}
                                <div className="pt-2">
                                    <button onClick={handleRequestChange} className="w-full p-3 border border-blue-600 rounded-lg text-blue-600 font-medium hover:bg-blue-50 transition">
                                        Request Change
                                    </button>
                                    {
                                        (reservation?.status !== "cancelled" && reservation?.status !== "completed") && (
                                            <button onClick={handleCancelBooking} className="w-full p-3 mt-2 border border-[#EA4335] rounded-lg text-[#EA4335] font-medium bg-transparent transition">
                                                Cancel Booking
                                            </button>

                                        )
                                    }
                                </div>

                            </div>
                            {/* End Content */}
                        </div>
                    </div>
                </section>
            </div>
            {isChangeDrawerOpen && (
                <RequestBookingChangeDrawer
                    reservation={reservation}
                    onClose={() => setIsChangeDrawerOpen(false)}
                />
            )}
        </div>
    );
};

export default BookingDetailsDrawer