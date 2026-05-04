import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Img from "../assets/landing/img.png";
import Host1 from "../assets/landing/rent_trailer_img.png";
import Host2 from "../assets/landing/become_host_img.png";
import Web from "../assets/landing/web.png";
import Mobile from "../assets/landing/mobile.jpg";

import {
    FaAngleDown,
    FaAngleUp,
    FaAngleLeft,
    FaAngleRight,
    FaSearch,
    FaLongArrowAltRight,
} from "react-icons/fa";
import axios from "axios";
import config from "../config";
import { Link, useNavigate } from "react-router-dom";
import { blurIn, fadeIn, fadeInDown, fadeInUp, flipIn, scaleIn, zoomBounce } from "../../animation";
import AccordionItem from "./AccordionItem";

const getStoredLanguage = () => {
    const rawLang = localStorage.getItem('lang') || localStorage.getItem('i18nextLng') || 'fr';
    const normalizedLang = rawLang.split('-')[0];
    return normalizedLang;
};

const translations = {
    en: {
        trailerRental: "Trailer rental reinvented",
        rentAnywhere: "Rent the trailer you want, wherever you want!",
        where: "Where",
        placeholder: "City, airport, hotel",
        from: "From",
        until: "Until",
        newWay: "The new way to rent a trailer 24/7!",
        discover: "Discover the premier platform for trailer sharing between individuals in Quebec.",
        needTrailer: "Whether You Need a Trailer",
        shareOne: "or Have One to Share",
        rentTrailerTitle: "Rent a Trailer",
        rentTrailerDescription: "Find the perfect trailer for your needs, wherever you are in Quebec. Browse, book, and go!",
        rentTrailerButton: "Rent a trailer",
        becomeHostTitle: "Become a host",
        becomeHostDescription: "List your trailer and start earning by helping others move, travel, and explore. It's easy and secure",
        becomeHostButton: "Become a host",
        trustedBy: "Trusted by 1000 +",
        leadingPlatform: "Our company is the leading sharing platform where you can book any type of trailer from private individuals,",
        dynamicCommunity: "whatever the occasion, with a dynamic community of trusted hosts.",
        thankYou: "You are one of 1000 + people who trust us completely, Thank you!",
        popularLocations: "Popular Locations",
        carHauler: "Browse Trailers",
        faq: "Frequently asked questions",
        seeAllFaq: "See all FAQ",
        searchButton: "Search",
        searching: "Searching...",
        noResults: "No results found",
        guests: "Guests",
        hosts: "Hosts",
        faqContent: {
            renters: [
                { question: "What do I need to rent a trailer on Lorepa?", answer: "To rent a trailer, you must be at least 21 years old, hold a valid driver’s license, and provide proof of insurance. You will also need a verified Lorepa account." },
                { question: "How does the rental process work?", answer: "You browse available trailers, send a request to the owner, and once approved, confirm your booking. A rental contract and inspection photos are generated automatically." },
                { question: "Is insurance included in my rental?", answer: "No. You are required to provide valid auto insurance that covers towing. Additional optional protection may be offered during checkout." },
                { question: "Can I cancel my booking?", answer: "Yes, you can cancel under the terms described in our cancellation policy. Refunds may vary depending on when the cancellation is made relative to the start date." },
                { question: "What happens if I return the trailer late?", answer: "Late returns may incur a flat penalty fee, as outlined in the Terms of Use. Always notify the owner in case of delay to avoid disputes." },
            ],
            owners: [
                { question: "How do I list my trailer?", answer: "You can list your trailer by signing up, filling in key details (description, availability, pricing), uploading photos, and providing required documents (registration, insurance)." },
                { question: "How much can I earn with Lorepa?", answer: "You keep 85% of the rental price. The remaining 15% covers Lorepa’s service fee. Payouts are processed automatically via Stripe within 3–5 business days after the rental ends." },
                { question: "Can I cancel a reservation?", answer: "Yes, but owners are allowed only 2 free cancellations every 6 months. After that, a $100 CAD penalty applies if the cancellation is within policy. Abuse of cancellations is subject to account review." },
                { question: "What if my trailer is returned late or damaged?", answer: "You can report any issue via the platform within 24 hours. Lorepa can assist with deducting penalties or damage costs from the renter’s deposit." },
                { question: "Do I need special insurance as an owner?", answer: "You must maintain valid trailer insurance. Lorepa does not provide direct coverage to owners. However, optional protection programs may be introduced in future." },
            ]
        }
    },
    es: {
        trailerRental: "Alquiler de remolques reinventado",
        rentAnywhere: "¡Alquila el remolque que quieras, donde quieras!",
        where: "Dónde",
        placeholder: "Ciudad, aeropuerto, hotel",
        from: "Desde",
        until: "Hasta",
        newWay: "¡La nueva forma de alquilar un remolque 24/7!",
        discover: "Descubre la plataforma líder para compartir remolques entre particulares en Quebec.",
        needTrailer: "Ya sea que necesites un remolque",
        shareOne: "o tengas uno para compartir",
        rentTrailerTitle: "Alquilar un remolque",
        rentTrailerDescription: "Encuentra el remolque perfecto para tus necesidades, dondequiera que estés en Quebec. ¡Busca, reserva y listo!",
        rentTrailerButton: "Alquilar un remolque",
        becomeHostTitle: "Conviértete en anfitrión",
        becomeHostDescription: "Publica tu remolque y comienza a ganar ayudando a otros a mudarse, viajar y explorar. Es fácil y seguro.",
        becomeHostButton: "Conviértete en anfitrión",
        trustedBy: "Confiado por más de 1000 +",
        leadingPlatform: "Nuestra empresa es la plataforma líder para compartir donde puedes reservar cualquier tipo de remolque a particulares,",
        dynamicCommunity: "cualquiera sea la ocasión, con una comunidad dinámica de anfitriones confiables.",
        thankYou: "¡Eres una de las más de 1000 personas que confían completamente en nosotros, gracias!",
        popularLocations: "Lugares populares",
        "carHauler": "Explorar Remolques",
        faq: "Preguntas frecuentes",
        seeAllFaq: "Ver todas las FAQ",
        searchButton: "Buscar",
        searching: "Buscando...",
        noResults: "No se encontraron resultados",
        guests: "Invitados",
        hosts: "Anfitriones",
        faqContent: {
            renters: [
                { question: "¿Qué necesito para alquilar un remolque en Lorepa?", answer: "Para alquilar un remolque, debes tener al menos 21 años, poseer una licencia de conducir válida y proporcionar prueba de seguro. También necesitarás una cuenta verificada de Lorepa." },
                { question: "¿Cómo funciona el proceso de alquiler?", answer: "Buscas los remolques disponibles, envías una solicitud al propietario y, una vez aprobada, confirmas tu reserva. Un contrato de alquiler y fotos de inspección se generan automáticamente." },
                { question: "¿El seguro está incluido en mi alquiler?", answer: "No. Se requiere que proporciones un seguro de automóvil válido que cubra el remolque. Protección opcional adicional puede ser ofrecida durante el pago." },
                { question: "¿Puedo cancelar mi reserva?", answer: "Sí, puedes cancelar según los términos descritos en nuestra política de cancelación. Los reembolsos pueden variar dependiendo de cuándo se realice la cancelación en relación con la fecha de inicio." },
                { question: "¿Qué sucede si devuelvo el remolque tarde?", answer: "Los retrasos en la devolución pueden incurrir en una tarifa de penalización fija, según lo establecido en los Términos de uso. Siempre notifica al propietario en caso de retraso para evitar disputas." }
            ],
            owners: [
                { question: "¿Cómo publico mi remolque?", answer: "Puedes publicar tu remolque registrándote, completando detalles clave (descripción, disponibilidad, precios), subiendo fotos y proporcionando los documentos requeridos (registro, seguro)." },
                { question: "¿Cuánto puedo ganar con Lorepa?", answer: "Conservas el 85% del precio del alquiler. El 15% restante cubre la tarifa de servicio de Lorepa. Los pagos se procesan automáticamente a través de Stripe dentro de 3 a 5 días hábiles después de que finaliza el alquiler." },
                { question: "¿Puedo cancelar una reserva?", answer: "Sí, pero los propietarios solo tienen permitidas 2 cancelaciones gratuitas cada 6 meses. Después de eso, se aplica una penalización de $100 CAD si la cancelación está dentro de la política. El abuso de cancelaciones está sujeto a revisión de la cuenta." },
                { question: "¿Qué pasa si mi remolque se devuelve tarde o dañado?", answer: "Puedes informar cualquier problema a través de la plataforma dentro de las 24 horas. Lorepa puede ayudar con la deducción de multas o costos de daños del depósito del inquilino." },
                { question: "¿Necesito un seguro especial como propietario?", answer: "Debes mantener un seguro de remolque válido. Lorepa no proporciona cobertura directa a los propietarios. Sin embargo, es posible que se introduzcan programas de protección opcionales en el futuro." }
            ]
        }
    },
    cn: {
        trailerRental: "拖车租赁新体验",
        rentAnywhere: "随时随地租您想要的拖车！",
        where: "地点",
        placeholder: "城市、机场、酒店",
        from: "从",
        until: "直到",
        newWay: "全天候租拖车的新方式！",
        discover: "探索魁北克领先的个人拖车共享平台。",
        needTrailer: "无论您是否需要拖车",
        shareOne: "或愿意共享一个",
        rentTrailerTitle: "租一辆拖车",
        rentTrailerDescription: "在魁北克找到满足您需求的完美拖车，无论您身在何处。浏览、预订，然后出发！",
        rentTrailerButton: "租一辆拖车",
        becomeHostTitle: "成为房东",
        becomeHostDescription: "列出您的拖车，通过帮助他人搬家、旅行和探索来开始赚钱。这既简单又安全。",
        becomeHostButton: "成为房东",
        trustedBy: "1000+ 信任用户",
        leadingPlatform: "我们公司是领先的共享平台，您可以从个人手中预订各种类型的拖车，",
        dynamicCommunity: "无论场合如何，拥有值得信赖的动态社区主机。",
        thankYou: "感谢您成为 1000+ 完全信任我们的人之一！",
        popularLocations: "热门地点",
        carHauler: "浏览拖车",
        faq: "常见问题",
        seeAllFaq: "查看所有 FAQ",
        searchButton: "搜索",
        searching: "搜索中...",
        noResults: "未找到结果",
        guests: "客人",
        hosts: "房东",
        faqContent: {
            renters: [
                { question: "在 Lorepa 租拖车需要什么？", answer: "要租拖车，您必须年满 21 岁，持有有效的驾驶执照，并提供保险证明。您还需要一个经过验证的 Lorepa 帐户。" },
                { question: "租赁流程如何运作？", answer: "您浏览可用的拖车，向车主发送请求，一旦获得批准，即可确认您的预订。租赁合同和检查照片会自动生成。" },
                { question: "我的租赁是否包含保险？", answer: "不。您需要提供有效的汽车保险，涵盖牵引。结账时可能会提供额外的可选保护。" },
                { question: "我可以取消我的预订吗？", answer: "是的，您可以根据我们的取消政策中描述的条款取消。退款可能因取消时间与开始日期的相对关系而异。" },
                { question: "如果我迟还拖车怎么办？", answer: "迟还可能会产生固定罚款，具体详情请参阅使用条款。请务必在延迟的情况下通知车主，以避免纠纷。" }
            ],
            owners: [
                { question: "如何列出我的拖车？", answer: "您可以通过注册、填写关键详细信息（描述、可用性、定价）、上传照片和提供所需文件（注册、保险）来列出您的拖车。" },
                { question: "使用 Lorepa 我能赚多少钱？", answer: "您保留租赁价格的 85%。其余 15% 用于支付 Lorepa 的服务费。付款在租赁结束后 3-5 个工作日内通过 Stripe 自动处理。" },
                { question: "我可以取消预订吗？", answer: "是的，但车主每 6 个月只允许免费取消 2 次。在此之后，如果取消符合政策规定，则将收取 100 加元的罚款。滥用取消将受到帐户审核。" },
                { question: "如果我的拖车被迟还或损坏了怎么办？", answer: "您可以在 24 小时内通过平台报告任何问题。Lorepa 可以协助从租客的押金中扣除罚款或损坏费用。" },
                { question: "作为车主，我需要特殊保险吗？", answer: "您必须保持有效的拖车保险。Lorepa 不直接向车主提供保险。但是，未来可能会引入可选的保护计划。" }
            ]
        }
    },
    fr: {
        trailerRental: "Location de remorque réinventée",
        rentAnywhere: "Louez la remorque que vous voulez, où vous voulez !",
        where: "Où",
        placeholder: "Ville, aéroport, hôtel",
        from: "De",
        until: "Jusqu'à",
        newWay: "La nouvelle façon de louer une remorque 24h/24 et 7j/7 !",
        discover: "Découvrez la plateforme leader de partage de remorques entre particuliers au Québec.",
        needTrailer: "Que vous ayez besoin d'une remorque",
        shareOne: "ou que vous en ayez une à mettre en location",
        rentTrailerTitle: "Louer une remorque",
        rentTrailerDescription: "Trouvez la remorque parfaite pour vos besoins, où que vous soyez au Québec. Parcourez, réservez et partez !",
        rentTrailerButton: "Louer une remorque",
        becomeHostTitle: "Devenir hôte",
        becomeHostDescription: "Listez votre remorque et commencez à gagner de l'argent en aidant les autres à déménager, voyager et explorer. C'est facile et sécurisé.",
        becomeHostButton: "Devenir hôte",
        trustedBy: "Fiable par plus de 1000 +",
        leadingPlatform: "Notre entreprise est la principale plateforme de partage où vous pouvez réserver tout type de remorque auprès de particuliers,",
        dynamicCommunity: "quelle que soit l'occasion, avec une communauté dynamique d'hôtes de confiance.",
        thankYou: "Vous êtes l'une des 1000+ personnes qui nous font entièrement confiance, merci !",
        popularLocations: "Lieux populaires",
        carHauler: "Parcourir les remorques",
        faq: "Questions fréquemment posées",
        seeAllFaq: "Voir toutes les FAQ",
        searchButton: "Rechercher",
        searching: "Recherche en cours...",
        noResults: "Aucun résultat trouvé",
        guests: "Invités",
        hosts: "Hôtes",
        faqContent: {
            renters: [
                { question: "De quoi ai-je besoin pour louer une remorque sur Lorepa ?", answer: "Pour louer une remorque, vous devez avoir au moins 21 ans, détenir un permis de conduire valide et fournir une preuve d'assurance. Vous aurez également besoin d'un compte Lorepa vérifié." },
                { question: "Comment fonctionne le processus de location ?", answer: "Vous parcourez les remorques disponibles, envoyez une demande au propriétaire et, une fois approuvée, confirmez votre réservation. Un contrat de location et des photos d'inspection sont générés automatiquement." },
                { question: "L'assurance est-elle incluse dans ma location ?", answer: "Non. Vous êtes tenu de fournir une assurance automobile valide qui couvre le remorquage. Une protection optionnelle supplémentaire peut être offerte lors du paiement." },
                { question: "Puis-je annuler ma réservation ?", answer: "Oui, vous pouvez annuler selon les termes décrits dans notre politique d'annulation. Les remboursements peuvent varier en fonction du moment de l'annulation par rapport à la date de début." },
                { question: "Que se passe-t-il si je retourne la remorque en retard ?", answer: "Les retours tardifs peuvent entraîner des frais de pénalité fixes, comme indiqué dans les Conditions d'utilisation. Avertissez toujours le propriétaire en cas de retard pour éviter les litiges." }
            ],
            owners: [
                { question: "Comment lister ma remorque ?", answer: "Vous pouvez lister votre remorque en vous inscrivant, en remplissant les détails clés (description, disponibilité, prix), en téléchargeant des photos et en fournissant les documents requis (immatriculation, assurance)." },
                { question: "Combien puis-je gagner avec Lorepa ?", answer: "Vous conservez 85% du prix de la location. Les 15% restants couvrent les frais de service de Lorepa. Les paiements sont traités automatiquement via Stripe dans les 3 à 5 jours ouvrables après la fin de la location." },
                { question: "Puis-je annuler une réservation ?", answer: "Oui, mais les propriétaires ne sont autorisés qu'à 2 annulations gratuites tous les 6 mois. Après cela, une pénalité de 100 $ CA s'applique si l'annulation est conforme à la politique. L'abus d'annulations est soumis à un examen du compte." },
                { question: "Que se passe-t-il si ma remorque est retournée en retard ou endommagée ?", answer: "Vous pouvez signaler tout problème via la plateforme dans les 24 heures. Lorepa peut vous aider à déduire les pénalités ou les coûts de dommages du dépôt du locataire." },
                { question: "Ai-je besoin d'une assurance spéciale en tant que propriétaire ?", answer: "Vous devez maintenir une assurance remorque valide. Lorepa ne fournit pas de couverture directe aux propriétaires. Cependant, des programmes de protection optionnels pourraient être introduits à l'avenir." }
            ]
        }
    }
};

