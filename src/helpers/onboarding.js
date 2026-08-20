import axios from 'axios';
import config from '../config';

const STEPS = ['accountCreated', 'emailVerified', 'documentsUploaded', 'trailerListed', 'firstRental'];

const has = (value) => Boolean(value && String(value).trim());

const pack = (account, steps) => {
  const completed = STEPS.filter((key) => steps[key]).length;
  const firstIncomplete = STEPS.findIndex((key) => !steps[key]);
  return {
    step: firstIncomplete === -1 ? STEPS.length : firstIncomplete + 1,
    percent: completed * 20,
    completedAt: completed === STEPS.length ? account.onboarding?.completedAt || new Date().toISOString() : null,
    steps,
    role: account.role,
    name: account.name,
    profilePicture: account.profilePicture,
  };
};

// ponytail: mirrors backend getOnboarding until DigitalOcean backend is redeployed
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

  return pack(account, {
    accountCreated: true,
    emailVerified: Boolean(account.otpVerified),
    documentsUploaded:
      has(account.licenseFrontImage) &&
      has(account.licenseBackImage) &&
      has(isOwner ? account.trailerRegistrationImage : account.faq27Image),
    trailerListed: isOwner
      ? trailers.length > 0
      : ['name', 'phone', 'address', 'city', 'postalCode', 'state', 'country'].every((field) => has(account[field])),
    firstRental: bookings.length > 0,
  });
};

export const fetchOnboarding = async (userId) => {
  try {
    const res = await axios.get(`${config.baseUrl}/account/onboarding/${userId}`);
    if (res.data?.data) return res.data.data;
  } catch {
    // live API may not have the route yet
  }

  const res = await axios.get(`${config.baseUrl}/account/single/${userId}`);
  const account = res.data?.data;
  if (!account) throw new Error('User not found');
  return deriveOnboarding(userId, account);
};
