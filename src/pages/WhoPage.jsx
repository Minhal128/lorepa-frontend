import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhoImage from '../assets/landing/who.png';
import Image from '../assets/landing/image.png';
import { FaRegQuestionCircle } from 'react-icons/fa';
import { TbMoneybag } from "react-icons/tb";
import { MdOutlineCancel } from 'react-icons/md';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
};

const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.8, ease: 'easeOut' },
    },
};

const zoomBounce = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: { type: 'spring', bounce: 0.4, duration: 0.8 },
    },
};

// Translations for the WhoPage
const whoPageTranslations = {
    en: {
        whoAreWe: "Who are we",
        description1: "The leading peer-to-peer trailer rental marketplace in Quebec. We connect trailer owners with individuals looking to rent trailers on a safe, secure, and user-friendly platform designed to simplify trailer rentals.",
        description2: "We are a trusted trailer rental platform From construction entrepreneurs to landscaping professionals, farmers, and more, many people search for trailers to rent without access to a reliable platform to meet their needs. Meanwhile, hundreds of unused trailers remain parked across the province. The demand for such equipment is constant, and supply is widely available, but no service efficiently connects renters with trailer owners.",
        description3: "That's why Lorepa was created: to bridge this gap by offering a simple, advantageous solution. Our platform allows trailer owners to generate passive income by making their equipment available to businesses or individuals. Until now, many owners hesitated to rent out their trailers due to the complications it could represent. On the other hand, renters are often limited by traditional rental agencies, whose hours, high fees, and restricted inventory don't always meet their expectations.",
        whyLorepa: "Why Lorepa",
        easyProfitableTitle: "Easy and Profitable: Rent your trailers to others",
        easyProfitableText: "Join us and contribute to secure a rental community.",
        freeCancellationTitle: "Free Cancellation",
        freeCancellationText: "Cancel for a full refund up to 24 hours before the rental starts.",
        earnMoneyTitle: "Earn money when not using the trailer",
        earnMoneyText: "Offer a solution to local people while increasing your revenue.",
        supportTeamTitle: "Our support team is just a message away",
        supportTeamText: "Chat with us for fast and personalized assistance.",
        downloadAppButton: "Download the app to chat",
        signInButton: "Sign in / Sign up"
    },
    es: {
        whoAreWe: "¿Quiénes somos?",
        description1: "El principal mercado de alquiler de remolques entre particulares en Quebec. Conectamos a propietarios de remolques con personas que buscan alquilarlos en una plataforma segura, confiable y fácil de usar, diseñada para simplificar el proceso de alquiler.",
        description2: "Somos una plataforma confiable de alquiler de remolques...",
        description3: "Por eso se creó Lorepa: para cerrar esta brecha ofreciendo una solución sencilla y ventajosa...",
        whyLorepa: "¿Por qué Lorepa?",
        easyProfitableTitle: "Fácil y rentable: Alquila tus remolques a otros",
        easyProfitableText: "Únete a nosotros y contribuye a asegurar una comunidad de alquiler.",
        freeCancellationTitle: "Cancelación gratuita",
        freeCancellationText: "Cancela para obtener un reembolso completo hasta 24 horas antes de que comience el alquiler.",
        earnMoneyTitle: "Gana dinero cuando no uses el remolque",
        earnMoneyText: "Ofrece una solución a la gente local mientras aumentas tus ingresos.",
        supportTeamTitle: "Nuestro equipo de soporte está a solo un mensaje de distancia",
        supportTeamText: "Chatea con nosotros para obtener asistencia rápida y personalizada.",
        downloadAppButton: "Descargar la app para chatear",
        signInButton: "Iniciar sesión / Registrarse"
    },
    cn: {
        whoAreWe: "我们是谁",
        description1: "魁北克领先的点对点拖车租赁市场...",
        description2: "我们是一个值得信赖的拖车租赁平台...",
        description3: "这正是Lorepa诞生的初衷...",
        whyLorepa: "为什么选择Lorepa",
        easyProfitableTitle: "简单且有利可图：将您的拖车租给他人",
        easyProfitableText: "加入我们，为建立安全的租赁社区做出贡献。",
        freeCancellationTitle: "免费取消",
        freeCancellationText: "在租赁开始前24小时内取消可获得全额退款。",
        earnMoneyTitle: "不使用拖车时赚钱",
        earnMoneyText: "为当地人提供解决方案，同时增加您的收入。",
        supportTeamTitle: "我们的支持团队随时待命",
        supportTeamText: "与我们聊天，获得快速和个性化的帮助。",
        downloadAppButton: "下载应用以聊天",
        signInButton: "登录 / 注册"
    },
    fr: {
        whoAreWe: "Qui sommes-nous",
        description1: "La principale plateforme de location de remorques entre particuliers au Québec...",
        description2: "Nous sommes une plateforme de location de remorques de confiance...",
        description3: "C’est pour cela que Lorepa a été créé...",
        whyLorepa: "Pourquoi Lorepa",
        easyProfitableTitle: "Facile et rentable : Louez vos remorques à d'autres",
        easyProfitableText: "Rejoignez-nous et contribuez à sécuriser une communauté de location.",
        freeCancellationTitle: "Annulation gratuite",
        freeCancellationText: "Annulez pour un remboursement intégral jusqu'à 24 heures avant le début de la location.",
        earnMoneyTitle: "Gagnez de l'argent lorsque vous n'utilisez pas la remorque",
        earnMoneyText: "Offrez une solution aux habitants locaux tout en augmentant vos revenus.",
        supportTeamTitle: "Notre équipe de support est à un message de distance",
        supportTeamText: "Discutez avec nous pour une assistance rapide et personnalisée.",
        downloadAppButton: "Téléchargez l'application pour discuter",
        signInButton: "Se connecter / S'inscrire"
    }
};

