import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { CheckoutElementsProvider, PaymentElement, useCheckoutElements } from "@stripe/react-stripe-js/checkout";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaArrowLeft, FaCheck, FaLock, FaShieldAlt, FaHeadset } from "react-icons/fa";
import config from "../config";
import logo from "../assets/logo.svg";

const money = (value) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(Number(value || 0));

const appearance = {
  theme: "stripe",
  variables: {
    colorPrimary: "#2563eb",
    colorText: "#172554",
    colorDanger: "#dc2626",
    colorBackground: "rgba(255, 255, 255, 0.82)",
    fontFamily: "Inter, Poppins, system-ui, sans-serif",
    borderRadius: "14px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": {
      border: "1px solid rgba(148, 163, 184, 0.55)",
      boxShadow: "inset 0 1px 2px rgba(15, 23, 42, 0.04)",
      padding: "13px 14px",
    },
    ".Input:focus": {
      border: "1px solid #3b82f6",
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.16)",
    },
    ".Label": { fontWeight: "600", color: "#1e3a8a" },
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
    <section className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_24px_80px_rgba(30,64,175,0.18)] backdrop-blur-xl sm:p-8">
      <button
        type="button"
        onClick={onBack}
        className="mb-7 inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-blue-950 transition hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
      >
        <FaArrowLeft aria-hidden="true" /> Back to Rental Details
      </button>

      <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">Protected payment</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Secure Checkout</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">Complete your booking without leaving Lorepa.</p>

      <ol aria-label="Checkout progress" className="my-7 grid grid-cols-3 gap-2 text-center text-xs font-semibold text-slate-500">
        {[
          ["1", "Payment", true],
          ["2", "Confirmation", false],
          ["3", "Done", false],
        ].map(([number, label, active]) => (
          <li key={label} aria-current={active ? "step" : undefined} className="relative">
            <span className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full border ${active ? "border-blue-600 bg-blue-600 text-white" : "border-blue-200 bg-white/70 text-slate-500"}`}>
              {number}
            </span>
            <span className={`mt-2 block ${active ? "text-blue-800" : ""}`}>{label}</span>
          </li>
        ))}
      </ol>

      <form onSubmit={handleSubmit} noValidate>
        <div className="rounded-2xl border border-blue-100/80 bg-white/65 p-4 sm:p-5">
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
          disabled={!canPay}
          className="mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 text-base font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          <FaLock aria-hidden="true" />
          {submitting ? "Processing securely…" : `Pay ${money(summary.total)} CAD`}
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

const OrderSummary = ({ summary }) => (
  <aside className="overflow-hidden rounded-[28px] border border-white/70 bg-white/80 shadow-[0_24px_80px_rgba(30,64,175,0.18)] backdrop-blur-xl">
    <div className="relative h-52 bg-gradient-to-br from-blue-200 to-slate-300 sm:h-64">
      {summary.trailer.image && (
        <img src={summary.trailer.image} alt="" className="h-full w-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
      <div className="absolute bottom-0 p-5 text-white sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-100">Your rental</p>
        <h2 className="mt-1 text-2xl font-bold">{summary.trailer.title}</h2>
      </div>
    </div>

    <div className="p-5 sm:p-7">
      <h2 className="text-xl font-bold text-slate-950">Order Summary</h2>
      <div className="mt-5 flex items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-3">
        <div className="h-16 w-20 overflow-hidden rounded-xl bg-blue-100">
          {summary.trailer.image && <img src={summary.trailer.image} alt="" className="h-full w-full object-cover" />}
        </div>
        <div>
          <p className="font-bold text-slate-900">{summary.trailer.title}</p>
          <p className="mt-1 text-sm text-slate-600">{summary.startDate} – {summary.endDate}</p>
          <p className="text-xs font-semibold text-blue-700">{summary.rentalDays} rental day{summary.rentalDays === 1 ? "" : "s"}</p>
        </div>
      </div>

      <dl className="mt-6 space-y-3 text-sm text-slate-600">
        <div className="flex justify-between gap-4"><dt>Base rental</dt><dd className="font-semibold text-slate-900">{money(summary.rentalPrice)}</dd></div>
        {summary.accessories.map((accessory) => (
          <div key={accessory.accessoryId || accessory.name} className="flex justify-between gap-4">
            <dt>{accessory.name} <span className="block text-xs text-slate-400">One-time fee</span></dt>
            <dd className="font-semibold text-slate-900">{money(accessory.price)}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-4"><dt>Lorepa service fee (5%)</dt><dd className="font-semibold text-slate-900">{money(summary.serviceFee)}</dd></div>
        <div className="border-t border-blue-100 pt-4">
          <div className="flex items-end justify-between gap-4">
            <dt className="text-base font-bold text-slate-950">Total</dt>
            <dd className="text-2xl font-extrabold text-blue-700">{money(summary.total)} <span className="text-xs font-bold">CAD</span></dd>
          </div>
        </div>
      </dl>

      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-sm leading-6 text-amber-950">
        <strong>Security deposit: {money(summary.depositAmount)} CAD</strong>
        <p className="mt-1 text-xs">This is a temporary card hold after verified payment, not part of today’s rental total.</p>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-blue-100 pt-5 text-center text-[11px] font-semibold text-slate-600">
        <div><FaShieldAlt className="mx-auto mb-2 text-lg text-blue-600" aria-hidden="true" />Secure</div>
        <div><FaCheck className="mx-auto mb-2 text-lg text-blue-600" aria-hidden="true" />Verified price</div>
        <div><FaHeadset className="mx-auto mb-2 text-lg text-blue-600" aria-hidden="true" />Support</div>
      </div>
    </div>
  </aside>
);

const StatePanel = ({ title, message, onBack, retry }) => (
  <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-sky-100 p-4">
    <div className="w-full max-w-lg rounded-3xl border border-white bg-white/85 p-8 text-center shadow-2xl backdrop-blur-xl">
      <img src={logo} alt="Lorepa" className="mx-auto h-16 w-16" />
      <h1 className="mt-5 text-2xl font-bold text-slate-950">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        {retry && <button onClick={retry} className="min-h-11 rounded-xl bg-blue-600 px-5 font-semibold text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300">Try again</button>}
        <button onClick={onBack} className="min-h-11 rounded-xl border border-blue-200 px-5 font-semibold text-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">Back to reservations</button>
      </div>
    </div>
  </main>
);

const CheckoutPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  const bookingId = params.get("bookingId") || "";
  const accessories = params.get("accessories")?.split(",").filter(Boolean) || [];
  const userId = localStorage.getItem("userId") || "";

  useEffect(() => {
    let active = true;
    const loadCheckout = async () => {
      setLoading(true);
      setError("");
      if (!bookingId || !userId) {
        setError("We could not identify an eligible reservation. Please return to your reservations and try again.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.post(`${config.baseUrl}/stripe/create-checkout-session`, {
          bookingId,
          userId,
          accessoryIds: accessories,
        });
        if (active) setData(response.data);
      } catch (requestError) {
        if (active) {
          setError(requestError.response?.data?.msg || "Secure checkout could not be loaded. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    loadCheckout();
    return () => { active = false; };
  }, [bookingId, userId, params, attempt]);

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

  const background = data.summary.trailer.image
    ? { backgroundImage: `linear-gradient(135deg, rgba(239,246,255,.92), rgba(219,234,254,.72)), url("${data.summary.trailer.image}")` }
    : undefined;

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-blue-100 via-sky-50 to-slate-200 bg-cover bg-center bg-fixed" style={background}>
      <div className="absolute inset-0 bg-white/15 backdrop-blur-[3px]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <header className="mb-5 flex items-center justify-center sm:mb-8">
          <a href="/" aria-label="Lorepa home" className="rounded-2xl bg-white/80 p-2 shadow-sm backdrop-blur-md focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300">
            <img src={logo} alt="Lorepa" className="h-14 w-14" />
          </a>
        </header>
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(380px,.88fr)] lg:gap-7">
          <CheckoutElementsProvider
            stripe={stripePromise}
            options={{ clientSecret: data.clientSecret, elementsOptions: { appearance } }}
          >
            <CheckoutForm summary={data.summary} onBack={backToRentalDetails} />
          </CheckoutElementsProvider>
          <OrderSummary summary={data.summary} />
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
