import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiUpload, FiLock, FiUser } from 'react-icons/fi';
import axios from 'axios';
import config from '../../../config';
import toast from 'react-hot-toast';
import { profileTranslations } from '../../Seller/Dashboard/translation/profileTranslations';

const InputField = ({ label, value, placeholder, type = 'text', onChange, readOnly = false }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readOnly}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ${readOnly ? 'bg-gray-50 text-gray-500 border-gray-200 cursor-not-allowed' : 'border-gray-300'}`}
        />
    </div>
);


const PersonalInfoForm = ({ userData, setUserData, onSaveSuccess, t }) => {
    const [loading, setLoading] = useState(false);
    const profileInputRef = useRef(null);

    const handleSave = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("name", userData.name);
            formData.append("phone", userData.phone);
            formData.append("address", userData.address || "");
            formData.append("state", userData.state || "");
            formData.append("country", userData.country || "");
            formData.append("street", userData.street || "");
            if (userData.profilePicture instanceof File) formData.append("profilePicture", userData.profilePicture);
            if (userData.licenseFrontImage instanceof File) formData.append("licenseFrontImage", userData.licenseFrontImage);
            if (userData.licenseBackImage instanceof File) formData.append("licenseBackImage", userData.licenseBackImage);

            const res = await axios.put(`${config.baseUrl}/account/update/${localStorage.getItem("userId")}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            toast.success(res.data.msg);
            if (onSaveSuccess) onSaveSuccess();
        } catch (error) {
            toast.error(error.response?.data?.msg || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleProfileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUserData(prev => ({
                ...prev,
                profilePicture: file,
                profilePictureUrl: URL.createObjectURL(file)
            }));
        }
    };

    return (
        <div className='p-4 sm:p-6 lg:p-8'>
            <div className="flex flex-col items-center pb-6 border-b border-gray-200 mb-6">
                <input type="file" ref={profileInputRef} className="hidden" onChange={handleProfileChange} accept="image/*" />
                <img
                    onClick={() => profileInputRef.current.click()}
                    className="w-20 h-20 rounded-full object-cover mb-3 shadow-lg ring-4 ring-blue-100 cursor-pointer"
                    src={userData.profilePictureUrl || userData.profilePicture || "https://placehold.co/100x100/A0C4FF/000000?text=JD"}
                    alt="Profile Avatar"
                />
                <h2 className="text-lg font-semibold text-gray-900">{userData.name}</h2>
                <p className="text-sm text-gray-500">Membre depuis : {new Date(userData.createdAt).getFullYear()}</p>
            </div>

            <h3 className='text-xl font-bold text-gray-900 mb-6'>{t.personalInfo}</h3>

            <form>
                <InputField label={t.fullName} value={userData.name} onChange={e => setUserData({ ...userData, name: e.target.value })} />
                <InputField label={t.email} value={userData.email} readOnly />
                <InputField label={t.phone} value={userData.phone} onChange={e => setUserData({ ...userData, phone: e.target.value })} />
                <InputField label={t.country} value={userData.country || ""} onChange={e => setUserData({ ...userData, country: e.target.value })} />
                <InputField label={t.state} value={userData.state || ""} onChange={e => setUserData({ ...userData, state: e.target.value })} />
                <InputField label={t.address} value={userData.address || ""} onChange={e => setUserData({ ...userData, address: e.target.value })} />
                <InputField label={t.street} value={userData.street || ""} onChange={e => setUserData({ ...userData, street: e.target.value })} />

                <div className="flex justify-end mt-6">
                    <button type="button" disabled={loading} onClick={handleSave} className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-150 shadow-md">
                        {loading ? t.saving : t.saveChanges}
                    </button>
                </div>
            </form>
        </div>
    );
};

