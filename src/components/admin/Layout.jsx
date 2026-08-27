import React, { useEffect } from 'react'
import Sidebar from './sidebar/Sidebar'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Header from './Header'
import { applyAdminKey, clearAdminSession } from '../../helpers/adminSession'

const Layout = () => {
  const location = useLocation().pathname.split("/")[3];
  const navigate = useNavigate();

  // Admin Route Protection Check
  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("adminLoggedIn");
    const adminExpiry = localStorage.getItem("adminSessionExpiry");
    
    if (!isAdminLoggedIn || !adminExpiry) {
      navigate("/admin/login");
      return;
    }

    // Check if session is still valid
    const expiryTime = parseInt(adminExpiry, 10);
    if (Date.now() > expiryTime) {
      // Session expired - clear and redirect
      clearAdminSession();
      navigate("/admin/login");
      return;
    }

    // A reload wipes the axios default, so admin requests need it back
    applyAdminKey(localStorage.getItem("adminKey"));
  }, [navigate]);

  return (
    <div className='flex flex-col lg:flex-row items-start w-full min-h-screen'>
      <Sidebar />

      <div className='flex-1 w-full lg:h-screen overflow-y-auto bg-[#f9fafb]'>
        <Header location={location} />
        <div className='p-4 sm:p-5 lg:p-6 flex-1'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout