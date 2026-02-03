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
        legalNoticeTitle: "Legal Notice – Lorepa",
        websitePresentationTitle: "1. Website presentation",
        owner: "Owner: Lorepa – Sole Proprietorship (Entreprise Individuelle)",
        registeredAddress: "Registered Address: 3910, Rue de Bellechasse, Montreal, Quebec, H1X 1J4",
        quebecBusinessNumber: "Quebec Business Number (NEQ): 2279050480",
        publicationDirector: "Publication Director: Rodrigue Mayukwa",
        websiteCreator: "Website Creator: Rodrigue Mayukwa",
        hostingProvider: "Hosting Provider: [Insert provider name and website here]",
        termsOfUseTitle: "2. Terms of use",
        termsOfUseContent: "By using the Lorepa website, users agree to the general terms of use described here. These terms may be updated at any time, so users are encouraged to review them regularly. Access to the website is generally available at all times. Interruptions may occur for technical maintenance, which Lorepa will try to communicate in advance.",
        servicesDescriptionTitle: "3. Description of services",
        servicesDescriptionContent: "Lorepa is a peer-to-peer trailer rental platform, connecting trailer owners with renters. We aim to provide accurate and up-to-date information. However, Lorepa shall not be held liable for omissions, inaccuracies, or delays in updates, whether from Lorepa or third-party partners.",
        technicalLimitationsTitle: "4. Technical limitations",
        technicalLimitationsContent: "The website uses modern technologies such as HTML5 and JavaScript. Users must access the site using an up-to-date device and browser. Lorepa is not liable for any damages resulting from incompatible or outdated hardware/software.",
        intellectualPropertyTitle: "5. Intellectual property",
        intellectualPropertyContent: "All elements on the site (text, images, logos, code, icons, etc.) are the intellectual property of Lorepa or licensed to Lorepa. Any reproduction or representation without prior written consent is strictly prohibited. Unauthorized use of any content may be considered infringement and prosecuted under applicable intellectual property laws.",
        liabilityLimitationTitle: "6. Limitation of liability",
        liabilityLimitationContent: "Lorepa is not liable for any direct or indirect damages caused to the user's hardware during website access, nor for any bugs, incompatibilities, or losses (market opportunities, data, etc.). Lorepa may moderate or remove any interactive content (e.g., contact forms, messages) deemed illegal or inappropriate under Quebec law.",
        dataProtectionTitle: "7. Personal data protection (Law 25 – Quebec)",
        dataProtectionContent: "Lorepa complies with Law 25 on the protection of personal information. Data is collected only when necessary and with the user's knowledge. Collected data may include IP address, browser information, and referral links. Users have the right to access, correct, or delete their personal data by sending a signed written request along with valid ID to: info@lorepa.ca. No personal data is shared or sold without user consent, except in case of a business transfer.",
        cookiesLegalNoticeTitle: "8. Cookies",
        cookiesLegalNoticeContent: "Cookies may be installed to enhance your browsing experience and analyze traffic. Users may configure their browser to disable cookies. Doing so may limit access to certain features.",
        externalLinksTitle: "9. External links",
        externalLinksContent: "Lorepa may include links to third-party websites. We do not control or endorse the content of these sites and are not responsible for their practices or policies.",
        governingLawTitle: "10. Governing law",
        governingLawContent: "Any dispute related to the use of the Lorepa website is governed by Quebec law. The competent courts of the Province of Quebec shall have exclusive jurisdiction.",
        glossaryTitle: "11. Glossary",
        userGlossary: "User: Any individual browsing or interacting with the Lorepa website.",
        personalDataGlossary: "Personal data: Any information allowing direct or indirect identification of a physical person.",
        financialInformationTitle: "12. Financial information",
        financialInformationContent: "All prices on Lorepa are in Canadian dollars (CAD) and include applicable taxes unless stated otherwise. Fees and commissions are clearly displayed before confirmation of any transaction. Lorepa reserves the right to change its pricing without prior notice.",
        userGeneratedContentTitle: "13. User-generated content",
        userGeneratedContentContent: "Users may publish content (listings, photos, reviews, etc.). By doing so, they confirm ownership of the rights and grant Lorepa a free, non-exclusive, global license to use such content as part of its services. Lorepa may remove any content violating its policies or applicable laws without prior notice.",
        forceMajeureTitle: "14. Force majeure",
        forceMajeureContent: "Lorepa shall not be held liable in case of non-performance due to events beyond its control (natural disaster, war, internet outage, strike, etc.).",
        dataArchivingTitle: "15. Data archiving – proof",
        dataArchivingContent: "Electronic records and backups kept by Lorepa will be considered valid proof of communications, transactions, and interactions between users and Lorepa. These records are stored on reliable and durable media.",
    },
    es: {
        legalNoticeTitle: "Aviso Legal – Lorepa",
        websitePresentationTitle: "1. Presentación del sitio web",
        owner: "Propietario: Lorepa – Empresa Individual",
        registeredAddress: "Dirección Registrada: 3910, Rue de Bellechasse, Montreal, Quebec, H1X 1J4",
        quebecBusinessNumber: "Número de Negocio de Quebec (NEQ): 2279050480",
        publicationDirector: "Director de Publicación: Rodrigue Mayukwa",
        websiteCreator: "Creador del sitio web: Rodrigue Mayukwa",
        hostingProvider: "Proveedor de Alojamiento: [Insertar nombre y sitio web del proveedor aquí]",
        termsOfUseTitle: "2. Términos de uso",
        termsOfUseContent: "Al utilizar el sitio web de Lorepa, los usuarios aceptan los términos de uso generales descritos aquí. Estos términos pueden actualizarse en cualquier momento, por lo que se recomienda a los usuarios revisarlos regularmente. El acceso al sitio web está generalmente disponible en todo momento. Pueden ocurrir interrupciones por mantenimiento técnico, lo cual Lorepa intentará comunicar con antelación.",
        servicesDescriptionTitle: "3. Descripción de los servicios",
        servicesDescriptionContent: "Lorepa es una plataforma de alquiler de remolques entre particulares, que conecta a los propietarios de remolques con los inquilinos. Nuestro objetivo es proporcionar información precisa y actualizada. Sin embargo, Lorepa no será responsable de omisiones, inexactitudes o retrasos en las actualizaciones, ya sean de Lorepa o de socios terceros.",
        technicalLimitationsTitle: "4. Limitaciones técnicas",
        technicalLimitationsContent: "El sitio web utiliza tecnologías modernas como HTML5 y JavaScript. Los usuarios deben acceder al sitio utilizando un dispositivo y navegador actualizados. Lorepa no se hace responsable de ningún daño resultante de hardware/software incompatible o desactualizado.",
        intellectualPropertyTitle: "5. Propiedad intelectual",
        intellectualPropertyContent: "Todos los elementos del sitio (textos, imágenes, logotipos, código, iconos, etc.) son propiedad intelectual de Lorepa o se utilizan bajo licencia. Cualquier reproducción o representación sin el consentimiento previo por escrito está estrictamente prohibida. El uso no autorizado de cualquier contenido puede considerarse una infracción y ser procesado de acuerdo con las leyes de propiedad intelectual aplicables.",
        liabilityLimitationTitle: "6. Limitación de responsabilidad",
        liabilityLimitationContent: "Lorepa no se hace responsable de ningún daño directo o indirecto causado al hardware del usuario durante el acceso al sitio web, ni de ningún error, incompatibilidad o pérdida (oportunidades de mercado, datos, etc.). Lorepa puede moderar o eliminar cualquier contenido interactivo (ej., formularios de contacto, mensajes) considerado ilegal o inapropiado según la ley de Quebec.",
        dataProtectionTitle: "7. Protección de datos personales (Ley 25 – Quebec)",
        dataProtectionContent: "Lorepa cumple con la Ley 25 sobre la protección de la información personal. Los datos se recopilan solo cuando es necesario y con el conocimiento del usuario. Los datos recopilados pueden incluir la dirección IP, información del navegador y enlaces de referencia. Los usuarios tienen derecho a acceder, corregir o eliminar sus datos personales enviando una solicitud escrita firmada junto con una identificación válida a: info@lorepa.ca. No se comparte ni vende ningún dato personal sin el consentimiento del usuario, excepto en caso de una transferencia comercial.",
        cookiesLegalNoticeTitle: "8. Cookies",
        cookiesLegalNoticeContent: "Se pueden instalar cookies para mejorar su experiencia de navegación y analizar el tráfico. Los usuarios pueden configurar su navegador para deshabilitar las cookies. Sin embargo, hacerlo puede limitar el acceso a ciertas funciones.",
        externalLinksTitle: "9. Enlaces externos",
        externalLinksContent: "Lorepa puede incluir enlaces a sitios web de terceros. No controlamos ni respaldamos el contenido de estos sitios y no somos responsables de sus prácticas o políticas.",
        governingLawTitle: "10. Ley aplicable",
        governingLawContent: "Cualquier disputa relacionada con el uso del sitio web de Lorepa se rige por la ley de Quebec. Los tribunales competentes de la provincia de Quebec tendrán jurisdicción exclusiva.",
        glossaryTitle: "11. Glosario",
        userGlossary: "Usuario: Cualquier individuo que navega o interactúa con el sitio web de Lorepa.",
        personalDataGlossary: "Datos personales: Cualquier información que permita la identificación directa o indirecta de una persona física.",
        financialInformationTitle: "12. Información financiera",
        financialInformationContent: "Todos los precios en Lorepa están en dólares canadienses (CAD) e incluyen los impuestos aplicables, a menos que se indique lo contrario. Las tarifas y comisiones se muestran claramente antes de la confirmación de cualquier transacción. Lorepa se reserva el derecho de cambiar sus precios sin previo aviso.",
        userGeneratedContentTitle: "13. Contenido generado por el usuario",
        userGeneratedContentContent: "Los usuarios pueden publicar contenido (listados, fotos, reseñas, etc.). Al hacerlo, confirman la titularidad de los derechos y otorgan a Lorepa una licencia gratuita, no exclusiva y global para utilizar dicho contenido como parte de sus servicios. Lorepa puede eliminar cualquier contenido que viole sus políticas o las leyes aplicables sin previo aviso.",
        forceMajeureTitle: "14. Fuerza mayor",
        forceMajeureContent: "Lorepa no será responsable en caso de incumplimiento debido a eventos fuera de su control (desastre natural, guerra, interrupción de internet, huelga, etc.).",
        dataArchivingTitle: "15. Archivo de datos – prueba",
        dataArchivingContent: "Los registros electrónicos y las copias de seguridad mantenidas por Lorepa se considerarán prueba válida de las comunicaciones, transacciones e interacciones entre los usuarios y Lorepa. Estos registros se almacenan en medios fiables y duraderos.",
    },
    cn: {
        legalNoticeTitle: "法律声明 – Lorepa",
        websitePresentationTitle: "1. 网站介绍",
        owner: "所有者：Lorepa – 独资企业 (Entreprise Individuelle)",
        registeredAddress: "注册地址：3910, Rue de Bellechasse, Montreal, Quebec, H1X 1J4",
        quebecBusinessNumber: "魁北克商业编号 (NEQ)：2279050480",
        publicationDirector: "出版负责人：Rodrigue Mayukwa",
        websiteCreator: "网站创建者：Rodrigue Mayukwa",
        hostingProvider: "托管服务提供商：[在此插入提供商名称和网站]",
        termsOfUseTitle: "2. 使用条款",
        termsOfUseContent: "使用 Lorepa 网站即表示用户同意此处描述的通用使用条款。这些条款可能随时更新，因此鼓励用户定期查看。网站通常全天候可用。技术维护可能会导致中断，Lorepa 将尝试提前通知。",
        servicesDescriptionTitle: "3. 服务说明",
        servicesDescriptionContent: "Lorepa 是一个点对点拖车租赁平台，连接拖车所有者和租户。我们旨在提供准确和最新的信息。然而，Lorepa 不对因 Lorepa 或第三方合作伙伴造成的遗漏、不准确或更新延迟负责。",
        technicalLimitationsTitle: "4. 技术限制",
        technicalLimitationsContent: "本网站使用 HTML5 和 JavaScript 等现代技术。用户必须使用最新的设备和浏览器访问本网站。Lorepa 对因不兼容或过时的硬件/软件造成的任何损害不承担责任。",
        intellectualPropertyTitle: "5. 知识产权",
        intellectualPropertyContent: "网站上的所有元素（文本、图像、徽标、代码、图标等）均为 Lorepa 的知识产权或已获得 Lorepa 的许可。未经事先书面同意，严禁任何复制或再现。任何未经授权的内容使用都可能被视为侵权，并根据适用的知识产权法律进行起诉。",
        liabilityLimitationTitle: "6. 责任限制",
        liabilityLimitationContent: "Lorepa 对用户在使用网站时造成的任何直接或间接损害，以及任何错误、不兼容或损失（市场机会、数据等）不承担责任。Lorepa 可以根据魁北克法律，对任何被认为非法或不当的交互式内容（例如，联系表格、消息）进行审核或删除。",
        dataProtectionTitle: "7. 个人数据保护（魁北克省第 25 号法律）",
        dataProtectionContent: "Lorepa 遵守关于个人信息保护的第 25 号法律。数据仅在必要时并在用户知情的情况下收集。收集的数据可能包括 IP 地址、浏览器信息和推荐链接。用户有权通过向以下地址发送带签名的书面请求和有效身份证明，来访问、更正或删除其个人数据：info@lorepa.ca。未经用户同意，除业务转让情况外，不共享或出售任何个人数据。",
        cookiesLegalNoticeTitle: "8. Cookie",
        cookiesLegalNoticeContent: "可能会安装 Cookie 以改善您的浏览体验和分析流量。用户可以配置浏览器禁用 Cookie。但是，这样做可能会限制某些网站功能。",
        externalLinksTitle: "9. 外部链接",
        externalLinksContent: "Lorepa 可能包含指向第三方网站的链接。我们不控制或认可这些网站的内容，也不对其做法或政策负责。",
        governingLawTitle: "10. 管辖法律",
        governingLawContent: "任何与 Lorepa 网站使用相关的争议均受魁北克法律管辖。魁北克省的管辖法院拥有专属管辖权。",
        glossaryTitle: "11. 词汇表",
        userGlossary: "用户：任何浏览或与 Lorepa 网站交互的个人。",
        personalDataGlossary: "个人数据：任何允许直接或间接识别自然人的信息。",
        financialInformationTitle: "12. 财务信息",
        financialInformationContent: "Lorepa 上的所有价格均以加拿大元 (CAD) 计价，并包含适用税费，除非另有说明。费用和佣金在任何交易确认前会清晰显示。Lorepa 保留更改价格的权利，恕不另行通知。",
        userGeneratedContentTitle: "13. 用户生成内容",
        userGeneratedContentContent: "用户可以发布内容（列表、照片、评论等）。通过这样做，他们确认拥有相关权利，并授予 Lorepa 免费、非独家、全球性许可，以将其内容作为其服务的一部分使用。Lorepa 可以删除任何违反其政策或适用法律的内容，恕不另行通知。",
        forceMajeureTitle: "14. 不可抗力",
        forceMajeureContent: "Lorepa 不对因其无法控制的事件（自然灾害、战争、互联网中断、罢工等）造成的无法履行义务承担责任。",
        dataArchivingTitle: "15. 数据归档 – 证据",
        dataArchivingContent: "Lorepa 保留的电子记录和备份将被视为用户与 Lorepa 之间通信、交易和交互的有效证据。这些记录存储在可靠和耐用的介质上。",
    },
    fr: {
        legalNoticeTitle: "Mentions Légales – Lorepa",
        websitePresentationTitle: "1. Présentation du site internet",
        owner: "Propriétaire : Lorepa – Entreprise Individuelle",
        registeredAddress: "Adresse d'immatriculation : 3910, Rue de Bellechasse, Montréal, Québec, H1X 1J4",
        quebecBusinessNumber: "Numéro d'entreprise du Québec (NEQ) : 2279050480",
        publicationDirector: "Directeur de la publication : Rodrigue Mayukwa",
        websiteCreator: "Créateur du site internet : Rodrigue Mayukwa",
        hostingProvider: "Hébergeur : [Insérer le nom et le site de l'hébergeur ici]",
        termsOfUseTitle: "2. Conditions générales d’utilisation",
        termsOfUseContent: "L’utilisation du site Lorepa implique l’acceptation pleine et entière des conditions générales d’utilisation ci-après décrites. Ces conditions d’utilisation sont susceptibles d’être modifiées ou complétées à tout moment, les utilisateurs sont donc invités à les consulter de manière régulière. Ce site est normalement accessible à tout moment. Une interruption pour raison de maintenance technique peut être toutefois décidée par Lorepa, qui s’efforcera alors de communiquer préalablement aux utilisateurs les dates et heures de l’intervention.",
        servicesDescriptionTitle: "3. Description des services fournis",
        servicesDescriptionContent: "Le site Lorepa est une plateforme de location de remorques entre particuliers, mettant en relation les propriétaires et les locataires de remorques. Lorepa s’efforce de fournir sur le site des informations aussi précises que possible. Toutefois, il ne pourra être tenu responsable des omissions, des inexactitudes et des carences dans la mise à jour, qu’elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.",
        technicalLimitationsTitle: "4. Limitations techniques",
        technicalLimitationsContent: "Le site utilise les technologies modernes comme le HTML5 et le JavaScript. L'utilisateur doit s'équiper d’un matériel récent et d’un navigateur à jour pour accéder au site. Lorepa ne pourra être tenu responsable de dommages matériels liés à l’utilisation du site. De plus, l’utilisateur du site s’engage à y accéder en utilisant un matériel ne contenant pas de virus et avec un navigateur de dernière génération mis à jour.",
        intellectualPropertyTitle: "5. Propriété intellectuelle",
        intellectualPropertyContent: "Tous les éléments du site (textes, images, logos, code, icônes, etc.) sont la propriété exclusive de Lorepa ou font l’objet d’une licence. Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de Lorepa. Toute exploitation non autorisée du site ou de l’un quelconque de ces éléments sera considérée comme constitutive d’une contrefaçon et poursuivie conformément aux dispositions des lois applicables sur la propriété intellectuelle.",
        liabilityLimitationTitle: "6. Limitations de responsabilité",
        liabilityLimitationContent: "Lorepa ne pourra être tenu responsable des dommages directs et indirects causés au matériel de l’utilisateur, lors de l’accès au site Lorepa, et résultant soit de l’utilisation d’un matériel incompatible, soit de l’apparition d’un bug ou d’une incompatibilité. Lorepa ne pourra également être tenu responsable des dommages indirects (tels par exemple qu’une perte de marché ou perte d’une chance) consécutifs à l’utilisation du site Lorepa. Des espaces interactifs sont à la disposition des utilisateurs. Lorepa se réserve le droit de supprimer, sans mise en demeure préalable, tout contenu déposé dans cet espace qui contreviendrait à la législation applicable au Québec, en particulier aux dispositions relatives à la protection des données.",
        dataProtectionTitle: "7. Protection des données personnelles (Loi 25 – Québec)",
        dataProtectionContent: "Lorepa se conforme à la loi 25 sur la protection des renseignements personnels. Les données sont collectées uniquement lorsque cela est nécessaire et en connaissance de cause de l'utilisateur. Les données recueillies peuvent inclure l'adresse IP, les informations du navigateur et les liens de renvoi. L'utilisateur dispose d’un droit d’accès, de rectification et de suppression des données personnelles le concernant, en effectuant sa demande écrite et signée, accompagnée d’une pièce d’identité valide, à l'adresse courriel : info@lorepa.ca. Aucune donnée personnelle n'est publiée, échangée, transférée, cédée ou vendue sur un support quelconque à des tiers à l'insu de l’utilisateur, sauf en cas de rachat de Lorepa et de ses droits.",
        cookiesLegalNoticeTitle: "8. Cookies",
        cookiesLegalNoticeContent: "Des cookies peuvent être installés sur l'ordinateur de l'utilisateur pour améliorer la navigation et analyser le trafic. L'utilisateur peut toutefois configurer son navigateur pour refuser l'installation de cookies, ce qui pourrait limiter l’accès à certaines fonctionnalités du site.",
        externalLinksTitle: "9. Liens hypertextes",
        externalLinksContent: "Le site Lorepa peut contenir des liens hypertextes vers d’autres sites. Nous n'exerçons aucun contrôle sur le contenu de ces sites et déclinons toute responsabilité quant à leurs pratiques ou politiques. L'inclusion de ces liens ne signifie pas que nous approuvons ces sites.",
        governingLawTitle: "10. Droit applicable et attribution de juridiction",
        governingLawContent: "Tout litige en relation avec l’utilisation du site Lorepa est soumis au droit québécois. Les tribunaux compétents de la Province de Québec sont les seuls juridictions exclusives pour résoudre les litiges.",
        glossaryTitle: "11. Lexique",
        userGlossary: "Utilisateur : Internaute se connectant, utilisant le site susnommé.",
        personalDataGlossary: "Données personnelles : toute information permettant l’identification directe ou indirecte d’une personne physique.",
        financialInformationTitle: "12. Informations financières",
        financialInformationContent: "Tous les prix affichés sur Lorepa sont en dollars canadiens (CAD) et incluent les taxes applicables, sauf indication contraire. Les frais et commissions sont clairement affichés avant la confirmation de toute transaction. Lorepa se réserve le droit de modifier ses tarifs sans préavis.",
        userGeneratedContentTitle: "13. Contenu généré par l’utilisateur",
        userGeneratedContentContent: "Les utilisateurs peuvent publier du contenu (annonces, photos, avis, etc.). En le faisant, ils confirment détenir les droits et accordent à Lorepa une licence gratuite, non exclusive et mondiale d'utiliser ce contenu dans le cadre de ses services. Lorepa peut supprimer tout contenu violant ses politiques ou les lois applicables sans préavis.",
        forceMajeureTitle: "14. Force majeure",
        forceMajeureContent: "Lorepa ne pourra être tenu pour responsable en cas de non-exécution due à des événements échappant à son contrôle (catastrophe naturelle, guerre, panne d’internet, grève, etc.).",
        dataArchivingTitle: "15. Archivage des données – preuve",
        dataArchivingContent: "Les registres électroniques et les sauvegardes conservés par Lorepa seront considérés comme des preuves valables des communications, transactions et interactions entre les utilisateurs et Lorepa. Ces registres sont stockés sur des supports fiables et durables.",
    },
};

