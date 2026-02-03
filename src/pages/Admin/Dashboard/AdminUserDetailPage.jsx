import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "../../../config";
import toast from "react-hot-toast";

const placeholderAvatar = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoVxP6BSWt_Th-gPE1VK6416lx09HTdfHs0w&s";

const AdminUserDetailPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  const fetchSingleUser = async () => {
    try {
      const res = await axios.get(`${config.baseUrl}/account/single/${id}`);
      setUser(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch user details");
    }
  };

  useEffect(() => {
    fetchSingleUser();
  }, [id]);

  if (!user) return <p className="p-6">Loading user details...</p>;

  const personalInfo = user.personalInfo || {};

  const getValue = (value) => value || "-";

  return (
    <div className='min-h-screen space-y-8 pb-10 px-2 sm:px-0'>
      <header>
        <h1 className='text-2xl sm:text-3xl font-black text-gray-900 tracking-tight'>User Details</h1>
        <p className="text-sm text-gray-500 font-medium tracking-tight">Viewing detailed profile information for {user.name}.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Profile Sidebar */}
        <aside className="lg:w-1/3 xl:w-1/4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <img
                src={user.avatar || placeholderAvatar}
                alt="User Avatar"
                className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
              />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">{getValue(user.name)}</h2>
              <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${user.accountBlocked ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-600 border border-green-100"}`}>
                {user.accountBlocked ? "Account Blocked" : "Active Member"}
              </span>
            </div>

            <div className="w-full pt-6 border-t border-gray-50 flex flex-col items-center gap-4">
              <div className="flex items-center gap-3 text-sm font-bold text-gray-400 uppercase tracking-widest">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Joined {getValue(user.createdAt?.slice(0, 10))}
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-between">
              Account Status
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </h4>
            <button className="w-full py-4 bg-gray-50 text-gray-900 font-black text-xs uppercase tracking-widest rounded-2xl border-2 border-transparent hover:border-blue-600 hover:bg-white transition-all">
              Update Account Settings
            </button>
          </div>
        </aside>

        {/* Info Grid */}
        <main className="flex-1 space-y-8">
          <div className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-sm border border-gray-100 space-y-12">
            <section className="space-y-8">
              <h3 className="text-xl font-black text-gray-900 tracking-tight px-4 border-l-4 border-blue-600">Personal Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { label: "First Name", value: getValue(user.name) },
                  { label: "Last Name", value: getValue(user.name) },
                  { label: "Email Address", value: getValue(user.email), theme: "text-blue-600" },
                  { label: "Phone Number", value: getValue(user.phone) },
                  { label: "Date of Birth", value: getValue(personalInfo.dateOfBirth) },
                  { label: "Region", value: getValue(personalInfo.region) },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1 group">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest transition-colors group-hover:text-blue-600">{item.label}</p>
                    <p className={`text-base font-bold truncate ${item.theme || 'text-gray-900'}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-gray-50" />

            <section className="space-y-8">
              <h3 className="text-xl font-black text-gray-900 tracking-tight px-4 border-l-4 border-blue-600">Location & Address</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-700">
                {[
                  { label: "Province", value: getValue(personalInfo.province) },
                  { label: "City", value: getValue(personalInfo.city) },
                  { label: "Zip Code", value: getValue(personalInfo.zip) },
                  { label: "Address Line 1", value: getValue(personalInfo.address1), full: true },
                  { label: "Address Line 2", value: getValue(personalInfo.address2), full: true },
                ].map((item, idx) => (
                  <div key={idx} className={`space-y-1 group ${item.full ? 'sm:col-span-2' : ''}`}>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest transition-colors group-hover:text-blue-600">{item.label}</p>
                    <p className="text-base font-bold text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-gray-50" />

            <section className="space-y-6">
              <h3 className="text-xl font-black text-gray-900 tracking-tight px-4 border-l-4 border-blue-600">About Owner</h3>
              <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                <p className="text-base font-medium text-gray-600 leading-relaxed italic">"{getValue(personalInfo.aboutOwner)}"</p>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUserDetailPage;
