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
import { documentPageTranslations } from '../../User/Dashboard/translation/documentPageTranslations';


const documentTypes = [
    "Contrat de Location",
    "Avenant d'Assurance",
    "Rapport de Dommages",
    "Photos d'Arrivée",
    "Photos de Départ",
];

const DocumentCard = ({ doc, onView, onDownload }) => {
    const getChipStyles = (type) => {
        switch (type) {
            case "Contract":
                return "text-green-600 bg-green-50 border-green-100";
            case "Check-in Photos":
            case "Check-out Photos":
                return "text-purple-600 bg-purple-50 border-purple-100";
            case "Report":
                return "text-red-600 bg-red-50 border-red-100";
            default:
                return "text-gray-600 bg-gray-50 border-gray-100";
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition-all overflow-hidden group">
            <div className="p-6 h-40 bg-gradient-to-br from-blue-500 to-blue-700 relative flex items-center justify-center overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4">
                    <MdOutlineDocumentScanner className="text-9xl text-white" />
                </div>
                <MdOutlineDocumentScanner className="text-white text-5xl relative z-10" />
                <button
                    onClick={() => onDownload(doc.fileUrl, doc.uploadType)}
                    className="absolute top-4 right-4 p-2.5 bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-white/30 transition shadow-sm z-20"
                >
                    <FaDownload className="text-sm" />
                </button>
            </div>
            <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-base font-bold text-gray-900 truncate flex-1">{doc.uploadType}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold border uppercase tracking-wider ${getChipStyles(doc.type)}`}>
                        {doc.documentType}
                    </span>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center text-xs text-gray-500 font-medium">
                        <span className="w-16 shrink-0 font-bold text-gray-400 uppercase tracking-tighter">Trailer</span>
                        <span className="truncate text-gray-900 font-bold">{doc.trailerId?.title}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 font-medium">
                        <span className="w-16 shrink-0 font-bold text-gray-400 uppercase tracking-tighter">Uploaded</span>
                        <span className="text-gray-900 font-bold">{formatReadableDate(doc.createdAt)}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 font-medium">
                        <span className="w-16 shrink-0 font-bold text-gray-400 uppercase tracking-tighter">Status</span>
                        <span className={`font-black uppercase tracking-widest text-[10px] ${getStatusStyles(doc.status)}`}>{doc.trailerId?.status}</span>
                    </div>
                </div>

                <div className='flex items-center gap-2'>
                    <button
                        onClick={() => onView(doc)}
                        className="flex-1 px-4 py-2.5 bg-blue-50 text-blue-600 text-xs font-black rounded-xl hover:bg-blue-600 hover:text-white transition active:scale-[0.98]"
                    >
                        View Document
                    </button>
                    <button
                        onClick={() => onDownload(doc.fileUrl, doc.uploadType)}
                        className="p-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-blue-600 hover:text-white transition"
                    >
                        <HiDownload className='text-lg' />
                    </button>
                </div>
            </div>
        </div>
    );
};


const DocumentModal = ({ isOpen, onClose, document }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
                {/* Modal Header */}
                <div className="p-6 sm:p-8 border-b border-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-xl">
                            <MdOutlineDocumentScanner className="text-blue-600 text-xl" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-gray-900 leading-tight">{document?.documentType}</h3>
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                                Secure Document
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-xl transition text-gray-400">
                        <IoClose className="text-2xl" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-8">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                        <MdOutlineDocumentScanner className="text-gray-300 text-5xl" />
                    </div>
                    <div>
                        <p className="text-gray-900 font-bold mb-2">Secure Document Viewer</p>
                        <p className="text-sm text-gray-500 font-medium max-w-[240px] leading-relaxed">
                            For security purposes, please download the document to view its full content.
                        </p>
                    </div>
                    <button className="w-full flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition active:scale-[0.98]">
                        <HiDownload className="mr-2 text-lg" />
                        Download Document
                    </button>
                </div>
            </div>
        </div >
    );
};

const BuyerDocument = () => {
    const [isViewerModalOpen, setIsViewerModalOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Tous');
    const lang = localStorage.getItem('lang') || 'fr';
    const translations = documentPageTranslations[lang] || documentPageTranslations.fr;
    const [searchTerm, setSearchTerm] = useState('');
    const [trailers, setTrailers] = useState([]);
    const [documentsData, setDocumentData] = useState([])

    const openViewerModal = (doc) => {
        setSelectedDocument(doc);
        setIsViewerModalOpen(true);
    };

    const closeViewerModal = () => {
        setIsViewerModalOpen(false);
        setSelectedDocument(null);
    };
    const openUploadModal = () => {
        setIsUploadModalOpen(true);
    };
    const closeUploadModal = () => {
        setIsUploadModalOpen(false);
    };
    const filteredDocuments = documentsData?.filter(doc => {
        const matchesTab = activeTab === 'Tous' || doc.documentType === activeTab;
        const matchesSearch = doc.documentType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const tabs = ['Tous', 'Contrats', 'Photos d\'arrivée', 'Photos de départ', 'Rapports'];

    const fetchTrailers = async () => {
        try {
            const res = await axios.get(`${config.baseUrl}/trailer/all/approved`);
            let allTrailers = res.data.data || [];
            setTrailers(allTrailers);
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
            fetchDocuments()
        }
    }, [isUploadModalOpen])

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
        <div className="max-w-7xl mx-auto min-h-screen">
            <div className="">
                {/* Header and Add Button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">Mes Documents</h1>
                        <p className="text-gray-500 mt-2 font-medium">Stockage sécurisé pour vos documents de remorque</p>
                    </div>
                    <button
                        onClick={openUploadModal}
                        className="w-full sm:w-auto flex items-center justify-center px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition active:scale-[0.98]"
                    >
                        <FaPlus className="mr-2" />
                        Ajouter un Document
                    </button>
                </div>

                {/* Filtering and Search */}
                <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-6 mb-10">
                    {/* Tab Navigation */}
                    <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100 -mx-4 px-4 sm:mx-0 sm:px-0 gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 px-6 text-sm font-bold whitespace-nowrap transition-all relative ${activeTab === tab
                                    ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Search and Calendar */}
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 sm:min-w-[320px]">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type="text"
                                placeholder="Rechercher par nom de remorque..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition"
                            />
                        </div>
                        <button className='p-3.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-blue-600 transition shadow-sm'>
                            <FaCalendarAlt className="text-lg" />
                        </button>
                    </div>
                </div>

                {/* Document Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredDocuments.length > 0 ? (
                        filteredDocuments.map((doc) => (
                            <DocumentCard key={doc._id} doc={doc} onView={openViewerModal} onDownload={handleDownload} />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-500 py-10">
                            Aucun document ne correspond à vos critères.
                        </p>
                    )}
                </div>

                {/* Document Viewer Modal */}
                <DocumentModal
                    isOpen={isViewerModalOpen}
                    onClose={closeViewerModal}
                    document={selectedDocument}
                />

                {/* NEW: Upload New Document Modal */}
                <UploadNewDocumentModal
                    isOpen={isUploadModalOpen}
                    onClose={closeUploadModal}
                    trailers={trailers}
                    documentTypes={documentTypes}
                    translations={translations}
                />
            </div>
        </div>
    );
};

export default BuyerDocument;