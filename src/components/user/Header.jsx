import AvatarIcon from '../../assets/dashboard/avatar.jpg';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useSidebar } from '../../context/SidebarContext';
import { IoMailOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GoHome } from 'react-icons/go';
import { IoChevronForwardSharp } from "react-icons/io5";
import { BiSearchAlt } from 'react-icons/bi';
import avatar from '../../assets/avatar.png'
import { sidebarTranslations } from '../../i18n/translations';
import axios from 'axios';
import config from '../../config';

const Header = () => {
    const location = useLocation().pathname.split("/")[3]
    const { isNavOpen, toggleNav } = useSidebar();

    const lang = localStorage.getItem("lang") || "fr";
    const t = sidebarTranslations[lang] || sidebarTranslations.fr;

    const pageTitle = t[location] || (location ? location.charAt(0).toUpperCase() + location.slice(1) : t.dashboard);
    const [unreadCount, setUnreadCount] = useState(0);
    const userId = localStorage.getItem("userId");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!userId) return;
            try {
                const res = await axios.get(`${config.baseUrl}/notification/user/${userId}`);
                const unread = res.data.data.filter(n => !n.isRead).length;
                setUnreadCount(unread);
            } catch (error) {
                console.error("Error fetching notifications", error);
            }
        };
        fetchNotifications();
        
        // Listen for manual updates (like Mark all as read)
        window.addEventListener('notificationsUpdated', fetchNotifications);
        
        const interval = setInterval(fetchNotifications, 30000);
        return () => {
            clearInterval(interval);
            window.removeEventListener('notificationsUpdated', fetchNotifications);
        };
    }, [userId]);


    return (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => toggleNav(!isNavOpen)}
                        className="lg:hidden p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 active:scale-95 transition"
                    >
                        <GiHamburgerMenu className="text-xl" />
                    </button>

                    <div className="hidden sm:flex items-center gap-2 text-sm font-bold">
                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                            <GoHome className="text-lg" />
                        </div>
                        <IoChevronForwardSharp className="text-gray-300" />
                        <span className="text-gray-900 tracking-tight">{pageTitle}</span>
                    </div>

                    <h1 className="sm:hidden text-lg font-black text-gray-900 tracking-tight">{pageTitle}</h1>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="hidden md:flex items-center bg-gray-50 border border-transparent focus-within:bg-white focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 rounded-2xl px-4 py-2.5 w-64 lg:w-80 transition duration-300">
                        <BiSearchAlt className="text-gray-400 text-lg mr-2" />
                        <input
                            type="text"
                            placeholder={t.searchPlaceholder}
                            className="bg-transparent border-none outline-none text-sm font-medium text-gray-900 w-full placeholder:text-gray-400"
                        />
                    </div>

                    <div className="flex items-center gap-1 sm:gap-3">
                        <button className="md:hidden p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition">
                            <BiSearchAlt className="text-xl" />
                        </button>
                        <Link
                            to="/user/dashboard/notification"
                            className="relative group flex items-center justify-center transition active:scale-95"
                        >
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md group-hover:bg-blue-700 transition duration-300">
                                <IoMailOutline className="text-xl" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </div>
                        </Link>
                        <Link
                            to="/user/dashboard/profile"
                            className="p-1 border-2 border-gray-100 rounded-xl hover:border-blue-200 transition"
                        >
                            <div className="w-8 h-8 rounded-[10px] bg-blue-50 flex items-center justify-center font-bold text-blue-600 text-xs uppercase">
                                HP
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header