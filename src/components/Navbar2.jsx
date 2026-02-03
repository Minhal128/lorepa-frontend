import axios from 'axios';
import { useRef, useEffect, useState } from 'react';
import config from '../config';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CiCalculator1, CiGlobe } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { CiSearch } from "react-icons/ci";
import Logo from "../assets/logo.svg";
import { IoCallOutline, IoKey } from "react-icons/io5";
import { BiTransfer } from 'react-icons/bi';
import { FiSearch } from 'react-icons/fi';

const navBar2Translations = {
    en: { where: "Where", from: "From", until: "Until", login: "Login", signup: "Signup", logout: "Logout", becomeAHost: "Become a host", whoAreWe: "Who are we", contactUs: "Contact us", calculator: "Calculator", montrealPlaceholder: "Montreal", turoVsLorepa: "Turo vs. Lorepa", dashboard: "Dashboard", search: "Search" },
    es: { where: "¿Dónde?", from: "Desde", until: "Hasta", login: "Iniciar sesión", signup: "Registrarse", logout: "Cerrar sesión", becomeAHost: "Conviértete en anfitrión", whoAreWe: "¿Quiénes somos?", contactUs: "Contáctanos", calculator: "Calculadora", montrealPlaceholder: "Montreal", turoVsLorepa: "Turo vs. Lorepa", dashboard: "Panel de Control", search: "Buscar" },
    cn: { where: "地点", from: "从", until: "到", login: "登录", signup: "注册", logout: "注销", becomeAHost: "成为房东", whoAreWe: "我们是谁", contactUs: "联系我们", calculator: "计算器", montrealPlaceholder: "蒙特利尔", turoVsLorepa: "Turo 对比 Lorepa", dashboard: "仪表板", search: "搜索" },
    fr: { where: "Où", from: "Du", until: "Jusqu'à", login: "Se connecter", signup: "S'inscrire", logout: "Se déconnecter", becomeAHost: "Devenir hôte", whoAreWe: "Qui sommes-nous", contactUs: "Nous contacter", calculator: "Calculatrice", montrealPlaceholder: "Montréal", turoVsLorepa: "Turo vs. Lorepa", dashboard: "Tableau de Bord", search: "Rechercher" }
};

const useQuery = () => new URLSearchParams(useLocation().search);

