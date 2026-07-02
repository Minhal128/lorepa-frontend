import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import SEO from "../components/SEO";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Host1 from "../assets/landing/rent_trailer_img.png";
import Host2 from "../assets/landing/become_host_img.png";

import {
    FaAngleDown,
    FaAngleUp,
    FaAngleLeft,
    FaAngleRight,
    FaSearch,
    FaShieldAlt,
    FaTools,
    FaStar,
    FaMapMarkerAlt,
} from "react-icons/fa";
import { GiSteeringWheel } from "react-icons/gi";
import axios from "axios";
import config from "../config";
import { Link, useNavigate } from "react-router-dom";
import { blurIn, fadeIn, fadeInDown, fadeInUp, flipIn, scaleIn, zoomBounce } from "../../animation";
import AccordionItem from "./AccordionItem";
import BounceCards from "./BounceCards";
import RollingGallery from "./RollingGallery";

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
        referralFreeLine: "First referral free for trailer owners!",
        rentTrailerTitle: "Rent a Trailer",
        rentTrailerDescription: "Find the perfect trailer for your needs, wherever you are in Quebec. Browse, book, and go!",
        rentTrailerButton: "Rent a trailer",
        becomeHostTitle: "Become a host",
        becomeHostDescription: "List your trailer and start earning by helping others move, travel, and explore. It's easy and secure",
        becomeHostButton: "Become a host",
        trustedBy: "Trusted by 100 +",
        leadingPlatform: "Our company is the leading sharing platform where you can book any type of trailer from private individuals,",
        dynamicCommunity: "whatever the occasion, with a dynamic community of trusted hosts.",
        thankYou: "You are one of 100 + people who trust us completely, Thank you!",
        popularLocations: "Popular Locations",
        carHauler: "Browse Trailers",
        faq: "Frequently asked questions",
        faqDesc: "Everything you need to know about Lorepa.",
        heroLabel: "Trailer Rental, Reinvented",
        heroHeadingLine1: "Find the Trailer You Want,",
        heroHeadingHighlight: "Wherever",
        heroHeadingLine2: "You Want!",
        heroFeature1: "Transport Made Easy",
        heroFeature1Desc: "The Trailer You Can Trust.",
        heroFeature2: "Built for the Job",
        heroFeature2Desc: "Ready for Every Trip.",
        heroFeature3: "Ready When You Are",
        heroFeature3Desc: "The Safe Choice for Transport.",
        heroPeopleLabel: "People",
        heroPeopleDesc: "The point of using Lorepa is that it has a more-or-less normal distribution of letters, with Lorem Ipsum.",
        heroTrustedByPrefix: "Trusted by",
        heroHappyCustomers: "happy customers",
        heroReviewsLabel: "Reviews",
        seeAllFaq: "See all FAQ",
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
        referralFreeLine: "¡Propietario, tu primera referencia de alquiler de remolque es gratis!",
        rentTrailerTitle: "Alquilar un remolque",
        rentTrailerDescription: "Encuentra el remolque perfecto para tus necesidades, dondequiera que estés en Quebec. ¡Busca, reserva y listo!",
        rentTrailerButton: "Alquilar un remolque",
        becomeHostTitle: "Conviértete en anfitrión",
        becomeHostDescription: "Publica tu remolque y comienza a ganar ayudando a otros a mudarse, viajar y explorar. Es fácil y seguro.",
        becomeHostButton: "Conviértete en anfitrión",
        trustedBy: "Confiado por más de 100 +",
        leadingPlatform: "Nuestra empresa es la plataforma líder para compartir donde puedes reservar cualquier tipo de remolque a particulares,",
        dynamicCommunity: "cualquiera sea la ocasión, con una comunidad dinámica de anfitriones confiables.",
        thankYou: "¡Eres una de las más de 100 personas que confían completamente en nosotros, gracias!",
        popularLocations: "Lugares populares",
        "carHauler": "Explorar Remolques",
        faq: "Preguntas frecuentes",
        faqDesc: "Todo lo que necesitas saber sobre Lorepa.",
        heroLabel: "Alquiler de Remolques, Reinventado",
        heroHeadingLine1: "Encuentra el Remolque que Quieres,",
        heroHeadingHighlight: "Donde",
        heroHeadingLine2: "Sea que lo Necesites!",
        heroFeature1: "Transporte Fácil",
        heroFeature1Desc: "El remolque en el que puedes confiar.",
        heroFeature2: "Hecho para el Trabajo",
        heroFeature2Desc: "Listo para cada viaje.",
        heroFeature3: "Listo Cuando Tú Lo Estés",
        heroFeature3Desc: "La opción segura para transportar.",
        heroPeopleLabel: "Personas",
        heroPeopleDesc: "El objetivo de usar Lorepa es que tiene una distribución de letras más o menos normal, con Lorem Ipsum.",
        heroTrustedByPrefix: "Confiado por",
        heroHappyCustomers: "clientes satisfechos",
        heroReviewsLabel: "Reseñas",
        seeAllFaq: "Ver todas las FAQ",
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
        referralFreeLine: "车主：您的首次拖车租赁推荐是免费的！",
        rentTrailerTitle: "租一辆拖车",
        rentTrailerDescription: "在魁北克找到满足您需求的完美拖车，无论您身在何处。浏览、预订，然后出发！",
        rentTrailerButton: "租一辆拖车",
        becomeHostTitle: "成为房东",
        becomeHostDescription: "列出您的拖车，通过帮助他人搬家、旅行和探索来开始赚钱。这既简单又安全。",
        becomeHostButton: "成为房东",
        trustedBy: "100+ 信任用户",
        leadingPlatform: "我们公司是领先的共享平台，您可以从个人手中预订各种类型的拖车，",
        dynamicCommunity: "无论场合如何，拥有值得信赖的动态社区主机。",
        thankYou: "感谢您成为 100+ 完全信任我们的人之一！",
        popularLocations: "热门地点",
        carHauler: "浏览拖车",
        faq: "常见问题",
        faqDesc: "Lorepa 的相关常见问题与解答。",
        heroLabel: "拖车租赁，全新体验",
        heroHeadingLine1: "找到您想要的拖车，",
        heroHeadingHighlight: "随时随地",
        heroHeadingLine2: "满足您的需求！",
        heroFeature1: "轻松运输",
        heroFeature1Desc: "值得信赖的拖车。",
        heroFeature2: "为工作而生",
        heroFeature2Desc: "随时胜任每一程。",
        heroFeature3: "随时待命",
        heroFeature3Desc: "运输的安心之选。",
        heroPeopleLabel: "用户",
        heroPeopleDesc: "使用 Lorepa 的意义在于它具有大致正常的字母分布，采用 Lorem Ipsum。",
        heroTrustedByPrefix: "深受",
        heroHappyCustomers: "满意客户的信赖",
        heroReviewsLabel: "条评价",
        seeAllFaq: "查看所有 FAQ",
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
        referralFreeLine: "Propriétaire votre première référence de location de remorque est gratuite !",
        rentTrailerTitle: "Louer une remorque",
        rentTrailerDescription: "Trouvez la remorque parfaite pour vos besoins, où que vous soyez au Québec. Parcourez, réservez et partez !",
        rentTrailerButton: "Louer une remorque",
        becomeHostTitle: "Devenir hôte",
        becomeHostDescription: "Listez votre remorque et commencez à gagner de l'argent en aidant les autres à déménager, voyager et explorer. C'est facile et sécurisé.",
        becomeHostButton: "Devenir hôte",
        trustedBy: "Fiable par plus de 100 +",
        leadingPlatform: "Notre entreprise est la principale plateforme de partage où vous pouvez réserver tout type de remorque auprès de particuliers,",
        dynamicCommunity: "quelle que soit l'occasion, avec une communauté dynamique d'hôtes de confiance.",
        thankYou: "Vous êtes l'une des 100+ personnes qui nous font entièrement confiance, merci !",
        popularLocations: "Lieux populaires",
        carHauler: "Parcourir les remorques",
        faq: "Questions fréquemment posées",
        faqDesc: "Tout ce que vous devez savoir sur Lorepa.",
        heroLabel: "Location de Remorques, Réinventée",
        heroHeadingLine1: "Trouvez la Remorque que Vous Voulez,",
        heroHeadingHighlight: "Où",
        heroHeadingLine2: "que Vous Voulez !",
        heroFeature1: "Le transport en toute simplicité",
        heroFeature1Desc: "La remorque, en toute confiance.",
        heroFeature2: "Conçue pour le travail",
        heroFeature2Desc: "Prête pour chaque trajet.",
        heroFeature3: "Prête quand vous l'êtes",
        heroFeature3Desc: "Le choix sûr pour transporter.",
        heroPeopleLabel: "Personnes",
        heroPeopleDesc: "L'intérêt d'utiliser Lorepa est qu'il présente une distribution de lettres plus ou moins normale, avec du Lorem Ipsum.",
        heroTrustedByPrefix: "Approuvé par",
        heroHappyCustomers: "clients satisfaits",
        heroReviewsLabel: "avis",
        seeAllFaq: "Voir toutes les FAQ",
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

