import React from 'react'
import Sidebar from './sidebar/Sidebar'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'

const Layout = () => {
  const location = useLocation().pathname.split("/")[3];

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