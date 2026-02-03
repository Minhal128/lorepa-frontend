import React, { useEffect, useRef, useState } from 'react';
import { adminNav } from '../../../constants/sidebarData';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoLogOut } from 'react-icons/io5';
import { useSidebar } from '../../../context/SidebarContext';
import { RxCross2 } from 'react-icons/rx';
import Logo from '../../../assets/logo.svg'
import { sidebarTranslations } from '../../../i18n/translations';

const Sidebar = () => {
  const location = useLocation().pathname.split("/")[3];
  const { isNavOpen, toggleNav } = useSidebar();
  const sidebarRef = useRef(null);
  const nav = useNavigate();

  const [lang, setLang] = useState(
    () => localStorage.getItem("lang") || "fr"
  );

  const t = sidebarTranslations[lang];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="lg:block hidden w-[280px] h-screen bg-blue-600 sticky top-0 border-r border-gray-100 overflow-y-auto scrollbar-hide">
        <div className="p-8">
          <div onClick={() => nav("/")} className="cursor-pointer transition-transform active:scale-95">
            <h2 className="text-2xl font-black text-white tracking-widest">LOREPA</h2>
          </div>
        </div>

        <div className="mt-4 px-4 space-y-6">
          <div>
            <p className="px-4 text-[10px] font-black text-white/50 uppercase tracking-widest mb-4">{t.menu}</p>
            <div className="space-y-1">
              {adminNav?.map((i) => (
                <Link
                  to={`/admin/dashboard/${i.link}`}
                  key={i.id}
                  className={`flex items-center gap-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${location === i.link
                      ? "bg-white text-blue-600 shadow-xl shadow-blue-700/20"
                      : "text-blue-100 hover:bg-white/10"
                    }`}
                >
                  <div className={`text-xl transition-transform group-hover:scale-110 ${location === i.link ? "text-blue-600" : "text-blue-100"}`}>
                    {i.icon}
                  </div>
                  <span className="text-sm font-bold tracking-tight">{t[i.key]}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/10">
            <button
              onClick={() => { nav("/admin/login") }}
              className="w-full flex items-center gap-x-3 px-4 py-3.5 rounded-2xl text-blue-100 hover:bg-red-500 hover:text-white transition-all duration-300 group"
            >
              <div className="text-xl group-hover:rotate-12 transition-transform"><IoLogOut /></div>
              <span className="text-sm font-bold tracking-tight">{t.logout}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[90] transition-opacity duration-300 ${isNavOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={toggleNav}
      />

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-[280px] bg-blue-600 z-[100] shadow-2xl transition-transform duration-500 ease-out border-r border-white/10 flex flex-col ${isNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex items-center justify-between border-b border-white/10">
          <h2 className="text-xl font-black text-white tracking-widest" onClick={() => nav("/")}>LOREPA</h2>
          <button
            onClick={toggleNav}
            className="p-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition"
          >
            <RxCross2 className="text-xl" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-8 space-y-8 scrollbar-hide">
          <div>
            <p className="px-4 text-[10px] font-black text-white/50 uppercase tracking-widest mb-4">{t.menu}</p>
            <div className="space-y-1">
              {adminNav?.map((i) => (
                <Link
                  to={`/admin/dashboard/${i.link}`}
                  key={i.id}
                  onClick={toggleNav}
                  className={`flex items-center gap-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${location === i.link
                      ? "bg-white text-blue-600 shadow-xl"
                      : "text-blue-100 active:bg-white/10"
                    }`}
                >
                  <div className={`text-xl ${location === i.link ? "text-blue-600" : "text-blue-100"}`}>
                    {i.icon}
                  </div>
                  <span className="text-sm font-bold tracking-tight">{t[i.key]}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/10">
            <button
              onClick={() => {
                nav("/admin/login");
                toggleNav();
              }}
              className="w-full flex items-center gap-x-3 px-4 py-3.5 rounded-2xl text-blue-100 active:bg-red-500 active:text-white transition-all"
            >
              <div className="text-xl"><IoLogOut /></div>
              <span className="text-sm font-bold tracking-tight">{t.logout}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
