import React, { useState, useEffect } from 'react';
import { CiFileOn } from "react-icons/ci";
// Removed mock imports as data will now be fetched from API
import axios from 'axios';
import config from '../../../config';
import toast from 'react-hot-toast';

const AdminSettingsPage = () => {
    const [faqTab, setFaqTab] = useState('guest'); // Changed to 'guest' to match backend type
    const [activeSetting, setActiveSetting] = useState('Trusted by section');

    // State for API data
    const [trustedByImages, setTrustedByImages] = useState([]);
    const [popularLocations, setPopularLocations] = useState([]);
    const [trailerCategories, setTrailerCategories] = useState([]);
    const [faqs, setFaqs] = useState({ guest: [], host: [] }); // Changed to 'guest', 'host'
    const [securityDeposits, setSecurityDeposits] = useState([]);
    const [ownerCategories, setOwnerCategories] = useState([]);
    const [trailerTitleStatus, setTrailerTitleStatus] = useState([]);
    const [hitchTypes, setHitchTypes] = useState([]);
    const [ballSizes, setBallSizes] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Modal visibility states for creation/editing
    const [isTrustedByModalOpen, setIsTrustedByModalOpen] = useState(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
    const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
    const [isSecurityDepositModalOpen, setIsSecurityDepositModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isTrailerStatusModalOpen, setIsTrailerStatusModalOpen] = useState(false);
    const [isHitchTypeModalOpen, setIsHitchTypeModalOpen] = useState(false);
    const [isBallSizeModalOpen, setIsBallSizeModalOpen] = useState(false);

    // Input states for creation forms
    const [newTrustedByImage, setNewTrustedByImage] = useState(null);
    const [newLocationTitle, setNewLocationTitle] = useState('');
    const [newLocationImage, setNewLocationImage] = useState(null);
    const [newTrailerCategoryTitle, setNewTrailerCategoryTitle] = useState('');
    const [newTrailerCategoryImage, setNewTrailerCategoryImage] = useState(null);
    const [newFaqQuestion, setNewFaqQuestion] = useState('');
    const [newFaqAnswer, setNewFaqAnswer] = useState('');
    const [newFaqType, setNewFaqType] = useState('guest'); // Changed to 'guest'
    const [newSecurityDepositTitle, setNewSecurityDepositTitle] = useState('');
    const [newSecurityDepositAmount, setNewSecurityDepositAmount] = useState('');
    const [newCategoryTitle, setNewCategoryTitle] = useState('');
    const [newTrailerStatusTitle, setNewTrailerStatusTitle] = useState('');
    const [newHitchTypeTitle, setNewHitchTypeTitle] = useState('');
    const [newBallSizeTitle, setNewBallSizeTitle] = useState('');

    // State for editing items
    const [editingItem, setEditingItem] = useState(null); // Stores the item being edited

    const API_BASE_URL = config.baseUrl;

    // Generic fetch function
    const fetchData = async (endpoint, setData, transformData = null) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/content/${endpoint}`);
            if (transformData) {
                setData(transformData(response.data.data));
            } else {
                setData(response.data.data);
            }
        } catch (err) {
            console.error(`Error fetching ${endpoint}:`, err);
            setError(`Failed to fetch ${endpoint}.`);
            toast.error(`Failed to fetch ${endpoint}.`);
        } finally {
            setLoading(false);
        }
    };

    // Generic delete function
    const handleDelete = async (endpoint, id, fetchDataCallback) => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            return;
        }
        try {
            await axios.delete(`${API_BASE_URL}/content/${endpoint}/${id}`);
            toast.success('Item deleted successfully!');
            fetchDataCallback();
        } catch (err) {
            console.error(`Error deleting ${endpoint}:`, err);
            toast.error(`Failed to delete item.`);
        }
    };

    // Generic update function (for simple title updates)
    const handleUpdate = async (endpoint, id, payload, fetchDataCallback, closeModalCallback) => {
        setLoading(true);
        try {
            await axios.put(`${API_BASE_URL}/content/${endpoint}/${id}`, payload);
            toast.success('Item updated successfully!');
            closeModalCallback();
            setEditingItem(null); // Clear editing item after update
            fetchDataCallback();
        } catch (err) {
            console.error(`Error updating ${endpoint}:`, err);
            toast.error(`Failed to update item.`);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        switch (activeSetting) {
            case 'Trusted by section':
                fetchData('trusted', setTrustedByImages);
                break;
            case 'Popular location section':
                fetchData('locations', setPopularLocations);
                break;
            case 'Trailers by category section':
                fetchData('trailers', setTrailerCategories);
                break;
            case 'FAQ':
                fetchData('faq', setFaqs, (data) => {
                    const guestFaqs = data.filter(faq => faq.type === 'guest');
                    const hostFaqs = data.filter(faq => faq.type === 'host');
                    return { guest: guestFaqs, host: hostFaqs };
                });
                break;
            case 'Security Deposit':
                fetchData('security-deposits', setSecurityDeposits);
                break;
            case 'Category':
                fetchData('categories', setOwnerCategories);
                break;
            case 'Trailer title status':
                fetchData('trailer-statuses', setTrailerTitleStatus);
                break;
            case 'Hitch type':
                fetchData('hitch-types', setHitchTypes);
                break;
            case 'Ball size':
                fetchData('ball-sizes', setBallSizes);
                break;
            default:
                break;
        }
    }, [activeSetting, API_BASE_URL]);

    // Handlers for creating new items
    const handleCreateTrustedBy = async (e) => {
        e.preventDefault();
        if (!newTrustedByImage) {
            toast.error('Please select an image.');
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append('image', newTrustedByImage);
        try {
            await axios.post(`${API_BASE_URL}/content/trusted`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Trusted By item added successfully!');
            setIsTrustedByModalOpen(false);
            setNewTrustedByImage(null);
            fetchData('trusted', setTrustedByImages);
        } catch (err) {
            console.error('Error creating trusted by item:', err);
            toast.error('Failed to add trusted by item.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateLocation = async (e) => {
        e.preventDefault();
        if (!newLocationTitle || !newLocationImage) {
            toast.error('Please enter a title and select an image.');
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append('title', newLocationTitle);
        formData.append('image', newLocationImage);
        try {
            await axios.post(`${API_BASE_URL}/content/locations`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Popular location added successfully!');
            setIsLocationModalOpen(false);
            setNewLocationTitle('');
            setNewLocationImage(null);
            fetchData('locations', setPopularLocations);
        } catch (err) {
            console.error('Error creating location:', err);
            toast.error('Failed to add popular location.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTrailerCategory = async (e) => {
        e.preventDefault();
        if (!newTrailerCategoryTitle || !newTrailerCategoryImage) {
            toast.error('Please enter a title and select an image.');
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append('title', newTrailerCategoryTitle);
        formData.append('image', newTrailerCategoryImage);
        try {
            await axios.post(`${API_BASE_URL}/content/trailers`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Trailer category added successfully!');
            setIsTrailerModalOpen(false);
            setNewTrailerCategoryTitle('');
            setNewTrailerCategoryImage(null);
            fetchData('trailers', setTrailerCategories);
        } catch (err) {
            console.error('Error creating trailer category:', err);
            toast.error('Failed to add trailer category.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateFaq = async (e) => {
        e.preventDefault();
        if (!newFaqQuestion || !newFaqAnswer || !newFaqType) {
            toast.error('Please fill in all FAQ fields.');
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/content/faq`, {
                question: newFaqQuestion,
                answer: newFaqAnswer,
                type: newFaqType,
            });
            toast.success('FAQ added successfully!');
            setIsFaqModalOpen(false);
            setNewFaqQuestion('');
            setNewFaqAnswer('');
            setNewFaqType('guest');
            fetchData('faq', setFaqs, (data) => {
                const guestFaqs = data.filter(item => item.type === 'guest');
                const hostFaqs = data.filter(item => item.type === 'host');
                return { guest: guestFaqs, host: hostFaqs };
            });
        } catch (err) {
            console.error('Error creating FAQ:', err);
            toast.error('Failed to add FAQ.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSecurityDeposit = async (e) => {
        e.preventDefault();
        if (!newSecurityDepositTitle || !newSecurityDepositAmount) {
            toast.error('Please fill in all fields.');
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/content/security-deposits`, {
                title: newSecurityDepositTitle,
                amount: newSecurityDepositAmount,
            });
            toast.success('Security Deposit added successfully!');
            setIsSecurityDepositModalOpen(false);
            setNewSecurityDepositTitle('');
            setNewSecurityDepositAmount('');
            fetchData('security-deposits', setSecurityDeposits);
        } catch (err) {
            console.error('Error creating security deposit:', err);
            toast.error('Failed to add security deposit.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryTitle) {
            toast.error('Please enter a title.');
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/content/categories`, { title: newCategoryTitle });
            toast.success('Category added successfully!');
            setIsCategoryModalOpen(false);
            setNewCategoryTitle('');
            fetchData('categories', setOwnerCategories);
        } catch (err) {
            console.error('Error creating category:', err);
            toast.error('Failed to add category.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTrailerStatus = async (e) => {
        e.preventDefault();
        if (!newTrailerStatusTitle) {
            toast.error('Please enter a title.');
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/content/trailer-statuses`, { title: newTrailerStatusTitle });
            toast.success('Trailer Status added successfully!');
            setIsTrailerStatusModalOpen(false);
            setNewTrailerStatusTitle('');
            fetchData('trailer-statuses', setTrailerTitleStatus);
        } catch (err) {
            console.error('Error creating trailer status:', err);
            toast.error('Failed to add trailer status.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateHitchType = async (e) => {
        e.preventDefault();
        if (!newHitchTypeTitle) {
            toast.error('Please enter a title.');
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/content/hitch-types`, { title: newHitchTypeTitle });
            toast.success('Hitch Type added successfully!');
            setIsHitchTypeModalOpen(false);
            setNewHitchTypeTitle('');
            fetchData('hitch-types', setHitchTypes);
        } catch (err) {
            console.error('Error creating hitch type:', err);
            toast.error('Failed to add hitch type.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBallSize = async (e) => {
        e.preventDefault();
        if (!newBallSizeTitle) {
            toast.error('Please enter a size.');
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/content/ball-sizes`, { title: newBallSizeTitle });
            toast.success('Ball Size added successfully!');
            setIsBallSizeModalOpen(false);
            setNewBallSizeTitle('');
            fetchData('ball-sizes', setBallSizes);
        } catch (err) {
            console.error('Error creating ball size:', err);
            toast.error('Failed to add ball size.');
        } finally {
            setLoading(false);
        }
    };

    // Handlers for updating existing items
    const handleEditClick = (item, modalSetter) => {
        setEditingItem(item);
        modalSetter(true);
        // Pre-populate specific edit states based on item type
        if (activeSetting === 'Security Deposit') {
            setNewSecurityDepositTitle(item.title);
            setNewSecurityDepositAmount(item.amount);
        } else if (activeSetting === 'Category') {
            setNewCategoryTitle(item.title);
        } else if (activeSetting === 'Trailer title status') {
            setNewTrailerStatusTitle(item.title);
        } else if (activeSetting === 'Hitch type') {
            setNewHitchTypeTitle(item.title);
        } else if (activeSetting === 'Ball size') {
            setNewBallSizeTitle(item.title);
        } else if (activeSetting === 'FAQ') {
            setNewFaqQuestion(item.question);
            setNewFaqAnswer(item.answer);
            setNewFaqType(item.type);
        }
        // For image-based items, you might not pre-populate image input directly
    };

    const handleUpdateSecurityDeposit = async (e) => {
        e.preventDefault();
        if (!newSecurityDepositTitle || !newSecurityDepositAmount || !editingItem?._id) {
            toast.error('Invalid data for update.');
            return;
        }
        handleUpdate(
            'security-deposits',
            editingItem._id,
            { title: newSecurityDepositTitle, amount: newSecurityDepositAmount },
            () => fetchData('security-deposits', setSecurityDeposits),
            () => setIsSecurityDepositModalOpen(false) // Close the creation modal, repurposing for edit
        );
    };

    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryTitle || !editingItem?._id) {
            toast.error('Invalid data for update.');
            return;
        }
        handleUpdate(
            'categories',
            editingItem._id,
            { title: newCategoryTitle },
            () => fetchData('categories', setOwnerCategories),
            () => setIsCategoryModalOpen(false)
        );
    };

    const handleUpdateTrailerStatus = async (e) => {
        e.preventDefault();
        if (!newTrailerStatusTitle || !editingItem?._id) {
            toast.error('Invalid data for update.');
            return;
        }
        handleUpdate(
            'trailer-statuses',
            editingItem._id,
            { title: newTrailerStatusTitle },
            () => fetchData('trailer-statuses', setTrailerTitleStatus),
            () => setIsTrailerStatusModalOpen(false)
        );
    };

    const handleUpdateHitchType = async (e) => {
        e.preventDefault();
        if (!newHitchTypeTitle || !editingItem?._id) {
            toast.error('Invalid data for update.');
            return;
        }
        handleUpdate(
            'hitch-types',
            editingItem._id,
            { title: newHitchTypeTitle },
            () => fetchData('hitch-types', setHitchTypes),
            () => setIsHitchTypeModalOpen(false)
        );
    };

    const handleUpdateBallSize = async (e) => {
        e.preventDefault();
        if (!newBallSizeTitle || !editingItem?._id) {
            toast.error('Invalid data for update.');
            return;
        }
        handleUpdate(
            'ball-sizes',
            editingItem._id,
            { title: newBallSizeTitle },
            () => fetchData('ball-sizes', setBallSizes),
            () => setIsBallSizeModalOpen(false)
        );
    };

    const handleUpdateFaq = async (e) => {
        e.preventDefault();
        if (!newFaqQuestion || !newFaqAnswer || !newFaqType || !editingItem?._id) {
            toast.error('Invalid data for update.');
            return;
        }
        handleUpdate(
            'faq',
            editingItem._id,
            { question: newFaqQuestion, answer: newFaqAnswer, type: newFaqType },
            () => fetchData('faq', setFaqs, (data) => {
                const guestFaqs = data.filter(item => item.type === 'guest');
                const hostFaqs = data.filter(item => item.type === 'host');
                return { guest: guestFaqs, host: hostFaqs };
            }),
            () => setIsFaqModalOpen(false)
        );
    };


    const renderContent = () => {
        if (loading) {
            return <div className='text-center py-8 text-gray-600'>Loading...</div>;
        }

        if (error) {
            return <div className='text-center py-8 text-red-600'>{error}</div>;
        }

        switch (activeSetting) {
            case 'Trusted by section':
                return (
                    <div>
                        <div className='flex justify-between items-center mb-6 flex-wrap'>
                            <h2 className='text-2xl font-semibold text-gray-800'>Trusted by section</h2>
                            <button
                                onClick={() => { setEditingItem(null); setIsTrustedByModalOpen(true); }}
                                className='px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 text-sm font-medium'>
                                Add new
                            </button>
                        </div>
                        <div className='space-y-4'>
                            {trustedByImages.map((item) => (
                                <div key={item._id} className='flex items-center justify-between p-4 border border-gray-200 rounded-md bg-white'>
                                    <div className='flex items-center space-x-4'>
                                        <img src={item.image} alt="Logo" className='w-16 h-16 rounded-md object-cover' />
                                    </div>
                                    <div className='flex space-x-3'>
                                        <button onClick={() => handleDelete('trusted', item._id, () => fetchData('trusted', setTrustedByImages))} className='text-red-600 hover:text-red-800 text-sm font-medium'>Delete</button>
                                    </div>
                                </div>
                            ))}
                            {trustedByImages.length === 0 && !loading && <p className='text-gray-600'>No trusted by images found.</p>}
                        </div>

                        {isTrustedByModalOpen && (
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                                <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                                    <h3 className="text-xl font-semibold mb-4">{editingItem ? 'Edit Trusted By Image' : 'Add Trusted By Image'}</h3>
                                    <form onSubmit={editingItem ? null : handleCreateTrustedBy}> {/* No edit for image only */}
                                        <div className="mb-4">
                                            <label htmlFor="trustedByImage" className="block text-gray-700 text-sm font-bold mb-2">Image:</label>
                                            <input
                                                type="file"
                                                id="trustedByImage"
                                                accept="image/*"
                                                onChange={(e) => setNewTrustedByImage(e.target.files[0])}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required={!editingItem} // Required only for creation
                                            />
                                        </div>
                                        {editingItem && (
                                            <div className="mb-4">
                                                <p className="text-sm text-gray-600">Current Image:</p>
                                                <img src={editingItem.image} alt="Current" className="w-24 h-24 object-cover mt-2 rounded" />
                                            </div>
                                        )}
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => { setIsTrustedByModalOpen(false); setEditingItem(null); }}
                                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-400"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                                disabled={editingItem} // Disable submit if editing, as image update is complex
                                            >
                                                {editingItem ? 'Update (Image change not supported here)' : 'Add'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'Popular location section':
                return (
                    <div>
                        <div className='flex items-center justify-between flex-wrap'>
                            <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Popular location</h2>
                            <button
                                onClick={() => { setEditingItem(null); setIsLocationModalOpen(true); setNewLocationTitle(''); setNewLocationImage(null); }}
                                className='px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 text-sm font-medium'>
                                Add new
                            </button>
                        </div>

                        <div className='flex justify-start items-start flex-wrap -mx-2'>
                            {
                                popularLocations.map((item) => (
                                    <div key={item._id} className='w-1/2 sm:w-1/3 lg:w-1/4 p-2 my-3'>
                                        <img className='w-full h-[267px] rounded-md object-cover' src={item.image} alt={item.title} onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/223x267/CCCCCC/666666?text=Image+Unavailable"; }} />
                                        <p className='mt-3 text-gray-800 font-medium'>{item.title}</p>
                                        <div className='flex space-x-3'>
                                            {/* Edit functionality not directly provided for image uploads */}
                                            <button onClick={() => handleDelete('locations', item._id, () => fetchData('locations', setPopularLocations))} className='text-red-600 hover:text-red-800 text-sm font-medium'>Delete</button>
                                        </div>
                                    </div>
                                ))
                            }
                            {popularLocations.length === 0 && !loading && <p className='text-gray-600'>No popular locations found.</p>}
                        </div>

                        {isLocationModalOpen && (
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                                <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                                    <h3 className="text-xl font-semibold mb-4">{editingItem ? 'Edit Popular Location' : 'Add Popular Location'}</h3>
                                    <form onSubmit={editingItem ? null : handleCreateLocation}> {/* Edit for image based items usually handled differently, simplifying */}
                                        <div className="mb-4">
                                            <label htmlFor="locationTitle" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
                                            <input
                                                type="text"
                                                id="locationTitle"
                                                value={newLocationTitle}
                                                onChange={(e) => setNewLocationTitle(e.target.value)}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="locationImage" className="block text-gray-700 text-sm font-bold mb-2">Image:</label>
                                            <input
                                                type="file"
                                                id="locationImage"
                                                accept="image/*"
                                                onChange={(e) => setNewLocationImage(e.target.files[0])}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required={!editingItem}
                                            />
                                        </div>
                                        {editingItem && (
                                            <div className="mb-4">
                                                <p className="text-sm text-gray-600">Current Image:</p>
                                                <img src={editingItem.image} alt="Current" className="w-24 h-24 object-cover mt-2 rounded" />
                                            </div>
                                        )}
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => { setIsLocationModalOpen(false); setEditingItem(null); }}
                                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-400"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                                disabled={editingItem} // Disable submit if editing for simplicity
                                            >
                                                {editingItem ? 'Update (Image change not supported here)' : 'Add'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'Trailers by category section':
                return (
                    <div>
                        <div className='flex items-center justify-between flex-wrap'>
                            <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Trailers by category</h2>
                            <button onClick={() => { setEditingItem(null); setIsTrailerModalOpen(true); setNewTrailerCategoryTitle(''); setNewTrailerCategoryImage(null); }} className='px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 text-sm font-medium'> Add new </button>
                        </div>

                        <div className='flex justify-start items-start flex-wrap -mx-2'>
                            {
                                trailerCategories.map((item) => (
                                    <div key={item._id} className='w-1/2 sm:w-1/3 lg:w-1/4 p-2 my-3'>
                                        <img className='w-full h-[267px] rounded-md object-cover' src={item.image} alt={item.title} onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/223x267/CCCCCC/666666?text=Image+Unavailable"; }} />
                                        <p className='mt-3 text-gray-800 font-medium'>{item.title}</p>
                                        <div className='flex space-x-3'>
                                            {/* Edit functionality not directly provided for image uploads */}
                                            <button onClick={() => handleDelete('trailers', item._id, () => fetchData('trailers', setTrailerCategories))} className='text-red-600 hover:text-red-800 text-sm font-medium'>Delete</button>
                                        </div>
                                    </div>
                                ))
                            }
                            {trailerCategories.length === 0 && !loading && <p className='text-gray-600'>No trailer categories found.</p>}
                        </div>

                        {isTrailerModalOpen && (
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                                <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                                    <h3 className="text-xl font-semibold mb-4">{editingItem ? 'Edit Trailer Category' : 'Add Trailer Category'}</h3>
                                    <form onSubmit={editingItem ? null : handleCreateTrailerCategory}>
                                        <div className="mb-4">
                                            <label htmlFor="trailerCategoryTitle" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
                                            <input
                                                type="text"
                                                id="trailerCategoryTitle"
                                                value={newTrailerCategoryTitle}
                                                onChange={(e) => setNewTrailerCategoryTitle(e.target.value)}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="trailerCategoryImage" className="block text-gray-700 text-sm font-bold mb-2">Image:</label>
                                            <input
                                                type="file"
                                                id="trailerCategoryImage"
                                                accept="image/*"
                                                onChange={(e) => setNewTrailerCategoryImage(e.target.files[0])}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required={!editingItem}
                                            />
                                        </div>
                                        {editingItem && (
                                            <div className="mb-4">
                                                <p className="text-sm text-gray-600">Current Image:</p>
                                                <img src={editingItem.image} alt="Current" className="w-24 h-24 object-cover mt-2 rounded" />
                                            </div>
                                        )}
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => { setIsTrailerModalOpen(false); setEditingItem(null); }}
                                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-400"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                                disabled={editingItem}
                                            >
                                                {editingItem ? 'Update (Image change not supported here)' : 'Add'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'FAQ':
                return (
                    <div>
                        <div className='flex justify-between items-center mb-6 flex-wrap'>
                            <h2 className='text-2xl font-semibold text-gray-800'>Frequently asked questions</h2>
                            <button
                                onClick={() => { setEditingItem(null); setIsFaqModalOpen(true); setNewFaqQuestion(''); setNewFaqAnswer(''); setNewFaqType('guest'); }}
                                className='px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 text-sm font-medium'>
                                Add new
                            </button>
                        </div>

                        <div className='flex mb-6 border-b border-gray-200'>
                            <button onClick={() => setFaqTab('guest')} className={`py-2 px-4 text-md font-medium rounded-t-lg ${faqTab === 'guest' ? 'bg-gray-100 text-gray-900 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>Guests</button>
                            <button onClick={() => setFaqTab('host')} className={`py-2 px-4 text-md font-medium rounded-t-lg ${faqTab === 'host' ? 'bg-gray-100 text-gray-900 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>Hosts</button>
                        </div>

                        <div className='space-y-6'>
                            {faqs[faqTab].map((faq) => (
                                <div key={faq._id} className='p-4 border border-gray-200 rounded-lg bg-white shadow-sm'>
                                    <div className='flex justify-between items-start mb-2'>
                                        <h3 className='text-lg font-semibold text-gray-900'>{faq.question}</h3>
                                        <div className='flex space-x-3 text-sm'>
                                            <button
                                                onClick={() => handleEditClick(faq, setIsFaqModalOpen)}
                                                className='text-blue-600 hover:text-blue-800 font-medium'>Edit</button>
                                            <button
                                                className='text-red-600 hover:text-red-800 font-medium'
                                                onClick={() => handleDelete('faq', faq._id, () => fetchData('faq', setFaqs, (data) => {
                                                    const guestFaqs = data.filter(item => item.type === 'guest');
                                                    const hostFaqs = data.filter(item => item.type === 'host');
                                                    return { guest: guestFaqs, host: hostFaqs };
                                                }))}
                                            >Delete</button>
                                        </div>
                                    </div>
                                    <p className='text-gray-700 text-sm'>{faq.answer}</p>
                                </div>
                            ))}
                            {faqs[faqTab].length === 0 && !loading && <p className='text-gray-600'>No FAQs found for {faqTab}.</p>}
                        </div>

                        {isFaqModalOpen && (
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                                <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                                    <h3 className="text-xl font-semibold mb-4">{editingItem ? 'Edit FAQ' : 'Add New FAQ'}</h3>
                                    <form onSubmit={editingItem ? handleUpdateFaq : handleCreateFaq}>
                                        <div className="mb-4">
                                            <label htmlFor="faqQuestion" className="block text-gray-700 text-sm font-bold mb-2">Question:</label>
                                            <input
                                                type="text"
                                                id="faqQuestion"
                                                value={newFaqQuestion}
                                                onChange={(e) => setNewFaqQuestion(e.target.value)}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="faqAnswer" className="block text-gray-700 text-sm font-bold mb-2">Answer:</label>
                                            <textarea
                                                id="faqAnswer"
                                                value={newFaqAnswer}
                                                onChange={(e) => setNewFaqAnswer(e.target.value)}
                                                rows="3"
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="faqType" className="block text-gray-700 text-sm font-bold mb-2">Type:</label>
                                            <select
                                                id="faqType"
                                                value={newFaqType}
                                                onChange={(e) => setNewFaqType(e.target.value)}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            >
                                                <option value="guest">guest</option>
                                                <option value="host">host</option>
                                            </select>
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => { setIsFaqModalOpen(false); setEditingItem(null); }}
                                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-400"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                            >
                                                {editingItem ? 'Update FAQ' : 'Add FAQ'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'Security Deposit':
                return (
                    <div>
                        <div className='flex justify-between items-center mb-6 flex-wrap'>
                            <h2 className='text-2xl font-semibold text-gray-800'>Security Deposits</h2>
                            <button
                                onClick={() => { setEditingItem(null); setIsSecurityDepositModalOpen(true); setNewSecurityDepositTitle(''); setNewSecurityDepositAmount(''); }}
                                className='px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 text-sm font-medium'>
                                Add new
                            </button>
                        </div>
                        <div className='space-y-4'>
                            {securityDeposits.map((item) => (
                                <div key={item._id} className='flex items-center justify-between p-4 border border-gray-200 rounded-md bg-white'>
                                    <div className='flex-grow'>
                                        <h3 className='text-lg font-semibold text-gray-900'>{item.title}</h3>
                                        <p className='text-gray-700'>Amount: ${item.amount}</p>
                                    </div>
                                    <div className='flex space-x-3 text-sm'>
                                        <button
                                            onClick={() => handleEditClick(item, setIsSecurityDepositModalOpen)}
                                            className='text-blue-600 hover:text-blue-800 font-medium'>Edit</button>
                                        <button
                                            onClick={() => handleDelete('security-deposits', item._id, () => fetchData('security-deposits', setSecurityDeposits))}
                                            className='text-red-600 hover:text-red-800 font-medium'>Delete</button>
                                    </div>
                                </div>
                            ))}
                            {securityDeposits.length === 0 && !loading && <p className='text-gray-600'>No security deposits found.</p>}
                        </div>

                        {isSecurityDepositModalOpen && (
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                                <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                                    <h3 className="text-xl font-semibold mb-4">{editingItem ? 'Edit Security Deposit' : 'Add New Security Deposit'}</h3>
                                    <form onSubmit={editingItem ? handleUpdateSecurityDeposit : handleCreateSecurityDeposit}>
                                        <div className="mb-4">
                                            <label htmlFor="sdTitle" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
                                            <input
                                                type="text"
                                                id="sdTitle"
                                                value={newSecurityDepositTitle}
                                                onChange={(e) => setNewSecurityDepositTitle(e.target.value)}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="sdAmount" className="block text-gray-700 text-sm font-bold mb-2">Amount:</label>
                                            <input
                                                type="number"
                                                id="sdAmount"
                                                value={newSecurityDepositAmount}
                                                onChange={(e) => setNewSecurityDepositAmount(e.target.value)}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => { setIsSecurityDepositModalOpen(false); setEditingItem(null); }}
                                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-400"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                            >
                                                {editingItem ? 'Update Security Deposit' : 'Add Security Deposit'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'Category':
                return (
                    <div>
                        <div className='flex justify-between items-center mb-6 flex-wrap'>
                            <h2 className='text-2xl font-semibold text-gray-800'>Categories</h2>
                            <button
                                onClick={() => { setEditingItem(null); setIsCategoryModalOpen(true); setNewCategoryTitle(''); }}
                                className='px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 text-sm font-medium'>
                                Add new
                            </button>
                        </div>
                        <div className='space-y-4'>
                            {ownerCategories.map((item) => (
                                <div key={item._id} className='flex items-center justify-between p-4 border border-gray-200 rounded-md bg-white'>
                                    <h3 className='text-lg font-semibold text-gray-900'>{item.title}</h3>
                                    <div className='flex space-x-3 text-sm'>
                                        <button
                                            onClick={() => handleEditClick(item, setIsCategoryModalOpen)}
                                            className='text-blue-600 hover:text-blue-800 font-medium'>Edit</button>
                                        <button
                                            onClick={() => handleDelete('categories', item._id, () => fetchData('categories', setOwnerCategories))}
                                            className='text-red-600 hover:text-red-800 font-medium'>Delete</button>
                                    </div>
                                </div>
                            ))}
                            {ownerCategories.length === 0 && !loading && <p className='text-gray-600'>No categories found.</p>}
                        </div>

                        {isCategoryModalOpen && (
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                                <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                                    <h3 className="text-xl font-semibold mb-4">{editingItem ? 'Edit Category' : 'Add New Category'}</h3>
                                    <form onSubmit={editingItem ? handleUpdateCategory : handleCreateCategory}>
                                        <div className="mb-4">
                                            <label htmlFor="categoryTitle" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
                                            <input
                                                type="text"
                                                id="categoryTitle"
                                                value={newCategoryTitle}
                                                onChange={(e) => setNewCategoryTitle(e.target.value)}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => { setIsCategoryModalOpen(false); setEditingItem(null); }}
                                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-400"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                            >
                                                {editingItem ? 'Update Category' : 'Add Category'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'Trailer title status':
                return (
                    <div>
                        <div className='flex justify-between items-center mb-6 flex-wrap'>
                            <h2 className='text-2xl font-semibold text-gray-800'>Trailer Title Statuses</h2>
                            <button
                                onClick={() => { setEditingItem(null); setIsTrailerStatusModalOpen(true); setNewTrailerStatusTitle(''); }}
                                className='px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 text-sm font-medium'>
                                Add new
                            </button>
                        </div>
                        <div className='space-y-4'>
                            {trailerTitleStatus.map((item) => (
                                <div key={item._id} className='flex items-center justify-between p-4 border border-gray-200 rounded-md bg-white'>
                                    <h3 className='text-lg font-semibold text-gray-900'>{item.title}</h3>
                                    <div className='flex space-x-3 text-sm'>
                                        <button
                                            onClick={() => handleEditClick(item, setIsTrailerStatusModalOpen)}
                                            className='text-blue-600 hover:text-blue-800 font-medium'>Edit</button>
                                        <button
                                            onClick={() => handleDelete('trailer-statuses', item._id, () => fetchData('trailer-statuses', setTrailerTitleStatus))}
                                            className='text-red-600 hover:text-red-800 font-medium'>Delete</button>
                                    </div>
                                </div>
                            ))}
                            {trailerTitleStatus.length === 0 && !loading && <p className='text-gray-600'>No trailer title statuses found.</p>}
                        </div>

                        {isTrailerStatusModalOpen && (
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                                <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                                    <h3 className="text-xl font-semibold mb-4">{editingItem ? 'Edit Trailer Status' : 'Add New Trailer Status'}</h3>
                                    <form onSubmit={editingItem ? handleUpdateTrailerStatus : handleCreateTrailerStatus}>
                                        <div className="mb-4">
                                            <label htmlFor="trailerStatusTitle" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
                                            <input
                                                type="text"
                                                id="trailerStatusTitle"
                                                value={newTrailerStatusTitle}
                                                onChange={(e) => setNewTrailerStatusTitle(e.target.value)}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => { setIsTrailerStatusModalOpen(false); setEditingItem(null); }}
                                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-400"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                            >
                                                {editingItem ? 'Update Trailer Status' : 'Add Trailer Status'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'Hitch type':
                return (
                    <div>
                        <div className='flex justify-between items-center mb-6 flex-wrap'>
                            <h2 className='text-2xl font-semibold text-gray-800'>Hitch Types</h2>
                            <button
                                onClick={() => { setEditingItem(null); setIsHitchTypeModalOpen(true); setNewHitchTypeTitle(''); }}
                                className='px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 text-sm font-medium'>
                                Add new
                            </button>
                        </div>
                        <div className='space-y-4'>
                            {hitchTypes.map((item) => (
                                <div key={item._id} className='flex items-center justify-between p-4 border border-gray-200 rounded-md bg-white'>
                                    <h3 className='text-lg font-semibold text-gray-900'>{item.title}</h3>
                                    <div className='flex space-x-3 text-sm'>
                                        <button
                                            onClick={() => handleEditClick(item, setIsHitchTypeModalOpen)}
                                            className='text-blue-600 hover:text-blue-800 font-medium'>Edit</button>
                                        <button
                                            onClick={() => handleDelete('hitch-types', item._id, () => fetchData('hitch-types', setHitchTypes))}
                                            className='text-red-600 hover:text-red-800 font-medium'>Delete</button>
                                    </div>
                                </div>
                            ))}
                            {hitchTypes.length === 0 && !loading && <p className='text-gray-600'>No hitch types found.</p>}
                        </div>

                        {isHitchTypeModalOpen && (
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                                <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                                    <h3 className="text-xl font-semibold mb-4">{editingItem ? 'Edit Hitch Type' : 'Add New Hitch Type'}</h3>
                                    <form onSubmit={editingItem ? handleUpdateHitchType : handleCreateHitchType}>
                                        <div className="mb-4">
                                            <label htmlFor="hitchTypeTitle" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
                                            <input
                                                type="text"
                                                id="hitchTypeTitle"
                                                value={newHitchTypeTitle}
                                                onChange={(e) => setNewHitchTypeTitle(e.target.value)}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => { setIsHitchTypeModalOpen(false); setEditingItem(null); }}
                                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-400"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                            >
                                                {editingItem ? 'Update Hitch Type' : 'Add Hitch Type'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'Ball size':
                return (
                    <div>
                        <div className='flex justify-between items-center mb-6 flex-wrap'>
                            <h2 className='text-2xl font-semibold text-gray-800'>Ball Sizes</h2>
                            <button
                                onClick={() => { setEditingItem(null); setIsBallSizeModalOpen(true); setNewBallSizeTitle(''); }}
                                className='px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 text-sm font-medium'>
                                Add new
                            </button>
                        </div>
                        <div className='space-y-4'>
                            {ballSizes.map((item) => (
                                <div key={item._id} className='flex items-center justify-between p-4 border border-gray-200 rounded-md bg-white'>
                                    <h3 className='text-lg font-semibold text-gray-900'>{item.title}</h3>
                                    <div className='flex space-x-3 text-sm'>
                                        <button
                                            onClick={() => handleEditClick(item, setIsBallSizeModalOpen)}
                                            className='text-blue-600 hover:text-blue-800 font-medium'>Edit</button>
                                        <button
                                            onClick={() => handleDelete('ball-sizes', item._id, () => fetchData('ball-sizes', setBallSizes))}
                                            className='text-red-600 hover:text-red-800 font-medium'>Delete</button>
                                    </div>
                                </div>
                            ))}
                            {ballSizes.length === 0 && !loading && <p className='text-gray-600'>No ball sizes found.</p>}
                        </div>

                        {isBallSizeModalOpen && (
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                                <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                                    <h3 className="text-xl font-semibold mb-4">{editingItem ? 'Edit Ball Size' : 'Add New Ball Size'}</h3>
                                    <form onSubmit={editingItem ? handleUpdateBallSize : handleCreateBallSize}>
                                        <div className="mb-4">
                                            <label htmlFor="ballSizeTitle" className="block text-gray-700 text-sm font-bold mb-2">Size (e.g., 2"):</label>
                                            <input
                                                type="text"
                                                id="ballSizeTitle"
                                                value={newBallSizeTitle}
                                                onChange={(e) => setNewBallSizeTitle(e.target.value)}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => { setIsBallSizeModalOpen(false); setEditingItem(null); }}
                                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-400"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                            >
                                                {editingItem ? 'Update Ball Size' : 'Add Ball Size'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                );
            default:
                return <div className='text-center py-8 text-gray-600'>Select a setting to manage its content.</div>;
        }
    };

    return (
        <div className='min-h-screen bg-[#fff] flex p-4 rounded-lg flex-wrap mt-2'>
            {/* Left Sidebar */}
            <div className='w-full md:w-1/4 p-6 mr-6 border rounded-md'>
                <h1 className='text-xl -bold text-gray-900 mb-6'>Platform setting</h1>

                {/* Website settings */}
                <h3 className='text-lg -semibold text-gray-800 mb-3'>Website settings</h3>
                <nav className='space-y-2 mb-6'>
                    {['Trusted by section', 'Popular location section', 'Trailers by category section', 'FAQ'].map((item) => (
                        <button
                            key={item}
                            onClick={() => setActiveSetting(item)}
                            className={`w-full text-left px-4 py-2 rounded-md text-sm -medium
                ${activeSetting === item ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}
              `}
                        >
                            {item}
                        </button>
                    ))}
                </nav>

                {/* Owner settings */}
                <h3 className='text-lg -semibold text-gray-800 mb-3'>Owner settings</h3>
                <nav className='space-y-2'>
                    {['Security Deposit', 'Category', 'Trailer title status', 'Hitch type', 'Ball size'].map((item) => (
                        <button
                            key={item}
                            onClick={() => setActiveSetting(item)}
                            className={`w-full text-left px-4 py-2 rounded-md text-sm -medium
                ${activeSetting === item ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}
              `}
                        >
                            {item}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Right Content Area */}
            <div className='flex-1 p-6 overflow-y-auto border rounded-md mt-2'>
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminSettingsPage;