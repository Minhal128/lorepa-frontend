const APPROVED_STATUS_VALUES = new Set([
  "approved",
  "verified",
  "complete",
  "completed",
  "active",
  "accepted",
  "success",
]);

const normalizeString = (value) => String(value ?? "").trim().toLowerCase();

const isTruthyLike = (value) => {
  if (value === true || value === 1) return true;
  if (typeof value === "string") {
    const normalized = normalizeString(value);
    return (
      normalized === "true" ||
      normalized === "1" ||
      APPROVED_STATUS_VALUES.has(normalized)
    );
  }
  return false;
};

export const isKycApproved = (account) => {
  if (!account || typeof account !== "object") return false;

  const directFlags = [
    account.kycVerified,
    account.kycApproved,
    account.isKycVerified,
    account.isKycApproved,
  ];

  if (directFlags.some(isTruthyLike)) {
    return true;
  }

  const statusFields = [
    account.kycStatus,
    account.kyc_status,
    account.verificationStatus,
    account.verification_status,
    account.accountVerificationStatus,
  ];

  // ponytail: admin flags only — docs uploaded ≠ approved (matches backend utils/kyc)
  return statusFields.map(normalizeString).some((s) => APPROVED_STATUS_VALUES.has(s));
};
