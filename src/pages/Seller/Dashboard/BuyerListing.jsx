import React, { useEffect, useState } from "react";
import { FaPlus, FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import config from "../../../config";
import AddTrailerModal from "../Modal/AddTrailerModal";
import toast from "react-hot-toast";
import { buyerListingTranslations } from "./translation/buyerListingTranslations";

const BuyerListing = () => {
  const [trailers, setTrailers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState(null);

  const lang = localStorage.getItem("lang") || "fr";
  const t = (key) => buyerListingTranslations[lang]?.[key] || key;

  const filteredListings = trailers.filter((l) => {
    if (activeTab === "All") return true;
    if (activeTab === "Inactive")
      return l.status === "pending" || l.status === "decline";
    if (activeTab === "Active")
      return l.status !== "pending" && l.status !== "decline";
    return false;
  });

  const fetchTrailers = async () => {
    try {
      const result = await axios.get(
        `${config.baseUrl}/trailer/seller/${localStorage.getItem("userId")}`
      );
      setTrailers(result.data.data);
    } catch {
      toast.error(t("fetchError"));
    }
  };

  const deleteTrailer = async (id) => {
    if (!window.confirm(t("confirmDelete"))) return;

    setLoadingDelete(true);
    const toastId = toast.loading(t("deleting"));

    try {
      await axios.delete(`${config.baseUrl}/trailer/delete/${id}`);
      toast.success(t("deleted"), { id: toastId });
      setTrailers((prev) => prev.filter((t) => t._id !== id));
    } catch {
      toast.error(t("deleteError"), { id: toastId });
    }
    setLoadingDelete(false);
  };

  useEffect(() => {
    if (!isModalOpen) fetchTrailers();
  }, [isModalOpen]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
      <div className="p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">{t("myListings")}</h1>
          <p className="text-sm text-gray-500 font-medium">{t("manageFleet")}</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition active:scale-[0.98]"
        >
          <FaPlus className="mr-2" /> {t("addTrailer")}
        </button>
      </div>

      <div className="flex px-6 sm:px-8 overflow-x-auto scrollbar-hide border-b border-gray-100 gap-2">
        {[
          { key: "All", label: t("all") },
          { key: "Active", label: t("active") },
          { key: "Inactive", label: t("inactive") },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`py-4 px-6 text-sm font-bold whitespace-nowrap transition-all relative ${activeTab === tab.key
              ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600"
              : "text-gray-400 hover:text-gray-600"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <th className="px-8 py-4">{t("trailerDetails")}</th>
              <th className="px-8 py-4">{t("pricePerDay")}</th>
              <th className="px-8 py-4">{t("location")}</th>
              <th className="px-8 py-4">{t("category")}</th>
              <th className="px-8 py-4 text-center">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredListings.map((l) => (
              <tr key={l._id} className="hover:bg-gray-50/50 transition duration-150">
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={l.images[0] || "https://placehold.co/300x200?text=No+Image"}
                      className="h-16 w-24 rounded-xl border border-gray-100 object-cover shadow-sm"
                      onError={(e) => {
                        if (e.target.src !== "https://placehold.co/300x200?text=No+Image") {
                          e.target.src = "https://placehold.co/300x200?text=No+Image";
                        }
                      }}
                    />
                    <div>
                      <div className="font-bold text-gray-900">{l.title}</div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${l.status === 'pending' ? 'text-yellow-600' : l.status === 'decline' ? 'text-red-600' : 'text-green-600'}`}>
                        {t(l.status === "pending" ? "pending" : l.status === "decline" ? "decline" : "activeStatus")}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-gray-900 font-bold">${l.dailyRate}</span>
                  <span className="text-[10px] text-gray-400 font-bold ml-1 uppercase">{t("day")}</span>
                </td>
                <td className="px-8 py-6 text-sm text-gray-600 font-medium">
                  {[l.country, l.city].filter(Boolean).join(", ")}
                </td>
                <td className="px-8 py-6">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                    {l.category}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedTrailer(l);
                        setIsModalOpen(true);
                      }}
                      className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition"
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      onClick={() => deleteTrailer(l._id)}
                      disabled={loadingDelete}
                      className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden p-6 sm:p-8 space-y-6">
        {filteredListings.map((l) => (
          <div key={l._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="relative h-48">
              <img
                src={l.images[0] || "https://placehold.co/300x200?text=No+Image"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  if (e.target.src !== "https://placehold.co/300x200?text=No+Image") {
                    e.target.src = "https://placehold.co/300x200?text=No+Image";
                  }
                }}
              />
              <span className={`absolute top-4 left-4 px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm border bg-white ${l.status === 'pending' ? 'text-yellow-600 border-yellow-100' : l.status === 'decline' ? 'text-red-600 border-red-100' : 'text-green-600 border-green-100'}`}>
                {t(l.status === "pending" ? "pending" : l.status === "decline" ? "decline" : "activeStatus")}
              </span>
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedTrailer(l);
                    setIsModalOpen(true);
                  }}
                  className="p-2.5 bg-white/90 backdrop-blur-sm text-blue-600 rounded-xl shadow-sm hover:bg-white transition"
                >
                  <FaPencilAlt />
                </button>
                <button
                  onClick={() => deleteTrailer(l._id)}
                  disabled={loadingDelete}
                  className="p-2.5 bg-white/90 backdrop-blur-sm text-red-600 rounded-xl shadow-sm hover:bg-white transition"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-base font-bold text-gray-900 truncate pr-4">{l.title}</h3>
                <p className="text-blue-600 font-black whitespace-nowrap">${l.dailyRate}<span className="text-[10px] text-gray-400 font-bold ml-1 uppercase">{t("day")}</span></p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                <p>{[l.country, l.city].filter(Boolean).join(", ")}</p>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <p>{l.category}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddTrailerModal
        trailerData={selectedTrailer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default BuyerListing;
