import React from 'react';
import { Link } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import { useOnboardingLock } from '../helpers/onboarding';

const DashboardNavLinks = ({ items, prefix, active, onNavigate, t }) => {
  const { locked, block } = useOnboardingLock();

  return items?.map((i) => {
    const isActive = active === i.link;
    const isLocked = locked(i.link);
    const className = `flex items-center gap-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 w-full text-left ${
      isActive ? 'bg-white text-blue-600 shadow-xl shadow-blue-700/20' : 'text-blue-100 hover:bg-white/10'
    }`;
    const inner = (
      <>
        <div className={`text-xl shrink-0 ${isActive ? 'text-blue-600' : 'text-blue-100'}`}>{i.icon}</div>
        <span className="text-sm font-bold tracking-tight flex-1">{t[i.key]}</span>
        {isLocked && <FiLock className="w-4 h-4 shrink-0 opacity-90" aria-hidden />}
      </>
    );

    if (isLocked) {
      return (
        <button key={i.id} type="button" onClick={block} className={className}>
          {inner}
        </button>
      );
    }

    return (
      <Link key={i.id} to={`${prefix}/${i.link}`} onClick={onNavigate} className={className}>
        {inner}
      </Link>
    );
  });
};

export default DashboardNavLinks;
