import { useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSearchParams, useNavigate } from "react-router-dom";
import config from "../config";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const confirmBooking = async () => {
      const bookingId = params.get("bookingId");
      const price = params.get("price");
      const sessionId = params.get("session_id");

      if (bookingId) {
        // New flow: Update existing booking status to "paid"
        try {
          await axios.put(`${config.baseUrl}/booking/status/${bookingId}`, {
            status: "paid"
          });

          if (sessionId) {
            try {
              await axios.post(`${config.baseUrl}/stripe/create-deposit-hold`, { bookingId, sessionId });
              toast.success("Paiement réussi et caution sécurisée !");
            } catch (err) {
              console.error("Deposit hold failed:", err?.response?.data || err.message);
              toast.error("Paiement réussi, mais la caution de sécurité a échoué. Veuillez contacter le support.", { duration: 6000 });
              // Mark booking deposit status explicitly or handle gracefully
            }
          } else {
            toast.success("Paiement réussi ! Votre réservation est confirmée.");
          }

          navigate("/user/dashboard/reservation");
        } catch (err) {
          toast.error("Failed to update booking status");
          navigate("/user/dashboard/reservation");
        }
      } else {
        // Legacy flow: Create booking from URL params (backward compatibility)
        const payload = {
          trailerId: params.get("trailerId"),
          user_id: params.get("user"),
          startDate: params.get("start"),
          endDate: params.get("end"),
          price: price,
        };

        try {
          let res = await axios.post(`${config.baseUrl}/booking/create`, payload);
          if (res) {
            toast.success("Réservation confirmée !");
            navigate("/user/dashboard/reservation");
          }
        } catch (err) {
          toast.error("Booking confirmation failed");
        }
      }
    };

    confirmBooking();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium text-gray-700">Traitement de votre paiement...</p>
        <p className="text-sm text-gray-500">Veuillez patienter pendant que nous confirmons votre réservation.</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
