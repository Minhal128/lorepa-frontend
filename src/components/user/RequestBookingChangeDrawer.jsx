import React, { useState } from "react";
import { FaCalendar, FaTimes } from "react-icons/fa";
import { format } from "date-fns";
import toast from "react-hot-toast";
import axios from "axios";
import config from "../../config";

const RequestBookingChangeDrawer = ({
  reservation,
  onClose,
}) => {
  const [newPickupDate, setNewPickupDate] = useState("");
  const [newReturnDate, setNewReturnDate] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [notificationPreference, setNotificationPreference] = useState("Email");

  if (!reservation) return null;

  const currentPickupDate = format(new Date(reservation.startDate), "MMM d");
  const currentReturnDate = format(new Date(reservation.endDate), "yyyy, MMM d");
  const trailerTitle = reservation?.trailerId?.title || "Unknown Trailer";

  const handleSubmitChangeRequest = async (e) => {
    e.preventDefault();

    if (!newPickupDate && !newReturnDate) {
      toast.error("Please select at least one date for the change request.");
      return;
    }

    try {
      await axios.put(
        `${config.baseUrl}/booking/request-change/${reservation._id}`,
        {
          startDate: newPickupDate || reservation.startDate,
          endDate: newReturnDate || reservation.endDate,
          notes: additionalNotes,
        }
      );

      toast.success("Change request submitted successfully!");
      onClose();
    } catch (err) {
      console.log(err);
      toast.error("Failed to submit change request");
    }
  };


  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-gray-600 bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Drawer */}
        <section className="absolute inset-y-0 right-0 max-w-full flex">
          <div className="w-screen max-w-lg"> {/* Increased max-width for better look */}
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
              <form onSubmit={handleSubmitChangeRequest} className="h-full flex flex-col">
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Request Booking Change</h2>
                    <p className="text-sm text-gray-700 mt-1">Submit a change request to the owner of{" "} <span className="font-semibold text-blue-600">{trailerTitle}</span></p>
                  </div>
                  <button type="button" className="text-gray-400 hover:text-gray-500" onClick={onClose}>
                    <FaTimes className="w-6 h-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 sm:p-6 space-y-6">

                  {/* 1. Date Change */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">1. Date Change</h3>

                    {/* New Pickup Date */}
                    <div>
                      <label htmlFor="newPickupDate" className="block text-sm font-medium text-gray-700">New Pickup Date (<span className="text-gray-500">Currently: {currentPickupDate}</span>)</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input type="date" id="newPickupDate" name="newPickupDate" value={newPickupDate} onChange={(e) => setNewPickupDate(e.target.value)} placeholder="mm/dd/yyyy" className="w-full p-2 border-[#C3C3C3] border rounded-md outline-none mt-2" />
                      </div>
                    </div>

                    {/* New Return Date */}
                    <div>
                      <label htmlFor="newReturnDate" className="block text-sm font-medium text-gray-700">New Return Date (<span className="text-gray-500">Currently: {currentReturnDate}</span>)</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input type="date" id="newReturnDate" name="newReturnDate" value={newReturnDate} onChange={(e) => setNewReturnDate(e.target.value)} placeholder="mm/dd/yyyy" className="w-full p-2 border-[#C3C3C3] border rounded-md outline-none mt-2" />
                      </div>
                    </div>

                    {/* Note */}
                    <div className="p-3 text-sm rounded-md bg-blue-50 border-l-4 border-blue-400 text-blue-700">
                      <span className="font-bold">Note:</span> Date changes are subject to owner approval.
                    </div>
                  </div>

                  {/* 2. Additional Notes */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800">2. Additional Notes</h3>
                    <textarea
                      id="additionalNotes"
                      name="additionalNotes"
                      rows="4"
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="Explain what you'd like to change and why..."
                      className="shadow-sm outline-none p-2 block w-full sm:text-sm border-[#C3C3C3] border rounded-md"
                    ></textarea>
                  </div>

                  {/* 3. Notification Preference */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800">3. Notification Preference</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          id="notifyEmail"
                          name="notificationPreference"
                          type="radio"
                          value="Email"
                          checked={notificationPreference === "Email"}
                          onChange={() => setNotificationPreference("Email")}
                          className="border-[#C3C3C3] border"
                        />
                        <label htmlFor="notifyEmail" className="ml-3 block text-sm font-medium text-gray-700">
                          Notify me by Email
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="inAppOnly"
                          name="notificationPreference"
                          type="radio"
                          value="InApp"
                          checked={notificationPreference === "InApp"}
                          onChange={() => setNotificationPreference("InApp")}
                          className="border-[#C3C3C3] border"
                        />
                        <label htmlFor="inAppOnly" className="ml-3 block text-sm font-medium text-gray-700">
                          In-app only
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer / Action Buttons */}
                <div className="pt-2 py-4 px-4">
                  <button onClick={handleSubmitChangeRequest} className="w-full p-3 border border-blue-600 rounded-lg text-blue-600 font-medium hover:bg-blue-50 transition">
                    Send Request
                  </button>
                  <button onClick={onClose} className="w-full p-3 mt-2 border border-[#EA4335] rounded-lg text-[#EA4335] font-medium bg-transparent transition">
                    Cancel
                  </button>

                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RequestBookingChangeDrawer;