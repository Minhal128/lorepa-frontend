import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

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

const calculatorPageTranslations = {
    en: {
        estimateIncome: "Estimate your rental income",
        yourTrailer: "Your Trailer",
        selectTrailer: "Select a trailer",
        fermee5x8x60: "Enclosed 5' x 8' x 60\"",
        enclosed5x8x72: "Enclosed 5' x 8' x 72\" ramp",
        enclosed5x10x72: "Enclosed 5' x 10' x 72\"",
        enclosed5x10x72ramp: "Enclosed 5' x 10' x 72\" ramp",
        enclosed6x12x72ramp: "Enclosed 6' x 12' x 72\" ramp",
        enclosed6x12dualAxle: "Enclosed 6' x 12' dual axle",
        enclosed7x14x78: "Enclosed 7' x 14' x 78\"",
        enclosed7x14x84ramp: "Enclosed 7' x 14' x 84\" ramp",
        enclosed7x16x78ramp: "Enclosed 7' x 16' x 78\" ramp",
        enclosed7x16x84ramp: "Enclosed 7' x 16' x 84\" ramp",
        enclosed8x20x78ramp: "Enclosed 8' x 20' x 78\" ramp",
        enclosed8x20x88ramp: "Enclosed 8' x 20' x 88\" ramp",
        enclosed8x24x78ramp: "Enclosed 8' x 24' x 78\" ramp",
        enclosed8x24x84ramp: "Enclosed 8' x 24' x 84\" ramp",
        ouverte4x8: "Open 4' x 8'",
        ouverte5x8: "Open 5' x 8'",
        ouverte5x10ramp: "Open 5' x 10' ramp",
        ouverte5x10tandem: "Open 5' x 10' tandem",
        ouverte5x10plato: "Open 5' x 10' plato-lift",
        ouverte6x12: "Open 6' x 12'",
        ouverte6x12rampeTandem: "Open 6' x 12' ramp tandem",
        plateforme6x20: "Flatbed 6' x 20'",
        plateforme7x14: "Flatbed 7' x 14'",
        plateforme8x16: "Flatbed 8' x 16'",
        plateforme8x18: "Flatbed 8' x 18'",
        plateforme8x20: "Flatbed 8' x 20'",
        plateforme8x24: "Flatbed 8'6 x 24'",
        dompeur5x10: "Dump 5' x 10'",
        dompeur6x12: "Dump 6' x 12'",
        dompeur7x14: "Dump 7' x 14'",
        gooseneck24: "Gooseneck 8'6 x 24' tilting",
        gooseneck30ramp: "Gooseneck 8'6 x 30' with ramp",
        perDay: "/day",
        daysRented: "Days rented",
        accessories: "Accessories",
        straps: "Straps",
        dolly: "Dolly",
        rentalIncome: "Rental income"
    },
    fr: {
        estimateIncome: "Estimez vos revenus de location",
        yourTrailer: "Votre Remorque",
        selectTrailer: "Sélectionnez une remorque",
        fermee5x8x60: "Remorque fermée 5' x 8' x 60\"",
        enclosed5x8x72: "Remorque fermée 5' x 8' x 72\" rampe",
        enclosed5x10x72: "Remorque fermée 5' x 10' x 72\"",
        enclosed5x10x72ramp: "Remorque fermée 5' x 10' x 72\" rampe",
        enclosed6x12x72ramp: "Remorque fermée 6' x 12' x 72\" rampe",
        enclosed6x12dualAxle: "Remorque fermée 6' x 12' double essieu",
        enclosed7x14x78: "Remorque fermée 7' x 14' x 78\"",
        enclosed7x14x84ramp: "Remorque fermée 7' x 14' x 84\" rampe",
        enclosed7x16x78ramp: "Remorque fermée 7' x 16' x 78\" rampe",
        enclosed7x16x84ramp: "Remorque fermée 7' x 16' x 84\" rampe",
        enclosed8x20x78ramp: "Remorque fermée 8' x 20' x 78\" rampe",
        enclosed8x20x88ramp: "Remorque fermée 8' x 20' x 88\" rampe",
        enclosed8x24x78ramp: "Remorque fermée 8' x 24' x 78\" rampe",
        enclosed8x24x84ramp: "Remorque fermée 8' x 24' x 84\" rampe",
        ouverte4x8: "Ouverte 4' x 8'",
        ouverte5x8: "Ouverte 5' x 8'",
        ouverte5x10ramp: "Ouverte 5' x 10' rampe",
        ouverte5x10tandem: "Ouverte 5' x 10' tandem",
        ouverte5x10plato: "Ouverte 5' x 10' plato-lift",
        ouverte6x12: "Ouverte 6' x 12'",
        ouverte6x12rampeTandem: "Ouverte 6' x 12' rampe tandem",
        plateforme6x20: "Plateforme 6' x 20'",
        plateforme7x14: "Plateforme 7' x 14'",
        plateforme8x16: "Plateforme 8' x 16'",
        plateforme8x18: "Plateforme 8' x 18'",
        plateforme8x20: "Plateforme 8' x 20'",
        plateforme8x24: "Plateforme 8'6 x 24'",
        dompeur5x10: "Dompeur 5' x 10'",
        dompeur6x12: "Dompeur 6' x 12'",
        dompeur7x14: "Dompeur 7' x 14'",
        gooseneck24: "Gooseneck 8'6 x 24' basculante",
        gooseneck30ramp: "Gooseneck 8'6 x 30' avec rampe",
        perDay: "/jour",
        daysRented: "Jours loués",
        accessories: "Accessoires",
        straps: "Sangles",
        dolly: "Diable",
        rentalIncome: "Revenus de location"
    },
    es: {
        estimateIncome: "Estima tus ingresos por alquiler",
        yourTrailer: "Tu Remolque",
        selectTrailer: "Selecciona un remolque",
        fermee5x8x60: "Remolque Cerrado 5' x 8' x 60\"",
        enclosed5x8x72: "Remolque Cerrado 5' x 8' x 72\" rampa",
        enclosed5x10x72: "Remolque Cerrado 5' x 10' x 72\"",
        enclosed5x10x72ramp: "Remolque Cerrado 5' x 10' x 72\" rampa",
        enclosed6x12x72ramp: "Remolque Cerrado 6' x 12' x 72\" rampa",
        enclosed6x12dualAxle: "Remolque Cerrado 6' x 12' doble eje",
        enclosed7x14x78: "Remolque Cerrado 7' x 14' x 78\"",
        enclosed7x14x84ramp: "Remolque Cerrado 7' x 14' x 84\" rampa",
        enclosed7x16x78ramp: "Remolque Cerrado 7' x 16' x 78\" rampa",
        enclosed7x16x84ramp: "Remolque Cerrado 7' x 16' x 84\" rampa",
        enclosed8x20x78ramp: "Remolque Cerrado 8' x 20' x 78\" rampa",
        enclosed8x20x88ramp: "Remolque Cerrado 8' x 20' x 88\" rampa",
        enclosed8x24x78ramp: "Remolque Cerrado 8' x 24' x 78\" rampa",
        enclosed8x24x84ramp: "Remolque Cerrado 8' x 24' x 84\" rampa",
        ouverte4x8: "Abierta 4' x 8'",
        ouverte5x8: "Abierta 5' x 8'",
        ouverte5x10ramp: "Abierta 5' x 10' rampa",
        ouverte5x10tandem: "Abierta 5' x 10' tándem",
        ouverte5x10plato: "Abierta 5' x 10' plato-lift",
        ouverte6x12: "Abierta 6' x 12'",
        ouverte6x12rampeTandem: "Abierta 6' x 12' rampa tándem",
        plateforme6x20: "Plataforma 6' x 20'",
        plateforme7x14: "Plataforma 7' x 14'",
        plateforme8x16: "Plataforma 8' x 16'",
        plateforme8x18: "Plataforma 8' x 18'",
        plateforme8x20: "Plataforma 8' x 20'",
        plateforme8x24: "Plataforma 8'6 x 24'",
        dompeur5x10: "Volquete 5' x 10'",
        dompeur6x12: "Volquete 6' x 12'",
        dompeur7x14: "Volquete 7' x 14'",
        gooseneck24: "Gooseneck 8'6 x 24' inclinable",
        gooseneck30ramp: "Gooseneck 8'6 x 30' con rampa",
        perDay: "/día",
        daysRented: "Días alquilados",
        accessories: "Accesorios",
        straps: "Correas",
        dolly: "Plataforma rodante",
        rentalIncome: "Ingresos por alquiler"
    },
    cn: {
        estimateIncome: "估算您的租赁收入",
        yourTrailer: "您的拖车",
        selectTrailer: "选择拖车",
        fermee5x8x60: "封闭式 5' x 8' x 60\"",
        enclosed5x8x72: "封闭式 5' x 8' x 72\" 坡道",
        enclosed5x10x72: "封闭式 5' x 10' x 72\"",
        enclosed5x10x72ramp: "封闭式 5' x 10' x 72\" 坡道",
        enclosed6x12x72ramp: "封闭式 6' x 12' x 72\" 坡道",
        enclosed6x12dualAxle: "封闭式 6' x 12' 双轴",
        enclosed7x14x78: "封闭式 7' x 14' x 78\"",
        enclosed7x14x84ramp: "封闭式 7' x 14' x 84\" 坡道",
        enclosed7x16x78ramp: "封闭式 7' x 16' x 78\" 坡道",
        enclosed7x16x84ramp: "封闭式 7' x 16' x 84\" 坡道",
        enclosed8x20x78ramp: "封闭式 8' x 20' x 78\" 坡道",
        enclosed8x20x88ramp: "封闭式 8' x 20' x 88\" 坡道",
        enclosed8x24x78ramp: "封闭式 8' x 24' x 78\" 坡道",
        enclosed8x24x84ramp: "封闭式 8' x 24' x 84\" 坡道",
        ouverte4x8: "开放 4' x 8'",
        ouverte5x8: "开放 5' x 8'",
        ouverte5x10ramp: "开放 5' x 10' 坡道",
        ouverte5x10tandem: "开放 5' x 10' 双轮",
        ouverte5x10plato: "开放 5' x 10' 平台提升",
        ouverte6x12: "开放 6' x 12'",
        ouverte6x12rampeTandem: "开放 6' x 12' 坡道双轮",
        plateforme6x20: "平板 6' x 20'",
        plateforme7x14: "平板 7' x 14'",
        plateforme8x16: "平板 8' x 16'",
        plateforme8x18: "平板 8' x 18'",
        plateforme8x20: "平板 8' x 20'",
        plateforme8x24: "平板 8'6 x 24'",
        dompeur5x10: "翻斗 5' x 10'",
        dompeur6x12: "翻斗 6' x 12'",
        dompeur7x14: "翻斗 7' x 14'",
        gooseneck24: "Gooseneck 8'6 x 24' 翻转",
        gooseneck30ramp: "Gooseneck 8'6 x 30' 带坡道",
        perDay: "/天",
        daysRented: "租赁天数",
        accessories: "配件",
        straps: "绑带",
        dolly: "手推车",
        rentalIncome: "租赁收入"
    }
};


