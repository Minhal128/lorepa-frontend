import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(5);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => {
      clearInterval(countdown);
      clearTimeout(redirect);
    };
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-10 max-w-md text-center animate-fadeIn">
        
        {/* Error Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 flex items-center justify-center bg-red-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-600 animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v4m0 4h.01M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-red-600 mb-3">
          Payment Failed
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Your payment was canceled or failed.  
          You will be redirected to the homepage in <span className="font-bold">{timer}</span> seconds.
        </p>

        {/* Button */}
        <button
          onClick={() => navigate("/")}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all"
        >
          Go to Homepage Now
        </button>
      </div>
    </div>
  );
};

export default PaymentCancel;
