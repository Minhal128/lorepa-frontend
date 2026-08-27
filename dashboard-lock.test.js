// Run: npx esbuild dashboard-lock.test.js --bundle --platform=node --format=esm \
//        --define:import.meta.env={} --outfile=/tmp/lock.mjs && node /tmp/lock.mjs
// (bare `node` cannot resolve Vite's extensionless imports or import.meta.env)
// Pins the unlock rule: the dashboard opens once the user has uploaded documents,
// listing alone waits on the admin, and an owner never deadlocks (they cannot reach
// 100% without a trailer they are not allowed to list until KYC clears).
import assert from 'assert';
import { isDashboardLinkLocked, isUserOnboardingDone } from './src/helpers/onboarding.js';

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

console.log('all dashboard lock checks passed');