const Navbar2 = () => {
    const query = useQuery();
    const nav = useNavigate();
    const wrapperRef = useRef(null);

    const cityFromQuery = query.get('city')?.toLowerCase() || '';
    const fromDateQuery = query.get('fromDate') || '';
    const fromTimeQuery = query.get('fromTime') || '';
    const untilDateQuery = query.get('untilDate') || '';
    const untilTimeQuery = query.get('untilTime') || '';

    const [location, setLocation] = useState(cityFromQuery);
    const [fromDate, setFromDate] = useState(fromDateQuery);
    const [fromTime, setFromTime] = useState(fromTimeQuery);
    const [untilDate, setUntilDate] = useState(untilDateQuery);
    const [untilTime, setUntilTime] = useState(untilTimeQuery);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    const isLogin = localStorage.getItem("userId");

    const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');
    const [translations, setTranslations] = useState(navBar2Translations[language] || navBar2Translations.fr);
    const [showLanguages, setShowLanguages] = useState(false);
    const [showNav, setshowNav] = useState(false);

    useEffect(() => {
        const handleStorageChange = () => {
            const storedLang = localStorage.getItem('lang') || 'en';
            setLanguage(storedLang);
            setTranslations(navBar2Translations[storedLang] || navBar2Translations.fr);
        };
        window.addEventListener('storage', handleStorageChange);
        handleStorageChange();
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleLanguageChange = (langSymbol) => {
        setLanguage(langSymbol);
        localStorage.setItem("lang", langSymbol);
        setShowLanguages(false);
        window.location.reload();
    };

    const fetchSuggestions = async (inputText) => {
        if (!inputText) { setSuggestions([]); return; }
        try {
            const res = await axios.get(`${config.baseUrl.replace("/api/v1", "")}/api/autocomplete`, { params: { input: inputText } });
            if (res.data.status === "OK") {
                const filtered = res.data.predictions.filter(pred =>
                    pred.types.includes("locality") || pred.types.includes("country") || pred.types.includes("administrative_area_level_1")
                );
                setSuggestions(filtered);
                setShowSuggestions(true);
            } else { setSuggestions([]); setShowSuggestions(false); }
        } catch (error) { console.error("Error fetching suggestions:", error); }
    };

    const handleSelect = (item) => { setLocation(item.description); setSuggestions([]); setShowSuggestions(false); };

    const handleSearch = () => {
        nav(`/trailers?city=${location}&fromDate=${fromDate}&fromTime=${fromTime}&untilDate=${untilDate}&untilTime=${untilTime}`);
        setShowMobileSearch(false);
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.nav-dropdown')) {
                setShowLanguages(false);
                setshowNav(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <nav className="border-b border-[#F1F1F1] bg-white sticky top-0 z-50">
                <div className="mobile-px">
                    <div className="flex items-center justify-between h-14 sm:h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link to={"/"} className="text-xl">
                                <img src={Logo} alt="Lorepa" className='h-16 sm:h-20 md:h-28' />
                            </Link>
                        </div>

                        {/* Desktop Search Bar */}
                        <div className="hidden lg:flex items-center gap-x-3 flex-1 justify-center max-w-2xl mx-4">
                            <div className='flex items-center gap-x-2 border border-[#C3C3C3] p-2 rounded-3xl relative flex-1' ref={wrapperRef}>
                                <label htmlFor="where" className="text-xs text-[#2563EB] whitespace-nowrap">{translations.where}</label>
                                <input
                                    type="text"
                                    id="where"
                                    value={location}
                                    onChange={(e) => { setLocation(e.target.value); fetchSuggestions(e.target.value); }}
                                    className="block w-full text-sm text-gray-900 border-none focus:ring-0 focus:outline-none p-0"
                                    placeholder={translations.montrealPlaceholder}
                                />
                                {showSuggestions && suggestions.length > 0 && (
                                    <ul className="absolute z-50 top-full left-0 right-0 bg-white shadow-md rounded-md mt-1 max-h-60 overflow-y-auto">
                                        {suggestions.map((item, index) => (
                                            <li key={index} onClick={() => handleSelect(item)} className="p-2 hover:bg-gray-100 cursor-pointer text-sm">
                                                {item.description}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className='flex items-center gap-x-2 border border-[#C3C3C3] p-2 rounded-3xl'>
                                <label htmlFor="fromDate" className="text-xs text-[#2563EB] whitespace-nowrap">{translations.from}</label>
                                <div className="flex items-center">
                                    <input type="text" id="fromDate" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
                                        className="block w-20 text-sm text-gray-900 border-none focus:ring-0 focus:outline-none p-0" placeholder="Date" />
                                    <input type="time" id="fromTime" value={fromTime} onChange={(e) => setFromTime(e.target.value)}
                                        className="block w-16 text-sm text-gray-900 border-none focus:ring-0 focus:outline-none p-0 ml-1" />
                                </div>
                            </div>

                            <div className='flex items-center gap-x-2 border border-[#C3C3C3] p-2 rounded-3xl'>
                                <label htmlFor="untilDate" className="text-xs text-[#2563EB] whitespace-nowrap">{translations.until}</label>
                                <div className="flex items-center">
                                    <input type="text" id="untilDate" value={untilDate} onChange={(e) => setUntilDate(e.target.value)}
                                        className="block w-20 text-sm text-gray-900 border-none focus:ring-0 focus:outline-none p-0" placeholder="Date" />
                                    <input type="time" id="untilTime" value={untilTime} onChange={(e) => setUntilTime(e.target.value)}
                                        className="block w-16 text-sm text-gray-900 border-none focus:ring-0 focus:outline-none p-0 ml-1" />
                                </div>
                            </div>

                            <button onClick={handleSearch}
                                className="bg-[#2563EB] text-white p-2.5 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                                <CiSearch className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Mobile Search Button */}
                        <button
                            onClick={() => setShowMobileSearch(true)}
                            className="lg:hidden flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            <FiSearch className="h-4 w-4" />
                            <span className="hidden xs:inline">{translations.search}</span>
                        </button>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-x-2 sm:gap-x-4 nav-dropdown relative">
                            <button
                                onClick={() => { setShowLanguages(!showLanguages); setshowNav(false); }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Change language"
                            >
                                <CiGlobe className='h-5 w-5' />
                            </button>
                            <div className="flex items-center gap-x-2 bg-[#F1F1F1] rounded-full p-1.5 sm:p-2">
                                <button
                                    onClick={() => { setshowNav(!showNav); setShowLanguages(false); }}
                                    className='p-1 hover:bg-gray-200 rounded-full transition-colors'
                                    aria-label="Open menu"
                                >
                                    <RxHamburgerMenu className='h-4 w-4 sm:h-5 sm:w-5' />
                                </button>
                                <FaRegUserCircle className='h-5 w-5 sm:h-6 sm:w-6 text-gray-600' />
                            </div>

                            {/* Language Dropdown */}
                            {showLanguages && (
                                <div className='absolute z-50 right-0 top-full mt-2 w-40 sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden'>
                                    <div className='py-1'>
                                        {[["en", "English"], ["es", "Español"], ["cn", "中文"], ["fr", "Français"]].map(([code, name]) => (
                                            <button
                                                key={code}
                                                onClick={() => handleLanguageChange(code)}
                                                className='w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors'
                                            >
                                                {name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Navigation Dropdown */}
                            {showNav && (
                                <div className='absolute z-50 right-0 top-full mt-2 w-56 sm:w-64 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden'>
                                    <div className='py-2'>
                                        {isLogin && (
                                            <Link to={localStorage.getItem("role") === "owner" ? "/seller/dashboard/home" : "/user/dashboard/home"}
                                                className='block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors font-medium'>
                                                {translations.dashboard}
                                            </Link>
                                        )}
                                        {!isLogin && (
                                            <>
                                                <Link to="/login" className='block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors font-medium'>
                                                    {translations.login}
                                                </Link>
                                                <Link to="/register" className='block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors'>
                                                    {translations.signup}
                                                </Link>
                                            </>
                                        )}
                                        {isLogin && (
                                            <button onClick={() => { localStorage.removeItem("userId"); window.location.reload() }}
                                                className='w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors'>
                                                {translations.logout}
                                            </button>
                                        )}
                                        <div className='border-t border-gray-100 mt-2 pt-2'>
                                            <Link to="/who" className='flex items-center gap-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors'>
                                                <IoKey className="h-4 w-4" />{translations.whoAreWe}
                                            </Link>
                                            <Link to="/contact" className='flex items-center gap-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors'>
                                                <IoCallOutline className="h-4 w-4" />{translations.contactUs}
                                            </Link>
                                            <Link to="/calculator" className='flex items-center gap-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors'>
                                                <CiCalculator1 className="h-4 w-4" />{translations.calculator}
                                            </Link>
                                            <Link to="/compare" className='flex items-center gap-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors'>
                                                <BiTransfer className="h-4 w-4" />{translations.turoVsLorepa}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Search Modal */}
            {showMobileSearch && (
                <div className="fixed inset-0 z-50 bg-white flex flex-col lg:hidden">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold">{translations.search}</h2>
                        <button
                            onClick={() => setShowMobileSearch(false)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <RxCross2 className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* Location */}
                        <div className="mobile-form-group">
                            <label className="mobile-form-label">{translations.where}</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => { setLocation(e.target.value); fetchSuggestions(e.target.value); }}
                                    className="mobile-input"
                                    placeholder={translations.montrealPlaceholder}
                                />
                                {showSuggestions && suggestions.length > 0 && (
                                    <ul className="absolute z-50 top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-1 max-h-48 overflow-y-auto border border-gray-200">
                                        {suggestions.map((item, index) => (
                                            <li key={index} onClick={() => handleSelect(item)}
                                                className="p-3 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-0">
                                                {item.description}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* From Date/Time */}
                        <div className="mobile-form-group">
                            <label className="mobile-form-label">{translations.from}</label>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="mobile-input"
                                />
                                <input
                                    type="time"
                                    value={fromTime}
                                    onChange={(e) => setFromTime(e.target.value)}
                                    className="mobile-input"
                                />
                            </div>
                        </div>

                        {/* Until Date/Time */}
                        <div className="mobile-form-group">
                            <label className="mobile-form-label">{translations.until}</label>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="date"
                                    value={untilDate}
                                    onChange={(e) => setUntilDate(e.target.value)}
                                    className="mobile-input"
                                />
                                <input
                                    type="time"
                                    value={untilTime}
                                    onChange={(e) => setUntilTime(e.target.value)}
                                    className="mobile-input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Search Button */}
                    <div className="p-4 border-t border-gray-200 pb-safe-bottom">
                        <button
                            onClick={handleSearch}
                            className="mobile-btn-primary w-full"
                        >
                            <FiSearch className="h-5 w-5 mr-2" />
                            {translations.search}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar2;

