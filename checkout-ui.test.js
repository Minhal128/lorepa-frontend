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
assert.match(checkout, /import logo from "\.\.\/assets\/logo_cropped\.svg"/, "the checkout uses the cropped Lorepa wordmark");
assert.match(checkout, /const heroImage = `\$\{import\.meta\.env\.BASE_URL\}HERO\.png`/, "the scenic asset respects Vite's configured base path");
assert.doesNotMatch(checkout, /["']\/HERO\.png/, "the scenic asset is never hard-coded to the server root");
assert.equal((checkout.match(/backgroundImage: `url\("\$\{heroImage\}"\)`/g) || []).length, 2, "loading and checkout shells both use the base-aware scenic asset URL");
assert.match(checkout, /data-testid="scenic-summary-hero"[\s\S]*<img src=\{heroImage\} alt=""/, "the inset scenic art is decorative and uses the base-aware asset URL");
assert.match(checkout, /data-testid="checkout-header"/, "the reference-style checkout header is present");
assert.match(checkout, /data-testid="payment-panel"[\s\S]*data-testid="payment-information"[\s\S]*<PaymentElement/, "the Stripe element is nested inside the payment information card");
assert.match(checkout, /data-testid="order-summary"[\s\S]*Order Summary[\s\S]*data-testid="secure-payment-badge"[\s\S]*Secure Payment/, "the order-summary heading includes the secure-payment badge");
assert.match(checkout, /flex flex-col items-start[^"]*sm:flex-row[^"]*sm:items-center[^"]*sm:justify-between/, "the order-summary heading and badge stack on mobile and align inline from sm upward");
assert.match(checkout, /data-testid="order-summary"[\s\S]*data-testid="trust-strip"/, "the order panel includes the three-column trust strip");
assert.match(checkout, /data-testid="checkout-footer"[\s\S]*Rent smarter\. Travel further\./, "the centered branded footer is present");
assert.match(checkout, /data-testid="checkout-responsive-grid"[^>]*className="[^"]*grid[^"]*lg:grid-cols-/, "the checkout stacks by default and uses the reference split on desktop");
assert.match(checkout, /overflow-x-hidden/, "the scenic shell prevents horizontal clipping on narrow screens");
assert.match(checkout, /<CheckoutElementsProvider[\s\S]*<CheckoutForm[\s\S]*<\/CheckoutElementsProvider>[\s\S]*<OrderSummary/, "payment stays before the order summary in mobile source order");
assert.match(checkout, /min-h-11/, "checkout actions retain a minimum 44px touch target");
assert.match(checkout, /onError=\{\(\) => setListingImageFailed\(true\)\}/, "a failed listing image switches to the fallback");
assert.match(checkout, /hasListingImage \? \([\s\S]*data-testid="listing-image-fallback"[\s\S]*Image unavailable/, "missing and failed listing images render a visible neutral fallback");
assert.match(checkout, /aria-label=\{submitting \? "Processing payment" : `Pay Now[^`]+`\}/, "the pay button's accessible name includes its visible label and changes while submitting");
assert.match(checkout, /submitting \? "Processing securely…" : "Pay Now"/, "the pay button exposes a visible processing state");
assert.match(checkout, /average per day/, "the calculated daily rental figure is labelled as an average");
assert.match(checkout, /Lorepa verifies Stripe’s payment result on the server/, "the deposit notice describes the server-side verification precisely");
assert.match(checkout, /Stripe payment form[\s\S]*Server verification[\s\S]*Booking support/, "the trust strip uses precise factual labels");
assert.doesNotMatch(checkout, /Your information is safe with us|SSL Encrypted|Verified &amp; Trusted/, "broad security and trust claims are absent");
for (const dynamicValue of ["summary.trailer.title", "summary.startDate", "summary.endDate", "summary.accessories", "summary.serviceFee", "summary.total", "summary.depositAmount"]) {
  assert.ok(checkout.includes(dynamicValue), `${dynamicValue} remains dynamic in the checkout`);
}
assert.doesNotMatch(drawer, /window\.location\.href\s*=\s*data\.url/, "the renter is never sent to hosted Checkout");
assert.match(drawer, /sessionStorage\.setItem\("lorepaCheckoutQuery", query\.toString\(\)\)[\s\S]*nav\(`\/checkout\?/, "checkout navigation preserves the selected reservation for refresh recovery");
assert.match(checkout, /storedParams\.get\("bookingId"\)/, "checkout recovers the selected reservation from session storage");
assert.match(checkout, /booking\/buyer\/\$\{userId\}[\s\S]*status === "accepted"[\s\S]*contractSigned === true[\s\S]*total_paid/, "a bare checkout URL recovers the newest eligible renter reservation");
assert.doesNotMatch(success, /booking\/status[\s\S]*status:\s*"paid"/, "the return page never marks a booking paid directly");
assert.match(success, /verify-payment[\s\S]*create-deposit-hold/, "verified payment precedes the retry-safe deposit request");
assert.match(success, /isTransientRequestError[\s\S]*attempt === 3[\s\S]*await wait/, "transient verification failures use bounded retries");
assert.match(success, /sessionStorage\.getItem\(analyticsKey\)[\s\S]*sessionStorage\.setItem/, "purchase analytics are deduplicated per Stripe session");

console.log("checkout-ui: all assertions passed");
