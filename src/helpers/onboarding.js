import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import config from '../config';
import { isKycApproved } from './kyc';
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

// A trailer only counts as listed once an admin approves it.
const isApproved = (trailer) => /^approved$/i.test(String(trailer?.status || ''));

export const normalizeOnboarding = (raw = {}, account = {}) => {
  const src = raw.steps || {};
  const kycVerified = Boolean(raw.kycVerified) || isKycApproved(account);
  const documentsUploaded = any(src, ['documentsUploaded', 'documentsUploaded']);
  // Listing is the admin's call - the step cannot complete before verification.
  // listingReady is what the user themselves did; the legacy emailVerified
  // fallback below keys off that, not off the gated step.
  const listingReady = any(src, ['trailerListed']);
  const trailerListed = kycVerified && listingReady;
  const trailerPending = any(src, ['trailerPending']);
  const steps = {
    accountCreated: true,
    // existing accounts that already listed/uploaded are past signup OTP
    emailVerified:
      any(src, ['emailVerified', 'emailVerified']) ||
      emailVerifiedOf(account) ||
      // submitted is enough here - email verification is not the admin's call
      (documentsUploaded && (listingReady || trailerPending)),
    documentsUploaded,
    trailerListed,
    firstRental: any(src, ['firstRental', 'firstRental']),
    trailerPending,
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
    kycVerified,
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
        trailerPending: isOwner && trailers.length > 0 && !trailers.some(isApproved),
        trailerListed: isOwner
          ? trailers.some(isApproved)
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

export const lockMessage = (link) =>
  link === 'listing'
    ? 'Admin verification pending - you can list a trailer once approved'
    : 'Upload your documents first';

export const showOnboardingWelcomeToast = () => {
  const lang = localStorage.getItem('lang') || 'fr';
  const t = onboardingTranslations[lang] || onboardingTranslations.fr;
  toast.success(`${t.welcomeCompleteTitle}\n${t.welcomeCompleteBody}`, { duration: 5600 });
};

export const welcomeIfOnboardingDone = (percent, userId) => {
  if ((Number(percent) || 0) < 100 || !userId) return false;
  const key = `lorepa-ob-welcome-${userId}`;
  if (sessionStorage.getItem(key)) return false;
  sessionStorage.setItem(key, '1');
  showOnboardingWelcomeToast();
  return true;
};

// Documents are the last step the user controls - the trailer step is the admin's
// call. So the dashboard and the profile nag key off this, not off percent: an owner
// cannot reach 100% until an admin approves a trailer they are not allowed to list yet.
// kycVerified short-circuits it: an admin who already approved the account has seen
// the documents, whatever the step flags say about legacy field names.
export const isUserOnboardingDone = (d) => Boolean(d?.kycVerified || d?.steps?.documentsUploaded);

export const isDashboardLinkLocked = (link, done, kycVerified) => {
  if (link === 'profile') return false;
  if (link === 'listing') return !kycVerified;
  return !done;
};

export const useOnboardingLock = () => {
  const [percent, setPercent] = useState(null);
  const [kycVerified, setKycVerified] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (!id) return;
    fetchOnboarding(id)
      .then((d) => {
        setPercent(Number(d.percent) || 0);
        setKycVerified(Boolean(d.kycVerified));
        setDone(isUserOnboardingDone(d));
      })
      .catch(() => setPercent(0));
  }, []);

  const locked = (link) => percent != null && isDashboardLinkLocked(link, done, kycVerified);
  const block = (e, link) => {
    e?.preventDefault?.();
    toast.error(lockMessage(link));
  };
  return { locked, block, percent, done };
};
