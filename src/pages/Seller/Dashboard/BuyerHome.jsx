import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaTruck, FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { IoWalletOutline } from 'react-icons/io5';
import axios from 'axios';
import config from '../../../config';
import { Link, useNavigate } from 'react-router-dom';
import { dashboardTranslations } from './translation/buyerHome';

const KpiCard = ({ title, value, detail, icon: Icon, iconColor, iconBg }) => (
  <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-4 transition duration-300 hover:shadow-md">
    <div className={`p-3 rounded-xl ${iconBg} flex-shrink-0`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest truncate">{title}</p>
      <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1 truncate">{value}</h2>
      {detail && <p className="text-xs mt-1 text-gray-500 font-medium truncate">{detail}</p>}
    </div>
  </div>
);

const ReservationItem = ({ image, title, date, renter, status, details, handleRoute, t }) => (
  <div className="flex space-x-4 py-4 border-b border-gray-50 last:border-b-0 group">
    <div className="relative shrink-0">
      <img
        src={image}
        alt={title}
        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-gray-100 shadow-sm"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/100x100/F3F4F6/9CA3AF?text=Trailer";
        }}
      />
      {status && (
        <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-md text-[8px] font-bold bg-white text-gray-900 shadow-sm border border-gray-100 uppercase tracking-tighter sm:hidden">
          {t(status)}
        </span>
      )}
    </div>
    <div className="flex-grow min-w-0 pt-1">
      <div className="flex justify-between items-start mb-1">
        <p className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-600 transition">{title}</p>
      </div>
      <p className="text-xs text-gray-500 mb-2 font-medium">{date}</p>
      <div className="flex items-center text-xs text-gray-600 font-semibold mb-3">
        <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center mr-2">
          <FaUserCircle className="text-blue-500" />
        </div>
        <span className="truncate">{renter}</span>
      </div>
      <div className="flex items-center justify-between">
        {status && (
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold bg-gray-50 text-gray-600 uppercase tracking-wider">
            {t(status)}
          </span>
        )}
        <button onClick={handleRoute} className="text-blue-600 text-xs font-bold hover:underline ml-auto">
          {details}
        </button>
      </div>
    </div>
  </div>
);

const RevenueChart = ({ t }) => (
  <div className="w-full h-64 p-4">
    <svg viewBox="0 0 500 200" className="w-full h-full" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke="#3B82F6"
        strokeWidth="3"
        points="0,170 80,100 160,130 240,80 320,150 400,50 480,140"
      />
      <polyline
        fill="none"
        stroke="#F97316"
        strokeWidth="3"
        points="0,120 80,150 160,110 240,130 320,100 400,90 480,110"
      />
    </svg>

    <div className="flex justify-center space-x-6 text-sm mt-4">
      <div className="flex items-center">
        <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
        {t("revenue")}
      </div>
      <div className="flex items-center">
        <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
        {t("targetLabel")}
      </div>
    </div>
  </div>
);

export default function App() {
  const [data, setData] = useState(null);
  const nav = useNavigate();

  const lang = localStorage.getItem("lang") || "fr";
  const t = (key) => dashboardTranslations[lang]?.[key] || key;

  useEffect(() => {
    axios
      .get(`${config.baseUrl}/account/details/${localStorage.getItem("userId")}`)
      .then(res => setData(res?.data?.data));
  }, []);

  const amount =
    data?.booking?.filter(i => i?.status === "completed")
      .reduce((a, c) => a + c?.price, 0) || 0;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">{t("welcome")}</h1>
        <p className="text-gray-500 mt-2 font-medium">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <KpiCard title={t("totalEarnings")} value={`$${amount}`} detail={t("vsLastMonth")} icon={IoWalletOutline} iconBg="bg-blue-50" iconColor="text-blue-600" />
        <KpiCard title={t("ytd")} value={`$${amount}`} detail={t("target")} icon={FaCalendarAlt} iconBg="bg-indigo-50" iconColor="text-indigo-600" />
        <KpiCard title={t("activeTrailers")} value={`${data?.trailer?.length || 0} ${t("units")}`} detail={t("allListings")} icon={FaTruck} iconBg="bg-green-50" iconColor="text-green-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-900">{t("revenueOverview")}</h2>
            <button className="text-xs font-bold text-gray-500 flex items-center bg-gray-50 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition">
              {t("monthly")} <FaChevronDown className="ml-2 text-[10px]" />
            </button>
          </div>
          <RevenueChart t={t} />
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 h-[30rem] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">{t("reservations")}</h2>
            <Link to="/seller/dashboard/reservation" className="text-blue-600 text-sm font-bold hover:underline">
              {t("viewAll")}
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide pr-2 -mr-2">
            {data?.booking?.length > 0 ? (
              data.booking.map(i => (
                <ReservationItem
                  key={i._id}
                  image={i?.trailerId?.images[0]}
                  title={i?.trailerId?.title}
                  date={`${i?.startDate} - ${i?.endDate}`}
                  renter={i?.user_id?.name}
                  status={i?.status}
                  details={t("viewDetails")}
                  handleRoute={() => nav("/seller/dashboard/reservation")}
                  t={t}
                />
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <FaCalendarAlt className="text-4xl mb-2" />
                <p className="text-sm font-medium">{t("noBookingsYet")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
