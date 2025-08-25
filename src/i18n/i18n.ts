import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ptBR from './translations/pt-BR.json'
import en from './translations/en.json'
import es from './translations/es.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: ptBR },
      en: { translation: en },
      es: { translation: es }
    },
    fallbackLng: "pt",
    interpolation: { escapeValue: false },
    detection: {
      order: ['navigator', 'htmlTag', 'cookie', 'localStorage', 'sessionStorage', 'querystring', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;