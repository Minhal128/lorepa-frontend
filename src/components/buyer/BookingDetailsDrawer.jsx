import axios from "axios";
import { FaCheck, FaCloudUploadAlt, FaEnvelope, FaExclamationTriangle, FaFile, FaMobileAlt, FaSpinner, FaStar, FaTimes, FaTimesCircle, FaUserCircle } from "react-icons/fa";
import config from "../../config";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { reservationTranslations } from "../../pages/Seller/Dashboard/translation/reservationTranslations";

const PHOTO_CATEGORIES = ["Front side", "Back side", "Left side", "Right side", "Interior", "Hitch / Coupling", "Tires", "License Plate"];

const BookingDetailsDrawer = ({ reservation, onClose, StatusBadge, onRefresh }) => {
    if (!reservation) return null;
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [uploadingSlot, setUploadingSlot] = useState(null);
    const [bookingDocs, setBookingDocs] = useState([]);
    const [activeTab, setActiveTab] = useState("details");
    const [photoSubTab, setPhotoSubTab] = useState("pre-rental");
    const [showPhotoBanner, setShowPhotoBanner] = useState(true);

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

    const handleSlotUpload = async (e, category, index, docType) => {
        const file = e.target.files[0];
        if (!file) return;

        const slotKey = `${docType}-${index}`;
        setUploadingSlot(slotKey);

        const formData = new FormData();
        formData.append("userId", localStorage.getItem("userId"));
        formData.append("uploadType", "Host");
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

    const handleAcceptReturn = async () => {
        setUpdatingStatus(true);
        try {
            await axios.put(`${config.baseUrl}/booking/status/${reservation?._id}`, { status: "completed" });
            toast.success(t.returnAccepted || "Return accepted! Booking completed.");
            if (onRefresh) onRefresh();
        } catch (err) {
            toast.error(t.returnAcceptFailed || "Failed to accept return");
        } finally {
            setUpdatingStatus(false);
        }
    };

    const checkInDocs = bookingDocs.filter(d => d.documentType === "Check-in Photo");
    const checkOutDocs = bookingDocs.filter(d => d.documentType === "Check-out Photo");

    // Owner can ONLY upload pre-rental photos after payment is confirmed
    const canUploadCheckIn = reservation.status === "paid";
    // Owner/Seller can ONLY upload pre-rental (check-in) photos — post-rental is for the renter
    const canUploadCheckOut = false;

    const VerificationIcon = ({ isVerified, icon: Icon }) => (
        <span title={isVerified ? isVerified : "Not Verified"} className={`p-1 rounded-full ${isVerified ? 'text-green-500 bg-green-100' : 'text-gray-400 bg-gray-100'}`}>
            <Icon className="w-3 h-3" />
        </span>
    );

    const nav = useNavigate();
    const createChat = async () => {
        try {
            const currentUserId = localStorage.getItem("userId");
            const otherUserId = reservation?.user_id?._id;
            if (!currentUserId || !otherUserId) return;
            await axios.post(`${config.baseUrl}/chat/create`, {
                participants: [currentUserId, otherUserId]
            });
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
                                        <span className="text-sm text-gray-700 truncate">
                                            {slot.category + " photo"}
                                        </span>
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
    const hasNoPhotos = photoSubTab === "pre-rental" ? checkInDocs.length === 0 : checkOutDocs.length === 0;

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

                                        {reservation?.status === "paid" && checkOutDocs.length > 0 && (
                                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-start gap-3">
                                                <span className="text-2xl">📸</span>
                                                <div>
                                                    <p className="font-semibold text-orange-800 text-sm">{t.checkOutSubmitted || "Check-out Photos Submitted"}</p>
                                                    <p className="text-orange-700 text-xs">{t.checkOutSubmittedDesc || "The renter has uploaded check-out photos. Review them in the Photos tab and accept the return if the trailer is in good condition."}</p>
                                                    <button onClick={() => setActiveTab("photos")} className="mt-2 text-xs font-medium text-orange-700 underline hover:text-orange-900">
                                                        {t.reviewPhotos || "Review Photos →"}
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

                                        {reservation?.status === "pending" && (
                                            <div className="flex gap-2">
                                                <button onClick={handleAcceptBooking} disabled={updatingStatus} className="flex-1 p-3 bg-green-600 rounded-lg text-white font-medium hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50">
                                                    <FaCheck /> Approve
                                                </button>
                                                <button onClick={handleRejectBooking} disabled={updatingStatus} className="flex-1 p-3 bg-red-600 rounded-lg text-white font-medium hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-50">
                                                    <FaTimesCircle /> Reject
                                                </button>
                                            </div>
                                        )}

                                        <div className="pt-2">
                                            <button onClick={createChat} className="w-full p-3 border border-blue-600 rounded-lg text-blue-600 font-medium hover:bg-blue-50 transition">
                                                Message Renter
                                            </button>
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
                                                            formData.append("uploadType", "Host");
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
                                        {photoSubTab === "pre-rental" && reservation.status === "pending" && (
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-start gap-3">
                                                <span className="text-lg flex-shrink-0">ℹ️</span>
                                                <div>
                                                    <p className="font-semibold text-gray-800 text-sm">{t.preRentalAfterPayment || "Available after renter pays"}</p>
                                                    <p className="text-gray-600 text-xs">{t.preRentalAfterPaymentDesc || "You can upload pre-rental photos once the renter completes payment."}</p>
                                                </div>
                                            </div>
                                        )}
                                        {photoSubTab === "pre-rental" && reservation.status === "accepted" && (
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-3">
                                                <span className="text-lg flex-shrink-0">⏳</span>
                                                <div>
                                                    <p className="font-semibold text-yellow-800 text-sm">{t.preRentalWaitingPayment || "Waiting for renter's payment"}</p>
                                                    <p className="text-yellow-700 text-xs">{t.preRentalWaitingPaymentDesc || "The renter has signed the contract. Once they complete payment, you will be able to upload pre-rental photos."}</p>
                                                </div>
                                            </div>
                                        )}
                                        {photoSubTab === "post-rental" && (
                                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-start gap-3">
                                                <span className="text-lg flex-shrink-0">📸</span>
                                                <div>
                                                    <p className="font-semibold text-orange-800 text-sm">{t.postRentalRenterOnly || "Uploaded by the renter"}</p>
                                                    <p className="text-orange-700 text-xs">{t.postRentalRenterOnlyDesc || "Post-rental photos are taken by the renter on return. You can review them here but cannot upload on their behalf."}</p>
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

                                        {photoSubTab === "post-rental" && checkOutDocs.length > 0 && reservation?.status === "paid" && (
                                            <div className="border-t pt-4 space-y-3">
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                    <p className="text-sm text-blue-800 font-medium">{t.reviewCheckOutPrompt || "Review the check-out photos. If the trailer is in good condition, accept the return to complete the booking."}</p>
                                                </div>
                                                <button onClick={handleAcceptReturn} disabled={updatingStatus} className="w-full p-3 bg-green-600 rounded-lg text-white font-medium hover:bg-green-700 transition disabled:opacity-50">
                                                    {updatingStatus ? "Processing..." : (t.acceptReturn || "Accept Return & Complete Booking")}
                                                </button>
                                            </div>
                                        )}

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
        </div>
    );
};

export default BookingDetailsDrawer;