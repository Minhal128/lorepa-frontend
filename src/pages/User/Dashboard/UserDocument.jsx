import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaDownload, FaSearch, FaPlus } from 'react-icons/fa';
import { HiDownload } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { MdOutlineDocumentScanner } from 'react-icons/md';
import config from '../../../config';
import toast from 'react-hot-toast';
import UploadNewDocumentModal from '../../../components/UploadNewDocumentModal';
import { formatReadableDate } from '../../../helpers/function';
import { documentPageTranslations } from './translation/documentPageTranslations';


// --- Document Card Component ---
const DocumentCard = ({ doc, onView, onDownload, translations }) => {
    const getChipStyles = (type) => {
        switch (type) {
            case "Contract":
                return "text-green-600 bg-green-50";
            case "Check-in Photos":
            case "Check-out Photos":
                return "text-purple-600 bg-purple-50";
            case "Report":
                return "text-red-600 bg-red-50";
            default:
                return "text-gray-600 bg-gray-50";
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case "Review":
                return "text-yellow-600";
            case "Expired":
                return "text-red-600";
            case "Completed":
            case "Active":
                return "text-green-600";
            default:
                return "text-gray-600";
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden flex flex-col">
            <div className={`h-32 sm:h-40 bg-gradient-to-br from-blue-500 to-blue-600 p-6 flex items-center justify-center relative`}>
                <MdOutlineDocumentScanner className="text-white/20 text-7xl absolute left-2 bottom-2" />
                <MdOutlineDocumentScanner className="text-white text-5xl relative z-10" />
                <button
                    onClick={() => onDownload(doc.fileUrl, doc.uploadType)}
                    className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition backdrop-blur-sm"
                >
                    <FaDownload className="text-sm" />
                </button>
            </div>
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-gray-900 text-base truncate flex-1 mr-2">{doc.uploadType}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getChipStyles(doc.documentType)}`}>
                        {doc.documentType}
                    </span>
                </div>

                <div className="space-y-1.5 mb-4">
                    <p className="text-xs text-gray-500 flex items-center">
                        <span className='font-bold text-gray-700 mr-1'>{translations.trailer}:</span>
                        <span className="truncate">{doc.trailerId?.title}</span>
                    </p>
                    <p className="text-xs text-gray-500 flex items-center">
                        <span className='font-bold text-gray-700 mr-1'>{translations.uploaded}:</span>
                        <span>{formatReadableDate(doc.createdAt)}</span>
                    </p>
                    <p className="text-xs text-gray-500 flex items-center">
                        <span className='font-bold text-gray-700 mr-1'>{translations.status}:</span>
                        <span className={`font-bold ${getStatusStyles(doc.status)}`}>{doc.trailerId?.status}</span>
                    </p>
                </div>

                <div className='mt-auto flex gap-2'>
                    <button
                        onClick={() => onView(doc)}
                        className="flex-1 px-4 py-2 bg-gray-50 text-[#2563EB] hover:bg-blue-50 text-xs font-bold rounded-xl transition border border-transparent hover:border-blue-100"
                    >
                        {translations.view}
                    </button>
                    <button
                        onClick={() => onDownload(doc.fileUrl, doc.uploadType)}
                        className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition"
                    >
                        <HiDownload className='text-lg' />
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Document Modal Component ---
const DocumentModal = ({ isOpen, onClose, document, translations }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-bold text-gray-900">{document?.documentType}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-green-50 text-green-600 uppercase tracking-wider">
                            Contract
                        </span>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                        <IoClose className="text-xl" />
                    </button>
                </div>
                <div className="p-8 sm:p-12 flex flex-col items-center justify-center space-y-6">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                        <MdOutlineDocumentScanner className="text-gray-300 text-5xl" />
                    </div>
                    <div className="text-center">
                        <p className="text-gray-900 font-bold">{document?.uploadType}</p>
                        <p className="text-gray-500 text-sm mt-1">Secure Document Viewer</p>
                    </div>
                    <button className="flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-md shadow-blue-200">
                        <HiDownload className="mr-2 text-lg" />
                        {translations.download}
                    </button>
                </div>
            </div>
        </div>
    );
};

const documentTypes = [
    "Contrat de Location",
    "Avenant d'Assurance",
    "Rapport de Dommages",
    "Photos d'Arrivée",
    "Photos de Départ",
];
// --- Main Page ---
const UserDocument = () => {
    const [isViewerModalOpen, setIsViewerModalOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [trailers, setTrailers] = useState([]);
    const [documentsData, setDocumentData] = useState([]);
    const [translations, setTranslations] = useState(() => {
        const lang = localStorage.getItem("lang") || "fr";
        return documentPageTranslations[lang] || documentPageTranslations.fr;
    });

    useEffect(() => {
        const handleLangChange = () => {
            const lang = localStorage.getItem("lang") || "fr";
            setTranslations(documentPageTranslations[lang] || documentPageTranslations.fr);
        };

        window.addEventListener("storage", handleLangChange);
        handleLangChange();

        return () => window.removeEventListener("storage", handleLangChange);
    }, []);

    const openViewerModal = (doc) => {
        setSelectedDocument(doc);
        setIsViewerModalOpen(true);
    };

    const closeViewerModal = () => {
        setIsViewerModalOpen(false);
        setSelectedDocument(null);
    };

    const openUploadModal = () => setIsUploadModalOpen(true);
    const closeUploadModal = () => setIsUploadModalOpen(false);

    const filteredDocuments = documentsData.filter(doc => {
        const matchesTab = activeTab === translations.tabs[0] || doc.documentType === activeTab;
        const matchesSearch = doc.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const fetchTrailers = async () => {
        try {
            const res = await axios.get(`${config.baseUrl}/trailer/all/approved`);
            setTrailers(res.data.data || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch trailers.");
        }
    };

    const fetchDocuments = async () => {
        try {
            const userId = localStorage.getItem("userId");
            const res = await axios.get(`${config.baseUrl}/document/user/${userId}`);
            setDocumentData(res.data.data);
        } catch (err) {
            console.log(err);
            toast.error("Failed to fetch documents.");
        }
    };

    useEffect(() => {
        if (!isUploadModalOpen) {
            fetchTrailers();
            fetchDocuments();
        }
    }, [isUploadModalOpen]);

    const handleDownload = (fileUrl, fileName) => {
        if (!fileUrl) {
            toast.error("File not found");
            return;
        }
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = fileName || "document";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Download started");
    };

    return (
        <div className="min-h-screen px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">{translations.myDocuments}</h1>
                <button
                    onClick={openUploadModal}
                    className="flex items-center px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-blue-700 transition w-full sm:w-auto justify-center"
                >
                    <FaPlus className="mr-2" />
                    {translations.addNewDocument}
                </button>
            </div>

            {/* Tabs & Search */}
            <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center mb-8 gap-6">
                {/* Tabs */}
                <div className="flex overflow-x-auto pb-1 scrollbar-hide border-b border-gray-100 lg:border-none">
                    <div className="flex gap-2">
                        {translations.tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 text-sm font-bold whitespace-nowrap rounded-xl transition-all duration-200 ${activeTab === tab
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex items-center gap-3">
                    <div className="relative flex-1 sm:w-64">
                        <FaSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            type="text"
                            placeholder={translations.searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all outline-none"
                        />
                    </div>
                    <button className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 hover:text-blue-600 transition">
                        <FaCalendarAlt className="text-lg" />
                    </button>
                </div>
            </div>

            {/* Documents Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc) => (
                        <DocumentCard
                            key={doc._id}
                            doc={doc}
                            onView={openViewerModal}
                            onDownload={handleDownload}
                            translations={translations}
                        />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500 py-10">
                        {translations.noDocumentsFound}
                    </p>
                )}
            </div>

            {/* Modals */}
            <DocumentModal
                isOpen={isViewerModalOpen}
                onClose={closeViewerModal}
                document={selectedDocument}
                translations={translations}
            />

            <UploadNewDocumentModal
                isOpen={isUploadModalOpen}
                onClose={closeUploadModal}
                trailers={trailers}
                documentTypes={documentTypes}
                translations={translations}
            />
        </div>

    );
};

export default UserDocument;
