import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startInactivityLogout } from './inactivityLogout';

const PROMPT_COPY = {
  en: {
    title: 'Still here?',
    message: 'You have been inactive. Do you want to stay logged in or log out?',
    stay: 'Stay logged in',
    logout: 'Log out',
  },
  fr: {
    title: 'Toujours là ?',
    message: 'Vous êtes inactif. Souhaitez-vous rester connecté ou vous déconnecter ?',
    stay: 'Rester connecté',
    logout: 'Se déconnecter',
  },
  es: {
    title: '¿Sigues aquí?',
    message: 'Has estado inactivo. ¿Quieres permanecer conectado o cerrar sesión?',
    stay: 'Permanecer conectado',
    logout: 'Cerrar sesión',
  },
  cn: {
    title: '还在吗？',
    message: '您已有一段时间未操作。要保持登录还是退出？',
    stay: '保持登录',
    logout: '退出登录',
  },
};

const getPromptCopy = () => {
  const lang = localStorage.getItem('lang') || 'fr';
  return PROMPT_COPY[lang] || PROMPT_COPY.fr;
};

export const useInactivityLogout = () => {
  const navigate = useNavigate();
  const [promptOpen, setPromptOpen] = useState(false);
  const [copy, setCopy] = useState(getPromptCopy);

  useEffect(() => {
    if (promptOpen) return undefined;
    return startInactivityLogout(() => {
      setCopy(getPromptCopy());
      setPromptOpen(true);
    });
  }, [promptOpen]);

  const stayLoggedIn = useCallback(() => setPromptOpen(false), []);

  const logout = useCallback(() => {
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    setPromptOpen(false);
    navigate('/', { replace: true });
  }, [navigate]);

  return { promptOpen, copy, stayLoggedIn, logout };
};

export const InactivityLogoutGate = () => {
  const { promptOpen, copy, stayLoggedIn, logout } = useInactivityLogout();

  useEffect(() => {
    if (!promptOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') stayLoggedIn();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [promptOpen, stayLoggedIn]);

  if (!promptOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inactivity-logout-title"
      aria-describedby="inactivity-logout-message"
    >
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="border-b border-gray-200 p-5">
          <h3 id="inactivity-logout-title" className="text-lg font-semibold text-gray-900">
            {copy.title}
          </h3>
          <p id="inactivity-logout-message" className="mt-2 text-sm text-gray-700">
            {copy.message}
          </p>
        </div>
        <div className="flex justify-end gap-3 p-5">
          <button
            type="button"
            onClick={logout}
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            {copy.logout}
          </button>
          <button
            type="button"
            autoFocus
            onClick={stayLoggedIn}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {copy.stay}
          </button>
        </div>
      </div>
    </div>
  );
};
