import { isKycApproved } from './kyc';

const hasValue = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

const profileCityKey = (userId) => `profile_city_${userId}`;

const getProfileCity = (account) => {
  if (!account) return '';
  const userId = typeof localStorage !== 'undefined' ? localStorage.getItem('userId') : null;
  const stored = userId ? localStorage.getItem(profileCityKey(userId)) : '';
  return account.city || account.street || stored || '';
};

export const isProfileComplete = (account, role) => {
  if (!account) return false;
  if (isKycApproved(account)) return true;

  const normalizedRole = String(role || '').trim().toLowerCase();
  const isOwnerRole = ['owner', 'host', 'seller', 'buyer'].includes(normalizedRole);

  const requiredProfileFields = ['name', 'email', 'phone', 'country', 'state', 'city', 'postalCode', 'address'];
  const hasRequiredProfile = requiredProfileFields.every((field) =>
    field === 'city' ? hasValue(getProfileCity(account)) : hasValue(account[field])
  );

  const hasLicenseDocs = hasValue(account.licenseFrontImage) && hasValue(account.licenseBackImage);

  if (isOwnerRole) {
    const hasOwnerDocs = hasValue(account.trailerRegistrationImage);
    return hasRequiredProfile && hasLicenseDocs && hasOwnerDocs;
  }

  const hasRenterDocs = hasValue(account.faq27Image);
  return hasRequiredProfile && hasLicenseDocs && hasRenterDocs;
};
