const VerificationModal = ({ isOpen, onClose, onListTrailer,translations}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 relative w-96">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                >
                    &times;
                </button>

                <div className="flex flex-col items-center justify-center space-y-6">
                    {/* Checkmark Icon */}
                    <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="white"
                            className="w-12 h-12"
                        >
                            <path
                                fillRule="evenodd"
                                d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9.75 10.5a.75.75 0 0 1-1.12.02L3.248 10.37a.75.75 0 1 1 1.06-1.06l5.25 5.25 9.25-9.998a.75.75 0 0 1 1.04-.208Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800">{translations.title}</h3>

                    <div className="flex space-x-4 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md transition duration-200"
                        >
                            {translations.close}
                        </button>
                        <button
                            onClick={onListTrailer}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200 truncate"
                        >
                            {translations.listTrailer}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerificationModal