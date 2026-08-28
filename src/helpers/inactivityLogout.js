import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const INACTIVITY_LIMIT_MS = 30 * 60 * 1000;

const ACTIVITY_EVENTS = ['pointerdown', 'pointermove', 'keydown', 'scroll', 'touchstart'];

export const startInactivityLogout = (onTimeout, target = window) => {
  let timeoutId;
  const resetTimer = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(onTimeout, INACTIVITY_LIMIT_MS);
  };

  ACTIVITY_EVENTS.forEach((event) => target.addEventListener(event, resetTimer));
  resetTimer();

  return () => {
    clearTimeout(timeoutId);
    ACTIVITY_EVENTS.forEach((event) => target.removeEventListener(event, resetTimer));
  };
};

export const useInactivityLogout = () => {
  const navigate = useNavigate();

  useEffect(
    () =>
      startInactivityLogout(() => {
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        navigate('/', { replace: true });
      }),
    [navigate]
  );
};
