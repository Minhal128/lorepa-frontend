import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../../../config';
import toast from 'react-hot-toast';
import { adminTranslations } from '../translation/adminTranslations';

const AdminListingPage = () => {
  const [filter, setFilter] = useState('All');
  const [trailers, setTrailers] = useState([]);

  const lang = localStorage.getItem("lang") || "fr";
  const t = adminTranslations[lang] || adminTranslations.en;

  const fetchTrailers = async () => {
    try {
      const res = await axios.get(`${config.baseUrl}/trailer/all`);
      setTrailers(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load trailers");
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${config.baseUrl}/trailer/status/${id}`, { status });
      toast.success("Status updated");
      fetchTrailers();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchTrailers();
  }, []);

  const filteredListings = filter === 'All'
    ? trailers
    : trailers.filter(listing => listing.status === filter);

  return (
    <div className='min-h-screen space-y-8 pb-10'>
      <div className='bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-gray-100'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h3 className='text-xl font-black text-gray-900 tracking-tight'>{t.trailerManagement}</h3>
            <p className="text-sm text-gray-500 font-medium">{t.approveManageListings}</p>
          </div>
          <button className='hidden sm:flex text-blue-600 font-bold text-sm hover:underline items-center gap-1'>
            {t.generalSettings}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        <div className='flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2'>
          {['All', 'Pending', 'Approved', 'Decline'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`whitespace-nowrap py-2.5 px-6 text-sm font-bold rounded-xl transition-all ${filter === status
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
              {t[status.toLowerCase()]}
            </button>
          ))}
        </div>

        <div className='grid grid-cols-1 gap-6'>
          {filteredListings.length > 0 ? filteredListings.map(listing => (
            <div key={listing._id} className='group flex flex-col lg:flex-row items-stretch lg:items-center p-4 sm:p-6 border border-gray-100 rounded-3xl hover:bg-gray-50 transition-colors gap-6'>
              <div className="relative w-full lg:w-56 h-48 lg:h-36 rounded-2xl overflow-hidden shrink-0">
                <img
                  src={listing?.images?.[0] || "https://placehold.co/180x120/CCCCCC/666666?text=Image+Unavailable"}
                  alt={listing.title}
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${listing.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    listing.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      listing.status === 'Decline' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                    }`}>
                    {t[listing.status.toLowerCase()]}
                  </span>
                </div>
              </div>

              <div className='flex-1 min-w-0'>
                <h4 className='text-lg font-black text-gray-900 tracking-tight mb-2 truncate'>{listing.title}</h4>
                <div className="space-y-1.5">
                  <p className='text-sm font-bold text-gray-900 flex items-center gap-2'>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                    {listing?.userId?.name || t.unknownUser}
                  </p>
                  <div className="flex flex-wrap gap-x-4 text-xs font-medium text-gray-500">
                    <p className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {listing.city}, {listing.state}
                    </p>
                    <p className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      {listing?.userId?.phone || t.noPhone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-6">
                <Link
                  to={`/admin/dashboard/listing/${listing._id}`}
                  className='flex-1 sm:flex-none px-6 py-2.5 bg-blue-50 text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-100 transition text-center'
                >
                  {t.viewDetails}
                </Link>
                <div className='flex gap-1.5'>
                  {['Pending', 'Approved', 'Decline'].map(status => (
                    <button
                      key={status}
                      onClick={() => updateStatus(listing._id, status)}
                      className={`flex-1 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${listing.status === status
                        ? 'bg-gray-900 border-gray-900 text-white'
                        : 'bg-white border-gray-100 text-gray-500 hover:border-blue-200 hover:text-blue-600'
                        }`}
                    >
                      {t[status.toLowerCase()]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-gray-500 font-bold">{t.noTrailersFound}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminListingPage;
