// Run: npx esbuild dashboard-lock.test.js --bundle --platform=node --format=esm \
//        --define:import.meta.env={} --outfile=node_modules/.cache/lock.mjs && node node_modules/.cache/lock.mjs
// (bare `node` cannot resolve Vite's extensionless imports or import.meta.env)
// Pins the unlock rule: the dashboard opens once the user has uploaded documents,
// listing alone waits on the admin, and an owner never deadlocks (they cannot reach
// 100% without a trailer they are not allowed to list until KYC clears).
import assert from 'assert';
import { hasRequiredDocuments, isDashboardLinkLocked, isUserOnboardingDone, normalizeOnboarding } from './src/helpers/onboarding.js';

const done = (d) => isUserOnboardingDone(d);
const locked = (link, d, kyc) => isDashboardLinkLocked(link, done(d), kyc);

const fresh = { steps: { accountCreated: true, emailVerified: true } };
const uploaded = { steps: { accountCreated: true, emailVerified: true, documentsUploaded: true } };

// profile is always reachable - it is where the documents get uploaded
assert.equal(locked('profile', fresh, false), false);

// before documents: everything else shut
assert.equal(locked('home', fresh, false), true);
assert.equal(locked('reservation', fresh, false), true);
assert.equal(locked('listing', fresh, false), true);

// after documents: dashboard opens, listing still waits on the admin
assert.equal(locked('home', uploaded, false), false);
assert.equal(locked('reservation', uploaded, false), false);
assert.equal(locked('payment', uploaded, false), false);
assert.equal(locked('listing', uploaded, false), true);

// admin verifies -> listing opens too, without needing 100%
assert.equal(locked('listing', uploaded, true), false);

// an already-approved account is past the docs gate whatever the step flags say
assert.equal(done({ kycVerified: true, steps: {} }), true);
assert.equal(locked('home', { kycVerified: true, steps: {} }, true), false);

// the deadlock guard: an owner at 75% (docs done, no approved trailer) can still
// reach the listing page once KYC clears, which is the only way to ever hit 100%
assert.equal(locked('listing', { percent: 75, ...uploaded }, true), false);

// --- the listing step waits on the admin ---------------------------------
const renterSteps = { accountCreated: true, emailVerified: true, documentsUploaded: true, trailerListed: true };

// docs in, profile filled, admin has not verified -> 75%, listing step not done
const unverified = normalizeOnboarding({ steps: renterSteps }, {});
assert.equal(unverified.percent, 75);
assert.equal(unverified.steps.trailerListed, false);
assert.equal(done(unverified), true);            // dashboard opens at 75%
assert.equal(locked('home', unverified, unverified.kycVerified), false);
assert.equal(locked('listing', unverified, unverified.kycVerified), true);

// admin verifies -> the step completes and 100% becomes reachable
const verified = normalizeOnboarding({ steps: renterSteps, kycVerified: true }, {});
assert.equal(verified.percent, 100);
assert.equal(verified.steps.trailerListed, true);
assert.equal(locked('listing', verified, verified.kycVerified), false);

// legacy account with no OTP flag is still counted as email-verified: the
// fallback keys off what the user did, not off the KYC-gated step
assert.equal(unverified.steps.emailVerified, true);

// --- required document set (drives the "with the admin" profile message) ---
const renterDocs = { licenseFrontImage: 'a.jpg', licenseBackImage: 'b.jpg', faq27Image: 'c.jpg' };
assert.equal(hasRequiredDocuments({ ...renterDocs }), true);
assert.equal(hasRequiredDocuments({ ...renterDocs, faq27Image: '' }), false, 'a renter needs the FAQ 27 page');
assert.equal(hasRequiredDocuments({ ...renterDocs, role: 'owner' }), false, 'an owner needs the registration, not FAQ 27');
assert.equal(hasRequiredDocuments({ ...renterDocs, role: 'owner', trailerRegistrationImage: 'd.jpg' }), true);
assert.equal(hasRequiredDocuments({}), false);
assert.equal(hasRequiredDocuments(), false);

console.log('all dashboard lock checks passed');
