import React, { useEffect, useState } from 'react';
import { FaFacebook, FaGooglePlay, FaInstagram, FaLinkedinIn, FaTiktok, FaTwitter } from 'react-icons/fa';
import { IoLogoAppleAppstore } from 'react-icons/io5';
import { MdLanguage } from 'react-icons/md';
import { Link } from 'react-router-dom';

const footerTranslations = {
    en: {
        lorepa: "Lorepa",
        about: "About",
        faq: "FAQ",
        getStarted: "Get Started",
        createAccount: "Create account",
        findTrailer: "Find a Trailer",
        becomeHost: "Become a Host",
        locations: "Locations",
        montreal: "Montreal",
        quebecCity: "Quebec city",
        gatineau: "Gatineau",
        sherbrooke: "Sherbrooke",
        levis: "Lévis",
        support: "Support",
        helpCenter: "Help center",
        contactUs: "Contact us",
        downloadAppStore: "Download on the App Store",
        downloadGooglePlay: "Download on the Google Play",
        english: "English",
        address: "3910 Rue de Bellechasse, Montréal, Québec, H1X 1J4",
        allRightsReserved: "© 2025 Lorepa. All rights reserved.",
        privacyPolicy: "Privacy Policy",
        termsOfService: "Terms of Service",
        cookiePolicy: "Cookie Policy",
        legalNotice: "Legal Notice",
        dashboard: "Dashboard"
    },
    es: {
        lorepa: "Lorepa",
        about: "Acerca de",
        faq: "Preguntas frecuentes",
        getStarted: "Empezar",
        createAccount: "Crear cuenta",
        findTrailer: "Encontrar un remolque",
        becomeHost: "Conviértete en anfitrión",
        locations: "Ubicaciones",
        montreal: "Montreal",
        quebecCity: "Ciudad de Quebec",
        gatineau: "Gatineau",
        sherbrooke: "Sherbrooke",
        levis: "Lévis",
        support: "Soporte",
        helpCenter: "Centro de ayuda",
        contactUs: "Contáctanos",
        downloadAppStore: "Descargar en la App Store",
        downloadGooglePlay: "Descargar en Google Play",
        english: "Español",
        address: "3910 Rue de Bellechasse, Montréal, Québec, H1X 1J4",
        allRightsReserved: "© 2025 Lorepa. Todos los derechos reservados.",
        privacyPolicy: "Política de privacidad",
        termsOfService: "Términos de servicio",
        cookiePolicy: "Política de cookies",
        legalNotice: "Aviso legal",
        dashboard: "Panel de Control"
    },
    cn: {
        lorepa: "Lorepa",
        about: "关于",
        faq: "常见问题",
        getStarted: "开始使用",
        createAccount: "创建账户",
        findTrailer: "查找拖车",
        becomeHost: "成为房东",
        locations: "地点",
        montreal: "蒙特利尔",
        quebecCity: "魁北克市",
        gatineau: "加蒂诺",
        sherbrooke: "舍布鲁克",
        levis: "莱维",
        support: "支持",
        helpCenter: "帮助中心",
        contactUs: "联系我们",
        downloadAppStore: "在App Store下载",
        downloadGooglePlay: "在Google Play下载",
        english: "中文",
        address: "3910 Rue de Bellechasse, Montréal, Québec, H1X 1J4",
        allRightsReserved: "© 2025 Lorepa. 版权所有。",
        privacyPolicy: "隐私政策",
        termsOfService: "服务条款",
        cookiePolicy: "Cookie政策",
        legalNotice: "法律声明",
        dashboard: "仪表板"
    },
    fr: {
        lorepa: "Lorepa",
        about: "À propos",
        faq: "FAQ",
        getStarted: "Commencer",
        createAccount: "Créer un compte",
        findTrailer: "Trouver une remorque",
        becomeHost: "Devenir hôte",
        locations: "Lieux",
        montreal: "Montréal",
        quebecCity: "Ville de Québec",
        gatineau: "Gatineau",
        sherbrooke: "Sherbrooke",
        levis: "Lévis",
        support: "Soutien",
        helpCenter: "Centre d'aide",
        contactUs: "Nous contacter",
        downloadAppStore: "Télécharger sur l'App Store",
        downloadGooglePlay: "Télécharger sur Google Play",
        english: "Français",
        address: "3910 Rue de Bellechasse, Montréal, Québec, H1X 1J4",
        allRightsReserved: "© 2025 Lorepa. Tous droits réservés.",
        privacyPolicy: "Politique de confidentialité",
        termsOfService: "Conditions d'utilisation",
        cookiePolicy: "Politique de cookies",
        legalNotice: "Mentions légales",
        dashboard: "Tableau de Bord"
    }
};


