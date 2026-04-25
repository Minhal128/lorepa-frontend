import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';

// Defensive localStorage access
const getInitialLanguage = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem("lang");
    }
  } catch (e) {
    console.warn("localStorage is not available:", e);
  }
  return null;
};

// We can move your existing translations and future ones here
const resources = {
  en: {
    translation: {
      "payments": "Payments",
      "documents": "Documents",
      "fetch_error": "Failed to fetch data",
      "success": "Success",
      // Add more standard keys here
    }
  },
  fr: {
    translation: {
      "payments": "Paiements",
      "documents": "Documents",
      "fetch_error": "Échec de la récupération des données",
      "success": "Succès",
    }
  },
  es: {
    translation: {
      "payments": "Pagos",
      "documents": "Documentos",
      "fetch_error": "Error al obtener datos",
      "success": "Éxito",
    }
  },
  cn: {
    translation: {
      "payments": "付款",
      "documents": "文件",
      "fetch_error": "获取数据失败",
      "success": "成功",
    }
  }
};

i18n
  // .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    // default language from localstorage or fallback
    lng: getInitialLanguage() || "fr", 
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    debug: false // Ensure debug is off to avoid extra logs in production
  })
  .catch(err => {
    console.error("i18next failed to initialize:", err);
  });

export default i18n;


