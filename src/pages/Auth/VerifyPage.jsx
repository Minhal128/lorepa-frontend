import React, { useState, useEffect } from 'react';
import Logo from '../../assets/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import config from '../../config';
import toast from 'react-hot-toast';
import axios from 'axios';
import { verifyPageTranslations } from './translation/verifyPageTranslations';

const VerifyPage = () => {

    const nav = useNavigate()
    const [formData, setFormData] = useState({ email: localStorage.getItem("uEmail"), otp: '', });
    const [t, setT] = useState(verifyPageTranslations.fr);

    useEffect(() => {
        const updateTranslations = () => {
            const lang = localStorage.getItem('lang') || 'fr';
            setT(verifyPageTranslations[lang] || verifyPageTranslations.fr);
        };
        updateTranslations();
        window.addEventListener('storage', updateTranslations);
        return () => window.removeEventListener('storage', updateTranslations);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleVerifyOtp = async () => {
        let loader = toast.loading(t.processing)
        try {
            const response = await axios.post(`${config.baseUrl}/account/verify/otp`, formData);
            if (response?.data) {
                toast.dismiss(loader)
                localStorage.setItem("userId", response?.data?.data?._id)
                localStorage.setItem("role", response?.data?.data?.role)
                toast.success(t.accountVerified);
                
                // Redirect based on user role
                const userRole = response?.data?.data?.role;
                setTimeout(() => { 
                    if (userRole === "owner") {
                        nav("/seller/dashboard/home");
                    } else {
                        nav("/user/dashboard/home");
                    }
                }, 2000);
            }
        }
        catch (error) {
            toast.dismiss(loader)
            if (error.response) {
                toast.error(error?.response?.data?.msg || t.verificationFailed);
            }
            else if (error.request) {
                toast.error(t.noResponse);
            }
            else {
                toast.error(t.error);
            }
        }
    };
    const handleResendOtp = async () => {
        let loader = toast.loading(t.processing)
        try {
            const response = await axios.post(`${config.baseUrl}/account/send/otp/${localStorage.getItem("uEmail")}`, formData);
            if (response?.data) {
                toast.dismiss(loader)
                localStorage.setItem("userId", response?.data?.data?._id)
                toast.success(t.otpSent);
            }
        }
        catch (error) {
            toast.dismiss(loader)
            if (error.response) {
                toast.error(error?.response?.data?.msg || t.otpSendingFailed);
            }
            else if (error.request) {
                toast.error(t.noResponse);
            }
            else {
                toast.error(t.error);
            }
        }
    };

    return (
        <div className='flex justify-center items-center w-screen h-screen'>
            <div className='flex justify-center items-center w-screen h-screen'>
                <div className='flex-1 flex justify-center items-center flex-col h-[100%] overflow-y-auto'>
                    <div className="flex items-center gap-x-2 mb-8 cursor-pointer">
                        <img src={Logo} alt="" className='h-10' />
                        <span className="text-xl">LOREPA</span>
                    </div>
                    <div className='w-full max-w-md p-6'>
                        <h2 className="text-2xl mb-4 text-[#324B50]">{t.otpVerification}</h2>
                        <p className='text-sm text-[#324B50]'>{t.checkEmail}</p>
                        <form className="">
                            <input required={true} type="text" name="otp" placeholder={t.otpPlaceholder} className="w-[100%] mt-2 border p-2 rounded outline-none block" onChange={handleChange} />
                        </form>
                        <p onClick={handleResendOtp} className="mt-2 text-[#3D8977] cursor-pointer">{t.resendOtp}</p>
                        <button className="w-full bg-[#3D8977] text-white p-2 rounded mt-4" onClick={handleVerifyOtp}>{t.verify}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VerifyPage