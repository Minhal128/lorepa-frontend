import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar/Sidebar';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import CompleteProfileModal from './CompleteProfileModal';
import axios from 'axios';
import config from '../../config';
import { isProfileComplete } from '../../helpers/profileCompletion';
import { FILL_ONBOARDING_MSG, useOnboardingLock } from '../../helpers/onboarding';
import toast from 'react-hot-toast';

const Layout = () => {
  const location = useLocation();
  const nav = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const onProfile = location.pathname.includes('/profile');
  const { locked, percent } = useOnboardingLock();
  const page = location.pathname.split('/')[3] || 'home';

  useEffect(() => {
    if (percent == null) return;
    if (locked(page)) {
      toast.error(FILL_ONBOARDING_MSG);
      nav('/user/dashboard/profile', { replace: true });
    }
  }, [page, percent]);

  useEffect(() => {
    const checkProfileStatus = async () => {
      const userId = localStorage.getItem('userId');
      const role = localStorage.getItem('role') || 'renter';

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