const Footer = () => {
    const isLogin = localStorage.getItem("userId");
    const [translations, setTranslations] = useState(() => {
        const storedLang = localStorage.getItem('lang');
        return footerTranslations[storedLang] || footerTranslations.fr;
    });

    useEffect(() => {
        const handleStorageChange = () => {
            const storedLang = localStorage.getItem('lang');
            setTranslations(footerTranslations[storedLang] || footerTranslations.fr);
        };

        window.addEventListener('storage', handleStorageChange);
        handleStorageChange();

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <footer className="bg-[#F1F1F1] text-black">
            <div className="mobile-px py-8 sm:py-10 lg:py-12">
                <div className="max-w-7xl mx-auto">
                    {/* Main Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8">
                        {/* Section 1: Lorepa */}
                        <div>
                            <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">{translations.lorepa}</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/who" className="hover:underline py-1 inline-block">{translations.about}</Link></li>
                                <li><Link to="/faq" className="hover:underline py-1 inline-block">{translations.faq}</Link></li>
                            </ul>
                        </div>

                        {/* Section 2: Get Started */}
                        <div>
                            <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">{translations.getStarted}</h3>
                            <ul className="space-y-2 text-sm">
                                {!isLogin && <li><Link to="/login" className="hover:underline py-1 inline-block">{translations.createAccount}</Link></li>}
                                <li><Link to="/trailers" className="hover:underline py-1 inline-block">{translations.findTrailer}</Link></li>
                                {isLogin && <li><Link to={localStorage.getItem('role') === 'owner' ? '/seller/dashboard/home' : '/user/dashboard/home'} className="hover:underline py-1 inline-block">{translations.dashboard || 'Dashboard'}</Link></li>}
                            </ul>
                        </div>

                        {/* Section 3: Locations */}
                        <div>
                            <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">{translations.locations}</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link to={`/trailers?city=Montreal`} className="hover:underline py-1 inline-block">{translations.montreal}</Link></li>
                                <li><Link to={`/trailers?city=Quebec`} className="hover:underline py-1 inline-block">{translations.quebecCity}</Link></li>
                                <li><Link to={`/trailers?city=Gatineau`} className="hover:underline py-1 inline-block">{translations.gatineau}</Link></li>
                                <li className="hidden sm:block"><Link to={`/trailers?city=Sherbrooke`} className="hover:underline py-1 inline-block">{translations.sherbrooke}</Link></li>
                                <li className="hidden sm:block"><Link to={`/trailers?city=Lévis`} className="hover:underline py-1 inline-block">{translations.levis}</Link></li>
                            </ul>
                        </div>

                        {/* Section 4: Support */}
                        <div>
                            <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">{translations.support}</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/contact" className="hover:underline py-1 inline-block">{translations.contactUs}</Link></li>
                            </ul>
                        </div>

                        {/* Section 5: Social Media and App Downloads */}
                        <div className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-1 mt-4 lg:mt-0">
                            {/* Social Icons */}
                            <div className="flex justify-start lg:justify-end space-x-4 mb-4 sm:mb-6">
                                <a target='_blank' rel="noopener noreferrer" href="https://www.tiktok.com/@lorepa.ca" aria-label="Tiktok" className="text-black hover:text-blue-600 transition-colors p-1">
                                    <FaTiktok size={20} />
                                </a>
                                <a target='_blank' rel="noopener noreferrer" href="https://www.instagram.com/lorepa.ca?igsh=MWk0NGo5dmFrZXR4YQ==" aria-label="Instagram" className="text-black hover:text-blue-600 transition-colors p-1">
                                    <FaInstagram size={20} />
                                </a>
                                <a target='_blank' rel="noopener noreferrer" href="https://www.linkedin.com/company/location-de-remorque-entre-particuliers/" aria-label="LinkedIn" className="text-black hover:text-blue-600 transition-colors p-1">
                                    <FaLinkedinIn size={20} />
                                </a>
                                <a target='_blank' rel="noopener noreferrer" href="https://www.facebook.com/share/15qZy6cEuV/" aria-label="Facebook" className="text-black hover:text-blue-600 transition-colors p-1">
                                    <FaFacebook size={20} />
                                </a>
                            </div>

                            {/* App Store Buttons */}
                            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                                <a href="#" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105 active:scale-95">
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                                        alt="Download on the App Store"
                                        className="h-10 w-auto"
                                    />
                                </a>
                                <a href="#" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-105 active:scale-95">
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                                        alt="Get it on Google Play"
                                        className="h-10 w-auto"
                                    />
                                </a>
                            </div>

                            {/* Language Selector */}
                            <div className="flex items-center mt-4 sm:mt-6 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">
                                <MdLanguage className="mr-2" size={18} />
                                <span className="text-sm">{translations.english}</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="mt-8 pt-6 border-t border-gray-300">
                        <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
                            {/* Address and Copyright */}
                            <div className="space-y-1 text-center lg:text-left">
                                <p className="text-xs sm:text-sm">{translations.address}</p>
                                <p className="text-xs sm:text-sm text-gray-600">{translations.allRightsReserved}</p>
                            </div>

                            {/* Legal Links */}
                            <div className="flex flex-wrap justify-center lg:justify-end gap-x-4 gap-y-2 text-xs sm:text-sm">
                                <Link to="/privacy" className="hover:underline whitespace-nowrap">{translations.privacyPolicy}</Link>
                                <Link to="/terms" className="hover:underline whitespace-nowrap">{translations.termsOfService}</Link>
                                <Link to="/cookie" className="hover:underline whitespace-nowrap">{translations.cookiePolicy}</Link>
                                <Link to="/legal" className="hover:underline whitespace-nowrap">{translations.legalNotice}</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

