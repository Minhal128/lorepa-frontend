import axios from "axios";
import { FaCalendar, FaCheckCircle, FaCloudUploadAlt, FaComments, FaCreditCard, FaExclamationTriangle, FaFile, FaFileContract, FaHourglass, FaSpinner, FaTimes, FaTimesCircle, FaUser } from "react-icons/fa";
import config from "../../config";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RequestBookingChangeDrawer from "./RequestBookingChangeDrawer";
import { userReservationTranslations } from "../../pages/User/Dashboard/translation/userReservationTranslations";

const PHOTO_CATEGORIES = ["Front side", "Back side", "Left side", "Right side", "Interior", "Hitch / Coupling", "Tires", "License Plate"];

const BookingDetailsDrawer = ({ reservation, onClose, StatusBadge, onRefresh }) => {
    if (!reservation) return null;
    const [uploadingSlot, setUploadingSlot] = useState(null);
    const [bookingDocs, setBookingDocs] = useState([]);
    const [activeTab, setActiveTab] = useState("details");
    const [photoSubTab, setPhotoSubTab] = useState("post-rental");
    const [showPhotoBanner, setShowPhotoBanner] = useState(true);

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

    const handleSlotUpload = async (e, category, index, docType) => {
        const file = e.target.files[0];
        if (!file) return;

        const slotKey = `${docType}-${index}`;
        setUploadingSlot(slotKey);

        const formData = new FormData();
        formData.append("userId", localStorage.getItem("userId"));
        formData.append("uploadType", "Guest");
        formData.append("documentType", docType);
        formData.append("trailerId", reservation.trailerId._id);
        formData.append("bookingId", reservation._id);
        formData.append("description", category);
        formData.append("file", file);

        try {
            await axios.post(`${config.baseUrl}/document/create`, formData);
            toast.success(t.photoUploaded || "Photo uploaded!");
            fetchBookingDocs();
        } catch (err) {
            toast.error(t.photoUploadFailed || "Failed to upload photo");
        } finally {
            setUploadingSlot(null);
        }
    };

    const handleDeleteDoc = async (docId) => {
        try {
            await axios.delete(`${config.baseUrl}/document/delete/${docId}`);
            toast.success(t.photoDeleted || "Photo deleted");
            fetchBookingDocs();
        } catch (err) {
            toast.error(t.photoDeleteFailed || "Failed to delete photo");
        }
    };

    const checkInDocs = bookingDocs.filter(d => d.documentType === "Check-in Photo");
    const checkOutDocs = bookingDocs.filter(d => d.documentType === "Check-out Photo");
    const rentalDays = Math.ceil(
        (new Date(reservation?.endDate) - new Date(reservation?.startDate)) /
        (1000 * 60 * 60 * 24)
    );

    // User (renter) uploads ONLY post-rental (check-out) photos — pre-rental is for the owner
    const canUploadCheckIn = false;
    // User uploads check-out photos when status is paid
    const canUploadCheckOut = reservation.status === "paid";

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

    const getStatusBanner = () => {
        switch (reservation?.status) {
            case "pending":
                return (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-3">
                        <FaHourglass className="text-yellow-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-yellow-800 text-sm">Pending Approval</p>
                            <p className="text-yellow-700 text-xs">Your booking request is pending approval from the trailer owner.</p>
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
                                <p className="text-blue-700 text-xs">Please sign the contract to proceed.</p>
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-3">
                            <FaCreditCard className="text-green-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-green-800 text-sm">Contract Signed!</p>
                                <p className="text-green-700 text-xs">Proceed to checkout to complete your payment.</p>
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
                            <p className="text-green-700 text-xs">You can now pick up the trailer on your booking date. Review the check-in photos in the Photos tab.</p>
                        </div>
                    </div>
                );
            case "rejected":
                return (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
                        <FaTimesCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-red-800 text-sm">Booking Rejected</p>
                            <p className="text-red-700 text-xs">The owner has rejected your booking request.</p>
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

    const buildSlots = (docs, canUpload, docType) => {
        return PHOTO_CATEGORIES.map((category, idx) => {
            const sameCategoryDocs = docs.filter(d => d.description === category);
            const sameNameBefore = PHOTO_CATEGORIES.slice(0, idx).filter(c => c === category).length;
            const slotDoc = sameCategoryDocs[sameNameBefore] || null;
            const slotKey = `${docType}-${idx}`;
            const isUploading = uploadingSlot === slotKey;
            return { category, slotDoc, slotKey, isUploading, idx, canUpload, docType };
        });
    };

    const renderPhotoSlots = (docs, canUpload, docType) => {
        const slots = buildSlots(docs, canUpload, docType);
        return (
            <div className="space-y-4">
                {slots.map((slot) => (
                    <div key={slot.slotKey}>
                        <p className="text-sm font-semibold text-gray-800 mb-2">{slot.category}</p>
                        <div className="border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                            {slot.slotDoc ? (
                                <>
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <a href={slot.slotDoc.fileUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded border overflow-hidden flex-shrink-0">
                                            <img src={slot.slotDoc.fileUrl} className="w-full h-full object-cover" alt={slot.category} />
                                        </a>
                                        <FaFile className="text-gray-400 flex-shrink-0" />
                                        <span className="text-sm text-gray-700 truncate">{slot.category + " photo"}</span>
                                    </div>
                                    {canUpload && (
                                        <button onClick={() => handleDeleteDoc(slot.slotDoc._id)} className="text-red-400 hover:text-red-600 ml-2 flex-shrink-0">
                                            <FaTimes className="w-4 h-4" />
                                        </button>
                                    )}
                                </>
                            ) : slot.isUploading ? (
                                <div className="flex items-center gap-3">
                                    <FaFile className="text-gray-400" />
                                    <span className="text-sm text-gray-500">{slot.category + " photo"}</span>
                                    <FaSpinner className="animate-spin text-blue-600" />
                                </div>
                            ) : canUpload ? (
                                <label className="flex items-center gap-3 cursor-pointer w-full">
                                    <FaFile className="text-gray-300" />
                                    <span className="text-sm text-gray-400">{slot.category + " photo"}</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleSlotUpload(e, slot.category, slot.idx, slot.docType)}
                                    />
                                </label>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <FaFile className="text-gray-300" />
                                    <span className="text-sm text-gray-400 italic">{t.noneUploaded}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const currentPhotoDocs = photoSubTab === "pre-rental" ? checkInDocs : checkOutDocs;
    const currentCanUpload = photoSubTab === "pre-rental" ? canUploadCheckIn : canUploadCheckOut;
    const currentDocType = photoSubTab === "pre-rental" ? "Check-in Photo" : "Check-out Photo";
    const hasNoPhotos = photoSubTab === "post-rental" ? checkOutDocs.length === 0 : checkInDocs.length === 0;

    return (
        <div className="fixed inset-0 z-40 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gray-600 bg-opacity-50 transition-opacity" onClick={onClose}></div>
                <section className="absolute inset-y-0 right-0 max-w-full flex">
                    <div className="w-screen max-w-md">
                        <div className="h-full flex flex-col bg-white shadow-xl">
                            {/* Blue Header */}
                            <div className="bg-blue-600 p-4 sm:p-6 flex items-center gap-3">
                                <button onClick={onClose} className="text-white hover:text-blue-200">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            </div>

                            {/* Main Tabs */}
                            <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
                                <button
                                    onClick={() => setActiveTab("details")}
                                    className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${activeTab === "details" ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" : "text-gray-500 hover:text-gray-700"}`}
                                >
                                    {t.bookingDetailsTab || "Booking details"}
                                </button>
                                <button
                                    onClick={() => setActiveTab("photos")}
                                    className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${activeTab === "photos" ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" : "text-gray-500 hover:text-gray-700"}`}
                                >
                                    {t.photosTab || "Photos"}
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto">
                                {activeTab === "details" ? (
                                    <div className="p-4 sm:p-6 space-y-6">
                                        {getStatusBanner()}

                                        {/* Check-in photos available banner */}
                                        {reservation?.status === "paid" && checkInDocs.length > 0 && (
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-3">
                                                <span className="text-2xl">📸</span>
                                                <div>
                                                    <p className="font-semibold text-blue-800 text-sm">{t.checkInAvailable || "Check-in Photos Available"}</p>
                                                    <p className="text-blue-700 text-xs">{t.checkInAvailableDesc || "The owner has uploaded check-in photos showing the trailer's condition. Review them before pickup."}</p>
                                                    <button onClick={() => { setActiveTab("photos"); setPhotoSubTab("pre-rental"); }} className="mt-2 text-xs font-medium text-blue-700 underline hover:text-blue-900">
                                                        {t.viewCheckInPhotos || "View Check-in Photos →"}
                                                    </button>
                                                </div>
                                            </div>
                                        )}

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

                                        {reservation?.status === "accepted" && reservation?.contractSigned && (
                                            <div className="border border-green-200 bg-green-50 rounded-lg p-4 space-y-3">
                                                <div className="flex items-center gap-2 text-green-700">
                                                    <FaCheckCircle />
                                                    <span className="font-semibold">Contract Successfully Signed</span>
                                                </div>
                                                <p className="text-sm text-gray-600">Your rental agreement has been submitted. You can now proceed to checkout.</p>
                                                <button onClick={handleProceedToPayment} className="w-full p-3 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700 transition">
                                                    Proceed to Checkout
                                                </button>
                                            </div>
                                        )}

                                        {/* Upload check-out photos prompt */}
                                        {reservation?.status === "paid" && checkOutDocs.length === 0 && (
                                            <div className="border border-orange-200 bg-orange-50 rounded-lg p-4 space-y-3">
                                                <div className="flex items-center gap-2 text-orange-700">
                                                    <FaCloudUploadAlt />
                                                    <span className="font-semibold">{t.uploadCheckOutPrompt || "Upload Check-out Photos"}</span>
                                                </div>
                                                <p className="text-sm text-gray-600">{t.uploadCheckOutPromptDesc || "When returning the trailer, upload check-out photos to document the trailer's condition."}</p>
                                                <button onClick={() => { setActiveTab("photos"); setPhotoSubTab("post-rental"); }} className="w-full p-3 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700 transition">
                                                    {t.goToPhotos || "Go to Photos"}
                                                </button>
                                            </div>
                                        )}

                                        <div className="pt-2 space-y-2">
                                            {(reservation?.status === "pending" || reservation?.status === "accepted") && (
                                                <button onClick={handleChatWithOwner} className="w-full p-3 border border-blue-600 rounded-lg text-blue-600 font-medium hover:bg-blue-50 transition flex items-center justify-center gap-2">
                                                    <FaComments />
                                                    Chat with Owner
                                                </button>
                                            )}

                                            {reservation?.status === "pending" && (
                                                <button onClick={handleRequestChange} className="w-full p-3 border border-blue-600 rounded-lg text-blue-600 font-medium hover:bg-blue-50 transition">
                                                    Request Change
                                                </button>
                                            )}

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
                                ) : (
                                    /* ========== PHOTOS TAB ========== */
                                    <div className="p-4 sm:p-6 space-y-4 flex flex-col min-h-[calc(100vh-140px)]">
                                        {showPhotoBanner && hasNoPhotos && currentCanUpload && (
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <FaExclamationTriangle className="text-yellow-500 flex-shrink-0" />
                                                    <span className="text-sm text-yellow-800">{t.yetToUploadPhotos || "You are yet to upload photos"}</span>
                                                </div>
                                                <button onClick={() => setShowPhotoBanner(false)} className="text-yellow-600 hover:text-yellow-800">
                                                    <FaTimes className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center">
                                            <h3 className="text-base font-bold text-gray-900">{t.photosTab || "Photos"}</h3>
                                            {currentCanUpload && (
                                                <label className="cursor-pointer text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                                                    <FaCloudUploadAlt /> {t.uploadPhotos}
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            const files = Array.from(e.target.files);
                                                            if (files.length === 0) return;
                                                            setUploadingSlot("bulk");
                                                            const formData = new FormData();
                                                            formData.append("userId", localStorage.getItem("userId"));
                                                            formData.append("uploadType", "Guest");
                                                            formData.append("documentType", currentDocType);
                                                            formData.append("trailerId", reservation.trailerId._id);
                                                            formData.append("bookingId", reservation._id);
                                                            files.forEach(file => formData.append("files", file));
                                                            axios.post(`${config.baseUrl}/document/create-multiple`, formData)
                                                                .then(() => { toast.success(t.photoUploaded || "Photos uploaded!"); fetchBookingDocs(); })
                                                                .catch(() => toast.error(t.photoUploadFailed || "Failed to upload"))
                                                                .finally(() => setUploadingSlot(null));
                                                        }}
                                                    />
                                                </label>
                                            )}
                                        </div>

                                        <div className="flex border-b border-gray-200">
                                            <button
                                                onClick={() => setPhotoSubTab("pre-rental")}
                                                className={`flex-1 pb-2 text-sm font-medium text-center ${photoSubTab === "pre-rental" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400"}`}
                                            >
                                                {t.preRentalPhotos || "Pre-rental photos"}
                                            </button>
                                            <button
                                                onClick={() => setPhotoSubTab("post-rental")}
                                                className={`flex-1 pb-2 text-sm font-medium text-center ${photoSubTab === "post-rental" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400"}`}
                                            >
                                                {t.postRentalPhotos || "Post-rental photos"}
                                            </button>
                                        </div>

                                        {/* Role-based info banners */}
                                        {photoSubTab === "pre-rental" && (
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-3">
                                                <span className="text-lg flex-shrink-0">📷</span>
                                                <div>
                                                    <p className="font-semibold text-blue-800 text-sm">{t.preRentalOwnerOnly || "Uploaded by the owner"}</p>
                                                    <p className="text-blue-700 text-xs">{t.preRentalOwnerOnlyDesc || "Pre-rental photos document the trailer's condition before pickup. Only the trailer owner can upload these."}</p>
                                                </div>
                                            </div>
                                        )}
                                        {photoSubTab === "post-rental" && reservation.status !== "paid" && (
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-start gap-3">
                                                <span className="text-lg flex-shrink-0">ℹ️</span>
                                                <div>
                                                    <p className="font-semibold text-gray-800 text-sm">{t.postRentalAfterPayment || "Available after payment"}</p>
                                                    <p className="text-gray-600 text-xs">{t.postRentalAfterPaymentDesc || "You can upload post-rental photos once your booking is active (paid)."}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex-1">
                                            {renderPhotoSlots(currentPhotoDocs, currentCanUpload, currentDocType)}

                                            {currentPhotoDocs.filter(d => !d.description).length > 0 && (
                                                <div className="mt-4">
                                                    <p className="text-sm font-semibold text-gray-800 mb-2">{t.additionalPhotos || "Additional photos"}</p>
                                                    <div className="grid grid-cols-4 gap-2">
                                                        {currentPhotoDocs.filter(d => !d.description).map((doc, idx) => (
                                                            <div key={idx} className="relative aspect-square rounded border overflow-hidden group">
                                                                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                                                    <img src={doc.fileUrl} className="w-full h-full object-cover" alt="Photo" />
                                                                </a>
                                                                {currentCanUpload && (
                                                                    <button onClick={() => handleDeleteDoc(doc._id)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <FaTimes className="w-2 h-2" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            <p className="text-[10px] text-gray-400 mt-3">{t.maxPhotosNote}</p>
                                        </div>

                                        <div className="pt-4">
                                            <button onClick={onClose} className="w-full p-3 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition">
                                                {t.done || "Done"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
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

export default BookingDetailsDrawer;