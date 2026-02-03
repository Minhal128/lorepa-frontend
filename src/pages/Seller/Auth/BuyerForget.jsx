import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BuyerForget = () => {

    const nav = useNavigate()
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const [passwordUpdated, setPasswordUpdated] = useState(false);

    const toggleNewPasswordVisibility = () => {
        setNewPasswordVisible(!newPasswordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        console.log('Update password attempt with:', { newPassword, confirmPassword });
        if (newPassword !== confirmPassword) {
            console.error("New password and confirm password do not match!");
            setPasswordUpdated(false);
            return;
        }

        setTimeout(() => {
            setPasswordUpdated(true);
            setNewPassword('');
            setConfirmPassword('');
            nav("/seller/login")
        }, 1000);
    };

    return (

        <div className='min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8'>
            {/* Logo Section */}
            <div className='absolute top-8 left-8'>
                <h1 className='text-xl -bold text-gray-800 tracking-wider'>LOREPA</h1>
            </div>

            <div className=' p-6 sm:p-8 md:p-10 w-full max-w-md'>

                <h2 className='text-3xl -bold text-gray-900 text-center mb-2'>Forget password</h2>
                <p className='text-gray-500 text-center mb-8'>Enter a new password for your account</p>

                <form onSubmit={handleUpdatePassword} className='space-y-6'>
                    {/* New Password Input */}
                    <div>
                        <label htmlFor='newPassword' className='block text-sm -medium text-gray-700 mb-1'>
                            New password
                        </label>
                        <div className='mt-1 relative rounded-md shadow-sm'>
                            <input
                                type={newPasswordVisible ? 'text' : 'password'}
                                id='newPassword'
                                name='newPassword'
                                autoComplete='new-password'
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder='Password'
                                className='appearance-none block w-full pr-10 px-4 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                            />
                            <div
                                className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                                onClick={toggleNewPasswordVisibility}
                            >
                                {newPasswordVisible ? (
                                    // Eye invisible icon SVG
                                    <svg xmlns="http://www.w3.org/2000/svg" className='h-5 w-5 text-gray-400' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-2.665m0 0L22 22M2.923 2.923L2.923 2.923M5.118 5.118A9.955 9.955 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.707 5.923M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                    </svg>
                                ) : (
                                    // Eye visible icon SVG
                                    <svg xmlns="http://www.w3.org/2000/svg" className='h-5 w-5 text-gray-400' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                        <label htmlFor='confirmPassword' className='block text-sm -medium text-gray-700 mb-1'>
                            Confirm password
                        </label>
                        <div className='mt-1 relative rounded-md shadow-sm'>
                            <input
                                type={confirmPasswordVisible ? 'text' : 'password'}
                                id='confirmPassword'
                                name='confirmPassword'
                                autoComplete='new-password'
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder='Password'
                                className='appearance-none block w-full pr-10 px-4 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                            />
                            <div
                                className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                                onClick={toggleConfirmPasswordVisibility}
                            >
                                {confirmPasswordVisible ? (
                                    // Eye invisible icon SVG
                                    <svg xmlns="http://www.w3.org/2000/svg" className='h-5 w-5 text-gray-400' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-2.665m0 0L22 22M2.923 2.923L2.923 2.923M5.118 5.118A9.955 9.955 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.707 5.923M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                    </svg>
                                ) : (
                                    // Eye visible icon SVG
                                    <svg xmlns="http://www.w3.org/2000/svg" className='h-5 w-5 text-gray-400' fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Update password Button */}
                    <div>
                        <button
                            type='submit'
                            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm -medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        >
                            Update password
                        </button>
                    </div>
                </form>

                {passwordUpdated && (
                    <div className='mt-6 flex items-center justify-center text-green-600 text-sm'>
                        {/* Checkmark icon SVG */}
                        <svg xmlns="http://www.w3.org/2000/svg" className='h-5 w-5 mr-2' viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Password changed successfully
                    </div>
                )}
            </div>
        </div>
    );
};

export default BuyerForget;
