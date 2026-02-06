import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import Footer from '../components/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar2 from '../components/Navbar2';
import axios from 'axios';
import config from '../config';
import toast from 'react-hot-toast';
import { trailersListingTranslations } from '../translations/trailerListing';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import BookingModal from '../components/BookingModel';
import { FiMap, FiList } from 'react-icons/fi';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, type: 'spring' },
  }),
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

const useQuery = () => new URLSearchParams(useLocation().search);

// Custom price marker icon for Leaflet
const createPriceIcon = (price) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="70" height="28">
      <rect x="0" y="0" width="70" height="24" rx="12" ry="12" fill="#2563eb" />
      <polygon points="35,28 30,24 40,24" fill="#2563eb"/>
      <text x="35" y="16" font-size="11" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-weight="bold">
        $${price}
      </text>
    </svg>
  `;
  return L.divIcon({
    html: `<img src="data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}" style="width: 70px; height: 28px;" />`,
    className: 'custom-price-marker',
    iconSize: [70, 28],
    iconAnchor: [35, 28],
    popupAnchor: [0, -28]
  });
};

// Component to handle map center changes
const MapCenterHandler = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], map.getZoom());
    }
  }, [center, map]);
  return null;
};

const TrailersListing = () => {
  const nav = useNavigate();
  const query = useQuery();
  const cityFromQuery = query.get('city')?.toLowerCase() || '';
  const isLogin = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const [priceFilter, setPriceFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [filteredTrailers, setFilteredTrailers] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [activeTrailer, setActiveTrailer] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedTrailerForBooking, setSelectedTrailerForBooking] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 45.5017, lng: -73.5673 });
  const [showMap, setShowMap] = useState(false); // Mobile map/list toggle

  const [translations, setTranslations] = useState(() => {
    const storedLang = localStorage.getItem('lang');
    return trailersListingTranslations[storedLang] || trailersListingTranslations.fr;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const storedLang = localStorage.getItem('lang');
      setTranslations(trailersListingTranslations[storedLang] || trailersListingTranslations.fr);
    };
    window.addEventListener('storage', handleStorageChange);
    handleStorageChange();
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleCardClick = (id) => nav(`/trailers/${id}`);

  const handleBookNowClick = (e, trailer) => {
    e.stopPropagation();
    setSelectedTrailerForBooking(trailer);
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedTrailerForBooking(null);
  };

  const handleBookingSubmit = async ({ trailerId, startDate, endDate, price }) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      toast.error("User not found");
      return;
    }

    let loadingToast = toast.loading("Redirecting to payment...");

    try {
      const { data } = await axios.post(`${config.baseUrl}/stripe/create-checkout-session`, {
        trailerId,
        userId,
        startDate,
        endDate,
        price,
      });

      toast.dismiss(loadingToast);
      window.location.href = data.url;

    } catch (error) {
      toast.error("Payment failed", { id: loadingToast });
    }
  };


  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTrailers(cityFromQuery);
  }, [cityFromQuery]);

  useEffect(() => {
    let filtered = [...trailers];
    if (priceFilter === 'lowToHigh') filtered.sort((a, b) => parseFloat(a.dailyRate) - parseFloat(b.dailyRate));
    else if (priceFilter === 'highToLow') filtered.sort((a, b) => parseFloat(b.dailyRate) - parseFloat(a.dailyRate));
    if (typeFilter) filtered = filtered.filter(t => t.category?.toLowerCase() === typeFilter.toLowerCase());
    if (keyword.trim()) filtered = filtered.filter(t =>
      t.title?.toLowerCase().includes(keyword.toLowerCase()) ||
      t.description?.toLowerCase().includes(keyword.toLowerCase())
    );
    if (sortBy === 'popular') filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setFilteredTrailers(filtered);
  }, [priceFilter, typeFilter, keyword, sortBy, trailers]);

  const fetchTrailers = async (cityFilter) => {
    setTrailers([]); // Clear old results to ensure refresh
    try {
      let url = `${config.baseUrl}/trailer/all/approved`;

      // Use the new search endpoint if there's a location filter
      if (cityFilter) {
        url = `${config.baseUrl}/trailer/search?location=${encodeURIComponent(cityFilter)}`;
      }

      console.log('Fetching trailers with URL:', url);
      const res = await axios.get(url);
      let allTrailers = res.data.data || [];

      // If search returns no results and we have a city filter, try a fallback search
      if (allTrailers.length === 0 && cityFilter) {
        console.log('No results found, trying fallback search...');
        // Try searching with just the first part of the location (e.g., "Montreal" from "Montreal, QC, Canada")
        const firstPart = cityFilter.split(',')[0].trim();
        if (firstPart !== cityFilter) {
          const fallbackUrl = `${config.baseUrl}/trailer/search?location=${encodeURIComponent(firstPart)}`;
          console.log('Fallback URL:', fallbackUrl);
          const fallbackRes = await axios.get(fallbackUrl);
          allTrailers = fallbackRes.data.data || [];
        }

        // If still no results, get all trailers and filter client-side as backup
        if (allTrailers.length === 0) {
          console.log('Still no results, getting all trailers and filtering client-side...');
          const allRes = await axios.get(`${config.baseUrl}/trailer/all/approved`);
          const allData = allRes.data.data || [];

          // Simplify: search for any parts of the city filter in city or country
          const searchParts = cityFilter.split(/[,\s]+/).filter(p => p.length >= 2);

          allTrailers = allData.filter((t) => {
            return searchParts.every(part =>
              t.city?.toLowerCase().includes(part) ||
              t.state?.toLowerCase().includes(part) ||
              t.country?.toLowerCase().includes(part)
            );
          });
        }
      }

      console.log('Final trailers count:', allTrailers.length);
      setTrailers(allTrailers);
    } catch (err) {
      console.error('Error fetching trailers:', err);
      toast.error(translations.failedToFetch);
    }
  };

  // Using OpenStreetMap Nominatim API for geocoding (FREE, no API key needed)
  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!cityFromQuery) return;

      try {
        // Using OpenStreetMap Nominatim API for geocoding
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
          params: {
            q: cityFromQuery,
            format: 'json',
            limit: 1
          },
          headers: {
            'Accept-Language': 'en'
          }
        });

        if (response.data && response.data.length > 0) {
          const location = response.data[0];
          setMapCenter({ lat: parseFloat(location.lat), lng: parseFloat(location.lon) });
        } else {
          // Default to Montreal if city not found
          setMapCenter({ lat: 45.5017, lng: -73.5673 });
        }
      } catch (error) {
        console.error('Error fetching geocode:', error);
        setMapCenter({ lat: 45.5017, lng: -73.5673 });
      }
    };

    fetchCoordinates();
  }, [cityFromQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar2 />
      <main className="flex-1 mobile-px py-4 sm:py-6 lg:py-8">
        {/* Mobile Map/List Toggle */}
        <div className="flex lg:hidden justify-center mb-4">
          <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
            <button
              onClick={() => setShowMap(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${!showMap ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <FiList className="h-4 w-4" />
              List
            </button>
            <button
              onClick={() => setShowMap(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${showMap ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <FiMap className="h-4 w-4" />
              Map
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* List Section */}
          <div className={`lg:w-2/3 ${showMap ? 'hidden lg:block' : 'block'}`}>
            {/* Mobile Filter Bar - Horizontal Scroll */}
            <div className="mobile-filter-bar mb-4 lg:hidden">
              <select
                className="mobile-filter-chip"
                onChange={(e) => setPriceFilter(e.target.value)}
                value={priceFilter}
              >
                <option value="">{translations.price}</option>
                <option value="lowToHigh">{translations.lowToHigh}</option>
                <option value="highToLow">{translations.highToLow}</option>
              </select>
              <select
                className="mobile-filter-chip"
                onChange={(e) => setTypeFilter(e.target.value)}
                value={typeFilter}
              >
                <option value="">{translations.type}</option>
                <option value="Utility">{translations.utility}</option>
                <option value="Enclosed">{translations.enclosed}</option>
                <option value="Flatbed">{translations.flatbed}</option>
                <option value="Dump">{translations.dump}</option>
                <option value="Boat">{translations.boat}</option>
              </select>
              <select
                className="mobile-filter-chip"
                onChange={(e) => setSortBy(e.target.value)}
                value={sortBy}
              >
                <option value="">{translations.popular}</option>
                <option value="popular">{translations.mostRecent}</option>
              </select>
            </div>

            {/* Desktop Filters */}
            <div className="hidden lg:flex justify-between items-center mb-6 flex-wrap gap-4">
              <div className="flex flex-wrap gap-4">
                <select className="bg-[#F1F1F1] p-2 px-4 rounded-md" onChange={(e) => setPriceFilter(e.target.value)}>
                  <option value="">{translations.price}</option>
                  <option value="lowToHigh">{translations.lowToHigh}</option>
                  <option value="highToLow">{translations.highToLow}</option>
                </select>
                <select className="bg-[#F1F1F1] p-2 px-4 rounded-md" onChange={(e) => setTypeFilter(e.target.value)}>
                  <option value="">{translations.type}</option>
                  <option value="Utility">{translations.utility}</option>
                  <option value="Enclosed">{translations.enclosed}</option>
                  <option value="Flatbed">{translations.flatbed}</option>
                  <option value="Dump">{translations.dump}</option>
                  <option value="Boat">{translations.boat}</option>
                </select>
                <input
                  type="text"
                  placeholder={translations.keywordSearch}
                  className="bg-[#F1F1F1] p-2 px-4 rounded-md"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>

            {/* Results Count & Sort */}
            <div className='flex justify-between items-center mb-4 lg:mb-6'>
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-700">
                {filteredTrailers.length} {translations.trailersAvailable}
              </h2>
              <select className="hidden lg:block bg-[#F1F1F1] p-2 px-4 rounded-md" onChange={(e) => setSortBy(e.target.value)}>
                <option value="">{translations.popular}</option>
                <option value="popular">{translations.mostRecent}</option>
              </select>
            </div>

            {/* Trailer Cards Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredTrailers.map((trailer, i) => (
                <motion.div
                  key={trailer._id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  className="bg-white rounded-xl shadow-mobileCard overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                  onClick={() => handleCardClick(trailer._id)}
                >
                  <div className="relative aspect-[4/3] w-full">
                    <img
                      src={trailer.images?.[0] || `https://placehold.co/400x300/F3F4F6/9CA3AF?text=${encodeURIComponent(translations.noImage)}`}
                      alt={trailer.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 line-clamp-1">{trailer.title}</h3>
                    <p className="text-gray-500 text-xs sm:text-sm mb-2">{trailer.city}, {trailer.state}</p>
                    <div className='flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2'>
                      <p className="text-black font-medium text-base sm:text-lg">${trailer.dailyRate}{translations.perDay}</p>
                      {
                        (isLogin && role !== "owner") &&
                        <button
                          className='bg-blue-600 text-white text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full xs:w-auto text-center'
                          onClick={(e) => handleBookNowClick(e, trailer)}
                        >
                          {translations.bookNow}
                        </button>
                      }
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* No Results */}
            {filteredTrailers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">{translations.noTrailersFound}</p>
              </div>
            )}
          </div>

          {/* Map Section - OpenStreetMap with Leaflet */}
          <div className={`lg:w-1/3 flex-shrink-0 ${showMap ? 'block' : 'hidden lg:block'}`}>
            <div className="h-[60vh] lg:h-[80vh] rounded-xl overflow-hidden shadow-mobileCard sticky top-20">
              <MapContainer
                center={[mapCenter.lat, mapCenter.lng]}
                zoom={10}
                style={{ width: '100%', height: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapCenterHandler center={mapCenter} />
                
                {filteredTrailers.map((trailer) => {
                  const lat = parseFloat(trailer.latitude);
                  const lng = parseFloat(trailer.longitude);
                  
                  // Skip if invalid coordinates
                  if (isNaN(lat) || isNaN(lng)) return null;
                  
                  return (
                    <Marker
                      key={trailer._id}
                      position={[lat, lng]}
                      icon={createPriceIcon(trailer.dailyRate)}
                      eventHandlers={{
                        click: () => setActiveTrailer(trailer)
                      }}
                    >
                      <Popup>
                        <div className="p-1">
                          <h3 className="font-semibold text-sm">{trailer.title}</h3>
                          <p className="text-blue-600 font-medium">${trailer.dailyRate}{translations.perDay}</p>
                          <p className="text-gray-600 text-xs">{trailer.city}, {trailer.state}</p>
                          <button 
                            onClick={() => handleCardClick(trailer._id)}
                            className="mt-2 bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 w-full"
                          >
                            {translations.viewDetails || 'View Details'}
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          </div>
        </div>

        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={handleCloseBookingModal}
          trailer={selectedTrailerForBooking}
          translations={translations}
          onSubmit={handleBookingSubmit}
        />

      </main>

      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }}>
        <Footer />
      </motion.div>
    </div>
  );
};

export default TrailersListing;