const LandingPage = () => {
    const [trustedByItems, setTrustedByItems] = useState([]);
    const [locations, setLocations] = useState([]);
    const [trailers, setTrailers] = useState([]);
    const [fallbackFaqContent, setFallbackFaqContent] = useState({ renters: [], owners: [], global: [] });
    const [adminFaqContent, setAdminFaqContent] = useState({ renters: [], owners: [] });
    const [translationsData, setTranslationsData] = useState(() => {
        const storedLang = localStorage.getItem('lang');
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
            const storedLang = localStorage.getItem('lang');
            const data = translations[storedLang] || translations.fr;
            setTranslationsData(data);
            setFallbackFaqContent(data.faqContent);
        };

        window.addEventListener('storage', handleStorageChange);
        // Also run on mount to ensure the latest language is picked up if it changes externally
        handleStorageChange();

        return () => {
            window.removeEventListener('storage', handleStorageChange);
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

    const mergedFaqContent = {
        renters: adminFaqContent.renters.length > 0 ? adminFaqContent.renters : (fallbackFaqContent.renters || []),
        owners: adminFaqContent.owners.length > 0 ? adminFaqContent.owners : (fallbackFaqContent.owners || []),
    };
    const fetchSuggestions = async (inputText) => {
        const normalizedInput = (inputText || "").trim();
        const normalizedQuery = normalizedInput.toLowerCase();

        if (!normalizedInput || normalizedInput.length < 2) {
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
                params: { input: normalizedInput },
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
                setShowSuggestions(normalizedInput.length >= 2); // show "no results" feedback
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
        if (!value || value.trim().length < 2) {
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
            <SEO
                title="LOREPA – Location de remorques entre particuliers au Québec"
                description="Trouvez et réservez une remorque entre particuliers au Québec. Centaines d'annonces, réservation simple et sécurisée. Louez ou mettez votre remorque en location dès aujourd'hui."
                canonical="/"
                structuredData={{
                    "@context": "https://schema.org",
                    "@type": "Service",
                    "name": "LOREPA – Location de remorques",
                    "url": "https://lorepa.ca",
                    "description": "Plateforme de location de remorques entre particuliers au Québec",
                    "areaServed": { "@type": "Province", "name": "Québec" },
                    "serviceType": "Location de remorques"
                }}
            />
            <motion.div variants={fadeInDown} initial="hidden" animate="visible">
                {/* Assuming Navbar also needs to know the current language */}
                <Navbar currentLanguage={translationsData} />
            </motion.div>

            <div className="hidden md:block p-2">
                <div style={{ backgroundImage: `url(/HERO.png)` }} className="relative min-h-[100vh] w-full bg-contain bg-center bg-no-repeat rounded-[2.5rem] ring-4 ring-blue-100 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-50/70 via-blue-50/10 to-transparent" />

                    <motion.div variants={zoomBounce} initial="hidden" animate="visible" className="relative z-10 w-full flex justify-center items-center flex-col pt-16">
                        <span className="text-blue-600 text-xs font-bold tracking-[0.25em] uppercase">{translationsData.heroLabel}</span>
                        <h1 className="font-display text-[#0A0F18] text-4xl lg:text-5xl font-extrabold text-center mt-3 leading-tight">
                            {translationsData.heroHeadingLine1}<br />
                            <span className="text-blue-600">{translationsData.heroHeadingHighlight}</span> {translationsData.heroHeadingLine2}
                        </h1>

                        <motion.div variants={blurIn} initial="hidden" animate="visible" className="bg-white/25 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl p-3 sm:w-[80%] w-[90%] mx-20 mt-8 md:flex justify-center items-center flex-wrap">
                            <div className="flex-1 border border-[#9DA0A6] mt-1 mr-3 py-1 px-6 rounded-[2rem] relative" ref={wrapperRef}>
                                <h1 className="text-sm flex items-center gap-1"><FaMapMarkerAlt className="text-blue-600" />{translationsData?.where}</h1>
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

                    {/* Left feature cards */}
                    <div className="absolute left-6 top-[52%] hidden lg:flex flex-col gap-3 z-10 w-64">
                        {[
                            { icon: FaShieldAlt, title: translationsData.heroFeature1, desc: translationsData.heroFeature1Desc },
                            { icon: FaTools, title: translationsData.heroFeature2, desc: translationsData.heroFeature2Desc },
                            { icon: GiSteeringWheel, title: translationsData.heroFeature3, desc: translationsData.heroFeature3Desc },
                        ].map(({ icon: Icon, title, desc }, i) => (
                            <div key={i} className="bg-white/25 backdrop-blur-xl border border-white/50 rounded-xl shadow-xl p-3 flex items-start gap-3">
                                <div className="bg-blue-600 text-white rounded-full p-2 shrink-0">
                                    <Icon />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-[#0A0F18]">{title}</p>
                                    <p className="text-xs text-gray-500">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right avatar card */}
                    <div className="absolute right-6 top-[52%] hidden lg:block bg-white/25 backdrop-blur-xl border border-white/50 rounded-xl shadow-xl p-4 w-64 z-10">
                        <div className="flex -space-x-2 mb-2">
                            {trustedImageUrls.slice(0, 3).map((src, i) => (
                                <img key={i} src={src} alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                            ))}
                        </div>
                        <p className="font-bold text-[#0A0F18]">100+ {translationsData.heroPeopleLabel}</p>
                        <p className="text-xs text-gray-500 mt-1">{translationsData.heroPeopleDesc}</p>
                    </div>

                    {/* Bottom trust bar */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex bg-white/25 backdrop-blur-xl border border-white/50 rounded-full shadow-xl px-6 py-2 items-center gap-4 z-10 whitespace-nowrap">
                        <div className="flex -space-x-2">
                            {trustedImageUrls.slice(0, 3).map((src, i) => (
                                <img key={i} src={src} alt="" className="w-7 h-7 rounded-full border-2 border-white object-cover" />
                            ))}
                        </div>
                        <span className="text-sm text-[#0A0F18]">{translationsData.heroTrustedByPrefix} <span className="font-bold">50+</span> {translationsData.heroHappyCustomers}</span>
                        <span className="w-px h-4 bg-gray-300" />
                        <span className="flex items-center gap-1 text-sm text-[#0A0F18]">
                            <span className="flex text-yellow-400">
                                {Array.from({ length: 5 }).map((_, i) => <FaStar key={i} />)}
                            </span>
                            <span className="font-bold">4.9</span> (50 {translationsData.heroReviewsLabel})
                        </span>
                    </div>
                </div>
            </div>

            <div style={{ backgroundImage: `url(/HERO.png)` }} className="relative w-full bg-contain bg-center bg-no-repeat md:hidden block">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-50/70 via-blue-50/10 to-transparent" />
                <motion.div variants={zoomBounce} initial="hidden" animate="visible" className="relative w-full flex justify-center items-center flex-col">
                    <span className="text-blue-600 text-xs font-bold tracking-[0.25em] uppercase mt-[3rem]">{translationsData.heroLabel}</span>
                    <h1 className="font-display text-[#0A0F18] text-2xl font-extrabold text-center mt-2 leading-tight px-6">
                        {translationsData.heroHeadingLine1}<br />
                        <span className="text-blue-600">{translationsData.heroHeadingHighlight}</span> {translationsData.heroHeadingLine2}
                    </h1>
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
                            <button onClick={() => nav(buildSearchUrl())} className="w-full h-[3rem] bg-[#2563EB] rounded-md text-white">Search</button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            <div className="bg-[#2563EB] mobile-px py-8 sm:py-10">
                <AnimatedText
                    text={translationsData.referralFreeLine}
                    variant={fadeInDown}
                    className="text-xl sm:text-2xl lg:text-[40px] text-white font-semibold mt-6 sm:mt-10 mb-6 sm:mb-10 text-center"
                />
                <div className="flex justify-center items-center flex-wrap gap-4 sm:gap-6 pb-8 sm:pb-10">
                    {/* Rent a Trailer Card */}
                    <motion.div variants={flipIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="bg-white rounded-xl shadow-lg w-full max-w-sm sm:max-w-md lg:max-w-lg overflow-hidden px-4 sm:px-5">
                        <div className="py-7 sm:py-10">
                            <h2 className="text-xl sm:text-[46px] font-[300] mb-1 sm:mb-4">{translationsData.rentTrailerTitle}</h2>
                            <p className="text-gray-700 mb-4 sm:text-base text-sm">{translationsData.rentTrailerDescription}</p>
                            <Link to="/trailers">
                                <button className="border border-[#000] text-[#000] px-4 py-2 rounded-lg bg-transparent">{translationsData.rentTrailerButton}</button>
                            </Link>
                        </div>
                        <img src={Host1} alt="Rent a Trailer" className="w-full h-[20rem] rounded-tl-lg rounded-tr-lg object-cover" />
                    </motion.div>

                    {/* Become a Host Card */}
                    <motion.div variants={flipIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="bg-white rounded-xl shadow-lg w-full max-w-sm sm:max-w-md lg:max-w-lg overflow-hidden px-4 sm:px-5">
                        <div className="py-7 sm:py-10">
                            <h2 className="text-xl sm:text-[46px] font-[300] mb-1 sm:mb-4">{translationsData.becomeHostTitle}</h2>
                            <p className="text-gray-700 mb-4 sm:text-base text-sm">{translationsData.becomeHostDescription}</p>
                            <Link to="/register">
                                <button className="border border-[#000] text-[#000] px-4 py-2 rounded-lg bg-transparent">{translationsData.becomeHostButton || translationsData.becomeHostTitle}</button>
                            </Link>
                        </div>
                        <img src={Host2} alt="Become a Host" className="w-full h-[20rem] rounded-tl-lg rounded-tr-lg object-cover" />
                    </motion.div>

                </div>
            </div>

            <motion.div variants={flipIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="flex justify-center items-center flex-col bg-[#E9EFFD] py-14 px-3 sm:px-4">
                <AnimatedText text={translationsData.trustedBy} variant={fadeInDown} className="text-[44px] sm:text-[56px] text-black font-medium leading-tight" />
                <AnimatedText text={`${translationsData.leadingPlatform} ${translationsData.dynamicCommunity}`} variant={fadeInUp} className="text-xs sm:text-sm text-black mt-2 text-center max-w-[52rem]" />

                <div className="flex items-center justify-center mt-4">
                    {trustedImageUrls.map((img, i) => (
                        <img
                            key={`${img}-${i}`}
                            src={img}
                            alt={`Trusted host ${i + 1}`}
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-[#E9EFFD] shadow-sm -ml-2 first:ml-0"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = trustedAvatarImages[i % trustedAvatarImages.length];
                            }}
                        />
                    ))}
                </div>

                <AnimatedText text={translationsData.thankYou} variant={blurIn} className="text-lg font-semibold text-black mt-8 text-center" />
            </motion.div>

            <motion.div variants={flipIn} whileInView="visible" className="flex justify-center items-center flex-col p-3">
                <AnimatedText text={translationsData.popularLocations} variant={scaleIn} className="text-2xl text-black font-semibold mt-10" />
                <BounceCards
                    images={locations.slice(0, 5).map((loc, i) => loc.image || popularLocationImages[i % popularLocationImages.length])}
                    labels={locations.slice(0, 5).map((loc) => loc.title)}
                    containerWidth={400}
                    containerHeight={280}
                />
            </motion.div>

            <motion.div
                variants={zoomBounce}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="flex justify-center items-center flex-col bg-[#0A0F18] p-3 text-white"
            >
                <div className="flex flex-col items-center mt-10 w-full">
                    <AnimatedText
                        text={translationsData.carHauler}
                        variant={fadeInUp}
                        className="text-3xl sm:text-5xl font-extrabold uppercase tracking-wide bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent"
                    />
                    <div className="flex items-center gap-x-3 mt-4">
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
                <RollingGallery
                    images={trailers.map((item, i) => item.image || browseTrailerImages[i % browseTrailerImages.length])}
                />
            </motion.div>

            <div className="mobile-px py-6 sm:py-8 text-black">
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="flex flex-col items-center mt-10 w-full text-black"
                >
                    <AnimatedText
                        text={translationsData.faq}
                        variant={fadeInUp}
                        className="text-lg sm:text-2xl font-semibold mt-2 text-center"
                    />

                    <p className="text-center text-gray-500 mt-4 max-w-2xl mx-auto">{translationsData.faqDesc}</p>

                    <div className="w-full sm:w-auto flex justify-center mt-4">
                        <Link to={'/faq'} className="px-6 py-3 rounded-md bg-[#2563EB] text-white text-sm shadow-md">
                            {translationsData.seeAllFaq}
                        </Link>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
                    {/* Renters (Guests) FAQ Section */}
                    <motion.div
                        variants={flipIn}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        className="bg-[#F1F1F1] p-4 sm:p-5 rounded-xl"
                    >
                        <AnimatedText
                            text={translationsData.guests}
                            variant={fadeInUp}
                            className="text-xl font-semibold mb-4"
                        />
                        {mergedFaqContent.renters.map((faq, index) => (
                            <AccordionItem
                                key={`renter-faq-${index}`}
                                question={faq.question}
                                answer={faq.answer}
                            />
                        ))}
                    </motion.div>

                    {/* Owners (Hosts) FAQ Section */}
                    <motion.div
                        variants={flipIn}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        className="bg-[#F1F1F1] p-4 sm:p-5 rounded-xl"
                    >
                        <AnimatedText
                            text={translationsData.hosts}
                            variant={fadeInUp}
                            className="text-xl font-semibold mb-4"
                        />
                        {mergedFaqContent.owners.map((faq, index) => (
                            <AccordionItem
                                key={`owner-faq-${index}`}
                                question={faq.question}
                                answer={faq.answer}
                            />
                        ))}
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
