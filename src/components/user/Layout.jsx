import React, { useEffect } from 'react';
import Sidebar from './sidebar/Sidebar';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import { lockMessage, useOnboardingLock } from '../../helpers/onboarding';
import toast from 'react-hot-toast';
import { useInactivityLogout } from '../../helpers/inactivityLogout';

const Layout = () => {
  const location = useLocation();
  const nav = useNavigate();
  const { locked, percent } = useOnboardingLock();
  const page = location.pathname.split('/')[3] || 'home';
  useInactivityLogout();

  useEffect(() => {
    if (percent == null) return;
    if (locked(page)) {
      toast.error(lockMessage(page));
      nav('/user/dashboard/profile', { replace: true });
    }
  }, [page, percent]);

  return (
    <div className='flex flex-col lg:flex-row items-start bg-[#fff] w-full min-h-screen'>
      <Sidebar />

      <div className='flex-1 w-full lg:h-screen overflow-y-auto bg-[#F9FAFB]'>
        <Header />
        <div className='p-4 sm:p-5 lg:p-6 flex-1'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
