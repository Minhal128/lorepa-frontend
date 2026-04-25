import AvatarIcon from '../../assets/dashboard/avatar.jpg';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useSidebar } from '../../context/SidebarContext';
import { sidebarTranslations } from '../../i18n/translations';
import { IoMailOutline } from 'react-icons/io5';
import axios from 'axios';
import config from '../../config';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

let face = "https://images.unsplash.com/photo-1624395213043-fa2e123b2656?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFuJTIwZmFjZXxlbnwwfHwwfHx8MA%3D%3D"
const Header = ({ location }) => {
    const { isNavOpen, toggleNav } = useSidebar();
    const navigate = useNavigate();

    const lang = localStorage.getItem("lang") || "fr";
    const t = sidebarTranslations[lang] || sidebarTranslations.fr;

    const pageTitle = t[location] || (location === "home" || !location ? t.dashboard : location.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "));
    const [unreadCount, setUnreadCount] = useState(0);

    // Admin Session Timeout Check (2 hours)
    useEffect(() => {
        const checkAdminSession = () => {
            const adminExpiry = localStorage.getItem("adminSessionExpiry");
            if (adminExpiry) {
                const expiryTime = parseInt(adminExpiry, 10);
                if (Date.now() > expiryTime) {
                    // Session expired - logout admin
                    localStorage.removeItem("adminLoggedIn");
                    localStorage.removeItem("adminSessionExpiry");
                    navigate("/admin/login");
                }
            }
        };
        
        // Check on mount
        checkAdminSession();
        
        // Check every minute
        const sessionCheckInterval = setInterval(checkAdminSession, 60000);
        
        return () => clearInterval(sessionCheckInterval);
    }, [navigate]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                // Fetch all admin notifications
                const res = await axios.get(`${config.baseUrl}/notification/admin`);
                const count = res.data.data.filter(n => !n.isRead).length;
                setUnreadCount(count);
            } catch (error) {
                console.error("Error fetching notifications", error);
            }
        };
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

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
                        <IoMailOutline className="text-2xl" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
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