const AnimatedText = ({ text, variant, className = "" }) => (
    <motion.h1
        variants={variant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className={`text-center ${className}`}
    >
        {text}
    </motion.h1>
);

const trustedAvatarImages = ["/6.png", "/7.png", "/8.png", "/9.png", "/10.png", "/11.png"];
const popularLocationImages = ["/1.png", "/2.png", "/3.png", "/4.png", "/5.png"];
const browseTrailerImages = ["/12.png", "/13.png", "/14.png", "/15.png"];
const MIN_LOCATION_QUERY_LENGTH = 1;

const LandingPage = () => {
    const [trustedByItems, setTrustedByItems] = useState([]);
    const [locations, setLocations] = useState([]);
    const [trailers, setTrailers] = useState([]);
    const [fallbackFaqContent, setFallbackFaqContent] = useState({ renters: [], owners: [], global: [] });
    const [adminFaqContent, setAdminFaqContent] = useState({ renters: [], owners: [] });
    const [currentLang, setCurrentLang] = useState(() => {
        const lang = getStoredLanguage();
        return translations[lang] ? lang : 'fr';
    });
    const [translationsData, setTranslationsData] = useState(() => {
        const storedLang = getStoredLanguage();
        return translations[storedLang] || translations.fr;
    });
    const wrapperRef = useRef(null);
    const debounceRef = useRef(null);
    const latestSuggestionQueryRef = useRef("");
    const [location, setLocation] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [fromTime, setFromTime] = useState("08:00");
    const [untilDate, setUntilDate] = useState('');
    const [untilTime, setUntilTime] = useState("22:00");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const isLogin = localStorage.getItem("userId")
    const nav = useNavigate()

    const trustedImageUrls = useMemo(() => {
        const apiImages = (trustedByItems || [])
            .map((item) => {
                if (!item) return "";
                if (typeof item.image === "string") return item.image.trim();
                if (item.image && typeof item.image === "object") {
                    return (item.image.url || item.image.secure_url || item.image.src || "").trim();
                }
                return "";
            })
            .filter(Boolean);

        return apiImages.length > 0 ? apiImages : trustedAvatarImages;
    }, [trustedByItems]);
    useEffect(() => {
        const handleStorageChange = () => {
            const storedLang = getStoredLanguage();
            setCurrentLang(translations[storedLang] ? storedLang : 'fr');
            const data = translations[storedLang] || translations.fr;
            setTranslationsData(data);
            setFallbackFaqContent(data.faqContent);
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('app-language-changed', handleStorageChange);
        // Also run on mount to ensure the latest language is picked up if it changes externally
        handleStorageChange();

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('app-language-changed', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const [trustedRes, locationRes, trailerRes, faqRes] = await Promise.allSettled([
                    axios.get(`${config.baseUrl}/content/trusted`),
                    axios.get(`${config.baseUrl}/content/locations`),
                    axios.get(`${config.baseUrl}/content/trailers`),
                    axios.get(`${config.baseUrl}/content/faq`),
                ]);

                if (trustedRes.status === "fulfilled") setTrustedByItems(trustedRes.value.data.data || []);
                if (locationRes.status === "fulfilled") setLocations(locationRes.value.data.data);
                if (trailerRes.status === "fulfilled") setTrailers(trailerRes.value.data.data);
                if (faqRes.status === "fulfilled") {
                    const allFaqs = faqRes.value.data.data || [];
                    const guestFaqs = allFaqs.filter((faq) => faq.type === 'guest');
                    const hostFaqs = allFaqs.filter((faq) => faq.type === 'host');
                    setAdminFaqContent({
                        renters: guestFaqs,
                        owners: hostFaqs,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch landing content:", error);
            }
        };

        fetchContent();
    }, []);

    const useAdminFaqContent = currentLang === "en";
    const mergedFaqContent = {
        renters:
            useAdminFaqContent && adminFaqContent.renters.length > 0
                ? adminFaqContent.renters
                : (fallbackFaqContent.renters || []),
        owners:
            useAdminFaqContent && adminFaqContent.owners.length > 0
                ? adminFaqContent.owners
                : (fallbackFaqContent.owners || []),
    };
    const fetchSuggestions = async (inputText) => {
        const normalizedInput = (inputText || "").trim();
        const normalizedQuery = normalizedInput.toLowerCase();

        if (!normalizedInput || normalizedInput.length < MIN_LOCATION_QUERY_LENGTH) {
            setSuggestions([]);
            setShowSuggestions(false);
            setIsLoadingSuggestions(false);
            return;
        }

        latestSuggestionQueryRef.current = normalizedQuery;
        setIsLoadingSuggestions(true);
        try {
            // Get base URL without /api/v1 suffix
            const baseUrlWithoutApiV1 = config.baseUrl.replace(/\/api\/v1\/?$/, '');
            const res = await axios.get(`${baseUrlWithoutApiV1}/api/autocomplete`, {
                params: {
                    input: normalizedInput,
                    onlyWithTrailers: true,
                    limit: 25,
                },
            });

            // Ignore stale async responses
            if (latestSuggestionQueryRef.current !== normalizedQuery) {
                return;
            }

            if (res.data.status === "OK" && res.data.predictions.length > 0) {
                setSuggestions(res.data.predictions);
                setShowSuggestions(true);
            } else {
                setSuggestions([]);
                setShowSuggestions(normalizedInput.length >= MIN_LOCATION_QUERY_LENGTH); // show "no results" feedback
            }
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            setSuggestions([]);
            setShowSuggestions(false);
        } finally {
            setIsLoadingSuggestions(false);
        }
    };

    const handleLocationChange = (e) => {
        const value = e.target.value || "";
        setLocation(value);

        const normalizedQuery = value.trim().toLowerCase();
        latestSuggestionQueryRef.current = normalizedQuery;

        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!value || value.trim().length < MIN_LOCATION_QUERY_LENGTH) {
            setSuggestions([]);
            setShowSuggestions(false);
            setIsLoadingSuggestions(false);
            return;
        }
        setIsLoadingSuggestions(true);
        debounceRef.current = setTimeout(() => fetchSuggestions(value), 300);
    };


    const handleSelect = async (item) => {
        setLocation(item.description);
        latestSuggestionQueryRef.current = (item.description || "").trim().toLowerCase();
        setSuggestions([]);
        setShowSuggestions(false);
    };

    // Cleanup debounce timer on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    // Hide suggestions on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const buildSearchUrl = () => {
        const params = new URLSearchParams();
        if (location) params.append('city', location);
        if (fromDate) params.append('fromDate', fromDate);
        if (fromTime) params.append('fromTime', fromTime);
        if (untilDate) params.append('untilDate', untilDate);
        if (untilTime) params.append('untilTime', untilTime);
        return `/trailers?${params.toString()}`;
    };

    return (
        <div className="w-screen min-h-screen bg-[#fff] flex flex-col overflow-x-hidden">
            <motion.div variants={fadeInDown} initial="hidden" animate="visible">
                {/* Assuming Navbar also needs to know the current language */}
                <Navbar currentLanguage={translationsData} />
            </motion.div>

            <div style={{ backgroundImage: `url(${Web})` }} className="relative min-h-[110vh] w-screen bg-cover hidden md:block">
                <motion.div variants={zoomBounce} initial="hidden" animate="visible" className="w-full flex justify-center items-center flex-col">
                    <AnimatedText text={translationsData?.trailerRental} variant={fadeInUp} className="text-white text-xl md:text-6xl mt-[3rem]" />
                    <AnimatedText text={translationsData?.rentAnywhere} variant={fadeIn} className="text-white text-sm mt-2 font-medium" />
                    <motion.div variants={blurIn} initial="hidden" animate="visible" className="bg-white md:bg-opacity-100 bg-opacity-80 rounded-md p-3 sm:w-[80%] w-[90%] mx-20 my-10 md:flex justify-center items-center flex-wrap">
                        <div className="flex-1 border border-[#9DA0A6] mt-1 mr-3 py-1 px-6 rounded-[2rem] relative" ref={wrapperRef}>
                            <h1 className="text-sm">{translationsData?.where}</h1>
                            <input
                                value={location}
                                onChange={handleLocationChange}
                                type="text"
                                autoComplete="off"
                                placeholder={translationsData?.placeholder}
                                className="border-none bg-transparent outline-none placeholder:text-[#9DA0A6] flex-1 text-sm w-full"
                            />
                            {showSuggestions && (
                                <ul className="absolute z-50 top-[4rem] left-0 right-0 bg-white shadow-lg border border-gray-100 rounded-md mt-1 max-h-60 overflow-y-auto">
                                    {isLoadingSuggestions ? (
                                        <li className="p-3 text-sm text-gray-400 text-center">{translationsData?.searching}</li>
                                    ) : suggestions.length > 0 ? (
                                        suggestions.map((item, index) => (
                                            <li key={item.place_id || index} onMouseDown={() => handleSelect(item)} className="p-2 hover:bg-blue-50 cursor-pointer text-sm flex items-start gap-2">
                                                <span className="text-gray-400 mt-0.5">&#x2315;</span>
                                                <span>
                                                    <span className="font-medium text-gray-800">{item.structured_formatting?.main_text || item.description.split(',')[0]}</span>
                                                    {item.structured_formatting?.secondary_text && (
                                                        <span className="text-gray-400">, {item.structured_formatting.secondary_text}</span>
                                                    )}
                                                </span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="p-3 text-sm text-gray-400 text-center">{translationsData?.noResults}</li>
                                    )}
                                </ul>
                            )}
                        </div>

                        {/* From Date & Time */}
                        <div className="flex-1 border border-[#9DA0A6] mt-1 mr-3 py-1 px-6 rounded-[2rem]">
                            <h1 className="text-sm">{translationsData?.from}</h1>
                            <div className="flex justify-between items-center gap-x-3">
                                <input type="date" className="border-none bg-transparent outline-none placeholder:text-[#9DA0A6] text-sm" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                                <input type="time" className="border-none bg-transparent outline-none placeholder:text-[#9DA0A6] text-sm" value={fromTime} onChange={e => setFromTime(e.target.value)} />
                            </div>
                        </div>

                        {/* Until Date & Time */}
                        <div className="flex-1 border border-[#9DA0A6] mt-1 mr-3 py-1 px-6 rounded-[2rem]">
                            <h1 className="text-sm">{translationsData?.until}</h1>
                            <div className="flex justify-between items-center gap-x-3">
                                <input type="date" className="border-none bg-transparent outline-none placeholder:text-[#9DA0A6] text-sm" value={untilDate} onChange={e => setUntilDate(e.target.value)} />
                                <input type="time" className="border-none bg-transparent outline-none placeholder:text-[#9DA0A6] text-sm" value={untilTime} onChange={e => setUntilTime(e.target.value)} />
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className="md:w-[3rem] md:flex-none flex-1 md:mt-0 mt-2">
                            <Link to={buildSearchUrl()} className="w-[3rem] h-[3rem] bg-[#2563EB] rounded-full flex justify-center items-center text-white">
                                <FaSearch />
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            <div style={{ backgroundImage: `url(${Mobile})` }} className="relative w-screen bg-cover bg-no-repeat md:hidden block">
                <motion.div variants={zoomBounce} initial="hidden" animate="visible" className="w-full flex justify-center items-center flex-col">
                    <AnimatedText text={translationsData?.trailerRental} variant={fadeInUp} className="text-white text-xl md:text-6xl mt-[3rem]" />
                    <AnimatedText text={translationsData?.rentAnywhere} variant={fadeIn} className="text-white text-sm mt-2 font-medium" />
                    <motion.div variants={blurIn} initial="hidden" animate="visible" className="bg-white border border-[#e4e4e4] md:bg-opacity-100 bg-opacity-80 rounded-md p-3 sm:w-[80%] w-[90%] mx-20 my-10 md:flex justify-center items-center flex-wrap">
                        <div className="flex-1 border border-[#9DA0A6] mt-1 mr-3 py-1 px-6 rounded-[2rem] relative" ref={wrapperRef}>
                            <h1 className="text-sm">{translationsData?.where}</h1>
                            <input
                                value={location}
                                onChange={handleLocationChange}
                                type="text"
                                autoComplete="off"
                                placeholder={translationsData?.placeholder}
                                className="border-none bg-transparent outline-none placeholder:text-[#9DA0A6] flex-1 text-sm w-full"
                            />
                            {showSuggestions && (
                                <ul className="absolute z-50 top-[4rem] left-0 right-0 bg-white shadow-lg border border-gray-100 rounded-md mt-1 max-h-60 overflow-y-auto">
                                    {isLoadingSuggestions ? (
                                        <li className="p-3 text-sm text-gray-400 text-center">{translationsData?.searching}</li>
                                    ) : suggestions.length > 0 ? (
                                        suggestions.map((item, index) => (
                                            <li key={item.place_id || index} onClick={() => handleSelect(item)} className="p-2 hover:bg-blue-50 cursor-pointer text-sm flex items-start gap-2">
                                                <span className="text-gray-400 mt-0.5">&#x2315;</span>
                                                <span>
                                                    <span className="font-medium text-gray-800">{item.structured_formatting?.main_text || item.description.split(',')[0]}</span>
                                                    {item.structured_formatting?.secondary_text && (
                                                        <span className="text-gray-400">, {item.structured_formatting.secondary_text}</span>
                                                    )}
                                                </span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="p-3 text-sm text-gray-400 text-center">{translationsData?.noResults}</li>
                                    )}
                                </ul>
                            )}
                        </div>

                        {/* From Date & Time */}
                        <div className="flex-1 border border-[#9DA0A6] mt-1 mr-3 py-1 px-6 rounded-[2rem]">
                            <h1 className="text-sm">{translationsData?.from}</h1>
                            <div className="flex justify-between items-center gap-x-3">
                                <input type="date" className="border-none bg-transparent outline-none placeholder:text-[#9DA0A6] text-sm" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                                <input type="time" className="border-none bg-transparent outline-none placeholder:text-[#9DA0A6] text-sm" value={fromTime} onChange={e => setFromTime(e.target.value)} />
                            </div>
                        </div>

                        {/* Until Date & Time */}
                        <div className="flex-1 border border-[#9DA0A6] mt-1 mr-3 py-1 px-6 rounded-[2rem]">
                            <h1 className="text-sm">{translationsData?.until}</h1>
                            <div className="flex justify-between items-center gap-x-3">
                                <input type="date" className="border-none bg-transparent outline-none placeholder:text-[#9DA0A6] text-sm" value={untilDate} onChange={e => setUntilDate(e.target.value)} />
                                <input type="time" className="border-none bg-transparent outline-none placeholder:text-[#9DA0A6] text-sm" value={untilTime} onChange={e => setUntilTime(e.target.value)} />
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className="w-full mt-2">
                            <button onClick={() => nav(buildSearchUrl())} className="w-full h-[3rem] bg-[#2563EB] rounded-md text-white">{translationsData?.searchButton}</button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="flex justify-center items-center flex-col my-12 sm:my-20 mobile-px">
                <AnimatedText text={translationsData.newWay} variant={flipIn} className="text-3xl sm:text-4xl lg:text-[48px] font-semibold text-black text-center leading-[1.2] tracking-tight" />
                <AnimatedText
                    text={translationsData.discover}
                    variant={fadeInUp}
                    className="text-sm sm:text-base text-gray-600 mt-4 text-center max-w-2xl leading-relaxed"
                />
                <motion.img variants={scaleIn} src={Img} alt="" className="mt-10 max-w-full h-auto rounded-2xl shadow-sm" />
            </motion.div>

            <div className="bg-[#2563EB] mobile-px py-8 sm:py-10">
                <AnimatedText
                    text={translationsData.needTrailer}
                    variant={fadeInDown}
                    className="text-xl sm:text-2xl lg:text-[40px] text-white font-semibold mt-6 sm:mt-10 text-center"
                />
                <AnimatedText
                    text={translationsData.shareOne}
                    variant={fadeInDown}
                    className="text-xl sm:text-2xl lg:text-[40px] text-white font-semibold mb-6 sm:mb-10 text-center"
                />
                <div className="flex justify-center items-stretch flex-wrap gap-6 sm:gap-8 pb-12 sm:pb-20">
                    {/* Rent a Trailer Card */}
                    <motion.div variants={flipIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md lg:max-w-xl overflow-hidden flex flex-col">
                        <div className="p-8 sm:p-12 flex-1">
                            <h2 className="text-3xl sm:text-[52px] font-light leading-[1.1] mb-4 sm:mb-8 text-gray-900 tracking-tight">
                                {translationsData.rentTrailerTitle}
                            </h2>
                            <p className="text-gray-600 mb-8 sm:text-lg text-base leading-relaxed">
                                {translationsData.rentTrailerDescription}
                            </p>
                            <Link to="/trailers">
                                <button className="border-2 border-black text-black px-8 py-3 rounded-xl font-medium hover:bg-black hover:text-white transition-all duration-300">
                                    {translationsData.rentTrailerButton}
                                </button>
                            </Link>
                        </div>
                        <img src={Host1} alt="Rent a Trailer" className="w-full h-[24rem] object-cover hover:scale-105 transition-transform duration-500" />
                    </motion.div>

                    {/* Become a Host Card */}
                    <motion.div variants={flipIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md lg:max-w-xl overflow-hidden flex flex-col">
                        <div className="p-8 sm:p-12 flex-1">
                            <h2 className="text-3xl sm:text-[52px] font-light leading-[1.1] mb-4 sm:mb-8 text-gray-900 tracking-tight">
                                {translationsData.becomeHostTitle}
                            </h2>
                            <p className="text-gray-600 mb-8 sm:text-lg text-base leading-relaxed">
                                {translationsData.becomeHostDescription}
                            </p>
                            {!isLogin && (
                                <button
                                    onClick={() => nav('/login')}
                                    className="border-2 border-black text-black px-8 py-3 rounded-xl font-medium hover:bg-black hover:text-white transition-all duration-300"
                                >
                                    {translationsData.becomeHostButton}
                                </button>
                            )}
                        </div>
                        <img src={Host2} alt="Become a Host" className="w-full h-[24rem] object-cover hover:scale-105 transition-transform duration-500" />
                    </motion.div>
                </div>
            </div>

            <motion.div variants={flipIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="flex justify-center items-center flex-col bg-[#E9EFFD] py-20 px-4 sm:px-6">
                <AnimatedText text={translationsData.trustedBy} variant={fadeInDown} className="text-[44px] sm:text-[64px] text-gray-900 font-bold leading-tight tracking-tighter" />
                <AnimatedText text={`${translationsData.leadingPlatform} ${translationsData.dynamicCommunity}`} variant={fadeInUp} className="text-sm sm:text-lg text-gray-600 mt-4 text-center max-w-4xl leading-relaxed" />

                <div className="flex items-center justify-center mt-8">
                    {trustedImageUrls.map((img, i) => (
                        <img
                            key={`${img}-${i}`}
                            src={img}
                            alt={`Trusted host ${i + 1}`}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-4 border-white shadow-md -ml-3 first:ml-0 hover:z-10 transition-transform hover:scale-110"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = trustedAvatarImages[i % trustedAvatarImages.length];
                            }}
                        />
                    ))}
                </div>

                <AnimatedText text={translationsData.thankYou} variant={blurIn} className="text-xl font-semibold text-blue-600 mt-10 text-center" />
            </motion.div>

            <motion.div variants={flipIn} whileInView="visible" className="flex justify-center items-center flex-col p-3">
                <AnimatedText text={translationsData.popularLocations} variant={scaleIn} className="text-2xl text-black font-semibold mt-10" />
                <div className="flex overflow-x-auto gap-10 mt-6 w-[100%] px-4">
                    {locations.map((loc, i) => {
                        const locationImage = loc.image || popularLocationImages[i % popularLocationImages.length];

                        return (
                            <Link to={`/trailers?city=${loc.title}`} key={i}>
                                <img
                                    src={locationImage}
                                    alt={loc.title}
                                    className="max-w-[15rem] min-w-[15rem] min-h-[10rem] max-h-[10rem] rounded-md object-cover bg-gray-100"
                                    onError={(e) => { 
                                        e.target.onerror = null; 
                                        e.target.src = "/1.png";
                                    }}
                                />
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-medium mt-2 text-black">{loc.title}</p>
                                    <FaLongArrowAltRight className="text-blue-700" />
                                </div>
                            </Link>
                        );
                    })}
                </div>

            </motion.div>

            <motion.div
                variants={zoomBounce}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="flex justify-center items-center flex-col bg-[#0A0F18] p-3 text-white"
            >
                <div className="flex justify-between items-center mt-10 w-full flex-wrap">
                    <AnimatedText
                        text={translationsData.carHauler}
                        variant={fadeInUp}
                        className="text-2xl font-semibold mt-2"
                    />
                    <div className="flex justify-between items-center gap-x-3 mt-2">
                        {[FaAngleLeft, FaAngleRight].map((Icon, i) => (
                            <div
                                key={i}
                                className="bg-white w-[2rem] h-[2rem] rounded-full text-black flex justify-center items-center"
                            >
                                <Icon />
                            </div>
                        ))}
                    </div>
                </div>
                <Link to={"/trailers"} className="flex overflow-x-auto gap-5 mt-6 w-[100%] px-4">
                    {trailers.map((item, i) => {
                        const trailerImage = item.image || browseTrailerImages[i % browseTrailerImages.length];

                        return (
                            <div key={i} className="relative cursor-pointer">
                                <img 
                                    src={trailerImage} 
                                    alt={item.title} 
                                    className="rounded-md max-w-[22rem] min-w-[22rem] min-h-[16rem] max-h-[16rem] object-cover bg-gray-100" 
                                    onError={(e) => { 
                                        e.target.onerror = null; 
                                        e.target.src = "/12.png";
                                    }} 
                                />
                                <p className="absolute bottom-5 left-5 text-white font-semibold drop-shadow-md">{item.title}</p>
                            </div>
                        );
                    })}
                </Link>
            </motion.div>

            <div className="mobile-px py-16 sm:py-24 text-gray-900">
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="flex justify-between items-end mb-12 w-full flex-wrap gap-4"
                >
                    <div className="flex-1 min-w-[300px]">
                        <AnimatedText
                            text={translationsData.faq}
                            variant={fadeInUp}
                            className="text-3xl sm:text-5xl font-bold text-left tracking-tight"
                        />
                        <p className="text-gray-500 mt-2 text-lg font-medium">Everything you need to know about Lorepa.</p>
                    </div>
                    <button className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold shadow-xl shadow-blue-100 mb-2">
                        <Link to={"/faq"}>{translationsData.seeAllFaq}</Link>
                    </button>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                    {/* Renters (Guests) FAQ Section */}
                    <motion.div
                        variants={flipIn}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        className="bg-white p-8 sm:p-10 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50"
                    >
                        <AnimatedText
                            text={translationsData.guests}
                            variant={fadeInUp}
                            className="text-2xl font-bold mb-8 text-left text-blue-600 tracking-tight"
                        />
                        <div className="space-y-4">
                            {mergedFaqContent.renters.map((faq, index) => (
                                <AccordionItem
                                    key={`renter-faq-${index}`}
                                    question={faq.question}
                                    answer={faq.answer}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* Owners (Hosts) FAQ Section */}
                    <motion.div
                        variants={flipIn}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        className="bg-white p-8 sm:p-10 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50"
                    >
                        <AnimatedText
                            text={translationsData.hosts}
                            variant={fadeInUp}
                            className="text-2xl font-bold mb-8 text-left text-blue-600 tracking-tight"
                        />
                        <div className="space-y-4">
                            {mergedFaqContent.owners.map((faq, index) => (
                                <AccordionItem
                                    key={`owner-faq-${index}`}
                                    question={faq.question}
                                    answer={faq.answer}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
            >
                <Footer />
            </motion.div>
        </div>
    );
};

export default LandingPage;
