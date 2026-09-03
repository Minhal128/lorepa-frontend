import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaPhone, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

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
        transition: { duration: 0.8 },
    },
};

// Translations for the ContactPage
const contactPageTranslations = {
    en: {
        contactUs: "Contact us",
        tagline: "If you have questions or need help, just ask!",
        phoneNumber: "+1 438 282 6718",
        email: "contact@lorepa.com"
    },
    es: {
        contactUs: "Contáctanos",
        tagline: "Si tienes preguntas o necesitas ayuda, ¡solo pregunta!",
        phoneNumber: "+1 438 282 6718",
        email: "contact@lorepa.com"
    },
    cn: {
        contactUs: "联系我们",
        tagline: "如果您有问题或需要帮助，请尽管提问！",
        phoneNumber: "+1 438 282 6718",
        email: "contact@lorepa.com"
    },
    fr: {
        contactUs: "Contactez-nous",
        tagline: "Si vous avez des questions ou besoin d'aide, n'hésitez pas à demander !",
        phoneNumber: "+1 438 282 6718",
        email: "contact@lorepa.com"
    }
};

const ContactPage = () => {
    // Initialize translations based on localStorage, default to 'en'
    const [translations, setTranslations] = useState(() => {
        const storedLang = localStorage.getItem('lang');
        return contactPageTranslations[storedLang] || contactPageTranslations.fr;
    });

    useEffect(() => {
        // Listener for changes in localStorage 'lang' key
        const handleStorageChange = () => {
            const storedLang = localStorage.getItem('lang');
            setTranslations(contactPageTranslations[storedLang] || contactPageTranslations.fr);
        };

        window.addEventListener('storage', handleStorageChange);

        // Initial check in case the lang was set before the component mounted
        handleStorageChange();

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []); // Empty dependency array ensures this effect runs once on mount and cleans up on unmount

    return (
        <div className="min-h-screen bg-white text-black overflow-x-hidden">
            <SEO
                title="Contactez-nous | LOREPA"
                description="Une question sur la location de remorques au Québec ? Contactez l'équipe LOREPA. Nous vous répondons rapidement."
                canonical="/contact"
            />
            <Navbar />

            <motion.div
                className="mobile-px py-10 sm:py-16 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
            >
                <motion.div
                    className="w-full max-w-md text-center"
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    viewport={{ once: false, amount: 0.3 }}
                >
                    <motion.h1 className="text-3xl sm:text-4xl font-medium mb-4" variants={fadeInUp}>
                        {translations.contactUs}
                    </motion.h1>
                    <motion.p className="text-base sm:text-lg text-gray-700 mb-8" variants={fadeInUp}>
                        {translations.tagline}
                    </motion.p>

                    <motion.div className="space-y-4" variants={fadeInUp}>
                        <div className="flex items-center justify-center text-gray-700 text-lg">
                            <FaPhone className="mr-3" size={20} />
                            <span>{translations.phoneNumber}</span>
                        </div>
                        <div className="flex items-center justify-center text-gray-700 text-lg">
                            <FaEnvelope className="mr-3" size={20} />
                            <span>{translations.email}</span>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>

            <motion.div
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
            >
                <Footer />
            </motion.div>
        </div>
    );
};

export default ContactPage;
