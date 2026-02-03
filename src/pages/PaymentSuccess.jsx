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
      const payload = {
        trailerId: params.get("trailerId"),
        user_id: params.get("user"),
        startDate: params.get("start"),
        endDate: params.get("end"),
        price: params.get("price"),
      };

      try {
        let res = await axios.post(`${config.baseUrl}/booking/create`, payload);
        if(res){
            toast.success("Booking confirmed!");
            navigate("/user/dashboard/reservation");
        }
      } catch (err) {
        toast.error("Booking confirmation failed");
      }
    };

    confirmBooking();
  }, []);

  return <div className="p-10 text-center">Processing your booking...</div>;
};

export default PaymentSuccess;