const WhoPage = () => {
    const [translations, setTranslations] = useState(() => {
        const storedLang = localStorage.getItem('lang');
        return whoPageTranslations[storedLang] || whoPageTranslations.fr;
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        const handleStorageChange = () => {
            const storedLang = localStorage.getItem('lang');
            setTranslations(whoPageTranslations[storedLang] || whoPageTranslations.fr);
        };
        window.addEventListener('storage', handleStorageChange);
        handleStorageChange();
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <div className="text-black overflow-x-hidden">
            <Navbar />

            <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-10 mobile-px py-10"
            >
                <div className="flex-1 w-full text-center lg:text-left">
                    <motion.h1 className="text-4xl sm:text-6xl lg:text-[80px] font-[500] mb-4 sm:mb-6" variants={fadeInUp}>{translations.whoAreWe}</motion.h1>
                    {[translations.description1, translations.description2, translations.description3].map((text, index) => (
                        <motion.p key={index} className="text-base sm:text-lg font-[400] mt-4 sm:mt-5 text-gray-800" variants={fadeIn}>{text}</motion.p>
                    ))}
                </div>
                <motion.img src={WhoImage} alt="Who we are" className="w-full max-w-lg mx-auto lg:mx-0 rounded-2xl shadow-lg" variants={zoomBounce} />
            </motion.div>

            <motion.h1 className="text-2xl sm:text-3xl lg:text-4xl mb-6 sm:mb-10 text-center font-semibold" variants={fadeInUp}>{translations.whyLorepa}</motion.h1>

            <div className="flex flex-col lg:flex-row items-center justify-center mobile-px gap-8 lg:gap-0">
                {/* Left Column */}
                <motion.div className="flex-1 flex flex-col items-center lg:items-start lg:pl-10 space-y-8" variants={fadeInUp}>
                    <div className="w-full max-w-sm text-center lg:text-left">
                        <TbMoneybag className="text-[#2563EB] mb-3 mx-auto lg:mx-0" size={28} />
                        <h2 className="text-lg font-semibold mb-2">{translations.easyProfitableTitle}</h2>
                        <p className="text-sm text-gray-700">{translations.easyProfitableText}</p>
                    </div>
                    <div className="w-full max-w-sm text-center lg:text-left">
                        <MdOutlineCancel className="text-[#2563EB] mb-3 mx-auto lg:mx-0" size={28} />
                        <h2 className="text-lg font-semibold mb-2">{translations.freeCancellationTitle}</h2>
                        <p className="text-sm text-gray-700">{translations.freeCancellationText}</p>
                    </div>
                </motion.div>

                {/* Image Middle */}
                <motion.div className="flex-shrink-0" variants={zoomBounce}>
                    <img src={Image} alt="Why Lorepa" className="max-w-[280px] sm:max-w-md lg:max-w-lg h-auto rounded-3xl shadow-xl border-4 border-white" />
                </motion.div>

                {/* Right Column */}
                <motion.div className="flex-1 flex flex-col items-center lg:items-start lg:pl-10 space-y-8" variants={fadeInUp}>
                    <div className="w-full max-w-sm text-center lg:text-left">
                        <TbMoneybag className="text-[#2563EB] mb-3 mx-auto lg:mx-0" size={28} />
                        <h2 className="text-lg font-semibold mb-2">{translations.earnMoneyTitle}</h2>
                        <p className="text-sm text-gray-700">{translations.earnMoneyText}</p>
                    </div>
                    <div className="w-full max-w-sm text-center lg:text-left">
                        <FaRegQuestionCircle className="text-[#2563EB] mb-3 mx-auto lg:mx-0" size={28} />
                        <h2 className="text-lg font-semibold mb-2">{translations.supportTeamTitle}</h2>
                        <p className="text-sm text-gray-700">{translations.supportTeamText}</p>
                    </div>
                </motion.div>
            </div>

            {/* Buttons Section */}
            <motion.div className="flex flex-col sm:flex-row justify-center items-center gap-4 my-10 mobile-px" variants={zoomBounce}>
                <button className="mobile-btn-primary w-full sm:w-auto min-w-[200px]">
                    <Link to="/login" className="block w-full h-full">{translations.signInButton}</Link>
                </button>
            </motion.div>

            <motion.div variants={fadeIn}>
                <Footer />
            </motion.div>
        </div>
    );
};

export default WhoPage;
