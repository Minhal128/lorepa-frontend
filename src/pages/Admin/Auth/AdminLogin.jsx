import React, { useState } from 'react';
import { IoMailOutline } from "react-icons/io5";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import config from '../../../config';

const AdminLogin = () => {
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [adminKey, setAdminKey] = useState('');
    const nav = useNavigate()

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`${config.baseUrl}/account/admin-key`);
            const masterKey = res.data.adminKey;
            
            if (adminKey === masterKey) {
                toast.success("Admin Login successful")
                
                // Set admin session with 2 hour expiry timestamp
                const expiryTime = Date.now() + (2 * 60 * 60 * 1000); // 2 hours in milliseconds
                localStorage.setItem("adminLoggedIn", "true");
                localStorage.setItem("adminSessionExpiry", expiryTime.toString());
                
                setTimeout(() => {
                    nav("/admin/dashboard/home")
                }, 1500);
            } else {
                toast.error("Invalid Admin Key")
            }
        } catch (error) {
            toast.error("Could not fetch admin key from server")
        }
    };
    return (
        <div className='min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8'>
            {/* Login Form Container */}
            <div className=' p-6 sm:p-8 md:p-10  w-full max-w-md'>
                {/* Login Title and Subtitle */}
                <h2 className='text-3xl  text-gray-900 text-center mb-2'>Login</h2>
                <p className='text-gray-500 text-center mb-8'>Welcome back, provide your details</p>

                {/* Login Form */}
                <form onSubmit={handleLogin} className='space-y-6'>
                    {/* Admin Master Key Input */}
                    <div>
                        <label htmlFor='adminKey' className='block text-sm  text-gray-700 mb-1'>
                            Admin Master Key
                        </label>
                        <div className='mt-1 relative rounded-md shadow-sm'>
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                id='adminKey'
                                name='adminKey'
                                required
                                value={adminKey}
                                onChange={(e) => setAdminKey(e.target.value)}
                                placeholder='Enter Admin Key'
                                className='appearance-none block w-full pr-10 px-4 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                            />
                            <div
                                className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                                onClick={togglePasswordVisibility}
                            >
                                {passwordVisible ? (
                                    <AiOutlineEyeInvisible className='h-5 w-5 text-gray-400' aria-hidden='true' />
                                ) : (
                                    <AiOutlineEye className='h-5 w-5 text-gray-400' aria-hidden='true' />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='text-xs text-gray-500 text-center mt-2'>
                        Session will automatically expire after 2 hours
                    </div>

                    {/* Login Button */}
                    <div>
                        <button
                            type='submit'
                            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm  text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        >
                            Login
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default AdminLogin
