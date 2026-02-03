import AvatarIcon from '../../assets/dashboard/avatar.jpg';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useSidebar } from '../../context/SidebarContext';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
    const [hasUnread, setHasUnread] = useState(false);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!userId) return;
            try {
                const res = await axios.get(`${config.baseUrl}/notification/user/${userId}`);
                const unread = res.data.data.some(n => !n.isRead);
                setHasUnread(unread);
            } catch (error) {
                console.error("Error fetching notifications", error);
            }
        };
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
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
                            placeholder="Rechercher..."
                            className="bg-transparent border-none outline-none text-sm font-medium text-gray-900 w-full placeholder:text-gray-400"
                        />
                    </div>

                    <div className="flex items-center gap-1 sm:gap-3">
                        <button className="md:hidden p-2.5 text-gray-500 hover:bg-gray-50 rounded-xl transition">
                            <BiSearchAlt className="text-xl" />
                        </button>
                        <Link
                            to="/user/dashboard/notification"
                            className="p-2.5 text-gray-500 hover:bg-gray-50 hover:text-blue-600 rounded-xl transition relative group"
                        >
                            <IoMdNotificationsOutline className="text-2xl" />
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