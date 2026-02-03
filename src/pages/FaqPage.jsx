import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5 },
    }),
};

// Translations for the FAQ Page
const faqPageTranslations = {
    en: {
        faqTitle: "FAQ",
        guestsTab: "Guests",
        hostsTab: "Hosts",
        noAnswer: "Didn't find any answer to your question?",
        contactUsButton: "Contact us"
    },
    es: {
        faqTitle: "Preguntas frecuentes",
        guestsTab: "Invitados",
        hostsTab: "Anfitriones",
        noAnswer: "¿No encontraste respuesta a tu pregunta?",
        contactUsButton: "Contáctanos"
    },
    cn: {
        faqTitle: "常见问题",
        guestsTab: "访客",
        hostsTab: "房东",
        noAnswer: "没有找到您问题的答案？",
        contactUsButton: "联系我们"
    },
    fr: {
        faqTitle: "FAQ",
        guestsTab: "Invités",
        hostsTab: "Hôtes",
        noAnswer: "Vous n'avez pas trouvé de réponse à votre question ?",
        contactUsButton: "Contactez-nous"
    }
};

// FAQ content with translations
// const faqContent = {
//     en: {
//         guests: [
//             { question: "What do I need to rent a trailer on Lorepa?", answer: "To rent a trailer, you must be at least 21 years old, hold a valid driver’s license, and provide proof of insurance (FAQ27). You will also need a verified Lorepa account." },
//             { question: "How does the rental process work?", answer: "You browse available trailers, send a request to the owner, and once approved, confirm your booking. A rental contract and inspection photos are generated automatically." },
//             { question: "Does Lorepa provide insurance for rental?", answer: "Yes. Lorepa offers optional insurance coverage starting at $10 per day. This protection is designed to cover accidental damages, theft, and limited liability related to the trailer during the rental period." },
//             { question: "Can I cancel my booking?", answer: "Yes, you can cancel under the terms described in our cancellation policy. Refunds may vary depending on when the cancellation is made relative to the start date." },
//             { question: "What happens if I return the trailer late?", answer: "Late returns may incur a flat penalty fee, as outlined in the Terms of Use. Always notify the owner in case of delay to avoid disputes." },
//             { question: "What if the trailer is damaged during my trip?", answer: "You are responsible for any damage during the rental period. Damage costs may be deducted from your deposit or charged directly, depending on the severity and proof." },
//             { question: "How are payments and deposits handled?", answer: "Payments are processed securely through Stripe. A security deposit is held during the rental period and released within 7 days if no issues are reported." },
//             { question: "What happens to the security deposit if I choose insurance?", answer: "With insurance: Your deposit may be reduced or waived, depending on the level of coverage you've chosen. Without insurance: The full deposit set by the owner applies, and you remain entirely responsible for any damages or loss." },
//             { question: "Where can I tow the trailer?", answer: "Most trailers can be towed within Canada. If cross-border travel (e.g., to the USA) is planned, check with the owner first and mention it in your request." },
//             { question: "Do I need a special towing license?", answer: "In most Canadian provinces, a standard Class 5 license is enough for small trailers. However, it's your responsibility to ensure you meet local requirements and that your vehicle is rated to tow the selected trailer." },
//             { question: "What kind of trailers are available?", answer: "Lorepa offers utility trailers, enclosed cargo trailers, car haulers, motorcycle trailers, and more. You can filter by category, size, or location." },
//             { question: "Can I rent a trailer for a one-way trip?", answer: "Most rentals are round-trip. If you need one-way rental, contact the owner directly or check listings with flexible return options." },
//             { question: "Are there any hidden fees?", answer: "No hidden fees. All charges are shown upfront. Some extras (e.g., cleaning, extra days, mileage overage) may be added if not respected." },
//             { question: "How do I contact customer support?", answer: "You can reach our support team via the chat feature on the app or website, or by email at support@lorepa.ca. Response time is typically under 24h." }
//         ],
//         hosts: [
//             { question: "How do I list my trailer?", answer: "You can list your trailer by signing up, filling in key details (description, availability, pricing), uploading photos, and providing required documents (registration, insurance)." },
//             { question: "How much can I earn with Lorepa?", answer: "You keep 85% of the rental price. The remaining 15% covers Lorepa’s service fee. Payouts are processed automatically via Stripe within 3–5 business days after the rental ends." },
//             { question: "Can I cancel a reservation?", answer: "Yes, but owners are allowed only 2 free cancellations every 6 months. After that, a $100 CAD penalty applies if the cancellation is within policy. Abuse of cancellations is subject to account review." },
//             { question: "What if my trailer is returned late or damaged?", answer: "You can report any issue via the platform within 24 hours. Lorepa can assist with deducting penalties or damage costs from the renter’s deposit." },
//             { question: "Do I need special insurance as an owner?", answer: "You must maintain valid trailer insurance. Lorepa does not provide direct coverage to owners. However, optional protection programs may be introduced in future." },
//             { question: "Can I choose who rents my trailer?", answer: "Yes. You can review the renter’s profile, documents, and ratings before accepting a request. You are under no obligation to accept every booking." },
//             { question: "How are taxes handled?", answer: "You are responsible for reporting your earnings and managing your taxes. Lorepa may provide annual income summaries, but does not remit taxes on your behalf." },
//             { question: "Can I rent out multiple trailers?", answer: "Absolutely. Lorepa supports multiple listings per user. You can manage your fleet under one account and adjust availability per unit." },
//             { question: "Can I require a cleaning fee or extra conditions?", answer: "Yes. You may set your own rules (cleaning fees, towing restrictions, penalties for misuse), but they must be clearly disclosed in your listing." },
//             { question: "How can I improve my trailer visibility?", answer: "Use high-quality photos, detailed descriptions, fair pricing, and maintain a good response rate. Verified owners with good ratings appear higher in search results." },
//             { question: "How do I handle fuel or equipment returns?", answer: "You can specify in your listing whether fuel/equipment must be returned in the same condition. Always document the condition at pickup and return." },
//             { question: "Can I report a bad renter?", answer: "Yes. After the rental ends, you can leave a review and report any serious incident to Lorepa’s trust & safety team. Repeated abuse may result in renter bans." }
//         ],
//         global: [
//             { question: "Who is responsible in case of accident or theft?", answer: "Renters are liable for any damages or loss during the rental. In serious cases, police reports, insurance claims, and platform mediation may apply." },
//             { question: "Does Lorepa offer insurance coverage?", answer: "Yes. Lorepa offers optional insurance coverage starting at $10 per day. This insurance provides protection against theft and certain types of damage during a rental. If a renter subscribes to this insurance, it can reduce or waive the deposit that would otherwise be required." },
//             { question: "Is Lorepa available in the USA?", answer: "Lorepa is currently focused on Canada. Cross-border use is only allowed with owner consent and proper documentation." }
//         ]
//     },
//     es: {
//         guests: [
//             { question: "¿Qué necesito para alquilar un remolque en Lorepa?", answer: "Para alquilar un remolque, debe tener al menos 21 años, poseer una licencia de conducir válida y proporcionar prueba de seguro (FAQ27). También necesitará una cuenta verificada de Lorepa." },
//             { question: "¿Cómo funciona el proceso de alquiler?", answer: "Usted busca remolques disponibles, envía una solicitud al propietario y, una vez aprobada, confirma su reserva. Un contrato de alquiler y fotos de inspección se generan automáticamente." },
//             { question: "¿Lorepa proporciona seguro para el alquiler?", answer: "Sí. Lorepa ofrece una cobertura de seguro opcional a partir de $10 por día. Esta protección está diseñada para cubrir daños accidentales, robo y responsabilidad limitada relacionados con el remolque durante el período de alquiler." },
//             { question: "¿Puedo cancelar mi reserva?", answer: "Sí, puede cancelar bajo los términos descritos en nuestra política de cancelación. Los reembolsos pueden variar dependiendo de cuándo se realice la cancelación en relación con la fecha de inicio." },
//             { question: "¿Qué pasa si devuelvo el remolque tarde?", answer: "Las devoluciones tardías pueden incurrir en una tarifa de penalización fija, como se describe en los Términos de Uso. Siempre notifique al propietario en caso de retraso para evitar disputas." },
//             { question: "¿Qué sucede si el remolque se daña durante mi viaje?", answer: "Usted es responsable de cualquier daño durante el período de alquiler. Los costos por daños pueden ser deducidos de su depósito o cargados directamente, dependiendo de la gravedad y la prueba." },
//             { question: "¿Cómo se manejan los pagos y los depósitos?", answer: "Los pagos se procesan de forma segura a través de Stripe. Un depósito de seguridad se retiene durante el período de alquiler y se libera dentro de los 7 días si no se reportan problemas." },
//             { question: "¿Qué sucede con el depósito de seguridad si elijo el seguro?", answer: "Con seguro: Su depósito puede reducirse o eliminarse, dependiendo del nivel de cobertura que haya elegido. Sin seguro: Se aplica el depósito total establecido por el propietario, y usted sigue siendo totalmente responsable de cualquier daño o pérdida." },
//             { question: "¿Dónde puedo remolcar el remolque?", answer: "La mayoría de los remolques se pueden remolcar dentro de Canadá. Si se planea un viaje transfronterizo (por ejemplo, a EE. UU.), consulte primero con el propietario y menciónelo en su solicitud." },
//             { question: "¿Necesito una licencia de remolque especial?", answer: "En la mayoría de las provincias canadienses, una licencia estándar Clase 5 es suficiente para remolques pequeños. Sin embargo, es su responsabilidad asegurarse de cumplir con los requisitos locales y de que su vehículo esté clasificado para remolcar el remolque seleccionado." },
//             { question: "¿Qué tipo de remolques están disponibles?", answer: "Lorepa ofrece remolques utilitarios, remolques de carga cerrados, transportadores de automóviles, remolques para motocicletas y más. Puede filtrar por categoría, tamaño o ubicación." },
//             { question: "¿Puedo alquilar un remolque para un viaje de ida?", answer: "La mayoría de los alquileres son de ida y vuelta. Si necesita un alquiler de ida, comuníquese directamente con el propietario o consulte los listados con opciones de devolución flexibles." },
//             { question: "¿Hay tarifas ocultas?", answer: "No hay tarifas ocultas. Todos los cargos se muestran por adelantado. Algunos extras (por ejemplo, limpieza, días adicionales, exceso de kilometraje) pueden agregarse si no se respetan." },
//             { question: "¿Cómo me contacto con el soporte al cliente?", answer: "Puede comunicarse con nuestro equipo de soporte a través de la función de chat en la aplicación o el sitio web, o por correo electrónico a support@lorepa.ca. El tiempo de respuesta suele ser inferior a 24 horas." }
//         ],
//         hosts: [
//             { question: "¿Cómo listo mi remolque?", answer: "Puede listar su remolque registrándose, completando los detalles clave (descripción, disponibilidad, precios), subiendo fotos y proporcionando los documentos requeridos (registro, seguro)." },
//             { question: "¿Cuánto puedo ganar con Lorepa?", answer: "Usted conserva el 85% del precio del alquiler. El 15% restante cubre la tarifa de servicio de Lorepa. Los pagos se procesan automáticamente a través de Stripe dentro de 3 a 5 días hábiles después de que finaliza el alquiler." },
//             { question: "¿Puedo cancelar una reserva?", answer: "Sí, pero los propietarios solo pueden cancelar 2 veces gratis cada 6 meses. Después de eso, se aplica una penalización de $100 CAD si la cancelación está dentro de la política. El abuso de cancelaciones está sujeto a revisión de la cuenta." },
//             { question: "¿Qué sucede si mi remolque se devuelve tarde o dañado?", answer: "Puede reportar cualquier problema a través de la plataforma dentro de las 24 horas. Lorepa puede ayudar a deducir penalizaciones o costos por daños del depósito del inquilino." },
//             { question: "¿Necesito un seguro especial como propietario?", answer: "Debe mantener un seguro de remolque válido. Lorepa no proporciona cobertura directa a los propietarios. Sin embargo, en el futuro se pueden introducir programas de protección opcional." },
//             { question: "¿Puedo elegir quién alquila mi remolque?", answer: "Sí. Puede revisar el perfil del inquilino, los documentos y las calificaciones antes de aceptar una solicitud. No está obligado a aceptar cada reserva." },
//             { question: "¿Cómo se manejan los impuestos?", answer: "Usted es responsable de declarar sus ganancias y administrar sus impuestos. Lorepa puede proporcionar resúmenes de ingresos anuales, pero no remite impuestos en su nombre." },
//             { question: "¿Puedo alquilar varios remolques?", answer: "Absolutamente. Lorepa admite múltiples listados por usuario. Puede administrar su flota bajo una cuenta y ajustar la disponibilidad por unidad." },
//             { question: "¿Puedo exigir una tarifa de limpieza o condiciones adicionales?", answer: "Sí. Puede establecer sus propias reglas (tarifas de limpieza, restricciones de remolque, sanciones por mal uso), pero deben divulgarse claramente en su listado." },
//             { question: "¿Cómo puedo mejorar la visibilidad de mi remolque?", answer: "Utilice fotos de alta calidad, descripciones detalladas, precios justos y mantenga una buena tasa de respuesta. Los propietarios verificados con buenas calificaciones aparecen más arriba en los resultados de búsqueda." },
//             { question: "¿Cómo manejo la devolución de combustible o equipo?", answer: "Puede especificar en su listado si el combustible/equipo debe devolverse en las mismas condiciones. Siempre documente la condición al recoger y devolver." },
//             { question: "¿Puedo reportar a un mal inquilino?", answer: "Sí. Después de que finalice el alquiler, puede dejar una reseña e informar cualquier incidente grave al equipo de confianza y seguridad de Lorepa. El abuso repetido puede resultar en la prohibición del inquilino." }
//         ],
//         global: [
//             { question: "¿Quién es responsable en caso de accidente o robo?", answer: "Los inquilinos son responsables de cualquier daño o pérdida durante el alquiler. En casos graves, pueden aplicarse informes policiales, reclamaciones de seguros y mediación de la plataforma." },
//             { question: "¿Lorepa ofrece cobertura de seguro?", answer: "Sí. Lorepa ofrece una cobertura de seguro opcional a partir de $10 por día. Este seguro proporciona protección contra robo y ciertos tipos de daños durante un alquiler. Si un inquilino se suscribe a este seguro, puede reducir o eliminar el depósito que de otro modo se requeriría." },
//             { question: "¿Lorepa está disponible en EE. UU.?", answer: "Lorepa se enfoca actualmente en Canadá. El uso transfronterizo solo está permitido con el consentimiento del propietario y la documentación adecuada." }
//         ]
//     },
//     cn: {
//         guests: [
//             { question: "在 Lorepa 租用拖车需要什么？", answer: "要租用拖车，您必须年满 21 岁，持有有效驾驶执照，并提供保险证明 (FAQ27)。您还需要一个经过验证的 Lorepa 账户。" },
//             { question: "租赁流程是怎样的？", answer: "您可以浏览可用的拖车，向车主发送请求，一旦获得批准，即可确认您的预订。租赁合同和检查照片会自动生成。" },
//             { question: "Lorepa 提供租赁保险吗？", answer: "是的。Lorepa 提供可选的保险，每天 10 加元起。此保护旨在涵盖租赁期间与拖车相关的意外损坏、盗窃和有限责任。" },
//             { question: "我可以取消我的预订吗？", answer: "是的，您可以根据我们的取消政策中描述的条款取消。退款可能会根据取消时间相对于开始日期的不同而有所不同。" },
//             { question: "如果我迟还拖车会怎样？", answer: "迟还可能会产生固定罚金，如使用条款中所述。如果延迟，请务必通知车主，以避免争议。" },
//             { question: "如果拖车在我的旅途中损坏了怎么办？", answer: "您对租赁期间的任何损坏负责。损坏费用可能会从您的押金中扣除或直接收取，具体取决于损坏的严重程度和证明。" },
//             { question: "付款和押金如何处理？", answer: "付款通过 Stripe 安全处理。安全押金在租赁期间持有，如果未报告任何问题，将在 7 天内解除。" },
//             { question: "如果我选择保险，押金会怎样？", answer: "有保险：您的押金可能会减少或免除，具体取决于您选择的保障级别。无保险：适用车主设定的全额押金，并且您对任何损坏或损失负全部责任。" },
//             { question: "我可以在哪里拖车？", answer: "大多数拖车可以在加拿大境内拖曳。如果计划跨境旅行（例如，前往美国），请先与车主核实并在您的请求中提及。" },
//             { question: "我需要特殊的拖车驾照吗？", answer: "在大多数加拿大省份，标准 5 级驾照足以拖曳小型拖车。但是，您有责任确保您符合当地要求，并且您的车辆被评定为可以拖曳所选拖车。" },
//             { question: "有哪些类型的拖车可用？", answer: "Lorepa 提供多用途拖车、封闭式货运拖车、汽车运输车、摩托车拖车等。您可以按类别、尺寸或位置进行筛选。" },
//             { question: "我可以租用拖车进行单程旅行吗？", answer: "大多数租赁都是往返的。如果您需要单程租赁，请直接联系车主或查看提供灵活还车选项的房源。" },
//             { question: "有任何隐藏费用吗？", answer: "没有隐藏费用。所有费用都预先显示。如果未遵守某些规定（例如，清洁费、额外天数、超里程），可能会增加一些额外费用。" },
//             { question: "如何联系客户支持？", answer: "您可以通过应用程序或网站上的聊天功能，或通过电子邮件 support@lorepa.ca 联系我们的支持团队。回复时间通常在 24 小时内。" }
//         ],
//         hosts: [
//             { question: "如何列出我的拖车？", answer: "您可以通过注册、填写关键详细信息（描述、可用性、定价）、上传照片并提供所需文件（注册、保险）来列出您的拖车。" },
//             { question: "我可以通过 Lorepa 赚多少钱？", answer: "您保留租金价格的 85%。剩下的 15% 用于支付 Lorepa 的服务费。付款通过 Stripe 在租赁结束后 3-5 个工作日内自动处理。" },
//             { question: "我可以取消预订吗？", answer: "是的，但车主每 6 个月只允许免费取消 2 次。在此之后，如果取消在政策范围内，则会处以 100 加元的罚款。滥用取消将受到账户审核。" },
//             { question: "如果我的拖车逾期或损坏了怎么办？", answer: "您可以在 24 小时内通过平台报告任何问题。Lorepa 可以协助从租户押金中扣除罚款或损坏费用。" },
//             { question: "作为车主我需要特殊保险吗？", answer: "您必须保持有效的拖车保险。Lorepa 不直接为车主提供保险。但是，未来可能会推出可选的保护计划。" },
//             { question: "我可以选择谁租用我的拖车吗？", answer: "是的。您可以在接受请求之前查看租户的个人资料、文件和评分。您没有义务接受每个预订。" },
//             { question: "税费如何处理？", answer: "您有责任报告您的收入并管理您的税费。Lorepa 可能会提供年度收入摘要，但不会代表您代缴税费。" },
//             { question: "我可以出租多辆拖车吗？", answer: "当然。Lorepa 支持每个用户多个房源。您可以在一个账户下管理您的车队并调整每个单位的可用性。" },
//             { question: "我可以要求清洁费或额外条件吗？", answer: "是的。您可以设置自己的规则（清洁费、拖曳限制、误用罚款），但必须在您的房源中明确披露。" },
//             { question: "如何提高我的拖车可见度？", answer: "使用高质量的照片、详细的描述、公平的定价，并保持良好的回复率。拥有良好评价的经过验证的车主在搜索结果中排名更高。" },
//             { question: "如何处理燃油或设备归还？", answer: "您可以在您的房源中指定燃油/设备是否必须以相同条件归还。始终在取车和还车时记录情况。" },
//             { question: "我可以举报不良租户吗？", answer: "是的。租赁结束后，您可以留下评论并将任何严重事件报告给 Lorepa 的信任与安全团队。重复滥用可能会导致租户被禁。" }
//         ],
//         global: [
//             { question: "发生事故或盗窃时谁负责？", answer: "租户对租赁期间的任何损坏或损失负责。在严重情况下，可能适用警方报告、保险索赔和平台调解。" },
//             { question: "Lorepa 提供保险范围吗？", answer: "是的。Lorepa 提供可选的保险，每天 10 加元起。此保险为租赁期间的盗窃和某些类型的损坏提供保护。如果租户订阅此保险，则可以减少或免除原本需要支付的押金。" },
//             { question: "Lorepa 在美国可用吗？", answer: "Lorepa 目前专注于加拿大。只有在车主同意和提供适当文件的情况下才允许跨境使用。" }
//         ]
//     },
//     fr: {
//         guests: [
//             { question: "De quoi ai-je besoin pour louer une remorque sur Lorepa ?", answer: "Pour louer une remorque, vous devez avoir au moins 21 ans, posséder un permis de conduire valide et fournir une preuve d'assurance (FAQ27). Vous aurez également besoin d'un compte Lorepa vérifié." },
//             { question: "Comment fonctionne le processus de location ?", answer: "Vous parcourez les remorques disponibles, envoyez une demande au propriétaire, et une fois approuvée, confirmez votre réservation. Un contrat de location et des photos d'inspection sont générés automatiquement." },
//             { question: "Lorepa propose-t-elle une assurance pour la location ?", answer: "Oui. Lorepa propose une assurance optionnelle à partir de 10 $ par jour. Cette protection est conçue pour couvrir les dommages accidentels, le vol et la responsabilité limitée liés à la remorque pendant la période de location." },
//             { question: "Puis-je annuler ma réservation ?", answer: "Oui, vous pouvez annuler selon les termes décrits dans notre politique d'annulation. Les remboursements peuvent varier en fonction du moment de l'annulation par rapport à la date de début." },
//             { question: "Que se passe-t-il si je retourne la remorque en retard ?", answer: "Les retours tardifs peuvent entraîner des frais de pénalité fixes, comme indiqué dans les Conditions d'utilisation. Avertissez toujours le propriétaire en cas de retard pour éviter les litiges." },
//             { question: "Que se passe-t-il si la remorque est endommagée pendant mon voyage ?", answer: "Vous êtes responsable de tout dommage pendant la période de location. Les coûts des dommages peuvent être déduits de votre dépôt ou facturés directement, selon la gravité et la preuve." },
//             { question: "Comment sont gérés les paiements et les dépôts ?", answer: "Les paiements sont traités en toute sécurité via Stripe. Un dépôt de garantie est détenu pendant la période de location et libéré dans les 7 jours si aucun problème n'est signalé." },
//             { question: "Qu'advient-il du dépôt de garantie si je choisis l'assurance ?", answer: "Avec l'assurance : votre dépôt peut être réduit ou annulé, selon le niveau de couverture que vous avez choisi. Sans assurance : le dépôt total fixé par le propriétaire s'applique et vous restez entièrement responsable de tout dommage ou perte." },
//             { question: "Où puis-je remorquer la remorque ?", answer: "La plupart des remorques peuvent être remorquées au Canada. Si un voyage transfrontalier (par exemple, vers les États-Unis) est prévu, vérifiez d'abord avec le propriétaire et mentionnez-le dans votre demande." },
//             { question: "Ai-je besoin d'un permis de remorquage spécial ?", answer: "Dans la plupart des provinces canadiennes, un permis de classe 5 standard est suffisant pour les petites remorques. Cependant, il est de votre responsabilité de vous assurer que vous respectez les exigences locales et que votre véhicule est homologué pour remorquer la remorque sélectionnée." },
//             { question: "Quels types de remorques sont disponibles ?", answer: "Lorepa propose des remorques utilitaires, des remorques cargo fermées, des transporteurs de voitures, des remorques pour motos, et plus encore. Vous pouvez filtrer par catégorie, taille ou emplacement." },
//             { question: "Puis-je louer une remorque pour un aller simple ?", answer: "La plupart des locations sont aller-retour. Si vous avez besoin d'une location aller simple, contactez directement le propriétaire ou vérifiez les annonces avec des options de retour flexibles." },
//             { question: "Y a-t-il des frais cachés ?", answer: "Pas de frais cachés. Tous les frais sont affichés à l'avance. Des extras (par exemple, nettoyage, jours supplémentaires, dépassement de kilométrage) peuvent être ajoutés si les conditions ne sont pas respectées." },
//             { question: "Comment contacter le service client ?", answer: "Vous pouvez joindre notre équipe de support via la fonction de chat sur l'application ou le site web, ou par e-mail à support@lorepa.ca. Le temps de réponse est généralement inférieur à 24h." }
//         ],
//         hosts: [
//             { question: "Comment puis-je lister ma remorque ?", answer: "Vous pouvez lister votre remorque en vous inscrivant, en remplissant les détails clés (description, disponibilité, prix), en téléchargeant des photos et en fournissant les documents requis (immatriculation, assurance)." },
//             { question: "Combien puis-je gagner avec Lorepa ?", answer: "Vous conservez 85% du prix de la location. Les 15% restants couvrent les frais de service de Lorepa. Les paiements sont traités automatiquement via Stripe dans les 3 à 5 jours ouvrables après la fin de la location." },
//             { question: "Puis-je annuler une réservation ?", answer: "Oui, mais les propriétaires ne sont autorisés à annuler que 2 fois gratuitement tous les 6 mois. Après cela, une pénalité de 100 $ CA s'applique si l'annulation est conforme à la politique. L'abus d'annulations est soumis à un examen du compte." },
//             { question: "Que se passe-t-il si ma remorque est retournée en retard ou endommagée ?", answer: "Vous pouvez signaler tout problème via la plateforme dans les 24 heures. Lorepa peut aider à déduire les pénalités ou les coûts des dommages du dépôt du locataire." },
//             { question: "Ai-je besoin d'une assurance spéciale en tant que propriétaire ?", answer: "Vous devez maintenir une assurance de remorque valide. Lorepa ne fournit pas de couverture directe aux propriétaires. Cependant, des programmes de protection facultatifs pourront être introduits à l'avenir." },
//             { question: "Puis-je choisir qui loue ma remorque ?", answer: "Oui. Vous pouvez examiner le profil, les documents et les évaluations du locataire avant d'accepter une demande. Vous n'êtes pas obligé d'accepter chaque réservation." },
//             { question: "Comment les impôts sont-ils gérés ?", answer: "Vous êtes responsable de déclarer vos revenus et de gérer vos impôts. Lorepa peut fournir des résumés de revenus annuels, mais ne remet pas les impôts en votre nom." },
//             { question: "Puis-je louer plusieurs remorques ?", answer: "Absolument. Lorepa prend en charge plusieurs annonces par utilisateur. Vous pouvez gérer votre flotte sous un seul compte et ajuster la disponibilité par unité." },
//             { question: "Puis-je exiger des frais de nettoyage ou des conditions supplémentaires ?", answer: "Oui. Vous pouvez définir vos propres règles (frais de nettoyage, restrictions de remorquage, pénalités pour mauvaise utilisation), mais elles doivent être clairement divulguées dans votre annonce." },
//             { question: "Comment puis-je améliorer la visibilité de ma remorque ?", answer: "Utilisez des photos de haute qualité, des descriptions détaillées, des prix équitables et maintenez un bon taux de réponse. Les propriétaires vérifiés avec de bonnes évaluations apparaissent plus haut dans les résultats de recherche." },
//             { question: "Comment gérer le carburant ou le retour d'équipement ?", answer: "Vous pouvez spécifier dans votre annonce si le carburant/l'équipement doit être retourné dans le même état. Toujours documenter l'état au moment de la prise en charge et du retour." },
//             { question: "Puis-je signaler un mauvais locataire ?", answer: "Oui. Une fois la location terminée, vous pouvez laisser un avis et signaler tout incident grave à l'équipe de confiance et de sécurité de Lorepa. Les abus répétés peuvent entraîner l'interdiction du locataire." }
//         ],
//         global: [
//             { question: "Qui est responsable en cas d'accident ou de vol ?", answer: "Les locataires sont responsables de tout dommage ou perte pendant la location. Dans les cas graves, des rapports de police, des réclamations d'assurance et une médiation de la plateforme peuvent s'appliquer." },
//             { question: "Lorepa offre-t-elle une couverture d'assurance ?", answer: "Oui. Lorepa propose une assurance optionnelle à partir de 10 $ par jour. Cette assurance offre une protection contre le vol et certains types de dommages pendant une location. Si un locataire souscrit à cette assurance, cela peut réduire ou annuler le dépôt qui serait autrement requis." },
//             { question: "Lorepa est-elle disponible aux États-Unis ?", answer: "Lorepa se concentre actuellement sur le Canada. L'utilisation transfrontalière n'est autorisée qu'avec le consentement du propriétaire et une documentation appropriée." }
//         ]
//     }
// };
const faqContent = {
    "en": {
        "guests": [
            {
                "question": "What do I need to rent a trailer on Lorepa?",
                "answer": "To rent a trailer, you must be at least **21 years old**, hold a **valid driver’s license**, and provide **proof of insurance (FAQ27)**. You will also need a **verified Lorepa account**."
            },
            {
                "question": "How does the rental process work?",
                "answer": "You browse available trailers, send a request to the owner, and once approved, **confirm your booking**. A **rental contract** and **inspection photos** are generated automatically."
            },
            {
                "question": "Does Lorepa provide insurance for rental?",
                "answer": "Yes. Lorepa offers **optional insurance coverage** starting at **$10 per day**. This protection is designed to cover **accidental damages, theft, and limited liability** related to the trailer during the rental period."
            },
            {
                "question": "Can I cancel my booking?",
                "answer": "Yes, you can cancel under the terms described in our **cancellation policy**. Refunds may vary depending on when the cancellation is made relative to the start date."
            },
            {
                "question": "What happens if I return the trailer late?",
                "answer": "**Late returns** may incur a **flat penalty fee**, as outlined in the Terms of Use. Always notify the owner in case of delay to avoid disputes."
            },
            {
                "question": "What if the trailer is damaged during my trip?",
                "answer": "You are **responsible for any damage** during the rental period. Damage costs may be deducted from your deposit or charged directly, depending on the severity and proof."
            },
            {
                "question": "How are payments and deposits handled?",
                "answer": "Payments are processed securely through **Stripe**. A **security deposit** is held during the rental period and released within **7 days** if no issues are reported."
            },
            {
                "question": "What happens to the security deposit if I choose insurance?",
                "answer": "With insurance: Your deposit may be **reduced or waived**, depending on the level of coverage chosen.\n\nWithout insurance: The **full deposit set by the owner** applies, and you remain **entirely responsible** for any damages or loss."
            },
            {
                "question": "Do I need a special towing license?",
                "answer": "In most Canadian provinces, a standard **Class 5 license** is enough for small trailers. However, it's your responsibility to ensure you meet local requirements and that your vehicle is rated to tow the selected trailer."
            },
            {
                "question": "What kind of trailers are available?",
                "answer": "Lorepa offers **utility trailers, enclosed cargo trailers, car haulers, motorcycle trailers**, and more. You can filter by category, size, or location."
            },
            {
                "question": "Where can I tow the trailer?",
                "answer": "Most trailers can be towed within **Canada**. If **cross-border travel** (e.g., to the USA) is planned, check with the owner first and mention it in your request."
            },
            {
                "question": "Can I rent a trailer for a one-way trip?",
                "answer": "Most rentals are **round-trip**. If you need **one-way rental**, contact the owner directly or check listings with flexible return options."
            },
            {
                "question": "Are there any hidden fees?",
                "answer": "**No hidden fees**. All charges are shown upfront. Some extras (e.g., cleaning, extra days, mileage overage) may be added if not respected."
            },
            {
                "question": "How do I contact customer support?",
                "answer": "You can reach our support team via the **chat feature** on the app or website, or by email at **support@lorepa.ca**. Response time is typically under **24h**."
            }
        ],
        "hosts": [
            {
                "question": "How do I list my trailer?",
                "answer": "You can list your trailer by signing up, filling in key details (**description, availability, pricing**), uploading photos, and providing required documents (**registration, insurance**)."
            },
            {
                "question": "How much can I earn with Lorepa?",
                "answer": "You keep **85%** of the rental price. The remaining **15%** covers Lorepa’s service fee. Payouts are processed automatically via **Stripe** within **3–5 business days** after the rental ends."
            },
            {
                "question": "Can I cancel a reservation?",
                "answer": "Yes, but owners are allowed only **2 free cancellations every 6 months**. After that, a **$100 CAD penalty** applies if the cancellation is within policy. Abuse of cancellations is subject to account review."
            },
            {
                "question": "What if my trailer is returned late or damaged?",
                "answer": "You can report any issue via the platform within **24 hours**. Lorepa can assist with deducting penalties or damage costs from the renter’s deposit."
            },
            {
                "question": "Can I choose who rents my trailer?",
                "answer": "Yes. You can **review the renter’s profile, documents, and ratings** before **accepting** a request. You are under no obligation to accept every booking."
            },
            {
                "question": "How are taxes handled?",
                "answer": "You are **responsible** for reporting your earnings and managing your taxes. Lorepa may provide annual income summaries, but does **not remit taxes** on your behalf."
            },
            {
                "question": "Can I require a cleaning fee or extra conditions?",
                "answer": "Yes. You may set your own rules (**cleaning fees, towing restrictions, penalties for misuse**), but they must be **clearly disclosed** in your listing."
            },
            {
                "question": "How can I improve my trailer visibility?",
                "answer": "Use **high-quality photos**, **detailed descriptions**, **fair pricing**, and maintain a **good response rate**. Verified owners with good ratings appear higher in search results."
            },
            {
                "question": "How do I handle fuel or equipment returns?",
                "answer": "You can specify in your listing whether fuel/equipment must be returned in the same condition. Always document the condition at pickup and return."
            },
            {
                "question": "Can I report a bad renter?",
                "answer": "Yes. After the rental ends, you can leave a **review** and **report any serious incident** to Lorepa’s trust & safety team. Repeated abuse may result in renter bans."
            }
        ],
        "global": [
            {
                "question": "Does Lorepa offer insurance coverage?",
                "answer": "Yes. Lorepa offers **optional insurance coverage** starting at **$10 per day**. This insurance provides protection against **theft and certain types of damage** during a rental. If a renter subscribes to this insurance, it can reduce or waive the deposit that would otherwise be required."
            },
            {
                "question": "Is Lorepa available in the USA?",
                "answer": "Lorepa is currently focused on **Canada**. Cross-border use is only allowed with **owner consent and proper documentation**."
            },
            {
                "question": "Who is responsible in case of accident or theft?",
                "answer": "**Renters are liable** for any damages or loss during the rental. In serious cases, **police reports, insurance claims, and platform mediation** may apply."
            }
        ]
    },
    "es": {
        "guests": [
            {
                "question": "¿Qué necesito para alquilar un remolque en Lorepa?",
                "answer": "Para alquilar un remolque, debe tener al menos **21 años**, poseer una **licencia de conducir válida** y proporcionar **prueba de seguro (FAQ27)**. También necesitará una **cuenta verificada de Lorepa**."
            },
            {
                "question": "¿Cómo funciona el proceso de alquiler?",
                "answer": "Usted busca remolques disponibles, envía una solicitud al propietario y, una vez aprobada, **confirma su reserva**. Un **contrato de alquiler** y **fotos de inspección** se generan automáticamente."
            },
            {
                "question": "¿Lorepa proporciona seguro para el alquiler?",
                "answer": "Sí. Lorepa ofrece una **cobertura de seguro opcional** a partir de **$10 por día**. Esta protección está diseñada para cubrir **daños accidentales, robo y responsabilidad limitada** relacionados con el remolque durante el período de alquiler."
            },
            {
                "question": "¿Puedo cancelar mi reserva?",
                "answer": "Sí, puede cancelar bajo los términos descritos en nuestra **política de cancelación**. Los reembolsos pueden variar dependiendo de cuándo se realice la cancelación en relación con la fecha de inicio."
            },
            {
                "question": "¿Qué pasa si devuelvo el remolque tarde?",
                "answer": "Las **devoluciones tardías** pueden incurrir en una **tarifa de penalización fija**, como se describe en los Términos de Uso. Siempre notifique al propietario en caso de retraso para evitar disputas."
            },
            {
                "question": "¿Qué sucede si el remolque se daña durante mi viaje?",
                "answer": "Usted es **responsable de cualquier daño** durante el período de alquiler. Los costos por daños pueden ser deducidos de su depósito o cargados directamente, dependiendo de la gravedad y la prueba."
            },
            {
                "question": "¿Cómo se manejan los pagos y los depósitos?",
                "answer": "Los pagos se procesan de forma segura a través de **Stripe**. Un **depósito de seguridad** se retiene durante el período de alquiler y se libera dentro de los **7 días** si no se reportan problemas."
            },
            {
                "question": "¿Qué sucede con el depósito de seguridad si elijo el seguro?",
                "answer": "Con seguro: Su depósito puede **reducirse o eliminarse**, dependiendo del nivel de cobertura elegido.\n\nSin seguro: Se aplica el **depósito total** establecido por el propietario, y usted sigue siendo **totalmente responsable** de cualquier daño o pérdida."
            },
            {
                "question": "¿Necesito una licencia de remolque especial?",
                "answer": "En la mayoría de las provincias canadienses, una **licencia estándar Clase 5** es suficiente para remolques pequeños. Sin embargo, es su responsabilidad asegurarse de cumplir con los requisitos locales y de que su vehículo esté clasificado para remolcar el remolque seleccionado."
            },
            {
                "question": "¿Qué tipo de remolques están disponibles?",
                "answer": "Lorepa ofrece **remolques utilitarios, remolques de carga cerrados, transportadores de automóviles, remolques para motocicletas**, y más. Puede filtrar por categoría, tamaño o ubicación."
            },
            {
                "question": "¿Dónde puedo remolcar el remolque?",
                "answer": "La mayoría de los remolques se pueden remolcar dentro de **Canadá**. Si se planea un **viaje transfronterizo** (por ejemplo, a EE. UU.), consulte primero con el propietario y menciónelo en su solicitud."
            },
            {
                "question": "¿Puedo alquilar un remolque para un viaje de ida?",
                "answer": "La mayoría de los alquileres son **de ida y vuelta**. Si necesita un **alquiler de ida**, comuníquese directamente con el propietario o consulte los listados con opciones de devolución flexibles."
            },
            {
                "question": "¿Hay tarifas ocultas?",
                "answer": "**No hay tarifas ocultas**. Todos los cargos se muestran por adelantado. Algunos extras (por ejemplo, limpieza, días adicionales, exceso de kilometraje) pueden agregarse si no se respetan."
            },
            {
                "question": "¿Cómo me contacto con el soporte al cliente?",
                "answer": "Puede comunicarse con nuestro equipo de soporte a través de la **función de chat** en la aplicación o el sitio web, o por correo electrónico a **support@lorepa.ca**. El tiempo de respuesta suele ser inferior a **24 horas**."
            }
        ],
        "hosts": [
            {
                "question": "¿Cómo listo mi remolque?",
                "answer": "Puede listar su remolque registrándose, completando los detalles clave (**descripción, disponibilidad, precios**), subiendo fotos y proporcionando los documentos requeridos (**registro, seguro**)."
            },
            {
                "question": "¿Cuánto puedo ganar con Lorepa?",
                "answer": "Usted conserva el **85%** del precio del alquiler. El **15%** restante cubre la tarifa de servicio de Lorepa. Los pagos se procesan automáticamente a través de **Stripe** dentro de **3 a 5 días hábiles** después de que finaliza el alquiler."
            },
            {
                "question": "¿Puedo cancelar una reserva?",
                "answer": "Sí, pero los propietarios solo pueden cancelar **2 veces gratis cada 6 meses**. Después de eso, se aplica una **penalización de $100 CAD** si la cancelación está dentro de la política. El abuso de cancelaciones está sujeto a revisión de la cuenta."
            },
            {
                "question": "¿Qué sucede si mi remolque se devuelve tarde o dañado?",
                "answer": "Puede reportar cualquier problema a través de la plataforma dentro de las **24 horas**. Lorepa puede ayudar a deducir penalizaciones o costos por daños del depósito del inquilino."
            },
            {
                "question": "¿Puedo elegir quién alquila mi remolque?",
                "answer": "Sí. Puede **revisar el perfil, los documentos y las calificaciones del inquilino** antes de **aceptar** una solicitud. No está obligado a aceptar cada reserva."
            },
            {
                "question": "¿Cómo se manejan los impuestos?",
                "answer": "Usted es **responsable** de declarar sus ganancias y administrar sus impuestos. Lorepa puede proporcionar resúmenes de ingresos anuales, pero **no remite impuestos** en su nombre."
            },
            {
                "question": "¿Puedo exigir una tarifa de limpieza o condiciones adicionales?",
                "answer": "Sí. Puede establecer sus propias reglas (**tarifas de limpieza, restricciones de remolque, sanciones por mal uso**), pero deben **divulgarse claramente** en su listado."
            },
            {
                "question": "¿Cómo puedo mejorar la visibilidad de mi remolque?",
                "answer": "Utilice **fotos de alta calidad**, **descripciones detalladas**, **precios justos** y mantenga una **buena tasa de respuesta**. Los propietarios verificados con buenas calificaciones aparecen más arriba en los resultados de búsqueda."
            },
            {
                "question": "¿Cómo manejo la devolución de combustible o equipo?",
                "answer": "Puede especificar en su listado si el combustible/equipo debe devolverse en las mismas condiciones. Siempre documente la condición al recoger y devolver."
            },
            {
                "question": "¿Puedo reportar a un mal inquilino?",
                "answer": "Sí. Después de que finalice el alquiler, puede dejar una **reseña** e **informar cualquier incidente grave** al equipo de confianza y seguridad de Lorepa. El abuso repetido puede resultar en la prohibición del inquilino."
            }
        ],
        "global": [
            {
                "question": "¿Lorepa ofrece cobertura de seguro?",
                "answer": "Sí. Lorepa ofrece una **cobertura de seguro opcional** a partir de **$10 por día**. Este seguro proporciona protección contra **robo y ciertos tipos de daños** durante un alquiler. Si un inquilino se suscribe a este seguro, puede reducir o eliminar el depósito que de otro modo se requeriría."
            },
            {
                "question": "¿Lorepa está disponible en EE. UU.?",
                "answer": "Lorepa se enfoca actualmente en **Canadá**. El uso transfronterizo solo está permitido con el **consentimiento del propietario y la documentación adecuada**."
            },
            {
                "question": "¿Quién es responsable en caso de accidente o robo?",
                "answer": "Los **inquilinos son responsables** de cualquier daño o pérdida durante el alquiler. En casos graves, pueden aplicarse **informes policiales, reclamaciones de seguros y mediación de la plataforma**."
            }
        ]
    },
    "cn": {
        "guests": [
            {
                "question": "在 Lorepa 租用拖车需要什么？",
                "answer": "要租用拖车，您必须**年满 21 岁**，持有**有效驾驶执照**，并提供**保险证明 (FAQ27)**。您还需要一个**经过验证的 Lorepa 账户**。"
            },
            {
                "question": "租赁流程是怎样的？",
                "answer": "您可以浏览可用的拖车，向车主发送请求，一旦获得批准，即可**确认您的预订**。**租赁合同**和**检查照片**会自动生成。"
            },
            {
                "question": "Lorepa 提供租赁保险吗？",
                "answer": "是的。Lorepa 提供**可选的保险**，每天 **10 加元**起。此保护旨在涵盖租赁期间与拖车相关的**意外损坏、盗窃和有限责任**。"
            },
            {
                "question": "我可以取消我的预订吗？",
                "answer": "是的，您可以根据我们的**取消政策**中描述的条款取消。退款可能会根据取消时间相对于开始日期的不同而有所不同。"
            },
            {
                "question": "如果我迟还拖车会怎样？",
                "answer": "**迟还**可能会产生**固定罚金**，如使用条款中所述。如果延迟，请务必通知车主，以避免争议。"
            },
            {
                "question": "如果拖车在我的旅途中损坏了怎么办？",
                "answer": "您对租赁期间的**任何损坏负责**。损坏费用可能会从您的押金中扣除或直接收取，具体取决于损坏的严重程度和证明。"
            },
            {
                "question": "付款和押金如何处理？",
                "answer": "付款通过 **Stripe** 安全处理。**安全押金**在租赁期间持有，如果未报告任何问题，将在 **7 天内**解除。"
            },
            {
                "question": "如果我选择保险，押金会怎样？",
                "answer": "有保险：您的押金可能会**减少或免除**，具体取决于您选择的保障级别。\n\n无保险：适用车主设定的**全额押金**，并且您对任何损坏或损失负**全部责任**。"
            },
            {
                "question": "我需要特殊的拖车驾照吗？",
                "answer": "在大多数加拿大省份，标准**5 级驾照**足以拖曳小型拖车。但是，您有责任确保您符合当地要求，并且您的车辆被评定为可以拖曳所选拖车。"
            },
            {
                "question": "有哪些类型的拖车可用？",
                "answer": "Lorepa 提供**多用途拖车、封闭式货运拖车、汽车运输车、摩托车拖车**等。您可以按类别、尺寸或位置进行筛选。"
            },
            {
                "question": "我可以在哪里拖车？",
                "answer": "大多数拖车可以在**加拿大境内**拖曳。如果计划**跨境旅行**（例如，前往美国），请先与车主核实并在您的请求中提及。"
            },
            {
                "question": "我可以租用拖车进行单程旅行吗？",
                "answer": "大多数租赁都是**往返**的。如果您需要**单程租赁**，请直接联系车主或查看提供灵活还车选项的房源。"
            },
            {
                "question": "有任何隐藏费用吗？",
                "answer": "**没有隐藏费用**。所有费用都预先显示。如果未遵守某些规定（例如，清洁费、额外天数、超里程），可能会增加一些额外费用。"
            },
            {
                "question": "如何联系客户支持？",
                "answer": "您可以通过应用程序或网站上的**聊天功能**，或通过电子邮件 **support@lorepa.ca** 联系我们的支持团队。回复时间通常在 **24 小时内**。"
            }
        ],
        "hosts": [
            {
                "question": "如何列出我的拖车？",
                "answer": "您可以通过注册、填写关键详细信息（**描述、可用性、定价**）、上传照片并提供所需文件（**注册、保险**）来列出您的拖车。"
            },
            {
                "question": "我可以通过 Lorepa 赚多少钱？",
                "answer": "您保留租金价格的 **85%**。剩下的 **15%** 用于支付 Lorepa 的服务费。付款通过 **Stripe** 在租赁结束后 **3-5 个工作日内**自动处理。"
            },
            {
                "question": "我可以取消预订吗？",
                "answer": "是的，但车主每 **6 个月**只允许**免费取消 2 次**。在此之后，如果取消在政策范围内，则会处以 **100 加元的罚款**。滥用取消将受到账户审核。"
            },
            {
                "question": "如果我的拖车逾期或损坏了怎么办？",
                "answer": "您可以在 **24 小时内**通过平台报告任何问题。Lorepa 可以协助从租户押金中扣除罚款或损坏费用。"
            },
            {
                "question": "我可以选择谁租用我的拖车吗？",
                "answer": "是的。您可以在**接受**请求之前**查看租户的个人资料、文件和评分**。您没有义务接受每个预订。"
            },
            {
                "question": "税费如何处理？",
                "answer": "您有**责任**报告您的收入并管理您的税费。Lorepa 可能会提供年度收入摘要，但**不会代表您代缴税费**。"
            },
            {
                "question": "我可以要求清洁费或额外条件吗？",
                "answer": "是的。您可以设置自己的规则（**清洁费、拖曳限制、误用罚款**），但必须在您的房源中**明确披露**。"
            },
            {
                "question": "如何提高我的拖车可见度？",
                "answer": "使用**高质量的照片**、**详细的描述**、**公平的定价**，并保持**良好的回复率**。拥有良好评价的经过验证的车主在搜索结果中排名更高。"
            },
            {
                "question": "如何处理燃油或设备归还？",
                "answer": "您可以在您的房源中指定燃油/设备是否必须以相同条件归还。始终在取车和还车时记录情况。"
            },
            {
                "question": "我可以举报不良租户吗？",
                "answer": "是的。租赁结束后，您可以留下**评论**并将**任何严重事件**报告给 Lorepa 的信任与安全团队。重复滥用可能会导致租户被禁。"
            }
        ],
        "global": [
            {
                "question": "Lorepa 提供保险范围吗？",
                "answer": "是的。Lorepa 提供**可选的保险**，每天 **10 加元**起。此保险为租赁期间的**盗窃和某些类型的损坏**提供保护。如果租户订阅此保险，则可以减少或免除原本需要支付的押金。"
            },
            {
                "question": "Lorepa 在美国可用吗？",
                "answer": "Lorepa 目前专注于**加拿大**。**只有在车主同意和提供适当文件**的情况下才允许跨境使用。"
            },
            {
                "question": "发生事故或盗窃时谁负责？",
                "answer": "**租户对租赁期间的任何损坏或损失负责**。在严重情况下，可能适用**警方报告、保险索赔和平台调解**。"
            }
        ]
    },
    "fr": {
        "guests": [
            {
                "question": "De quoi ai-je besoin pour louer une remorque sur Lorepa ?",
                "answer": "Pour louer une remorque, vous devez avoir au moins **21 ans**, posséder un **permis de conduire valide** et fournir une **preuve d'assurance (FAQ27)**. Vous aurez également besoin d'un **compte Lorepa vérifié**."
            },
            {
                "question": "Comment fonctionne le processus de location ?",
                "answer": "Vous parcourez les remorques disponibles, envoyez une demande au propriétaire, et une fois approuvée, **confirmez votre réservation**. Un **contrat de location** et des **photos d'inspection** sont générés automatiquement."
            },
            {
                "question": "Lorepa propose-t-elle une assurance pour la location ?",
                "answer": "Oui. Lorepa propose une **assurance optionnelle** à partir de **10 $ par jour**. Cette protection est conçue pour couvrir les **dommages accidentels, le vol et la responsabilité limitée** liés à la remorque pendant la période de location."
            },
            {
                "question": "Puis-je annuler ma réservation ?",
                "answer": "Oui, vous pouvez annuler selon les termes décrits dans notre **politique d'annulation**. Les remboursements peuvent varier en fonction du moment de l'annulation par rapport à la date de début."
            },
            {
                "question": "Que se passe-t-il si je retourne la remorque en retard ?",
                "answer": "Les **retours tardifs** peuvent entraîner des **frais de pénalité fixes**, comme indiqué dans les Conditions d'utilisation. Avertissez toujours le propriétaire en cas de retard pour éviter les litiges."
            },
            {
                "question": "Que se passe-t-il si la remorque est endommagée pendant mon voyage ?",
                "answer": "Vous êtes **responsable de tout dommage** pendant la période de location. Les coûts des dommages peuvent être déduits de votre dépôt ou facturés directement, selon la gravité et la preuve."
            },
            {
                "question": "Comment sont gérés les paiements et les dépôts ?",
                "answer": "Les paiements sont traités en toute sécurité via **Stripe**. Un **dépôt de garantie** est détenu pendant la période de location et libéré dans les **7 jours** si aucun problème n'est signalé."
            },
            {
                "question": "Qu'advient-il du dépôt de garantie si je choisis l'assurance ?",
                "answer": "Avec l'assurance : votre dépôt peut être **réduit ou annulé**, selon le niveau de couverture que vous avez choisi.\n\nSans assurance : le **dépôt total** fixé par le propriétaire s'applique et vous restez **entièrement responsable** de tout dommage ou perte."
            },
            {
                "question": "Ai-je besoin d'un permis de remorquage spécial ?",
                "answer": "Dans la plupart des provinces canadiennes, un **permis de classe 5 standard** est suffisant pour les petites remorques. Cependant, il est de votre responsabilité de vous assurer que vous respectez les exigences locales et que votre véhicule est homologué pour remorquer la remorque sélectionnée."
            },
            {
                "question": "Quels types de remorques sont disponibles ?",
                "answer": "Lorepa propose des **remorques utilitaires, des remorques cargo fermées, des transporteurs de voitures, des remorques pour motos**, et plus encore. Vous pouvez filtrer par catégorie, taille ou emplacement."
            },
            {
                "question": "Où puis-je remorquer la remorque ?",
                "answer": "La plupart des remorques peuvent être remorquées au **Canada**. Si un **voyage transfrontalier** (par exemple, vers les États-Unis) est prévu, vérifiez d'abord avec le propriétaire et mentionnez-le dans votre demande."
            },
            {
                "question": "Puis-je louer une remorque pour un aller simple ?",
                "answer": "La plupart des locations sont **aller-retour**. Si vous avez besoin d'une **location aller simple**, contactez directement le propriétaire ou vérifiez les annonces avec des options de retour flexibles."
            },
            {
                "question": "Y a-t-il des frais cachés ?",
                "answer": "**Pas de frais cachés**. Tous les frais sont affichés à l'avance. Des extras (par exemple, nettoyage, jours supplémentaires, dépassement de kilométrage) peuvent être ajoutés si les conditions ne sont pas respectées."
            },
            {
                "question": "Comment contacter le service client ?",
                "answer": "Vous pouvez joindre notre équipe de support via la **fonction de chat** sur l'application ou le site web, ou par e-mail à **support@lorepa.ca**. Le temps de réponse est généralement inférieur à **24h**."
            }
        ],
        "hosts": [
            {
                "question": "Comment puis-je lister ma remorque ?",
                "answer": "Vous pouvez lister votre remorque en vous inscrivant, en remplissant les détails clés (**description, disponibilité, prix**), en téléchargeant des photos et en fournissant les documents requis (**immatriculation, assurance**)."
            },
            {
                "question": "Combien puis-je gagner avec Lorepa ?",
                "answer": "Vous conservez **85%** du prix de la location. Les **15%** restants couvrent les frais de service de Lorepa. Les paiements sont traités automatiquement via **Stripe** dans les **3 à 5 jours ouvrables** après la fin de la location."
            },
            {
                "question": "Puis-je annuler une réservation ?",
                "answer": "Oui, mais les propriétaires ne sont autorisés à annuler que **2 fois gratuitement tous les 6 mois**. Après cela, une **pénalité de 100 $ CA** s'applique si l'annulation est conforme à la politique. L'abus d'annulations est soumis à un examen du compte."
            },
            {
                "question": "Que se passe-t-il si ma remorque est retournée en retard ou endommagée ?",
                "answer": "Vous pouvez signaler tout problème via la plateforme dans les **24 heures**. Lorepa peut aider à déduire les pénalités ou les coûts des dommages du dépôt du locataire."
            },
            {
                "question": "Puis-je choisir qui loue ma remorque ?",
                "answer": "Oui. Vous pouvez **examiner le profil, les documents et les évaluations du locataire** avant d'**accepter** une demande. Vous n'êtes pas obligé d'accepter chaque réservation."
            },
            {
                "question": "Comment les impôts sont-ils gérés ?",
                "answer": "Vous êtes **responsable** de déclarer vos revenus et de gérer vos impôts. Lorepa peut fournir des résumés de revenus annuels, mais **ne remet pas les impôts** en votre nom."
            },
            {
                "question": "Puis-je exiger des frais de nettoyage ou des conditions supplémentaires ?",
                "answer": "Oui. Vous pouvez définir vos propres règles (**frais de nettoyage, restrictions de remorquage, pénalités pour mauvaise utilisation**), mais elles doivent être **clairement divulguées** dans votre annonce."
            },
            {
                "question": "Comment puis-je améliorer la visibilité de ma remorque ?",
                "answer": "Utilisez des **photos de haute qualité**, des **descriptions détaillées**, des **prix équitables** et maintenez un **bon taux de réponse**. Les propriétaires vérifiés avec de bonnes évaluations apparaissent plus haut dans les résultats de recherche."
            },
            {
                "question": "Comment gérer le carburant ou le retour d'équipement ?",
                "answer": "Vous pouvez spécifier dans votre annonce si le carburant/l'équipement doit être retourné dans le même état. Toujours documenter l'état au moment de la prise en charge et du retour."
            },
            {
                "question": "Puis-je signaler un mauvais locataire ?",
                "answer": "Oui. Une fois la location terminée, vous pouvez laisser un **avis** et **signaler tout incident grave** à l'équipe de confiance et de sécurité de Lorepa. Les abus répétés peuvent entraîner l'interdiction du locataire."
            }
        ],
        "global": [
            {
                "question": "Lorepa offre-t-elle une couverture d'assurance ?",
                "answer": "Oui. Lorepa propose une **assurance optionnelle** à partir de **10 $ par jour**. Cette assurance offre une protection contre **le vol et certains types de dommages** pendant une location. Si un locataire souscrit à cette assurance, cela peut réduire ou annuler le dépôt qui serait autrement requis."
            },
            {
                "question": "Lorepa est-elle disponible aux États-Unis ?",
                "answer": "Lorepa se concentre actuellement sur le **Canada**. L'utilisation transfrontalière n'est autorisée qu'avec le **consentement du propriétaire et une documentation appropriée**."
            },
            {
                "question": "Qui est responsable en cas d'accident ou de vol ?",
                "answer": "Les **locataires sont responsables** de tout dommage ou perte pendant la location. Dans les cas graves, des **rapports de police, des réclamations d'assurance et une médiation de la plateforme** peuvent s'appliquer."
            }
        ]
    }
}

const AccordionItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="border border-[#EEEEEE] rounded-md mb-3 bg-white overflow-hidden"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left font-medium text-black"
            >
                {question}
                {isOpen ? <FaAngleUp /> : <FaAngleDown />}
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="answer"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-4 pb-4 text-gray-700 text-sm"
                    >
                        {answer}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const FaqPage = () => {
    const [activeTab, setActiveTab] = useState('Guests');

    // State for current language and corresponding translations
    const [currentLang, setCurrentLang] = useState(() => localStorage.getItem('lang') || 'en');
    const [translations, setTranslations] = useState(faqPageTranslations[currentLang]);
    const [currentFaqContent, setCurrentFaqContent] = useState(faqContent[currentLang]);

    useEffect(() => {
        window.scrollTo(0, 0);

        const handleStorageChange = () => {
            const storedLang = localStorage.getItem('lang');
            setCurrentLang(storedLang || 'en');
            setTranslations(faqPageTranslations[storedLang] || faqPageTranslations.fr);
            setCurrentFaqContent(faqContent[storedLang] || faqContent.fr);
        };

        window.addEventListener('storage', handleStorageChange);
        handleStorageChange(); // Initial check

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const displayedFAQs = activeTab === 'Guests'
        ? [...currentFaqContent.guests, ...currentFaqContent.global]
        : [...currentFaqContent.hosts, ...currentFaqContent.global];

    return (
        <div className="min-h-screen text-black bg-[#F9FAFB]">
            <Navbar />

            <div className="p-4">
                {/* Title */}
                <motion.h1
                    className="text-2xl sm:text-3xl font-bold text-center mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {translations.faqTitle}
                </motion.h1>

                {/* Tabs */}
                <div className="flex justify-center mb-6 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('Guests')}
                        className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 text-base sm:text-lg font-medium transition-colors duration-200 ${activeTab === 'Guests' ? 'bg-white border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {translations.guestsTab}
                    </button>
                    <button
                        onClick={() => setActiveTab('Hosts')}
                        className={`flex-1 sm:flex-none px-4 sm:px-8 py-3 text-base sm:text-lg font-medium transition-colors duration-200 ${activeTab === 'Hosts' ? 'bg-white border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {translations.hostsTab}
                    </button>
                </div>

                {/* Accordion Content */}
                <motion.div
                    className="space-y-3 max-w-3xl mx-auto"
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                >
                    {displayedFAQs.map((faq, i) => (
                        <motion.div key={i} custom={i} variants={fadeInUp}>
                            <AccordionItem question={faq.question} answer={faq.answer} />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    className="text-center mt-12 p-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <p className="text-base sm:text-lg text-gray-700 mb-6">{translations.noAnswer}</p>
                    <button className="mobile-btn-primary px-10">
                        {translations.contactUsButton}
                    </button>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
};

export default FaqPage;