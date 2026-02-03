import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const sectionVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5 },
    }),
};

const privacyPolicyTranslations = {
    en: {
        privacyPolicyTitle: "Cookie Policy – Lorepa",
        preambleTitle: "1. Introduction",
        preambleContent: "Lorepa (“we,” “our,” or “us”) values your privacy and is committed to being transparent about how we use cookies and similar technologies on our website and mobile application (collectively, the “Platform”). This Cookie Policy explains what cookies are, how we use them, and how you can manage your preferences. By continuing to use our Platform, you agree to the use of cookies in accordance with this Policy.",
        definitionTitle: "2. What are cookies?",
        definitionContent: (
            <>
                <p>Cookies are small text files that are placed on your device (computer, tablet, or mobile phone) when you visit a website. They help us recognize your device, store your preferences, improve user experience, and deliver personalized content and advertisements.</p>
                <p>Cookies can be:</p>
                <ul className='list-disc list-inside space-y-1 ml-4'>
                    <li>**Session cookies:** temporary files that are deleted once you close your browser.</li>
                    <li>**Persistent cookies:** remain on your device for a set period or until you delete them manually.</li>
                </ul>
                <p>We may also use similar technologies such as pixels, tags, and local storage.</p>
            </>
        ),
        useTitle: "4. How We Use Cookies",
        useContent: (
            <>
                <p>We use cookies for the following purposes:</p>
                <ul className='list-disc list-inside space-y-1 ml-4'>
                    <li>To authenticate users and maintain secure sessions.</li>
                    <li>To remember your preferences and settings.</li>
                    <li>To analyze traffic, usage trends, and Platform performance.</li>
                    <li>To deliver personalized marketing and promotional offers.</li>
                    <li>To measure the effectiveness of our communications and advertising campaigns.</li>
                </ul>
            </>
        ),
        typesTitle: "3. Types of Cookies We Use",
        typesContent: (
            <>
                <p>We use the following categories of cookies on our Platform:</p>
                <ul className='list-disc list-inside space-y-1 ml-4'>
                    <li>**Strictly Necessary Cookies:** Essential for the functioning of our Platform. They allow you to log in, secure your account, and access core features. Without these cookies, our Platform may not work properly.</li>
                    <li>**Performance and Analytics Cookies:** Collect information about how you use our Platform (e.g., which pages are visited most often). They help us understand and improve performance, user flows, and functionality. We may use tools such as Google Analytics or similar providers.</li>
                    <li>**Functional Cookies:** Remember your settings and preferences (e.g., language, location). They enhance personalization and improve your overall experience.</li>
                    <li>**Advertising and Targeting Cookies:** Used to deliver relevant ads and measure their effectiveness. They may track browsing activity across different websites and are often set by third-party ad networks (e.g., Google Ads, Meta).</li>
                </ul>
            </>
        ),
        thirdPartyTitle: "5. Third-Party Cookies",
        thirdPartyContent: (
            <>
                <p>In addition to our own cookies, we may allow trusted third parties to place cookies on your device for:</p>
                <ul className='list-disc list-inside space-y-1 ml-4'>
                    <li>Analytics and performance tracking (e.g., Google Analytics).</li>
                    <li>Advertising and remarketing (e.g., Google Ads, Facebook/Meta, LinkedIn).</li>
                    <li>Social media integrations (e.g., sharing buttons or embedded content).</li>
                </ul>
                <p>These third parties may collect data about your browsing activity across websites and use it for their own purposes, subject to their privacy and cookie policies.</p>
            </>
        ),
        choicesTitle: "6. Your Choices and Cookies Management",
        choicesContent: (
            <>
                <p>You have several options to manage or disable cookies:</p>
                <ul className='list-disc list-inside space-y-1 ml-4'>
                    <li>**Browser settings:** Most browsers allow you to block, delete, or manage cookies. Check your browser’s “help” section for instructions.</li>
                    <li>**Cookie banner/consent tool:** On your first visit, we present a cookie banner that allows you to accept or customize your cookie preferences.</li>
                    <li>**Opt-out of analytics/ads:** You can opt out of certain third-party services (e.g., Google Analytics opt-out tool, Ads settings).</li>
                </ul>
                <p>Please note: disabling certain cookies may affect the functionality and performance of our Platform.</p>
            </>
        ),
        changesToConsentTitle: "7. Change to Your Consent",
        changesToConsentContent: "You may update or withdraw your consent to cookie use at any time. This can be done through the cookie management settings available on our Platform or by adjusting your browser settings.",
        updatesTitle: "8. Update to this Cookie Policy",
        updatesContent: "We may update this Cookie Policy from time to time to reflect changes in technology, legal requirements, or our business practices. Any updates will be posted on this page with the “Effective Date” revised accordingly. In case of significant changes, we will provide additional notice (e.g., banner notification or email).",
        effectiveDate: "Effective Date: 2025-08-17",
        cookiePolicyPreamble: "This Cookie Policy should be read together with our Privacy Policy and Terms of Use. It explains how cookies and similar tracking technologies function, why we use them, and the choices available to you regarding their use.",
    },
    es: {
        privacyPolicyTitle: "Política de Cookies – Lorepa",
        preambleTitle: "1. Introducción",
        preambleContent: "Lorepa (“nosotros”, “nuestro” o “nos”) valora su privacidad y se compromete a ser transparente sobre cómo utilizamos las cookies y tecnologías similares en nuestro sitio web y aplicación móvil (colectivamente, la “Plataforma”). Esta Política de Cookies explica qué son las cookies, cómo las usamos y cómo puede gestionar sus preferencias. Al continuar usando nuestra Plataforma, usted acepta el uso de cookies de acuerdo con esta Política.",
        definitionTitle: "2. ¿Qué son las cookies?",
        definitionContent: (
            <>
                <p>Las cookies son pequeños archivos de texto que se colocan en su dispositivo (computadora, tableta o teléfono móvil) cuando visita un sitio web. Nos ayudan a reconocer su dispositivo, almacenar sus preferencias, mejorar la experiencia del usuario y ofrecer contenido y anuncios personalizados.</p>
                <p>Las cookies pueden ser:</p>
                <ul className='list-disc list-inside space-y-1 ml-4'>
                    <li>**Cookies de sesión:** archivos temporales que se eliminan una vez que cierra su navegador.</li>
                    <li>**Cookies persistentes:** permanecen en su dispositivo por un período establecido o hasta que las elimine manualmente.</li>
                </ul>
                <p>También podemos utilizar tecnologías similares como píxeles, etiquetas y almacenamiento local.</p>
            </>
        ),
        useTitle: "4. Cómo usamos las cookies",
        useContent: (
            <>
                <p>Utilizamos cookies para los siguientes fines:</p>
                <ul className='list-disc list-inside space-y-1 ml-4'>
                    <li>Para autenticar a los usuarios y mantener sesiones seguras.</li>
                    <li>Para recordar sus preferencias y configuraciones.</li>
                    <li>Para analizar el tráfico, las tendencias de uso y el rendimiento de la Plataforma.</li>
                    <li>Para ofrecer marketing personalizado y ofertas promocionales.</li>
                    <li>Para medir la efectividad de nuestras comunicaciones y campañas publicitarias.</li>
                </ul>
            </>
        ),
        typesTitle: "3. Tipos de cookies que utilizamos",
        typesContent: (
            <>
                <p>Utilizamos las siguientes categorías de cookies en nuestra Plataforma:</p>
                <ul className='list-disc list-inside space-y-1 ml-4'>
                    <li>**Cookies Estrictamente Necesarias:** Esenciales para el funcionamiento de nuestra Plataforma. Le permiten iniciar sesión, proteger su cuenta y acceder a funciones principales. Sin estas cookies, nuestra Plataforma puede no funcionar correctamente.</li>
                    <li>**Cookies de Rendimiento y Análisis:** Recopilan información sobre cómo utiliza nuestra Plataforma (por ejemplo, qué páginas se visitan con más frecuencia). Nos ayudan a comprender y mejorar el rendimiento, los flujos de usuario y la funcionalidad. Podemos utilizar herramientas como Google Analytics o proveedores similares.</li>
                    <li>**Cookies Funcionales:** Recuerdan sus configuraciones y preferencias (por ejemplo, idioma, ubicación). Mejoran la personalización y su experiencia general.</li>
                    <li>**Cookies de Publicidad y Orientación:** Se utilizan para ofrecer anuncios relevantes y medir su efectividad. Pueden rastrear la actividad de navegación en diferentes sitios web y a menudo son establecidas por redes publicitarias de terceros (por ejemplo, Google Ads, Meta).</li>
                </ul>
            </>
        ),
        thirdPartyTitle: "5. Cookies de terceros",
        thirdPartyContent: (
            <>
                <p>Además de nuestras propias cookies, podemos permitir que terceros de confianza coloquen cookies en su dispositivo para:</p>
                <ul className='list-disc list-inside space-y-1 ml-4'>
                    <li>Análisis y seguimiento del rendimiento (por ejemplo, Google Analytics).</li>
                    <li>Publicidad y remarketing (por ejemplo, Google Ads, Facebook/Meta, LinkedIn).</li>
                    <li>Integraciones de redes sociales (por ejemplo, botones para compartir o contenido incrustado).</li>
                </ul>
                <p>Estos terceros pueden recopilar datos sobre su actividad de navegación en los sitios web y usarlos para sus propios fines, sujetos a sus políticas de privacidad y cookies.</p>
            </>
        ),
        choicesTitle: "6. Sus opciones y gestión de cookies",
        choicesContent: (
            <>
                <p>Tiene varias opciones para gestionar o deshabilitar las cookies:</p>
                <ul className='list-disc list-inside space-y-1 ml-4'>
                    <li>**Configuración del navegador:** La mayoría de los navegadores le permiten bloquear, eliminar o gestionar las cookies. Consulte la sección de "ayuda" de su navegador para obtener instrucciones.</li>
                    <li>**Banner de cookies/herramienta de consentimiento:** En su primera visita, presentamos un banner de cookies que le permite aceptar o personalizar sus preferencias de cookies.</li>
                    <li>**Exclusión de análisis/anuncios:** Puede optar por no participar en ciertos servicios de terceros (por ejemplo, la herramienta de exclusión de Google Analytics, la configuración de anuncios).</li>
                </ul>
                <p>Tenga en cuenta: deshabilitar ciertas cookies puede afectar la funcionalidad y el rendimiento de nuestra Plataforma.</p>
            </>
        ),
        changesToConsentTitle: "7. Cambio de su consentimiento",
        changesToConsentContent: "Puede actualizar o retirar su consentimiento para el uso de cookies en cualquier momento. Esto se puede hacer a través de la configuración de gestión de cookies disponible en nuestra Plataforma o ajustando la configuración de su navegador.",
        updatesTitle: "8. Actualización de esta Política de Cookies",
        updatesContent: "Podemos actualizar esta Política de Cookies de vez en cuando para reflejar cambios en la tecnología, los requisitos legales o nuestras prácticas comerciales. Cualquier actualización se publicará en esta página con la “Fecha de entrada en vigor” revisada en consecuencia. En caso de cambios significativos, le proporcionaremos un aviso adicional (por ejemplo, notificación en un banner o correo electrónico).",
        // Additional content for the existing Privacy Policy sections
        effectiveDate: "Fecha de entrada en vigor: 2025-08-17",
        cookiePolicyPreamble: "Esta Política de Cookies debe leerse junto con nuestra Política de Privacidad y Términos de Uso. Explica cómo funcionan las cookies y tecnologías de seguimiento similares, por qué las usamos y las opciones disponibles para usted con respecto a su uso.",
    },
    cn: {
        privacyPolicyTitle: "Cookie 政策 – Lorepa",
        preambleTitle: "1. 简介",
        preambleContent: "Lorepa（“我们”）重视您的隐私，并致力于公开透明地说明我们如何在网站和移动应用程序（统称为“平台”）上使用 Cookie 和类似技术。本 Cookie 政策解释了什么是 Cookie、我们如何使用它们以及您如何管理您的偏好设置。继续使用我们的平台即表示您同意根据本政策使用 Cookie。",
        definitionTitle: "2. 什么是 Cookie？",
        definitionContent: (
            <>
                <p>Cookie 是您访问网站时放置在您的设备（计算机、平板电脑或手机）上的小型文本文件。它们帮助我们识别您的设备、存储您的偏好设置、改善用户体验并提供个性化内容和广告。</p>
                <p>Cookie 可以是：</p>
                <ul className='list-disc list-inside space-y-1 ml-4'>
                    <li>**会话 Cookie：** 临时文件，在您关闭浏览器后即被删除。</li>
                    <li>**持久性 Cookie：** 在您的设备上保留一段设定的时间或直到您手动删除它们。</li>
                </ul>
                <p>我们也可能使用类似的技术，如像素、标签和本地存储。</p>
            </>
        ),
        useTitle: "4. 我们如何使用 Cookie",
        useContent: (
            <>
                <p>我们将 Cookie 用于以下目的：</p>
                <ul className='list-disc list-inside space-y-1 ml-4'>
                    <li>验证用户身份并保持安全会话。</li>
                    <li>记住您的偏好设置和配置。</li>
                    <li>分析流量、使用趋势和平台性能。</li>
                    <li>提供个性化的营销和促销优惠。</li>
                    <li>衡量我们的通信和广告活动的有效性。</li>
                </ul>
            </>
        ),
        typesTitle: "3. 我们使用的 Cookie 类型",
        typesContent: (
            <>
                <p>我们在平台上使用以下几类 Cookie：</p>
                <ul className='list-disc list-inside space-y-1 ml-4'>
                    <li>**严格必要的 Cookie：** 对于我们平台的正常运行至关重要。它们允许您登录、保护您的账户和访问核心功能。没有这些 Cookie，我们的平台可能无法正常工作。</li>
                    <li>**性能和分析 Cookie：** 收集有关您如何使用我们平台的信息（例如，哪些页面访问频率最高）。它们帮助我们了解和改进性能、用户流程和功能。我们可能会使用 Google Analytics 或类似提供商的工具。</li>
                    <li>**功能性 Cookie：** 记住您的设置和偏好（例如，语言、位置）。它们增强个性化并改善您的整体体验。</li>
                    <li>**广告和定向 Cookie：** 用于提供相关广告并衡量其有效性。它们可能会跟踪不同网站上的浏览活动，并且通常由第三方广告网络（例如，Google Ads、Meta）设置。</li>
                </ul>
            </>
        ),
        thirdPartyTitle: "5. 第三方 Cookie",
        thirdPartyContent: (
            <>
                <p>除了我们自己的 Cookie，我们还可能允许可信的第三方在您的设备上放置 Cookie，用于：</p>
                <ul className='list-disc list-inside space-y-1 ml-4'>
                    <li>分析和性能跟踪（例如，Google Analytics）。</li>
                    <li>广告和再营销（例如，Google Ads、Facebook/Meta、LinkedIn）。</li>
                    <li>社交媒体集成（例如，分享按钮或嵌入式内容）。</li>
                </ul>
                <p>这些第三方可能会收集有关您在不同网站上的浏览活动的数据，并根据其隐私和 Cookie 政策将其用于自己的目的。</p>
            </>
        ),
        choicesTitle: "6. 您的选择和 Cookie 管理",
        choicesContent: (
            <>
                <p>您有多种选项来管理或禁用 Cookie：</p>
                <ul className='list-disc list-inside space-y-1 ml-4'>
                    <li>**浏览器设置：** 大多数浏览器允许您阻止、删除或管理 Cookie。请查看您的浏览器“帮助”部分以获取说明。</li>
                    <li>**Cookie 横幅/同意工具：** 在您首次访问时，我们会显示一个 Cookie 横幅，允许您接受或自定义您的 Cookie 偏好设置。</li>
                    <li>**退出分析/广告：** 您可以选择退出某些第三方服务（例如，Google Analytics 退出工具，广告设置）。</li>
                </ul>
                <p>请注意：禁用某些 Cookie 可能会影响我们平台的功能和性能。</p>
            </>
        ),
        changesToConsentTitle: "7. 更改您的同意",
        changesToConsentContent: "您可以随时更新或撤回您对使用 Cookie 的同意。这可以通过我们平台上提供的 Cookie 管理设置或通过调整您的浏览器设置来完成。",
        updatesTitle: "8. 本 Cookie 政策的更新",
        updatesContent: "我们可能会不时更新本 Cookie 政策，以反映技术、法律要求或我们业务实践的变化。任何更新都将在此页面上发布，并相应地修改“生效日期”。如果发生重大变更，我们将提供额外通知（例如，横幅通知或电子邮件）。",
        // Additional content for the existing Privacy Policy sections
        effectiveDate: "生效日期：2025-08-17",
        cookiePolicyPreamble: "本 Cookie 政策应与我们的隐私政策和使用条款一并阅读。它解释了 Cookie 和类似跟踪技术的工作方式，我们为何使用它们以及您在使用它们方面的可用选择。",
    },
    fr: {
        privacyPolicyTitle: "Politique relative aux cookies – Lorepa",
        preambleTitle: "1. Introduction",
        preambleContent: "Lorepa (« nous », « notre » ou « nos ») accorde de l'importance à votre vie privée et s'engage à être transparent sur la manière dont nous utilisons les cookies et les technologies similaires sur notre site Web et notre application mobile (collectivement, la « Plateforme »). Cette politique relative aux cookies explique ce que sont les cookies, comment nous les utilisons et comment vous pouvez gérer vos préférences. En continuant à utiliser notre Plateforme, vous acceptez l'utilisation de cookies conformément à la présente politique.",
        definitionTitle: "2. Que sont les cookies ?",
        definitionContent: (
            <>
                <p>Les cookies sont de petits fichiers texte qui sont placés sur votre appareil (ordinateur, tablette ou téléphone mobile) lorsque vous visitez un site Web. Ils nous aident à reconnaître votre appareil, à stocker vos préférences, à améliorer l'expérience utilisateur et à vous proposer du contenu et des publicités personnalisés.</p>
                <p>Les cookies peuvent être :</p>
                <ul className='list-disc list-inside space-y-1 ml-4'>
                    <li>**Cookies de session :** fichiers temporaires qui sont supprimés une fois que vous fermez votre navigateur.</li>
                    <li>**Cookies persistants :** restent sur votre appareil pendant une période déterminée ou jusqu'à ce que vous les supprimiez manuellement.</li>
                </ul>
                <p>Nous pouvons également utiliser des technologies similaires telles que des pixels, des balises et du stockage local.</p>
            </>
        ),
        useTitle: "4. Comment nous utilisons les cookies",
        useContent: (
            <>
                <p>Nous utilisons les cookies aux fins suivantes :</p>
                <ul className='list-disc list-inside space-y-1 ml-4'>
                    <li>Pour authentifier les utilisateurs et maintenir des sessions sécurisées.</li>
                    <li>Pour mémoriser vos préférences et vos paramètres.</li>
                    <li>Pour analyser le trafic, les tendances d'utilisation et les performances de la Plateforme.</li>
                    <li>Pour vous proposer du marketing personnalisé et des offres promotionnelles.</li>
                    <li>Pour mesurer l'efficacité de nos communications et de nos campagnes publicitaires.</li>
                </ul>
            </>
        ),
        typesTitle: "3. Types de cookies que nous utilisons",
        typesContent: (
            <>
                <p>Nous utilisons les catégories de cookies suivantes sur notre Plateforme :</p>
                <ul className='list-disc list-inside space-y-1 ml-4'>
                    <li>**Cookies strictement nécessaires :** Essentiels au fonctionnement de notre Plateforme. Ils vous permettent de vous connecter, de sécuriser votre compte et d'accéder aux fonctionnalités de base. Sans ces cookies, notre Plateforme pourrait ne pas fonctionner correctement.</li>
                    <li>**Cookies de performance et d'analyse :** Recueillent des informations sur la manière dont vous utilisez notre Plateforme (par exemple, les pages les plus visitées). Ils nous aident à comprendre et à améliorer les performances, les flux d'utilisateurs et les fonctionnalités. Nous pouvons utiliser des outils tels que Google Analytics ou des fournisseurs similaires.</li>
                    <li>**Cookies fonctionnels :** Mémorisent vos paramètres et préférences (par exemple, la langue, l'emplacement). Ils améliorent la personnalisation et votre expérience globale.</li>
                    <li>**Cookies publicitaires et de ciblage :** Utilisés pour vous proposer des publicités pertinentes et mesurer leur efficacité. Ils peuvent suivre l'activité de navigation sur différents sites Web et sont souvent définis par des réseaux publicitaires tiers (par exemple, Google Ads, Meta).</li>
                </ul>
            </>
        ),
        thirdPartyTitle: "5. Cookies de tiers",
        thirdPartyContent: (
            <>
                <p>En plus de nos propres cookies, nous pouvons autoriser des tiers de confiance à placer des cookies sur votre appareil pour :</p>
                <ul className='list-disc list-inside space-y-1 ml-4'>
                    <li>L'analyse et le suivi des performances (par exemple, Google Analytics).</li>
                    <li>La publicité et le remarketing (par exemple, Google Ads, Facebook/Meta, LinkedIn).</li>
                    <li>Les intégrations de médias sociaux (par exemple, les boutons de partage ou le contenu intégré).</li>
                </ul>
                <p>Ces tiers peuvent collecter des données sur votre activité de navigation sur les sites Web et les utiliser à leurs propres fins, sous réserve de leurs politiques de confidentialité et relatives aux cookies.</p>
            </>
        ),
        choicesTitle: "6. Vos choix et gestion des cookies",
        choicesContent: (
            <>
                <p>Vous avez plusieurs options pour gérer ou désactiver les cookies :</p>
                <ul className='list-disc list-inside space-y-1 ml-4'>
                    <li>**Paramètres du navigateur :** La plupart des navigateurs vous permettent de bloquer, de supprimer ou de gérer les cookies. Consultez la section « aide » de votre navigateur pour obtenir des instructions.</li>
                    <li>**Bannière de cookies/outil de consentement :** Lors de votre première visite, nous présentons une bannière de cookies qui vous permet d'accepter ou de personnaliser vos préférences en matière de cookies.</li>
                    <li>**Désactivation de l'analyse/des publicités :** Vous pouvez vous désinscrire de certains services tiers (par exemple, l'outil de désactivation de Google Analytics, les paramètres des publicités).</li>
                </ul>
                <p>Veuillez noter : la désactivation de certains cookies peut affecter la fonctionnalité et les performances de notre Plateforme.</p>
            </>
        ),
        changesToConsentTitle: "7. Modification de votre consentement",
        changesToConsentContent: "Vous pouvez mettre à jour ou retirer votre consentement à l'utilisation des cookies à tout moment. Cela peut être fait via les paramètres de gestion des cookies disponibles sur notre Plateforme ou en ajustant les paramètres de votre navigateur.",
        updatesTitle: "8. Mise à jour de la présente politique relative aux cookies",
        updatesContent: "Nous pouvons mettre à jour cette politique relative aux cookies de temps à autre pour refléter les changements technologiques, les exigences légales ou nos pratiques commerciales. Toute mise à jour sera publiée sur cette page et la « Date d'entrée en vigueur » sera révisée en conséquence. En cas de changements importants, nous vous enverrons un avis supplémentaire (par exemple, une notification par bannière ou un courriel).",
        // Additional content for the existing Privacy Policy sections
        effectiveDate: "Date d'entrée en vigueur : 2025-08-17",
        cookiePolicyPreamble: "Cette politique relative aux cookies doit être lue conjointement avec notre politique de confidentialité et nos conditions d'utilisation. Elle explique le fonctionnement des cookies et des technologies de suivi similaires, les raisons pour lesquelles nous les utilisons et les choix qui s'offrent à vous concernant leur utilisation.",
    },
};

