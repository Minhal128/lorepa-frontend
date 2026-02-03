import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { GoAlertFill } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import toast from 'react-hot-toast';

const translations = {
    en: {
        listTrailer: 'List Trailer',
        basicInfo: 'Basic Info',
        basicInfoDescription: 'Start with the basic information about your trailer.',
        listingTitle: 'Listing Title',
        titlePlaceholder: 'Give your listing a captivating title',
        category: 'Category',
        selectCategory: 'Select Category',
        travelTrailer: 'Travel Trailer',
        fifthWheel: 'Fifth Wheel',
        toyHauler: 'Toy Hauler',
        trailerMake: 'Trailer Make',
        makePlaceholder: 'e.g., Airstream',
        trailerModel: 'Trailer Model',
        modelPlaceholder: 'e.g., Classic',
        description: 'Description of your trailer',
        descriptionPlaceholder: 'Describe your trailer in detail',
        trailerDetails: 'Trailer Details',
        trailerDetailsDescription: 'Provide more specific details about your trailer.',
        hitchType: 'Hitch Type',
        hitchTypePlaceholder: 'e.g., Bumper Pull',
        ballSize: 'Ball Size (inches)',
        ballSizePlaceholder: 'e.g., 2',
        lightPlug: 'Light Plug Configuration',
        lightPlugPlaceholder: 'e.g., 4 pin',
        weightCapacity: 'Weight Capacity (lbs)',
        weightCapacityPlaceholder: 'e.g., 2000',
        year: 'Year',
        yearPlaceholder: 'e.g., 2020',
        length: 'Length (in feet)',
        lengthPlaceholder: 'e.g., 25',
        locationAddress: 'Location Address',
        locationAddressDescription: 'Enter the location where your trailer will be available for pickup.',
        address: 'Address',
        addressPlaceholder: 'Street Address',
        city: 'City',
        cityPlaceholder: 'City',
        state: 'State/Province',
        statePlaceholder: 'State/Province',
        zip: 'Zip/Postal Code',
        zipPlaceholder: 'Zip/Postal Code',
        pricingAndTerms: 'Pricing & Rental Terms',
        pricingAndTermsDescription: 'Set your pricing and define rental terms for your trailer.',
        dailyRate: 'Daily Rate (CAD)',
        dailyRatePlaceholder: 'e.g., $150.00 CAD',
        weeklyRate: 'Weekly Rate (CAD)',
        weeklyRatePlaceholder: 'e.g., $900.00 CAD',
        monthlyRate: 'Monthly Rate (CAD)',
        monthlyRatePlaceholder: 'e.g., $3000.00 CAD',
        cleaningFee: 'Cleaning Fee (CAD)',
        cleaningFeePlaceholder: 'e.g., $50.00 CAD',
        securityDeposit: 'Security Deposit (CAD)',
        securityDepositPlaceholder: 'e.g., $1000.00 CAD',
        insuranceDeductible: 'Insurance Deductible (CAD)',
        insuranceDeductiblePlaceholder: 'e.g., $500.00 CAD',
        important: 'Important!',
        importantMessage: 'You will not be approved until you set up your bank account. Login to the mobile app to set up your bank account or click here.',
        uploadImages: 'Upload Trailer Images (Max 4)',
        uploadImagesButton: 'Upload Images',
        imagesSelected: 'image(s) selected.',
        back: 'Back',
        next: 'Next',
        submit: 'Submit',
        only4ImagesAllowed: 'Only 4 images allowed',
        submissionFailed: 'Submission failed',
        somethingWentWrong: 'Something went wrong',
        trailerCreatedSuccessfully: 'Trailer created successfully!',
        userIdNotFound: 'User ID not found',
        incompleteFields: 'Please fill out all fields before proceeding.'
    },
    es: {
        listTrailer: 'Listar Remolque',
        basicInfo: 'Información Básica',
        basicInfoDescription: 'Comience con la información básica sobre su remolque.',
        listingTitle: 'Título del Anuncio',
        titlePlaceholder: 'Dé a su anuncio un título cautivador',
        category: 'Categoría',
        selectCategory: 'Seleccionar Categoría',
        travelTrailer: 'Remolque de Viaje',
        fifthWheel: 'Quinta Rueda',
        toyHauler: 'Remolque de Juguetes',
        trailerMake: 'Marca del Remolque',
        makePlaceholder: 'ej., Airstream',
        trailerModel: 'Modelo del Remolque',
        modelPlaceholder: 'ej., Classic',
        description: 'Descripción de su remolque',
        descriptionPlaceholder: 'Describa su remolque en detalle',
        trailerDetails: 'Detalles del Remolque',
        trailerDetailsDescription: 'Proporcione detalles más específicos sobre su remolque.',
        hitchType: 'Tipo de Enganche',
        hitchTypePlaceholder: 'ej., Bumper Pull',
        ballSize: 'Tamaño de Bola (pulgadas)',
        ballSizePlaceholder: 'ej., 2',
        lightPlug: 'Configuración del Conector de Luces',
        lightPlugPlaceholder: 'ej., 4 pin',
        weightCapacity: 'Capacidad de Peso (libras)',
        weightCapacityPlaceholder: 'ej., 2000',
        year: 'Año',
        yearPlaceholder: 'ej., 2020',
        length: 'Longitud (en pies)',
        lengthPlaceholder: 'ej., 25',
        locationAddress: 'Dirección de Ubicación',
        locationAddressDescription: 'Ingrese la ubicación donde su remolque estará disponible para ser recogido.',
        address: 'Dirección',
        addressPlaceholder: 'Dirección de la calle',
        city: 'Ciudad',
        cityPlaceholder: 'Ciudad',
        state: 'Estado/Provincia',
        statePlaceholder: 'Estado/Provincia',
        zip: 'Código Postal',
        zipPlaceholder: 'Código Postal',
        pricingAndTerms: 'Precios y Términos de Alquiler',
        pricingAndTermsDescription: 'Establezca sus precios y defina los términos de alquiler para su remolque.',
        dailyRate: 'Tarifa Diaria (CAD)',
        dailyRatePlaceholder: 'ej., $150.00 CAD',
        weeklyRate: 'Tarifa Semanal (CAD)',
        weeklyRatePlaceholder: 'ej., $900.00 CAD',
        monthlyRate: 'Tarifa Mensual (CAD)',
        monthlyRatePlaceholder: 'ej., $3000.00 CAD',
        cleaningFee: 'Tarifa de Limpieza (CAD)',
        cleaningFeePlaceholder: 'ej., $50.00 CAD',
        securityDeposit: 'Depósito de Seguridad (CAD)',
        securityDepositPlaceholder: 'ej., $1000.00 CAD',
        insuranceDeductible: 'Deducible del Seguro (CAD)',
        insuranceDeductiblePlaceholder: 'ej., $500.00 CAD',
        important: '¡Importante!',
        importantMessage: 'No será aprobado hasta que configure su cuenta bancaria. Inicie sesión en la aplicación móvil para configurar su cuenta bancaria o haga clic aquí.',
        uploadImages: 'Subir Imágenes del Remolque (Máx. 4)',
        uploadImagesButton: 'Subir Imágenes',
        imagesSelected: 'imagen(es) seleccionada(s).',
        back: 'Atrás',
        next: 'Siguiente',
        submit: 'Enviar',
        only4ImagesAllowed: 'Solo se permiten 4 imágenes',
        submissionFailed: 'El envío falló',
        somethingWentWrong: 'Algo salió mal',
        trailerCreatedSuccessfully: '¡Remolque creado con éxito!',
        userIdNotFound: 'ID de usuario no encontrado',
        incompleteFields: 'Por favor, complete todos los campos antes de continuar.'
    },
    cn: {
        listTrailer: '列出拖车',
        basicInfo: '基本信息',
        basicInfoDescription: '从拖车的基本信息开始。',
        listingTitle: '房源标题',
        titlePlaceholder: '为您的房源取一个引人注目的标题',
        category: '类别',
        selectCategory: '选择类别',
        travelTrailer: '旅行拖车',
        fifthWheel: '第五轮拖车',
        toyHauler: '玩具运输车',
        trailerMake: '拖车品牌',
        makePlaceholder: '例如：Airstream',
        trailerModel: '拖车型号',
        modelPlaceholder: '例如：Classic',
        description: '拖车描述',
        descriptionPlaceholder: '详细描述您的拖车',
        trailerDetails: '拖车详情',
        trailerDetailsDescription: '提供有关拖车的更多具体细节。',
        hitchType: '挂钩类型',
        hitchTypePlaceholder: '例如：Bumper Pull',
        ballSize: '球尺寸（英寸）',
        ballSizePlaceholder: '例如：2',
        lightPlug: '灯插头配置',
        lightPlugPlaceholder: '例如：4 pin',
        weightCapacity: '承重能力（磅）',
        weightCapacityPlaceholder: '例如：2000',
        year: '年份',
        yearPlaceholder: '例如：2020',
        length: '长度（英尺）',
        lengthPlaceholder: '例如：25',
        locationAddress: '位置地址',
        locationAddressDescription: '输入您的拖车可供取车的位置。',
        address: '地址',
        addressPlaceholder: '街道地址',
        city: '城市',
        cityPlaceholder: '城市',
        state: '州/省',
        statePlaceholder: '州/省',
        zip: '邮政编码',
        zipPlaceholder: '邮政编码',
        pricingAndTerms: '定价和租赁条款',
        pricingAndTermsDescription: '为您的拖车设置定价并定义租赁条款。',
        dailyRate: '日租金（加元）',
        dailyRatePlaceholder: '例如：$150.00 CAD',
        weeklyRate: '周租金（加元）',
        weeklyRatePlaceholder: '例如：$900.00 CAD',
        monthlyRate: '月租金（加元）',
        monthlyRatePlaceholder: '例如：$3000.00 CAD',
        cleaningFee: '清洁费（加元）',
        cleaningFeePlaceholder: '例如：$50.00 CAD',
        securityDeposit: '押金（加元）',
        securityDepositPlaceholder: '例如：$1000.00 CAD',
        insuranceDeductible: '保险免赔额（加元）',
        insuranceDeductiblePlaceholder: '例如：$500.00 CAD',
        important: '重要！',
        importantMessage: '在您设置银行账户之前，您的申请将不会被批准。请登录移动应用程序设置您的银行账户或点击此处。',
        uploadImages: '上传拖车图片（最多4张）',
        uploadImagesButton: '上传图片',
        imagesSelected: '张图片已选择。',
        back: '返回',
        next: '下一步',
        submit: '提交',
        only4ImagesAllowed: '只允许4张图片',
        submissionFailed: '提交失败',
        somethingWentWrong: '出错了',
        trailerCreatedSuccessfully: '拖车创建成功！',
        userIdNotFound: '未找到用户 ID',
        incompleteFields: '在继续之前请填写所有字段。'
    },
    fr: {
        listTrailer: 'Lister une remorque',
        basicInfo: 'Informations de base',
        basicInfoDescription: 'Commencez par les informations de base sur votre remorque.',
        listingTitle: 'Titre de l\'annonce',
        titlePlaceholder: 'Donnez un titre attrayant à votre annonce',
        category: 'Catégorie',
        selectCategory: 'Sélectionner une catégorie',
        travelTrailer: 'Remorque de voyage',
        fifthWheel: 'Cinquième roue',
        toyHauler: 'Transporteur de jouets',
        trailerMake: 'Marque de la remorque',
        makePlaceholder: 'ex., Airstream',
        trailerModel: 'Modèle de la remorque',
        modelPlaceholder: 'ex., Classic',
        description: 'Description de votre remorque',
        descriptionPlaceholder: 'Décrivez votre remorque en détail',
        trailerDetails: 'Détails de la remorque',
        trailerDetailsDescription: 'Fournissez des détails plus spécifiques sur votre remorque.',
        hitchType: 'Type d\'attelage',
        hitchTypePlaceholder: 'ex., Bumper Pull',
        ballSize: 'Taille de la boule (pouces)',
        ballSizePlaceholder: 'ex., 2',
        lightPlug: 'Configuration de la prise de lumières',
        lightPlugPlaceholder: 'ex., 4 pin',
        weightCapacity: 'Capacité de poids (livres)',
        weightCapacityPlaceholder: 'ex., 2000',
        year: 'Année',
        yearPlaceholder: 'ex., 2020',
        length: 'Longueur (en pieds)',
        lengthPlaceholder: 'ex., 25',
        locationAddress: 'Adresse de localisation',
        locationAddressDescription: 'Entrez l\'emplacement où votre remorque sera disponible pour le ramassage.',
        address: 'Adresse',
        addressPlaceholder: 'Adresse de la rue',
        city: 'Ville',
        cityPlaceholder: 'Ville',
        state: 'État/Province',
        statePlaceholder: 'État/Province',
        zip: 'Code postal',
        zipPlaceholder: 'Code postal',
        pricingAndTerms: 'Prix et conditions de location',
        pricingAndTermsDescription: 'Définissez vos prix et les conditions de location pour votre remorque.',
        dailyRate: 'Tarif journalier (CAD)',
        dailyRatePlaceholder: 'ex., 150,00 $ CAD',
        weeklyRate: 'Tarif hebdomadaire (CAD)',
        weeklyRatePlaceholder: 'ex., 900,00 $ CAD',
        monthlyRate: 'Tarif mensuel (CAD)',
        monthlyRatePlaceholder: 'ex., 3000,00 $ CAD',
        cleaningFee: 'Frais de nettoyage (CAD)',
        cleaningFeePlaceholder: 'ex., 50,00 $ CAD',
        securityDeposit: 'Dépôt de garantie (CAD)',
        securityDepositPlaceholder: 'ex., 1000,00 $ CAD',
        insuranceDeductible: 'Franchise d\'assurance (CAD)',
        insuranceDeductiblePlaceholder: 'ex., 500,00 $ CAD',
        important: 'Important!',
        importantMessage: 'Votre approbation ne sera pas finalisée tant que vous n\'aurez pas configuré votre compte bancaire. Connectez-vous à l\'application mobile pour configurer votre compte bancaire ou cliquez ici.',
        uploadImages: 'Télécharger les images de la remorque (Max 4)',
        uploadImagesButton: 'Télécharger les images',
        imagesSelected: 'image(s) sélectionnée(s).',
        back: 'Retour',
        next: 'Suivant',
        submit: 'Soumettre',
        only4ImagesAllowed: 'Seulement 4 images autorisées',
        submissionFailed: 'Échec de la soumission',
        somethingWentWrong: 'Quelque chose a mal tourné',
        trailerCreatedSuccessfully: 'Remorque créée avec succès!',
        userIdNotFound: 'ID utilisateur introuvable',
        incompleteFields: 'Veuillez remplir tous les champs avant de continuer.'
    }
};

