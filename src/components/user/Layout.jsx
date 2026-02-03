import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import CompleteProfileModal from './CompleteProfileModal';

const FIRST_VISIT_KEY = 'hasVisitedDashboard';
const USER_PROFILE_INCOMPLETE = true;

const Layout = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem(FIRST_VISIT_KEY);
    if (!hasVisited && USER_PROFILE_INCOMPLETE) {
      setShowModal(true);
      localStorage.setItem(FIRST_VISIT_KEY, 'true');
    }
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
        isOpen={showModal}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default Layout;