const CookiesPage = () => {
    const [translations, setTranslations] = useState(() => {
        const storedLang = localStorage.getItem('lang');
        return privacyPolicyTranslations[storedLang] || privacyPolicyTranslations.fr;
    });

    useEffect(() => {
        window.scrollTo(0, 0);

        const handleStorageChange = () => {
            const storedLang = localStorage.getItem('lang');
            setTranslations(privacyPolicyTranslations[storedLang] || privacyPolicyTranslations.fr);
        };

        window.addEventListener('storage', handleStorageChange);
        handleStorageChange(); // Run once on mount

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const sections = [
        {
            title: translations.preambleTitle,
            content: (
                <>
                    <p>{translations.preambleContent}</p>
                    <p className='mt-2'>{translations.cookiePolicyPreamble}</p>
                </>
            ),
        },
        {
            title: translations.definitionTitle,
            content: translations.definitionContent,
        },
        {
            title: translations.typesTitle,
            content: translations.typesContent,
        },
        {
            title: translations.useTitle,
            content: translations.useContent,
        },
        {
            title: translations.thirdPartyTitle,
            content: translations.thirdPartyContent,
        },
        {
            title: translations.choicesTitle,
            content: translations.choicesContent,
        },
        {
            title: translations.changesToConsentTitle,
            content: translations.changesToConsentContent,
        },
        {
            title: translations.updatesTitle,
            content: translations.updatesContent,
        },
    ];

    return (
        <div className='min-h-screen bg-white text-black'>
            <Navbar />

            <div className='mobile-px my-10'>
                <motion.h1
                    className='text-2xl sm:text-3xl font-bold text-center mb-8'
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {translations.privacyPolicyTitle}
                </motion.h1>
                <div className='text-sm leading-relaxed mb-6 text-center text-gray-600'>
                    {translations.effectiveDate}
                </div>

                <div className='space-y-10 text-sm leading-relaxed'>
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            custom={index}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={sectionVariant}
                        >
                            <h2 className='text-lg sm:text-xl font-semibold mb-3'>{section.title}</h2>
                            <div className='text-gray-800 text-sm sm:text-base'>{section.content}</div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CookiesPage;