const hasValue = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

export const isProfileComplete = (account, role) => {
  if (!account) return false;

  const commonFields = ['name', 'email', 'phone', 'country', 'state', 'address', 'street'];
  const hasCommon = commonFields.every((field) => hasValue(account[field]));

  const hasLicenseDocs = hasValue(account.licenseFrontImage) && hasValue(account.licenseBackImage);

  if (role === 'owner') {
    const hasOwnerDocs =
      hasValue(account.trailerInsurancePolicyImage) && hasValue(account.trailerRegistrationImage);
    return hasCommon && hasLicenseDocs && hasOwnerDocs;
  }

  const hasRenterDocs = hasValue(account.carInsurancePolicyImage);
  return hasCommon && hasLicenseDocs && hasRenterDocs;
};
