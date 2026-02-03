import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

// Define your sectionVariant outside the component if it doesn't depend on props/state
const sectionVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

// Define your translations object here or import it from a separate file
const privacyPolicyTranslations = {
  en: {
    // English content
    privacyPolicyTitle: "Privacy Policy",
    preambleTitle: "Preamble",
    preambleContent: `At Lorepa, protecting your personal information is a top priority. This privacy policy is intended to clearly and transparently explain how we collect, use, share, retain, and protect your personal data when you use our website or mobile application. This policy applies to all users of our services, including renters, owners, and visitors. Lorepa is committed to complying with applicable privacy laws, including: The Act respecting the protection of personal information in the private sector (Quebec); The General Data Protection Regulation (GDPR), where applicable to users located in the European Union.`,
    definitionTitle: "1. Definition of “Personal Information”",
    definitionContent: `Personal information refers to any data about an identifiable individual, including but not limited to: Name, address, email address, phone number, photo, driver’s license, geolocation, banking data, or any other document that directly or indirectly identifies a person.`,
    consentTitle: "2. Consent",
    consentContent: `By accessing our services, you expressly consent to Lorepa collecting, using, storing, and sharing your personal information in accordance with this policy. You may withdraw your consent at any time, unless Lorepa is legally required to retain certain information. To withdraw your consent, please contact us (see Section 12).`,
    collectionTitle: "3. Collection of Personal Information",
    collectionIntro: "We collect personal information when you:",
    collectionList1: "Create an account (as a renter or owner);",
    collectionList2: "Complete or update your profile;",
    collectionList3: "Upload mandatory documents (driver’s license, proof of insurance FAQ27, vehicle/trailer registration);",
    collectionList4: "Post or book a trailer;",
    collectionList5: "Communicate with another user or our support team;",
    collectionList6: "Leave a review or rating;",
    collectionList7: "Participate in a survey, contest, or promotion;",
    collectionList8: "Browse our website or app (IP address, device type, operating system, etc.).",
    categoriesIntro: "Categories of information collected:",
    categoriesList1: "Identity: First name, last name, date of birth, profile photo;",
    categoriesList2: "Contact details: Mailing address, email address, phone number;",
    categoriesList3: "Documents: Driver’s license, proof of auto insurance, vehicle/trailer registration;",
    categoriesList4: "Payments: Data required for transactions via Stripe;",
    categoriesList5: "Geolocation: If you explicitly consent;",
    categoriesList6: "User-generated content: Reviews, comments, trailer photos, inspection images.",
    useTitle: "4. Use of Personal Information",
    useContent: `We use your personal information to: Provide and manage access to our rental platform; Verify your identity and validate uploaded documents; Enable communication between renters and owners; Generate and send rental agreements, including required photos; Manage payments, deposits, refunds, and disputes; Prevent fraud and ensure user safety; Respond to your support requests; Improve our services and user experience; Comply with Lorepa’s legal and regulatory obligations.`,
    sharingTitle: "5. Sharing and Disclosure of Information",
    sharingIntro: "We do not sell or rent your personal information.",
    sharingDisclaimer: "However, we may share it with:",
    sharingList1: "Service providers essential to platform operations (e.g., Stripe, AWS, Firebase);",
    sharingList2: "Authorities when required by law, legal proceedings, or to protect our rights;",
    sharingList3: "Other users, but only the information required to complete a transaction (e.g., first name, initial of last name, profile photo, phone number, trailer location).",
    sharingContract: "We contractually require all third parties to adhere to strict data protection standards.",
    retentionTitle: "6. Data Retention",
    retentionContent: `We retain your personal information as long as necessary to fulfill the purposes outlined in this policy and to comply with our legal and contractual obligations. Once no longer needed, your data is securely deleted or anonymized.`,
    securityTitle: "7. Security Measures",
    securityContent: `Lorepa implements robust measures to protect your data: SSL/TLS encryption for data transmission; Secure servers hosted by reputable providers (e.g., AWS, Google Cloud); Restricted access to data for authorized staff and service providers only; Strict internal cybersecurity procedures. However, no method of transmission or storage is entirely secure. Lorepa cannot guarantee absolute security.`,
    rightsTitle: "8. Your Rights",
    rightsIntro: "Subject to applicable law, you have the following rights:",
    rightsList1: "Access: View the personal data we hold about you;",
    rightsList2: "Rectification: Correct or update your information;",
    rightsList3: "Consent withdrawal: Withdraw your consent for certain processing;",
    rightsList4: "Deletion: Request the deletion of your data, unless legally required to retain it;",
    rightsList5: "Portability: Receive your data in a structured, machine-readable format;",
    rightsList6: "Objection/Restriction: Restrict or object to specific uses of your data.",
    rightsContact: "To exercise your rights, please contact us (see Section 12).",
    cookiesTitle: "9. Cookies",
    cookiesIntro: "We use cookies to:",
    cookiesList1: "Improve your Browse experience and personalize content;",
    cookiesList2: "Analyze traffic on our website;",
    cookiesList3: "Remember your preferences.",
    cookiesOutro: "You may configure your browser to block certain cookies. However, doing so may limit some site features.",
    thirdPartyTitle: "10. Third-Party Services",
    thirdPartyContent: `Lorepa may include links to third-party services (e.g., Stripe, social media). We are not responsible for their privacy practices and encourage you to consult their respective policies.`,
    updatesTitle: "11. Policy Updates",
    updatesContent: `Lorepa may update this privacy policy at any time. Any significant changes will be clearly communicated on our website or by email. The date of the most recent update is shown at the top of this document.`,
    contactTitle: "12. Contact Us",
    contactIntro: "If you have any questions, concerns, or requests regarding your personal data, or if you wish to exercise your rights, please contact us at:",
    contactDPO: "Lorepa – Data Protection Officer",
    contactEmail: "📧 Email: mayukwa.rodrigue@gmail.com",
    contactAddress: "📬 Mailing address: 3910, Rue de Bellechasse, Montréal, H1X 1J4, Québec, Canada",
    legalNoticeTitle: "Legal Notice – Lorepa",
    websitePresentationTitle: "1. Website presentation",
    owner: "Owner: Lorepa – Sole Proprietorship (Entreprise Individuelle)",
    registeredAddress: "Registered Address: 3910,Rue de Bellechasse, Montreal, Quebec, H1X 1J4",
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
    cookiesLegalNoticeContent: "Cookies may be installed to enhance Browse and analyze traffic. Users may configure their browser to disable cookies. Doing so may limit access to certain features.",
    externalLinksTitle: "9. External links",
    externalLinksContent: "Lorepa may include links to third-party websites. We do not control or endorse the content of these sites and are not responsible for their practices or policies.",
    governingLawTitle: "10. Governing law",
    governingLawContent: "Any dispute related to the use of the Lorepa website is governed by Quebec law. The competent courts of the Province of Quebec shall have exclusive jurisdiction.",
    glossaryTitle: "11. Glossary",
    userGlossary: "User: Any individual Browse or interacting with the Lorepa website.",
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
    // Spanish content
    privacyPolicyTitle: "Política de Privacidad",
    preambleTitle: "Preámbulo",
    preambleContent: `En Lorepa, proteger su información personal es una prioridad. Esta política de privacidad tiene como objetivo explicar de manera clara y transparente cómo recopilamos, usamos, compartimos, conservamos y protegemos sus datos personales cuando utiliza nuestro sitio web o aplicación móvil. Esta política se aplica a todos los usuarios de nuestros servicios, incluidos inquilinos, propietarios y visitantes. Lorepa se compromete a cumplir con las leyes de privacidad aplicables, que incluyen: La Ley de protección de información personal en el sector privado (Quebec); El Reglamento General de Protección de Datos (RGPD), cuando sea aplicable a usuarios ubicados en la Unión Europea.`,
    definitionTitle: "1. Definición de “Información Personal”",
    definitionContent: `Información personal se refiere a cualquier dato sobre un individuo identificable, incluyendo, entre otros: Nombre, dirección, dirección de correo electrónico, número de teléfono, foto, licencia de conducir, geolocalización, datos bancarios o cualquier otro documento que identifique directa o indirectamente a una persona.`,
    consentTitle: "2. Consentimiento",
    consentContent: `Al acceder a nuestros servicios, usted consiente expresamente que Lorepa recopile, use, almacene y comparta su información personal de acuerdo con esta política. Puede retirar su consentimiento en cualquier momento, a menos que Lorepa esté legalmente obligada a retener cierta información. Para retirar su consentimiento, contáctenos (consulte la Sección 12).`,
    collectionTitle: "3. Recopilación de Información Personal",
    collectionIntro: "Recopilamos información personal cuando usted:",
    collectionList1: "Crea una cuenta (como inquilino o propietario);",
    collectionList2: "Completa o actualiza su perfil;",
    collectionList3: "Sube documentos obligatorios (licencia de conducir, comprobante de seguro FAQ27, registro de vehículo/remolque);",
    collectionList4: "Publica o reserva un remolque;",
    collectionList5: "Se comunica con otro usuario o con nuestro equipo de soporte;",
    collectionList6: "Deja una reseña o calificación;",
    collectionList7: "Participa en una encuesta, concurso o promoción;",
    collectionList8: "Navega por nuestro sitio web o aplicación (dirección IP, tipo de dispositivo, sistema operativo, etc.).",
    categoriesIntro: "Categorías de información recopilada:",
    categoriesList1: "Identidad: Nombre, apellido, fecha de nacimiento, foto de perfil;",
    categoriesList2: "Datos de contacto: Dirección postal, dirección de correo electrónico, número de teléfono;",
    categoriesList3: "Documentos: Licencia de conducir, comprobante de seguro de automóvil, registro de vehículo/remolque;",
    categoriesList4: "Pagos: Datos requeridos para transacciones a través de Stripe;",
    categoriesList5: "Geolocalización: Si usted lo consiente explícitamente;",
    categoriesList6: "Contenido generado por el usuario: Reseñas, comentarios, fotos de remolques, imágenes de inspección.",
    useTitle: "4. Uso de la Información Personal",
    useContent: `Usamos su información personal para: Proporcionar y gestionar el acceso a nuestra plataforma de alquiler; Verificar su identidad y validar los documentos cargados; Habilitar la comunicación entre inquilinos y propietarios; Generar y enviar acuerdos de alquiler, incluyendo las fotos requeridas; Gestionar pagos, depósitos, reembolsos y disputas; Prevenir el fraude y garantizar la seguridad del usuario; Responder a sus solicitudes de soporte; Mejorar nuestros servicios y la experiencia del usuario; Cumplir con las obligaciones legales y regulatorias de Lorepa.`,
    sharingTitle: "5. Compartir y Divulgar Información",
    sharingIntro: "No vendemos ni alquilamos su información personal.",
    sharingDisclaimer: "Sin embargo, podemos compartirla con:",
    sharingList1: "Proveedores de servicios esenciales para las operaciones de la plataforma (ej., Stripe, AWS, Firebase);",
    sharingList2: "Autoridades cuando sea requerido por ley, procesos legales o para proteger nuestros derechos;",
    sharingList3: "Otros usuarios, pero solo la información necesaria para completar una transacción (ej., nombre, inicial del apellido, foto de perfil, número de teléfono, ubicación del remolque).",
    sharingContract: "Exigimos contractualmente a todos los terceros que cumplan con estrictos estándares de protección de datos.",
    retentionTitle: "6. Retención de Datos",
    retentionContent: `Retenemos su información personal el tiempo que sea necesario para cumplir con los fines descritos en esta política y para cumplir con nuestras obligaciones legales y contractuales. Una vez que ya no sean necesarios, sus datos se eliminan de forma segura o se anonimizan.`,
    securityTitle: "7. Medidas de Seguridad",
    securityContent: `Lorepa implementa medidas robustas para proteger sus datos: Cifrado SSL/TLS para la transmisión de datos; Servidores seguros alojados por proveedores de confianza (ej., AWS, Google Cloud); Acceso restringido a los datos solo para personal autorizado y proveedores de servicios; Estrictos procedimientos internos de ciberseguridad. Sin embargo, ningún método de transmisión o almacenamiento es completamente seguro. Lorepa no puede garantizar una seguridad absoluta.`,
    rightsTitle: "8. Sus Derechos",
    rightsIntro: "Sujeto a la ley aplicable, usted tiene los siguientes derechos:",
    rightsList1: "Acceso: Ver los datos personales que tenemos sobre usted;",
    rightsList2: "Rectificación: Corregir o actualizar su información;",
    rightsList3: "Retiro de consentimiento: Retirar su consentimiento para cierto procesamiento;",
    rightsList4: "Eliminación: Solicitar la eliminación de sus datos, a menos que estemos legalmente obligados a retenerlos;",
    rightsList5: "Portabilidad: Recibir sus datos en un formato estructurado y legible por máquina;",
    rightsList6: "Oposición/Restricción: Restringir u oponerse a usos específicos de sus datos.",
    rightsContact: "Para ejercer sus derechos, contáctenos (consulte la Sección 12).",
    cookiesTitle: "9. Cookies",
    cookiesIntro: "Utilizamos cookies para:",
    cookiesList1: "Mejorar su experiencia de navegación y personalizar contenido;",
    cookiesList2: "Analizar el tráfico en nuestro sitio web;",
    cookiesList3: "Recordar sus preferencias.",
    cookiesOutro: "Puede configurar su navegador para bloquear ciertas cookies. Sin embargo, hacerlo puede limitar algunas funciones del sitio.",
    thirdPartyTitle: "10. Servicios de Terceros",
    thirdPartyContent: `Lorepa puede incluir enlaces a servicios de terceros (ej., Stripe, redes sociales). No somos responsables de sus prácticas de privacidad y le animamos a consultar sus respectivas políticas.`,
    updatesTitle: "11. Actualizaciones de la Política",
    updatesContent: `Lorepa puede actualizar esta política de privacidad en cualquier momento. Cualquier cambio significativo se comunicará claramente en nuestro sitio web o por correo electrónico. La fecha de la actualización más reciente se muestra en la parte superior de este documento.`,
    contactTitle: "12. Contáctenos",
    contactIntro: "Si tiene alguna pregunta, inquietud o solicitud con respecto a sus datos personales, o si desea ejercer sus derechos, contáctenos en:",
    contactDPO: "Lorepa – Oficial de Protección de Datos",
    contactEmail: "📧 Correo electrónico: mayukwa.rodrigue@gmail.com",
    contactAddress: "📬 Dirección postal: 3910, Rue de Bellechasse, Montréal, H1X 1J4, Québec, Canadá",
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
    cookiesLegalNoticeContent: "Se pueden instalar cookies para mejorar la navegación y analizar el tráfico. Los usuarios pueden configurar su navegador para deshabilitar las cookies. Sin embargo, hacerlo puede limitar el acceso a ciertas funciones.",
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
    userGeneratedContentContent: "Los usuarios pueden publicar contenido (listados, fotos, reseñas, etc.). Al hacerlo, confirman la titularidad de los derechos y otorgan a Lorepa una licencia gratuita, no exclusiva y global para utilizar dicho contenido作为其服务的一部分。Lorepa 可以删除任何违反其政策或适用法律的内容，恕不另行通知。",
    forceMajeureTitle: "14. Fuerza mayor",
    forceMajeureContent: "Lorepa no será responsable en caso de incumplimiento debido a eventos fuera de su control (desastre natural, guerra, interrupción de internet, huelga, etc.).",
    dataArchivingTitle: "15. Archivo de datos – prueba",
    dataArchivingContent: "Los registros electrónicos y las copias de seguridad mantenidas por Lorepa se considerarán prueba válida de las comunicaciones, transacciones e interacciones entre los usuarios y Lorepa. Estos registros se almacenan en medios fiables y duraderos.",
  },
  cn: {
    // Chinese content
    privacyPolicyTitle: "隐私政策",
    preambleTitle: "前言",
    preambleContent: `在 Lorepa，保护您的个人信息是我们的首要任务。本隐私政策旨在清晰透明地解释当您使用我们的网站或移动应用程序时，我们如何收集、使用、共享、保留和保护您的个人数据。本政策适用于我们服务的所有用户，包括租户、所有者和访客。Lorepa 致力于遵守适用的隐私法律，包括：魁北克省的《私人部门个人信息保护法》；以及在适用于欧盟用户的情况下，《通用数据保护条例》(GDPR)。`,
    definitionTitle: "1. “个人信息”的定义",
    definitionContent: `个人信息是指任何关于可识别个人的数据，包括但不限于：姓名、地址、电子邮件地址、电话号码、照片、驾驶执照、地理位置、银行数据，或任何直接或间接识别个人的其他文件。`,
    consentTitle: "2. 同意",
    consentContent: `通过访问我们的服务，您明确同意 Lorepa 根据本政策收集、使用、存储和共享您的个人信息。您可以随时撤回您的同意，除非 Lorepa 法律要求保留某些信息。要撤回您的同意，请联系我们（参见第 12 节）。`,
    collectionTitle: "3. 个人信息的收集",
    collectionIntro: "我们会在您以下情况时收集个人信息：",
    collectionList1: "创建账户（作为租户或所有者）；",
    collectionList2: "完成或更新您的个人资料；",
    collectionList3: "上传强制性文件（驾驶执照、保险证明 FAQ27、车辆/拖车注册）；",
    collectionList4: "发布或预订拖车；",
    collectionList5: "与另一位用户或我们的支持团队沟通；",
    collectionList6: "留下评论或评分；",
    collectionList7: "参与调查、竞赛或促销活动；",
    collectionList8: "浏览我们的网站或应用程序（IP 地址、设备类型、操作系统等）。",
    categoriesIntro: "收集的信息类别：",
    categoriesList1: "身份：名字、姓氏、出生日期、个人资料照片；",
    categoriesList2: "联系方式：邮寄地址、电子邮件地址、电话号码；",
    categoriesList3: "文件：驾驶执照、汽车保险证明、车辆/拖车注册；",
    categoriesList4: "支付：通过 Stripe 交易所需的数据；",
    categoriesList5: "地理位置：如果您明确同意；",
    categoriesList6: "用户生成内容：评论、意见、拖车照片、检查图像。",
    useTitle: "4. 个人信息的使用",
    useContent: `我们使用您的个人信息来：提供和管理我们租赁平台的访问；验证您的身份并验证上传的文档；实现租户和所有者之间的沟通；生成和发送租赁协议，包括所需的照片；管理支付、押金、退款和争议；防止欺诈并确保用户安全；响应您的支持请求；改进我们的服务和用户体验；遵守 Lorepa 的法律和监管义务。`,
    sharingTitle: "5. 信息的共享和披露",
    sharingIntro: "我们不会出售或出租您的个人信息。",
    sharingDisclaimer: "但是，我们可能会与以下方共享：",
    sharingList1: "对平台运营至关重要的服务提供商（例如，Stripe、AWS、Firebase）；",
    sharingList2: "法律、法律程序要求或为保护我们权利时的当局；",
    sharingList3: "其他用户，但仅限于完成交易所需的信息（例如，名字、姓氏首字母、个人资料照片、电话号码、拖车位置）。",
    sharingContract: "我们合同要求所有第三方遵守严格的数据保护标准。",
    retentionTitle: "6. 数据保留",
    retentionContent: `我们会在履行本政策中概述的目的以及遵守我们的法律和合同义务所需的期限内保留您的个人信息。一旦不再需要，您的数据将被安全删除或匿名化。`,
    securityTitle: "7. 安全措施",
    securityContent: `Lorepa 实施了强大的数据保护措施：SSL/TLS 加密用于数据传输；由信誉良好的提供商（例如，AWS、Google Cloud）托管的安全服务器；仅授权员工和服务提供商才能访问数据；严格的内部网络安全程序。但是，没有任何传输或存储方法是完全安全的。Lorepa 无法保证绝对安全。`,
    rightsTitle: "8. 您的权利",
    rightsIntro: "根据适用法律，您拥有以下权利：",
    rightsList1: "访问：查看我们持有的关于您的个人数据；",
    rightsList2: "纠正：更正或更新您的信息；",
    rightsList3: "撤回同意：撤回您对某些处理的同意；",
    rightsList4: "删除：请求删除您的数据，除非法律要求我们保留；",
    rightsList5: "可移植性：以结构化、机器可读的格式接收您的数据；",
    rightsList6: "反对/限制：限制或反对您数据的特定使用。",
    rightsContact: "要行使您的权利，请联系我们（参见第 12 节）。",
    cookiesTitle: "9. Cookies",
    cookiesIntro: "我们使用 Cookie 来：",
    cookiesList1: "改善您的浏览体验并个性化内容；",
    cookiesList2: "分析我们网站的流量；",
    cookiesList3: "记住您的偏好。",
    cookiesOutro: "您可以配置您的浏览器以阻止某些 Cookie。但是，这样做可能会限制某些网站功能。",
    thirdPartyTitle: "10. 第三方服务",
    thirdPartyContent: `Lorepa 可能包含指向第三方服务（例如，Stripe、社交媒体）的链接。我们对其隐私惯例不承担任何责任，并鼓励您查阅其各自的政策。`,
    updatesTitle: "11. 政策更新",
    updatesContent: `Lorepa 可能随时更新本隐私政策。任何重大更改将会在我们的网站上或通过电子邮件明确传达。最新更新的日期显示在本文档的顶部。`,
    contactTitle: "12. 联系我们",
    contactIntro: "如果您对您的个人数据有任何疑问、疑虑或请求，或者您希望行使您的权利，请通过以下方式联系我们：",
    contactDPO: "Lorepa – 数据保护官",
    contactEmail: "📧 电子邮件: mayukwa.rodrigue@gmail.com",
    contactAddress: "📬 邮寄地址: 3910, Rue de Bellechasse, Montréal, H1X 1J4, Québec, Canada",
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
    cookiesLegalNoticeContent: "可能会安装 Cookie 以改善浏览体验和分析流量。用户可以配置浏览器禁用 Cookie。但是，这样做可能会限制某些网站功能。",
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
    // French content
    privacyPolicyTitle: "Politique de confidentialité",
    preambleTitle: "Préambule",
    preambleContent: `Chez Lorepa, la protection de vos informations personnelles est une priorité absolue. Cette politique de confidentialité vise à expliquer de manière claire et transparente comment nous collectons, utilisons, partageons, conservons et protégeons vos données personnelles lorsque vous utilisez notre site web ou notre application mobile. Cette politique s'applique à tous les utilisateurs de nos services, y compris les locataires, les propriétaires et les visiteurs. Lorepa s'engage à se conformer aux lois sur la protection de la vie privée applicables, y compris : La Loi sur la protection des renseignements personnels dans le secteur privé (Québec) ; Le Règlement général sur la protection des données (RGPD), le cas échéant, pour les utilisateurs situés dans l'Union européenne.`,
    definitionTitle: "1. Définition des « Renseignements personnels »",
    definitionContent: `Les renseignements personnels désignent toute donnée concernant une personne identifiable, y compris, mais sans s'y limiter : Nom, adresse, adresse e-mail, numéro de téléphone, photo, permis de conduire, géolocalisation, données bancaires, ou tout autre document identifiant directement ou indirectement une personne.`,
    consentTitle: "2. Consentement",
    consentContent: `En accédant à nos services, vous consentez expressément à ce que Lorepa collecte, utilise, stocke et partage vos renseignements personnels conformément à cette politique. Vous pouvez retirer votre consentement à tout moment, à moins que Lorepa ne soit légalement tenue de conserver certaines informations. Pour retirer votre consentement, veuillez nous contacter (voir Section 12).`,
    collectionTitle: "3. Collecte des Renseignements Personnels",
    collectionIntro: "Nous collectons des renseignements personnels lorsque vous :",
    collectionList1: "Créez un compte (en tant que locataire ou propriétaire) ;",
    collectionList2: "Complétez ou mettez à jour votre profil ;",
    collectionList3: "Téléchargez des documents obligatoires (permis de conduire, preuve d'assurance FAQ27, immatriculation du véhicule/remorque) ;",
    collectionList4: "Publiez ou réservez une remorque ;",
    collectionList5: "Communiquez avec un autre utilisateur ou notre équipe de support ;",
    collectionList6: "Laissez un avis ou une évaluation ;",
    collectionList7: "Participez à un sondage, un concours ou une promotion ;",
    collectionList8: "Naviguez sur notre site web ou application (adresse IP, type d'appareil, système d'exploitation, etc.).",
    categoriesIntro: "Catégories d'informations collectées :",
    categoriesList1: "Identité : Prénom, nom, date de naissance, photo de profil ;",
    categoriesList2: "Coordonnées : Adresse postale, adresse e-mail, numéro de téléphone ;",
    categoriesList3: "Documents : Permis de conduire, preuve d'assurance auto, immatriculation du véhicule/remorque ;",
    categoriesList4: "Paiements : Données nécessaires aux transactions via Stripe ;",
    categoriesList5: "Géolocalisation : Si vous y consentez explicitement ;",
    categoriesList6: "Contenu généré par l'utilisateur : Avis, commentaires, photos de remorques, images d'inspection.",
    useTitle: "4. Utilisation des Renseignements Personnels",
    useContent: `Nous utilisons vos renseignements personnels pour : Fournir et gérer l'accès à notre plateforme de location ; Vérifier votre identité et valider les documents téléchargés ; Permettre la communication entre locataires et propriétaires ; Générer et envoyer les contrats de location, y compris les photos requises ; Gérer les paiements, les dépôts, les remboursements et les litiges ; Prévenir la fraude et assurer la sécurité des utilisateurs ; Répondre à vos demandes de support ; Améliorer nos services et l'expérience utilisateur ; Se conformer aux obligations légales et réglementaires de Lorepa.`,
    sharingTitle: "5. Partage et Divulgation des Informations",
    sharingIntro: "Nous ne vendons ni ne louons vos informations personnelles.",
    sharingDisclaimer: "Cependant, nous pouvons les partager avec :",
    sharingList1: "Des fournisseurs de services essentiels aux opérations de la plateforme (ex. : Stripe, AWS, Firebase) ;",
    sharingList2: "Les autorités lorsque requis par la loi, les procédures légales, ou pour protéger nos droits ;",
    sharingList3: "D'autres utilisateurs, mais uniquement les informations nécessaires pour compléter une transaction (ex. : prénom, initiale du nom de famille, photo de profil, numéro de téléphone, localisation de la remorque).",
    sharingContract: "Nous exigeons contractuellement que tous les tiers respectent des normes strictes de protection des données.",
    retentionTitle: "6. Rétention des Données",
    retentionContent: `Nous conservons vos renseignements personnels aussi longtemps que nécessaire pour atteindre les objectifs énoncés dans cette politique et pour nous conformer à nos obligations légales et contractuelles. Une fois qu'elles ne sont plus nécessaires, vos données sont supprimées ou anonymisées en toute sécurité.`,
    securityTitle: "7. Mesures de Sécurité",
    securityContent: `Lorepa met en œuvre des mesures robustes pour protéger vos données : Cryptage SSL/TLS pour la transmission des données ; Serveurs sécurisés hébergés par des fournisseurs réputés (ex. : AWS, Google Cloud) ; Accès restreint aux données pour le personnel autorisé et les fournisseurs de services uniquement ; Procédures internes strictes de cybersécurité. Cependant, aucune méthode de transmission ou de stockage n'est entièrement sécurisée. Lorepa ne peut garantir une sécurité absolue.`,
    rightsTitle: "8. Vos Droits",
    rightsIntro: "Sous réserve des lois applicables, vous avez les droits suivants :",
    rightsList1: "Accès : Consulter les données personnelles que nous détenons à votre sujet ;",
    rightsList2: "Rectification : Corriger ou mettre à jour votre informations ;",
    rightsList3: "Retrait du consentement : Retirer votre consentement pour certains traitements ;",
    rightsList4: "Suppression : Demander la suppression de vos données, sauf obligation légale de les conserver ;",
    rightsList5: "Portabilité : Recevoir vos données dans un format structuré et lisible par machine ;",
    rightsList6: "Opposition/Restriction : Restreindre ou vous opposer à des utilisations spécifiques de vos données.",
    rightsContact: "Pour exercer vos droits, veuillez nous contacter (voir Section 12).",
    cookiesTitle: "9. Cookies",
    cookiesIntro: "Nous utilisons des cookies pour :",
    cookiesList1: "Améliorer votre expérience de navigation et personnaliser le contenu ;",
    cookiesList2: "Analyser le trafic sur notre site web ;",
    cookiesList3: "Mémoriser vos préférences.",
    cookiesOutro: "Vous pouvez configurer votre navigateur pour bloquer certains cookies. Cependant, cela peut limiter certaines fonctionnalités du site.",
    thirdPartyTitle: "10. Services Tiers",
    thirdPartyContent: `Lorepa peut inclure des liens vers des services tiers (ex. : Stripe, médias sociaux). Nous ne sommes pas responsables de leurs pratiques en matière de confidentialité et vous encourageons à consulter leurs politiques respectives.`,
    updatesTitle: "11. Mises à Jour de la Politique",
    updatesContent: `Lorepa peut mettre à jour cette politique de confidentialité à tout moment. Tout changement significatif sera clairement communiqué sur notre site web ou par e-mail. La date de la dernière mise à jour est indiquée en haut de ce document.`,
    contactTitle: "12. Nous Contacter",
    contactIntro: "Si vous avez des questions, des préoccupations ou des demandes concernant vos données personnelles, ou si vous souhaitez exercer vos droits, veuillez nous contacter à :",
    contactDPO: "Lorepa – Délégué à la Protection des Données",
    contactEmail: "📧 Email : mayukwa.rodrigue@gmail.com",
    contactAddress: "📬 Adresse postale : 3910, Rue de Bellechasse, Montréal, H1X 1J4, Québec, Canada",
    legalNoticeTitle: "Mentions Légales – Lorepa",
    websitePresentationTitle: "1. Présentation du site web",
    owner: "Propriétaire : Lorepa – Entreprise Individuelle",
    registeredAddress: "Adresse enregistrée : 3910, Rue de Bellechasse, Montréal, Québec, H1X 1J4",
    quebecBusinessNumber: "Numéro d'entreprise du Québec (NEQ) : 2279050480",
    publicationDirector: "Directeur de la publication : Rodrigue Mayukwa",
    websiteCreator: "Créateur du site web : Rodrigue Mayukwa",
    hostingProvider: "Hébergeur : [Insérer le nom et le site web de l'hébergeur ici]",
    termsOfUseTitle: "2. Conditions d'utilisation",
    termsOfUseContent: "En utilisant le site web de Lorepa, les utilisateurs acceptent les conditions générales d'utilisation décrites ici. Ces conditions peuvent être mises à jour à tout moment, il est donc conseillé aux utilisateurs de les consulter régulièrement. L'accès au site web est généralement disponible à tout moment. Des interruptions peuvent survenir pour des raisons de maintenance technique, que Lorepa s'efforcera de communiquer à l'avance.",
    servicesDescriptionTitle: "3. Description des services",
    servicesDescriptionContent: "Lorepa est une plateforme de location de remorques entre particuliers, mettant en relation les propriétaires de remorques et les locataires. Nous nous efforçons de fournir des informations précises et à jour. Cependant, Lorepa ne pourra être tenue responsable des omissions, inexactitudes ou retards de mise à jour, qu'ils proviennent de Lorepa ou de partenaires tiers.",
    technicalLimitationsTitle: "4. Limitations techniques",
    technicalLimitationsContent: "Le site web utilise des technologies modernes telles que HTML5 et JavaScript. Les utilisateurs doivent accéder au site avec un appareil et un navigateur à jour. Lorepa n'est pas responsable des dommages résultant de matériel ou de logiciels incompatibles ou obsolètes.",
    intellectualPropertyTitle: "5. Propriété intellectuelle",
    intellectualPropertyContent: "Tous les éléments du site (textes, images, logos, code, icônes, etc.) sont la propriété intellectuelle de Lorepa ou sont concédés sous licence à Lorepa. Toute reproduction ou représentation sans consentement écrit préalable est strictement interdite. L'utilisation non autorisée de tout contenu peut être considérée comme une contrefaçon et poursuivie en vertu des lois applicables sur la propriété intellectuelle.",
    liabilityLimitationTitle: "6. Limitation de responsabilité",
    liabilityLimitationContent: "Lorepa n'est pas responsable des dommages directs ou indirects causés au matériel de l'utilisateur lors de l'accès au site web, ni des bugs, incompatibilités ou pertes (opportunités de marché, données, etc.). Lorepa peut modérer ou supprimer tout contenu interactif (ex. : formulaires de contact, messages) jugé illégal ou inapproprié en vertu du droit québécois.",
    dataProtectionTitle: "7. Protection des données personnelles (Loi 25 – Québec)",
    dataProtectionContent: "Lorepa se conforme à la Loi 25 sur la protection des renseignements personnels. Les données ne sont collectées que lorsque cela est nécessaire et avec la connaissance de l'utilisateur. Les données collectées peuvent inclure l'adresse IP, les informations du navigateur et les liens de référence. Les utilisateurs ont le droit d'accéder, de corriger ou de supprimer leurs données personnelles en envoyant une demande écrite signée accompagnée d'une pièce d'identité valide à : info@lorepa.ca. Aucune donnée personnelle n'est partagée ou vendue sans le consentement de l'utilisateur, sauf en cas de transfert d'entreprise.",
    cookiesLegalNoticeTitle: "8. Cookies",
    cookiesLegalNoticeContent: "Des cookies peuvent être installés pour améliorer la navigation et analyser le trafic. Les utilisateurs peuvent configurer leur navigateur pour désactiver les cookies. Cela peut cependant limiter l'accès à certaines fonctionnalités.",
    externalLinksTitle: "9. Liens externes",
    externalLinksContent: "Lorepa peut inclure des liens vers des services tiers. Nous ne contrôlons ni n'approuvons le contenu de ces sites et ne sommes pas responsables de leurs pratiques ou politiques.",
    governingLawTitle: "10. Droit applicable",
    governingLawContent: "Tout litige lié à l'utilisation du site web de Lorepa est régi par le droit québécois. Les tribunaux compétents de la province de Québec auront compétence exclusive.",
    glossaryTitle: "11. Glossaire",
    userGlossary: "Utilisateur : Toute personne naviguant ou interagissant avec le site web de Lorepa.",
    personalDataGlossary: "Données personnelles : Toute information permettant d'identifier directement ou indirectement une personne physique.",
    financialInformationTitle: "12. Informations financières",
    financialInformationContent: "Tous les prix sur Lorepa sont en dollars canadiens (CAD) et incluent les taxes applicables, sauf indication contraire. Les frais et commissions sont clairement affichés avant la confirmation de toute transaction. Lorepa se réserve le droit de modifier ses prix sans préavis.",
    userGeneratedContentTitle: "13. Contenu généré par l'utilisateur",
    userGeneratedContentContent: "Les utilisateurs peuvent publier du contenu (annonces, photos, avis, etc.). Ce faisant, ils confirment la propriété des droits和 concedent à Lorepa une licence gratuite, non exclusive et mondiale d'utiliser ce contenu dans le cadre de ses services. Lorepa peut supprimer tout contenu violant ses politiques ou les lois applicables sans préavis.",
    forceMajeureTitle: "14. Force majeure",
    forceMajeureContent: "Lorepa ne pourra être tenue responsable en cas de non-exécution due à des événements échappant à son contrôle (catastrophe naturelle, guerre, panne d'internet, grève, etc.).",
    dataArchivingTitle: "15. Archivage des données – preuve",
    dataArchivingContent: "Les enregistrements électroniques et les sauvegardes conservés par Lorepa seront considérés comme une preuve valide des communications, transactions et interactions entre les utilisateurs et Lorepa. Ces enregistrements sont stockés sur des supports fiables et durables.",
  },
};

