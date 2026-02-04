import React, { useEffect, useRef, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCloudUploadAlt,
  FaTimes,
} from "react-icons/fa";
import CustomSwitch from "../../../components/Switch";
import config from "../../../config";
import toast from "react-hot-toast";
import axios from "axios";
import { trailerTranslations } from "../Dashboard/translation/addTrailerTranslation";
const normalizeClosedDates = (input) => {
  if (!input) return [];

  let data = input;
  while (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      break;
    }
  }
  if (Array.isArray(data) && typeof data[0] === "string") {
    try {
      const parsed = JSON.parse(data[0]);
      if (Array.isArray(parsed)) return parsed;
    } catch { }
  }

  return Array.isArray(data) ? data : [];
};
const MAX_IMAGES = 8;

const AddTrailerModal = ({ isOpen, onClose, trailerData }) => {
  const wrapperRef = useRef(null);
  const [listingEnabled, setListingEnabled] = useState(true);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Utility");
  const [description, setDescription] = useState("");
  const [hitchType, setHitchType] = useState("");
  const [lightPlug, setLightPlug] = useState("");
  const [weightCapacity, setWeightCapacity] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [length, setLength] = useState("");
  const [ballSize, setBallSize] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [closedDates, setClosedDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [locationInput, setLocationInput] = useState("");
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    city: "",
    country: "",
  });
  const [dailyRate, setDailyRate] = useState(0);
  const [depositRate, setDepositRate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const maxDescChars = 300;
  const daysInThisMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const lang = localStorage.getItem("lang") || "fr";
  const t = (key) => trailerTranslations[lang]?.[key] || key;

  useEffect(() => {
    if (trailerData) {
      setTitle(trailerData.title);
      setCategory(trailerData.category);
      setDescription(trailerData.description);
      setExistingImages(trailerData.images || []);
      const normalizedClosedDates = normalizeClosedDates(
        trailerData.closedDates
      );
      setClosedDates(normalizedClosedDates);
      setLocation({
        latitude: trailerData.latitude,
        longitude: trailerData.longitude,
        city: trailerData.city || "",
        country: trailerData.country || "",
      });
      setDailyRate(trailerData.dailyRate || 0);
      setDepositRate(trailerData.depositRate || 0);
      setHitchType(trailerData.hitchType || "");
      setLightPlug(trailerData.lightPlug || "");
      setWeightCapacity(trailerData.weightCapacity || "");
      setMake(trailerData.make || "");
      setModel(trailerData.model || "");
      setYear(trailerData.year || "");
      setLength(trailerData.length || "");
      setBallSize(trailerData.ballSize || "");
      setDimensions(trailerData.dimensions || "");
      setLocationInput(trailerData.city ? `${trailerData.city}, ${trailerData.country}` : "");
    }
  }, [trailerData]);

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else setCurrentMonth(currentMonth - 1);
  };
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else setCurrentMonth(currentMonth + 1);
  };
  const toggleClosed = (day) => {
    const key = `${currentYear}-${currentMonth + 1}-${day}`;
    if (closedDates.includes(key))
      setClosedDates(closedDates.filter((d) => d !== key));
    else setClosedDates([...closedDates, key]);
  };
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const remainingSlots = MAX_IMAGES - (images.length + existingImages.length);

    if (remainingSlots <= 0) {
      toast.error(`Maximum ${MAX_IMAGES} photos allowed.`);
      return;
    }

    const filesToAdd = files.slice(0, remainingSlots);

    setImages((prev) => [...prev, ...filesToAdd]);

    if (files.length > remainingSlots) {
      toast.error(`Only ${remainingSlots} more photo(s) can be added.`);
    }
    e.target.value = "";
  };

  const removeImage = (index) =>
    setImages(images.filter((_, i) => i !== index));
  const removeExistingImage = (img) =>
    setExistingImages(existingImages.filter((i) => i !== img));

  const handleSubmitTrailer = async () => {
    if (!location.latitude || !location.longitude)
      return toast.error(t("locationRequired"));
    if (
      !title ||
      !category ||
      !description ||
      images.length + existingImages.length === 0
    )
      return toast.error(t("allFieldsRequired"));

    const formData = new FormData();
    formData.append("userId", localStorage.getItem("userId"));
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("latitude", location.latitude);
    formData.append("longitude", location.longitude);
    formData.append("city", location.city);
    formData.append("country", location.country);
    formData.append("dailyRate", dailyRate);
    formData.append("depositRate", depositRate);
    formData.append("closedDates", JSON.stringify(closedDates));
    formData.append("hitchType", hitchType);
    formData.append("lightPlug", lightPlug);
    formData.append("weightCapacity", weightCapacity);
    formData.append("make", make);
    formData.append("model", model);
    formData.append("year", year);
    formData.append("length", length);
    formData.append("ballSize", ballSize);
    formData.append("dimensions", dimensions);
    existingImages.forEach((img) => formData.append("existingImages", img));
    images.forEach((img) => formData.append("images", img));

    setLoading(true);
    const toastId = toast.loading(
      trailerData ? t("updatingTrailer") : t("creatingTrailer")
    );
    try {
      const url = trailerData
        ? `${config.baseUrl}/trailer/update/${trailerData._id}`
        : `${config.baseUrl}/trailer/create`;
      const method = trailerData ? "PUT" : "POST";
      const res = await fetch(url, { method, body: formData });
      const data = await res.json();
      if (res.ok) {
        toast.success(trailerData ? t("trailerUpdated") : t("trailerCreated"), {
          id: toastId,
        });
        onClose();
      } else toast.error(data.msg || t("operationFailed"), { id: toastId });
    } catch (err) {
      console.log(err);
      toast.error(t("somethingWentWrong"), { id: toastId });
    }
    setLoading(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (inputText) => {
    if (!inputText) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await axios.get(
        `${config.baseUrl.replace("/api/v1", "")}/api/autocomplete`,
        {
          params: { input: inputText },
        }
      );

      if (res.data.status === "OK") {
        // Just show all results to be safe, filter the list if needed but don't hide everything
        setSuggestions(res.data.predictions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = async (item) => {
    try {
      const res = await axios.get(
        `${config.baseUrl.replace("/api/v1", "")}/api/place-details`,
        {
          params: { placeId: item.place_id },
        }
      );

      const result = res.data.result;

      let city = "";
      let country = "";

      result.address_components.forEach((c) => {
        if (c.types.includes("locality")) city = c.long_name;
        if (!city && (c.types.includes("administrative_area_level_1") || c.types.includes("political"))) city = c.long_name;
        if (c.types.includes("country")) country = c.long_name;
      });

      setLocation({
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        city,
        country,
      });
      setLocationInput(item.description);

      setSuggestions([]);
      setShowSuggestions(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-gray-600/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-y-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {trailerData ? t("editTrailer") : t("addNewTrailer")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t("listingStatus")}
                    </label>
                    <p className="text-xs text-gray-500">
                      {t("listingDescription")}
                    </p>
                  </div>
                  <CustomSwitch
                    enabled={listingEnabled}
                    onChange={setListingEnabled}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("title")}
                  </label>
                  <input
                    type="text"
                    className="block w-full border border-gray-300 rounded-md py-2 px-3 outline-none"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("category")}
                  </label>
                  <select
                    className="block w-full border border-gray-300 rounded-md py-2 px-3 outline-none"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {[{value: "Utility", label: t("utility")}, {value: "Enclosed", label: t("enclosed")}, {value: "Flatbed", label: t("flatbed")}, {value: "Dump", label: t("dump")}, {value: "Boat", label: t("boat")}].map(
                      (c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      )
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("description")} ({t("maxChars")})
                  </label>
                  <textarea
                    rows="4"
                    className="block w-full border border-gray-300 rounded-md py-2 px-3 outline-none resize-none"
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value.slice(0, maxDescChars))
                    }
                  />
                  <p className="text-xs text-gray-500 text-right">
                    {description.length}/{maxDescChars}
                  </p>
                </div>
                <div className="relative" ref={wrapperRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("location")}
                  </label>
                  <input
                    type="text"
                    className="block w-full border border-gray-300 rounded-md py-2 px-3 outline-none"
                    value={locationInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      setLocationInput(value);
                      if (!value) {
                        setLocation({
                          latitude: null,
                          longitude: null,
                          city: "",
                          country: "",
                        });
                      }
                      fetchSuggestions(value);
                    }}
                  />
                  {isSearching && (
                    <p className="text-xs text-blue-600 mt-1 animate-pulse">{t("searchingLocations")}</p>
                  )}
                  {showSuggestions && (
                    <ul className="absolute z-50 top-full left-0 right-0 bg-white shadow-xl border border-gray-200 rounded-md mt-1 max-h-60 overflow-y-auto">
                      {suggestions.length > 0 ? (
                        suggestions.map((item, index) => (
                          <li
                            key={index}
                            onMouseDown={() => handleSelect(item)}
                            className="p-3 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-50 last:border-none"
                          >
                            {item.description}
                          </li>
                        ))
                      ) : !isSearching && locationInput.length > 2 && (
                        <li className="p-3 text-sm text-gray-500 italic">{t("noLocationsFound")}</li>
                      )}
                    </ul>
                  )}
                  <p className="text-[10px] text-gray-400 mt-1">
                    {t("locationHint")}
                  </p>
                </div>
                {location.city && location.country && (
                  <p className="text-sm text-gray-600 mt-2">
                    Location: {location.city}, {location.country}
                  </p>
                )}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("pricePerDay")}
                    </label>
                    <input
                      type="number"
                      value={dailyRate}
                      onChange={(e) => setDailyRate(e.target.value)}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">{t("make")}</label>
                    <input
                      value={make}
                      onChange={(e) => setMake(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">{t("model")}</label>
                    <input
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">{t("year")}</label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      {t("length")}
                    </label>
                    <input
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      {t("weightCapacity")}
                    </label>
                    <input
                      value={weightCapacity}
                      onChange={(e) => setWeightCapacity(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      {t("ballSize")}
                    </label>
                    <input
                      value={ballSize}
                      onChange={(e) => setBallSize(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      {t("hitchType")}
                    </label>
                    <select
                      value={hitchType}
                      onChange={(e) => setHitchType(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 outline-none"
                    >
                      <option value="">{t("select")}</option>
                      <option value="Receiver">{t("receiver")}</option>
                      <option value="Gooseneck">{t("gooseneck")}</option>
                      <option value="Fifth Wheel">{t("fifthWheel")}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      {t("lightPlug")}
                    </label>
                    <select
                      value={lightPlug}
                      onChange={(e) => setLightPlug(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 outline-none"
                    >
                      <option value="">{t("select")}</option>
                      <option>4-pin</option>
                      <option>5-pin</option>
                      <option>6-pin</option>
                      <option>7-pin</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium">
                      {t("trailerDimensions")}
                    </label>
                    <input
                      placeholder={t("dimensionsPlaceholder")}
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {t("photos")}
              </h3>
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 cursor-pointer block transition">
                <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">{t("uploadImage")}</p>
                <p className="text-xs text-gray-500">
                  {t("photoRecommendation")}
                </p>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
              </label>
              {existingImages.length + images.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mt-3">
                  {existingImages.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={img}
                        className="h-20 w-full object-cover rounded"
                      />
                      <button
                        onClick={() => removeExistingImage(img)}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
                  {images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={URL.createObjectURL(img)}
                        className="h-20 w-full object-cover rounded"
                      />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {t("closedDates")}
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <button
                    onClick={goToPrevMonth}
                    className="p-2 rounded-full hover:bg-gray-200"
                  >
                    <FaChevronLeft />
                  </button>
                  <span className="font-semibold text-gray-800">
                    {[t("january"), t("february"), t("march"), t("april"), t("may"), t("june"), t("july"), t("august"), t("september"), t("october"), t("november"), t("december")][currentMonth]} {currentYear}
                  </span>
                  <button
                    onClick={goToNextMonth}
                    className="p-2 rounded-full hover:bg-gray-200"
                  >
                    <FaChevronRight />
                  </button>
                </div>
                <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-2">
                  {[t("sun"), t("mon"), t("tue"), t("wed"), t("thu"), t("fri"), t("sat")].map((d) => (
                    <div key={d}>{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 text-sm">
                  {[...Array(firstDayOfMonth)].map((_, i) => (
                    <div key={i} className="p-2"></div>
                  ))}
                  {[...Array(daysInThisMonth)].map((_, i) => {
                    const day = i + 1;
                    const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
                    const isClosed = closedDates.includes(dateKey);
                    return (
                      <div
                        key={day}
                        onClick={() => toggleClosed(day)}
                        className={`p-2 text-center rounded-lg cursor-pointer transition ${isClosed
                          ? "bg-red-300 text-red-900"
                          : "bg-green-200 text-green-800"
                          }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  {t("closedDateHint").split(t("closed")).map((part, i, arr) => 
                    i === arr.length - 1 ? part : (
                      <React.Fragment key={i}>
                        {part}<span className="text-red-600 font-semibold">{t("closed")}</span>
                      </React.Fragment>
                    )
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 mr-3 hover:bg-gray-50"
          >
            {t("cancel")}
          </button>
          <button
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md"
            onClick={handleSubmitTrailer}
          >
            {loading ? t("saving") : t("saveTrailer")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTrailerModal;
