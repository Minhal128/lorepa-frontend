import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiBell, FiCheck, FiMail, FiUploadCloud, FiTruck, FiCalendar, FiLock, FiChevronRight, FiChevronDown, FiAlertTriangle, FiExternalLink, FiHeadphones } from 'react-icons/fi';
import Logo from '../assets/logo.svg';
import Avatar from '../assets/avatar.png';
import { fetchOnboarding } from '../helpers/onboarding';
import { onboardingTranslations } from './Auth/translation/onboardingTranslations';

const STEP_META = [
  { key: 'accountCreated', icon: FiCheck },
  { key: 'emailVerified', icon: FiMail },
  { key: 'documentsUploaded', icon: FiUploadCloud, cta: 'upload' },
  { key: 'trailerListed', icon: FiTruck, cta: 'list' },
  { key: 'firstRental', icon: FiCalendar },
];

const OnboardingPage = () => {
  const nav = useNavigate();
  const userId = localStorage.getItem('userId');
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'fr');
  const t = onboardingTranslations[lang] || onboardingTranslations.fr;

  const [data, setData] = useState({ percent: 20, step: 1, steps: {}, role: localStorage.getItem('role') || 'renter', name: '' });

  useEffect(() => {
    const onLang = () => setLang(localStorage.getItem('lang') || 'fr');
    window.addEventListener('storage', onLang);
    return () => window.removeEventListener('storage', onLang);
  }, []);

  useEffect(() => {
    if (!userId) {
      nav('/login');
      return;
    }
    fetchOnboarding(userId)
      .then((payload) => setData((prev) => ({ ...prev, ...payload })))
      .catch(() => toast.error(t.loadFailed));
  }, [userId]);

  const isOwner = data.role === 'owner';
  const dashboard = isOwner ? '/seller/dashboard' : '/user/dashboard';

  const ctaPath = (cta) => {
    if (cta === 'upload') return `${dashboard}/profile?tab=documents`;
    if (cta === 'list') return isOwner ? '/seller/dashboard/listing' : '/trailers';
    return `${dashboard}/home`;
  };

  const statusOf = (index) => {
    if (data.steps?.[STEP_META[index].key]) return 'done';
    return index + 1 === data.step ? 'current' : 'locked';
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#c7dbff] via-[#e5edff] to-[#dbe7ff] px-3 py-4 sm:px-6 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border border-white/60 bg-white/60 shadow-[0_20px_60px_-20px_rgba(37,99,235,0.35)] backdrop-blur-2xl sm:rounded-[28px]"
      >
        {/* Header */}
        <header className="flex items-center justify-between gap-3 border-b border-white/60 bg-white/70 px-4 py-3 backdrop-blur-xl sm:px-6 sm:py-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={Logo} alt="Lorepa" className="h-7 sm:h-8" />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => nav(`${dashboard}/notification`)}
              aria-label={t.notifications}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/70 bg-white/80 text-gray-600 shadow-sm transition hover:bg-white active:scale-95"
            >
              <FiBell className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => nav(`${dashboard}/profile`)}
              className="flex items-center gap-2 rounded-full border border-white/70 bg-white/80 py-1.5 pl-1.5 pr-2.5 shadow-sm transition hover:bg-white sm:pr-3"
            >
              <img src={data.profilePicture || Avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
              <span className="hidden max-w-[120px] truncate text-sm font-semibold text-gray-800 sm:block">{data.name || t.you}</span>
              <FiChevronDown className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-5 p-4 sm:p-6 lg:grid-cols-3 lg:gap-6 lg:p-8">
          {/* Left: progress + steps */}
          <div className="lg:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">{t.title} 👋</h1>
                <p className="mt-1.5 max-w-md text-sm text-gray-600">{isOwner ? t.subtitleOwner : t.subtitleRenter}</p>
              </div>
              <div className="flex items-center gap-2 self-start rounded-xl border border-white/70 bg-white/80 px-3 py-2.5 text-sm text-gray-700 shadow-sm backdrop-blur">
                <span>{t.profileIs} <b className="text-gray-900">{data.percent}%</b> {t.complete}</span>
                {data.percent < 100 && <FiAlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="h-6 w-full overflow-hidden rounded-full border border-white/70 bg-white/70 shadow-inner backdrop-blur">
                <div
                  style={{ width: `${data.percent}%` }}
                  className="flex h-full items-center justify-end rounded-full bg-gradient-to-r from-blue-600 to-blue-500 pr-2 text-[11px] font-bold text-white transition-[width] duration-700 ease-out"
                >
                  {data.percent >= 15 && `${data.percent}%`}
                </div>
              </div>
              <div className="mt-1.5 flex justify-between px-0.5 text-[10px] font-medium text-gray-500 sm:text-xs">
                {['0%', '25%', '50%', '75%', '100%'].map((tick) => <span key={tick}>{tick}</span>)}
              </div>
            </div>

            {/* Steps */}
            <ul className="mt-6 space-y-3">
              {STEP_META.map(({ key, icon: Icon, cta }, index) => {
                const status = statusOf(index);
                return (
                  <motion.li
                    key={key}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index, duration: 0.35 }}
                    className={`flex flex-wrap items-center gap-3 rounded-2xl border p-3 backdrop-blur-xl transition sm:gap-4 sm:p-4 ${
                      status === 'current'
                        ? 'border-blue-300 bg-blue-50/70 shadow-[0_8px_24px_-12px_rgba(37,99,235,0.6)]'
                        : 'border-white/70 bg-white/70 shadow-sm'
                    } ${status === 'locked' ? 'opacity-70' : ''}`}
                  >
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-base font-bold ${status === 'locked' ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-900 shadow-sm'}`}>
                      {index + 1}
                    </span>
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${status === 'locked' ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-600'}`}>
                      <Icon className="h-5 w-5" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className={`font-bold ${status === 'current' ? 'text-blue-700' : 'text-gray-900'}`}>{t.steps[key].title}</p>
                      <p className="text-xs text-gray-500 sm:text-sm">{t.steps[key].desc}</p>
                    </div>

                    <div className="flex w-full shrink-0 items-center justify-between gap-3 sm:w-auto sm:justify-end">
                      {status === 'done' && (
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-green-600">
                          {t.completed}
                          <FiCheck className="h-5 w-5 rounded-full bg-green-100 p-1" />
                        </span>
                      )}
                      {status === 'current' && (
                        <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">{t.inProgress}</span>
                      )}
                      {status === 'locked' && (
                        <span className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-500">
                          <FiLock className="h-3 w-3" /> {t.locked}
                        </span>
                      )}

                      {cta && status !== 'done' && (
                        <button
                          type="button"
                          disabled={status === 'locked'}
                          onClick={() => nav(ctaPath(cta))}
                          className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold transition active:scale-95 sm:px-4 ${
                            status === 'current'
                              ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                              : 'cursor-not-allowed border border-gray-200 bg-white/80 text-gray-500'
                          }`}
                        >
                          {cta === 'upload' ? t.uploadNow : t.listTrailer}
                          <FiChevronRight className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </ul>

            <button type="button" onClick={() => nav(`${dashboard}/home`)} className="mt-5 text-sm font-semibold text-blue-600 hover:underline">
              {t.skip} →
            </button>
          </div>

          {/* Right: benefits, tip, help */}
          <aside className="space-y-4 lg:space-y-5">
            <div className="rounded-2xl border border-white/70 bg-white/70 p-5 text-center shadow-sm backdrop-blur-xl">
              <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg">
                <FiCheck className="h-7 w-7" />
              </div>
              <h2 className="text-lg font-extrabold text-gray-900">{t.benefitsTitle}</h2>
              <ul className="mt-4 space-y-3 text-left text-sm text-gray-700">
                {t.benefits.map((benefit) => (
                  <li key={benefit.text} className="flex items-start gap-2.5">
                    <span aria-hidden="true">{benefit.emoji}</span>
                    <span>{benefit.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
              <p className="flex items-center gap-2 font-bold text-gray-900">💡 {t.tipTitle}</p>
              <p className="mt-2 text-sm text-gray-600">{t.tipBody}</p>
            </div>

            <div className="rounded-2xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur-xl">
              <p className="font-bold text-gray-900">{t.helpTitle}</p>
              <p className="mt-1 text-sm text-gray-600">{t.helpBody}</p>
              <Link
                to="/contact"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-blue-600 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                <FiHeadphones className="h-4 w-4" /> {t.contactSupport}
              </Link>
              <Link to="/faq" className="mt-3 flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-blue-600">
                {t.checkFaq} <FiExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </aside>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;
