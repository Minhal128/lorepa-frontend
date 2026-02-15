import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaAngleDown, FaAngleUp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import config from '../config';
import manImage from '../assets/dashboard/review1.jpg'
import manImage2 from '../assets/dashboard/review2.jpg'
import manImage3 from '../assets/dashboard/review3.jpg'
import { singleTrailerTranslations } from './singleTrailerTranslations';
import { trailersListingTranslations } from '../translations/trailerListing';
import toast from 'react-hot-toast';
import BookingModal from '../components/BookingModel';

const reviews = [
  {
    name: "Rodney Jean-Baptiste",
    rating: 5,
    timeAgo: {
      en: "1 week ago",
      es: "hace 1 semana",
      cn: "1 周前",
      fr: "il y a 1 semaine"
    },
    reviewText: {
      en: "It was my first time using Lorepa and I was very impressed! The host was extremely welcoming, showed me how to properly attach the trailer, and made sure everything was secure. Everything went smoothly, and communication was clear from start to finish. I’ll definitely book again through Lorepa without hesitation.",
      es: "¡Era la primera vez que usaba Lorepa y quedé muy impresionado! El anfitrión fue extremadamente acogedor, me mostró cómo sujetar correctamente el remolque y se aseguró de que todo estuviera seguro. Todo salió bien y la comunicación fue clara de principio a fin. Definitivamente volveré a reservar a través de Lorepa sin dudarlo.",
      cn: "这是我第一次使用Lorepa，印象非常深刻！房东非常热情，向我展示了如何正确连接拖车，并确保一切都安全。整个过程都很顺利，沟通从始至终都很清晰。我一定会毫不犹豫地再次通过Lorepa预订。",
      fr: "C'était ma première fois avec Lorepa et j'ai été très impressionné ! L'hôte a été extrêmement accueillant, m'a montré comment attacher correctement la remorque et s'est assuré que tout était sécurisé. Tout s'est bien passé et la communication a été claire du début à la fin. Je vais certainement réserver à nouveau via Lorepa sans hésitation."
    },
    avatar: manImage
  },
  {
    name: "Mathieu Beaulieu",
    rating: 5,
    timeAgo: {
      en: "4 days ago",
      es: "hace 4 días",
      cn: "4 天前",
      fr: "il y a 4 jours"
    },
    reviewText: {
      en: "Lorepa really made things easier for me! I needed a trailer at the last minute and was able to book one in just a few clicks. The host was very courteous and flexible with the schedule. The trailer was clean and sturdy, exactly what I needed. Great discovery — I’ll definitely rent again through Lorepa.",
      es: "¡Lorepa realmente me hizo las cosas más fáciles! Necesitaba un remolque a última hora y pude reservar uno con solo unos pocos clics. El anfitrión fue muy cortés y flexible con el horario. El remolque estaba limpio y resistente, exactamente lo que necesitaba. Gran descubrimiento: definitivamente volveré a alquilar a través de Lorepa.",
      cn: "Lorepa真的让我省事多了！我临时需要一个拖车，只用点击几下就预订到了。房东非常有礼貌，时间安排也很灵活。拖车干净结实，正是我所需要的。很棒的发现——我一定会再次通过Lorepa租用。",
      fr: "Lorepa m'a vraiment facilité la tâche ! J'avais besoin d'une remorque à la dernière minute et j'ai pu en réserver une en quelques clics. L'hôte a été très courtois et flexible avec l'horaire. La remorque était propre et robuste, exactement ce dont j'avais besoin. Une belle découverte — je relouerai certainement via Lorepa."
    },
    avatar: manImage2
  },
  {
    name: "Olivier Deslauriers",
    rating: 5,
    timeAgo: {
      en: "2 days ago",
      es: "hace 2 días",
      cn: "2 天前",
      fr: "il y a 2 jours"
    },
    reviewText: {
      en: "Lorepa is truly a convenient solution! I was able to book a trailer in just a few minutes, and the host was very helpful from start to finish. The trailer was in great condition and perfectly suited my need to move some furniture. I’m very satisfied with the experience and will definitely use Lorepa again.",
      es: "¡Lorepa es verdaderamente una solución conveniente! Pude reservar un remolque en solo unos minutos y el anfitrión fue de gran ayuda de principio a fin. El remolque estaba en excelentes condiciones y se adaptaba perfectamente a mi necesidad de mover algunos muebles. Estoy muy satisfecho con la experiencia y definitivamente volveré a usar Lorepa.",
      cn: "Lorepa确实是一个方便的解决方案！我只用了几分钟就预订了拖车，而且房东从头到尾都非常乐于助人。拖车状况良好，非常适合我搬家具的需求。我对这次体验非常满意，将来肯定会再次使用Lorepa。",
      fr: "Lorepa est vraiment une solution pratique ! J'ai pu réserver une remorque en quelques minutes seulement, et l'hôte a été très serviable du début à la fin. La remorque était en excellent état et convenait parfaitement à mon besoin de déménager des meubles. Je suis très satisfait de l'expérience et je réutiliserai certainement Lorepa."
    },
    avatar: manImage3
  }
];


const fadeVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};



const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div layout className="rounded-md mb-3 bg-white shadow-sm overflow-hidden">
      <button
        className="w-full flex justify-between items-center p-4 text-left font-medium text-black"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        {isOpen ? <FaAngleUp /> : <FaAngleDown />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 border-t border-gray-300 text-gray-700"
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ReviewBar = ({ label, percentage }) => (
  <div className="flex items-center mb-2 justify-between gap-2">
    <span className="text-sm text-gray-700 w-20 sm:w-24 flex-shrink-0">{label}</span>
    <div className='flex items-center gap-2 sm:gap-3 flex-1'>
      <div className="flex-1 max-w-[12rem] sm:max-w-none bg-[#BBCBF0] rounded-full h-2">
        <div className="bg-[#2563EB] h-2 rounded-full transition-all" style={{ width: `${percentage}%` }}></div>
      </div>
      <span className="text-sm text-gray-700 w-10 text-right">{percentage}%</span>
    </div>
  </div>
);

const ReviewCard = ({ name, rating, timeAgo, reviewText, avatar }) => (
  <div className="border-b border-gray-200 pb-4 mb-4 w-full md:w-[50%]">
    <div className='flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2'>
      <div className='flex items-center gap-2 xs:gap-3'>
        <img src={avatar} alt={name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0" />
        <div>
          <p className="font-semibold text-gray-900 text-sm sm:text-base">{name}</p>
          <div className="flex text-[#2563EB]">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 sm:w-4 sm:h-4 ${i < rating ? 'fill-current' : 'text-gray-300'}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.539 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.565-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-500 text-xs sm:text-sm">{timeAgo}</p>
    </div>
    <p className="text-[#757982] text-sm mt-3 leading-relaxed">{reviewText}</p>
  </div>
);

const SingleTrailer = () => {
  const isLogin = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [faqGuest, setFaqGuest] = useState([]);
  const [faqHost, setFaqHost] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { id } = useParams();
  const nav = useNavigate();
  const [randomReview, setRandomReview] = useState({});
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [translations, setTranslations] = useState(() => {
    const storedLang = localStorage.getItem('lang');
    return singleTrailerTranslations[storedLang] || singleTrailerTranslations.fr;
  });
  const [translations2, setTranslations2] = useState(() => {
    const storedLang = localStorage.getItem('lang');
    return trailersListingTranslations[storedLang] || trailersListingTranslations.fr;
  });

  const getFaqData = (lang) => {
    return {
      guest: [
        { question: lang.faqRenter1Q, answer: lang.faqRenter1A },
        { question: lang.faqRenter2Q, answer: lang.faqRenter2A },
        { question: lang.faqRenter3Q, answer: lang.faqRenter3A },
        { question: lang.faqRenter4Q, answer: lang.faqRenter4A },
        { question: lang.faqRenter5Q, answer: lang.faqRenter5A },
        { question: lang.faqRenter6Q, answer: lang.faqRenter6A },
        { question: lang.faqRenter7Q, answer: lang.faqRenter7A },
        { question: lang.faqRenter8Q, answer: lang.faqRenter8A },
        { question: lang.faqRenter9Q, answer: lang.faqRenter9A },
        { question: lang.faqRenter10Q, answer: lang.faqRenter10A },
        { question: lang.faqRenter11Q, answer: lang.faqRenter11A },
        { question: lang.faqRenter12Q, answer: lang.faqRenter12A },
        { question: lang.faqRenter13Q, answer: lang.faqRenter13A },
        { question: lang.faqGlobal1Q, answer: lang.faqGlobal1A },
        { question: lang.faqGlobal2Q, answer: lang.faqGlobal2A },
        { question: lang.faqGlobal3Q, answer: lang.faqGlobal3A },
      ],
      host: [
        { question: lang.faqOwner1Q, answer: lang.faqOwner1A },
        { question: lang.faqOwner2Q, answer: lang.faqOwner2A },
        { question: lang.faqOwner3Q, answer: lang.faqOwner3A },
        { question: lang.faqOwner4Q, answer: lang.faqOwner4A },
        { question: lang.faqOwner5Q, answer: lang.faqOwner5A },
        { question: lang.faqOwner6Q, answer: lang.faqOwner6A },
        { question: lang.faqOwner7Q, answer: lang.faqOwner7A },
        { question: lang.faqOwner8Q, answer: lang.faqOwner8A },
        { question: lang.faqOwner9Q, answer: lang.faqOwner9A },
        { question: lang.faqOwner10Q, answer: lang.faqOwner10A },
        { question: lang.faqOwner11Q, answer: lang.faqOwner11A },
        { question: lang.faqOwner12Q, answer: lang.faqOwner12A },
        { question: lang.faqGlobal1Q, answer: lang.faqGlobal1A },
        { question: lang.faqGlobal2Q, answer: lang.faqGlobal2A },
        { question: lang.faqGlobal3Q, answer: lang.faqGlobal3A },
      ]
    };
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const storedLang = localStorage.getItem('lang');
      const currentTranslations = singleTrailerTranslations[storedLang] || singleTrailerTranslations.fr;
      const currentTranslations2 = trailersListingTranslations[storedLang] || trailersListingTranslations.fr;
      setTranslations(currentTranslations);
      setTranslations2(currentTranslations2);
      const faqs = getFaqData(currentTranslations);
      setFaqGuest(faqs.guest);
      setFaqHost(faqs.host);
    };

    window.addEventListener('storage', handleStorageChange);
    handleStorageChange(); // Initial load

    // Set a random review on component mount
    const randomIndex = Math.floor(Math.random() * reviews.length);
    setRandomReview(reviews[randomIndex]);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const fetchTrailer = async () => {
      if (!id) return;
      try {
        const res = await axios.get(`${config.baseUrl}/trailer/single/${id}`);
        setTrailer(res.data.data);
      } catch (err) {
        setError(translations.failedToFetch);
      } finally {
        setLoading(false);
      }
    };
    fetchTrailer();
    window.scrollTo(0, 0);
  }, [id, translations]);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === trailer.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? trailer.images.length - 1 : prevIndex - 1
    );
  };

  const handleBookingSubmit = async ({ trailerId, startDate, endDate, price, message }) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      toast.error("User not found");
      return;
    }

    let loadingToast = toast.loading(translations2.submittingBooking || "Sending booking request...");

    try {
      const { data } = await axios.post(`${config.baseUrl}/booking/create`, {
        user_id: userId,
        trailerId,
        startDate,
        endDate,
        price,
        message,
      });

      toast.dismiss(loadingToast);
      toast.success(translations2.bookingSubmittedSuccess || "Booking request sent! Waiting for owner approval.");
      setIsBookingModalOpen(false);
      nav('/user/dashboard/reservation');

    } catch (error) {
      toast.error("Failed to send booking request", { id: loadingToast });
    }
  };

  const currentLang = localStorage.getItem('lang') || 'en';

  if (loading || error || !trailer) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center font-inter">
        <Navbar />
        <p className={error ? 'text-red-500' : ''}>
          {loading ? translations.loading : error || translations.trailerNotFound}
        </p>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-inter overflow-x-hidden">
      <Navbar />

      <main className="flex-1 mobile-px py-4 sm:py-6 lg:py-8">
        {/* Image Carousel */}
        <motion.div
          className="mb-6 sm:mb-8 rounded-xl overflow-hidden shadow-lg relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative aspect-[16/9] sm:aspect-[2/1] w-full">
            <img
              src={trailer.images?.[currentImageIndex] || `https://placehold.co/800x400/F3F4F6/9CA3AF?text=${encodeURIComponent(translations.noImage)}`}
              alt={trailer.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          {trailer.images && trailer.images.length > 1 && (
            <>
              <button
                className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 bg-[#2563EB] text-white p-2 sm:p-3 rounded-full hover:bg-blue-700 active:scale-95 transition-all shadow-lg"
                onClick={handlePrevImage}
                aria-label="Previous image"
              >
                <FaChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 bg-[#2563EB] text-white p-2 sm:p-3 rounded-full hover:bg-blue-700 active:scale-95 transition-all shadow-lg"
                onClick={handleNextImage}
                aria-label="Next image"
              >
                <FaChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              {/* Image Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {trailer.images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}
        </motion.div>

        {/* Info Cards */}
        <motion.div className="bg-white rounded-lg space-y-4" variants={fadeVariant} initial="hidden" animate="visible">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Basic Info */}
            <div className="border border-[#C3C3C3] p-4 sm:p-5 rounded-xl">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-[#0A0F18] mb-4">{translations.basicInfo}</h2>
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-2">
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">{translations.trailerTitle}</label>
                  <div className="text-[#0A0F18] text-sm font-semibold leading-relaxed break-words">
                    {trailer.title}
                  </div>
                </div>
                <div className="border-b border-gray-100 pb-2">
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">{translations.nameOfOwner}</label>
                  <div className="text-[#0A0F18] text-sm font-medium">
                    {trailer.userId?.name || translations.unknownOwner}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">{translations.category}</label>
                  <div className="text-[#0A0F18] text-sm font-medium">
                    {trailer.category}
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className='border border-[#C3C3C3] p-4 sm:p-5 rounded-xl'>
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-[#0A0F18] mb-4">{translations.pricingRentalTerms}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">{translations.daily}</label>
                  <div className='text-3xl font-bold text-blue-600 leading-none'>${trailer.dailyRate}</div>
                </div>
                {trailer.cleaningRate && (
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">{translations.cleaningFee}</label>
                    <div className='text-lg font-semibold text-gray-700'>${trailer.cleaningRate}</div>
                  </div>
                )}
                {trailer.securityRate && (
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">{translations.securityDeposit}</label>
                    <div className='text-lg font-semibold text-gray-700'>${trailer.securityRate}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <p className="text-gray-600 text-sm mb-1">{translations.detailedDescription}</p>
            <p className="text-gray-800 text-sm leading-relaxed">{trailer.description}</p>
          </div>

          {/* Trailer Details */}
          <div className="border border-[#C3C3C3] p-4 sm:p-5 rounded-xl">
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-[#0A0F18] mb-4">{translations.trailerDetails}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1 text-xs">{translations.hitchType}</label>
                <div className="text-gray-800 text-sm font-medium break-words">{trailer.hitchType || '-'}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1 text-xs">{translations.ballSize}</label>
                <div className="text-gray-800 text-sm font-medium break-words">{trailer.ballSize || '-'}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1 text-xs">{translations.weightCapacity}</label>
                <div className="text-gray-800 text-sm font-medium break-words">{trailer.weightCapacity || '-'}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1 text-xs">{translations.lightPlugConfiguration}</label>
                <div className="text-gray-800 text-sm font-medium break-words">{trailer.lightPlug || '-'}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1 text-xs">{translations.trailerDimension}</label>
                <div className="text-gray-800 text-sm font-medium break-words">{trailer.dimensions || '-'}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1 text-xs">{translations.year}</label>
                <div className="text-gray-800 text-sm font-medium break-words">{trailer.year || '-'}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1 text-xs">{translations.make}</label>
                <div className="text-gray-800 text-sm font-medium break-words">{trailer.make || '-'}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1 text-xs">{translations.model}</label>
                <div className="text-gray-800 text-sm font-medium break-words">{trailer.model || '-'}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg sm:col-span-2">
                <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1 text-xs">{translations.length}</label>
                <div className="text-gray-800 text-sm font-medium break-words">{trailer.length || '-'}</div>
              </div>
            </div>
          </div>


          {/* <div className="border border-[#C3C3C3] p-5 rounded-lg">
              <h3 className="text-[20px] font-[600] text-[#0A0F18] mb-4">{translations.finalSetup}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className='text-gray-600'>{translations.trailerValue}</p>
                <p className='text-gray-800 text-right'>${Number(trailer?.dailyRate) + Number(trailer?.monthlyRate) + Number(trailer?.cleaningRate) + Number(trailer?.securityRate) + Number(trailer?.insuranceDeductible)}</p>
              </div>
            </div> */}

          {/* <div className="border border-[#C3C3C3] p-5 rounded-lg mt-4">
              <h2 className="text-[20px] font-[600] text-[#0A0F18] mb-4">{translations.ratingsAndReviews}</h2>
              <div className="flex items-center mb-4">
                <span className="text-4xl font-bold text-gray-800 mr-2">5.0</span>
                <div className="flex text-[#2563EB]">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-6 h-6 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.539 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.565-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <ReviewBar label={translations.excellent} percentage={100} />
                <ReviewBar label={translations.good} percentage={0} />
                <ReviewBar label={translations.average} percentage={0} />
                <ReviewBar label={translations.belowAverage} percentage={0} />
                <ReviewBar label={translations.poor} percentage={0} />
              </div>

              <div className="space-y-6">
                <ReviewCard
                  name={randomReview.name}
                  rating={randomReview.rating}
                  timeAgo={randomReview.timeAgo?.[currentLang] || randomReview.timeAgo.fr}
                  reviewText={randomReview.reviewText?.[currentLang] || randomReview.reviewText.fr}
                  avatar={randomReview.avatar}
                />
              </div>
              <button className="mt-6 bg-[#2563EB] text-white hover:underline text-sm p-3 rounded-md">
                {translations.readMore}
              </button>
            </div> */}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="mt-6 flex flex-col sm:flex-row justify-end gap-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {
            (isLogin && role !== "owner") &&
            <button
              className='mobile-btn-primary w-full sm:w-auto'
              onClick={() => setIsBookingModalOpen(true)}
            >
              {translations2.bookNow}
            </button>
          }
          {
            !isLogin && (
              <button
                onClick={() => nav('/login')}
                className="mobile-btn-primary w-full sm:w-auto"
              >
                {translations.signupsignin}
              </button>
            )
          }
        </motion.div>

        {/* FAQ Section */}
        <div className="py-8 sm:py-10 text-black">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-6 text-center">{translations.faqTitle}</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6'>
            <div className='bg-[#F1F1F1] p-4 sm:p-5 rounded-xl'>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 mb-4">{translations.guests}</h3>
              <div className="space-y-2">
                {faqGuest.map((faq, index) => (
                  <AccordionItem key={`guest-faq-${index}`} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>

            <div className='bg-[#F1F1F1] p-4 sm:p-5 rounded-xl'>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 mb-4">{translations.hosts}</h3>
              <div className="space-y-2">
                {faqHost.map((faq, index) => (
                  <AccordionItem key={`host-faq-${index}`} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        trailer={trailer}
        translations={translations2}
        onSubmit={handleBookingSubmit}
      />


      <Footer />
    </div >
  );
};

export default SingleTrailer;