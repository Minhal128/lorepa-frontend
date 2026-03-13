import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

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
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    // default language from localstorage or fallback
    lng: localStorage.getItem("lang") || "fr", 
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
