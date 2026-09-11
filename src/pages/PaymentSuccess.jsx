import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSearchParams, useNavigate } from "react-router-dom";
import config from "../config";
import { trackPurchase } from "../utils/metaPixel";

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const isTransientRequestError = (error) =>
  !error.response || error.response.status === 429 || error.response.status >= 500;

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Please wait while Stripe verifies your payment.");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    let redirectTimer;
    const bookingId = params.get("bookingId");
    const sessionId = params.get("session_id");

    const finish = async () => {
      if (!bookingId || !sessionId) {
        if (active) {
          setStatus("error");
          setMessage("This return link is incomplete. Open your reservations to check the payment status.");
        }
        return;
      }

      try {
        let verified;
        for (let attempt = 0; attempt < 4; attempt += 1) {
          try {
            const response = await axios.get(
              `${config.baseUrl}/stripe/verify-payment/${bookingId}?session_id=${encodeURIComponent(sessionId)}`
            );
            if (response.data.paid) {
              verified = response.data;
              break;
            }
          } catch (verificationError) {
            if (!isTransientRequestError(verificationError) || attempt === 3) {
              throw verificationError;
            }
          }
          if (attempt < 3) await wait(1500);
        }

        if (!verified) {
          throw new Error("Stripe has not confirmed this payment yet. You can safely retry verification.");
        }

        try {
          await axios.post(`${config.baseUrl}/stripe/create-deposit-hold`, { bookingId, sessionId });
        } catch (depositError) {
          const response = depositError.response?.data;
          if (response?.refunded) {
            if (active) {
              setStatus("refunded");
              setMessage("The security deposit could not be authorized, so your rental payment was refunded. Please try another card from your reservations.");
            }
            return;
          }
          throw new Error(response?.msg || "The security deposit could not be confirmed. Please retry.");
        }

        if (!active) return;
        setStatus("success");
        setMessage("Your payment and security deposit are confirmed. Redirecting to your reservations…");
        const analyticsKey = `lorepa:purchase:${sessionId}`;
        if (!sessionStorage.getItem(analyticsKey)) {
          try {
            sessionStorage.setItem(analyticsKey, "tracked");
            trackPurchase({ contentId: bookingId, value: Number(verified.total_paid || 0) });
          } catch (analyticsError) {
            console.error("Purchase analytics failed:", analyticsError);
          }
        }
        toast.success("Payment confirmed!");
        redirectTimer = setTimeout(() => navigate("/user/dashboard/reservation"), 1800);
      } catch (error) {
        if (active) {
          setStatus("error");
          setMessage(error.response?.data?.msg || error.message || "We could not verify the payment.");
        }
      }
    };

    setStatus("processing");
    setMessage("Please wait while Stripe verifies your payment.");
    finish();
    return () => {
      active = false;
      clearTimeout(redirectTimer);
    };
  }, [params, navigate, retry]);

  const successful = status === "success";
  const processing = status === "processing";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-sky-100 p-4">
      <section className="w-full max-w-lg rounded-3xl border border-white bg-white/85 p-8 text-center shadow-2xl backdrop-blur-xl" aria-live="polite">
        {processing && <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" aria-label="Verifying payment" />}
        {!processing && (
          <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${successful ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`} aria-hidden="true">
            <span className="text-3xl">{successful ? "✓" : "!"}</span>
          </div>
        )}
        <h1 className="mt-5 text-2xl font-bold text-slate-950">
          {processing ? "Verifying payment" : successful ? "Payment confirmed" : status === "refunded" ? "Payment refunded" : "Verification needs attention"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
        {!processing && !successful && (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {status === "error" && (
              <button onClick={() => setRetry((value) => value + 1)} className="min-h-11 rounded-xl bg-blue-600 px-5 font-semibold text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300">
                Retry verification
              </button>
            )}
            <button onClick={() => navigate("/user/dashboard/reservation")} className="min-h-11 rounded-xl border border-blue-200 px-5 font-semibold text-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">
              Back to reservations
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default PaymentSuccess;
