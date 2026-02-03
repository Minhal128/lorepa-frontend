import { FaTimes } from 'react-icons/fa';
import { IoIosDocument } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const CompleteProfileModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleGoToProfile = () => {
        navigate('/seller/dashboard/profile');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-xl mx-4 transform transition-all">
                {/* Modal Header */}
                <div className="p-5 flex justify-between items-start border-b border-gray-200">
                    <div>
                        <div className='flex items-start gap-x-3 '>
                            <div className='min-w-8 min-h-8 rounded-full bg-[#FEF0C7] text-[#DC6803] flex justify-center items-center'>
                                <IoIosDocument />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Complete Your Profile to Start Booking</h3>
                                <p className="text-sm text-gray-700 mt-1">Before you can make your first reservation, please upload your required documents. This helps us verify your identity and keep the community safe.</p>
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
                        Later
                    </button>
                    <button
                        onClick={handleGoToProfile}
                        className="py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                    >
                        Go To Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompleteProfileModal;