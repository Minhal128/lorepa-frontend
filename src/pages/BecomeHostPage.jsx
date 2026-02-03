import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VerificationModal from '../components/VerificationModel';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const becomeHostTranslations = {
    en: {
        becomeHost: 'Become a host',
        validDriverLicense: 'Valid drivers license (Class 5 or equivalent)',
        driverLicenseDescription: 'Scan your driver\'s license or enter your information exactly as it appears on your license.',
        uploadDriverLicense: 'Scan/upload your drivers license',
        country: 'Country',
        selectCountry: 'Select country',
        usa: 'USA',
        canada: 'Canada',
        mexico: 'Mexico',
        firstName: 'First name',
        middleName: 'Middle name',
        lastName: 'Last name',
        licenseNumber: 'License number',
        dateOfBirth: 'Date of birth',
        expirationDate: 'Expiration date',
        validAutoInsurance: 'Valid Auto Insurance Policy',
        autoInsuranceDescription: 'Provide details about your auto insurance policy.',
        policyNumber: 'Policy Number',
        insuranceProvider: 'Insurance Provider',
        uploadPolicyDocument: 'Upload Policy Document',
        trailerRegistration: 'Trailer Registration Certificate (SAAQ)',
        trailerRegistrationDescription: 'Upload your trailer registration certificate.',
        uploadCertificate: 'Upload Certificate',
        trailerPhotos: 'Photos of the Trailer (at least 4 angles)',
        trailerPhotosDescription: 'Upload clear photos of your trailer from various angles.',
        photo1: 'Photo 1',
        photo2: 'Photo 2',
        photo3: 'Photo 3',
        photo4: 'Photo 4',
        mechanicalInspection: 'Mechanical Inspection Report (if applicable)',
        mechanicalInspectionDescription: 'If required, upload your mechanical inspection report.',
        uploadReport: 'Upload Report',
        proofOfOwnership: 'Proof of Ownership (If registration is under a different name)',
        proofOfOwnershipDescription: 'Provide proof of ownership if the registration is not in your name.',
        uploadProof: 'Upload Proof',
        trailerSerial: 'Trailer Serial Number (VIN)',
        trailerSerialDescription: 'Enter your trailer\'s serial number (VIN).',
        vinNumber: 'VIN Number',
        thirdPartyPermission: 'Permission from Third Party Owner or Lessor',
        thirdPartyPermissionDescription: 'If applicable, upload permission from the third-party owner or lessor.',
        uploadPermissionLetter: 'Upload Permission Letter',
        back: 'Back',
        next: 'Next',
        submit: 'Submit',
        clickToUpload: 'Click to upload',
        orDragAndDrop: 'or drag and drop',
        fileTypes: {
            driverLicense: 'SVG, PNG, JPG or GIF (max. 800x600px)',
            documents: 'PDF, JPG, PNG',
            photos: 'JPG, PNG'
        },
        placeholders: {
            firstName: 'First name',
            middleName: 'Middle name (optional)',
            lastName: 'Last name',
            licenseNumber: '000-0000-000',
            dateOfBirth: 'DD-MM-YYYY',
            expirationDate: 'DD-MM-YYYY',
            policyNumber: 'Policy Number',
            insuranceProvider: 'Insurance Provider',
            trailerVin: 'Trailer VIN Number'
        },
        verificationModal: {
            title: 'Application Submitted',
            message: 'Your documents have been submitted for review. Once verified, you\'ll be able to list your trailer.',
            listTrailer: 'List your trailer now!',
            close: 'Close'
        }
    },
    es: {
        becomeHost: 'Conviértete en anfitrión',
        validDriverLicense: 'Licencia de conducir válida (Clase 5 o equivalente)',
        driverLicenseDescription: 'Escanee su licencia de conducir o ingrese su información exactamente como aparece en su licencia.',
        uploadDriverLicense: 'Escanear/subir su licencia de conducir',
        country: 'País',
        selectCountry: 'Seleccionar país',
        usa: 'EE. UU.',
        canada: 'Canadá',
        mexico: 'México',
        firstName: 'Nombre',
        middleName: 'Segundo nombre',
        lastName: 'Apellido',
        licenseNumber: 'Número de licencia',
        dateOfBirth: 'Fecha de nacimiento',
        expirationDate: 'Fecha de vencimiento',
        validAutoInsurance: 'Póliza de seguro de auto válida',
        autoInsuranceDescription: 'Proporcione detalles sobre su póliza de seguro de auto.',
        policyNumber: 'Número de póliza',
        insuranceProvider: 'Proveedor de seguros',
        uploadPolicyDocument: 'Subir documento de póliza',
        trailerRegistration: 'Certificado de registro de remolque (SAAQ)',
        trailerRegistrationDescription: 'Suba su certificado de registro de remolque.',
        uploadCertificate: 'Subir certificado',
        trailerPhotos: 'Fotos del remolque (al menos 4 ángulos)',
        trailerPhotosDescription: 'Suba fotos claras de su remolque desde varios ángulos.',
        photo1: 'Foto 1',
        photo2: 'Foto 2',
        photo3: 'Foto 3',
        photo4: 'Foto 4',
        mechanicalInspection: 'Informe de inspección mecánica (si corresponde)',
        mechanicalInspectionDescription: 'Si es necesario, suba su informe de inspección mecánica.',
        uploadReport: 'Subir informe',
        proofOfOwnership: 'Comprobante de propiedad (Si el registro está a nombre diferente)',
        proofOfOwnershipDescription: 'Proporcione comprobante de propiedad si el registro no está a su nombre.',
        uploadProof: 'Subir comprobante',
        trailerSerial: 'Número de serie del remolque (VIN)',
        trailerSerialDescription: 'Ingrese el número de serie (VIN) de su remolque.',
        vinNumber: 'Número VIN',
        thirdPartyPermission: 'Permiso del propietario o arrendador de terceros',
        thirdPartyPermissionDescription: 'Si corresponde, suba el permiso del propietario o arrendador de terceros.',
        uploadPermissionLetter: 'Subir carta de permiso',
        back: 'Atrás',
        next: 'Siguiente',
        submit: 'Enviar',
        clickToUpload: 'Haz clic para subir',
        orDragAndDrop: 'o arrastra y suelta',
        fileTypes: {
            driverLicense: 'SVG, PNG, JPG o GIF (máx. 800x600px)',
            documents: 'PDF, JPG, PNG',
            photos: 'JPG, PNG'
        },
        placeholders: {
            firstName: 'Nombre',
            middleName: 'Segundo nombre (opcional)',
            lastName: 'Apellido',
            licenseNumber: '000-0000-000',
            dateOfBirth: 'DD-MM-AAAA',
            expirationDate: 'DD-MM-AAAA',
            policyNumber: 'Número de póliza',
            insuranceProvider: 'Proveedor de seguros',
            trailerVin: 'Número VIN del remolque'
        },
        verificationModal: {
            title: 'Solicitud enviada',
            message: 'Sus documentos han sido enviados para revisión. Una vez verificados, podrá listar su remolque.',
            listTrailer: '¡Lista tu remolque ahora!',
            close: 'Cerrar'
        }
    },
    cn: {
        becomeHost: '成为房东',
        validDriverLicense: '有效驾驶执照（5级或同等学历）',
        driverLicenseDescription: '请扫描您的驾驶执照或准确输入执照上的信息。',
        uploadDriverLicense: '扫描/上传您的驾驶执照',
        country: '国家',
        selectCountry: '选择国家',
        usa: '美国',
        canada: '加拿大',
        mexico: '墨西哥',
        firstName: '名字',
        middleName: '中间名',
        lastName: '姓氏',
        licenseNumber: '执照号码',
        dateOfBirth: '出生日期',
        expirationDate: '有效期',
        validAutoInsurance: '有效汽车保险单',
        autoInsuranceDescription: '请提供您的汽车保险单详细信息。',
        policyNumber: '保单号码',
        insuranceProvider: '保险公司',
        uploadPolicyDocument: '上传保单文件',
        trailerRegistration: '拖车登记证 (SAAQ)',
        trailerRegistrationDescription: '请上传您的拖车登记证。',
        uploadCertificate: '上传证书',
        trailerPhotos: '拖车照片（至少4个角度）',
        trailerPhotosDescription: '请上传拖车各个角度的清晰照片。',
        photo1: '照片 1',
        photo2: '照片 2',
        photo3: '照片 3',
        photo4: '照片 4',
        mechanicalInspection: '机械检验报告（如适用）',
        mechanicalInspectionDescription: '如果需要，请上传您的机械检验报告。',
        uploadReport: '上传报告',
        proofOfOwnership: '所有权证明（如果注册名称不同）',
        proofOfOwnershipDescription: '如果注册不在您名下，请提供所有权证明。',
        uploadProof: '上传证明',
        trailerSerial: '拖车序列号 (VIN)',
        trailerSerialDescription: '请输入您拖车的序列号 (VIN)。',
        vinNumber: 'VIN 号码',
        thirdPartyPermission: '第三方车主或租赁人许可',
        thirdPartyPermissionDescription: '如适用，请上传第三方车主或租赁人的许可。',
        uploadPermissionLetter: '上传许可信',
        back: '返回',
        next: '下一步',
        submit: '提交',
        clickToUpload: '点击上传',
        orDragAndDrop: '或拖放',
        fileTypes: {
            driverLicense: 'SVG、PNG、JPG 或 GIF (最大 800x600px)',
            documents: 'PDF、JPG、PNG',
            photos: 'JPG、PNG'
        },
        placeholders: {
            firstName: '名字',
            middleName: '中间名（可选）',
            lastName: '姓氏',
            licenseNumber: '000-0000-000',
            dateOfBirth: '日-月-年',
            expirationDate: '日-月-年',
            policyNumber: '保单号码',
            insuranceProvider: '保险公司',
            trailerVin: '拖车VIN号码'
        },
        verificationModal: {
            title: '申请已提交',
            message: '您的文件已提交审核。审核通过后，您将能够列出您的拖车。',
            listTrailer: '立即列出您的拖车！',
            close: '关闭'
        }
    },
    fr: {
        becomeHost: 'Devenir hôte',
        validDriverLicense: 'Permis de conduire valide (Classe 5 ou équivalent)',
        driverLicenseDescription: 'Scannez votre permis de conduire ou entrez vos informations exactement telles qu\'elles apparaissent sur votre permis.',
        uploadDriverLicense: 'Scanner/télécharger votre permis de conduire',
        country: 'Pays',
        selectCountry: 'Sélectionner un pays',
        usa: 'États-Unis',
        canada: 'Canada',
        mexico: 'Mexique',
        firstName: 'Prénom',
        middleName: 'Deuxième prénom',
        lastName: 'Nom de famille',
        licenseNumber: 'Numéro de permis',
        dateOfBirth: 'Date de naissance',
        expirationDate: 'Date d\'expiration',
        validAutoInsurance: 'Police d\'assurance automobile valide',
        autoInsuranceDescription: 'Fournissez les détails de votre police d\'assurance automobile.',
        policyNumber: 'Numéro de police',
        insuranceProvider: 'Fournisseur d\'assurance',
        uploadPolicyDocument: 'Télécharger le document de police',
        trailerRegistration: 'Certificat d\'immatriculation de remorque (SAAQ)',
        trailerRegistrationDescription: 'Téléchargez votre certificat d\'immatriculation de remorque.',
        uploadCertificate: 'Télécharger le certificat',
        trailerPhotos: 'Photos de la remorque (au moins 4 angles)',
        trailerPhotosDescription: 'Téléchargez des photos claires de votre remorque sous différents angles.',
        photo1: 'Photo 1',
        photo2: 'Photo 2',
        photo3: 'Photo 3',
        photo4: 'Photo 4',
        mechanicalInspection: 'Rapport d\'inspection mécanique (le cas échéant)',
        mechanicalInspectionDescription: 'Si nécessaire, téléchargez votre rapport d\'inspection mécanique.',
        uploadReport: 'Télécharger le rapport',
        proofOfOwnership: 'Preuve de propriété (Si l\'immatriculation est sous un nom différent)',
        proofOfOwnershipDescription: 'Fournissez une preuve de propriété si l\'immatriculation n\'est pas à votre nom.',
        uploadProof: 'Télécharger la preuve',
        trailerSerial: 'Numéro de série de la remorque (VIN)',
        trailerSerialDescription: 'Entrez le numéro de série (VIN) de votre remorque.',
        vinNumber: 'Numéro VIN',
        thirdPartyPermission: 'Autorisation du propriétaire ou du bailleur tiers',
        thirdPartyPermissionDescription: 'Le cas échéant, téléchargez l\'autorisation du propriétaire ou du bailleur tiers.',
        uploadPermissionLetter: 'Télécharger la lettre d\'autorisation',
        back: 'Retour',
        next: 'Suivant',
        submit: 'Soumettre',
        clickToUpload: 'Cliquez pour télécharger',
        orDragAndDrop: 'ou glissez-déposez',
        fileTypes: {
            driverLicense: 'SVG, PNG, JPG ou GIF (max. 800x600px)',
            documents: 'PDF, JPG, PNG',
            photos: 'JPG, PNG'
        },
        placeholders: {
            firstName: 'Prénom',
            middleName: 'Deuxième prénom (facultatif)',
            lastName: 'Nom de famille',
            licenseNumber: '000-0000-000',
            dateOfBirth: 'JJ-MM-AAAA',
            expirationDate: 'JJ-MM-AAAA',
            policyNumber: 'Numéro de police',
            insuranceProvider: 'Fournisseur d\'assurance',
            trailerVin: 'Numéro VIN de la remorque'
        },
        verificationModal: {
            title: 'Demande soumise',
            message: 'Vos documents ont été soumis pour examen. Une fois vérifiés, vous pourrez lister votre remorque.',
            listTrailer: 'Listez votre remorque maintenant!',
            close: 'Fermer'
        }
    }
};

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' },
    },
};

const UploadCloudIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-gray-400">
        <path d="M12 16v-8" /><path d="M8 12h8" /><path d="M16 16l-4-4-4 4" />
        <path d="M18 10h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h1" />
    </svg>
);

const BecomeHostPage = () => {
    const nav = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [translations, setTranslations] = useState(() => {
        const storedLang = localStorage.getItem('lang');
        return becomeHostTranslations[storedLang] || becomeHostTranslations.fr;
    });

    const fileInputRefs = {
        driverLicense: useRef(null),
        policyDocument: useRef(null),
        registrationCertificate: useRef(null),
        inspectionReport: useRef(null),
        proofOfOwnership: useRef(null),
        permissionLetter: useRef(null),
        trailerPhoto1: useRef(null),
        trailerPhoto2: useRef(null),
        trailerPhoto3: useRef(null),
        trailerPhoto4: useRef(null),
    };

    useEffect(() => {
        const handleStorageChange = () => {
            const storedLang = localStorage.getItem('lang');
            setTranslations(becomeHostTranslations[storedLang] || becomeHostTranslations.fr);
        };
        window.addEventListener('storage', handleStorageChange);
        handleStorageChange();
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const steps = [
        {
            title: translations.validDriverLicense,
            description: translations.driverLicenseDescription,
            fields: [
                { id: 'driverLicense', label: translations.uploadDriverLicense, type: 'file', placeholder: translations.fileTypes.driverLicense, icon: <UploadCloudIcon />, fileType: 'image' },
                {
                    id: 'country', label: translations.country, type: 'select',
                    options: [
                        { value: '', label: translations.selectCountry },
                        { value: 'USA', label: translations.usa },
                        { value: 'Canada', label: translations.canada },
                        { value: 'Mexico', label: translations.mexico }
                    ]
                },
                { id: 'firstName', label: translations.firstName, type: 'text', placeholder: translations.placeholders.firstName },
                { id: 'middleName', label: translations.middleName, type: 'text', placeholder: translations.placeholders.middleName, optional: true },
                { id: 'lastName', label: translations.lastName, type: 'text', placeholder: translations.placeholders.lastName },
                { id: 'licenseNumber', label: translations.licenseNumber, type: 'text', placeholder: translations.placeholders.licenseNumber },
                { id: 'dateOfBirth', label: translations.dateOfBirth, type: 'text', placeholder: translations.placeholders.dateOfBirth },
                { id: 'expirationDate', label: translations.expirationDate, type: 'text', placeholder: translations.placeholders.expirationDate },
            ],
            required: ['driverLicense', 'country', 'firstName', 'lastName', 'licenseNumber', 'dateOfBirth', 'expirationDate']
        },
        {
            title: translations.validAutoInsurance,
            description: translations.autoInsuranceDescription,
            fields: [
                { id: 'policyNumber', label: translations.policyNumber, type: 'text', placeholder: translations.placeholders.policyNumber },
                { id: 'insuranceProvider', label: translations.insuranceProvider, type: 'text', placeholder: translations.placeholders.insuranceProvider },
                { id: 'policyDocument', label: translations.uploadPolicyDocument, type: 'file', placeholder: translations.fileTypes.documents, icon: <UploadCloudIcon />, fileType: 'doc' },
            ],
            required: ['policyNumber', 'insuranceProvider', 'policyDocument']
        },
        {
            title: translations.trailerRegistration,
            description: translations.trailerRegistrationDescription,
            fields: [
                { id: 'registrationCertificate', label: translations.uploadCertificate, type: 'file', placeholder: translations.fileTypes.documents, icon: <UploadCloudIcon />, fileType: 'doc' },
            ],
            required: ['registrationCertificate']
        },
        {
            title: translations.trailerPhotos,
            description: translations.trailerPhotosDescription,
            fields: [
                { id: 'trailerPhoto1', label: translations.photo1, type: 'file', placeholder: translations.fileTypes.photos, icon: <UploadCloudIcon />, fileType: 'image' },
                { id: 'trailerPhoto2', label: translations.photo2, type: 'file', placeholder: translations.fileTypes.photos, icon: <UploadCloudIcon />, fileType: 'image' },
                { id: 'trailerPhoto3', label: translations.photo3, type: 'file', placeholder: translations.fileTypes.photos, icon: <UploadCloudIcon />, fileType: 'image' },
                { id: 'trailerPhoto4', label: translations.photo4, type: 'file', placeholder: translations.fileTypes.photos, icon: <UploadCloudIcon />, fileType: 'image' },
            ],
            required: ['trailerPhoto1', 'trailerPhoto2', 'trailerPhoto3', 'trailerPhoto4']
        },
        {
            title: translations.mechanicalInspection,
            description: translations.mechanicalInspectionDescription,
            fields: [
                { id: 'inspectionReport', label: translations.uploadReport, type: 'file', placeholder: translations.fileTypes.documents, icon: <UploadCloudIcon />, fileType: 'doc' },
            ],
            optional: true
        },
        {
            title: translations.proofOfOwnership,
            description: translations.proofOfOwnershipDescription,
            fields: [
                { id: 'proofOfOwnership', label: translations.uploadProof, type: 'file', placeholder: translations.fileTypes.documents, icon: <UploadCloudIcon />, fileType: 'doc' },
            ],
            optional: true
        },
        {
            title: translations.trailerSerial,
            description: translations.trailerSerialDescription,
            fields: [
                { id: 'vinNumber', label: translations.vinNumber, type: 'text', placeholder: translations.placeholders.trailerVin },
            ],
            required: ['vinNumber']
        },
        {
            title: translations.thirdPartyPermission,
            description: translations.thirdPartyPermissionDescription,
            fields: [
                { id: 'permissionLetter', label: translations.uploadPermissionLetter, type: 'file', placeholder: translations.fileTypes.documents, icon: <UploadCloudIcon />, fileType: 'doc' },
            ],
            optional: true
        },
    ];

    const handleChange = (e) => {
        const { id, value, files, type } = e.target;
        setFormData(prev => ({ ...prev, [id]: type === 'file' ? files[0] : value }));
    };

    const handleFileClick = (id) => {
        if (fileInputRefs[id] && fileInputRefs[id].current) {
            fileInputRefs[id].current.click();
        }
    };

    const isStepCompleted = (stepIndex) => {
        const step = steps[stepIndex];
        if (step.optional) return true;
        const requiredFields = step.required || [];
        return requiredFields.every(fieldId => {
            const value = formData[fieldId];
            return value !== undefined && value !== null && value !== '';
        });
    };

    const handleNext = () => {
        if (isStepCompleted(currentStep)) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleSubmit = () => {
        if (isStepCompleted(currentStep)) {
            setShowVerificationModal(true);
        }
    };

    const currentStepData = steps[currentStep];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentStep]);

    return (
        <div className='min-h-screen bg-gray-100 flex flex-col font-inter'>
            <Navbar />
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="flex flex-1 mobile-px py-4 sm:py-6 lg:py-8"
            >
                {/* Mobile Step Indicator */}
                <div className="md:hidden w-full mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-500">
                            Step {currentStep + 1} of {steps.length}
                        </span>
                        <span className={`text-sm font-medium ${steps[currentStep].optional ? 'text-gray-500' : 'text-blue-600'}`}>
                            {steps[currentStep].optional ? 'Optional' : 'Required'}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Desktop Sidebar */}
                <div className="w-1/4 pr-8 hidden md:block border-r border-r-[#C3C3C3] flex-shrink-0">
                    <ul className="space-y-3 sticky top-24">
                        {steps.map((step, index) => (
                            <li key={index}
                                className={`flex items-start text-sm font-medium cursor-pointer rounded-lg p-2 transition-colors ${index === currentStep ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-200'} ${index < currentStep ? 'text-gray-400' : ''} ${!isStepCompleted(index) && index < currentStep ? 'text-red-500' : ''}`}
                            >
                                <div className={`min-w-6 min-h-6 flex items-center justify-center rounded-full text-xs mr-3 flex-shrink-0 ${index === currentStep ? 'bg-blue-600 text-white' : 'border border-gray-400 text-gray-600'} ${index < currentStep && isStepCompleted(index) ? 'bg-green-500 text-white border-green-500' : ''} ${!isStepCompleted(index) && index < currentStep ? 'bg-red-500 text-white border-red-500' : ''}`}>
                                    {index < currentStep && isStepCompleted(index) ? '✓' : index < currentStep && !isStepCompleted(index) ? '✗' : index + 1}
                                </div>
                                <span className='text-xs leading-relaxed'>{step.title}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Main Form Content */}
                <div className="flex-1 md:pl-8">
                    <motion.h2 variants={fadeInUp} className="text-xl sm:text-2xl lg:text-3xl text-[#757982] mb-4 border-b border-b-[#CCCCCC] pb-3">{translations.becomeHost}</motion.h2>
                    <motion.h3 variants={fadeInUp} className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 mb-4 sm:mb-6">{currentStepData.title}</motion.h3>
                    <motion.p variants={fadeInUp} className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">{currentStepData.description}</motion.p>

                    <motion.div variants={fadeInUp} className="grid grid-cols-1 gap-4 sm:gap-6">
                        {currentStepData.fields.map(field => (
                            <div key={field.id} className="mb-2 sm:mb-4">
                                <label htmlFor={field.id} className="block text-gray-700 text-sm font-medium mb-2">{field.label}</label>
                                {field.type === 'file' ? (
                                    <div
                                        className="flex flex-col items-center justify-center w-full py-8 sm:py-10 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                                        onClick={() => handleFileClick(field.id)}
                                    >
                                        <input
                                            id={field.id}
                                            type="file"
                                            className="hidden"
                                            onChange={handleChange}
                                            ref={fileInputRefs[field.id]}
                                            accept={field.fileType === 'image' ? 'image/*' : '.pdf,.jpg,.png'}
                                        />
                                        {formData[field.id] ? (
                                            <div className="flex flex-col items-center px-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 sm:w-12 sm:h-12 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-8.63"></path><path d="M22 4L12 14.01l-3-3"></path></svg>
                                                <p className="mt-2 text-sm text-gray-600 font-semibold text-center line-clamp-2">{formData[field.id].name}</p>
                                            </div>
                                        ) : (
                                            <>
                                                {field.icon}
                                                <p className="mt-2 text-sm text-gray-600 text-center px-4">
                                                    <span className="font-semibold text-blue-600">{translations.clickToUpload}</span> {translations.orDragAndDrop}
                                                </p>
                                            </>
                                        )}
                                        <p className="text-xs text-gray-500 mt-2">{field.placeholder}</p>
                                    </div>
                                ) : field.type === 'select' ? (
                                    <select
                                        id={field.id}
                                        value={formData[field.id] || ''}
                                        onChange={handleChange}
                                        className="mobile-select"
                                    >
                                        {field.options.map((opt, i) => (
                                            <option key={i} value={opt.value} disabled={opt.value === ''}>{opt.label}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        id={field.id}
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        value={formData[field.id] || ''}
                                        onChange={handleChange}
                                        className="mobile-input"
                                    />
                                )}
                            </div>
                        ))}
                    </motion.div>

                    {/* Navigation Buttons */}
                    <motion.div variants={fadeInUp} className="flex justify-between mt-6 sm:mt-8 pt-4 border-t border-gray-200 gap-4">
                        {currentStep > 0 && (
                            <button
                                onClick={() => setCurrentStep(prev => prev - 1)}
                                className="mobile-btn-secondary flex-1 sm:flex-none"
                            >
                                {translations.back}
                            </button>
                        )}
                        <div className={`${currentStep === 0 ? 'w-full' : 'flex-1 sm:flex-none'} ${currentStep > 0 ? 'ml-auto' : ''}`}>
                            {currentStep < steps.length - 1 ? (
                                <button
                                    onClick={handleNext}
                                    disabled={!isStepCompleted(currentStep)}
                                    className={`mobile-btn w-full ${isStepCompleted(currentStep) ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                >
                                    {translations.next}
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={!isStepCompleted(currentStep)}
                                    className={`mobile-btn w-full ${isStepCompleted(currentStep) ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                >
                                    {translations.submit}
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            <VerificationModal
                isOpen={showVerificationModal}
                onClose={() => setShowVerificationModal(false)}
                onListTrailer={() => { setShowVerificationModal(false); nav('/list'); }}
                translations={translations.verificationModal}
            />
            <Footer />
        </div>
    );
};

export default BecomeHostPage;