import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { CheckoutElementsProvider, PaymentElement, useCheckoutElements } from "@stripe/react-stripe-js/checkout";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaArrowLeft, FaCheck, FaChevronLeft, FaChevronRight, FaHeadset, FaLock, FaShieldAlt } from "react-icons/fa";
import config from "../config";
import logo from "../assets/logo_cropped.svg";

const money = (value) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(Number(value || 0));

const heroImage = `${import.meta.env.BASE_URL}HERO.png`;

const appearance = {
  theme: "stripe",
  variables: {
    colorPrimary: "#2563eb",
    colorText: "#172554",
    colorDanger: "#dc2626",
    colorBackground: "rgba(248, 251, 255, 0.94)",
    colorTextSecondary: "#64748b",
    fontFamily: "Inter, Poppins, system-ui, sans-serif",
    borderRadius: "12px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": {
      border: "1px solid rgba(148, 163, 184, 0.38)",
      boxShadow: "0 1px 2px rgba(15, 23, 42, 0.03)",
      padding: "13px 14px",
    },
    ".Input:hover": { border: "1px solid rgba(96, 165, 250, 0.72)" },
    ".Input:focus": {
      border: "1px solid #3b82f6",
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.14)",
    },
    ".Label": { fontWeight: "600", color: "#1e3a8a" },
    ".Tab": { border: "1px solid rgba(148, 163, 184, 0.38)", boxShadow: "none" },
    ".Tab--selected": { border: "1px solid #60a5fa", boxShadow: "0 0 0 1px #60a5fa" },
  },
};

