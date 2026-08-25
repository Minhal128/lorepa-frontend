import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import config from '../config';
import { onboardingTranslations } from '../pages/Auth/translation/onboardingTranslations';

const PROFILE_STEPS = ['accountCreated', 'emailVerified', 'documentsUploaded', 'trailerListed'];

const has = (value) => Boolean(value && String(value).trim());
const any = (obj, keys) => keys.some((key) => Boolean(obj?.[key]));

const emailVerifiedOf = (account = {}) =>
  Boolean(
    account.otpVerified ||
      account.otpVerified ||
      account.isGoogleLogin ||
      account.isGoogleLogin ||
      account.googleId ||
      account.kycVerified
  );

const hasDoc = (account, keys) => keys.some((key) => has(account[key]));

export const normalizeOnboarding = (raw = {}, account = {}) => {
  const src = raw.steps || {};
  const documentsUploaded = any(src, ['documentsUploaded', 'documentsUploaded']);
  const trailerListed = any(src, ['trailerListed', 'trailerListed']);
  const steps = {
    accountCreated: true,
    // existing accounts that already listed/uploaded are past signup OTP
    emailVerified:
      any(src, ['emailVerified', 'emailVerified']) ||
      emailVerifiedOf(account) ||
      (documentsUploaded && trailerListed),
    documentsUploaded,
    trailerListed,
    firstRental: any(src, ['firstRental', 'firstRental']),
  };
  const completed = PROFILE_STEPS.filter((key) => steps[key]).length;
  const firstIncomplete = PROFILE_STEPS.findIndex((key) => !steps[key]);
  return {
    step: firstIncomplete === -1 ? PROFILE_STEPS.length : firstIncomplete + 1,
    percent: completed * 25,
    completedAt:
      completed === PROFILE_STEPS.length
        ? raw.completedAt || account.onboarding?.completedAt || new Date().toISOString()
        : null,
    steps,
    role: raw.role || account.role,
    name: raw.name || account.name,
    profilePicture: raw.profilePicture || account.profilePicture,
  };
};

export const deriveOnboarding = async (userId, account) => {
  const isOwner = account.role === 'owner';
  const [trailersRes, bookingsRes] = await Promise.all([
    isOwner
      ? axios.get(`${config.baseUrl}/trailer/seller/${userId}`).catch(() => ({ data: { data: [] } }))
      : Promise.resolve(null),
    axios
      .get(`${config.baseUrl}/booking/${isOwner ? 'seller' : 'buyer'}/${userId}`)
      .catch(() => ({ data: { data: [] } })),
  ]);

  const trailers = trailersRes?.data?.data || [];
  const bookings = bookingsRes?.data?.data || [];

  return normalizeOnboarding(
    {
      steps: {
        accountCreated: true,
        emailVerified: emailVerifiedOf(account),
        documentsUploaded:
          hasDoc(account, ['licenseFrontImage', 'licenseFrontImage']) &&
          hasDoc(account, ['licenseBackImage', 'licenseBackImage']) &&
          (isOwner
            ? hasDoc(account, ['trailerRegistrationImage', 'trailerRegistrationImage'])
            : hasDoc(account, ['faq27Image', 'faq27Image'])),
        trailerListed: isOwner
          ? trailers.length > 0
          : ['name', 'phone', 'address', 'city', 'postalCode', 'state', 'country'].every((field) =>
              has(account[field])
            ),
        firstRental: bookings.length > 0,
      },
      role: account.role,
      name: account.name,
      profilePicture: account.profilePicture,
      completedAt: account.onboarding?.completedAt,
    },
    account
  );
};

export const fetchOnboarding = async (userId) => {
  try {
    const res = await axios.get(`${config.baseUrl}/account/onboarding/${userId}`);
    if (res.data?.data) return normalizeOnboarding(res.data.data);
  } catch {
    // live API may not have the route yet
  }

  const res = await axios.get(`${config.baseUrl}/account/single/${userId}`);
  const account = res.data?.data;
  if (!account) throw new Error('User not found');
  return deriveOnboarding(userId, account);
};

export const FILL_ONBOARDING_MSG = 'Fill your onboarding first';

export const showOnboardingWelcomeToast = () => {
  const lang = localStorage.getItem('lang') || 'fr';
  const t = onboardingTranslations[lang] || onboardingTranslations.fr;
  toast.custom(
    (id) => (
      <div className="flex w-[min(92vw,380px)] items-start gap-3 rounded-2xl border border-blue-100 bg-white px-4 py-3.5 shadow-[0_16px_40px_-12px_rgba(37,99,235,0.45)]">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-blue-500 text-lg text-white">🎉</span>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="font-extrabold leading-tight text-gray-900">{t.welcomeCompleteTitle}</p>
          <p className="mt-0.5 text-sm text-gray-600">{t.welcomeCompleteBody}</p>
        </div>
        <button type="button" onClick={() => toast.dismiss(id)} className="text-sm text-gray-400 hover:text-gray-700" aria-label="Close">
          ×
        </button>
      </div>
    ),
    { duration: 5600, position: 'top-center' }
  );
};

export const welcomeIfOnboardingDone = (percent, userId) => {
  if ((Number(percent) || 0) < 100 || !userId) return false;
  const key = `lorepa-ob-welcome-${userId}`;
  if (sessionStorage.getItem(key)) return false;
  sessionStorage.setItem(key, '1');
  showOnboardingWelcomeToast();
  return true;
};

export const isDashboardLinkLocked = (link, percent, role) => {
  if (role !== 'owner') return false;
  if (percent >= 100) return false;
  if (link === 'profile') return false;
  if (link === 'listing' && role === 'owner') return false;
  return true;
};

export const useOnboardingLock = () => {
  const [percent, setPercent] = useState(null);
  const [role, setRole] = useState(localStorage.getItem('role') || '');

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (!id) return;
    fetchOnboarding(id)
      .then((d) => {
        setPercent(Number(d.percent) || 0);
        if (d.role) setRole(d.role);
      })
      .catch(() => setPercent(0));
  }, []);

  const locked = (link) => percent != null && isDashboardLinkLocked(link, percent, role);
  const block = (e) => {
    e?.preventDefault?.();
    toast.error(FILL_ONBOARDING_MSG);
  };
  return { locked, block, percent, role };
};