const LegalPage = () => {
    const [translations, setTranslations] = useState(() => {
        const storedLang = localStorage.getItem('lang');
        return privacyPolicyTranslations[storedLang] || privacyPolicyTranslations.fr; // Default to English
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
            title: translations.legalNoticeTitle,
            content: (
                <>
                    <h3 className='font-semibold mt-2'>{translations.websitePresentationTitle}</h3>
                    <ul className='list-disc list-inside space-y-1 ml-4'>
                        <li>{translations.owner}</li>
                        <li>{translations.registeredAddress}</li>
                        <li>{translations.quebecBusinessNumber}</li>
                        <li>{translations.publicationDirector}</li>
                        <li>{translations.websiteCreator}</li>
                        <li>{translations.hostingProvider}</li>
                    </ul>
                    <h3 className='font-semibold mt-2'>{translations.termsOfUseTitle}</h3>
                    <p>{translations.termsOfUseContent}</p>
                    <h3 className='font-semibold mt-2'>{translations.servicesDescriptionTitle}</h3>
                    <p>{translations.servicesDescriptionContent}</p>
                    <h3 className='font-semibold mt-2'>{translations.technicalLimitationsTitle}</h3>
                    <p>{translations.technicalLimitationsContent}</p>
                    <h3 className='font-semibold mt-2'>{translations.intellectualPropertyTitle}</h3>
                    <p>{translations.intellectualPropertyContent}</p>
                    <h3 className='font-semibold mt-2'>{translations.liabilityLimitationTitle}</h3>
                    <p>{translations.liabilityLimitationContent}</p>
                    <h3 className='font-semibold mt-2'>{translations.dataProtectionTitle}</h3>
                    <p>{translations.dataProtectionContent}</p>
                    <h3 className='font-semibold mt-2'>{translations.cookiesLegalNoticeTitle}</h3>
                    <p>{translations.cookiesLegalNoticeContent}</p>
                    <h3 className='font-semibold mt-2'>{translations.externalLinksTitle}</h3>
                    <p>{translations.externalLinksContent}</p>
                    <h3 className='font-semibold mt-2'>{translations.governingLawTitle}</h3>
                    <p>{translations.governingLawContent}</p>
                    <h3 className='font-semibold mt-2'>{translations.glossaryTitle}</h3>
                    <ul className='list-disc list-inside space-y-1 ml-4'>
                        <li>{translations.userGlossary}</li>
                        <li>{translations.personalDataGlossary}</li>
                    </ul>
                    <h3 className='font-semibold mt-2'>{translations.financialInformationTitle}</h3>
                    <p>{translations.financialInformationContent}</p>
                    <h3 className='font-semibold mt-2'>{translations.userGeneratedContentTitle}</h3>
                    <p>{translations.userGeneratedContentContent}</p>
                    <h3 className='font-semibold mt-2'>{translations.forceMajeureTitle}</h3>
                    <p>{translations.forceMajeureContent}</p>
                    <h3 className='font-semibold mt-2'>{translations.dataArchivingTitle}</h3>
                    <p>{translations.dataArchivingContent}</p>
                </>
            ),
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
                    {translations.legalNoticeTitle}
                </motion.h1>

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

export default LegalPage;