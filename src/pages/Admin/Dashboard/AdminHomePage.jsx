import { useEffect, useState } from 'react';
import AddLocationModal from '../Models/AddLocationModal';
import axios from 'axios';
import config from '../../../config';

let cardStyle = "bg-white p-6 rounded-lg shadow-md flex items-center justify-between";

const AdminHomePage = () => {
  const [filter, setFilter] = useState('All');
  const [showLocation, setShowLocation] = useState(false);
  const [type, setType] = useState("");
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    pendingTrailers: 0,
    recentTrailers: []
  });

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get(`${config.baseUrl}/dashboard/data`);
      if (res.data.success) {
        setDashboardData(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const filteredListings = filter === 'All'
    ? dashboardData.recentTrailers
    : dashboardData.recentTrailers.filter(listing => listing.status === filter);

  return (
    <div className='min-h-screen space-y-8 pb-10'>
      <header className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
        <div>
          <h1 className='text-2xl sm:text-3xl font-black text-gray-900 tracking-tight'>Welcome Back, Admin</h1>
          <p className='text-gray-500 mt-1 font-medium'>Here's what's happening with Lorepa today.</p>
        </div>
        <div className='flex flex-col sm:flex-row gap-3 w-full md:w-auto'>
          <button
            onClick={() => { setType("Location"); setShowLocation(true); }}
            className='flex-1 sm:flex-none px-6 py-3 bg-white text-gray-700 font-bold rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 active:scale-95 transition text-sm'
          >
            Add Location
          </button>
          <button
            onClick={() => { setType("Category"); setShowLocation(true); }}
            className='flex-1 sm:flex-none px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition text-sm'
          >
            Manage Categories
          </button>
        </div>
      </header>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:border-blue-200 transition-colors">
          <div>
            <p className='text-sm font-black text-gray-400 uppercase tracking-widest mb-2'>Total Revenue</p>
            <p className='text-3xl font-black text-gray-900 tracking-tight'>${dashboardData.totalRevenue.toLocaleString()}</p>
          </div>
          <div className='bg-blue-50 p-4 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.592 1L21 6m-4 6h4m-4 6h4m-9-4h.01M12 18H5a2 2 0 01-2-2V8a2 2 0 012-2h14a2 2 0 012 2v2M5 14h.01" />
            </svg>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:border-orange-200 transition-colors">
          <div>
            <p className='text-sm font-black text-gray-400 uppercase tracking-widest mb-2'>Pending Approvals</p>
            <p className='text-3xl font-black text-gray-900 tracking-tight'>{dashboardData.pendingTrailers}</p>
          </div>
          <div className='bg-orange-50 p-4 rounded-2xl text-orange-600 group-hover:scale-110 transition-transform'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:border-emerald-200 transition-colors">
          <div>
            <p className='text-sm font-black text-gray-400 uppercase tracking-widest mb-2'>Total Bookings</p>
            <p className='text-3xl font-black text-gray-900 tracking-tight'>{dashboardData.totalBookings}</p>
          </div>
          <div className='bg-emerald-50 p-4 rounded-2xl text-emerald-600 group-hover:scale-110 transition-transform'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>
      </div>

      <div className='bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-gray-100'>
        <div className='flex justify-between items-center mb-8'>
          <h3 className='text-xl font-black text-gray-900 tracking-tight'>Recent Listings</h3>
          <button className='text-blue-600 font-bold text-sm hover:underline flex items-center gap-1'>
            View All
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className='flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2'>
          {['All', 'Pending', 'Decline', 'Approved'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`whitespace-nowrap py-2.5 px-6 text-sm font-bold rounded-xl transition-all ${filter === status
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className='grid grid-cols-1 gap-6'>
          {filteredListings.length > 0 ? filteredListings.map(listing => (
            <div key={listing._id} className='group flex flex-col sm:flex-row items-stretch sm:items-center p-4 sm:p-6 border border-gray-100 rounded-3xl hover:bg-gray-50 transition-colors gap-6'>
              <div className="relative w-full sm:w-48 h-40 sm:h-32 rounded-2xl overflow-hidden shrink-0">
                <img
                  src={listing.images[0] || "https://placehold.co/180x120/CCCCCC/666666?text=No+Image"}
                  alt={listing.title}
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${listing.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    listing.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      listing.status === 'Decline' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                    }`}>
                    {listing.status}
                  </span>
                </div>
              </div>

              <div className='flex-1 flex flex-col justify-center'>
                <h4 className='text-lg font-black text-gray-900 tracking-tight mb-2'>{listing.title}</h4>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    <p className='text-sm font-medium text-gray-500'>Category: <span className="text-gray-900">{listing.category}</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    <p className='text-sm font-medium text-gray-500'>Location: <span className="text-gray-900">{listing.location}</span></p>
                  </div>
                </div>
              </div>

              <div className="sm:text-right shrink-0 border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-6">
                <p className="text-xs font-black text-gray-400 uppercase mb-1 tracking-widest">Daily Rate</p>
                <p className='text-xl font-black text-gray-900'>${listing.dailyRate} <span className="text-xs font-bold text-gray-400">CAD</span></p>
              </div>
            </div>
          )) : (
            <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-gray-500 font-bold">No listings found for this filter.</p>
            </div>
          )}
        </div>
      </div>

      {showLocation && (
        <AddLocationModal
          type={type}
          onClose={() => setShowLocation(false)}
          onSave={() => setShowLocation(false)}
        />
      )}
    </div>
  );
};

export default AdminHomePage;