const PrivacyPage = () => {
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
      title: translations.preambleTitle,
      content: translations.preambleContent,
    },
    {
      title: translations.definitionTitle,
      content: translations.definitionContent,
    },
    {
      title: translations.consentTitle,
      content: translations.consentContent,
    },
    {
      title: translations.collectionTitle,
      content: (
        <>
          <p>{translations.collectionIntro}</p>
          <ul className='list-disc list-inside space-y-1 ml-4'>
            <li>{translations.collectionList1}</li>
            <li>{translations.collectionList2}</li>
            <li>{translations.collectionList3}</li>
            <li>{translations.collectionList4}</li>
            <li>{translations.collectionList5}</li>
            <li>{translations.collectionList6}</li>
            <li>{translations.collectionList7}</li>
            <li>{translations.collectionList8}</li>
          </ul>
          <p>{translations.categoriesIntro}</p>
          <ul className='list-disc list-inside space-y-1 ml-4'>
            <li>{translations.categoriesList1}</li>
            <li>{translations.categoriesList2}</li>
            <li>{translations.categoriesList3}</li>
            <li>{translations.categoriesList4}</li>
            <li>{translations.categoriesList5}</li>
            <li>{translations.categoriesList6}</li>
          </ul>
        </>
      ),
    },
    {
      title: translations.useTitle,
      content: translations.useContent,
    },
    {
      title: translations.sharingTitle,
      content: (
        <>
          <p>{translations.sharingIntro}</p>
          <p>{translations.sharingDisclaimer}</p>
          <ul className='list-disc list-inside space-y-1 ml-4'>
            <li>{translations.sharingList1}</li>
            <li>{translations.sharingList2}</li>
            <li>{translations.sharingList3}</li>
          </ul>
          <p>{translations.sharingContract}</p>
        </>
      ),
    },
    {
      title: translations.retentionTitle,
      content: translations.retentionContent,
    },
    {
      title: translations.securityTitle,
      content: translations.securityContent,
    },
    {
      title: translations.rightsTitle,
      content: (
        <>
          <p>{translations.rightsIntro}</p>
          <ul className='list-disc list-inside space-y-1 ml-4'>
            <li>{translations.rightsList1}</li>
            <li>{translations.rightsList2}</li>
            <li>{translations.rightsList3}</li>
            <li>{translations.rightsList4}</li>
            <li>{translations.rightsList5}</li>
            <li>{translations.rightsList6}</li>
          </ul>
          <p>{translations.rightsContact}</p>
        </>
      ),
    },
    {
      title: translations.cookiesTitle,
      content: (
        <>
          <p>{translations.cookiesIntro}</p>
          <ul className='list-disc list-inside space-y-1 ml-4'>
            <li>{translations.cookiesList1}</li>
            <li>{translations.cookiesList2}</li>
            <li>{translations.cookiesList3}</li>
          </ul>
          <p>{translations.cookiesOutro}</p>
        </>
      ),
    },
    {
      title: translations.thirdPartyTitle,
      content: translations.thirdPartyContent,
    },
    {
      title: translations.updatesTitle,
      content: translations.updatesContent,
    },
    {
      title: translations.contactTitle,
      content: (
        <div className='ml-4'>
          <p>{translations.contactIntro}</p>
          <p>{translations.contactDPO}</p>
          <p>{translations.contactEmail}</p>
          <p>{translations.contactAddress}</p>
        </div>
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
          {translations.privacyPolicyTitle}
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

export default PrivacyPage;