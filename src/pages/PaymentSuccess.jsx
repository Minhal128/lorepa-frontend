import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSearchParams, useNavigate } from "react-router-dom";
import config from "../config";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const confirmBooking = async () => {
      const bookingId = params.get("bookingId");
      const sessionId = params.get("session_id");

      if (!bookingId) {
        // Legacy flow: Create booking from URL params (backward compatibility) 
        const payload = {
          trailerId: params.get("trailerId"),
          user_id: params.get("user"),
          startDate: params.get("start"),
          endDate: params.get("end"),
          price: params.get("price"),
        };

        try {
          let res = await axios.post(`${config.baseUrl}/booking/create`, payload);
          if (res) {
            toast.success("Réservation confirmée !");
            navigate("/user/dashboard/reservation");
          }
        } catch (err) {
          toast.error("Booking confirmation failed");
          navigate("/user/dashboard/reservation");
        }
        return;
      }

      // Main flow: Process payment for existing booking
      try {
        // Step 1: Try to create deposit hold if we have sessionId
        if (sessionId) {
          try {
            await axios.post(`${config.baseUrl}/stripe/create-deposit-hold`, { bookingId, sessionId });
          } catch (err) {
            console.error("Deposit hold failed:", err?.response?.data || err.message);
            if (err?.response?.data?.refunded) {
              toast.error("Votre carte a été refusée pour la caution. Votre paiement de location a été remboursé. Veuillez réessayer avec une autre carte.", { duration: 8000 });
              navigate("/user/dashboard/reservation");
              return;
            }
            // Continue anyway - deposit hold failure shouldn't block the payment confirmation
            console.warn("Deposit hold failed but continuing with payment confirmation");
          }
        }

        // Step 2: Update booking status to paid
        try {
          await axios.put(`${config.baseUrl}/booking/status/${bookingId}`, {    
            status: "paid"
          });
        } catch (err) {
          console.error("Status update failed:", err);
          // Don't fail completely - the webhook might have already processed this
        }

        // Step 3: Verify payment was recorded (fallback check)
        const verifyPayment = async (attempts = 0) => {
          try {
            const verifyRes = await axios.get(`${config.baseUrl}/stripe/verify-payment/${bookingId}`);
            if (verifyRes.data.paid) {
              setStatus("success");
              toast.success("Paiement réussi ! Votre réservation est confirmée.");
              setTimeout(() => navigate("/user/dashboard/reservation"), 1500);
              return true;
            }
          } catch (err) {
            console.error("Verify payment error:", err);
          }
          
          // Retry up to 3 times with delay
          if (attempts < 3) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            return verifyPayment(attempts + 1);
          }
          return false;
        };

        const verified = await verifyPayment();
        
        if (!verified) {
          // Even if verification fails, still redirect - webhook will handle it
          setStatus("success");
          toast.success("Paiement en cours de traitement. Votre réservation sera confirmée sous peu.");
          setTimeout(() => navigate("/user/dashboard/reservation"), 2000);
        }

      } catch (err) {
        console.error("Payment confirmation error:", err);
        setStatus("error");
        toast.error("Une erreur s'est produite. Veuillez vérifier votre réservation.");
        setTimeout(() => navigate("/user/dashboard/reservation"), 3000);
      }
    };

    confirmBooking();
  }, [params, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center space-y-4">
        {status === "processing" && (
          <>
            <div className="w-16 h-16 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-medium text-gray-700">Traitement de votre paiement...</p>
            <p className="text-sm text-gray-500">Veuillez patienter pendant que nous confirmons votre réservation.</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p className="text-lg font-medium text-green-700">Paiement réussi !</p>
            <p className="text-sm text-gray-500">Redirection vers vos réservations...</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <p className="text-lg font-medium text-yellow-700">Traitement en cours</p>
            <p className="text-sm text-gray-500">Redirection vers vos réservations pour vérifier le statut...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
