import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import config from '../../../config';
import toast from 'react-hot-toast';

const AdminListingDetailPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchTrailer = async () => {
    try {
      const res = await axios.get(`${config.baseUrl}/trailer/single/${id}`);
      setListing(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch trailer details");
    }
  };

  const updateStatus = async (status) => {
    try {
      await axios.put(`${config.baseUrl}/trailer/status/${id}`, { status });
      toast.success(`Status updated to ${status}`);
      fetchTrailer(); // Refresh data
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchTrailer();
  }, []);

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? listing.images.length - 1 : prevIndex - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === listing.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!listing) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className='min-h-screen space-y-8 pb-10'>
      {/* Header and Title */}
      <header className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
        <div className="space-y-1">
          <h1 className='text-2xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight'>{listing.title}</h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">{listing.category}</p>
          </div>
        </div>
        <div className='flex gap-3 w-full md:w-auto'>
          <button
            onClick={() => updateStatus("Approved")}
            className='flex-1 md:flex-none px-8 py-4 bg-green-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-green-100 hover:scale-105 transition-all'
          >
            Approve Listing
          </button>
          <button
            onClick={() => updateStatus("Decline")}
            className='flex-1 md:flex-none px-8 py-4 bg-white text-red-600 border-2 border-red-50 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all'
          >
            Reject
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gallery & Description */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Viewer */}
          <div className='group relative aspect-video bg-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100'>
            <img
              src={listing.images[currentImageIndex]}
              alt={listing.title}
              className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/800x400/CCCCCC/666666?text=Image+Unavailable";
              }}
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
              {listing.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${currentImageIndex === idx ? 'w-6 bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>

            <button
              onClick={goToPreviousImage}
              className='absolute top-1/2 left-6 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur shadow-xl text-gray-900 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all active:scale-95'
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              onClick={goToNextImage}
              className='absolute top-1/2 right-6 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur shadow-xl text-gray-900 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all active:scale-95'
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          <div className='bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6'>
            <h3 className='text-xl font-black text-gray-900 tracking-tight border-l-4 border-blue-600 pl-4'>Listing Description</h3>
            <p className='text-base text-gray-600 font-medium leading-relaxed'>{listing.description}</p>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          {/* Owner Card */}
          <div className='bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-6'>
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Listing Owner</h4>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full blur opacity-25"></div>
              <img
                src={listing?.userId?.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoVxP6BSWt_Th-gPE1VK6416lx09HTdfHs0w&s"}
                className='relative w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl'
                alt='owner'
              />
            </div>
            <div>
              <p className="text-xl font-black text-gray-900 tracking-tight leading-tight">{listing?.userId?.name || "N/A"}</p>
              <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Verified Partner</p>
            </div>
            <div className="w-full grid grid-cols-1 gap-3 pt-6 border-t border-gray-50">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-left">Internal Reference</p>
              <div className="bg-gray-50 p-3 rounded-xl text-left">
                <p className="text-[10px] font-bold text-gray-900 font-mono tracking-tighter truncate">#{listing._id}</p>
              </div>
            </div>
          </div>

          {/* Pricing Card */}
          <div className='bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6'>
            <h3 className='text-lg font-black text-gray-900 tracking-tight border-l-4 border-blue-600 pl-4'>Pricing Structure</h3>
            <div className='space-y-4'>
              {[
                { label: "Daily Rate", value: listing.dailyRate, main: true },
                { label: "Weekly Rate", value: listing.weeklyRate },
                { label: "Monthly Rate", value: listing.monthlyRate },
                { label: "Cleaning Fee", value: listing.cleaningRate },
                { label: "Security Deposit", value: listing.securityRate },
                { label: "Insurance Deductible", value: listing.insuranceDeductible },
              ].map((item, idx) => (
                <div key={idx} className={`flex justify-between items-center p-4 rounded-2xl ${item.main ? 'bg-blue-50/50' : 'bg-gray-50/50'}`}>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                  <span className={`font-black ${item.main ? 'text-lg text-blue-600' : 'text-gray-900'}`}>{item.value} CAD</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Grid */}
      <div className='bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-8'>
        <h3 className='text-xl font-black text-gray-900 tracking-tight border-l-4 border-blue-600 pl-4'>Technical Specifications</h3>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8'>
          {[
            { label: "Manufacturing Year", value: listing.year, icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
            { label: "Overall Length", value: `${listing.length}ft`, icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
            { label: "Sleeping Capacity", value: listing.sleeps, icon: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" },
            { label: "Listing City", value: listing.city, icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" },
            { label: "Province/State", value: listing.state, icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" },
            { label: "Zip/Postal Code", value: listing.zip, icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
          ].map((spec, idx) => (
            <div key={idx} className="space-y-4 group">
              <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center transition-all group-hover:bg-blue-50 group-hover:text-blue-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={spec.icon} /></svg>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">{spec.label}</p>
                <p className="text-base font-black text-gray-900 tracking-tight">{spec.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Footer for Mobile */}
      <div className='fixed md:hidden bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] flex gap-4 border-t border-gray-100 z-50'>
        <button className='flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all'>Report Issue</button>
        <button className='flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 active:scale-95 transition-all'>Contact Owner</button>
      </div>
    </div>
  );
};

export default AdminListingDetailPage;
