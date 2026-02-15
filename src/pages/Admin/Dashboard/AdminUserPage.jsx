import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import config from '../../../config';
import toast from 'react-hot-toast';
import { adminTranslations } from '../translation/adminTranslations';

const AdminUserPage = () => {
  const [activeTab, setActiveTab] = useState('owner');
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalImage, setModalImage] = useState(null); // <-- NEW for modal image

  const lang = localStorage.getItem("lang") || "en";
  const t = adminTranslations[lang] || adminTranslations.en;

  const itemsPerPage = 10;

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${config.baseUrl}/account/all`);
      if (res.data?.data) {
        setUsers(res.data.data);
      }
    } catch {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => user.role === activeTab);

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const displayedUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setCurrentPage(1);
  };

  const openImageModal = (url) => setModalImage(url);
  const closeModal = () => setModalImage(null);

  return (
    <div className='min-h-screen space-y-8 pb-10'>
      {/* Image Modal */}
      {modalImage && (
        <div
          onClick={closeModal}
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300"
        >
          <div className="relative max-w-4xl w-full animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            <img
              src={modalImage}
              alt={t.verificationDocument}
              className="w-full h-auto rounded-[2rem] shadow-2xl border-4 border-white"
            />
            <button
              onClick={closeModal}
              className="absolute -top-4 -right-4 w-12 h-12 bg-white text-gray-900 rounded-2xl shadow-xl flex items-center justify-center hover:bg-gray-50 active:scale-95 transition"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* Header & Tabs */}
      <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h3 className='text-xl font-black text-gray-900 tracking-tight'>{t.userManagement}</h3>
            <p className="text-sm text-gray-500 font-medium">{t.verifyDocsManageAccounts}</p>
          </div>
          <div className='flex gap-2 p-1.5 bg-gray-50 rounded-2xl w-full md:w-auto'>
            <button
              onClick={() => handleTabChange('owner')}
              className={`flex-1 md:flex-none py-2.5 px-8 text-sm font-bold rounded-xl transition-all ${activeTab === 'owner' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {t.owners}
            </button>
            <button
              onClick={() => handleTabChange('renter')}
              className={`flex-1 md:flex-none py-2.5 px-8 text-sm font-bold rounded-xl transition-all ${activeTab === 'renter' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {t.renters}
            </button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className='hidden xl:block overflow-hidden rounded-3xl border border-gray-100'>
          <table className='min-w-full divide-y divide-gray-100'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest'>{t.sn}</th>
                <th className='px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest'>{t.profile}</th>
                <th className='px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest'>{t.contact}</th>
                <th className='px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest'>{t.documents}</th>
                <th className='px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest'>{t.status}</th>
                <th className='px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest'>{t.actions}</th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-100'>
              {displayedUsers.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className='px-6 py-4 text-sm font-bold text-gray-400'>{indexOfFirstUser + index + 1}</td>
                  <td className='px-6 py-4'>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center font-black text-blue-600">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900 tracking-tight">{user.name}</p>
                        <p className="text-xs text-gray-500 font-medium">@{user.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <p className="text-sm font-bold text-gray-900">{user.email}</p>
                    <p className="text-xs text-gray-500 font-medium">{user.phone}</p>
                  </td>
                  <td className='px-6 py-4'>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: 'License', img: user.licenseFrontImage },
                        { label: 'Registration', img: user.trailerRegistrationImage },
                        { label: 'Insurance', img: user.trailerInsurancePolicyImage }
                      ].map((doc, idx) => (
                        doc.img && (
                          <button
                            key={idx}
                            onClick={() => openImageModal(doc.img)}
                            className="p-1 rounded-lg border border-gray-100 bg-gray-50 hover:border-blue-200 transition"
                            title={doc.label}
                          >
                            <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center">
                              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                          </button>
                        )
                      ))}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className="flex flex-col gap-1">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex w-fit ${user.accountBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {user.accountBlocked ? t.blocked : t.active}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex w-fit ${user.kycVerified ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                        KYC: {user.kycVerified ? t.verified : t.pending}
                      </span>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex gap-2'>
                      <Link to={`/admin/dashboard/user/${user._id}`} className='p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition'>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </Link>
                      <button className={`p-2 rounded-xl transition ${user.accountBlocked ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}>
                        {user.accountBlocked ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className='xl:hidden grid grid-cols-1 md:grid-cols-2 gap-4'>
          {displayedUsers.map((user, index) => (
            <div key={user._id} className="p-6 bg-white border border-gray-100 rounded-3xl hover:border-blue-200 transition-colors space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center font-black text-blue-600 text-lg">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-lg font-black text-gray-900 tracking-tight leading-tight">{user.name}</p>
                    <div className="flex gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${user.accountBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {user.accountBlocked ? t.blocked : t.active}
                      </span>
                    </div>
                  </div>
                </div>
                <p className='text-xs font-black text-gray-300'>#{indexOfFirstUser + index + 1}</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-nowrap">{t.email}</p>
                    <p className="font-bold text-gray-900 truncate">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-nowrap">{t.phone}</p>
                    <p className="font-bold text-gray-900">{user.phone}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 font-bold">{t.documents}</p>
                  <div className="flex gap-2">
                    {[
                      { img: user.licenseFrontImage },
                      { img: user.trailerRegistrationImage },
                      { img: user.trailerInsurancePolicyImage }
                    ].map((doc, idx) => (
                      doc.img && (
                        <button
                          key={idx}
                          onClick={() => openImageModal(doc.img)}
                          className="w-14 h-10 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0"
                        >
                          <img src={doc.img} alt="Doc" className="w-full h-full object-cover" />
                        </button>
                      )
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Link to={`/admin/dashboard/user/${user._id}`} className='flex-1 py-3 bg-blue-50 text-blue-600 font-bold text-sm rounded-2xl text-center hover:bg-blue-100 transition'>
                  {t.viewProfile}
                </Link>
                <button className={`flex-1 py-3 rounded-2xl font-bold text-sm transition ${user.accountBlocked ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}>
                  {user.accountBlocked ? t.reactivate : t.suspend}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className='flex flex-col sm:flex-row justify-between items-center gap-6 pt-6 border-t border-gray-50'>
          <p className='text-sm font-bold text-gray-400 uppercase tracking-widest'>{t.pageXofY.replace('{current}', currentPage).replace('{total}', totalPages)}</p>
          <div className='flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 max-w-full scrollbar-hide'>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 shrink-0 rounded-xl text-sm font-black transition-all ${currentPage === page
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'bg-white border-2 border-gray-100 text-gray-400 hover:border-blue-200'
                  }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserPage;
