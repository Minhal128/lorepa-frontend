import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiBell, FiCheck, FiMail, FiUploadCloud, FiTruck, FiLock, FiChevronRight, FiChevronDown, FiAlertTriangle, FiExternalLink, FiHeadphones, FiShield } from 'react-icons/fi';
import { CiGlobe } from 'react-icons/ci';
import Logo from '../assets/logo.svg';
import AvatarIcon from '../assets/dashboard/avatar.jpg';
import { fetchOnboarding } from '../helpers/onboarding';
import { onboardingTranslations } from './Auth/translation/onboardingTranslations';

const STEP_META = [
  { key: 'accountCreated', icon: FiCheck },
  { key: 'emailVerified', icon: FiMail },
  { key: 'documentsUploaded', icon: FiUploadCloud, cta: 'upload' },
  { key: 'trailerListed', icon: FiTruck, cta: 'list' },
];

const glass = 'border border-white/50 bg-white/55 shadow-[0_8px_32px_-12px_rgba(37,99,235,0.25)] backdrop-blur-xl';
const glassSoft = 'border border-white/40 bg-white/40 shadow-sm backdrop-blur-lg';

const OnboardingPage = () => {
  const nav = useNavigate();
  const userId = localStorage.getItem('userId');
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'fr');
  const [showLanguages, setShowLanguages] = useState(false);
  const t = onboardingTranslations[lang] || onboardingTranslations.fr;

  const [data, setData] = useState({ percent: 20, step: 1, steps: {}, role: localStorage.getItem('role') || 'renter', name: '' });

  useEffect(() => {
    const onLang = () => setLang(localStorage.getItem('lang') || 'fr');
    window.addEventListener('storage', onLang);
    window.addEventListener('app-language-changed', onLang);
    return () => {
      window.removeEventListener('storage', onLang);
      window.removeEventListener('app-language-changed', onLang);
    };
  }, []);

  const handleLanguageChange = (code) => {
    localStorage.setItem('lang', code);
    localStorage.setItem('i18nextLng', code);
    window.dispatchEvent(new CustomEvent('app-language-changed', { detail: { lang: code } }));
    setLang(code);
    setShowLanguages(false);
  };

  useEffect(() => {
    if (!userId) {
      nav('/login');
      return;
    }
    fetchOnboarding(userId)
      .then((payload) => {
        setData((prev) => ({ ...prev, ...payload }));
        if (payload.percent >= 100) {
          const path = payload.role === 'owner' ? '/seller/dashboard/home' : '/user/dashboard/home';
          nav(path, { replace: true });
        }
      })
      .catch(() => toast.error(t.loadFailed));
  }, [userId]);

  const isOwner = data.role === 'owner';
  const dashboard = isOwner ? '/seller/dashboard' : '/user/dashboard';
  const avatarSrc = data.profilePicture?.trim() ? data.profilePicture : AvatarIcon;

  const ctaPath = (cta) => {
    if (cta === 'upload') return `${dashboard}/profile?tab=documents&from=onboarding`;
    if (cta === 'list') return isOwner ? '/seller/dashboard/listing?from=onboarding' : `${dashboard}/profile?from=onboarding`;
    return `${dashboard}/home`;
  };

  const statusOf = (index) => {
    if (data.steps?.[STEP_META[index].key]) return 'done';
    return index + 1 === data.step ? 'current' : 'locked';
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#b8d0ff] via-[#e8efff] to-[#c5daf8] px-3 py-4 sm:px-6 sm:py-8">
      {/* Ambient blobs — glass needs something to blur */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-400/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-1/4 h-80 w-80 rounded-full bg-indigo-300/35 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-sky-300/40 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`relative mx-auto w-full max-w-6xl overflow-hidden rounded-2xl sm:rounded-[28px] ${glass}`}
      >
        {/* Header */}
        <header className="flex items-center justify-between gap-3 border-b border-white/50 bg-white/30 px-4 py-3 backdrop-blur-xl sm:px-6 sm:py-4">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Lorepa" className="h-14 w-auto object-contain sm:h-16 md:h-20" />
          </Link>
          <div className="relative flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setShowLanguages((v) => !v)}
              aria-label="Change language"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/60 bg-white/50 text-gray-600 shadow-sm backdrop-blur-md transition hover:bg-white/80 active:scale-95"
            >
              <CiGlobe className="h-5 w-5" />
            </button>
            {showLanguages && (
              <div className="absolute right-0 top-full z-30 mt-2 w-44 overflow-hidden rounded-xl border border-white/60 bg-white/90 shadow-lg backdrop-blur-xl">
                {[['en', 'English'], ['es', 'Spanish'], ['cn', 'Chinese'], ['fr', 'French']].map(([code, label]) => (
                  <button key={code} type="button" onClick={() => handleLanguageChange(code)} className="w-full px-4 py-2.5 text-left text-sm text-gray-800 hover:bg-white">
                    {label}
                  </button>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => nav(`${dashboard}/notification`)}
              aria-label={t.notifications}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/60 bg-white/50 text-gray-600 shadow-sm backdrop-blur-md transition hover:bg-white/80 active:scale-95"
            >
              <FiBell className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => nav(`${dashboard}/profile`)}
              className="flex items-center gap-2 rounded-full border border-white/60 bg-white/50 py-1.5 pl-1.5 pr-2.5 shadow-sm backdrop-blur-md transition hover:bg-white/80 sm:pr-3"
            >
              <img src={avatarSrc} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-white/70" />
              <span className="hidden max-w-[120px] truncate text-sm font-semibold text-gray-800 sm:block">{data.name || t.you}</span>
              <FiChevronDown className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-5 p-4 sm:p-6 lg:grid-cols-3 lg:gap-6 lg:p-8">
          <div className="lg:col-span-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">{t.title}</h1>
                <p className="mt-1.5 max-w-md text-sm text-gray-600">{isOwner ? t.subtitleOwner : t.subtitleRenter}</p>
              </div>
              <div className="flex items-center gap-1.5 self-start rounded-full border border-amber-200/60 bg-amber-50/70 px-3 py-1.5 text-sm font-medium text-amber-700 backdrop-blur-md">
                <span>{t.profileIs} {data.percent}% {t.complete}</span>
                {data.percent < 100 && <FiAlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />}
              </div>
            </div>

            <div className="mt-6">
              <div className="h-3.5 w-full overflow-hidden rounded-full border border-white/60 bg-white/40 shadow-inner backdrop-blur-md">
                <div
                  style={{ width: `${data.percent}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-[width] duration-700 ease-out"
                />
              </div>
              <div className="mt-1.5 flex justify-between px-0.5 text-[10px] font-medium text-gray-500 sm:text-xs">
                {['0%', '25%', '50%', '75%', '100%'].map((tick) => <span key={tick}>{tick}</span>)}
              </div>
            </div>

            <ul className="mt-6 space-y-3">
              {STEP_META.map(({ key, icon: Icon, cta }, index) => {
                const status = statusOf(index);
                const StepIcon = status === 'done' ? FiCheck : Icon;
                return (
                  <motion.li
                    key={key}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index, duration: 0.35 }}
                    className={`flex flex-wrap items-center gap-3 rounded-2xl p-3 transition sm:gap-4 sm:p-4 ${
                      status === 'current'
                        ? 'border border-blue-300/70 bg-blue-100/50 shadow-[0_8px_28px_-10px_rgba(37,99,235,0.55)] backdrop-blur-xl ring-1 ring-blue-200/50'
                        : `${glassSoft}`
                    } ${status === 'locked' ? 'opacity-65' : ''}`}
                  >
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/60 backdrop-blur-md ${
                      status === 'locked' ? 'bg-white/30 text-gray-400' : 'bg-white/70 text-blue-600 shadow-sm'
                    }`}>
                      <StepIcon className="h-5 w-5" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className={`font-bold ${status === 'current' ? 'text-blue-700' : 'text-gray-900'}`}>{t.steps[key].title}</p>
                      <p className="text-xs text-gray-500 sm:text-sm">{t.steps[key].desc}</p>
                    </div>

                    <div className="flex w-full shrink-0 items-center justify-between gap-3 sm:w-auto sm:justify-end">
                      {status === 'done' && (
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-green-600">
                          {t.completed}
                          <FiCheck className="h-5 w-5 rounded-full bg-green-100/80 p-1 backdrop-blur-sm" />
                        </span>
                      )}
                      {status === 'current' && (
                        <span className="rounded-md border border-blue-200/60 bg-blue-100/70 px-2 py-1 text-xs font-semibold text-blue-700 backdrop-blur-sm">{t.inProgress}</span>
                      )}
                      {status === 'locked' && (
                        <span className="flex items-center gap-1 rounded-md border border-white/50 bg-white/40 px-2 py-1 text-xs font-semibold text-gray-500 backdrop-blur-sm">
                          <FiLock className="h-3.5 w-3.5" /> {t.locked}
                        </span>
                      )}

                      {cta && status !== 'done' && (
                        <button
                          type="button"
                          disabled={status === 'locked'}
                          onClick={() => nav(ctaPath(cta))}
                          className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold transition active:scale-95 sm:px-4 ${
                            status === 'current'
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700'
                              : 'cursor-not-allowed border border-white/50 bg-white/40 text-gray-400 backdrop-blur-sm'
                          }`}
                        >
                          {cta === 'upload' ? t.uploadNow : cta === 'list' ? t.listTrailer : t.skip}
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

          <aside className="space-y-4 lg:space-y-5">
            <div className={`rounded-2xl p-5 text-center ${glass}`}>
              <div className="relative mx-auto mb-3 grid h-14 w-14 place-items-center">
                <span className="absolute -left-1 top-1 h-1.5 w-1.5 rounded-full bg-blue-300" />
                <span className="absolute -right-0.5 top-0 h-1 w-1 rounded-full bg-blue-200" />
                <span className="absolute bottom-1 -left-2 h-1 w-1 rounded-full bg-white/80" />
                <span className="absolute -right-1 bottom-2 h-1.5 w-1.5 rounded-full bg-blue-400" />
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-400/40">
                  <FiShield className="h-6 w-6" />
                </span>
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

            <div className="rounded-2xl border border-blue-200/50 bg-blue-100/40 p-5 shadow-sm backdrop-blur-xl">
              <p className="flex items-center gap-2 font-bold text-gray-900">💡 {t.tipTitle}</p>
              <p className="mt-2 text-sm text-gray-600">{t.tipBody}</p>
            </div>

            <div className={`rounded-2xl p-5 ${glass}`}>
              <p className="font-bold text-gray-900">{t.helpTitle}</p>
              <p className="mt-1 text-sm text-gray-600">{t.helpBody}</p>
              <Link
                to="/contact"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-blue-600/80 bg-white/40 py-2.5 text-sm font-semibold text-blue-600 backdrop-blur-md transition hover:bg-white/70"
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