const ListTrailer = () => {
    const nav = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        make: '',
        model: '',
        description: '',
        hitchType: '',
        ballSize: '',
        lightPlug: '',
        weightCapacity: '',
        year: '',
        length: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        dailyRate: '',
        weeklyRate: '',
        monthlyRate: '',
        cleaningRate: '',
        securityRate: '',
        insuranceDeductible: '',
        latitude: '',
        longitude: ''
    });

    const [lang, setLang] = useState(() => {
        const storedLang = localStorage.getItem('lang');
        return translations[storedLang] || translations.fr;
    });

    useEffect(() => {
        const handleStorageChange = () => {
            const storedLang = localStorage.getItem('lang');
            setLang(translations[storedLang] || translations.fr);
        };
        window.addEventListener('storage', handleStorageChange);
        handleStorageChange();
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const steps = [
        {
            title: lang.basicInfo,
            description: lang.basicInfoDescription,
            fields: [
                { id: 'title', label: lang.listingTitle, type: 'text', placeholder: lang.titlePlaceholder },
                { id: 'category', label: lang.category, type: 'select', options: [lang.selectCategory, "Utility", "Enclosed", "Flatbed", "Dump", "Boat"] },
                { id: 'make', label: lang.trailerMake, type: 'text', placeholder: lang.makePlaceholder },
                { id: 'model', label: lang.trailerModel, type: 'text', placeholder: lang.modelPlaceholder },
                { id: 'description', label: lang.description, type: 'textarea', placeholder: lang.descriptionPlaceholder },
            ],
        },
        {
            title: lang.trailerDetails,
            description: lang.trailerDetailsDescription,
            fields: [
                { id: 'hitchType', label: lang.hitchType, type: 'text', placeholder: lang.hitchTypePlaceholder },
                { id: 'ballSize', label: lang.ballSize, type: 'text', placeholder: lang.ballSizePlaceholder },
                { id: 'lightPlug', label: lang.lightPlug, type: 'text', placeholder: lang.lightPlugPlaceholder },
                { id: 'weightCapacity', label: lang.weightCapacity, type: 'text', placeholder: lang.weightCapacityPlaceholder },
                { id: 'year', label: lang.year, type: 'text', placeholder: lang.yearPlaceholder },
                { id: 'length', label: lang.length, type: 'text', placeholder: lang.lengthPlaceholder },
            ],
        },
        {
            title: lang.locationAddress,
            description: lang.locationAddressDescription,
            fields: [
                { id: 'address', label: lang.address, type: 'text', placeholder: lang.addressPlaceholder },
                { id: 'city', label: lang.city, type: 'text', placeholder: lang.cityPlaceholder },
                { id: 'state', label: lang.state, type: 'text', placeholder: lang.statePlaceholder },
                { id: 'zip', label: lang.zip, type: 'text', placeholder: lang.zipPlaceholder },
            ],
        },
        {
            title: lang.pricingAndTerms,
            description: lang.pricingAndTermsDescription,
            fields: [
                { id: 'dailyRate', label: lang.dailyRate, type: 'text', placeholder: lang.dailyRatePlaceholder },
                { id: 'weeklyRate', label: lang.weeklyRate, type: 'text', placeholder: lang.weeklyRatePlaceholder },
                { id: 'monthlyRate', label: lang.monthlyRate, type: 'text', placeholder: lang.monthlyRatePlaceholder },
                { id: 'cleaningRate', label: lang.cleaningFee, type: 'text', placeholder: lang.cleaningFeePlaceholder },
                { id: 'securityRate', label: lang.securityDeposit, type: 'text', placeholder: lang.securityDepositPlaceholder },
                { id: 'insuranceDeductible', label: lang.insuranceDeductible, type: 'text', placeholder: lang.insuranceDeductiblePlaceholder },
            ],
        },
    ];

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleNext = () => {
        const currentStepFields = steps[currentStep].fields;
        const isStepComplete = currentStepFields.every(field => {
            const value = formData[field.id];
            return value && value.trim() !== '';
        });

        if (isStepComplete) {
            if (currentStep < steps.length - 1) {
                setCurrentStep((prev) => prev + 1);
            }
        } else {
            toast.error(lang.incompleteFields);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleSubmit = async () => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) return toast.error(lang.userIdNotFound);

            const data = new FormData();
            data.append("userId", userId);

            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value);
            });

            images.forEach((img) => {
                data.append("images", img);
            });

            const res = await axios.post(`${config.baseUrl}/trailer/create`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data?.status === 200) {
                toast.success(lang.trailerCreatedSuccessfully);
                setTimeout(() => nav("/"), 2000);
            } else {
                toast.error(res.data?.msg || lang.submissionFailed);
            }
        } catch (err) {
            console.error(err);
            toast.error(lang.somethingWentWrong);
        }
    };


    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData((prev) => ({
                        ...prev,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }));
                },
                (error) => {
                    console.error("Error getting location:", error);
                    toast.error("Unable to fetch your location");
                }
            );
        } else {
            toast.error("Geolocation not supported by your browser");
        }
    }, []);

    const currentStepData = steps[currentStep];

    return (
        <div className='min-h-screen bg-gray-100 flex flex-col font-inter'>
            <Navbar />
            <div className="flex flex-1 flex-col lg:flex-row container mx-auto mobile-px py-6 sm:py-10">
                {/* Sidebar - Hidden on mobile, drawer or simpler stepper on mobile? */}
                {/* Let's make it a horizontal stepper on mobile */}
                <div className="w-full lg:w-1/4 lg:pr-8 mb-8 lg:mb-0 lg:border-r lg:border-r-[#C3C3C3]">
                    <ul className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible space-x-4 lg:space-x-0 lg:space-y-4 pb-2 lg:pb-0 scrollbar-hide">
                        {steps.map((step, index) => (
                            <li
                                key={index}
                                className={`flex items-center text-sm font-medium cursor-pointer rounded-lg p-2 transition-colors duration-200 whitespace-nowrap lg:whitespace-normal ${index === currentStep ? 'text-blue-600 bg-blue-50 lg:bg-transparent' : 'text-gray-600 hover:bg-gray-100'} ${index < currentStep ? 'text-green-600' : ''}`}
                                onClick={() => setCurrentStep(index)}
                            >
                                <div className={`min-w-6 min-h-6 flex items-center justify-center rounded-full text-xs mr-3 ${index === currentStep ? 'bg-blue-600 text-white' : 'border border-gray-400 text-gray-600'} ${index < currentStep ? 'bg-green-500 text-white border-green-500' : ''}`}>
                                    {index < currentStep ? '✓' : index + 1}
                                </div>
                                <span className='hidden sm:inline lg:inline text-xs'>{step.title}</span>
                                {index === currentStep && <span className='sm:hidden text-xs'>{step.title}</span>}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex-1 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl text-[#757982] mb-4 border-b border-b-[#CCCCCC] pb-3">{lang.listTrailer}</h2>
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">{currentStepData.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-6">{currentStepData.description}</p>

                    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8" role="alert">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <GoAlertFill className="h-5 w-5 text-amber-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-xs sm:text-sm text-amber-700 font-medium">{lang.important}</p>
                                <p className="text-xs sm:text-sm text-amber-700 mt-1">
                                    {lang.importantMessage.split('here.').map((part, index) => (
                                        <React.Fragment key={index}>
                                            {part}
                                            {index < lang.importantMessage.split('here.').length - 1 && (
                                                <a href="#" className="underline font-bold">here</a>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                        {currentStepData.fields.map(field => (
                            <div key={field.id} className={`mobile-form-group ${field.type === 'textarea' ? 'sm:col-span-2' : ''}`}>
                                <label htmlFor={field.id} className="mobile-form-label">{field.label}</label>
                                {field.type === 'select' ? (
                                    <select
                                        id={field.id}
                                        value={formData[field.id] || ''}
                                        onChange={handleChange}
                                        className="mobile-select"
                                    >
                                        {field.options.map((option, idx) => (
                                            <option key={idx} value={option === field.options[0] ? '' : option} disabled={option === field.options[0]}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                ) : field.type === 'textarea' ? (
                                    <textarea
                                        id={field.id}
                                        placeholder={field.placeholder}
                                        value={formData[field.id]}
                                        onChange={handleChange}
                                        rows={4}
                                        className="mobile-input min-h-[120px] resize-none"
                                    />
                                ) : (
                                    <input
                                        id={field.id}
                                        type="text"
                                        placeholder={field.placeholder}
                                        value={formData[field.id]}
                                        onChange={handleChange}
                                        className="mobile-input"
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {currentStep === steps.length - 1 && (
                        <div className="mb-6 mobile-form-group">
                            <label className="mobile-form-label">{lang.uploadImages}</label>
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 transition-colors hover:border-blue-400">
                                <button
                                    type="button"
                                    onClick={() => document.getElementById("imageUploadInput").click()}
                                    className="mobile-btn-primary w-full sm:w-auto px-8"
                                >
                                    {lang.uploadImagesButton}
                                </button>
                                <p className="mt-4 text-xs sm:text-sm text-gray-500">{images.length} {lang.imagesSelected}</p>
                            </div>
                            <input
                                type="file"
                                id="imageUploadInput"
                                accept="image/*"
                                multiple
                                hidden
                                onChange={(e) => {
                                    const selected = Array.from(e.target.files);
                                    if (selected.length > 4) {
                                        toast.error(lang.only4ImagesAllowed);
                                    } else {
                                        setImages(selected);
                                    }
                                }}
                            />
                        </div>
                    )}

                    <div className="flex gap-4 mt-10 pt-6 border-t border-gray-200">
                        {currentStep > 0 && (
                            <button onClick={handleBack} className="mobile-btn-outline flex-1 sm:flex-none sm:px-10">
                                {lang.back}
                            </button>
                        )}
                        {currentStep < steps.length - 1 ? (
                            <button onClick={handleNext} className="mobile-btn-primary min-w-[120px] ml-auto flex-1 sm:flex-none sm:px-10">
                                {lang.next}
                            </button>
                        ) : (
                            <button onClick={handleSubmit} className="mobile-btn-primary bg-green-600 border-green-600 hover:bg-green-700 min-w-[140px] ml-auto flex-1 sm:flex-none sm:px-10">
                                {lang.submit}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ListTrailer;
