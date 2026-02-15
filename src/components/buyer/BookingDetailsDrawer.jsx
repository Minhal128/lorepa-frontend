import axios from "axios";
import { FaCheck, FaCloudUploadAlt, FaEnvelope, FaMobileAlt, FaStar, FaTimes, FaTimesCircle, FaUserCircle } from "react-icons/fa";
import config from "../../config";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { reservationTranslations } from "../../pages/Seller/Dashboard/translation/reservationTranslations";

const BookingDetailsDrawer = ({ reservation, onClose, StatusBadge, onRefresh }) => {
    if (!reservation) return null;
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [uploadingPhotos, setUploadingPhotos] = useState(false);
    const [bookingDocs, setBookingDocs] = useState([]);

    const lang = localStorage.getItem("lang") || "en";
    const t = reservationTranslations[lang] || reservationTranslations.en;

    useEffect(() => {
        if (reservation?._id) {
            fetchBookingDocs();
        }
    }, [reservation?._id]);

    const fetchBookingDocs = async () => {
        try {
            const res = await axios.get(`${config.baseUrl}/document/booking/${reservation._id}`);
            setBookingDocs(res.data.data);
        } catch (err) {
            console.error("Error fetching docs", err);
        }
    };

    const handlePhotoUpload = async (e, type) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploadingPhotos(true);
        const loadingToast = toast.loading("Uploading photos...");

        const formData = new FormData();
        formData.append("userId", localStorage.getItem("userId"));
        formData.append("uploadType", "Host");
        formData.append("documentType", type);
        formData.append("trailerId", reservation.trailerId._id);
        formData.append("bookingId", reservation._id);
        files.forEach(file => formData.append("files", file));

        try {
            await axios.post(`${config.baseUrl}/document/create-multiple`, formData);
            toast.success("Photos uploaded successfully!", { id: loadingToast });
            fetchBookingDocs();
        } catch (err) {
            toast.error("Failed to upload photos", { id: loadingToast });
        } finally {
            setUploadingPhotos(false);
        }
    };

    const checkInDocs = bookingDocs.filter(d => d.documentType === "Check-in Photo");
    const checkOutDocs = bookingDocs.filter(d => d.documentType === "Check-out Photo");

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

    const handleAcceptBooking = async () => {
        setUpdatingStatus(true);
        try {
            await axios.put(`${config.baseUrl}/booking/status/${reservation?._id}`, { status: "accepted" });
            toast.success("Booking approved successfully!");
            if (onRefresh) onRefresh();
        } catch (err) {
            toast.error("Failed to approve booking");
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleRejectBooking = async () => {
        setUpdatingStatus(true);
        try {
            await axios.put(`${config.baseUrl}/booking/status/${reservation?._id}`, { status: "rejected" });
            toast.success("Booking rejected");
            if (onRefresh) onRefresh();
        } catch (err) {
            toast.error("Failed to reject booking");
        } finally {
            setUpdatingStatus(false);
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
                                {/* Pending Approval Banner */}
                                {reservation?.status === "pending" && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-3">
                                        <span className="text-2xl">📋</span>
                                        <div>
                                            <p className="font-semibold text-yellow-800 text-sm">New Booking Request</p>
                                            <p className="text-yellow-700 text-xs">A renter has requested to book your trailer. Please review and approve or reject the request.</p>
                                            {reservation?.message && (
                                                <div className="mt-2 bg-white rounded p-2 text-xs text-gray-700 border">
                                                    <p className="font-semibold text-gray-600 mb-1">Renter's message:</p>
                                                    <p className="italic">"{reservation.message}"</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Contract status banner */}
                                {reservation?.status === "accepted" && (
                                    <div className={`rounded-lg p-3 flex items-start gap-3 ${reservation?.contractSigned ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
                                        <span className="text-2xl">{reservation?.contractSigned ? '✅' : '📄'}</span>
                                        <div>
                                            <p className={`font-semibold text-sm ${reservation?.contractSigned ? 'text-green-800' : 'text-blue-800'}`}>
                                                {reservation?.contractSigned ? 'Contract Signed by Renter' : 'Waiting for Contract Signature'}
                                            </p>
                                            <p className={`text-xs ${reservation?.contractSigned ? 'text-green-700' : 'text-blue-700'}`}>
                                                {reservation?.contractSigned
                                                    ? 'The renter has signed the contract and will proceed to payment.'
                                                    : 'You approved this booking. Waiting for the renter to sign the contract.'}
                                            </p>
                                        </div>
                                    </div>
                                )}

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

                                {/* Photo Sections */}
                                <div className="space-y-4">
                                    {/* Check-in Photos (Seller Uploads) */}
                                    <div className="border border-gray-100 rounded-lg p-3 space-y-2">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-sm font-semibold text-gray-800">{t.checkInPhotos}</h4>
                                            {(reservation.status === 'accepted' || reservation.status === 'paid') && (
                                                <label className="cursor-pointer text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1">
                                                    <FaCloudUploadAlt /> {t.uploadPhotos}
                                                    <input
                                                        type="file"
                                                        multiple
                                                        className="hidden"
                                                        onChange={(e) => handlePhotoUpload(e, "Check-in Photo")}
                                                        disabled={uploadingPhotos}
                                                    />
                                                </label>
                                            )}
                                        </div>
                                        {checkInDocs.length > 0 ? (
                                            <div className="grid grid-cols-4 gap-2">
                                                {checkInDocs.map((doc, idx) => (
                                                    <a key={idx} href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="aspect-square rounded border overflow-hidden">
                                                        <img src={doc.fileUrl} className="w-full h-full object-cover" alt="Check-in" />
                                                    </a>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-500 italic">{t.noneUploaded}</p>
                                        )}
                                        <p className="text-[10px] text-gray-400">{t.maxPhotosNote}</p>
                                    </div>

                                    {/* Check-out Photos (View Only for Seller) */}
                                    <div className="border border-gray-100 rounded-lg p-3 space-y-2">
                                        <h4 className="text-sm font-semibold text-gray-800">{t.checkOutPhotos}</h4>
                                        {checkOutDocs.length > 0 ? (
                                            <div className="grid grid-cols-4 gap-2">
                                                {checkOutDocs.map((doc, idx) => (
                                                    <a key={idx} href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="aspect-square rounded border overflow-hidden">
                                                        <img src={doc.fileUrl} className="w-full h-full object-cover" alt="Check-out" />
                                                    </a>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-500 italic">{t.noneUploaded}</p>
                                        )}
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
                                            <span>${reservation?.trailerId?.depositRate || 0}</span>
                                        </div>
                                        <div className="pt-2 flex justify-between font-bold text-lg text-gray-900">
                                            <span>Total Paid</span>
                                            <span className="text-blue-600">${reservation?.total_paid || 0}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Accept/Reject Buttons for Pending Bookings */}
                                {reservation?.status === "pending" && (
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleAcceptBooking}
                                                disabled={updatingStatus}
                                                className="flex-1 p-3 bg-green-600 rounded-lg text-white font-medium hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                <FaCheck /> Approve
                                            </button>
                                            <button
                                                onClick={handleRejectBooking}
                                                disabled={updatingStatus}
                                                className="flex-1 p-3 bg-red-600 rounded-lg text-white font-medium hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                <FaTimesCircle /> Reject
                                            </button>
                                        </div>
                                    </div>
                                )}

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