import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CiCalculator1, CiGlobe } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import Logo from "../assets/logo.svg";
import { IoCallOutline, IoKey } from "react-icons/io5";
import { BiTransfer } from 'react-icons/bi';

const navBarTransaltions = {
  en: { login: "Login", signup: "Signup", logout: "Logout", whoAreWe: "Who are we", contactUs: "Contact us", calculator: "Calculator", turoVsLorepa: "Turo vs. Lorepa", dashboard: "Dashboard" },
  es: { login: "Iniciar sesión", signup: "Registrarse", logout: "Cerrar sesión", whoAreWe: "¿Quiénes somos?", contactUs: "Contáctanos", calculator: "Calculadora", turoVsLorepa: "Turo vs. Lorepa", dashboard: "Panel de Control" },
  cn: { login: "登录", signup: "注册", logout: "注销", whoAreWe: "我们是谁", contactUs: "联系我们", calculator: "计算器", turoVsLorepa: "Turo 对比 Lorepa", dashboard: "仪表板" },
  fr: { login: "Se connecter", signup: "S'inscrire", logout: "Se déconnecter", whoAreWe: "Qui sommes-nous", contactUs: "Nous contacter", calculator: "Calculatrice", turoVsLorepa: "Turo vs. Lorepa", dashboard: "Tableau de Bord" }
};

const Navbar = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [showLanguages, setShowLanguages] = useState(false);
  const [showNav, setshowNav] = useState(false);
  const isLogin = localStorage.getItem("userId");

  const [translations, setTranslations] = useState(() => {
    const storedLang = localStorage.getItem('lang');
    return navBarTransaltions[storedLang] || navBarTransaltions.fr;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const storedLang = localStorage.getItem('lang');
      setTranslations(navBarTransaltions[storedLang] || navBarTransaltions.fr);
    };

    window.addEventListener('storage', handleStorageChange);
    handleStorageChange();
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLanguageChange = (langSymbol) => {
    localStorage.setItem("lang", langSymbol);
    setShowLanguages(false);
    window.location.reload();
  };

  return (
    <nav className="border-b border-[#F1F1F1] sticky top-0 z-30 bg-white">
      <div className="px-4 sm:px-6 lg:px-8 bg-white">
        <div className="flex items-center justify-between h-28">
          <div className="flex-shrink-0 flex items-center gap-x-2">
            <Link to={"/"} className="text-xl">
              <img
                src={Logo}
                alt="Lorepa Logo"
                className={isHomePage ? 'h-16 sm:h-20 lg:h-24' : 'h-16 sm:h-20 lg:h-24'}
              />
            </Link>
          </div>


          <div className="block relative">
            <div className="ml-4 flex items-center md:ml-6 gap-x-3 sm:gap-x-4">
              <button
                onClick={() => setShowLanguages(!showLanguages)}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Select language"
              >
                <CiGlobe className='w-5 h-5 sm:w-6 sm:h-6' />
              </button>
              <div className="flex items-center gap-x-2 bg-[#F1F1F1] rounded-md p-2">
                <button
                  onClick={() => setshowNav(!showNav)}
                  className="p-1 rounded hover:bg-gray-200 transition-colors"
                  aria-label="Open menu"
                >
                  <RxHamburgerMenu className='w-4 h-4 sm:w-5 sm:h-5' />
                </button>
                {isLogin && (
                  <button className="p-1 rounded hover:bg-gray-200 transition-colors">
                    <FaRegUserCircle className='w-4 h-4 sm:w-5 sm:h-5' />
                  </button>
                )}
              </div>
            </div>

            {showLanguages && (
              <div className='absolute z-10 right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg'>
                <div className='py-1'>
                  <button onClick={() => handleLanguageChange("en")} className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors'>English</button>
                  <button onClick={() => handleLanguageChange("es")} className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors'>Spanish</button>
                  <button onClick={() => handleLanguageChange("cn")} className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors'>Chinese</button>
                  <button onClick={() => handleLanguageChange("fr")} className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors'>French</button>
                </div>
              </div>
            )}

            {showNav && (
              <div className='absolute z-10 right-0 top-full mt-2 w-56 sm:w-64 bg-white border border-gray-200 rounded-md shadow-lg'>
                <div className='py-1'>
                  {isLogin && (
                    <Link
                      to={localStorage.getItem("role") === "owner" ? "/seller/dashboard/home" : "/user/dashboard/home"}
                      className='flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors'
                      onClick={() => setshowNav(false)}
                    >
                      {translations.dashboard}
                    </Link>
                  )}
                  {!isLogin && (
                    <Link
                      to="/login"
                      className='flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors'
                      onClick={() => setshowNav(false)}
                    >
                      {translations.login}
                    </Link>
                  )}
                  {!isLogin && (
                    <Link
                      to="/register"
                      className='flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors'
                      onClick={() => setshowNav(false)}
                    >
                      {translations.signup}
                    </Link>
                  )}
                  {isLogin && (
                    <button
                      onClick={() => {
                        localStorage.removeItem("userId");
                        window.location.reload();
                      }}
                      className='w-full text-left flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors'
                    >
                      {translations.logout}
                    </button>
                  )}
                  <Link
                    to="/who"
                    className='flex items-center gap-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 text-sm transition-colors'
                    onClick={() => setshowNav(false)}
                  >
                    <IoKey className="w-4 h-4" />
                    <span>{translations.whoAreWe}</span>
                  </Link>
                  <Link
                    to="/contact"
                    className='flex items-center gap-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 text-sm transition-colors'
                    onClick={() => setshowNav(false)}
                  >
                    <IoCallOutline className="w-4 h-4" />
                    <span>{translations.contactUs}</span>
                  </Link>
                  <Link
                    to="/calculator"
                    className='flex items-center gap-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 text-sm transition-colors'
                    onClick={() => setshowNav(false)}
                  >
                    <CiCalculator1 className="w-4 h-4" />
                    <span>{translations.calculator}</span>
                  </Link>
                  <Link
                    to="/compare"
                    className='flex items-center gap-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 text-sm transition-colors'
                    onClick={() => setshowNav(false)}
                  >
                    <BiTransfer className="w-4 h-4" />
                    <span>{translations.turoVsLorepa}</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