const CheckoutForm = ({ summary, onBack }) => {
  const checkoutState = useCheckoutElements();
  const [elementComplete, setElementComplete] = useState(false);
  const [elementReady, setElementReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (checkoutState.type !== "success" || !elementComplete || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const result = await checkoutState.checkout.confirm();
      if (result.type === "error") {
        setError(result.error?.message || "Your payment could not be completed. Please try again.");
        setSubmitting(false);
      }
    } catch (confirmError) {
      setError(confirmError?.message || "Your payment could not be completed. Please try again.");
      setSubmitting(false);
    }
  };

  const checkoutError = checkoutState.type === "error" ? checkoutState.error.message : "";
  const canPay = checkoutState.type === "success" && elementReady && elementComplete && !submitting;

  return (
    <section data-testid="payment-panel" className="rounded-[30px] border border-white/[0.75] bg-[rgba(244,249,255,0.86)] p-5 shadow-[0_30px_90px_rgba(30,64,175,0.20)] backdrop-blur-2xl sm:p-7 lg:p-8">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-blue-950 transition hover:bg-white/[0.7] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
      >
        <FaArrowLeft aria-hidden="true" /> Back to Rental Details
      </button>

      <div className="mt-5">
        <h1 className="text-3xl font-bold tracking-[-0.035em] text-slate-950 sm:text-[38px]">Secure <span className="text-blue-600">Checkout</span></h1>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">Complete your payment and get ready for your journey.</p>
      </div>

      <ol aria-label="Checkout progress" data-testid="checkout-progress" className="mt-5 flex w-full items-start">
        {[
          ["1", "Payment", true],
          ["2", "Confirmation", false],
          ["3", "Done", false],
        ].map(([number, label, active], index) => (
          <li key={label} aria-current={active ? "step" : undefined} className="flex min-w-0 flex-1 items-start last:flex-none">
            <div className="flex min-w-[72px] flex-col items-center text-center">
              <span className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold shadow-sm ${active ? "border-blue-600 bg-blue-600 text-white" : "border-blue-200 bg-white/[0.8] text-slate-500"}`}>
                {number}
              </span>
              <span className={`mt-2 text-[11px] font-semibold sm:text-xs ${active ? "text-blue-800" : "text-slate-500"}`}>{label}</span>
            </div>
            {index < 2 && <span aria-hidden="true" className="mt-[17px] h-px min-w-4 flex-1 bg-blue-200" />}
          </li>
        ))}
      </ol>

      <form onSubmit={handleSubmit} noValidate className="mt-5">
        <div data-testid="payment-information" className="rounded-[22px] border border-white bg-white/[0.76] p-4 shadow-[0_16px_45px_rgba(30,64,175,0.10)] sm:p-6">
          <div className="mb-5 flex items-start gap-3 border-b border-blue-100 pb-4">
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-600"><FaLock aria-hidden="true" /></span>
            <div>
              <h2 className="text-lg font-bold text-slate-950">Payment Information</h2>
              <p className="mt-1 text-xs text-slate-500">Card details are collected and processed by Stripe.</p>
            </div>
          </div>
          <PaymentElement
            onReady={() => setElementReady(true)}
            onChange={(event) => {
              setElementComplete(event.complete);
              if (event.error?.message) setError(event.error.message);
              else if (error) setError("");
            }}
            onLoadError={(event) => setError(event.error?.message || "The secure payment form could not load.")}
          />
        </div>

        {(error || checkoutError) && (
          <div role="alert" aria-live="assertive" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error || checkoutError}
          </div>
        )}

        <button
          type="submit"
          aria-label={submitting ? "Processing payment" : `Pay Now — ${money(summary.total)} CAD`}
          disabled={!canPay}
          className="mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 text-base font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          <FaLock aria-hidden="true" />
          {submitting ? "Processing securely…" : "Pay Now"}
        </button>
        {!elementComplete && elementReady && (
          <p className="mt-3 text-center text-xs text-slate-500" aria-live="polite">
            Complete the secure payment form to continue.
          </p>
        )}
      </form>
    </section>
  );
};

const OrderSummary = ({ summary }) => {
  const [listingImageFailed, setListingImageFailed] = useState(false);
  const [slide, setSlide] = useState(0);
  const hasListingImage = Boolean(summary.trailer.image) && !listingImageFailed;
  const photos = summary.trailer.images?.length ? summary.trailer.images : [summary.trailer.image].filter(Boolean);
  const step = (delta) => setSlide((current) => (current + delta + photos.length) % photos.length);

  return (
  <aside data-testid="order-summary" className="overflow-hidden rounded-[30px] border border-white/[0.75] bg-[rgba(244,249,255,0.88)] shadow-[0_30px_90px_rgba(30,64,175,0.20)] backdrop-blur-2xl">
    <div data-testid="scenic-summary-hero" className="relative m-3 h-40 overflow-hidden rounded-[22px] bg-blue-100 sm:m-4 sm:h-44 lg:h-48">
      <img
        src={photos[slide] || heroImage}
        alt={photos.length ? `${summary.trailer.title} — image ${slide + 1}` : ""}
        className={`h-full w-full object-cover ${photos.length ? "" : "object-[56%_66%]"}`}
      />
      {photos.length > 1 && (
        <>
          <button type="button" onClick={() => step(-1)} aria-label="Previous trailer image" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white transition hover:bg-black/65 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <FaChevronLeft className="h-3 w-3" />
          </button>
          <button type="button" onClick={() => step(1)} aria-label="Next trailer image" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white transition hover:bg-black/65 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <FaChevronRight className="h-3 w-3" />
          </button>
          <span data-testid="summary-image-counter" className="absolute right-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[11px] font-semibold text-white">{slide + 1}/{photos.length}</span>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1">
            {photos.map((photo, index) => (
              <button
                key={photo}
                type="button"
                aria-label={`Show image ${index + 1}`}
                onClick={() => setSlide(index)}
                className={`h-1.5 w-1.5 rounded-full transition ${index === slide ? "bg-white" : "bg-white/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>

    <div className="px-5 pb-5 pt-3 sm:px-7 sm:pb-7">
      <div className="flex flex-col items-start gap-3 border-b border-blue-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold tracking-tight text-slate-950">Order Summary</h2>
        <div data-testid="secure-payment-badge" className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/[0.85] px-3 py-2 text-[11px] font-bold text-emerald-700">
          <FaShieldAlt aria-hidden="true" /> Secure Payment
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4 rounded-2xl border border-blue-100 bg-white/[0.65] p-3">
        <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl border border-white/[0.8] bg-slate-100 shadow-sm">
          {hasListingImage ? (
            <img src={summary.trailer.image} alt="" className="h-full w-full object-cover" onError={() => setListingImageFailed(true)} />
          ) : (
            <div data-testid="listing-image-fallback" role="img" aria-label="Trailer image unavailable" className="flex h-full w-full flex-col items-center justify-center gap-1 bg-slate-100 px-1 text-center text-slate-500">
              <FaShieldAlt aria-hidden="true" />
              <span className="text-[9px] font-semibold leading-tight">Image unavailable</span>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-slate-900">{summary.trailer.title}</p>
          <p className="mt-1 truncate text-xs text-slate-500">{summary.startDate} – {summary.endDate}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-bold text-slate-950">{money(summary.rentalPrice / Math.max(1, summary.rentalDays))}</p>
          <p className="text-[11px] text-slate-500">average per day</p>
        </div>
      </div>

      <dl className="mt-5 space-y-3 text-sm text-slate-600">
        <div className="flex justify-between gap-4"><dt>Rental duration</dt><dd className="font-semibold text-slate-900">{summary.rentalDays} day{summary.rentalDays === 1 ? "" : "s"}</dd></div>
        <div className="flex justify-between gap-4"><dt>Base rental</dt><dd className="font-semibold text-slate-900">{money(summary.rentalPrice)}</dd></div>
        {summary.accessories.map((accessory) => (
          <div key={accessory.accessoryId || accessory.name} className="flex justify-between gap-4">
            <dt>{accessory.name} <span className="block text-[11px] text-slate-400">One-time fee</span></dt>
            <dd className="font-semibold text-slate-900">{money(accessory.price)}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-4"><dt>Lorepa service fee (5%)</dt><dd className="font-semibold text-slate-900">{money(summary.serviceFee)}</dd></div>
        <div className="border-t border-blue-100 pt-4">
          <div className="flex items-end justify-between gap-4">
            <dt className="text-base font-bold text-slate-950">Total</dt>
            <dd className="text-2xl font-extrabold tracking-tight text-blue-700">{money(summary.total)} <span className="text-[11px] font-bold">CAD</span></dd>
          </div>
        </div>
      </dl>

      <div data-testid="security-notice" className="mt-5 flex gap-3 rounded-2xl border border-blue-200 bg-blue-50/[0.9] p-4 text-sm leading-6 text-blue-950">
        <FaShieldAlt aria-hidden="true" className="mt-1 shrink-0 text-xl text-blue-600" />
        <div><strong>Server-verified deposit details</strong><p className="mt-1 text-xs text-blue-800/[0.8]">Security deposit: {money(summary.depositAmount)} CAD. Lorepa verifies Stripe’s payment result on the server before requesting this temporary hold.</p></div>
      </div>

      <div data-testid="trust-strip" className="mt-5 grid grid-cols-3 gap-2 rounded-2xl border border-white bg-white/[0.65] px-2 py-4 text-center text-[11px] font-semibold text-slate-600 shadow-sm">
        <div><FaShieldAlt className="mx-auto mb-2 text-lg text-blue-600" aria-hidden="true" />Stripe payment form</div>
        <div className="border-x border-blue-100"><FaCheck className="mx-auto mb-2 text-lg text-blue-600" aria-hidden="true" />Server verification</div>
        <div><FaHeadset className="mx-auto mb-2 text-lg text-blue-600" aria-hidden="true" />Booking support</div>
      </div>
    </div>
  </aside>
  );
};

const StatePanel = ({ title, message, onBack, retry }) => (
  <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-blue-100 bg-cover bg-center p-4" style={{ backgroundImage: `url("${heroImage}")` }}>
    <div className="absolute inset-0 bg-blue-950/[0.15] backdrop-blur-[2px]" aria-hidden="true" />
    <div className="relative w-full max-w-lg rounded-3xl border border-white/[0.8] bg-white/[0.85] p-8 text-center shadow-2xl backdrop-blur-xl">
      <img src={logo} alt="Lorepa" className="mx-auto h-auto w-36" />
      <h1 className="mt-5 text-2xl font-bold text-slate-950">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        {retry && <button onClick={retry} className="min-h-11 rounded-xl bg-blue-600 px-5 font-semibold text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300">Try again</button>}
        <button onClick={onBack} className="min-h-11 rounded-xl border border-blue-200 bg-white/[0.7] px-5 font-semibold text-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">Back to reservations</button>
      </div>
    </div>
  </main>
);

const CheckoutPage = () => {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  const storedParams = new URLSearchParams(sessionStorage.getItem("lorepaCheckoutQuery") || "");
  const bookingId = params.get("bookingId") || storedParams.get("bookingId") || "";
  const accessories = (params.get("accessories") || storedParams.get("accessories"))?.split(",").filter(Boolean) || [];
  const userId = localStorage.getItem("userId") || "";

  useEffect(() => {
    if (params.get("bookingId")) {
      sessionStorage.setItem("lorepaCheckoutQuery", params.toString());
    }
  }, [params]);

  useEffect(() => {
    let active = true;
    const loadCheckout = async () => {
      setLoading(true);
      setError("");
      if (!userId) {
        setError("We could not identify an eligible reservation. Please return to your reservations and try again.");
        setLoading(false);
        return;
      }
      try {
        if (!bookingId) {
          const bookingsResponse = await axios.get(`${config.baseUrl}/booking/buyer/${userId}`);
          const eligibleBooking = (bookingsResponse.data?.data || []).find((booking) =>
            booking?.status === "accepted" && booking?.contractSigned === true && Number(booking?.total_paid || 0) <= 0
          );
          if (!eligibleBooking?._id) {
            throw new Error("No accepted, signed reservation is ready for payment.");
          }

          const recoveredParams = new URLSearchParams({ bookingId: eligibleBooking._id });
          sessionStorage.setItem("lorepaCheckoutQuery", recoveredParams.toString());
          if (active) setParams(recoveredParams, { replace: true });
          return;
        }

        const response = await axios.post(`${config.baseUrl}/stripe/create-checkout-session`, {
          bookingId,
          userId,
          accessoryIds: accessories,
        });
        if (active) setData(response.data);
      } catch (requestError) {
        if (active) {
          setError(requestError.response?.data?.msg || requestError.message || "Secure checkout could not be loaded. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    loadCheckout();
    return () => { active = false; };
  }, [bookingId, userId, params, setParams, attempt]);

  const stripePromise = useMemo(
    () => (data?.publishableKey ? loadStripe(data.publishableKey) : null),
    [data?.publishableKey]
  );
  const backToReservations = () => navigate("/user/dashboard/reservation");
  const backToRentalDetails = () => {
    try {
      const referrer = document.referrer ? new URL(document.referrer) : null;
      const routerHistoryIndex = window.history.state?.idx;
      const hasInAppHistory = Number.isInteger(routerHistoryIndex) && routerHistoryIndex > 0;
      const hasSameSiteReferrer = referrer?.origin === window.location.origin && window.history.length > 1;
      if (hasInAppHistory || hasSameSiteReferrer) {
        navigate(-1);
        return;
      }
    } catch {
      // An unusable referrer should fall through to the safe reservations route.
    }
    backToReservations();
  };

  if (loading) {
    return <StatePanel title="Preparing secure checkout" message="We’re verifying your reservation and calculating the final total…" onBack={backToReservations} />;
  }
  if (error || !data?.clientSecret || !data?.summary) {
    return <StatePanel title="Checkout unavailable" message={error || "The secure payment session is incomplete."} retry={() => setAttempt((value) => value + 1)} onBack={backToReservations} />;
  }

  return (
    <main
      data-testid="checkout-shell"
      className="relative min-h-screen overflow-x-hidden bg-blue-100 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url("${heroImage}")` }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(239,246,255,0.78),rgba(219,234,254,0.38))] backdrop-blur-[3px]" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-screen max-w-[1760px] flex-col px-4 sm:px-6 lg:px-10">
        <header data-testid="checkout-header" className="flex min-h-20 items-center justify-between gap-4 py-4">
          <a href="/" aria-label="Lorepa home" className="rounded-xl px-2 py-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300">
            <img src={logo} alt="Lorepa" className="h-auto w-32 sm:w-40" />
          </a>
          <div className="hidden items-center gap-2 rounded-full border border-white/[0.7] bg-white/[0.55] px-4 py-2 text-xs font-semibold text-blue-950 shadow-sm backdrop-blur-md sm:flex">
            <FaShieldAlt aria-hidden="true" className="text-blue-600" /> Checkout powered by Stripe
          </div>
        </header>

        <div data-testid="checkout-responsive-grid" className="mx-auto grid w-full max-w-[1700px] flex-1 items-start gap-5 pb-5 lg:grid-cols-[minmax(0,1fr)_minmax(400px,540px)] lg:gap-4">
          <CheckoutElementsProvider
            stripe={stripePromise}
            options={{ clientSecret: data.clientSecret, elementsOptions: { appearance } }}
          >
            <CheckoutForm summary={data.summary} onBack={backToRentalDetails} />
          </CheckoutElementsProvider>
          <OrderSummary summary={data.summary} />
        </div>

        <footer data-testid="checkout-footer" className="flex items-center gap-6 py-5 text-center">
          <span className="h-px flex-1 bg-white/[0.7]" aria-hidden="true" />
          <div><img src={logo} alt="Lorepa" className="mx-auto h-auto w-24 opacity-80" /><p className="mt-2 text-xs font-medium tracking-wide text-blue-950/[0.7]">Rent smarter. Travel further.</p></div>
          <span className="h-px flex-1 bg-white/[0.7]" aria-hidden="true" />
        </footer>
      </div>
    </main>
  );
};

export default CheckoutPage;
