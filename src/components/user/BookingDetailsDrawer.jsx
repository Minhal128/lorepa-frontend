import axios from "axios";
import { FaCalendar, FaCheckCircle, FaCloudUploadAlt, FaComments, FaCreditCard, FaFileContract, FaHourglass, FaTimes, FaTimesCircle, FaUser } from "react-icons/fa";
import config from "../../config";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RequestBookingChangeDrawer from "./RequestBookingChangeDrawer";
import { userReservationTranslations } from "../../pages/User/Dashboard/translation/userReservationTranslations";

const BookingDetailsDrawer = ({ reservation, onClose, StatusBadge, onRefresh }) => {
    if (!reservation) return null;
    const [uploadingPhotos, setUploadingPhotos] = useState(false);
    const [bookingDocs, setBookingDocs] = useState([]);

    const lang = localStorage.getItem("lang") || "en";
    const t = userReservationTranslations[lang] || userReservationTranslations.en;

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
        formData.append("uploadType", "Guest");
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
    const rentalDays = Math.ceil(
        (new Date(reservation?.endDate) - new Date(reservation?.startDate)) /
        (1000 * 60 * 60 * 24)
    );
    const [isChangeDrawerOpen, setIsChangeDrawerOpen] = useState(false);
    const [contractChecked, setContractChecked] = useState(false);
    const [signingContract, setSigningContract] = useState(false);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const nav = useNavigate();

    const handleCancelBooking = async () => {
        try {
            const result = await axios.put(`${config.baseUrl}/booking/status/${reservation?._id}`, { status: "cancelled" });
            if (result) {
                toast.success("Booking cancelled successfully");
                setShowCancelConfirm(false);
                if (onRefresh) onRefresh();
            }
        } catch (err) {
            toast.error("Failed to cancel booking");
        }
    };

    const handleRequestChange = () => {
        setIsChangeDrawerOpen(true);
    };

    const handleChatWithOwner = async () => {
        try {
            const currentUserId = localStorage.getItem("userId");
            const otherUserId = reservation?.owner_id?._id;
            if (!currentUserId || !otherUserId) return;

            await axios.post(`${config.baseUrl}/chat/create`, {
                participants: [currentUserId, otherUserId]
            });

            nav("/user/dashboard/messaging");
        } catch (error) {
            console.error("Error creating chat:", error);
        }
    };

    const handleSignContract = async () => {
        if (!contractChecked) {
            toast.error("Please check the contract checkbox to sign");
            return;
        }
        setSigningContract(true);
        try {
            const result = await axios.put(`${config.baseUrl}/booking/sign-contract/${reservation?._id}`);
            if (result) {
                toast.success("Contract signed successfully!");
                if (onRefresh) onRefresh();
            }
        } catch (err) {
            toast.error("Failed to sign contract");
        } finally {
            setSigningContract(false);
        }
    };

    const handleProceedToPayment = async () => {
        const userId = localStorage.getItem("userId");
        let loadingToast = toast.loading("Redirecting to payment...");

        try {
            const { data } = await axios.post(`${config.baseUrl}/stripe/create-checkout-session`, {
                trailerId: reservation?.trailerId?._id,
                userId,
                startDate: reservation?.startDate,
                endDate: reservation?.endDate,
                price: reservation?.price,
                bookingId: reservation?._id,
            });

            toast.dismiss(loadingToast);
            window.location.href = data.url;
        } catch (error) {
            toast.error("Payment failed", { id: loadingToast });
        }
    };

    // Status-based banner messages
    const getStatusBanner = () => {
        switch (reservation?.status) {
            case "pending":
                return (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-3">
                        <FaHourglass className="text-yellow-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-yellow-800 text-sm">Pending Approval</p>
                            <p className="text-yellow-700 text-xs">Your booking request is pending approval from the trailer owner. You'll be notified once it's approved.</p>
                        </div>
                    </div>
                );
            case "accepted":
                if (!reservation?.contractSigned) {
                    return (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-3">
                            <FaFileContract className="text-blue-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-blue-800 text-sm">Booking Approved!</p>
                                <p className="text-blue-700 text-xs">Your booking has been approved. Please sign the contract to proceed with pickup.</p>
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-3">
                            <FaCreditCard className="text-green-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-green-800 text-sm">Contract Signed!</p>
                                <p className="text-green-700 text-xs">You've signed the contract. Proceed to checkout to complete your payment.</p>
                            </div>
                        </div>
                    );
                }
            case "paid":
                return (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-3">
                        <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-green-800 text-sm">Payment Complete</p>
                            <p className="text-green-700 text-xs">Your payment has been received. You can now pick up the trailer on your booking date.</p>
                        </div>
                    </div>
                );
            case "rejected":
                return (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
                        <FaTimesCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-red-800 text-sm">Booking Rejected</p>
                            <p className="text-red-700 text-xs">Unfortunately, the owner has rejected your booking request.</p>
                        </div>
                    </div>
                );
            case "cancelled":
                return (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-start gap-3">
                        <FaTimesCircle className="text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-gray-800 text-sm">Booking Cancelled</p>
                            <p className="text-gray-700 text-xs">This booking has been cancelled.</p>
                        </div>
                    </div>
                );
            default:
                return null;
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
                                {/* Status Banner */}
                                {getStatusBanner()}

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

                                {/* Booking Details */}
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

                                {/* Photo Sections */}
                                <div className="space-y-4">
                                    {/* Check-in Photos (View Only for User) */}
                                    <div className="border border-gray-100 rounded-lg p-3 space-y-2">
                                        <h4 className="text-sm font-semibold text-gray-800">{t.checkInPhotos}</h4>
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
                                    </div>

                                    {/* Check-out Photos (User Uploads) */}
                                    <div className="border border-gray-100 rounded-lg p-3 space-y-2">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-sm font-semibold text-gray-800">{t.checkOutPhotos}</h4>
                                            {reservation.status === 'paid' && (
                                                <label className="cursor-pointer text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1">
                                                    <FaCloudUploadAlt /> {t.uploadPhotos}
                                                    <input
                                                        type="file"
                                                        multiple
                                                        className="hidden"
                                                        onChange={(e) => handlePhotoUpload(e, "Check-out Photo")}
                                                        disabled={uploadingPhotos}
                                                    />
                                                </label>
                                            )}
                                        </div>
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
                                        <p className="text-[10px] text-gray-400">{t.maxPhotosNote}</p>
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

                                {/* Contract Signing Section - Only when accepted and not yet signed */}
                                {reservation?.status === "accepted" && !reservation?.contractSigned && (
                                    <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 space-y-3">
                                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                            <FaFileContract className="text-blue-600" />
                                            Contract Agreement
                                        </h3>
                                        <div className="bg-white rounded-lg p-3 max-h-48 overflow-y-auto text-xs text-gray-600 border">
                                            <p className="font-semibold mb-2">Rental Terms</p>
                                            <ul className="list-disc pl-4 space-y-1">
                                                <li>The renter agrees to return the trailer in the same condition as received.</li>
                                                <li>Any damage beyond normal wear will be charged to the renter.</li>
                                                <li>The renter is responsible for the trailer during the rental period.</li>
                                                <li>Late returns may incur additional daily charges.</li>
                                                <li>A security deposit may be required and will be refunded upon safe return.</li>
                                                <li>Cancellation within 24 hours of pickup may result in a cancellation fee.</li>
                                            </ul>
                                            <p className="font-semibold mt-3 mb-2">Guarantee Fund and Insurance</p>
                                            <ul className="list-disc pl-4 space-y-1">
                                                <li>The renter must have adequate insurance for the rental period.</li>
                                                <li>A guarantee fund may be required for the rental.</li>
                                            </ul>
                                            <p className="font-semibold mt-3 mb-2">Damage Policy</p>
                                            <ul className="list-disc pl-4 space-y-1">
                                                <li>Pre-rental and post-rental photos are mandatory.</li>
                                                <li>Renters are responsible for any liner damage or structural issues.</li>
                                            </ul>
                                        </div>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={contractChecked}
                                                onChange={(e) => setContractChecked(e.target.checked)}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700">I acknowledge I have read and agree to all contract terms</span>
                                        </label>
                                        <button
                                            onClick={handleSignContract}
                                            disabled={!contractChecked || signingContract}
                                            className={`w-full p-3 rounded-lg text-white font-medium transition ${contractChecked && !signingContract ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                                        >
                                            {signingContract ? "Signing..." : "Sign Contract"}
                                        </button>
                                    </div>
                                )}

                                {/* Proceed to Payment - Only when contract is signed */}
                                {reservation?.status === "accepted" && reservation?.contractSigned && (
                                    <div className="border border-green-200 bg-green-50 rounded-lg p-4 space-y-3">
                                        <div className="flex items-center gap-2 text-green-700">
                                            <FaCheckCircle />
                                            <span className="font-semibold">Contract Successfully Signed</span>
                                        </div>
                                        <p className="text-sm text-gray-600">Your rental agreement has been submitted. You can now proceed to checkout and make the payment.</p>
                                        <button
                                            onClick={handleProceedToPayment}
                                            className="w-full p-3 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700 transition"
                                        >
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="pt-2 space-y-2">
                                    {/* Chat with Owner - available for pending and accepted */}
                                    {(reservation?.status === "pending" || reservation?.status === "accepted") && (
                                        <button onClick={handleChatWithOwner} className="w-full p-3 border border-blue-600 rounded-lg text-blue-600 font-medium hover:bg-blue-50 transition flex items-center justify-center gap-2">
                                            <FaComments />
                                            Chat with Owner
                                        </button>
                                    )}

                                    {/* Request Change - available for pending */}
                                    {reservation?.status === "pending" && (
                                        <button onClick={handleRequestChange} className="w-full p-3 border border-blue-600 rounded-lg text-blue-600 font-medium hover:bg-blue-50 transition">
                                            Request Change
                                        </button>
                                    )}

                                    {/* Cancel Booking */}
                                    {(reservation?.status !== "cancelled" && reservation?.status !== "completed" && reservation?.status !== "rejected" && reservation?.status !== "paid") && (
                                        <>
                                            {!showCancelConfirm ? (
                                                <button onClick={() => setShowCancelConfirm(true)} className="w-full p-3 border border-[#EA4335] rounded-lg text-[#EA4335] font-medium bg-transparent transition">
                                                    Cancel Booking
                                                </button>
                                            ) : (
                                                <div className="border border-red-200 bg-red-50 rounded-lg p-4 space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-3xl">⚠️</span>
                                                        <div>
                                                            <p className="font-semibold text-red-800">Cancel request</p>
                                                            <p className="text-sm text-red-700">Are you sure you want to cancel this booking? This action cannot be undone.</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => setShowCancelConfirm(false)} className="flex-1 p-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition">
                                                            No
                                                        </button>
                                                        <button onClick={handleCancelBooking} className="flex-1 p-2 bg-[#EA4335] rounded-lg text-white font-medium hover:bg-red-600 transition">
                                                            Yes
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
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