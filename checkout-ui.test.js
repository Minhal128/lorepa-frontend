// Run: node checkout-ui.test.js
// Lightweight contract checks for the checkout surface; the production build
// remains the compiler-level verification for the JSX itself.
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const checkout = fs.readFileSync(path.join(__dirname, "src/pages/CheckoutPage.jsx"), "utf8");
const success = fs.readFileSync(path.join(__dirname, "src/pages/PaymentSuccess.jsx"), "utf8");
const drawer = fs.readFileSync(path.join(__dirname, "src/components/user/BookingDetailsDrawer.jsx"), "utf8");

assert.match(checkout, /<PaymentElement/, "card details stay inside Stripe's Payment Element");
assert.match(checkout, /result\.type === "error"[\s\S]*setError/, "Stripe validation and decline errors remain inline");
assert.match(checkout, /checkoutState\.checkout\.confirm\(\)[\s\S]*catch \(confirmError\)[\s\S]*setSubmitting\(false\)/, "a rejected confirmation restores retryable state");
assert.match(checkout, /onLoadError=/, "Stripe's PaymentElement load-error callback uses the supported casing");
assert.doesNotMatch(checkout, /onLoaderror=/, "the incorrectly cased load-error callback is absent");
assert.match(checkout, /disabled=\{!canPay\}/, "payment stays disabled until the Element is confirmable");
assert.match(checkout, /role="alert"/, "payment errors use an accessible live error region");
assert.match(checkout, /lg:grid-cols-/, "checkout switches from stacked mobile to two-column desktop layout");
assert.match(checkout, /focus-visible:ring/, "interactive controls expose keyboard focus");
assert.match(checkout, /Back to Rental Details/, "checkout has a visible back action");
assert.match(checkout, /referrer\?\.origin === window\.location\.origin[\s\S]*backToReservations\(\)/, "back navigation falls back when same-site history is unavailable");
assert.match(checkout, /Security deposit:/, "the deposit disclosure is visible before payment");
assert.doesNotMatch(drawer, /window\.location\.href\s*=\s*data\.url/, "the renter is never sent to hosted Checkout");
assert.doesNotMatch(success, /booking\/status[\s\S]*status:\s*"paid"/, "the return page never marks a booking paid directly");
assert.match(success, /verify-payment[\s\S]*create-deposit-hold/, "verified payment precedes the retry-safe deposit request");
assert.match(success, /isTransientRequestError[\s\S]*attempt === 3[\s\S]*await wait/, "transient verification failures use bounded retries");
assert.match(success, /sessionStorage\.getItem\(analyticsKey\)[\s\S]*sessionStorage\.setItem/, "purchase analytics are deduplicated per Stripe session");

console.log("checkout-ui: all assertions passed");
