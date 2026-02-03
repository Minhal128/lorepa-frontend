import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaMobileAlt, FaBell } from 'react-icons/fa';
import config from '../../../config';
import { userNotificationTranslations } from './translation/userNotificationTranslations';


// --- Custom Toggle Switch ---
const ToggleSwitch = ({ checked, onChange }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
    <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
  </label>
);

// --- Notification Preferences Card ---
const NotificationPreferences = ({ preferences, onToggle, t }) => (
  <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
    <h2 className="text-xl font-bold text-gray-900 mb-8">{t.notificationPreferences}</h2>

    <div className="space-y-8">
      {/* Email */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-blue-50 rounded-lg shrink-0">
            <FaEnvelope className="text-lg text-blue-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-tight">{t.emailNotifications}</p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{t.emailDescription}</p>
          </div>
        </div>
        <ToggleSwitch checked={preferences.email} onChange={() => onToggle('email')} />
      </div>

      {/* SMS */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-blue-50 rounded-lg shrink-0">
            <FaMobileAlt className="text-lg text-blue-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-tight">{t.smsNotifications}</p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{t.smsDescription}</p>
          </div>
        </div>
        <ToggleSwitch checked={preferences.sms} onChange={() => onToggle('sms')} />
      </div>

      {/* In-App */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-blue-50 rounded-lg shrink-0">
            <FaBell className="text-lg text-blue-600" />
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-tight">{t.inAppNotifications}</p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{t.inAppDescription}</p>
          </div>
        </div>
        <ToggleSwitch checked={preferences.inApp} onChange={() => onToggle('inApp')} />
      </div>
    </div>

    <button className="w-full mt-10 py-3.5 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition active:scale-[0.98]">
      {t.savePreferences}
    </button>
  </div>
);

// --- Activity Item ---
const ActivityItem = ({ icon, title, description, time, isNew }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-5 border-b border-gray-50 last:border-b-0 gap-4">
    <div className='flex items-start flex-1 min-w-0'>
      <div className="mr-4 mt-1 shrink-0">
        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-bold text-gray-900 leading-tight truncate">{title}</p>
          {isNew && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0"></span>}
        </div>
        <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
      </div>
    </div>
    <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest sm:ml-4 whitespace-nowrap">
      <span>{time}</span>
    </div>
  </div>
);

// --- Recent Activity List ---
const RecentActivity = ({ activities, t }) => (
  <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
    <h2 className="text-xl font-bold text-gray-900 mb-6">{t.recentActivity}</h2>
    <div className="divide-y divide-gray-50">
      {activities.length > 0 ? (
        activities.map((activity, index) => (
          <ActivityItem key={index} {...activity} />
        ))
      ) : (
        <div className="py-12 text-center text-gray-500 italic">
          Aucune activité récente
        </div>
      )}
    </div>
  </div>
);

// --- Main Component ---
const UserNotification = () => {
  const [preferences, setPreferences] = useState({
    email: true,
    sms: false,
    inApp: true,
  });
  const [activities, setActivities] = useState([]);
  const [t, setT] = useState(() => {
    const lang = localStorage.getItem("lang") || "fr";
    return userNotificationTranslations[lang] || userNotificationTranslations.fr;
  });

  const handleToggle = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const fetchNotifications = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const res = await axios.get(`${config.baseUrl}/notification/user/${userId}`);
      const notifs = res.data.data.map(notif => ({
        icon: <FaBell />,
        title: notif.title,
        description: notif.description,
        time: new Date(notif.createdAt).toLocaleString(),
        isNew: !notif.isRead,
      }));
      setActivities(notifs);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const handleLangChange = () => {
      const lang = localStorage.getItem("lang") || "fr";
      setT(userNotificationTranslations[lang] || userNotificationTranslations.fr);
    };

    window.addEventListener("storage", handleLangChange);
    handleLangChange();

    return () => window.removeEventListener("storage", handleLangChange);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">{t.notifications}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Preferences */}
        <div className="lg:col-span-1">
          <NotificationPreferences preferences={preferences} onToggle={handleToggle} t={t} />
        </div>

        {/* Activity */}
        <div className="lg:col-span-2">
          <RecentActivity activities={activities} t={t} />
        </div>
      </div>
    </div>
  );
};

export default UserNotification;
