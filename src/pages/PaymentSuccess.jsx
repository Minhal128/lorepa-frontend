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

      if (bookingId) {
        // New flow: Update existing booking status to "paid"
        try {
          await axios.put(`${config.baseUrl}/booking/status/${bookingId}`, {
            status: "paid"
          });
          toast.success("Payment successful! Your booking is confirmed.");
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
            toast.success("Booking confirmed!");
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
        <p className="text-lg font-medium text-gray-700">Processing your payment...</p>
        <p className="text-sm text-gray-500">Please wait while we confirm your booking.</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