const SecuritySettings = ({ t }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
        try {
            setLoading(true);
            const res = await axios.put(`${config.baseUrl}/account/change-password/${localStorage.getItem("userId")}`, {
                currentPassword, newPassword
            });
            toast.success(res.data.msg);
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
        } catch (error) {
            toast.error(error.response?.data?.msg || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='space-y-6 p-4 sm:p-6 lg:p-8'>
            <h3 className='text-lg sm:text-xl font-bold text-gray-900 mb-6'>{t.passwordManagement}</h3>
            <InputField label={t.currentPassword} value={currentPassword} type="password" onChange={e => setCurrentPassword(e.target.value)} />
            <InputField label={t.newPassword} value={newPassword} type="password" onChange={e => setNewPassword(e.target.value)} />
            <InputField label={t.confirmPassword} value={confirmPassword} type="password" onChange={e => setConfirmPassword(e.target.value)} />
            <div className="mt-6">
                <button type="button" disabled={loading} onClick={handleChangePassword} className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-150 shadow-md">
                    {loading ? t.changingPassword : t.newPassword}
                </button>
            </div>
        </div>
    );
};

const DocumentUploadBlock = ({ side, file, onFileSelect }) => {
    const inputRef = useRef(null);

    // Determine preview image
    let preview = null;

    if (file instanceof File) {
        preview = URL.createObjectURL(file);
    } else if (typeof file === "string" && file.length > 0) {
        preview = file.startsWith("http")
            ? file
            : `${config.baseUrl}/${file}`;
    }

    return (
        <div
            className='flex-1 md:mb-0 mb-2 border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center space-y-3 hover:border-blue-500 transition cursor-pointer'
            onClick={() => inputRef.current.click()}
        >
            {/* Show image preview if exists */}
            {preview ? (
                <img
                    src={preview}
                    alt={`${side} preview`}
                    className='w-full h-40 object-cover rounded-lg shadow'
                />
            ) : (
                <>
                    <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200'>
                        <FiUpload className='w-5 h-5 text-gray-500' />
                    </div>
                    <p className='font-semibold text-sm text-gray-800'>{side}</p>
                    <p className='text-xs text-blue-600 font-medium'>Cliquer pour télécharger</p>
                </>
            )}

            <input
                ref={inputRef}
                type="file"
                onChange={onFileSelect}
                className='hidden'
                accept="image/*,.pdf"
            />
        </div>
    );
};

const DocumentUpload = ({ userData, setUserData, t }) => {
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            if (userData.licenseFrontImage instanceof File) formData.append("licenseFrontImage", userData.licenseFrontImage);
            if (userData.licenseBackImage instanceof File) formData.append("licenseBackImage", userData.licenseBackImage);
            if (userData.carInsurancePolicyImage instanceof File) formData.append("carInsurancePolicyImage", userData.carInsurancePolicyImage);
            if (userData.trailerInsurancePolicyImage instanceof File) formData.append("trailerInsurancePolicyImage", userData.trailerInsurancePolicyImage);
            if (userData.trailerRegistrationImage instanceof File) formData.append("trailerRegistrationImage", userData.trailerRegistrationImage);

            const res = await axios.put(`${config.baseUrl}/account/update/${localStorage.getItem("userId")}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            toast.success(res.data.msg);
        } catch (error) {
            toast.error(error.response?.data?.msg || "Failed to upload documents");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='p-4 sm:p-6 lg:p-8'>
            <h3 className='text-lg sm:text-xl font-bold text-gray-900 mb-6'>{t.driversLicense}</h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6'>
                <DocumentUploadBlock side={t.front} file={userData.licenseFrontImage || userData.licenseFrontImageUrl} onFileSelect={e => setUserData({ ...userData, licenseFrontImage: e.target.files[0], licenseFrontImageUrl: URL.createObjectURL(e.target.files[0]) })} />
                <DocumentUploadBlock side={t.back} file={userData.licenseBackImage || userData.licenseBackImageUrl} onFileSelect={e => setUserData({ ...userData, licenseBackImage: e.target.files[0], licenseBackImageUrl: URL.createObjectURL(e.target.files[0]) })} />
            </div>
            {
                localStorage.getItem("role") === "owner" ?
                    <div>
                        <h3 className='text-lg sm:text-xl font-bold text-gray-900 mb-4'>{t.trailerDocuments}</h3>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 text-center'>
                            <DocumentUploadBlock side={t?.trailerInsurancePolicyImage} file={userData.trailerInsurancePolicyImage || userData.trailerInsurancePolicyImageURL} onFileSelect={e => setUserData({ ...userData, trailerInsurancePolicyImage: e.target.files[0], trailerInsurancePolicyImageURL: URL.createObjectURL(e.target.files[0]) })} />
                            <DocumentUploadBlock side={t?.trailerRegistrationImage} file={userData.trailerRegistrationImage || userData.trailerRegistrationImageURL} onFileSelect={e => setUserData({ ...userData, trailerRegistrationImage: e.target.files[0], trailerRegistrationImageURL: URL.createObjectURL(e.target.files[0]) })} />
                        </div>
                    </div>
                    :
                    <div>
                        <h3 className='text-lg sm:text-xl font-bold text-gray-900 mb-4'>{t.insurance}</h3>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8'>
                            <DocumentUploadBlock side={t.carInsurancePolicyImage} file={userData.carInsurancePolicyImage || userData.carInsurancePolicyImageURL} onFileSelect={e => setUserData({ ...userData, carInsurancePolicyImage: e.target.files[0], carInsurancePolicyImageURL: URL.createObjectURL(e.target.files[0]) })} />
                        </div>
                    </div>
            }
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                <button type="button" disabled={loading} onClick={handleUpload} className="w-full sm:w-auto px-8 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-150 shadow-md">
                    {loading ? t.uploading : t.upload}
                </button>
            </div>
        </div>
    );
};

const TABS = {
    'personal': { component: PersonalInfoForm, label: 'Personal Info', icon: FiUser },
    'security': { component: SecuritySettings, label: 'Security', icon: FiLock },
    'documents': { component: DocumentUpload, label: 'Documents', icon: FiUpload },
};

const UserProfilePage = () => {
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('personal');
    const [userData, setUserData] = useState({});
    const [kycStatus, setKycStatus] = useState('Not Verified');
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'fr');
    const t = profileTranslations[lang];

    // Listen for language changes
    useEffect(() => {
        const handleStorageChange = () => setLang(localStorage.getItem('lang') || 'en');
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);


    useEffect(() => {
        const urlTab = searchParams.get('tab');
        if (urlTab && TABS[urlTab]) setActiveTab(urlTab);
    }, [searchParams]);

    const fetchUserProfile = async () => {
        try {
            const res = await axios.get(`${config.baseUrl}/account/single/${localStorage.getItem("userId")}`);
            setUserData(res.data.data);
            setKycStatus(res.data.data.kycVerified ? "Verified" : "Not Verified");
        } catch (error) {
            toast.error("Failed to fetch user profile");
        }
    };

    useEffect(() => { fetchUserProfile(); }, []);

    const ActiveComponent = TABS[activeTab].component;

    const getKycStatusStyle = (status) => {
        switch (status) {
            case 'Verified': return 'text-green-600';
            case 'Not Verified': return 'text-red-500';
            default: return 'text-gray-600';
        }
    };

    return (
        <div className='space-y-6'>
            <h1 className='text-2xl font-bold text-gray-900'>{t.profileSettings}</h1>
            <div className='flex flex-col lg:flex-row bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
                <div className='lg:w-80 w-full p-4 sm:p-6 space-y-6 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-100'>
                    <div className='flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible space-x-2 lg:space-x-0 lg:space-y-2 pb-2 lg:pb-0 scrollbar-hide'>
                        {Object.entries(TABS).map(([key, { icon: Icon }]) => (
                            <button key={key} onClick={() => setActiveTab(key)} className={`flex-1 lg:flex-none flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition duration-150 whitespace-nowrap ${activeTab === key ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}>
                                <Icon className='w-5 h-5 mr-3 flex-shrink-0' />
                                {key === 'personal' ? t.personalInfo : key === 'security' ? t.security : t.documents}
                            </button>
                        ))}
                    </div>
                    <div className='hidden lg:block p-4 rounded-xl bg-blue-50 border border-blue-100 space-y-2'>
                        <p className='text-sm font-bold text-gray-900'>{t.kycStatus}</p>
                        <span className={`text-xl font-extrabold ${getKycStatusStyle(kycStatus)}`}>{kycStatus === "Verified" ? t.verified : t.notVerified}</span>
                        <p className='text-xs text-blue-700'>Vos documents d'identité sont à jour et approuvés.</p>
                        <button onClick={() => setActiveTab("documents")} className='w-full mt-2 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-white transition'>{t.viewDocuments}</button>
                    </div>
                </div>
                <div className='flex-1 bg-white'>
                    <ActiveComponent userData={userData} setUserData={setUserData} onSaveSuccess={fetchUserProfile} t={t} />
                </div>
            </div>

            {/* KYC Status for Mobile */}
            <div className='lg:hidden p-5 rounded-2xl bg-blue-50 border border-blue-100 space-y-3'>
                <div className="flex justify-between items-center">
                    <p className='text-sm font-bold text-gray-900'>{t.kycStatus}</p>
                    <span className={`text-lg font-bold ${getKycStatusStyle(kycStatus)}`}>{kycStatus === "Verified" ? t.verified : t.notVerified}</span>
                </div>
                <p className='text-xs text-blue-700'>Vos documents d'identité sont à jour et approuvés.</p>
                <button onClick={() => setActiveTab("documents")} className='w-full py-3 text-sm font-medium text-blue-600 border border-blue-600 rounded-xl hover:bg-white transition bg-white/50'>{t.viewDocuments}</button>
            </div>
        </div>
    );
};

export default UserProfilePage;
