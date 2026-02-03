import AvatarIcon from '../../assets/dashboard/avatar.jpg';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useSidebar } from '../../context/SidebarContext';
import { sidebarTranslations } from '../../i18n/translations';
import { IoNotificationsOutline } from 'react-icons/io5';
import axios from 'axios';
import config from '../../config';
import { useState, useEffect } from 'react';

let face = "https://images.unsplash.com/photo-1624395213043-fa2e123b2656?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFuJTIwZmFjZXxlbnwwfHwwfHx8MA%3D%3D"
const Header = ({ location }) => {
    const { isNavOpen, toggleNav } = useSidebar();

    const lang = localStorage.getItem("lang") || "fr";
    const t = sidebarTranslations[lang] || sidebarTranslations.fr;

    const pageTitle = t[location] || (location === "home" || !location ? t.dashboard : location.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "));
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

                    <h1 className="text-xl font-black text-gray-900 tracking-tight capitalize">
                        {pageTitle}
                    </h1>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <button className="p-2.5 text-gray-500 hover:bg-gray-50 hover:text-blue-600 rounded-xl transition relative group">
                        <IoNotificationsOutline className="text-2xl" />
                    </button>

                    <div className="p-1 border-2 border-gray-100 rounded-xl hover:border-blue-200 transition cursor-pointer">
                        <img
                            src={face}
                            alt="Admin Profile"
                            className="w-8 h-8 rounded-[10px] object-cover"
                        />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header