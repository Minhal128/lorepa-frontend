const hasValue = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

export const isProfileComplete = (account, role) => {
  if (!account) return false;

  const normalizedRole = String(role || '').trim().toLowerCase();
  const isOwnerRole = ['owner', 'host', 'seller', 'buyer'].includes(normalizedRole);

  // Only enforce truly required profile fields.
  // country/state/address/street are labeled optional in UI and should not block profile completion.
  const requiredProfileFields = ['name', 'email', 'phone'];
  const hasRequiredProfile = requiredProfileFields.every((field) => hasValue(account[field]));

  const hasLicenseDocs = hasValue(account.licenseFrontImage) && hasValue(account.licenseBackImage);

  if (isOwnerRole) {
    const hasOwnerDocs =
      hasValue(account.trailerInsurancePolicyImage) && hasValue(account.trailerRegistrationImage);
    return hasRequiredProfile && hasLicenseDocs && hasOwnerDocs;
  }

  const hasRenterDocs = hasValue(account.carInsurancePolicyImage);
  return hasRequiredProfile && hasLicenseDocs && hasRenterDocs;
};
