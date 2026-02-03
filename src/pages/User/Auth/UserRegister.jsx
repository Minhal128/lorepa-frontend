import React, { useState } from 'react';
import { FaFacebookF, FaGoogle } from 'react-icons/fa';
import { IoMailOutline } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from "../../../assets/logo.svg";
import toast from 'react-hot-toast';

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const UserRegister = () => {
  const navigation = useNavigate()
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

  const handleSignUp = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    else{
      navigation("/user/dashboard/home")
    }
  };

  return (
    <div className='min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative'>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='absolute top-8 left-8'
      >
        <Link to={"/"}><img src={Logo} alt="Logo" className='h-[24rem]' /></Link>
      </motion.div>

      {/* Form Container */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className='bg-white p-6 sm:p-8 md:p-10 w-full max-w-md '
      >
        <motion.h2 variants={fadeInUp} className='text-3xl text-gray-900 text-center mb-2'>Sign up</motion.h2>
        <motion.p variants={fadeInUp} className='text-gray-500 text-center mb-8'>Welcome back, provide your details</motion.p>

        <motion.form
          onSubmit={handleSignUp}
          className='space-y-6'
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {/* First Name */}
          <motion.div variants={fadeInUp}>
            <label htmlFor='firstName' className='block text-sm text-gray-700 mb-1'>First name</label>
            <input
              type='text'
              id='firstName'
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder='First name'
              className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500'
            />
          </motion.div>

          {/* Last Name */}
          <motion.div variants={fadeInUp}>
            <label htmlFor='lastName' className='block text-sm text-gray-700 mb-1'>Last name</label>
            <input
              type='text'
              id='lastName'
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder='Last name'
              className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500'
            />
          </motion.div>

          {/* Email */}
          <motion.div variants={fadeInUp}>
            <label htmlFor='email' className='block text-sm text-gray-700 mb-1'>Email address</label>
            <input
              type='email'
              id='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Email address'
              className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500'
            />
          </motion.div>

          {/* Phone */}
          <motion.div variants={fadeInUp}>
            <label htmlFor='phoneNumber' className='block text-sm text-gray-700 mb-1'>Phone number</label>
            <div className='mt-1 flex rounded-md shadow-sm'>
              <span className='inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm'>
                NG (+234)
              </span>
              <input
                type='tel'
                id='phoneNumber'
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder='000-000-000'
                className='flex-1 block w-full rounded-none rounded-r-md px-4 py-2 border border-gray-300 sm:text-sm focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
          </motion.div>

          {/* Password */}
          <motion.div variants={fadeInUp}>
            <label htmlFor='password' className='block text-sm text-gray-700 mb-1'>Password</label>
            <div className='relative'>
              <input
                type={passwordVisible ? 'text' : 'password'}
                id='password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
                className='w-full pr-10 px-4 py-2 border border-gray-300 rounded-md sm:text-sm focus:ring-blue-500 focus:border-blue-500'
              />
              <div className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer' onClick={togglePasswordVisibility}>
                {passwordVisible ? (
                  <EyeOffIcon />
                ) : (
                  <EyeIcon />
                )}
              </div>
            </div>
          </motion.div>

          {/* Confirm Password */}
          <motion.div variants={fadeInUp}>
            <label htmlFor='confirmPassword' className='block text-sm text-gray-700 mb-1'>Confirm password</label>
            <div className='relative'>
              <input
                type={confirmPasswordVisible ? 'text' : 'password'}
                id='confirmPassword'
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder='Password'
                className='w-full pr-10 px-4 py-2 border border-gray-300 rounded-md sm:text-sm focus:ring-blue-500 focus:border-blue-500'
              />
              <div className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer' onClick={toggleConfirmPasswordVisibility}>
                {confirmPasswordVisible ? (
                  <EyeOffIcon />
                ) : (
                  <EyeIcon />
                )}
              </div>
            </div>
          </motion.div>

          {/* Submit */}
          <motion.div variants={fadeInUp}>
            <button
              type='submit'
              className='w-full py-2 px-4 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            >
              Sign up
            </button>
          </motion.div>
        </motion.form>

        {/* OR separator */}
        <motion.div variants={fadeInUp} className='relative mt-6 mb-6'>
          <div className='absolute inset-0 flex items-center'><div className='w-full border-t border-gray-300' /></div>
          <div className='relative flex justify-center text-sm'><span className='px-2 bg-white text-gray-500'>Or</span></div>
        </motion.div>

        {/* Social Buttons */}
        <motion.div className='flex justify-center space-x-4' variants={stagger} initial="hidden" animate="visible">
          {[IoMailOutline, FaGoogle, FaFacebookF].map((Icon, i) => (
            <motion.button
              key={i}
              type='button'
              variants={fadeInUp}
              className='p-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-500 hover:bg-gray-50'
            >
              <Icon className='h-5 w-5' />
            </motion.button>
          ))}
        </motion.div>

        {/* Login Link */}
        <motion.div variants={fadeInUp} className='mt-8 text-center text-sm'>
          <p>
            Already have an account?{' '}
            <Link to={"/user/login"} className='text-blue-600 hover:text-blue-500'>Login</Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className='h-5 w-5 text-gray-400' fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7s-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className='h-5 w-5 text-gray-400' fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-2.665m0 0L22 22M2.923 2.923L2.923 2.923M12 15a3 3 0 100-6 3 3 0 000 6z" />
  </svg>
);

export default UserRegister;