const CalculatorPage = () => {
    const [selectedTrailer, setSelectedTrailer] = useState('');
    const [daysRented, setDaysRented] = useState(1);
    const [strapsSelected, setStrapsSelected] = useState(false);
    const [dollySelected, setDollySelected] = useState(false);

    const [trailerBaseValue, setTrailerBaseValue] = useState(0);
    const [accessoriesCost, setAccessoriesCost] = useState(0);
    const [rentalIncome, setRentalIncome] = useState(0);

    const [translations, setTranslations] = useState(() => {
        const storedLang = localStorage.getItem('lang');
        return calculatorPageTranslations[storedLang] || calculatorPageTranslations.fr;
    });

    // State and ref for custom select dropdown
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleStorageChange = () => {
            const storedLang = localStorage.getItem('lang');
            setTranslations(calculatorPageTranslations[storedLang] || calculatorPageTranslations.fr);
        };

        window.addEventListener('storage', handleStorageChange);

        handleStorageChange();

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const trailerOptions = [
        { id: "", name: "Select Trailer", dailyRate: 0, isDisabled: true, nameKey: "selectTrailer" },

        { id: "fermee-5x8x60", name: "Fermée 5' x 8' x 60\"", dailyRate: 40, nameKey: "fermee5x8x60" },
        { id: "fermee-5x8x72-rampe", name: "Fermée 5' x 8' x 72\" rampe", dailyRate: 45, nameKey: "enclosed5x8x72" },
        { id: "fermee-5x10x72", name: "Fermée 5' x 10' x 72\"", dailyRate: 50, nameKey: "enclosed5x10x72" },
        { id: "fermee-5x10x72-rampe", name: "Fermée 5' x 10' x 72\" rampe", dailyRate: 55, nameKey: "enclosed5x10x72ramp" },
        { id: "fermee-6x12x72-rampe", name: "Fermée 6' x 12' x 72\" rampe", dailyRate: 70, nameKey: "enclosed6x12x72ramp" },
        { id: "fermee-6x12-dual", name: "Fermée 6' x 12' essieu double", dailyRate: 80, nameKey: "enclosed6x12dualAxle" },
        { id: "fermee-7x14x78", name: "Fermée 7' x 14' x 78\"", dailyRate: 85, nameKey: "enclosed7x14x78" },
        { id: "fermee-7x14x84-rampe", name: "Fermée 7' x 14' x 84\" rampe", dailyRate: 90, nameKey: "enclosed7x14x84ramp" },
        { id: "fermee-7x16x78-rampe", name: "Fermée 7' x 16' x 78\" rampe", dailyRate: 95, nameKey: "enclosed7x16x78ramp" },
        { id: "fermee-7x16x84-rampe", name: "Fermée 7' x 16' x 84\" rampe", dailyRate: 100, nameKey: "enclosed7x16x84ramp" },
        { id: "fermee-8x20x78-rampe", name: "Fermée 8' x 20' x 78\" rampe", dailyRate: 110, nameKey: "enclosed8x20x78ramp" },
        { id: "fermee-8x20x88-rampe", name: "Fermée 8' x 20' x 88\" rampe", dailyRate: 115, nameKey: "enclosed8x20x88ramp" },
        { id: "fermee-8x24x78-rampe", name: "Fermée 8' x 24' x 78\" rampe", dailyRate: 125, nameKey: "enclosed8x24x78ramp" },
        { id: "fermee-8x24x84-rampe", name: "Fermée 8' x 24' x 84\" rampe", dailyRate: 130, nameKey: "enclosed8x24x84ramp" },

        { id: "ouverte-4x8", name: "Ouverte 4' x 8'", dailyRate: 40, nameKey: "ouverte4x8" },
        { id: "ouverte-5x8", name: "Ouverte 5' x 8'", dailyRate: 50, nameKey: "ouverte5x8" },
        { id: "ouverte-5x10-rampe", name: "Ouverte 5' x 10' rampe", dailyRate: 55, nameKey: "ouverte5x10ramp" },
        { id: "ouverte-5x10-tandem", name: "Ouverte 5' x 10' tandem", dailyRate: 60, nameKey: "ouverte5x10tandem" },
        { id: "ouverte-5x10-plato", name: "Ouverte 5' x 10' plato-lift", dailyRate: 70, nameKey: "ouverte5x10plato" },
        { id: "ouverte-6x12", name: "Ouverte 6' x 12'", dailyRate: 75, nameKey: "ouverte6x12" },
        { id: "ouverte-6x12-rampe-tandem", name: "Ouverte 6' x 12' rampe tandem", dailyRate: 80, nameKey: "ouverte6x12rampeTandem" },

        { id: "plateforme-6x20", name: "Plateforme 6' x 20'", dailyRate: 115, nameKey: "plateforme6x20" },
        { id: "plateforme-7x14", name: "Plateforme 7' x 14'", dailyRate: 80, nameKey: "plateforme7x14" },
        { id: "plateforme-8x16", name: "Plateforme 8' x 16'", dailyRate: 90, nameKey: "plateforme8x16" },
        { id: "plateforme-8x18", name: "Plateforme 8' x 18'", dailyRate: 100, nameKey: "plateforme8x18" },
        { id: "plateforme-8x20", name: "Plateforme 8' x 20'", dailyRate: 125, nameKey: "plateforme8x20" },
        { id: "plateforme-8x24", name: "Plateforme 8'6 x 24'", dailyRate: 140, nameKey: "plateforme8x24" },

        { id: "dompeur-5x10", name: "Dompeur 5' x 10'", dailyRate: 100, nameKey: "dompeur5x10" },
        { id: "dompeur-6x12", name: "Dompeur 6' x 12'", dailyRate: 110, nameKey: "dompeur6x12" },
        { id: "dompeur-7x14", name: "Dompeur 7' x 14'", dailyRate: 150, nameKey: "dompeur7x14" },

        { id: "gooseneck-24", name: "Gooseneck 8'6 x 24' basculante", dailyRate: 215, nameKey: "gooseneck24" },
        { id: "gooseneck-30-ramp", name: "Gooseneck 8'6 x 30' avec rampe", dailyRate: 230, nameKey: "gooseneck30ramp" },
    ];



    const ACCESSORY_STRAPS_COST = 10;
    const ACCESSORY_DOLLY_COST = 15;

    useEffect(() => {
        const trailer = trailerOptions.find(t => t.id === selectedTrailer);
        if (trailer) {
            setTrailerBaseValue(trailer.dailyRate);
        } else {
            setTrailerBaseValue(0);
        }
    }, [selectedTrailer, trailerOptions]);

    useEffect(() => {
        let currentAccessoriesCost = 0;
        if (strapsSelected) currentAccessoriesCost += ACCESSORY_STRAPS_COST;
        if (dollySelected) currentAccessoriesCost += ACCESSORY_DOLLY_COST;

        setAccessoriesCost(currentAccessoriesCost);

        let discount = 1;

        if (daysRented >= 7) {
            discount = 0.85;
        } else if (daysRented >= 5) {
            discount = 0.90;
        } else if (daysRented >= 3) {
            discount = 0.95;
        }

        const base = trailerBaseValue * daysRented;
        const finalValue = base * discount + currentAccessoriesCost;

        setRentalIncome(finalValue);
    }, [trailerBaseValue, daysRented, strapsSelected, dollySelected]);


    const handleSelectOption = (optionId) => {
        setSelectedTrailer(optionId);
        setIsDropdownOpen(false);
    };

    const selectedOptionText = selectedTrailer
        ? translations[trailerOptions.find(t => t.id === selectedTrailer)?.nameKey] || translations.selectTrailer
        : translations.selectTrailer;

    return (
        <div className='min-h-screen bg-[#F1F1F1] text-black flex flex-col'>
            <Navbar />

            <motion.div
                className='mobile-px flex-1 pb-10'
                initial='hidden'
                animate='visible'
                variants={fadeIn}
            >
                <motion.h1
                    className='text-2xl sm:text-3xl font-medium text-center mb-8 mt-10'
                    variants={fadeInUp}
                >
                    {translations.estimateIncome}
                </motion.h1>

                <motion.div
                    className='grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 bg-white p-5 sm:p-6 rounded-xl shadow-sm'
                    variants={fadeInUp}
                >
                    <div>
                        <label htmlFor='trailer-select' className='block mb-2 text-sm font-medium text-gray-700'>
                            {translations.yourTrailer}
                        </label>
                        <div className='relative' ref={dropdownRef}>
                            <div
                                className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer flex justify-between items-center transition-all hover:bg-gray-100'
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <span>{selectedOptionText}</span>
                                <svg
                                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='2'
                                        d='M19 9l-7 7-7-7'
                                    ></path>
                                </svg>
                            </div>
                            {isDropdownOpen && (
                                <div className='absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto'>
                                    {trailerOptions.map(option => (
                                        <div
                                            key={option.id}
                                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 
            ${option.isDisabled ? 'text-gray-400 cursor-not-allowed' : ''} 
            ${selectedTrailer === option.id ? 'bg-blue-100' : ''}`}
                                            onClick={() => !option.isDisabled && handleSelectOption(option.id)}
                                        >
                                            {translations[option.nameKey]} {option.dailyRate > 0 ? `($${option.dailyRate}${translations.perDay})` : ''}
                                        </div>
                                    ))}

                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor='days-rented-slider' className='block mb-2 text-sm font-medium text-gray-700'>
                            {translations.daysRented}
                        </label>
                        <div className='flex items-center space-x-4'>
                            <span className='text-gray-500 font-medium min-w-[2rem]'>{daysRented}</span>
                            <input
                                type='range'
                                id='days-rented-slider'
                                min='1'
                                max='30'
                                value={daysRented}
                                onChange={(e) => setDaysRented(parseInt(e.target.value))}
                                className='flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2563EB]'
                            />
                        </div>
                    </div>

                    <div className='col-span-1 md:col-span-2'>
                        <label className='block mb-2 text-sm font-medium text-gray-700'>{translations.accessories}</label>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <label className='flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer transition-colors hover:bg-gray-100'>
                                <input
                                    type='checkbox'
                                    className='form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500'
                                    checked={strapsSelected}
                                    onChange={(e) => setStrapsSelected(e.target.checked)}
                                />
                                <span className='ml-3 text-gray-700'>{translations.straps} (${ACCESSORY_STRAPS_COST})</span>
                            </label>
                            <label className='flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer transition-colors hover:bg-gray-100'>
                                <input
                                    type='checkbox'
                                    className='form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500'
                                    checked={dollySelected}
                                    onChange={(e) => setDollySelected(e.target.checked)}
                                />
                                <span className='ml-3 text-gray-700'>{translations.dolly} (${ACCESSORY_DOLLY_COST})</span>
                            </label>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className='mt-6 space-y-4 bg-white p-5 sm:p-6 rounded-xl shadow-sm'
                    variants={fadeInUp}
                >
                    <div className='flex justify-between items-center text-base sm:text-lg'>
                        <span className='text-gray-600'>{translations.yourTrailer} <span className='text-xs sm:text-sm'>({translations.perDay} rate)</span></span>
                        <span className='font-semibold'>${trailerBaseValue}.00</span>
                    </div>
                    <div className='flex justify-between items-center text-base sm:text-lg'>
                        <span className='text-gray-600'>{translations.daysRented}</span>
                        <span className='font-semibold'>{daysRented}</span>
                    </div>
                    <div className='flex justify-between items-center text-base sm:text-lg'>
                        <span className='text-gray-600'>{translations.accessories}</span>
                        <span className='font-semibold'>${accessoriesCost}.00</span>
                    </div>
                    <div className='flex justify-between items-center text-xl sm:text-2xl font-bold pt-4 border-t border-gray-100'>
                        <span className='text-gray-800'>{translations.rentalIncome}</span>
                        <span className='text-blue-600'>${rentalIncome}.00</span>
                    </div>
                </motion.div>
            </motion.div>

            <motion.div
                variants={fadeIn}
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true, amount: 0.2 }}
            >
                <Footer />
            </motion.div>
        </div>
    );
};

export default CalculatorPage;