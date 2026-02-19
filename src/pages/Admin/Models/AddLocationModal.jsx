import React, { useState } from 'react';
import { adminTranslations } from '../translation/adminTranslations';

const AddLocationModal = ({type, onClose, onSave }) => {
    const [locationName, setLocationName] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const lang = localStorage.getItem("lang") || "fr";
    const t = adminTranslations[lang] || adminTranslations.fr;

    const isCategory = type === "Category";
    const modalTitle = isCategory ? t.addCategoryTitle : t.addLocationTitle;
    const nameLabel = isCategory ? t.nameOfCategory : t.nameOfLocation;
    const namePlaceholder = isCategory ? t.categoryPlaceholder : t.locationPlaceholder;

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            console.log("Selected image:", file.name);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Saving location:', { locationName, imageFile });
        if (onSave) {
            onSave({ locationName, imageFile });
        }
        if (onClose) {
            onClose();
        }
    };

    return (

        <div className='fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50'>
            {/* Modal Content */}
            <div className='bg-white rounded-lg shadow-xl w-full max-w-md relative p-6 sm:p-8'>
                {/* Modal Header */}
                <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-xl text-gray-900'>{modalTitle}</h2>
                    {/* Close button (X icon) */}
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-gray-600 focus:outline-none'
                        aria-label='Close'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className='h-6 w-6' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleSubmit} className='space-y-6'>
                    {/* Name Input */}
                    <div>
                        <label htmlFor='locationName' className='block text-sm  text-gray-700 mb-1'>
                            {nameLabel}
                        </label>
                        <input
                            type='text'
                            id='locationName'
                            name='locationName'
                            value={locationName}
                            onChange={(e) => setLocationName(e.target.value)}
                            placeholder={namePlaceholder}
                            required
                            className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                        />
                    </div>

                    {/* Image Upload Area */}
                    <div>
                        <label className='block text-sm  text-gray-700 mb-1'>
                            {t.imageLabel}
                        </label>
                        <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-400'>
                            <div className='space-y-1 text-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" className='mx-auto h-12 w-12 text-gray-400' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div className='flex text-sm text-gray-600'>
                                    <label
                                        htmlFor='file-upload'
                                        className='relative cursor-pointer bg-white rounded-md  text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500'
                                    >
                                        <span>{t.uploadImage}</span>
                                        <input
                                            id='file-upload'
                                            name='file-upload'
                                            type='file'
                                            className='sr-only'
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                        />
                                    </label>
                                    <p className='pl-1'>{t.orDragAndDrop}</p>
                                </div>
                                <p className='text-xs text-gray-500'>{t.imageConstraints}</p>
                                {imageFile && (
                                    <p className='text-sm text-gray-700 mt-2'>{t.selectedFile} {imageFile.name}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div>
                        <button
                            type='submit'
                            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm  text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        >
                            {t.save}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddLocationModal;
