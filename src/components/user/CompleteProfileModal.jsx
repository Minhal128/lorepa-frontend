import { FaTimes } from 'react-icons/fa';
import { IoIosDocument } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { completeProfileModalTranslations } from '../../pages/User/Dashboard/translation/completeProfileModalTranslations';

const CompleteProfileModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [t, setT] = useState(completeProfileModalTranslations.fr);

    useEffect(() => {
        const updateTranslations = () => {
            const lang = localStorage.getItem('lang') || 'fr';
            setT(completeProfileModalTranslations[lang] || completeProfileModalTranslations.fr);
        };
        updateTranslations();
        window.addEventListener('storage', updateTranslations);
        return () => window.removeEventListener('storage', updateTranslations);
    }, []);

    if (!isOpen) return null;

    const handleGoToProfile = () => {
        navigate('/user/dashboard/profile?tab=documents');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-xl mx-4 transform transition-all">
                {/* Modal Header */}
                <div className="p-5 flex justify-between items-start border-b border-gray-200">
                    <div>
                        <div className='flex items-start gap-x-3 '>
                            <div className='min-w-8 min-h-8 rounded-full bg-[#FEF0C7] text-[#DC6803] flex justify-center items-center'>
                                <IoIosDocument />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{t.title}</h3>
                                <p className="text-sm text-gray-700 mt-1">{t.description}</p>
                            </div>
                        </div>

                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}

                {/* Modal Footer (Actions) */}
                <div className="p-5 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="py-2 px-4 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                    >
                        {t.later}
                    </button>
                    <button
                        onClick={handleGoToProfile}
                        className="py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                    >
                        {t.goToProfile}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompleteProfileModal;