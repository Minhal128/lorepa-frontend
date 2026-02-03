import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.5 },
    }),
};

// --- Translations Object ---
const termsTranslations = {
    en: {
        pageTitle: "Terms of Use",
        sections: [
            {
                title: "1. Purpose of the Terms of Use",
                content: `These Terms of Use (hereinafter the "Terms") are intended to define the terms and conditions under which the company operating Lorepa (hereinafter the "Company") provides users (hereinafter the "Users" or "User") access to the Lorepa platform, available via its website and mobile application (hereinafter the "Platform"), as well as the conditions for using the services offered.`,
            },
            {
                title: "2. Acceptance of the Terms of Use",
                content: `By accessing and/or using the Platform, the User acknowledges having read and unconditionally accepted these Terms. If the User does not accept all or part of the Terms, they are requested not to use the Platform.`,
            },
            {
                title: "3. Modification of the Terms",
                content: `The Company reserves the right to modify these Terms at any time. Any modification takes effect immediately upon being posted on the Platform. Users are encouraged to regularly review the Terms to stay informed of any updates. Continued use of the Platform after such modifications constitutes implicit acceptance of the revised Terms.`,
            },
            {
                title: "4. Access to the Platform",
                content: `The Platform is accessible free of charge to any User with Internet access. All costs related to access to the Platform (hardware, software, Internet connection, etc.) are borne exclusively by the User. The Company reserves the right, without prior notice or compensation, to temporarily or permanently shut down access to all or part of the Platform, especially for updates, maintenance, or content changes.`,
            },
            {
                title: "5. Registration and Account Creation",
                content: (
                    <>
                        <h3 className='font-semibold mt-2'>5.1. Registration Requirements</h3>
                        <p>To access trailer rental services or offer a trailer for rent via the Platform, the User must create a personal account by providing accurate, complete, and up-to-date information. Registration is reserved for individuals aged 18 or older who have the legal capacity to enter into a contract.</p>
                        <h3 className='font-semibold mt-2'>5.2. Account Obligations</h3>
                        <p>The User agrees to:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Maintain the confidentiality of their login credentials;</li>
                            <li>Immediately notify the Company of any unauthorized use of their account;</li>
                            <li>Not create or use other accounts without prior authorization.</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "6. Services Offered by the Platform",
                content: `Lorepa connects trailer owners (hereinafter "Owners") with renters (hereinafter "Renters") for peer-to-peer trailer rentals. The Platform allows: Owners to publish listings for their trailers; Renters to search for and book trailers; Management of payments, electronic signing of rental agreements, and email delivery of rental documents (PDF contracts, photos, etc.).`,
            },
            {
                title: "7. Specific Conditions for Renters",
                content: (
                    <>
                        <h3 className='font-semibold mt-2'>7.1. Required Documents</h3>
                        <p>To rent a trailer via the Platform, the Renter must provide the following documents during registration:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>A valid copy of their driver’s license;</li>
                            <li>Proof of automobile insurance including endorsement FAQ 27 (coverage for non-owned vehicles);</li>
                            <li>The vehicle registration certificate.</li>
                        </ul>
                        <p>These documents must be valid, legible, and approved by the Company before any booking can be made.</p>
                        <h3 className='font-semibold mt-2'>7.2. Renter Obligations</h3>
                        <p>The Renter agrees to:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Use the trailer in accordance with its intended purpose and applicable laws;</li>
                            <li>Return the trailer on the agreed date and location in its original condition;</li>
                            <li>Report any damage or incident occurring during the rental.</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "8. Specific Conditions for Owners",
                content: (
                    <>
                        <h3 className='font-semibold mt-2'>8.1. Required Documents</h3>
                        <p>To list a trailer on the Platform, the Owner must provide:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>A valid copy of their driver’s license;</li>
                            <li>Proof of insurance covering the trailer;</li>
                            <li>The trailer registration certificate.</li>
                        </ul>
                        <h3 className='font-semibold mt-2'>8.2. Owner Obligations</h3>
                        <p>The Owner agrees to:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Offer a trailer in good working condition, safe, and compliant with applicable standards;</li>
                            <li>Provide truthful and up-to-date information about the trailer's condition;</li>
                            <li>Be available for trailer pickup and return according to the agreed schedule.</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "9. Pricing and Payment",
                content: (
                    <>
                        <h3 className='font-semibold mt-2'>9.1. Commission and Service Fees</h3>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>A 15% commission is charged on each transaction made by an Owner;</li>
                            <li>A 5% service fee is applied to each transaction paid by a Renter.</li>
                        </ul>
                        <h3 className='font-semibold mt-2'>9.2. Payment Terms</h3>
                        <p>Payments are processed online via the Stripe platform. The rental amount is charged at the time of booking. After deducting applicable commissions and fees, the funds are transferred to the Owner according to Stripe’s processing timelines.</p>
                        <h3 className='font-semibold mt-2'>9.3. Taxes and Additional Fees</h3>
                        <p>Displayed prices include applicable taxes. Additional fees may apply for optional services or in cases of non-compliance with rental terms (e.g., late return, damage, etc.).</p>
                    </>
                ),
            },
            {
                title: "10. Security Deposit and Guarantee Fund",
                content: (
                    <>
                        <h3 className='font-semibold mt-2'>10.1. Security Deposit</h3>
                        <p>Lorepa reserves the right to pre-authorize or charge a security deposit to the Renter’s credit card to cover potential damages, theft, delays, or additional charges.</p>
                        <p>The deposit amount varies depending on several factors, such as the trailer’s value, rental type, user behavior, and whether the optional Lorepa insurance is selected.</p>
                        <p>If the Renter chooses the optional Lorepa insurance, the deposit amount is reduced. Without this insurance, a higher deposit is required to cover potential risks. The exact amount is communicated at the time of booking and must be accepted for the rental to be confirmed.</p>
                        <p>Lorepa reserves the right to retain all or part of the deposit in case of damage, breach of these Terms, or unpaid fees. The deposit is generally refunded within 5 to 10 business days after the end of the rental, pending inspection.</p>
                        <p>Owners may also require a security deposit to cover potential damage or loss. The amount is listed in the rental listing.</p>
                        <h3 className='font-semibold mt-2'>10.2. Security Deposit and Insurance</h3>
                        <p>A security deposit may be required for each rental. The exact amount is confirmed upon reservation and may vary depending on the trailer and total rental value.</p>
                        <p>The deposit is temporarily charged or held on the Renter’s payment method at the time of the rental and serves to cover any costs resulting from damage, loss, theft, delay, or other violations of the Terms.</p>
                        <h4 className='font-semibold mt-2'>Lorepa Insurance and Impact on Deposit</h4>
                        <p>If the Renter selects Lorepa’s optional insurance, the required deposit may be reduced. Otherwise, a higher deposit may apply. This policy follows industry standards of platforms such as Turo, Towlos, and Neighbor Trailers.</p>
                        <p>Lorepa may use all or part of the deposit to cover expenses related to any breach of these Terms. Any unused portion of the deposit will be refunded within a reasonable timeframe after the rental, once verification is complete.</p>
                        <h3 className='font-semibold mt-2'>10.3. Insurance and Guarantee Fund</h3>
                        <p>Lorepa offers additional coverage for damage or theft through a guarantee fund accessible via an optional insurance at $10 per rental day. This option can be activated at the time of booking.</p>
                        <h3 className='font-semibold mt-2'>10.4. Use of the Guarantee Fund</h3>
                        <p>The guarantee fund is used solely in the case of a reported and documented incident (with photos and reports). Activation of this mechanism is subject to approval by the Company.</p>
                    </>
                ),
            },
            {
                title: "11. User Responsibility",
                content: `Each User is solely responsible for their use of the Platform, the information they provide, and the goods they rent. The User agrees to indemnify Lorepa for any damage, loss, or expense resulting from a violation of the Terms or any illegal activity conducted through the Platform.`,
            },
            {
                title: "12. Eligibility Requirements",
                content: (
                    <>
                        <p>To use the Lorepa platform, you must:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Be at least 21 years old.</li>
                            <li>Be a resident of Canada with a valid government-issued ID.</li>
                            <li>Hold a valid driver’s license (appropriate class) if you are a renter or an owner who will tow the trailer.</li>
                            <li>In the case of owners, hold valid trailer registration and liability insurance.</li>
                        </ul>
                        <p>Lorepa reserves the right to deny access or suspend an account if these conditions are not met.</p>
                    </>
                ),
            },
            {
                title: "13. User Registration",
                content: (
                    <>
                        <p>Registration on Lorepa is free. Users must provide accurate, up-to-date, and complete information, including:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Full name,</li>
                            <li>Valid email address,</li>
                            <li>Verified phone number,</li>
                            <li>Complete mailing address.</li>
                        </ul>
                        <p>To complete the registration, certain verifications may be required, including but not limited to:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Uploading a driver’s license,</li>
                            <li>Proof of insurance (FAQ 27 endorsement for renters),</li>
                            <li>Vehicle or trailer registration document.</li>
                        </ul>
                        <p>Lorepa reserves the right to suspend or delete any account in the event of false statements or attempts to bypass verification requirements.</p>
                    </>
                ),
            },
            {
                title: "14. Listing and Managing Trailers",
                content: (
                    <>
                        <p>Any owner wishing to list a trailer on Lorepa must:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Create a complete listing with real photos,</li>
                            <li>Provide technical specifications and usage conditions,</li>
                            <li>Set a daily rental price,</li>
                            <li>Set availability.</li>
                        </ul>
                        <p>The owner is responsible for:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>The accuracy of the information provided,</li>
                            <li>Regular updates to their listing,</li>
                            <li>Honoring all commitments related to accepted reservations.</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "15. Booking Process",
                content: `All trailer bookings must be made exclusively through the Lorepa platform. The process includes: A booking request by the renter, Manual or automatic acceptance by the owner, Secure payment by credit card, Trailer handover as per the agreed terms. Any attempt to arrange rentals outside the platform is a serious breach of these Terms of Use and will result in immediate account suspension.`,
            },
            {
                title: "16. Security Deposit",
                content: (
                    <>
                        <p>A security deposit is charged for every reservation. This amount:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Is held on the renter’s credit card for the duration of the rental,</li>
                            <li>Is used to cover damages, late returns, or violations,</li>
                            <li>Is automatically refunded within 5 to 10 business days if no issues are reported.</li>
                        </ul>
                        <p>Lorepa may, at the owner’s request or after evaluation, withhold part or all of the deposit in the event of damages or contract violations.</p>
                    </>
                ),
            },
            {
                title: "17. Additional Charges and Damages",
                content: (
                    <>
                        <p>The renter is responsible for any damage, theft, or loss incurred during the rental period.</p>
                        <p>The owner must report any incident within 24 hours of the trailer's return, including photos and a description.</p>
                        <p>Lorepa reserves the right to:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Charge the renter for repair costs,</li>
                            <li>Use the security deposit to cover such costs,</li>
                            <li>Remove users who repeatedly cause incidents or abuse the service.</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "18. Insurance",
                content: `Lorepa is not an insurance provider. Renters must provide proof of personal auto insurance including the FAQ 27 endorsement, which covers trailer rentals. Owners must maintain valid liability insurance for their trailer. In the absence of adequate insurance, the user is personally liable for any property or bodily damage incurred.`,
            },
            {
                title: "19. Owner Responsibilities",
                content: `Owners are solely responsible for ensuring that their trailers meet safety standards, are properly maintained, insured, and registered in compliance with applicable laws. The owner must provide accurate information about the trailer, including its specifications, conditions, and availability. Lorepa reserves the right to remove any trailer from the platform if these requirements are not met.`,
            },
            {
                title: "20. Renter Responsibilities",
                content: `Renters agree to use trailers in a careful, lawful, and responsible manner. They must inspect the trailer before use, report any pre-existing damage, and return it in the same condition as received. Any negligence, misuse, or damage may result in additional fees.`,
            },
            {
                title: "21. Pre- and Post-Rental Inspection and Documentation",
                content: `Before each rental, the renter must upload clear photos of the trailer (front, rear, both sides) to document its condition. The same photos must be provided at the end of the rental. These images form part of the rental agreement and may be used as evidence in the event of a dispute.`,
            },
            {
                title: "22. Insurance and Coverage",
                content: `Renters are required to provide valid proof of automobile insurance including the FAQ 27 endorsement. Owners must also provide proof of insurance covering the trailer. Lorepa may, at its discretion, offer optional coverage or a damage protection fund, but does not guarantee its effectiveness or legal applicability. All coverage is subject to full compliance with these Terms of Use.`,
            },
            {
                title: "23. Late Return Penalties",
                content: `If the trailer is not returned by the renter at the agreed date and time, if the renter fails to cooperate in arranging the trailer's return, or if the required recovery fees are not paid in advance, the renter will be charged a minimum penalty of $500, plus $7 per kilometer traveled (round trip) to retrieve the trailer. These amounts may be increased at the discretion of the owner. Lorepa reserves the right to impose or collect these fees as applicable.`,
            },
            {
                title: "24. No Warranty",
                content: `The renter acknowledges that the trailer is rented “as is,” with no express or implied warranty regarding its functionality, mechanical condition, or fitness for a particular purpose. Neither the owner nor Lorepa guarantees that the trailer will meet the renter’s expectations or needs, nor that it will be free from mechanical or cosmetic defects.`,
            },
            {
                title: "25. Rental Agreement",
                content: (
                    <>
                        <p>An electronic rental agreement is emailed at the beginning of each booking. This document governs the relationship between the owner and the renter. Lorepa is not a party to any verbal or written agreement between users beyond this rental contract.</p>
                        <p>If an owner uses a personal agreement in addition to this contract, it must not contradict or override these Terms of Use or any Lorepa policies.</p>
                    </>
                ),
            },
            {
                title: "26. Communication Rules and Platform Circumvention Prohibition",
                content: (
                    <>
                        <p>Using the Lorepa platform implies professional and respectful behavior. Abusive, offensive, or threatening lang will result in immediate or permanent account suspension.</p>
                        <p>Users are strictly prohibited from bypassing the platform, including by sharing direct contact information (e.g., phone number, email address, website URL, social media handle, company name, logo, etc.) before a reservation is accepted.</p>
                        <p>Any content violating this rule will be removed without notice, and the user may face permanent suspension or other actions under Lorepa’s service abuse policy.</p>
                    </>
                ),
            },
            {
                title: "27. Fees and Commissions",
                content: (
                    <>
                        <p>Trailer listings are free.</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>A 15% commission is charged on each reservation (excluding the security deposit), payable by the owner.</li>
                        </ul>
                        <p>The renter pays:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>A 5% service fee.</li>
                        </ul>
                        <p>These fees support the platform's maintenance, customer service, security, and visibility.</p>
                    </>
                ),
            },
            {
                title: "28. Trailer Listing Standards",
                content: (
                    <>
                        <p>Listings must include:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>A detailed description of at least 200 characters.</li>
                            <li>A minimum of 4 actual and unique photos of the trailer.</li>
                            <li>The precise location (city) in Québec.</li>
                            <li>A fair and competitive rate.</li>
                        </ul>
                        <p>Images and descriptions must not contain direct contact information, business logos, trade names, or any detail allowing users to bypass the platform. Manufacturer logos are permitted if they contain no contact information.</p>
                        <p>Lorepa reserves the right to modify or remove any listing that fails to comply with these standards and to use the photos for advertising purposes under the rights granted upon submission.</p>
                        <p>It is prohibited to list a trailer solely for promoting a transport service or if the trailer has a salvage title.</p>
                    </>
                ),
            },
            {
                title: "29. Trailer Owner Obligations",
                content: (
                    <>
                        <p>Owners must:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Read the “Getting Started” and “Rental Process” guides available in their dashboard.</li>
                            <li>Manage their bookings, extensions, and communications themselves.</li>
                            <li>Respond to inquiries promptly (ideally within 1 hour).</li>
                            <li>Accept or decline requests within 24 hours. After this period, the request may be automatically declined.</li>
                        </ul>
                        <p>Once a booking is accepted, the owner is contractually obligated to provide the trailer as agreed. In the case of an unjustified cancellation by the owner, Lorepa reserves the right to charge the full service fees, including credit card and advertising costs.</p>
                        <p>The owner must be present at both handover and return, take at least 4 photos before and after each rental, and document any damages during the rental period using the procedure provided in the user dashboard.</p>
                        <p>The owner is responsible for:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Starting the rental using the “Start Rental” option,</li>
                            <li>Ending the rental using the “End Rental” option, once the trailer has been returned.</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "30. Failure to Comply with Rental Procedures",
                content: (
                    <>
                        <p>Failure to comply with required procedures (e.g., not starting or ending the rental within the required timeframe) constitutes a breach of these terms.</p>
                        <p>Lorepa may:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Cancel any active or accepted booking,</li>
                            <li>Suspend or delete the user’s account,</li>
                            <li>Withhold payments related to the transaction,</li>
                            <li>Apply penalties at its discretion, depending on the circumstances and proof of trailer possession by the renter.</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "31. Trailer Maintenance and Safety",
                content: (
                    <>
                        <p>The owner agrees to provide a trailer that is:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Mechanically safe, functional, and clean,</li>
                            <li>Registered with a valid license plate,</li>
                            <li>Displaying a VIN sticker and weight specifications,</li>
                            <li>Compliant with safety standards, including a valid DOT inspection if applicable.</li>
                        </ul>
                        <p>The owner is responsible for ensuring the proper condition of all components, including tires, bearings, brakes, springs, electrical systems, hitch, chains, lights, frame, and structure.</p>
                        <p>The owner agrees to indemnify Lorepa for any failure, accident, or miscommunication related to trailer maintenance or specifications.</p>
                    </>
                ),
            },
            {
                title: "32. Owner Payments",
                content: (
                    <>
                        <p>Lorepa manages all payments owed to owners. Once an owner selects the “End Rental” button associated with a completed booking, a payment is automatically initiated the following Monday. This payment is made via Interac e-Transfer, and the funds are deposited into the owner’s designated bank account.</p>
                        <p>To receive payment, the owner must register their banking information under the “My Bank Account” section in their user profile.</p>
                        <p>Lorepa reserves the right to withhold any payment related to a booking deemed fraudulent or suspicious, or involved in a dispute resolved in favor of the cardholder. If a payment has already been issued under such circumstances, the corresponding amount will be deducted from future payments to the owner.</p>
                    </>
                ),
            },
            {
                title: "33. Owner Cancellations",
                content: (
                    <>
                        <p>Owners are entitled to two (2) free cancellations within any rolling six (6)-month period. Any additional cancellations will incur a fee of CAD $100, provided the cancellation is made at least 48 hours before the scheduled start of the rental.</p>
                        <p>Cancellation fees are automatically deducted from the Owner’s next payout. Cancellations are not permitted once the rental has commenced or once the rental process has been initiated through the platform.</p>
                        <p>Cancellations are only permitted in cases of unavoidable circumstances, as determined solely by Lorepa. Any attempt to use cancellations as a means to bypass the platform constitutes a violation of these Terms.</p>
                    </>
                ),
            },
            {
                title: "34. Platform Circumvention and Abuse",
                content: (
                    <>
                        <p>Use of the Lorepa platform strictly prohibits any attempts to bypass the reservation system.</p>
                        <p>It is expressly forbidden for an Owner to:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Exchange contact information prior to an approved reservation;</li>
                            <li>Arrange a meeting location outside the platform;</li>
                            <li>Solicit a Renter to complete a rental transaction outside of Lorepa;</li>
                            <li>Persuade a Renter to cancel a reservation to finalize the rental off-platform.</li>
                        </ul>
                        <p>Any such violation will result in immediate consequences, including but not limited to:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Full charge of applicable fees and commissions;</li>
                            <li>Account suspension or termination;</li>
                            <li>Permanent ban from the Lorepa platform.</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "35. Intellectual Property",
                content: `All content on the Platform (texts, images, videos, logos, trademarks, etc.) is the exclusive property of the Company or its partners and is protected by intellectual property laws. Any reproduction, representation, modification, publication, or adaptation, in whole or in part, of the elements of the Platform, regardless of the means or process used, is prohibited without prior written authorization from the Company.`,
            },
            {
                title: "36. Privacy and Data Protection",
                content: `The Company is committed to protecting the personal data of its Users. All information collected is processed in accordance with the Company's Privacy Policy, which is an integral part of these Terms. Users have the right to access, rectify, delete, and object to the processing of their personal data.`,
            },
            {
                title: "37. Limitation of Liability",
                content: `Lorepa acts as an intermediary platform, connecting owners and renters. The Company is not responsible for the quality, safety, or legality of the trailers listed, nor for the conduct of Users. Lorepa's liability is limited to direct damages proven to be attributable to a fault on its part in the provision of the Platform's services.`,
            },
            {
                title: "38. Indemnification",
                content: `The User agrees to indemnify, defend, and hold harmless Lorepa, its affiliates, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses (including reasonable attorney fees) arising from or in any way connected with their access to or use of the Platform, their violation of these Terms, or their violation of any third-party rights.`,
            },
            {
                title: "39. Governing Law and Jurisdiction",
                content: `These Terms are governed by and construed in accordance with the laws of the Province of Quebec, Canada. Any dispute arising out of or in connection with these Terms shall be submitted to the exclusive jurisdiction of the courts of Quebec, Canada.`,
            },
            {
                title: "40. Contact Us",
                content: (
                    <div className='ml-4'>
                        <p>For any questions regarding these Terms, please contact us:</p>
                        <p>Email: contact@lorepa.com</p>
                        <p>Phone: +1 438 282 6718</p>
                        <p>Address: 3910 Rue de Bellechasse, Montréal, Québec, H1X 1J4</p>
                    </div>
                ),
            },
        ],
    },
    es: {
        pageTitle: "Términos de Uso",
        sections: [
            {
                title: "1. Propósito de los Términos de Uso",
                content: `Estos Términos de Uso (en adelante, los "Términos") tienen como objetivo definir los términos y condiciones bajo los cuales la empresa que opera Lorepa (en adelante, la "Compañía") proporciona a los usuarios (en adelante, los "Usuarios" o "Usuario") acceso a la plataforma Lorepa, disponible a través de su sitio web y aplicación móvil (en adelante, la "Plataforma"), así como las condiciones de uso de los servicios ofrecidos.`,
            },
            {
                title: "2. Aceptación de los Términos de Uso",
                content: `Al acceder y/o utilizar la Plataforma, el Usuario reconoce haber leído y aceptado incondicionalmente estos Términos. Si el Usuario no acepta la totalidad o parte de los Términos, se le solicita que no utilice la Plataforma.`,
            },
            {
                title: "3. Modificación de los Términos",
                content: `La Compañía se reserva el derecho de modificar estos Términos en cualquier momento. Cualquier modificación entra en vigor inmediatamente después de su publicación en la Plataforma. Se anima a los Usuarios a revisar periódicamente los Términos para mantenerse informados de cualquier actualización. El uso continuado de la Plataforma después de dichas modificaciones constituye la aceptación implícita de los Términos revisados.`,
            },
            {
                title: "4. Acceso a la Plataforma",
                content: `La Plataforma es accesible de forma gratuita para cualquier Usuario con acceso a Internet. Todos los costos relacionados con el acceso a la Plataforma (hardware, software, conexión a Internet, etc.) son asumidos exclusivamente por el Usuario. La Compañía se reserva el derecho, sin previo aviso ni compensación, de cerrar temporal o permanentemente el acceso a la totalidad o parte de la Plataforma, especialmente para actualizaciones, mantenimiento o cambios de contenido.`,
            },
            {
                title: "5. Registro y Creación de Cuenta",
                content: (
                    <>
                        <h3 className='font-semibold mt-2'>5.1. Requisitos de Registro</h3>
                        <p>Para acceder a los servicios de alquiler de remolques o ofrecer un remolque en alquiler a través de la Plataforma, el Usuario debe crear una cuenta personal proporcionando información precisa, completa y actualizada. El registro está reservado para personas mayores de 18 años que tengan la capacidad legal para celebrar un contrato.</p>
                        <h3 className='font-semibold mt-2'>5.2. Obligaciones de la Cuenta</h3>
                        <p>El Usuario se compromete a:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Mantener la confidencialidad de sus credenciales de inicio de sesión;</li>
                            <li>Notificar inmediatamente a la Compañía de cualquier uso no autorizado de su cuenta;</li>
                            <li>No crear ni utilizar otras cuentas sin autorización previa.</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "6. Servicios Ofrecidos por la Plataforma",
                content: `Lorepa conecta a propietarios de remolques (en adelante, "Propietarios") con arrendatarios (en adelante, "Arrendatarios") para el alquiler de remolques entre particulares. La Plataforma permite: A los Propietarios publicar anuncios de sus remolques; A los Arrendatarios buscar y reservar remolques; La gestión de pagos, la firma electrónica de contratos de alquiler y la entrega por correo electrónico de documentos de alquiler (contratos PDF, fotos, etc.).`,
            },
            {
                title: "7. Condiciones Específicas para Arrendatarios",
                content: (
                    <>
                        <h3 className='font-semibold mt-2'>7.1. Documentos Requeridos</h3>
                        <p>Para alquilar un remolque a través de la Plataforma, el Arrendatario debe proporcionar los siguientes documentos durante el registro:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Una copia válida de su licencia de conducir;</li>
                            <li>Comprobante de seguro de automóvil que incluya el endoso FAQ 27 (cobertura para vehículos no propios);</li>
                            <li>El certificado de registro del vehículo.</li>
                        </ul>
                        <p>Estos documentos deben ser válidos, legibles y aprobados por la Compañía antes de que se pueda realizar cualquier reserva.</p>
                        <h3 className='font-semibold mt-2'>7.2. Obligaciones del Arrendatario</h3>
                        <p>El Arrendatario se compromete a:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Utilizar el remolque de acuerdo con su propósito previsto y las leyes aplicables;</li>
                            <li>Devolver el remolque en la fecha y lugar acordados en su estado original;</li>
                            <li>Informar cualquier daño o incidente que ocurra durante el alquiler.</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "8. Condiciones Específicas para Propietarios",
                content: (
                    <>
                        <h3 className='font-semibold mt-2'>8.1. Documentos Requeridos</h3>
                        <p>Para publicar un remolque en la Plataforma, el Propietario debe proporcionar:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Una copia válida de su licencia de conducir;</li>
                            <li>Comprobante de seguro que cubra el remolque;</li>
                            <li>El certificado de registro del remolque.</li>
                        </ul>
                        <h3 className='font-semibold mt-2'>8.2. Obligaciones del Propietario</h3>
                        <p>El Propietario se compromete a:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Ofrecer un remolque en buen estado de funcionamiento, seguro y que cumpla con los estándares aplicables;</li>
                            <li>Proporcionar información veraz y actualizada sobre el estado del remolque;</li>
                            <li>Estar disponible para la recogida y devolución del remolque según el horario acordado.</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "9. Precios y Pago",
                content: (
                    <>
                        <h3 className='font-semibold mt-2'>9.1. Comisión y Tarifas de Servicio</h3>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Se cobra una comisión del 15% en cada transacción realizada por un Propietario;</li>
                            <li>Se aplica una tarifa de servicio del 5% a cada transacción pagada por un Arrendatario.</li>
                        </ul>
                        <h3 className='font-semibold mt-2'>9.2. Condiciones de Pago</h3>
                        <p>Los pagos se procesan en línea a través de la plataforma Stripe. El monto del alquiler se cobra en el momento de la reserva. Después de deducir las comisiones y tarifas aplicables, los fondos se transfieren al Propietario de acuerdo con los plazos de procesamiento de Stripe.</p>
                        <h3 className='font-semibold mt-2'>9.3. Impuestos y Tarifas Adicionales</h3>
                        <p>Los precios mostrados incluyen los impuestos aplicables. Se pueden aplicar tarifas adicionales por servicios opcionales o en casos de incumplimiento de los términos de alquiler (por ejemplo, devolución tardía, daños, etc.).</p>
                    </>
                ),
            },
            {
                title: "10. Depósito de Seguridad y Fondo de Garantía",
                content: (
                    <>
                        <h3 className='font-semibold mt-2'>10.1. Depósito de Seguridad</h3>
                        <p>Lorepa se reserva el derecho de preautorizar o cargar un depósito de seguridad en la tarjeta de crédito del Arrendatario para cubrir posibles daños, robos, retrasos o cargos adicionales.</p>
                        <p>El monto del depósito varía según varios factores, como el valor del remolque, el tipo de alquiler, el comportamiento del usuario y si se selecciona el seguro opcional de Lorepa.</p>
                        <p>Si el Arrendatario elige el seguro opcional de Lorepa, el monto del depósito se reduce. Sin este seguro, se requiere un depósito más alto para cubrir posibles riesgos. El monto exacto se comunica en el momento de la reserva y debe ser aceptado para que se confirme el alquiler.</p>
                        <p>Lorepa se reserva el derecho de retener la totalidad o parte del depósito en caso de daños, incumplimiento de estos Términos o tarifas impagas. El depósito generalmente se reembolsa dentro de los 5 a 10 días hábiles posteriores al final del alquiler, pendiente de inspección.</p>
                        <p>Los Propietarios también pueden requerir un depósito de seguridad para cubrir posibles daños o pérdidas. El monto se indica en la lista de alquiler.</p>
                        <h3 className='font-semibold mt-2'>10.2. Depósito de Seguridad y Seguro</h3>
                        <p>Se puede requerir un depósito de seguridad para cada alquiler. El monto exacto se confirma en el momento de la reserva y puede variar según el remolque y el valor total del alquiler.</p>
                        <p>El depósito se carga temporalmente o se retiene en el método de pago del Arrendatario en el momento del alquiler y sirve para cubrir cualquier costo resultante de daños, pérdidas, robos, retrasos u otras violaciones de los Términos.</p>
                        <h4 className='font-semibold mt-2'>Seguro Lorepa e Impacto en el Depósito</h4>
                        <p>Si el Arrendatario selecciona el seguro opcional de Lorepa, el depósito requerido puede reducirse. De lo contrario, se puede aplicar un depósito más alto. Esta política sigue los estándares de la industria de plataformas como Turo, Towlos y Neighbor Trailers.</p>
                        <p>Lorepa puede usar la totalidad o parte del depósito para cubrir los gastos relacionados con cualquier incumplimiento de estos Términos. Cualquier parte no utilizada del depósito se reembolsará en un plazo razonable después del alquiler, una vez que se complete la verificación.</p>
                        <h3 className='font-semibold mt-2'>10.3. Seguro y Fondo de Garantía</h3>
                        <p>Lorepa ofrece cobertura adicional por daños o robos a través de un fondo de garantía accesible mediante un seguro opcional de $10 por día de alquiler. Esta opción se puede activar en el momento de la reserva.</p>
                        <h3 className='font-semibold mt-2'>10.4. Uso del Fondo de Garantía</h3>
                        <p>El fondo de garantía se utiliza únicamente en caso de un incidente reportado y documentado (con fotos e informes). La activación de este mecanismo está sujeta a la aprobación de la Compañía.</p>
                    </>
                ),
            },
            {
                title: "11. Responsabilidad del Usuario",
                content: `Cada Usuario es el único responsable de su uso de la Plataforma, la información que proporciona y los bienes que alquila. El Usuario acepta indemnizar a Lorepa por cualquier daño, pérdida o gasto resultante de una violación de los Términos o cualquier actividad ilegal realizada a través de la Plataforma.`,
            },
            {
                title: "12. Requisitos de Elegibilidad",
                content: (
                    <>
                        <p>Para usar la plataforma Lorepa, debe:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Tener al menos 21 años.</li>
                            <li>Ser residente de Canadá con una identificación válida emitida por el gobierno.</li>
                            <li>Poseer una licencia de conducir válida (clase apropiada) si es un arrendatario o un propietario que remolcará el remolque.</li>
                            <li>En el caso de los propietarios, poseer un registro de remolque y un seguro de responsabilidad civil válidos.</li>
                        </ul>
                        <p>Lorepa se reserva el derecho de denegar el acceso o suspender una cuenta si no se cumplen estas condiciones.</p>
                    </>
                ),
            },
            {
                title: "13. Registro de Usuario",
                content: (
                    <>
                        <p>El registro en Lorepa es gratuito. Los Usuarios deben proporcionar información precisa, actualizada y completa, que incluye:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Nombre completo,</li>
                            <li>Dirección de correo electrónico válida,</li>
                            <li>Número de teléfono verificado,</li>
                            <li>Dirección postal completa.</li>
                        </ul>
                        <p>Para completar el registro, se pueden requerir ciertas verificaciones, que incluyen, entre otras:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Subir una licencia de conducir,</li>
                            <li>Comprobante de seguro (endoso FAQ 27 para arrendatarios),</li>
                            <li>Documento de registro de vehículo o remolque.</li>
                        </ul>
                        <p>Lorepa se reserva el derecho de suspender o eliminar cualquier cuenta en caso de declaraciones falsas o intentos de eludir los requisitos de verificación.</p>
                    </>
                ),
            },
            {
                title: "14. Listado y Gestión de Remolques",
                content: (
                    <>
                        <p>Cualquier propietario que desee listar un remolque en Lorepa debe:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Crear un listado completo con fotos reales,</li>
                            <li>Proporcionar especificaciones técnicas y condiciones de uso,</li>
                            <li>Establecer un precio de alquiler diario,</li>
                            <li>Establecer la disponibilidad.</li>
                        </ul>
                        <p>El propietario es responsable de:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>La precisión de la información proporcionada,</li>
                            <li>Las actualizaciones periódicas de su listado,</li>
                            <li>Cumplir con todos los compromisos relacionados con las reservas aceptadas.</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "15. Proceso de Reserva",
                content: `Todas las reservas de remolques deben realizarse exclusivamente a través de la plataforma Lorepa. El proceso incluye: Una solicitud de reserva por parte del arrendatario, Aceptación manual o automática por parte del propietario, Pago seguro con tarjeta de crédito, Entrega del remolque según los términos acordados. Cualquier intento de organizar alquileres fuera de la plataforma es un incumplimiento grave de estos Términos de Uso y resultará en la suspensión inmediata de la cuenta.`,
            },
            {
                title: "16. Depósito de Seguridad",
                content: (
                    <>
                        <p>Se cobra un depósito de seguridad por cada reserva. Este monto:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Se retiene en la tarjeta de crédito del arrendatario durante la duración del alquiler,</li>
                            <li>Se utiliza para cubrir daños, devoluciones tardías o infracciones,</li>
                            <li>Se reembolsa automáticamente dentro de los 5 a 10 días hábiles si no se reportan problemas.</li>
                        </ul>
                        <p>Lorepa puede, a solicitud del propietario o después de la evaluación, retener parte o la totalidad del depósito en caso de daños o violaciones del contrato.</p>
                    </>
                ),
            },
            {
                title: "17. Cargos Adicionales y Daños",
                content: (
                    <>
                        <p>El arrendatario es responsable de cualquier daño, robo o pérdida incurrida durante el período de alquiler.</p>
                        <p>El propietario debe informar cualquier incidente dentro de las 24 horas posteriores a la devolución del remolque, incluyendo fotos y una descripción.</p>
                        <p>Lorepa se reserva el derecho de:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Cobrar al arrendatario los costos de reparación,</li>
                            <li>Utilizar el depósito de seguridad para cubrir dichos costos,</li>
                            <li>Eliminar a los usuarios que causen incidentes repetidamente o abusen del servicio.</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "18. Seguro",
                content: `Lorepa no es un proveedor de seguros. Los arrendatarios deben proporcionar prueba de seguro de automóvil personal, incluido el endoso FAQ 27, que cubre el alquiler de remolques. Los propietarios deben mantener un seguro de responsabilidad civil válido para su remolque. En ausencia de un seguro adecuado, el usuario es personalmente responsable de cualquier daño a la propiedad o corporal incurrido.`,
            },
            {
                title: "19. Responsabilidades del Propietario",
                content: `Los Propietarios son los únicos responsables de garantizar que sus remolques cumplan con los estándares de seguridad, estén debidamente mantenidos, asegurados y registrados de conformidad con las leyes aplicables. El propietario debe proporcionar información precisa sobre el remolque, incluidas sus especificaciones, condiciones y disponibilidad. Lorepa se reserva el derecho de retirar cualquier remolque de la plataforma si no se cumplen estos requisitos.`,
            },
            {
                title: "20. Responsabilidades del Arrendatario",
                content: `Los arrendatarios aceptan usar los remolques de manera cuidadosa, legal y responsable. Deben inspeccionar el remolque antes de usarlo, informar cualquier daño preexistente y devolverlo en las mismas condiciones en que lo recibieron. Cualquier negligencia, mal uso o daño puede resultar en cargos adicionales.`,
            },
            {
                title: "21. Inspección y Documentación Pre y Post Alquiler",
                content: `Antes de cada alquiler, el arrendatario debe subir fotos claras del remolque (delanteras, traseras, ambos lados) para documentar su estado. Las mismas fotos deben proporcionarse al final del alquiler. Estas imágenes forman parte del contrato de alquiler y pueden usarse como evidencia en caso de disputa.`,
            },
            {
                title: "22. Seguro y Cobertura",
                content: `Se requiere que los arrendatarios proporcionen prueba válida de seguro de automóvil, incluido el endoso FAQ 27. Los propietarios también deben proporcionar prueba de seguro que cubra el remolque. Lorepa puede, a su discreción, ofrecer cobertura opcional o un fondo de protección contra daños, pero no garantiza su efectividad o aplicabilidad legal. Toda la cobertura está sujeta al pleno cumplimiento de estos Términos de Uso.`,
            },
            {
                title: "23. Penalizaciones por Devolución Tardía",
                content: `Si el remolque no es devuelto por el arrendatario en la fecha y hora acordadas, si el arrendatario no coopera para organizar la devolución del remolque, o si las tarifas de recuperación requeridas no se pagan por adelantado, se le cobrará al arrendatario una penalización mínima de $500, más $7 por kilómetro recorrido (ida y vuelta) para recuperar el remolque. Estos montos pueden aumentarse a discreción del propietario. Lorepa se reserva el derecho de imponer o cobrar estas tarifas según corresponda.`,
            },
            {
                title: "24. Sin Garantía",
                content: `El arrendatario reconoce que el remolque se alquila "tal cual", sin garantía expresa o implícita con respecto a su funcionalidad, estado mecánico o idoneidad para un propósito particular. Ni el propietario ni Lorepa garantizan que el remolque satisfará las expectativas o necesidades del arrendatario, ni que estará libre de defectos mecánicos o cosméticos.`,
            },
            {
                title: "25. Contrato de Alquiler",
                content: (
                    <>
                        <p>Un contrato de alquiler electrónico se envía por correo electrónico al comienzo de cada reserva. Este documento rige la relación entre el propietario y el arrendatario. Lorepa no es parte de ningún acuerdo verbal o escrito entre usuarios más allá de este contrato de alquiler.</p>
                        <p>Si un propietario utiliza un acuerdo personal además de este contrato, no debe contradecir ni anular estos Términos de Uso ni ninguna política de Lorepa.</p>
                    </>
                ),
            },
            {
                title: "26. Reglas de Comunicación y Prohibición de Eludir la Plataforma",
                content: (
                    <>
                        <p>El uso de la plataforma Lorepa implica un comportamiento profesional y respetuoso. El lenguaje abusivo, ofensivo o amenazante resultará en la suspensión inmediata o permanente de la cuenta.</p>
                        <p>Se prohíbe estrictamente a los Usuarios eludir la plataforma, incluso compartiendo información de contacto directo (por ejemplo, número de teléfono, dirección de correo electrónico, URL del sitio web, identificador de redes sociales, nombre de la empresa, logotipo, etc.) antes de que se acepte una reserva.</p>
                        <p>Cualquier contenido que viole esta regla se eliminará sin previo aviso, y el usuario puede enfrentar una suspensión permanente u otras acciones bajo la política de abuso de servicio de Lorepa.</p>
                    </>
                ),
            },
            {
                title: "27. Tarifas y Comisiones",
                content: (
                    <>
                        <p>La publicación de remolques es gratuita.</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Se cobra una comisión del 15% en cada reserva (excluido el depósito de seguridad), pagadera por el propietario.</li>
                        </ul>
                        <p>El arrendatario paga:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Una tarifa de servicio del 5%.</li>
                        </ul>
                        <p>Estas tarifas apoyan el mantenimiento de la plataforma, el servicio al cliente, la seguridad y la visibilidad.</p>
                    </>
                ),
            },
            {
                title: "28. Estándares de Listado de Remolques",
                content: (
                    <>
                        <p>Los listados deben incluir:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Una descripción detallada de al menos 200 caracteres.</li>
                            <li>Un mínimo de 4 fotos reales y únicas del remolque.</li>
                            <li>La ubicación precisa (ciudad) en Quebec.</li>
                            <li>Una tarifa justa y competitiva.</li>
                        </ul>
                        <p>Las imágenes y descripciones no deben contener información de contacto directo, logotipos comerciales, nombres comerciales o cualquier detalle que permita a los usuarios eludir la plataforma. Los logotipos del fabricante están permitidos si no contienen información de contacto.</p>
                        <p>Lorepa se reserva el derecho de modificar o eliminar cualquier listado que no cumpla con estos estándares y de usar las fotos con fines publicitarios bajo los derechos otorgados al momento de la presentación.</p>
                        <p>Está prohibido listar un remolque únicamente para promover un servicio de transporte o si el remolque tiene un título de salvamento.</p>
                    </>
                ),
            },
            {
                title: "29. Obligaciones del Propietario del Remolque",
                content: (
                    <>
                        <p>Los Propietarios deben:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Leer las guías "Primeros pasos" y "Proceso de alquiler" disponibles en su panel de control.</li>
                            <li>Gestionar sus reservas, extensiones y comunicaciones ellos mismos.</li>
                            <li>Responder a las consultas con prontitud (idealmente dentro de 1 hora).</li>
                            <li>Aceptar o rechazar solicitudes dentro de las 24 horas. Después de este período, la solicitud puede ser rechazada automáticamente.</li>
                        </ul>
                        <p>Una vez que se acepta una reserva, el propietario está contractualmente obligado a proporcionar el remolque según lo acordado. En caso de una cancelación injustificada por parte del propietario, Lorepa se reserva el derecho de cobrar la totalidad de las tarifas de servicio, incluidos los costos de la tarjeta de crédito y la publicidad.</p>
                        <p>El propietario debe estar presente tanto en la entrega como en la devolución, tomar al menos 4 fotos antes y después de cada alquiler, y documentar cualquier daño durante el período de alquiler utilizando el procedimiento provisto en el panel de usuario.</p>
                        <p>El propietario es responsable de:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Iniciar el alquiler usando la opción "Iniciar Alquiler",</li>
                            <li>Finalizar el alquiler usando la opción "Finalizar Alquiler", una vez que el remolque ha sido devuelto.</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "30. Incumplimiento de los Procedimientos de Alquiler",
                content: (
                    <>
                        <p>El incumplimiento de los procedimientos requeridos (por ejemplo, no iniciar o finalizar el alquiler dentro del plazo requerido) constituye un incumplimiento de estos términos.</p>
                        <p>Lorepa puede:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Cancelar cualquier reserva activa o aceptada,</li>
                            <li>Suspender o eliminar la cuenta del usuario,</li>
                            <li>Retener pagos relacionados con la transacción,</li>
                            <li>Aplicar penalizaciones a su discreción, según las circunstancias y la prueba de posesión del remolque por parte del arrendatario.</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "31. Mantenimiento y Seguridad del Remolque",
                content: (
                    <>
                        <p>El propietario se compromete a proporcionar un remolque que sea:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Mecánicamente seguro, funcional y limpio,</li>
                            <li>Registrado con una placa de matrícula válida,</li>
                            <li>Mostrando una pegatina VIN y las especificaciones de peso,</li>
                            <li>Conforme a las normas de seguridad, incluida una inspección DOT válida si corresponde.</li>
                        </ul>
                        <p>El propietario es responsable de garantizar el buen estado de todos los componentes, incluidos neumáticos, cojinetes, frenos, resortes, sistemas eléctricos, enganche, cadenas, luces, bastidor y estructura.</p>
                        <p>El propietario acepta indemnizar a Lorepa por cualquier falla, accidente o falta de comunicación relacionada con el mantenimiento o las especificaciones del remolque.</p>
                    </>
                ),
            },
            {
                title: "32. Pagos al Propietario",
                content: (
                    <>
                        <p>Lorepa gestiona todos los pagos adeudados a los propietarios. Una vez que un propietario selecciona el botón "Finalizar Alquiler" asociado a una reserva completada, se inicia automáticamente un pago el siguiente lunes. Este pago se realiza mediante Interac e-Transfer, y los fondos se depositan en la cuenta bancaria designada del propietario.</p>
                        <p>Para recibir el pago, el propietario debe registrar su información bancaria en la sección "Mi Cuenta Bancaria" de su perfil de usuario.</p>
                        <p>Lorepa se reserva el derecho de retener cualquier pago relacionado con una reserva considerada fraudulenta o sospechosa, o involucrada en una disputa resuelta a favor del titular de la tarjeta. Si ya se ha emitido un pago en tales circunstancias, el monto correspondiente se deducirá de futuros pagos al propietario.</p>
                    </>
                ),
            },
            {
                title: "33. Cancelaciones del Propietario",
                content: (
                    <>
                        <p>Los propietarios tienen derecho a dos (2) cancelaciones gratuitas dentro de un período de seis (6) meses. Cualquier cancelación adicional incurrirá en una tarifa de CAD $100, siempre que la cancelación se realice al menos 48 horas antes del inicio programado del alquiler.</p>
                        <p>Las tarifas de cancelación se deducen automáticamente del próximo pago del Propietario. No se permiten cancelaciones una vez que el alquiler ha comenzado o una vez que el proceso de alquiler se ha iniciado a través de la plataforma.</p>
                        <p>Las cancelaciones solo se permiten en casos de circunstancias inevitables, según lo determine únicamente Lorepa. Cualquier intento de utilizar las cancelaciones como un medio para eludir la plataforma constituye una violación de estos Términos.</p>
                    </>
                ),
            },
            {
                title: "34. Elusión y Abuso de la Plataforma",
                content: (
                    <>
                        <p>El uso de la plataforma Lorepa prohíbe estrictamente cualquier intento de eludir el sistema de reservas.</p>
                        <p>Está expresamente prohibido para un Propietario:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Intercambiar información de contacto antes de una reserva aprobada;</li>
                            <li>Acordar un lugar de reunión fuera de la plataforma;</li>
                            <li>Solicitar a un Arrendatario que complete una transacción de alquiler fuera de Lorepa;</li>
                            <li>Persuadir a un Arrendatario para que cancele una reserva para finalizar el alquiler fuera de la plataforma.</li>
                        </ul>
                        <p>Cualquier violación de este tipo dará lugar a consecuencias inmediatas, que incluyen, entre otras:</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Cargo completo de las tarifas y comisiones aplicables;</li>
                            <li>Suspensión o terminación de la cuenta;</li>
                            <li>Prohibición permanente de la plataforma Lorepa.</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "35. Propiedad Intelectual",
                content: `Todo el contenido de la Plataforma (textos, imágenes, videos, logotipos, marcas comerciales, etc.) es propiedad exclusiva de la Compañía o sus socios y está protegido por las leyes de propiedad intelectual. Cualquier reproducción, representación, modificación, publicación o adaptación, total o parcial, de los elementos de la Plataforma, independientemente de los medios o procesos utilizados, está prohibida sin la autorización previa por escrito de la Compañía.`,
            },
            {
                title: "36. Privacidad y Protección de Datos",
                content: `La Compañía se compromete a proteger los datos personales de sus Usuarios. Toda la información recopilada se procesa de acuerdo con la Política de Privacidad de la Compañía, que es una parte integral de estos Términos. Los Usuarios tienen derecho a acceder, rectificar, eliminar y oponerse al procesamiento de sus datos personales.`,
            },
            {
                title: "37. Limitación de Responsabilidad",
                content: `Lorepa actúa como una plataforma intermediaria, conectando a propietarios y arrendatarios. La Compañía no es responsable de la calidad, seguridad o legalidad de los remolques listados, ni de la conducta de los Usuarios. La responsabilidad de Lorepa se limita a los daños directos que se demuestre que son atribuibles a una falta por su parte en la prestación de los servicios de la Plataforma.`,
            },
            {
                title: "38. Indemnización",
                content: `El Usuario acepta indemnizar, defender y eximir de responsabilidad a Lorepa, sus afiliados, directores, empleados y agentes de cualquier reclamo, responsabilidad, daño, pérdida y gasto (incluidos los honorarios razonables de abogados) que surjan de o estén relacionados de alguna manera con su acceso o uso de la Plataforma, su violación de estos Términos o su violación de los derechos de terceros.`,
            },
            {
                title: "39. Ley Aplicable y Jurisdicción",
                content: `Estos Términos se rigen e interpretan de acuerdo con las leyes de la Provincia de Quebec, Canadá. Cualquier disputa que surja de o en relación con estos Términos se someterá a la jurisdicción exclusiva de los tribunales de Quebec, Canadá.`,
            },
            {
                title: "40. Contáctenos",
                content: (
                    <div className='ml-4'>
                        <p>Para cualquier pregunta sobre estos Términos, contáctenos:</p>
                        <p>Correo electrónico: contact@lorepa.com</p>
                        <p>Teléfono: +1 438 282 6718</p>
                        <p>Dirección: 3910 Rue de Bellechasse, Montréal, Québec, H1X 1J4</p>
                    </div>
                ),
            },
        ],
    },
    cn: {
        pageTitle: "使用条款",
        sections: [
            {
                title: "1. 使用条款的目的",
                content: `本使用条款（以下简称“条款”）旨在定义Lorepa运营公司（以下简称“公司”）向用户（以下简称“用户”或“User”）提供访问Lorepa平台（可通过其网站和移动应用程序（以下简称“平台”）访问）的条款和条件，以及使用所提供服务的条件。`,
            },
            {
                title: "2. 接受使用条款",
                content: `通过访问和/或使用本平台，用户确认已阅读并无条件接受本条款。如果用户不接受全部或部分条款，请不要使用本平台。`,
            },
            {
                title: "3. 条款的修改",
                content: `公司保留随时修改本条款的权利。任何修改在发布到平台后立即生效。鼓励用户定期查看条款，以了解任何更新。在此类修改后继续使用本平台构成对修订条款的默示接受。`,
            },
            {
                title: "4. 平台访问",
                content: `任何具有互联网访问权限的用户均可免费访问本平台。与访问本平台（硬件、软件、互联网连接等）相关的所有费用均由用户自行承担。公司保留在不另行通知或补偿的情况下，暂时或永久关闭本平台全部或部分访问的权利，特别是用于更新、维护或内容更改。`,
            },
            {
                title: "5. 注册和账户创建",
                content: (
                    <>
                        <h3 className='font-semibold mt-2'>5.1. 注册要求</h3>
                        <p>要访问拖车租赁服务或通过本平台提供拖车租赁，用户必须创建个人账户，提供准确、完整和最新的信息。注册仅限于18岁或以上具有签订合同的法律能力的人士。</p>
                        <h3 className='font-semibold mt-2'>5.2. 账户义务</h3>
                        <p>用户同意：</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>维护其登录凭据的机密性；</li>
                            <li>立即通知公司任何未经授权使用其账户的情况；</li>
                            <li>未经事先授权，不得创建或使用其他账户。</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "6. 平台提供的服务",
                content: `Lorepa 连接拖车车主（以下简称“车主”）和租用人（以下简称“租用人”）进行点对点拖车租赁。平台允许：车主发布拖车列表；租用人搜索和预订拖车；管理付款、电子签署租赁协议以及通过电子邮件发送租赁文件（PDF 合同、照片等）。`,
            },
            {
                title: "7. 租用人的特定条件",
                content: (
                    <>
                        <h3 className='font-semibold mt-2'>7.1. 所需文件</h3>
                        <p>要通过平台租赁拖车，租用人必须在注册时提供以下文件：</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>有效驾驶执照副本；</li>
                            <li>包含 FAQ 27 背书的汽车保险证明（非自有车辆的保险）；</li>
                            <li>车辆登记证。</li>
                        </ul>
                        <p>这些文件必须有效、清晰，并在进行任何预订之前获得公司批准。</p>
                        <h3 className='font-semibold mt-2'>7.2. 租用人义务</h3>
                        <p>租用人同意：</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>根据其预期目的和适用法律使用拖车；</li>
                            <li>在约定的日期和地点将拖车按原样归还；</li>
                            <li>报告租赁期间发生的任何损坏或事故。</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "8. 车主的特定条件",
                content: (
                    <>
                        <h3 className='font-semibold mt-2'>8.1. 所需文件</h3>
                        <p>要在平台上市拖车，车主必须提供：</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>有效驾驶执照副本；</li>
                            <li>拖车保险证明；</li>
                            <li>拖车登记证。</li>
                        </ul>
                        <h3 className='font-semibold mt-2'>8.2. 车主义务</h3>
                        <p>车主同意：</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>提供处于良好工作状态、安全且符合适用标准的拖车；</li>
                            <li>提供有关拖车状况的真实和最新信息；</li>
                            <li>根据约定的时间表提供拖车取车和还车服务。</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "9. 定价和付款",
                content: (
                    <>
                        <h3 className='font-semibold mt-2'>9.1. 佣金和服务费</h3>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>向车主收取的每笔交易佣金为15%；</li>
                            <li>向租用人收取的每笔交易服务费为5%。</li>
                        </ul>
                        <h3 className='font-semibold mt-2'>9.2. 付款条款</h3>
                        <p>付款通过 Stripe 平台在线处理。租赁金额在预订时收取。扣除适用的佣金和费用后，资金将根据 Stripe 的处理时间表转移给车主。</p>
                        <h3 className='font-semibold mt-2'>9.3. 税费和附加费</h3>
                        <p>显示价格包含适用税费。可选服务或不遵守租赁条款（例如，逾期归还、损坏等）可能会收取额外费用。</p>
                    </>
                ),
            },
            {
                title: "10. 保证金和保障基金",
                content: (
                    <>
                        <h3 className='font-semibold mt-2'>10.1. 保证金</h3>
                        <p>Lorepa 保留对租用人信用卡进行预授权或收取保证金的权利，以弥补潜在的损坏、盗窃、延误或额外费用。</p>
                        <p>保证金金额因拖车价值、租赁类型、用户行为以及是否选择 Lorepa 可选保险等多种因素而异。</p>
                        <p>如果租用人选择 Lorepa 可选保险，保证金金额会减少。否则，需要更高的保证金以弥补潜在风险。确切金额在预订时会告知，并且必须接受才能确认租赁。</p>
                        <p>如果发生损坏、违反本条款或未支付费用，Lorepa 保留保留全部或部分保证金的权利。保证金通常在租赁结束后 5 至 10 个工作日内退还，具体取决于检查结果。</p>
                        <p>车主也可以要求收取保证金以弥补潜在的损坏或损失。金额在租赁列表中列出。</p>
                        <h3 className='font-semibold mt-2'>10.2. 保证金和保险</h3>
                        <p>每次租赁可能都需要保证金。确切金额在预订时确认，并可能因拖车和租赁总价值而异。</p>
                        <p>保证金在租赁时暂时从租用人的付款方式中扣除或保留，用于弥补因损坏、丢失、盗窃、延误或违反条款而产生的任何费用。</p>
                        <h4 className='font-semibold mt-2'>Lorepa 保险和对保证金的影响</h4>
                        <p>如果租用人选择 Lorepa 的可选保险，所需的保证金可能会减少。否则，可能会适用更高的保证金。此政策遵循 Turo、Towlos 和 Neighbor Trailers 等平台的行业标准。</p>
                        <p>Lorepa 可以使用全部或部分保证金来弥补与违反本条款相关的任何费用。保证金的任何未使用部分将在租赁结束后合理时间内退还，一旦验证完成。</p>
                        <h3 className='font-semibold mt-2'>10.3. 保险和保障基金</h3>
                        <p>Lorepa 提供通过可选保险（每天 10 美元）获得的保障基金，用于额外赔偿损坏或盗窃。此选项可在预订时激活。</p>
                        <h3 className='font-semibold mt-2'>10.4. 保障基金的使用</h3>
                        <p>保障基金仅用于报告和记录在案的事件（附有照片和报告）。此机制的激活需经公司批准。</p>
                    </>
                ),
            },
            {
                title: "11. 用户责任",
                content: `每个用户对其使用平台、提供的信息以及租赁的商品负全责。用户同意赔偿 Lorepa 因违反条款或通过平台进行的任何非法活动而造成的任何损害、损失或费用。`,
            },
            {
                title: "12. 资格要求",
                content: (
                    <>
                        <p>要使用 Lorepa 平台，您必须：</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>年满21岁。</li>
                            <li>是加拿大居民并持有有效的政府颁发身份证。</li>
                            <li>如果您是租用人或将拖车拖走的车主，则持有有效的驾驶执照（相应类别）。</li>
                            <li>对于车主，持有有效的拖车登记和责任保险。</li>
                        </ul>
                        <p>如果未满足这些条件，Lorepa 保留拒绝访问或暂停帐户的权利。</p>
                    </>
                ),
            },
            {
                title: "13. 用户注册",
                content: (
                    <>
                        <p>在 Lorepa 注册是免费的。用户必须提供准确、最新和完整的信息，包括：</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>全名，</li>
                            <li>有效电子邮件地址，</li>
                            <li>经验证的电话号码，</li>
                            <li>完整的邮寄地址。</li>
                        </ul>
                        <p>要完成注册，可能需要进行某些验证，包括但不限于：</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>上传驾驶执照，</li>
                            <li>保险证明（租用人需要 FAQ 27 背书），</li>
                            <li>车辆或拖车登记文件。</li>
                        </ul>
                        <p>如果存在虚假陈述或试图规避验证要求，Lorepa 保留暂停或删除任何账户的权利。</p>
                    </>
                ),
            },
            {
                title: "14. 拖车列表和管理",
                content: (
                    <>
                        <p>任何希望在 Lorepa 上列出拖车的车主必须：</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>使用真实照片创建完整的列表，</li>
                            <li>提供技术规格和使用条件，</li>
                            <li>设定每日租赁价格，</li>
                            <li>设定可用性。</li>
                        </ul>
                        <p>车主负责：</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>所提供信息的准确性，</li>
                            <li>定期更新其列表，</li>
                            <li>履行所有与接受预订相关的承诺。</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "15. 预订流程",
                content: `所有拖车预订必须通过 Lorepa 平台独家进行。流程包括：租用人提出预订请求，车主手动或自动接受，通过信用卡安全支付，根据约定条款交付拖车。任何试图在平台外安排租赁的行为都严重违反本使用条款，并将导致账户立即暂停。`,
            },
            {
                title: "16. 保证金",
                content: (
                    <>
                        <p>每次预订都会收取保证金。此金额：</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>在租赁期间在租用人的信用卡上预留，</li>
                            <li>用于弥补损坏、逾期归还或违规行为，</li>
                            <li>如果未报告任何问题，将在 5 至 10 个工作日内自动退还。</li>
                        </ul>
                        <p>Lorepa 可以根据车主的要求或评估后，在发生损坏或违反合同的情况下，扣留部分或全部保证金。</p>
                    </>
                ),
            },
            {
                title: "17. 额外费用和损坏",
                content: (
                    <>
                        <p>租用人负责租赁期间发生的任何损坏、盗窃或损失。</p>
                        <p>车主必须在拖车归还后 24 小时内报告任何事件，包括照片和描述。</p>
                        <p>Lorepa 保留以下权利：</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>向租用人收取维修费用，</li>
                            <li>使用保证金支付此类费用，</li>
                            <li>移除反复造成事件或滥用服务的用户。</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "18. 保险",
                content: `Lorepa 不是保险提供商。租用人必须提供包含 FAQ 27 背书的个人汽车保险证明，该背书涵盖拖车租赁。车主必须为其拖车保持有效的责任保险。在没有足够保险的情况下，用户对发生的任何财产或人身损害负个人责任。`,
            },
            {
                title: "19. 车主责任",
                content: `车主全权负责确保其拖车符合安全标准，并按照适用法律进行适当维护、保险和注册。车主必须提供有关拖车的准确信息，包括其规格、状况和可用性。如果未满足这些要求，Lorepa 保留从平台移除任何拖车的权利。`,
            },
            {
                title: "20. 租用人责任",
                content: `租用人同意以谨慎、合法和负责任的方式使用拖车。他们必须在使用前检查拖车，报告任何预先存在的损坏，并按原样归还。任何疏忽、误用或损坏都可能导致额外费用。`,
            },
            {
                title: "21. 租赁前后检查和文档",
                content: `每次租赁前，租用人必须上传拖车的清晰照片（前、后、两侧）以记录其状况。租赁结束时必须提供相同的照片。这些图像构成租赁协议的一部分，并可在发生争议时用作证据。`,
            },
            {
                title: "22. 保险和承保范围",
                content: `租用人需要提供有效的汽车保险证明，包括 FAQ 27 背书。车主还必须提供拖车保险证明。Lorepa 可自行决定提供可选承保或损害保护基金，但不能保证其有效性或法律适用性。所有承保均受本使用条款的完全遵守。`,
            },
            {
                title: "23. 逾期归还罚款",
                content: `如果租用人未在约定的日期和时间归还拖车，如果租用人不配合安排拖车归还，或者未提前支付所需的回收费，则租用人将被收取至少 500 加元，外加每公里 7 加元（往返）的拖车回收费。这些金额可由车主酌情增加。Lorepa 保留酌情征收或收取这些费用的权利。`,
            },
            {
                title: "24. 无担保",
                content: `租用人承认拖车按“原样”租赁，不附带任何关于其功能、机械状况或特定用途适用性的明示或默示担保。车主和 Lorepa 均不保证拖车将满足租用人的期望或需求，也不保证其没有机械或外观缺陷。`,
            },
            {
                title: "25. 租赁协议",
                content: (
                    <>
                        <p>每次预订开始时都会通过电子邮件发送电子租赁协议。此文件规定了车主和租用人之间的关系。除了此租赁合同之外，Lorepa 不参与用户之间的任何口头或书面协议。</p>
                        <p>如果车主除了本合同之外还使用个人协议，则该协议不得与本使用条款或 Lorepa 的任何政策相矛盾或抵触。</p>
                    </>
                ),
            },
            {
                title: "26. 通信规则和平台规避禁令",
                content: (
                    <>
                        <p>使用 Lorepa 平台意味着专业和尊重的行为。辱骂性、冒犯性或威胁性语言将导致账户立即或永久暂停。</p>
                        <p>严格禁止用户规避平台，包括在预订被接受之前分享直接联系信息（例如电话号码、电子邮件地址、网站 URL、社交媒体账号、公司名称、徽标等）。</p>
                        <p>任何违反此规则的内容将不经通知被删除，用户可能会根据 Lorepa 的服务滥用政策面临永久暂停或其他措施。</p>
                    </>
                ),
            },
            {
                title: "27. 费用和佣金",
                content: (
                    <>
                        <p>拖车列表是免费的。</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>每次预订（不包括保证金）将收取 15% 的佣金，由车主支付。</li>
                        </ul>
                        <p>租用人支付：</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>5% 的服务费。</li>
                        </ul>
                        <p>这些费用支持平台的维护、客户服务、安全和可见性。</p>
                    </>
                ),
            },
            {
                title: "28. 拖车列表标准",
                content: (
                    <>
                        <p>列表必须包括：</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>至少 200 个字符的详细描述。</li>
                            <li>至少 4 张拖车的实际和独特照片。</li>
                            <li>魁北克省的精确位置（城市）。</li>
                            <li>合理且具有竞争力的价格。</li>
                        </ul>
                        <p>图片和描述不得包含直接联系信息、商业徽标、商号或任何允许用户绕过平台的详细信息。如果制造商徽标不包含任何联系信息，则允许使用。</p>
                        <p>Lorepa 保留修改或删除任何不符合这些标准的列表的权利，并根据提交时授予的权利将照片用于广告目的。</p>
                        <p>禁止仅为推广运输服务或拖车具有报废标题而列出拖车。</p>
                    </>
                ),
            },
            {
                title: "29. 拖车车主义务",
                content: (
                    <>
                        <p>车主必须：</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>阅读其仪表板中提供的“入门”和“租赁流程”指南。</li>
                            <li>自行管理其预订、延期和通信。</li>
                            <li>及时回复查询（最好在 1 小时内）。</li>
                            <li>在 24 小时内接受或拒绝请求。在此期限之后，请求可能会自动拒绝。</li>
                        </ul>
                        <p>一旦预订被接受，车主有合同义务按约定提供拖车。如果车主无故取消，Lorepa 保留收取全部服务费的权利，包括信用卡和广告费用。</p>
                        <p>车主必须在交接和归还时在场，在每次租赁前后至少拍摄 4 张照片，并使用用户仪表板中提供的程序记录租赁期间的任何损坏。</p>
                        <p>车主负责：</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>使用“开始租赁”选项开始租赁，</li>
                            <li>一旦拖车归还，使用“结束租赁”选项结束租赁。</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "30. 未遵守租赁程序",
                content: (
                    <>
                        <p>未能遵守所需程序（例如，未在规定时间内开始或结束租赁）构成违反这些条款。</p>
                        <p>Lorepa 可以：</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>取消任何活动或已接受的预订，</li>
                            <li>暂停或删除用户的账户，</li>
                            <li>扣留与交易相关的付款，</li>
                            <li>根据情况和租用人拥有拖车的证据，自行决定施加罚款。</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "31. 拖车维护和安全",
                content: (
                    <>
                        <p>车主同意提供一辆：</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>机械安全、功能良好且清洁的拖车，</li>
                            <li>已注册并带有有效牌照，</li>
                            <li>显示 VIN 贴纸和重量规格，</li>
                            <li>符合安全标准，包括有效的 DOT 检查（如适用）。</li>
                        </ul>
                        <p>车主负责确保所有部件的良好状况，包括轮胎、轴承、制动器、弹簧、电气系统、挂钩、链条、灯、车架和结构。</p>
                        <p>车主同意赔偿 Lorepa 因拖车维护或规格相关的任何故障、事故或沟通不畅而造成的损失。</p>
                    </>
                ),
            },
            {
                title: "32. 车主付款",
                content: (
                    <>
                        <p>Lorepa 管理所有欠车主的付款。一旦车主选择与已完成预订相关的“结束租赁”按钮，付款将在下一个星期一自动启动。此付款通过 Interac 电子转账进行，资金将存入车主指定的银行账户。</p>
                        <p>要接收付款，车主必须在用户资料的“我的银行账户”部分注册其银行信息。</p>
                        <p>Lorepa 保留扣留与被视为欺诈或可疑的预订相关的任何付款，或与已解决的有利于持卡人的争议相关的付款的权利。如果在此类情况下已发出付款，则相应金额将从未来对车主的付款中扣除。</p>
                    </>
                ),
            },
            {
                title: "33. 车主取消",
                content: (
                    <>
                        <p>车主在任何连续六 (6) 个月内有权免费取消两次。任何额外的取消将收取 100 加元的费用，前提是取消发生在预定租赁开始前至少 48 小时。</p>
                        <p>取消费用会自动从车主的下一次付款中扣除。一旦租赁开始或通过平台启动租赁流程，则不允许取消。</p>
                        <p>取消仅在 Lorepa 单方面确定的不可避免的情况下才允许。任何试图利用取消来规避平台的行为均构成对这些条款的违反。</p>
                    </>
                ),
            },
            {
                title: "34. 平台规避和滥用",
                content: (
                    <>
                        <p>使用 Lorepa 平台严格禁止任何试图规避预订系统的行为。</p>
                        <p>车主明确禁止：</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>在批准预订之前交换联系信息；</li>
                            <li>在平台之外安排会面地点；</li>
                            <li>招揽租用人完成 Lorepa 平台之外的租赁交易；</li>
                            <li>说服租用人取消预订以在平台外完成租赁。</li>
                        </ul>
                        <p>任何此类违规行为将导致立即后果，包括但不限于：</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>全额收取适用的费用和佣金；</li>
                            <li>账户暂停或终止；</li>
                            <li>永久禁止使用 Lorepa 平台。</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "35. 知识产权",
                content: `平台上的所有内容（文本、图像、视频、徽标、商标等）均为公司或其合作伙伴的专有财产，并受知识产权法保护。未经公司事先书面授权，禁止以任何方式或过程，全部或部分复制、表示、修改、发布或改编平台元素。`,
            },
            {
                title: "36. 隐私和数据保护",
                content: `公司致力于保护其用户的个人数据。所有收集的信息均根据公司的隐私政策进行处理，该政策是本条款的组成部分。用户有权访问、纠正、删除和反对处理其个人数据。`,
            },
            {
                title: "37. 责任限制",
                content: `Lorepa 作为一个中介平台，连接车主和租用人。公司不对上市拖车的质量、安全性或合法性负责，也不对用户的行为负责。Lorepa 的责任仅限于因其在提供平台服务方面的过失而造成的直接损害。`,
            },
            {
                title: "38. 赔偿",
                content: `用户同意赔偿、捍卫并使 Lorepa 及其关联公司、董事、员工和代理人免受因其访问或使用平台、违反本条款或侵犯任何第三方权利而引起或以任何方式相关的任何索赔、责任、损害、损失和费用（包括合理的律师费）。`,
            },
            {
                title: "39. 管辖法律和司法管辖区",
                content: `本条款受加拿大魁北克省法律管辖并按其解释。任何因本条款引起或与之相关的争议均应提交加拿大魁北克省法院的专属管辖。`,
            },
            {
                title: "40. 联系我们",
                content: (
                    <div className='ml-4'>
                        <p>对于这些条款的任何问题，请联系我们：</p>
                        <p>电子邮件: contact@lorepa.com</p>
                        <p>电话: +1 438 282 6718</p>
                        <p>地址: 3910 Rue de Bellechasse, Montréal, Québec, H1X 1J4</p>
                    </div>
                ),
            },
        ],
    },
    fr: {
        pageTitle: "Conditions d'utilisation",
        sections: [
            {
                title: "1. Objet des Conditions d'utilisation",
                content: `Les présentes Conditions d'utilisation (ci-après les "Conditions") ont pour objet de définir les modalités selon lesquelles la société exploitant Lorepa (ci-après la "Société") met à la disposition des utilisateurs (ci-après les "Utilisateurs" ou "Utilisateur") l'accès à la plateforme Lorepa, accessible via son site internet et son application mobile (ci-après la "Plateforme"), ainsi que les conditions d'utilisation des services proposés.`,
            },
            {
                title: "2. Acceptation des Conditions d'utilisation",
                content: `En accédant et/ou en utilisant la Plateforme, l'Utilisateur reconnaît avoir lu et accepté sans réserve les présentes Conditions. Si l'Utilisateur n'accepte pas tout ou partie des Conditions, il lui est demandé de ne pas utiliser la Plateforme.`,
            },
            {
                title: "3. Modification des Conditions",
                content: `La Société se réserve le droit de modifier les présentes Conditions à tout moment. Toute modification prend effet immédiatement après sa publication sur la Plateforme. Les Utilisateurs sont encouragés à consulter régulièrement les Conditions afin de prendre connaissance de toute mise à jour. L'utilisation continue de la Plateforme après de telles modifications constitue une acceptation implicite des Conditions révisées.`,
            },
            {
                title: "4. Accès à la Plateforme",
                content: `La Plateforme est accessible gratuitement à tout Utilisateur disposant d'un accès à Internet. Tous les coûts liés à l'accès à la Plateforme (matériel, logiciels, connexion Internet, etc.) sont à la charge exclusive de l'Utilisateur. La Société se réserve le droit, sans préavis ni indemnité, de fermer temporairement ou définitivement l'accès à tout ou partie de la Plateforme, notamment pour des mises à jour, des opérations de maintenance, ou des modifications de contenu.`,
            },
            {
                title: "5. Inscription et Création de Compte",
                content: (
                    <>
                        <h3 className='font-semibold mt-2'>5.1. Conditions d'inscription</h3>
                        <p>Pour accéder aux services de location de remorques ou proposer une remorque à la location via la Plateforme, l'Utilisateur doit créer un compte personnel en fournissant des informations exactes, complètes et à jour. L'inscription est réservée aux personnes physiques âgées de 18 ans ou plus et ayant la capacité juridique de contracter.</p>
                        <h3 className='font-semibold mt-2'>5.2. Obligations du compte</h3>
                        <p>L'Utilisateur s'engage à :</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Maintenir la confidentialité de ses identifiants de connexion ;</li>
                            <li>Notifier immédiatement la Société de toute utilisation non autorisée de son compte ;</li>
                            <li>Ne pas créer ou utiliser d'autres comptes sans autorisation préalable.</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "6. Services Offerts par la Plateforme",
                content: `Lorepa met en relation des propriétaires de remorques (ci-après les "Propriétaires") et des locataires (ci-après les "Locataires") pour des locations de remorques entre particuliers. La Plateforme permet : Aux Propriétaires de publier des annonces pour leurs remorques ; Aux Locataires de rechercher et de réserver des remorques ; La gestion des paiements, la signature électronique des contrats de location, et l'envoi par courriel des documents de location (contrats PDF, photos, etc.).`,
            },
            {
                title: "7. Conditions Spécifiques aux Locataires",
                content: (
                    <>
                        <h3 className='font-semibold mt-2'>7.1. Documents Requis</h3>
                        <p>Pour louer une remorque via la Plateforme, le Locataire doit fournir les documents suivants lors de son inscription :</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Une copie valide de son permis de conduire ;</li>
                            <li>Une preuve d'assurance automobile incluant l'avenant FAQ 27 (couverture pour les véhicules non possédés) ;</li>
                            <li>Le certificat d'immatriculation du véhicule.</li>
                        </ul>
                        <p>Ces documents doivent être valides, lisibles et approuvés par la Société avant toute réservation.</p>
                        <h3 className='font-semibold mt-2'>7.2. Obligations du Locataire</h3>
                        <p>Le Locataire s'engage à :</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Utiliser la remorque conformément à sa destination et aux lois applicables ;</li>
                            <li>Restituer la remorque à la date et au lieu convenus dans son état d'origine ;</li>
                            <li>Signaler tout dommage ou incident survenant pendant la location.</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "8. Conditions Spécifiques aux Propriétaires",
                content: (
                    <>
                        <h3 className='font-semibold mt-2'>8.1. Documents Requis</h3>
                        <p>Pour lister une remorque sur la Plateforme, le Propriétaire doit fournir :</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Une copie valide de son permis de conduire ;</li>
                            <li>Une preuve d'assurance couvrant la remorque ;</li>
                            <li>Le certificat d'immatriculation de la remorque.</li>
                        </ul>
                        <h3 className='font-semibold mt-2'>8.2. Obligations du Propriétaire</h3>
                        <p>Le Propriétaire s'engage à :</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Proposer une remorque en bon état de fonctionnement, sécuritaire et conforme aux normes applicables ;</li>
                            <li>Fournir des informations véridiques et à jour sur l'état de la remorque ;</li>
                            <li>Être disponible pour la prise et le retour de la remorque selon l'horaire convenu.</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "9. Tarification et Paiement",
                content: (
                    <>
                        <h3 className='font-semibold mt-2'>9.1. Commission et Frais de Service</h3>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Une commission de 15% est prélevée sur chaque transaction effectuée par un Propriétaire ;</li>
                            <li>Des frais de service de 5% sont appliqués à chaque transaction payée par un Locataire.</li>
                        </ul>
                        <h3 className='font-semibold mt-2'>9.2. Conditions de Paiement</h3>
                        <p>Les paiements sont traités en ligne via la plateforme Stripe. Le montant de la location est débité au moment de la réservation. Après déduction des commissions et frais applicables, les fonds sont transférés au Propriétaire selon les délais de traitement de Stripe.</p>
                        <h3 className='font-semibold mt-2'>9.3. Taxes et Frais Additionnels</h3>
                        <p>Les prix affichés incluent les taxes applicables. Des frais additionnels peuvent s'appliquer pour des services optionnels ou en cas de non-respect des conditions de location (ex: retour tardif, dommages, etc.).</p>
                    </>
                ),
            },
            {
                title: "10. Dépôt de Garantie et Fond de Couverture",
                content: (
                    <>
                        <h3 className='font-semibold mt-2'>10.1. Dépôt de Garantie</h3>
                        <p>Lorepa se réserve le droit de préautoriser ou de débiter un dépôt de garantie sur la carte de crédit du Locataire pour couvrir d'éventuels dommages, vols, retards ou frais additionnels.</p>
                        <p>Le montant du dépôt varie en fonction de plusieurs facteurs, tels que la valeur de la remorque, le type de location, le comportement de l'utilisateur, et la sélection ou non de l'assurance optionnelle Lorepa.</p>
                        <p>Si le Locataire opte pour l'assurance optionnelle Lorepa, le montant du dépôt est réduit. Sans cette assurance, un dépôt plus élevé est exigé pour couvrir les risques potentiels. Le montant exact est communiqué au moment de la réservation et doit être accepté pour que la location soit confirmée.</p>
                        <p>Lorepa se réserve le droit de retenir tout ou partie du dépôt en cas de dommages, de non-respect des présentes Conditions, ou de frais impayés. Le dépôt est généralement remboursé dans un délai de 5 à 10 jours ouvrables après la fin de la location, sous réserve d'inspection.</p>
                        <p>Les Propriétaires peuvent également exiger un dépôt de garantie pour couvrir d'éventuels dommages ou pertes. Le montant est indiqué dans l'annonce de location.</p>
                        <h3 className='font-semibold mt-2'>10.2. Dépôt de Garantie et Assurance</h3>
                        <p>Un dépôt de garantie peut être exigé pour chaque location. Le montant exact est confirmé lors de la réservation et peut varier en fonction de la remorque et de la valeur totale de la location.</p>
                        <p>Le dépôt est temporairement débité ou bloqué sur le mode de paiement du Locataire au moment de la location et sert à couvrir tout coût résultant de dommages, pertes, vols, retards ou autres violations des Conditions.</p>
                        <h4 className='font-semibold mt-2'>Assurance Lorepa et Impact sur le Dépôt</h4>
                        <p>Si le Locataire sélectionne l'assurance optionnelle de Lorepa, le dépôt requis peut être réduit. Autrement, un dépôt plus élevé peut s'appliquer. Cette politique suit les standards de l'industrie de plateformes telles que Turo, Towlos et Neighbor Trailers.</p>
                        <p>Lorepa peut utiliser tout ou partie du dépôt pour couvrir les dépenses liées à toute infraction aux présentes Conditions. Toute portion inutilisée du dépôt sera remboursée dans un délai raisonnable après la location, une fois la vérification complète.</p>
                        <h3 className='font-semibold mt-2'>10.3. Assurance et Fond de Garantie</h3>
                        <p>Lorepa propose une couverture additionnelle pour les dommages ou vols via un fond de garantie accessible par une assurance optionnelle à 10$ par jour de location. Cette option est activable au moment de la réservation.</p>
                        <h3 className='font-semibold mt-2'>10.4. Utilisation du Fond de Garantie</h3>
                        <p>Le fond de garantie est utilisé uniquement en cas d'incident signalé et documenté (avec photos et rapports). L'activation de ce mécanisme est soumise à l'approbation de la Société.</p>
                    </>
                ),
            },
            {
                title: "11. Responsabilité de l'Utilisateur",
                content: `Chaque Utilisateur est seul responsable de son utilisation de la Plateforme, des informations qu'il fournit, et des biens qu'il loue. L'Utilisateur s'engage à indemniser Lorepa pour tout dommage, perte, ou dépense résultant d'une violation des Conditions ou de toute activité illégale menée via la Plateforme.`,
            },
            {
                title: "12. Critères d'Éligibilité",
                content: (
                    <>
                        <p>Pour utiliser la plateforme Lorepa, vous devez :</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Avoir au moins 21 ans.</li>
                            <li>Être résident du Canada avec une pièce d'identité valide émise par le gouvernement.</li>
                            <li>Détenir un permis de conduire valide (classe appropriée) si vous êtes un locataire ou un propriétaire qui remorquera la remorque.</li>
                            <li>Dans le cas des propriétaires, détenir une immatriculation de remorque et une assurance responsabilité civile valides.</li>
                        </ul>
                        <p>Lorepa se réserve le droit de refuser l'accès ou de suspendre un compte si ces conditions ne sont pas remplies.</p>
                    </>
                ),
            },
            {
                title: "13. Inscription de l'Utilisateur",
                content: (
                    <>
                        <p>L'inscription sur Lorepa est gratuite. Les Utilisateurs doivent fournir des informations exactes, à jour et complètes, incluant :</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Nom complet,</li>
                            <li>Adresse courriel valide,</li>
                            <li>Numéro de téléphone vérifié,</li>
                            <li>Adresse postale complète.</li>
                        </ul>
                        <p>Pour finaliser l'inscription, certaines vérifications peuvent être requises, incluant, mais sans s'y limiter :</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Téléchargement d'un permis de conduire,</li>
                            <li>Preuve d'assurance (avenant FAQ 27 pour les locataires),</li>
                            <li>Document d'immatriculation du véhicule ou de la remorque.</li>
                        </ul>
                        <p>Lorepa se réserve le droit de suspendre ou de supprimer tout compte en cas de fausses déclarations ou de tentatives de contournement des exigences de vérification.</p>
                    </>
                ),
            },
            {
                title: "14. Annonces et Gestion des Remorques",
                content: (
                    <>
                        <p>Tout propriétaire souhaitant lister une remorque sur Lorepa doit :</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Créer une annonce complète avec des photos réelles,</li>
                            <li>Fournir les spécifications techniques et les conditions d'utilisation,</li>
                            <li>Définir un prix de location journalier,</li>
                            <li>Définir la disponibilité.</li>
                        </ul>
                        <p>Le propriétaire est responsable de :</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>L'exactitude des informations fournies,</li>
                            <li>La mise à jour régulière de son annonce,</li>
                            <li>L'honneur de tous les engagements liés aux réservations acceptées.</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "15. Processus de Réservation",
                content: `Toutes les réservations de remorques doivent être effectuées exclusivement via la plateforme Lorepa. Le processus comprend : Une demande de réservation par le locataire, Une acceptation manuelle ou automatique par le propriétaire, Un paiement sécurisé par carte de crédit, La remise de la remorque selon les termes convenus. Toute tentative d'organiser des locations en dehors de la plateforme constitue une violation grave des présentes Conditions d'utilisation et entraînera la suspension immédiate du compte.`,
            },
            {
                title: "16. Dépôt de Garantie",
                content: (
                    <>
                        <p>Un dépôt de garantie est prélevé pour chaque réservation. Ce montant :</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Est retenu sur la carte de crédit du locataire pendant la durée de la location,</li>
                            <li>Est utilisé pour couvrir les dommages, les retours tardifs ou les infractions,</li>
                            <li>Est automatiquement remboursé dans un délai de 5 à 10 jours ouvrables si aucun problème n'est signalé.</li>
                        </ul>
                        <p>Lorepa peut, à la demande du propriétaire ou après évaluation, retenir tout ou partie du dépôt en cas de dommages ou de violations du contrat.</p>
                    </>
                ),
            },
            {
                title: "17. Frais Additionnels et Dommages",
                content: (
                    <>
                        <p>Le locataire est responsable de tout dommage, vol ou perte encouru pendant la période de location.</p>
                        <p>Le propriétaire doit signaler tout incident dans les 24 heures suivant le retour de la remorque, incluant des photos et une description.</p>
                        <p>Lorepa se réserve le droit de :</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Facturer au locataire les coûts de réparation,</li>
                            <li>Utiliser le dépôt de garantie pour couvrir ces coûts,</li>
                            <li>Retirer les utilisateurs qui causent des incidents répétés ou abusent du service.</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "18. Assurance",
                content: `Lorepa n'est pas un assureur. Les locataires doivent fournir une preuve d'assurance automobile personnelle incluant l'avenant FAQ 27, qui couvre les locations de remorques. Les propriétaires doivent maintenir une assurance responsabilité civile valide pour leur remorque. En l'absence d'une assurance adéquate, l'utilisateur est personnellement responsable de tout dommage matériel ou corporel encouru.`,
            },
            {
                title: "19. Responsabilités du Propriétaire",
                content: `Les Propriétaires sont seuls responsables de s'assurer que leurs remorques répondent aux normes de sécurité, sont correctement entretenues, assurées et immatriculées conformément aux lois applicables. Le propriétaire doit fournir des informations précises sur la remorque, y compris ses spécifications, ses conditions et sa disponibilité. Lorepa se réserve le droit de retirer toute remorque de la plateforme si ces exigences ne sont pas respectées.`,
            },
            {
                title: "20. Responsabilités du Locataire",
                content: `Les Locataires s'engagent à utiliser les remorques de manière prudente, légale et responsable. Ils doivent inspecter la remorque avant utilisation, signaler tout dommage préexistant et la restituer dans le même état que celui reçu. Toute négligence, mauvaise utilisation ou dommage peut entraîner des frais supplémentaires.`,
            },
            {
                title: "21. Inspection et Documentation Avant et Après Location",
                content: `Avant chaque location, le locataire doit télécharger des photos claires de la remorque (avant, arrière, des deux côtés) pour documenter son état. Les mêmes photos doivent être fournies à la fin de la location. Ces images font partie du contrat de location et peuvent être utilisées comme preuve en cas de litige.`,
            },
            {
                title: "22. Assurance et Couverture",
                content: `Les locataires sont tenus de fournir une preuve valide d'assurance automobile incluant l'avenant FAQ 27. Les propriétaires doivent également fournir une preuve d'assurance couvrant la remorque. Lorepa peut, à sa discrétion, offrir une couverture optionnelle ou un fonds de protection contre les dommages, mais ne garantit pas son efficacité ni son applicabilité juridique. Toute couverture est soumise à la pleine conformité aux présentes Conditions d'utilisation.`,
            },
            {
                title: "23. Pénalités de Retour Tardif",
                content: `Si la remorque n'est pas retournée par le locataire à la date et à l'heure convenues, si le locataire ne coopère pas à l'organisation du retour de la remorque, ou si les frais de récupération requis ne sont pas payés à l'avance, le locataire se verra facturer une pénalité minimale de 500 $, plus 7 $ par kilomètre parcouru (aller-retour) pour récupérer la remorque. Ces montants peuvent être augmentés à la discrétion du propriétaire. Lorepa se réserve le droit d'imposer ou de percevoir ces frais le cas échéant.`,
            },
            {
                title: "24. Aucune Garantie",
                content: `Le locataire reconnaît que la remorque est louée "telle quelle", sans garantie expresse ou implicite concernant sa fonctionnalité, son état mécanique ou son aptitude à un usage particulier. Ni le propriétaire ni Lorepa ne garantissent que la remorque répondra aux attentes ou aux besoins du locataire, ni qu'elle sera exempte de défauts mécaniques ou esthétiques.`,
            },
            {
                title: "25. Contrat de Location",
                content: (
                    <>
                        <p>Un contrat de location électronique est envoyé par courriel au début de chaque réservation. Ce document régit la relation entre le propriétaire et le locataire. Lorepa n'est pas partie à un accord verbal ou écrit entre les utilisateurs au-delà de ce contrat de location.</p>
                        <p>Si un propriétaire utilise un accord personnel en plus de ce contrat, il ne doit pas contredire ou annuler les présentes Conditions d'utilisation ou toute politique de Lorepa.</p>
                    </>
                ),
            },
            {
                title: "26. Règles de Communication et Interdiction de Contournement de la Plateforme",
                content: (
                    <>
                        <p>L'utilisation de la plateforme Lorepa implique un comportement professionnel et respectueux. Tout langage abusif, offensant ou menaçant entraînera la suspension immédiate ou permanente du compte.</p>
                        <p>Il est strictement interdit aux Utilisateurs de contourner la plateforme, notamment en partageant des informations de contact directes (par exemple, numéro de téléphone, adresse courriel, URL de site web, identifiant de médias sociaux, nom d'entreprise, logo, etc.) avant qu'une réservation ne soit acceptée.</p>
                        <p>Tout contenu violant cette règle sera supprimé sans préavis, et l'utilisateur pourra faire l'objet d'une suspension permanente ou d'autres mesures en vertu de la politique d'abus de service de Lorepa.</p>
                    </>
                ),
            },
            {
                title: "27. Frais et Commissions",
                content: (
                    <>
                        <p>La publication d'annonces de remorques est gratuite.</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Une commission de 15% est prélevée sur chaque réservation (hors dépôt de garantie), payable par le propriétaire.</li>
                        </ul>
                        <p>Le locataire paie :</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Des frais de service de 5%.</li>
                        </ul>
                        <p>Ces frais soutiennent l'entretien de la plateforme, le service client, la sécurité et la visibilité.</p>
                    </>
                ),
            },
            {
                title: "28. Normes de Publication des Annonces de Remorques",
                content: (
                    <>
                        <p>Les annonces doivent inclure :</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Une description détaillée d'au moins 200 caractères.</li>
                            <li>Un minimum de 4 photos réelles et uniques de la remorque.</li>
                            <li>L'emplacement précis (ville) au Québec.</li>
                            <li>Un tarif juste et compétitif.</li>
                        </ul>
                        <p>Les images et descriptions ne doivent pas contenir d'informations de contact directes, de logos commerciaux, de noms commerciaux, ou de tout détail permettant aux utilisateurs de contourner la plateforme. Les logos de fabricants sont autorisés s'ils ne contiennent aucune information de contact.</p>
                        <p>Lorepa se réserve le droit de modifier ou de supprimer toute annonce non conforme à ces normes et d'utiliser les photos à des fins publicitaires en vertu des droits accordés lors de la soumission.</p>
                        <p>Il est interdit de lister une remorque uniquement pour promouvoir un service de transport ou si la remorque a un titre de récupération.</p>
                    </>
                ),
            },
            {
                title: "29. Obligations du Propriétaire de Remorque",
                content: (
                    <>
                        <p>Les Propriétaires doivent :</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Lire les guides « Démarrage » et « Processus de location » disponibles dans leur tableau de bord.</li>
                            <li>Gérer eux-mêmes leurs réservations, prolongations et communications.</li>
                            <li>Répondre aux demandes rapidement (idéalement dans l'heure).</li>
                            <li>Accepter ou refuser les demandes dans les 24 heures. Après ce délai, la demande peut être automatiquement refusée.</li>
                        </ul>
                        <p>Une fois une réservation acceptée, le propriétaire est contractuellement obligé de fournir la remorque comme convenu. En cas d'annulation injustifiée par le propriétaire, Lorepa se réserve le droit de facturer la totalité des frais de service, y compris les frais de carte de crédit et de publicité.</p>
                        <p>Le propriétaire doit être présent à la remise et au retour, prendre au moins 4 photos avant et après chaque location, et documenter tout dommage pendant la période de location en utilisant la procédure fournie dans le tableau de bord de l'utilisateur.</p>
                        <p>Le propriétaire est responsable de :</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Démarrer la location en utilisant l'option « Démarrer la location »,</li>
                            <li>Terminer la location en utilisant l'option « Terminer la location », une fois la remorque retournée.</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "30. Non-respect des Procédures de Location",
                content: (
                    <>
                        <p>Le non-respect des procédures requises (par exemple, ne pas démarrer ou terminer la location dans le délai requis) constitue une violation des présentes conditions.</p>
                        <p>Lorepa peut :</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Annuler toute réservation active ou acceptée,</li>
                            <li>Suspendre ou supprimer le compte de l'utilisateur,</li>
                            <li>Retenir les paiements liés à la transaction,</li>
                            <li>Appliquer des pénalités à sa discrétion, en fonction des circonstances et de la preuve de possession de la remorque par le locataire.</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "31. Entretien et Sécurité de la Remorque",
                content: (
                    <>
                        <p>Le propriétaire s'engage à fournir une remorque qui est :</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Mécaniquement sûre, fonctionnelle et propre,</li>
                            <li>Immatriculée avec une plaque d'immatriculation valide,</li>
                            <li>Affichant un autocollant VIN et des spécifications de poids,</li>
                            <li>Conforme aux normes de sécurité, y compris une inspection DOT valide si applicable.</li>
                        </ul>
                        <p>Le propriétaire est responsable de s'assurer du bon état de tous les composants, y compris les pneus, les roulements, les freins, les ressorts, les systèmes électriques, l'attelage, les chaînes, les lumières, le cadre et la structure.</p>
                        <p>Le propriétaire s'engage à indemniser Lorepa pour toute défaillance, accident ou mauvaise communication lié à l'entretien ou aux spécifications de la remorque.</p>
                    </>
                ),
            },
            {
                title: "32. Paiements aux Propriétaires",
                content: (
                    <>
                        <p>Lorepa gère tous les paiements dus aux propriétaires. Une fois qu'un propriétaire sélectionne le bouton « Terminer la location » associé à une réservation complétée, un paiement est automatiquement initié le lundi suivant. Ce paiement est effectué via Virement Interac, et les fonds sont déposés dans le compte bancaire désigné du propriétaire.</p>
                        <p>Pour recevoir le paiement, le propriétaire doit enregistrer ses informations bancaires dans la section « Mon compte bancaire » de son profil utilisateur.</p>
                        <p>Lorepa se réserve le droit de retenir tout paiement lié à une réservation jugée frauduleuse ou suspecte, ou impliquée dans un litige résolu en faveur du titulaire de la carte. Si un paiement a déjà été émis dans de telles circonstances, le montant correspondant sera déduit des futurs paiements au propriétaire.</p>
                    </>
                ),
            },
            {
                title: "33. Annulations par le Propriétaire",
                content: (
                    <>
                        <p>Les propriétaires ont droit à deux (2) annulations gratuites sur une période de six (6) mois glissants. Toute annulation additionnelle entraînera des frais de 100 CAD $, à condition que l'annulation soit effectuée au moins 48 heures avant le début prévu de la location.</p>
                        <p>Les frais d'annulation sont automatiquement déduits du prochain versement du Propriétaire. Les annulations ne sont pas autorisées une fois que la location a commencé ou une fois que le processus de location a été initié via la plateforme.</p>
                        <p>Les annulations ne sont autorisées qu'en cas de circonstances inévitables, telles que déterminées uniquement par Lorepa. Toute tentative d'utiliser les annulations comme un moyen de contourner la plateforme constitue une violation des présentes Conditions.</p>
                    </>
                ),
            },
            {
                title: "34. Contournement et Abus de la Plateforme",
                content: (
                    <>
                        <p>L'utilisation de la plateforme Lorepa interdit strictement toute tentative de contourner le système de réservation.</p>
                        <p>Il est expressément interdit à un Propriétaire de :</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Échanger des informations de contact avant une réservation approuvée ;</li>
                            <li>Organiser un lieu de rendez-vous en dehors de la plateforme ;</li>
                            <li>Solliciter un Locataire pour effectuer une transaction de location en dehors de Lorepa ;</li>
                            <li>Persuader un Locataire d'annuler une réservation pour finaliser la location hors plateforme.</li>
                        </ul>
                        <p>Toute violation de ce type entraînera des conséquences immédiates, y compris, mais sans s'y limiter :</p>
                        <ul className='list-disc list-inside space-y-1 ml-4'>
                            <li>Facturation complète des frais et commissions applicables ;</li>
                            <li>Suspension ou résiliation du compte ;</li>
                            <li>Interdiction permanente de la plateforme Lorepa.</li>
                        </ul>
                    </>
                ),
            },
            {
                title: "35. Propriété Intellectuelle",
                content: `Tout le contenu de la Plateforme (textes, images, vidéos, logos, marques, etc.) est la propriété exclusive de la Société ou de ses partenaires et est protégé par les lois sur la propriété intellectuelle. Toute reproduction, représentation, modification, publication ou adaptation, en tout ou partie, des éléments de la Plateforme, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation écrite préalable de la Société.`,
            },
            {
                title: "36. Confidentialité et Protection des Données",
                content: `La Société s'engage à protéger les données personnelles de ses Utilisateurs. Toutes les informations collectées sont traitées conformément à la Politique de Confidentialité de la Société, qui fait partie intégrante des présentes Conditions. Les Utilisateurs ont le droit d'accéder, de rectifier, de supprimer et de s'opposer au traitement de leurs données personnelles.`,
            },
            {
                title: "37. Limitation de Responsabilité",
                content: `Lorepa agit comme une plateforme intermédiaire, connectant propriétaires et locataires. La Société n'est pas responsable de la qualité, de la sécurité ou de la légalité des remorques listées, ni de la conduite des Utilisateurs. La responsabilité de Lorepa est limitée aux dommages directs prouvés comme étant attribuables à une faute de sa part dans la prestation des services de la Plateforme.`,
            },
            {
                title: "38. Indemnisation",
                content: `L'Utilisateur accepte d'indemniser, de défendre et de dégager de toute responsabilité Lorepa, ses affiliés, directeurs, employés et agents de toutes réclamations, responsabilités, dommages, pertes et dépenses (y compris les honoraires d'avocat raisonnables) découlant de ou liés de quelque manière que ce soit à son accès ou à son utilisation de la Plateforme, à sa violation des présentes Conditions, ou à sa violation des droits de tiers.`,
            },
            {
                title: "39. Loi Applicable et Juridiction",
                content: `Les présentes Conditions sont régies et interprétées conformément aux lois de la Province de Québec, Canada. Tout litige découlant de ou en relation avec les présentes Conditions sera soumis à la juridiction exclusive des tribunaux du Québec, Canada.`,
            },
            {
                title: "40. Contactez-nous",
                content: (
                    <div className='ml-4'>
                        <p>Pour toute question concernant les présentes Conditions, veuillez nous contacter :</p>
                        <p>Courriel : contact@lorepa.com</p>
                        <p>Téléphone : +1 438 282 6718</p>
                        <p>Adresse : 3910 Rue de Bellechasse, Montréal, Québec, H1X 1J4</p>
                    </div>
                ),
            },
        ],
    },
};

const TermsPage = () => {
    // State for translations, defaulting to English or stored lang
    const [translations, setTranslations] = useState(() => {
        const storedLang = localStorage.getItem('lang');
        return termsTranslations[storedLang] || termsTranslations.fr;
    });

    // Effect to update translations when localStorage changes
    useEffect(() => {
        const handleStorageChange = () => {
            const storedLang = localStorage.getItem('lang');
            setTranslations(termsTranslations[storedLang] || termsTranslations.fr);
        };

        window.addEventListener('storage', handleStorageChange);

        // Initial check in case the lang was set before the component mounted
        handleStorageChange();

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
                    {translations.pageTitle}
                </motion.h1>

                <div className='space-y-10 text-sm leading-relaxed'>
                    {translations.sections.map((section, index) => (
                        <motion.div
                            key={index}
                            custom={index}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUp}
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

export default TermsPage;