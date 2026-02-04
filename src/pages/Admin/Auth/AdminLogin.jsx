import React, { useState } from 'react';
import { IoMailOutline } from "react-icons/io5";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminLogin = () => {
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [keepSignedIn, setKeepSignedIn] = useState(false);
    const nav = useNavigate()

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (email === "admin@lorepa.com" && password === "Admin@1234") {
            toast.success("Login Sucessfull")
            setTimeout(() => {
                nav("/admin/dashboard/home")
            }, 2000);
        }
        else {
            toast.error("Invalid credentials")
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
                    {/* Email Address Input */}
                    <div>
                        <label htmlFor='email' className='block text-sm  text-gray-700 mb-1'>
                            Email address
                        </label>
                        <input
                            type='email'
                            id='email'
                            name='email'
                            autoComplete='email'
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='First name' // Placeholder as seen in the image
                            className='appearance-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor='password' className='block text-sm  text-gray-700 mb-1'>
                            Password
                        </label>
                        <div className='mt-1 relative rounded-md shadow-sm'>
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                id='password'
                                name='password'
                                autoComplete='current-password'
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Password'
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

                    {/* Keep me signed in & Forgot password */}
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center'>
                            <input
                                id='remember-me'
                                name='remember-me'
                                type='checkbox'
                                checked={keepSignedIn}
                                onChange={(e) => setKeepSignedIn(e.target.checked)}
                                className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                            />
                            <label htmlFor='remember-me' className='ml-2 block text-sm text-gray-900'>
                                Keep me signed in
                            </label>
                        </div>
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
