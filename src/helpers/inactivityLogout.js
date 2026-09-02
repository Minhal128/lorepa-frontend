/** TEST: 1 minute. Restore to `30 * 60 * 1000` after verifying the prompt. */
export const INACTIVITY_LIMIT_MS = 1 * 60 * 1000;

const ACTIVITY_EVENTS = ['pointerdown', 'pointermove', 'keydown', 'scroll', 'touchstart'];

export const startInactivityLogout = (onTimeout, target = window) => {
  let timeoutId;
  const resetTimer = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(onTimeout, INACTIVITY_LIMIT_MS);
  };

  ACTIVITY_EVENTS.forEach((event) =>
    target.addEventListener(event, resetTimer, { passive: true })
  );
  resetTimer();

  return () => {
    clearTimeout(timeoutId);
    ACTIVITY_EVENTS.forEach((event) => target.removeEventListener(event, resetTimer));
  };
};
