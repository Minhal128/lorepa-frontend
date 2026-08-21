import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar/Sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import CompleteProfileModal from './CompleteProfileModal';
import axios from 'axios';
import config from '../../config';
import { isProfileComplete } from '../../helpers/profileCompletion';

const Layout = () => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  // ponytail: already on profile — modal would block the upload UI
  const onProfile = location.pathname.includes('/profile');

  useEffect(() => {
    const checkProfileStatus = async () => {
      const userId = localStorage.getItem('userId');
      const role = localStorage.getItem('role') || 'owner';

      if (!userId) {
        setShowModal(false);
        return;
      }

      try {
        const res = await axios.get(`${config.baseUrl}/account/single/${userId}`);
        const user = res?.data?.data;
        setShowModal(!isProfileComplete(user, role));
      } catch {
        setShowModal(false);
      }
    };

    checkProfileStatus();
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className='flex flex-col lg:flex-row items-start bg-[#fff] w-full min-h-screen'>
      <Sidebar />

      <div className='flex-1 w-full lg:h-screen overflow-y-auto bg-[#F9FAFB]'>
        <Header />
        <div className='p-4 sm:p-5 lg:p-6 flex-1'>
          <Outlet />
        </div>
      </div>

      <CompleteProfileModal
        isOpen={showModal && !onProfile}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default Layout;